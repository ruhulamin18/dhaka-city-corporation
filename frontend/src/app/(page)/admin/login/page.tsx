'use client';

import React, { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  AlertCircle,
  ArrowRight,
  Building2,
  CheckCircle2,
  ChevronDown,
  Eye,
  EyeOff,
  Landmark,
  ShieldCheck,
  User,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
import { usePreloader } from '@/context/PreloaderContext';
import { DEMO_CREDENTIALS, getDashboardPathForRole } from '@/services/mockApi';
import { AuthRole, OfficialRole } from '@/types';
import { SecurityCodeField } from '@/components/SecurityCodeField';

type AdminTabRole = Extract<
  (typeof DEMO_CREDENTIALS)[number]['group'],
  'admin' | 'ward_officer' | 'dept_officer'
>;

interface OfficialProfilePreset {
  id: string;
  key: AdminTabRole;
  role: OfficialRole;
  identifier: string;
  password: string;
  labelBn: string;
  labelEn: string;
  subBn: string;
  subEn: string;
  badgeBn: string;
  badgeEn: string;
}

const OFFICIAL_PROFILES: OfficialProfilePreset[] = DEMO_CREDENTIALS.flatMap(
  (credential): OfficialProfilePreset[] => {
    if (credential.group === 'citizen') return [];

    const badge =
      credential.group === 'admin'
        ? { bn: 'সুপার অ্যাডমিন', en: 'Super Admin' }
        : credential.group === 'ward_officer'
          ? { bn: 'ওয়ার্ড কর্মকর্তা', en: 'Ward Officer' }
          : { bn: 'বিভাগীয় কর্মকর্তা', en: 'Dept Officer' };

    return [
      {
        id: credential.id,
        key: credential.group,
        role: credential.group === 'admin' ? 'admin' : 'officer',
        identifier: credential.identifier,
        password: credential.password,
        labelBn: credential.labelBn,
        labelEn: credential.labelEn,
        subBn: credential.noteBn,
        subEn: credential.noteEn,
        badgeBn: badge.bn,
        badgeEn: badge.en,
      },
    ];
  }
).sort((first, second) => {
  const groupOrder: Record<AdminTabRole, number> = {
    admin: 0,
    ward_officer: 1,
    dept_officer: 2,
  };
  return groupOrder[first.key] - groupOrder[second.key];
});

function isRedirectAllowedForRole(redirectPath: string, role: AuthRole): boolean {
  if (!redirectPath.startsWith('/') || redirectPath.startsWith('//')) return false;
  if (redirectPath.startsWith('/admin') || redirectPath.startsWith('/dashboard/admin')) return role === 'admin' || role === 'officer';
  if (redirectPath.startsWith('/citizen') || redirectPath.startsWith('/dashboard/citizen')) return role === 'citizen';
  if (redirectPath.startsWith('/dashboard/officer')) return role === 'officer' || role === 'admin';
  if (redirectPath.startsWith('/dashboard/staff')) return role === 'staff';
  return true;
}

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectParam = searchParams.get('redirect') || '';

  const { language } = useApp();
  const { user, isAuthenticated, loginOfficial } = useAuth();
  const { showPreloader } = usePreloader();

  // Active role tab
  const [selectedRoleKey, setSelectedRoleKey] = useState<AdminTabRole>('admin');

  // Input fields
  const [identifier, setIdentifier] = useState('admin@dscc.gov.bd');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);

  // Security code state
  const [expectedCode, setExpectedCode] = useState('');
  const [enteredCode, setEnteredCode] = useState('');
  const [refreshNonce, setRefreshNonce] = useState(0);

  // Status & Feedback
  const [formError, setFormError] = useState('');
  const [codeError, setCodeError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [demoNotice, setDemoNotice] = useState<string | null>(null);

  // Demo menu popover
  const [isDemoMenuOpen, setIsDemoMenuOpen] = useState(false);
  const demoMenuRef = useRef<HTMLDivElement>(null);
  const isRedirectingRef = useRef(false);
  const visibleOfficialProfiles = OFFICIAL_PROFILES.filter(
    (profile) => profile.key === selectedRoleKey
  );

  // Click-outside listener for demo popover
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (demoMenuRef.current && !demoMenuRef.current.contains(e.target as Node)) {
        setIsDemoMenuOpen(false);
      }
    }
    if (isDemoMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDemoMenuOpen]);

  // Redirect if already authenticated as official/admin
  useEffect(() => {
    if (isRedirectingRef.current) return;
    if (isAuthenticated && user && (user.role === 'admin' || user.role === 'officer')) {
      isRedirectingRef.current = true;
      if (redirectParam && isRedirectAllowedForRole(redirectParam, user.role)) {
        router.replace(redirectParam);
      } else {
        router.replace(getDashboardPathForRole(user.role));
      }
    }
  }, [isAuthenticated, user, redirectParam, router]);

  const handleCodeGenerated = useCallback((code: string) => {
    setExpectedCode(code);
  }, []);

  const triggerCodeRegeneration = () => {
    setEnteredCode('');
    setRefreshNonce((n) => n + 1);
  };

  // Switch role preset tabs
  const handleRoleTabSelect = (key: AdminTabRole) => {
    setSelectedRoleKey(key);
    setIdentifier('');
    setPassword('');
    setFormError('');
    setCodeError('');
  };

  // Populate from demo popover
  const handleSelectOfficialDemo = (preset: OfficialProfilePreset) => {
    setSelectedRoleKey(preset.key);
    setIdentifier(preset.identifier);
    setPassword(preset.password);
    setFormError('');
    setCodeError('');
    setIsDemoMenuOpen(false);

    setDemoNotice(
      language === 'bn'
        ? `${preset.labelBn} টেস্ট তথ্য লোড হয়েছে।`
        : `${preset.labelEn} demo credentials populated.`
    );
    setTimeout(() => setDemoNotice(null), 4000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setCodeError('');

    // 1. Validate Identifier
    if (!identifier.trim()) {
      setFormError(
        language === 'bn'
          ? 'অনুগ্রহ করে অফিশিয়াল এমপ্লয়ি আইডি অথবা প্রাতিষ্ঠানিক ইমেইল লিখুন।'
          : 'Please enter your Official Employee ID or municipal email.'
      );
      return;
    }

    // 2. Validate Password
    if (!password.trim()) {
      setFormError(
        language === 'bn' ? 'অনুগ্রহ করে পাসওয়ার্ড লিখুন।' : 'Please enter your password.'
      );
      return;
    }

    // 3. Compare Security Code
    if (!enteredCode.trim() || enteredCode.trim() !== expectedCode) {
      setCodeError(
        language === 'bn'
          ? 'নিরাপত্তা কোডটি সঠিক নয়, আবার চেষ্টা করুন।'
          : 'Verification code does not match. Please try again.'
      );
      triggerCodeRegeneration();
      return;
    }

    // 4. Authenticate Official
    setSubmitting(true);
    const targetRole: OfficialRole = selectedRoleKey === 'admin' ? 'admin' : 'officer';

    try {
      const res = await loginOfficial(identifier, password, targetRole);
      if (!res.success || !res.user) {
        setFormError(
          language === 'bn'
            ? res.errorBn || 'প্রশাসনিক লগইন ব্যর্থ হয়েছে। ক্রেডেনশিয়াল সঠিক কিনা যাচাই করুন।'
            : res.errorEn || 'Administrative authentication failed. Please verify credentials.'
        );
        triggerCodeRegeneration();
        setSubmitting(false);
        return;
      }

      isRedirectingRef.current = true;
      const target =
        redirectParam && isRedirectAllowedForRole(redirectParam, res.user.role)
          ? redirectParam
          : getDashboardPathForRole(res.user.role);
      showPreloader('admin');
      router.replace(target);
    } catch {
      setFormError(
        language === 'bn'
          ? 'প্রশাসনিক লগইন সম্পন্ন করা যায়নি। অনুগ্রহ করে আবার চেষ্টা করুন।'
          : 'Unable to complete administrative sign-in. Please try again.'
      );
      setSubmitting(false);
    }
  };

  if (isAuthenticated && user && (user.role === 'admin' || user.role === 'officer')) {
    return null;
  }

  return (
    <div className="w-full max-w-md mx-auto animate-in fade-in slide-in-from-bottom-3 duration-300">
      {/* Centered Authoritative Civic Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:border-slate-300/80">
        {/* Dark Slate / Emerald Official Header */}
        <div className="bg-slate-900 text-white px-7 py-6 relative">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold tracking-wide">
              <Landmark className="w-4 h-4 shrink-0" />
              <span>
                {language === 'bn'
                  ? 'ঢাকা স্মার্ট সিটি কর্পোরেশন'
                  : 'Dhaka Smart City Corporation'}
              </span>
            </div>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <ShieldCheck className="w-3 h-3" />
              <span>
                {language === 'bn' ? 'অফিশিয়াল পোর্টাল' : 'Official Portal'}
              </span>
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
            {language === 'bn' ? 'অ্যাডমিন ও অফিশিয়াল লগইন' : 'Admin & Official Sign-In'}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {language === 'bn'
              ? 'মেয়র সচিবালয়, বিভাগীয় পরিচালক ও ওয়ার্ড কর্মকর্তাদের জন্য সুরক্ষিত কমান্ড পোর্টাল'
              : 'Secure municipal command portal for mayor secretariat, department directors & ward officers'}
          </p>
        </div>

        {/* Role Selector Tabs with Interactive Lift */}
        <div className="px-6 sm:px-7 pt-5 pb-1">
          <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200">
            <button
              type="button"
              onClick={() => handleRoleTabSelect('admin')}
              className={`py-2 px-2 text-[11px] font-bold rounded-lg transition-all duration-200 cursor-pointer truncate ${
                selectedRoleKey === 'admin'
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70 hover:-translate-y-0.5'
              }`}
              title={language === 'bn' ? 'মেয়র সচিবালয় / সুপার অ্যাডমিন' : 'Super Admin'}
            >
              {language === 'bn' ? 'সুপার অ্যাডমিন' : 'Super Admin'}
            </button>

            <button
              type="button"
              onClick={() => handleRoleTabSelect('ward_officer')}
              className={`py-2 px-2 text-[11px] font-bold rounded-lg transition-all duration-200 cursor-pointer truncate ${
                selectedRoleKey === 'ward_officer'
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70 hover:-translate-y-0.5'
              }`}
              title={language === 'bn' ? 'ওয়ার্ড নির্বাহী কর্মকর্তা' : 'Ward Officer'}
            >
              {language === 'bn' ? 'ওয়ার্ড কর্মকর্তা' : 'Ward Officer'}
            </button>

            <button
              type="button"
              onClick={() => handleRoleTabSelect('dept_officer')}
              className={`py-2 px-2 text-[11px] font-bold rounded-lg transition-all duration-200 cursor-pointer truncate ${
                selectedRoleKey === 'dept_officer'
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70 hover:-translate-y-0.5'
              }`}
              title={language === 'bn' ? 'বিভাগীয় কর্মকর্তা' : 'Dept Officer'}
            >
              {language === 'bn' ? 'বিভাগীয় কর্মকর্তা' : 'Dept Officer'}
            </button>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6 sm:p-7 pt-4">
          {/* Demo Autofill Toast / Notice */}
          {demoNotice && (
            <div className="mb-4 p-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-800 text-xs flex items-center gap-2 animate-in fade-in duration-200">
              <CheckCircle2 className="w-4 h-4 text-[#006A4E] shrink-0" />
              <span>{demoNotice}</span>
            </div>
          )}

          {/* Error Banner */}
          {formError && (
            <div
              role="alert"
              className="mb-4 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-start gap-2.5 animate-in fade-in duration-200"
            >
              <AlertCircle className="w-4 h-4 text-[#C81E1E] shrink-0 mt-0.5" />
              <span>{formError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* Employee ID / Official Email Field */}
            <div>
              <label
                htmlFor="official-id"
                className="block text-xs font-bold text-[#111827] mb-1.5"
              >
                {language === 'bn'
                  ? 'অফিশিয়াল এমপ্লয়ি আইডি বা ইমেইল'
                  : 'Official Employee ID or Email'}
                <span className="text-red-500 ml-0.5">*</span>
              </label>
              <div className="relative">
                <input
                  id="official-id"
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="admin@dscc.gov.bd"
                  autoComplete="username"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white font-mono text-xs sm:text-sm text-[#111827] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>

            {/* Official Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="official-password"
                  className="block text-xs font-bold text-[#111827]"
                >
                  {language === 'bn' ? 'অফিশিয়াল পাসওয়ার্ড' : 'Official Password'}
                  <span className="text-red-500 ml-0.5">*</span>
                </label>
                <span className="text-[11px] text-slate-400">
                  {language === 'bn' ? 'এনক্রিপ্টেড সেশন' : 'Encrypted Session'}
                </span>
              </div>
              <div className="relative">
                <input
                  id="official-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                  className="w-full pl-3.5 pr-10 py-2.5 rounded-xl border border-slate-300 bg-white text-sm text-[#111827] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* 4-Digit Security Code (Captcha) */}
            <div className="pt-1">
              <SecurityCodeField
                value={enteredCode}
                onChange={(val: string) => {
                  setEnteredCode(val);
                  if (codeError) setCodeError('');
                }}
                onCodeChange={handleCodeGenerated}
                refreshNonce={refreshNonce}
                error={codeError}
              />
            </div>

            {/* Action Bar: Demo Popover Button (Left) + Sign In Button (Right) */}
            <div className="pt-2 flex items-center gap-2.5 relative">
              {/* Demo Accounts Popover Anchor with Hover Lift */}
              <div className="relative" ref={demoMenuRef}>
                <button
                  type="button"
                  onClick={() => setIsDemoMenuOpen((prev) => !prev)}
                  className={`inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer shrink-0 shadow-2xs hover:shadow-xs hover:-translate-y-0.5 active:translate-y-0 focus-visible:outline-2 focus-visible:outline-slate-900 ${
                    isDemoMenuOpen
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-700 bg-slate-100 hover:bg-slate-200 hover:border-slate-400 border border-slate-300'
                  }`}
                  title={
                    language === 'bn'
                      ? 'অফিশিয়াল টেস্ট অ্যাকাউন্ট নির্বাচন করুন'
                      : 'Select official demo profile'
                  }
                  aria-haspopup="true"
                  aria-expanded={isDemoMenuOpen}
                >
                  <span>{language === 'bn' ? 'ডেমো অ্যাকাউন্ট' : 'Demo Roles'}</span>
                  <ChevronDown className={`w-3 h-3 ml-0.5 transition-transform duration-200 ${isDemoMenuOpen ? 'rotate-180' : 'opacity-70'}`} />
                </button>

                {/* Official demo accounts */}
                {isDemoMenuOpen && (
                  <div className="absolute left-0 bottom-full mb-2 w-76 sm:w-80 bg-white rounded-2xl border border-slate-200 shadow-2xl p-2.5 z-50 animate-in fade-in zoom-in-95 duration-150 origin-bottom-left">
                    <div className="px-2.5 py-1.5 border-b border-slate-100">
                      <p className="text-[11px] font-bold text-slate-800 uppercase tracking-wider">
                        {language === 'bn'
                          ? 'অফিশিয়াল ডেমো প্রোফাইল নির্বাচন'
                          : 'Select Official Demo Profile'}
                      </p>
                      <p className="text-[10px] text-slate-500">
                        {language === 'bn'
                          ? `এই বিভাগে ${visibleOfficialProfiles.length}টি ডেমো অ্যাকাউন্ট`
                          : `${visibleOfficialProfiles.length} demo account${visibleOfficialProfiles.length === 1 ? '' : 's'} for this role`}
                      </p>
                    </div>

                    <div className="mt-2 max-h-[min(60vh,28rem)] space-y-1.5 overflow-y-auto overscroll-contain pr-1">
                      {visibleOfficialProfiles.map((preset) => (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => handleSelectOfficialDemo(preset)}
                          className="w-full text-left p-2.5 rounded-xl border border-slate-100 hover:border-emerald-300 hover:bg-[#ECFDF5] hover:-translate-y-0.5 hover:shadow-2xs transition-all duration-200 cursor-pointer group"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-900 group-hover:text-[#006A4E] transition-colors">
                              {language === 'bn' ? preset.labelBn : preset.labelEn}
                            </span>
                            <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full bg-slate-100 group-hover:bg-[#D1FAE5] text-slate-600 group-hover:text-[#006A4E] border border-slate-200 group-hover:border-emerald-200 shrink-0 transition-colors">
                              {language === 'bn' ? preset.badgeBn : preset.badgeEn}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-500 group-hover:text-slate-600 font-mono mt-0.5 truncate transition-colors">
                            {language === 'bn' ? preset.subBn : preset.subEn}
                          </p>
                          <p className="mt-1 truncate font-mono text-[10px] text-slate-600">
                            {language === 'bn' ? 'লগইন আইডি:' : 'Login ID:'} {preset.identifier}
                          </p>
                          <p className="truncate font-mono text-[10px] text-slate-600">
                            {language === 'bn' ? 'পাসওয়ার্ড:' : 'Password:'} {preset.password}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Official Sign In Button with Subtle Lift */}
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 hover:-translate-y-0.5 hover:shadow-sm active:translate-y-0 disabled:opacity-60 transition-all duration-300 shadow-xs cursor-pointer focus-visible:outline-2 focus-visible:outline-slate-900"
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>{language === 'bn' ? 'যাচাই হচ্ছে...' : 'Verifying...'}</span>
                  </>
                ) : (
                  <>
                    <span>{language === 'bn' ? 'অফিশিয়াল লগইন' : 'Official Sign In'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Footer Card: Interactive Link Back to Citizen Portal */}
        <Link
          href="/login"
          className="bg-slate-50 hover:bg-[#ECFDF5] border-t border-slate-200/80 px-6 py-3.5 flex items-center justify-between gap-3 text-xs transition-all duration-300 group cursor-pointer"
        >
          <div className="flex items-center gap-2 text-slate-600 group-hover:text-slate-800 transition-colors">
            <User className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-medium">
              {language === 'bn' ? 'সাধারণ নাগরিক?' : 'General Citizen?'}
            </span>
          </div>
          <span className="inline-flex items-center gap-1 font-bold text-[#006A4E] group-hover:text-[#00523C] group-hover:translate-x-1 transition-all duration-300 shrink-0">
            <span>{language === 'bn' ? 'নাগরিক পোর্টালে যান →' : 'Go to Citizen Portal →'}</span>
          </span>
        </Link>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-[calc(100vh-140px)] bg-slate-100/70 py-10 sm:py-16 px-4 sm:px-6 flex items-center justify-center">
      <Suspense
        fallback={
          <div className="w-full max-w-md mx-auto p-8 bg-white rounded-3xl border border-slate-200 shadow-md text-center">
            <div className="w-8 h-8 border-3 border-slate-900 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs text-slate-500 font-semibold">
              অ্যাডমিন লগইন পৃষ্ঠা লোড হচ্ছে...
            </p>
          </div>
        }
      >
        <AdminLoginForm />
      </Suspense>
    </div>
  );
}
