'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { PaymentLayout } from '@/components/payments/PaymentLayout';
import { PaymentReceiptView } from '@/components/payments/PaymentReceiptView';
import { PaymentReceipt } from '@/types/payment';
import { PaymentService } from '@/services/payment/payment-service';
import {
  Download,
  Search,
  AlertCircle,
  Loader2,
  FileText,
  Building2,
  Printer,
} from 'lucide-react';

function DownloadReceiptContent() {
  const { language } = useApp();
  const searchParams = useSearchParams();

  const [receiptNumber, setReceiptNumber] = useState(
    searchParams.get('no') || 'DSCC-RCP-2026-10492'
  );
  const [receipt, setReceipt] = useState<PaymentReceipt | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState('');

  const handleSearch = React.useCallback((queryNum?: string) => {
    const target = queryNum || receiptNumber;
    if (!target.trim()) {
      setSearchError(language === 'bn' ? 'সঠিক রসিদ নম্বর লিখুন।' : 'Enter a valid receipt number.');
      return;
    }

    setIsSearching(true);
    setSearchError('');

    const found = PaymentService.getReceiptByNumberOrTxn(target);
    if (found) {
      setReceipt(found);
    } else {
      setReceipt(null);
      setSearchError(
        language === 'bn'
          ? 'প্রদত্ত নম্বরে কোনো পরিশোধিত সরকারি রসিদ পাওয়া যায়নি। নম্বরটি সঠিকভাবে যাচাই করুন।'
          : 'No official payment receipt found for this number. Please check and retry.'
      );
    }
    setIsSearching(false);
  }, [language, receiptNumber]);

  useEffect(() => {
    queueMicrotask(() => {
      const param = searchParams.get('no');
      if (param) {
        setReceiptNumber(param);
        handleSearch(param);
      } else {
        handleSearch('DSCC-RCP-2026-10492');
      }
    });
  }, [searchParams, handleSearch]);

  return (
    <PaymentLayout
      title={{
        bn: 'পেমেন্ট রশিদ ডাউনলোড ও মুদ্রণ',
        en: 'Download & Print Official Receipt',
      }}
      description={{
        bn: 'আপনার সম্পন্ন পেমেন্টের রসিদ নম্বর বা ট্রানজেকশন আইডি দিয়ে অফিসিয়াল ডিজিটাল রশিদ সংগ্রহ ও প্রিন্ট করুন।',
        en: 'Retrieve and print your official digitally-sealed payment receipt using your Receipt No or Transaction ID.',
      }}
    >
      <div className="space-y-8">
        {/* Search Bar */}
        <div className="print:hidden bg-white rounded-2xl border border-[#E2E8F0] shadow-xs p-6 sm:p-8">
          <div className="max-w-2xl mx-auto space-y-4">
            <div className="text-center space-y-1">
              <div className="w-12 h-12 rounded-2xl bg-[#ECFDF5] text-[#006A4E] border border-emerald-200 flex items-center justify-center mx-auto mb-2">
                <Download className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#111827]">
                {language === 'bn' ? 'সরকারি রসিদ অনুসন্ধান' : 'Find Official Payment Receipt'}
              </h3>
              <p className="text-xs sm:text-sm text-[#4B5563]">
                {language === 'bn'
                  ? 'আপনার এসএমএস বা লেনদেনে প্রাপ্ত রসিদ নম্বর (যেমন: DSCC-RCP-2026-XXXX) বা ট্রানজেকশন রেফারেন্স লিখুন।'
                  : 'Enter receipt number (e.g. DSCC-RCP-2026-XXXX) or transaction ID from your confirmation SMS.'}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={receiptNumber}
                  onChange={(e) => setReceiptNumber(e.target.value)}
                  placeholder="DSCC-RCP-2026-10492"
                  className="w-full pl-10 pr-3.5 py-3 rounded-xl border border-[#E2E8F0] text-sm font-mono bg-[#F8FAFC] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#006A4E]/20 focus:border-[#006A4E] transition-colors"
                  required
                />
              </div>
              <button
                type="button"
                onClick={() => handleSearch()}
                disabled={isSearching || !receiptNumber.trim()}
                className="px-6 py-3 rounded-xl bg-[#006A4E] hover:bg-[#00523C] text-white font-semibold text-sm shadow-xs flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 transition-colors shrink-0"
              >
                {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                <span>{language === 'bn' ? 'রশিদ খুঁজুন' : 'Search Receipt'}</span>
              </button>
            </div>

            {searchError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{searchError}</span>
              </div>
            )}

            <div className="text-center text-xs text-[#4B5563] pt-1 flex flex-wrap items-center justify-center gap-2">
              <span>{language === 'bn' ? 'নমুনা রসিদ:' : 'Sample Receipts:'} </span>
              <button
                type="button"
                onClick={() => {
                  setReceiptNumber('DSCC-RCP-2026-10492');
                  handleSearch('DSCC-RCP-2026-10492');
                }}
                className="font-mono text-[#006A4E] hover:underline cursor-pointer"
              >
                DSCC-RCP-2026-10492 ({language === 'bn' ? 'হোল্ডিং ট্যাক্স' : 'Holding Tax'})
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => {
                  setReceiptNumber('DSCC-RCP-2026-38291');
                  handleSearch('DSCC-RCP-2026-38291');
                }}
                className="font-mono text-[#006A4E] hover:underline cursor-pointer"
              >
                DSCC-RCP-2026-38291 ({language === 'bn' ? 'ট্রেড লাইসেন্স' : 'Trade License'})
              </button>
            </div>
          </div>
        </div>

        {/* Display Receipt Component */}
        {receipt && (
          <div className="animate-in fade-in duration-300">
            <PaymentReceiptView receipt={receipt} />
          </div>
        )}
      </div>
    </PaymentLayout>
  );
}

export default function DownloadReceiptPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-emerald-600" /></div>}>
      <DownloadReceiptContent />
    </Suspense>
  );
}
