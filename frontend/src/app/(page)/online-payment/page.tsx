'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { PaymentLayout } from '@/components/payments/PaymentLayout';
import {
  Building2,
  FileText,
  Award,
  Layers,
  History,
  Download,
  ShieldCheck,
  Search,
  CheckCircle2,
  CreditCard,
  Lock,
  ArrowRight,
  TrendingUp,
  HelpCircle,
  Clock,
  Sparkles,
} from 'lucide-react';

const SERVICE_CARDS = [
  {
    href: '/online-payment/holding-tax',
    icon: Building2,
    title: { bn: 'হোল্ডিং ট্যাক্স পরিশোধ', en: 'Holding Tax Payment' },
    desc: {
      bn: 'আবাসিক ও বাণিজ্যিক হোল্ডিং কর অনুসন্ধান, বকেয়া বিল নিরীক্ষণ এবং ১০% রিবেটসহ অনলাইন পরিশোধ।',
      en: 'Search residential/commercial property tax, inspect arrears, and pay online with 10% rebate.',
    },
    badge: { bn: '১০% রিবেট সুবিধা', en: '10% Early Rebate' },
  },
  {
    href: '/online-payment/trade-license',
    icon: FileText,
    title: { bn: 'ট্রেড লাইসেন্স ফি', en: 'Trade License Fee' },
    desc: {
      bn: 'ব্যবসা প্রতিষ্ঠানের নতুন ট্রেড লাইসেন্স ও নবায়ন ফি, সাইনবোর্ড কর ও সরকারি ভ্যাট প্রদান।',
      en: 'Trade license issuance and renewal fees, signboard taxes, and statutory government VAT.',
    },
    badge: { bn: 'তাৎক্ষণিক ই-লাইসেন্স', en: 'Instant E-License' },
  },
  {
    href: '/online-payment/certificate-fee',
    icon: Award,
    title: { bn: 'সনদপত্র ফি পরিশোধ', en: 'Certificate Fee Payment' },
    desc: {
      bn: 'নাগরিকত্ব, চারিত্রিক, ওয়ারিশান, জন্ম ও মৃত্যু নিবন্ধন সনদের সরকার নির্ধারিত সরকারি ফি।',
      en: 'Government statutory fees for Citizenship, Character, Inheritance, and Vital Records.',
    },
    badge: { bn: 'ডিজিটাল সিলযুক্ত', en: 'Digitally Sealed' },
  },
  {
    href: '/online-payment/application-fee',
    icon: FileText,
    title: { bn: 'আবেদন ফি পরিশোধ', en: 'Application Fee Payment' },
    desc: {
      bn: 'পৌরসভার বিভিন্ন নাগরিক সেবা আবেদনের প্রক্রিয়াকরণ ফি ও প্রাথমিক স্ক্রুটিনি চার্জ।',
      en: 'Processing scrutiny fees and civic service application charges via tracking ID.',
    },
    badge: { bn: 'ট্র্যাকিং আইডি দিয়ে', en: 'Via Tracking ID' },
  },
  {
    href: '/online-payment/other-service-fees',
    icon: Layers,
    title: { bn: 'অন্যান্য সেবা ফি', en: 'Other Civic Service Fees' },
    desc: {
      bn: 'কমিউনিটি সেন্টার বুকিং, বিশেষ বর্জ্য অপসারণ ও রাস্তা খনন অনুমতির পৌর ফি পরিশোধ।',
      en: 'Community center reservation, hazardous waste removal, and utility trenching permits.',
    },
    badge: { bn: 'অনলাইন শিডিউলিং', en: 'Online Scheduling' },
  },
  {
    href: '/online-payment/history',
    icon: History,
    title: { bn: 'পরিশোধের ইতিহাস', en: 'Payment History' },
    desc: {
      bn: 'আপনার সকল পূর্ববর্তী কর ও সেবামূল্য পরিশোধের বিস্তারিত লেজার এবং স্ট্যাটাস ট্র্যাকিং।',
      en: 'Comprehensive citizen transaction ledger, payment status tracking, and statement.',
    },
    badge: { bn: 'সম্পূর্ণ লেজার', en: 'Full Ledger' },
  },
  {
    href: '/online-payment/receipt',
    icon: Download,
    title: { bn: 'পেমেন্ট রশিদ ডাউনলোড', en: 'Download Payment Receipt' },
    desc: {
      bn: 'যেকোনো সম্পন্ন লেনদেনের জন্য সরকারি সিল ও কিউআর কোডযুক্ত অফিসিয়াল ডিজিটাল রসিদ সংগ্রহ।',
      en: 'Retrieve and print officially authenticated digital receipts with verifiable QR codes.',
    },
    badge: { bn: 'প্রিন্ট ও পিডিএফ', en: 'Print & PDF' },
  },
  {
    href: '/online-payment/verification',
    icon: ShieldCheck,
    title: { bn: 'পেমেন্ট যাচাইকরণ', en: 'Payment Verification' },
    desc: {
      bn: 'রশিদ নম্বর বা ট্রানজেকশন আইডি দিয়ে কেন্দ্রীয় ট্রেজারি সার্ভারে পেমেন্টের সত্যতা যাচাই।',
      en: 'Public verification of any municipal payment against the government central treasury.',
    },
    badge: { bn: 'কেন্দ্রীয় যাচাই', en: 'Central Audit' },
  },
];

