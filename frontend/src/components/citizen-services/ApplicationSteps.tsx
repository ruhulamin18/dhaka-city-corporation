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
      className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-xs"
    >
      <div className="mb-5 flex items-center gap-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#ECFDF5] text-[#006A4E]">
          <ListChecks className="h-5 w-5" aria-hidden="true" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            {language === 'bn' ? 'সেবা গ্রহণের ধাপসমূহ' : 'Step-by-Step Process'}
          </h2>
          <p className="text-xs text-slate-500">
            {language === 'bn'
              ? 'ধাপে ধাপে আপনার আবেদন বা অনুরোধ সম্পন্ন করুন'
              : 'Follow these clear steps from submission to completion'}
          </p>
        </div>
      </div>

      <ol className="relative space-y-4">
        {service.steps.map((step, index) => {
          const isLast = index === service.steps.length - 1;
          return (
            <li key={step.stepNumber} className="relative flex gap-4">
              <div className="flex flex-col items-center">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#006A4E] text-sm font-bold text-white shadow-xs">
                  {step.stepNumber}
                </span>
                {!isLast && (
                  <span
                    className="mt-1.5 h-full w-0.5 bg-emerald-200"
                    aria-hidden="true"
                  />
                )}
              </div>

              <div className="flex-1 pb-2">
                <h3 className="text-sm font-bold text-slate-900">
                  {pickText(step.title, language)}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-slate-600">
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
