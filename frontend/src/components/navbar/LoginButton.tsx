'use client';

import React from 'react';
import Link from 'next/link';
import { LayoutDashboard, LogOut, User } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
import { AuthRole } from '@/types';

const ROLE_BADGE_MAP: Record<
  AuthRole,
  { en: string; bn: string; style: string }
> = {
  citizen: {
    en: 'Citizen',
    bn: 'নাগরিক',
    style: 'bg-[#ECFDF5] text-[#006A4E] border-emerald-200',
  },
  admin: {
    en: 'Admin',
    bn: 'অ্যাডমিন',
    style: 'bg-[#FEF2F2] text-[#C81E1E] border-red-200',
  },
  officer: {
    en: 'Officer',
    bn: 'কর্মকর্তা',
    style: 'bg-amber-50 text-amber-800 border-amber-200',
  },
  staff: {
    en: 'Field Staff',
    bn: 'মাঠকর্মী',
    style: 'bg-[#ECFDF5] text-[#00523C] border-emerald-200',
  },
};

interface LoginButtonProps {
  variant?: 'desktop' | 'mobile';
  onNavigate?: () => void;
}

export function LoginButton({
  variant = 'desktop',
  onNavigate,
}: LoginButtonProps) {
  const { language } = useApp();
  const { user, isAuthenticated, logout, getDashboardPath } = useAuth();

  const dashboardHref = user ? getDashboardPath(user.role) : '/login';
  const roleBadge = user ? ROLE_BADGE_MAP[user.role] : null;

  if (variant === 'mobile') {
    if (isAuthenticated && user && roleBadge) {
      return (
        <div className="space-y-2.5">
          <div className="px-3 py-2.5 bg-[#ECFDF5] border border-emerald-200 rounded-lg flex items-center justify-between gap-2">
            <span className="text-xs font-bold text-[#111827] truncate">
              {language === 'bn' ? user.nameBn : user.nameEn}
            </span>
            <span
              className={`px-2 py-0.5 text-[11px] font-semibold rounded border shrink-0 ${roleBadge.style}`}
            >
              {language === 'bn' ? roleBadge.bn : roleBadge.en}
            </span>
          </div>
          <Link
            href={dashboardHref}
            onClick={onNavigate}
            className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-lg text-sm font-semibold text-white bg-[#006A4E] hover:bg-[#00523C] transition-colors shadow-xs focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#006A4E]"
          >
            <LayoutDashboard className="w-4 h-4" aria-hidden="true" />
            <span>{language === 'bn' ? 'আমার ড্যাশবোর্ড' : 'My Dashboard'}</span>
          </Link>
          <button
            type="button"
            onClick={() => {
              onNavigate?.();
              logout();
            }}
            className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-lg text-sm font-semibold text-[#C81E1E] bg-[#FEF2F2] hover:bg-red-100 border border-red-200 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C81E1E]"
          >
            <LogOut className="w-4 h-4" aria-hidden="true" />
            <span>{language === 'bn' ? 'লগআউট' : 'Logout'}</span>
          </button>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 gap-2">
        <Link
          href="/login"
          onClick={onNavigate}
          className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-lg text-sm font-bold text-white bg-[#006A4E] hover:bg-[#00523C] transition-colors shadow-xs focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#006A4E]"
        >
          <User className="w-4 h-4" aria-hidden="true" />
          <span>{language === 'bn' ? 'লগইন / নাগরিক পোর্টাল' : 'Login / Citizen Portal'}</span>
        </Link>
      </div>
    );
  }

  // Desktop / Tablet variant
  if (isAuthenticated && user && roleBadge) {
    return (
      <div className="hidden sm:flex items-center gap-2">
        <div className="hidden 2xl:flex items-center gap-1.5 pr-1">
          <span className="text-xs font-semibold text-[#111827] max-w-[110px] truncate">
            {language === 'bn' ? user.nameBn : user.nameEn}
          </span>
          <span
            className={`px-1.5 py-0.5 text-[10px] font-semibold rounded border whitespace-nowrap ${roleBadge.style}`}
          >
            {language === 'bn' ? roleBadge.bn : roleBadge.en}
          </span>
        </div>

        <Link
          href={dashboardHref}
          className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-[#006A4E] hover:bg-[#00523C] rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-xs focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#006A4E]"
        >
          <LayoutDashboard className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
          <span>{language === 'bn' ? 'ড্যাশবোর্ড' : 'Dashboard'}</span>
        </Link>

        <button
          type="button"
          onClick={logout}
          title={language === 'bn' ? 'লগআউট' : 'Logout'}
          aria-label={language === 'bn' ? 'লগআউট' : 'Logout'}
          className="inline-flex items-center justify-center p-2 text-[#4B5563] bg-slate-50 hover:bg-[#FEF2F2] hover:text-[#C81E1E] border border-[#E2E8F0] hover:border-red-200 rounded-lg transition-colors shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C81E1E]"
        >
          <LogOut className="w-3.5 h-3.5" aria-hidden="true" />
        </button>
      </div>
    );
  }

  return (
    <Link
      href="/login"
      className="hidden sm:inline-flex items-center gap-1.5 px-3 xl:px-4 py-2 text-xs xl:text-sm font-bold text-white bg-[#006A4E] hover:bg-[#00523C] rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-xs focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#006A4E]"
    >
      <User className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
      <span>
        {language === 'bn' ? 'লগইন / নাগরিক পোর্টাল' : 'Login / Citizen Portal'}
      </span>
    </Link>
  );
}
