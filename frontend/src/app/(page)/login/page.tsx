'use client';

import React, { Suspense, useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  AlertCircle,
  ArrowRight,
  Building2,
  CheckCircle2,
  Eye,
  EyeOff,
  Landmark,
  ShieldCheck,
  Sparkles,
  User,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
import { DEMO_CREDENTIALS, getDashboardPathForRole } from '@/services/mockApi';
import { AuthRole } from '@/types';
import { SecurityCodeField } from '@/components/SecurityCodeField';

function isRedirectAllowedForRole(redirectPath: string, role: AuthRole): boolean {
  if (!redirectPath.startsWith('/') || redirectPath.startsWith('//')) return false;
  if (redirectPath.startsWith('/admin') || redirectPath.startsWith('/dashboard/admin')) return role === 'admin' || role === 'officer';
  if (redirectPath.startsWith('/citizen') || redirectPath.startsWith('/dashboard/citizen')) return role === 'citizen';
  if (redirectPath.startsWith('/dashboard/officer')) return role === 'officer' || role === 'admin';
  if (redirectPath.startsWith('/dashboard/staff')) return role === 'staff';
  return true;
}

function CitizenLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectParam = searchParams.get('redirect') || '';

  const { language } = useApp();
  const { user, isAuthenticated, loginCitizen } = useAuth();

  // Citizen input fields
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Security code state
  const [expectedCode, setExpectedCode] = useState('');
  const [enteredCode, setEnteredCode] = useState('');
  const [refreshNonce, setRefreshNonce] = useState(0);

  // Status & Feedback
  const [formError, setFormError] = useState('');
  const [codeError, setCodeError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [demoNotice, setDemoNotice] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
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

  // One-click autofill for Verified Citizen ONLY
  const handleAutofillCitizenDemo = () => {
    setFormError('');
    setCodeError('');
    const citizenDemo = DEMO_CREDENTIALS.find((c) => c.role === 'citizen');
    if (citizenDemo) {
      setPhone(citizenDemo.identifier);
      setPassword(citizenDemo.password);
      if (expectedCode) {
        setEnteredCode(expectedCode);
      }
      setDemoNotice(true);
      setTimeout(() => setDemoNotice(false), 4000);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setCodeError('');

    // 1. Phone number validation
    const cleanPhone = phone.replace(/[\s-]/g, '').trim();
    if (!/^01[3-9]\d{8}$/.test(cleanPhone)) {
      setFormError(
        language === 'bn'
          ? 'সঠিক ১১ ডিজিটের বাংলাদেশি মোবাইল নম্বর লিখুন (যেমন: 017XXXXXXXX)।'
          : 'Please enter a valid 11-digit Bangladeshi mobile number (e.g., 017XXXXXXXX).'
      );
      triggerCodeRegeneration();
      return;
    }

    // 2. Password validation
    if (!password.trim()) {
      setFormError(
        language === 'bn' ? 'অনুগ্রহ করে পাসওয়ার্ড লিখুন।' : 'Please enter your password.'
      );
      triggerCodeRegeneration();
      return;
    }

    // 3. Security Code validation
    if (!enteredCode.trim() || enteredCode.trim() !== expectedCode) {
      setCodeError(
        language === 'bn'
          ? 'নিরাপত্তা কোডটি সঠিক নয়, আবার চেষ্টা করুন।'
          : 'Verification code does not match. Please try again.'
      );
      triggerCodeRegeneration();
      return;
    }

    // 4. Authenticate Citizen
    setSubmitting(true);
    try {
      const res = await loginCitizen(phone, password);
      if (!res.success || !res.user) {
        setFormError(
          language === 'bn'
            ? res.errorBn || 'লগইন ব্যর্থ হয়েছে।'
            : res.errorEn || 'Authentication failed.'
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
      {/* Centered Glassmorphic/White Civic Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
        {/* Deep Civic Green Header */}
        <div className="bg-[#006A4E] text-white px-7 py-6 relative">
          <div className="flex items-center gap-2 text-emerald-200 text-xs font-semibold mb-1 tracking-wide">
            <Landmark className="w-4 h-4 shrink-0" />
            <span>
              {language === 'bn'
                ? 'ঢাকা স্মার্ট সিটি কর্পোরেশন'
                : 'Dhaka Smart City Corporation'}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
            {language === 'bn' ? 'নাগরিক পোর্টাল লগইন' : 'Citizen Portal Sign-In'}
          </h1>
          <p className="text-xs text-emerald-100/90 mt-1">
            {language === 'bn'
              ? 'নাগরিক সেবা, হোল্ডিং ট্যাক্স, সনদ ও নাগরিক আবেদনের জন্য প্রবেশ করুন'
              : 'Sign in to access municipal certificates, holding taxes and public services'}
          </p>
        </div>

        {/* Form Body */}
        <div className="p-6 sm:p-7">
          {/* Demo Autofill Toast / Notice */}
          {demoNotice && (
            <div className="mb-5 p-3 rounded-xl bg-[#ECFDF5] border border-emerald-300 text-emerald-900 text-xs flex items-center gap-2 animate-in fade-in duration-200">
              <CheckCircle2 className="w-4 h-4 text-[#006A4E] shrink-0" />
              <span>
                {language === 'bn'
                  ? 'নাগরিক টেস্ট তথ্য লোড হয়েছে (মো: রুহুল আমিন · 01816648095)।'
                  : 'Citizen demo credentials loaded (Md. Ruhul Amin · 01816648095).'}
              </span>
            </div>
          )}

          {/* Error Banner */}
          {formError && (
            <div
              role="alert"
              className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-start gap-2.5 animate-in fade-in duration-200"
            >
              <AlertCircle className="w-4 h-4 text-[#C81E1E] shrink-0 mt-0.5" />
              <span>{formError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* Mobile Number Field */}
            <div>
              <label
                htmlFor="citizen-phone"
                className="block text-xs font-bold text-[#111827] mb-1.5"
              >
                {language === 'bn' ? '১১ ডিজিটের মোবাইল নম্বর' : '11-Digit Mobile Number'}
                <span className="text-red-500 ml-0.5">*</span>
              </label>
              <div className="relative">
                <input
                  id="citizen-phone"
                  type="tel"
                  inputMode="numeric"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="01816648095"
                  autoComplete="tel"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm text-[#111827] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#006A4E] focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="citizen-password"
                  className="block text-xs font-bold text-[#111827]"
                >
                  {language === 'bn' ? 'পাসওয়ার্ড' : 'Password'}
                  <span className="text-red-500 ml-0.5">*</span>
                </label>
                <Link
                  href="/reset-password"
                  className="text-xs font-semibold text-[#006A4E] hover:underline"
                >
                  {language === 'bn' ? 'পাসওয়ার্ড ভুলে গেছেন?' : 'Forgot Password?'}
                </Link>
              </div>
              <div className="relative">
                <input
                  id="citizen-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                  className="w-full pl-3.5 pr-10 py-2.5 rounded-xl border border-slate-300 bg-white text-sm text-[#111827] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#006A4E] focus:border-transparent transition-all"
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

            {/* Action Bar: Demo Access Button (Left) + Sign In Button (Right) */}
            <div className="pt-2 flex items-center gap-2.5">
              {/* Compact Demo Access Button */}
              <button
                type="button"
                onClick={handleAutofillCitizenDemo}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-bold text-[#006A4E] bg-[#ECFDF5] hover:bg-emerald-100 border border-emerald-300 transition-all cursor-pointer shrink-0 shadow-2xs hover:shadow-xs focus-visible:outline-2 focus-visible:outline-[#006A4E]"
                title={
                  language === 'bn'
                    ? 'ডেমো টেস্ট তথ্য এক-ক্লিকে পূরণ করুন'
                    : 'One-click autofill verified citizen demo credentials'
                }
              >
                <Sparkles className="w-3.5 h-3.5 text-[#006A4E]" />
                <span>{language === 'bn' ? 'ডেমো পূরণ' : 'Demo Fill'}</span>
              </button>

              {/* Citizen Sign In Button */}
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white bg-[#006A4E] hover:bg-[#00523C] disabled:opacity-60 transition-all shadow-xs cursor-pointer focus-visible:outline-2 focus-visible:outline-[#006A4E]"
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>{language === 'bn' ? 'যাচাই হচ্ছে...' : 'Verifying...'}</span>
                  </>
                ) : (
                  <>
                    <span>{language === 'bn' ? 'নাগরিক লগইন' : 'Citizen Sign In'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

            {/* Register Link */}
            <div className="pt-3 text-center text-xs text-[#4B5563] border-t border-slate-100">
              <span>
                {language === 'bn'
                  ? 'স্মার্ট সিটি অ্যাকাউন্টে নতুন? '
                  : 'New to Smart City Portal? '}
              </span>
              <Link
                href="/register"
                className="font-bold text-[#006A4E] hover:underline"
              >
                {language === 'bn' ? 'নাগরিক নিবন্ধন করুন' : 'Create Citizen Account'}
              </Link>
            </div>
          </form>
        </div>

        {/* Footer Card: Link to Official / Admin Portal */}
        <div className="bg-slate-50 border-t border-slate-200/80 px-6 py-3.5 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-600">
            <Building2 className="w-4 h-4 text-slate-500 shrink-0" />
            <span className="font-medium">
              {language === 'bn'
                ? 'সিটি কর্পোরেশন কর্মকর্তা বা অ্যাডমিন?'
                : 'Municipal Officer or Administrator?'}
            </span>
          </div>
          <Link
            href="/admin/login"
            className="inline-flex items-center gap-1 font-bold text-[#006A4E] hover:text-[#00523C] hover:underline shrink-0"
          >
            <span>{language === 'bn' ? 'অ্যাডমিন পোর্টাল →' : 'Admin Portal →'}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-[calc(100vh-140px)] bg-slate-50/60 py-10 sm:py-16 px-4 sm:px-6 flex items-center justify-center">
      <Suspense
        fallback={
          <div className="w-full max-w-md mx-auto p-8 bg-white rounded-3xl border border-slate-200 shadow-md text-center">
            <div className="w-8 h-8 border-3 border-[#006A4E] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs text-slate-500 font-semibold">
              নাগরিক লগইন পৃষ্ঠা লোড হচ্ছে...
            </p>
          </div>
        }
      >
        <CitizenLoginForm />
      </Suspense>
    </div>
  );
}
