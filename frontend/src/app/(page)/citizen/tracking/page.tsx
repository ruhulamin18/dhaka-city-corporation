'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import {
  SearchCheck,
  Search,
  CheckCircle2,
  Clock,
  Building2,
  Calendar,
  AlertCircle,
  FileText,
  UserCheck,
  Award,
  ArrowRight,
  ShieldCheck,
  Loader2,
} from 'lucide-react';

interface StageInfo {
  step: number;
  label: { bn: string; en: string };
  desc: { bn: string; en: string };
  date?: string;
  isCompleted: boolean;
  isCurrent: boolean;
}

interface TrackingRecord {
  id: string;
  serviceTitle: { bn: string; en: string };
  applicantName: string;
  wardNumber: number;
  submittedAt: string;
  department: { bn: string; en: string };
  currentStatus: string;
  officerName: string;
  officerRemarks: { bn: string; en: string };
  nextAction: { bn: string; en: string };
  stages: StageInfo[];
}

const SAMPLE_TRACKING: Record<string, TrackingRecord> = {
  'APP-DSCC-2026-44109': {
    id: 'APP-DSCC-2026-44109',
    serviceTitle: {
      bn: 'নতুন হোল্ডিং নম্বর বরাদ্দ ও সার্ভে আবেদন',
      en: 'New Holding Assessment & Survey Application',
    },
    applicantName: 'Md. Ruhul Amin',
    wardNumber: 27,
    submittedAt: '2026-02-12 11:30 AM',
    department: { bn: 'রাজস্ব বিভাগ অঞ্চল ৩', en: 'Revenue Department Zone 3' },
    currentStatus: 'UNDER_REVIEW',
    officerName: 'Farhana Yasmin, BCS (Assistant Revenue Officer)',
    officerRemarks: {
      bn: 'দাখিলকৃত দলিল ও খতিয়ান নম্বর যাচাই সম্পন্ন হয়েছে। মাঠ পরিদর্শন ও জিআইএস কোঅর্ডিনেট ম্যাপিং আগামী মঙ্গলবার সম্পন্ন হবে।',
      en: 'Deed and assessment registry verified. On-site field survey and GIS coordinate validation scheduled for Tuesday.',
    },
    nextAction: {
      bn: 'মাঠ পরিদর্শনের সময় ভবনের অনুমোদিত নকশা প্রস্তুত রাখুন।',
      en: 'Please keep approved architectural drawings available during site inspection.',
    },
    stages: [
      {
        step: 1,
        label: { bn: 'আবেদন দাখিল', en: 'Submitted' },
        desc: { bn: 'নাগরিক পোর্টাল থেকে আবেদন সফলভাবে দাখিল হয়েছে', en: 'Online application successfully logged' },
        date: '2026-02-12 11:30 AM',
        isCompleted: true,
        isCurrent: false,
      },
      {
        step: 2,
        label: { bn: 'প্রাথমিক স্ক্রুটিনি ও নথি যাচাই', en: 'Initial Verification' },
        desc: { bn: 'জাতীয় পরিচয়পত্র ও জমি মালিকানার দলিল সত্যায়িত', en: 'NID and property ownership documents verified' },
        date: '2026-02-13 03:15 PM',
        isCompleted: true,
        isCurrent: false,
      },
      {
        step: 3,
        label: { bn: 'বিভাগীয় পর্যালোচনা ও সার্ভে', en: 'Under Review & Survey' },
        desc: { bn: 'সহকারী রাজস্ব কর্মকর্তা দ্বারা মাঠ পর্যালোচনা চলমান', en: 'Site survey inspection currently in progress' },
        date: '2026-02-14 10:00 AM',
        isCompleted: false,
        isCurrent: true,
      },
      {
        step: 4,
        label: { bn: 'চূড়ান্ত মূল্যায়ন ও কর নির্ধারণ', en: 'Valuation & Assessment' },
        desc: { bn: 'পৌর কর নির্ধারণ কমিটির চূড়ান্ত অনুমোদন', en: 'Official municipal assessment committee approval' },
        isCompleted: false,
        isCurrent: false,
      },
      {
        step: 5,
        label: { bn: 'হোল্ডিং সার্টিফিকেট ইস্যু', en: 'Certificate Issued' },
        desc: { bn: 'ডিজিটাল হোল্ডিং বরাদ্দ সনদ প্রস্তুত', en: 'Digital holding assessment certificate generated' },
        isCompleted: false,
        isCurrent: false,
      },
    ],
  },
  'APP-DSCC-2026-19284': {
    id: 'APP-DSCC-2026-19284',
    serviceTitle: {
      bn: 'ট্রেড লাইসেন্স নবায়ন (২০২৫-২৬)',
      en: 'Trade License Renewal (2025-26)',
    },
    applicantName: 'Md. Ruhul Amin (M/S Meghna Enterprise)',
    wardNumber: 21,
    submittedAt: '2026-02-02 02:10 PM',
    department: { bn: 'বাণিজ্য ও লাইসেন্স শাখা', en: 'Commerce & Trade Licensing' },
    currentStatus: 'COMPLETED',
    officerName: 'Chief Revenue Officer Secretariat',
    officerRemarks: {
      bn: 'লাইসেন্স নবায়ন ফি ও সাইনবোর্ড কর পরিশোধ নিশ্চিত হয়েছে। কিউআর কোডসহ ডিজিটাল ই-লাইসেন্স ইস্যু সম্পন্ন।',
      en: 'All fees and signboard taxes verified. Electronic Trade License with QR seal successfully issued.',
    },
    nextAction: {
      bn: 'আমার সনদসমূহ মেন্যু হতে লাইসেন্স পিডিএফ ডাউনলোড করুন।',
      en: 'Download your official Trade License PDF from My Certificates section.',
    },
    stages: [
      {
        step: 1,
        label: { bn: 'আবেদন দাখিল', en: 'Submitted' },
        desc: { bn: 'নবায়ন ফরম দাখিল সম্পন্ন', en: 'Renewal request submitted' },
        date: '2026-02-02 02:10 PM',
        isCompleted: true,
        isCurrent: false,
      },
      {
        step: 2,
        label: { bn: 'ফি ও কর পরিশোধ যাচাই', en: 'Fee Realization' },
        desc: { bn: 'সরকারি ট্রেজারিতে অর্থ জমা নিশ্চিত হয়েছে', en: 'Funds captured in treasury' },
        date: '2026-02-02 02:14 PM',
        isCompleted: true,
        isCurrent: false,
      },
      {
        step: 3,
        label: { bn: 'ডিজিটাল লাইসেন্স প্রস্তুত ও ইস্যু', en: 'Issued & Completed' },
        desc: { bn: 'ইলেকট্রনিক সিগনেচার সিলমোহরযুক্ত সনদ ইস্যু', en: 'Digitally sealed license generated' },
        date: '2026-02-02 03:15 PM',
        isCompleted: true,
        isCurrent: true,
      },
    ],
  },
};

