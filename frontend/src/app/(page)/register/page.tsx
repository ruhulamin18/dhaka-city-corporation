'use client';

import React, { Suspense, useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { AlertCircle, Eye, EyeOff, Landmark, UserPlus } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
import { mockApi } from '@/services/mockApi';
import { WardInfo } from '@/types';
import { SecurityCodeField } from '@/components/SecurityCodeField';

function RegisterFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectParam = searchParams.get('redirect') || '';

  const { language } = useApp();
  const { registerCitizen, isAuthenticated, user, getDashboardPath } = useAuth();

  const [wards, setWards] = useState<WardInfo[]>([]);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [nid, setNid] = useState('');
  const [wardNumber, setWardNumber] = useState<number>(27);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  // Security code state
  const [expectedCode, setExpectedCode] = useState('');
  const [enteredCode, setEnteredCode] = useState('');
  const [refreshNonce, setRefreshNonce] = useState(0);

  const [formError, setFormError] = useState('');
  const [codeError, setCodeError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let active = true;
    mockApi.getWards().then((w) => {
      if (active) setWards(w);
    });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (isAuthenticated && user) {
      const isSafeRedirect =
        redirectParam.startsWith('/') &&
        !redirectParam.startsWith('//') &&
        !redirectParam.startsWith('/dashboard/admin') &&
        !redirectParam.startsWith('/dashboard/officer') &&
        !redirectParam.startsWith('/dashboard/staff');
      router.replace(isSafeRedirect ? redirectParam : getDashboardPath(user.role));
    }
  }, [isAuthenticated, user, redirectParam, router, getDashboardPath]);

  const handleCodeGenerated = useCallback((code: string) => {
    setExpectedCode(code);
  }, []);

  const regenerateCode = () => {
    setEnteredCode('');
    setRefreshNonce((n) => n + 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setCodeError('');

    const cleanPhone = phone.replace(/[\s-]/g, '').trim();
    const cleanNid = nid.replace(/\s/g, '').trim();

    // Step 1: Validate Registration Fields First
    if (!fullName.trim()) {
      setFormError(language === 'bn' ? 'আপনার পূর্ণ নাম লিখুন।' : 'Please enter your full name.');
      regenerateCode();
      return;
    }
    if (!/^01[3-9]\d{8}$/.test(cleanPhone)) {
      setFormError(
        language === 'bn'
          ? 'সঠিক ১১ ডিজিটের বাংলাদেশি মোবাইল নম্বর লিখুন (যেমন: 017XXXXXXXX)।'
          : 'Please enter a valid 11-digit Bangladeshi mobile number (e.g., 017XXXXXXXX).'
      );
      regenerateCode();
      return;
    }
    if (!/^\d{10}$|^\d{17}$/.test(cleanNid)) {
      setFormError(
        language === 'bn'
          ? 'এনআইডি (NID) নম্বর অবশ্যই ১০ অথবা ১৭ ডিজিটের হতে হবে।'
          : 'NID number must be strictly 10 or 17 digits.'
      );
      regenerateCode();
      return;
    }
    if (password.length < 6) {
      setFormError(
        language === 'bn'
          ? 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।'
          : 'Password must be at least 6 characters long.'
      );
      regenerateCode();
      return;
    }
    if (password !== confirmPassword) {
      setFormError(
        language === 'bn'
          ? 'পাসওয়ার্ড ও নিশ্চিত পাসওয়ার্ড মেলেনি।'
          : 'Password and Confirm Password do not match.'
      );
      regenerateCode();
      return;
    }

    // Step 2: Strictly Validate 6-Digit Security Code
    if (!enteredCode.trim() || enteredCode.trim() !== expectedCode) {
      setCodeError(
        language === 'bn'
          ? 'নিরাপত্তা কোডটি সঠিক নয়, আবার চেষ্টা করুন।'
          : 'Verification code does not match. Please try again.'
      );
      regenerateCode();
      return;
    }

    // Step 3: Submit Citizen Registration
    setSubmitting(true);
    try {
      const res = await registerCitizen({
        fullName,
        phone: cleanPhone,
        nid: cleanNid,
        wardNumber,
        password,
      });

      if (!res.success || !res.user) {
        setFormError(
          language === 'bn'
            ? res.errorBn || 'নিবন্ধন ব্যর্থ হয়েছে।'
            : res.errorEn || 'Registration failed.'
        );
        regenerateCode();
        return;
      }

      const target =
        redirectParam && redirectParam.startsWith('/') && !redirectParam.startsWith('/dashboard/admin')
          ? redirectParam
          : '/dashboard/citizen';
      router.replace(target);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="civic-card bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden shadow-sm">
        <div className="bg-[#006A4E] text-white px-6 py-5">
          <div className="flex items-center gap-2 text-emerald-200 text-xs font-semibold mb-1">
            <Landmark className="w-4 h-4" />
            <span>
              {language === 'bn'
                ? 'ঢাকা স্মার্ট সিটি ডিজিটাল নাগরিক নিবন্ধন'
                : 'Dhaka Smart City Digital Citizen Registry'}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-emerald-200" />
            <span>{language === 'bn' ? 'নতুন নাগরিক অ্যাকাউন্ট তৈরি করুন' : 'Citizen Registration'}</span>
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {formError && (
            <div
              role="alert"
              className="flex items-start gap-2.5 p-3.5 rounded-lg bg-[#FEF2F2] border border-red-200 text-xs font-medium text-[#C81E1E]"
            >
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-[#C81E1E]" />
              <span>{formError}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label htmlFor="reg-fullname" className="block text-xs font-semibold text-[#111827] mb-1">
                {language === 'bn' ? 'পূর্ণ নাম (এনআইডি অনুযায়ী)' : 'Full Name (As per NID)'}
              </label>
              <input
                id="reg-fullname"
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder={language === 'bn' ? 'যেমন: মো. তানভীর আহমেদ' : 'e.g. Md. Tanvir Ahmed'}
                className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006A4E]"
              />
            </div>

            <div>
              <label htmlFor="reg-phone" className="block text-xs font-semibold text-[#111827] mb-1">
                {language === 'bn' ? 'মোবাইল নম্বর (১১ ডিজিট)' : '11-Digit Mobile Number'}
              </label>
              <input
                id="reg-phone"
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="017XXXXXXXX"
                className="w-full px-3.5 py-2.5 text-sm font-mono border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006A4E] tabular-nums"
              />
            </div>

            <div>
              <label htmlFor="reg-nid" className="block text-xs font-semibold text-[#111827] mb-1">
                {language === 'bn' ? 'এনআইডি নম্বর (১০ বা ১৭ ডিজিট)' : 'NID Number (10 or 17 Digits)'}
              </label>
              <input
                id="reg-nid"
                type="text"
                inputMode="numeric"
                required
                value={nid}
                onChange={(e) => setNid(e.target.value.replace(/\D/g, '').slice(0, 17))}
                placeholder="19922691847230124"
                className="w-full px-3.5 py-2.5 text-sm font-mono border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006A4E] tabular-nums"
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="reg-ward" className="block text-xs font-semibold text-[#111827] mb-1">
                {language === 'bn' ? 'ওয়ার্ড নির্বাচন করুন' : 'Select Your Ward'}
              </label>
              <select
                id="reg-ward"
                value={wardNumber}
                onChange={(e) => setWardNumber(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#006A4E]"
              >
                {wards.map((w) => (
                  <option key={w.wardNumber} value={w.wardNumber}>
                    {language === 'bn'
                      ? `ওয়ার্ড ${w.wardNumber} — ${w.nameBn}`
                      : `Ward ${w.wardNumber} — ${w.nameEn}`}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="reg-password" className="block text-xs font-semibold text-[#111827] mb-1">
                {language === 'bn' ? 'পাসওয়ার্ড (ন্যূনতম ৬ অক্ষর)' : 'Password (min 6 chars)'}
              </label>
              <div className="relative">
                <input
                  id="reg-password"
                  type={showPass ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-3.5 pr-10 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006A4E]"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  aria-label={showPass ? 'Hide password' : 'Show password'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#111827] cursor-pointer"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label
                htmlFor="reg-confirm-password"
                className="block text-xs font-semibold text-[#111827] mb-1"
              >
                {language === 'bn' ? 'পাসওয়ার্ড নিশ্চিত করুন' : 'Confirm Password'}
              </label>
              <div className="relative">
                <input
                  id="reg-confirm-password"
                  type={showConfirmPass ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-3.5 pr-10 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006A4E]"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPass(!showConfirmPass)}
                  aria-label={showConfirmPass ? 'Hide confirm password' : 'Show confirm password'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#111827] cursor-pointer"
                >
                  {showConfirmPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Mandatory Random 6-Digit Security Code Block */}
          <SecurityCodeField
            value={enteredCode}
            onChange={(val) => {
              setEnteredCode(val);
              if (codeError) setCodeError('');
            }}
            onCodeChange={handleCodeGenerated}
            refreshNonce={refreshNonce}
            error={codeError}
          />

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-[#006A4E] hover:bg-[#00523C] disabled:opacity-60 text-white font-semibold text-sm rounded-lg transition-colors cursor-pointer"
          >
            {submitting
              ? language === 'bn'
                ? 'নিবন্ধন সম্পন্ন হচ্ছে...'
                : 'Creating Account...'
              : language === 'bn'
                ? 'নাগরিক নিবন্ধন সম্পন্ন করুন'
                : 'Complete Citizen Registration'}
          </button>

          <div className="pt-3 border-t border-slate-100 text-center text-sm text-[#4B5563]">
            <Link
              href={redirectParam ? `/login?redirect=${encodeURIComponent(redirectParam)}` : '/login'}
              className="font-semibold text-[#006A4E] hover:text-[#00523C] hover:underline"
            >
              {language === 'bn'
                ? 'ইতিমধ্যে অ্যাকাউন্ট আছে? লগইন করুন'
                : 'Already registered? Sign In'}
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-2xl mx-auto px-4 py-16 text-center text-sm text-slate-500">
          Loading registration form...
        </div>
      }
    >
      <RegisterFormContent />
    </Suspense>
  );
}
