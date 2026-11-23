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

export function ServiceCard({ title, href, icon: Icon }: ServiceCardProps) {
  return (
    <Link
      href={href}
      className="group bg-white rounded-xl border border-slate-200 hover:border-[#006A4E] p-4 flex flex-col items-center justify-center text-center gap-2.5 shadow-2xs hover:shadow-xs transition-colors duration-150 min-h-[128px]"
    >
      <div className="w-10 h-10 rounded-full bg-emerald-50 text-[#006A4E] group-hover:bg-[#006A4E] group-hover:text-white flex items-center justify-center transition-colors duration-150 shrink-0">
        <Icon className="w-5 h-5" strokeWidth={1.75} aria-hidden="true" />
      </div>
      <span className="text-xs sm:text-[13px] font-semibold text-[#111827] group-hover:text-[#006A4E] leading-tight transition-colors duration-150">
        {title}
      </span>
    </Link>
  );
}