function TrackingContent() {
  const { language } = useApp();
  const searchParams = useSearchParams();

  const [queryId, setQueryId] = useState(
    searchParams.get('id') || 'APP-DSCC-2026-44109'
  );
  const [activeRecord, setActiveRecord] = useState<TrackingRecord | null>(
    SAMPLE_TRACKING[searchParams.get('id') || 'APP-DSCC-2026-44109'] || SAMPLE_TRACKING['APP-DSCC-2026-44109']
  );
  const [notFoundError, setNotFoundError] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = queryId.trim();
    if (!clean) return;

    if (SAMPLE_TRACKING[clean]) {
      setActiveRecord(SAMPLE_TRACKING[clean]);
      setNotFoundError(false);
    } else {
      // Dynamic fallback for any query ID
      setActiveRecord({
        id: clean,
        serviceTitle: { bn: 'নাগরিক সেবা আবেদন', en: 'Civic Service Application' },
        applicantName: 'Md. Ruhul Amin',
        wardNumber: 27,
        submittedAt: '2026-02-10 10:00 AM',
        department: { bn: 'সংশ্লিষ্ট অঞ্চল ও জোনাল অফিস', en: 'Zonal Administration' },
        currentStatus: 'UNDER_REVIEW',
        officerName: 'Zonal Inspection Desk',
        officerRemarks: {
          bn: 'আবেদনটি ডাটাবেজে নথিভুক্ত রয়েছে। কর্মকর্তা পর্যায়ে যাচাই কার্যক্রম চলছে।',
          en: 'Application registered in database. Departmental review in progress.',
        },
        nextAction: {
          bn: 'যথাযথ সময়ে এসএমএসের মাধ্যমে অগ্রগতির তথ্য জানানো হবে।',
          en: 'Status updates will be communicated via SMS.',
        },
        stages: [
          {
            step: 1,
            label: { bn: 'আবেদন দাখিল', en: 'Submitted' },
            desc: { bn: 'অনলাইন পোর্টালে গৃহীত', en: 'Received in portal' },
            date: '2026-02-10',
            isCompleted: true,
            isCurrent: false,
          },
          {
            step: 2,
            label: { bn: 'বিভাগীয় পর্যালোচনা', en: 'Departmental Review' },
            desc: { bn: 'পর্যালোচনা চলমান', en: 'Under active review' },
            date: '2026-02-11',
            isCompleted: false,
            isCurrent: true,
          },
          {
            step: 3,
            label: { bn: 'চূড়ান্ত নিষ্পত্তি', en: 'Completion' },
            desc: { bn: 'অনুমোদন ও সনদ প্রদান', en: 'Approval & dispatch' },
            isCompleted: false,
            isCurrent: false,
          },
        ],
      });
      setNotFoundError(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Search Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
        <div className="text-center space-y-1">
          <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center mx-auto mb-2">
            <SearchCheck className="w-6 h-6" />
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            {language === 'bn' ? 'আবেদনের লাইভ অবস্থা ও ট্র্যাকিং' : 'Real-time Application Workflow Tracking'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            {language === 'bn'
              ? 'আপনার আবেদন আইডি দিয়ে সিটি কর্পোরেশনের সংশ্লিষ্ট টেবিলে ফাইলের বর্তমান অগ্রগতি দেখুন।'
              : 'Enter your application tracking reference to monitor departmental progress stages.'}
          </p>
        </div>

        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto pt-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={queryId}
              onChange={(e) => setQueryId(e.target.value)}
              placeholder="APP-DSCC-2026-XXXXX"
              className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[#006A4E]"
              required
            />
          </div>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-[#006A4E] hover:bg-[#00523C] text-white text-xs font-bold shadow-md cursor-pointer transition-colors shrink-0"
          >
            {language === 'bn' ? 'ট্র্যাক করুন' : 'Track Status'}
          </button>
        </form>

        <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500 pt-1">
          <span>{language === 'bn' ? 'নমুনা আইডি:' : 'Sample IDs:'}</span>
          <button
            type="button"
            onClick={() => {
              setQueryId('APP-DSCC-2026-44109');
              setActiveRecord(SAMPLE_TRACKING['APP-DSCC-2026-44109']);
            }}
            className="font-mono text-[#006A4E] underline"
          >
            APP-DSCC-2026-44109 (হোল্ডিং সার্ভে)
          </button>
          <span>•</span>
          <button
            type="button"
            onClick={() => {
              setQueryId('APP-DSCC-2026-19284');
              setActiveRecord(SAMPLE_TRACKING['APP-DSCC-2026-19284']);
            }}
            className="font-mono text-[#006A4E] underline"
          >
            APP-DSCC-2026-19284 (ট্রেড লাইসেন্স)
          </button>
        </div>
      </div>

      {/* Tracking Details & Stages */}
      {activeRecord && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-8 animate-in fade-in duration-200">
          {/* Metadata Card */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <div>
              <span className="text-slate-400 block mb-0.5">{language === 'bn' ? 'আবেদন নম্বর' : 'Application Ref'}</span>
              <span className="font-mono font-bold text-slate-900">{activeRecord.id}</span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">{language === 'bn' ? 'সেবার নাম' : 'Service Name'}</span>
              <span className="font-semibold text-slate-800">{activeRecord.serviceTitle[language]}</span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">{language === 'bn' ? 'দাখিলের তারিখ' : 'Submitted At'}</span>
              <span className="font-medium text-slate-700">{activeRecord.submittedAt}</span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">{language === 'bn' ? 'দায়িত্বপ্রাপ্ত বিভাগ' : 'Department'}</span>
              <span className="font-bold text-emerald-800">{activeRecord.department[language]}</span>
            </div>
          </div>

          {/* Workflow Stepper */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900">
              {language === 'bn' ? 'কর্মপরিকল্পনা ও ধাপসমূহ' : 'Workflow Stages & Timeline'}
            </h3>

            <div className="relative pl-7 space-y-6 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {activeRecord.stages.map((stg) => (
                <div key={stg.step} className="relative">
                  <div
                    className={`absolute -left-7 top-1 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold shadow-xs ${
                      stg.isCompleted
                        ? 'bg-emerald-600 text-white'
                        : stg.isCurrent
                        ? 'bg-amber-500 text-white animate-pulse'
                        : 'bg-slate-300 text-slate-600'
                    }`}
                  >
                    {stg.isCompleted ? <CheckCircle2 className="w-3.5 h-3.5" /> : stg.step}
                  </div>

                  <div className="space-y-0.5">
                    <div className="flex items-center justify-between text-xs">
                      <h4
                        className={`font-bold ${
                          stg.isCurrent
                            ? 'text-amber-800 font-extrabold'
                            : stg.isCompleted
                            ? 'text-slate-900'
                            : 'text-slate-400'
                        }`}
                      >
                        {stg.label[language]}
                      </h4>
                      {stg.date && <span className="text-[11px] text-slate-400 font-mono">{stg.date}</span>}
                    </div>
                    <p className="text-xs text-slate-500">{stg.desc[language]}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Officer Comments & Next Action Box */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-100 text-xs">
            <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200 space-y-1.5">
              <span className="font-bold text-[#006A4E] block">
                {language === 'bn' ? 'কর্মকর্তার মন্তব্য ও আপডেট' : 'Officer Remarks'}
              </span>
              <p className="text-slate-700 leading-relaxed">{activeRecord.officerRemarks[language]}</p>
              <p className="text-[10px] text-slate-400 pt-1">
                {language === 'bn' ? 'স্বাক্ষরকারী: ' : 'Signed by: '}
                <span className="font-semibold text-slate-700">{activeRecord.officerName}</span>
              </p>
            </div>

            <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200 space-y-1.5">
              <span className="font-bold text-amber-900 block">
                {language === 'bn' ? 'নাগরিকের করণীয় পরবর্তী ধাপ' : 'Required Citizen Next Action'}
              </span>
              <p className="text-amber-900 leading-relaxed">{activeRecord.nextAction[language]}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TrackingPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-emerald-600" /></div>}>
      <TrackingContent />
    </Suspense>
  );
}
