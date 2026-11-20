'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  FilePlus2,
  SearchCheck,
  CreditCard,
  AlertTriangle,
  ArrowRight,
  Activity,
  ShieldCheck,
  Calendar,
  Building2,
  ExternalLink,
} from 'lucide-react';

export default function CitizenDashboardPage() {
  const { language } = useApp();
  const { user } = useAuth();

  const citizenName = user?.nameEn || 'Md. Ruhul Amin';
  const citizenWard = user?.wardNumber || 27;

  // Realistic Pre-seeded Applications for Citizen Workspace
  const [recentApplications] = useState([
    {
      id: 'APP-DSCC-2026-44109',
      serviceName: { bn: 'নতুন হোল্ডিং নম্বর বরাদ্দ ও সার্ভে', en: 'New Holding Assessment & Survey' },
      category: { bn: 'হোল্ডিং কর', en: 'Holding Tax' },
      submittedAt: '2026-02-12',
      status: 'UNDER_REVIEW',
      statusLabel: { bn: 'পর্যালোচনাধীন', en: 'Under Review' },
      department: { bn: 'রাজস্ব বিভাগ অঞ্চল ৩', en: 'Revenue Dept Zone 3' },
    },
    {
      id: 'APP-DSCC-2026-19284',
      serviceName: { bn: 'ট্রেড লাইসেন্স নবায়ন (২০২৫-২৬)', en: 'Trade License Renewal (2025-26)' },
      category: { bn: 'বাণিজ্য লাইসেন্স', en: 'Trade License' },
      submittedAt: '2026-02-02',
      status: 'APPROVED',
      statusLabel: { bn: 'অনুমোদিত ও ইস্যুকৃত', en: 'Approved & Issued' },
      department: { bn: 'বাণিজ্য ও লাইসেন্স শাখা', en: 'Commerce & Licensing' },
    },
    {
      id: 'APP-DSCC-2026-08142',
      serviceName: { bn: 'নাগরিকত্ব সনদপত্র আবেদন', en: 'Citizenship Certificate Request' },
      category: { bn: 'পৌর সনদ', en: 'Civic Certificate' },
      submittedAt: '2026-01-20',
      status: 'COMPLETED',
      statusLabel: { bn: 'সম্পন্ন', en: 'Completed' },
      department: { bn: 'ওয়ার্ড কাউন্সিলর কার্যালয় ২৭', en: 'Ward Councillor 27' },
    },
    {
      id: 'APP-DSCC-2025-99214',
      serviceName: { bn: 'সড়ক বাতি মেরামত ও এলইডি পুনঃস্থাপন', en: 'Streetlight Repair & LED Fix' },
      category: { bn: 'নাগরিক অভিযোগ', en: 'Civic Complaint' },
      submittedAt: '2025-12-18',
      status: 'RESOLVED',
      statusLabel: { bn: 'সমাধানকৃত', en: 'Resolved' },
      department: { bn: 'বিদ্যুৎ ও আলোকায়ন বিভাগ', en: 'Electrical & Lighting' },
    },
  ]);

  // Chronological Activity Timeline
  const [activities] = useState([
    {
      id: 'ACT-01',
      title: { bn: 'হোল্ডিং ট্যাক্স বিল পরিশোধ সম্পন্ন', en: 'Holding Tax Payment Completed' },
      desc: {
        bn: 'হোল্ডিং H-10482 এর জন্য ৳২৭,৯২৭ টাকা বিকাশ গেটওয়ের মাধ্যমে পরিশোধিত হয়েছে।',
        en: '৳27,927 settled for Holding H-10482 via bKash gateway.',
      },
      ref: 'TXN-2026-891245',
      timestamp: '2026-02-15 10:25 AM',
      type: 'PAYMENT',
      href: '/online-payment/receipt?no=DSCC-RCP-2026-10492',
    },
    {
      id: 'ACT-02',
      title: { bn: 'নতুন হোল্ডিং এসেসমেন্ট আবেদন গৃহীত', en: 'Application Received & Under Review' },
      desc: {
        bn: 'আবেদন নং APP-DSCC-2026-44109 এর প্রাথমিক স্ক্রুটিনি সম্পন্ন হয়ে অঞ্চল ৩ এ পাঠানো হয়েছে।',
        en: 'Application APP-DSCC-2026-44109 passed scrutiny and assigned to Zone 3.',
      },
      ref: 'APP-DSCC-2026-44109',
      timestamp: '2026-02-12 02:40 PM',
      type: 'APPLICATION',
      href: '/citizen/tracking?id=APP-DSCC-2026-44109',
    },
    {
      id: 'ACT-03',
      title: { bn: 'ট্রেড লাইসেন্স ই-সনদপত্র ইস্যু সম্পন্ন', en: 'Digital Trade License Issued' },
      desc: {
        bn: 'মেসার্স মেঘনা এন্টারপ্রাইজ এর ডিজিটাল নবায়ন সনদ কিউআর কোডসহ ডাউনলোডযোগ্য।',
        en: 'M/S Meghna Enterprise digital license is ready with verifiable QR.',
      },
      ref: 'TRAD/DSCC/019284/2026',
      timestamp: '2026-02-02 03:15 PM',
      type: 'CERTIFICATE',
      href: '/citizen/certificates',
    },
    {
      id: 'ACT-04',
      title: { bn: 'সড়ক বাতি মেরামত অভিযোগ নিষ্পত্তি', en: 'Civic Complaint Resolved' },
      desc: {
        bn: 'রোড নং ১২/এ সংলগ্ন অকেজো সড়কবাতি মেরামতপূর্বক কার্যকারিতা নিশ্চিত করা হয়েছে।',
        en: 'Defective streetlight on Road 12/A successfully replaced and operational.',
      },
      ref: 'CMP-2025-99214',
      timestamp: '2025-12-20 11:10 AM',
      type: 'COMPLAINT',
      href: '/citizen/complaints',
    },
  ]);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white rounded-2xl p-6 sm:p-8 shadow-md relative overflow-hidden border border-emerald-700/50">
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/25 border border-emerald-400/30 text-emerald-100 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
              <span>{language === 'bn' ? 'যাচাইকৃত জাতীয় পরিচয়পত্র প্রোফাইল' : 'Verified Resident Profile'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {language === 'bn' ? `স্বাগতম, ${citizenName}` : `Welcome, ${citizenName}`}
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/90 max-w-2xl">
              {language === 'bn'
                ? `ঢাকা দক্ষিণ সিটি কর্পোরেশন · ওয়ার্ড নং ${citizenWard} (ধানমন্ডি অঞ্চল) · আপনার নাগরিক সেবা ও আবেদনসমূহ এক জায়গা থেকে পরিচালনা করুন।`
                : `Dhaka City Corporation · Ward No ${citizenWard} (Dhanmondi Zone) · Manage your civic services, dues, and requests.`}
            </p>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto">
            <Link
              href="/citizen/profile"
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-xl border border-white/20 transition-colors"
            >
              {language === 'bn' ? 'প্রোফাইল দেখুন' : 'View Profile'}
            </Link>
            <Link
              href="/citizen/applications/new"
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold rounded-xl transition-colors shadow-sm"
            >
              {language === 'bn' ? 'নতুন সেবা আবেদন' : 'Apply for Service'}
            </Link>
          </div>
        </div>
      </div>

      {/* Compact Overview KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#006A4E] flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">
              {language === 'bn' ? 'মোট আবেদন' : 'Total Applications'}
            </p>
            <p className="text-xl font-extrabold text-slate-900 font-mono">৪ টি</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">
              {language === 'bn' ? 'পর্যালোচনাধীন' : 'Under Review'}
            </p>
            <p className="text-xl font-extrabold text-amber-800 font-mono">১ টি</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">
              {language === 'bn' ? 'অনুমোদিত / সম্পন্ন' : 'Approved / Issued'}
            </p>
            <p className="text-xl font-extrabold text-blue-800 font-mono">৩ টি</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">
              {language === 'bn' ? 'বকেয়া বিল' : 'Unpaid Dues'}
            </p>
            <p className="text-xl font-extrabold text-emerald-700 font-mono">৳০ (পরিশোধিত)</p>
          </div>
        </div>
      </div>

      {/* Quick Action Shortcuts */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-900">
          {language === 'bn' ? 'জরুরি নাগরিক সেবা শর্টকাট' : 'Quick Civic Actions'}
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Link
            href="/citizen/applications/new"
            className="p-4 rounded-xl bg-white border border-slate-200 hover:border-emerald-500 hover:shadow-sm transition-all group flex flex-col justify-between"
          >
            <div className="w-9 h-9 rounded-lg bg-emerald-100 text-[#006A4E] flex items-center justify-center mb-3">
              <FilePlus2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 group-hover:text-[#006A4E] transition-colors">
                {language === 'bn' ? 'সেবা আবেদন' : 'Apply for Service'}
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {language === 'bn' ? '৩১টি সরকারি নাগরিক সেবা' : '31 official civic services'}
              </p>
            </div>
          </Link>

          <Link
            href="/citizen/tracking"
            className="p-4 rounded-xl bg-white border border-slate-200 hover:border-blue-500 hover:shadow-sm transition-all group flex flex-col justify-between"
          >
            <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center mb-3">
              <SearchCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                {language === 'bn' ? 'আবেদন ট্র্যাকিং' : 'Track Application'}
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {language === 'bn' ? 'লাইভ অগ্রগতি নিরীক্ষণ' : 'Real-time workflow stages'}
              </p>
            </div>
          </Link>

          <Link
            href="/online-payment"
            className="p-4 rounded-xl bg-white border border-slate-200 hover:border-teal-500 hover:shadow-sm transition-all group flex flex-col justify-between"
          >
            <div className="w-9 h-9 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center mb-3">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                {language === 'bn' ? 'ট্যাক্স ও ফি পরিশোধ' : 'Pay Tax & Fees'}
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {language === 'bn' ? '১০% সরকারি রিবেট সুবিধা' : 'Instant digital receipt'}
              </p>
            </div>
          </Link>

          <Link
            href="/citizen/complaints"
            className="p-4 rounded-xl bg-white border border-slate-200 hover:border-rose-500 hover:shadow-sm transition-all group flex flex-col justify-between"
          >
            <div className="w-9 h-9 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center mb-3">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 group-hover:text-rose-700 transition-colors">
                {language === 'bn' ? 'নাগরিক অভিযোগ' : 'Report Civic Issue'}
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {language === 'bn' ? 'ছবি ও জিপিএস লোকেশনসহ' : 'With photo & GPS location'}
              </p>
            </div>
          </Link>
        </div>
      </div>

      {/* Main Grid: Recent Applications & My Activity Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Applications Table */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#006A4E]" />
                <span>{language === 'bn' ? 'সাম্প্রতিক আবেদনসমূহ' : 'Recent Civic Applications'}</span>
              </h3>
            </div>
            <Link
              href="/citizen/applications"
              className="text-xs font-bold text-[#006A4E] hover:underline flex items-center gap-1"
            >
              <span>{language === 'bn' ? 'সকল আবেদন' : 'View All'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                <tr>
                  <th className="px-3 py-2.5">{language === 'bn' ? 'আবেদন আইডি' : 'App ID'}</th>
                  <th className="px-3 py-2.5">{language === 'bn' ? 'সেবার বিবরণ' : 'Service'}</th>
                  <th className="px-3 py-2.5">{language === 'bn' ? 'তারিখ' : 'Date'}</th>
                  <th className="px-3 py-2.5">{language === 'bn' ? 'স্ট্যাটাস' : 'Status'}</th>
                  <th className="px-3 py-2.5 text-right">{language === 'bn' ? 'কার্যক্রম' : 'Action'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {recentApplications.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-3 py-3 font-mono font-bold text-slate-900">{app.id}</td>
                    <td className="px-3 py-3">
                      <p className="font-semibold text-slate-900 leading-snug">
                        {app.serviceName[language]}
                      </p>
                      <p className="text-[11px] text-slate-500">{app.department[language]}</p>
                    </td>
                    <td className="px-3 py-3 text-slate-500 whitespace-nowrap">{app.submittedAt}</td>
                    <td className="px-3 py-3 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          app.status === 'APPROVED' || app.status === 'COMPLETED' || app.status === 'RESOLVED'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : 'bg-amber-50 text-amber-800 border border-amber-200'
                        }`}
                      >
                        {app.statusLabel[language]}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-right whitespace-nowrap">
                      <Link
                        href={`/citizen/tracking?id=${app.id}`}
                        className="text-[#006A4E] hover:underline font-semibold"
                      >
                        {language === 'bn' ? 'ট্র্যাকিং' : 'Track'}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* My Activity Chronological Timeline */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
              <Activity className="w-4 h-4 text-[#006A4E]" />
              <span>{language === 'bn' ? 'আমার কার্যক্রম (টাইমলাইন)' : 'My Activity Timeline'}</span>
            </div>
            <Link
              href="/citizen/activity"
              className="text-xs font-bold text-[#006A4E] hover:underline flex items-center gap-1"
            >
              <span>{language === 'bn' ? 'সম্পূর্ণ লগ' : 'Full Log'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
            {activities.map((act) => (
              <div key={act.id} className="relative group">
                <div
                  className={`absolute -left-6 top-1 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center text-[10px] shadow-xs ${
                    act.type === 'PAYMENT'
                      ? 'bg-emerald-600 text-white'
                      : act.type === 'CERTIFICATE'
                      ? 'bg-blue-600 text-white'
                      : act.type === 'COMPLAINT'
                      ? 'bg-rose-600 text-white'
                      : 'bg-amber-500 text-white'
                  }`}
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span className="font-mono text-emerald-800 font-semibold">{act.ref}</span>
                    <span>{act.timestamp}</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-[#006A4E] transition-colors">
                    {act.title[language]}
                  </h4>
                  <p className="text-[11px] text-slate-600 leading-relaxed">{act.desc[language]}</p>
                  <Link
                    href={act.href}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#006A4E] hover:underline pt-0.5"
                  >
                    <span>{language === 'bn' ? 'বিস্তারিত দেখুন' : 'View Details'}</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
