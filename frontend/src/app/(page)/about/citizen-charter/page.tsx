'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Clock, FileText, UserCheck } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { AboutPageLayout } from '@/components/about/AboutPageLayout';
import { SearchFilterBar } from '@/components/about/SearchFilterBar';
import { EmptyState } from '@/components/common/EmptyState';
import { CITIZEN_CHARTER_ITEMS, DEPARTMENTS_LIST } from '@/data/aboutData';
import { pickLang } from '@/types/about';

export default function AboutCitizenCharterPage() {
  const { language } = useApp();
  const [query, setQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('all');

  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    return CITIZEN_CHARTER_ITEMS.filter((item) => {
      if (selectedDept !== 'all' && item.departmentId !== selectedDept) return false;
      if (!q) return true;
      return (
        item.serviceName.en.toLowerCase().includes(q) ||
        item.serviceName.bn.toLowerCase().includes(q) ||
        item.requiredDocs.en.toLowerCase().includes(q) ||
        item.requiredDocs.bn.toLowerCase().includes(q) ||
        item.responsibleOfficer.en.toLowerCase().includes(q) ||
        item.responsibleOfficer.bn.toLowerCase().includes(q)
      );
    });
  }, [query, selectedDept]);

  const hasActiveFilters = query.trim().length > 0 || selectedDept !== 'all';

  return (
    <AboutPageLayout activeSlug="citizen-charter">
      <SearchFilterBar
        searchValue={query}
        onSearchChange={setQuery}
        searchPlaceholder={
          language === 'bn'
            ? 'সেবার নাম বা প্রয়োজনীয় কাগজপত্র খুঁজুন (যেমন: জন্ম নিবন্ধন, ট্রেড লাইসেন্স)...'
            : 'Search by service name or document (e.g. Birth Registration, Trade License)...'
        }
        searchAriaLabel={
          language === 'bn' ? 'সিটিজেন চার্টার সেবা অনুসন্ধান' : 'Search Citizen Charter services'
        }
        filters={[
          {
            id: 'charter-dept-filter',
            label: language === 'bn' ? 'বিভাগ নির্বাচন' : 'Filter by Department',
            value: selectedDept,
            onChange: setSelectedDept,
            options: [
              { value: 'all', label: language === 'bn' ? 'সকল বিভাগ' : 'All Departments' },
              ...DEPARTMENTS_LIST.map((d) => ({
                value: d.id,
                label: pickLang(d.name, language),
              })),
            ],
          },
        ]}
        resultCountText={
          language === 'bn'
            ? `মোট ${filteredItems.length}টি নাগরিক সেবা সনদ তালিকাভুক্ত রয়েছে`
            : `Showing ${filteredItems.length} of ${CITIZEN_CHARTER_ITEMS.length} citizen services`
        }
        hasActiveFilters={hasActiveFilters}
        resetLabel={language === 'bn' ? 'রিসেট' : 'Reset'}
        onReset={() => {
          setQuery('');
          setSelectedDept('all');
        }}
      />

      {filteredItems.length === 0 ? (
        <EmptyState
          message={
            language === 'bn'
              ? 'আপনার অনুসন্ধানের সাথে মিলে যায় এমন কোনো নাগরিক সেবা পাওয়া যায়নি।'
              : 'No Citizen Charter services match your search or department filter.'
          }
        />
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden lg:block civic-card bg-white rounded-xl border border-[#E2E8F0] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#F8FAFC] text-xs font-semibold text-[#4B5563] border-b border-[#E2E8F0]">
                  <tr>
                    <th className="px-5 py-3.5">{language === 'bn' ? 'সেবার নাম' : 'Service Name'}</th>
                    <th className="px-5 py-3.5">{language === 'bn' ? 'প্রয়োজনীয় কাগজপত্র' : 'Required Documents'}</th>
                    <th className="px-5 py-3.5 whitespace-nowrap">{language === 'bn' ? 'সরকারি ফি (৳)' : 'Official Fee'}</th>
                    <th className="px-5 py-3.5 whitespace-nowrap">{language === 'bn' ? 'সর্বোচ্চ সময়' : 'Processing Time'}</th>
                    <th className="px-5 py-3.5">{language === 'bn' ? 'দায়িত্বপ্রাপ্ত কর্মকর্তা' : 'Responsible Officer'}</th>
                    <th className="px-5 py-3.5 text-right whitespace-nowrap">{language === 'bn' ? 'আবেদন' : 'Action'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredItems.map((item) => (
                    <tr key={item.id} className="hover:bg-[#F8FAFC]/80 transition-colors align-top">
                      <td className="px-5 py-4 max-w-[230px]">
                        <p className="text-xs font-semibold text-[#006A4E]">
                          {pickLang(item.departmentName, language)}
                        </p>
                        <p className="font-bold text-[#111827] mt-0.5 leading-snug">
                          {pickLang(item.serviceName, language)}
                        </p>
                      </td>
                      <td className="px-5 py-4 text-xs text-[#4B5563] leading-relaxed max-w-[260px]">
                        {pickLang(item.requiredDocs, language)}
                      </td>
                      <td className="px-5 py-4 font-semibold text-[#111827] tabular-nums whitespace-nowrap text-xs">
                        {pickLang(item.fee, language)}
                      </td>
                      <td className="px-5 py-4 font-semibold text-[#006A4E] tabular-nums whitespace-nowrap text-xs">
                        {pickLang(item.processingTime, language)}
                      </td>
                      <td className="px-5 py-4 text-xs text-[#4B5563] max-w-[200px]">
                        {pickLang(item.responsibleOfficer, language)}
                      </td>
                      <td className="px-5 py-4 text-right whitespace-nowrap">
                        <Link
                          href={item.applyHref}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#006A4E] hover:bg-[#00523C] text-white text-xs font-semibold transition-colors"
                        >
                          <span>{language === 'bn' ? 'আবেদন করুন' : 'Apply Now'}</span>
                          <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile & Tablet Stacked Cards */}
          <div className="lg:hidden space-y-4">
            {filteredItems.map((item) => (
              <article
                key={item.id}
                className="civic-card bg-white rounded-xl border border-[#E2E8F0] p-5 space-y-3.5"
              >
                <div>
                  <p className="text-xs font-semibold text-[#006A4E]">
                    {pickLang(item.departmentName, language)}
                  </p>
                  <h2 className="text-base font-bold text-[#111827] mt-0.5">
                    {pickLang(item.serviceName, language)}
                  </h2>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs pt-2 border-t border-slate-100">
                  <div>
                    <span className="text-[#4B5563] block">
                      {language === 'bn' ? 'সরকারি ফি' : 'Official Fee'}
                    </span>
                    <span className="font-bold text-[#111827] tabular-nums">
                      {pickLang(item.fee, language)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#4B5563] block">
                      {language === 'bn' ? 'সর্বোচ্চ সময়' : 'Processing Time'}
                    </span>
                    <span className="font-bold text-[#006A4E] tabular-nums inline-flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                      {pickLang(item.processingTime, language)}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-[#4B5563] pt-2 border-t border-slate-100">
                  <div className="flex items-start gap-2">
                    <FileText className="w-3.5 h-3.5 text-[#006A4E] shrink-0 mt-0.5" aria-hidden="true" />
                    <span>
                      <strong className="text-[#111827]">
                        {language === 'bn' ? 'কাগজপত্র: ' : 'Documents: '}
                      </strong>
                      {pickLang(item.requiredDocs, language)}
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <UserCheck className="w-3.5 h-3.5 text-[#006A4E] shrink-0 mt-0.5" aria-hidden="true" />
                    <span>
                      <strong className="text-[#111827]">
                        {language === 'bn' ? 'কর্মকর্তা: ' : 'Officer: '}
                      </strong>
                      {pickLang(item.responsibleOfficer, language)}
                    </span>
                  </div>
                </div>

                <Link
                  href={item.applyHref}
                  className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg bg-[#006A4E] hover:bg-[#00523C] text-white text-xs font-semibold transition-colors"
                >
                  <span>{language === 'bn' ? 'আবেদন করুন' : 'Apply Now'}</span>
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </Link>
              </article>
            ))}
          </div>
        </>
      )}
    </AboutPageLayout>
  );
}
