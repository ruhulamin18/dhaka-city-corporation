'use client';

import React from 'react';
import { BookOpen, CheckCircle2, FileCheck2, HelpCircle, Users } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { CitizenServiceDefinition, pickText } from '@/types/citizen-service';

interface ServiceOverviewProps {
  service: CitizenServiceDefinition;
}

export default function ServiceOverview({ service }: ServiceOverviewProps) {
  const { language } = useApp();

  const items = [
    {
      key: 'whatItIs',
      icon: BookOpen,
      label: { bn: 'এই সেবাটি কী?', en: 'What This Service Is' },
      content: service.overview.whatItIs,
    },
    {
      key: 'whyNeeded',
      icon: HelpCircle,
      label: { bn: 'কেন প্রয়োজন?', en: 'Why It Is Needed' },
      content: service.overview.whyNeeded,
    },
    {
      key: 'whoCanUse',
      icon: Users,
      label: { bn: 'কারা গ্রহণ করতে পারবেন?', en: 'Who Can Use This Service' },
      content: service.overview.whoCanUse,
    },
    {
      key: 'deliverable',
      icon: FileCheck2,
      label: { bn: 'সেবা শেষে কী পাবেন?', en: 'Expected Deliverable' },
      content: service.overview.deliverable,
    },
  ];

  return (
    <section
      id="service-overview"
      className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-xs"
    >
      <div className="mb-5 flex items-center gap-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#ECFDF5] text-[#006A4E]">
          <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            {language === 'bn' ? 'সেবার সারসংক্ষেপ' : 'Service Overview'}
          </h2>
          <p className="text-xs text-slate-500">
            {language === 'bn'
              ? 'আবেদনের পূর্বে সেবার বিস্তারিত ও প্রাপ্য ফলাফল জানুন'
              : 'Understand the purpose, scope, and expected output before proceeding'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.key}
              className="rounded-xl border border-slate-200/80 bg-[#F8FAFC] p-4"
            >
              <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#006A4E]">
                <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>{pickText(item.label, language)}</span>
              </div>
              <p className="text-sm leading-relaxed text-slate-700">
                {pickText(item.content, language)}
              </p>
            </div>
          );
        })}
      </div>

      {service.guidelinesSummary && (
        <div className="mt-4 rounded-xl border border-emerald-200 bg-[#ECFDF5]/70 px-4 py-3 text-sm text-slate-700">
          <span className="font-semibold text-[#006A4E]">
            {language === 'bn' ? 'গুরুত্বপূর্ণ নির্দেশনা: ' : 'Important Guideline: '}
          </span>
          {pickText(service.guidelinesSummary, language)}
        </div>
      )}
    </section>
  );
}
