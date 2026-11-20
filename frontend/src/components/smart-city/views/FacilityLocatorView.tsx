'use client';

import React, { useMemo, useState } from 'react';
import {
  Building2,
  Clock,
  Compass,
  Cross,
  ExternalLink,
  GraduationCap,
  Layers,
  MapPin,
  Navigation,
  Phone,
  Search,
  Shield,
  Siren,
  Trees,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { SmartCityMap, SmartCityMapPoint } from '@/components/smart-city/SmartCityMap';
import { PUBLIC_FACILITIES } from '@/data/smart-city/smartCityData';
import { pickLang } from '@/types/about';
import type { FacilityCategoryType } from '@/types/smart-city';

export function FacilityLocatorView() {
  const { language } = useApp();

  const [selectedWard, setSelectedWard] = useState<number | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = useState<FacilityCategoryType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPointId, setSelectedPointId] = useState<string | null>(null);

  const categories: Array<{ id: FacilityCategoryType | 'all'; bn: string; en: string }> = [
    { id: 'all', bn: 'সকল সুবিধা', en: 'All Facilities' },
    { id: 'hospital', bn: 'হাসপাতাল', en: 'Hospitals' },
    { id: 'police', bn: 'থানা / পুলিশ', en: 'Police' },
    { id: 'fire_station', bn: 'ফায়ার সার্ভিস', en: 'Fire Station' },
    { id: 'ward_office', bn: 'কাউন্সিলর অফিস', en: 'Ward Offices' },
    { id: 'toilet', bn: 'পাবলিক টয়লেট', en: 'Public Toilets' },
    { id: 'park', bn: 'পার্ক ও উদ্যান', en: 'Parks' },
    { id: 'community_center', bn: 'কমিউনিটি সেন্টার', en: 'Community Centers' },
    { id: 'education', bn: 'শিক্ষা প্রতিষ্ঠান', en: 'Schools' },
    { id: 'transport', bn: 'মেট্রো / পরিবহন', en: 'Transport' },
  ];

  const filteredFacilities = useMemo(() => {
    return PUBLIC_FACILITIES.filter((f) => {
      const matchWard = selectedWard === 'all' || f.wardNumber === selectedWard;
      const matchCat = selectedCategory === 'all' || f.category === selectedCategory;
      const q = searchQuery.trim().toLowerCase();
      const matchQuery =
        !q ||
        f.name.bn.toLowerCase().includes(q) ||
        f.name.en.toLowerCase().includes(q) ||
        f.address.bn.toLowerCase().includes(q) ||
        f.address.en.toLowerCase().includes(q);
      return matchWard && matchCat && matchQuery;
    });
  }, [selectedWard, selectedCategory, searchQuery]);

  const mapPoints: SmartCityMapPoint[] = useMemo(() => {
    return filteredFacilities.map((f) => ({
      id: f.id,
      title: f.name,
      category: f.category,
      categoryLabel: {
        bn: f.category.replace('_', ' ').toUpperCase(),
        en: f.category.replace('_', ' ').toUpperCase(),
      },
      coords: f.coords,
      wardNumber: f.wardNumber,
      address: f.address,
      phone: f.phone,
      operatingHours: f.operatingHours,
      details: {
        bn: f.services.map((s) => s.bn).join(', '),
        en: f.services.map((s) => s.en).join(', '),
      },
    }));
  }, [filteredFacilities]);

  return (
    <div className="space-y-6">
      {/* 1. Header Toolbar & Filters */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                language === 'bn'
                  ? 'সুবিধার নাম, ঠিকানা বা ল্যান্ডমার্ক দিয়ে খুঁজুন...'
                  : 'Search by facility name, address or landmark...'
              }
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#006A4E] focus:bg-white"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-700">
              {language === 'bn' ? 'ওয়ার্ড ফিল্টার:' : 'Filter Ward:'}
            </span>
            <select
              value={selectedWard}
              onChange={(e) =>
                setSelectedWard(e.target.value === 'all' ? 'all' : Number(e.target.value))
              }
              className="px-3.5 py-2 text-xs sm:text-sm font-semibold bg-white border border-slate-300 rounded-xl focus:outline-none"
            >
              <option value="all">{language === 'bn' ? 'সকল ওয়ার্ড' : 'All Wards'}</option>
              {[12, 19, 24, 27, 32, 36, 41, 48].map((w) => (
                <option key={w} value={w}>
                  {language === 'bn' ? `ওয়ার্ড ${w}` : `Ward ${w}`}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2">
          {categories.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                selectedCategory === c.id
                  ? 'bg-[#006A4E] text-white border-[#006A4E] shadow-2xs'
                  : 'bg-white border-slate-200 text-[#4B5563] hover:bg-slate-50'
              }`}
            >
              {language === 'bn' ? c.bn : c.en}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Interactive Map */}
      <SmartCityMap
        points={mapPoints}
        selectedWard={selectedWard}
        selectedPointId={selectedPointId}
        onSelectPoint={(p) => setSelectedPointId(p.id)}
        interactiveTitle={
          language === 'bn' ? 'ঢাকা পাবলিক ফ্যাসিলিটি স্যাটেলাইট ম্যাপ' : 'Dhaka Public Facility Satellite Map'
        }
      />

      {/* 3. Facility Directory Cards */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-[#111827]">
            {language === 'bn' ? 'গণসুবিধা সমূহের তালিকা' : 'Municipal Facility Directory'}
          </h3>
          <span className="text-xs text-slate-500 font-mono">
            {filteredFacilities.length} {language === 'bn' ? 'টি সুবিধা পাওয়া গেছে' : 'facilities found'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredFacilities.map((fac) => (
            <div
              key={fac.id}
              onClick={() => setSelectedPointId(fac.id)}
              className="p-4 rounded-xl border border-slate-200 hover:border-[#006A4E] bg-[#F8FAFC] space-y-3 cursor-pointer transition-all group"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider bg-[#ECFDF5] text-[#006A4E] border border-emerald-200">
                  {fac.category.replace('_', ' ')}
                </span>
                <span className="text-xs font-semibold text-slate-500 font-mono">
                  {language === 'bn' ? `ওয়ার্ড ${fac.wardNumber}` : `Ward ${fac.wardNumber}`}
                </span>
              </div>

              <div>
                <h4 className="text-sm font-bold text-[#111827] group-hover:text-[#006A4E] transition-colors">
                  {pickLang(fac.name, language)}
                </h4>
                <div className="text-xs text-[#4B5563] mt-1 flex items-start gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#006A4E] shrink-0 mt-0.5" />
                  <span>{pickLang(fac.address, language)}</span>
                </div>
              </div>

              {fac.services && fac.services.length > 0 && (
                <div className="text-[11px] text-slate-600 line-clamp-1 bg-white p-2 rounded-lg border border-slate-100">
                  {fac.services.map((s) => pickLang(s, language)).join(' · ')}
                </div>
              )}

              <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-xs">
                <a
                  href={`tel:${fac.phone}`}
                  className="font-bold text-[#006A4E] hover:underline flex items-center gap-1"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>{fac.phone}</span>
                </a>

                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${fac.coords.lat},${fac.coords.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-[#006A4E] hover:underline flex items-center gap-1"
                >
                  <Navigation className="w-3 h-3" />
                  <span>{language === 'bn' ? 'নেভিগেশন' : 'Directions'}</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
