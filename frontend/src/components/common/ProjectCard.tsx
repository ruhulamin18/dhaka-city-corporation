import React from 'react';
import { DevelopmentProject, Language } from '@/types';
import { StatusBadge } from '@/components/StatusBadge';

export interface ProjectCardProps {
  project: DevelopmentProject;
  language: Language;
}

export function ProjectCard({ project, language }: ProjectCardProps) {
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
    <article className="p-6 space-y-3 hover:bg-slate-50/70 transition-colors">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 text-xs text-[#4B5563] mb-1">
            <span className="font-semibold text-[#006A4E]">
              {language === 'bn' ? project.sectorBn : project.sectorEn}
            </span>
            <span aria-hidden="true">·</span>
            <span className="tabular-nums">Ward {project.wardNumber}</span>
            <span aria-hidden="true">·</span>
            <span className="tabular-nums">Deadline: {project.deadline}</span>
          </div>
          <h3 className="text-base font-bold text-[#111827]">
            {language === 'bn' ? project.titleBn : project.titleEn}
          </h3>
          <p className="text-xs text-[#4B5563] mt-0.5">
            Contractor: {language === 'bn' ? project.contractorBn : project.contractorEn}
          </p>
        </div>

        <div className="text-right space-y-1">
          <StatusBadge variant={statusVariant} label={statusLabel} />
          <p className="text-sm font-bold text-[#006A4E] tabular-nums">
            ৳{(project.budgetBdt / 10000000).toFixed(2)} Cr
          </p>
        </div>
      </div>

      <div>
        <div className="flex justify-between text-xs font-semibold text-[#111827] mb-1">
          <span>Physical Completion</span>
          <span className="tabular-nums">{project.progressPercent}%</span>
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
            className={`h-full rounded-full ${progressBarColor}`}
            style={{ width: `${project.progressPercent}%` }}
          />
        </div>
      </div>
    </article>
  );
}
