'use client';

import React from 'react';
import Link from 'next/link';
import { Language } from '@/types';

export interface NoticeTickerProps {
  language: Language;
}

interface TickerNoticeItem {
  id: string;
  textBn: string;
  textEn: string;
  href: string;
}

const TICKER_ITEMS: TickerNoticeItem[] = [
  {
    id: 'tax-rebate',
    textBn:
      '২০২৬-২৭ অর্থবছরের হোল্ডিং ট্যাক্স পরিশোধে ১০% রিবেট (ছাড়) সুবিধা চলছে — অনলাইনে ঘরে বসেই কর পরিশোধ করুন',
    textEn:
      'Enjoy a 10% rebate on FY 2026-27 Holding Tax payments — pay online easily from home',
    href: '/online-payment',
  },
  {
    id: 'dengue-prevention',
    textBn:
      'ডেঙ্গু প্রতিরোধে "তিন দিনে একদিন, জমা পানি ফেলে দিন" — আপনার এলাকায় মশক নিধন (ফগিং) সূচি জানতে ওয়ার্ড ডিরেক্টরি দেখুন',
    textEn:
      'Prevent Dengue: Clear stagnant water every 3 days — check the Ward Directory for your area\'s mosquito fogging schedule',
    href: '/about/wards',
  },
  {
    id: 'citizen-portal-hotline',
    textBn:
      'যেকোনো নাগরিক সমস্যা, সড়কবাতি নষ্ট বা জলাবদ্ধতার অভিযোগ জানাতে কল করুন ১৬১০৬ অথবা নাগরিক পোর্টালে রিপোর্ট করুন',
    textEn:
      'For civic issues, broken streetlights, or waterlogging, call 16106 or report via the Citizen Portal',
    href: '/complaints',
  },
];

export function NoticeTicker({ language }: NoticeTickerProps) {
  return (
    <aside
      className="w-full bg-white border-y border-slate-200/90 shadow-2xs relative z-20 overflow-hidden"
      aria-label={language === 'bn' ? 'জরুরি ঘোষণা ও সংবাদ' : 'Emergency Notices & News Ticker'}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-12 sm:h-14 relative overflow-hidden group">
          {/* Left Fixed Badge with subtle Deep Civic Green (#006A4E) and Crimson accent (#C81E1E) with pulsing indicator dot */}
          <div className="relative z-20 shrink-0 flex items-center pr-3 sm:pr-4 bg-white select-none">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-3.5 sm:py-1.5 rounded-lg bg-[#006A4E] text-white text-xs sm:text-sm font-bold tracking-wide shadow-xs border-l-4 border-l-[#C81E1E]">
              <span className="relative flex h-2.5 w-2.5 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ef4444] opacity-80" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#C81E1E]" />
              </span>
              <span className="whitespace-nowrap uppercase font-bold">
                {language === 'bn' ? 'জরুরি ঘোষণা' : 'NOTICE'}
              </span>
            </div>
          </div>

          {/* Left subtle gradient fade so scrolling text passes cleanly behind/beside the badge without overlapping */}
          <div
            className="w-5 sm:w-10 h-full bg-gradient-to-r from-white via-white/95 to-transparent shrink-0 pointer-events-none z-10 -ml-1"
            aria-hidden="true"
          />

          {/* Right-to-Left Continuous Scrolling Track (All items on a single horizontal line) */}
          <div className="flex-1 overflow-hidden relative flex items-center h-full ticker-track">
            {/* Primary Track */}
            <div className="flex shrink-0 items-center animate-marquee group-hover:[animation-play-state:paused] hover:[animation-play-state:paused] whitespace-nowrap">
              {TICKER_ITEMS.map((item) => (
                <React.Fragment key={item.id}>
                  <Link
                    href={item.href}
                    className="text-sm sm:text-base font-bold text-slate-800 hover:text-[#006A4E] hover:underline underline-offset-4 transition-colors cursor-pointer inline-flex items-center tracking-normal"
                  >
                    {language === 'bn' ? item.textBn : item.textEn}
                  </Link>
                  <span
                    className="mx-4 sm:mx-6 text-slate-300 font-extrabold text-sm sm:text-base select-none"
                    aria-hidden="true"
                  >
                    |
                  </span>
                </React.Fragment>
              ))}
            </div>

            {/* Duplicate Seamless Loop Track */}
            <div
              className="flex shrink-0 items-center animate-marquee group-hover:[animation-play-state:paused] hover:[animation-play-state:paused] whitespace-nowrap"
              aria-hidden="true"
            >
              {TICKER_ITEMS.map((item) => (
                <React.Fragment key={`dup-${item.id}`}>
                  <Link
                    href={item.href}
                    tabIndex={-1}
                    className="text-sm sm:text-base font-bold text-slate-800 hover:text-[#006A4E] hover:underline underline-offset-4 transition-colors cursor-pointer inline-flex items-center tracking-normal"
                  >
                    {language === 'bn' ? item.textBn : item.textEn}
                  </Link>
                  <span
                    className="mx-4 sm:mx-6 text-slate-300 font-extrabold text-sm sm:text-base select-none"
                    aria-hidden="true"
                  >
                    |
                  </span>
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Right subtle gradient fade for smooth edge entrance */}
          <div
            className="absolute right-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-l from-white to-transparent pointer-events-none z-10"
            aria-hidden="true"
          />
        </div>
      </div>
    </aside>
  );
}
