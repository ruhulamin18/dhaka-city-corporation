'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Globe2, Lock } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import {
  CitizenServiceDefinition,
  pickText,
} from '@/types/citizen-service';
import { getCategoryBySlug, getServiceHref } from '@/data/services';

interface ServiceCardProps {
  service: CitizenServiceDefinition;
  showCategoryBadge?: boolean;
}

export default function ServiceCard({
  service,
  showCategoryBadge = false,
}: ServiceCardProps) {
  const { language } = useApp();
  const Icon = service.icon;
  const href = getServiceHref(service);
  const category = showCategoryBadge ? getCategoryBySlug(service.categorySlug) : undefined;

  return (
    <Link
      href={href}
      className="group relative overflow-hidden flex h-full flex-col justify-between rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-xs transition-all duration-300 ease-out hover:bg-[#ECFDF5]/80 hover:border-[#006A4E] hover:-translate-y-1 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[#006A4E]"
    >
      {/* Top Accent Indicator */}
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-1 bg-transparent group-hover:bg-[#006A4E] transition-colors duration-300"
      />

      <div>
        <div className="mb-3.5 flex items-start justify-between gap-2">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#ECFDF5] border border-emerald-200/80 text-[#006A4E] group-hover:bg-[#006A4E] group-hover:text-white group-hover:border-[#006A4E] group-hover:scale-105 transition-all duration-300 shadow-2xs">
            <Icon className="h-5 w-5 transition-transform duration-300" aria-hidden="true" />
          </div>

          <div className="flex flex-wrap items-center justify-end gap-1.5">
            {service.requiresAuthForAction ? (
              <span className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-[#F8FAFC] group-hover:bg-white px-2 py-0.5 text-[11px] font-medium text-slate-600 transition-colors shadow-2xs">
                <Lock className="h-3 w-3 text-[#006A4E]" aria-hidden="true" />
                {language === 'bn' ? 'আবেদনে লগইন' : 'Login to Apply'}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-md border border-emerald-200 bg-[#ECFDF5] group-hover:bg-white px-2 py-0.5 text-[11px] font-medium text-[#006A4E] transition-colors shadow-2xs">
                <Globe2 className="h-3 w-3" aria-hidden="true" />
                {language === 'bn' ? 'উন্মুক্ত সেবা' : 'Public Tool'}
              </span>
            )}
          </div>
        </div>

        {category && (
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-[#006A4E]">
            {pickText(category.shortTitle, language)}
          </p>
        )}

        <h3 className="text-base font-bold leading-snug text-[#111827] group-hover:text-[#006A4E] transition-colors duration-300">
          {pickText(service.title, language)}
        </h3>

        <p className="mt-2 text-sm leading-relaxed text-[#4B5563] line-clamp-3">
          {pickText(service.shortDescription, language)}
        </p>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-slate-100 group-hover:border-emerald-200/60 transition-colors duration-300 pt-3.5 text-sm font-semibold text-[#006A4E]">
        <span>{language === 'bn' ? 'বিস্তারিত ও আবেদন' : 'View Details'}</span>
        <ArrowRight
          className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
          aria-hidden="true"
        />
      </div>
    </Link>
  );
}
