'use client';

import React, { useState, useEffect, useRef } from 'react';
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
  ChevronLeft,
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
import { ConfirmDialog } from '@/components/common/ConfirmDialog';

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
  const { user, isAuthenticated, isInitialized, isLoggingOut, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  const isLoginPage = Boolean(pathname && pathname.startsWith('/admin/login'));
  const displayName = language === 'bn'
    ? user?.nameBn || user?.nameEn || 'অ্যাডমিন'
    : user?.nameEn || 'Administrator';
  const displayInitial = Array.from(displayName.trim())[0]?.toLocaleUpperCase() || 'A';

  useEffect(() => {
    if (!profileMenuOpen) return;
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (!profileMenuRef.current?.contains(event.target as Node)) {
        setProfileMenuOpen(false);
      }
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setProfileMenuOpen(false);
    };
    document.addEventListener('mousedown', closeOnOutsideClick);
    window.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('mousedown', closeOnOutsideClick);
      window.removeEventListener('keydown', closeOnEscape);
    };
  }, [profileMenuOpen]);

  useEffect(() => {
    if (isLoginPage || isLoggingOut) return;
    if (isInitialized && (!isAuthenticated || user?.role === 'citizen')) {
      router.replace(`/admin/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [isInitialized, isAuthenticated, isLoggingOut, user, router, pathname, isLoginPage]);

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (isLoggingOut) {
    return null;
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

  const handleLogout = () => {
    setLogoutConfirmOpen(true);
  };

  const confirmLogout = () => {
    setLogoutConfirmOpen(false);
    setProfileMenuOpen(false);
    setMobileOpen(false);
    logout();
  };

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
        <div className="px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <button
              type="button"
              onClick={() => {
                setProfileMenuOpen(false);
                setMobileOpen((open) => !open);
              }}
              aria-label={mobileOpen
                ? language === 'bn' ? 'মেনু বন্ধ করুন' : 'Close navigation menu'
                : language === 'bn' ? 'মেনু খুলুন' : 'Open navigation menu'}
              aria-expanded={mobileOpen}
              className="lg:hidden shrink-0 p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <button
              type="button"
              onClick={() => setSidebarCollapsed((collapsed) => !collapsed)}
              aria-label={
                language === 'bn'
                  ? sidebarCollapsed ? 'সাইডবার বড় করুন' : 'সাইডবার ছোট করুন'
                  : sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'
              }
              aria-expanded={!sidebarCollapsed}
              aria-controls="admin-desktop-sidebar"
              title={
                language === 'bn'
                  ? sidebarCollapsed ? 'সাইডবার বড় করুন' : 'সাইডবার ছোট করুন'
                  : sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'
              }
              className="hidden lg:inline-flex shrink-0 items-center justify-center rounded-lg bg-slate-800 p-2 text-slate-300 transition-colors hover:bg-slate-700 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400"
            >
              {sidebarCollapsed
                ? <ChevronRight className="h-5 w-5" aria-hidden="true" />
                : <ChevronLeft className="h-5 w-5" aria-hidden="true" />}
            </button>

            <Link href="/admin" className="flex min-w-0 items-center gap-2 sm:gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#006A4E] text-white flex items-center justify-center font-bold shadow-md shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="truncate font-bold text-white text-sm sm:text-base tracking-wide">
                    {language === 'bn' ? 'ঢাকা সিটি কর্পোরেশন' : 'Dhaka City Corporation'}
                  </span>
                  <span className="hidden sm:inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {language === 'bn' ? 'অ্যাডমিন পোর্টাল' : 'Admin Portal'}
                  </span>
                </div>
                <div className="hidden sm:block text-[11px] text-slate-400 font-medium">
                  {language === 'bn' ? roleLabel.bn : roleLabel.en}
                </div>
              </div>
            </Link>
          </div>

          <div className="flex shrink-0 items-center gap-2 sm:gap-4">
            {/* Live Indicator */}
            <div className="hidden md:flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-[11px] text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{language === 'bn' ? 'সিস্টেম স্ট্যাটাস: অনলাইন' : 'System: Online'}</span>
            </div>

            {/* Language Switcher */}
            <div className="hidden sm:flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700 text-xs font-semibold">
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

            <button
              type="button"
              onClick={() => setLanguage(language === 'bn' ? 'en' : 'bn')}
              aria-label={language === 'bn' ? 'Switch to English' : 'বাংলায় পরিবর্তন করুন'}
              className="sm:hidden rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1.5 text-xs font-bold text-white transition-colors hover:bg-slate-700"
            >
              {language === 'bn' ? 'EN' : 'বাংলা'}
            </button>

            <div className="relative" ref={profileMenuRef}>
              <button
                type="button"
                onClick={() => setProfileMenuOpen((open) => !open)}
                aria-label={
                  language === 'bn'
                    ? `${displayName} এর প্রোফাইল মেনু`
                    : `Profile menu for ${displayName}`
                }
                aria-haspopup="menu"
                aria-expanded={profileMenuOpen}
                aria-controls={profileMenuOpen ? 'admin-profile-menu' : undefined}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-600 bg-slate-800 text-sm font-bold text-emerald-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400 lg:h-auto lg:w-auto lg:justify-start lg:rounded-none lg:border-0 lg:border-l lg:border-slate-800 lg:bg-transparent lg:pl-2"
              >
                <span className="lg:hidden">{displayInitial}</span>
                <span className="hidden h-8 w-8 items-center justify-center rounded-full border border-slate-700 bg-slate-800 text-xs font-bold text-emerald-400 lg:flex">
                  {user?.nameEn?.slice(0, 2).toUpperCase() || 'AD'}
                </span>
                <span className="hidden text-left lg:block">
                  <span className="block text-xs font-bold leading-tight text-white">
                    {language === 'bn' ? user?.nameBn || user?.nameEn : user?.nameEn}
                  </span>
                  <span className="block text-[10px] leading-tight text-slate-400">
                    {user?.department || (language === 'bn' ? 'সিটি কর্পোরেশন' : 'City Corporation')}
                  </span>
                </span>
              </button>
              {profileMenuOpen && (
                <div
                  id="admin-profile-menu"
                  role="menu"
                  className="absolute right-0 top-full z-50 mt-2 w-60 rounded-xl border border-slate-700 bg-slate-900 p-2 text-white shadow-xl"
                >
                  <div className="px-3 py-2">
                    <p className="truncate text-sm font-bold">{displayName}</p>
                    <p className="truncate text-xs text-slate-400">
                      {user?.department || (language === 'bn' ? 'অ্যাডমিন পোর্টাল' : 'Admin Portal')}
                    </p>
                  </div>
                  <button
                    type="button"
                    role="menuitem"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm font-semibold text-rose-300 transition-colors hover:bg-slate-800 focus-visible:outline-2 focus-visible:outline-rose-400"
                  >
                    <LogOut className="h-4 w-4" aria-hidden="true" />
                    <span>{language === 'bn' ? 'লগআউট' : 'Log out'}</span>
                  </button>
                </div>
              )}
            </div>

            {/* Public Portal Link */}
            <Link
              href="/"
              target="_blank"
              title={language === 'bn' ? 'মূল ওয়েবসাইট দেখুন' : 'View Public Website'}
              className="hidden lg:inline-flex p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
            >
              <ExternalLink className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <aside
          id="admin-desktop-sidebar"
          className={`hidden lg:flex flex-col ${
            sidebarCollapsed ? 'w-20' : 'w-64'
          } bg-slate-900 border-r border-slate-800 shrink-0 transition-[width] duration-200`}
        >
          <div className={`flex-1 overflow-y-auto ${sidebarCollapsed ? 'p-2 space-y-4' : 'p-4 space-y-6'}`}>
            {ADMIN_SECTIONS.map((section, sIdx) => (
              <div key={sIdx}>
                <div className={`text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-2 ${
                  sidebarCollapsed ? 'sr-only' : ''
                }`}>
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
                      title={
                        sidebarCollapsed
                          ? language === 'bn' ? item.label.bn : item.label.en
                          : undefined
                      }
                      aria-label={
                        sidebarCollapsed
                          ? language === 'bn' ? item.label.bn : item.label.en
                          : undefined
                      }
                      className={`flex items-center ${
                        sidebarCollapsed ? 'justify-center px-2' : 'justify-between px-3'
                      } py-2 rounded-lg text-sm font-medium transition ${
                          isActive
                            ? 'bg-[#006A4E] text-white shadow-sm font-semibold'
                            : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                        }`}
                      >
                      <div
                        className={`flex min-w-0 items-center ${
                          sidebarCollapsed ? 'justify-center' : 'gap-2.5'
                        }`}
                      >
                          <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                        <span className={sidebarCollapsed ? 'sr-only' : ''}>
                          {language === 'bn' ? item.label.bn : item.label.en}
                        </span>
                        </div>
                      {!sidebarCollapsed && item.badge && (
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

          <div className={`border-t border-slate-800 text-xs text-slate-400 ${
            sidebarCollapsed ? 'px-2 py-4 text-center' : 'p-4'
          }`}>
            {sidebarCollapsed ? (
              <span title="Digital Dhaka Governance">DSCC</span>
            ) : (
              <>
                <div className="font-semibold text-slate-300">
                  {language === 'bn' ? 'ডিজিটাল ঢাকা গভর্নেন্স' : 'Smart Dhaka Governance'}
                </div>
                <div>Build 2026.11 · Secure GovNet</div>
              </>
            )}
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

      <ConfirmDialog
        open={logoutConfirmOpen}
        title={language === 'bn' ? 'লগআউট নিশ্চিত করুন' : 'Confirm Log Out'}
        description={
          language === 'bn'
            ? 'আপনি কি প্রশাসনিক পোর্টাল থেকে লগআউট করতে চান?'
            : 'Are you sure you want to log out of the Admin Portal?'
        }
        confirmLabel={language === 'bn' ? 'হ্যাঁ, লগআউট' : 'Log Out'}
        cancelLabel={language === 'bn' ? 'বাতিল' : 'Cancel'}
        onConfirm={confirmLogout}
        onCancel={() => setLogoutConfirmOpen(false)}
      />
    </div>
  );
}
