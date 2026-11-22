'use client';

import React from 'react';
import { Check, Info, ShieldCheck } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { CitizenServiceDefinition, pickText } from '@/types/citizen-service';

interface EligibilitySectionProps {
  service: CitizenServiceDefinition;
}

export default function EligibilitySection({ service }: EligibilitySectionProps) {
  const { language } = useApp();
  const { eligibility } = service;

  return (
    <section
      id="eligibility"
      className="relative overflow-hidden rounded-xl border border-[#E2E8F0] bg-white p-6 shadow-xs"
    >
      {/* Top Accent Indicator */}
      <span aria-hidden="true" className="absolute inset-x-0 top-0 h-1 bg-[#006A4E]" />

      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#ECFDF5] border border-emerald-200/80 text-[#006A4E] shadow-2xs">
            <ShieldCheck className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#111827]">
              {language === 'bn' ? 'আবেদনের যোগ্যতা' : 'Eligibility Criteria'}
            </h2>
            <p className="text-xs text-[#4B5563]">
              {language === 'bn'
                ? 'কারা এই সেবার জন্য আবেদন করতে পারবেন'
                : 'Who qualifies to request or use this municipal service'}
            </p>
          </div>
        </div>

        {!eligibility.isOfficiallyVerified && (
          <span className="inline-flex items-center gap-1.5 rounded-md border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-800 shadow-2xs">
            <Info className="h-3.5 w-3.5" aria-hidden="true" />
            {language === 'bn'
              ? 'সরকারি যাচাইয়ের অপেক্ষায় রয়েছে'
              : 'Awaiting official verification'}
          </span>
        )}
      </div>

      <ul className="space-y-2.5">
        {eligibility.items.map((item, idx) => (
          <li
            key={idx}
            className="group/item flex items-start gap-3 rounded-xl border border-slate-100 bg-[#F8FAFC] px-4 py-3 text-sm text-[#111827] shadow-2xs transition-all duration-200 hover:border-[#006A4E]/50 hover:bg-[#ECFDF5]/70 hover:-translate-y-0.5"
          >
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#006A4E] text-white shadow-2xs transition-transform duration-200 group-hover/item:scale-110">
              <Check className="h-3.5 w-3.5" aria-hidden="true" />
            </span>
            <span className="leading-relaxed">{pickText(item, language)}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
