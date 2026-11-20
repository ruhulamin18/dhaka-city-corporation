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
    <div className="civic-card bg-white rounded-xl border border-[#E2E8F0] p-5">
      <p className="text-xs font-medium text-[#4B5563]">{label}</p>
      <p className={`text-2xl font-bold mt-1 tabular-nums ${VALUE_TONE_CLASSES[tone]}`}>
        {value}
      </p>
    </div>
  );
}
