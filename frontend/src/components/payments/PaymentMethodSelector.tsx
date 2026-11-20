'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { PaymentProviderMethod } from '@/types/payment';
import { PAYMENT_METHODS } from '@/config/payment-config';
import { CheckCircle2, ShieldCheck, Smartphone, CreditCard, Landmark } from 'lucide-react';

interface PaymentMethodSelectorProps {
  selectedMethod: PaymentProviderMethod;
  onSelect: (method: PaymentProviderMethod) => void;
  amount?: number;
}

export const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  selectedMethod,
  onSelect,
  amount,
}) => {
  const { language } = useApp();

  const getMethodIcon = (cat: 'mfs' | 'card' | 'bank') => {
    switch (cat) {
      case 'mfs':
        return <Smartphone className="w-5 h-5 text-emerald-600" />;
      case 'card':
        return <CreditCard className="w-5 h-5 text-emerald-600" />;
      case 'bank':
        return <Landmark className="w-5 h-5 text-emerald-600" />;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-slate-800">
          {language === 'bn' ? 'পরিশোধের মাধ্যম নির্বাচন করুন' : 'Select Payment Method'}
        </label>
        <span className="inline-flex items-center text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
          <ShieldCheck className="w-3.5 h-3.5 mr-1" />
          {language === 'bn' ? '০% সরকারি গেটওয়ে ফি' : '0% Govt Gateway Fee'}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {PAYMENT_METHODS.map((method) => {
          const isSelected = selectedMethod === method.id;
          return (
            <button
              type="button"
              key={method.id}
              onClick={() => onSelect(method.id)}
              className={`relative flex flex-col p-4 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
                isSelected
                  ? 'border-emerald-600 bg-emerald-50/50 shadow-sm ring-2 ring-emerald-500/30'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50 shadow-xs'
              }`}
            >
              {isSelected && (
                <div className="absolute top-3 right-3 text-emerald-600">
                  <CheckCircle2 className="w-5 h-5 fill-emerald-100" />
                </div>
              )}

              <div className="flex items-center space-x-3 mb-2">
                <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center border border-slate-200 shrink-0">
                  {getMethodIcon(method.category)}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 leading-snug">
                    {method.name[language]}
                  </h4>
                  <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                    {method.category === 'mfs'
                      ? language === 'bn' ? 'মোবাইল ওয়ালেট' : 'Mobile Banking'
                      : method.category === 'card'
                      ? language === 'bn' ? 'কার্ড নেটওয়ার্ক' : 'Debit/Credit Card'
                      : language === 'bn' ? 'ইন্টারনেট ব্যাংক' : 'Direct Bank'}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                {method.description[language]}
              </p>

              {amount && amount > method.maxAmount && (
                <p className="text-[11px] text-rose-600 mt-2 font-medium">
                  {language === 'bn'
                    ? `সর্বোচ্চ সীমা ৳${method.maxAmount.toLocaleString('bn-BD')}`
                    : `Max limit ৳${method.maxAmount.toLocaleString('en-IN')}`}
                </p>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
