'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronRight, Home } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { ABOUT_NAV_ITEMS } from '@/data/aboutData';
import { AboutPageSlug, pickLang } from '@/types/about';

export interface AboutPageLayoutProps {
  activeSlug: AboutPageSlug;
  children: React.ReactNode;
}

export function AboutPageLayout({ activeSlug, children }: AboutPageLayoutProps) {
  const { language } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const currentItem =
    ABOUT_NAV_ITEMS.find((item) => item.slug === activeSlug) ?? ABOUT_NAV_ITEMS[0];
  const CurrentIcon = currentItem.icon;

  return (
    <div className="min-h-[70vh]">
      {/* Civic Green Institutional Header Banner */}
      <section className="relative overflow-hidden bg-[#006A4E] text-white border-b border-[#00523C]">
        <div
          aria-hidden="true"
          className="civic-bg-layer absolute inset-0 bg-[url('/images/bg2.png')] bg-right-bottom bg-no-repeat bg-cover invert opacity-[0.1] pointer-events-none"
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-9 sm:py-11">
          {/* Breadcrumb */}
          <nav
            aria-label={language === 'bn' ? 'ব্রেডক্রাম্ব' : 'Breadcrumb'}
            className="flex flex-wrap items-center gap-1.5 text-xs text-emerald-100/90 mb-4"
          >
            <Link
              href="/"
              className="inline-flex items-center gap-1 hover:text-white transition-colors"
            >
              <Home className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{language === 'bn' ? 'হোম' : 'Home'}</span>
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-emerald-200/70" aria-hidden="true" />
            <Link href="/about/overview" className="hover:text-white transition-colors">
              {language === 'bn' ? 'আমাদের সম্পর্কে' : 'About Us'}
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-emerald-200/70" aria-hidden="true" />
            <span className="text-white font-semibold" aria-current="page">
              {pickLang(currentItem.title, language)}
            </span>
          </nav>

          {/* Page Title & Subtitle */}
          <div className="flex items-start gap-4 max-w-3xl">
            <div className="hidden sm:flex w-12 h-12 rounded-xl bg-white/12 border border-white/20 items-center justify-center shrink-0 mt-0.5">
              <CurrentIcon className="w-6 h-6 text-emerald-100" aria-hidden="true" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight text-balance">
                {pickLang(currentItem.title, language)}
              </h1>
              <p className="mt-2 text-sm sm:text-base text-emerald-50/90 leading-relaxed">
                {pickLang(currentItem.subtitle, language)}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Sub-Page Navigation Bar */}
      <div className="bg-white/95 border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Mobile Collapsible Switcher */}
          <div className="md:hidden py-2.5">
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-expanded={mobileMenuOpen}
              className="w-full flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] text-xs font-semibold text-[#111827] cursor-pointer"
            >
              <span className="flex items-center gap-2 truncate">
                <CurrentIcon className="w-4 h-4 text-[#006A4E] shrink-0" aria-hidden="true" />
                <span className="truncate">
                  {language === 'bn' ? 'আমাদের সম্পর্কে মেনু:' : 'About Section:'}{' '}
                  <strong className="text-[#006A4E]">
                    {pickLang(currentItem.title, language)}
                  </strong>
                </span>
              </span>
              <ChevronDown
                className={`w-4 h-4 text-[#4B5563] shrink-0 transition-transform ${
                  mobileMenuOpen ? 'rotate-180' : ''
                }`}
                aria-hidden="true"
              />
            </button>

            {mobileMenuOpen && (
              <nav
                aria-label={language === 'bn' ? 'আমাদের সম্পর্কে পাতাসমূহ' : 'About Us sections'}
                className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-1 p-1.5 rounded-xl border border-[#E2E8F0] bg-white"
              >
                {ABOUT_NAV_ITEMS.map((item) => {
                  const Icon = item.icon;
                  const isActive = item.slug === activeSlug;
                  return (
                    <Link
                      key={item.slug}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      aria-current={isActive ? 'page' : undefined}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                        isActive
                          ? 'bg-[#006A4E] text-white font-semibold'
                          : 'text-[#4B5563] hover:bg-[#ECFDF5] hover:text-[#006A4E]'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                      <span className="truncate">{pickLang(item.title, language)}</span>
                    </Link>
                  );
                })}
              </nav>
            )}
          </div>

          {/* Desktop & Tablet Quick Navigation Strip */}
          <nav
            aria-label={language === 'bn' ? 'আমাদের সম্পর্কে পাতাসমূহ' : 'About Us sections'}
            className="hidden md:flex items-center gap-1 py-2.5 overflow-x-auto"
          >
            {ABOUT_NAV_ITEMS.map((item) => {
              const isActive = item.slug === activeSlug;
              return (
                <Link
                  key={item.slug}
                  href={item.href}
                  aria-current={isActive ? 'page' : undefined}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#006A4E] ${
                    isActive
                      ? 'bg-[#006A4E] text-white font-semibold shadow-xs'
                      : 'text-[#4B5563] hover:text-[#006A4E] hover:bg-[#ECFDF5]'
                  }`}
                >
                  {pickLang(item.shortTitle, language)}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
        {children}
      </div>
    </div>
  );
}
