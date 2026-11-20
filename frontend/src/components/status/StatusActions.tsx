'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Headphones,
  Home,
  LayoutGrid,
  Loader2,
  RefreshCw,
  Wifi,
} from 'lucide-react';
import { ActionIconKey, StatusActionConfig } from '@/config/status-config';

interface StatusActionsProps {
  primaryAction: StatusActionConfig;
  secondaryAction: StatusActionConfig;
  onRetry?: () => void | Promise<void>;
  compact?: boolean;
}

const ACTION_ICON_MAP: Record<ActionIconKey, React.ComponentType<{ className?: string }>> = {
  home: Home,
  headphones: Headphones,
  grid: LayoutGrid,
  refresh: RefreshCw,
  wifi: Wifi,
};

export function StatusActions({
  primaryAction,
  secondaryAction,
  onRetry,
  compact = false,
}: StatusActionsProps) {
  const router = useRouter();
  const [retrying, setRetrying] = useState(false);
  const [retryFeedback, setRetryFeedback] = useState<string | null>(null);

  const handleInteractiveAction = async (action: StatusActionConfig) => {
    if (retrying) return;
    setRetrying(true);
    setRetryFeedback(null);

    try {
      if (onRetry) {
        await onRetry();
        return;
      }

      if (action.type === 'retry-connection') {
        if (typeof navigator !== 'undefined' && !navigator.onLine) {
          setRetryFeedback(
            'ইন্টারনেট সংযোগ এখনো বিচ্ছিন্ন রয়েছে। অনুগ্রহ করে সংযোগ চালু করে আবার চেষ্টা করুন।'
          );
          return;
        }
        try {
          const response = await fetch('/', { method: 'HEAD', cache: 'no-store' });
          if (response.ok) {
            router.refresh();
            return;
          }
          setRetryFeedback(
            'সার্ভারের সাথে পুনরায় সংযোগ স্থাপন করা যায়নি। অনুগ্রহ করে কিছুক্ষণ পর চেষ্টা করুন।'
          );
        } catch {
          setRetryFeedback(
            'নেটওয়ার্ক সংযোগ পাওয়া যায়নি। আপনার ইন্টারনেট সংযোগ পরীক্ষা করুন।'
          );
        }
        return;
      }

      router.refresh();
    } finally {
      setRetrying(false);
    }
  };

  const renderAction = (action: StatusActionConfig) => {
    const Icon = ACTION_ICON_MAP[action.icon];
    const isPrimary = action.variant === 'primary';
    const isInteractive = action.type === 'retry' || action.type === 'retry-connection';

    const baseClasses = `inline-flex items-center justify-center gap-2.5 rounded-xl font-inter text-sm sm:text-[15px] font-semibold whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#087A5B] ${
      compact
        ? 'px-5 py-2.5 min-w-[164px]'
        : 'w-full sm:w-auto sm:min-w-[200px] px-6 py-3'
    } ${
      isPrimary
        ? 'bg-[#087A5B] hover:bg-[#075C42] text-white border border-[#087A5B] shadow-xs'
        : 'bg-white hover:bg-[#E7F4EF] text-[#087A5B] border border-[#087A5B]'
    }`;

    if (isInteractive) {
      return (
        <button
          key={action.id}
          type="button"
          onClick={() => handleInteractiveAction(action)}
          disabled={retrying}
          className={`${baseClasses} cursor-pointer disabled:opacity-70`}
        >
          {retrying ? (
            <Loader2 className="w-4 h-4 animate-spin shrink-0" aria-hidden="true" />
          ) : (
            <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
          )}
          <span>{retrying ? 'Retrying...' : action.label}</span>
        </button>
      );
    }

    return (
      <Link key={action.id} href={action.href ?? '/'} className={baseClasses}>
        <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
        <span>{action.label}</span>
      </Link>
    );
  };

  return (
    <div className="w-full flex flex-col items-center gap-3">
      <div className="w-full sm:w-auto flex flex-col sm:flex-row items-center justify-center gap-3.5">
        {renderAction(primaryAction)}
        {renderAction(secondaryAction)}
      </div>

      {retryFeedback && (
        <p
          role="alert"
          className="font-bengali text-xs sm:text-sm text-[#C81E1E] font-medium text-center max-w-md"
        >
          {retryFeedback}
        </p>
      )}
    </div>
  );
}
