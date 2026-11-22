'use client';

import React, { useMemo, useState } from 'react';
import { Building2, CheckCircle2, Phone } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { AboutPageLayout } from '@/components/about/AboutPageLayout';
import { PersonProfileCard } from '@/components/about/PersonProfileCard';
import { EmptyState } from '@/components/common/EmptyState';
import { DEPARTMENTS_LIST, DEPARTMENT_OFFICIALS } from '@/data/aboutData';
import { DepartmentId, pickLang } from '@/types/about';

export default function AboutDepartmentsPage() {
  const { language } = useApp();
  const [activeDeptId, setActiveDeptId] = useState<DepartmentId>('engineering');

  const activeDept =
    DEPARTMENTS_LIST.find((d) => d.id === activeDeptId) ?? DEPARTMENTS_LIST[0];

  const officials = useMemo(
    () => DEPARTMENT_OFFICIALS.filter((o) => o.departmentId === activeDept.id),
    [activeDept.id]
  );

  return (
    <AboutPageLayout activeSlug="departments">
      {/* Department Filter Tabs */}
      <div
        role="tablist"
        aria-label={language === 'bn' ? 'সিটি কর্পোরেশন বিভাগসমূহ' : 'Municipal Departments'}
        className="civic-card bg-white rounded-xl border border-[#E2E8F0] p-2 flex flex-wrap gap-1.5"
      >
        {DEPARTMENTS_LIST.map((dept) => {
          const isActive = dept.id === activeDept.id;
          return (
            <button
              key={dept.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveDeptId(dept.id)}
              className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-[#006A4E] text-white shadow-xs'
                  : 'text-[#4B5563] hover:text-[#006A4E] hover:bg-[#ECFDF5]'
              }`}
            >
              {pickLang(dept.name, language)}
            </button>
          );
        })}
      </div>

      {/* Selected Department Overview & Key Responsibilities */}
      <section
        role="tabpanel"
        aria-label={pickLang(activeDept.name, language)}
        className="relative overflow-hidden civic-card bg-white rounded-xl border border-[#E2E8F0] p-6 sm:p-8 space-y-6 shadow-xs"
      >
        {/* Top Accent Indicator */}
        <span aria-hidden="true" className="absolute inset-x-0 top-0 h-1 bg-[#006A4E]" />

        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 pb-5 border-b border-slate-100">
          <div className="space-y-1.5 max-w-3xl">
            <p className="text-xs font-semibold text-[#006A4E]">
              {language === 'bn' ? 'বিভাগীয় পরিচিতি ও দায়িত্ব' : 'Department Overview & Mandate'}
            </p>
            <h2 className="text-2xl font-bold text-[#111827]">
              {pickLang(activeDept.name, language)}
            </h2>
            <p className="text-sm sm:text-base text-[#4B5563] leading-relaxed">
              {pickLang(activeDept.overview, language)}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-2 text-xs shrink-0">
            <a
              href={`tel:${activeDept.hotline.replace(/[^+\d]/g, '')}`}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#ECFDF5] border border-emerald-200 text-[#006A4E] font-semibold tabular-nums hover:bg-emerald-100 transition-colors shadow-2xs"
            >
              <Phone className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{activeDept.hotline}</span>
            </a>
            <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-[#4B5563] font-medium shadow-2xs">
              <Building2 className="w-3.5 h-3.5 text-[#006A4E]" aria-hidden="true" />
              <span>{pickLang(activeDept.officeFloor, language)}</span>
            </div>
          </div>
        </div>

        {/* Responsibilities Grid */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-[#111827]">
            {language === 'bn' ? 'মূল দায়িত্বসমূহ' : 'Core Responsibilities'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            {activeDept.responsibilities.map((item, idx) => (
              <div
                key={idx}
                className="group/duty flex items-start gap-2.5 bg-[#F8FAFC] hover:bg-[#ECFDF5]/80 rounded-lg border border-[#E2E8F0] hover:border-[#006A4E] p-3.5 text-xs sm:text-sm text-[#111827] transition-all duration-200 hover:-translate-y-0.5 shadow-2xs hover:shadow-xs"
              >
                <CheckCircle2
                  className="w-4 h-4 text-[#006A4E] group-hover/duty:scale-110 shrink-0 mt-0.5 transition-transform duration-200"
                  aria-hidden="true"
                />
                <span>{pickLang(item, language)}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Department Officials Grid */}
      <section aria-labelledby="dept-officials-heading" className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <h3 id="dept-officials-heading" className="text-lg font-bold text-[#111827]">
            {language === 'bn'
              ? `${pickLang(activeDept.name, language)} — দায়িত্বপ্রাপ্ত কর্মকর্তাবৃন্দ`
              : `${pickLang(activeDept.name, language)} — Key Officials`}
          </h3>
          <span className="text-xs text-[#4B5563] tabular-nums">
            {language === 'bn' ? `${officials.length} জন কর্মকর্তা` : `${officials.length} official(s)`}
          </span>
        </div>

        {officials.length === 0 ? (
          <EmptyState
            message={
              language === 'bn'
                ? 'এই বিভাগের কর্মকর্তাদের তথ্য শীঘ্রই হালনাগাদ করা হবে।'
                : 'Official contact records for this department will be updated shortly.'
            }
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {officials.map((person) => (
              <PersonProfileCard key={person.id} person={person} language={language} />
            ))}
          </div>
        )}
      </section>
    </AboutPageLayout>
  );
}
