'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { MapPin, Phone, ShieldAlert, Sparkles, Trash2, UserCheck, Users } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { AboutPageLayout } from '@/components/about/AboutPageLayout';
import { SearchFilterBar } from '@/components/about/SearchFilterBar';
import { EmptyState } from '@/components/common/EmptyState';
import { COUNCILLOR_ZONES, WARD_DIRECTORY_LIST } from '@/data/aboutData';
import { pickLang } from '@/types/about';

export default function AboutWardsPage() {
  const { language } = useApp();
  const [query, setQuery] = useState('');
  const [selectedZone, setSelectedZone] = useState('all');

  const filteredWards = useMemo(() => {
    const q = query.trim().toLowerCase();
    return WARD_DIRECTORY_LIST.filter((ward) => {
      if (selectedZone !== 'all' && ward.zoneId !== selectedZone) return false;
      if (!q) return true;
      return (
        String(ward.wardNumber) === q ||
        `ward ${ward.wardNumber}`.includes(q) ||
        ward.areaName.en.toLowerCase().includes(q) ||
        ward.areaName.bn.toLowerCase().includes(q) ||
        ward.coveredAreas.en.toLowerCase().includes(q) ||
        ward.coveredAreas.bn.toLowerCase().includes(q) ||
        ward.councillorName.en.toLowerCase().includes(q) ||
        ward.councillorName.bn.toLowerCase().includes(q)
      );
    });
  }, [query, selectedZone]);

  const hasActiveFilters = query.trim().length > 0 || selectedZone !== 'all';

  return (
    <AboutPageLayout activeSlug="wards">
      <SearchFilterBar
        searchValue={query}
        onSearchChange={setQuery}
        searchPlaceholder={
          language === 'bn'
            ? 'এলাকার নাম বা ওয়ার্ড নম্বর দিয়ে খুঁজুন (যেমন: ধানমন্ডি, ২৭, মিরপুর)...'
            : 'Search by Area name or Ward number (e.g. Dhanmondi, 27, Mirpur)...'
        }
        searchAriaLabel={language === 'bn' ? 'ওয়ার্ড অনুসন্ধান' : 'Search wards'}
        filters={[
          {
            id: 'ward-zone-filter',
            label: language === 'bn' ? 'জোন নির্বাচন' : 'Filter by Zone',
            value: selectedZone,
            onChange: setSelectedZone,
            options: COUNCILLOR_ZONES.map((z) => ({
              value: z.id,
              label: pickLang(z.label, language),
            })),
          },
        ]}
        resultCountText={
          language === 'bn'
            ? `মোট ${filteredWards.length}টি ওয়ার্ড প্রদর্শিত হচ্ছে`
            : `Showing ${filteredWards.length} of ${WARD_DIRECTORY_LIST.length} listed wards`
        }
        hasActiveFilters={hasActiveFilters}
        resetLabel={language === 'bn' ? 'রিসেট' : 'Reset'}
        onReset={() => {
          setQuery('');
          setSelectedZone('all');
        }}
      />

      {filteredWards.length === 0 ? (
        <EmptyState
          message={
            language === 'bn'
              ? 'আপনার অনুসন্ধানের সাথে মিলে যায় এমন কোনো ওয়ার্ড পাওয়া যায়নি।'
              : 'No wards match your search query.'
          }
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredWards.map((ward) => (
            <article
              key={ward.wardNumber}
              className="group relative overflow-hidden civic-card bg-white rounded-xl border border-[#E2E8F0] p-6 flex flex-col justify-between gap-5 shadow-xs transition-all duration-300 ease-out hover:bg-[#ECFDF5]/80 hover:border-[#006A4E] hover:-translate-y-1 hover:shadow-md"
            >
              {/* Top Accent Indicator */}
              <span
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-1 bg-transparent group-hover:bg-[#006A4E] transition-colors duration-300"
              />

              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between gap-4 pb-3 border-b border-slate-100 group-hover:border-emerald-200/60 transition-colors duration-300">
                  <div>
                    <p className="text-xs font-semibold text-[#006A4E] tabular-nums">
                      {language === 'bn' ? `ওয়ার্ড নং ${ward.wardNumber}` : `Ward No. ${ward.wardNumber}`}
                      <span className="mx-1.5 text-slate-300" aria-hidden="true">
                        ·
                      </span>
                      {pickLang(ward.zoneLabel, language)}
                    </p>
                    <h2 className="text-lg font-bold text-[#111827] group-hover:text-[#006A4E] transition-colors duration-300 mt-0.5">
                      {pickLang(ward.areaName, language)}
                    </h2>
                  </div>
                  <div className="text-right text-xs text-[#4B5563] shrink-0">
                    <span className="block">{language === 'bn' ? 'জনসংখ্যা' : 'Population'}</span>
                    <span className="font-bold text-[#111827] tabular-nums">
                      {pickLang(ward.population, language)}
                    </span>
                  </div>
                </div>

                {/* Covered Areas */}
                <p className="text-xs sm:text-sm text-[#4B5563] leading-relaxed">
                  <strong className="text-[#111827]">
                    {language === 'bn' ? 'অন্তর্ভুক্ত এলাকাসমূহ: ' : 'Covered Areas: '}
                  </strong>
                  {pickLang(ward.coveredAreas, language)}
                </p>

                {/* Councillor & Ward Secretary */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="bg-[#F8FAFC] group-hover:bg-white rounded-lg border border-[#E2E8F0] group-hover:border-emerald-200/80 p-3 space-y-1 transition-colors duration-300">
                    <div className="flex items-center gap-1.5 text-[#006A4E] font-semibold">
                      <UserCheck className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>{language === 'bn' ? 'ওয়ার্ড কাউন্সিলর' : 'Ward Councillor'}</span>
                    </div>
                    <p className="font-bold text-[#111827]">
                      {pickLang(ward.councillorName, language)}
                    </p>
                    <a
                      href={`tel:${ward.councillorPhone.replace(/[^+\d]/g, '')}`}
                      className="inline-flex items-center gap-1 font-mono text-[#006A4E] hover:underline tabular-nums"
                    >
                      <Phone className="w-3 h-3" aria-hidden="true" />
                      <span>{ward.councillorPhone}</span>
                    </a>
                  </div>

                  <div className="bg-[#F8FAFC] group-hover:bg-white rounded-lg border border-[#E2E8F0] group-hover:border-emerald-200/80 p-3 space-y-1 transition-colors duration-300">
                    <div className="flex items-center gap-1.5 text-[#006A4E] font-semibold">
                      <Users className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>{language === 'bn' ? 'ওয়ার্ড সচিব' : 'Ward Secretary'}</span>
                    </div>
                    <p className="font-bold text-[#111827]">
                      {pickLang(ward.secretaryName, language)}
                    </p>
                    <a
                      href={`tel:${ward.secretaryPhone.replace(/[^+\d]/g, '')}`}
                      className="inline-flex items-center gap-1 font-mono text-[#006A4E] hover:underline tabular-nums"
                    >
                      <Phone className="w-3 h-3" aria-hidden="true" />
                      <span>{ward.secretaryPhone}</span>
                    </a>
                  </div>
                </div>

                {/* Waste & Fogging Schedules */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="flex items-start gap-2.5 bg-[#ECFDF5]/60 group-hover:bg-white/80 rounded-lg border border-emerald-200/80 p-3 transition-colors duration-300">
                    <Trash2 className="w-4 h-4 text-[#006A4E] shrink-0 mt-0.5" aria-hidden="true" />
                    <div>
                      <p className="font-semibold text-[#111827]">
                        {language === 'bn' ? 'বর্জ্য সংগ্রহের সময়' : 'Waste Collection Schedule'}
                      </p>
                      <p className="text-[#4B5563] mt-0.5">
                        {pickLang(ward.wasteSchedule, language)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 bg-amber-50/70 group-hover:bg-amber-50/90 rounded-lg border border-amber-200/80 p-3 transition-colors duration-300">
                    <Sparkles className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" aria-hidden="true" />
                    <div>
                      <p className="font-semibold text-[#111827]">
                        {language === 'bn' ? 'মশক নিধন ফগিং সময়' : 'Mosquito Fogging Schedule'}
                      </p>
                      <p className="text-[#4B5563] mt-0.5">
                        {pickLang(ward.foggingSchedule, language)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Footer */}
              <div className="pt-3 border-t border-slate-100 group-hover:border-emerald-200/60 transition-colors duration-300 flex flex-wrap items-center gap-2.5">
                <Link
                  href={`/city-map?ward=${ward.wardNumber}`}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-[#006A4E] hover:bg-[#00523C] text-white text-xs font-semibold transition-all duration-200 whitespace-nowrap shadow-xs hover:shadow-sm"
                >
                  <MapPin className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>{language === 'bn' ? 'সিটি ম্যাপে দেখুন' : 'View Ward on City Map'}</span>
                </Link>
                <Link
                  href={`/complaints?tab=submit&ward=${ward.wardNumber}`}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-[#ECFDF5] hover:bg-emerald-100 group-hover:bg-white group-hover:border-[#006A4E]/40 text-[#006A4E] border border-emerald-200 text-xs font-semibold transition-all duration-200 whitespace-nowrap shadow-2xs"
                >
                  <ShieldAlert className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>{language === 'bn' ? 'অভিযোগ দাখিল' : 'Report Issue'}</span>
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </AboutPageLayout>
  );
}
