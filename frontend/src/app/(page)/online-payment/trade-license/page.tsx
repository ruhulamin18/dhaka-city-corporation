'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
import { PaymentLayout } from '@/components/payments/PaymentLayout';
import { PaymentSummary } from '@/components/payments/PaymentSummary';
import { PaymentMethodSelector } from '@/components/payments/PaymentMethodSelector';
import { PaymentGatewayModal } from '@/components/payments/PaymentGatewayModal';
import { PaymentReceiptView } from '@/components/payments/PaymentReceiptView';
import { BillLookupRecord, PaymentProviderMethod, PaymentReceipt, PaymentTransaction } from '@/types/payment';
import { PaymentService } from '@/services/payment/payment-service';
import {
  Search,
  FileText,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
  Loader2,
  CheckCircle2,
  Briefcase,
  Store,
  Info,
} from 'lucide-react';

function TradeLicenseContent() {
  const { language } = useApp();
  const { user } = useAuth();
  const searchParams = useSearchParams();

  // Search form
  const [licenseNumber, setLicenseNumber] = useState(
    searchParams.get('license') || 'TRAD/DSCC/019284/2026'
  );
  const [wardNumber, setWardNumber] = useState<number>(21);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState('');

  // Bill & Checkout
  const [bill, setBill] = useState<BillLookupRecord | null>(null);
  const [payerName, setPayerName] = useState(
    user ? (language === 'bn' ? user.nameBn || user.nameEn : user.nameEn || user.nameBn) : ''
  );
  const [payerPhone, setPayerPhone] = useState(user?.phone || '');
  const [selectedMethod, setSelectedMethod] = useState<PaymentProviderMethod>('card');
  const [isInitiating, setIsInitiating] = useState(false);

  useEffect(() => {
    if (user) {
      if (!payerName) {
        setPayerName(language === 'bn' ? user.nameBn || user.nameEn : user.nameEn || user.nameBn);
      }
      if (!payerPhone && user.phone) {
        setPayerPhone(user.phone);
      }
    }
  }, [user, language, payerName, payerPhone]);

  // Gateway Modal & Completion
  const [activeTransaction, setActiveTransaction] = useState<PaymentTransaction | null>(null);
  const [isGatewayOpen, setIsGatewayOpen] = useState(false);
  const [completedReceipt, setCompletedReceipt] = useState<PaymentReceipt | null>(null);

  const handleLookup = React.useCallback(async (licNo?: string) => {
    const targetLicense = licNo || licenseNumber;
    if (!targetLicense.trim()) {
      setSearchError(language === 'bn' ? 'সঠিক ট্রেড লাইসেন্স নম্বর লিখুন।' : 'Please enter a valid trade license number.');
      return;
    }

    setIsSearching(true);
    setSearchError('');
    setCompletedReceipt(null);

    try {
      const result = await PaymentService.lookupBill('TRADE_LICENSE', targetLicense, wardNumber);
      setBill(result);
      if (!payerName) setPayerName(result.payerName[language]);
      if (!payerPhone && result.payerPhone) setPayerPhone(result.payerPhone);
    } catch (err: unknown) {
      const error = err as Error;
      setSearchError(error.message || 'ট্রেড লাইসেন্স তথ্য পাওয়া যায়নি।');
      setBill(null);
    } finally {
      setIsSearching(false);
    }
  }, [language, licenseNumber, payerName, payerPhone, wardNumber]);

  useEffect(() => {
    const param = searchParams.get('license');
    if (param) {
      queueMicrotask(() => {
        handleLookup(param);
      });
    }
  }, [searchParams, handleLookup]);

  const handleProceedToPay = async () => {
    if (!bill) return;

    setIsInitiating(true);
    try {
      const trx = await PaymentService.initiateTransaction(bill, selectedMethod, {
        name: payerName,
        phone: payerPhone,
        userId: user?.id,
      });
      setActiveTransaction(trx);
      setIsGatewayOpen(true);
    } catch {
      alert(language === 'bn' ? 'লেনদেন শুরু করতে সমস্যা হয়েছে।' : 'Failed to initiate transaction.');
    } finally {
      setIsInitiating(false);
    }
  };

  return (
    <PaymentLayout
      title={{
        bn: 'ট্রেড লাইসেন্স ফি ও নবায়ন',
        en: 'Trade License Fee & Renewal',
      }}
      description={{
        bn: 'আপনার ব্যবসা প্রতিষ্ঠানের ট্রেড লাইসেন্স নম্বর বা টিআইএন দিয়ে তথ্য যাচাই করুন এবং সরকারি ফি, সাইনবোর্ড কর ও ভ্যাট অনলাইনে পরিশোধ করুন।',
        en: 'Verify your business trade license or TIN, and settle official issuance/renewal fees, signboard taxes, and VAT online.',
      }}
    >
      <div className="space-y-10">
        {completedReceipt ? (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                <span className="text-sm font-bold text-emerald-900">
                  {language === 'bn'
                    ? 'ট্রেড লাইসেন্স ফি সফলভাবে পরিশোধিত হয়েছে!'
                    : 'Trade License fee paid successfully!'}
                </span>
              </div>
              <button
                onClick={() => {
                  setCompletedReceipt(null);
                  handleLookup();
                }}
                className="text-xs font-semibold text-emerald-800 underline hover:text-emerald-950"
              >
                {language === 'bn' ? 'আরেকটি লাইসেন্স অনুসন্ধান করুন' : 'Search Another License'}
              </button>
            </div>
            <PaymentReceiptView receipt={completedReceipt} />
          </div>
        ) : (
          <>
            {/* Search Box */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
              <div className="max-w-3xl mx-auto space-y-4">
                <div className="text-center space-y-1">
                  <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center mx-auto mb-2">
                    <Store className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">
                    {language === 'bn' ? 'ট্রেড লাইসেন্স অনুসন্ধান' : 'Search Trade License Registry'}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500">
                    {language === 'bn'
                      ? 'লাইসেন্স নম্বর অথবা ১২-সংখ্যার ই-ট্রেড আইডি দিয়ে নবায়ন বা মূল্যায়িত ফি দেখুন।'
                      : 'Enter Trade License Number or 12-digit e-Trade ID to look up renewal fees.'}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-2">
                  <div className="sm:col-span-4">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      {language === 'bn' ? 'ব্যবসায়িক ওয়ার্ড' : 'Business Ward'}
                    </label>
                    <select
                      value={wardNumber}
                      onChange={(e) => setWardNumber(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      {Array.from({ length: 54 }, (_, i) => i + 1).map((w) => (
                        <option key={w} value={w}>
                          {language === 'bn' ? `ওয়ার্ড নং ${w}` : `Ward No ${w}`}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="sm:col-span-5">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      {language === 'bn' ? 'ট্রেড লাইসেন্স নম্বর *' : 'Trade License No *'}
                    </label>
                    <div className="relative">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={licenseNumber}
                        onChange={(e) => setLicenseNumber(e.target.value)}
                        placeholder="TRAD/DSCC/019284/2026"
                        className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-3 flex items-end">
                    <button
                      type="button"
                      onClick={() => handleLookup()}
                      disabled={isSearching || !licenseNumber.trim()}
                      className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition-all duration-200 flex items-center justify-center space-x-1.5 shadow-md cursor-pointer disabled:bg-slate-300 disabled:cursor-not-allowed"
                    >
                      {isSearching ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Search className="w-4 h-4" />
                      )}
                      <span>{isSearching ? (language === 'bn' ? 'অনুসন্ধান...' : 'Searching...') : (language === 'bn' ? 'খুঁজুন' : 'Search')}</span>
                    </button>
                  </div>
                </div>

                {searchError && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{searchError}</span>
                  </div>
                )}

                <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500 pt-2 border-t border-slate-100">
                  <span>{language === 'bn' ? 'নমুনা লাইসেন্স:' : 'Sample License:'}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setLicenseNumber('TRAD/DSCC/019284/2026');
                      setWardNumber(21);
                      handleLookup('TRAD/DSCC/019284/2026');
                    }}
                    className="font-mono text-blue-700 underline hover:text-blue-900 cursor-pointer"
                  >
                    TRAD/DSCC/019284/2026 (বায়তুল মোকাররম / Ward 21)
                  </button>
                </div>
              </div>
            </div>

            {/* Bill & Payment Checkout */}
            {bill && (
              <div className="space-y-8 animate-in fade-in duration-300">
                {/* Method Selector */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                  <PaymentMethodSelector
                    selectedMethod={selectedMethod}
                    onSelect={setSelectedMethod}
                    amount={bill.totalPayable}
                  />
                </div>

                {/* Summary & Form */}
                <PaymentSummary
                  bill={bill}
                  payerName={payerName}
                  payerPhone={payerPhone}
                  onPayerNameChange={setPayerName}
                  onPayerPhoneChange={setPayerPhone}
                  onProceedToPay={handleProceedToPay}
                  isProcessing={isInitiating}
                />
              </div>
            )}

            {/* Business Information Guidelines */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
              <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3">
                <div className="flex items-center space-x-2 text-blue-900 font-bold text-sm">
                  <Briefcase className="w-4 h-4 text-blue-600" />
                  <span>{language === 'bn' ? 'ট্রেড লাইসেন্স ফি নির্ধারণ বিধিমালা' : 'Trade License Statutory Schedule'}</span>
                </div>
                <ul className="text-xs text-slate-600 space-y-2 list-disc list-inside leading-relaxed">
                  <li>
                    {language === 'bn'
                      ? 'ব্যবসার ধরন ও পরিধি অনুযায়ী স্থানীয় সরকার বিধি অনুযায়ী মূল ফি নির্ধারিত হয়।'
                      : 'Base license fees are governed by Local Government Commercial Category schedules.'}
                  </li>
                  <li>
                    {language === 'bn'
                      ? 'দোকান বা অফিসের বহির্ভাগে স্থাপিত সাইনবোর্ডের বর্গফুট অনুযায়ী বাৎসরিক সাইনবোর্ড কর ধার্য হয়।'
                      : 'Annual signboard advertisement tax is computed according to exterior signage square footage.'}
                  </li>
                  <li>
                    {language === 'bn'
                      ? 'সরকারি বিধি মোতাবেক ১৫% মূসক (ভ্যাট) ও উৎস কর সরাসরি জাতীয় রাজস্ব বোর্ডে পরিশোধিত হয়।'
                      : 'Statutory 15% VAT & AIT are credited directly under National Board of Revenue rules.'}
                  </li>
                </ul>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3">
                <div className="flex items-center space-x-2 text-blue-900 font-bold text-sm">
                  <HelpCircle className="w-4 h-4 text-blue-600" />
                  <span>{language === 'bn' ? 'লাইসেন্স নবায়ন তথ্যকেন্দ্র' : 'License Renewal Helpdesk'}</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {language === 'bn'
                    ? 'অনলাইনে ফি পরিশোধের পর কিউআর কোডসহ তাৎক্ষণিক ই-ট্রেড লাইসেন্স ডাউনলোড করা যায়। বিস্তারিত তথ্যের জন্য বাণিজ্য বিভাগে যোগাযোগ করুন।'
                    : 'Download your QR-verified electronic trade license immediately upon payment completion.'}
                </p>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700">
                  <span className="font-semibold">{language === 'bn' ? 'বাণিজ্য ও লাইসেন্স শাখা:' : 'Commerce & Trade Wing:'} </span>
                  02-223385555 | trade-license@dscc.gov.bd
                </div>
              </div>
            </div>
          </>
        )}

        <PaymentGatewayModal
          isOpen={isGatewayOpen}
          onClose={() => setIsGatewayOpen(false)}
          transaction={activeTransaction}
          paymentMethod={selectedMethod}
          onPaymentSuccess={(receipt) => {
            setCompletedReceipt(receipt);
            setIsGatewayOpen(false);
          }}
        />
      </div>
    </PaymentLayout>
  );
}

export default function TradeLicensePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>}>
      <TradeLicenseContent />
    </Suspense>
  );
}
