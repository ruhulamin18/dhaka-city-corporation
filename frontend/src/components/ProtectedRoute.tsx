'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ArrowRight, Home, Lock, ShieldAlert } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useApp } from '@/context/AppContext';
import { AuthRole } from '@/types';

interface ProtectedRouteProps {
  allowedRoles: AuthRole[];
  children: React.ReactNode;
}

const ROLE_LABELS: Record<AuthRole, { en: string; bn: string }> = {
  citizen: { en: 'Citizen', bn: 'নাগরিক' },
  officer: { en: 'Department Officer / Councillor', bn: 'বিভাগীয় কর্মকর্তা / কাউন্সিলর' },
  staff: { en: 'Field Staff', bn: 'মাঠকর্মী' },
  admin: { en: 'Admin / Mayor', bn: 'অ্যাডমিন / মেয়র' },
};

export function ProtectedRoute({ allowedRoles, children }: ProtectedRouteProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, isInitialized, isLoggingOut, getDashboardPath } = useAuth();
  const { language } = useApp();

  useEffect(() => {
    if (!isInitialized || isLoggingOut) return;
    if (!isAuthenticated) {
      const fullPath =
        typeof window !== 'undefined'
          ? `${window.location.pathname}${window.location.search}`
          : pathname;
      router.replace(`/login?redirect=${encodeURIComponent(fullPath)}`);
    }
  }, [isInitialized, isAuthenticated, isLoggingOut, pathname, router]);

  if (isLoggingOut) {
    return null;
  }

  if (!isInitialized) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="inline-flex items-center gap-2.5 text-sm font-medium text-[#4B5563]">
          <Lock className="w-4 h-4 text-[#006A4E]" />
          <span>{language === 'bn' ? 'নিরাপত্তা সেশন যাচাই হচ্ছে...' : 'Verifying secure session...'}</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20">
        <div className="civic-card bg-white rounded-xl border border-[#E2E8F0] p-8 text-center space-y-4">
          <div className="w-12 h-12 rounded-xl bg-[#ECFDF5] text-[#006A4E] flex items-center justify-center mx-auto">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="text-lg font-bold text-[#111827]">
            {language === 'bn' ? 'লগইন প্রয়োজন' : 'Sign In Required'}
          </h1>
          <p className="text-sm text-[#4B5563]">
            {language === 'bn'
              ? 'এই সেবাটি ব্যবহার করতে অনুগ্রহ করে লগইন করুন। আপনাকে লগইন পেজে নেওয়া হচ্ছে...'
              : 'Redirecting you to the secure Dhaka Smart City login portal...'}
          </p>
          <Link
            href={`/login?redirect=${encodeURIComponent(pathname)}`}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#006A4E] hover:bg-[#00523C] text-white text-sm font-semibold rounded-lg transition-colors"
          >
            <span>{language === 'bn' ? 'লগইন পেজে যান' : 'Go to Login'}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  if (!allowedRoles.includes(user.role)) {
    const myDashboard = getDashboardPath(user.role);
    const currentRoleLabel = language === 'bn' ? ROLE_LABELS[user.role].bn : ROLE_LABELS[user.role].en;
    const requiredLabels = allowedRoles
      .map((r) => (language === 'bn' ? ROLE_LABELS[r].bn : ROLE_LABELS[r].en))
      .join(', ');

    return (
      <div className="max-w-xl mx-auto px-4 py-16">
        <div className="civic-card bg-white rounded-xl border border-red-200 p-8 text-center space-y-5">
          <div className="w-14 h-14 rounded-2xl bg-[#FEF2F2] text-[#C81E1E] border border-red-200 flex items-center justify-center mx-auto">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <div>
            <p className="text-xs font-semibold text-[#C81E1E] uppercase tracking-wider">
              403 · RBAC Protected
            </p>
            <h1 className="text-2xl font-bold text-[#111827] mt-1">
              {language === 'bn' ? 'প্রবেশাধিকার সংরক্ষিত (অননুমোদিত)' : 'Access Denied / Unauthorized'}
            </h1>
            <p className="text-sm text-[#4B5563] mt-2 leading-relaxed">
              {language === 'bn'
                ? `আপনি বর্তমানে "${currentRoleLabel}" হিসেবে লগইন আছেন। এই ড্যাশবোর্ডটি শুধুমাত্র "${requiredLabels}"-এর জন্য সংরক্ষিত।`
                : `You are signed in as "${currentRoleLabel}". This portal is strictly restricted to "${requiredLabels}".`}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href={myDashboard}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#006A4E] hover:bg-[#00523C] text-white text-sm font-semibold rounded-lg transition-colors"
            >
              <span>{language === 'bn' ? 'আমার ড্যাশবোর্ডে ফিরুন' : 'Return to My Dashboard'}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-[#111827] text-sm font-semibold rounded-lg transition-colors"
            >
              <Home className="w-4 h-4" />
              <span>{language === 'bn' ? 'হোমপেজ' : 'Homepage'}</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
