'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import {
  Activity,
  Filter,
  CheckCircle2,
  Clock,
  CreditCard,
  FileText,
  Award,
  AlertTriangle,
  ExternalLink,
} from 'lucide-react';

const ACTIVITIES = [
  {
    id: 'ACT-001',
    category: 'PAYMENT',
    title: { bn: 'হোল্ডিং ট্যাক্স সফলভাবে পরিশোধিত', en: 'Holding Tax Bill Settled' },
    desc: {
      bn: 'হোল্ডিং নং H-10482 এর অনুকূলে ৳২৭,৯২৭ টাকা বিকাশ মারফত আদায় ও রশিদ নং DSCC-RCP-2026-10492 তৈরি হয়েছে।',
      en: '৳27,927 settled for Holding H-10482 via bKash. Receipt DSCC-RCP-2026-10492 issued.',
    },
    reference: 'TXN-2026-891245',
    timestamp: '2026-02-15 10:25 AM',
    href: '/online-payment/receipt?no=DSCC-RCP-2026-10492',
  },
  {
    id: 'ACT-002',
    category: 'APPLICATION',
    title: { bn: 'নতুন হোল্ডিং এসেসমেন্ট আবেদন স্ক্রুটিনি সম্পন্ন', en: 'Holding Assessment Scrutiny Passed' },
    desc: {
      bn: 'আবেদন APP-DSCC-2026-44109 এর প্রাথমিক নথি যাচাই শেষে সহকারী রাজস্ব কর্মকর্তার টেবিলে পর্যালোচনায় রয়েছে।',
      en: 'Application APP-DSCC-2026-44109 initial scrutiny verified. Forwarded to Zonal Assistant Revenue Officer.',
    },
    reference: 'APP-DSCC-2026-44109',
    timestamp: '2026-02-12 02:40 PM',
    href: '/citizen/tracking?id=APP-DSCC-2026-44109',
  },
  {
    id: 'ACT-003',
    category: 'CERTIFICATE',
    title: { bn: 'ডিজিটাল ট্রেড লাইসেন্স নবায়ন সনদ ইস্যু', en: 'Digital Trade License Issued' },
    desc: {
      bn: 'মেসার্স মেঘনা এন্টারপ্রাইজ এর ২০২৫-২০২৬ অর্থবছরের ডিজিটাল সিলযুক্ত লাইসেন্স ডাউনলোড প্রস্তুত।',
      en: 'Digitally verified Trade License for FY 2025-2026 is ready for download with QR seal.',
    },
    reference: 'TRAD/DSCC/019284/2026',
    timestamp: '2026-02-02 03:15 PM',
    href: '/citizen/certificates',
  },
  {
    id: 'ACT-004',
    category: 'COMPLAINT',
    title: { bn: 'সড়ক মেরামত ও গর্ত ভরাট অভিযোগ তদন্ত শুরু', en: 'Pothole Grievance Under Inspection' },
    desc: {
      bn: 'অভিযোগ নং CMP-2026-88412 সংশ্লিষ্ট সিভিল ইঞ্জিনিয়ারিং ডিভিশনে সাইট ইনভেস্টিগেশনে পাঠানো হয়েছে।',
      en: 'Grievance CMP-2026-88412 assigned to Civil Engineering Field Unit for site inspection.',
    },
    reference: 'CMP-2026-88412',
    timestamp: '2026-02-14 11:20 AM',
    href: '/citizen/complaints',
  },
  {
    id: 'ACT-005',
    category: 'CERTIFICATE',
    title: { bn: 'নাগরিকত্ব সনদপত্র কাউন্সিলর অনুমোদন', en: 'Citizenship Certificate Approved' },
    desc: {
      bn: 'ওয়ার্ড ২৭ কাউন্সিলর মহোদয় কর্তৃক নাগরিকত্ব প্রত্যয়নপত্র ডিজিটাল স্বাক্ষর সম্পন্ন হয়েছে।',
      en: 'Citizenship Certificate officially sealed and signed by Ward 27 Councillor.',
    },
    reference: 'CERT-2026-98124',
    timestamp: '2026-01-20 04:30 PM',
    href: '/citizen/certificates',
  },
];

export default function CitizenActivityPage() {
  const { language } = useApp();
  const [filter, setFilter] = useState<string>('ALL');

  const filtered = ACTIVITIES.filter((act) => filter === 'ALL' || act.category === filter);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 mb-2">
            <Activity className="w-3.5 h-3.5 text-[#006A4E]" />
            <span>{language === 'bn' ? 'কার্যক্রম ট্র্যাকার' : 'Activity Audit Trail'}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            {language === 'bn' ? 'আমার নাগরিক কার্যক্রমের পূর্ণাঙ্গ টাইমলাইন' : 'My Complete Activity Timeline'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {language === 'bn'
              ? 'আপনার আবেদন, ফি পরিশোধ, সনদপত্র গ্রহণ ও নাগরিক অভিযোগের সকল অগ্রগতি এখানে কালানুক্রমিকভাবে লিপিবদ্ধ রয়েছে।'
              : 'Chronological timeline of all your applications, verified payments, certificates, and civic reports.'}
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'ALL', label: { bn: 'সকল', en: 'All' } },
            { id: 'APPLICATION', label: { bn: 'আবেদন', en: 'Applications' } },
            { id: 'PAYMENT', label: { bn: 'পেমেন্ট', en: 'Payments' } },
            { id: 'COMPLAINT', label: { bn: 'অভিযোগ', en: 'Complaints' } },
            { id: 'CERTIFICATE', label: { bn: 'সনদ', en: 'Certificates' } },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setFilter(item.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                filter === item.id
                  ? 'bg-[#006A4E] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {item.label[language]}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline List */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="relative pl-7 space-y-8 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
          {filtered.map((act) => (
            <div key={act.id} className="relative group">
              <div
                className={`absolute -left-7 top-1 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-xs shadow-xs ${
                  act.category === 'PAYMENT'
                    ? 'bg-emerald-600 text-white'
                    : act.category === 'CERTIFICATE'
                    ? 'bg-blue-600 text-white'
                    : act.category === 'COMPLAINT'
                    ? 'bg-rose-600 text-white'
                    : 'bg-amber-500 text-white'
                }`}
              >
                <div className="w-2 h-2 rounded-full bg-white" />
              </div>

              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center justify-between text-xs gap-2">
                  <span className="font-mono text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {act.reference}
                  </span>
                  <span className="text-slate-400 font-medium">{act.timestamp}</span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#006A4E] transition-colors">
                  {act.title[language]}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed">{act.desc[language]}</p>

                <div className="pt-1">
                  <Link
                    href={act.href}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#006A4E] hover:underline"
                  >
                    <span>{language === 'bn' ? 'বিস্তারিত রেকর্ড দেখুন' : 'View Verified Record'}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
