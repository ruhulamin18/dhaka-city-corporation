'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
import {
  FilePlus2,
  CheckCircle2,
  AlertCircle,
  FileText,
  UploadCloud,
  Send,
  Building2,
  ShieldCheck,
  Calendar,
  Lock,
} from 'lucide-react';

const SELECTABLE_SERVICES = [
  {
    id: 'hold_survey',
    title: { bn: 'নতুন হোল্ডিং নম্বর বরাদ্দ ও সার্ভে আবেদন', en: 'New Holding Assessment & Survey' },
    department: { bn: 'রাজস্ব বিভাগ ও এসেসমেন্ট উইং', en: 'Revenue Wing' },
    fee: 500,
    days: '৫-৭ কর্মদিবস',
    requiredDocs: [
      { name: 'জমির রেজিস্ট্রিকৃত মূল দলিল বা নামজারি পরচা', mandatory: true },
      { name: 'রাজউক বা যথাযথ কর্তৃপক্ষ কর্তৃক অনুমোদিত ভবনের নকশা', mandatory: true },
      { name: 'আবেদনকারীর জাতীয় পরিচয়পত্র (NID) কপি', mandatory: true },
      { name: 'সর্বশেষ খাজনা পরিশোধের দাখিলা কপি', mandatory: false },
    ],
  },
  {
    id: 'citizen_cert',
    title: { bn: 'নাগরিকত্ব সনদপত্র আবেদন', en: 'Citizenship Certificate Application' },
    department: { bn: 'কাউন্সিলর সচিবালয়', en: 'Councillor Secretariat' },
    fee: 150,
    days: '১-৩ কর্মদিবস',
    requiredDocs: [
      { name: 'জাতীয় পরিচয়পত্র বা অনলাইন জন্ম নিবন্ধন সনদ', mandatory: true },
      { name: 'আবাসিক হোল্ডিং ট্যাক্স পরিশোধের সর্বশেষ রসিদ', mandatory: true },
      { name: 'সদ্য তোলা ২ কপি পাসপোর্ট সাইজ ছবি', mandatory: true },
    ],
  },
  {
    id: 'trade_new',
    title: { bn: 'নতুন ই-ট্রেড লাইসেন্স ইস্যু আবেদন', en: 'New E-Trade License Application' },
    department: { bn: 'বাণিজ্য ও লাইসেন্স শাখা', en: 'Commerce & Trade Branch' },
    fee: 4500,
    days: '২-৪ কর্মদিবস',
    requiredDocs: [
      { name: 'দোকান বা বাণিজ্যিক স্পেসের ভাড়া চুক্তিপত্র বা মালিকানার প্রমাণ', mandatory: true },
      { name: 'স্বত্বাধিকারীর জাতীয় পরিচয়পত্র ও টিআইএন (TIN) সনদ', mandatory: true },
      { name: 'লিমিটেড কোম্পানি হলে মেমোরেন্ডাম ও সার্টিফিকেট অব ইনকর্পোরেশন', mandatory: false },
    ],
  },
];

