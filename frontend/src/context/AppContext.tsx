'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { DEMO_USERS } from '@/services/mockApi';
import { TranslationDictionary, translations } from '@/services/translations';
import { DemoUser, FontScale, Language, UserRole } from '@/types';

interface AppContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: TranslationDictionary;
  fontSize: FontScale;
  setFontSize: (scale: FontScale) => void;
  highContrast: boolean;
  setHighContrast: (enabled: boolean) => void;
  role: UserRole;
  setRole: (role: UserRole) => void;
  currentUser: DemoUser;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('bn');
  const fontSize: FontScale = 'md';
  const [highContrast, setHighContrastState] = useState<boolean>(false);
  const [role, setRoleState] = useState<UserRole>('citizen');

  useEffect(() => {
    queueMicrotask(() => {
      try {
        const savedLang = window.localStorage.getItem('dscc_lang') as Language | null;
        const savedContrast = window.localStorage.getItem('dscc_contrast');
        const savedRole = window.localStorage.getItem('dscc_role') as UserRole | null;
        if (savedLang === 'en' || savedLang === 'bn') setLanguageState(savedLang);
        if (savedContrast === 'true') setHighContrastState(true);
        if (savedRole && savedRole in DEMO_USERS) setRoleState(savedRole);
      } catch {
        // Ignore storage access errors
      }
    });
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.lang = language === 'bn' ? 'bn' : 'en';
    if (language === 'bn') {
      root.classList.add('lang-bn');
      root.classList.remove('lang-en');
    } else {
      root.classList.add('lang-en');
      root.classList.remove('lang-bn');
    }
    root.classList.remove('font-scale-sm', 'font-scale-md', 'font-scale-lg');
    root.classList.add('font-scale-md');
    if (highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
  }, [language, highContrast]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      window.localStorage.setItem('dscc_lang', lang);
    } catch {
      // ignore
    }
  };

  const setFontSize = () => {
    // Font size locked to default 'A' (md)
  };

  const setHighContrast = (enabled: boolean) => {
    setHighContrastState(enabled);
    try {
      window.localStorage.setItem('dscc_contrast', String(enabled));
    } catch {
      // ignore
    }
  };

  const setRole = (nextRole: UserRole) => {
    setRoleState(nextRole);
    try {
      window.localStorage.setItem('dscc_role', nextRole);
    } catch {
      // ignore
    }
  };

  const value: AppContextValue = {
    language,
    setLanguage,
    t: translations[language],
    fontSize,
    setFontSize,
    highContrast,
    setHighContrast,
    role,
    setRole,
    currentUser: DEMO_USERS[role],
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useApp must be used inside AppProvider');
  }
  return ctx;
}
