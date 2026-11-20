'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  AlertCircle,
  AlertTriangle,
  Building2,
  CheckCircle2,
  Copy,
  Crosshair,
  Flame,
  HeartPulse,
  Info,
  MapPin,
  Phone,
  PhoneCall,
  Share2,
  ShieldAlert,
  Siren,
  Users,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { EMERGENCY_CONTACTS } from '@/data/smart-city/smartCityData';
import { pickLang } from '@/types/about';

export function EmergencySosView() {
  const { language } = useApp();

  const [copiedCoords, setCopiedCoords] = useState(false);
  const [gpsLocation, setGpsLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [fetchingGps, setFetchingGps] = useState(false);
  const [activeTab, setActiveTab] = useState<'contacts' | 'firstaid'>('contacts');

  const handleFetchGps = () => {
    setFetchingGps(true);
    if (typeof navigator !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setGpsLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
          setFetchingGps(false);
        },
        () => {
          // Default Dhaka center
          setGpsLocation({ lat: 23.7644, lng: 90.389 });
          setFetchingGps(false);
        },
        { timeout: 5000 }
      );
    } else {
      setGpsLocation({ lat: 23.7644, lng: 90.389 });
      setFetchingGps(false);
    }
  };

  const handleCopyCoords = () => {
    if (!gpsLocation) return;
    const text = `My Emergency Location: ${gpsLocation.lat.toFixed(6)}, ${gpsLocation.lng.toFixed(6)} (https://maps.google.com/?q=${gpsLocation.lat},${gpsLocation.lng})`;
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(text);
      setCopiedCoords(true);
      setTimeout(() => setCopiedCoords(false), 2500);
    }
  };

  return (
    <div className="space-y-8">
      {/* 1. Critical Emergency Notice Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-amber-50 border border-amber-300 text-amber-950 flex items-start gap-3.5 shadow-xs">
        <Info className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div className="text-xs sm:text-sm leading-relaxed">
          <strong>
            {language === 'bn' ? 'জরুরি জননিরাপত্তা বিজ্ঞপ্তি: ' : 'Safety Protocol Notice: '}
          </strong>
          {language === 'bn'
            ? 'নিচের কল বাটনগুলোতে চাপ দিলে তা সরাসরি আপনার মোবাইলের ডায়ালারে সরকারি হেল্পলাইন নম্বরটি সংযুক্ত করবে। কোনো ভুয়া স্বয়ংক্রিয় ডিসপ্যাচ নয়—অপারেটরকে সরাসরি আপনার বর্তমান অবস্থান ও সংকটের বিস্তারিত জানান।'
            : 'Clicking the emergency buttons opens your mobile dialer to connect directly with authorized government dispatchers. Please state your exact location and crisis clearly to the officer.'}
        </div>
      </div>

      {/* 2. Priority 999 Hero Action Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#C81E1E] to-[#991B1B] text-white p-6 sm:p-8 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-xl space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-bold uppercase tracking-wider">
              <Siren className="w-4 h-4 animate-bounce" />
              <span>{language === 'bn' ? 'জাতীয় সার্বক্ষণিক হেল্পলাইন' : 'National 24/7 Priority Emergency'}</span>
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              {language === 'bn' ? 'জাতীয় জরুরি সেবা ৯৯৯' : 'National Emergency 999'}
            </h2>
            <p className="text-sm sm:text-base text-rose-100 leading-relaxed">
              {language === 'bn'
                ? 'পুলিশের তাৎক্ষণিক সহায়তা, ফায়ার সার্ভিসের অগ্নিনির্বাপণ ও উদ্ধার অভিযান এবং জীবন রক্ষাকারী অ্যাম্বুলেন্স পেতে টোল-ফ্রি সরাসরি কল করুন।'
                : 'Direct unified toll-free dispatch for Police rapid response, Fire Service rescue, and critical care Ambulance transport.'}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <a
              href="tel:999"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-white text-[#C81E1E] font-black text-xl hover:bg-rose-50 active:scale-[0.98] transition-all shadow-lg cursor-pointer"
            >
              <PhoneCall className="w-6 h-6 animate-pulse" />
              <span>CALL 999</span>
            </a>
          </div>
        </div>
      </div>

      {/* 3. Live Emergency GPS Coordinate Tool */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-[#111827] flex items-center gap-2">
            <Crosshair className="w-4 h-4 text-[#006A4E]" />
            <span>{language === 'bn' ? 'জরুরি জিপিএস লোকেশন শেয়ার' : 'Emergency GPS Location Tool'}</span>
          </h3>
          <p className="text-xs text-[#4B5563] mt-0.5">
            {language === 'bn'
              ? 'উদ্ধারকারী দল বা পুলিশকে সঠিক অক্ষাংশ-দ্রাঘিমাংশ জানাতে আপনার জিপিএস কোঅর্ডিনেট সংগ্রহ করুন'
              : 'Acquire high-precision latitude and longitude coordinates to share directly with rescue operators'}
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {gpsLocation ? (
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="font-mono text-xs font-bold text-[#006A4E] bg-[#ECFDF5] px-3 py-2 rounded-xl border border-emerald-200 truncate">
                {gpsLocation.lat.toFixed(6)}, {gpsLocation.lng.toFixed(6)}
              </span>
              <button
                type="button"
                onClick={handleCopyCoords}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#006A4E] text-white text-xs font-semibold hover:bg-[#00523C] transition-colors shrink-0 cursor-pointer"
              >
                {copiedCoords ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copiedCoords ? (language === 'bn' ? 'কপি হয়েছে!' : 'Copied!') : (language === 'bn' ? 'কপি করুন' : 'Copy GPS')}</span>
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleFetchGps}
              disabled={fetchingGps}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#006A4E] text-white text-xs font-semibold hover:bg-[#00523C] transition-colors cursor-pointer"
            >
              <Crosshair className="w-4 h-4" />
              <span>{fetchingGps ? (language === 'bn' ? 'জিপিএস খোঁজা হচ্ছে...' : 'Acquiring GPS...') : (language === 'bn' ? 'আমার লোকেশন নিন' : 'Fetch GPS Location')}</span>
            </button>
          )}
        </div>
      </div>

      {/* 4. Complete Emergency Contact Directory Matrix */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-lg font-bold text-[#111827]">
              {language === 'bn' ? 'জরুরি সংস্থার সরাসরি যোগাযোগ নম্বর' : 'Direct Emergency Agency Telephone Matrix'}
            </h3>
            <p className="text-xs text-[#4B5563]">
              {language === 'bn' ? 'সরকারিভাবে যাচাইকৃত টোল-ফ্রি ও ২৪/৭ কন্ট্রোল রুম' : 'Officially certified 24/7 dedicated hotlines'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {EMERGENCY_CONTACTS.map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-xl border border-slate-200 bg-[#F8FAFC] flex flex-col justify-between space-y-3 hover:border-[#006A4E] transition-all"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider bg-rose-50 text-[#C81E1E] border border-rose-200">
                    {item.category.toUpperCase()}
                  </span>
                  <span className="text-xs font-bold text-slate-500 font-mono">
                    {pickLang(item.coverageArea, language)}
                  </span>
                </div>

                <h4 className="font-bold text-sm text-[#111827]">
                  {pickLang(item.serviceName, language)}
                </h4>
                <p className="text-xs text-[#4B5563] mt-1 leading-relaxed">
                  {pickLang(item.description, language)}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-200 space-y-2">
                <div className="text-[11px] text-slate-500">
                  <strong>{language === 'bn' ? 'করণীয়: ' : 'Protocol: '}</strong>
                  {pickLang(item.actionGuidance, language)}
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={`tel:${item.hotline}`}
                    className="flex-1 inline-flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-[#C81E1E] text-white font-bold text-sm hover:bg-[#a51818] transition-colors"
                  >
                    <PhoneCall className="w-4 h-4" />
                    <span>{item.hotline}</span>
                  </a>

                  {item.alternateNumber && (
                    <a
                      href={`tel:${item.alternateNumber}`}
                      className="px-3 py-2 rounded-lg bg-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-300 transition-colors"
                      title={language === 'bn' ? 'বিকল্প নম্বর' : 'Alternate'}
                    >
                      {item.alternateNumber}
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. First Aid & Disaster Safety Guides */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs space-y-4">
        <h3 className="text-lg font-bold text-[#111827] flex items-center gap-2">
          <HeartPulse className="w-5 h-5 text-[#006A4E]" />
          <span>{language === 'bn' ? 'জরুরি প্রাথমিক চিকিৎসা ও দুর্যোগ নিরাপত্তা নির্দেশিকা' : 'First Aid & Emergency Survival Protocols'}</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs leading-relaxed">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <div className="font-bold text-[#111827] flex items-center gap-1.5 text-rose-700">
              <Flame className="w-4 h-4" />
              <span>{language === 'bn' ? 'অগ্নিকাণ্ড নিরাপত্তা' : 'Structural Fire Safety'}</span>
            </div>
            <p className="text-[#4B5563]">
              {language === 'bn'
                ? 'ধোঁয়ায় আটকে পড়লে মেঝেতে হামাগুড়ি দিয়ে চলুন, ভেজা কাপড় দিয়ে মুখ ঢাকুন এবং লিফট ব্যবহার সম্পূর্ণ পরিহার করুন।'
                : 'Crawl low under smoke, seal nose with damp cloth, and never use elevators during structural evacuations.'}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <div className="font-bold text-[#111827] flex items-center gap-1.5 text-amber-700">
              <AlertTriangle className="w-4 h-4" />
              <span>{language === 'bn' ? 'ভূমিকম্প ও ভবন উদ্ধার' : 'Earthquake Protocol'}</span>
            </div>
            <p className="text-[#4B5563]">
              {language === 'bn'
                ? 'ড্রপ-কাভার-হোল্ড (Drop, Cover, Hold) পদ্ধতি মেনে শক্ত টেবিলের নিচে আশ্রয় নিন। গ্যাস ও বিদ্যুতের মেইন সুইচ দ্রুত বন্ধ করুন।'
                : 'Drop, Cover, and Hold on under heavy desks. Shut off main gas valves and circuit breakers immediately.'}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <div className="font-bold text-[#111827] flex items-center gap-1.5 text-blue-700">
              <HeartPulse className="w-4 h-4" />
              <span>{language === 'bn' ? 'বিদ্যুতায়িত ও প্রাথমিক চিকিৎসা' : 'Electrocution & CPR'}</span>
            </div>
            <p className="text-[#4B5563]">
              {language === 'bn'
                ? 'পানিতে বৈদ্যুতিক তার স্পর্শ করবেন না। আক্রান্ত ব্যক্তিকে শুকনো কাঠ বা প্লাস্টিক দিয়ে তার থেকে আলাদা করে সিপিআর প্রদান করুন।'
                : 'Never touch waterlogged electrical wires. Disconnect victims using non-conductive dry wood or plastic.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
