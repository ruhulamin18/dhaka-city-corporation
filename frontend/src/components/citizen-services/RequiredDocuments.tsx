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
      className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-xs"
    >
      <div className="mb-4 flex items-center gap-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#ECFDF5] text-[#006A4E]">
          <FileText className="h-5 w-5" aria-hidden="true" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            {language === 'bn' ? 'প্রয়োজনীয় কাগজপত্র' : 'Required Documents'}
          </h2>
          <p className="text-xs text-slate-500">
            {language === 'bn'
              ? 'অনলাইন আবেদনের আগে নিচের নথিপত্র প্রস্তুত রাখুন (PDF / JPG / PNG)'
              : 'Prepare the following supporting documents before starting your request'}
          </p>
        </div>
      </div>

      {service.requiredDocuments.length === 0 ? (
        <p className="rounded-xl border border-slate-100 bg-[#F8FAFC] p-4 text-sm text-slate-600">
          {language === 'bn'
            ? 'এই সেবার জন্য আলাদা কোনো নথি আপলোডের প্রয়োজন নেই।'
            : 'No additional supporting documents are required to use this service.'}
        </p>
      ) : (
        <ul className="divide-y divide-slate-100 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC]/60">
          {service.requiredDocuments.map((doc) => (
            <li
              key={doc.id}
              className="flex flex-col gap-1.5 px-4 py-3.5 sm:flex-row sm:items-start sm:justify-between"
            >
              <div className="flex items-start gap-3">
                <Paperclip
                  className="mt-0.5 h-4 w-4 shrink-0 text-[#006A4E]"
                  aria-hidden="true"
                />
                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    {pickText(doc.title, language)}
                  </p>
                  {doc.note && (
                    <p className="mt-0.5 text-xs text-slate-500">
                      {pickText(doc.note, language)}
                    </p>
                  )}
                </div>
              </div>

              <span
                className={`inline-flex shrink-0 self-start rounded-md px-2 py-0.5 text-[11px] font-semibold ${
                  doc.required
                    ? 'bg-[#ECFDF5] text-[#006A4E] border border-emerald-200'
                    : 'bg-slate-100 text-slate-600 border border-slate-200'
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
