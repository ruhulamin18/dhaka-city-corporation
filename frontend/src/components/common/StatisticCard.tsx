import React from 'react';

export type StatisticTone = 'default' | 'primary' | 'warning';

export interface StatisticCardProps {
  label: string;
  value: string | number;
  tone?: StatisticTone;
}

const VALUE_TONE_CLASSES: Record<StatisticTone, string> = {
  default: 'text-[#111827]',
  primary: 'text-[#006A4E]',
  warning: 'text-amber-600',
};

export function StatisticCard({ label, value, tone = 'default' }: StatisticCardProps) {
  return (
    <div className="group relative overflow-hidden civic-card bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-xs transition-all duration-300 ease-out hover:bg-[#ECFDF5]/80 hover:border-[#006A4E] hover:-translate-y-1 hover:shadow-md">
      {/* Top Accent Indicator */}
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-1 bg-transparent group-hover:bg-[#006A4E] transition-colors duration-300"
      />
      <p className="text-xs font-medium text-[#4B5563] group-hover:text-[#006A4E] transition-colors duration-300">
        {label}
      </p>
      <p className={`text-2xl font-bold mt-1 tabular-nums ${VALUE_TONE_CLASSES[tone]} group-hover:scale-105 origin-left transition-transform duration-300`}>
        {value}
      </p>
    </div>
  );
}
