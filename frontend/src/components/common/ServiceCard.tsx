'use client';

import React from 'react';
import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';

export interface ServiceCardProps {
  title: string;
  href: string;
  icon: LucideIcon;
  iconBg: string;
}

export function ServiceCard({ title, href, icon: Icon, iconBg }: ServiceCardProps) {
  return (
    <Link
      href={href}
      className="civic-card group bg-white/95 backdrop-blur-[2px] rounded-2xl border border-[#E2E8F0] hover:border-[#006A4E] p-4 flex flex-col items-center justify-center text-center gap-3 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all min-h-[136px]"
    >
      <div
        className={`w-12 h-12 rounded-full flex items-center justify-center transition-transform group-hover:scale-105 ${iconBg}`}
      >
        <Icon className="w-5 h-5" aria-hidden="true" />
      </div>
      <span className="text-xs sm:text-[13px] font-bold text-[#111827] group-hover:text-[#006A4E] leading-snug">
        {title}
      </span>
    </Link>
  );
}
