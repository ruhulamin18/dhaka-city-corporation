'use client';

import React, { Suspense, useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  AlertCircle,
  Briefcase,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  Info,
  KeyRound,
  Landmark,
  ShieldCheck,
  User,
  Sparkles,
  X,
  CheckCircle2,
  ArrowRight,
  Building2,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
import { DEMO_CREDENTIALS, getDashboardPathForRole } from '@/services/mockApi';
import { AuthRole, OfficialRole } from '@/types';
import { SecurityCodeField } from '@/components/SecurityCodeField';

type LoginTab = 'citizen' | 'official';

function isRedirectAllowedForRole(redirectPath: string, role: AuthRole): boolean {
  if (!redirectPath.startsWith('/') || redirectPath.startsWith('//')) return false;
  if (redirectPath.startsWith('/admin') || redirectPath.startsWith('/dashboard/admin')) return role === 'admin' || role === 'officer';
  if (redirectPath.startsWith('/citizen') || redirectPath.startsWith('/dashboard/citizen')) return role === 'citizen';
  if (redirectPath.startsWith('/dashboard/officer')) return role === 'officer' || role === 'admin';
  if (redirectPath.startsWith('/dashboard/staff')) return role === 'staff';
  return true;
}

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectParam = searchParams.get('redirect') || '';

  const { language } = useApp();
  const { user, isAuthenticated, loginCitizen, loginOfficial } = useAuth();

  const [activeTab, setActiveTab] = useState<LoginTab>('citizen');

  // Citizen fields
  const [phone, setPhone] = useState('');
  const [citizenPassword, setCitizenPassword] = useState('');
  const [showCitizenPass, setShowCitizenPass] = useState(false);

  // Official fields
  const [employeeId, setEmployeeId] = useState('');
  const [officialPassword, setOfficialPassword] = useState('');
  const [showOfficialPass, setShowOfficialPass] = useState(false);
  const [officialRole, setOfficialRole] = useState<OfficialRole>('admin');

  // Security code state
  const [expectedCode, setExpectedCode] = useState('');
  const [enteredCode, setEnteredCode] = useState('');
  const [refreshNonce, setRefreshNonce] = useState(0);

  // Feedback state
  const [formError, setFormError] = useState('');
  const [codeError, setCodeError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showDemoBox, setShowDemoBox] = useState(true);
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [demoNotice, setDemoNotice] = useState('');

  // If already logged in, redirect cleanly
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

  const handleTabSwitch = (nextTab: LoginTab) => {
    if (nextTab === activeTab) return;
    setActiveTab(nextTab);
    setFormError('');
    setCodeError('');
    setDemoNotice('');
    triggerCodeRegeneration();
  };

  const handleSelectDemoProfile = (
    role: 'citizen' | 'ward_officer' | 'dept_officer' | 'admin'
  ) => {
    setFormError('');
    setCodeError('');

    if (role === 'citizen') {
      setActiveTab('citizen');
      setPhone('01816648095');
      setCitizenPassword('citizen123');
      setDemoNotice(
        language === 'bn'
          ? 'সিটিজেন পোর্টাল (মো: রুহুল আমিন) তথ্য লোড হয়েছে। লগইন বাটনে ক্লিক করুন।'
          : 'Citizen Portal (Md. Ruhul Amin) credentials populated. Click Sign In.'
      );
    } else if (role === 'ward_officer') {
      setActiveTab('official');
      setOfficialRole('officer');
      setEmployeeId('ward.officer@dscc.gov.bd');
      setOfficialPassword('ward123');
      setDemoNotice(
        language === 'bn'
          ? 'ওয়ার্ড কর্মকর্তা (ওয়ার্ড ১৯) তথ্য লোড হয়েছে। লগইন বাটনে ক্লিক করুন।'
          : 'Ward Officer (Ward 19) credentials populated. Click Sign In.'
      );
    } else if (role === 'dept_officer') {
      setActiveTab('official');
      setOfficialRole('officer');
      setEmployeeId('dept.officer@dscc.gov.bd');
      setOfficialPassword('officer123');
      setDemoNotice(
        language === 'bn'
          ? 'বিভাগীয় কর্মকর্তা (রাজস্ব ও প্রকৌশল) তথ্য লোড হয়েছে।'
          : 'Department Officer credentials populated. Click Sign In.'
      );
    } else {
      setActiveTab('official');
      setOfficialRole('admin');
      setEmployeeId('admin@dscc.gov.bd');
      setOfficialPassword('admin123');
      setDemoNotice(
        language === 'bn'
          ? 'অ্যাডমিন পোর্টাল (মেয়র সচিবালয়) তথ্য লোড হয়েছে।'
          : 'Admin Portal (Super Admin) credentials populated. Click Sign In.'
      );
    }

    // Auto sync security code for immediate smooth testing
    if (expectedCode) {
      setEnteredCode(expectedCode);
    }
    setIsDemoModalOpen(false);
  };

  const handleQuickFillCitizen = () => {
    const citizenDemo = DEMO_CREDENTIALS.find((c) => c.role === 'citizen');
    if (!citizenDemo) return;
    setActiveTab('citizen');
    setPhone(citizenDemo.identifier);
    setCitizenPassword(citizenDemo.password);
    setFormError('');
    setCodeError('');
  };

  const handleApplyDemoCredential = (role: AuthRole, identifier: string, password: string) => {
    setFormError('');
    setCodeError('');
    if (role === 'citizen') {
      if (activeTab !== 'citizen') {
        setActiveTab('citizen');
        triggerCodeRegeneration();
      }
      setPhone(identifier);
      setCitizenPassword(password);
    } else {
      if (activeTab !== 'official') {
        setActiveTab('official');
        triggerCodeRegeneration();
      }
      setOfficialRole(role);
      setEmployeeId(identifier);
      setOfficialPassword(password);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setCodeError('');

    // Step 1: Validate Mobile/ID and Password FIRST
    if (activeTab === 'citizen') {
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
      if (!citizenPassword.trim()) {
        setFormError(
          language === 'bn' ? 'অনুগ্রহ করে পাসওয়ার্ড লিখুন।' : 'Please enter your password.'
        );
        triggerCodeRegeneration();
        return;
      }
    } else {
      if (!employeeId.trim()) {
        setFormError(
          language === 'bn'
            ? 'অফিসিয়াল এমপ্লয়ি আইডি অথবা ইমেইল লিখুন।'
            : 'Please enter your Official Employee ID or Email.'
        );
        triggerCodeRegeneration();
        return;
      }
      if (!officialPassword.trim()) {
        setFormError(
          language === 'bn' ? 'অনুগ্রহ করে পাসওয়ার্ড লিখুন।' : 'Please enter your password.'
        );
        triggerCodeRegeneration();
        return;
      }
    }

    // Step 2: Strictly compare 6-digit Security Code
    if (!enteredCode.trim() || enteredCode.trim() !== expectedCode) {
      setCodeError(
        language === 'bn'
          ? 'নিরাপত্তা কোডটি সঠিক নয়, আবার চেষ্টা করুন।'
          : 'Verification code does not match. Please try again.'
      );
      triggerCodeRegeneration();
      return;
    }

    // Step 3: Authenticate via AuthContext -> mockApi
    setSubmitting(true);
    try {
      const res =
        activeTab === 'citizen'
          ? await loginCitizen(phone, citizenPassword)
          : await loginOfficial(employeeId, officialPassword, officialRole);

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
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Auth Form Card */}
        <div className="lg:col-span-7 civic-card bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden shadow-sm">
          {/* Header */}
          <div className="bg-[#006A4E] text-white px-6 py-5">
            <div className="flex items-center gap-2.5 text-emerald-200 text-xs font-semibold mb-1">
              <Landmark className="w-4 h-4" />
              <span>
                {language === 'bn'
                  ? 'ঢাকা স্মার্ট সিটি ইউনিফাইড সাইন-ইন'
                  : 'Dhaka Smart City Unified Sign-In'}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold">
              {language === 'bn' ? 'নাগরিক ও অফিসিয়াল লগইন' : 'Citizen & Official Portal Login'}
            </h1>
            {redirectParam && (
              <p className="text-xs text-emerald-100 mt-1.5">
                {language === 'bn'
                  ? 'অনুরোধকৃত সেবায় প্রবেশ করতে অনুগ্রহ করে লগইন করুন।'
                  : 'Please sign in to continue to your requested municipal service.'}
              </p>
            )}
          </div>

          {/* Two Login Tabs */}
          <div className="p-6 pb-0">
            <div className="grid grid-cols-2 gap-1.5 p-1 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
              <button
                type="button"
                onClick={() => handleTabSwitch('citizen')}
                className={`inline-flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  activeTab === 'citizen'
                    ? 'bg-[#006A4E] text-white shadow-xs'
                    : 'text-[#4B5563] hover:text-[#111827]'
                }`}
              >
                <User className={`w-4 h-4 ${activeTab === 'citizen' ? 'text-emerald-200' : 'text-[#006A4E]'}`} />
                <span>{language === 'bn' ? 'নাগরিক লগইন' : 'Citizen Login'}</span>
              </button>
              <button
                type="button"
                onClick={() => handleTabSwitch('official')}
                className={`inline-flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  activeTab === 'official'
                    ? 'bg-[#006A4E] text-white shadow-xs'
                    : 'text-[#4B5563] hover:text-[#111827]'
                }`}
              >
                <Briefcase className={`w-4 h-4 ${activeTab === 'official' ? 'text-emerald-200' : 'text-[#006A4E]'}`} />
                <span>{language === 'bn' ? 'অফিসিয়াল লগইন' : 'Official / Staff Login'}</span>
              </button>
            </div>
          </div>

          {/* Form Body */}
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

            {activeTab === 'citizen' ? (
              <>
                <div className="flex items-center justify-between">
                  <label htmlFor="citizen-phone" className="text-xs font-semibold text-[#111827]">
                    {language === 'bn'
                      ? 'মোবাইল নম্বর (১১ ডিজিট)'
                      : 'Mobile Number (11-Digit BD Format)'}
                  </label>
                  <button
                    type="button"
                    onClick={handleQuickFillCitizen}
                    className="text-xs font-semibold text-[#006A4E] hover:text-[#00523C] hover:underline cursor-pointer"
                  >
                    {language === 'bn' ? 'ডেমো তথ্য পূরণ করুন' : 'Demo Quick-Fill'}
                  </button>
                </div>
                <input
                  id="citizen-phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="01711482910"
                  className="w-full px-3.5 py-2.5 text-sm font-mono border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006A4E] tabular-nums"
                />

                <div>
                  <label
                    htmlFor="citizen-password"
                    className="block text-xs font-semibold text-[#111827] mb-1"
                  >
                    {language === 'bn' ? 'পাসওয়ার্ড' : 'Password'}
                  </label>
                  <div className="relative">
                    <input
                      id="citizen-password"
                      type={showCitizenPass ? 'text' : 'password'}
                      value={citizenPassword}
                      onChange={(e) => setCitizenPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-3.5 pr-11 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006A4E]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCitizenPass(!showCitizenPass)}
                      aria-label={showCitizenPass ? 'Hide password' : 'Show password'}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#111827] cursor-pointer"
                    >
                      {showCitizenPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div>
                  <label
                    htmlFor="official-role"
                    className="block text-xs font-semibold text-[#111827] mb-1"
                  >
                    {language === 'bn' ? 'অফিসিয়াল পদবি (রোল)' : 'Official Role'}
                  </label>
                  <select
                    id="official-role"
                    value={officialRole}
                    onChange={(e) => setOfficialRole(e.target.value as OfficialRole)}
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#006A4E]"
                  >
                    <option value="admin">
                      {language === 'bn' ? 'অ্যাডমিন / মেয়র' : 'Admin / Mayor'}
                    </option>
                    <option value="officer">
                      {language === 'bn'
                        ? 'বিভাগীয় কর্মকর্তা / কাউন্সিলর'
                        : 'Department Officer / Councillor'}
                    </option>
                    <option value="staff">
                      {language === 'bn' ? 'ফিল্ড স্টাফ / মাঠকর্মী' : 'Field Staff'}
                    </option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="official-id"
                    className="block text-xs font-semibold text-[#111827] mb-1"
                  >
                    {language === 'bn'
                      ? 'অফিসিয়াল এমপ্লয়ি আইডি বা ইমেইল'
                      : 'Official Employee ID / Email'}
                  </label>
                  <input
                    id="official-id"
                    type="text"
                    value={employeeId}
                    onChange={(e) => setEmployeeId(e.target.value)}
                    placeholder="admin@dscc.gov.bd or EMP-ADM-001"
                    className="w-full px-3.5 py-2.5 text-sm font-mono border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006A4E]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="official-password"
                    className="block text-xs font-semibold text-[#111827] mb-1"
                  >
                    {language === 'bn' ? 'পাসওয়ার্ড' : 'Password'}
                  </label>
                  <div className="relative">
                    <input
                      id="official-password"
                      type={showOfficialPass ? 'text' : 'password'}
                      value={officialPassword}
                      onChange={(e) => setOfficialPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-3.5 pr-11 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006A4E]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowOfficialPass(!showOfficialPass)}
                      aria-label={showOfficialPass ? 'Hide password' : 'Show password'}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#111827] cursor-pointer"
                    >
                      {showOfficialPass ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-start gap-2 p-3 rounded-lg bg-[#ECFDF5] border border-emerald-200 text-xs text-[#4B5563]">
                  <Info className="w-4 h-4 text-[#006A4E] shrink-0 mt-0.5" />
                  <span>
                    {language === 'bn'
                      ? 'অফিসিয়াল অ্যাকাউন্ট সিটি কর্পোরেশন অ্যাডমিন কর্তৃক ইস্যু করা হয়; এখানে স্ব-নিবন্ধন প্রযোজ্য নয়।'
                      : 'Official accounts are issued by City Corporation Admin. Self-registration is disabled for staff.'}
                  </span>
                </div>
              </>
            )}

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

            {demoNotice && (
              <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-800 font-medium flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{demoNotice}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setDemoNotice('')}
                  className="text-emerald-700 hover:text-emerald-900"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Login & Demo Access Buttons Side by Side */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsDemoModalOpen(true)}
                className="py-3 px-4 sm:px-5 bg-emerald-50 hover:bg-emerald-100 text-[#006A4E] border-2 border-emerald-400 font-bold text-xs sm:text-sm rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 shrink-0 shadow-xs hover:shadow-sm active:scale-[0.98]"
                title={language === 'bn' ? 'ডেমো অ্যাকাউন্ট দিয়ে এক ক্লিকে প্রবেশ' : 'One-click Demo Access'}
              >
                <Sparkles className="w-4 h-4 text-[#006A4E]" />
                <span>{language === 'bn' ? 'ডেমো অ্যাক্সেস' : 'Demo Access'}</span>
              </button>

              <button
                type="submit"
                disabled={submitting}
                className="flex-1 py-3 bg-[#006A4E] hover:bg-[#00523C] disabled:opacity-60 text-white font-semibold text-sm rounded-lg transition-colors cursor-pointer shadow-md flex items-center justify-center gap-2"
              >
                <span>
                  {submitting
                    ? language === 'bn'
                      ? 'যাচাই করা হচ্ছে...'
                      : 'Verifying...'
                    : activeTab === 'citizen'
                      ? language === 'bn'
                        ? 'নাগরিক লগইন'
                        : 'Citizen Sign In'
                      : language === 'bn'
                        ? 'অফিসিয়াল লগইন'
                        : 'Official Sign In'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {activeTab === 'citizen' && (
              <div className="pt-3 border-t border-slate-100 text-center text-sm text-[#4B5563]">
                <Link
                  href={
                    redirectParam
                      ? `/register?redirect=${encodeURIComponent(redirectParam)}`
                      : '/register'
                  }
                  className="font-semibold text-[#006A4E] hover:text-[#00523C] hover:underline"
                >
                  {language === 'bn'
                    ? 'নতুন নাগরিক? নিবন্ধন করুন'
                    : 'New Citizen? Register Here'}
                </Link>
              </div>
            )}
          </form>
        </div>

        {/* Right Side: Collapsible Demo Credentials & RBAC Info */}
        <div className="lg:col-span-5 space-y-5">
          <div className="civic-card bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden">
            <button
              type="button"
              onClick={() => setShowDemoBox(!showDemoBox)}
              className="w-full px-5 py-4 bg-[#ECFDF5] border-b border-emerald-200/70 flex items-center justify-between text-left cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-[#006A4E]" />
                <span className="text-sm font-bold text-[#111827]">
                  {language === 'bn' ? 'ডেমো লগইন তথ্য (পরীক্ষার জন্য)' : 'Demo Credentials'}
                </span>
              </div>
              {showDemoBox ? (
                <ChevronUp className="w-4 h-4 text-[#006A4E]" />
              ) : (
                <ChevronDown className="w-4 h-4 text-[#006A4E]" />
              )}
            </button>

            {showDemoBox && (
              <div className="p-5 space-y-3">
                <p className="text-xs text-[#4B5563] leading-relaxed">
                  {language === 'bn'
                    ? 'যেকোনো রোলের তথ্য অটো-ফিল করতে নিচে ক্লিক করুন, এরপর নিরাপত্তা কোডটি নিজে টাইপ করে লগইন করুন।'
                    : 'Click any account below to pre-fill credentials, then manually enter the live 6-digit security code to sign in.'}
                </p>

                {DEMO_CREDENTIALS.map((cred) => (
                  <div
                    key={cred.role}
                    className="p-3.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] space-y-2"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-[#111827]">
                        {language === 'bn' ? cred.labelBn : cred.labelEn}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          handleApplyDemoCredential(cred.role, cred.identifier, cred.password)
                        }
                        className="px-2.5 py-1 text-[11px] font-semibold bg-white border border-slate-300 hover:border-[#006A4E] hover:bg-[#ECFDF5] hover:text-[#006A4E] text-[#111827] rounded-md transition-colors cursor-pointer"
                      >
                        {language === 'bn' ? 'তথ্য পূরণ' : 'Fill'}
                      </button>
                    </div>
                    <div className="text-xs font-mono text-[#111827] space-y-0.5 tabular-nums">
                      <p>
                        <span className="text-[#4B5563]">ID:</span> {cred.identifier}
                      </p>
                      <p>
                        <span className="text-[#4B5563]">Pass:</span> {cred.password}
                      </p>
                    </div>
                    <p className="text-[11px] text-[#4B5563]">
                      {language === 'bn' ? cred.noteBn : cred.noteEn}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="civic-card bg-[#ECFDF5] rounded-2xl border border-emerald-200 p-5 space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-bold text-[#006A4E]">
              <ShieldCheck className="w-4 h-4 text-[#006A4E]" />
              <span>
                {language === 'bn' ? 'রোল-ভিত্তিক নিরাপত্তা ব্যবস্থা' : 'Role-Based Security Notice'}
              </span>
            </div>
            <p className="text-xs text-[#4B5563] leading-relaxed">
              {language === 'bn'
                ? 'নাগরিক আবেদন, অনলাইন পেমেন্ট, ফ্যাসিলিটি বুকিং এবং যাচাইকৃত অভিযোগ দাখিলের জন্য নাগরিক লগইন বাধ্যতামূলক। পাবলিক QR যাচাই, সিটি ম্যাপ, ওপেন বাজেট এবং অভিযোগ ট্র্যাকার লগইন ছাড়াই ব্যবহার করা যায়।'
                : 'Citizen login is required for applications, payments, facility booking, and verified complaints. Public QR verification, GIS City Map, Open Budget, Tax Estimator, and Complaint Tracking remain open to all visitors.'}
            </p>
          </div>
        </div>
      </div>

      {/* Demo Access Modal */}
      {isDemoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-900 to-teal-900 text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-emerald-300" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    {language === 'bn' ? 'ডেমো অ্যাক্সেস প্রোফাইল নির্বাচন' : 'Select Demo Access Profile'}
                  </h3>
                  <p className="text-xs text-emerald-200">
                    {language === 'bn'
                      ? 'মূল্যায়ন ও উপস্থাপনার জন্য তাৎক্ষণিক লগইন প্রোফাইল'
                      : 'One-click evaluation profiles for review and presentation'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsDemoModalOpen(false)}
                className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-3.5 max-h-[75vh] overflow-y-auto">
              {/* Profile 1: Citizen */}
              <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40 hover:bg-emerald-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-emerald-100 text-[#006A4E] flex items-center justify-center text-xs font-bold">
                      <User className="w-3.5 h-3.5" />
                    </span>
                    <h4 className="text-sm font-bold text-slate-900">
                      {language === 'bn' ? 'সিটিজেন পোর্টাল' : 'Citizen Portal'}
                    </h4>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-[#006A4E]">
                      {language === 'bn' ? 'নাগরিক' : 'Citizen'}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-slate-800">
                    Md. Ruhul Amin · <span className="font-mono text-emerald-800">01816648095</span>
                  </p>
                  <p className="text-[11px] text-slate-500">
                    {language === 'bn'
                      ? 'নাগরিক সেবা আবেদন, সনদপত্র ডাউনলোড, ট্যাক্স ও ইউটিলিটি পরিশোধ, নাগরিক সমস্যা রিপোর্ট ও টাইমলাইন।'
                      : 'Civic applications, certificates, tax payment, civic problem reporting, and full activity timeline.'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleSelectDemoProfile('citizen')}
                  className="px-4 py-2 rounded-lg bg-[#006A4E] text-white text-xs font-bold hover:bg-[#00523C] shrink-0 shadow-xs cursor-pointer"
                >
                  {language === 'bn' ? 'নাগরিক নির্বাচন' : 'Use Citizen'}
                </button>
              </div>

              {/* Profile 2: Ward Officer */}
              <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/30 hover:bg-blue-50/60 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">
                      <Building2 className="w-3.5 h-3.5" />
                    </span>
                    <h4 className="text-sm font-bold text-slate-900">
                      {language === 'bn' ? 'ওয়ার্ড কর্মকর্তা পোর্টাল' : 'Ward Officer Portal'}
                    </h4>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                      Ward 19
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-slate-800">
                    Eng. Tariqul Islam · <span className="font-mono text-blue-800">ward.officer@dscc.gov.bd</span>
                  </p>
                  <p className="text-[11px] text-slate-500">
                    {language === 'bn'
                      ? 'ওয়ার্ড ভিত্তিক নাগরিক অভিযোগ তদন্ত, মাঠ পরিদর্শন ও স্থানীয় উন্নয়ন কার্যক্রম তদারকি।'
                      : 'Ward-level complaint verification, field inspections, and local public infrastructure oversight.'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleSelectDemoProfile('ward_officer')}
                  className="px-4 py-2 rounded-lg bg-blue-700 text-white text-xs font-bold hover:bg-blue-800 shrink-0 shadow-xs cursor-pointer"
                >
                  {language === 'bn' ? 'ওয়ার্ড কর্মকর্তা' : 'Use Ward Officer'}
                </button>
              </div>

              {/* Profile 3: Department Officer */}
              <div className="p-4 rounded-xl border border-teal-200 bg-teal-50/30 hover:bg-teal-50/60 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center text-xs font-bold">
                      <Briefcase className="w-3.5 h-3.5" />
                    </span>
                    <h4 className="text-sm font-bold text-slate-900">
                      {language === 'bn' ? 'বিভাগীয় কর্মকর্তা পোর্টাল' : 'Department Officer Portal'}
                    </h4>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-teal-100 text-teal-800">
                      Revenue & Civil
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-slate-800">
                    Farhana Yasmin, BCS · <span className="font-mono text-teal-800">dept.officer@dscc.gov.bd</span>
                  </p>
                  <p className="text-[11px] text-slate-500">
                    {language === 'bn'
                      ? 'ট্রেড লাইসেন্স ও সনদ আবেদন যাচাই, রাজস্ব স্কুটিনি ও মাঠপর্যায়ে কাজের অনুমোদন।'
                      : 'Statutory service application review, revenue assessment, and field dispatch authorizations.'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleSelectDemoProfile('dept_officer')}
                  className="px-4 py-2 rounded-lg bg-teal-700 text-white text-xs font-bold hover:bg-teal-800 shrink-0 shadow-xs cursor-pointer"
                >
                  {language === 'bn' ? 'বিভাগীয় কর্মকর্তা' : 'Use Dept Officer'}
                </button>
              </div>

              {/* Profile 4: Admin */}
              <div className="p-4 rounded-xl border border-purple-200 bg-purple-50/30 hover:bg-purple-50/60 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center text-xs font-bold">
                      <Landmark className="w-3.5 h-3.5" />
                    </span>
                    <h4 className="text-sm font-bold text-slate-900">
                      {language === 'bn' ? 'অ্যাডমিন পোর্টাল' : 'Admin Portal'}
                    </h4>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">
                      Super Admin
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-slate-800">
                    Mayor Secretariat · <span className="font-mono text-purple-800">admin@dscc.gov.bd</span>
                  </p>
                  <p className="text-[11px] text-slate-500">
                    {language === 'bn'
                      ? 'কেন্দ্রীয় ড্যাশবোর্ড, নাগরিক ও সেবা ব্যবস্থাপনা, সরকারি ফি কনফিগারেশন, পেমেন্ট অডিট ও রিপোর্ট।'
                      : 'Mayor command dashboard, citizen & service management, fee configuration, payment audit, and reports.'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleSelectDemoProfile('admin')}
                  className="px-4 py-2 rounded-lg bg-purple-700 text-white text-xs font-bold hover:bg-purple-800 shrink-0 shadow-xs cursor-pointer"
                >
                  {language === 'bn' ? 'অ্যাডমিন ব্যবহার' : 'Use Admin'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-5xl mx-auto px-4 py-16 text-center text-sm text-slate-500">
          Loading login portal...
        </div>
      }
    >
      <LoginFormContent />
    </Suspense>
  );
}
