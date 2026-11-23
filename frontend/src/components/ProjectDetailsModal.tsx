'use client';

import React, { useEffect } from 'react';
import {
  AlertTriangle,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  FileText,
  MapPin,
  Printer,
  ShieldCheck,
  UserCheck,
  X,
} from 'lucide-react';
import { DevelopmentProject, Language } from '@/types';
import { StatusBadge } from '@/components/StatusBadge';

interface ProjectDetailsModalProps {
  project: DevelopmentProject | null;
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export function ProjectDetailsModal({
  project,
  isOpen,
  onClose,
  language,
}: ProjectDetailsModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !project) return null;

  const totalCrore = (project.budgetBdt / 10000000).toFixed(2);
  const spentCrore = ((project.budgetBdt * (project.progressPercent / 100)) / 10000000).toFixed(2);
  const remainingCrore = (
    (project.budgetBdt * ((100 - project.progressPercent) / 100)) /
    10000000
  ).toFixed(2);

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

  const milestones = [
    {
      titleEn: 'Feasibility, Soil Survey & Engineering Plan',
      titleBn: 'সম্ভাব্যতা যাচাই, মৃত্তিকা পরীক্ষা ও নকশা অনুমোদন',
      completed: true,
      date: '2025-06-15',
    },
    {
      titleEn: 'e-GP Tender & Contract Award',
      titleBn: 'ই-জিপি দরপত্র আহ্বান ও কার্যাদেশ প্রদান',
      completed: true,
      date: '2025-08-20',
    },
    {
      titleEn: 'Foundation & Primary Civil Construction',
      titleBn: 'ভিত্তিপ্রস্তর ও প্রাথমিক সিভিল নির্মাণ কাজ',
      completed: project.progressPercent >= 40,
      current: project.progressPercent < 75 && project.progressPercent >= 40,
      date: '2026-03-10',
    },
    {
      titleEn: 'Drainage & Utility Tie-In / Surface Finishing',
      titleBn: 'ড্রেনেজ ও ইউটিলিটি সংযোগ / উপরিভাগ ফিনিশিং',
      completed: project.progressPercent >= 85,
      current: project.progressPercent >= 75 && project.progressPercent < 100,
      date: '2026-09-30',
    },
    {
      titleEn: 'Third-Party Quality Audit & Handover',
      titleBn: 'তৃতীয় পক্ষ গুণগত মান নিরীক্ষা ও নাগরিক হস্তান্তর',
      completed: project.progressPercent === 100,
      current: false,
      date: project.deadline,
    },
  ];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl max-h-[90vh] bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-slate-200 bg-gradient-to-r from-slate-50 via-white to-emerald-50/40 flex items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-200/80 text-slate-800 font-bold uppercase">
                {project.id}
              </span>
              <span className="text-xs px-2 py-0.5 rounded bg-emerald-100 text-[#006A4E] font-semibold">
                {language === 'bn' ? project.sectorBn : project.sectorEn}
              </span>
              <span className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
                {language === 'bn' ? `ওয়ার্ড ${project.wardNumber}` : `Ward ${project.wardNumber}`}
              </span>
              <StatusBadge variant={statusVariant} label={statusLabel} />
            </div>
            <h2 id="project-modal-title" className="text-lg sm:text-xl font-bold text-[#111827]">
              {language === 'bn' ? project.titleBn : project.titleEn}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Budget & Expenditure Cards */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-[#006A4E]" />
              {language === 'bn' ? 'বাজেট ও আর্থিক অগ্রগতি' : 'Financial Budget & Utilization'}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] text-slate-500 font-medium block">
                  {language === 'bn' ? 'মোট বরাদ্দকৃত বাজেট' : 'Total Budget Allocated'}
                </span>
                <span className="text-lg font-bold text-[#111827] font-mono tabular-nums">
                  ৳{totalCrore} Cr
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  ({project.budgetBdt.toLocaleString()} BDT)
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200">
                <span className="text-[11px] text-emerald-800 font-medium block">
                  {language === 'bn' ? 'পরিশোধিত/ব্যয়িত অর্থ' : 'Disbursed / Spent'}
                </span>
                <span className="text-lg font-bold text-[#006A4E] font-mono tabular-nums">
                  ৳{spentCrore} Cr
                </span>
                <span className="text-[10px] text-emerald-700 block mt-0.5 font-semibold">
                  {project.progressPercent}% {language === 'bn' ? 'অনুমোদিত ভাউচার' : 'Approved Vouchers'}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200">
                <span className="text-[11px] text-amber-800 font-medium block">
                  {language === 'bn' ? 'অবশিষ্ট বাজেট' : 'Remaining Allocation'}
                </span>
                <span className="text-lg font-bold text-amber-900 font-mono tabular-nums">
                  ৳{remainingCrore} Cr
                </span>
                <span className="text-[10px] text-amber-700 block mt-0.5">
                  {100 - project.progressPercent}% {language === 'bn' ? 'সংরক্ষিত' : 'Retained'}
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1 bg-slate-50 p-3 rounded-xl border border-slate-200">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-700">
                  {language === 'bn' ? 'ভৌত বাস্তবায়ন অগ্রগতি' : 'Physical Milestone Execution'}
                </span>
                <span className="text-[#006A4E] font-mono font-bold">
                  {project.progressPercent}%
                </span>
              </div>
              <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    project.status === 'completed'
                      ? 'bg-[#006A4E]'
                      : project.status === 'delayed'
                        ? 'bg-[#C81E1E]'
                        : 'bg-emerald-600'
                  }`}
                  style={{ width: `${project.progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Contractor & Engineering Oversight */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2">
              <h4 className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-[#006A4E]" />
                {language === 'bn' ? 'নিযুক্ত ঠিকাদার প্রতিষ্ঠান' : 'Enlisted Contractor Firm'}
              </h4>
              <p className="text-sm font-semibold text-[#111827]">
                {language === 'bn' ? project.contractorBn : project.contractorEn}
              </p>
              <div className="text-xs text-slate-500 font-mono space-y-0.5">
                <div>
                  <span className="font-semibold text-slate-700">License:</span> DSCC-ENG-
                  {project.wardNumber}26-A
                </div>
                <div>
                  <span className="font-semibold text-slate-700">Tax TIN:</span> 4819-204-9811
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2">
              <h4 className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#006A4E]" />
                {language === 'bn' ? 'ডিএসসিসি তদারকি ও পরিদর্শন' : 'DSCC Engineering Oversight'}
              </h4>
              <div className="text-xs text-slate-700 space-y-1">
                <p>
                  <span className="font-semibold">{language === 'bn' ? 'তত্ত্বাবধায়ক প্রকৌশলী:' : 'Supervising Engineer:'}</span>{' '}
                  Zone {(project.wardNumber % 4) + 1} Civil Works Division
                </p>
                <p>
                  <span className="font-semibold">{language === 'bn' ? 'গুণমান রেটিং:' : 'Quality Audit:'}</span>{' '}
                  <span className="text-emerald-700 font-bold">Grade A+ (Verified by BUET Lab)</span>
                </p>
                <p className="text-slate-500 flex items-center gap-1 pt-0.5">
                  <Calendar className="w-3 h-3 text-[#006A4E]" />
                  <span>
                    {language === 'bn' ? 'চুড়ান্ত সমাপ্তির সময়সীমা:' : 'Target Deadline:'}{' '}
                    <strong className="text-slate-800">{project.deadline}</strong>
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Project Milestones Pipeline */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#006A4E]" />
              {language === 'bn' ? 'প্রকল্প বাস্তবায়ন মাইলফলক' : 'Key Project Milestones'}
            </h3>

            <div className="space-y-2.5">
              {milestones.map((m, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-lg border flex items-center justify-between gap-3 text-xs ${
                    m.completed
                      ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950'
                      : m.current
                        ? 'bg-amber-50/60 border-amber-300 text-amber-950 ring-1 ring-amber-300'
                        : 'bg-slate-50/50 border-slate-200 text-slate-400'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    {m.completed ? (
                      <CheckCircle2 className="w-4 h-4 text-[#006A4E] flex-shrink-0" />
                    ) : m.current ? (
                      <Clock className="w-4 h-4 text-amber-600 flex-shrink-0 animate-pulse" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-slate-300 flex-shrink-0" />
                    )}
                    <span className="font-medium truncate">
                      {language === 'bn' ? m.titleBn : m.titleEn}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0 font-mono text-[11px]">
                    <span className="text-slate-500">{m.date}</span>
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                        m.completed
                          ? 'bg-emerald-100 text-[#006A4E]'
                          : m.current
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {m.completed
                        ? language === 'bn'
                          ? 'সম্পন্ন'
                          : 'Done'
                        : m.current
                          ? language === 'bn'
                            ? 'চলমান'
                            : 'Active'
                          : language === 'bn'
                            ? 'অপেক্ষমাণ'
                            : 'Pending'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? 'প্রকল্প সারসংক্ষেপ প্রিন্ট' : 'Print Fact Sheet'}</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-[#006A4E] hover:bg-[#00523C] text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            {language === 'bn' ? 'বন্ধ করুন' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
}
