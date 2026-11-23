'use client';

import React, { useState } from 'react';
import {
  Calendar,
  Check,
  Copy,
  Download,
  Eye,
  FileText,
  Trash2,
} from 'lucide-react';
import { Language, NoticeItem } from '@/types';
import { StatusBadge } from '@/components/StatusBadge';

export interface NoticeCardProps {
  notice: NoticeItem;
  language: Language;
  categoryLabel?: string;
  urgentLabel: string;
  variant?: 'public' | 'admin';
  isExpanded?: boolean;
  onToggleExpand?: () => void;
  onView?: (notice: NoticeItem) => void;
  onDownloadPdf?: (notice: NoticeItem) => void;
  readDetailsLabel?: string;
  closeLabel?: string;
  onDelete?: (id: string) => void;
}

export function NoticeCard({
  notice,
  language,
  categoryLabel,
  urgentLabel,
  variant = 'public',
  isExpanded = false,
  onToggleExpand,
  onView,
  onDownloadPdf,
  readDetailsLabel = 'Read Details',
  closeLabel = 'Close',
  onDelete,
}: NoticeCardProps) {
  const [copied, setCopied] = useState(false);

  const title = language === 'bn' ? notice.titleBn : notice.titleEn;
  const summary = language === 'bn' ? notice.summaryBn : notice.summaryEn;

  const handleCopyRef = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(notice.referenceCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (variant === 'admin') {
    return (
      <div className="p-4 flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#4B5563]">
            <span className="font-mono">{notice.referenceCode}</span>
            <span aria-hidden="true">·</span>
            <span className="tabular-nums">{notice.publishedAt}</span>
            {notice.isUrgent && <StatusBadge variant="danger" label={urgentLabel} />}
          </div>
          <p className="text-sm font-semibold text-[#111827] mt-1">{title}</p>
        </div>
        {onDelete && (
          <button
            type="button"
            onClick={() => onDelete(notice.id)}
            className="p-2 text-slate-400 hover:text-[#C81E1E] rounded-lg cursor-pointer transition-colors"
            aria-label={`Delete notice ${notice.referenceCode}`}
          >
            <Trash2 className="w-4 h-4" aria-hidden="true" />
          </button>
        )}
      </div>
    );
  }

  return (
    <article
      onClick={() => (onView ? onView(notice) : onToggleExpand?.())}
      className="p-5 sm:p-6 bg-white/50 backdrop-blur-md border border-white/60 rounded-xl shadow-xs hover:bg-white/75 hover:border-[#006A4E] hover:-translate-y-0.5 transition-all duration-300 cursor-pointer group space-y-3"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1.5 flex-1 min-w-[260px]">
          {/* Metadata Row: Category, Date, Memo Ref */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
            {categoryLabel && (
              <span className="font-semibold text-[#006A4E] bg-emerald-50/80 px-2.5 py-0.5 rounded-full border border-emerald-200/60">
                {categoryLabel}
              </span>
            )}
            <span className="flex items-center gap-1 tabular-nums font-medium text-slate-500">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              {notice.publishedAt}
            </span>
            <span aria-hidden="true" className="text-slate-300">·</span>

            {/* Memo Ref with Copy Feedback */}
            <span
              onClick={handleCopyRef}
              title={language === 'bn' ? 'স্মারক নম্বর কপি করুন' : 'Click to copy reference code'}
              className="inline-flex items-center gap-1 font-mono text-[11px] px-2 py-0.5 rounded bg-slate-100/90 text-slate-700 hover:text-[#006A4E] hover:bg-emerald-50 transition-colors cursor-pointer border border-slate-200"
            >
              <span>স্মারক: {notice.referenceCode}</span>
              {copied ? (
                <Check className="w-3 h-3 text-emerald-600 flex-shrink-0" />
              ) : (
                <Copy className="w-3 h-3 text-slate-400 group-hover:text-slate-600 flex-shrink-0" />
              )}
            </span>
          </div>

          {/* Notice Title */}
          <h3 className="text-base sm:text-lg font-bold text-[#0F172A] group-hover:text-[#006A4E] transition-colors leading-snug pt-1">
            {title}
          </h3>
        </div>

        {/* Urgent Badge if applicable */}
        {notice.isUrgent && (
          <div className="flex-shrink-0">
            <StatusBadge variant="danger" label={urgentLabel} />
          </div>
        )}
      </div>

      {/* Summary excerpt */}
      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed line-clamp-2">
        {summary}
      </p>

      {/* Action Controls */}
      <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200/50">
        <div className="flex items-center gap-2">
          {onView ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onView(notice);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#006A4E] hover:bg-[#00523C] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'বিস্তারিত পড়ুন' : 'View Notice'}</span>
            </button>
          ) : (
            onToggleExpand && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleExpand();
                }}
                className="text-xs font-semibold text-[#006A4E] hover:underline cursor-pointer"
              >
                {isExpanded ? closeLabel : readDetailsLabel}
              </button>
            )
          )}

          {onDownloadPdf && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDownloadPdf(notice);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-white/90 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors cursor-pointer shadow-2xs"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>{language === 'bn' ? 'পিডিএফ ডাউনলোড' : 'Download PDF'}</span>
              <span className="text-[10px] text-slate-500 font-mono ml-0.5">
                {notice.fileSize || 'PDF • 420 KB'}
              </span>
            </button>
          )}
        </div>

        <span className="text-[11px] text-slate-400 font-medium">
          {language === 'bn' ? 'ডিএসসিসি অফিশিয়াল পোর্টাল' : 'DSCC Official Portal'}
        </span>
      </div>
    </article>
  );
}