const FAQS = [
  {
    q: {
      bn: 'অনলাইন পেমেন্ট করার পর রসিদ পেতে কত সময় লাগে?',
      en: 'How long does it take to get the receipt after online payment?',
    },
    a: {
      bn: 'বিকাশ, নগদ, রকেট বা কার্ডের মাধ্যমে পেমেন্ট নিশ্চিত হওয়ার সাথে সাথে তাৎক্ষণিকভাবে (১-৩ সেকেন্ডের মধ্যে) ডিজিটাল রশিদ ইস্যু হয়।',
      en: 'Digital receipts are generated immediately within 1-3 seconds once transaction authorization is completed.',
    },
  },
  {
    q: {
      bn: 'হোল্ডিং ট্যাক্সে ১০% রিবেট পাওয়ার শর্ত কী?',
      en: 'What is the condition to avail the 10% holding tax rebate?',
    },
    a: {
      bn: 'চলতি অর্থবছরের নির্ধারিত প্রান্তিক বা নির্দিষ্ট সময়ের মধ্যে সম্পূর্ণ কর পরিশোধ করলে সরকারি নিয়ম অনুযায়ী স্বয়ংক্রিয়ভাবে ১০% ছাড় পাওয়া যায়।',
      en: 'Paying annual current municipal taxes within the officially prescribed fiscal quarter automatically unlocks the 10% rebate.',
    },
  },
  {
    q: {
      bn: 'পেমেন্ট সফল কিন্তু একাউন্ট থেকে টাকা কেটে নিলে রসিদ না পেলে কী করব?',
      en: 'What should I do if money is deducted but receipt is not displayed?',
    },
    a: {
      bn: 'আমাদের ১৬১০৬ হেল্পলাইনে আপনার ট্রানজেকশন আইডি প্রদান করুন অথবা ‘পেমেন্ট যাচাইকরণ’ পেজে ট্রানজেকশন আইডি লিখে সার্চ করুন। কেন্দ্রীয় সার্ভারে স্বয়ংক্রিয়ভাবে ৫ মিনিটের মধ্যে মিল সম্পন্ন হয়।',
      en: 'Call our 16106 helpline with your transaction ID or check the Verification page. Reconciliation completes automatically within 5 minutes.',
    },
  },
];

