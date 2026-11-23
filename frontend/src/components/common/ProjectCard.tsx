import React from 'react';
import { ChevronRight, ExternalLink } from 'lucide-react';
import { DevelopmentProject, Language } from '@/types';
import { StatusBadge } from '@/components/StatusBadge';

export interface ProjectCardProps {
  project: DevelopmentProject;
  language: Language;
  onViewDetails?: (project: DevelopmentProject) => void;
}

export function ProjectCard({ project, language, onViewDetails }: ProjectCardProps) {
  const statusVariant =
    project.status === 'completed'
      ? 'success'
      : project.status === 'delayed'
        ? 'danger'
        : 'warning';

  const statusLabel =
    project.status === 'completed'
      ? language === 'bn'
        ? 'সম্পন্ন'
        : 'Completed'
      : project.status === 'delayed'
        ? language === 'bn'
          ? 'বিলম্বিত'
          : 'Delayed'
        : language === 'bn'
          ? 'চলমান'
          : 'On Track';

  const progressBarColor =
    project.status === 'completed'
      ? 'bg-[#006A4E]'
      : project.status === 'delayed'
        ? 'bg-[#C81E1E]'
        : 'bg-emerald-500';

  return (
    <article
      onClick={() => onViewDetails?.(project)}
      className="p-5 sm:p-6 space-y-3 hover:bg-slate-50/80 transition-all cursor-pointer group"
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex-1 min-w-[260px]">
          <div className="flex flex-wrap items-center gap-2 text-xs text-[#4B5563] mb-1.5">
            <span className="font-semibold text-[#006A4E] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              {language === 'bn' ? project.sectorBn : project.sectorEn}
            </span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span className="tabular-nums font-mono text-slate-600">
              {language === 'bn' ? `ওয়ার্ড ${project.wardNumber}` : `Ward ${project.wardNumber}`}
            </span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span className="tabular-nums text-slate-600">
              {language === 'bn' ? 'মেয়াদ:' : 'Deadline:'} {project.deadline}
            </span>
          </div>

          <h3 className="text-base font-bold text-[#111827] group-hover:text-[#006A4E] transition-colors">
            {language === 'bn' ? project.titleBn : project.titleEn}
          </h3>

          <p className="text-xs text-[#4B5563] mt-1">
            <span className="text-slate-500">{language === 'bn' ? 'ঠিকাদার:' : 'Contractor:'}</span>{' '}
            <span className="font-medium text-slate-800">
              {language === 'bn' ? project.contractorBn : project.contractorEn}
            </span>
          </p>
        </div>

        <div className="text-right space-y-1.5 flex-shrink-0">
          <StatusBadge variant={statusVariant} label={statusLabel} />
          <p className="text-sm font-bold text-[#006A4E] tabular-nums font-mono">
            ৳{(project.budgetBdt / 10000000).toFixed(2)} Cr
          </p>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails?.(project);
            }}
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#006A4E] hover:text-[#00523C] hover:underline cursor-pointer pt-0.5"
          >
            <span>{language === 'bn' ? 'বিস্তারিত দেখুন' : 'View Details'}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div>
        <div className="flex justify-between text-xs font-semibold text-[#111827] mb-1">
          <span className="text-slate-600">
            {language === 'bn' ? 'ভৌত বাস্তবায়ন অগ্রগতি' : 'Physical Completion'}
          </span>
          <span className="tabular-nums font-mono font-bold text-[#006A4E]">
            {project.progressPercent}%
          </span>
        </div>
        <div
          className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden"
          role="progressbar"
          aria-valuenow={project.progressPercent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Physical completion ${project.progressPercent}%`}
        >
          <div
            className={`h-full rounded-full transition-all duration-500 ${progressBarColor}`}
            style={{ width: `${project.progressPercent}%` }}
          />
        </div>
      </div>
    </article>
  );
}
