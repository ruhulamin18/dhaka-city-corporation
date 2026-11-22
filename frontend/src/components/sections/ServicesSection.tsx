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
      <section id="services" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
        <div className="relative text-center mb-8">
          <div className="inline-flex items-center justify-center gap-3">
            <span
              className="hidden sm:block w-10 h-0.5 bg-[#006A4E]/45 rounded-full"
              aria-hidden="true"
            />
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B2545] tracking-tight">
              {language === 'bn' ? 'জনপ্রিয় নাগরিক সেবাসমূহ' : 'Popular Citizen Services'}
            </h2>
            <span
              className="hidden sm:block w-10 h-0.5 bg-[#006A4E]/45 rounded-full"
              aria-hidden="true"
            />
          </div>
          <p className="mt-1.5 text-base text-[#4B5563]">
            {language === 'bn'
              ? 'অনলাইনে আপনার প্রয়োজনীয় সিটি কর্পোরেশন সেবা সহজেই গ্রহণ করুন'
              : 'Get your essential city corporation services online'}
          </p>

          <Link
            href="/citizen-services"
            className="mt-3 md:mt-0 md:absolute md:right-0 md:top-1/2 md:-translate-y-1/2 inline-flex items-center gap-1.5 text-sm font-semibold text-[#006A4E] hover:text-[#00523C] transition-colors whitespace-nowrap"
          >
            <span>{language === 'bn' ? 'সকল সেবা দেখুন' : 'View All Services'}</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3.5">
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
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          {/* Left Banner: Smart City, Better Services */}
          <div className="lg:col-span-7 civic-card relative overflow-hidden bg-gradient-to-r from-[#EBF8F3] via-[#F3FBF8] to-[#ECFDF5] border border-emerald-200/80 rounded-2xl p-6 sm:p-7 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
            <div className="relative z-10 max-w-xs sm:max-w-sm text-center sm:text-left">
              <h3 className="text-xl sm:text-2xl lg:text-[1.7rem] font-extrabold text-[#0B2545] tracking-tight">
                {language === 'bn' ? 'স্মার্ট সিটি, উন্নত সেবা' : 'Smart City, Better Services'}
              </h3>
              <p className="mt-1.5 text-base text-[#4B5563] leading-relaxed">
                {language === 'bn'
                  ? 'আধুনিক, স্বচ্ছ এবং নাগরিকবান্ধব সিটি কর্পোরেশন ডিজিটাল প্ল্যাটফর্ম।'
                  : 'A modern, transparent and citizen-friendly city corporation.'}
              </p>
              <Link
                href="/transparency"
                className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-[#006A4E] hover:text-[#00523C] hover:underline underline-offset-2"
              >
                <span>
                  {language === 'bn'
                    ? 'উন্মুক্ত বাজেট ও স্বচ্ছতা দেখুন'
                    : 'View Open Budget & Projects'}
                </span>
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </Link>
            </div>

            <div className="relative w-56 sm:w-64 h-32 shrink-0">
              <Image
                src="/images/smart-city-skyline.jpg"
                alt="Smart Dhaka Green Skyline Illustration"
                fill
                sizes="(max-width: 640px) 224px, 256px"
                referrerPolicy="no-referrer"
                className="object-contain object-bottom mix-blend-multiply"
              />
            </div>
          </div>

          {/* Right Banner: Explore City Map (GIS) */}
          <Link
            href="/city-map"
            className="lg:col-span-5 group relative overflow-hidden bg-gradient-to-r from-[#005A42] via-[#006A4E] to-[#004633] text-white rounded-2xl p-5 sm:p-6 flex items-center justify-between gap-4 shadow-md hover:shadow-lg transition-all"
          >
            <div className="relative w-24 sm:w-32 h-24 rounded-xl overflow-hidden shrink-0 border border-white/15 shadow-xs">
              <Image
                src="/images/gis-map-pin.jpg"
                alt="Dhaka Interactive GIS Map"
                fill
                sizes="(max-width: 640px) 96px, 128px"
                referrerPolicy="no-referrer"
                className="object-cover"
              />
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white leading-snug">
                {language === 'bn' ? 'সিটি ম্যাপ (GIS) দেখুন' : 'Explore City Map (GIS)'}
              </h3>
              <p className="mt-1 text-sm sm:text-base text-emerald-100/90 leading-relaxed">
                {language === 'bn'
                  ? 'ওয়ার্ড, নাগরিক সুবিধা, উন্নয়ন প্রকল্প এবং সেবাকেন্দ্রের অবস্থান খুঁজুন।'
                  : 'Find wards, public facilities, projects and service locations.'}
              </p>
            </div>

            <span className="w-10 h-10 rounded-full bg-white text-[#006A4E] flex items-center justify-center shrink-0 shadow-sm group-hover:translate-x-1 transition-transform">
              <ArrowRight className="w-5 h-5" aria-hidden="true" />
            </span>
          </Link>
        </div>
      </section>
    </>
  );
}
