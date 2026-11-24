'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { usePathname } from 'next/navigation';
import type { Language } from '@/types';
import { CivicPreloader } from '@/components/common/CivicPreloader';
import { useApp } from '@/context/AppContext';

export type PreloaderPortal = 'home' | 'citizen' | 'admin' | 'logout';
type LoginPortal = Exclude<PreloaderPortal, 'home'>;

interface ActivePreloader {
  id: number;
  portal: PreloaderPortal;
  duration: number;
  exiting: boolean;
}

interface PreloaderContextValue {
  showPreloader: (portal: LoginPortal) => void;
}

const PreloaderContext = createContext<PreloaderContextValue | null>(null);

export function PreloaderProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { language } = useApp();
  const [active, setActive] = useState<ActivePreloader | null>(null);
  const [progress, setProgress] = useState(0);
  const [showSkip, setShowSkip] = useState(false);
  const nextId = useRef(0);
  const introSeen = useRef(false);

  const activatePreloader = useCallback(
    (portal: PreloaderPortal, duration: number) => {
      nextId.current += 1;
      setProgress(0);
      setShowSkip(false);
      setActive({ id: nextId.current, portal, duration, exiting: false });
    },
    []
  );

  const showPreloader = useCallback(
    (portal: LoginPortal) => {
      if (portal === 'logout') {
        introSeen.current = true;
        try {
          window.sessionStorage.setItem('dscc_intro_seen', 'true');
        } catch (error) {
          console.error('Unable to mark the homepage intro as seen during logout.', error);
        }
      }
      activatePreloader(portal, 2000);
    },
    [activatePreloader]
  );

  useEffect(() => {
    if (pathname !== '/' || introSeen.current) return;

    try {
      if (window.sessionStorage.getItem('dscc_intro_seen') === 'true') {
        introSeen.current = true;
        return;
      }
      window.sessionStorage.setItem('dscc_intro_seen', 'true');
      introSeen.current = true;
    } catch (error) {
      console.error('Unable to access session storage for the homepage intro.', error);
      return;
    }

    queueMicrotask(() => activatePreloader('home', 5000));
  }, [activatePreloader, pathname]);

  useEffect(() => {
    if (!active || active.exiting) return;

    const startedAt = window.performance.now();
    const intervalId = window.setInterval(() => {
      const elapsed = window.performance.now() - startedAt;
      const nextProgress = Math.min((elapsed / active.duration) * 100, 100);
      setProgress(nextProgress);
      if (nextProgress >= 100) {
        setActive((current) =>
          current?.id === active.id ? { ...current, exiting: true } : current
        );
      }
    }, 50);

    return () => window.clearInterval(intervalId);
  }, [active]);

  useEffect(() => {
    if (!active || active.portal !== 'home' || active.exiting) return;

    const timeoutId = window.setTimeout(() => setShowSkip(true), 1500);
    return () => window.clearTimeout(timeoutId);
  }, [active]);

  useEffect(() => {
    if (!active?.exiting) return;

    const timeoutId = window.setTimeout(() => {
      setActive((current) => (current?.id === active.id ? null : current));
    }, 500);
    return () => window.clearTimeout(timeoutId);
  }, [active]);

  useEffect(() => {
    if (!active) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [active]);

  const handleSkip = useCallback(() => {
    setActive((current) => (current ? { ...current, exiting: true } : current));
  }, []);

  return (
    <PreloaderContext.Provider value={{ showPreloader }}>
      {children}
      {active && (
        <CivicPreloader
          key={active.id}
          portal={active.portal}
          language={language}
          progress={progress}
          showSkip={showSkip}
          exiting={active.exiting}
          onSkip={handleSkip}
        />
      )}
    </PreloaderContext.Provider>
  );
}

export function usePreloader() {
  const context = useContext(PreloaderContext);
  if (!context) {
    throw new Error('usePreloader must be used inside PreloaderProvider');
  }
  return context;
}
