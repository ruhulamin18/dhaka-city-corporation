'use client';

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { APIProvider } from '@vis.gl/react-google-maps';

interface GoogleMapsContextValue {
  apiKey: string;
  isLoadingKey: boolean;
  quotaExceeded: boolean;
  setCustomApiKey: (key: string) => void;
}

const GoogleMapsContext = createContext<GoogleMapsContextValue>({
  apiKey: '',
  isLoadingKey: true,
  quotaExceeded: false,
  setCustomApiKey: () => {},
});

declare global {
  interface Window {
    gm_authFailure?: () => void;
    __gmpQuotaListenerAttached?: boolean;
  }
}

// Tier 1 global listeners for Google Maps Platform Demo Key quota & auth failures
function installQuotaListeners() {
  if (typeof window === 'undefined' || window.__gmpQuotaListenerAttached) return;
  window.__gmpQuotaListenerAttached = true;

  window.gm_authFailure = () => {
    window.dispatchEvent(new CustomEvent('gmp-quota-exceeded'));
  };

  const origError = console.error;
  console.error = (...args: unknown[]) => {
    origError.apply(console, args);
    const msg = args.map((a) => String(a)).join(' ');
    if (msg.includes('OverQuotaMapError') || msg.includes('QuotaExceededError')) {
      window.dispatchEvent(new CustomEvent('gmp-quota-exceeded'));
    }
  };
}

const BUILD_TIME_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';

function getStoredOrInitialKey(resolvedInitial: string): string {
  if (resolvedInitial) return resolvedInitial;
  if (typeof window !== 'undefined') {
    try {
      return window.localStorage.getItem('dscc_google_maps_api_key') || '';
    } catch {
      return '';
    }
  }
  return '';
}

export function GoogleMapsProvider({
  initialApiKey = '',
  children,
}: {
  initialApiKey?: string;
  children: React.ReactNode;
}) {
  const resolvedInitial = initialApiKey || BUILD_TIME_KEY;

  const [apiKey, setApiKey] = useState<string>(() => getStoredOrInitialKey(resolvedInitial));
  const [isLoadingKey, setIsLoadingKey] = useState<boolean>(() => !getStoredOrInitialKey(resolvedInitial));
  const [quotaExceeded, setQuotaExceeded] = useState<boolean>(false);

  // Allow setting or clearing custom key at runtime via UI modal
  const setCustomApiKey = useCallback((newKey: string) => {
    const trimmed = newKey.trim();
    setApiKey(trimmed);
    setQuotaExceeded(false);
    if (typeof window !== 'undefined') {
      try {
        if (trimmed) {
          window.localStorage.setItem('dscc_google_maps_api_key', trimmed);
        } else {
          window.localStorage.removeItem('dscc_google_maps_api_key');
        }
      } catch {
        // localStorage unavailable
      }
    }
  }, []);

  useEffect(() => {
    installQuotaListeners();
    const handleQuota = () => setQuotaExceeded(true);
    window.addEventListener('gmp-quota-exceeded', handleQuota);
    return () => {
      window.removeEventListener('gmp-quota-exceeded', handleQuota);
    };
  }, []);

  // Async fetch from /api/maps-config only if neither initial nor localStorage key was found
  useEffect(() => {
    if (apiKey || resolvedInitial) return;
    let active = true;
    fetch('/api/maps-config', { cache: 'no-store' })
      .then((res) => (res.ok ? res.json() : { apiKey: '' }))
      .then((data: { apiKey?: string }) => {
        if (!active) return;
        if (data.apiKey) {
          setApiKey(data.apiKey);
        }
        setIsLoadingKey(false);
      })
      .catch(() => {
        if (!active) return;
        setIsLoadingKey(false);
      });
    return () => {
      active = false;
    };
  }, [apiKey, resolvedInitial]);

  const quotaBanner = quotaExceeded ? (
    <div className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-2.5 text-xs md:text-sm text-center sticky top-0 z-50 shadow-sm">
      <span>
        Google Maps Platform quota reached. If you are the app owner, visit{' '}
        <a
          href="https://developers.google.com/maps/ai/ai-studio?utm_campaign=gmp_mcp_codeassist_v1_aistudio#quota_exceeded_errors"
          target="_blank"
          rel="noopener noreferrer"
          className="underline font-semibold text-amber-950 hover:text-amber-800"
        >
          maps developer site
        </a>{' '}
        for instructions to update your account.
      </span>
    </div>
  ) : null;

  const ctxValue: GoogleMapsContextValue = {
    apiKey,
    isLoadingKey,
    quotaExceeded,
    setCustomApiKey,
  };

  if (!apiKey) {
    return (
      <GoogleMapsContext.Provider value={ctxValue}>
        {quotaBanner}
        {children}
      </GoogleMapsContext.Provider>
    );
  }

  return (
    <GoogleMapsContext.Provider value={ctxValue}>
      {quotaBanner}
      <APIProvider apiKey={apiKey} libraries={['marker']} region="BD">
        {children}
      </APIProvider>
    </GoogleMapsContext.Provider>
  );
}

export function useGoogleMapsContext() {
  return useContext(GoogleMapsContext);
}
