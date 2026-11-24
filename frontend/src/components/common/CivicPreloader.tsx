'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import type { Language } from '@/types';
import type { PreloaderPortal } from '@/context/PreloaderContext';

type PreloaderCopy = Record<
  PreloaderPortal,
  Record<Language, { title: string; subtitle: string; status: string[] }>
>;

const preloaderCopy: PreloaderCopy = {
  home: {
    bn: {
      title: 'ঢাকা স্মার্ট সিটি কর্পোরেশন',
      subtitle: 'স্মার্ট নাগরিক সেবা প্ল্যাটফর্ম প্রস্তুত হচ্ছে...',
      status: [
        'নাগরিক সেবার তথ্য প্রস্তুত করা হচ্ছে',
        'ঢাকার ডিজিটাল সেবা এক জায়গায়',
        'সেবা ব্যবহারের অভিজ্ঞতা প্রস্তুত হচ্ছে',
      ],
    },
    en: {
      title: 'Dhaka Smart City Corporation',
      subtitle: 'Preparing Smart Civic Services Platform...',
      status: [
        'Preparing information for civic services',
        'Dhaka services, brought together',
        'Getting the civic service experience ready',
      ],
    },
  },
  citizen: {
    bn: {
      title: 'নাগরিক পোর্টালে স্বাগতম',
      subtitle: 'আপনার নাগরিক ড্যাশবোর্ড ও সেবাসমূহ লোড হচ্ছে...',
      status: ['আপনার সেবাসমূহ প্রস্তুত করা হচ্ছে'],
    },
    en: {
      title: 'Welcome to Citizen Portal',
      subtitle: 'Loading your citizen dashboard & services...',
      status: ['Preparing your civic services'],
    },
  },
  admin: {
    bn: {
      title: 'প্রশাসনিক কমান্ড পোর্টাল',
      subtitle: 'সুরক্ষিত প্রশাসনিক সেশন যাচাই ও লোড হচ্ছে...',
      status: ['প্রশাসনিক কর্মপরিসর প্রস্তুত করা হচ্ছে'],
    },
    en: {
      title: 'Administrative Command Portal',
      subtitle: 'Verifying & loading secure administrative workspace...',
      status: ['Preparing the administrative workspace'],
    },
  },
  logout: {
    bn: {
      title: 'নিরাপদে লগআউট হচ্ছে',
      subtitle: 'আপনার সেশন নিরাপদে বন্ধ করা হচ্ছে...',
      status: ['আপনাকে নিরাপদে লগআউট করা হচ্ছে'],
    },
    en: {
      title: 'Signing out securely',
      subtitle: 'Your session is being securely closed...',
      status: ['Closing your civic service session'],
    },
  },
};

export function CivicPreloader({
  portal,
  language,
  progress,
  showSkip,
  exiting,
  onSkip,
}: {
  portal: PreloaderPortal;
  language: Language;
  progress: number;
  showSkip: boolean;
  exiting: boolean;
  onSkip: () => void;
}) {
  const [statusIndex, setStatusIndex] = useState(0);
  const copy = preloaderCopy[portal][language];
  const statusMessages = copy.status;

  useEffect(() => {
    if (portal !== 'home') return;

    const intervalId = window.setInterval(
      () => setStatusIndex((current) => (current + 1) % statusMessages.length),
      1500
    );
    return () => window.clearInterval(intervalId);
  }, [portal, statusMessages.length]);

  return (
    <div
      className={`civic-preloader fixed inset-0 z-[9999] flex items-center justify-center bg-white/95 px-6 backdrop-blur-md transition-opacity duration-500 motion-reduce:transition-none ${
        exiting ? 'pointer-events-none opacity-0' : 'opacity-100'
      }`}
      aria-busy={!exiting}
    >
      <div className="flex w-full max-w-lg flex-col items-center text-center">
        <div className="relative mb-8 flex h-40 w-40 items-center justify-center">
          <div className="civic-preloader-ring absolute inset-0 rounded-full border border-[#006A4E]/20 bg-[#ECFDF5]/60" />
          <div className="relative flex h-32 w-32 items-center justify-center rounded-full border border-[#006A4E]/10 bg-white">
            <Image
              src="/images/Dhaka_City_logo.png"
              width={128}
              height={128}
              alt={
                language === 'bn'
                  ? 'ঢাকা সিটি কর্পোরেশনের লোগো'
                  : 'Dhaka City Corporation logo'
              }
              className="h-32 w-32 object-contain"
              priority
            />
          </div>
        </div>

        <div className="space-y-3">
          <h1
            id="civic-preloader-title"
            lang={language}
            className={`text-2xl font-semibold leading-snug text-[#111827] sm:text-[28px] ${
              language === 'bn' ? 'font-bengali' : 'font-heading'
            }`}
          >
            {copy.title}
          </h1>
          <p
            lang={language}
            className={`text-sm leading-6 text-[#4B5563] sm:text-base ${
              language === 'bn' ? 'font-bengali' : 'font-body'
            }`}
          >
            {copy.subtitle}
          </p>
        </div>

        <div className="mt-8 w-full max-w-sm">
          <div
            className="h-1.5 overflow-hidden rounded-full bg-[#ECFDF5]"
            role="progressbar"
            aria-labelledby="civic-preloader-title"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(progress)}
          >
            <div
              className="civic-preloader-progress h-full rounded-full bg-[#006A4E]"
              style={{ transform: `scaleX(${progress / 100})` }}
            />
          </div>
          <p
            lang={language}
            className={`mt-4 min-h-6 text-sm text-[#4B5563] ${
              language === 'bn' ? 'font-bengali' : 'font-body'
            }`}
            aria-live="off"
          >
            {statusMessages[statusIndex]}
          </p>
        </div>
      </div>

      {portal === 'home' && showSkip && (
        <button
          type="button"
          onClick={onSkip}
          lang={language}
          aria-label={language === 'bn' ? 'এড়িয়ে যান' : 'Skip introduction'}
          className={`absolute bottom-8 right-8 rounded px-3 py-2 text-sm text-[#4B5563] transition-colors hover:text-[#006A4E] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#006A4E] ${
            language === 'bn' ? 'font-bengali' : 'font-body'
          }`}
        >
          এড়িয়ে যান / Skip
        </button>
      )}
    </div>
  );
}
