'use client';

import React from 'react';
import { AlertTriangle, CheckCircle2, Clock, XCircle } from 'lucide-react';

interface StatusBadgeProps {
  variant: 'success' | 'warning' | 'danger' | 'neutral';
  label: string;
}

export function StatusBadge({ variant, label }: StatusBadgeProps) {
  const styles: Record<StatusBadgeProps['variant'], string> = {
    success: 'bg-[#ECFDF5] text-[#006A4E] border-emerald-200',
    warning: 'bg-amber-50 text-amber-800 border-amber-200',
    danger: 'bg-[#FEF2F2] text-[#C81E1E] border-red-200',
    neutral: 'bg-slate-100 text-[#4B5563] border-[#E2E8F0]',
  };

  const Icon =
    variant === 'success'
      ? CheckCircle2
      : variant === 'warning'
        ? Clock
        : variant === 'danger'
          ? AlertTriangle
          : XCircle;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md border whitespace-nowrap shrink-0 ${styles[variant]}`}
    >
      <Icon className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
      <span>{label}</span>
    </span>
  );
}
