'use client';

import React from 'react';
import { Banknote, Clock, CreditCard, Info } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { CitizenServiceDefinition, pickText } from '@/types/citizen-service';

interface FeeInformationProps {
  service: CitizenServiceDefinition;
}

const UPDATING_FALLBACK = {
  bn: 'তথ্য হালনাগাদ করা হচ্ছে।',
  en: 'Information is being updated.',
};

export default function FeeInformation({ service }: FeeInformationProps) {
  const { language } = useApp();
  const { fees } = service;

  const rows = [
    {
      key: 'applicationFee',
      icon: Banknote,
      label: { bn: 'আবেদন ফি', en: 'Application Fee' },
      value: fees.applicationFee ?? UPDATING_FALLBACK,
    },
    {
      key: 'serviceCharge',
      icon: CreditCard,
      label: { bn: 'সার্ভিস চার্জ', en: 'Service Charge' },
      value: fees.serviceCharge ?? UPDATING_FALLBACK,
    },
    ...(fees.additionalFees
      ? [
          {
            key: 'additionalFees',
            icon: Info,
            label: { bn: 'অতিরিক্ত ফি (প্রযোজ্য ক্ষেত্রে)', en: 'Additional Fees' },
            value: fees.additionalFees,
          },
        ]
      : []),
    {
      key: 'processingTime',
      icon: Clock,
      label: { bn: 'আনুমানিক প্রক্রিয়াকরণ সময়', en: 'Estimated Processing Time' },
      value: fees.processingTime ?? UPDATING_FALLBACK,
    },
    {
      key: 'paymentMethods',
      icon: CreditCard,
      label: { bn: 'পরিশোধের মাধ্যম', en: 'Payment Methods' },
      value: fees.paymentMethods ?? UPDATING_FALLBACK,
    },
  ];

  return (
    <section
      id="fee-information"
      className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-xs"
    >
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#ECFDF5] text-[#006A4E]">
            <Banknote className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {language === 'bn' ? 'ফি ও প্রক্রিয়াকরণ সময়' : 'Fees & Processing Time'}
            </h2>
            <p className="text-xs text-slate-500">
              {language === 'bn'
                ? 'সরকারি গেজেট ও সিটি কর্পোরেশন তফসিল অনুযায়ী নির্ধারিত'
                : 'Governed by official Dhaka City Corporation schedule'}
            </p>
          </div>
        </div>

        {!fees.isVerified && (
          <span className="inline-flex items-center gap-1.5 rounded-md border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-800">
            <Info className="h-3.5 w-3.5" aria-hidden="true" />
            {language === 'bn'
              ? 'সরকারি যাচাইয়ের অপেক্ষায় রয়েছে'
              : 'Awaiting official verification'}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {rows.map((row) => {
          const Icon = row.icon;
          return (
            <div
              key={row.key}
              className="rounded-xl border border-slate-200/80 bg-[#F8FAFC] p-4"
            >
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                <Icon className="h-3.5 w-3.5 text-[#006A4E]" aria-hidden="true" />
                <span>{pickText(row.label, language)}</span>
              </div>
              <p className="mt-1.5 text-sm font-semibold text-slate-900">
                {pickText(row.value, language)}
              </p>
            </div>
          );
        })}
      </div>

      {fees.note && (
        <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs leading-relaxed text-slate-600">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#006A4E]" aria-hidden="true" />
          <span>{pickText(fees.note, language)}</span>
        </div>
      )}
    </section>
  );
}
