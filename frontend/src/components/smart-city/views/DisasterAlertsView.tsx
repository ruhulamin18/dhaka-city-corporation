'use client';

import React, { useMemo, useState } from 'react';
import {
  AlertCircle,
  AlertTriangle,
  Building,
  Calendar,
  CheckCircle2,
  Clock,
  CloudRain,
  Flame,
  Info,
  MapPin,
  ShieldAlert,
  Wind,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { DISASTER_ALERTS } from '@/data/smart-city/smartCityData';
import { pickLang } from '@/types/about';
import type { DisasterAlertCategory } from '@/types/smart-city';

export function DisasterAlertsView() {
  const { language } = useApp();

  const [categoryFilter, setCategoryFilter] = useState<DisasterAlertCategory | 'all'>('all');

  const filteredAlerts = useMemo(() => {
    return DISASTER_ALERTS.filter(
      (a) => categoryFilter === 'all' || a.category === categoryFilter
    );
  }, [categoryFilter]);

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical':
      case 'high':
        return {
          bg: 'bg-rose-50 text-[#C81E1E] border-rose-200',
          dot: 'bg-[#C81E1E]',
          labelBn: 'জরুরি সতর্কতা (High Alert)',
          labelEn: 'High Alert',
        };
      case 'medium':
        return {
          bg: 'bg-amber-50 text-amber-800 border-amber-200',
          dot: 'bg-amber-500',
          labelBn: 'মধ্যম সতর্কতা (Advisory)',
          labelEn: 'Advisory',
        };
      default:
        return {
          bg: 'bg-blue-50 text-blue-700 border-blue-200',
          dot: 'bg-blue-500',
          labelBn: 'সাধারণ তথ্য (Info)',
          labelEn: 'Information',
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Official Meteorological & Civil Defence Notice */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-bold text-[#006A4E] uppercase tracking-wider">
              {language === 'bn' ? 'বাংলাদেশ আবহাওয়া অধিদপ্তর ও দুর্যোগ সেল' : 'Meteorological Dept & Disaster Command'}
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-[#111827] mt-0.5">
              {language === 'bn' ? 'সক্রিয় দুর্যোগ ও আবহাওয়া সতর্কবার্তা' : 'Active Meteorological Bulletins & Disaster Alerts'}
            </h2>
            <p className="text-xs sm:text-sm text-[#4B5563] mt-1 max-w-xl">
              {language === 'bn'
                ? 'সরকারি অনুমোদিত উৎস থেকে প্রকাশিত ঝড়, ভারী বর্ষণ, জলাবদ্ধতা ও জনস্বাস্থ্য বুলেটিন।'
                : 'Certified emergency weather advisories, flash waterlogging bulletins, and public safety directives.'}
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'all', bn: 'সকল বার্তা', en: 'All Alerts' },
              { id: 'warning', bn: 'সতর্কতা (Warning)', en: 'Warnings' },
              { id: 'advisory', bn: 'পরামর্শ (Advisory)', en: 'Advisories' },
              { id: 'information', bn: 'বিজ্ঞপ্তি (Info)', en: 'Notices' },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategoryFilter(cat.id as DisasterAlertCategory | 'all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                  categoryFilter === cat.id
                    ? 'bg-[#006A4E] text-white border-[#006A4E] shadow-2xs'
                    : 'bg-white border-slate-200 text-[#4B5563] hover:bg-slate-50'
                }`}
              >
                {language === 'bn' ? cat.bn : cat.en}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Alert Cards Feed */}
      <div className="space-y-4">
        {filteredAlerts.map((alert) => {
          const badge = getSeverityBadge(alert.severityLevel);
          return (
            <div
              key={alert.id}
              className="bg-white rounded-2xl border border-slate-200 hover:border-slate-300 p-6 sm:p-7 shadow-xs space-y-4 transition-all"
            >
              {/* Header Badges */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${badge.bg}`}
                  >
                    <span className={`w-2 h-2 rounded-full ${badge.dot} animate-pulse`} />
                    <span>{language === 'bn' ? badge.labelBn : badge.labelEn}</span>
                  </span>

                  <span className="text-xs font-semibold text-slate-500 font-mono">
                    {language === 'bn' ? `প্রকাশ: ${alert.publishedAt}` : `Issued: ${alert.publishedAt}`}
                  </span>
                </div>

                {alert.expiresAt && (
                  <span className="text-xs text-rose-600 font-semibold flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>
                      {language === 'bn' ? 'মেয়াদ শেষ: ' : 'Expires: '}
                      {alert.expiresAt}
                    </span>
                  </span>
                )}
              </div>

              {/* Alert Title */}
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-[#111827]">
                  {pickLang(alert.title, language)}
                </h3>
                <div className="flex items-center gap-1.5 text-xs text-[#006A4E] font-medium mt-1">
                  <MapPin className="w-3.5 h-3.5 shrink-0" />
                  <span>
                    <strong>{language === 'bn' ? 'আওতাভুক্ত এলাকা: ' : 'Affected Corridor: '}</strong>
                    {pickLang(alert.affectedLocationName, language)}
                  </span>
                </div>
              </div>

              {/* Safety Instructions List */}
              <div className="p-4 rounded-xl bg-[#F8FAFC] border border-slate-200/80 space-y-2">
                <span className="text-xs font-bold text-[#111827] uppercase tracking-wider block">
                  {language === 'bn' ? 'নাগরিকদের জন্য জীবনরক্ষাকারী নির্দেশনা:' : 'Mandatory Citizen Safety Directives:'}
                </span>
                <ul className="space-y-1.5 text-xs sm:text-sm text-[#4B5563]">
                  {alert.instructions.map((ins, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#006A4E] shrink-0 mt-2" />
                      <span>{pickLang(ins, language)}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Authority & Official Source Footer */}
              <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500">
                <div className="flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-[#006A4E]" />
                  <span>
                    <strong>{language === 'bn' ? 'জারি করা কর্তৃপক্ষ: ' : 'Issuing Authority: '}</strong>
                    {pickLang(alert.issuingAuthority, language)}
                  </span>
                </div>

                <div className="italic text-slate-400">
                  {pickLang(alert.officialSource, language)}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
