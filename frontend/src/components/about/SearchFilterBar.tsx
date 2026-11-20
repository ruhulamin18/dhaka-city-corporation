'use client';

import React from 'react';
import { RotateCcw, Search } from 'lucide-react';

export interface FilterSelectConfig {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
}

export interface SearchFilterBarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder: string;
  searchAriaLabel: string;
  filters?: FilterSelectConfig[];
  resultCountText?: string;
  resetLabel?: string;
  onReset?: () => void;
  hasActiveFilters?: boolean;
}

export function SearchFilterBar({
  searchValue,
  onSearchChange,
  searchPlaceholder,
  searchAriaLabel,
  filters = [],
  resultCountText,
  resetLabel = 'Reset',
  onReset,
  hasActiveFilters = false,
}: SearchFilterBarProps) {
  return (
    <div className="civic-card bg-white rounded-xl border border-[#E2E8F0] p-4 sm:p-5 space-y-3">
      <div className="flex flex-col md:flex-row md:items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1 min-w-0">
          <Search
            className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
            aria-hidden="true"
          />
          <input
            type="text"
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            aria-label={searchAriaLabel}
            placeholder={searchPlaceholder}
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-[#111827] placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#006A4E]"
          />
        </div>

        {/* Dynamic Filter Dropdowns */}
        {filters.map((filter) => (
          <div key={filter.id} className="shrink-0">
            <label htmlFor={filter.id} className="sr-only">
              {filter.label}
            </label>
            <select
              id={filter.id}
              value={filter.value}
              onChange={(e) => filter.onChange(e.target.value)}
              className="w-full md:w-auto min-w-[180px] px-3.5 py-2.5 text-sm bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-[#111827] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#006A4E]"
            >
              {filter.options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        ))}

        {/* Reset Action */}
        {hasActiveFilters && onReset && (
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 text-xs font-semibold text-[#006A4E] bg-[#ECFDF5] hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
            <span>{resetLabel}</span>
          </button>
        )}
      </div>

      {resultCountText && (
        <p className="text-xs text-[#4B5563] tabular-nums">{resultCountText}</p>
      )}
    </div>
  );
}
