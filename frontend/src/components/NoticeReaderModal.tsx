'use client';

import React, { useEffect, useState } from 'react';
import {
  Calendar,
  Check,
  Copy,
  Download,
  ExternalLink,
  FileText,
  Printer,
  ShieldCheck,
  X,
} from 'lucide-react';
import { Language, NoticeItem } from '@/types';
import { StatusBadge } from '@/components/StatusBadge';

interface NoticeReaderModalProps {
  notice: NoticeItem | null;
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onDownloadPdf: (notice: NoticeItem) => void;
}

export function NoticeReaderModal({
  notice,
  isOpen,
  onClose,
  language,
  onDownloadPdf,
}: NoticeReaderModalProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !notice) return null;

  const title = language === 'bn' ? notice.titleBn : notice.titleEn;
  const summary = language === 'bn' ? notice.summaryBn : notice.summaryEn;

  const handleCopyRef = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(notice.referenceCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="notice-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl max-h-[90vh] bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-200 bg-gradient-to-r from-emerald-50/50 via-white to-slate-50 flex items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-bold border border-slate-200 flex items-center gap-1.5">
                <span>{notice.referenceCode}</span>
                <button
                  type="button"
                  onClick={handleCopyRef}
                  title="Copy Reference Code"
                  className="hover:text-[#006A4E] cursor-pointer"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-slate-400" />}
                </button>
              </span>
              <span className="text-xs px-2 py-0.5 rounded bg-emerald-100 text-[#006A4E] font-semibold">
                {notice.category.toUpperCase()}
              </span>
              {notice.isUrgent && (
                <StatusBadge variant="danger" label={language === 'bn' ? 'জরুরি' : 'Urgent'} />
              )}
            </div>
            <h2 id="notice-modal-title" className="text-lg sm:text-xl font-bold text-[#0F172A]">
              {title}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Official Decree Body */}
        <div className="p-6 sm:p-8 space-y-6 overflow-y-auto">
          {/* Official Letterhead Header */}
          <div className="text-center pb-4 border-b border-slate-200 space-y-1">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
              {language === 'bn' ? 'গণপ্রজাতন্ত্রী বাংলাদেশ সরকার' : "Government of the People's Republic of Bangladesh"}
            </p>
            <h3 className="text-base font-bold text-[#006A4E]">
              {language === 'bn' ? 'ঢাকা স্মার্ট সিটি কর্পোরেশন' : 'Dhaka Smart City Corporation'}
            </h3>
            <p className="text-[11px] text-slate-500 font-mono">
              Nagar Bhaban, Fulbaria, Dhaka-1000 · www.dscc.gov.bd
            </p>
          </div>

          {/* Metadata Row */}
          <div className="flex flex-wrap items-center justify-between text-xs text-slate-600 font-mono py-2 bg-slate-50 px-4 rounded-lg border border-slate-200">
            <div>
              <span className="font-semibold text-slate-700">স্মারক নং / Ref:</span>{' '}
              {notice.referenceCode}
            </div>
            <div>
              <span className="font-semibold text-slate-700">তারিখ / Date:</span>{' '}
              {notice.publishedAt}
            </div>
          </div>

          {/* Main Notice Decree Text */}
          <div className="space-y-4 text-sm text-[#0F172A] leading-relaxed">
            <p className="font-semibold text-base">
              {language === 'bn'
                ? 'বিষয়: সরকারি বিজ্ঞপ্তি ও কার্যকর নির্দেশিকা বাস্তবায়ন প্রসঙ্গে।'
                : 'Subject: Official Municipal Circular & Procedural Guidelines.'}
            </p>
            <p>{summary}</p>
            <p className="text-xs text-slate-600 leading-relaxed bg-emerald-50/60 p-4 rounded-xl border border-emerald-200/60">
              {language === 'bn'
                ? 'এতদ্বারা ঢাকা দক্ষিণ সিটি কর্পোরেশনের আওতাধীন সকল সংশ্লিষ্ট নাগরিক, কর্মকর্তা ও ঠিকাদারদের এই আদেশ অবিলম্বে অনুসরণ করার নির্দেশ দেওয়া হলো। যে কোনো তথ্য ও সহায়তার জন্য ডিএসসিসি হটলাইন ১৬১০৬ বা নাগরিক অনলাইন পোর্টালে যোগাযোগ করুন।'
                : 'All concerned citizens, officials, and registered contractors of Dhaka South City Corporation are hereby instructed to adhere to this directive immediately. For further inquiries or assistance, please contact the DSCC Helpline at 16106 or the Unified Citizen Portal.'}
            </p>
          </div>

          {/* Official Signature Seal Block */}
          <div className="pt-6 border-t border-slate-200 flex justify-end">
            <div className="text-right space-y-1 text-xs">
              <div className="font-mono text-[10px] text-emerald-700 font-bold tracking-widest uppercase">
                [Digitally Signed & Certified]
              </div>
              <p className="font-bold text-slate-900">
                {language === 'bn' ? 'সচিব ও প্রধান নির্বাহী কর্মকর্তা' : 'Secretary & Chief Executive Officer'}
              </p>
              <p className="text-slate-500">
                {language === 'bn' ? 'ঢাকা স্মার্ট সিটি কর্পোরেশন' : 'Dhaka Smart City Corporation'}
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'প্রিন্ট' : 'Print'}</span>
            </button>

            <button
              type="button"
              onClick={() => onDownloadPdf(notice)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#006A4E] hover:bg-[#00523C] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'পিডিএফ ডাউনলোড' : 'Download PDF'}</span>
              <span className="text-[10px] bg-white/20 px-1 py-0.2 rounded font-mono ml-0.5">
                {notice.fileSize || 'PDF • 420 KB'}
              </span>
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 text-xs font-semibold transition-colors cursor-pointer"
          >
            {language === 'bn' ? 'বন্ধ করুন' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
}
