'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Inter, Noto_Sans_Bengali } from 'next/font/google';
import { Home, Loader2, RefreshCw } from 'lucide-react';
import { STATUS_PAGE_CONFIGS } from '@/config/status-config';
import { StatusIllustration } from '@/components/status/StatusIllustration';
import { StatusMessage } from '@/components/status/StatusMessage';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-inter',
  display: 'swap',
});

const notoBengali = Noto_Sans_Bengali({
  subsets: ['bengali', 'latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-bengali',
  display: 'swap',
});

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ reset }: GlobalErrorProps) {
  const [retrying, setRetrying] = useState(false);
  const config = STATUS_PAGE_CONFIGS['server-error'];

  const handleRetry = () => {
    setRetrying(true);
    try {
      reset();
    } finally {
      setRetrying(false);
    }
  };

  return (
    <html
      lang="en"
      className={`${inter.variable} ${notoBengali.variable}`}
      suppressHydrationWarning
    >
      <body className="relative min-h-screen flex flex-col antialiased bg-[#F8FAFC] text-[#163B32]">
        {/* Global Background */}
        <div
          aria-hidden="true"
          className="fixed inset-0 z-0 pointer-events-none select-none overflow-hidden bg-[#F8FAFC]"
        >
          <div className="absolute inset-0 bg-[url('/images/page-bg.png')] bg-cover bg-bottom bg-no-repeat" />
        </div>

        {/* Fallback Official Header Bar */}
        <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E5E7EB] shadow-xs">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-[76px] flex items-center justify-between">
            <Link
              href="/"
              aria-label="ঢাকা সিটি কর্পোরেশন — হোম পেজ"
              className="inline-flex items-center"
            >
              <Image
                src="/images/logo.png"
                alt="Dhaka City Corporation Logo"
                width={2172}
                height={724}
                priority
                referrerPolicy="no-referrer"
                className="h-11 sm:h-14 w-auto object-contain"
              />
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#087A5B] hover:bg-[#075C42] text-white text-sm font-semibold transition-colors"
            >
              <Home className="w-4 h-4" aria-hidden="true" />
              <span>Go to Homepage</span>
            </Link>
          </div>
        </header>

        {/* Unified Error Content */}
        <main className="relative z-10 flex-1 flex items-center justify-center px-4 sm:px-6 py-12">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-[72%] bg-gradient-to-b from-white/92 via-white/85 to-transparent"
          />

          <div className="relative z-10 w-full max-w-2xl mx-auto flex flex-col items-center text-center">
            <StatusIllustration
              src={config.illustrationSrc}
              alt={config.illustrationAlt}
              statusIcon={config.statusIcon}
              type={config.type}
            />

            <h1 className="mt-4 font-inter font-extrabold text-[#163B32] text-3xl sm:text-4xl lg:text-[42px] leading-[1.15] tracking-tight text-balance">
              {config.heading}
            </h1>

            <p className="mt-3.5 font-bengali text-[#163B32]/90 text-base sm:text-lg leading-relaxed max-w-xl">
              {config.descriptionBn}
            </p>

            <div className="mt-6 sm:mt-7 w-full">
              <StatusMessage
                message={config.statusMessage}
                icon={config.statusIcon}
              />
            </div>

            <div className="mt-6 sm:mt-7 w-full sm:w-auto flex flex-col sm:flex-row items-center justify-center gap-3.5">
              <button
                type="button"
                onClick={handleRetry}
                disabled={retrying}
                className="w-full sm:w-auto sm:min-w-[200px] inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl bg-[#087A5B] hover:bg-[#075C42] text-white border border-[#087A5B] font-inter text-sm sm:text-[15px] font-semibold shadow-xs transition-colors cursor-pointer disabled:opacity-70"
              >
                {retrying ? (
                  <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                ) : (
                  <RefreshCw className="w-4 h-4" aria-hidden="true" />
                )}
                <span>{retrying ? 'Retrying...' : config.primaryAction.label}</span>
              </button>

              <Link
                href="/"
                className="w-full sm:w-auto sm:min-w-[200px] inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl bg-white hover:bg-[#E7F4EF] text-[#087A5B] border border-[#087A5B] font-inter text-sm sm:text-[15px] font-semibold transition-colors"
              >
                <Home className="w-4 h-4" aria-hidden="true" />
                <span>{config.secondaryAction.label}</span>
              </Link>
            </div>
          </div>
        </main>

        {/* Minimal Institutional Footer Strip */}
        <footer className="relative z-10 bg-[#075C42] text-emerald-50 border-t border-[#087A5B]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-center text-xs">
            © 2026 Dhaka Smart City Corporation — Digital Citizen Service Platform.
          </div>
        </footer>
      </body>
    </html>
  );
}
