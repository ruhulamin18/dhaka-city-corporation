'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Bell, Search, Filter, Calendar, FileText, Download, Tag } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { mockApi } from '@/services/mockApi';
import { NoticeCategory, NoticeItem } from '@/types';
import { NOTICE_CATEGORIES_ORDER } from '@/data/homeData';
import { NoticeCard } from '@/components/common/NoticeCard';

export default function NoticesPage() {
  const { language, t } = useApp();
  const [notices, setNotices] = useState<NoticeItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<NoticeCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedNoticeId, setExpandedNoticeId] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    mockApi.getNotices().then((data) => {
      if (active) setNotices(data);
    });
    return () => {
      active = false;
    };
  }, []);

  const filteredNotices = useMemo(() => {
    return notices.filter((n) => {
      const catMatch = selectedCategory === 'all' || n.category === selectedCategory;
      if (!catMatch) return false;
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        n.titleEn.toLowerCase().includes(q) ||
        n.titleBn.toLowerCase().includes(q) ||
        n.summaryEn.toLowerCase().includes(q) ||
        n.summaryBn.toLowerCase().includes(q) ||
        n.referenceCode.toLowerCase().includes(q)
      );
    });
  }, [notices, selectedCategory, searchQuery]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#006A4E] bg-[#ECFDF5] border border-emerald-200 px-3 py-1 rounded-full mb-3">
          <Bell className="w-3.5 h-3.5" />
          <span>{language === 'bn' ? 'অফিসিয়াল নোটিশ বোর্ড' : 'Official Notice Board'}</span>
        </div>
        <h1 className="text-3xl font-extrabold text-[#0B2545] tracking-tight">
          {language === 'bn' ? 'বিজ্ঞপ্তি, আদেশ ও সরকারি ঘোষণা' : 'Notices, Circulars & Announcements'}
        </h1>
        <p className="mt-2 text-sm text-[#4B5563] max-w-xl mx-auto">
          {language === 'bn'
            ? 'ঢাকা সিটি কর্পোরেশনের সকল সাধারণ বিজ্ঞপ্তি, টেন্ডার, নিয়োগ ও জরুরি সতর্কবার্তা অনুসন্ধান করুন।'
            : 'Explore public notices, e-tender publications, recruitment circulars, and official municipal decrees.'}
        </p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-sm mb-8 space-y-4">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              language === 'bn'
                ? 'শিরোনাম, বিষয়বস্তু বা স্মারক নম্বর দিয়ে খুঁজুন...'
                : 'Search notices by title, keyword or reference code...'
            }
            className="w-full pl-10 pr-4 py-3 text-sm bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#006A4E] focus:bg-white transition"
          />
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
          {NOTICE_CATEGORIES_ORDER.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition ${
                selectedCategory === cat
                  ? 'bg-[#006A4E] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat === 'all'
                ? language === 'bn'
                  ? 'সকল নোটিশ'
                  : 'All Categories'
                : t.notices.categories[cat]}
            </button>
          ))}
        </div>
      </div>

      {/* Notices Count */}
      <div className="flex items-center justify-between text-xs text-slate-500 mb-4 px-1">
        <span>
          {language === 'bn' ? 'মোট নোটিশ সংখ্যা:' : 'Total Notices Found:'}{' '}
          <strong className="text-slate-800">{filteredNotices.length}</strong>
        </span>
      </div>

      {/* Notices Grid */}
      <div className="space-y-4">
        {filteredNotices.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-8">
            <Bell className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700">
              {language === 'bn' ? 'কোনো নোটিশ পাওয়া যায়নি।' : 'No notices match your filter.'}
            </p>
          </div>
        ) : (
          filteredNotices.map((notice) => (
            <NoticeCard
              key={notice.id}
              notice={notice}
              isExpanded={expandedNoticeId === notice.id}
              onToggle={() =>
                setExpandedNoticeId((prev) => (prev === notice.id ? null : notice.id))
              }
            />
          ))
        )}
      </div>
    </div>
  );
}
