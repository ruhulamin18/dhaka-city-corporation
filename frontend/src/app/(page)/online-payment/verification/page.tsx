'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { PaymentLayout } from '@/components/payments/PaymentLayout';
import { PaymentVerificationForm } from '@/components/payments/PaymentVerificationForm';
import { ShieldCheck, Loader2, Lock, CheckCircle2 } from 'lucide-react';

function VerificationContent() {
  const { language } = useApp();
  const searchParams = useSearchParams();
  const initialRef = searchParams.get('ref') || '';

  return (
    <PaymentLayout
      title={{
        bn: 'সরকারি পেমেন্ট ও রসিদ সত্যতা যাচাই',
        en: 'Official Payment & Receipt Verification',
      }}
      description={{
        bn: 'সিটি কর্পোরেশনের কেন্দ্রীয় রাজস্ব ডাটাবেজে আপনার রসিদ বা ট্রানজেকশনের সত্যতা ও সরকারি কোষাগারে জমাকৃত স্ট্যাটাস তাৎক্ষণিক যাচাই করুন।',
        en: 'Instantly verify receipt authenticity, transaction settlement, and central treasury crediting records.',
      }}
    >
      <div className="space-y-10">
        <PaymentVerificationForm initialQuery={initialRef} />

        {/* Verification Guarantee & Security Notice */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-4">
          <div className="flex items-center space-x-3 text-emerald-800">
            <Lock className="w-5 h-5 text-emerald-600" />
            <h4 className="font-bold text-base text-slate-900">
              {language === 'bn' ? 'ডিজিটাল যাচাইকরণ নিরাপত্তা প্রোটোকল' : 'Digital Verification Security Protocol'}
            </h4>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {language === 'bn'
              ? 'ঢাকা সিটি কর্পোরেশনের কেন্দ্রীয় ই-পেমেন্ট যাচাইকরণ সার্ভার সরাসরি বাংলাদেশ ব্যাংকের জাতীয় পেমেন্ট সুইচ বাংলাদেশ (NPSB) ও সরকারি সমন্বিত অর্থ ব্যবস্থাপনা প্ল্যাটফর্মের সাথে সংযুক্ত। প্রতিটি রসিদে ডিজিটাল হ্যাশ ও কিউআর যাচাই কোড সংযুক্ত থাকে যা কোনোরূপ কারসাজি বা জালিয়াতি প্রতিরোধ করে।'
              : 'Dhaka City Corporation Central E-Payment Verification engine is integrated with Bangladesh Bank National Payment Switch and Government Integrated Financial Management Systems. Every issued receipt carries an unalterable SHA-256 digital verification hash preventing any falsification.'}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
            <div className="flex items-center space-x-2 text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{language === 'bn' ? 'ব্যক্তিগত তথ্য গোপনীয়তা বজায়' : 'PII Data Masked & Protected'}</span>
            </div>
            <div className="flex items-center space-x-2 text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{language === 'bn' ? '২৪/৭ সার্বক্ষণিক অনলাইন অডিট' : '24/7 Live Central Treasury Audit'}</span>
            </div>
            <div className="flex items-center space-x-2 text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{language === 'bn' ? 'আদালত ও ব্যাংকে গ্রহণযোগ্য' : 'Legally Admissible Proof'}</span>
            </div>
          </div>
        </div>
      </div>
    </PaymentLayout>
  );
}

export default function VerificationPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-emerald-600" /></div>}>
      <VerificationContent />
    </Suspense>
  );
}
