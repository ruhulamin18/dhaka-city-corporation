'use client';

import React from 'react';
import { Compass, Target } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { AboutPageLayout } from '@/components/about/AboutPageLayout';
import { CivicInfoCard } from '@/components/about/CivicInfoCard';
import { MISSION_STATEMENT, STRATEGIC_VALUES, VISION_STATEMENT } from '@/data/aboutData';
import { pickLang } from '@/types/about';

export default function AboutMissionVisionPage() {
  const { language } = useApp();

  return (
    <AboutPageLayout activeSlug="mission-vision">
      {/* Side-by-Side Vision & Mission Highlight Cards */}
      <section aria-label={language === 'bn' ? 'রূপকল্প ও অভিলক্ষ্য' : 'Vision and Mission'}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          {/* Vision Card */}
          <article className="group relative overflow-hidden civic-card bg-white rounded-xl border border-[#E2E8F0] p-6 sm:p-8 flex flex-col justify-between gap-5 shadow-xs transition-all duration-300 ease-out hover:bg-[#ECFDF5]/80 hover:border-[#006A4E] hover:-translate-y-1 hover:shadow-md">
            {/* Top Accent Indicator */}
            <span
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-1 bg-transparent group-hover:bg-[#006A4E] transition-colors duration-300"
            />

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#ECFDF5] border border-emerald-200 text-[#006A4E] group-hover:bg-[#006A4E] group-hover:text-white group-hover:border-[#006A4E] group-hover:scale-105 flex items-center justify-center shrink-0 transition-all duration-300 shadow-2xs">
                  <Compass className="w-5 h-5" aria-hidden="true" />
                </div>
                <p className="text-xs font-bold tracking-wider text-[#111827]">
                  {pickLang(VISION_STATEMENT.kicker, language)}
                </p>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#111827] group-hover:text-[#006A4E] transition-colors duration-300 leading-snug text-balance">
                {pickLang(VISION_STATEMENT.title, language)}
              </h2>
              <p className="text-sm sm:text-base text-[#111827] leading-relaxed">
                {pickLang(VISION_STATEMENT.description, language)}
              </p>
            </div>
            <p className="text-xs font-medium text-[#111827] pt-4 border-t border-slate-100 group-hover:border-emerald-200/60 transition-colors duration-300">
              {language === 'bn'
                ? 'স্মার্ট ঢাকা মহাপরিকল্পনা · ২০৪১ লক্ষ্যমাত্রা'
                : 'Smart Dhaka Master Plan · Long-Term Civic Horizon'}
            </p>
          </article>

          {/* Mission Card */}
          <article className="group relative overflow-hidden civic-card bg-white rounded-xl border border-[#E2E8F0] p-6 sm:p-8 flex flex-col justify-between gap-5 shadow-xs transition-all duration-300 ease-out hover:bg-[#ECFDF5]/80 hover:border-[#006A4E] hover:-translate-y-1 hover:shadow-md">
            {/* Top Accent Indicator */}
            <span
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-1 bg-transparent group-hover:bg-[#006A4E] transition-colors duration-300"
            />

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#ECFDF5] border border-emerald-200 text-[#006A4E] group-hover:bg-[#006A4E] group-hover:text-white group-hover:border-[#006A4E] group-hover:scale-105 flex items-center justify-center shrink-0 transition-all duration-300 shadow-2xs">
                  <Target className="w-5 h-5" aria-hidden="true" />
                </div>
                <p className="text-xs font-bold tracking-wider text-[#006A4E]">
                  {pickLang(MISSION_STATEMENT.kicker, language)}
                </p>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#111827] group-hover:text-[#006A4E] transition-colors duration-300 leading-snug text-balance">
                {pickLang(MISSION_STATEMENT.title, language)}
              </h2>
              <p className="text-sm sm:text-base text-[#4B5563] leading-relaxed">
                {pickLang(MISSION_STATEMENT.description, language)}
              </p>
            </div>
            <p className="text-xs text-[#4B5563] pt-4 border-t border-slate-100 group-hover:border-emerald-200/60 transition-colors duration-300">
              {language === 'bn'
                ? 'সিটিজেন চার্টার ও এসএলএ-ভিত্তিক নাগরিক সেবা নিশ্চয়তা'
                : 'Citizen Charter & SLA-Backed Service Commitments'}
            </p>
          </article>
        </div>
      </section>

      {/* 6 Strategic Goals / Core Values */}
      <section aria-labelledby="strategic-values-heading" className="space-y-4">
        <div>
          <h2 id="strategic-values-heading" className="text-lg sm:text-xl font-bold text-[#111827]">
            {language === 'bn' ? 'কৌশলগত লক্ষ্য ও মূল মূল্যবোধ' : 'Strategic Goals & Core Values'}
          </h2>
          <p className="text-sm text-[#4B5563] mt-1">
            {language === 'bn'
              ? 'আমাদের প্রতিটি নীতিনির্ধারণ, প্রকল্প বাস্তবায়ন এবং দৈনন্দিন নাগরিক সেবা পরিচালিত হয় এই ছয়টি মূলনীতির ওপর।'
              : 'Six governance principles guiding policy decisions, urban projects, and daily municipal service delivery.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {STRATEGIC_VALUES.map((val) => (
            <CivicInfoCard
              key={val.id}
              icon={val.icon}
              title={pickLang(val.title, language)}
              description={pickLang(val.description, language)}
            />
          ))}
        </div>
      </section>
    </AboutPageLayout>
  );
}
