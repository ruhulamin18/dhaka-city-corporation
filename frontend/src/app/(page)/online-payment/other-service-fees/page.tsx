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
import { OTHER_CIVIC_SERVICES } from '@/config/payment-config';
import { BillLookupRecord, PaymentProviderMethod, PaymentReceipt, PaymentTransaction } from '@/types/payment';
import { PaymentService } from '@/services/payment/payment-service';
import {
  Layers,
  Search,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Building2,
  Truck,
  Shovel,
  Trees,
  Loader2,
  AlertCircle,
} from 'lucide-react';

function OtherServiceFeesContent() {
  const { language } = useApp();
  const { user } = useAuth();
  const searchParams = useSearchParams();

  const [selectedServiceCode, setSelectedServiceCode] = useState(OTHER_CIVIC_SERVICES[0].code);
  const [serviceWard, setServiceWard] = useState<number>(26);
  const [bookingDate, setBookingDate] = useState('2026-03-15');
  const [refId, setRefId] = useState(searchParams.get('ref') || 'DSCC-OTH-2026-7811');
  const [searchMode, setSearchMode] = useState<'CHOOSE' | 'SEARCH'>('CHOOSE');
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

  const getServiceIcon = (code: string) => {
    switch (code) {
      case 'COMMUNITY_CENTER':
        return <Building2 className="w-5 h-5 text-purple-600" />;
      case 'SPECIAL_WASTE':
        return <Truck className="w-5 h-5 text-emerald-600" />;
      case 'ROAD_CUTTING':
        return <Shovel className="w-5 h-5 text-amber-600" />;
      case 'PARK_VENUE':
        return <Trees className="w-5 h-5 text-teal-600" />;
      default:
        return <Layers className="w-5 h-5 text-slate-600" />;
    }
  };

  const handleGenerateCivicBill = () => {
    const svc = OTHER_CIVIC_SERVICES.find((s) => s.code === selectedServiceCode) || OTHER_CIVIC_SERVICES[0];
    const generatedRef = `DSCC-${svc.code.slice(0, 3)}-${Date.now().toString().slice(-5)}`;
    const vatAmount = Math.round(svc.standardFee * svc.vatRate);
    const totalAmount = svc.standardFee + vatAmount;

    const newBill: BillLookupRecord = {
      id: `BILL-OTH-${Date.now()}`,
      serviceType: 'OTHER_SERVICE',
      referenceNumber: generatedRef,
      wardNumber: serviceWard,
      payerName: {
        bn: payerName || (language === 'bn' ? 'পৌর সেবাগ্রহীতা' : 'Civic Service Recipient'),
        en: payerName || 'Civic Service Recipient',
      },
      categoryLabel: svc.name,
      propertyOrBusinessDetails: {
        bn: `${svc.description.bn} (তারিখ: ${bookingDate}, ওয়ার্ড: ${serviceWard})`,
        en: `${svc.description.en} (Date: ${bookingDate}, Ward: ${serviceWard})`,
      },
      subItems: [
        {
          label: svc.name,
          amount: svc.standardFee,
        },
      ],
      arrearsAmount: 0,
      currentAmount: svc.standardFee,
      rebateAmount: 0,
      vatOrServiceCharge: vatAmount,
      totalPayable: totalAmount,
      paymentStatus: 'unpaid',
    };

    setBill(newBill);
    setCompletedReceipt(null);
  };

  const handleLookup = async (queryRef?: string) => {
    const target = queryRef || refId;
    if (!target.trim()) {
      setSearchError(language === 'bn' ? 'সঠিক রেফারেন্স লিখুন।' : 'Enter a valid reference.');
      return;
    }

    setIsSearching(true);
    setSearchError('');
    setCompletedReceipt(null);

    try {
      const result = await PaymentService.lookupBill('OTHER_SERVICE', target, serviceWard);
      setBill(result);
      if (!payerName) setPayerName(result.payerName[language]);
      if (!payerPhone && result.payerPhone) setPayerPhone(result.payerPhone);
    } catch (err: unknown) {
      const error = err as Error;
      setSearchError(error.message || 'সেবা রেফারেন্স তথ্য পাওয়া যায়নি।');
      setBill(null);
    } finally {
      setIsSearching(false);
    }
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
        bn: 'অন্যান্য পৌর সেবা ফি পরিশোধ',
        en: 'Other Civic Service Fees Payment',
      }}
      description={{
        bn: 'কমিউনিটি সেন্টার বুকিং, বিশেষ বর্জ্য অপসারণ, রাস্তা খনন অনুমোদন ও পার্ক বরাদ্দের সরকারি পৌর ফি অনলাইনে পরিশোধ করুন।',
        en: 'Pay municipal charges for Community Center bookings, special waste disposal, utility trenching, and municipal parks online.',
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
                    ? 'পৌর সেবা ফি সফলভাবে গৃহীত হয়েছে!'
                    : 'Municipal service fee paid successfully!'}
                </span>
              </div>
              <button
                onClick={() => {
                  setCompletedReceipt(null);
                  setBill(null);
                }}
                className="text-xs font-semibold text-emerald-800 underline hover:text-emerald-950"
              >
                {language === 'bn' ? 'অন্য সেবা নির্বাচন করুন' : 'Select Another Service'}
              </button>
            </div>
            <PaymentReceiptView receipt={completedReceipt} />
          </div>
        ) : (
          <>
            <div className="flex justify-center">
              <div className="inline-flex p-1 bg-slate-200/80 rounded-xl border border-slate-300">
                <button
                  type="button"
                  onClick={() => {
                    setSearchMode('CHOOSE');
                    setBill(null);
                  }}
                  className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all ${
                    searchMode === 'CHOOSE'
                      ? 'bg-white text-emerald-800 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {language === 'bn' ? 'সেবা ও বুকিং নির্বাচন' : 'Choose Service & Booking'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSearchMode('SEARCH');
                    setBill(null);
                  }}
                  className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all ${
                    searchMode === 'SEARCH'
                      ? 'bg-white text-emerald-800 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {language === 'bn' ? 'পূর্বের রেফারেন্স সার্চ' : 'Search Prior Demand Note'}
                </button>
              </div>
            </div>

            {searchMode === 'CHOOSE' && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
                <div className="text-center space-y-1">
                  <h3 className="text-lg font-bold text-slate-900">
                    {language === 'bn' ? 'পৌর সেবার খাত নির্বাচন করুন' : 'Select Municipal Civic Service'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {language === 'bn'
                      ? 'সিটি কর্পোরেশনের নির্ধারিত রেট অনুযায়ী সরকারি সেবা ফি ধার্য করা হয়েছে।'
                      : 'Standard statutory civic tariff rates applied per service category.'}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {OTHER_CIVIC_SERVICES.map((svc) => {
                    const isSelected = selectedServiceCode === svc.code;
                    return (
                      <button
                        type="button"
                        key={svc.code}
                        onClick={() => setSelectedServiceCode(svc.code)}
                        className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex items-start space-x-3 ${
                          isSelected
                            ? 'border-purple-600 bg-purple-50/40 ring-2 ring-purple-500/30'
                            : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                      >
                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200">
                          {getServiceIcon(svc.code)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-bold text-slate-900">{svc.name[language]}</h4>
                            <span className="font-mono font-bold text-purple-900 text-sm">
                              ৳{svc.standardFee.toLocaleString('en-IN')}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-1">{svc.description[language]}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Configuration Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      {language === 'bn' ? 'ওয়ার্ড নম্বর' : 'Ward Number'}
                    </label>
                    <select
                      value={serviceWard}
                      onChange={(e) => setServiceWard(Number(e.target.value))}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm bg-slate-50"
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
                      {language === 'bn' ? 'সেবা গ্রহণের তারিখ' : 'Service / Event Date'}
                    </label>
                    <input
                      type="date"
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm bg-slate-50"
                    />
                  </div>

                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={handleGenerateCivicBill}
                      className="w-full py-2.5 px-4 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-sm shadow-md cursor-pointer transition-colors"
                    >
                      {language === 'bn' ? 'বিল প্রস্তুত করুন' : 'Prepare Bill'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {searchMode === 'SEARCH' && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
                <div className="max-w-2xl mx-auto space-y-4">
                  <div className="text-center space-y-1">
                    <h3 className="text-xl font-bold text-slate-900">
                      {language === 'bn' ? 'পৌর ডিমান্ড নোট / রেফারেন্স অনুসন্ধান' : 'Search Civic Demand Note Reference'}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {language === 'bn'
                        ? 'সিটি কর্পোরেশন প্রকৌশল বা স্বাস্থ্য বিভাগ কর্তৃক ইস্যুকৃত ডিমান্ড নোট নম্বর লিখুন।'
                        : 'Enter official demand note reference issued by engineering or health wing.'}
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <div className="relative flex-1">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={refId}
                        onChange={(e) => setRefId(e.target.value)}
                        placeholder="DSCC-OTH-2026-7811"
                        className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        required
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleLookup()}
                      disabled={isSearching || !refId.trim()}
                      className="px-6 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-sm shadow-md flex items-center justify-center space-x-1.5 cursor-pointer disabled:bg-slate-300"
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
                    <span>{language === 'bn' ? 'নমুনা ডিমান্ড নোট:' : 'Sample Demand Note:'} </span>
                    <button
                      type="button"
                      onClick={() => {
                        setRefId('DSCC-OTH-2026-7811');
                        handleLookup('DSCC-OTH-2026-7811');
                      }}
                      className="font-mono text-purple-700 underline"
                    >
                      DSCC-OTH-2026-7811 (আজিমপুর কমিউনিটি সেন্টার)
                    </button>
                  </div>
                </div>
              </div>
            )}

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

export default function OtherServiceFeesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-purple-600" /></div>}>
      <OtherServiceFeesContent />
    </Suspense>
  );
}
