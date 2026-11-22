'use client';

import React from 'react';
import { FileText, Paperclip } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { CitizenServiceDefinition, pickText } from '@/types/citizen-service';

interface RequiredDocumentsProps {
  service: CitizenServiceDefinition;
}

export default function RequiredDocuments({ service }: RequiredDocumentsProps) {
  const { language } = useApp();

  return (
    <section
      id="required-documents"
      className="relative overflow-hidden rounded-xl border border-[#E2E8F0] bg-white p-6 shadow-xs"
    >
      {/* Top Accent Indicator */}
      <span aria-hidden="true" className="absolute inset-x-0 top-0 h-1 bg-[#006A4E]" />

      <div className="mb-4 flex items-center gap-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#ECFDF5] border border-emerald-200/80 text-[#006A4E] shadow-2xs">
          <FileText className="h-5 w-5" aria-hidden="true" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-[#111827]">
            {language === 'bn' ? 'প্রয়োজনীয় কাগজপত্র' : 'Required Documents'}
          </h2>
          <p className="text-xs text-[#4B5563]">
            {language === 'bn'
              ? 'অনলাইন আবেদনের আগে নিচের নথিপত্র প্রস্তুত রাখুন (PDF / JPG / PNG)'
              : 'Prepare the following supporting documents before starting your request'}
          </p>
        </div>
      </div>

      {service.requiredDocuments.length === 0 ? (
        <p className="rounded-xl border border-slate-100 bg-[#F8FAFC] p-4 text-sm text-[#4B5563]">
          {language === 'bn'
            ? 'এই সেবার জন্য আলাদা কোনো নথি আপলোডের প্রয়োজন নেই।'
            : 'No additional supporting documents are required to use this service.'}
        </p>
      ) : (
        <ul className="divide-y divide-slate-100 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC]/60 overflow-hidden shadow-2xs">
          {service.requiredDocuments.map((doc) => (
            <li
              key={doc.id}
              className="group/doc flex flex-col gap-1.5 px-4 py-3.5 sm:flex-row sm:items-start sm:justify-between transition-colors duration-200 hover:bg-[#ECFDF5]/70"
            >
              <div className="flex items-start gap-3">
                <Paperclip
                  className="mt-0.5 h-4 w-4 shrink-0 text-[#006A4E] group-hover/doc:scale-110 transition-transform duration-200"
                  aria-hidden="true"
                />
                <div>
                  <p className="text-sm font-semibold text-slate-800 group-hover/doc:text-[#006A4E] transition-colors duration-200">
                    {pickText(doc.title, language)}
                  </p>
                  {doc.note && (
                    <p className="mt-0.5 text-xs text-[#4B5563]">
                      {pickText(doc.note, language)}
                    </p>
                  )}
                </div>
              </div>

              <span
                className={`inline-flex shrink-0 self-start rounded-md px-2.5 py-0.5 text-[11px] font-semibold shadow-2xs transition-colors ${
                  doc.required
                    ? 'bg-[#ECFDF5] group-hover/doc:bg-white text-[#006A4E] border border-emerald-200'
                    : 'bg-white text-[#4B5563] border border-[#E2E8F0]'
                }`}
              >
                {doc.required
                  ? language === 'bn'
                    ? 'আবশ্যক'
                    : 'Required'
                  : language === 'bn'
                    ? 'প্রযোজ্য ক্ষেত্রে'
                    : 'If applicable'}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
