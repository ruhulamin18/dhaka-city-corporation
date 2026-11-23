'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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

const HERO_IMAGES = [
  {
    src: '/images/hero1.png',
    alt: 'Dhaka Smart City Digital Governance - Slide 1',
  },
  {
    src: '/images/hero2.png',
    alt: 'Dhaka Smart City Digital Governance - Slide 2',
  },
  {
    src: '/images/hero3.png',
    alt: 'Dhaka Smart City Digital Governance - Slide 3',
  },
  {
    src: '/images/hero4.png',
    alt: 'Dhaka Smart City Digital Governance - Slide 4',
  },
];

export function HeroSection({ language, wards, notices }: HeroSectionProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [howItWorksOpen, setHowItWorksOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // 5-second auto-transition timer
  const startTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    timerRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5000);
  }, []);

  useEffect(() => {
    startTimer();
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [startTimer]);

  const handleDotClick = (index: number) => {
    setCurrentSlide(index);
    startTimer(); // Reset the 5-second timer on manual dot click
  };

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
      {/* 
        HOMEPAGE HERO SECTION
        - Unslop calibrated height & spacing across mobile, tablet, and desktop
        - Stable responsive rhythm with high-contrast civic scenery overlay
      */}
      <section className="relative overflow-hidden w-full min-h-[520px] sm:min-h-[560px] lg:min-h-[600px] xl:min-h-[640px] flex flex-col justify-between">
        {/* 1. Background Image Slider with CSS Crossfade & Calm Civic Green Vignette Scrim */}
        <div
          className="absolute inset-0 pointer-events-none select-none overflow-hidden"
          aria-hidden="true"
        >
          {HERO_IMAGES.map((img, idx) => (
            <div
              key={img.src}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                idx === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                priority={idx === 0}
                sizes="100vw"
                referrerPolicy="no-referrer"
                className="object-cover object-center select-none"
              />
            </div>
          ))}

          {/* Deep Bangladesh Civic Green Scrim — high readability without muddy gradient transitions */}
          <div
            className="absolute inset-0 bg-gradient-to-r from-[#022c22]/95 via-[#022c22]/85 to-[#064e3b]/55"
            aria-hidden="true"
          />
        </div>

        {/* 2. Static Foreground Content: Headline, Global Search & Statistics */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12 flex-1 flex flex-col justify-between gap-6 sm:gap-8">
          {/* Top Block: Civic Badge, Bilingual Headline, Subtitle & Action CTAs */}
          <div className="w-full max-w-2xl text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-xs border border-white/15 text-xs font-medium text-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" aria-hidden="true" />
              <span>{language === 'bn' ? 'ঢাকা স্মার্ট সিটি কর্পোরেশন' : 'Dhaka Smart City Corporation'}</span>
            </div>

            <h1 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-[1.14] tracking-tight text-balance">
              {language === 'bn'
                ? 'পরিচ্ছন্ন, নিরাপদ ও স্মার্ট ঢাকার জন্য ডিজিটাল সেবা'
                : 'Digital Services for a Cleaner, Safer and Smarter Dhaka'}
            </h1>

            <p className="mt-3 text-sm sm:text-base text-emerald-100/90 leading-relaxed max-w-xl">
              {language === 'bn'
                ? 'নাগরিক সেবা গ্রহণ, কর পরিশোধ, অনলাইন আবেদন এবং নগর সমস্যা রিপোর্ট করুন — সবকিছু এক প্ল্যাটফর্মে।'
                : 'Access city services, pay taxes, apply online and report urban issues — all in one platform.'}
            </p>

            <div className="mt-5 flex flex-wrap items-center justify-start gap-3">
              <a
                href="#services"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-emerald-50 text-[#006A4E] font-semibold text-sm rounded-lg shadow-sm transition-colors whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                <span>{language === 'bn' ? 'সেবাসমূহ দেখুন' : 'Explore Services'}</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </a>
              <button
                type="button"
                onClick={() => setHowItWorksOpen(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/15 text-white border border-white/20 font-medium text-sm rounded-lg transition-colors whitespace-nowrap cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                <PlayCircle className="w-4 h-4 text-emerald-300" aria-hidden="true" />
                <span>{language === 'bn' ? 'কীভাবে কাজ করে' : 'How It Works'}</span>
              </button>
            </div>
          </div>

          {/* Middle Block: Global Civic Search Bar */}
          <div className="w-full max-w-2xl relative z-30">
            <div className="relative">
              <form
                onSubmit={handleHeroSearchSubmit}
                role="search"
                aria-label={language === 'bn' ? 'নাগরিক সেবা অনুসন্ধান' : 'Search municipal services'}
                className="bg-white rounded-xl border border-white/20 p-1.5 sm:p-2 flex items-center gap-2 shadow-lg"
              >
                <div className="relative flex-1 flex items-center">
                  <Search
                    className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 ml-3 shrink-0 pointer-events-none"
                    aria-hidden="true"
                  />
                  <input
                    type="text"
                    value={searchQuery}
                    onFocus={() => setSearchFocused(true)}
                    onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    aria-label={
                      language === 'bn'
                        ? 'সেবা, ওয়ার্ড, নোটিশ বা ট্র্যাকিং আইডি খুঁজুন'
                        : 'Search services, wards, notices, or tracking IDs'
                    }
                    placeholder={
                      language === 'bn'
                        ? 'সেবা খুঁজুন (যেমন: জন্ম সনদ, ট্রেড লাইসেন্স, হোল্ডিং ট্যাক্স)'
                        : 'Search services, wards, notices, tracking IDs...'
                    }
                    className="w-full pl-2.5 pr-2 py-1.5 text-sm text-[#111827] placeholder:text-slate-400 bg-transparent focus:outline-none"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="p-1 mr-1 text-slate-400 hover:text-slate-600 rounded-md cursor-pointer transition-colors"
                      aria-label="Clear search"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#006A4E] hover:bg-[#00523C] text-white font-medium text-sm rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer shadow-xs"
                >
                  {language === 'bn' ? 'খুঁজুন' : 'Search'}
                </button>
              </form>

              {searchFocused && smartSearchResults.length > 0 && (
                <div className="absolute left-0 right-0 mt-2 bg-white text-[#111827] rounded-xl border border-[#E2E8F0] shadow-xl z-40 max-h-56 sm:max-h-64 overflow-y-auto divide-y divide-slate-100">
                  {smartSearchResults.map((res) => (
                    <Link
                      key={res.id}
                      href={res.href}
                      className="flex items-center justify-between gap-4 px-4 py-3 hover:bg-emerald-50/50 transition-colors"
                    >
                      <div>
                        <p className="text-sm font-semibold text-[#111827]">{res.label}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{res.meta}</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-[#006A4E] shrink-0" aria-hidden="true" />
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Bottom Block: Dark Civic Green 4-Column Statistics Ribbon */}
          <div className="w-full relative z-20">
            <div className="relative overflow-hidden text-white rounded-xl sm:rounded-2xl px-4 py-3 sm:px-6 sm:py-4 lg:px-8 lg:py-5 bg-[#00382B]/80 backdrop-blur-sm border border-white/15 shadow-sm">
              <div className="relative z-10 grid grid-cols-2 lg:grid-cols-4 gap-y-3 gap-x-4 sm:gap-6 lg:gap-0 lg:divide-x lg:divide-white/15">
                {HERO_STATS.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 sm:gap-3.5 lg:px-6 first:lg:pl-0 last:lg:pr-0"
                    >
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-200" aria-hidden="true" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-base sm:text-lg lg:text-2xl font-bold text-white tabular-nums leading-tight">
                          {language === 'bn' ? item.valueBn : item.valueEn}
                        </p>
                        <p className="text-xs text-emerald-200/90 mt-0.5 truncate">
                          {language === 'bn' ? item.labelBn : item.labelEn}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* 3. Clickable Pagination Indicator Dots (Bottom Center) */}
        <div className="relative z-20 flex items-center justify-center gap-2 pb-3 sm:pb-4">
          {HERO_IMAGES.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleDotClick(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              aria-current={idx === currentSlide ? 'true' : undefined}
              className={`transition-all duration-200 rounded-full cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 ${
                idx === currentSlide
                  ? 'w-6 h-1.5 bg-emerald-400'
                  : 'w-1.5 h-1.5 bg-white/40 hover:bg-white/70'
              }`}
            />
          ))}
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
                    className="flex items-start gap-3.5 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80"
                  >
                    <div className="w-9 h-9 rounded-lg bg-[#006A4E] text-white flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#111827]">
                        {item.step}. {language === 'bn' ? item.titleBn : item.titleEn}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
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
                  className="px-4 py-2 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer transition-colors"
                >
                  {language === 'bn' ? 'বন্ধ করুন' : 'Close'}
                </button>
                <Link
                  href="/dashboard/citizen"
                  onClick={() => setHowItWorksOpen(false)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-[#006A4E] hover:bg-[#00523C] rounded-lg transition-colors"
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
