'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getDashboardPathForRole, mockApi } from '@/services/mockApi';
import { usePreloader } from '@/context/PreloaderContext';
import {
  AuthResponse,
  AuthRole,
  AuthUser,
  CitizenRegistrationPayload,
  OfficialRole,
} from '@/types';

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
  loginCitizen: (phone: string, password: string) => Promise<AuthResponse>;
  loginOfficial: (
    identifier: string,
    password: string,
    role: OfficialRole
  ) => Promise<AuthResponse>;
  registerCitizen: (payload: CitizenRegistrationPayload) => Promise<AuthResponse>;
  updateCitizenAccount: (
    profile: Pick<AuthUser, 'nameEn' | 'nameBn' | 'phone' | 'email' | 'wardNumber'>
  ) => Promise<boolean>;
  logout: () => void;
  getDashboardPath: (role?: AuthRole) => string;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { showPreloader } = usePreloader();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    queueMicrotask(() => {
      const stored = mockApi.getStoredSession();
      if (stored) {
        setUser(stored);
      }
      setIsInitialized(true);
    });
  }, []);

  const loginCitizen = async (phone: string, password: string): Promise<AuthResponse> => {
    const res = await mockApi.loginCitizen(phone, password);
    if (res.success && res.user) {
      setUser(res.user);
    }
    return res;
  };

  const loginOfficial = async (
    identifier: string,
    password: string,
    role: OfficialRole
  ): Promise<AuthResponse> => {
    const res = await mockApi.loginOfficial(identifier, password, role);
    if (res.success && res.user) {
      setUser(res.user);
    }
    return res;
  };

  const registerCitizen = async (
    payload: CitizenRegistrationPayload
  ): Promise<AuthResponse> => {
    const res = await mockApi.registerCitizen(payload);
    if (res.success && res.user) {
      setUser(res.user);
    }
    return res;
  };

  const updateCitizenAccount = async (
    profile: Pick<AuthUser, 'nameEn' | 'nameBn' | 'phone' | 'email' | 'wardNumber'>
  ): Promise<boolean> => {
    if (!user || user.role !== 'citizen') return false;
    const updated = await mockApi.updateCitizenAccount(user.id, profile);
    if (!updated) return false;
    setUser(updated);
    return true;
  };

  const logout = () => {
    showPreloader('logout');
    mockApi.clearSession();
    setUser(null);
    router.push('/');
  };

  const getDashboardPath = (role?: AuthRole) => {
    return getDashboardPathForRole(role ?? user?.role ?? 'citizen');
  };

  const value: AuthContextValue = {
    user,
    isAuthenticated: Boolean(user),
    isInitialized,
    loginCitizen,
    loginOfficial,
    registerCitizen,
    updateCitizenAccount,
    logout,
    getDashboardPath,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return ctx;
}
