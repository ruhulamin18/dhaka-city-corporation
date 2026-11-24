'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import {
  Layers,
  Search,
  ArrowRight,
} from 'lucide-react';

const SERVICES = [
  {
    category: { bn: 'নিবন্ধন ও সনদপত্র', en: 'Registration & Certificates' },
    items: [
      {
        slug: 'citizenship-certificate',
        catSlug: 'registration-certificates',
        title: { bn: 'নাগরিকত্ব সনদপত্র', en: 'Citizenship Certificate' },
        fee: 150,
        days: { bn: '১-৩ কর্মদিবস', en: '1-3 working days' },
        desc: { bn: 'স্থায়ী নাগরিকত্বের সরকারি প্রত্যয়নপত্র সংগ্রহ।', en: 'Official civic residence verification certificate.' },
      },
      {
        slug: 'birth-certificate-verification',
        catSlug: 'registration-certificates',
        title: { bn: 'জন্ম নিবন্ধন ইংরেজি কপি', en: 'Birth Certificate (English)' },
        fee: 100,
        days: { bn: '১-২ কর্মদিবস', en: '1-2 working days' },
        desc: { bn: 'অনলাইন জন্ম নিবন্ধনের ইংরেজি প্রতিলিপি ও সত্যয়ন।', en: 'English transcription of verified birth record.' },
      },
      {
        slug: 'character-certificate',
        catSlug: 'registration-certificates',
        title: { bn: 'চারিত্রিক সনদপত্র', en: 'Character Certificate' },
        fee: 100,
        days: { bn: '১-২ কর্মদিবস', en: '1-2 working days' },
        desc: { bn: 'কাউন্সিলর কর্তৃক চারিত্রিক প্রত্যয়নপত্র।', en: 'Official character testimonial by Councillor.' },
      },
      {
        slug: 'family-certificate',
        catSlug: 'registration-certificates',
        title: { bn: 'ওয়ারিশান ও পারিবারিক সনদ', en: 'Inheritance (Waris) Certificate' },
        fee: 250,
        days: { bn: '৩-৫ কর্মদিবস', en: '3-5 working days' },
        desc: { bn: 'আইনগত উত্তরাধিকারী তালিকা প্রত্যয়ন।', en: 'Legal inheritance and family tree testimonial.' },
      },
    ],
  },
  {
    category: { bn: 'ব্যবসা ও বাণিজ্য লাইসেন্স', en: 'Business & Trade Licensing' },
    items: [
      {
        slug: 'new-trade-license',
        catSlug: 'business-licensing',
        title: { bn: 'নতুন ই-ট্রেড লাইসেন্স', en: 'New E-Trade License' },
        fee: 4500,
        days: { bn: '২-৪ কর্মদিবস', en: '2-4 working days' },
        desc: { bn: 'নতুন ব্যবসা প্রতিষ্ঠানের জন্য পৌর লাইসেন্স বরাদ্দ।', en: 'New commercial trade license authorization.' },
      },
      {
        slug: 'trade-license-renewal',
        catSlug: 'business-licensing',
        title: { bn: 'ট্রেড লাইসেন্স নবায়ন', en: 'Trade License Renewal' },
        fee: 4500,
        days: { bn: '১ কর্মদিবস', en: '1 working day' },
        desc: { bn: 'চলতি অর্থবছরের জন্য ট্রেড লাইসেন্স অনলাইন নবায়ন।', en: 'Annual trade license renewal and tax payment.' },
      },
    ],
  },
  {
    category: { bn: 'হোল্ডিং ট্যাক্স ও রাজস্ব', en: 'Tax & Revenue' },
    items: [
      {
        slug: 'holding-tax-assessment',
        catSlug: 'tax-revenue',
        title: { bn: 'নতুন হোল্ডিং নম্বর বরাদ্দ ও সার্ভে', en: 'New Holding Assessment' },
        fee: 500,
        days: { bn: '৫-৭ কর্মদিবস', en: '5-7 working days' },
        desc: { bn: 'নতুন নির্মিত ভবনের পৌর মূল্যায়ন ও নম্বর বরাদ্দ।', en: 'New property survey, GIS mapping, and assessment.' },
      },
      {
        slug: 'holding-tax-payment',
        catSlug: 'tax-revenue',
        title: { bn: 'হোল্ডিং ট্যাক্স পরিশোধ', en: 'Holding Tax Payment' },
        fee: 0,
        days: { bn: 'তাৎক্ষণিক', en: 'Immediate' },
        desc: { bn: '১০% রিবেটসহ অনলাইন পৌর কর পরিশোধ।', en: 'Instant online property tax clearance with 10% rebate.' },
      },
    ],
  },
  {
    category: { bn: 'অবকাঠামো ও নাগরিক সেবা', en: 'Infrastructure & Civic' },
    items: [
      {
        slug: 'community-center-booking',
        catSlug: 'infrastructure-public-services',
        title: { bn: 'কমিউনিটি সেন্টার বুকিং', en: 'Community Center Booking' },
        fee: 25000,
        days: { bn: '১ কর্মদিবস', en: '1 working day' },
        desc: { bn: 'সিটি কর্পোরেশন কমিউনিটি সেন্টার ভাড়া।', en: 'Hall reservation and event scheduling.' },
      },
      {
        slug: 'road-repair-request',
        catSlug: 'infrastructure-public-services',
        title: { bn: 'সড়ক মেরামত ও রাস্তা খনন অনুমোদন', en: 'Road Trenching & Repair Permit' },
        fee: 12000,
        days: { bn: '৩-৫ কর্মদিবস', en: '3-5 working days' },
        desc: { bn: 'ইউটিলিটি সংযোগের জন্য রাস্তা খনন অনুমতি ও নিরাপত্তা জামানত।', en: 'Trenching permission & restoration security deposit.' },
      },
    ],
  },
];

