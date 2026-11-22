'use client';

import React from 'react';
import { ListChecks } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { CitizenServiceDefinition, pickText } from '@/types/citizen-service';

interface ApplicationStepsProps {
  service: CitizenServiceDefinition;
}

export default function ApplicationSteps({ service }: ApplicationStepsProps) {
  const { language } = useApp();

  return (
    <section
      id="application-steps"
      className="relative overflow-hidden rounded-xl border border-[#E2E8F0] bg-white p-6 shadow-xs"
    >
      {/* Top Accent Indicator */}
      <span aria-hidden="true" className="absolute inset-x-0 top-0 h-1 bg-[#006A4E]" />

      <div className="mb-5 flex items-center gap-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#ECFDF5] border border-emerald-200/80 text-[#006A4E] shadow-2xs">
          <ListChecks className="h-5 w-5" aria-hidden="true" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-[#111827]">
            {language === 'bn' ? 'সেবা গ্রহণের ধাপসমূহ' : 'Step-by-Step Process'}
          </h2>
          <p className="text-xs text-[#4B5563]">
            {language === 'bn'
              ? 'ধাপে ধাপে আপনার আবেদন বা অনুরোধ সম্পন্ন করুন'
              : 'Follow these clear steps from submission to completion'}
          </p>
        </div>
      </div>

      <ol className="relative space-y-3">
        {service.steps.map((step, index) => {
          const isLast = index === service.steps.length - 1;
          return (
            <li
              key={step.stepNumber}
              className="group/step relative flex gap-4 p-3.5 rounded-xl border border-transparent hover:border-[#006A4E]/40 hover:bg-[#ECFDF5]/60 transition-all duration-200 hover:-translate-y-0.5"
            >
              <div className="flex flex-col items-center">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#006A4E] text-sm font-bold text-white shadow-xs group-hover/step:scale-105 transition-transform duration-200">
                  {step.stepNumber}
                </span>
                {!isLast && (
                  <span
                    className="mt-1.5 h-full w-0.5 bg-emerald-200"
                    aria-hidden="true"
                  />
                )}
              </div>

              <div className="flex-1 pb-1">
                <h3 className="text-sm font-bold text-[#111827] group-hover/step:text-[#006A4E] transition-colors duration-200">
                  {pickText(step.title, language)}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-[#4B5563]">
                  {pickText(step.description, language)}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
