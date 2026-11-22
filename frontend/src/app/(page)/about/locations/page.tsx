'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Building2,
  Clock,
  ExternalLink,
  Mail,
  MapPin,
  Navigation,
  Phone,
  PhoneCall,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { AboutPageLayout } from '@/components/about/AboutPageLayout';
import { CivicInfoCard } from '@/components/about/CivicInfoCard';
import { SatellitePinMap } from '@/components/SatellitePinMap';
import { HEADQUARTERS_OFFICE, ZONAL_OFFICES } from '@/data/aboutData';
import { pickLang } from '@/types/about';

export default function AboutLocationsPage() {
  const { language } = useApp();
  const [focusedOffice, setFocusedOffice] = useState<{
    title: string;
    subtitle: string;
    lat: number;
    lng: number;
  }>({
    title: HEADQUARTERS_OFFICE.title.en,
    subtitle: HEADQUARTERS_OFFICE.address.en,
    lat: HEADQUARTERS_OFFICE.lat,
    lng: HEADQUARTERS_OFFICE.lng,
  });

  const directionsUrl = `https://www.google.com/maps/search/?api=1&query=${focusedOffice.lat},${focusedOffice.lng}`;

  return (
    <AboutPageLayout activeSlug="locations">
      {/* Featured Nagar Bhaban Headquarters Card + Live Satellite Preview */}
      <section className="relative overflow-hidden civic-card bg-white rounded-xl border border-[#E2E8F0] p-6 sm:p-8 shadow-xs">
        {/* Top Accent Indicator */}
        <span aria-hidden="true" className="absolute inset-x-0 top-0 h-1 bg-[#006A4E]" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
          <div className="lg:col-span-6 space-y-4">
            <div>
              <p className="text-xs font-semibold text-[#006A4E]">
                {language === 'bn' ? 'কেন্দ্রীয় সদর দপ্তর' : 'Central Headquarters'}
              </p>
              <h2 className="text-2xl font-bold text-[#111827] mt-0.5">
                {pickLang(HEADQUARTERS_OFFICE.title, language)}
              </h2>
              <p className="text-sm text-[#4B5563] mt-1">
                {pickLang(HEADQUARTERS_OFFICE.subtitle, language)}
              </p>
            </div>

            <div className="space-y-3 pt-3 border-t border-slate-100 text-sm text-[#4B5563]">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#006A4E] shrink-0 mt-1" aria-hidden="true" />
                <div>
                  <p className="text-xs font-semibold text-[#111827]">
                    {language === 'bn' ? 'ঠিকানা' : 'Official Address'}
                  </p>
                  <p>{pickLang(HEADQUARTERS_OFFICE.address, language)}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-[#006A4E] shrink-0 mt-1" aria-hidden="true" />
                <div>
                  <p className="text-xs font-semibold text-[#111827]">
                    {language === 'bn' ? 'অফিস সময়সূচি' : 'Office Hours'}
                  </p>
                  <p>{pickLang(HEADQUARTERS_OFFICE.hours, language)}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <a
                  href={`tel:${HEADQUARTERS_OFFICE.helpline}`}
                  className="flex items-center gap-2.5 p-3 rounded-lg bg-[#FEF2F2] border border-red-200/80 text-[#C81E1E] font-semibold text-xs hover:bg-red-100/70 transition-colors"
                >
                  <PhoneCall className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <div>
                    <span className="block text-[11px] font-medium text-[#4B5563]">
                      {language === 'bn' ? '২৪/৭ হেল্পলাইন' : '24/7 Helpline'}
                    </span>
                    <span className="font-mono text-sm font-bold tabular-nums">
                      {HEADQUARTERS_OFFICE.helpline}
                    </span>
                  </div>
                </a>

                <a
                  href={`tel:${HEADQUARTERS_OFFICE.phone.replace(/[^+\d]/g, '')}`}
                  className="flex items-center gap-2.5 p-3 rounded-lg bg-[#ECFDF5] border border-emerald-200 text-[#006A4E] font-semibold text-xs hover:bg-emerald-100/70 transition-colors"
                >
                  <Phone className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <div>
                    <span className="block text-[11px] font-medium text-[#4B5563]">
                      {language === 'bn' ? 'পিএবিএক্স / অফিস' : 'PABX / Office'}
                    </span>
                    <span className="font-mono text-xs font-bold tabular-nums">
                      {HEADQUARTERS_OFFICE.phone}
                    </span>
                  </div>
                </a>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 pt-2">
              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-[#006A4E] hover:bg-[#00523C] text-white text-xs font-semibold transition-colors"
              >
                <Navigation className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{language === 'bn' ? 'গুগল ম্যাপে দিকনির্দেশনা' : 'Get Directions'}</span>
                <ExternalLink className="w-3 h-3" aria-hidden="true" />
              </a>
              <Link
                href="/city-map"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-[#ECFDF5] hover:bg-emerald-100 text-[#006A4E] border border-emerald-200 text-xs font-semibold transition-colors"
              >
                <MapPin className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{language === 'bn' ? 'জিআইএস সিটি ম্যাপ' : 'Open GIS City Map'}</span>
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-2.5">
            <div className="flex items-center justify-between text-xs text-[#4B5563]">
              <span className="font-semibold text-[#111827]">{focusedOffice.title}</span>
              <button
                type="button"
                onClick={() =>
                  setFocusedOffice({
                    title: pickLang(HEADQUARTERS_OFFICE.title, language),
                    subtitle: pickLang(HEADQUARTERS_OFFICE.address, language),
                    lat: HEADQUARTERS_OFFICE.lat,
                    lng: HEADQUARTERS_OFFICE.lng,
                  })
                }
                className="text-[#006A4E] font-semibold hover:underline cursor-pointer"
              >
                {language === 'bn' ? 'নগর ভবনে ফিরুন' : 'Reset to Nagar Bhaban'}
              </button>
            </div>
            <SatellitePinMap
              lat={focusedOffice.lat}
              lng={focusedOffice.lng}
              zoom={15}
              label={focusedOffice.title}
              subtitle={focusedOffice.subtitle}
              heightClassName="h-72"
              pinColor="teal"
            />
          </div>
        </div>
      </section>

      {/* Zonal / Regional Offices Grid */}
      <section aria-labelledby="zonal-offices-heading" className="space-y-4">
        <div>
          <h2 id="zonal-offices-heading" className="text-lg sm:text-xl font-bold text-[#111827]">
            {language === 'bn'
              ? 'আঞ্চলিক কার্যালয়সমূহ (জোন ১ – ৫)'
              : 'Zonal / Regional Offices (Zones 1 – 5)'}
          </h2>
          <p className="text-sm text-[#4B5563] mt-1">
            {language === 'bn'
              ? 'ওয়ার্ডভিত্তিক নাগরিক সেবা, কর মূল্যায়ন এবং জন্ম নিবন্ধনের জন্য আপনার নিকটস্থ আঞ্চলিক কার্যালয়।'
              : 'Decentralized regional offices handling tax assessment, licensing, and ward supervision.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {ZONAL_OFFICES.map((office) => (
            <CivicInfoCard
              key={office.id}
              icon={Building2}
              meta={pickLang(office.wardsCovered, language)}
              title={pickLang(office.title, language)}
              description={pickLang(office.address, language)}
              footer={
                <div className="space-y-2.5 text-xs">
                  <div className="text-[#4B5563] space-y-1">
                    <p>
                      <strong className="text-[#111827]">
                        {language === 'bn' ? 'আঞ্চলিক নির্বাহী: ' : 'Executive Officer: '}
                      </strong>
                      {pickLang(office.executiveOfficer, language)}
                    </p>
                    <p className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#006A4E] shrink-0" aria-hidden="true" />
                      <span>{pickLang(office.hours, language)}</span>
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <a
                      href={`tel:${office.phone.replace(/[^+\d]/g, '')}`}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#006A4E] hover:bg-[#00523C] text-white font-semibold tabular-nums transition-all duration-200 shadow-2xs hover:shadow-xs"
                    >
                      <Phone className="w-3 h-3" aria-hidden="true" />
                      <span>{office.phone}</span>
                    </a>
                    <a
                      href={`mailto:${office.email}`}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#F8FAFC] group-hover:bg-white hover:bg-[#ECFDF5] text-[#006A4E] border border-[#E2E8F0] group-hover:border-[#006A4E]/30 font-semibold transition-all duration-200 shadow-2xs"
                    >
                      <Mail className="w-3 h-3" aria-hidden="true" />
                      <span>{language === 'bn' ? 'ইমেইল' : 'Email'}</span>
                    </a>
                    <button
                      type="button"
                      onClick={() =>
                        setFocusedOffice({
                          title: pickLang(office.title, language),
                          subtitle: pickLang(office.address, language),
                          lat: office.lat,
                          lng: office.lng,
                        })
                      }
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#ECFDF5] group-hover:bg-white hover:bg-emerald-100 text-[#006A4E] border border-emerald-200/80 group-hover:border-[#006A4E]/40 font-semibold transition-all duration-200 cursor-pointer shadow-2xs"
                    >
                      <MapPin className="w-3 h-3" aria-hidden="true" />
                      <span>{language === 'bn' ? 'ম্যাপে দেখুন' : 'Show on Map'}</span>
                    </button>
                  </div>
                </div>
              }
            />
          ))}
        </div>
      </section>
    </AboutPageLayout>
  );
}
