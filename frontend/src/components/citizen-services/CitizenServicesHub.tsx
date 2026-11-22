'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ChevronRight,
  Globe2,
  Home,
  Search,
  ShieldCheck,
  X,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import {
  ALL_CITIZEN_SERVICES,
  CITIZEN_SERVICE_CATEGORIES,
  getServicesByCategory,
  searchCitizenServices,
} from '@/data/services';
import { ServiceCategorySlug, pickText } from '@/types/citizen-service';
import ServiceCategoryCard from './ServiceCategoryCard';
import ServiceCard from './ServiceCard';
import CitizenServiceHero from './CitizenServiceHero';

export default function CitizenServicesHub() {
  const { language } = useApp();
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<
    ServiceCategorySlug | 'all'
  >('all');

  const filteredServices = useMemo(
    () => searchCitizenServices(query, selectedCategory),
    [query, selectedCategory]
  );

  const publicToolCount = useMemo(
    () => ALL_CITIZEN_SERVICES.filter((s) => !s.requiresAuthForAction).length,
    []
  );

  return (
    <div className="min-h-screen pb-16">
      {/* Hero Banner with Shared Background & Height Preservation */}
      <CitizenServiceHero innerClassName="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
        <nav
          aria-label={language === 'bn' ? 'ব্রেডক্রাম্ব' : 'Breadcrumb'}
          className="mb-4 flex items-center gap-1.5 text-xs font-medium text-emerald-100/90"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-1 hover:text-white transition-colors"
          >
            <Home className="h-3.5 w-3.5" aria-hidden="true" />
            <span>{language === 'bn' ? 'হোম' : 'Home'}</span>
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-emerald-200/70" aria-hidden="true" />
          <span className="font-semibold text-white">
            {language === 'bn' ? 'নাগরিক সেবা' : 'Citizen Services'}
          </span>
        </nav>

        <div className="max-w-3xl">
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-[2.75rem] drop-shadow-xs">
            {language === 'bn'
              ? 'ঢাকা সিটি কর্পোরেশন নাগরিক সেবা পোর্টাল'
              : 'Dhaka City Corporation Citizen Services'}
          </h1>
          <p className="mt-3.5 text-sm leading-relaxed text-emerald-50/95 sm:text-base lg:text-[1.0625rem] lg:leading-relaxed drop-shadow-2xs">
            {language === 'bn'
              ? '৪টি প্রধান বিভাগে ৩১টি সরকারি নাগরিক সেবার বিস্তারিত নির্দেশনা, প্রয়োজনীয় কাগজপত্র, যোগ্যতা ও অনলাইন আবেদন সুবিধা। সকল সেবার তথ্য লগইন ছাড়াই উন্মুক্ত।'
              : 'Explore all 31 official municipal services across 4 core categories. Browse eligibility, required documents, process steps, and public tools freely without logging in.'}
          </p>
        </div>

        {/* Search Bar */}
        <div className="mt-7 max-w-2xl">
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
              aria-hidden="true"
            />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={
                language === 'bn'
                  ? 'সেবা খুঁজুন (যেমন: জন্ম নিবন্ধন, ট্রেড লাইসেন্স, হোল্ডিং ট্যাক্স, সড়ক মেরামত)...'
                  : 'Search services (e.g., Birth Registration, Trade License, Holding Tax, Road Repair)...'
              }
              aria-label={language === 'bn' ? 'নাগরিক সেবা খুঁজুন' : 'Search citizen services'}
              className="w-full rounded-xl border border-white/20 bg-white py-3.5 pl-12 pr-11 text-sm text-slate-900 shadow-md placeholder:text-slate-400 focus:border-white focus:outline-none focus:ring-2 focus:ring-emerald-200"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                aria-label={language === 'bn' ? 'অনুসন্ধান মুছুন' : 'Clear search'}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 cursor-pointer"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            )}
          </div>
        </div>

        {/* Portal Summary Highlights */}
        <div className="mt-7 flex flex-wrap gap-3 text-xs font-semibold">
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-black/25 backdrop-blur-xs border border-white/20 px-3 py-1.5 text-emerald-100 shadow-2xs">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-300" aria-hidden="true" />
            {language === 'bn'
              ? `মোট ${ALL_CITIZEN_SERVICES.length}টি নাগরিক সেবা`
              : `${ALL_CITIZEN_SERVICES.length} Official Services`}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-black/25 backdrop-blur-xs border border-white/20 px-3 py-1.5 text-emerald-100 shadow-2xs">
            <Globe2 className="h-3.5 w-3.5 text-emerald-300" aria-hidden="true" />
            {language === 'bn'
              ? `${publicToolCount}টি তাৎক্ষণিক উন্মুক্ত টুল ও তালিকা`
              : `${publicToolCount} Instant Public Tools & Directories`}
          </span>
        </div>
      </CitizenServiceHero>

      <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8 space-y-10">
        {/* 4 Category Cards */}
        <section aria-labelledby="categories-heading">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2
                id="categories-heading"
                className="text-xl font-bold text-slate-900 sm:text-2xl"
              >
                {language === 'bn' ? 'সেবার প্রধান বিভাগসমূহ' : 'Main Service Categories'}
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                {language === 'bn'
                  ? 'আপনার প্রয়োজনীয় বিভাগ নির্বাচন করে সরাসরি সেবাসমূহ দেখুন'
                  : 'Select a category to browse its dedicated municipal services'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {CITIZEN_SERVICE_CATEGORIES.map((category) => (
              <ServiceCategoryCard
                key={category.slug}
                category={category}
                serviceCount={getServicesByCategory(category.slug).length}
                isActive={selectedCategory === category.slug}
                onSelect={() =>
                  setSelectedCategory((prev) =>
                    prev === category.slug ? 'all' : category.slug
                  )
                }
              />
            ))}
          </div>
        </section>

        {/* Filter Tabs + All 31 Services Grid */}
        <section aria-labelledby="all-services-heading">
          <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2
                id="all-services-heading"
                className="text-xl font-bold text-slate-900 sm:text-2xl"
              >
                {language === 'bn' ? 'সকল নাগরিক সেবা' : 'All Citizen Services'}
                <span className="ml-2 text-base font-semibold text-[#006A4E]">
                  ({filteredServices.length})
                </span>
              </h2>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setSelectedCategory('all')}
                className={`rounded-xl px-3.5 py-2 text-xs font-semibold transition-colors cursor-pointer ${
                  selectedCategory === 'all'
                    ? 'bg-[#006A4E] text-white'
                    : 'border border-[#E2E8F0] bg-white text-slate-700 hover:border-[#006A4E] hover:text-[#006A4E]'
                }`}
              >
                {language === 'bn'
                  ? `সকল সেবা (${ALL_CITIZEN_SERVICES.length})`
                  : `All (${ALL_CITIZEN_SERVICES.length})`}
              </button>

              {CITIZEN_SERVICE_CATEGORIES.map((cat) => (
                <button
                  key={cat.slug}
                  type="button"
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={`rounded-xl px-3.5 py-2 text-xs font-semibold transition-colors cursor-pointer ${
                    selectedCategory === cat.slug
                      ? 'bg-[#006A4E] text-white'
                      : 'border border-[#E2E8F0] bg-white text-slate-700 hover:border-[#006A4E] hover:text-[#006A4E]'
                  }`}
                >
                  {pickText(cat.shortTitle, language)}
                </button>
              ))}
            </div>
          </div>

          {filteredServices.length === 0 ? (
            <div className="rounded-2xl border border-[#E2E8F0] bg-white p-10 text-center">
              <p className="text-base font-bold text-slate-900">
                {language === 'bn'
                  ? 'আপনার অনুসন্ধানের সাথে মিলে এমন কোনো সেবা পাওয়া যায়নি'
                  : 'No services matched your search'}
              </p>
              <p className="mt-1 text-sm text-slate-600">
                {language === 'bn'
                  ? 'অন্য কোনো কীওয়ার্ড দিয়ে চেষ্টা করুন অথবা ফিল্টার রিসেট করুন।'
                  : 'Try a different Bangla or English keyword, or reset your active filters.'}
              </p>
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  setSelectedCategory('all');
                }}
                className="mt-4 inline-flex items-center justify-center rounded-xl bg-[#006A4E] px-4 py-2 text-xs font-semibold text-white hover:bg-[#00523C] transition-colors cursor-pointer"
              >
                {language === 'bn' ? 'ফিল্টার রিসেট করুন' : 'Reset Filters'}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filteredServices.map((service) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  showCategoryBadge={selectedCategory === 'all'}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
