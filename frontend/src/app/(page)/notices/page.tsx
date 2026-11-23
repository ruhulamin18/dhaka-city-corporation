'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  Bell,
  Calendar,
  ChevronLeft,
  ChevronRight,
  FileText,
  Filter,
  Newspaper,
  Search,
  Sparkles,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { mockApi } from '@/services/mockApi';
import { NoticeCategory, NoticeItem } from '@/types';
import { NOTICE_CATEGORIES_ORDER } from '@/data/homeData';
import { NoticeCard } from '@/components/common/NoticeCard';
import { NoticeReaderModal } from '@/components/NoticeReaderModal';

type ActiveTab = 'notices' | 'news';

const ITEMS_PER_PAGE = 5;

export default function NoticesPage() {
  const { language, t } = useApp();
  const [notices, setNotices] = useState<NoticeItem[]>([]);
  const [activeTab, setActiveTab] = useState<ActiveTab>('notices');
  const [selectedCategory, setSelectedCategory] = useState<NoticeCategory | 'all'>('all');
  const [selectedMonth, setSelectedMonth] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNoticeForModal, setSelectedNoticeForModal] = useState<NoticeItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    let active = true;
    mockApi.getNotices().then((data) => {
      if (active) setNotices(data);
    });
    return () => {
      active = false;
    };
  }, []);

  // Filter based on Tab (Official Notices vs News & Press Releases)
  const tabNotices = useMemo(() => {
    return notices.filter((n) => {
      if (activeTab === 'news') {
        return n.type === 'news';
      }
      return n.type !== 'news';
    });
  }, [notices, activeTab]);

  // Extract unique published months for the month filter dropdown
  const availableMonths = useMemo(() => {
    const set = new Set<string>();
    tabNotices.forEach((n) => {
      if (n.publishedAt) {
        set.add(n.publishedAt.substring(0, 7)); // e.g., '2026-11'
      }
    });
    return Array.from(set).sort().reverse();
  }, [tabNotices]);

  // Filter by category, month, search query
  const filteredNotices = useMemo(() => {
    return tabNotices.filter((n) => {
      const catMatch = selectedCategory === 'all' || n.category === selectedCategory;
      if (!catMatch) return false;

      if (selectedMonth !== 'all' && !n.publishedAt.startsWith(selectedMonth)) {
        return false;
      }

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
  }, [tabNotices, selectedCategory, selectedMonth, searchQuery]);

  // Reset pagination when filter or tab changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, selectedCategory, selectedMonth, searchQuery]);

  // Paginated slice
  const totalPages = Math.ceil(filteredNotices.length / ITEMS_PER_PAGE) || 1;
  const paginatedNotices = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredNotices.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredNotices, currentPage]);

  const handleOpenNoticeModal = (notice: NoticeItem) => {
    setSelectedNoticeForModal(notice);
    setIsModalOpen(true);
  };

  // Demo-ready clean Print-to-PDF document generator (never broken)
  const handleDownloadPdf = (notice: NoticeItem) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const noticeTitle = language === 'bn' ? notice.titleBn : notice.titleEn;
    const noticeSummary = language === 'bn' ? notice.summaryBn : notice.summaryEn;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="${language}">
      <head>
        <meta charset="utf-8" />
        <title>${notice.referenceCode} - DSCC Official Publication</title>
        <style>
          @page { size: A4; margin: 20mm; }
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            color: #0F172A;
            line-height: 1.6;
            margin: 0;
            padding: 30px;
          }
          .header {
            text-align: center;
            border-bottom: 2px solid #006A4E;
            padding-bottom: 16px;
            margin-bottom: 24px;
          }
          .gov-title {
            font-size: 12px;
            font-weight: 600;
            color: #64748B;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            margin-bottom: 4px;
          }
          .corp-title {
            font-size: 20px;
            font-weight: 800;
            color: #006A4E;
            margin: 0;
          }
          .address {
            font-size: 11px;
            color: #64748B;
            margin-top: 4px;
          }
          .meta-box {
            display: flex;
            justify-content: space-between;
            background: #F8FAFC;
            border: 1px solid #E2E8F0;
            padding: 10px 16px;
            border-radius: 6px;
            font-size: 12px;
            font-family: monospace;
            margin-bottom: 24px;
          }
          .subject {
            font-size: 16px;
            font-weight: 700;
            color: #0F172A;
            margin-bottom: 16px;
          }
          .content {
            font-size: 14px;
            color: #334155;
            text-align: justify;
            margin-bottom: 24px;
          }
          .directive {
            background: #ECFDF5;
            border-left: 4px solid #006A4E;
            padding: 12px 16px;
            font-size: 12px;
            color: #065F46;
            margin-bottom: 30px;
          }
          .signature-section {
            margin-top: 50px;
            display: flex;
            justify-content: flex-end;
          }
          .signature-box {
            text-align: right;
            font-size: 12px;
          }
          .signature-seal {
            font-family: monospace;
            font-size: 10px;
            color: #006A4E;
            font-weight: bold;
            margin-bottom: 8px;
          }
          .footer {
            margin-top: 60px;
            border-top: 1px solid #E2E8F0;
            padding-top: 12px;
            text-align: center;
            font-size: 10px;
            color: #94A3B8;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="gov-title">${language === 'bn' ? 'গণপ্রজাতন্ত্রী বাংলাদেশ সরকার' : "Government of the People's Republic of Bangladesh"}</div>
          <h1 class="corp-title">${language === 'bn' ? 'ঢাকা স্মার্ট সিটি কর্পোরেশন' : 'Dhaka Smart City Corporation'}</h1>
          <div class="address">নগর ভবন, ফুলবাড়িয়া, ঢাকা-১০০০ · www.dscc.gov.bd · হটলাইন: ১৬১০৬</div>
        </div>

        <div class="meta-box">
          <div><strong>স্মারক নং / Memo No:</strong> ${notice.referenceCode}</div>
          <div><strong>প্রকাশের তারিখ / Date:</strong> ${notice.publishedAt}</div>
        </div>

        <div class="subject">
          <strong>বিষয়:</strong> ${noticeTitle}
        </div>

        <div class="content">
          <p>${noticeSummary}</p>
        </div>

        <div class="directive">
          ${language === 'bn'
            ? 'এতদ্বারা সংশ্লিষ্ট সকলকে এই নির্দেশনা অবিলম্বে পরিপালন করার অনুরোধ করা যাচ্ছে। যে কোনো তথ্যের জন্য ডিএসসিসি নাগরিক সহায়তা কেন্দ্রে যোগাযোগ করুন।'
            : 'All concerned entities are hereby requested to strictly comply with this notice. For assistance, reach out to the DSCC Citizen Service Center.'}
        </div>

        <div class="signature-section">
          <div class="signature-box">
            <div class="signature-seal">[DIGITALLY VERIFIED VIA DSCC AUDIT ENGINE]</div>
            <strong>${language === 'bn' ? 'সচিব ও প্রধান নির্বাহী কর্মকর্তা' : 'Secretary & Chief Executive Officer'}</strong><br/>
            ${language === 'bn' ? 'ঢাকা স্মার্ট সিটি কর্পোরেশন' : 'Dhaka Smart City Corporation'}
          </div>
        </div>

        <div class="footer">
          Official Electronic Gazette Copy · Printed: ${new Date().toLocaleString()} · Ref: ${notice.referenceCode}
        </div>

        <script>
          window.onload = function() {
            window.print();
          };
        </script>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      {/* Page Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#006A4E] bg-[#ECFDF5] border border-emerald-200 px-3 py-1 rounded-full mb-3 shadow-2xs">
          <Sparkles className="w-3.5 h-3.5" />
          <span>
            {language === 'bn'
              ? 'ডিএসসিসি ডিজিটাল নোটিশ ও তথ্য বাতায়ন'
              : 'DSCC Digital Gazette & News Portal'}
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#0F172A] tracking-tight">
          {language === 'bn'
            ? 'বিজ্ঞপ্তি, আদেশ ও সরকারি ঘোষণা'
            : 'Notices, Circulars & Announcements'}
        </h1>
        <p className="mt-2 text-sm text-[#4B5563] max-w-2xl mx-auto">
          {language === 'bn'
            ? 'ঢাকা দক্ষিণ সিটি কর্পোরেশনের সকল সাধারণ বিজ্ঞপ্তি, টেন্ডার, নিয়োগ, উন্নয়ন ও জরুরি সতর্কবার্তা অনুসন্ধান করুন।'
            : 'Explore public notices, e-tender publications, recruitment circulars, press releases, and official municipal decrees.'}
        </p>
      </div>

      {/* Tabs: Official Notices vs News & Press Releases */}
      <div className="flex items-center justify-center mb-8">
        <div className="inline-flex p-1 rounded-xl bg-slate-100 border border-slate-200 shadow-inner">
          <button
            type="button"
            onClick={() => setActiveTab('notices')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'notices'
                ? 'bg-white text-[#006A4E] shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Bell className="w-4 h-4 text-[#006A4E]" />
            <span>{language === 'bn' ? 'অফিশিয়াল নোটিশ' : 'Official Notices'}</span>
            <span className="px-2 py-0.2 rounded-full text-xs font-mono bg-emerald-50 text-[#006A4E]">
              {notices.filter((n) => n.type !== 'news').length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('news')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'news'
                ? 'bg-white text-[#006A4E] shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Newspaper className="w-4 h-4 text-[#006A4E]" />
            <span>{language === 'bn' ? 'সংবাদ ও প্রেস বিজ্ঞপ্তি' : 'News & Press Releases'}</span>
            <span className="px-2 py-0.2 rounded-full text-xs font-mono bg-emerald-50 text-[#006A4E]">
              {notices.filter((n) => n.type === 'news').length}
            </span>
          </button>
        </div>
      </div>

      {/* Filter Bar with Search, Category Pills & Month Filter */}
      <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-white/80 p-5 sm:p-6 shadow-sm mb-8 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
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
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50/80 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#006A4E] focus:bg-white transition"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            )}
          </div>

          {/* Month / Date Filter */}
          <div className="flex items-center gap-2 bg-slate-50/80 px-3 py-2 rounded-xl border border-slate-200 flex-shrink-0">
            <Calendar className="w-4 h-4 text-[#006A4E]" />
            <label htmlFor="filter-month" className="text-xs font-semibold text-slate-600 whitespace-nowrap">
              {language === 'bn' ? 'মাস:' : 'Month:'}
            </label>
            <select
              id="filter-month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="text-xs font-bold text-[#111827] bg-transparent focus:outline-none cursor-pointer"
            >
              <option value="all">{language === 'bn' ? 'সকল সময়' : 'All Months'}</option>
              {availableMonths.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Category Filter Pills (Relevant for official notices) */}
        {activeTab === 'notices' && (
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-200/60">
            <span className="text-xs font-semibold text-slate-500 mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3 text-[#006A4E]" />
              {language === 'bn' ? 'ক্যাটাগরি:' : 'Category:'}
            </span>
            {NOTICE_CATEGORIES_ORDER.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#006A4E] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat === 'all'
                  ? language === 'bn'
                    ? 'সকল ক্যাটাগরি'
                    : 'All Categories'
                  : t.notices.categories[cat]}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Notices Count & Active Filters Indicator */}
      <div className="flex items-center justify-between text-xs text-slate-500 mb-4 px-1">
        <span>
          {language === 'bn' ? 'মোট প্রকাশিত আইটেম:' : 'Total items found:'}{' '}
          <strong className="text-slate-900 font-mono">{filteredNotices.length}</strong>
        </span>
        <span className="text-slate-400">
          {language === 'bn'
            ? `পৃষ্ঠা ${currentPage} (মোট ${totalPages} পৃষ্ঠা)`
            : `Page ${currentPage} of ${totalPages}`}
        </span>
      </div>

      {/* Notices List: 50% Transparent White Glassmorphic Cards */}
      <div className="space-y-4">
        {paginatedNotices.length === 0 ? (
          <div className="text-center py-12 bg-white/60 backdrop-blur-md rounded-2xl border border-white/60 p-8 shadow-xs">
            <Bell className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700">
              {language === 'bn'
                ? 'আপনার অনুসন্ধানের সাথে মিলে এমন কোনো নোটিশ বা সংবাদ পাওয়া যায়নি।'
                : 'No notices or press releases match your filter criteria.'}
            </p>
          </div>
        ) : (
          paginatedNotices.map((notice) => (
            <NoticeCard
              key={notice.id}
              notice={notice}
              language={language}
              categoryLabel={t.notices.categories[notice.category]}
              urgentLabel={language === 'bn' ? 'জরুরি' : 'Urgent'}
              onView={handleOpenNoticeModal}
              onDownloadPdf={handleDownloadPdf}
            />
          ))
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-2">
          <button
            type="button"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="p-2 rounded-lg border border-slate-300 bg-white/80 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white text-slate-700 cursor-pointer shadow-2xs"
            aria-label="Previous page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              type="button"
              onClick={() => setCurrentPage(page)}
              className={`w-9 h-9 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                currentPage === page
                  ? 'bg-[#006A4E] text-white shadow-xs'
                  : 'bg-white/80 border border-slate-200 text-slate-700 hover:bg-white'
              }`}
            >
              {page}
            </button>
          ))}

          <button
            type="button"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            className="p-2 rounded-lg border border-slate-300 bg-white/80 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white text-slate-700 cursor-pointer shadow-2xs"
            aria-label="Next page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Notice Reader Modal */}
      <NoticeReaderModal
        notice={selectedNoticeForModal}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        language={language}
        onDownloadPdf={handleDownloadPdf}
      />
    </div>
  );
}
