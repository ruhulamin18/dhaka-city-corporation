'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  AlertCircle,
  ArrowRight,
  Building,
  CheckCircle2,
  Clock,
  Compass,
  FileCheck,
  Home,
  Layers,
  MapPin,
  PhoneCall,
  Search,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { SMART_CITY_CATEGORIES, SMART_CITY_FEATURES } from '@/data/smart-city/features';
import { pickLang } from '@/types/about';
import type { SmartCityFeatureSlug } from '@/types/smart-city';

export default function SmartCityHubPage() {
  const { language } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCategories = SMART_CITY_CATEGORIES.map((cat) => {
    const matchingSlugs = cat.featureSlugs.filter((slug) => {
      const feat = SMART_CITY_FEATURES[slug];
      const q = searchQuery.trim().toLowerCase();
      if (!q) return true;
      return (
        feat.title.bn.toLowerCase().includes(q) ||
        feat.title.en.toLowerCase().includes(q) ||
        feat.subtitle.bn.toLowerCase().includes(q) ||
        feat.subtitle.en.toLowerCase().includes(q) ||
        feat.purpose.bn.toLowerCase().includes(q) ||
        feat.purpose.en.toLowerCase().includes(q)
      );
    });
    return { ...cat, featureSlugs: matchingSlugs };
  }).filter((cat) => cat.featureSlugs.length > 0);

  return (
    <div className="min-h-[85vh] bg-[#F8FAFC]">
      {/* 1. Civic Hero Institutional Banner */}
      <section className="relative overflow-hidden bg-[#006A4E] text-white border-b border-[#00523C]">
        <div
          aria-hidden="true"
          className="civic-bg-layer absolute inset-0 bg-[url('/images/bg2.png')] bg-right-bottom bg-no-repeat bg-cover invert opacity-[0.1] pointer-events-none"
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          {/* Breadcrumb */}
          <nav
            aria-label={language === 'bn' ? 'ব্রেডক্রাম্ব' : 'Breadcrumb'}
            className="flex items-center gap-1.5 text-xs text-emerald-100/90 mb-4"
          >
            <Link
              href="/"
              className="inline-flex items-center gap-1 hover:text-white transition-colors"
            >
              <Home className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{language === 'bn' ? 'হোম' : 'Home'}</span>
            </Link>
            <span className="text-emerald-200/60">/</span>
            <span className="text-white font-semibold">
              {language === 'bn' ? 'স্মার্ট সিটি পোর্টাল' : 'Smart City Portal'}
            </span>
          </nav>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 border border-white/20 text-xs font-semibold text-emerald-100 mb-3.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{language === 'bn' ? 'ঢাকা স্মার্ট সিটি ইনিশিয়েটিভ' : 'Dhaka Smart City Initiative'}</span>
              <span className="text-white/40">|</span>
              <span className="text-emerald-200">১২টি নাগরিক সেবা</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
              {language === 'bn'
                ? 'স্মার্ট সিটি ডিজিটাল সার্ভিস প্ল্যাটফর্ম'
                : 'Smart City Digital Civic Platform'}
            </h1>
            <p className="mt-3 text-base sm:text-lg text-emerald-50/95 leading-relaxed">
              {language === 'bn'
                ? 'ইন্টারঅ্যাক্টিভ জিআইএস স্যাটেলাইট মানচিত্র, ওয়ার্ডভিত্তিক ডিরেক্টরি, রিয়েল-টাইম বায়ুমান, ড্রেনেজ মনিটরিং ও সমন্বিত স্মার্ট নগর ব্যবস্থাপনা।'
                : 'Interactive GIS mapping, ward directories, real-time air quality index, storm drainage monitoring, and modern urban infrastructure.'}
            </p>
          </div>

          {/* Quick Search Filter */}
          <div className="mt-8 max-w-xl relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                language === 'bn'
                  ? 'স্মার্ট সিটির যেকোনো সেবা বা মানচিত্র খুঁজুন...'
                  : 'Search any smart city service or geospatial layer...'
              }
              className="w-full pl-12 pr-4 py-3.5 text-sm sm:text-base bg-white text-[#111827] rounded-2xl border-2 border-white/30 shadow-lg focus:outline-none focus:ring-4 focus:ring-emerald-400/40"
            />
          </div>

          {/* Key Municipal Numbers Row */}
          <div className="mt-8 pt-6 border-t border-white/15 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl">
            <div className="bg-white/10 backdrop-blur-xs rounded-xl p-3 border border-white/15">
              <div className="text-2xl font-black text-white tabular-nums">54</div>
              <div className="text-xs text-emerald-100 font-medium">
                {language === 'bn' ? 'আওতাভুক্ত ওয়ার্ড' : 'Covered Wards'}
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-xs rounded-xl p-3 border border-white/15">
              <div className="text-2xl font-black text-white tabular-nums">180+</div>
              <div className="text-xs text-emerald-100 font-medium">
                {language === 'bn' ? 'যাচাইকৃত জিআইএস মার্কার' : 'Verified GIS Points'}
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-xs rounded-xl p-3 border border-white/15">
              <div className="text-2xl font-black text-emerald-300 tabular-nums">94.2%</div>
              <div className="text-xs text-emerald-100 font-medium">
                {language === 'bn' ? 'অভিযোগ নিষ্পত্তির হার' : 'Resolution Rate'}
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-xs rounded-xl p-3 border border-white/15">
              <div className="text-2xl font-black text-white tabular-nums">16106</div>
              <div className="text-xs text-emerald-100 font-medium">
                {language === 'bn' ? '২৪/৭ নাগরিক হেল্পলাইন' : '24/7 Helpline'}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. All 4 Pillars & 12 Feature Cards */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-12">
        {filteredCategories.map((category) => (
          <section key={category.id} className="space-y-5">
            {/* Category Pillar Header */}
            <div className="flex items-start sm:items-center justify-between gap-4 border-b border-[#E2E8F0] pb-3.5">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-[#006A4E] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                  {category.number}
                </span>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-[#111827]">
                    {pickLang(category.title, language)}
                  </h2>
                  <p className="text-xs sm:text-sm text-[#4B5563]">
                    {pickLang(category.description, language)}
                  </p>
                </div>
              </div>
            </div>

            {/* Feature Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {category.featureSlugs.map((slug) => {
                const feat = SMART_CITY_FEATURES[slug];
                const FeatIcon = feat.icon;
                return (
                  <Link
                    key={slug}
                    href={`/smart-city/${slug}`}
                    className="group bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs hover:shadow-md hover:border-[#006A4E] transition-all flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <div className="w-11 h-11 rounded-xl bg-[#ECFDF5] text-[#006A4E] group-hover:bg-[#006A4E] group-hover:text-white transition-colors flex items-center justify-center shrink-0">
                          <FeatIcon className="w-5 h-5" />
                        </div>
                        {feat.badge && (
                          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                            {pickLang(feat.badge, language)}
                          </span>
                        )}
                      </div>

                      <div>
                        <h3 className="text-base sm:text-lg font-bold text-[#111827] group-hover:text-[#006A4E] transition-colors">
                          {pickLang(feat.title, language)}
                        </h3>
                        <p className="text-xs sm:text-sm text-[#4B5563] mt-1.5 leading-relaxed line-clamp-2">
                          {pickLang(feat.subtitle, language)}
                        </p>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#006A4E]">
                      <span>{language === 'bn' ? 'সেবাটি খুলুন' : 'Access Service'}</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        ))}
      </main>
    </div>
  );
}