export default function OnlinePaymentHubPage() {
  const { language } = useApp();
  const router = useRouter();
  const [quickRef, setQuickRef] = useState('');
  const [quickType, setQuickType] = useState('HOLDING_TAX');

  const handleQuickSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickRef.trim()) return;
    if (quickType === 'HOLDING_TAX') {
      router.push(`/online-payment/holding-tax?holding=${encodeURIComponent(quickRef.trim())}`);
    } else if (quickType === 'TRADE_LICENSE') {
      router.push(`/online-payment/trade-license?license=${encodeURIComponent(quickRef.trim())}`);
    } else {
      router.push(`/online-payment/verification?ref=${encodeURIComponent(quickRef.trim())}`);
    }
  };

  return (
    <PaymentLayout
      title={{
        bn: 'অনলাইন পেমেন্ট পোর্টাল ও ই-ট্রেজারি',
        en: 'Online Payment Portal & E-Treasury',
      }}
      description={{
        bn: 'ঢাকা সিটি কর্পোরেশনের হোল্ডিং ট্যাক্স, ট্রেড লাইসেন্স, সনদপত্র ও পৌর সেবা ফি ঘরে বসেই সহজে এবং নিরাপদে পরিশোধ করুন।',
        en: 'Pay holding tax, trade license fees, certificates, and civic utility charges securely from home.',
      }}
    >
      <div className="space-y-10">
        {/* Public Payment Guide & Citizen Portal Bridge Banner */}
        <div className="p-5 sm:p-6 bg-[#ECFDF5] rounded-2xl border border-emerald-200 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#006A4E] text-white flex items-center justify-center font-bold shrink-0 shadow-xs">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-sm text-[#111827]">
                {language === 'bn'
                  ? 'সরকারি ফি নির্দেশিকা ও অনলাইন পেমেন্ট তথ্য'
                  : 'Official Public Payment Guide & E-Services'}
              </div>
              <div className="text-xs text-[#4B5563] mt-1 leading-relaxed">
                {language === 'bn'
                  ? 'বিকাশ, নগদ, রকেট, কার্ড ও সোনালী ব্যাংকের মাধ্যমে নিরাপদ ডিজিটাল পরিশোধ। ব্যক্তিগত বিল ও রসিদের জন্য নাগরিক পোর্টালে লগইন করুন।'
                  : 'Supported gateways: bKash, Nagad, Rocket, Visa, Mastercard, Sonali Bank. Sign in to your Citizen Portal for one-click settlement.'}
              </div>
            </div>
          </div>
          <Link
            href="/login?redirect=/citizen"
            className="px-4 py-2.5 bg-[#006A4E] hover:bg-[#00523C] text-white text-xs font-semibold rounded-xl transition-colors shadow-xs whitespace-nowrap self-start md:self-auto inline-flex items-center gap-1.5"
          >
            <span>{language === 'bn' ? 'নাগরিক পোর্টালে লগইন' : 'Sign in to Pay'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Quick Search Widget */}
        <section className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs p-6 sm:p-8">
          <div className="max-w-3xl mx-auto space-y-4">
            <div className="text-center space-y-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ECFDF5] text-[#006A4E] text-xs font-semibold border border-emerald-200">
                <Sparkles className="w-3.5 h-3.5 text-[#006A4E]" />
                <span>
                  {language === 'bn' ? 'দ্রুত বিল অনুসন্ধান ও পরিশোধ' : 'Instant Bill Search & Checkout'}
                </span>
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-[#111827] tracking-tight">
                {language === 'bn' ? 'আপনার বিল বা লাইসেন্স খুঁজুন' : 'Find Your Bill or Civic Assessment'}
              </h2>
            </div>

            <form onSubmit={handleQuickSearch} className="flex flex-col sm:flex-row gap-3 pt-2">
              <select
                value={quickType}
                onChange={(e) => setQuickType(e.target.value)}
                className="px-3.5 py-3 rounded-xl border border-[#E2E8F0] text-sm font-medium bg-[#F8FAFC] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#006A4E]/20 focus:border-[#006A4E] sm:w-52 transition-colors"
              >
                <option value="HOLDING_TAX">
                  {language === 'bn' ? 'হোল্ডিং ট্যাক্স' : 'Holding Tax'}
                </option>
                <option value="TRADE_LICENSE">
                  {language === 'bn' ? 'ট্রেড লাইসেন্স' : 'Trade License'}
                </option>
                <option value="VERIFY">
                  {language === 'bn' ? 'রশিদ / ট্রানজেকশন যাচাই' : 'Receipt / Trx Verify'}
                </option>
              </select>

              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={quickRef}
                  onChange={(e) => setQuickRef(e.target.value)}
                  placeholder={
                    quickType === 'HOLDING_TAX'
                      ? language === 'bn'
                        ? 'হোল্ডিং নম্বর লিখুন (যেমন: H-10482)'
                        : 'Enter Holding No (e.g. H-10482)'
                      : quickType === 'TRADE_LICENSE'
                      ? language === 'bn'
                        ? 'ট্রেড লাইসেন্স নম্বর লিখুন'
                        : 'Enter Trade License No'
                      : language === 'bn'
                      ? 'রশিদ নম্বর বা ট্রানজেকশন লিখুন'
                      : 'Enter Receipt No or Txn ID'
                  }
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#E2E8F0] text-sm font-medium bg-[#F8FAFC] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#006A4E]/20 focus:border-[#006A4E] transition-colors"
                  required
                />
              </div>

              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-[#006A4E] hover:bg-[#00523C] text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-xs cursor-pointer transition-colors shrink-0"
              >
                <span>{language === 'bn' ? 'অনুসন্ধান করুন' : 'Search Now'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-[#4B5563] pt-1">
              <span>{language === 'bn' ? 'জনপ্রিয় অনুসন্ধান:' : 'Quick examples:'}</span>
              <button
                type="button"
                onClick={() => {
                  setQuickType('HOLDING_TAX');
                  setQuickRef('H-10482');
                }}
                className="font-mono text-[#006A4E] hover:underline cursor-pointer"
              >
                H-10482 (Ward 19)
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => {
                  setQuickType('TRADE_LICENSE');
                  setQuickRef('TRAD/DSCC/019284/2026');
                }}
                className="font-mono text-[#006A4E] hover:underline cursor-pointer"
              >
                TRAD/DSCC/019284/2026
              </button>
            </div>
          </div>
        </section>

        {/* 8 Payment Service Gateway Cards */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <span className="text-xs font-bold text-[#006A4E] uppercase tracking-wider">
                {language === 'bn' ? 'পৌর ই-সেবা তালিকা' : 'Municipal E-Services'}
              </span>
              <h2 className="text-2xl font-bold text-[#111827] tracking-tight">
                {language === 'bn' ? 'অনলাইন পেমেন্ট সেবাসমূহ' : 'All Online Payment Services'}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#4B5563] max-w-md leading-relaxed">
              {language === 'bn'
                ? 'সরাসরি সিটি কর্পোরেশন কেন্দ্রীয় ট্রেজারিতে জমা হওয়া নিরাপদ ও নির্ভরযোগ্য ৮টি নাগরিক পেমেন্ট সেবা।'
                : 'Direct, certified municipal revenue realization across all 8 civic service branches.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {SERVICE_CARDS.map((svc) => {
              const Icon = svc.icon;
              return (
                <Link
                  key={svc.href}
                  href={svc.href}
                  className="group relative flex flex-col justify-between p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs hover:border-[#006A4E] hover:shadow-md transition-colors"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-[#ECFDF5] text-[#006A4E] border border-emerald-200">
                        <Icon className="w-6 h-6 text-[#006A4E]" />
                      </div>
                      <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 group-hover:bg-[#ECFDF5] group-hover:text-[#006A4E] group-hover:border-emerald-200 transition-colors">
                        {svc.badge[language]}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-[#111827] group-hover:text-[#006A4E] transition-colors leading-snug mb-2">
                      {svc.title[language]}
                    </h3>
                    <p className="text-xs text-[#4B5563] leading-relaxed">
                      {svc.desc[language]}
                    </p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-slate-100 flex items-center text-xs font-semibold text-[#006A4E]">
                    <span>{language === 'bn' ? 'পরিশোধ করতে প্রবেশ করুন' : 'Enter Payment Flow'}</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1.5 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Real-time E-Treasury Performance Metrics */}
        <section className="bg-[#004D38] rounded-2xl text-white p-6 sm:p-8 shadow-xs border border-emerald-800 space-y-6">
          <div className="max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
              {language === 'bn' ? 'ডিজিটাল স্বচ্ছতা ও ট্রেজারি ড্যাশবোর্ড' : 'Digital Treasury Transparency'}
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold text-white mt-1 tracking-tight">
              {language === 'bn' ? 'স্বয়ংক্রিয় লেনদেন পরিসংখ্যান' : 'Real-time Payment Statistics'}
            </h3>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 pt-2">
            <div className="bg-white/10 rounded-xl p-4 sm:p-5 border border-white/15">
              <p className="text-xs text-emerald-200 mb-1">
                {language === 'bn' ? 'চলতি অর্থবছরে আদায়' : 'FY Realization'}
              </p>
              <p className="text-xl sm:text-2xl font-bold font-mono text-white tabular-nums">৳৮৪৮.২ কো</p>
              <p className="text-[11px] text-emerald-300 mt-1 flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" /> +১৮.৪% প্রবৃদ্ধি
              </p>
            </div>

            <div className="bg-white/10 rounded-xl p-4 sm:p-5 border border-white/15">
              <p className="text-xs text-emerald-200 mb-1">
                {language === 'bn' ? 'সফল ডিজিটাল লেনদেন' : 'Successful Payments'}
              </p>
              <p className="text-xl sm:text-2xl font-bold font-mono text-white tabular-nums">১,৪২০,৮৯০+</p>
              <p className="text-[11px] text-emerald-300 mt-1 flex items-center">
                <CheckCircle2 className="w-3 h-3 mr-1" /> ৯৯.৯% সাফল্য হার
              </p>
            </div>

            <div className="bg-white/10 rounded-xl p-4 sm:p-5 border border-white/15">
              <p className="text-xs text-emerald-200 mb-1">
                {language === 'bn' ? 'গড় নিষ্পত্তি সময়' : 'Avg. Settlement Time'}
              </p>
              <p className="text-xl sm:text-2xl font-bold font-mono text-white tabular-nums">&lt; ১.৮ সে</p>
              <p className="text-[11px] text-emerald-300 mt-1 flex items-center">
                <Clock className="w-3 h-3 mr-1" /> তাৎক্ষণিক ই-রশিদ
              </p>
            </div>

            <div className="bg-white/10 rounded-xl p-4 sm:p-5 border border-white/15">
              <p className="text-xs text-emerald-200 mb-1">
                {language === 'bn' ? 'অনলাইন রিবেট সুবিধাভোগী' : 'Rebate Beneficiaries'}
              </p>
              <p className="text-xl sm:text-2xl font-bold font-mono text-white tabular-nums">৩১৮,৫০০+</p>
              <p className="text-[11px] text-emerald-300 mt-1 flex items-center">
                <Sparkles className="w-3 h-3 mr-1" /> ১০% সরকারি ছাড়
              </p>
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#ECFDF5] text-[#006A4E] border border-emerald-200 flex items-center justify-center">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#111827]">
                {language === 'bn' ? 'সাধারণ জিজ্ঞাসা (FAQ)' : 'Frequently Asked Questions'}
              </h3>
              <p className="text-xs text-[#4B5563]">
                {language === 'bn'
                  ? 'অনলাইন পেমেন্ট সংক্রান্ত জরুরি প্রশ্নের উত্তর'
                  : 'Important answers regarding online payment guidelines'}
              </p>
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {FAQS.map((faq, idx) => (
              <div key={idx} className="py-4 space-y-1.5 first:pt-0 last:pb-0">
                <h4 className="text-sm font-semibold text-[#111827]">{faq.q[language]}</h4>
                <p className="text-xs sm:text-sm text-[#4B5563] leading-relaxed">{faq.a[language]}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </PaymentLayout>
  );
}
