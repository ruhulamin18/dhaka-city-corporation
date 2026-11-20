'use client';

import React, { useState } from 'react';
import { KeyRound, Check, X, ExternalLink } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useGoogleMapsContext } from './GoogleMapsProvider';

interface GoogleMapsKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GoogleMapsKeyModal({ isOpen, onClose }: GoogleMapsKeyModalProps) {
  const { language } = useApp();
  const { apiKey, setCustomApiKey } = useGoogleMapsContext();
  const [inputVal, setInputVal] = useState(apiKey || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanKey = inputVal.trim();
    setCustomApiKey(cleanKey);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  const handleClear = () => {
    setInputVal('');
    setCustomApiKey('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden text-[#111827]">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-[#006A4E] to-[#00523C] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-emerald-200" />
            <h3 className="font-bold text-base">
              {language === 'bn' ? 'Google Maps API কী সেটআপ' : 'Google Maps API Key Setup'}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSave} className="p-6 space-y-4 text-xs sm:text-sm">
          <p className="text-[#4B5563] leading-relaxed">
            {language === 'bn'
              ? 'আপনার গুগল ক্লাউড কনসোল থেকে Google Maps JavaScript API কী পেস্ট করুন। কী দিলে সম্পূর্ণ 3D WebGL স্যাটেলাইট ভিউ ও কাস্টম মার্কার সক্রিয় হবে।'
              : 'Paste your Google Maps JavaScript API key from Google Cloud Console to enable full WebGL 3D satellite imagery and advanced civic markers.'}
          </p>

          <div>
            <label htmlFor="maps-key-input" className="block font-semibold text-slate-700 mb-1.5">
              {language === 'bn' ? 'API কী (API Key):' : 'API Key:'}
            </label>
            <input
              id="maps-key-input"
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full px-3.5 py-2.5 font-mono text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#006A4E] focus:border-transparent bg-slate-50"
            />
          </div>

          <div className="flex items-center justify-between text-xs text-[#006A4E]">
            <a
              href="https://console.cloud.google.com/google/maps-apis/credentials"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 hover:underline font-semibold"
            >
              <span>{language === 'bn' ? 'কী সংগ্রহ করুন (Google Cloud)' : 'Get API Key'}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            {apiKey && (
              <button
                type="button"
                onClick={handleClear}
                className="text-rose-600 hover:underline font-semibold"
              >
                {language === 'bn' ? 'কী মুছে ফেলুন' : 'Clear Key'}
              </button>
            )}
          </div>

          {savedSuccess && (
            <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-[#006A4E] flex items-center gap-2 text-xs font-semibold">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>
                {language === 'bn'
                  ? 'API কী সংরক্ষিত হয়েছে! ম্যাপ লোড হচ্ছে...'
                  : 'API key saved! Reloading map...'}
              </span>
            </div>
          )}

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              {language === 'bn' ? 'বন্ধ করুন' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold bg-[#006A4E] hover:bg-[#00523C] text-white rounded-xl shadow-sm transition-colors"
            >
              {language === 'bn' ? 'সংরক্ষণ করুন' : 'Save & Activate'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
