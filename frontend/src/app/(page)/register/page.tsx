'use client';

import React, { Suspense, useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  AlertCircle,
  ArrowRight,
  Eye,
  EyeOff,
  Landmark,
  LogIn,
  UserCheck,
  UserPlus,
} from 'lucide-react';
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

    // 1. Validation
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
          ? 'জাতীয় পরিচয়পত্র (NID) নম্বর ১০ অথবা ১৭ ডিজিটের হতে হবে।'
          : 'National ID (NID) must be strictly 10 or 17 digits.'
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

    // 2. Security Code Check
    if (!enteredCode.trim() || enteredCode.trim() !== expectedCode) {
      setCodeError(
        language === 'bn'
          ? 'নিরাপত্তা কোডটি সঠিক নয়, আবার চেষ্টা করুন।'
          : 'Verification code does not match. Please try again.'
      );
      regenerateCode();
      return;
    }

    // 3. Register citizen
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
            ? res.errorBn || 'নিবন্ধন সম্পন্ন করা যায়নি।'
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
    <div className="w-full max-w-xl mx-auto animate-in fade-in slide-in-from-bottom-3 duration-300">
      {/* Centered Modern Civic Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:border-slate-300/80">
        {/* Header */}
        <div className="bg-[#006A4E] text-white px-7 py-6 relative">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2 text-emerald-200 text-xs font-semibold tracking-wide">
              <Landmark className="w-4 h-4 shrink-0" />
              <span>
                {language === 'bn'
                  ? 'ঢাকা স্মার্ট সিটি কর্পোরেশন'
                  : 'Dhaka Smart City Corporation'}
              </span>
            </div>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/15 text-emerald-100 border border-white/20">
              <UserPlus className="w-3 h-3" />
              <span>{language === 'bn' ? 'নাগরিক সেবা' : 'Citizen Service'}</span>
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
            {language === 'bn' ? 'নতুন নাগরিক অ্যাকাউন্ট তৈরি করুন' : 'Create Citizen Account'}
          </h1>
          <p className="text-xs text-emerald-100/90 mt-1">
            {language === 'bn'
              ? 'নাগরিক সেবা, ট্যাক্স পেমেন্ট, হোল্ডিং কর ও অনলাইন প্রত্যয়নের জন্য ডিজিটাল প্রোফাইল খুলুন'
              : 'Create your municipal profile for certificates, tax payments and civic utilities'}
          </p>
        </div>

        {/* Form Body */}
        <div className="p-6 sm:p-7">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div className="sm:col-span-2">
                <label
                  htmlFor="reg-fullname"
                  className="block text-xs font-bold text-[#111827] mb-1.5"
                >
                  {language === 'bn' ? 'পূর্ণ নাম (এনআইডি অনুযায়ী)' : 'Full Name (As per NID)'}
                  <span className="text-red-500 ml-0.5">*</span>
                </label>
                <input
                  id="reg-fullname"
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder={language === 'bn' ? 'যেমন: মো: তানভীর আহমেদ' : 'e.g. Md. Tanvir Ahmed'}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm text-[#111827] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#006A4E] focus:border-transparent transition-all duration-200"
                />
              </div>

              {/* Mobile Phone */}
              <div>
                <label
                  htmlFor="reg-phone"
                  className="block text-xs font-bold text-[#111827] mb-1.5"
                >
                  {language === 'bn' ? '১১ ডিজিটের মোবাইল নম্বর' : '11-Digit Mobile Number'}
                  <span className="text-red-500 ml-0.5">*</span>
                </label>
                <input
                  id="reg-phone"
                  type="tel"
                  inputMode="numeric"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="01816648095"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm text-[#111827] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#006A4E] focus:border-transparent font-mono transition-all duration-200"
                />
              </div>

              {/* NID */}
              <div>
                <label
                  htmlFor="reg-nid"
                  className="block text-xs font-bold text-[#111827] mb-1.5"
                >
                  {language === 'bn' ? 'এনআইডি (১০ বা ১৭ ডিজিট)' : 'NID (10 or 17 Digits)'}
                  <span className="text-red-500 ml-0.5">*</span>
                </label>
                <input
                  id="reg-nid"
                  type="text"
                  inputMode="numeric"
                  required
                  value={nid}
                  onChange={(e) => setNid(e.target.value.replace(/\D/g, '').slice(0, 17))}
                  placeholder="1992269184723"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm text-[#111827] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#006A4E] focus:border-transparent font-mono transition-all duration-200"
                />
              </div>

              {/* Ward Select */}
              <div className="sm:col-span-2">
                <label
                  htmlFor="reg-ward"
                  className="block text-xs font-bold text-[#111827] mb-1.5"
                >
                  {language === 'bn' ? 'আবাসিক ওয়ার্ড নির্বাচন করুন' : 'Select Residential Ward'}
                  <span className="text-red-500 ml-0.5">*</span>
                </label>
                <select
                  id="reg-ward"
                  value={wardNumber}
                  onChange={(e) => setWardNumber(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#006A4E] focus:border-transparent transition-all duration-200 cursor-pointer"
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

              {/* Password */}
              <div>
                <label
                  htmlFor="reg-password"
                  className="block text-xs font-bold text-[#111827] mb-1.5"
                >
                  {language === 'bn' ? 'পাসওয়ার্ড (ন্যূনতম ৬ অক্ষর)' : 'Password (min 6 chars)'}
                  <span className="text-red-500 ml-0.5">*</span>
                </label>
                <div className="relative">
                  <input
                    id="reg-password"
                    type={showPass ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-3.5 pr-10 py-2.5 rounded-xl border border-slate-300 bg-white text-sm text-[#111827] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#006A4E] focus:border-transparent transition-all duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    aria-label={showPass ? 'Hide password' : 'Show password'}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer transition-colors"
                  >
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label
                  htmlFor="reg-confirm-password"
                  className="block text-xs font-bold text-[#111827] mb-1.5"
                >
                  {language === 'bn' ? 'পাসওয়ার্ড নিশ্চিত করুন' : 'Confirm Password'}
                  <span className="text-red-500 ml-0.5">*</span>
                </label>
                <div className="relative">
                  <input
                    id="reg-confirm-password"
                    type={showConfirmPass ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-3.5 pr-10 py-2.5 rounded-xl border border-slate-300 bg-white text-sm text-[#111827] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#006A4E] focus:border-transparent transition-all duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPass(!showConfirmPass)}
                    aria-label={showConfirmPass ? 'Hide confirm password' : 'Show confirm password'}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer transition-colors"
                  >
                    {showConfirmPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Security Code */}
            <div className="pt-2">
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
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-bold text-white bg-[#006A4E] hover:bg-[#00523C] hover:-translate-y-0.5 hover:shadow-sm active:translate-y-0 disabled:opacity-60 transition-all duration-300 shadow-xs cursor-pointer focus-visible:outline-2 focus-visible:outline-[#006A4E]"
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>
                      {language === 'bn' ? 'নিবন্ধন সম্পন্ন হচ্ছে...' : 'Creating Account...'}
                    </span>
                  </>
                ) : (
                  <>
                    <UserCheck className="w-4 h-4" />
                    <span>
                      {language === 'bn'
                        ? 'নাগরিক নিবন্ধন সম্পন্ন করুন'
                        : 'Complete Citizen Registration'}
                    </span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Footer Link to Login with Interactive Hover */}
        <Link
          href={redirectParam ? `/login?redirect=${encodeURIComponent(redirectParam)}` : '/login'}
          className="bg-slate-50 hover:bg-[#ECFDF5] border-t border-slate-200/80 px-6 py-3.5 flex items-center justify-between gap-3 text-xs transition-all duration-300 group cursor-pointer"
        >
          <div className="flex items-center gap-2 text-slate-600 group-hover:text-slate-800 transition-colors">
            <LogIn className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-medium">
              {language === 'bn'
                ? 'ইতিমধ্যে স্মার্ট সিটি অ্যাকাউন্ট আছে?'
                : 'Already have a Smart City account?'}
            </span>
          </div>
          <span className="inline-flex items-center gap-1 font-bold text-[#006A4E] group-hover:text-[#00523C] group-hover:translate-x-1 transition-all duration-300 shrink-0">
            <span>{language === 'bn' ? 'সরাসরি লগইন করুন →' : 'Sign In Directly →'}</span>
          </span>
        </Link>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <div className="min-h-[calc(100vh-140px)] bg-slate-50/60 py-10 sm:py-16 px-4 sm:px-6 flex items-center justify-center">
      <Suspense
        fallback={
          <div className="w-full max-w-xl mx-auto p-8 bg-white rounded-3xl border border-slate-200 shadow-md text-center">
            <div className="w-8 h-8 border-3 border-[#006A4E] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs text-slate-500 font-semibold">
              নিবন্ধন পৃষ্ঠা লোড হচ্ছে...
            </p>
          </div>
        }
      >
        <RegisterFormContent />
      </Suspense>
    </div>
  );
}
