'use client';

import React, { useEffect, useState } from 'react';
import { RefreshCw, ShieldCheck } from 'lucide-react';
import { useApp } from '@/context/AppContext';

interface SecurityCodeFieldProps {
  value: string;
  onChange: (value: string) => void;
  onCodeChange: (generatedCode: string) => void;
  refreshNonce: number;
  error?: string;
}

export function generateRandomSixDigitCode(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export function SecurityCodeField({
  value,
  onChange,
  onCodeChange,
  refreshNonce,
  error,
}: SecurityCodeFieldProps) {
  const { language } = useApp();
  const [code, setCode] = useState<string>('');

  // SSR/Hydration safe: only generate random code strictly inside useEffect on mount or refreshNonce updates
  useEffect(() => {
    queueMicrotask(() => {
      const next = generateRandomSixDigitCode();
      setCode(next);
      onCodeChange(next);
    });
  }, [refreshNonce, onCodeChange]);

  const handleManualRefresh = () => {
    const next = generateRandomSixDigitCode();
    setCode(next);
    onCodeChange(next);
    onChange('');
  };

  return (
    <div className="space-y-2.5 pt-1">
      <div className="flex items-center justify-between">
        <label
          htmlFor="security-code-input"
          className="text-xs font-semibold text-[#111827] flex items-center gap-1.5"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-[#006A4E]" aria-hidden="true" />
          <span>
            {language === 'bn'
              ? '৬ ডিজিটের নিরাপত্তা কোডটি লিখুন'
              : 'Enter 6-Digit Security Code'}
          </span>
        </label>
        <span className="text-[11px] text-[#4B5563]">
          {language === 'bn' ? 'কপি করা নিষিদ্ধ' : 'Type manually'}
        </span>
      </div>

      {/* Security Code Display Box + Refresh Button */}
      <div className="flex items-center gap-2.5">
        <div
          onCopy={(e) => e.preventDefault()}
          onCut={(e) => e.preventDefault()}
          onContextMenu={(e) => e.preventDefault()}
          aria-live="polite"
          className="relative flex-1 h-12 rounded-lg border border-emerald-200 bg-[#ECFDF5] overflow-hidden flex items-center justify-center select-none"
        >
          {/* Subtle diagonal security lines */}
          <svg
            aria-hidden="true"
            className="absolute inset-0 w-full h-full pointer-events-none opacity-45"
          >
            <defs>
              <pattern
                id="sec-diag-lines"
                width="12"
                height="12"
                patternUnits="userSpaceOnUse"
                patternTransform="rotate(35)"
              >
                <line x1="0" y1="0" x2="0" y2="12" stroke="#94A3B8" strokeWidth="1.2" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#sec-diag-lines)" />
            <line x1="8%" y1="78%" x2="92%" y2="22%" stroke="#006A4E" strokeWidth="1" opacity="0.35" />
            <line x1="12%" y1="26%" x2="88%" y2="74%" stroke="#C81E1E" strokeWidth="1" opacity="0.22" />
          </svg>

          <span className="relative z-10 font-mono text-xl font-bold tracking-[0.38em] text-[#006A4E] pl-[0.38em] tabular-nums">
            {code || '••••••'}
          </span>
        </div>

        <button
          type="button"
          onClick={handleManualRefresh}
          title={language === 'bn' ? 'নতুন কোড তৈরি করুন' : 'Generate new security code'}
          aria-label={language === 'bn' ? 'নতুন কোড তৈরি করুন' : 'Generate new security code'}
          className="h-12 w-12 rounded-lg border border-slate-300 bg-white hover:bg-[#ECFDF5] hover:border-[#006A4E] text-[#006A4E] flex items-center justify-center transition-colors shrink-0 cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>

      {/* Numeric User Input */}
      <input
        id="security-code-input"
        type="text"
        inputMode="numeric"
        autoComplete="off"
        maxLength={6}
        value={value}
        onChange={(e) => onChange(e.target.value.replace(/\D/g, '').slice(0, 6))}
        placeholder={language === 'bn' ? 'উপরের ৬ ডিজিটের সংখ্যাটি লিখুন' : 'Enter the 6 digits shown above'}
        className={`w-full px-3.5 py-2.5 text-sm font-mono tracking-[0.25em] border rounded-lg focus:outline-none focus:ring-2 tabular-nums ${
          error
            ? 'border-[#C81E1E] bg-[#FEF2F2]/60 focus:ring-[#C81E1E]'
            : 'border-slate-300 bg-white focus:ring-[#006A4E]'
        }`}
      />

      {error && (
        <p role="alert" className="text-xs font-medium text-[#C81E1E]">
          {error}
        </p>
      )}
    </div>
  );
}
