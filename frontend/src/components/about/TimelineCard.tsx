import React from 'react';
import { Language } from '@/types';
import { HistoryMilestone, pickLang } from '@/types/about';

export interface TimelineCardProps {
  milestone: HistoryMilestone;
  language: Language;
  isLast?: boolean;
  isActive?: boolean;
  onSelect?: () => void;
}

export function TimelineCard({
  milestone,
  language,
  isLast = false,
  isActive = false,
  onSelect,
}: TimelineCardProps) {
  return (
    <div className="relative flex gap-4 sm:gap-6">
      {/* Vertical Rail & Year Node */}
      <div className="flex flex-col items-center shrink-0">
        <button
          type="button"
          onClick={onSelect}
          aria-pressed={isActive}
          className={`w-14 h-14 rounded-xl border text-xs font-extrabold tabular-nums flex items-center justify-center transition-colors cursor-pointer ${
            isActive
              ? 'bg-[#006A4E] text-white border-[#006A4E] shadow-sm'
              : 'bg-[#ECFDF5] text-[#006A4E] border-emerald-200 hover:border-[#006A4E]'
          }`}
        >
          {pickLang(milestone.year, language)}
        </button>
        {!isLast && (
          <div className="w-px flex-1 bg-[#E2E8F0] my-2" aria-hidden="true" />
        )}
      </div>

      {/* Milestone Card */}
      <article
        onClick={onSelect}
        className={`flex-1 mb-6 civic-card bg-white rounded-xl border p-5 sm:p-6 transition-colors ${
          isActive
            ? 'border-[#006A4E] shadow-sm'
            : 'border-[#E2E8F0] hover:border-[#006A4E]/50'
        } ${onSelect ? 'cursor-pointer' : ''}`}
      >
        <p className="text-xs font-semibold text-[#006A4E]">
          {pickLang(milestone.era, language)}
          <span className="mx-1.5 text-slate-300" aria-hidden="true">
            ·
          </span>
          <span className="tabular-nums">{pickLang(milestone.year, language)}</span>
        </p>
        <h3 className="text-lg font-bold text-[#111827] mt-1">
          {pickLang(milestone.title, language)}
        </h3>
        <p className="text-sm text-[#4B5563] leading-relaxed mt-2">
          {pickLang(milestone.description, language)}
        </p>
        <p className="mt-3 pt-3 border-t border-slate-100 text-xs font-medium text-[#006A4E]">
          {pickLang(milestone.impact, language)}
        </p>
      </article>
    </div>
  );
}
