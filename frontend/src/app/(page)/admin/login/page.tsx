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
  Sparkles,
  User,
  Users,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
import { DEMO_CREDENTIALS, getDashboardPathForRole } from '@/services/mockApi';
import { AuthRole, OfficialRole } from '@/types';
import { SecurityCodeField } from '@/components/SecurityCodeField';

type AdminTabRole = 'admin' | 'ward_officer' | 'dept_officer';

interface OfficialProfilePreset {
  key: AdminTabRole;
  role: OfficialRole;
  identifier: string;
  labelBn: string;
  labelEn: string;
  subBn: string;
  subEn: string;
  badgeBn: string;
  badgeEn: string;
}

const OFFICIAL_PROFILES: OfficialProfilePreset[] = [
  {
    key: 'admin',
    role: 'admin',
    identifier: 'admin@dscc.gov.bd',
    labelBn: 'মেয়র সচিবালয় ও সুপার অ্যাডমিন',
    labelEn: 'Mayor Secretariat & Super Admin',
    subBn: 'আইডি: EMP-ADM-001 · কেন্দ্রীয় কমান্ড ও অডিট',
    subEn: 'ID: EMP-ADM-001 · Central Command & Audit',
    badgeBn: 'সুপার অ্যাডমিন',
    badgeEn: 'Super Admin',
  },
  {
    key: 'ward_officer',
    role: 'officer',
    identifier: 'ward.officer@dscc.gov.bd',
    labelBn: 'ওয়ার্ড নির্বাহী কর্মকর্তা (ওয়ার্ড ১৯)',
    labelEn: 'Ward Executive Officer (Ward 19)',
    subBn: 'আইডি: EMP-WRD-019 · ওয়ার্ড অভিযোগ ও মাঠ পরিদর্শন',
    subEn: 'ID: EMP-WRD-019 · Ward Complaints & Field Oversight',
    badgeBn: 'ওয়ার্ড কর্মকর্তা',
    badgeEn: 'Ward Officer',
  },
  {
    key: 'dept_officer',
    role: 'officer',
    identifier: 'dept.officer@dscc.gov.bd',
    labelBn: 'বিভাগীয় কর্মকর্তা (রাজস্ব ও প্রকৌশল)',
    labelEn: 'Department Officer (Revenue & Eng.)',
    subBn: 'আইডি: EMP-OFF-104 · রাজস্ব ও সংবিধিবদ্ধ অনুমোদন',
    subEn: 'ID: EMP-OFF-104 · Revenue & Statutory Approvals',
    badgeBn: 'বিভাগীয় কর্মকর্তা',
    badgeEn: 'Dept Officer',
  },
];

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
    if (isAuthenticated && user && (user.role === 'admin' || user.role === 'officer')) {
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
    setFormError('');
    setCodeError('');
    triggerCodeRegeneration();

    const preset = OFFICIAL_PROFILES.find((p) => p.key === key);
    if (preset) {
      setIdentifier(preset.identifier);
      if (key === 'admin') setPassword('admin123');
      else if (key === 'ward_officer') setPassword('ward123');
      else setPassword('officer123');
    }
  };

  // Populate from demo popover
  const handleSelectOfficialDemo = (key: AdminTabRole) => {
    handleRoleTabSelect(key);
    if (expectedCode) {
      setEnteredCode(expectedCode);
    }
    setIsDemoMenuOpen(false);

    const preset = OFFICIAL_PROFILES.find((p) => p.key === key);
    setDemoNotice(
      language === 'bn'
        ? `${preset?.labelBn} টেস্ট তথ্য লোড হয়েছে।`
        : `${preset?.labelEn} demo credentials populated.`
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
      triggerCodeRegeneration();
      return;
    }

    // 2. Validate Password
    if (!password.trim()) {
      setFormError(
        language === 'bn' ? 'অনুগ্রহ করে পাসওয়ার্ড লিখুন।' : 'Please enter your password.'
      );
      triggerCodeRegeneration();
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
    const activePreset = OFFICIAL_PROFILES.find((p) => p.key === selectedRoleKey);
    const targetRole: OfficialRole = activePreset?.role || 'admin';

    try {
      const res = await loginOfficial(identifier, password, targetRole);
      if (!res.success || !res.user) {
        setFormError(
          language === 'bn'
            ? res.errorBn || 'প্রশাসনিক লগইন ব্যর্থ হয়েছে। ক্রেডেনশিয়াল সঠিক কিনা যাচাই করুন।'
            : res.errorEn || 'Administrative authentication failed. Please verify credentials.'
        );
        triggerCodeRegeneration();
        return;
      }

      const target =
        redirectParam && isRedirectAllowedForRole(redirectParam, res.user.role)
          ? redirectParam
          : getDashboardPathForRole(res.user.role);
      router.replace(target);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto animate-in fade-in slide-in-from-bottom-3 duration-300">
      {/* Centered Authoritative Civic Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
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
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
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

        {/* Role Selector Tabs */}
        <div className="px-6 sm:px-7 pt-5 pb-1">
          <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200">
            <button
              type="button"
              onClick={() => handleRoleTabSelect('admin')}
              className={`py-2 px-2 text-[11px] font-bold rounded-lg transition-all cursor-pointer truncate ${
                selectedRoleKey === 'admin'
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title={language === 'bn' ? 'মেয়র সচিবালয় / সুপার অ্যাডমিন' : 'Super Admin'}
            >
              {language === 'bn' ? 'সুপার অ্যাডমিন' : 'Super Admin'}
            </button>

            <button
              type="button"
              onClick={() => handleRoleTabSelect('ward_officer')}
              className={`py-2 px-2 text-[11px] font-bold rounded-lg transition-all cursor-pointer truncate ${
                selectedRoleKey === 'ward_officer'
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title={language === 'bn' ? 'ওয়ার্ড নির্বাহী কর্মকর্তা' : 'Ward Officer'}
            >
              {language === 'bn' ? 'ওয়ার্ড কর্মকর্তা' : 'Ward Officer'}
            </button>

            <button
              type="button"
              onClick={() => handleRoleTabSelect('dept_officer')}
              className={`py-2 px-2 text-[11px] font-bold rounded-lg transition-all cursor-pointer truncate ${
                selectedRoleKey === 'dept_officer'
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
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
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm text-[#111827] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all font-mono text-xs sm:text-sm"
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
                  className="w-full pl-3.5 pr-10 py-2.5 rounded-xl border border-slate-300 bg-white text-sm text-[#111827] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* 6-Digit Security Code (Captcha) */}
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
              {/* Demo Accounts Popover Anchor */}
              <div className="relative" ref={demoMenuRef}>
                <button
                  type="button"
                  onClick={() => setIsDemoMenuOpen((prev) => !prev)}
                  className={`inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 shadow-2xs hover:shadow-xs focus-visible:outline-2 focus-visible:outline-slate-900 ${
                    isDemoMenuOpen
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300'
                  }`}
                  title={
                    language === 'bn'
                      ? 'অফিশিয়াল টেস্ট অ্যাকাউন্ট নির্বাচন করুন'
                      : 'Select official demo profile'
                  }
                  aria-haspopup="true"
                  aria-expanded={isDemoMenuOpen}
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>{language === 'bn' ? 'ডেমো অ্যাকাউন্ট' : 'Demo Roles'}</span>
                  <ChevronDown className="w-3 h-3 ml-0.5 opacity-70" />
                </button>

                {/* Popover Listing ONLY the 3 Official Profiles */}
                {isDemoMenuOpen && (
                  <div className="absolute left-0 bottom-full mb-2 w-72 sm:w-80 bg-white rounded-2xl border border-slate-200 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150 origin-bottom-left">
                    <div className="px-2.5 py-1.5 border-b border-slate-100">
                      <p className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                        {language === 'bn'
                          ? 'অফিশিয়াল ডেমো প্রোফাইল নির্বাচন'
                          : 'Select Official Demo Profile'}
                      </p>
                      <p className="text-[10px] text-slate-500">
                        {language === 'bn'
                          ? 'এক-ক্লিকে অফিশিয়াল ক্রেডেনশিয়াল লোড করুন'
                          : 'One-click load official municipal credentials'}
                      </p>
                    </div>

                    <div className="space-y-1 mt-1.5">
                      {OFFICIAL_PROFILES.map((preset) => (
                        <button
                          key={preset.key}
                          type="button"
                          onClick={() => handleSelectOfficialDemo(preset.key)}
                          className="w-full text-left p-2 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all cursor-pointer group"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-900 group-hover:text-emerald-700">
                              {language === 'bn' ? preset.labelBn : preset.labelEn}
                            </span>
                            <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200 shrink-0">
                              {language === 'bn' ? preset.badgeBn : preset.badgeEn}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-500 font-mono mt-0.5 truncate">
                            {language === 'bn' ? preset.subBn : preset.subEn}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Official Sign In Button */}
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-60 transition-all shadow-xs cursor-pointer focus-visible:outline-2 focus-visible:outline-slate-900"
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

        {/* Footer Card: Link Back to Citizen Portal */}
        <div className="bg-slate-50 border-t border-slate-200/80 px-6 py-3.5 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-600">
            <User className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-medium">
              {language === 'bn' ? 'সাধারণ নাগরিক?' : 'General Citizen?'}
            </span>
          </div>
          <Link
            href="/login"
            className="inline-flex items-center gap-1 font-bold text-[#006A4E] hover:text-[#00523C] hover:underline shrink-0"
          >
            <span>{language === 'bn' ? 'নাগরিক পোর্টালে যান →' : 'Go to Citizen Portal →'}</span>
          </Link>
        </div>
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
