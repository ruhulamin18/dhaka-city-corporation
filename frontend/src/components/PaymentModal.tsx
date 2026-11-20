'use client';

import React, { useState } from 'react';
import { CheckCircle2, CreditCard, Lock, Smartphone, X } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { PaymentMethod } from '@/types';

interface PaymentModalProps {
  open: boolean;
  amountBdt: number;
  title: string;
  onClose: () => void;
  onConfirm: (method: PaymentMethod) => Promise<void>;
}

const PAYMENT_OPTIONS: {
  id: PaymentMethod;
  name: string;
  subtitleEn: string;
  subtitleBn: string;
  accent: string;
}[] = [
  {
    id: 'bkash',
    name: 'bKash',
    subtitleEn: 'Instant MFS Wallet Checkout',
    subtitleBn: 'তাৎক্ষণিক বিকাশ ওয়ালেট পেমেন্ট',
    accent: 'border-pink-500 bg-pink-50/70 text-pink-900',
  },
  {
    id: 'nagad',
    name: 'Nagad',
    subtitleEn: 'Digital Wallet Sandbox',
    subtitleBn: 'নগদ ডিজিটাল ওয়ালেট',
    accent: 'border-orange-500 bg-orange-50/70 text-orange-900',
  },
  {
    id: 'rocket',
    name: 'Rocket',
    subtitleEn: 'DBBL Mobile Banking',
    subtitleBn: 'ডাচ-বাংলা রকেট ব্যাংকিং',
    accent: 'border-purple-600 bg-purple-50/70 text-purple-900',
  },
  {
    id: 'card',
    name: 'Visa / Mastercard',
    subtitleEn: 'Debit & Credit Card Gateway',
    subtitleBn: 'ডেবিট / ক্রেডিট কার্ড গেটওয়ে',
    accent: 'border-[#006A4E] bg-[#ECFDF5] text-[#006A4E]',
  },
];

export function PaymentModal({ open, amountBdt, title, onClose, onConfirm }: PaymentModalProps) {
  const { language } = useApp();
  const [method, setMethod] = useState<PaymentMethod>('bkash');
  const [accountNumber, setAccountNumber] = useState('01711-482910');
  const [pinOrCvv, setPinOrCvv] = useState('1234');
  const [processing, setProcessing] = useState(false);

  if (!open) return null;

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    try {
      await onConfirm(method);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl border border-[#E2E8F0] max-w-md w-full overflow-hidden shadow-xl">
        <div className="bg-[#006A4E] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-200" aria-hidden="true" />
            <h3 className="font-semibold text-base">
              {language === 'bn' ? 'নিরাপদ অনলাইন পেমেন্ট স্যান্ডবক্স' : 'Secure Payment Gateway Sandbox'}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-emerald-100 hover:text-white p-1 rounded cursor-pointer"
            aria-label="Close payment modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handlePay} className="p-6 space-y-5">
          <div className="bg-[#ECFDF5] border border-emerald-200 rounded-lg p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-[#4B5563]">
                {language === 'bn' ? 'সেবার বিবরণ' : 'Service Payable'}
              </p>
              <p className="text-sm font-semibold text-[#111827] mt-0.5">{title}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-[#4B5563]">{language === 'bn' ? 'মোট ফি' : 'Total Fee'}</p>
              <p className="text-xl font-bold text-[#006A4E] tabular-nums">
                ৳{amountBdt.toLocaleString()}
              </p>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-[#111827] mb-2">
              {language === 'bn' ? 'পেমেন্ট মাধ্যম নির্বাচন করুন' : 'Select Payment Method'}
            </p>
            <div className="grid grid-cols-2 gap-2.5">
              {PAYMENT_OPTIONS.map((opt) => {
                const selected = method === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setMethod(opt.id)}
                    className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                      selected
                        ? `${opt.accent} ring-2 ring-[#006A4E]`
                        : 'border-[#E2E8F0] hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm">{opt.name}</span>
                      {opt.id === 'card' ? (
                        <CreditCard className="w-4 h-4 opacity-70" />
                      ) : (
                        <Smartphone className="w-4 h-4 opacity-70" />
                      )}
                    </div>
                    <p className="text-[11px] opacity-80 mt-0.5">
                      {language === 'bn' ? opt.subtitleBn : opt.subtitleEn}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-[#111827] mb-1">
                {method === 'card'
                  ? language === 'bn'
                    ? 'কার্ড নম্বর (ডেমো)'
                    : 'Card Number (Sandbox)'
                  : language === 'bn'
                    ? 'মোবাইল ওয়ালেট নম্বর'
                    : 'Wallet Mobile Number'}
              </label>
              <input
                type="text"
                required
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006A4E] tabular-nums"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#111827] mb-1">
                {method === 'card'
                  ? 'CVV / OTP'
                  : language === 'bn'
                    ? 'স্যান্ডবক্স ওটিপি / পিন'
                    : 'Sandbox Verification OTP / PIN'}
              </label>
              <input
                type="password"
                required
                value={pinOrCvv}
                onChange={(e) => setPinOrCvv(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006A4E] tabular-nums"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-[#4B5563] bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer"
            >
              {language === 'bn' ? 'বাতিল' : 'Cancel'}
            </button>
            <button
              type="submit"
              disabled={processing}
              className="inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-[#006A4E] hover:bg-[#00523C] disabled:opacity-60 rounded-lg transition-colors cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>
                {processing
                  ? language === 'bn'
                    ? 'প্রক্রিয়াকরণ হচ্ছে...'
                    : 'Processing...'
                  : language === 'bn'
                    ? `৳${amountBdt.toLocaleString()} পরিশোধ করুন`
                    : `Confirm Pay ৳${amountBdt.toLocaleString()}`}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
