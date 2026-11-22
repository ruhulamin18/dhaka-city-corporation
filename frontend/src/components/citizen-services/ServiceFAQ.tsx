'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { CitizenServiceDefinition, pickText } from '@/types/citizen-service';

interface ServiceFAQProps {
  service: CitizenServiceDefinition;
}

export default function ServiceFAQ({ service }: ServiceFAQProps) {
  const { language } = useApp();
  const [openId, setOpenId] = useState<string | null>(service.faqs[0]?.id ?? null);

  if (service.faqs.length === 0) return null;

  return (
    <section
      id="service-faq"
      className="relative overflow-hidden rounded-xl border border-[#E2E8F0] bg-white p-6 shadow-xs"
    >
      {/* Top Accent Indicator */}
      <span aria-hidden="true" className="absolute inset-x-0 top-0 h-1 bg-[#006A4E]" />

      <div className="mb-4 flex items-center gap-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#ECFDF5] border border-emerald-200/80 text-[#006A4E] shadow-2xs">
          <HelpCircle className="h-5 w-5" aria-hidden="true" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-[#111827]">
            {language === 'bn' ? 'সচরাচর জিজ্ঞাসিত প্রশ্ন (FAQ)' : 'Frequently Asked Questions'}
          </h2>
          <p className="text-xs text-[#4B5563]">
            {language === 'bn'
              ? 'এই সেবা সম্পর্কে সাধারণ প্রশ্নের উত্তর'
              : 'Quick answers to common citizen inquiries about this service'}
          </p>
        </div>
      </div>

      <div className="divide-y divide-slate-100 rounded-xl border border-[#E2E8F0] overflow-hidden shadow-2xs">
        {service.faqs.map((faq) => {
          const isOpen = openId === faq.id;
          return (
            <div
              key={faq.id}
              className="group/faq bg-white first:rounded-t-xl last:rounded-b-xl border-l-4 border-l-transparent hover:border-l-[#006A4E] hover:bg-[#ECFDF5]/50 transition-all duration-200"
            >
              <button
                type="button"
                onClick={() => setOpenId(isOpen ? null : faq.id)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-4 px-4 py-3.5 text-left text-sm font-semibold text-[#111827] group-hover/faq:text-[#006A4E] transition-colors cursor-pointer"
              >
                <span>{pickText(faq.question, language)}</span>
                <ChevronDown
                  className={`h-4 w-4 shrink-0 text-[#006A4E] transition-transform duration-200 ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                  aria-hidden="true"
                />
              </button>
              {isOpen && (
                <div className="border-t border-slate-100 bg-[#F8FAFC]/80 px-4 py-3.5 text-sm leading-relaxed text-[#4B5563]">
                  {pickText(faq.answer, language)}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
