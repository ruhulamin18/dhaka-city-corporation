'use client';

import React, { Suspense, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  Clock,
  ExternalLink,
  Layers,
  MapPin,
  Navigation,
  PhoneCall,
  Recycle,
  Search,
  Sparkles,
  Trees,
  Construction,
  Cross,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { mockApi } from '@/services/mockApi';
import { GisLayerType, GisMarker, WardInfo } from '@/types';
import {
  ALL_GIS_LAYERS,
  GIS_LAYER_META,
  resolveGisLayerParam,
  resolveWardParam,
} from '@/data/cityMapData';
import { InteractiveCityMap } from '@/components/InteractiveCityMap';

interface QuickAreaJump {
  id: string;
  nameBn: string;
  nameEn: string;
  wardNumber: number;
}

const QUICK_AREAS: QuickAreaJump[] = [
  { id: 'dhanmondi', nameBn: 'ধানমন্ডি', nameEn: 'Dhanmondi', wardNumber: 27 },
  { id: 'gulshan', nameBn: 'গুলশান', nameEn: 'Gulshan', wardNumber: 19 },
  { id: 'mirpur', nameBn: 'মিরপুর', nameEn: 'Mirpur', wardNumber: 12 },
  { id: 'motijheel', nameBn: 'মতিঝিল', nameEn: 'Motijheel', wardNumber: 36 },
  { id: 'lalbagh', nameBn: 'লালবাগ', nameEn: 'Lalbagh', wardNumber: 24 },
  { id: 'uttara', nameBn: 'উত্তরা', nameEn: 'Uttara', wardNumber: 41 },
];

function CityMapContent() {
  const { language, t } = useApp();
  const searchParams = useSearchParams();
  const wardParam = searchParams.get('ward');
  const layerParam = searchParams.get('layer');

  const initialWard = resolveWardParam(wardParam);
  const resolvedLayer = resolveGisLayerParam(layerParam);

  const [wards, setWards] = useState<WardInfo[]>([]);
  const [markers, setMarkers] = useState<GisMarker[]>([]);
  const [selectedWard, setSelectedWard] = useState<number | 'all'>(initialWard);
  const [activeLayers, setActiveLayers] = useState<GisLayerType[]>(
    resolvedLayer ? [resolvedLayer] : ALL_GIS_LAYERS
  );
  const [selectedMarker, setSelectedMarker] = useState<GisMarker | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    let active = true;
    Promise.all([mockApi.getWards(), mockApi.getGisMarkers()]).then(([w, m]) => {
      if (!active) return;
      setWards(w);
      setMarkers(m);
      if (m.length > 0) {
        const preferred = resolvedLayer
          ? m.find(
              (marker) =>
                marker.type === resolvedLayer &&
                (initialWard === 'all' || marker.wardNumber === initialWard)
            )
          : initialWard !== 'all'
            ? m.find((marker) => marker.wardNumber === initialWard)
            : m[0];
        setSelectedMarker(preferred ?? m[0]);
      }
    });
    return () => {
      active = false;
    };
  }, [initialWard, resolvedLayer]);

  // Sync filter state when navigating to /city-map with new ?ward= or ?layer= query parameters
  useEffect(() => {
    const nextWard = resolveWardParam(wardParam);
    const nextLayer = resolveGisLayerParam(layerParam);
    queueMicrotask(() => {
      setSelectedWard(nextWard);
      setActiveLayers(nextLayer ? [nextLayer] : ALL_GIS_LAYERS);
    });
  }, [wardParam, layerParam]);

  const toggleLayer = (layer: GisLayerType) => {
    setActiveLayers((prev) =>
      prev.includes(layer) ? prev.filter((l) => l !== layer) : [...prev, layer]
    );
  };

  // Filtered markers based on layers, ward, and search query
  const filteredMarkers = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return markers.filter((m) => {
      const layerMatch = activeLayers.includes(m.type);
      const wardMatch = selectedWard === 'all' || m.wardNumber === selectedWard;
      if (!layerMatch || !wardMatch) return false;
      if (!q) return true;
      const titleMatch =
        m.titleEn.toLowerCase().includes(q) || m.titleBn.toLowerCase().includes(q);
      const detailMatch =
        (m.detailsEn && m.detailsEn.toLowerCase().includes(q)) ||
        (m.detailsBn && m.detailsBn.toLowerCase().includes(q));
      const addressMatch =
        (m.addressEn && m.addressEn.toLowerCase().includes(q)) ||
        (m.addressBn && m.addressBn.toLowerCase().includes(q));
      const wardStrMatch = `ward ${m.wardNumber}`.includes(q) || `ওয়ার্ড ${m.wardNumber}`.includes(q);
      return titleMatch || detailMatch || addressMatch || wardStrMatch;
    });
  }, [markers, activeLayers, selectedWard, searchQuery]);

  const handleSelectFacility = (marker: GisMarker) => {
    setSelectedMarker(marker);
    if (selectedWard !== 'all' && selectedWard !== marker.wardNumber) {
      setSelectedWard('all');
    }
  };

  const handleQuickArea = (area: QuickAreaJump) => {
    setSelectedWard(area.wardNumber);
    const matchingInArea = markers.find((m) => m.wardNumber === area.wardNumber);
    if (matchingInArea) {
      setSelectedMarker(matchingInArea);
    }
  };

  // Summary counts for the bottom metrics strip
  const summaryStats = useMemo(() => {
    const relevant = selectedWard === 'all' ? markers : markers.filter((m) => m.wardNumber === selectedWard);
    return {
      parks: relevant.filter((m) => m.type === 'park').length,
      waste: relevant.filter((m) => m.type === 'waste_point').length,
      roads: relevant.filter((m) => m.type === 'road_digging').length,
      civic: relevant.filter((m) => m.type === 'hospital' || m.type === 'public_toilet').length,
    };
  }, [markers, selectedWard]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
      {/* Page Header */}
      <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#ECFDF5] border border-emerald-200 text-[#006A4E] text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? 'ডিএসসিসি ইন্টারেক্টিভ জিআইএস পোর্টাল' : 'DSCC Interactive GIS Portal'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#111827]">{t.cityMapPage.title}</h1>
          <p className="mt-1.5 text-sm sm:text-base text-[#4B5563] max-w-3xl">
            {t.cityMapPage.subtitle}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <label
            htmlFor="map-ward-filter"
            className="text-xs font-semibold text-[#111827] whitespace-nowrap"
          >
            {t.common.ward}:
          </label>
          <select
            id="map-ward-filter"
            value={selectedWard}
            onChange={(e) =>
              setSelectedWard(e.target.value === 'all' ? 'all' : Number(e.target.value))
            }
            className="px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006A4E]"
          >
            <option value="all">{t.cityMapPage.allWards}</option>
            {wards.map((w) => (
              <option key={w.wardNumber} value={w.wardNumber}>
                {t.common.ward} {w.wardNumber} — {language === 'bn' ? w.nameBn : w.nameEn}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Quick Search & Neighborhood Jump Bar */}
      <div className="civic-card bg-white rounded-xl border border-[#E2E8F0] p-4 mb-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center gap-3.5">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                language === 'bn'
                  ? 'স্থাপনার নাম, এলাকা বা ধরণ দিয়ে খুঁজুন (উদাঃ ধানমন্ডি, হাসপাতাল, টয়লেট)...'
                  : 'Search by facility, area or type (e.g., Dhanmondi, Hospital, Toilet)...'
              }
              className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-[#111827] placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#006A4E] focus:border-transparent transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none text-xs">
            <span className="text-slate-500 font-semibold whitespace-nowrap text-xs flex items-center gap-1">
              <Navigation className="w-3.5 h-3.5 text-[#006A4E]" />
              {language === 'bn' ? 'দ্রুত গমন:' : 'Quick Jump:'}
            </span>
            {QUICK_AREAS.map((area) => {
              const isSelected = selectedWard === area.wardNumber;
              return (
                <button
                  key={area.id}
                  type="button"
                  onClick={() => handleQuickArea(area)}
                  className={`px-2.5 py-1 rounded-md text-xs font-semibold whitespace-nowrap border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#006A4E] text-white border-[#006A4E] shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-[#ECFDF5] hover:border-[#006A4E] hover:text-[#006A4E]'
                  }`}
                >
                  {language === 'bn' ? area.nameBn : area.nameEn}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Layer Controls, Scrollable Location List & Selected Marker Inspector */}
        <div className="lg:col-span-4 space-y-5">
          {/* Layer Filter Toggles */}
          <div className="civic-card bg-white rounded-xl border border-[#E2E8F0] p-4 sm:p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-[#111827] flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#006A4E]" />
                {t.cityMapPage.layersTitle}
              </h2>
              {activeLayers.length !== ALL_GIS_LAYERS.length && (
                <button
                  type="button"
                  onClick={() => setActiveLayers(ALL_GIS_LAYERS)}
                  className="text-[11px] font-semibold text-[#006A4E] hover:underline cursor-pointer"
                >
                  {language === 'bn' ? 'সব স্তর দেখুন' : 'Show All'}
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-2">
              {GIS_LAYER_META.map((layer) => {
                const Icon = layer.icon;
                const enabled = activeLayers.includes(layer.id);
                const count = markers.filter(
                  (m) =>
                    m.type === layer.id &&
                    (selectedWard === 'all' || m.wardNumber === selectedWard)
                ).length;
                return (
                  <button
                    key={layer.id}
                    type="button"
                    aria-pressed={enabled}
                    onClick={() => toggleLayer(layer.id)}
                    className={`flex items-center justify-between px-2.5 py-2 rounded-lg border text-left text-xs font-medium transition-all cursor-pointer ${
                      enabled
                        ? 'bg-[#ECFDF5] border-[#006A4E] text-[#111827] shadow-xs'
                        : 'bg-white border-[#E2E8F0] text-slate-400 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 truncate">
                      <span
                        className={`w-5 h-5 rounded-md flex-shrink-0 flex items-center justify-center text-white ${layer.dotClass}`}
                      >
                        <Icon className="w-3 h-3" aria-hidden="true" />
                      </span>
                      <span className="truncate">{t.cityMapPage.layers[layer.id]}</span>
                    </div>
                    <span className="font-mono font-bold text-[11px] tabular-nums ml-1">
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Scrollable Matching Facilities List */}
          <div className="civic-card bg-white rounded-xl border border-[#E2E8F0] overflow-hidden shadow-xs">
            <div className="px-4 py-3 border-b border-[#E2E8F0] bg-slate-50 flex items-center justify-between">
              <span className="text-xs font-bold text-[#111827]">
                {language === 'bn' ? 'তালিকাভুক্ত সুবিধাসমূহ' : 'Matching Facilities'}
              </span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 text-[#006A4E] font-bold tabular-nums">
                {filteredMarkers.length} {language === 'bn' ? 'টি' : 'items'}
              </span>
            </div>

            <div className="max-h-56 overflow-y-auto divide-y divide-slate-100">
              {filteredMarkers.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-500">
                  {language === 'bn'
                    ? 'কোনো স্থাপনা পাওয়া যায়নি। সার্চ ফিল্টার পরিবর্তন করুন।'
                    : 'No matching facilities found. Try adjusting your filters.'}
                </div>
              ) : (
                filteredMarkers.map((m) => {
                  const isSelected = selectedMarker?.id === m.id;
                  const meta = GIS_LAYER_META.find((l) => l.id === m.type);
                  const Icon = meta ? meta.icon : MapPin;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => handleSelectFacility(m)}
                      className={`w-full text-left px-3.5 py-2.5 flex items-start gap-2.5 transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-[#ECFDF5] border-l-4 border-l-[#006A4E]'
                          : 'hover:bg-slate-50 border-l-4 border-l-transparent'
                      }`}
                    >
                      <div
                        className={`w-6 h-6 rounded-md flex-shrink-0 flex items-center justify-center text-white mt-0.5 ${
                          meta?.dotClass || 'bg-[#006A4E]'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <p
                            className={`text-xs font-semibold truncate ${
                              isSelected ? 'text-[#006A4E]' : 'text-[#111827]'
                            }`}
                          >
                            {language === 'bn' ? m.titleBn : m.titleEn}
                          </p>
                          <span className="text-[10px] text-slate-500 font-mono flex-shrink-0">
                            W-{m.wardNumber}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 truncate mt-0.5">
                          {language === 'bn' ? m.detailsBn : m.detailsEn}
                        </p>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Enhanced Facility Detail Inspector */}
          {selectedMarker && (
            <div className="civic-card bg-white rounded-xl border border-[#006A4E]/30 p-5 shadow-sm space-y-3.5 animate-fadeIn">
              <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-100">
                <span className="font-bold text-[#006A4E] uppercase tracking-wide text-[11px]">
                  {t.cityMapPage.layers[selectedMarker.type]}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px] font-mono font-semibold">
                  {t.common.ward} {selectedMarker.wardNumber}
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-[#111827]">
                  {language === 'bn' ? selectedMarker.titleBn : selectedMarker.titleEn}
                </h3>
                <div className="flex items-center gap-1.5 mt-1 text-xs font-semibold text-emerald-800">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  <span>
                    {language === 'bn' ? selectedMarker.statusBn : selectedMarker.statusEn}
                  </span>
                </div>
              </div>

              <p className="text-xs text-[#4B5563] leading-relaxed">
                {language === 'bn' ? selectedMarker.detailsBn : selectedMarker.detailsEn}
              </p>

              {/* Rich metadata: Address, Phone, Hours, GPS */}
              <div className="bg-slate-50 rounded-lg p-3 space-y-2 text-xs border border-slate-200">
                <div className="flex items-start gap-2 text-slate-700">
                  <MapPin className="w-3.5 h-3.5 text-[#006A4E] flex-shrink-0 mt-0.5" />
                  <span className="leading-snug">
                    {language === 'bn'
                      ? selectedMarker.addressBn || `ওয়ার্ড নং ${selectedMarker.wardNumber}, ঢাকা`
                      : selectedMarker.addressEn || `Ward No ${selectedMarker.wardNumber}, Dhaka`}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-slate-700">
                  <PhoneCall className="w-3.5 h-3.5 text-[#006A4E] flex-shrink-0" />
                  <a
                    href={`tel:${selectedMarker.phone || '+88029556014'}`}
                    className="font-mono text-emerald-700 font-semibold hover:underline"
                  >
                    {selectedMarker.phone || '+880 2-9556014 (DSCC Helpline)'}
                  </a>
                </div>

                <div className="flex items-center gap-2 text-slate-700">
                  <Clock className="w-3.5 h-3.5 text-[#006A4E] flex-shrink-0" />
                  <span>
                    {language === 'bn'
                      ? selectedMarker.operatingHoursBn || 'সকাল ৯:০০ - বিকাল ৫:০০'
                      : selectedMarker.operatingHoursEn || '09:00 AM - 05:00 PM'}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono pt-1 border-t border-slate-200">
                  <span>GPS:</span>
                  <span>
                    {selectedMarker.latitude.toFixed(4)}°N, {selectedMarker.longitude.toFixed(4)}°E
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-1 flex flex-col gap-2">
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${selectedMarker.latitude},${selectedMarker.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 w-full px-4 py-2 bg-[#006A4E] hover:bg-[#00523C] text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>
                    {language === 'bn' ? 'গুগল ম্যাপে দিকনির্দেশনা' : 'Get Directions on Google Maps'}
                  </span>
                  <ExternalLink className="w-3 h-3 ml-0.5" />
                </a>

                <Link
                  href={`/complaints?tab=submit&ward=${selectedMarker.wardNumber}`}
                  className="inline-flex items-center justify-center gap-1.5 w-full px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg transition-colors"
                >
                  <MapPin className="w-3.5 h-3.5 text-slate-600" />
                  <span>{t.cityMapPage.reportHere}</span>
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Map Canvas & Ward Summary Strip */}
        <div className="lg:col-span-8 space-y-6">
          <div className="civic-card bg-white rounded-xl border border-[#E2E8F0] overflow-hidden shadow-xs">
            <InteractiveCityMap
              wards={wards}
              markers={markers}
              activeLayers={activeLayers}
              selectedWard={selectedWard}
              focusedMarker={selectedMarker}
              mode="explorer"
              onSelectMarker={(m) => setSelectedMarker(m)}
            />
          </div>

          {/* Ward Facility Summary Strip */}
          <div className="civic-card bg-white rounded-xl border border-[#E2E8F0] p-4 shadow-xs">
            <div className="flex items-center justify-between mb-3 text-xs font-bold text-[#111827]">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#006A4E]" />
                {language === 'bn'
                  ? selectedWard === 'all'
                    ? 'ঢাকা দক্ষিণ সিটি কর্পোরেশন সারসংক্ষেপ'
                    : `ওয়ার্ড ${selectedWard} সুবিধা সারসংক্ষেপ`
                  : selectedWard === 'all'
                    ? 'DSCC Citywide Facilities Overview'
                    : `Ward ${selectedWard} Facilities Overview`}
              </span>
              <span className="text-slate-500 font-normal text-[11px]">
                {language === 'bn' ? 'রিয়েল-টাইম তথ্য' : 'Real-time Sync'}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-lg bg-emerald-50/70 border border-emerald-100 flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#006A4E] text-white flex items-center justify-center flex-shrink-0">
                  <Trees className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-lg font-bold text-[#111827] font-mono tabular-nums leading-tight">
                    {summaryStats.parks}
                  </div>
                  <div className="text-[11px] text-slate-600 leading-tight">
                    {language === 'bn' ? 'পার্ক ও খেলার মাঠ' : 'Parks & Playgrounds'}
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-amber-50/70 border border-amber-100 flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-amber-600 text-white flex items-center justify-center flex-shrink-0">
                  <Recycle className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-lg font-bold text-[#111827] font-mono tabular-nums leading-tight">
                    {summaryStats.waste}
                  </div>
                  <div className="text-[11px] text-slate-600 leading-tight">
                    {language === 'bn' ? 'এসটিএস বর্জ্য কেন্দ্র' : 'Waste Points (STS)'}
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-orange-50/70 border border-orange-100 flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-orange-600 text-white flex items-center justify-center flex-shrink-0">
                  <Construction className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-lg font-bold text-[#111827] font-mono tabular-nums leading-tight">
                    {summaryStats.roads}
                  </div>
                  <div className="text-[11px] text-slate-600 leading-tight">
                    {language === 'bn' ? 'ইউটিলিটি রাস্তা খনন' : 'Road Digging'}
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-sky-50/70 border border-sky-100 flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-sky-600 text-white flex items-center justify-center flex-shrink-0">
                  <Cross className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-lg font-bold text-[#111827] font-mono tabular-nums leading-tight">
                    {summaryStats.civic}
                  </div>
                  <div className="text-[11px] text-slate-600 leading-tight">
                    {language === 'bn' ? 'স্বাস্থ্য ও শৌচাগার' : 'Health & Restrooms'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CityMapPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto p-12 text-sm text-slate-500">
          Loading GIS City Map...
        </div>
      }
    >
      <CityMapContent />
    </Suspense>
  );
}
