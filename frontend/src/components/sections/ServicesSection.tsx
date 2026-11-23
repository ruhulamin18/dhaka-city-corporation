'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Language } from '@/types';
import { POPULAR_SERVICES } from '@/data/homeData';
import { ServiceCard } from '@/components/common/ServiceCard';

export interface ServicesSectionProps {
  language: Language;
}

export function ServicesSection({ language }: ServicesSectionProps) {
  return (
    <>
      {/* 4. POPULAR CITIZEN SERVICES — 8-TILE ICON GRID */}
      <section id="services" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-10">
        <div className="relative text-center mb-8 sm:mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#111827] tracking-tight">
            {language === 'bn' ? 'জনপ্রিয় নাগরিক সেবাসমূহ' : 'Popular Citizen Services'}
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600">
            {language === 'bn'
              ? 'অনলাইনে আপনার প্রয়োজনীয় সিটি কর্পোরেশন সেবা সহজেই গ্রহণ করুন'
              : 'Access your essential city corporation services online'}
          </p>

          <Link
            href="/citizen-services"
            className="mt-3 md:mt-0 md:absolute md:right-0 md:top-1/2 md:-translate-y-1/2 inline-flex items-center gap-1.5 text-sm font-semibold text-[#006A4E] hover:text-[#00523C] transition-colors whitespace-nowrap focus-visible:outline-2 focus-visible:outline-[#006A4E] rounded"
          >
            <span>{language === 'bn' ? 'সকল সেবা দেখুন' : 'View All Services'}</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          {POPULAR_SERVICES.map((svc) => (
            <ServiceCard
              key={svc.id}
              title={language === 'bn' ? svc.titleBn : svc.titleEn}
              href={svc.href}
              icon={svc.icon}
              iconBg={svc.iconBg}
            />
          ))}
        </div>
      </section>

      {/* 5. TWO-COLUMN FEATURE SPOTLIGHT BANNERS (Smart City + Explore City Map GIS) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left Banner: Smart City, Better Services */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xs">
            <div className="relative z-10 max-w-sm text-center sm:text-left">
              <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-[#006A4E] mb-2">
                {language === 'bn' ? 'স্বচ্ছতা ও উন্নয়ন' : 'Transparency & Growth'}
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-[#111827] tracking-tight">
                {language === 'bn' ? 'স্মার্ট সিটি, উন্নত সেবা' : 'Smart City, Better Services'}
              </h3>
              <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">
                {language === 'bn'
                  ? 'আধুনিক, স্বচ্ছ এবং নাগরিকবান্ধব সিটি কর্পোরেশন ডিজিটাল প্ল্যাটফর্ম।'
                  : 'A modern, transparent, and citizen-friendly digital municipal platform.'}
              </p>
              <Link
                href="/transparency"
                className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-[#006A4E] hover:text-[#00523C] transition-colors focus-visible:outline-2 focus-visible:outline-[#006A4E] rounded"
              >
                <span>
                  {language === 'bn'
                    ? 'উন্মুক্ত বাজেট ও স্বচ্ছতা দেখুন'
                    : 'View Open Budget & Projects'}
                </span>
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </Link>
            </div>

            <div className="relative w-52 sm:w-60 h-28 shrink-0">
              <Image
                src="/images/smart-city-skyline.jpg"
                alt="Smart Dhaka Green Skyline Illustration"
                fill
                sizes="(max-width: 640px) 208px, 240px"
                referrerPolicy="no-referrer"
                className="object-contain object-bottom mix-blend-multiply"
              />
            </div>
          </div>

          {/* Right Banner: Explore City Map (GIS) */}
          <Link
            href="/city-map"
            className="lg:col-span-5 group relative overflow-hidden bg-[#006A4E] hover:bg-[#005a42] text-white rounded-2xl p-6 flex items-center justify-between gap-5 shadow-xs transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#006A4E]"
          >
            <div className="relative w-20 sm:w-24 h-20 rounded-xl overflow-hidden shrink-0 border border-white/20">
              <Image
                src="/images/gis-map-pin.jpg"
                alt="Dhaka Interactive GIS Map"
                fill
                sizes="(max-width: 640px) 80px, 96px"
                referrerPolicy="no-referrer"
                className="object-cover"
              />
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="text-lg sm:text-xl font-bold text-white leading-snug">
                {language === 'bn' ? 'সিটি ম্যাপ (GIS) দেখুন' : 'Explore City Map (GIS)'}
              </h3>
              <p className="mt-1 text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
                {language === 'bn'
                  ? 'ওয়ার্ড, নাগরিক সুবিধা, উন্নয়ন প্রকল্প এবং সেবাকেন্দ্রের অবস্থান খুঁজুন।'
                  : 'Find wards, public facilities, projects, and municipal service centers.'}
              </p>
            </div>

            <span className="w-9 h-9 rounded-full bg-white text-[#006A4E] flex items-center justify-center shrink-0 shadow-xs transition-transform group-hover:translate-x-0.5">
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </span>
          </Link>
        </div>
      </section>
    </>
  );
}
