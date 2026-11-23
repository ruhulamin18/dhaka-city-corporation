'use client';

import React, { useMemo, useState } from 'react';
import { Bell, Building2, Search } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { NoticeCategory, NoticeItem, WardInfo } from '@/types';
import { NOTICE_CATEGORIES_ORDER } from '@/data/homeData';
import { NoticeCard } from '@/components/common/NoticeCard';
import { WardDirectoryCard } from '@/components/common/WardDirectoryCard';
import { EmptyState } from '@/components/common/EmptyState';

export interface NoticeAndWardSectionProps {
  notices: NoticeItem[];
  wards: WardInfo[];
}

export function NoticeAndWardSection({ notices, wards }: NoticeAndWardSectionProps) {
  const { language, t } = useApp();

  const [noticeCategory, setNoticeCategory] = useState<NoticeCategory | 'all'>('all');
  const [noticeQuery, setNoticeQuery] = useState('');
  const [expandedNoticeId, setExpandedNoticeId] = useState<string | null>(null);
  const [selectedWardNum, setSelectedWardNum] = useState<number>(27);

  const filteredNotices = useMemo(() => {
    return notices.filter((n) => {
      const catOk = noticeCategory === 'all' || n.category === noticeCategory;
      if (!catOk) return false;
      if (!noticeQuery.trim()) return true;
      const q = noticeQuery.toLowerCase();
      return (
        n.titleEn.toLowerCase().includes(q) ||
        n.titleBn.toLowerCase().includes(q) ||
        n.summaryEn.toLowerCase().includes(q) ||
        n.summaryBn.toLowerCase().includes(q) ||
        n.referenceCode.toLowerCase().includes(q)
      );
    });
  }, [notices, noticeCategory, noticeQuery]);

  const activeWard = wards.find((w) => w.wardNumber === selectedWardNum) ?? wards[0];

  return (
    <section id="notices" className="bg-white/80 backdrop-blur-xs border-t border-slate-200 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
        {/* Dynamic Notice Board (7 columns) */}
        <div className="lg:col-span-7">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#111827] flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-lg bg-emerald-50 text-[#006A4E] flex items-center justify-center shrink-0">
                  <Bell className="w-4 h-4" aria-hidden="true" />
                </span>
                <span>{t.notices.title}</span>
              </h2>
              <p className="mt-1.5 text-sm sm:text-base text-slate-600">{t.notices.subtitle}</p>
            </div>
          </div>

          {/* Search & Category Filter */}
          <div className="space-y-3 mb-5">
            <div className="relative">
              <Search
                className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                aria-hidden="true"
              />
              <input
                type="text"
                value={noticeQuery}
                onChange={(e) => setNoticeQuery(e.target.value)}
                aria-label={t.notices.searchPlaceholder}
                placeholder={t.notices.searchPlaceholder}
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006A4E] text-[#111827] placeholder:text-slate-400"
              />
            </div>

            <div
              role="group"
              aria-label={language === 'bn' ? 'নোটিশ ক্যাটাগরি ফিল্টার' : 'Filter notices by category'}
              className="flex flex-wrap gap-1 bg-slate-100/80 border border-slate-200 p-1 rounded-lg"
            >
              {NOTICE_CATEGORIES_ORDER.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  aria-pressed={noticeCategory === cat}
                  onClick={() => setNoticeCategory(cat)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    noticeCategory === cat
                      ? 'bg-[#006A4E] text-white shadow-2xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {cat === 'all' ? t.notices.allCategories : t.notices.categories[cat]}
                </button>
              ))}
            </div>
          </div>

          {/* Notices List */}
          {filteredNotices.length === 0 ? (
            <EmptyState message={t.notices.empty} />
          ) : (
            <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl bg-white overflow-hidden shadow-2xs">
              {filteredNotices.map((notice) => {
                const isExpanded = expandedNoticeId === notice.id;
                return (
                  <NoticeCard
                    key={notice.id}
                    notice={notice}
                    language={language}
                    categoryLabel={t.notices.categories[notice.category]}
                    urgentLabel={t.notices.urgent}
                    isExpanded={isExpanded}
                    onToggleExpand={() => setExpandedNoticeId(isExpanded ? null : notice.id)}
                    readDetailsLabel={t.notices.readDetails}
                    closeLabel={t.notices.close}
                  />
                );
              })}
            </div>
          )}
        </div>

        {/* Interactive Ward Directory (5 columns) */}
        <div className="lg:col-span-5">
          <div className="mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#111827] flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-lg bg-emerald-50 text-[#006A4E] flex items-center justify-center shrink-0">
                <Building2 className="w-4 h-4" aria-hidden="true" />
              </span>
              <span>{t.wardDirectory.title}</span>
            </h2>
            <p className="mt-1.5 text-sm sm:text-base text-slate-600">{t.wardDirectory.subtitle}</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5 shadow-2xs">
            <div>
              <p
                id="ward-selector-label"
                className="block text-xs font-semibold text-[#111827] mb-2"
              >
                {t.wardDirectory.selectWard}
              </p>
              <div
                role="group"
                aria-labelledby="ward-selector-label"
                className="grid grid-cols-4 gap-1.5 mb-3"
              >
                {wards.map((w) => (
                  <button
                    key={w.wardNumber}
                    type="button"
                    aria-pressed={selectedWardNum === w.wardNumber}
                    onClick={() => setSelectedWardNum(w.wardNumber)}
                    className={`py-2 px-2 rounded-lg text-xs font-semibold border transition-colors tabular-nums cursor-pointer ${
                      selectedWardNum === w.wardNumber
                        ? 'bg-[#006A4E] text-white border-[#006A4E]'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-[#006A4E] hover:text-[#006A4E]'
                    }`}
                  >
                    {t.common.ward} {w.wardNumber}
                  </button>
                ))}
              </div>
            </div>

            {activeWard && (
              <WardDirectoryCard
                ward={activeWard}
                language={language}
                labels={{
                  wardPrefix: t.common.ward,
                  councillor: t.wardDirectory.councillor,
                  emergency: t.wardDirectory.emergency,
                  wasteSchedule: t.wardDirectory.wasteSchedule,
                  foggingSchedule: t.wardDirectory.foggingSchedule,
                  population: t.wardDirectory.population,
                  area: t.wardDirectory.area,
                  viewOnMap: t.wardDirectory.viewOnMap,
                  complaints: t.nav.complaints,
                }}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
