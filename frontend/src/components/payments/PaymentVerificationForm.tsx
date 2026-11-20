'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { PublicVerificationResult } from '@/types/payment';
import { PaymentVerificationService } from '@/services/payment/payment-verification';
import {
  Search,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Building2,
  Calendar,
  ExternalLink,
} from 'lucide-react';

interface PaymentVerificationFormProps {
  initialQuery?: string;
}

export const PaymentVerificationForm: React.FC<PaymentVerificationFormProps> = ({
  initialQuery = '',
}) => {
  const { language } = useApp();
  const [query, setQuery] = useState(initialQuery);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<PublicVerificationResult | null>(null);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    try {
      const res = await PaymentVerificationService.verifyPublicReceipt(query);
      setResult(res);
    } catch {
      setResult({
        verified: false,
        status: 'INVALID',
        verificationMessage: {
          bn: 'যাচাইকরণে সার্ভার সমস্যা দেখা দিয়েছে। কিছুক্ষণ পর পুনরায় চেষ্টা করুন।',
          en: 'A server error occurred during verification. Please try again shortly.',
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString(language === 'bn' ? 'bn-BD' : 'en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-6">
      {/* Verification Query Form */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
        <div className="max-w-2xl mx-auto text-center space-y-2 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-2">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">
            {language === 'bn' ? 'সরকারি পেমেন্ট রশিদ ও লেনদেন যাচাই' : 'Verify Government Payment Receipt'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-500">
            {language === 'bn'
              ? 'আপনার রশিদে উল্লেখিত রশিদ নম্বর (যেমন: DSCC-RCP-2026-10492) বা ট্রানজেকশন আইডি দিয়ে কেন্দ্রীয় ডাটাবেজে সঠিকতা নিশ্চিত করুন।'
              : 'Enter the official Receipt Number (e.g. DSCC-RCP-2026-10492) or Transaction ID to verify against the central treasury ledger.'}
          </p>
        </div>

        <form onSubmit={handleVerify} className="max-w-2xl mx-auto flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="DSCC-RCP-2026-XXXXX / TXN-2026-XXXXX"
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-mono"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading || !query.trim()}
            className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm transition-all duration-200 flex items-center justify-center space-x-2 shadow-md cursor-pointer disabled:bg-slate-300 disabled:cursor-not-allowed shrink-0"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <ShieldCheck className="w-4 h-4" />
            )}
            <span>{isLoading ? (language === 'bn' ? 'যাচাই হচ্ছে...' : 'Verifying...') : (language === 'bn' ? 'যাচাই করুন' : 'Verify Now')}</span>
          </button>
        </form>

        {/* Quick test hints */}
        <div className="max-w-2xl mx-auto mt-4 pt-4 border-t border-slate-100 flex items-center justify-center space-x-2 text-xs text-slate-500">
          <span>{language === 'bn' ? 'পরীক্ষামূলক আইডি:' : 'Test IDs:'}</span>
          <button
            type="button"
            onClick={() => setQuery('DSCC-RCP-2026-10492')}
            className="font-mono text-emerald-700 underline hover:text-emerald-900 cursor-pointer"
          >
            DSCC-RCP-2026-10492
          </button>
          <span>•</span>
          <button
            type="button"
            onClick={() => setQuery('DSCC-RCP-2026-38291')}
            className="font-mono text-emerald-700 underline hover:text-emerald-900 cursor-pointer"
          >
            DSCC-RCP-2026-38291
          </button>
        </div>
      </div>

      {/* Verification Result Card */}
      {result && (
        <div
          className={`bg-white rounded-2xl border-2 shadow-sm p-6 sm:p-8 animate-in fade-in duration-300 ${
            result.verified
              ? 'border-emerald-500 bg-emerald-50/20'
              : 'border-rose-300 bg-rose-50/20'
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
            <div className="flex items-center space-x-3">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  result.verified
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-rose-100 text-rose-700'
                }`}
              >
                {result.verified ? (
                  <CheckCircle2 className="w-7 h-7" />
                ) : (
                  <AlertTriangle className="w-7 h-7" />
                )}
              </div>
              <div>
                <span
                  className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    result.verified
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {result.status}
                </span>
                <h4 className="text-base sm:text-lg font-bold text-slate-900 mt-1">
                  {result.verificationMessage[language]}
                </h4>
              </div>
            </div>

            {result.verified && result.receiptNumber && (
              <Link
                href={`/online-payment/receipt?no=${result.receiptNumber}`}
                className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 shadow-xs cursor-pointer self-start sm:self-auto"
              >
                <span>{language === 'bn' ? 'মূল রশিদ প্রদর্শন' : 'View Full Receipt'}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>

          {result.verified && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-6 text-xs sm:text-sm">
              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <span className="text-slate-500 block text-xs mb-1">
                  {language === 'bn' ? 'রশিদ নম্বর' : 'Receipt Number'}
                </span>
                <span className="font-mono font-bold text-slate-900">{result.receiptNumber}</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <span className="text-slate-500 block text-xs mb-1">
                  {language === 'bn' ? 'ট্রানজেকশন রেফারেন্স' : 'Transaction Ref'}
                </span>
                <span className="font-mono font-bold text-slate-900">{result.transactionReference}</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <span className="text-slate-500 block text-xs mb-1">
                  {language === 'bn' ? 'পরিশোধিত অর্থ' : 'Amount Paid'}
                </span>
                <span className="font-mono font-bold text-emerald-700 text-base">
                  ৳{result.amount?.toLocaleString('en-IN')} BDT
                </span>
              </div>
              {result.serviceName && (
                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <span className="text-slate-500 block text-xs mb-1">
                    {language === 'bn' ? 'সেবার বিবরণ' : 'Service Type'}
                  </span>
                  <span className="font-semibold text-slate-800">{result.serviceName[language]}</span>
                </div>
              )}
              {result.wardNumber && (
                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <span className="text-slate-500 block text-xs mb-1">
                    {language === 'bn' ? 'আওতাধীন ওয়ার্ড' : 'Jurisdiction Ward'}
                  </span>
                  <span className="font-semibold text-slate-800">Ward {result.wardNumber}</span>
                </div>
              )}
              {result.paymentDate && (
                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <span className="text-slate-500 block text-xs mb-1">
                    {language === 'bn' ? 'পরিশোধের তারিখ' : 'Payment Date'}
                  </span>
                  <span className="font-medium text-slate-800">{formatDate(result.paymentDate)}</span>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