export default function CitizenServicesDirectoryPage() {
  const { language } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const search = searchTerm.trim().toLocaleLowerCase();
  const hasResults = SERVICES.some((group) => group.items.some(
    (item) => item.title.bn.toLocaleLowerCase().includes(search) || item.title.en.toLocaleLowerCase().includes(search)
  ));

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Search Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 mb-2">
            <Layers className="w-3.5 h-3.5 text-[#006A4E]" />
            <span>{language === 'bn' ? 'অনলাইন সেবা ক্যাটালগ' : 'Citizen Service Directory'}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            {language === 'bn' ? 'সকল নাগরিক ডিজিটাল সেবা' : 'All Digital Citizen Services'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {language === 'bn'
              ? 'যেকোনো নাগরিক সেবা নির্বাচন করে প্রয়োজনীয় তথ্য ও ফি দেখে অনলাইনে সরাসরি আবেদন করুন।'
              : 'Select a municipal service to review requirements, statutory fees, and initiate applications.'}
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            aria-label={language === 'bn' ? 'নাগরিক সেবা খুঁজুন' : 'Search citizen services'}
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={language === 'bn' ? 'সেবা খুঁজুন...' : 'Search services...'}
            className="w-full pl-9 pr-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#006A4E]"
          />
        </div>
      </div>

      {/* Grouped Services */}
      <div className="space-y-8">
        {!hasResults && (
          <p role="status" className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-600">
            {language === 'bn' ? 'কোনো সেবা মেলেনি। অন্য শব্দ দিয়ে খুঁজুন।' : 'No services match your search. Try another term.'}
          </p>
        )}
        {SERVICES.map((grp, gIdx) => (
          <div key={gIdx} className="space-y-4">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#006A4E]" />
              <span>{grp.category[language]}</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {grp.items
                .filter((item) => item.title.bn.toLocaleLowerCase().includes(search) || item.title.en.toLocaleLowerCase().includes(search))
                .map((item) => (
                  <div
                    key={item.slug}
                    className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs transition-[background-color,border-color,transform,box-shadow] duration-300 hover:bg-[#ECFDF5] hover:border-[#006A4E] hover:-translate-y-0.5 motion-reduce:transform-none flex flex-col justify-between space-y-3 group"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#006A4E] transition-colors">
                          {item.title[language]}
                        </h3>
                        <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          {item.fee > 0 ? `৳${item.fee}` : language === 'bn' ? 'বিনামূল্যে' : 'Free'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">{item.desc[language]}</p>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                      <span className="text-[11px] text-slate-400">
                        {language === 'bn' ? 'প্রক্রিয়াকরণ: ' : 'Time: '}
                        <strong className="text-slate-700">                        {item.days[language]}</strong>
                      </span>

                      <Link
                        href={`/citizen-services/${item.catSlug}/${item.slug}`}
                        className="inline-flex items-center gap-1 font-bold text-[#006A4E] hover:underline"
                      >
                        <span>{language === 'bn' ? 'আবেদন ও নিয়মাবলী' : 'Details & Apply'}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
