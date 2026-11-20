import React from 'react';
import type { LucideIcon } from 'lucide-react';

export interface CivicInfoCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  meta?: string;
  footer?: React.ReactNode;
}

export function CivicInfoCard({
  icon: Icon,
  title,
  description,
  meta,
  footer,
}: CivicInfoCardProps) {
  return (
    <article className="civic-card bg-white rounded-xl border border-[#E2E8F0] p-6 flex flex-col justify-between gap-4 hover:border-[#006A4E]/60 transition-colors">
      <div className="space-y-3">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-[#ECFDF5] border border-emerald-200/80 text-[#006A4E] flex items-center justify-center shrink-0">
            <Icon className="w-5 h-5" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            {meta && <p className="text-xs font-semibold text-[#006A4E] mb-0.5">{meta}</p>}
            <h3 className="text-base font-bold text-[#111827] leading-snug">{title}</h3>
          </div>
        </div>
        <p className="text-sm text-[#4B5563] leading-relaxed">{description}</p>
      </div>

      {footer && <div className="pt-3 border-t border-slate-100">{footer}</div>}
    </article>
  );
}
