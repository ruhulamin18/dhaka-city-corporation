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
  FileCheck,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
  Loader2,
  CheckCircle2,
  FileText,
  Clock,
} from 'lucide-react';

function ApplicationFeeContent() {
  const { language } = useApp();
  const { user } = useAuth();
  const searchParams = useSearchParams();

  const [applicationId, setApplicationId] = useState(
    searchParams.get('appId') || 'APP-DSCC-2026-44109'
  );
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState('');

  const [bill, setBill] = useState<BillLookupRecord | null>(null);
  const [payerName, setPayerName] = useState(
    user ? (language === 'bn' ? user.nameBn || user.nameEn : user.nameEn || user.nameBn) : ''
  );
  const [payerPhone, setPayerPhone] = useState(user?.phone || '');
  const [selectedMethod, setSelectedMethod] = useState<PaymentProviderMethod>('nagad');
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

  const [activeTransaction, setActiveTransaction] = useState<PaymentTransaction | null>(null);
  const [isGatewayOpen, setIsGatewayOpen] = useState(false);
  const [completedReceipt, setCompletedReceipt] = useState<PaymentReceipt | null>(null);

  const handleLookup = React.useCallback(async (appId?: string) => {
    const target = appId || applicationId;
    if (!target.trim()) {
      setSearchError(language === 'bn' ? 'সঠিক আবেদন ট্র্যাকিং নম্বর লিখুন।' : 'Please enter an application tracking number.');
      return;
    }

    setIsSearching(true);
    setSearchError('');
    setCompletedReceipt(null);

    try {
      const result = await PaymentService.lookupBill('APPLICATION', target, 15);
      setBill(result);
      if (!payerName) setPayerName(result.payerName[language]);
      if (!payerPhone && result.payerPhone) setPayerPhone(result.payerPhone);
    } catch (err: unknown) {
      const error = err as Error;
      setSearchError(error.message || 'আবেদন তথ্য পাওয়া যায়নি।');
      setBill(null);
    } finally {
      setIsSearching(false);
    }
  }, [applicationId, language, payerName, payerPhone]);

  useEffect(() => {
    const param = searchParams.get('appId');
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
        bn: 'নাগরিক সেবা আবেদন ফি পরিশোধ',
        en: 'Civic Service Application Fee Payment',
      }}
      description={{
        bn: 'অনলাইনে জমাকৃত নাগরিক সেবা আবেদনের ট্র্যাকিং আইডি দিয়ে ফি যাচাই করুন এবং তাৎক্ষণিক অনলাইন পরিশোধের মাধ্যমে আবেদন প্রক্রিয়া সচল করুন।',
        en: 'Verify fees using your civic application tracking ID and pay online to expedite municipal processing.',
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
                    ? 'আবেদন ফি সফলভাবে গৃহীত হয়েছে!'
                    : 'Application processing fee accepted successfully!'}
                </span>
              </div>
              <button
                onClick={() => {
                  setCompletedReceipt(null);
                  handleLookup();
                }}
                className="text-xs font-semibold text-emerald-800 underline hover:text-emerald-950"
              >
                {language === 'bn' ? 'অন্য আবেদন অনুসন্ধান করুন' : 'Search Another Application'}
              </button>
            </div>
            <PaymentReceiptView receipt={completedReceipt} />
          </div>
        ) : (
          <>
            {/* Search Box */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
              <div className="max-w-2xl mx-auto space-y-4">
                <div className="text-center space-y-1">
                  <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center mx-auto mb-2">
                    <FileCheck className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">
                    {language === 'bn' ? 'আবেদন ট্র্যাকিং আইডি অনুসন্ধান' : 'Search Application Tracking ID'}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500">
                    {language === 'bn'
                      ? 'নাগরিক সেবা পোর্টাল থেকে প্রাপ্ত আবেদন রেফারেন্স কোডটি প্রদান করুন।'
                      : 'Enter tracking code received during online civic service application submission.'}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={applicationId}
                      onChange={(e) => setApplicationId(e.target.value)}
                      placeholder="APP-DSCC-2026-44109"
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      required
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleLookup()}
                    disabled={isSearching || !applicationId.trim()}
                    className="px-6 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-sm shadow-md flex items-center justify-center space-x-1.5 cursor-pointer disabled:bg-slate-300"
                  >
                    {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                    <span>{isSearching ? (language === 'bn' ? 'অনুসন্ধান...' : 'Searching...') : (language === 'bn' ? 'খুঁজুন' : 'Search')}</span>
                  </button>
                </div>

                {searchError && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{searchError}</span>
                  </div>
                )}

                <div className="text-center text-xs text-slate-500 pt-1">
                  <span>{language === 'bn' ? 'নমুনা ট্র্যাকিং আইডি:' : 'Sample Tracking ID:'} </span>
                  <button
                    type="button"
                    onClick={() => {
                      setApplicationId('APP-DSCC-2026-44109');
                      handleLookup('APP-DSCC-2026-44109');
                    }}
                    className="font-mono text-teal-700 underline"
                  >
                    APP-DSCC-2026-44109
                  </button>
                </div>
              </div>
            </div>

            {/* Bill & Payment */}
            {bill && (
              <div className="space-y-8 animate-in fade-in duration-300">
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                  <PaymentMethodSelector
                    selectedMethod={selectedMethod}
                    onSelect={setSelectedMethod}
                    amount={bill.totalPayable}
                  />
                </div>

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

export default function ApplicationFeePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-teal-600" /></div>}>
      <ApplicationFeeContent />
    </Suspense>
  );
}
