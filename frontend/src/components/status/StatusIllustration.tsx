'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  AlertTriangle,
  Clock,
  Rocket,
  SearchX,
  WifiOff,
  Wrench,
} from 'lucide-react';
import { StatusIconKey, StatusPageType } from '@/config/status-config';

interface StatusIllustrationProps {
  src: string;
  alt: string;
  statusIcon: StatusIconKey;
  type: StatusPageType;
  compact?: boolean;
}

const FALLBACK_ICON_MAP = {
  clock: Clock,
  rocket: Rocket,
  wrench: Wrench,
  'search-x': SearchX,
  'alert-triangle': AlertTriangle,
  'wifi-off': WifiOff,
} as const;

export function StatusIllustration({
  src,
  alt,
  statusIcon,
  compact = false,
}: StatusIllustrationProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const FallbackIcon = FALLBACK_ICON_MAP[statusIcon];

  if (imageFailed) {
    return (
      <div
        className={`mx-auto flex items-center justify-center rounded-3xl bg-[#E7F4EF] border border-[#087A5B]/15 ${
          compact ? 'w-24 h-24' : 'w-44 h-36 sm:w-52 sm:h-40'
        }`}
        aria-label={alt}
      >
        <div className="w-16 h-16 rounded-2xl bg-white shadow-xs flex items-center justify-center text-[#087A5B]">
          <FallbackIcon className="w-8 h-8" aria-hidden="true" />
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative mx-auto flex items-center justify-center select-none ${
        compact
          ? 'w-44 sm:w-52 aspect-[4/3]'
          : 'w-[250px] sm:w-[310px] md:w-[340px] aspect-[4/3]'
      }`}
    >
      <Image
        src={src}
        alt={alt}
        fill
        priority={!compact}
        sizes={compact ? '(max-width: 640px) 176px, 208px' : '(max-width: 640px) 250px, 340px'}
        referrerPolicy="no-referrer"
        onError={() => setImageFailed(true)}
        className="object-contain mix-blend-multiply"
      />
    </div>
  );
}
