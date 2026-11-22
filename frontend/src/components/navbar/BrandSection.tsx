'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useApp } from '@/context/AppContext';

interface BrandSectionProps {
  compact?: boolean;
  onNavigate?: () => void;
}

export function BrandSection({ compact = false, onNavigate }: BrandSectionProps) {
  const { language } = useApp();

  return (
    <Link
      href="/"
      onClick={onNavigate}
      className="group inline-flex items-center shrink-0 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#006A4E]"
      aria-label={
        language === 'bn'
          ? 'ঢাকা সিটি কর্পোরেশন — হোম পেজ'
          : 'Dhaka City Corporation — Home'
      }
    >
      <Image
        src="/images/logo.png"
        alt={
          language === 'bn'
            ? 'ঢাকা সিটি কর্পোরেশন লোগো'
            : 'Dhaka City Corporation Logo'
        }
        width={2172}
        height={724}
        priority
        referrerPolicy="no-referrer"
        className={`w-auto object-contain transition-opacity group-hover:opacity-90 ${
          compact
            ? 'h-14'
            : 'h-14 md:h-[66px] lg:h-[72px] xl:h-[78px] 2xl:h-[82px]'
        }`}
      />
    </Link>
  );
}
