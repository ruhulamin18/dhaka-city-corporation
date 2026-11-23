'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
  Building2,
  ChevronRight,
  LayoutDashboard,
  LogOut,
  ShieldCheck,
  User,
} from 'lucide-react';
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
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const dashboardHref = user ? getDashboardPath(user.role) : '/login';
  const roleBadge = user ? ROLE_BADGE_MAP[user.role] : null;

  // Click-outside listener
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  // ==========================================
  // MOBILE VARIANT (Inside Drawer)
  // ==========================================
  if (variant === 'mobile') {
    if (isAuthenticated && user && roleBadge) {
      return (
        <div className="space-y-2.5">
          <div className="px-3.5 py-2.5 bg-[#ECFDF5] border border-emerald-200 rounded-xl flex items-center justify-between gap-2 shadow-2xs">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-[#006A4E] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                {(user.nameEn || user.nameBn || 'U').charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-[#111827] truncate">
                  {language === 'bn' ? user.nameBn : user.nameEn}
                </p>
                <p className="text-[10px] text-[#4B5563] truncate">
                  {user.email || user.phone}
                </p>
              </div>
            </div>
            <span
              className={`px-2 py-0.5 text-[10px] font-semibold rounded-full border shrink-0 ${roleBadge.style}`}
            >
              {language === 'bn' ? roleBadge.bn : roleBadge.en}
            </span>
          </div>
          <Link
            href={dashboardHref}
            onClick={onNavigate}
            className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#006A4E] hover:bg-[#00523C] transition-colors shadow-2xs focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#006A4E]"
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
            className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl text-sm font-semibold text-[#C81E1E] bg-[#FEF2F2] hover:bg-red-100 border border-red-200 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C81E1E]"
          >
            <LogOut className="w-4 h-4" aria-hidden="true" />
            <span>{language === 'bn' ? 'লগআউট' : 'Logout'}</span>
          </button>
        </div>
      );
    }

    return (
      <div className="space-y-2">
        <p className="text-[11px] font-bold text-[#4B5563] uppercase tracking-wider px-1">
          {language === 'bn' ? 'পোর্টাল নির্বাচন করুন' : 'Select Portal'}
        </p>
        <div className="grid grid-cols-1 gap-2">
          {/* Citizen Portal Mobile Link */}
          <Link
            href="/login"
            onClick={onNavigate}
            className="flex items-center justify-between p-3 rounded-xl border border-emerald-200 bg-[#ECFDF5]/70 hover:bg-[#ECFDF5] transition-all shadow-2xs group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#006A4E] text-white flex items-center justify-center shrink-0 shadow-2xs">
                <User className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-[#006A4E] group-hover:text-[#00523C]">
                  {language === 'bn' ? 'নাগরিক পোর্টাল' : 'Citizen Portal'}
                </div>
                <div className="text-[11px] text-[#4B5563]">
                  {language === 'bn' ? 'নাগরিক সেবা ও ট্যাক্স' : 'Citizen Services & Tax'}
                </div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#006A4E] group-hover:translate-x-0.5 transition-transform" />
          </Link>

          {/* Admin Portal Mobile Link */}
          <Link
            href="/admin/login"
            onClick={onNavigate}
            className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-all shadow-2xs group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-2xs">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-[#111827] group-hover:text-[#006A4E]">
                  {language === 'bn' ? 'অ্যাডমিন পোর্টাল' : 'Admin Portal'}
                </div>
                <div className="text-[11px] text-[#4B5563]">
                  {language === 'bn' ? 'অফিশিয়াল ও কমান্ড' : 'Official Command & Oversight'}
                </div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    );
  }

  // ==========================================
  // DESKTOP VARIANT (Circular Profile Menu)
  // ==========================================
  return (
    <div className="relative" ref={menuRef}>
      {/* Profile / Avatar Trigger Button */}
      {isAuthenticated && user && roleBadge ? (
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="w-10 h-10 rounded-full border-2 border-[#006A4E] bg-[#ECFDF5] text-[#006A4E] hover:ring-3 hover:ring-emerald-100 flex items-center justify-center font-bold text-sm shadow-xs transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-[#006A4E]"
          aria-expanded={isOpen}
          aria-haspopup="true"
          aria-label={
            language === 'bn'
              ? `${user.nameBn || user.nameEn} এর প্রোফাইল মেনু`
              : `Profile menu for ${user.nameEn || user.nameBn}`
          }
          title={language === 'bn' ? 'প্রোফাইল মেনু' : 'Profile Menu'}
        >
          {(user.nameEn || user.nameBn || 'U').charAt(0).toUpperCase()}
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className={`w-10 h-10 rounded-full border border-[#CBD5E1] bg-slate-50 hover:bg-[#ECFDF5] hover:border-[#006A4E] text-[#111827] hover:text-[#006A4E] flex items-center justify-center shadow-2xs transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-[#006A4E] ${
            isOpen ? 'ring-2 ring-emerald-200 border-[#006A4E] bg-[#ECFDF5] text-[#006A4E]' : ''
          }`}
          aria-expanded={isOpen}
          aria-haspopup="true"
          aria-label={
            language === 'bn'
              ? 'লগইন ও পোর্টাল নির্বাচন মেনু'
              : 'Login & Portal selection menu'
          }
          title={language === 'bn' ? 'লগইন মেনু' : 'Login Menu'}
        >
          <User className="w-5 h-5 text-current transition-colors" />
        </button>
      )}

      {/* Floating Animated Dropdown Menu */}
      {isOpen && (
        <div
          role="menu"
          aria-orientation="vertical"
          className="absolute right-0 top-full mt-2 w-76 sm:w-80 bg-white rounded-2xl border border-slate-200 shadow-xl p-2.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150 origin-top-right focus:outline-none"
        >
          {isAuthenticated && user && roleBadge ? (
            /* Authenticated Dropdown Body */
            <div className="space-y-2">
              <div className="px-3 py-2.5 bg-slate-50 border border-slate-200/80 rounded-xl">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-[#111827] truncate">
                    {language === 'bn' ? user.nameBn : user.nameEn}
                  </span>
                  <span
                    className={`px-2 py-0.5 text-[10px] font-semibold rounded-full border shrink-0 ${roleBadge.style}`}
                  >
                    {language === 'bn' ? roleBadge.bn : roleBadge.en}
                  </span>
                </div>
                <p className="text-[11px] text-[#4B5563] truncate mt-0.5">
                  {user.email || user.phone}
                </p>
              </div>

              <Link
                href={dashboardHref}
                onClick={() => {
                  setIsOpen(false);
                  onNavigate?.();
                }}
                className="flex items-center gap-3 w-full p-2.5 rounded-xl text-xs font-bold text-white bg-[#006A4E] hover:bg-[#00523C] transition-colors shadow-2xs"
              >
                <LayoutDashboard className="w-4 h-4 shrink-0" />
                <span className="truncate">
                  {language === 'bn' ? 'আমার ড্যাশবোর্ডে যান' : 'Go to My Dashboard'}
                </span>
              </Link>

              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onNavigate?.();
                  logout();
                }}
                className="flex items-center gap-3 w-full p-2.5 rounded-xl text-xs font-semibold text-[#C81E1E] hover:bg-[#FEF2F2] border border-transparent hover:border-red-200 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4 shrink-0" />
                <span>{language === 'bn' ? 'লগআউট করুন' : 'Log Out'}</span>
              </button>
            </div>
          ) : (
            /* Unauthenticated: Portal Chooser */
            <div className="space-y-1.5">
              <div className="px-3 pt-1 pb-1.5 border-b border-slate-100">
                <p className="text-[11px] font-bold text-[#4B5563] uppercase tracking-wider">
                  {language === 'bn' ? 'পোর্টাল নির্বাচন করুন' : 'Select Portal'}
                </p>
                <p className="text-[11px] text-slate-500">
                  {language === 'bn'
                    ? 'আপনার প্রয়োজন অনুযায়ী পোর্টালে প্রবেশ করুন'
                    : 'Choose your desired portal to sign in'}
                </p>
              </div>

              {/* Citizen Portal Card Option */}
              <Link
                href="/login"
                onClick={() => {
                  setIsOpen(false);
                  onNavigate?.();
                }}
                className="flex items-start gap-3 p-3 rounded-xl border border-transparent hover:border-emerald-200 bg-slate-50/70 hover:bg-[#ECFDF5] transition-all group cursor-pointer"
              >
                <div className="w-9 h-9 rounded-xl bg-[#006A4E] text-white flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform mt-0.5">
                  <User className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#111827] group-hover:text-[#006A4E] transition-colors">
                      {language === 'bn' ? 'নাগরিক পোর্টাল' : 'Citizen Portal'}
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#006A4E] group-hover:translate-x-0.5 transition-all" />
                  </div>
                  <p className="text-[11px] text-[#4B5563] mt-0.5 leading-snug">
                    {language === 'bn'
                      ? 'নাগরিক সেবা, হোল্ডিং ট্যাক্স ও আবেদন'
                      : 'Citizen services, tax payments & applications'}
                  </p>
                </div>
              </Link>

              {/* Admin Portal Card Option */}
              <Link
                href="/admin/login"
                onClick={() => {
                  setIsOpen(false);
                  onNavigate?.();
                }}
                className="flex items-start gap-3 p-3 rounded-xl border border-transparent hover:border-slate-300 bg-slate-50/70 hover:bg-slate-100 transition-all group cursor-pointer"
              >
                <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform mt-0.5">
                  <Building2 className="w-5 h-5 text-emerald-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#111827] group-hover:text-[#006A4E] transition-colors">
                      {language === 'bn' ? 'অ্যাডমিন পোর্টাল' : 'Admin Portal'}
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-900 group-hover:translate-x-0.5 transition-all" />
                  </div>
                  <p className="text-[11px] text-[#4B5563] mt-0.5 leading-snug">
                    {language === 'bn'
                      ? 'ওয়ার্ড, বিভাগীয় ও নির্বাহী কমান্ড'
                      : 'Ward, departmental & mayor command'}
                  </p>
                </div>
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
