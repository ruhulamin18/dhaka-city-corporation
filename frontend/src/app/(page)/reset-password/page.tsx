'use client';

import React, { Suspense, useCallback, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  Landmark,
  Lock,
  Phone,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { SecurityCodeField } from '@/components/SecurityCodeField';

type ResetStep = 'phone' | 'otp_and_password' | 'success';

function ResetPasswordForm() {
  const router = useRouter();
  const { language } = useApp();

  const [step, setStep] = useState<ResetStep>('phone');
  const [phone, setPhone] = useState('01816648095');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Security code for Step 1
  const [expectedCode, setExpectedCode] = useState('');
  const [enteredCode, setEnteredCode] = useState('');
  const [refreshNonce, setRefreshNonce] = useState(0);

  // Feedback states
  const [formError, setFormError] = useState('');
  const [codeError, setCodeError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [demoOtpNotice, setDemoOtpNotice] = useState(false);

  const handleCodeGenerated = useCallback((code: string) => {
    setExpectedCode(code);
  }, []);

  const triggerCodeRegeneration = () => {
    setEnteredCode('');
    setRefreshNonce((n) => n + 1);
  };

  // Step 1: Validate phone and captcha, then generate demo OTP
  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setCodeError('');

    const cleanPhone = phone.replace(/[\s-]/g, '').trim();
    if (!/^01[3-9]\d{8}$/.test(cleanPhone)) {
      setFormError(
        language === 'bn'
          ? 'সঠিক ১১ ডিজিটের মোবাইল নম্বর লিখুন (যেমন: 017XXXXXXXX)।'
          : 'Please enter a valid 11-digit Bangladeshi mobile number.'
      );
      triggerCodeRegeneration();
      return;
    }

    if (!enteredCode.trim() || enteredCode.trim() !== expectedCode) {
      setCodeError(
        language === 'bn'
          ? 'নিরাপত্তা কোডটি সঠিক নয়, আবার চেষ্টা করুন।'
          : 'Verification code does not match. Please try again.'
      );
      triggerCodeRegeneration();
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setStep('otp_and_password');
      setDemoOtpNotice(true);
    }, 600);
  };

  // Step 2: Validate OTP and New Password
  const handleOtpAndPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    const cleanOtp = otp.trim();
    if (cleanOtp !== '123456') {
      setFormError(
        language === 'bn'
          ? 'ওটিপি কোডটি সঠিক নয়। ডেমো ওটিপি হিসেবে 123456 ব্যবহার করুন।'
          : 'Invalid OTP code. Please enter demo OTP 123456.'
      );
      return;
    }

    if (newPassword.length < 6) {
      setFormError(
        language === 'bn'
          ? 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।'
          : 'Password must be at least 6 characters long.'
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setFormError(
        language === 'bn'
          ? 'পাসওয়ার্ড ও নিশ্চিত পাসওয়ার্ড মেলেনি।'
          : 'Password and Confirm Password do not match.'
      );
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setStep('success');
    }, 800);
  };

  return (
    <div className="w-full max-w-md mx-auto animate-in fade-in slide-in-from-bottom-3 duration-300">
      {/* Centered Glassmorphic/White Civic Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:border-slate-300/80">
        {/* Deep Civic Green Header */}
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
              <KeyRound className="w-3 h-3" />
              <span>{language === 'bn' ? 'সুরক্ষিত রিকভারি' : 'Secure Recovery'}</span>
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
            {language === 'bn' ? 'পাসওয়ার্ড পরিবর্তন ও পুনরুদ্ধার' : 'Reset Portal Password'}
          </h1>
          <p className="text-xs text-emerald-100/90 mt-1">
            {step === 'phone'
              ? language === 'bn'
                ? 'আপনার রেজিস্টার্ড মোবাইল নম্বরে এসএমএস ওটিপি পাঠানো হবে'
                : 'An SMS verification OTP will be dispatched to your registered mobile number'
              : step === 'otp_and_password'
              ? language === 'bn'
                ? '৬ ডিজিটের ওটিপি যাচাই করে নতুন পাসওয়ার্ড সেট করুন'
                : 'Verify 6-digit OTP code and set your new account password'
              : language === 'bn'
              ? 'আপনার স্মার্ট সিটি অ্যাকাউন্ট পাসওয়ার্ড সফলভাবে আপডেট হয়েছে'
              : 'Your portal security password has been updated successfully'}
          </p>
        </div>

        {/* Card Body */}
        <div className="p-6 sm:p-7">
          {/* Subtle Demo OTP Toast / Note after Step 1 */}
          {demoOtpNotice && step === 'otp_and_password' && (
            <div className="mb-5 p-3.5 rounded-xl bg-[#ECFDF5] border border-emerald-300 text-emerald-950 text-xs flex items-start gap-2.5 shadow-2xs animate-in fade-in duration-200">
              <Sparkles className="w-4 h-4 text-[#006A4E] shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <p className="font-bold text-[#006A4E]">
                  {language === 'bn' ? 'পরীক্ষামূলক এসএমএস ওটিপি' : 'Demo SMS OTP Received'}
                </p>
                <p className="text-emerald-900">
                  {language === 'bn'
                    ? 'আপনার মোবাইল নম্বরে পাঠানো টেস্ট কোড: '
                    : 'Testing OTP code sent to your mobile: '}
                  <span className="font-mono font-bold text-[#006A4E] bg-emerald-100/80 px-1.5 py-0.5 rounded border border-emerald-300">
                    123456
                  </span>
                </p>
              </div>
            </div>
          )}

          {/* Form Error Banner */}
          {formError && (
            <div
              role="alert"
              className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-start gap-2.5 animate-in fade-in duration-200"
            >
              <AlertCircle className="w-4 h-4 text-[#C81E1E] shrink-0 mt-0.5" />
              <span>{formError}</span>
            </div>
          )}

          {/* STEP 1: Enter Mobile Number & Captcha */}
          {step === 'phone' && (
            <form onSubmit={handlePhoneSubmit} className="space-y-4" noValidate>
              <div>
                <label
                  htmlFor="reset-phone"
                  className="block text-xs font-bold text-[#111827] mb-1.5"
                >
                  {language === 'bn' ? 'রেজিস্টার্ড মোবাইল নম্বর' : 'Registered Mobile Number'}
                  <span className="text-red-500 ml-0.5">*</span>
                </label>
                <div className="relative">
                  <input
                    id="reset-phone"
                    type="tel"
                    inputMode="numeric"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="01816648095"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm text-[#111827] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#006A4E] focus:border-transparent font-mono transition-all duration-200"
                  />
                </div>
              </div>

              {/* 6-Digit Captcha */}
              <div className="pt-1">
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

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-bold text-white bg-[#006A4E] hover:bg-[#00523C] hover:-translate-y-0.5 hover:shadow-sm active:translate-y-0 disabled:opacity-60 transition-all duration-300 shadow-xs cursor-pointer focus-visible:outline-2 focus-visible:outline-[#006A4E]"
                >
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>{language === 'bn' ? 'যাচাই হচ্ছে...' : 'Verifying...'}</span>
                    </>
                  ) : (
                    <>
                      <span>{language === 'bn' ? 'ওটিপি কোড পাঠান' : 'Send OTP Code'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: Enter OTP & New Password */}
          {step === 'otp_and_password' && (
            <form onSubmit={handleOtpAndPasswordSubmit} className="space-y-4" noValidate>
              {/* 6-Digit OTP */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label
                    htmlFor="reset-otp"
                    className="block text-xs font-bold text-[#111827]"
                  >
                    {language === 'bn' ? '৬ ডিজিটের এসএমএস ওটিপি' : '6-Digit SMS OTP'}
                    <span className="text-red-500 ml-0.5">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setOtp('123456');
                      setFormError('');
                    }}
                    className="text-xs font-semibold text-[#006A4E] hover:underline cursor-pointer"
                  >
                    {language === 'bn' ? 'কোড পূরণ করুন (123456)' : 'Autofill (123456)'}
                  </button>
                </div>
                <input
                  id="reset-otp"
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="123456"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm font-mono tracking-[0.25em] text-[#111827] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#006A4E] focus:border-transparent transition-all duration-200 tabular-nums"
                />
              </div>

              {/* New Password */}
              <div>
                <label
                  htmlFor="new-password"
                  className="block text-xs font-bold text-[#111827] mb-1.5"
                >
                  {language === 'bn' ? 'নতুন পাসওয়ার্ড (ন্যূনতম ৬ অক্ষর)' : 'New Password (min 6 chars)'}
                  <span className="text-red-500 ml-0.5">*</span>
                </label>
                <div className="relative">
                  <input
                    id="new-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-3.5 pr-10 py-2.5 rounded-xl border border-slate-300 bg-white text-sm text-[#111827] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#006A4E] focus:border-transparent transition-all duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm New Password */}
              <div>
                <label
                  htmlFor="confirm-new-password"
                  className="block text-xs font-bold text-[#111827] mb-1.5"
                >
                  {language === 'bn' ? 'নতুন পাসওয়ার্ড নিশ্চিত করুন' : 'Confirm New Password'}
                  <span className="text-red-500 ml-0.5">*</span>
                </label>
                <div className="relative">
                  <input
                    id="confirm-new-password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-3.5 pr-10 py-2.5 rounded-xl border border-slate-300 bg-white text-sm text-[#111827] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#006A4E] focus:border-transparent transition-all duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-2 flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setStep('phone');
                    setFormError('');
                  }}
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 transition-all duration-200 cursor-pointer shrink-0"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>{language === 'bn' ? 'পেছনে' : 'Back'}</span>
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-[#006A4E] hover:bg-[#00523C] hover:-translate-y-0.5 hover:shadow-sm active:translate-y-0 disabled:opacity-60 transition-all duration-300 shadow-xs cursor-pointer focus-visible:outline-2 focus-visible:outline-[#006A4E]"
                >
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>{language === 'bn' ? 'আপডেট হচ্ছে...' : 'Updating...'}</span>
                    </>
                  ) : (
                    <>
                      <span>{language === 'bn' ? 'পাসওয়ার্ড নিশ্চিত করুন' : 'Confirm Password'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: Success State */}
          {step === 'success' && (
            <div className="text-center py-4 space-y-4 animate-in fade-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-full bg-[#ECFDF5] border border-emerald-300 text-[#006A4E] flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <div className="space-y-1">
                <h2 className="text-lg font-bold text-[#111827]">
                  {language === 'bn'
                    ? 'পাসওয়ার্ড সফলভাবে পরিবর্তিত হয়েছে!'
                    : 'Password Changed Successfully!'}
                </h2>
                <p className="text-xs text-[#4B5563] max-w-xs mx-auto">
                  {language === 'bn'
                    ? 'আপনার নতুন পাসওয়ার্ড দিয়ে এখনই নাগরিক পোর্টালে লগইন করতে পারেন।'
                    : 'You can now sign in to your citizen account using your updated password.'}
                </p>
              </div>

              <div className="pt-2">
                <Link
                  href="/login"
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-bold text-white bg-[#006A4E] hover:bg-[#00523C] hover:-translate-y-0.5 hover:shadow-sm active:translate-y-0 transition-all duration-300 shadow-xs"
                >
                  <span>{language === 'bn' ? 'নাগরিক লগইন করুন' : 'Sign In Now'}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Footer Link back to login */}
        <Link
          href="/login"
          className="bg-slate-50 hover:bg-[#ECFDF5] border-t border-slate-200/80 px-6 py-3.5 flex items-center justify-between gap-3 text-xs transition-all duration-300 group cursor-pointer"
        >
          <div className="flex items-center gap-2 text-slate-600 group-hover:text-slate-800 transition-colors">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-medium">
              {language === 'bn'
                ? 'পাসওয়ার্ড মনে পড়েছে?'
                : 'Remembered your password?'}
            </span>
          </div>
          <span className="inline-flex items-center gap-1 font-bold text-[#006A4E] group-hover:text-[#00523C] group-hover:translate-x-1 transition-all duration-300 shrink-0">
            <span>{language === 'bn' ? 'লগইন পৃষ্ঠায় ফিরে যান →' : 'Return to Login →'}</span>
          </span>
        </Link>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-[calc(100vh-140px)] bg-slate-50/60 py-10 sm:py-16 px-4 sm:px-6 flex items-center justify-center">
      <Suspense
        fallback={
          <div className="w-full max-w-md mx-auto p-8 bg-white rounded-3xl border border-slate-200 shadow-md text-center">
            <div className="w-8 h-8 border-3 border-[#006A4E] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs text-slate-500 font-semibold">
              রিকভারি পৃষ্ঠা লোড হচ্ছে...
            </p>
          </div>
        }
      >
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
