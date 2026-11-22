'use client';

import React from 'react';
import Link from 'next/link';
import {
  Accessibility,
  AlignJustify,
  ArrowRight,
  ChevronRight,
  Contrast,
  Eye,
  Globe2,
  Home,
  Languages,
  MousePointerClick,
  PhoneCall,
  Sliders,
  Sparkles,
  Type,
  ZoomIn,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { openAccessibilityDrawer } from '@/components/AccessibilityWidget';

export default function AccessibilityStatementPage() {
  const { language } = useApp();
  const isBn = language === 'bn';

  const accessibilityFeatures = [
    {
      id: 'font-size',
      icon: Type,
      titleBn: 'হরফের আকার পরিবর্তন (Font Resize)',
      titleEn: 'Font Size Adjustment',
      shortBn: 'পড়ার সুবিধার জন্য টেক্সটের আকার ৮৫% থেকে ১৩০% পর্যন্ত ছোট বা বড় করার তাৎক্ষণিক ব্যবস্থা।',
      shortEn: 'Dynamically scale typography from 85% to 130% across all pages for comfortable readability.',
      badgeBn: '৮৫% - ১৩০% জুম',
      badgeEn: '85% - 130% Scale',
    },
    {
      id: 'contrast-monochrome',
      icon: Contrast,
      titleBn: 'উচ্চ বৈসাদৃশ্য ও মনোক্রোম (Contrast & Monochrome)',
      titleEn: 'Contrast & Monochrome Modes',
      shortBn: 'চোখের চাপ কমাতে পূর্ণ মনোক্রোম (Grayscale) ও হাই-কনট্রাস্ট ইনভার্ট কালার মোড নির্বাচন সুবিধা।',
      shortEn: 'Toggle high-contrast color inversion or full grayscale to alleviate visual fatigue and glare.',
      badgeBn: 'চোখের সুরক্ষা মোড',
      badgeEn: 'Eye Comfort Filter',
    },
    {
      id: 'cursor-guide',
      icon: MousePointerClick,
      titleBn: 'বড় কার্সর ও পড়ার নির্দেশিকা (Cursor & Reading Guide)',
      titleEn: 'Big Cursor & Reading Guide',
      shortBn: 'সহজে চিহ্নিত করার মতো বড় মাউস কার্সর এবং দীর্ঘ অনুচ্ছেদ এক নজরে অনুসরণ করতে হরিজন্টাল রুলার।',
      shortEn: 'High-visibility cursor targeting and a horizontal reading ruler to guide focus across lengthy text.',
      badgeBn: 'সহজ নেভিগেশন',
      badgeEn: 'Guided Navigation',
    },
    {
      id: 'bilingual-support',
      icon: Languages,
      titleBn: 'দ্বিভাষিক বাংলা ও ইংরেজি সমর্থন (Bilingual Parity)',
      titleEn: 'Bilingual Bangla & English Parity',
      shortBn: 'সকল ডিজিটাল ফরম, নোটিশ ও নাগরিক সেবা শতভাগ শুদ্ধ প্রমিত বাংলা এবং আন্তর্জাতিক ইংরেজিতে লভ্য।',
      shortEn: 'Full contextual parity across forms, guidelines, and tables in standard Bangla and English.',
      badgeBn: '১০০% দ্বিভাষিক সাপোর্ট',
      badgeEn: '100% Bilingual',
    },
  ];

  return (
    <div className="min-h-screen pb-16 bg-[#F8FAFC]">
      {/* Civic Green Institutional Header Banner */}
      <section className="relative overflow-hidden bg-[#006A4E] text-white border-b border-[#00523C]">
        <div
          aria-hidden="true"
          className="civic-bg-layer absolute inset-0 bg-[url('/images/bg2.png')] bg-right-bottom bg-no-repeat bg-cover invert opacity-[0.12] pointer-events-none select-none"
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
          {/* Breadcrumb */}
          <nav
            aria-label={isBn ? 'ব্রেডক্রাম্ব' : 'Breadcrumb'}
            className="flex flex-wrap items-center gap-1.5 text-xs text-emerald-100/90 mb-4"
          >
            <Link
              href="/"
              className="inline-flex items-center gap-1 hover:text-white transition-colors"
            >
              <Home className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{isBn ? 'হোম' : 'Home'}</span>
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-emerald-200/70" aria-hidden="true" />
            <span className="text-white font-semibold" aria-current="page">
              {isBn ? 'প্রবেশগম্যতা (Accessibility)' : 'Accessibility'}
            </span>
          </nav>

          {/* Page Title, Subtitle & Primary CTA Trigger */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-1.5 rounded-md bg-black/20 border border-white/20 px-2.5 py-0.5 text-xs font-semibold text-emerald-100 mb-2">
                <Accessibility className="w-3.5 h-3.5 text-emerald-300" aria-hidden="true" />
                <span>
                  {isBn ? 'আন্তর্জাতিক WCAG 2.1 গাইডলাইন সমর্থিত' : 'WCAG 2.1 Compliant Portal'}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white drop-shadow-xs">
                {isBn
                  ? 'সবার জন্য সহজ ডিজিটাল প্রবেশগম্যতা'
                  : 'Universal Digital Accessibility for All'}
              </h1>
              <p className="mt-2 text-sm sm:text-base text-emerald-50/95 leading-relaxed max-w-2xl drop-shadow-2xs">
                {isBn
                  ? 'শারীরিক সীমাবদ্ধতা বা দৃষ্টির তারতম্য নির্বিশেষে প্রতিটি নাগরিক যেন সমান স্বাচ্ছন্দ্যে ঢাকা সিটি কর্পোরেশনের ডিজিটাল সেবা গ্রহণ করতে পারেন, পোর্টালটিতে রয়েছে বিভিন্ন সহায়ক টুলস।'
                  : 'Designed to ensure every citizen—regardless of age, visual acuity, or physical ability—can independently navigate municipal services with ease and comfort.'}
              </p>
            </div>

            {/* Prominent Action Button to Open Accessibility Drawer */}
            <div className="shrink-0">
              <button
                type="button"
                onClick={openAccessibilityDrawer}
                className="inline-flex items-center gap-2.5 rounded-xl bg-white text-[#006A4E] hover:bg-[#ECFDF5] hover:shadow-xl px-5 py-3.5 text-sm sm:text-base font-bold shadow-lg transition-all cursor-pointer ring-2 ring-white/30"
              >
                <Sliders className="w-5 h-5 text-[#006A4E]" aria-hidden="true" />
                <span>
                  {isBn ? 'অ্যাক্সেসিবিলিটি টুলস চালু করুন' : 'Open Accessibility Tools'}
                </span>
                <ArrowRight className="w-4 h-4 text-[#006A4E]" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content: Compact 4-Item Feature Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-[#E2E8F0] pb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {isBn ? 'সহায়ক এক্সেসিবিলিটি সুবিধাসমূহ' : 'Available Accessibility Features'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              {isBn
                ? 'ডানপাশের ভাসমান আইকন বা উপরের বোতামে ক্লিক করে যে কোনো সময় এই সেটিংস পরিবর্তন করতে পারেন'
                : 'You can adjust these settings anytime via the floating widget or top action button'}
            </p>
          </div>

          <button
            type="button"
            onClick={openAccessibilityDrawer}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#006A4E] hover:text-[#00523C] hover:underline cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
            <span>{isBn ? 'প্যানেল খুলুন' : 'Open Panel'}</span>
          </button>
        </div>

        {/* 4 Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {accessibilityFeatures.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.id}
                className="group relative overflow-hidden rounded-xl border border-[#E2E8F0] bg-white p-6 shadow-xs transition-all duration-300 ease-out hover:-translate-y-1 hover:border-[#006A4E] hover:bg-[#ECFDF5]/80 hover:shadow-md flex flex-col justify-between"
              >
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-1 bg-transparent transition-colors duration-300 group-hover:bg-[#006A4E]"
                />

                <div>
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#ECFDF5] text-[#006A4E] transition-all duration-300 group-hover:scale-105 group-hover:bg-[#006A4E] group-hover:text-white shadow-2xs">
                      <Icon className="h-6 w-6" aria-hidden="true" />
                    </div>
                    <span className="rounded-md border border-[#E2E8F0] bg-[#F8FAFC] px-2.5 py-1 text-xs font-medium text-slate-600 group-hover:border-emerald-200 group-hover:bg-white group-hover:text-[#006A4E] transition-colors">
                      {isBn ? feat.badgeBn : feat.badgeEn}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-slate-900 transition-colors duration-300 group-hover:text-[#006A4E]">
                    {isBn ? feat.titleBn : feat.titleEn}
                  </h3>

                  <p className="mt-2 text-sm leading-relaxed text-slate-600 group-hover:text-slate-700 transition-colors">
                    {isBn ? feat.shortBn : feat.shortEn}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-[#E2E8F0]/70 flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#006A4E]">
                    {isBn ? 'সক্রিয় বা নিষ্ক্রিয়যোগ্য' : 'Customizable'}
                  </span>
                  <button
                    type="button"
                    onClick={openAccessibilityDrawer}
                    className="font-semibold text-slate-700 hover:text-[#006A4E] hover:underline cursor-pointer inline-flex items-center gap-1"
                  >
                    <span>{isBn ? 'পরীক্ষা করুন' : 'Try this'}</span>
                    <ArrowRight className="w-3 h-3" aria-hidden="true" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Assistive Helpdesk Banner */}
        <div className="mt-10 rounded-2xl border border-[#E2E8F0] bg-white p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="max-w-2xl">
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              {isBn
                ? 'বিশেষ সহায়তা বা সহায়ক ডিভাইস ব্যবহারে সমস্যা?'
                : 'Need Assistive Technology Assistance?'}
            </h3>
            <p className="mt-1 text-sm text-slate-600 leading-relaxed">
              {isBn
                ? 'স্ক্রিন রিডার বা ব্রেইল ডিভাইস ব্যবহারে কোনো সমস্যা হলে আমাদের হেল্পলাইনে কল করুন অথবা আপনার নিকটস্থ ওয়ার্ড কার্যালয়ের সিটিজেন সেবা ডেস্কে সরাসরি সহায়তা নিন।'
                : 'If you encounter any difficulty using screen readers or assistive keyboards, contact our dedicated civic support hotline for immediate guidance.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={openAccessibilityDrawer}
              className="inline-flex items-center gap-2 rounded-xl bg-[#006A4E] text-white px-5 py-3 text-sm font-bold hover:bg-[#00523C] transition-colors cursor-pointer shadow-xs"
            >
              <Accessibility className="w-4 h-4" aria-hidden="true" />
              <span>{isBn ? 'টুলস প্যানেল খুলুন' : 'Open Tools Panel'}</span>
            </button>

            <a
              href="tel:16106"
              className="inline-flex items-center gap-2 rounded-xl bg-[#ECFDF5] border border-emerald-200 px-4 py-3 text-sm font-bold text-[#006A4E] hover:bg-emerald-100 transition-colors"
            >
              <PhoneCall className="w-4 h-4" aria-hidden="true" />
              <span>{isBn ? '১৬১০৬ হেল্পডেস্ক' : '16106 Helpdesk'}</span>
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