export default function NewApplicationPage() {
  const { language } = useApp();
  const { user } = useAuth();
  const router = useRouter();

  const [selectedServiceId, setSelectedServiceId] = useState(SELECTABLE_SERVICES[0].id);
  const selectedService = SELECTABLE_SERVICES.find((s) => s.id === selectedServiceId) || SELECTABLE_SERVICES[0];

  // Citizen data
  const [applicantName, setApplicantName] = useState(user?.nameEn || 'Md. Ruhul Amin');
  const [applicantPhone, setApplicantPhone] = useState(user?.phone || '01816648095');
  const [wardNumber, setWardNumber] = useState<number>(user?.wardNumber || 27);
  const [propertyAddress, setPropertyAddress] = useState('House 42, Road 9/A, Dhanmondi, Dhaka');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [agreed, setAgreed] = useState(false);

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) return;

    setIsSubmitting(true);
    const generatedId = `APP-DSCC-2026-${Math.floor(10000 + Math.random() * 90000)}`;

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmittedId(generatedId);
    }, 700);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex items-center space-x-3">
        <div className="w-10 h-10 rounded-xl bg-emerald-100 text-[#006A4E] flex items-center justify-center font-bold shrink-0">
          <FilePlus2 className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            {language === 'bn' ? 'নতুন নাগরিক সেবা আবেদন দাখিল' : 'Submit New Civic Application'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            {language === 'bn'
              ? 'নির্ধারিত সেবা নির্বাচন করে প্রয়োজনীয় তথ্যাদি পূরণ এবং সরকারি ফি যাচাইপূর্বক আবেদন দাখিল করুন।'
              : 'Select desired service, inspect document checklist and fees, and submit official request.'}
          </p>
        </div>
      </div>

      {submittedId ? (
        <div className="bg-white rounded-2xl border border-emerald-300 p-8 shadow-md text-center space-y-4 animate-in fade-in">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#006A4E] flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            {language === 'bn' ? 'আবেদন সফলভাবে গৃহীত হয়েছে!' : 'Application Successfully Submitted!'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
            {language === 'bn'
              ? 'আপনার আবেদনটি সংশ্লিষ্ট আঞ্চলিক নির্বাহী কর্মকর্তার দপ্তরে যাচাইয়ের জন্য পাঠানো হয়েছে। আপনার ট্র্যাকিং নম্বরটি সংরক্ষণ করুন।'
              : 'Your application has been logged and dispatched to the zonal officer for initial scrutiny.'}
          </p>

          <div className="inline-block p-4 rounded-xl bg-slate-50 border border-slate-200 font-mono text-sm font-bold text-emerald-800">
            {submittedId}
          </div>

          <div className="flex items-center justify-center gap-3 pt-4">
            <Link
              href={`/citizen/tracking?id=${submittedId}`}
              className="px-6 py-2.5 rounded-xl bg-[#006A4E] text-white font-bold text-xs shadow-md hover:bg-[#00523C] transition-colors"
            >
              {language === 'bn' ? 'আবেদনের অগ্রগতি ট্র্যাক করুন' : 'Track Application Status'}
            </Link>
            <button
              type="button"
              onClick={() => setSubmittedId(null)}
              className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-semibold text-xs hover:bg-slate-200 transition-colors"
            >
              {language === 'bn' ? 'আরেকটি আবেদন করুন' : 'Submit Another'}
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Step 1: Select Service */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
              {language === 'bn' ? '১. সেবার ধরন নির্বাচন করুন' : '1. Select Civic Service'}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {SELECTABLE_SERVICES.map((s) => {
                const isSelected = selectedServiceId === s.id;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setSelectedServiceId(s.id)}
                    className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'border-[#006A4E] bg-emerald-50/50 ring-2 ring-emerald-500/20 shadow-xs'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 leading-snug">{s.title[language]}</h4>
                      <p className="text-[11px] text-slate-500 mt-1">{s.department[language]}</p>
                    </div>
                    <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                      <span className="font-bold text-emerald-800">৳{s.fee}</span>
                      <span className="text-slate-400">{s.days}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Mandatory Requirements & Fee Disclosure */}
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 text-emerald-800">
                <ShieldCheck className="w-4 h-4" />
                <span>{language === 'bn' ? 'প্রয়োজনীয় নথিপত্র ও সরকারি ফি' : 'Required Documents & Fee Schedule'}</span>
              </h3>
              <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                {language === 'bn' ? `প্রক্রিয়াকরণ: ${selectedService.days}` : `Time: ${selectedService.days}`}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <p className="font-bold text-slate-700 mb-2">
                  {language === 'bn' ? 'প্রয়োজনীয় কাগজপত্রের তালিকা:' : 'Document Checklist:'}
                </p>
                <ul className="space-y-1.5 list-disc list-inside text-slate-600">
                  {selectedService.requiredDocs.map((doc, idx) => (
                    <li key={idx}>
                      <span className="font-medium text-slate-800">{doc.name}</span>{' '}
                      {doc.mandatory && (
                        <span className="text-rose-600 text-[10px] font-bold">
                          ({language === 'bn' ? 'বাধ্যতামূলক' : 'Mandatory'})
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
                <p className="font-bold text-slate-700">
                  {language === 'bn' ? 'সরকারি ফি বিবরণী:' : 'Fee Schedule Breakdown:'}
                </p>
                <div className="flex justify-between text-slate-600 border-b border-slate-100 pb-1">
                  <span>{language === 'bn' ? 'মূল আবেদন ও যাচাইকরণ ফি' : 'Base Scrutiny Fee'}</span>
                  <span className="font-mono font-semibold">৳{selectedService.fee}</span>
                </div>
                <div className="flex justify-between font-bold text-slate-900 pt-1 text-sm">
                  <span>{language === 'bn' ? 'সর্বমোট সরকারি ফি' : 'Total Payable'}</span>
                  <span className="font-mono text-emerald-800">৳{selectedService.fee}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Step 3: Application Input Fields */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
            <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
              {language === 'bn' ? '২. আবেদনকারীর তথ্য ও তফসিল' : '2. Applicant & Schedule Details'}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {language === 'bn' ? 'আবেদনকারীর পূর্ণ নাম *' : 'Applicant Full Name *'}
                </label>
                <input
                  type="text"
                  value={applicantName}
                  onChange={(e) => setApplicantName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#006A4E]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {language === 'bn' ? 'যোগাযোগ মোবাইল নম্বর *' : 'Contact Mobile Number *'}
                </label>
                <input
                  type="tel"
                  value={applicantPhone}
                  onChange={(e) => setApplicantPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#006A4E]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {language === 'bn' ? 'ওয়ার্ড নম্বর *' : 'Ward Number *'}
                </label>
                <select
                  value={wardNumber}
                  onChange={(e) => setWardNumber(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#006A4E]"
                >
                  {Array.from({ length: 54 }, (_, i) => i + 1).map((w) => (
                    <option key={w} value={w}>
                      {language === 'bn' ? `ওয়ার্ড নং ${w}` : `Ward No ${w}`}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {language === 'bn' ? 'সম্পত্তি বা প্রতিষ্ঠানের ঠিকানা *' : 'Property / Establishment Address *'}
                </label>
                <input
                  type="text"
                  value={propertyAddress}
                  onChange={(e) => setPropertyAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#006A4E]"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {language === 'bn' ? 'বিশেষ মন্তব্য বা আবেদন বিবরণী' : 'Additional Notes / Case Specifics'}
                </label>
                <textarea
                  rows={2}
                  value={additionalNotes}
                  onChange={(e) => setAdditionalNotes(e.target.value)}
                  placeholder={language === 'bn' ? 'প্রয়োজনীয় অতিরিক্ত কোনো তথ্য থাকলে লিখুন...' : 'Enter any specifics...'}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#006A4E]"
                />
              </div>
            </div>

            {/* Declaration */}
            <div className="pt-2">
              <label className="flex items-start gap-2 text-xs text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="w-4 h-4 mt-0.5 accent-[#006A4E] rounded cursor-pointer shrink-0"
                  required
                />
                <span>
                  {language === 'bn'
                    ? 'আমি এই মর্মে অঙ্গীকার করছি যে উপরে বর্ণিত সকল তথ্য সম্পূর্ণ সত্য ও সঠিক। কোনো অসত্য বা ভুল তথ্য প্রদান করলে আইনানুগ ব্যবস্থা গ্রহণ করা যাবে।'
                    : 'I declare that the information provided is authentic and correct according to official records.'}
                </span>
              </label>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3">
            <Link
              href="/citizen/applications"
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
            >
              {language === 'bn' ? 'ফিরে যান' : 'Back'}
            </Link>
            <button
              type="submit"
              disabled={!agreed || isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-[#006A4E] hover:bg-[#00523C] disabled:opacity-60 text-white font-bold text-xs shadow-md flex items-center gap-2 cursor-pointer transition-colors"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? (language === 'bn' ? 'জমা হচ্ছে...' : 'Submitting...') : (language === 'bn' ? 'আবেদন দাখিল করুন' : 'Submit Application')}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
