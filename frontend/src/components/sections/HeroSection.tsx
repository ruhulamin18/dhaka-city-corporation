'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, PlayCircle, Search, X } from 'lucide-react';
import { Language, NoticeItem, WardInfo } from '@/types';
import { HERO_STATS, HOW_IT_WORKS_STEPS, POPULAR_SERVICES } from '@/data/homeData';

export interface HeroSectionProps {
  language: Language;
  wards: WardInfo[];
  notices: NoticeItem[];
}

export function HeroSection({ language, wards, notices }: HeroSectionProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [howItWorksOpen, setHowItWorksOpen] = useState(false);

  // Close "How It Works" modal on Escape key
  useEffect(() => {
    if (!howItWorksOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setHowItWorksOpen(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [howItWorksOpen]);

  const smartSearchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    const results: { id: string; label: string; meta: string; href: string }[] = [];

    for (const svc of POPULAR_SERVICES) {
      if (
        svc.titleEn.toLowerCase().includes(q) ||
        svc.titleBn.toLowerCase().includes(q) ||
        svc.meta.toLowerCase().includes(q)
      ) {
        results.push({
          id: `svc-${svc.id}`,
          label: language === 'bn' ? svc.titleBn : svc.titleEn,
          meta: svc.meta,
          href: svc.href,
        });
      }
    }

    for (const w of wards) {
      const wardLabel = `Ward ${w.wardNumber} — ${language === 'bn' ? w.nameBn : w.nameEn}`;
      if (
        wardLabel.toLowerCase().includes(q) ||
        String(w.wardNumber) === q ||
        w.councillorEn.toLowerCase().includes(q) ||
        w.councillorBn.toLowerCase().includes(q)
      ) {
        results.push({
          id: `ward-${w.wardNumber}`,
          label: wardLabel,
          meta: language === 'bn' ? w.zoneBn : w.zoneEn,
          href: `/city-map?ward=${w.wardNumber}`,
        });
      }
    }

    for (const n of notices) {
      const nTitle = language === 'bn' ? n.titleBn : n.titleEn;
      if (nTitle.toLowerCase().includes(q) || n.referenceCode.toLowerCase().includes(q)) {
        results.push({
          id: `notice-${n.id}`,
          label: nTitle,
          meta: n.referenceCode,
          href: '#notices',
        });
      }
    }

    if (q.startsWith('cmp-')) {
      results.push({
        id: 'track-cmp',
        label: `Track Complaint ${searchQuery.toUpperCase()}`,
        meta: 'Public Status Tracker',
        href: `/track?id=${encodeURIComponent(searchQuery.toUpperCase())}`,
      });
    }

    if (q.startsWith('dscc-')) {
      results.push({
        id: 'verify-dscc',
        label: `Verify Document ${searchQuery.toUpperCase()}`,
        meta: 'Public QR Verification',
        href: `/verify?id=${encodeURIComponent(searchQuery.toUpperCase())}`,
      });
    }

    return results.slice(0, 6);
  }, [searchQuery, wards, notices, language]);

  const handleHeroSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (smartSearchResults.length > 0) {
      router.push(smartSearchResults[0].href);
      setSearchFocused(false);
    }
  };

  return (
    <>
      {/* 1. CIVIC HERO SECTION — Full-bleed /images/hero.png with Left-Aligned Content Across Desktop & Mobile */}
      <section className="relative overflow-hidden bg-[#EDF9F4] border-b border-[#E2E8F0] min-h-[340px] sm:min-h-[390px] lg:min-h-[430px] xl:min-h-[460px] flex items-center">
        <Image
          src="/images/hero.png"
          alt="Ahsan Manzil and Dhaka Smart City Corporation Banner"
          fill
          priority
          sizes="100vw"
          referrerPolicy="no-referrer"
          className="object-cover object-[72%_center] sm:object-[62%_center] lg:object-center pointer-events-none select-none"
        />

        {/* Mobile & Tablet Left-Side Readability Scrim */}
        <div
          aria-hidden="true"
          className="lg:hidden absolute inset-0 bg-gradient-to-r from-[#EFFAF6]/95 via-[#EFFAF6]/82 to-[#EFFAF6]/15 pointer-events-none"
        />

        {/* Subtle Bottom Fade for Smooth Overlap with Floating Search Bar */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-white/75 to-transparent pointer-events-none"
        />

        {/* Left-Aligned Hero Typography & Actions */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16 sm:pt-12 sm:pb-20 lg:pt-14 lg:pb-24">
          <div className="w-[88%] sm:w-[70%] md:w-[58%] lg:w-[49%] max-w-xl text-left">
            <p className="text-[11px] sm:text-sm font-bold tracking-[0.14em] text-[#006A4E] uppercase">
              {language === 'bn' ? 'স্মার্ট সিটি কর্পোরেশন' : 'Smart City Corporation'}
            </p>
            <h1 className="mt-2 sm:mt-2.5 text-2xl sm:text-4xl lg:text-[2.75rem] font-extrabold text-[#0B2545] leading-[1.15] tracking-tight text-balance">
              {language === 'bn'
                ? 'পরিচ্ছন্ন, নিরাপদ ও স্মার্ট ঢাকার জন্য ডিজিটাল সেবা'
                : 'Digital Services for a Cleaner, Safer and Smarter Dhaka'}
            </h1>
            <p className="mt-3 sm:mt-4 text-xs sm:text-base text-[#374151] lg:text-[#4B5563] leading-relaxed max-w-md lg:max-w-lg">
              {language === 'bn'
                ? 'নাগরিক সেবা গ্রহণ, কর পরিশোধ, অনলাইন আবেদন এবং নগর সমস্যা রিপোর্ট করুন — সবকিছু এক প্ল্যাটফর্মে।'
                : 'Access city services, pay taxes, apply online and report urban issues — all in one platform.'}
            </p>

            <div className="mt-5 sm:mt-7 flex flex-wrap items-center justify-start gap-2.5 sm:gap-3">
              <a
                href="#services"
                className="inline-flex items-center gap-2 px-4 py-2.5 sm:px-5 sm:py-3 bg-[#006A4E] hover:bg-[#00523C] text-white font-semibold text-xs sm:text-sm rounded-lg shadow-sm transition-colors whitespace-nowrap"
              >
                <span>{language === 'bn' ? 'সেবাসমূহ দেখুন' : 'Explore Services'}</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </a>
              <button
                type="button"
                onClick={() => setHowItWorksOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 sm:px-5 sm:py-3 bg-white/95 hover:bg-[#ECFDF5] text-[#006A4E] border border-[#006A4E]/40 font-semibold text-xs sm:text-sm rounded-lg shadow-xs transition-colors whitespace-nowrap cursor-pointer"
              >
                <PlayCircle className="w-4 h-4" aria-hidden="true" />
                <span>{language === 'bn' ? 'কীভাবে কাজ করে' : 'How It Works'}</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FLOATING PILL SEARCH BAR (Overlapping Hero Bottom) */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 -mt-8 relative z-30">
        <div className="relative">
          <form
            onSubmit={handleHeroSearchSubmit}
            role="search"
            aria-label={language === 'bn' ? 'নাগরিক সেবা অনুসন্ধান' : 'Search municipal services'}
            className="bg-white rounded-full border border-[#E2E8F0] shadow-lg p-1.5 sm:p-2 flex items-center gap-2"
          >
            <div className="relative flex-1 flex items-center">
              <Search
                className="w-5 h-5 text-[#4B5563] ml-3.5 shrink-0 pointer-events-none"
                aria-hidden="true"
              />
              <input
                type="text"
                value={searchQuery}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setTimeout(() => setSearchFocused(false), 180)}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label={
                  language === 'bn'
                    ? 'সেবা, ওয়ার্ড, নোটিশ বা ট্র্যাকিং আইডি খুঁজুন'
                    : 'Search services, wards, notices, or tracking IDs'
                }
                placeholder={
                  language === 'bn'
                    ? 'সেবা খুঁজুন (যেমন: জন্ম সনদ, ট্রেড লাইসেন্স, হোল্ডিং ট্যাক্স)'
                    : 'Search for services (e.g. Birth Certificate, Trade License, Holding Tax)'
                }
                className="w-full pl-3 pr-3 py-2 text-sm text-[#111827] placeholder:text-slate-400 bg-transparent focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#006A4E] hover:bg-[#00523C] text-white font-semibold text-sm rounded-full transition-colors whitespace-nowrap shrink-0 cursor-pointer shadow-xs"
            >
              {language === 'bn' ? 'খুঁজুন' : 'Search'}
            </button>
          </form>

          {searchFocused && smartSearchResults.length > 0 && (
            <div className="absolute left-2 right-2 mt-2 bg-white text-[#111827] rounded-2xl border border-[#E2E8F0] shadow-2xl z-40 overflow-hidden">
              {smartSearchResults.map((res) => (
                <Link
                  key={res.id}
                  href={res.href}
                  className="flex items-center justify-between gap-4 px-5 py-3 hover:bg-[#ECFDF5] border-b last:border-b-0 border-slate-100"
                >
                  <div>
                    <p className="text-sm font-semibold text-[#111827]">{res.label}</p>
                    <p className="text-xs text-[#4B5563]">{res.meta}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#006A4E] shrink-0" aria-hidden="true" />
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 3. DARK CIVIC GREEN 4-COLUMN STATS RIBBON */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 relative z-20">
        <div className="relative overflow-hidden bg-gradient-to-r from-[#004A36] via-[#006A4E] to-[#00553E] text-white rounded-2xl shadow-md px-6 py-5 sm:px-8 sm:py-6">
          <div
            aria-hidden="true"
            className="civic-bg-layer absolute inset-y-0 right-0 w-1/2 bg-[url('/images/bg2.png')] bg-right-bottom bg-no-repeat bg-cover invert opacity-[0.12] pointer-events-none"
          />

          <div className="relative z-10 grid grid-cols-2 lg:grid-cols-4 gap-y-5 gap-x-6 lg:gap-0 lg:divide-x lg:divide-white/20">
            {HERO_STATS.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  className="flex items-center gap-3.5 lg:px-6 first:lg:pl-0 last:lg:pr-0"
                >
                  <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-emerald-200" aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xl sm:text-2xl font-bold text-white tabular-nums leading-tight">
                      {language === 'bn' ? item.valueBn : item.valueEn}
                    </p>
                    <p className="text-xs text-emerald-100/90 mt-0.5 truncate">
                      {language === 'bn' ? item.labelBn : item.labelEn}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* INTERACTIVE "HOW IT WORKS" MODAL */}
      {howItWorksOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="how-it-works-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setHowItWorksOpen(false);
            }
          }}
        >
          <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-2xl max-w-lg w-full overflow-hidden">
            <div className="bg-[#006A4E] text-white px-6 py-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-emerald-200 font-semibold">
                  {language === 'bn' ? 'ধাপে ধাপে নির্দেশিকা' : 'Quick Citizen Guide'}
                </p>
                <h3 id="how-it-works-title" className="text-lg font-bold">
                  {language === 'bn'
                    ? 'ডিজিটাল নাগরিক সেবা কীভাবে কাজ করে'
                    : 'How Digital City Services Work'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setHowItWorksOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/15 cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {HOW_IT_WORKS_STEPS.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.step}
                    className="flex items-start gap-3.5 p-3.5 rounded-xl bg-[#ECFDF5]/60 border border-emerald-200/70"
                  >
                    <div className="w-9 h-9 rounded-lg bg-[#006A4E] text-white flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#111827]">
                        {item.step}. {language === 'bn' ? item.titleBn : item.titleEn}
                      </p>
                      <p className="text-xs text-[#4B5563] mt-0.5 leading-relaxed">
                        {language === 'bn' ? item.descBn : item.descEn}
                      </p>
                    </div>
                  </div>
                );
              })}

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setHowItWorksOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#4B5563] bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer"
                >
                  {language === 'bn' ? 'বন্ধ করুন' : 'Close'}
                </button>
                <Link
                  href="/dashboard/citizen"
                  onClick={() => setHowItWorksOpen(false)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#006A4E] hover:bg-[#00523C] rounded-lg"
                >
                  <span>{language === 'bn' ? 'নাগরিক পোর্টালে যান' : 'Go to Citizen Portal'}</span>
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
