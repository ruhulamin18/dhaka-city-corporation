'use client';

import React from 'react';
import Link from 'next/link';
import {
  ChevronRight,
  Database,
  FileCheck2,
  Home,
  Lock,
  Mail,
  PhoneCall,
  Shield,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function PrivacyPolicyPage() {
  const { language } = useApp();
  const isBn = language === 'bn';

  const policyCards = [
    {
      id: 'collection',
      icon: Database,
      titleBn: '১. তথ্য সংগ্রহ (Information Collected)',
      titleEn: '1. Information Collected',
      descBn:
        'নাগরিক সেবা গ্রহণের সুবিধার্থে কেবল প্রয়োজনীয় ও আবশ্যিক তথ্য (যেমন: নাম, জাতীয় পরিচয়পত্র/এনআইডি নম্বর, মোবাইল নম্বর, ঠিকানা এবং সেবাসংশ্লিষ্ট প্রয়োজনীয় সংযুক্তি) সংগ্রহ করা হয়। অপ্রয়োজনীয় কোনো ব্যক্তিগত তথ্য নেওয়া হয় না।',
      descEn:
        'Only strictly necessary civic information—such as full name, NID number, phone number, holding address, and required document attachments—is collected to facilitate and verify requested municipal services. No unsolicited data is gathered.',
      badgeBn: 'শুধুমাত্র প্রয়োজনীয় নাগরিক তথ্য',
      badgeEn: 'Strictly Minimal Data',
    },
    {
      id: 'usage',
      icon: FileCheck2,
      titleBn: '২. তথ্যের ব্যবহার (How We Use Data)',
      titleEn: '2. How We Use Data',
      descBn:
        'সংগৃহীত তথ্য কেবল নাগরিক আবেদন যাচাই, ডিজিটাল সনদ ও রসিদ প্রদান, হোল্ডিং ট্যাক্স নির্ধারণ এবং জিও-ট্যাগযুক্ত নাগরিক অভিযোগ নিষ্পত্তির কাজে ব্যবহৃত হয়। প্রাতিষ্ঠানিক জবাবদিহিতা নিশ্চিতকরণে প্রতিটি কার্যক্রমের ডিজিটাল লগ সংরক্ষিত থাকে।',
      descEn:
        'Collected data is utilized solely for authenticating citizen applications, issuing official certificates, calculating holding taxes, and resolving geo-tagged civic grievances. Digital audit trails ensure full transparency and accountability.',
      badgeBn: 'পৌর সেবা প্রদান ও সমাধান',
      badgeEn: 'Civic Service Processing',
    },
    {
      id: 'security',
      icon: Lock,
      titleBn: '৩. তথ্য সুরক্ষা ও পেমেন্ট (Data & Payment Security)',
      titleEn: '3. Data & Payment Security',
      descBn:
        'সকল নাগরিক তথ্য সরকারি ডেটাসেন্টারে আধুনিক এনক্রিপশনের মাধ্যমে সংরক্ষিত। অনলাইন ফি পরিশোধের ক্ষেত্রে অনুমোদিত সরকারি পেমেন্ট গেটওয়ের মাধ্যমে শতভাগ সুরক্ষিত লেনদেন নিশ্চিত করা হয়। কোনো বাণিজ্যিক উদ্দেশ্যে নাগরিক তথ্য কারো সাথে শেয়ার করা হয় না।',
      descEn:
        'All data is protected in secure government datacenters using advanced end-to-end encryption. Online payments run through verified, state-regulated gateways. Citizen records are never sold, rented, or shared with third parties for commercial gain.',
      badgeBn: 'এনক্রিপ্টেড ও সুরক্ষিত গেটওয়ে',
      badgeEn: 'Encrypted & Commercial-Free',
    },
    {
      id: 'rights',
      icon: UserCheck,
      titleBn: '৪. নাগরিকের অধিকার (Citizen Rights)',
      titleEn: '4. Citizen Rights',
      descBn:
        'নাগরিক পোর্টাল অ্যাকাউন্টের মাধ্যমে নাগরিকরা যেকোনো সময় তাদের সংরক্ষিত তথ্য দেখতে, হালনাগাদ করতে এবং সত্যায়িত সনদ ও রসিদ ডাউনলোড করতে পারেন। তথ্যে কোনো ত্রুটি থাকলে সরাসরি সংশোধনের আবেদন জানানোর পূর্ণ অধিকার রয়েছে।',
      descEn:
        'Citizens maintain continuous control over their records. Through the Citizen Portal, you can inspect personal information, request corrections, track submissions in real time, and download certified copies of documents and receipts.',
      badgeBn: 'উন্মুক্ত পর্যবেক্ষণ ও নিয়ন্ত্রণ',
      badgeEn: 'Full Citizen Ownership',
    },
  ];

  return (
    <div className="min-h-screen pb-16 bg-[#F8FAFC]">
      {/* Civic Green Institutional Header Banner */}
      <section className="relative overflow-hidden bg-[#006A4E] text-white border-b border-[#00523C]">
        <div
          aria-hidden="true"
          className="civic-bg-layer absolute inset-0 bg-[url('/images/bg2.png')] bg-right-bottom bg-no-repeat bg-cover invert opacity-[0.12] pointer-events-none select-none"
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
          {/* Breadcrumb */}
          <nav
            aria-label={isBn ? 'ব্রেডক্রাম্ব' : 'Breadcrumb'}
            className="flex flex-wrap items-center gap-1.5 text-xs text-emerald-100/90 mb-4"
          >
            <Link
              href="/"
              className="inline-flex items-center gap-1 hover:text-white transition-colors"
            >
              <Home className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{isBn ? 'হোম' : 'Home'}</span>
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-emerald-200/70" aria-hidden="true" />
            <span className="text-white font-semibold" aria-current="page">
              {isBn ? 'তথ্য গোপনীয়তা নীতি' : 'Privacy Policy'}
            </span>
          </nav>

          {/* Page Title & Subtitle */}
          <div className="flex items-start gap-4 max-w-3xl">
            <div className="hidden sm:flex w-12 h-12 rounded-xl bg-white/12 border border-white/20 items-center justify-center shrink-0 mt-1 shadow-xs">
              <ShieldCheck className="w-6 h-6 text-emerald-200" aria-hidden="true" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-md bg-black/20 border border-white/20 px-2.5 py-0.5 text-xs font-semibold text-emerald-100 mb-2">
                <Shield className="w-3.5 h-3.5 text-emerald-300" aria-hidden="true" />
                <span>
                  {isBn
                    ? 'স্মার্ট ঢাকা পৌর ডেটা সুরক্ষা স্ট্যান্ডার্ড'
                    : 'Smart Dhaka Civic Data Protection Standard'}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white drop-shadow-xs">
                {isBn
                  ? 'নাগরিক তথ্য গোপনীয়তা ও সুরক্ষা নীতি'
                  : 'Citizen Data & Privacy Policy'}
              </h1>
              <p className="mt-2 text-sm sm:text-base text-emerald-50/95 leading-relaxed max-w-2xl drop-shadow-2xs">
                {isBn
                  ? 'ঢাকা সিটি কর্পোরেশন প্রতিটি নাগরিকের ব্যক্তিগত ও ডিজিটাল তথ্যের সর্বোচ্চ নিরাপত্তা ও গোপনীয়তা বজায় রাখতে প্রতিশ্রুতিবদ্ধ। আমাদের নীতি সংক্ষিপ্ত ও স্বচ্ছ।'
                  : 'Dhaka City Corporation is committed to the highest standards of data security, civic confidentiality, and transparent governance. Our core principles are clear and simple.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area: 4 Core Scannable Policy Cards */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-[#E2E8F0] pb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {isBn ? 'মূল সুরক্ষানীতির ৪টি মূল স্তম্ভ' : '4 Core Privacy & Protection Pillars'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              {isBn
                ? 'আইনি জটিলতা ছাড়াই সহজে অনুধাবনযোগ্য নাগরিক অধিকার ও নীতিমালা'
                : 'Clear, concise points detailing how your civic information is safeguarded'}
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 self-start sm:self-auto rounded-lg bg-[#ECFDF5] border border-emerald-200 px-3 py-1 text-xs font-semibold text-[#006A4E]">
            <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
            <span>{isBn ? 'শতভাগ বাণিজ্যিক প্রচারণামুক্ত' : '100% Commercial Free'}</span>
          </span>
        </div>

        {/* 4 Concise Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {policyCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.id}
                className="group relative overflow-hidden rounded-xl border border-[#E2E8F0] bg-white p-6 shadow-xs transition-all duration-300 ease-out hover:-translate-y-1 hover:border-[#006A4E] hover:bg-[#ECFDF5]/80 hover:shadow-md flex flex-col justify-between"
              >
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-1 bg-transparent transition-colors duration-300 group-hover:bg-[#006A4E]"
                />

                <div>
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#ECFDF5] text-[#006A4E] transition-all duration-300 group-hover:scale-105 group-hover:bg-[#006A4E] group-hover:text-white shadow-2xs">
                      <Icon className="h-6 w-6" aria-hidden="true" />
                    </div>
                    <span className="rounded-md border border-[#E2E8F0] bg-[#F8FAFC] px-2.5 py-1 text-xs font-medium text-slate-600 group-hover:border-emerald-200 group-hover:bg-white group-hover:text-[#006A4E] transition-colors">
                      {isBn ? card.badgeBn : card.badgeEn}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-slate-900 transition-colors duration-300 group-hover:text-[#006A4E]">
                    {isBn ? card.titleBn : card.titleEn}
                  </h3>

                  <p className="mt-2.5 text-sm leading-relaxed text-slate-600 group-hover:text-slate-700 transition-colors">
                    {isBn ? card.descBn : card.descEn}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-[#E2E8F0]/70 flex items-center justify-between text-xs text-slate-500">
                  <span className="font-semibold text-[#006A4E]">
                    {isBn ? 'স্মার্ট ঢাকা পলিসি' : 'DSCC Verified'}
                  </span>
                  <span>{isBn ? 'সংশোধনযোগ্য ও সুরক্ষিত' : 'Accessible & Protected'}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Contact & Grievance Box */}
        <div className="mt-10 rounded-2xl border border-[#E2E8F0] bg-white p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="max-w-2xl">
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                {isBn
                  ? 'গোপনীয়তা বিষয়ক অনুসন্ধান বা সংশোধন সহায়তা'
                  : 'Privacy Inquiries & Data Support'}
              </h3>
              <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                {isBn
                  ? 'আপনার তথ্যের গোপনীয়তা বা যেকোনো সংশোধন বিষয়ে আমাদের ডেটা সুরক্ষা সেল অথবা সেন্ট্রাল হেল্পডেস্কে যোগাযোগ করুন।'
                  : 'If you have questions regarding personal data protection, audit inquiries, or record amendments, reach out to our civic data desk.'}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <a
                href="tel:16106"
                className="inline-flex items-center gap-2 rounded-xl bg-[#ECFDF5] border border-emerald-200 px-4 py-2.5 text-sm font-bold text-[#006A4E] hover:bg-[#006A4E] hover:text-white transition-colors"
              >
                <PhoneCall className="w-4 h-4" aria-hidden="true" />
                <span>{isBn ? '১৬১০৬ হেল্পলাইন' : '16106 Helpline'}</span>
              </a>

              <a
                href="mailto:privacy@dscc.smartcity.gov.bd"
                className="inline-flex items-center gap-2 rounded-xl bg-[#006A4E] text-white px-4 py-2.5 text-sm font-semibold hover:bg-[#00523C] transition-colors"
              >
                <Mail className="w-4 h-4" aria-hidden="true" />
                <span>privacy@dscc.smartcity.gov.bd</span>
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
