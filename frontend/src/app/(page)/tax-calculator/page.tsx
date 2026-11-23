'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowRight,
  Calculator,
  RotateCcw,
  Printer,
  ShieldCheck,
  Building2,
  Info,
  Check,
  Copy,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { mockApi } from '@/services/mockApi';
import { HoldingTaxInput, WardInfo } from '@/types';

const INITIAL_TAX_INPUT: HoldingTaxInput & { holdingNumber: string; fiscalYear: string } = {
  wardNumber: 19,
  holdingNumber: 'H-10482',
  ownerName: '',
  propertyType: 'residential',
  areaSqFt: 2200,
  floors: 1,
  roadWidthCategory: 'main_road',
  fiscalYear: '2025-2026',
};

export default function PublicTaxEstimatorPage() {
  const router = useRouter();
  const { language } = useApp();
  const [wards, setWards] = useState<WardInfo[]>([]);
  const [applyRebate, setApplyRebate] = useState(true);
  const [copiedSummary, setCopiedSummary] = useState(false);

  const [taxInput, setTaxInput] = useState(INITIAL_TAX_INPUT);

  useEffect(() => {
    let active = true;
    mockApi.getWards().then((w) => {
      if (active) setWards(w);
    });
    return () => {
      active = false;
    };
  }, []);

  const calc = useMemo(() => mockApi.calculateHoldingTax(taxInput), [taxInput]);
  const netPayable = applyRebate ? Math.round(calc.totalPayableBdt * 0.9) : calc.totalPayableBdt;

  const handleReset = () => {
    setTaxInput(INITIAL_TAX_INPUT);
    setApplyRebate(true);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopySummary = async () => {
    const text = [
      'DHAKA SMART CITY CORPORATION — HOLDING TAX ESTIMATE',
      `Ward: Ward ${taxInput.wardNumber}`,
      `Holding: ${taxInput.holdingNumber || 'N/A'}`,
      `Category: ${taxInput.propertyType}`,
      `Area: ${taxInput.areaSqFt} sq ft (${taxInput.floors} floors)`,
      `Annual Valuation (ARV): ৳${calc.annualValuationBdt.toLocaleString('en-IN')}`,
      `Municipal Tax (7%): ৳${calc.annualTaxBdt.toLocaleString('en-IN')}`,
      `Conservancy & Lighting: ৳${(calc.conservancyFeeBdt + calc.streetLightFeeBdt).toLocaleString('en-IN')}`,
      applyRebate ? `Early Settlement Rebate (10%): -৳${Math.round(calc.totalPayableBdt * 0.1).toLocaleString('en-IN')}` : null,
      `Net Estimated Annual Tax: ৳${netPayable.toLocaleString('en-IN')}`,
      `Quarterly Installment: ৳${Math.round(netPayable / 4).toLocaleString('en-IN')}`,
    ].filter(Boolean).join('\n');

    try {
      await navigator.clipboard.writeText(text);
      setCopiedSummary(true);
      setTimeout(() => setCopiedSummary(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleProceedToPay = () => {
    const target = `/online-payment/holding-tax?holding=${encodeURIComponent(taxInput.holdingNumber || 'H-10482')}`;
    router.push(target);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#006A4E] bg-[#ECFDF5] border border-emerald-200 px-3 py-1 rounded-full mb-3">
          <Calculator className="w-3.5 h-3.5" />
          <span>
            {language === 'bn'
              ? 'পাবলিক হোল্ডিং ট্যাক্স ক্যালকুলেটর (লগইন ছাড়াই হিসাবযোগ্য)'
              : 'Public Utility · Instant Municipal Tax Estimator'}
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#111827] tracking-tight">
          {language === 'bn' ? 'পৌর হোল্ডিং ট্যাক্স ক্যালকুলেটর' : 'Municipal Holding Tax Estimator'}
        </h1>
        <p className="mt-2 text-sm sm:text-base text-[#4B5563] max-w-3xl leading-relaxed">
          {language === 'bn'
            ? 'আপনার ওয়ার্ড, ভবনের ধরন, সড়কের অবস্থান এবং মোট আয়তন অনুযায়ী সম্ভাব্য বার্ষিক ও ত্রৈমাসিক হোল্ডিং কর হিসাব করুন। এটি একটি নির্দেশক প্রাক্কলন; চূড়ান্ত কর পরিশোধের জন্য যাচাইকৃত সরকারি হোল্ডিং বিল ব্যবহার করুন।'
            : 'Estimate your annual and quarterly municipal property taxes based on official valuation rules. Note: this estimator provides an indicative valuation; actual bill payments must be executed via official verified records.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Input Form */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-7 space-y-6 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#006A4E]" />
              <span>{language === 'bn' ? 'সম্পত্তি ও পরিমাপের তথ্য' : 'Property & Assessment Parameters'}</span>
            </h2>
            <button
              type="button"
              onClick={handleReset}
              className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 font-medium transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'রিসেট' : 'Reset'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            <div>
              <label className="block text-xs font-semibold text-[#111827] mb-1.5">
                {language === 'bn' ? 'ওয়ার্ড নম্বর *' : 'Ward Jurisdiction *'}
              </label>
              <select
                value={taxInput.wardNumber}
                onChange={(e) => setTaxInput({ ...taxInput, wardNumber: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 text-sm border border-[#E2E8F0] rounded-xl bg-slate-50 text-[#111827] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#006A4E]/20 focus:border-[#006A4E] transition-colors"
              >
                {wards.length > 0 ? (
                  wards.map((w) => (
                    <option key={w.wardNumber} value={w.wardNumber}>
                      Ward {w.wardNumber} — {language === 'bn' ? w.nameBn : w.nameEn}
                    </option>
                  ))
                ) : (
                  Array.from({ length: 54 }, (_, i) => i + 1).map((w) => (
                    <option key={w} value={w}>
                      Ward {w}
                    </option>
                  ))
                )}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#111827] mb-1.5">
                {language === 'bn' ? 'হোল্ডিং নম্বর (ঐচ্ছিক)' : 'Holding Number (Optional)'}
              </label>
              <input
                type="text"
                value={taxInput.holdingNumber}
                onChange={(e) => setTaxInput({ ...taxInput, holdingNumber: e.target.value })}
                placeholder="H-10482"
                className="w-full px-3.5 py-2.5 text-sm border border-[#E2E8F0] rounded-xl bg-slate-50 font-mono text-[#111827] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#006A4E]/20 focus:border-[#006A4E] transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#111827] mb-1.5">
                {language === 'bn' ? 'সম্পত্তির ব্যবহারের ধরন *' : 'Property Usage Category *'}
              </label>
              <select
                value={taxInput.propertyType}
                onChange={(e) =>
                  setTaxInput({
                    ...taxInput,
                    propertyType: e.target.value as HoldingTaxInput['propertyType'],
                  })
                }
                className="w-full px-3.5 py-2.5 text-sm border border-[#E2E8F0] rounded-xl bg-slate-50 text-[#111827] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#006A4E]/20 focus:border-[#006A4E] transition-colors"
              >
                <option value="residential">
                  {language === 'bn' ? 'আবাসিক (৭% পৌর কর)' : 'Residential (7% Tax)'}
                </option>
                <option value="mixed">
                  {language === 'bn' ? 'মিশ্র ব্যবহার (৯% পৌর কর)' : 'Mixed-Use (9% Tax)'}
                </option>
                <option value="commercial">
                  {language === 'bn' ? 'বাণিজ্যিক (১২% পৌর কর)' : 'Commercial (12% Tax)'}
                </option>
                <option value="industrial">
                  {language === 'bn' ? 'শিল্প কারখানা (১০% পৌর কর)' : 'Industrial (10% Tax)'}
                </option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#111827] mb-1.5">
                {language === 'bn' ? 'অর্থবছর' : 'Fiscal Year'}
              </label>
              <select
                value={taxInput.fiscalYear}
                onChange={(e) => setTaxInput({ ...taxInput, fiscalYear: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm border border-[#E2E8F0] rounded-xl bg-slate-50 text-[#111827] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#006A4E]/20 focus:border-[#006A4E] transition-colors"
              >
                <option value="2025-2026">
                  {language === 'bn' ? '২০২৫-২০২৬ (চলতি অর্থবছর)' : '2025-2026 (Current FY)'}
                </option>
                <option value="2024-2025">
                  {language === 'bn' ? '২০২৪-২০২৫' : '2024-2025'}
                </option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#111827] mb-1.5">
                {language === 'bn' ? 'প্রতি তলার আয়তন (বর্গফুট) *' : 'Area per Floor (Sq. Ft) *'}
              </label>
              <div className="relative">
                <input
                  type="number"
                  min={200}
                  max={50000}
                  value={taxInput.areaSqFt}
                  onChange={(e) =>
                    setTaxInput({
                      ...taxInput,
                      areaSqFt: Math.max(200, Number(e.target.value) || 200),
                    })
                  }
                  className="w-full pl-3.5 pr-14 py-2.5 text-sm tabular-nums border border-[#E2E8F0] rounded-xl bg-slate-50 text-[#111827] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#006A4E]/20 focus:border-[#006A4E] transition-colors"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-medium pointer-events-none">
                  {language === 'bn' ? 'বর্গফুট' : 'sq ft'}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#111827] mb-1.5">
                {language === 'bn' ? 'তলা সংখ্যা (Floors) *' : 'Number of Floors *'}
              </label>
              <div className="relative">
                <input
                  type="number"
                  min={1}
                  max={40}
                  value={taxInput.floors}
                  onChange={(e) =>
                    setTaxInput({ ...taxInput, floors: Math.max(1, Number(e.target.value) || 1) })
                  }
                  className="w-full pl-3.5 pr-14 py-2.5 text-sm tabular-nums border border-[#E2E8F0] rounded-xl bg-slate-50 text-[#111827] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#006A4E]/20 focus:border-[#006A4E] transition-colors"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-medium pointer-events-none">
                  {language === 'bn' ? 'তলা' : 'floors'}
                </span>
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-[#111827] mb-1.5">
                {language === 'bn' ? 'সড়কের অবস্থান' : 'Road Access Category'}
              </label>
              <div className="grid grid-cols-2 gap-3">
                {(['main_road', 'lane'] as const).map((road) => (
                  <button
                    key={road}
                    type="button"
                    onClick={() => setTaxInput({ ...taxInput, roadWidthCategory: road })}
                    className={`py-2.5 px-3.5 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                      taxInput.roadWidthCategory === road
                        ? 'bg-[#006A4E] text-white border-[#006A4E]'
                        : 'bg-slate-50 text-[#111827] border-[#E2E8F0] hover:border-[#006A4E] hover:bg-[#ECFDF5]'
                    }`}
                  >
                    {road === 'main_road'
                      ? language === 'bn'
                        ? 'প্রধান সড়ক সংলগ্ন'
                        : 'Main Road Facing'
                      : language === 'bn'
                      ? 'অভ্যন্তরীণ গলি / লেন'
                      : 'Internal Lane'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <label className="flex items-center gap-2.5 text-sm text-[#4B5563] pt-3 cursor-pointer border-t border-slate-100">
            <input
              type="checkbox"
              checked={applyRebate}
              onChange={(e) => setApplyRebate(e.target.checked)}
              className="w-4 h-4 accent-[#006A4E] rounded cursor-pointer"
            />
            <span className="font-medium text-slate-800 text-xs sm:text-sm">
              {language === 'bn'
                ? 'অনলাইন আগাম পরিশোধে ১০% সরকারি রিবেট (ছাড়) অন্তর্ভুক্ত করুন'
                : 'Apply 10% Timely Online Settlement Rebate'}
            </span>
          </label>
        </div>

        {/* Right: Calculation Output Card */}
        <div className="lg:col-span-5 bg-[#004D38] text-white rounded-2xl p-6 sm:p-7 flex flex-col justify-between space-y-6 shadow-sm border border-emerald-800">
          <div>
            <div className="flex items-center justify-between border-b border-emerald-700/60 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-200">
                {language === 'bn' ? 'ক্যালকুলেশন ফলাফল' : 'Assessment Output'}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopySummary}
                  className="text-xs text-emerald-200 hover:text-white flex items-center gap-1 font-medium cursor-pointer transition-colors"
                  title="Copy Estimate Summary"
                >
                  {copiedSummary ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-300" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>{language === 'bn' ? 'কপি' : 'Copy'}</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={handlePrint}
                  className="text-xs text-emerald-200 hover:text-white flex items-center gap-1 font-medium cursor-pointer transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>{language === 'bn' ? 'প্রিন্ট' : 'Print'}</span>
                </button>
              </div>
            </div>

            <div className="mt-4 space-y-3 text-xs sm:text-sm">
              <div className="flex justify-between border-b border-emerald-800/80 pb-2.5">
                <span className="text-emerald-100/80">
                  {language === 'bn' ? 'বার্ষিক সম্ভাব্য মূল্যায়ন (ARV)' : 'Annual Rental Valuation'}
                </span>
                <span className="font-semibold font-mono tabular-nums">
                  ৳{calc.annualValuationBdt.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex justify-between border-b border-emerald-800/80 pb-2.5">
                <span className="text-emerald-100/80">
                  {language === 'bn' ? 'সাধারণ পৌর কর (৭%)' : 'General Municipal Tax (7%)'}
                </span>
                <span className="font-semibold font-mono tabular-nums">
                  ৳{calc.annualTaxBdt.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex justify-between border-b border-emerald-800/80 pb-2.5">
                <span className="text-emerald-100/80">
                  {language === 'bn' ? 'আলোকায়ন ও পরিচ্ছন্নতা কর (৩.৫%)' : 'Lighting & Sanitation Tax (3.5%)'}
                </span>
                <span className="font-semibold font-mono tabular-nums">
                  ৳{(calc.conservancyFeeBdt + calc.streetLightFeeBdt).toLocaleString('en-IN')}
                </span>
              </div>

              {applyRebate && (
                <div className="flex justify-between border-b border-emerald-800/80 pb-2.5 text-emerald-300">
                  <span>{language === 'bn' ? '১০% আগাম রিবেট ছাড়' : '10% Early Payment Rebate'}</span>
                  <span className="font-semibold font-mono tabular-nums">
                    - ৳{Math.round(calc.totalPayableBdt * 0.1).toLocaleString('en-IN')}
                  </span>
                </div>
              )}

              <div className="flex justify-between border-b border-emerald-800/80 pb-2.5 text-emerald-100/70">
                <span>{language === 'bn' ? 'ত্রৈমাসিক কিস্তি (Quarterly)' : 'Quarterly Installment'}</span>
                <span className="font-semibold font-mono tabular-nums">
                  ৳{Math.round(netPayable / 4).toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex justify-between pt-2 items-baseline">
                <span className="font-bold text-white text-sm sm:text-base">
                  {language === 'bn' ? 'আনুমানিক মোট বাৎসরিক কর' : 'Total Estimated Annual Tax'}
                </span>
                <span className="text-2xl sm:text-3xl font-bold text-emerald-300 font-mono tabular-nums">
                  ৳{netPayable.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-emerald-800/80">
            <button
              type="button"
              onClick={handleProceedToPay}
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 bg-white hover:bg-emerald-50 text-[#006A4E] font-bold text-sm rounded-xl transition-colors cursor-pointer shadow-xs"
            >
              <span>
                {language === 'bn'
                  ? 'বিল অনুসন্ধান ও পরিশোধ করুন'
                  : 'Search & Pay Verified Bill Online'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-start gap-2 p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-800 text-[11px] text-emerald-200/90 leading-relaxed">
              <Info className="w-3.5 h-3.5 shrink-0 mt-0.5 text-emerald-300" />
              <p>
                {language === 'bn'
                  ? 'এটি একটি আনুমানিক হিসাব। প্রকৃত কর পরিশোধের জন্য কেন্দ্রীয় ডাটাবেজের ভেরিফাইড হোল্ডিং বিল ব্যবহৃত হয়।'
                  : 'This computation is an indicative estimate. Actual billing utilizes municipal ledger assessments.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
