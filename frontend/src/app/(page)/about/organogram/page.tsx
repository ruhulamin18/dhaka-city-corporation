'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Award, Briefcase, Building2, CheckCircle2, Users } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { AboutPageLayout } from '@/components/about/AboutPageLayout';
import { ORG_DIVISIONS } from '@/data/aboutData';
import { pickLang } from '@/types/about';

export default function AboutOrganogramPage() {
  const { language } = useApp();
  const [selectedDivisionId, setSelectedDivisionId] = useState<string>(ORG_DIVISIONS[0].id);

  const activeDivision =
    ORG_DIVISIONS.find((d) => d.id === selectedDivisionId) ?? ORG_DIVISIONS[0];

  return (
    <AboutPageLayout activeSlug="organogram">
      {/* Visual Hierarchical Org Chart */}
      <section className="relative overflow-hidden civic-card bg-white rounded-xl border border-[#E2E8F0] p-6 sm:p-8 space-y-6 shadow-xs">
        {/* Top Accent Indicator */}
        <span aria-hidden="true" className="absolute inset-x-0 top-0 h-1 bg-[#006A4E]" />

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold text-[#006A4E]">
              {language === 'bn' ? 'ইন্টারেক্টিভ প্রশাসনিক কাঠামো' : 'Interactive Administrative Hierarchy'}
            </p>
            <h2 className="text-xl sm:text-2xl font-bold text-[#111827] mt-0.5">
              {language === 'bn'
                ? 'সিটি কর্পোরেশন সাংগঠনিক চার্ট'
                : 'City Corporation Organizational Chart'}
            </h2>
          </div>
          <p className="text-xs text-[#4B5563]">
            {language === 'bn'
              ? 'যেকোনো বিভাগে ক্লিক করে এর দায়িত্ব ও কর্মপরিধি দেখুন'
              : 'Click any division below to inspect its mandate and responsibilities'}
          </p>
        </div>

        {/* Tier 1: Mayor / Administrator */}
        <div className="flex flex-col items-center">
          <div className="w-full max-w-md rounded-xl bg-[#006A4E] text-white border border-[#00523C] px-5 py-4 text-center shadow-sm">
            <div className="inline-flex items-center justify-center gap-2 text-xs text-emerald-200 font-semibold">
              <Award className="w-4 h-4" aria-hidden="true" />
              <span>{language === 'bn' ? 'সর্বোচ্চ নির্বাহী কর্তৃপক্ষ' : 'Apex Executive Authority'}</span>
            </div>
            <p className="text-base sm:text-lg font-bold mt-1">
              {language === 'bn' ? 'মেয়র / প্রশাসক' : 'Mayor / Administrator'}
            </p>
            <p className="text-xs text-emerald-100/90 mt-0.5">
              {language === 'bn'
                ? 'কর্পোরেশন পরিষদ ও ওয়ার্ড কাউন্সিলরবৃন্দের সভাপতিত্ব'
                : 'Presiding over Corporation Council & Ward Councillors'}
            </p>
          </div>

          {/* Vertical Connector */}
          <div className="w-0.5 h-7 bg-[#006A4E]/45" aria-hidden="true" />

          {/* Tier 2: Chief Executive Officer */}
          <div className="w-full max-w-md rounded-xl bg-[#ECFDF5] border border-[#006A4E] px-5 py-3.5 text-center">
            <div className="inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-[#006A4E]">
              <Briefcase className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{language === 'bn' ? 'প্রশাসনিক প্রধান' : 'Chief Administrative Head'}</span>
            </div>
            <p className="text-base font-bold text-[#111827] mt-0.5">
              {language === 'bn' ? 'প্রধান নির্বাহী কর্মকর্তা (CEO)' : 'Chief Executive Officer (CEO)'}
            </p>
            <p className="text-xs text-[#4B5563] mt-0.5">
              {language === 'bn'
                ? 'সকল বিভাগীয় ও আঞ্চলিক কার্যক্রমের কেন্দ্রীয় সমন্বয়ক'
                : 'Central coordinator of all municipal divisions and zonal operations'}
            </p>
          </div>

          {/* Vertical Connector to Divisions Rail */}
          <div className="w-0.5 h-7 bg-[#006A4E]/45" aria-hidden="true" />

          {/* Horizontal Connector Rail (visible on md+) */}
          <div className="hidden md:block w-[86%] h-0.5 bg-[#006A4E]/35" aria-hidden="true" />
        </div>

        {/* Tier 3: 6 Interactive Key Divisions */}
        <div
          role="group"
          aria-label={language === 'bn' ? 'প্রধান বিভাগসমূহ' : 'Key Municipal Divisions'}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5"
        >
          {ORG_DIVISIONS.map((div) => {
            const isSelected = div.id === activeDivision.id;
            return (
              <button
                key={div.id}
                type="button"
                aria-pressed={isSelected}
                onClick={() => setSelectedDivisionId(div.id)}
                className={`group relative overflow-hidden text-left rounded-xl border p-4 shadow-xs transition-all duration-300 ease-out cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#006A4E] ${
                  isSelected
                    ? 'bg-[#ECFDF5] border-[#006A4E] shadow-xs'
                    : 'bg-white border-[#E2E8F0] hover:bg-[#ECFDF5]/80 hover:border-[#006A4E] hover:-translate-y-1 hover:shadow-md'
                }`}
              >
                {/* Top Accent Indicator */}
                <span
                  aria-hidden="true"
                  className={`absolute inset-x-0 top-0 h-1 transition-colors duration-300 ${
                    isSelected ? 'bg-[#006A4E]' : 'bg-transparent group-hover:bg-[#006A4E]'
                  }`}
                />

                <p className="text-[11px] font-semibold text-[#006A4E]">
                  {pickLang(div.unitsCount, language)}
                </p>
                <p
                  className={`text-sm font-bold mt-0.5 transition-colors duration-300 ${
                    isSelected ? 'text-[#006A4E]' : 'text-[#111827] group-hover:text-[#006A4E]'
                  }`}
                >
                  {pickLang(div.title, language)}
                </p>
                <p className="text-xs text-[#4B5563] mt-1">{pickLang(div.headTitle, language)}</p>
              </button>
            );
          })}
        </div>

        {/* Connector to Tier 4 */}
        <div className="flex flex-col items-center">
          <div className="w-0.5 h-6 bg-[#006A4E]/35" aria-hidden="true" />
          <div className="group relative overflow-hidden w-full rounded-xl bg-white border border-[#E2E8F0] p-4 sm:p-5 shadow-xs transition-all duration-300 ease-out hover:bg-[#ECFDF5]/80 hover:border-[#006A4E] hover:-translate-y-0.5 hover:shadow-md">
            {/* Top Accent Indicator */}
            <span
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-1 bg-transparent group-hover:bg-[#006A4E] transition-colors duration-300"
            />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#ECFDF5] border border-emerald-200 text-[#006A4E] group-hover:bg-[#006A4E] group-hover:text-white group-hover:border-[#006A4E] group-hover:scale-105 flex items-center justify-center shrink-0 transition-all duration-300 shadow-2xs">
                  <Building2 className="w-4 h-4 transition-transform duration-300" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#006A4E]">
                    {language === 'bn' ? 'মাঠপর্যায়ের বিকেন্দ্রীকৃত প্রশাসন' : 'Decentralized Field Administration'}
                  </p>
                  <p className="text-sm font-bold text-[#111827] group-hover:text-[#006A4E] transition-colors duration-300">
                    {language === 'bn'
                      ? 'আঞ্চলিক নির্বাহী কর্মকর্তাবৃন্দ (জোন ১ – ৫) ও ৭৫টি ওয়ার্ড কার্যালয়'
                      : 'Zonal Executive Officers (Zones 1 – 5) & 75 Ward Offices'}
                  </p>
                </div>
              </div>
              <Link
                href="/about/locations"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#006A4E] hover:underline whitespace-nowrap shrink-0"
              >
                <span>{language === 'bn' ? 'আঞ্চলিক কার্যালয় দেখুন' : 'View Zonal Offices'}</span>
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Highlighted Division Responsibility Panel */}
      <section
        aria-live="polite"
        className="relative overflow-hidden civic-card bg-white rounded-xl border border-[#006A4E]/50 p-6 sm:p-8 space-y-5 shadow-xs"
      >
        {/* Top Accent Indicator */}
        <span aria-hidden="true" className="absolute inset-x-0 top-0 h-1 bg-[#006A4E]" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <p className="text-xs font-semibold text-[#006A4E]">
              {language === 'bn' ? 'নির্বাচিত বিভাগের কর্মপরিধি' : 'Selected Division Mandate'}
              <span className="mx-1.5 text-slate-300" aria-hidden="true">
                ·
              </span>
              {pickLang(activeDivision.unitsCount, language)}
            </p>
            <h3 className="text-xl font-bold text-[#111827] mt-0.5">
              {pickLang(activeDivision.title, language)}
            </h3>
            <p className="text-xs font-medium text-[#4B5563] mt-0.5">
              {language === 'bn' ? 'বিভাগীয় প্রধান: ' : 'Division Head: '}
              <strong className="text-[#111827]">
                {pickLang(activeDivision.headTitle, language)}
              </strong>
            </p>
          </div>
          <Link
            href="/about/departments"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#006A4E] hover:bg-[#00523C] text-white text-xs font-semibold transition-colors whitespace-nowrap shrink-0 shadow-2xs hover:shadow-xs"
          >
            <Users className="w-3.5 h-3.5" aria-hidden="true" />
            <span>{language === 'bn' ? 'কর্মকর্তাবৃন্দ দেখুন' : 'View Officials'}</span>
          </Link>
        </div>

        <p className="text-sm sm:text-base text-[#4B5563] leading-relaxed max-w-4xl">
          {pickLang(activeDivision.summary, language)}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {activeDivision.keyDuties.map((duty, idx) => (
            <div
              key={idx}
              className="group/duty flex items-start gap-2.5 bg-[#ECFDF5]/60 hover:bg-white rounded-lg border border-emerald-200/80 hover:border-[#006A4E] p-3.5 text-xs sm:text-sm text-[#111827] transition-all duration-200 hover:-translate-y-0.5 shadow-2xs hover:shadow-xs"
            >
              <CheckCircle2
                className="w-4 h-4 text-[#006A4E] group-hover/duty:scale-110 shrink-0 mt-0.5 transition-transform duration-200"
                aria-hidden="true"
              />
              <span>{pickLang(duty, language)}</span>
            </div>
          ))}
        </div>
      </section>
    </AboutPageLayout>
  );
}
