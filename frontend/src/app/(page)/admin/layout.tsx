'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Layers,
  FileCheck2,
  AlertTriangle,
  Receipt,
  Building2,
  BarChart3,
  ShieldCheck,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Calculator,
  History,
  FileText,
  Sliders,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';

interface AdminNavItem {
  href: string;
  label: { bn: string; en: string };
  icon: React.ComponentType<{ className?: string }>;
  exact?: boolean;
  badge?: { bn: string; en: string };
}

interface AdminNavSection {
  group: { bn: string; en: string };
  items: AdminNavItem[];
}

export default function AdminPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { language, setLanguage } = useApp();
  const { user, isAuthenticated, isInitialized, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isLoginPage = Boolean(pathname && pathname.startsWith('/admin/login'));

  useEffect(() => {
    if (isLoginPage) return;
    if (isInitialized && (!isAuthenticated || user?.role === 'citizen')) {
      router.replace(`/admin/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [isInitialized, isAuthenticated, user, router, pathname, isLoginPage]);

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (!isInitialized || !isAuthenticated || user?.role === 'citizen') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-semibold tracking-wide">
            {language === 'bn' ? 'প্রশাসনিক সেশন যাচাই হচ্ছে...' : 'Verifying Administrative Access...'}
          </p>
        </div>
      </div>
    );
  }

  const roleLabel =
    user?.role === 'admin'
      ? { bn: 'সুপার অ্যাডমিন (মেয়র সচিবালয়)', en: 'Super Admin (Mayor Secretariat)' }
      : user?.wardNumber
      ? { bn: `ওয়ার্ড কর্মকর্তা (ওয়ার্ড ${user.wardNumber})`, en: `Ward Officer (Ward ${user.wardNumber})` }
      : { bn: 'বিভাগীয় কর্মকর্তা (রাজস্ব ও প্রকৌশল)', en: 'Department Officer (Revenue & Eng.)' };

  const ADMIN_SECTIONS: AdminNavSection[] = [
    {
      group: { bn: 'কমান্ড ও মনিটরিং', en: 'Executive & Overview' },
      items: [
        {
          href: '/admin',
          label: { bn: 'কমান্ড ড্যাশবোর্ড', en: 'Command Dashboard' },
          icon: LayoutDashboard,
          exact: true,
        },
        {
          href: '/admin/reports',
          label: { bn: 'রিপোর্ট ও অ্যানালিটিক্স', en: 'Reports & Analytics' },
          icon: BarChart3,
        },
      ],
    },
    {
      group: { bn: 'নাগরিক সেবা ও কনফিগারেশন', en: 'Services & Operations' },
      items: [
        {
          href: '/admin/services',
          label: { bn: 'সেবা ক্যাটালগ', en: 'Service Catalogue' },
          icon: Layers,
        },
        {
          href: '/admin/fees',
          label: { bn: 'ফি ও ডকুমেন্ট ইঞ্জিন', en: 'Fee & Document Engine' },
          icon: Sliders,
          badge: { bn: 'নীতি', en: 'Rule' },
        },
        {
          href: '/admin/applications',
          label: { bn: 'আবেদন বাছাই ও অনুমোদন', en: 'Application Scrutiny' },
          icon: FileCheck2,
          badge: { bn: '৮ পেন্ডিং', en: '8 Pending' },
        },
        {
          href: '/admin/complaints',
          label: { bn: 'অভিযোগ ও ফিল্ড অ্যাকশন', en: 'Civic Grievance Desk' },
          icon: AlertTriangle,
          badge: { bn: 'লাইভ', en: 'Live' },
        },
      ],
    },
    {
      group: { bn: 'রাজস্ব ও নাগরিক প্রশাসন', en: 'Revenue & Registry' },
      items: [
        {
          href: '/admin/citizens',
          label: { bn: 'নাগরিক রেজিস্ট্রি', en: 'Citizen Registry' },
          icon: Users,
        },
        {
          href: '/admin/payments',
          label: { bn: 'পেমেন্ট ও রাজস্ব লেজার', en: 'Payments & Revenue' },
          icon: Receipt,
        },
        {
          href: '/admin/wards',
          label: { bn: 'ওয়ার্ড ও জোন ব্যবস্থাপনা', en: 'Wards & Departments' },
          icon: Building2,
        },
        {
          href: '/admin/audit-logs',
          label: { bn: 'অডিট লগ ও রেকর্ড', en: 'Audit Trail & Logs' },
          icon: History,
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      {/* Top Administrative Header */}
      <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-40">
        <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <Link href="/admin" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#006A4E] text-white flex items-center justify-center font-bold shadow-md">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-base tracking-wide">
                    {language === 'bn' ? 'ঢাকা সিটি কর্পোরেশন' : 'Dhaka City Corporation'}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {language === 'bn' ? 'অ্যাডমিন পোর্টাল' : 'Admin Portal'}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 font-medium">
                  {language === 'bn' ? roleLabel.bn : roleLabel.en}
                </div>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            {/* Live Indicator */}
            <div className="hidden md:flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-[11px] text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{language === 'bn' ? 'সিস্টেম স্ট্যাটাস: অনলাইন' : 'System: Online'}</span>
            </div>

            {/* Language Switcher */}
            <div className="flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700 text-xs font-semibold">
              <button
                onClick={() => setLanguage('bn')}
                className={`px-2.5 py-1 rounded-md transition ${
                  language === 'bn' ? 'bg-[#006A4E] text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                বাংলা
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`px-2.5 py-1 rounded-md transition ${
                  language === 'en' ? 'bg-[#006A4E] text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                EN
              </button>
            </div>

            {/* Official Profile Badge */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
              <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-emerald-400">
                {user?.nameEn?.slice(0, 2).toUpperCase() || 'AD'}
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-xs font-bold text-white leading-tight">
                  {language === 'bn' ? user?.nameBn || user?.nameEn : user?.nameEn}
                </div>
                <div className="text-[10px] text-slate-400 leading-tight">
                  {user?.department || (language === 'bn' ? 'সিটি কর্পোরেশন' : 'City Corporation')}
                </div>
              </div>
            </div>

            {/* Public Portal Link */}
            <Link
              href="/"
              target="_blank"
              title={language === 'bn' ? 'মূল ওয়েবসাইট দেখুন' : 'View Public Website'}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
            >
              <ExternalLink className="w-4 h-4" />
            </Link>

            {/* Logout */}
            <button
              onClick={() => {
                logout();
                router.push('/login');
              }}
              title={language === 'bn' ? 'লগআউট' : 'Logout'}
              className="p-2 text-rose-400 hover:text-rose-300 hover:bg-slate-800 rounded-lg transition"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex flex-col w-64 bg-slate-900 border-r border-slate-800 shrink-0">
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {ADMIN_SECTIONS.map((section, sIdx) => (
              <div key={sIdx}>
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-2">
                  {language === 'bn' ? section.group.bn : section.group.en}
                </div>
                <div className="space-y-1">
                  {section.items.map((item) => {
                    const isActive = item.exact
                      ? pathname === item.href
                      : pathname.startsWith(item.href);
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition ${
                          isActive
                            ? 'bg-[#006A4E] text-white shadow-sm font-semibold'
                            : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                          <span>{language === 'bn' ? item.label.bn : item.label.en}</span>
                        </div>
                        {item.badge && (
                          <span
                            className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                              isActive
                                ? 'bg-white/20 text-white'
                                : 'bg-slate-800 text-slate-300 border border-slate-700'
                            }`}
                          >
                            {language === 'bn' ? item.badge.bn : item.badge.en}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-slate-800 text-xs text-slate-400">
            <div className="font-semibold text-slate-300">
              {language === 'bn' ? 'ডিজিটাল ঢাকা গভর্নেন্স' : 'Smart Dhaka Governance'}
            </div>
            <div>Build 2026.11 · Secure GovNet</div>
          </div>
        </aside>

        {/* Mobile Navigation Drawer */}
        {mobileOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />
            <div className="relative w-72 bg-slate-900 border-r border-slate-800 text-white flex flex-col p-4 z-10">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
                <span className="font-bold text-sm">
                  {language === 'bn' ? 'অ্যাডমিন নেভিগেশন' : 'Admin Navigation'}
                </span>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-1 rounded bg-slate-800 text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-6">
                {ADMIN_SECTIONS.map((section, sIdx) => (
                  <div key={sIdx}>
                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-2">
                      {language === 'bn' ? section.group.bn : section.group.en}
                    </div>
                    <div className="space-y-1">
                      {section.items.map((item) => {
                        const isActive = item.exact
                          ? pathname === item.href
                          : pathname.startsWith(item.href);
                        const Icon = item.icon;
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setMobileOpen(false)}
                            className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition ${
                              isActive
                                ? 'bg-[#006A4E] text-white shadow-sm font-semibold'
                                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <Icon className="w-4 h-4" />
                              <span>{language === 'bn' ? item.label.bn : item.label.en}</span>
                            </div>
                            {item.badge && (
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                                {language === 'bn' ? item.badge.bn : item.badge.en}
                              </span>
                            )}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-slate-100">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
