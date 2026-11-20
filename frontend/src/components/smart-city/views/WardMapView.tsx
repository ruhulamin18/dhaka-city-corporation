'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Building2,
  CalendarDays,
  ExternalLink,
  MapPin,
  Navigation,
  Phone,
  PhoneCall,
  Search,
  ShieldCheck,
  Trash2,
  Users,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { INITIAL_WARDS, mockApi } from '@/services/mockApi';
import { SmartCityMap, SmartCityMapPoint } from '@/components/smart-city/SmartCityMap';
import { PUBLIC_FACILITIES } from '@/data/smart-city/smartCityData';
import { pickLang } from '@/types/about';
import type { WardInfo } from '@/types';

export function WardMapView() {
  const { language } = useApp();

  const [wards, setWards] = useState<WardInfo[]>(INITIAL_WARDS);
  const [selectedWardNumber, setSelectedWardNumber] = useState<number>(27);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    let active = true;
    mockApi.getWards().then((w) => {
      if (!active) return;
      setWards(w);
    });
    return () => {
      active = false;
    };
  }, []);

  const activeWard = useMemo(() => {
    return wards.find((w) => w.wardNumber === selectedWardNumber) ?? wards[0];
  }, [wards, selectedWardNumber]);

  // Facilities in this ward
  const wardFacilities = useMemo(() => {
    return PUBLIC_FACILITIES.filter((f) => f.wardNumber === selectedWardNumber);
  }, [selectedWardNumber]);

  const mapPoints: SmartCityMapPoint[] = useMemo(() => {
    return wardFacilities.map((f) => ({
      id: f.id,
      title: f.name,
      category: f.category,
      coords: f.coords,
      wardNumber: f.wardNumber,
      address: f.address,
      phone: f.phone,
      operatingHours: f.operatingHours,
    }));
  }, [wardFacilities]);

  if (!activeWard) return null;

  return (
    <div className="space-y-6">
      {/* 1. Ward Selection Header Bar */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div>
          <label className="block text-xs font-bold text-[#006A4E] uppercase tracking-wider mb-1">
            {language === 'bn' ? 'ওয়ার্ড নির্বাচন করুন' : 'Select Ward Portal'}
          </label>
          <div className="text-sm text-[#4B5563]">
            {language === 'bn'
              ? 'আপনার এলাকার সুনির্দিষ্ট প্রশাসনিক তথ্য ও প্রতিনিধি প্রোফাইল দেখতে ওয়ার্ড বাছাই করুন'
              : 'Choose any administrative ward to inspect local public services and representative details'}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedWardNumber}
            onChange={(e) => setSelectedWardNumber(Number(e.target.value))}
            className="w-full sm:w-auto px-4 py-2.5 text-sm font-semibold bg-[#ECFDF5] border border-emerald-300 text-[#006A4E] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#006A4E] shadow-2xs"
          >
            {wards.map((w) => (
              <option key={w.wardNumber} value={w.wardNumber}>
                {language === 'bn'
                  ? `ওয়ার্ড ${w.wardNumber} — ${w.nameBn}`
                  : `Ward ${w.wardNumber} — ${w.nameEn}`}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 2. Ward Profile & Summary Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Official Administrative Profile */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <span className="text-[11px] font-bold text-[#006A4E] uppercase tracking-wider">
              {language === 'bn' ? activeWard.zoneBn : activeWard.zoneEn}
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-[#111827] mt-0.5">
              {language === 'bn'
                ? `ওয়ার্ড নং ${activeWard.wardNumber}: ${activeWard.nameBn}`
                : `Ward No. ${activeWard.wardNumber}: ${activeWard.nameEn}`}
            </h2>
          </div>

          {/* Councillor Information */}
          <div className="p-4 rounded-xl bg-[#F8FAFC] border border-slate-200 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#006A4E] text-white flex items-center justify-center font-bold text-lg shrink-0 shadow-xs">
                {activeWard.councillorEn.charAt(0)}
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#006A4E] bg-emerald-50 px-2 py-0.5 rounded">
                  {language === 'bn' ? 'নির্বাচিত ওয়ার্ড কাউন্সিলর' : 'Ward Councillor'}
                </span>
                <h3 className="font-bold text-sm text-[#111827] mt-0.5">
                  {language === 'bn' ? activeWard.councillorBn : activeWard.councillorEn}
                </h3>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200/80 space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[#4B5563]">{language === 'bn' ? 'সরাসরি মোবাইল:' : 'Direct Cell:'}</span>
                <a
                  href={`tel:${activeWard.councillorPhone}`}
                  className="font-bold text-[#006A4E] hover:underline"
                >
                  {activeWard.councillorPhone}
                </a>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#4B5563]">{language === 'bn' ? 'জরুরি হেল্পলাইন:' : 'Ward Helpline:'}</span>
                <a
                  href={`tel:${activeWard.emergencyPhone}`}
                  className="font-bold text-[#C81E1E] hover:underline"
                >
                  {activeWard.emergencyPhone}
                </a>
              </div>
            </div>
          </div>

          {/* Demographic & Geographical Statistics */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-xs text-[#4B5563] font-medium flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-[#006A4E]" />
                <span>{language === 'bn' ? 'মোট জনসংখ্যা' : 'Population'}</span>
              </div>
              <div className="text-lg font-bold text-[#111827] mt-1 tabular-nums">
                {activeWard.population.toLocaleString()}
              </div>
              <span className="text-[10px] text-slate-400">
                {language === 'bn' ? 'ভোটার ও অধিবাসী' : 'Verified Census'}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-xs text-[#4B5563] font-medium flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-[#006A4E]" />
                <span>{language === 'bn' ? 'মোট আয়তন' : 'Area Size'}</span>
              </div>
              <div className="text-lg font-bold text-[#111827] mt-1 tabular-nums">
                {activeWard.areaSqKm} km²
              </div>
              <span className="text-[10px] text-slate-400">
                {language === 'bn' ? 'বর্গকিলোমিটার' : 'Square Kilometers'}
              </span>
            </div>
          </div>

          {/* Municipal Schedules */}
          <div className="space-y-3 pt-2">
            <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs space-y-1">
              <div className="font-bold text-[#006A4E] flex items-center gap-1.5">
                <Trash2 className="w-3.5 h-3.5" />
                <span>{language === 'bn' ? 'বর্জ্য অপসারণ সময়সূচি' : 'Waste Collection'}</span>
              </div>
              <div className="text-[#111827]">
                {language === 'bn' ? activeWard.wasteScheduleBn : activeWard.wasteScheduleEn}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 text-xs space-y-1">
              <div className="font-bold text-amber-800 flex items-center gap-1.5">
                <CalendarDays className="w-3.5 h-3.5" />
                <span>{language === 'bn' ? 'সান্ধ্যকালীন মশক নিধন ফগিং' : 'Mosquito Fogging'}</span>
              </div>
              <div className="text-[#111827]">
                {language === 'bn' ? activeWard.foggingScheduleBn : activeWard.foggingScheduleEn}
              </div>
            </div>
          </div>
        </div>

        {/* Center & Right Column: Interactive Ward Satellite Map & Local Facilities */}
        <div className="lg:col-span-2 space-y-6">
          <SmartCityMap
            points={mapPoints}
            selectedWard={selectedWardNumber}
            interactiveTitle={
              language === 'bn'
                ? `ওয়ার্ড ${activeWard.wardNumber} স্যাটেলাইট ম্যাপ`
                : `Ward ${activeWard.wardNumber} Satellite Map`
            }
            heightClass="h-[400px] lg:h-[460px]"
          />

          {/* Facilities List in This Ward */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-[#111827]">
                  {language === 'bn'
                    ? `ওয়ার্ড ${activeWard.wardNumber} এর আওতাধীন গণসুবিধাসমূহ`
                    : `Public Facilities in Ward ${activeWard.wardNumber}`}
                </h3>
                <p className="text-xs text-[#4B5563]">
                  {language === 'bn'
                    ? 'হাসপাতাল, থানা, কাউন্সিলর অফিস ও পাবলিক পার্ক'
                    : 'Hospitals, police stations, ward secretariat and civic parks'}
                </p>
              </div>
            </div>

            {wardFacilities.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {wardFacilities.map((fac) => (
                  <div
                    key={fac.id}
                    className="p-3.5 rounded-xl border border-slate-200 hover:border-[#006A4E] transition-all bg-[#F8FAFC]"
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#ECFDF5] text-[#006A4E]">
                        {fac.category.replace('_', ' ')}
                      </span>
                      {fac.emergencyDirect && (
                        <span className="text-[10px] font-bold text-[#C81E1E]">24/7 Service</span>
                      )}
                    </div>
                    <h4 className="font-bold text-sm text-[#111827] mt-1">
                      {pickLang(fac.name, language)}
                    </h4>
                    <p className="text-xs text-[#4B5563] mt-1 leading-relaxed">
                      {pickLang(fac.address, language)}
                    </p>
                    <div className="mt-2.5 pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
                      <a
                        href={`tel:${fac.phone}`}
                        className="text-[#006A4E] font-semibold hover:underline flex items-center gap-1"
                      >
                        <Phone className="w-3 h-3" />
                        <span>{fac.phone}</span>
                      </a>
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${fac.coords.lat},${fac.coords.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#006A4E] font-semibold hover:underline flex items-center gap-1"
                      >
                        <Navigation className="w-3 h-3" />
                        <span>{language === 'bn' ? 'রুট' : 'Directions'}</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-slate-400 text-xs">
                {language === 'bn'
                  ? 'এই ওয়ার্ডের তালিকাভুক্ত সুযোগ-সুবিধাগুলোর জিআইএস তথ্য হালনাগাদ করা হচ্ছে।'
                  : 'GIS records for this specific ward are undergoing routine verification.'}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
