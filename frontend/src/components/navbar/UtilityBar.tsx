'use client';

import React from 'react';
import { Mail, MapPin, PhoneCall } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export function UtilityBar() {
  const { language } = useApp();

  return (
    <div
      className="no-print relative z-40 bg-[#006A4E] text-emerald-50 border-b border-[#00523C] text-xs"
      role="region"
      aria-label={language === 'bn' ? 'অফিসিয়াল তথ্য বার' : 'Official utility bar'}
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-1.5 flex items-center justify-between gap-3">
        {/* Left: Location Indicator, City Corporation Name & Location Info */}
        <div className="flex items-center gap-2 min-w-0">
          <MapPin
            className="w-3.5 h-3.5 text-emerald-200 shrink-0"
            aria-hidden="true"
          />
          <span className="font-semibold text-white truncate">
            {language === 'bn' ? (
              <span className="font-bengali">ঢাকা সিটি কর্পোরেশন</span>
            ) : (
              <span className="font-inter">Dhaka City Corporation</span>
            )}
          </span>
          <span
            className="hidden md:inline text-emerald-200/70 select-none"
            aria-hidden="true"
          >
            |
          </span>
          <span className="hidden md:inline text-emerald-100/95 truncate">
            {language === 'bn'
              ? 'নগর ভবন, ঢাকা-১০০০, বাংলাদেশ'
              : 'Nagar Bhaban, Dhaka-1000, Bangladesh'}
          </span>
        </div>

        {/* Right: Official Phone, Official Email & Bangla / English Language Switcher */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          <a
            href="tel:16106"
            className="inline-flex items-center gap-1.5 text-emerald-50 hover:text-white transition-colors whitespace-nowrap tabular-nums focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white rounded"
            title={
              language === 'bn'
                ? 'নাগরিক হেল্পলাইন ১৬১০৬'
                : 'Civic Helpline 16106'
            }
          >
            <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-[#C81E1E] text-white shrink-0">
              <PhoneCall className="w-2.5 h-2.5" aria-hidden="true" />
            </span>
            <span className="hidden sm:inline text-emerald-100">
              {language === 'bn' ? 'হেল্পলাইন:' : 'Helpline:'}
            </span>
            <strong className="text-white font-semibold">16106</strong>
          </a>

          <a
            href="mailto:info@dscc.smartcity.gov.bd"
            className="hidden lg:inline-flex items-center gap-1.5 text-emerald-100 hover:text-white transition-colors whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white rounded"
          >
            <Mail className="w-3.5 h-3.5 text-emerald-200 shrink-0" aria-hidden="true" />
            <span className="font-inter">info@dscc.smartcity.gov.bd</span>
          </a>
        </div>
      </div>
    </div>
  );
}
