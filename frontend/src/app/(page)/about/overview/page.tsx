'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Landmark } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { AboutPageLayout } from '@/components/about/AboutPageLayout';
import { CivicInfoCard } from '@/components/about/CivicInfoCard';
import { StatisticCard } from '@/components/common/StatisticCard';
import { OVERVIEW_CORE_FUNCTIONS, OVERVIEW_STATS } from '@/data/aboutData';
import { pickLang } from '@/types/about';

export default function AboutOverviewPage() {
  const { language } = useApp();

  return (
    <AboutPageLayout activeSlug="overview">
      {/* Executive Introduction */}
      <section className="relative overflow-hidden civic-card bg-white rounded-xl border border-[#E2E8F0] p-6 sm:p-8 shadow-xs">
        {/* Top Accent Indicator */}
        <span aria-hidden="true" className="absolute inset-x-0 top-0 h-1 bg-[#006A4E]" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-8 space-y-4">
            <p className="text-xs font-semibold text-[#006A4E]">
              {language === 'bn'
                ? 'স্থানীয় সরকার (সিটি কর্পোরেশন) আইন অনুযায়ী প্রতিষ্ঠিত'
                : 'Established Under the Local Government (City Corporation) Act'}
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#111827] leading-tight text-balance">
              {language === 'bn'
                ? 'আধুনিক ও নাগরিকবান্ধব নগর শাসনের প্রাতিষ্ঠানিক কেন্দ্র'
                : 'Institutional Hub for Modern, Citizen-First Municipal Governance'}
            </h2>
            <p className="text-sm sm:text-base text-[#4B5563] leading-relaxed">
              {language === 'bn'
                ? 'ঢাকা স্মার্ট সিটি কর্পোরেশন মহানগরীর অবকাঠামো উন্নয়ন, পরিচ্ছন্নতা ও বর্জ্য ব্যবস্থাপনা, জনস্বাস্থ্য সুরক্ষা, জন্ম ও মৃত্যু নিবন্ধন, ট্রেড লাইসেন্স এবং হোল্ডিং ট্যাক্স ব্যবস্থাপনার দায়িত্বপ্রাপ্ত সর্বোচ্চ স্থানীয় সরকার সংস্থা।'
                : 'Dhaka Smart City Corporation is the premier local government authority responsible for metropolitan infrastructure, solid waste management, public health, vital registration, trade licensing, and digital revenue administration.'}
            </p>
            <p className="text-sm sm:text-base text-[#4B5563] leading-relaxed">
              {language === 'bn'
                ? 'নগর ভবন প্রধান কার্যালয় এবং ৫টি আঞ্চলিক কার্যালয়ের সমন্বয়ে ৭৫টি ওয়ার্ডে ১.২ কোটিরও বেশি নাগরিকের দোরগোড়ায় স্বচ্ছ, দ্রুত ও কাগজবিহীন ডিজিটাল সেবা পৌঁছে দেওয়াই আমাদের প্রধান লক্ষ্য।'
                : 'Operating through Nagar Bhaban headquarters and five decentralized Zonal Offices across 75 wards, we deliver traceable, paperless municipal services to more than 12 million residents and daily commuters.'}
            </p>
          </div>

          <div className="lg:col-span-4 group/hq relative overflow-hidden bg-[#ECFDF5] rounded-xl border border-emerald-200/80 p-5 space-y-4 shadow-2xs hover:border-[#006A4E] hover:shadow-sm transition-all duration-300">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#006A4E] text-white flex items-center justify-center shrink-0 shadow-2xs group-hover/hq:scale-105 transition-transform duration-300">
                <Landmark className="w-5 h-5" aria-hidden="true" />
              </div>
              <div>
                <p className="text-xs font-semibold text-[#006A4E]">
                  {language === 'bn' ? 'প্রধান কার্যালয়' : 'Headquarters'}
                </p>
                <p className="text-sm font-bold text-[#111827]">
                  {language === 'bn' ? 'নগর ভবন, ফুলবাড়িয়া, ঢাকা' : 'Nagar Bhaban, Fulbaria, Dhaka'}
                </p>
              </div>
            </div>
            <p className="text-xs text-[#4B5563] leading-relaxed">
              {language === 'bn'
                ? 'নাগরিক সেবা সনদ, ওয়ার্ডভিত্তিক বাজেট এবং সরকারি কর্মকর্তাদের সাথে সরাসরি যোগাযোগের জন্য সংশ্লিষ্ট পাতাগুলো দেখুন।'
                : 'Explore our Citizen Charter, ward-wise open budget portal, or locate your nearest Zonal Office.'}
            </p>
            <div className="flex flex-col gap-2">
              <Link
                href="/about/citizen-charter"
                className="inline-flex items-center justify-between px-3.5 py-2 rounded-lg bg-[#006A4E] hover:bg-[#00523C] text-white text-xs font-semibold transition-colors shadow-2xs"
              >
                <span>{language === 'bn' ? 'সিটিজেন চার্টার দেখুন' : 'View Citizen Charter'}</span>
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </Link>
              <Link
                href="/transparency"
                className="inline-flex items-center justify-between px-3.5 py-2 rounded-lg bg-white hover:bg-emerald-50 text-[#006A4E] border border-emerald-200 text-xs font-semibold transition-colors shadow-2xs"
              >
                <span>{language === 'bn' ? 'উন্মুক্ত বাজেট ও প্রকল্প' : 'Open Budget & Projects'}</span>
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* At-a-Glance KPI Stat Cards */}
      <section aria-labelledby="overview-stats-heading" className="space-y-4">
        <h2 id="overview-stats-heading" className="text-lg sm:text-xl font-bold text-[#111827]">
          {language === 'bn' ? 'এক নজরে সিটি কর্পোরেশন' : 'City Corporation at a Glance'}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {OVERVIEW_STATS.map((stat, idx) => (
            <StatisticCard
              key={stat.id}
              label={pickLang(stat.label, language)}
              value={pickLang(stat.value, language)}
              tone={idx % 2 === 1 ? 'primary' : 'default'}
            />
          ))}
        </div>
      </section>

      {/* Core Municipal Functions Grid */}
      <section aria-labelledby="core-functions-heading" className="space-y-4">
        <div>
          <h2 id="core-functions-heading" className="text-lg sm:text-xl font-bold text-[#111827]">
            {language === 'bn' ? 'প্রধান কার্যাবলি ও নাগরিক সেবা' : 'Core Municipal Functions'}
          </h2>
          <p className="text-sm text-[#4B5563] mt-1">
            {language === 'bn'
              ? 'আইনগত দায়িত্ব ও আধুনিক স্মার্ট সিটি মানদণ্ড অনুযায়ী পরিচালিত ছয়টি মৌলিক কার্যক্রম।'
              : 'Six statutory pillars governing urban infrastructure, revenue, sanitation, health, and e-governance.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {OVERVIEW_CORE_FUNCTIONS.map((item) => (
            <CivicInfoCard
              key={item.id}
              icon={item.icon}
              title={pickLang(item.title, language)}
              description={pickLang(item.description, language)}
              meta={item.meta ? pickLang(item.meta, language) : undefined}
            />
          ))}
        </div>
      </section>
    </AboutPageLayout>
  );
}
