'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { AboutPageLayout } from '@/components/about/AboutPageLayout';
import { TimelineCard } from '@/components/about/TimelineCard';
import { HISTORY_INTRO, HISTORY_MILESTONES } from '@/data/aboutData';
import { pickLang } from '@/types/about';

export default function AboutHistoryPage() {
  const { language } = useApp();
  const [selectedId, setSelectedId] = useState<string>(HISTORY_MILESTONES[0].id);

  return (
    <AboutPageLayout activeSlug="history">
      {/* Historical Narrative Card */}
      <section className="relative overflow-hidden civic-card bg-white rounded-xl border border-[#E2E8F0] p-6 sm:p-8 space-y-4 shadow-xs">
        {/* Top Accent Indicator */}
        <span aria-hidden="true" className="absolute inset-x-0 top-0 h-1 bg-[#006A4E]" />

        <p className="text-xs font-semibold text-[#006A4E]">
          {language === 'bn' ? '১৬০+ বছরের পৌর ঐতিহ্য' : '160+ Years of Municipal Heritage'}
        </p>
        <h2 className="text-xl sm:text-2xl font-bold text-[#111827] text-balance">
          {language === 'bn'
            ? 'ঐতিহাসিক ঢাকা মিউনিসিপ্যালিটি থেকে আধুনিক স্মার্ট সিটি কর্পোরেশন'
            : 'From Historic Dhaka Municipality to a Modern Smart City Corporation'}
        </h2>
        <div className="max-w-3xl space-y-3 text-sm sm:text-base text-[#4B5563] leading-relaxed">
          <p>{pickLang(HISTORY_INTRO.lead, language)}</p>
          <p>{pickLang(HISTORY_INTRO.body, language)}</p>
        </div>

        {/* Interactive Era Quick Selector */}
        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-[#4B5563] mr-1">
            {language === 'bn' ? 'মাইলফলক নির্বাচন:' : 'Jump to Era:'}
          </span>
          {HISTORY_MILESTONES.map((item) => {
            const active = selectedId === item.id;
            return (
              <button
                key={item.id}
                type="button"
                aria-pressed={active}
                onClick={() => setSelectedId(item.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold tabular-nums transition-all duration-200 cursor-pointer ${
                  active
                    ? 'bg-[#006A4E] text-white shadow-xs scale-105'
                    : 'bg-[#F8FAFC] text-[#4B5563] border border-[#E2E8F0] hover:border-[#006A4E] hover:text-[#006A4E] hover:bg-white'
                }`}
              >
                {pickLang(item.year, language)}
              </button>
            );
          })}
        </div>
      </section>

      {/* Interactive Vertical Historical Timeline */}
      <section aria-labelledby="history-timeline-heading" className="space-y-5">
        <h2 id="history-timeline-heading" className="text-lg sm:text-xl font-bold text-[#111827]">
          {language === 'bn' ? 'ঐতিহাসিক ক্রমবিকাশ (১৮৬৪ – ২০২৬)' : 'Historical Milestones (1864 – 2026)'}
        </h2>

        <div className="max-w-4xl">
          {HISTORY_MILESTONES.map((milestone, index) => (
            <TimelineCard
              key={milestone.id}
              milestone={milestone}
              language={language}
              isLast={index === HISTORY_MILESTONES.length - 1}
              isActive={selectedId === milestone.id}
              onSelect={() => setSelectedId(milestone.id)}
            />
          ))}
        </div>
      </section>
    </AboutPageLayout>
  );
}
