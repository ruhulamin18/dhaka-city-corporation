'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  HelpCircle,
  Info,
  MapPin,
  Phone,
  Recycle,
  Sparkles,
  Trash2,
  Truck,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { SmartCityComplaintModal } from '@/components/smart-city/SmartCityComplaintModal';
import { WASTE_SCHEDULES } from '@/data/smart-city/smartCityData';
import { pickLang } from '@/types/about';

export function WasteManagementView() {
  const { language } = useApp();

  const [selectedWard, setSelectedWard] = useState<number>(27);
  const [reportModalOpen, setReportModalOpen] = useState(false);

  const activeSchedule =
    WASTE_SCHEDULES.find((s) => s.wardNumber === selectedWard) ?? WASTE_SCHEDULES[0];

  return (
    <div className="space-y-8">
      {/* 1. Header Banner & Action Button */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold text-[#006A4E] uppercase tracking-wider">
            {language === 'bn' ? 'ক্লিন ঢাকা ইনিশিয়েটিভ' : 'Clean Dhaka Initiative'}
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-[#111827] mt-0.5">
            {language === 'bn' ? 'ওয়ার্ডভিত্তিক বর্জ্য অপসারণ ও সময়সূচি' : 'Ward-Wise Waste Collection Schedules'}
          </h2>
          <p className="text-xs sm:text-sm text-[#4B5563] mt-1 max-w-xl">
            {language === 'bn'
              ? 'নির্ধারিত সময়ে ভ্যানে ময়লা ফেলুন এবং বাসাবাড়িতে বর্জ্য পৃথকীকরণ নিশ্চিত করে সবুজ ঢাকা গড়ুন।'
              : 'Dispose of waste during scheduled van collection hours and practice source segregation.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setReportModalOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#C81E1E] text-white font-semibold text-sm hover:bg-[#a51818] transition-all shadow-sm cursor-pointer"
          >
            <AlertCircle className="w-4 h-4" />
            <span>{language === 'bn' ? 'অপসারিত না হওয়া বর্জ্যের রিপোর্ট' : 'Report Uncollected Waste'}</span>
          </button>
        </div>
      </div>

      {/* 2. Source Segregation Protocol Cards */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-[#111827]">
              {language === 'bn' ? 'উৎসস্থলে বর্জ্য পৃথকীকরণ নির্দেশিকা' : 'Source Waste Segregation Guidelines'}
            </h3>
            <p className="text-xs text-[#4B5563]">
              {language === 'bn'
                ? 'বাসাবাড়ি ও প্রতিষ্ঠানে ময়লা ফেলার সময় ৩টি পৃথক শ্রেণিতে বিন্যস্ত করুন'
                : 'Segregate waste into three categories at home and business premises before disposal'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Organic / Wet */}
          <div className="p-5 rounded-xl border border-emerald-200 bg-emerald-50/60 space-y-2">
            <div className="w-9 h-9 rounded-lg bg-[#006A4E] text-white flex items-center justify-center font-bold text-sm">
              <Recycle className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-[#006A4E]">
              {language === 'bn' ? '১. পচনশীল জৈব বর্জ্য (সবুজ বিন)' : '1. Organic Wet Waste (Green Bin)'}
            </h4>
            <p className="text-xs text-slate-700 leading-relaxed">
              {language === 'bn'
                ? 'রান্নাঘরের উচ্ছিষ্ট, শাকসবজি, ফলমূলের খোসা, খাবারের অবশিষ্ট অংশ ও চা পাতা। যা কম্পোস্টিংয়ে ব্যবহৃত হয়।'
                : 'Kitchen food scraps, vegetable peels, leftover food, and tea leaves. Used for municipal composting.'}
            </p>
          </div>

          {/* Dry / Recyclable */}
          <div className="p-5 rounded-xl border border-sky-200 bg-sky-50/60 space-y-2">
            <div className="w-9 h-9 rounded-lg bg-sky-600 text-white flex items-center justify-center font-bold text-sm">
              <Sparkles className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-sky-800">
              {language === 'bn' ? '২. শুষ্ক ও পুনর্ব্যবহারযোগ্য (নীল বিন)' : '2. Dry Recyclables (Blue Bin)'}
            </h4>
            <p className="text-xs text-slate-700 leading-relaxed">
              {language === 'bn'
                ? 'প্লাস্টিকের বোতল, কাগজ, পুরনো খবরের কাগজ, কার্ডবোর্ড, কাচের বোতল ও ধাতব ক্যান। যা সরাসরি পুনর্ব্যবহারযোগ্য।'
                : 'Plastic bottles, cartons, paper, glass bottles, and aluminium cans. Sent to certified recycling hubs.'}
            </p>
          </div>

          {/* Hazardous / Medical */}
          <div className="p-5 rounded-xl border border-rose-200 bg-rose-50/60 space-y-2">
            <div className="w-9 h-9 rounded-lg bg-rose-600 text-white flex items-center justify-center font-bold text-sm">
              <AlertCircle className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-rose-800">
              {language === 'bn' ? '৩. বিপজ্জনক ও মেডিকেল বর্জ্য (লাল বিন)' : '3. Hazardous & Medical Waste (Red Bin)'}
            </h4>
            <p className="text-xs text-slate-700 leading-relaxed">
              {language === 'bn'
                ? 'ব্যবহৃত সিরিঞ্জ, ওষুধ, ব্যাটারি, ভাঙা কাচ, রাসায়নিক দ্রব্যাদি ও ই-বর্জ্য। সাবধানে আলাদা প্যাকেটে দিন।'
                : 'Used syringes, expired medicines, batteries, broken fluorescent tubes, and e-waste. Requires safe incineration.'}
            </p>
          </div>
        </div>
      </div>

      {/* 3. Ward Schedule Explorer */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-lg font-bold text-[#111827]">
              {language === 'bn' ? 'ওয়ার্ডভিত্তিক সংগ্রহ সময়সূচি ও পয়েন্ট' : 'Ward Collection Timetable & STS Stations'}
            </h3>
            <p className="text-xs text-[#4B5563]">
              {language === 'bn'
                ? 'আপনার ওয়ার্ডের সুনির্দিষ্ট সময় ও দায়িত্বপ্রাপ্ত পরিচ্ছন্নতা পরিদর্শক'
                : 'Inspect van operational shifts and supervisor contact details'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-700">
              {language === 'bn' ? 'ওয়ার্ড:' : 'Ward:'}
            </span>
            <select
              value={selectedWard}
              onChange={(e) => setSelectedWard(Number(e.target.value))}
              className="px-3.5 py-2 text-xs sm:text-sm font-semibold bg-[#ECFDF5] border border-emerald-300 text-[#006A4E] rounded-xl focus:outline-none"
            >
              {WASTE_SCHEDULES.map((s) => (
                <option key={s.wardNumber} value={s.wardNumber}>
                  {language === 'bn'
                    ? `ওয়ার্ড ${s.wardNumber} (${s.wardName.bn})`
                    : `Ward ${s.wardNumber} (${s.wardName.en})`}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Schedule Detail Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Shift 1 */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center gap-2 text-[#006A4E] font-bold text-xs uppercase tracking-wider">
              <Clock className="w-4 h-4" />
              <span>{language === 'bn' ? 'সকালের শিফট (বাসাবাড়ি)' : 'Morning Shift (Household)'}</span>
            </div>
            <div className="text-base font-bold text-[#111827]">
              {pickLang(activeSchedule.primarySchedule, language)}
            </div>
            <p className="text-xs text-[#4B5563]">
              {language === 'bn'
                ? 'বাসাবাড়ির দরজা থেকে নির্ধারিত পরিচ্ছন্নতাকর্মী ভ্যান দ্বারা বর্জ্য সংগ্রহ করে।'
                : 'Direct door-to-door primary van collection across all residential lanes.'}
            </p>
          </div>

          {/* Shift 2 */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center gap-2 text-indigo-700 font-bold text-xs uppercase tracking-wider">
              <Truck className="w-4 h-4" />
              <span>{language === 'bn' ? 'দুপুরের শিফট (এসটিএস কম্প্যাক্টর)' : 'Midday Shift (STS Compactor)'}</span>
            </div>
            <div className="text-base font-bold text-[#111827]">
              {pickLang(activeSchedule.secondarySchedule, language)}
            </div>
            <p className="text-xs text-[#4B5563]">
              {language === 'bn'
                ? 'আবাসিক ভ্যান থেকে কম্প্যাক্টরে স্থানান্তর করে মাতুয়াইল ও আমিনবাজার ল্যান্ডফিলে পরিবহন।'
                : 'Secondary transfer from neighbourhood vans into hydraulic compactor trucks.'}
            </p>
          </div>

          {/* Supervisor Card */}
          <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-2">
            <div className="text-[11px] font-bold text-[#006A4E] uppercase tracking-wider">
              {language === 'bn' ? 'দায়িত্বপ্রাপ্ত পরিচ্ছন্নতা পরিদর্শক' : 'Zonal Sanitary Inspector'}
            </div>
            <div className="font-bold text-sm text-[#111827]">
              {pickLang(activeSchedule.supervisorName, language)}
            </div>
            <div className="flex items-center justify-between pt-1 text-xs">
              <span className="text-[#4B5563]">{language === 'bn' ? 'সরকারি মোবাইল:' : 'Official Phone:'}</span>
              <a
                href={`tel:${activeSchedule.supervisorPhone}`}
                className="font-bold text-[#006A4E] hover:underline flex items-center gap-1"
              >
                <Phone className="w-3 h-3" />
                <span>{activeSchedule.supervisorPhone}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Primary Drop Points in this ward */}
        <div className="pt-2">
          <h4 className="text-xs font-bold text-[#111827] uppercase tracking-wider mb-2">
            {language === 'bn' ? 'অনুমোদিত সেকেন্ডারি বর্জ্য ড্রপ-অফ কেন্দ্র (STS)' : 'Designated Secondary Transfer Stations (STS)'}
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {activeSchedule.primaryPoints.map((pt, i) => (
              <div
                key={i}
                className="p-3 rounded-lg border border-slate-200 bg-white flex items-start gap-2 text-xs"
              >
                <MapPin className="w-3.5 h-3.5 text-[#006A4E] shrink-0 mt-0.5" />
                <span className="text-[#111827] font-medium">{pickLang(pt, language)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Complaint Modal */}
      <SmartCityComplaintModal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        defaultCategory="waste"
        defaultTitle={
          language === 'bn'
            ? `ওয়ার্ড ${selectedWard}-এ বর্জ্য অপসারিত হয়নি`
            : `Uncollected waste in Ward ${selectedWard}`
        }
        defaultWard={selectedWard}
      />
    </div>
  );
}
