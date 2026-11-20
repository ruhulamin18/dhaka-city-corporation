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
  Building,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
  Loader2,
  CheckCircle2,
  Calendar,
  Sparkles,
  Info,
} from 'lucide-react';

function HoldingTaxContent() {
  const { language } = useApp();
  const { user } = useAuth();
  const searchParams = useSearchParams();

  // Search form states
  const [holdingNumber, setHoldingNumber] = useState(searchParams.get('holding') || 'H-10482');
  const [wardNumber, setWardNumber] = useState<number>(19);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState('');

  // Bill & Checkout states
  const [bill, setBill] = useState<BillLookupRecord | null>(null);
  const [payerName, setPayerName] = useState(user?.name || '');
  const [payerPhone, setPayerPhone] = useState(user?.phone || '');
  const [selectedMethod, setSelectedMethod] = useState<PaymentProviderMethod>('bkash');
  const [isInitiating, setIsInitiating] = useState(false);

  // Gateway Modal & Completion states
  const [activeTransaction, setActiveTransaction] = useState<PaymentTransaction | null>(null);
  const [isGatewayOpen, setIsGatewayOpen] = useState(false);
  const [completedReceipt, setCompletedReceipt] = useState<PaymentReceipt | null>(null);

  const handleLookup = React.useCallback(async (hNo?: string) => {
    const targetHolding = hNo || holdingNumber;
    if (!targetHolding.trim()) {
      setSearchError(language === 'bn' ? 'সঠিক হোল্ডিং নম্বর লিখুন।' : 'Please enter a valid holding number.');
      return;
    }

    setIsSearching(true);
    setSearchError('');
    setCompletedReceipt(null);

    try {
      const result = await PaymentService.lookupBill('HOLDING_TAX', targetHolding, wardNumber);
      setBill(result);
      if (!payerName) setPayerName(result.payerName[language]);
      if (!payerPhone && result.payerPhone) setPayerPhone(result.payerPhone);
    } catch (err: unknown) {
      const error = err as Error;
      setSearchError(error.message || 'হোল্ডিং তথ্য পাওয়া যায়নি।');
      setBill(null);
    } finally {
      setIsSearching(false);
    }
  }, [holdingNumber, language, payerName, payerPhone, wardNumber]);

  // Auto-search on mount if holding param is present
  useEffect(() => {
    const paramHolding = searchParams.get('holding');
    if (paramHolding) {
      queueMicrotask(() => {
        handleLookup(paramHolding);
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
        bn: 'হোল্ডিং ট্যাক্স পরিশোধ',
        en: 'Holding Tax Payment',
      }}
      description={{
        bn: 'আপনার আবাসিক বা বাণিজ্যিক হোল্ডিং নম্বর দিয়ে বিল অনুসন্ধান করুন এবং সরকার নির্ধারিত ১০% রিবেটসহ অনলাইন কর পরিশোধ করুন।',
        en: 'Search your residential or commercial property tax dues and pay online with 10% timely payment rebate.',
      }}
    >
      <div className="space-y-10">
        {/* If payment just completed, show official receipt view directly */}
        {completedReceipt ? (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                <span className="text-sm font-bold text-emerald-900">
                  {language === 'bn'
                    ? 'আপনার হোল্ডিং ট্যাক্স সফলভাবে পরিশোধিত হয়েছে!'
                    : 'Your Holding Tax has been paid successfully!'}
                </span>
              </div>
              <button
                onClick={() => {
                  setCompletedReceipt(null);
                  handleLookup();
                }}
                className="text-xs font-semibold text-emerald-800 underline hover:text-emerald-950"
              >
                {language === 'bn' ? 'আরেকটি হোল্ডিং অনুসন্ধান করুন' : 'Search Another Holding'}
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
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-2">
                    <Building className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">
                    {language === 'bn' ? 'হোল্ডিং কর বিল অনুসন্ধান' : 'Holding Tax Bill Assessment Search'}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500">
                    {language === 'bn'
                      ? 'সিটি কর্পোরেশনের কেন্দ্রীয় হোল্ডিং ডেটাবেজ থেকে চলতি বকেয়া ও মূল্যায়ন তথ্য পেতে হোল্ডিং ও ওয়ার্ড নম্বর লিখুন।'
                      : 'Enter holding and ward number to retrieve authentic property tax dues and assessment from the central registry.'}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-2">
                  <div className="sm:col-span-4">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      {language === 'bn' ? 'ওয়ার্ড নম্বর' : 'Ward Number'}
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
                      {language === 'bn' ? 'হোল্ডিং নম্বর *' : 'Holding Number *'}
                    </label>
                    <div className="relative">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={holdingNumber}
                        onChange={(e) => setHoldingNumber(e.target.value)}
                        placeholder="H-10482"
                        className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-3 flex items-end">
                    <button
                      type="button"
                      onClick={() => handleLookup()}
                      disabled={isSearching || !holdingNumber.trim()}
                      className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm transition-all duration-200 flex items-center justify-center space-x-1.5 shadow-md cursor-pointer disabled:bg-slate-300 disabled:cursor-not-allowed"
                    >
                      {isSearching ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Search className="w-4 h-4" />
                      )}
                      <span>{isSearching ? (language === 'bn' ? 'খোঁজা হচ্ছে...' : 'Searching...') : (language === 'bn' ? 'খুঁজুন' : 'Search')}</span>
                    </button>
                  </div>
                </div>

                {searchError && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{searchError}</span>
                  </div>
                )}

                {/* Sample Holding Numbers Helper */}
                <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500 pt-2 border-t border-slate-100">
                  <span>{language === 'bn' ? 'পরীক্ষামূলক হোল্ডিং:' : 'Test Holdings:'}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setHoldingNumber('H-10482');
                      setWardNumber(19);
                      handleLookup('H-10482');
                    }}
                    className="font-mono text-emerald-700 underline hover:text-emerald-900 cursor-pointer"
                  >
                    H-10482 (বনানী / Ward 19)
                  </button>
                  <span>•</span>
                  <button
                    type="button"
                    onClick={() => {
                      setHoldingNumber('H-20915');
                      setWardNumber(34);
                      handleLookup('H-20915');
                    }}
                    className="font-mono text-emerald-700 underline hover:text-emerald-900 cursor-pointer"
                  >
                    H-20915 (নাজিরাবাজার / Ward 34)
                  </button>
                </div>
              </div>
            </div>

            {/* Bill Details & Payment Breakdown */}
            {bill && (
              <div className="space-y-8 animate-in fade-in duration-300">
                {/* 10% Rebate Notice Banner */}
                {bill.rebateAmount > 0 && (
                  <div className="bg-gradient-to-r from-emerald-500/10 via-emerald-500/15 to-teal-500/10 border border-emerald-300 rounded-2xl p-4 sm:p-5 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                        <Sparkles className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-emerald-950">
                          {language === 'bn'
                            ? 'অভিনন্দন! আপনি ১০% রিবেট (সরকারি ছাড়) পাচ্ছেন'
                            : 'Congratulations! You qualify for a 10% Early Payment Rebate'}
                        </h4>
                        <p className="text-xs text-emerald-800">
                          {language === 'bn'
                            ? `চলতি অর্থবছরের কর নির্ধারিত সময়ে এককালীন পরিশোধ করায় আপনার বিলে ৳${bill.rebateAmount.toLocaleString('en-IN')} ছাড় প্রয়োগ করা হয়েছে।`
                            : `Due to timely settlement, a discount of ৳${bill.rebateAmount.toLocaleString('en-IN')} has been deducted from your current assessment.`}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Payment Method Selector */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                  <PaymentMethodSelector
                    selectedMethod={selectedMethod}
                    onSelect={setSelectedMethod}
                    amount={bill.totalPayable}
                  />
                </div>

                {/* Bill Breakdown & Payer Details */}
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

            {/* Guidelines & FAQs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
              <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3">
                <div className="flex items-center space-x-2 text-emerald-800 font-bold text-sm">
                  <Info className="w-4 h-4 text-emerald-600" />
                  <span>{language === 'bn' ? 'হোল্ডিং কর পরিশোধ নির্দেশিকা' : 'Holding Tax Payment Guidelines'}</span>
                </div>
                <ul className="text-xs text-slate-600 space-y-2 list-disc list-inside leading-relaxed">
                  <li>
                    {language === 'bn'
                      ? 'প্রতি অর্থবছরের প্রথম ও দ্বিতীয় প্রান্তিকের মধ্যে কর পরিশোধ করলে ১০% রিবেট স্বয়ংক্রিয়ভাবে প্রযোজ্য হয়।'
                      : 'Settling holding tax within Q1 and Q2 automatically unlocks a 10% early payment rebate.'}
                  </li>
                  <li>
                    {language === 'bn'
                      ? 'অনলাইনে পরিশোধিত অর্থ সরাসরি সরকারি ট্রেজারি ফান্ডে জমা হয় এবং সাথে সাথে ডিজিটাল রসিদ পাওয়া যায়।'
                      : 'Funds go directly to the city treasury with instant downloadable and verifiable digital receipt.'}
                  </li>
                  <li>
                    {language === 'bn'
                      ? 'বকেয়া বিল থাকলে সরকারি সারচার্জ সংযুক্ত হতে পারে।'
                      : 'Arrears beyond the deadline may incur statutory civic late surcharges.'}
                  </li>
                </ul>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3">
                <div className="flex items-center space-x-2 text-emerald-800 font-bold text-sm">
                  <HelpCircle className="w-4 h-4 text-emerald-600" />
                  <span>{language === 'bn' ? 'সহায়তা ও যোগাযোগ' : 'Helpdesk & Support'}</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {language === 'bn'
                    ? 'হোল্ডিং মূল্যায়ন, করের হার বা মালিকানা সংক্রান্ত যে কোনো তথ্যের জন্য আপনার সংশ্লিষ্ট অঞ্চল রাজস্ব কর্মকর্তার সাথে যোগাযোগ করুন অথবা হেল্পলাইন ১৬১০৬ নম্বরে কল করুন।'
                    : 'For queries regarding assessment value, tax rates, or property ownership changes, contact your zonal revenue office or call helpline 16106.'}
                </p>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700">
                  <span className="font-semibold">{language === 'bn' ? 'রাজস্ব শাখা:' : 'Revenue Wing:'} </span>
                  02-223381234 | holding-tax@dscc.gov.bd
                </div>
              </div>
            </div>
          </>
        )}

        {/* Modal Simulator */}
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

export default function HoldingTaxPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-emerald-600" /></div>}>
      <HoldingTaxContent />
    </Suspense>
  );
}
