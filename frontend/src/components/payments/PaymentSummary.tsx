'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { BillLookupRecord } from '@/types/payment';
import {
  Building2,
  MapPin,
  Calendar,
  CheckCircle,
  FileCheck2,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

interface PaymentSummaryProps {
  bill: BillLookupRecord;
  payerName: string;
  payerPhone: string;
  onPayerNameChange: (val: string) => void;
  onPayerPhoneChange: (val: string) => void;
  onProceedToPay: () => void;
  isProcessing?: boolean;
}

export const PaymentSummary: React.FC<PaymentSummaryProps> = ({
  bill,
  payerName,
  payerPhone,
  onPayerNameChange,
  onPayerPhoneChange,
  onProceedToPay,
  isProcessing = false,
}) => {
  const { language } = useApp();

  const isFormValid = payerName.trim().length >= 3 && payerPhone.trim().length >= 10;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header bar */}
      <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">
              {bill.categoryLabel[language]}
            </span>
            <h3 className="text-base font-bold text-slate-900">
              {language === 'bn' ? 'রেফারেন্স / হোল্ডিং নং: ' : 'Reference / Holding No: '}
              <span className="font-mono text-emerald-800">{bill.referenceNumber}</span>
            </h3>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <MapPin className="w-3.5 h-3.5 mr-1" />
            {language === 'bn' ? `ওয়ার্ড নং ${bill.wardNumber}` : `Ward No ${bill.wardNumber}`}
          </span>
          {bill.fiscalYear && (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
              <Calendar className="w-3.5 h-3.5 mr-1" />
              {bill.fiscalYear}
            </span>
          )}
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Taxpayer / Property Information Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-sm">
          <div>
            <p className="text-xs text-slate-500 mb-1">
              {language === 'bn' ? 'নিবন্ধিত করদাতা / গ্রাহকের নাম' : 'Registered Taxpayer / Name'}
            </p>
            <p className="font-semibold text-slate-900">{bill.payerName[language]}</p>
          </div>
          {bill.payerAddress && (
            <div>
              <p className="text-xs text-slate-500 mb-1">
                {language === 'bn' ? 'ঠিকানা / অবস্থান' : 'Address / Location'}
              </p>
              <p className="font-medium text-slate-700">{bill.payerAddress[language]}</p>
            </div>
          )}
          {bill.propertyOrBusinessDetails && (
            <div className="md:col-span-2">
              <p className="text-xs text-slate-500 mb-1">
                {language === 'bn' ? 'বিবরণ ও তফসিল' : 'Details & Schedule'}
              </p>
              <p className="font-medium text-slate-700">
                {bill.propertyOrBusinessDetails[language]}
              </p>
            </div>
          )}
        </div>

        {/* Itemized Fee Breakdown Table */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-slate-900 flex items-center">
            <FileCheck2 className="w-4 h-4 text-emerald-600 mr-1.5" />
            {language === 'bn' ? 'ধার্যকৃত ফি ও করের বিবরণী' : 'Assessed Fee & Tax Breakdown'}
          </h4>

          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600">
                <tr>
                  <th className="px-4 py-3">{language === 'bn' ? 'করের খাত / বিবরণ' : 'Description'}</th>
                  <th className="px-4 py-3 text-right">{language === 'bn' ? 'পরিমাণ (টাকা)' : 'Amount (BDT)'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {bill.subItems.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="px-4 py-2.5 font-medium">{item.label[language]}</td>
                    <td className="px-4 py-2.5 text-right font-mono">
                      ৳{item.amount.toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}

                {bill.arrearsAmount > 0 && (
                  <tr className="bg-amber-50/40 text-amber-900 font-medium">
                    <td className="px-4 py-2.5 flex items-center">
                      <AlertCircle className="w-3.5 h-3.5 mr-1.5 text-amber-600" />
                      {language === 'bn' ? 'পূর্ববর্তী বকেয়া বিল' : 'Previous Arrears Outstanding'}
                    </td>
                    <td className="px-4 py-2.5 text-right font-mono text-amber-800">
                      ৳{bill.arrearsAmount.toLocaleString('en-IN')}
                    </td>
                  </tr>
                )}

                {bill.rebateAmount > 0 && (
                  <tr className="bg-emerald-50/50 text-emerald-800 font-medium">
                    <td className="px-4 py-2.5 flex items-center">
                      <Sparkles className="w-3.5 h-3.5 mr-1.5 text-emerald-600" />
                      {language === 'bn' ? 'সময়মত পরিশোধের জন্য ১০% রিবেট (ছাড়)' : 'Timely Payment 10% Rebate Discount'}
                    </td>
                    <td className="px-4 py-2.5 text-right font-mono text-emerald-700">
                      - ৳{bill.rebateAmount.toLocaleString('en-IN')}
                    </td>
                  </tr>
                )}

                {bill.vatOrServiceCharge > 0 && (
                  <tr className="text-slate-600">
                    <td className="px-4 py-2.5">
                      {language === 'bn' ? 'সরকারি মূসক / ভ্যাট' : 'Government VAT / Tax'}
                    </td>
                    <td className="px-4 py-2.5 text-right font-mono">
                      + ৳{bill.vatOrServiceCharge.toLocaleString('en-IN')}
                    </td>
                  </tr>
                )}

                {/* Grand Total */}
                <tr className="bg-emerald-50 text-emerald-950 font-bold border-t-2 border-emerald-300">
                  <td className="px-4 py-3 text-base">
                    {language === 'bn' ? 'সর্বমোট প্রদেয় পরিমাণ' : 'Total Payable Amount'}
                  </td>
                  <td className="px-4 py-3 text-right text-lg font-mono text-emerald-800">
                    ৳{bill.totalPayable.toLocaleString('en-IN')}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Payer Verification Contact Details */}
        <div className="space-y-4 pt-2 border-t border-slate-200">
          <h4 className="text-sm font-bold text-slate-900">
            {language === 'bn' ? 'পরিশোধকারীর বিবরণ ও রসিদ প্রেরণের তথ্য' : 'Payer Contact & SMS Receipt Details'}
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {language === 'bn' ? 'পরিশোধকারীর পূর্ণ নাম *' : 'Payer Full Name *'}
              </label>
              <input
                type="text"
                value={payerName}
                onChange={(e) => onPayerNameChange(e.target.value)}
                placeholder={language === 'bn' ? 'যেমন: আলহাজ্ব রফিকুল ইসলাম' : 'e.g. Rafiqul Islam'}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {language === 'bn' ? 'মোবাইল নম্বর (এসএমএস কনফার্মেশন) *' : 'Mobile Number (SMS Confirmation) *'}
              </label>
              <input
                type="tel"
                value={payerPhone}
                onChange={(e) => onPayerPhoneChange(e.target.value)}
                placeholder="017XXXXXXXX"
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                required
              />
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={onProceedToPay}
            disabled={!isFormValid || isProcessing}
            className={`w-full py-3.5 px-6 rounded-xl font-bold text-base text-white transition-all duration-200 flex items-center justify-center space-x-2 shadow-md ${
              isFormValid && !isProcessing
                ? 'bg-emerald-600 hover:bg-emerald-700 cursor-pointer hover:shadow-lg active:scale-[0.99]'
                : 'bg-slate-300 cursor-not-allowed opacity-75'
            }`}
          >
            <CheckCircle className="w-5 h-5" />
            <span>
              {isProcessing
                ? language === 'bn' ? 'গেটওয়ে সংযুক্ত হচ্ছে...' : 'Connecting to Gateway...'
                : language === 'bn'
                ? `অনলাইন ফি পরিশোধ করুন (৳${bill.totalPayable.toLocaleString('en-IN')})`
                : `Pay Now Securely (৳${bill.totalPayable.toLocaleString('en-IN')})`}
            </span>
          </button>
          {!isFormValid && (
            <p className="text-center text-xs text-rose-500 mt-2 font-medium">
              {language === 'bn'
                ? 'অনুগ্রহ করে পরিশোধকারীর নাম এবং সঠিক মোবাইল নম্বর পূরণ করুন।'
                : 'Please fill in the payer name and valid mobile number to continue.'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
