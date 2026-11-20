'use client';

import React from 'react';
import { Award, BookOpen, Clock, Mail, MapPin, Phone, Quote } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { AboutPageLayout } from '@/components/about/AboutPageLayout';
import { CivicInfoCard } from '@/components/about/CivicInfoCard';
import { MAYOR_PROFILE } from '@/data/aboutData';
import { pickLang } from '@/types/about';

export default function AboutMayorPage() {
  const { language } = useApp();

  return (
    <AboutPageLayout activeSlug="mayor">
      {/* Executive Profile Header */}
      <section className="civic-card bg-white rounded-xl border border-[#E2E8F0] p-6 sm:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
          {/* Dignified Institutional Portrait Frame */}
          <div className="lg:col-span-4 flex justify-center">
            <div className="w-full max-w-[260px] aspect-[4/5] rounded-xl bg-gradient-to-b from-[#ECFDF5] to-[#F8FAFC] border border-emerald-200 flex flex-col items-center justify-center p-6 text-center space-y-4">
              <div className="w-24 h-24 rounded-full bg-[#006A4E] text-white flex items-center justify-center shadow-sm">
                <Award className="w-11 h-11 text-emerald-100" aria-hidden="true" />
              </div>
              <div>
                <p className="text-xs font-semibold text-[#006A4E]">
                  {language === 'bn' ? 'নগর ভবন · ঢাকা' : 'Nagar Bhaban · Dhaka'}
                </p>
                <p className="text-sm font-bold text-[#111827] mt-1">
                  {pickLang(MAYOR_PROFILE.name, language)}
                </p>
                <p className="text-xs text-[#4B5563] mt-0.5">
                  {pickLang(MAYOR_PROFILE.tenure, language)}
                </p>
              </div>
            </div>
          </div>

          {/* Executive Details */}
          <div className="lg:col-span-8 space-y-5">
            <div>
              <p className="text-xs font-semibold text-[#006A4E]">
                {pickLang(MAYOR_PROFILE.tenure, language)}
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#111827] mt-1">
                {pickLang(MAYOR_PROFILE.name, language)}
              </h2>
              <p className="text-sm sm:text-base font-medium text-[#4B5563] mt-1">
                {pickLang(MAYOR_PROFILE.designation, language)}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-4 border-t border-slate-100 text-xs sm:text-sm text-[#4B5563]">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#006A4E] shrink-0 mt-0.5" aria-hidden="true" />
                <span>{pickLang(MAYOR_PROFILE.office, language)}</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-[#006A4E] shrink-0 mt-0.5" aria-hidden="true" />
                <span>{pickLang(MAYOR_PROFILE.officeHours, language)}</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <a
                href={`tel:${MAYOR_PROFILE.phone.replace(/[^+\d]/g, '')}`}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#006A4E] hover:bg-[#00523C] text-white text-xs sm:text-sm font-semibold transition-colors tabular-nums"
              >
                <Phone className="w-4 h-4" aria-hidden="true" />
                <span>{MAYOR_PROFILE.phone}</span>
              </a>
              <a
                href={`mailto:${MAYOR_PROFILE.email}`}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#ECFDF5] hover:bg-emerald-100 text-[#006A4E] border border-emerald-200 text-xs sm:text-sm font-semibold transition-colors"
              >
                <Mail className="w-4 h-4" aria-hidden="true" />
                <span>{MAYOR_PROFILE.email}</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Message from Mayor / Administrator (Refined Civic Quote Block without thick left border) */}
      <section className="civic-card bg-[#ECFDF5]/70 rounded-xl border border-emerald-200 p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2.5 text-[#006A4E]">
          <Quote className="w-5 h-5 shrink-0" aria-hidden="true" />
          <h2 className="text-lg sm:text-xl font-bold text-[#111827]">
            {pickLang(MAYOR_PROFILE.messageTitle, language)}
          </h2>
        </div>

        <blockquote className="space-y-3 text-sm sm:text-base text-[#111827]/90 leading-relaxed max-w-4xl">
          {MAYOR_PROFILE.messageBody.map((para, index) => (
            <p key={index}>{pickLang(para, language)}</p>
          ))}
        </blockquote>

        <p className="text-xs font-semibold text-[#006A4E] pt-3 border-t border-emerald-200/80">
          — {pickLang(MAYOR_PROFILE.name, language)}
        </p>
      </section>

      {/* Priority Initiatives Grid */}
      <section aria-labelledby="mayor-priorities-heading" className="space-y-4">
        <h2 id="mayor-priorities-heading" className="text-lg sm:text-xl font-bold text-[#111827]">
          {language === 'bn' ? 'অগ্রাধিকারমূলক উন্নয়ন কর্মসূচি' : 'Key Priority Initiatives'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {MAYOR_PROFILE.priorities.map((item) => (
            <CivicInfoCard
              key={item.id}
              icon={item.icon}
              title={pickLang(item.title, language)}
              description={pickLang(item.description, language)}
            />
          ))}
        </div>
      </section>

      {/* Biography & Education */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 civic-card bg-white rounded-xl border border-[#E2E8F0] p-6 space-y-3">
          <h2 className="text-lg font-bold text-[#111827]">
            {language === 'bn' ? 'সংক্ষিপ্ত জীবনী ও প্রশাসনিক অভিজ্ঞতা' : 'Executive Biography'}
          </h2>
          <div className="space-y-3 text-sm text-[#4B5563] leading-relaxed">
            {MAYOR_PROFILE.biography.map((para, idx) => (
              <p key={idx}>{pickLang(para, language)}</p>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5 civic-card bg-white rounded-xl border border-[#E2E8F0] p-6 space-y-3">
          <h2 className="text-lg font-bold text-[#111827] flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#006A4E]" aria-hidden="true" />
            <span>{language === 'bn' ? 'শিক্ষাগত যোগ্যতা' : 'Academic Background'}</span>
          </h2>
          <ul className="divide-y divide-slate-100 text-sm text-[#4B5563]">
            {MAYOR_PROFILE.education.map((edu, idx) => (
              <li key={idx} className="py-2.5 first:pt-0 last:pb-0">
                {pickLang(edu, language)}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </AboutPageLayout>
  );
}
