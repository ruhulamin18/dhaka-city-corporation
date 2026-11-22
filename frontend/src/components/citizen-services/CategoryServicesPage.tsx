'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronRight, Home, Search, X } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import {
  CITIZEN_SERVICE_CATEGORIES,
  getCategoryBySlug,
  getServicesByCategory,
  searchCitizenServices,
} from '@/data/services';
import { ServiceCategorySlug, pickText } from '@/types/citizen-service';
import ServiceCard from './ServiceCard';
import CitizenServiceHero from './CitizenServiceHero';

interface CategoryServicesPageProps {
  categorySlug: ServiceCategorySlug;
}

export default function CategoryServicesPage({
  categorySlug,
}: CategoryServicesPageProps) {
  const { language } = useApp();
  const [query, setQuery] = useState('');

  const category = getCategoryBySlug(categorySlug);
  const allInCategory = useMemo(
    () => getServicesByCategory(categorySlug),
    [categorySlug]
  );
  const filteredServices = useMemo(
    () => searchCitizenServices(query, categorySlug),
    [query, categorySlug]
  );

  if (!category) return null;

  const Icon = category.icon;
  const otherCategories = CITIZEN_SERVICE_CATEGORIES.filter(
    (c) => c.slug !== categorySlug
  );

  return (
    <div className="min-h-screen pb-16">
      {/* Category Header Banner with Shared Background & Height Preservation */}
      <CitizenServiceHero innerClassName="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
        <nav
          aria-label={language === 'bn' ? 'ব্রেডক্রাম্ব' : 'Breadcrumb'}
          className="mb-4 flex flex-wrap items-center gap-1.5 text-xs font-medium text-emerald-100/90"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-1 hover:text-white transition-colors"
          >
            <Home className="h-3.5 w-3.5" aria-hidden="true" />
            <span>{language === 'bn' ? 'হোম' : 'Home'}</span>
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-emerald-200/70" aria-hidden="true" />
          <Link
            href="/citizen-services"
            className="hover:text-white transition-colors"
          >
            {language === 'bn' ? 'নাগরিক সেবা' : 'Citizen Services'}
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-emerald-200/70" aria-hidden="true" />
          <span className="font-semibold text-white">
            {pickText(category.title, language)}
          </span>
        </nav>

        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-black/20 text-white ring-1 ring-white/25 backdrop-blur-xs shadow-2xs">
              <Icon className="h-7 w-7 text-emerald-300" aria-hidden="true" />
            </div>
            <div>
              <span className="inline-block rounded-md bg-black/25 backdrop-blur-xs border border-white/20 px-2.5 py-0.5 text-xs font-semibold text-emerald-100 shadow-2xs">
                {language === 'bn'
                  ? `বিভাগ ০${category.order} · ${allInCategory.length}টি সেবা`
                  : `Category 0${category.order} · ${allInCategory.length} Services`}
              </span>
              <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-white sm:text-3xl lg:text-4xl drop-shadow-xs">
                {pickText(category.title, language)}
              </h1>
              <p className="mt-2.5 max-w-2xl text-sm leading-relaxed text-emerald-50/95 sm:text-base drop-shadow-2xs">
                {pickText(category.description, language)}
              </p>
            </div>
          </div>
        </div>

        {/* Within-category Search */}
        <div className="mt-7 max-w-xl">
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
              aria-hidden="true"
            />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={
                language === 'bn'
                  ? `${category.title.bn} বিভাগের মধ্যে সেবা খুঁজুন...`
                  : `Search within ${category.title.en}...`
              }
              className="w-full rounded-xl border border-white/20 bg-white py-3 pl-10 pr-10 text-sm text-slate-900 shadow-md placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                aria-label={language === 'bn' ? 'মুছুন' : 'Clear search'}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 cursor-pointer"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            )}
          </div>
        </div>
      </CitizenServiceHero>

      {/* Services Grid */}
      <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8 space-y-12">
        <section>
          {filteredServices.length === 0 ? (
            <div className="rounded-2xl border border-[#E2E8F0] bg-white p-10 text-center">
              <p className="text-base font-bold text-slate-900">
                {language === 'bn'
                  ? 'এই বিভাগে কোনো সেবা পাওয়া যায়নি'
                  : 'No services matched in this category'}
              </p>
              <button
                type="button"
                onClick={() => setQuery('')}
                className="mt-3 inline-flex items-center rounded-xl bg-[#006A4E] px-4 py-2 text-xs font-semibold text-white hover:bg-[#00523C] cursor-pointer"
              >
                {language === 'bn' ? 'সকল সেবা দেখুন' : 'Show all services'}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filteredServices.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          )}
        </section>

        {/* Other Categories Navigation Strip */}
        <section className="relative overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-xs">
          <span
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#006A4E] to-emerald-400"
          />
          <div className="mb-4 flex items-center justify-between gap-2">
            <h2 className="text-lg font-bold text-slate-900">
              {language === 'bn' ? 'অন্যান্য সেবা বিভাগসমূহ' : 'Explore Other Categories'}
            </h2>
            <Link
              href="/citizen-services"
              className="text-xs font-semibold text-[#006A4E] hover:text-[#00523C] transition-colors"
            >
              {language === 'bn' ? 'সব ৩১টি সেবা দেখুন' : 'View all 31 services'}
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {otherCategories.map((cat) => {
              const CatIcon = cat.icon;
              const count = getServicesByCategory(cat.slug).length;
              return (
                <Link
                  key={cat.slug}
                  href={`/citizen-services/${cat.slug}`}
                  className="group relative flex items-center justify-between overflow-hidden rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-2xs transition-all duration-300 ease-out hover:-translate-y-1 hover:border-[#006A4E] hover:bg-[#ECFDF5]/80 hover:shadow-md"
                >
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 top-0 h-1 bg-transparent transition-colors duration-300 group-hover:bg-[#006A4E]"
                  />
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#ECFDF5] text-[#006A4E] transition-all duration-300 group-hover:scale-105 group-hover:bg-[#006A4E] group-hover:text-white">
                      <CatIcon className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 transition-colors duration-300 group-hover:text-[#006A4E]">
                        {pickText(cat.title, language)}
                      </p>
                      <p className="text-xs text-slate-500">
                        {count} {language === 'bn' ? 'টি সেবা' : 'services'}
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-[#006A4E] transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
