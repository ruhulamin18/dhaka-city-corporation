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
import { STATUTORY_CERTIFICATE_FEES } from '@/config/payment-config';
import { BillLookupRecord, PaymentProviderMethod, PaymentReceipt, PaymentTransaction } from '@/types/payment';
import { PaymentService } from '@/services/payment/payment-service';
import {
  Award,
  Search,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Loader2,
  AlertCircle,
  FileBadge,
  Sparkles,
} from 'lucide-react';

function CertificateFeeContent() {
  const { language } = useApp();
  const { user } = useAuth();
  const searchParams = useSearchParams();

  const [activeTab, setActiveTab] = useState<'SELECT' | 'SEARCH'>(() =>
    searchParams.get('appId') ? 'SEARCH' : 'SELECT'
  );
  const [selectedCertCode, setSelectedCertCode] = useState(STATUTORY_CERTIFICATE_FEES[0].code);
  const [certWard, setCertWard] = useState<number>(7);
  const [applicationId, setApplicationId] = useState(searchParams.get('appId') || 'CERT-2026-98124');
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState('');

  const [bill, setBill] = useState<BillLookupRecord | null>(null);
  const [payerName, setPayerName] = useState(
    user ? (language === 'bn' ? user.nameBn || user.nameEn : user.nameEn || user.nameBn) : ''
  );
  const [payerPhone, setPayerPhone] = useState(user?.phone || '');
  const [selectedMethod, setSelectedMethod] = useState<PaymentProviderMethod>('bkash');
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
      setSearchError(language === 'bn' ? 'সঠিক আবেদন আইডি লিখুন।' : 'Enter a valid application ID.');
      return;
    }

    setIsSearching(true);
    setSearchError('');
    setCompletedReceipt(null);

    try {
      const result = await PaymentService.lookupBill('CERTIFICATE', target, certWard);
      setBill(result);
      if (!payerName) setPayerName(result.payerName[language]);
      if (!payerPhone && result.payerPhone) setPayerPhone(result.payerPhone);
    } catch (err: unknown) {
      const error = err as Error;
      setSearchError(error.message || 'সনদ আবেদন তথ্য পাওয়া যায়নি।');
      setBill(null);
    } finally {
      setIsSearching(false);
    }
  }, [applicationId, certWard, language, payerName, payerPhone]);

  useEffect(() => {
    const param = searchParams.get('appId');
    if (param) {
      queueMicrotask(() => {
        handleLookup(param);
      });
    }
  }, [searchParams, handleLookup]);

  const handleSelectDirectCertificate = () => {
    const cert = STATUTORY_CERTIFICATE_FEES.find((c) => c.code === selectedCertCode) || STATUTORY_CERTIFICATE_FEES[0];
    const generatedRef = `CERT-${Date.now().toString().slice(-6)}`;

    const newBill: BillLookupRecord = {
      id: `BILL-DIR-${Date.now()}`,
      serviceType: 'CERTIFICATE',
      referenceNumber: generatedRef,
      wardNumber: certWard,
      payerName: {
        bn: payerName || (language === 'bn' ? 'সনদ আবেদনকারী' : 'Certificate Applicant'),
        en: payerName || 'Certificate Applicant',
      },
      categoryLabel: {
        bn: `${cert.name.bn} সরকারি ফি`,
        en: `${cert.name.en} Statutory Fee`,
      },
      propertyOrBusinessDetails: {
        bn: `ওয়ার্ড নং ${certWard} কাউন্সিলর কার্যালয় হতে সনদ প্রদান (বিতরণ সময়: ${cert.deliveryDays})`,
        en: `Issuance from Ward No ${certWard} Councillor Office (Delivery: ${cert.deliveryDays})`,
      },
      subItems: [
        {
          label: { bn: cert.name.bn, en: cert.name.en },
          amount: cert.fee,
        },
      ],
      arrearsAmount: 0,
      currentAmount: cert.fee,
      rebateAmount: 0,
      vatOrServiceCharge: 0,
      totalPayable: cert.fee,
      paymentStatus: 'unpaid',
    };

    setBill(newBill);
    setCompletedReceipt(null);
  };

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
        bn: 'সনদপত্র ফি পরিশোধ',
        en: 'Statutory Certificate Fee Payment',
      }}
      description={{
        bn: 'নাগরিকত্ব, চারিত্রিক, ওয়ারিশান, জন্ম ও মৃত্যু নিবন্ধন সনদপত্রের সরকারি ফি অনলাইনে পরিশোধ করে তাৎক্ষণিক ডিজিটাল সিলযুক্ত রসিদ পান।',
        en: 'Pay official government fees for Citizenship, Character, Inheritance, and Vital Records online with instant verifiable e-receipts.',
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
                    ? 'সনদপত্র ফি সফলভাবে পরিশোধিত হয়েছে!'
                    : 'Certificate statutory fee paid successfully!'}
                </span>
              </div>
              <button
                onClick={() => {
                  setCompletedReceipt(null);
                  setBill(null);
                }}
                className="text-xs font-semibold text-emerald-800 underline hover:text-emerald-950"
              >
                {language === 'bn' ? 'আরেকটি সনদ ফি পরিশোধ করুন' : 'Pay Another Certificate Fee'}
              </button>
            </div>
            <PaymentReceiptView receipt={completedReceipt} />
          </div>
        ) : (
          <>
            {/* Mode Switcher */}
            <div className="flex justify-center">
              <div className="inline-flex p-1 bg-slate-200/80 rounded-xl border border-slate-300">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('SELECT');
                    setBill(null);
                  }}
                  className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all ${
                    activeTab === 'SELECT'
                      ? 'bg-white text-emerald-800 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {language === 'bn' ? 'সনদ নির্বাচন করে পরিশোধ' : 'Select Certificate Fee'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('SEARCH');
                    setBill(null);
                  }}
                  className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all ${
                    activeTab === 'SEARCH'
                      ? 'bg-white text-emerald-800 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {language === 'bn' ? 'আবেদন আইডি দিয়ে সার্চ' : 'Search by Application ID'}
                </button>
              </div>
            </div>

            {/* TAB 1: Select Statutory Certificate */}
            {activeTab === 'SELECT' && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
                <div className="text-center space-y-1">
                  <h3 className="text-lg font-bold text-slate-900">
                    {language === 'bn' ? 'প্রয়োজনীয় সনদপত্রটি নির্বাচন করুন' : 'Choose Required Civic Certificate'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {language === 'bn'
                      ? 'সিটি কর্পোরেশনের স্থানীয় সরকার বিধি অনুযায়ী সরকারি ফি ধার্য করা হয়েছে।'
                      : 'Fees are fixed according to City Corporation statutory civic schedules.'}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {STATUTORY_CERTIFICATE_FEES.map((cert) => {
                    const isSelected = selectedCertCode === cert.code;
                    return (
                      <button
                        type="button"
                        key={cert.code}
                        onClick={() => setSelectedCertCode(cert.code)}
                        className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? 'border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-500/30'
                            : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                              <Award className="w-4 h-4" />
                            </span>
                            <span className="font-mono font-bold text-emerald-800 text-sm">
                              ৳{cert.fee}
                            </span>
                          </div>
                          <h4 className="text-sm font-bold text-slate-900 leading-snug">
                            {cert.name[language]}
                          </h4>
                        </div>
                        <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                          <span>{language === 'bn' ? 'প্রদানের সময়:' : 'Delivery:'}</span>
                          <span className="font-medium text-slate-700">{cert.deliveryDays}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="max-w-md mx-auto pt-2 flex flex-col sm:flex-row gap-3">
                  <div className="flex-1">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      {language === 'bn' ? 'সংশ্লিষ্ট ওয়ার্ড কাউন্সিলর কার্যালয়' : 'Councillor Ward Office'}
                    </label>
                    <select
                      value={certWard}
                      onChange={(e) => setCertWard(Number(e.target.value))}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm bg-slate-50"
                    >
                      {Array.from({ length: 54 }, (_, i) => i + 1).map((w) => (
                        <option key={w} value={w}>
                          {language === 'bn' ? `ওয়ার্ড নং ${w} কার্যালয়` : `Ward No ${w} Office`}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={handleSelectDirectCertificate}
                      className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md cursor-pointer transition-colors"
                    >
                      {language === 'bn' ? 'বিল তৈরি করুন' : 'Generate Bill'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: Search By Application ID */}
            {activeTab === 'SEARCH' && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
                <div className="max-w-2xl mx-auto space-y-4">
                  <div className="text-center space-y-1">
                    <h3 className="text-xl font-bold text-slate-900">
                      {language === 'bn' ? 'সনদ আবেদন আইডি অনুসন্ধান' : 'Search Certificate Application ID'}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {language === 'bn'
                        ? 'অনলাইন পোর্টাল হতে প্রাপ্ত আবেদন ট্র্যাকিং নম্বর লিখুন।'
                        : 'Enter tracking reference from your submitted certificate application.'}
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <div className="relative flex-1">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={applicationId}
                        onChange={(e) => setApplicationId(e.target.value)}
                        placeholder="CERT-2026-98124"
                        className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        required
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleLookup()}
                      disabled={isSearching || !applicationId.trim()}
                      className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md flex items-center justify-center space-x-1.5 cursor-pointer disabled:bg-slate-300"
                    >
                      {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                      <span>{language === 'bn' ? 'খুঁজুন' : 'Search'}</span>
                    </button>
                  </div>

                  {searchError && (
                    <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center space-x-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{searchError}</span>
                    </div>
                  )}

                  <div className="text-center text-xs text-slate-500 pt-1">
                    <span>{language === 'bn' ? 'নমুনা আইডি:' : 'Sample ID:'} </span>
                    <button
                      type="button"
                      onClick={() => {
                        setApplicationId('CERT-2026-98124');
                        handleLookup('CERT-2026-98124');
                      }}
                      className="font-mono text-emerald-700 underline"
                    >
                      CERT-2026-98124
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Bill & Checkout */}
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

export default function CertificateFeePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-emerald-600" /></div>}>
      <CertificateFeeContent />
    </Suspense>
  );
}
