'use client';

import React from 'react';
import {
  AlertTriangle,
  Clock,
  Rocket,
  SearchX,
  WifiOff,
  Wrench,
} from 'lucide-react';
import { StatusIconKey } from '@/config/status-config';

interface StatusMessageProps {
  message: string;
  icon: StatusIconKey;
  expectedCompletionTime?: string;
  compact?: boolean;
}

const STATUS_ICON_MAP = {
  clock: Clock,
  rocket: Rocket,
  wrench: Wrench,
  'search-x': SearchX,
  'alert-triangle': AlertTriangle,
  'wifi-off': WifiOff,
} as const;

export function StatusMessage({
  message,
  icon,
  expectedCompletionTime,
  compact = false,
}: StatusMessageProps) {
  const Icon = STATUS_ICON_MAP[icon];

  return (
    <div
      role="status"
      aria-live="polite"
      className={`mx-auto w-full rounded-xl bg-[#E7F4EF] border border-[#087A5B]/15 text-[#163B32] flex flex-col items-center justify-center gap-1 ${
        compact
          ? 'max-w-sm px-4 py-2.5'
          : 'max-w-[440px] px-5 sm:px-7 py-3.5'
      }`}
    >
      <div className="flex items-center justify-center gap-2.5 text-center">
        <Icon
          className="w-5 h-5 text-[#087A5B] shrink-0"
          aria-hidden="true"
        />
        <span className="font-inter text-sm sm:text-[15px] font-semibold text-[#163B32] tracking-tight tabular-nums">
          {message}
        </span>
      </div>

      {expectedCompletionTime && (
        <p className="text-xs sm:text-[13px] font-medium text-[#075C42] tabular-nums">
          Expected completion: {expectedCompletionTime}
        </p>
      )}
    </div>
  );
}
