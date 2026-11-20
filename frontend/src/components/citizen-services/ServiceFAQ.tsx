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
      className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-xs"
    >
      <div className="mb-4 flex items-center gap-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#ECFDF5] text-[#006A4E]">
          <HelpCircle className="h-5 w-5" aria-hidden="true" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            {language === 'bn' ? 'সচরাচর জিজ্ঞাসিত প্রশ্ন (FAQ)' : 'Frequently Asked Questions'}
          </h2>
          <p className="text-xs text-slate-500">
            {language === 'bn'
              ? 'এই সেবা সম্পর্কে সাধারণ প্রশ্নের উত্তর'
              : 'Quick answers to common citizen inquiries about this service'}
          </p>
        </div>
      </div>

      <div className="divide-y divide-slate-100 rounded-xl border border-[#E2E8F0]">
        {service.faqs.map((faq) => {
          const isOpen = openId === faq.id;
          return (
            <div key={faq.id} className="bg-white first:rounded-t-xl last:rounded-b-xl">
              <button
                type="button"
                onClick={() => setOpenId(isOpen ? null : faq.id)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-4 px-4 py-3.5 text-left text-sm font-semibold text-slate-900 hover:bg-[#F8FAFC] transition-colors cursor-pointer"
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
                <div className="border-t border-slate-100 bg-[#F8FAFC]/70 px-4 py-3.5 text-sm leading-relaxed text-slate-700">
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
