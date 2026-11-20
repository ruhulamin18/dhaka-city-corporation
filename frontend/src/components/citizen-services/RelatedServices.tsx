'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Layers } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { CitizenServiceDefinition, pickText } from '@/types/citizen-service';
import { getRelatedServices, getServiceHref } from '@/data/services';

interface RelatedServicesProps {
  service: CitizenServiceDefinition;
}

export default function RelatedServices({ service }: RelatedServicesProps) {
  const { language } = useApp();
  const related = getRelatedServices(service);

  if (related.length === 0) return null;

  return (
    <section
      id="related-services"
      className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-xs"
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#ECFDF5] text-[#006A4E]">
            <Layers className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {language === 'bn' ? 'সংশ্লিষ্ট অন্যান্য সেবা' : 'Related Citizen Services'}
            </h2>
            <p className="text-xs text-slate-500">
              {language === 'bn'
                ? 'একই বিভাগের বা সম্পর্কিত নাগরিক সেবাসমূহ'
                : 'Explore closely related municipal services'}
            </p>
          </div>
        </div>

        <Link
          href={`/citizen-services/${service.categorySlug}`}
          className="text-xs font-semibold text-[#006A4E] hover:text-[#00523C] transition-colors"
        >
          {language === 'bn' ? 'সব দেখুন' : 'View category'}
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {related.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.id}
              href={getServiceHref(item)}
              className="group flex flex-col justify-between rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-4 transition-all hover:border-[#006A4E]/50 hover:bg-white hover:shadow-xs"
            >
              <div>
                <div className="mb-2.5 flex h-9 w-9 items-center justify-center rounded-lg bg-[#ECFDF5] text-[#006A4E] group-hover:bg-[#006A4E] group-hover:text-white transition-colors">
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#006A4E] transition-colors">
                  {pickText(item.title, language)}
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-slate-600 line-clamp-2">
                  {pickText(item.shortDescription, language)}
                </p>
              </div>
              <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-[#006A4E]">
                {language === 'bn' ? 'দেখুন' : 'Open'}
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
