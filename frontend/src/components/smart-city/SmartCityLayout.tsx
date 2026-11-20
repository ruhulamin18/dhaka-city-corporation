'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  AlertCircle,
  Building2,
  ChevronDown,
  ChevronRight,
  Clock,
  HelpCircle,
  Home,
  Info,
  PhoneCall,
  Share2,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { SMART_CITY_CATEGORIES, SMART_CITY_FEATURES } from '@/data/smart-city/features';
import { FEATURE_FAQS } from '@/data/smart-city/smartCityData';
import { pickLang } from '@/types/about';
import type { SmartCityFeatureSlug } from '@/types/smart-city';

export interface SmartCityLayoutProps {
  activeSlug: SmartCityFeatureSlug;
  children: React.ReactNode;
  onOpenReportModal?: () => void;
  reportButtonLabel?: { bn: string; en: string };
}

export function SmartCityLayout({
  activeSlug,
  children,
  onOpenReportModal,
  reportButtonLabel,
}: SmartCityLayoutProps) {
  const { language } = useApp();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [faqOpenIdx, setFaqOpenIdx] = useState<number | null>(0);

  const feature = SMART_CITY_FEATURES[activeSlug];
  const category = SMART_CITY_CATEGORIES.find((c) => c.id === feature.category);
  const CurrentIcon = feature.icon;
  const faqs = FEATURE_FAQS[activeSlug] ?? [];

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="min-h-[85vh] bg-[#F8FAFC]">
      {/* 1. Civic Green Header Banner with Institutional Watermark */}
      <section className="relative overflow-hidden bg-[#006A4E] text-white border-b border-[#00523C]">
        <div
          aria-hidden="true"
          className="civic-bg-layer absolute inset-0 bg-[url('/images/bg2.png')] bg-right-bottom bg-no-repeat bg-cover invert opacity-[0.1] pointer-events-none"
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          {/* Breadcrumb Navigation */}
          <nav
            aria-label={language === 'bn' ? 'ব্রেডক্রাম্ব নেভিগেশন' : 'Breadcrumb Navigation'}
            className="flex flex-wrap items-center gap-1.5 text-xs text-emerald-100/90 mb-3.5"
          >
            <Link
              href="/"
              className="inline-flex items-center gap-1 hover:text-white transition-colors"
            >
              <Home className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{language === 'bn' ? 'হোম' : 'Home'}</span>
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-emerald-200/70" aria-hidden="true" />
            <Link
              href="/smart-city"
              className="hover:text-white transition-colors"
            >
              {language === 'bn' ? 'স্মার্ট সিটি' : 'Smart City'}
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-emerald-200/70" aria-hidden="true" />
            <span className="text-white font-semibold" aria-current="page">
              {pickLang(feature.title, language)}
            </span>
          </nav>

          {/* Feature Identity: Pillar Category Pill, Title & Subtitle */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/15 border border-white/20 text-xs font-semibold text-emerald-100 mb-3">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>
                  {category ? pickLang(category.title, language) : 'Smart City'}
                </span>
                <span className="text-white/40">|</span>
                <span className="text-emerald-200">
                  {feature.badge ? pickLang(feature.badge, language) : 'Official'}
                </span>
              </div>

              <div className="flex items-start gap-3 sm:gap-4">
                <div className="hidden sm:flex w-12 h-12 rounded-xl bg-white/15 border border-white/20 items-center justify-center shrink-0 mt-1 shadow-xs">
                  <CurrentIcon className="w-6 h-6 text-white" aria-hidden="true" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight text-balance">
                    {pickLang(feature.title, language)}
                  </h1>
                  <p className="mt-2 text-sm sm:text-base text-emerald-50/95 leading-relaxed max-w-2xl">
                    {pickLang(feature.subtitle, language)}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Actions & Reporting Button */}
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0">
              {onOpenReportModal && reportButtonLabel && (
                <button
                  type="button"
                  onClick={onOpenReportModal}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#C81E1E] text-white hover:bg-[#a51818] active:scale-[0.98] transition-all font-semibold text-sm shadow-md cursor-pointer focus-visible:outline-2 focus-visible:outline-white"
                >
                  <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>{pickLang(reportButtonLabel, language)}</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleCopyLink}
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors text-xs font-medium border border-white/20 cursor-pointer"
                title={language === 'bn' ? 'লিংক কপি করুন' : 'Share / Copy Link'}
              >
                <Share2 className="w-3.5 h-3.5" aria-hidden="true" />
                <span>
                  {copiedLink
                    ? language === 'bn'
                      ? 'কপি হয়েছে!'
                      : 'Copied!'
                    : language === 'bn'
                      ? 'শেয়ার'
                      : 'Share'}
                </span>
              </button>
            </div>
          </div>

          {/* Highlight KPI Statistics Row */}
          {feature.highlightStats && feature.highlightStats.length > 0 && (
            <div className="mt-6 pt-5 border-t border-white/15 grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-2xl">
              {feature.highlightStats.map((stat, idx) => (
                <div
                  key={idx}
                  className="bg-white/10 backdrop-blur-xs rounded-lg px-3.5 py-2 border border-white/15"
                >
                  <div className="text-xl sm:text-2xl font-extrabold text-white tabular-nums tracking-tight">
                    {stat.value}
                  </div>
                  <div className="text-[11px] text-emerald-100/90 font-medium truncate">
                    {pickLang(stat.label, language)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 2. Horizontal Feature Switcher Bar across all 12 Smart City services */}
      <div className="sticky top-[68px] md:top-[76px] lg:top-[84px] xl:top-[90px] 2xl:top-[94px] z-30 bg-white/95 backdrop-blur-md border-b border-[#E2E8F0] shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Mobile Collapsible Dropdown */}
          <div className="md:hidden py-2.5">
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-expanded={mobileMenuOpen}
              className="w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-xs font-semibold text-[#111827]"
            >
              <div className="flex items-center gap-2 truncate">
                <CurrentIcon className="w-4 h-4 text-[#006A4E]" aria-hidden="true" />
                <span className="truncate">{pickLang(feature.title, language)}</span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-[#4B5563] transition-transform ${
                  mobileMenuOpen ? 'rotate-180' : ''
                }`}
                aria-hidden="true"
              />
            </button>

            {mobileMenuOpen && (
              <div className="mt-2 bg-white rounded-xl border border-[#E2E8F0] shadow-lg p-2 max-h-[60vh] overflow-y-auto divide-y divide-slate-100">
                <Link
                  href="/smart-city"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg transition-colors ${
                    pathname === '/smart-city'
                      ? 'bg-[#ECFDF5] text-[#006A4E]'
                      : 'text-[#111827] hover:bg-slate-50'
                  }`}
                >
                  <Sparkles className="w-4 h-4 text-[#006A4E]" />
                  <span>{language === 'bn' ? 'সকল স্মার্ট সিটি সেবা (হাবে ফিরুন)' : 'All Smart City Hub'}</span>
                </Link>
                {Object.values(SMART_CITY_FEATURES).map((f) => {
                  const ItemIcon = f.icon;
                  const isActive = f.slug === activeSlug;
                  return (
                    <Link
                      key={f.slug}
                      href={`/smart-city/${f.slug}`}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-2 px-3 py-2 text-xs rounded-lg transition-colors ${
                        isActive
                          ? 'bg-[#ECFDF5] text-[#006A4E] font-semibold'
                          : 'text-[#111827] hover:bg-slate-50'
                      }`}
                    >
                      <ItemIcon className="w-4 h-4 shrink-0 text-[#006A4E]" />
                      <span className="truncate">{pickLang(f.title, language)}</span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Desktop Horizontal Scroll Bar */}
          <div className="hidden md:flex items-center gap-1 overflow-x-auto py-2 scrollbar-none">
            <Link
              href="/smart-city"
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors shrink-0 ${
                pathname === '/smart-city'
                  ? 'bg-[#006A4E] text-white shadow-xs'
                  : 'text-[#4B5563] hover:text-[#006A4E] hover:bg-[#ECFDF5]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'পোর্টাল হাব' : 'Portal Hub'}</span>
            </Link>

            <span className="h-4 w-px bg-slate-200 mx-1 shrink-0" aria-hidden="true" />

            {Object.values(SMART_CITY_FEATURES).map((f) => {
              const ItemIcon = f.icon;
              const isActive = f.slug === activeSlug;
              return (
                <Link
                  key={f.slug}
                  href={`/smart-city/${f.slug}`}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs whitespace-nowrap transition-colors shrink-0 ${
                    isActive
                      ? 'bg-[#006A4E] text-white font-semibold shadow-xs'
                      : 'text-[#4B5563] hover:text-[#006A4E] hover:bg-[#ECFDF5]'
                  }`}
                >
                  <ItemIcon className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                  <span>{pickLang(f.shortTitle, language)}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. Main Page Content Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* Purpose / Mission Briefing Card */}
        <div className="mb-8 bg-white rounded-2xl border border-[#E2E8F0] p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#ECFDF5] border border-emerald-200 text-[#006A4E] flex items-center justify-center shrink-0 mt-0.5">
              <ShieldCheck className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#006A4E] uppercase tracking-wider mb-1">
                {language === 'bn' ? 'সেবার প্রাতিষ্ঠানিক উদ্দেশ্য' : 'Institutional Service Purpose'}
              </div>
              <p className="text-sm text-[#111827] leading-relaxed">
                {pickLang(feature.purpose, language)}
              </p>
            </div>
          </div>

          <div className="shrink-0 flex items-center gap-2 text-xs text-[#4B5563] bg-[#F8FAFC] px-3 py-1.5 rounded-lg border border-slate-200">
            <Clock className="w-3.5 h-3.5 text-[#006A4E]" />
            <span>
              {language === 'bn' ? 'সর্বশেষ হালনাগাদ: ২০ নভেম্বর ২০২৬' : 'Last Updated: 20 Nov 2026'}
            </span>
          </div>
        </div>

        {/* Dynamic Children (Interactive Feature View) */}
        {children}

        {/* 4. Frequently Asked Questions (Accordion) */}
        {faqs.length > 0 && (
          <section className="mt-12 bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-8 shadow-xs">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[#ECFDF5] text-[#006A4E] flex items-center justify-center shrink-0">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-[#111827]">
                  {language === 'bn' ? 'সাধারণ জিজ্ঞাসা (FAQ)' : 'Frequently Asked Questions'}
                </h2>
                <p className="text-xs sm:text-sm text-[#4B5563]">
                  {language === 'bn'
                    ? 'এই সেবা সংক্রান্ত নাগরিকদের সচরাচর জিজ্ঞাসিত প্রশ্ন ও সরকারি জবাব'
                    : 'Official clarifications and responses regarding this civic digital service'}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {faqs.map((faq, idx) => {
                const isOpen = faqOpenIdx === idx;
                return (
                  <div
                    key={idx}
                    className="border border-[#E2E8F0] rounded-xl overflow-hidden transition-colors"
                  >
                    <button
                      type="button"
                      onClick={() => setFaqOpenIdx(isOpen ? null : idx)}
                      aria-expanded={isOpen}
                      className="w-full flex items-center justify-between gap-4 p-4 text-left font-semibold text-sm sm:text-base text-[#111827] hover:bg-[#F8FAFC] cursor-pointer"
                    >
                      <span>{pickLang(faq.question, language)}</span>
                      <ChevronDown
                        className={`w-4 h-4 text-[#4B5563] transition-transform duration-200 shrink-0 ${
                          isOpen ? 'rotate-180 text-[#006A4E]' : ''
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="p-4 pt-1 text-sm text-[#4B5563] bg-[#F8FAFC] border-t border-slate-100 leading-relaxed">
                        {pickLang(faq.answer, language)}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* 5. Official Civic Support & Helpline Footer Band */}
        <div className="mt-10 bg-gradient-to-r from-[#006A4E] to-[#00523C] text-white rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center shrink-0">
              <PhoneCall className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold">
                {language === 'bn' ? 'সরাসরি সহায়তা প্রয়োজন?' : 'Need Direct Municipal Assistance?'}
              </h3>
              <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed mt-0.5">
                {language === 'bn'
                  ? 'ঢাকা সিটি কর্পোরেশন কেন্দ্রীয় কন্ট্রোল রুম হেল্পলাইন ১৬১০৬ (টোল-ফ্রি ২৪ ঘণ্টা)'
                  : 'Call DSCC Central Civic Command Helpline 16106 (24/7 Dedicated Support)'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <a
              href="tel:16106"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-[#006A4E] font-bold text-sm hover:bg-emerald-50 active:scale-[0.98] transition-all shadow-sm"
            >
              <PhoneCall className="w-4 h-4" />
              <span>16106</span>
            </a>
            <Link
              href="/about/contact"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-medium text-sm transition-colors border border-white/20"
            >
              <span>{language === 'bn' ? 'যোগাযোগ ডিরেক্টরি' : 'Directory'}</span>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
