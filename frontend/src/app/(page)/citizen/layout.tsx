'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  User,
  Layers,
  FilePlus2,
  FileText,
  SearchCheck,
  CreditCard,
  History,
  Award,
  AlertTriangle,
  Activity,
  Bell,
  HelpCircle,
  Settings,
  LogOut,
  Menu,
  X,
  Building2,
  ShieldCheck,
  ChevronRight,
  PhoneCall,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';

export default function CitizenPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { language, setLanguage } = useApp();
  const { user, isAuthenticated, isInitialized, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (isInitialized && (!isAuthenticated || user?.role !== 'citizen')) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [isInitialized, isAuthenticated, user, router, pathname]);

  if (!isInitialized || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-[#006A4E] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-semibold text-slate-600">
            {language === 'bn' ? 'নাগরিক পোর্টাল যাচাই হচ্ছে...' : 'Verifying Citizen Session...'}
          </p>
        </div>
      </div>
    );
  }

  const citizenName = user?.nameEn || 'Md. Ruhul Amin';
  const citizenWard = user?.wardNumber || 27;

  const NAV_SECTIONS = [
    {
      group: { bn: 'প্রধান মেনু', en: 'Main Menu' },
      items: [
        {
          href: '/citizen',
          label: { bn: 'ড্যাশবোর্ড', en: 'Dashboard' },
          icon: LayoutDashboard,
          exact: true,
        },
        {
          href: '/citizen/profile',
          label: { bn: 'আমার প্রোফাইল', en: 'My Profile' },
          icon: User,
        },
      ],
    },
    {
      group: { bn: 'নাগরিক সেবা ও আবেদন', en: 'Services & Applications' },
      items: [
        {
          href: '/citizen/services',
          label: { bn: 'সকল নাগরিক সেবা', en: 'All Citizen Services' },
          icon: Layers,
        },
        {
          href: '/citizen/applications/new',
          label: { bn: 'নতুন আবেদন', en: 'New Application' },
          icon: FilePlus2,
        },
        {
          href: '/citizen/applications',
          label: { bn: 'আমার আবেদনসমূহ', en: 'My Applications' },
          icon: FileText,
          exact: true,
        },
        {
          href: '/citizen/tracking',
          label: { bn: 'আবেদনের অবস্থা', en: 'Application Tracking' },
          icon: SearchCheck,
        },
        {
          href: '/citizen/certificates',
          label: { bn: 'আমার সনদসমূহ', en: 'My Certificates' },
          icon: Award,
        },
      ],
    },
    {
      group: { bn: 'পেমেন্ট ও অভিযোগ', en: 'Payment & Civic Issues' },
      items: [
        {
          href: '/online-payment',
          label: { bn: 'অনলাইন পেমেন্ট', en: 'Online Payment' },
          icon: CreditCard,
        },
        {
          href: '/online-payment/history',
          label: { bn: 'পেমেন্ট ইতিহাস', en: 'Payment History' },
          icon: History,
        },
        {
          href: '/citizen/complaints',
          label: { bn: 'অভিযোগ ও রিপোর্ট', en: 'Complaints & Reports' },
          icon: AlertTriangle,
          badge: { bn: 'লাইভ', en: 'Live' },
        },
        {
          href: '/citizen/activity',
          label: { bn: 'আমার কার্যক্রম', en: 'My Activity' },
          icon: Activity,
        },
      ],
    },
    {
      group: { bn: 'সেটিংস ও সহায়তা', en: 'Support & Settings' },
      items: [
        {
          href: '/citizen/notifications',
          label: { bn: 'নোটিফিকেশন', en: 'Notifications' },
          icon: Bell,
          badge: { bn: '৩', en: '3' },
        },
        {
          href: '/citizen/support',
          label: { bn: 'সহায়তা ও হেল্পডেস্ক', en: 'Help & Support' },
          icon: HelpCircle,
        },
        {
          href: '/citizen/settings',
          label: { bn: 'অ্যাকাউন্ট সেটিংস', en: 'Account Settings' },
          icon: Settings,
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col lg:flex-row text-slate-900">
      {/* Mobile Header Bar */}
      <div className="lg:hidden bg-[#006A4E] text-white px-4 py-3.5 flex items-center justify-between sticky top-0 z-40 shadow-md">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center font-bold">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold leading-tight">ঢাকা সিটি কর্পোরেশন</h1>
            <p className="text-[10px] text-emerald-200">নাগরিক সেবা পোর্টাল</p>
          </div>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-40 h-screen w-72 bg-white border-r border-slate-200 flex flex-col justify-between transition-transform duration-200 ease-in-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col flex-1 overflow-y-auto">
          {/* Institutional Brand Header */}
          <div className="p-5 border-b border-slate-100 flex items-center space-x-3 bg-gradient-to-r from-emerald-900 to-teal-900 text-white">
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
              <Building2 className="w-6 h-6 text-emerald-300" />
            </div>
            <div className="min-w-0">
              <h2 className="text-sm font-extrabold tracking-tight truncate">
                {language === 'bn' ? 'ঢাকা সিটি কর্পোরেশন' : 'Dhaka City Corporation'}
              </h2>
              <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-200">
                <ShieldCheck className="w-3 h-3 text-emerald-300" />
                <span>{language === 'bn' ? 'সিটিজেন পোর্টাল' : 'Citizen Portal'}</span>
              </div>
            </div>
          </div>

          {/* Citizen ID Badge */}
          <div className="p-4 bg-emerald-50/60 border-b border-emerald-100/80 flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-[#006A4E] text-white flex items-center justify-center font-bold text-sm shrink-0">
              {citizenName.charAt(0)}
            </div>
            <div className="min-w-0 flex-1 text-xs">
              <p className="font-bold text-slate-900 truncate">{citizenName}</p>
              <p className="text-[11px] text-emerald-800 font-medium">
                {language === 'bn' ? `ওয়ার্ড নং ${citizenWard} · যাচাইকৃত` : `Ward No ${citizenWard} · Verified`}
              </p>
            </div>
          </div>

          {/* Nav List */}
          <nav className="p-3 space-y-5 text-xs">
            {NAV_SECTIONS.map((section, sIdx) => (
              <div key={sIdx} className="space-y-1">
                <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  {section.group[language]}
                </p>
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = item.exact
                    ? pathname === item.href
                    : pathname.startsWith(item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center justify-between px-3 py-2 rounded-xl font-medium transition-colors ${
                        isActive
                          ? 'bg-[#006A4E] text-white shadow-xs font-semibold'
                          : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                      }`}
                    >
                      <div className="flex items-center space-x-2.5 min-w-0">
                        <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                        <span className="truncate">{item.label[language]}</span>
                      </div>
                      {item.badge && (
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                            isActive
                              ? 'bg-emerald-500/40 text-white'
                              : 'bg-emerald-100 text-[#006A4E]'
                          }`}
                        >
                          {item.badge[language]}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            ))}
          </nav>
        </div>

        {/* Bottom Actions & Logout */}
        <div className="p-3 border-t border-slate-200 bg-slate-50 space-y-2 text-xs">
          <div className="flex items-center justify-between px-2 text-[11px] text-slate-500">
            <span>{language === 'bn' ? 'ভাষা / Language:' : 'Language:'}</span>
            <button
              onClick={() => setLanguage(language === 'bn' ? 'en' : 'bn')}
              className="font-bold text-[#006A4E] hover:underline cursor-pointer"
            >
              {language === 'bn' ? 'English' : 'বাংলা'}
            </button>
          </div>
          <button
            onClick={() => {
              logout();
              router.push('/login');
            }}
            className="w-full flex items-center justify-center space-x-2 py-2 px-3 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? 'লগআউট' : 'Sign Out'}</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Desktop Top Header Bar */}
        <header className="hidden lg:flex bg-white border-b border-slate-200 px-8 py-3.5 items-center justify-between sticky top-0 z-30 shadow-xs">
          <div className="flex items-center space-x-3 text-xs text-slate-500">
            <Link href="/" className="hover:text-emerald-800 transition-colors font-medium">
              {language === 'bn' ? 'মূল ওয়েবসাইট' : 'Main Website'}
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
            <span className="font-semibold text-slate-800">
              {language === 'bn' ? 'নাগরিক ডিজিটাল পোর্টাল' : 'Citizen Digital Portal'}
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-xs bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200 text-slate-600">
              <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
              <span>{language === 'bn' ? 'হেল্পলাইন: ১৬১০৬' : 'Helpline: 16106'}</span>
            </div>

            <Link
              href="/citizen/notifications"
              className="relative p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500" />
            </Link>

            <Link
              href="/citizen/profile"
              className="flex items-center space-x-2 pl-3 border-l border-slate-200"
            >
              <div className="w-7 h-7 rounded-full bg-emerald-100 text-[#006A4E] flex items-center justify-center font-bold text-xs">
                {citizenName.charAt(0)}
              </div>
              <span className="text-xs font-bold text-slate-800 hover:text-[#006A4E]">
                {citizenName}
              </span>
            </Link>
          </div>
        </header>

        {/* Subpage Content View */}
        <main className="p-4 sm:p-6 lg:p-8 flex-1">{children}</main>
      </div>
    </div>
  );
}
