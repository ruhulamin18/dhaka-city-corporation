'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { CitizenServiceCategory, pickText } from '@/types/citizen-service';

interface ServiceCategoryCardProps {
  category: CitizenServiceCategory;
  serviceCount: number;
  isActive?: boolean;
  onSelect?: () => void;
}

export default function ServiceCategoryCard({
  category,
  serviceCount,
  isActive = false,
  onSelect,
}: ServiceCategoryCardProps) {
  const { language } = useApp();
  const Icon = category.icon;
  const orderText = String(category.order).padStart(2, '0');

  return (
    <div
      className={`group relative overflow-hidden flex flex-col justify-between rounded-xl border bg-white p-6 shadow-xs transition-all duration-300 ease-out hover:bg-[#ECFDF5]/80 hover:border-[#006A4E] hover:-translate-y-1 hover:shadow-md ${
        isActive
          ? 'border-[#006A4E] ring-2 ring-[#006A4E]/15 shadow-sm'
          : 'border-[#E2E8F0]'
      }`}
    >
      {/* Top Accent Indicator */}
      <span
        aria-hidden="true"
        className={`absolute inset-x-0 top-0 h-1 transition-colors duration-300 ${
          isActive ? 'bg-[#006A4E]' : 'bg-transparent group-hover:bg-[#006A4E]'
        }`}
      />

      <div>
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#ECFDF5] border border-emerald-200/80 text-[#006A4E] group-hover:bg-[#006A4E] group-hover:text-white group-hover:border-[#006A4E] group-hover:scale-105 transition-all duration-300 shadow-2xs">
            <Icon className="h-6 w-6 transition-transform duration-300" aria-hidden="true" />
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-[#F8FAFC] group-hover:bg-white px-2.5 py-1 text-xs font-semibold tracking-wider text-slate-600 border border-[#E2E8F0] group-hover:border-emerald-200/80 transition-colors duration-300 shadow-2xs">
              {language === 'bn' ? `বিভাগ ${orderText}` : `CAT ${orderText}`}
            </span>
            <span className="rounded-md bg-[#ECFDF5] group-hover:bg-white group-hover:border group-hover:border-emerald-300/60 px-2.5 py-1 text-xs font-semibold text-[#006A4E] transition-colors duration-300 shadow-2xs">
              {serviceCount} {language === 'bn' ? 'টি সেবা' : 'Services'}
            </span>
          </div>
        </div>

        <h3 className="text-lg font-bold text-[#111827] group-hover:text-[#006A4E] transition-colors duration-300">
          {pickText(category.title, language)}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-[#4B5563]">
          {pickText(category.description, language)}
        </p>
      </div>

      <div className="mt-5 flex items-center justify-between gap-3 border-t border-slate-100 group-hover:border-emerald-200/60 transition-colors duration-300 pt-4">
        <Link
          href={`/citizen-services/${category.slug}`}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#006A4E] hover:text-[#00523C] transition-colors"
        >
          <span>{language === 'bn' ? 'সকল সেবা দেখুন' : 'Explore Category'}</span>
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
        </Link>

        {onSelect && (
          <button
            type="button"
            onClick={onSelect}
            className="text-xs font-semibold text-slate-500 hover:text-[#006A4E] group-hover:text-[#006A4E] transition-colors cursor-pointer"
          >
            {isActive
              ? language === 'bn'
                ? 'ফিল্টার চালু'
                : 'Filtered'
              : language === 'bn'
                ? 'এখানে ফিল্টার করুন'
                : 'Filter here'}
          </button>
        )}
      </div>
    </div>
  );
}
