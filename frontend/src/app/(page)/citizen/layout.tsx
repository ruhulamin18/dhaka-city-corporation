'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
  ChevronLeft,
  ChevronRight,
  PhoneCall,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';

interface CitizenNavItem {
  href: string;
  label: { bn: string; en: string };
  icon: React.ComponentType<{ className?: string }>;
  exact?: boolean;
  badge?: { bn: string; en: string };
}

interface CitizenNavSection {
  group: { bn: string; en: string };
  items: CitizenNavItem[];
}

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
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const mobileProfileMenuRef = useRef<HTMLDivElement>(null);
  const desktopProfileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isInitialized && (!isAuthenticated || user?.role !== 'citizen')) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [isInitialized, isAuthenticated, user, router, pathname]);

  useEffect(() => {
    if (!mobileOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMobileOpen(false);
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', closeOnEscape);
    };
  }, [mobileOpen]);

  useEffect(() => {
    if (!profileMenuOpen) return;
    const closeOnOutsideClick = (event: MouseEvent) => {
      const target = event.target as Node;
      const insideMobileMenu = mobileProfileMenuRef.current?.contains(target);
      const insideDesktopMenu = desktopProfileMenuRef.current?.contains(target);
      if (!insideMobileMenu && !insideDesktopMenu) {
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
    queueMicrotask(() => {
      setMobileOpen(false);
      setProfileMenuOpen(false);
    });
  }, [pathname]);

  if (!isInitialized || !isAuthenticated || user?.role !== 'citizen') {
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

  const citizenName = language === 'bn'
    ? user?.nameBn || user?.nameEn || 'নাগরিক'
    : user?.nameEn || 'Citizen';
  const citizenWard = user?.wardNumber || 27;
  const handleLogout = () => {
    const confirmed = window.confirm(
      language === 'bn'
        ? 'আপনি কি নাগরিক পোর্টাল থেকে লগআউট করতে চান?'
        : 'Are you sure you want to log out of the Citizen Portal?'
    );
    if (!confirmed) return;
    setProfileMenuOpen(false);
    setMobileOpen(false);
    logout();
  };

  const NAV_SECTIONS: CitizenNavSection[] = [
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
  const navItems = NAV_SECTIONS.flatMap((section) => section.items);
  const activeHref = navItems
    .filter((item) =>
      item.exact
        ? pathname === item.href
        : pathname === item.href || pathname.startsWith(`${item.href}/`)
    )
    .sort((a, b) => b.href.length - a.href.length)[0]?.href;

  return (
    <div className="citizen-portal min-h-screen bg-slate-50 flex flex-col lg:flex-row text-slate-900">
      {/* Mobile Header Bar */}
      <div className="lg:hidden bg-[#006A4E] text-white px-3 py-3.5 flex items-center justify-between gap-2 sticky top-0 z-40 shadow-md">
        <div className="flex min-w-0 items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center font-bold shrink-0">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <div className="min-w-0">
            <h1 className="truncate text-sm font-bold leading-tight">
              {language === 'bn' ? 'ঢাকা সিটি কর্পোরেশন' : 'Dhaka City Corporation'}
            </h1>
            <p className="truncate text-[10px] text-emerald-200">
              {language === 'bn' ? 'নাগরিক সেবা পোর্টাল' : 'Citizen Services Portal'}
            </p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          <button
            type="button"
            onClick={() => setLanguage(language === 'bn' ? 'en' : 'bn')}
            aria-label={language === 'bn' ? 'Switch to English' : 'বাংলায় পরিবর্তন করুন'}
            className="min-w-9 rounded-lg border border-white/25 bg-white/10 px-2 py-2 text-xs font-bold text-white transition-colors hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            {language === 'bn' ? 'EN' : 'বাংলা'}
          </button>
          <div className="relative" ref={mobileProfileMenuRef}>
            <button
              type="button"
              onClick={() => setProfileMenuOpen((open) => !open)}
              aria-label={
                language === 'bn'
                  ? `${citizenName} এর প্রোফাইল মেনু`
                  : `Profile menu for ${citizenName}`
              }
              aria-haspopup="menu"
              aria-expanded={profileMenuOpen}
              aria-controls={profileMenuOpen ? 'citizen-profile-menu' : undefined}
              className="w-9 h-9 overflow-hidden rounded-full border-2 border-white/80 bg-white/15 text-white flex items-center justify-center font-bold text-sm shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              {user.avatarUrl ? (
                <Image
                  src={user.avatarUrl}
                  alt=""
                  width={36}
                  height={36}
                  className="h-full w-full object-cover"
                />
              ) : (
                Array.from(citizenName.trim())[0]?.toLocaleUpperCase() || 'U'
              )}
            </button>
            {profileMenuOpen && (
              <div
                id="citizen-profile-menu"
                role="menu"
                className="absolute right-0 top-full z-50 mt-2 w-64 rounded-xl border border-slate-200 bg-white p-2 text-slate-900 shadow-xl"
              >
                <div className="px-3 py-2">
                  <p className="truncate text-sm font-bold">{citizenName}</p>
                  <p className="text-xs text-slate-500">
                    {language === 'bn' ? `ওয়ার্ড নং ${citizenWard}` : `Ward ${citizenWard}`}
                  </p>
                </div>
                <button
                  type="button"
                  role="menuitem"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm font-semibold text-rose-700 transition-colors hover:bg-rose-50 focus-visible:outline-2 focus-visible:outline-rose-600"
                >
                  <LogOut className="h-4 w-4" aria-hidden="true" />
                  <span>{language === 'bn' ? 'লগআউট' : 'Log out'}</span>
                </button>
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={() => setMobileOpen((open) => !open)}
            aria-label={mobileOpen
              ? language === 'bn' ? 'মেনু বন্ধ করুন' : 'Close navigation menu'
              : language === 'bn' ? 'মেনু খুলুন' : 'Open navigation menu'}
            aria-expanded={mobileOpen}
            aria-controls="citizen-sidebar"
            className="shrink-0 p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Sidebar Navigation */}
      <aside
        id="citizen-sidebar"
        aria-label={language === 'bn' ? 'নাগরিক পোর্টাল নেভিগেশন' : 'Citizen portal navigation'}
        className={`fixed lg:sticky top-0 left-0 z-40 h-screen w-72 ${
          sidebarCollapsed ? 'lg:w-20' : 'lg:w-72'
        } bg-white border-r border-slate-200 flex flex-col transition-[width,transform] duration-200 ease-in-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col flex-1 overflow-y-auto">
          {/* Institutional Brand Header */}
          <div className={`p-5 border-b border-slate-100 flex items-center bg-gradient-to-r from-emerald-900 to-teal-900 text-white ${
            sidebarCollapsed ? 'lg:justify-center lg:p-3' : 'space-x-3'
          }`}>
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
              <Building2 className="w-6 h-6 text-emerald-300" />
            </div>
            <div className={`min-w-0 ${sidebarCollapsed ? 'lg:hidden' : ''}`}>
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
          <div className={`p-4 bg-emerald-50/60 border-b border-emerald-100/80 flex items-center ${
            sidebarCollapsed ? 'lg:justify-center lg:p-3' : 'space-x-3'
          }`}>
            <div className="w-10 h-10 rounded-full bg-[#006A4E] text-white flex items-center justify-center font-bold text-sm shrink-0">
              {citizenName.charAt(0)}
            </div>
            <div className={`min-w-0 flex-1 text-xs ${sidebarCollapsed ? 'lg:hidden' : ''}`}>
              <p className="font-bold text-slate-900 truncate">{citizenName}</p>
              <p className="text-[11px] text-emerald-800 font-medium">
                {language === 'bn' ? `ওয়ার্ড নং ${citizenWard} · যাচাইকৃত` : `Ward No ${citizenWard} · Verified`}
              </p>
            </div>
          </div>

          {/* Nav List */}
          <nav className={`p-3 space-y-5 text-xs ${
            sidebarCollapsed ? 'lg:p-2 lg:space-y-4' : ''
          }`}>
            {NAV_SECTIONS.map((section, sIdx) => (
              <div key={sIdx} className="space-y-1">
                <p className={`px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider ${
                  sidebarCollapsed ? 'lg:sr-only' : ''
                }`}>
                  {section.group[language]}
                </p>
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeHref === item.href;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      aria-current={isActive ? 'page' : undefined}
                      title={sidebarCollapsed ? item.label[language] : undefined}
                      aria-label={sidebarCollapsed ? item.label[language] : undefined}
                      className={`flex items-center justify-between px-3 py-2 rounded-xl font-medium transition-colors ${
                        sidebarCollapsed ? 'lg:justify-center lg:px-2' : ''
                      } ${
                        isActive
                          ? 'bg-[#006A4E] text-white shadow-xs font-semibold'
                          : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                      }`}
                    >
                      <div className={`flex items-center min-w-0 ${
                        sidebarCollapsed ? 'lg:justify-center' : 'space-x-2.5'
                      }`}>
                        <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                        <span className={`truncate ${sidebarCollapsed ? 'lg:sr-only' : ''}`}>
                          {item.label[language]}
                        </span>
                      </div>
                      {item.badge && (
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                            sidebarCollapsed ? 'lg:hidden ' : ''
                          }${
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

      </aside>

      {mobileOpen && (
        <button
          type="button"
          aria-label={language === 'bn' ? 'নেভিগেশন বন্ধ করুন' : 'Close navigation'}
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-30 bg-slate-950/40 lg:hidden"
        />
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        {/* Desktop Top Header Bar */}
        <header className="hidden lg:flex bg-white border-b border-slate-200 px-8 py-3.5 items-center justify-between sticky top-0 z-30 shadow-xs">
          <div className="flex items-center space-x-3 text-xs text-slate-500">
            <button
              type="button"
              onClick={() => setSidebarCollapsed((collapsed) => !collapsed)}
              aria-label={
                language === 'bn'
                  ? sidebarCollapsed ? 'সাইডবার বড় করুন' : 'সাইডবার ছোট করুন'
                  : sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'
              }
              aria-expanded={!sidebarCollapsed}
              aria-controls="citizen-sidebar"
              title={
                language === 'bn'
                  ? sidebarCollapsed ? 'সাইডবার বড় করুন' : 'সাইডবার ছোট করুন'
                  : sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'
              }
              className="rounded-lg border border-slate-200 bg-white p-2 text-slate-600 transition-colors hover:border-emerald-300 hover:bg-[#ECFDF5] hover:text-[#006A4E] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#006A4E]"
            >
              {sidebarCollapsed
                ? <ChevronRight className="h-4 w-4" aria-hidden="true" />
                : <ChevronLeft className="h-4 w-4" aria-hidden="true" />}
            </button>
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
              aria-label={language === 'bn' ? 'বিজ্ঞপ্তি' : 'Notifications'}
              className="relative p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500" />
            </Link>

            <button
              type="button"
              onClick={() => setLanguage(language === 'bn' ? 'en' : 'bn')}
              aria-label={language === 'bn' ? 'Switch to English' : 'বাংলায় পরিবর্তন করুন'}
              className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-bold text-slate-700 transition-colors hover:border-emerald-300 hover:bg-[#ECFDF5] hover:text-[#006A4E] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#006A4E]"
            >
              {language === 'bn' ? 'English' : 'বাংলা'}
            </button>

            <div className="relative" ref={desktopProfileMenuRef}>
              <button
                type="button"
                onClick={() => setProfileMenuOpen((open) => !open)}
                aria-label={
                  language === 'bn'
                    ? `${citizenName} এর প্রোফাইল মেনু`
                    : `Profile menu for ${citizenName}`
                }
                aria-haspopup="menu"
                aria-expanded={profileMenuOpen}
                aria-controls={profileMenuOpen ? 'citizen-desktop-profile-menu' : undefined}
                className="flex items-center space-x-2 pl-3 border-l border-slate-200 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#006A4E]"
              >
                {user.avatarUrl ? (
                  <Image
                    src={user.avatarUrl}
                    alt=""
                    width={28}
                    height={28}
                    className="h-7 w-7 rounded-full object-cover"
                  />
                ) : (
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-[#006A4E]">
                    {Array.from(citizenName.trim())[0]?.toLocaleUpperCase() || 'U'}
                  </span>
                )}
                <span className="text-xs font-bold text-slate-800">
                  {citizenName}
                </span>
              </button>
              {profileMenuOpen && (
                <div
                  id="citizen-desktop-profile-menu"
                  role="menu"
                  className="absolute right-0 top-full z-50 mt-2 w-64 rounded-xl border border-slate-200 bg-white p-2 text-slate-900 shadow-xl"
                >
                  <div className="px-3 py-2">
                    <p className="truncate text-sm font-bold">{citizenName}</p>
                    <p className="text-xs text-slate-500">
                      {language === 'bn' ? `ওয়ার্ড নং ${citizenWard}` : `Ward ${citizenWard}`}
                    </p>
                  </div>
                  <Link
                    href="/citizen/profile"
                    role="menuitem"
                    onClick={() => setProfileMenuOpen(false)}
                    className="block rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                  >
                    {language === 'bn' ? 'আমার প্রোফাইল' : 'My profile'}
                  </Link>
                  <button
                    type="button"
                    role="menuitem"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm font-semibold text-rose-700 transition-colors hover:bg-rose-50"
                  >
                    <LogOut className="h-4 w-4" aria-hidden="true" />
                    <span>{language === 'bn' ? 'লগআউট' : 'Log out'}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Subpage Content View */}
        <main className="p-4 sm:p-6 lg:p-8 flex-1">{children}</main>
      </div>
    </div>
  );
}
