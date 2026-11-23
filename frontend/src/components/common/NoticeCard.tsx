'use client';

import React from 'react';
import { Trash2 } from 'lucide-react';
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
  readDetailsLabel = 'Read Details',
  closeLabel = 'Close',
  onDelete,
}: NoticeCardProps) {
  const title = language === 'bn' ? notice.titleBn : notice.titleEn;
  const summary = language === 'bn' ? notice.summaryBn : notice.summaryEn;

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
    <article className="p-5 hover:bg-slate-50/70 transition-colors">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
            {categoryLabel && <span className="font-semibold text-[#006A4E]">{categoryLabel}</span>}
            {categoryLabel && <span aria-hidden="true">·</span>}
            <span className="tabular-nums">{notice.publishedAt}</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono text-[11px]">{notice.referenceCode}</span>
          </div>
          <h3 className="text-base font-bold text-[#111827]">{title}</h3>
        </div>
        {notice.isUrgent && <StatusBadge variant="danger" label={urgentLabel} />}
      </div>

      {isExpanded && (
        <p className="mt-3 text-sm text-slate-700 leading-relaxed bg-emerald-50/40 p-3.5 rounded-lg border border-emerald-200/60">
          {summary}
        </p>
      )}

      {onToggleExpand && (
        <div className="mt-3">
          <button
            type="button"
            onClick={onToggleExpand}
            aria-expanded={isExpanded}
            className="text-xs font-semibold text-[#006A4E] hover:text-[#00523C] hover:underline cursor-pointer"
          >
            {isExpanded ? closeLabel : readDetailsLabel}
          </button>
        </div>
      )}
    </article>
  );
}
