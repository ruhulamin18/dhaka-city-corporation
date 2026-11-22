'use client';

import React from 'react';
import { Clock, Mail, MapPin, Phone } from 'lucide-react';
import { Language } from '@/types';
import { PersonProfile, pickLang } from '@/types/about';

export interface PersonProfileCardProps {
  person: PersonProfile;
  language: Language;
}

function getInitials(nameEn: string): string {
  const cleaned = nameEn
    .replace(/\b(Md\.|Dr\.|Engr\.|Col\.|Hazi)\b/gi, '')
    .trim();
  const parts = cleaned.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'DC';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

export function PersonProfileCard({ person, language }: PersonProfileCardProps) {
  const name = pickLang(person.name, language);
  const designation = pickLang(person.designation, language);
  const metaLine = pickLang(person.badgeText, language);
  const hours = pickLang(person.officeHours, language);
  const location = person.officeLocation ? pickLang(person.officeLocation, language) : null;
  const initials = getInitials(person.name.en);

  return (
    <article className="group relative overflow-hidden civic-card bg-white rounded-xl border border-[#E2E8F0] p-5 flex flex-col justify-between gap-4 shadow-xs transition-all duration-300 ease-out hover:bg-[#ECFDF5]/80 hover:border-[#006A4E] hover:-translate-y-1 hover:shadow-md">
      {/* Top Accent Indicator */}
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-1 bg-transparent group-hover:bg-[#006A4E] transition-colors duration-300"
      />

      <div className="space-y-3">
        {/* Header with Avatar + Identity */}
        <div className="flex items-start gap-3.5">
          <div
            aria-hidden="true"
            className="w-12 h-12 rounded-xl bg-[#ECFDF5] border border-emerald-200 text-[#006A4E] group-hover:bg-[#006A4E] group-hover:text-white group-hover:border-[#006A4E] group-hover:scale-105 font-bold text-sm flex items-center justify-center shrink-0 shadow-2xs transition-all duration-300"
          >
            {initials}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-[#006A4E] truncate">{metaLine}</p>
            <h3 className="text-base font-bold text-[#111827] group-hover:text-[#006A4E] transition-colors duration-300 leading-snug mt-0.5">
              {name}
            </h3>
            <p className="text-xs text-[#4B5563] mt-0.5 leading-snug">{designation}</p>
          </div>
        </div>

        {/* Contact & Office Details */}
        <div className="pt-3 border-t border-slate-100 group-hover:border-emerald-200/60 transition-colors duration-300 space-y-2 text-xs text-[#4B5563]">
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-[#006A4E] shrink-0" aria-hidden="true" />
            <span>{hours}</span>
          </div>
          {location && (
            <div className="flex items-start gap-2">
              <MapPin className="w-3.5 h-3.5 text-[#006A4E] shrink-0 mt-0.5" aria-hidden="true" />
              <span>{location}</span>
            </div>
          )}
        </div>
      </div>

      {/* Action Links */}
      <div className="pt-3 border-t border-slate-100 group-hover:border-emerald-200/60 transition-colors duration-300 flex flex-wrap items-center gap-2">
        <a
          href={`tel:${person.phone.replace(/[^+\d]/g, '')}`}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#006A4E] hover:bg-[#00523C] text-white text-xs font-semibold transition-all duration-200 tabular-nums whitespace-nowrap shadow-xs hover:shadow-sm"
        >
          <Phone className="w-3.5 h-3.5" aria-hidden="true" />
          <span>{person.phone}</span>
        </a>
        <a
          href={`mailto:${person.email}`}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#ECFDF5] hover:bg-emerald-100 group-hover:bg-white group-hover:border-[#006A4E]/40 text-[#006A4E] border border-emerald-200 text-xs font-semibold transition-all duration-200 whitespace-nowrap shadow-2xs"
          title={person.email}
        >
          <Mail className="w-3.5 h-3.5" aria-hidden="true" />
          <span>{language === 'bn' ? 'ইমেইল' : 'Email'}</span>
        </a>
      </div>
    </article>
  );
}
