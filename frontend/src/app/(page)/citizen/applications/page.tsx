'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import {
  FileText,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  ExternalLink,
  Plus,
} from 'lucide-react';

const APPLICATIONS = [
  {
    id: 'APP-DSCC-2026-44109',
    serviceName: { bn: 'নতুন হোল্ডিং নম্বর বরাদ্দ ও সার্ভে', en: 'New Holding Assessment & Survey' },
    category: { bn: 'হোল্ডিং কর', en: 'Holding Tax' },
    submittedAt: '2026-02-12',
    status: 'UNDER_REVIEW',
    statusLabel: { bn: 'পর্যালোচনাধীন', en: 'Under Review' },
    department: { bn: 'রাজস্ব বিভাগ অঞ্চল ৩', en: 'Revenue Dept Zone 3' },
    fee: '৳৫০০',
  },
  {
    id: 'APP-DSCC-2026-19284',
    serviceName: { bn: 'ট্রেড লাইসেন্স নবায়ন (২০২৫-২৬)', en: 'Trade License Renewal (2025-26)' },
    category: { bn: 'বাণিজ্য লাইসেন্স', en: 'Trade License' },
    submittedAt: '2026-02-02',
    status: 'APPROVED',
    statusLabel: { bn: 'অনুমোদিত ও ইস্যুকৃত', en: 'Approved & Issued' },
    department: { bn: 'বাণিজ্য ও লাইসেন্স শাখা', en: 'Commerce & Licensing' },
    fee: '৳৭,২১০',
  },
  {
    id: 'APP-DSCC-2026-08142',
    serviceName: { bn: 'নাগরিকত্ব সনদপত্র আবেদন', en: 'Citizenship Certificate Request' },
    category: { bn: 'পৌর সনদ', en: 'Civic Certificate' },
    submittedAt: '2026-01-20',
    status: 'COMPLETED',
    statusLabel: { bn: 'সম্পন্ন', en: 'Completed' },
    department: { bn: 'ওয়ার্ড কাউন্সিলর কার্যালয় ২৭', en: 'Ward Councillor 27' },
    fee: '৳১৫০',
  },
];

export default function CitizenApplicationsPage() {
  const { language } = useApp();
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = APPLICATIONS.filter(
    (app) =>
      app.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.serviceName.bn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.serviceName.en.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            {language === 'bn' ? 'আমার জমাকৃত আবেদনসমূহ' : 'My Submitted Applications'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {language === 'bn'
              ? 'সিটি কর্পোরেশনে জমাকৃত আপনার সকল আবেদনের বর্তমান অবস্থা, নোটিশ ও অনুমোদনের তালিকা।'
              : 'Complete tracking list of all civic service applications submitted to the City Corporation.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={language === 'bn' ? 'আইডি বা সেবা খুঁজুন...' : 'Search applications...'}
              className="pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#006A4E]"
            />
          </div>

          <Link
            href="/citizen/applications/new"
            className="px-4 py-2 bg-[#006A4E] hover:bg-[#00523C] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs transition-colors shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>{language === 'bn' ? 'নতুন আবেদন' : 'New Application'}</span>
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
              <tr>
                <th className="px-4 py-3.5">{language === 'bn' ? 'আবেদন আইডি' : 'App ID'}</th>
                <th className="px-4 py-3.5">{language === 'bn' ? 'সেবার নাম' : 'Service Name'}</th>
                <th className="px-4 py-3.5">{language === 'bn' ? 'দাখিলের তারিখ' : 'Date'}</th>
                <th className="px-4 py-3.5">{language === 'bn' ? 'ফি' : 'Fee'}</th>
                <th className="px-4 py-3.5">{language === 'bn' ? 'বর্তমান অবস্থা' : 'Status'}</th>
                <th className="px-4 py-3.5 text-right">{language === 'bn' ? 'ট্র্যাকিং' : 'Action'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filtered.map((app) => (
                <tr key={app.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="px-4 py-3 font-mono font-bold text-slate-900">{app.id}</td>
                  <td className="px-4 py-3">
                    <p className="font-semibold text-slate-900">{app.serviceName[language]}</p>
                    <p className="text-[11px] text-slate-500">{app.department[language]}</p>
                  </td>
                  <td className="px-4 py-3 text-slate-500 whitespace-nowrap">{app.submittedAt}</td>
                  <td className="px-4 py-3 font-mono font-bold text-slate-800">{app.fee}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        app.status === 'APPROVED' || app.status === 'COMPLETED'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}
                    >
                      {app.statusLabel[language]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <Link
                      href={`/citizen/tracking?id=${app.id}`}
                      className="inline-flex items-center gap-1 font-bold text-[#006A4E] hover:underline"
                    >
                      <span>{language === 'bn' ? 'ট্র্যাকিং দেখুন' : 'Track'}</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
