'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  Construction,
  Cross,
  Filter,
  Layers,
  MapPin,
  Recycle,
  Search,
  Trees,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { mockApi } from '@/services/mockApi';
import { SmartCityMap, SmartCityMapPoint } from '@/components/smart-city/SmartCityMap';
import { ALL_GIS_LAYERS, GIS_LAYER_META } from '@/data/cityMapData';
import { pickLang } from '@/types/about';
import type { GisLayerType, GisMarker, WardInfo } from '@/types';

export function GisMapView() {
  const { language } = useApp();

  const [wards, setWards] = useState<WardInfo[]>([]);
  const [markers, setMarkers] = useState<GisMarker[]>([]);
  const [selectedWard, setSelectedWard] = useState<number | 'all'>('all');
  const [activeLayers, setActiveLayers] = useState<GisLayerType[]>(ALL_GIS_LAYERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPointId, setSelectedPointId] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    Promise.all([mockApi.getWards(), mockApi.getGisMarkers()]).then(([w, m]) => {
      if (!active) return;
      setWards(w);
      setMarkers(m);
    });
    return () => {
      active = false;
    };
  }, []);

  const toggleLayer = (layer: GisLayerType) => {
    setActiveLayers((prev) =>
      prev.includes(layer) ? prev.filter((l) => l !== layer) : [...prev, layer]
    );
  };

  const filteredMarkers = useMemo(() => {
    return markers.filter((m) => {
      const matchWard = selectedWard === 'all' || m.wardNumber === selectedWard;
      const matchLayer = activeLayers.includes(m.type);
      const q = searchQuery.trim().toLowerCase();
      const matchQuery =
        !q ||
        m.titleEn.toLowerCase().includes(q) ||
        m.titleBn.toLowerCase().includes(q) ||
        m.detailsEn.toLowerCase().includes(q) ||
        m.detailsBn.toLowerCase().includes(q);
      return matchWard && matchLayer && matchQuery;
    });
  }, [markers, selectedWard, activeLayers, searchQuery]);

  const mapPoints: SmartCityMapPoint[] = useMemo(() => {
    return filteredMarkers.map((m) => ({
      id: m.id,
      title: { bn: m.titleBn, en: m.titleEn },
      category: m.type,
      categoryLabel: {
        bn:
          m.type === 'hospital'
            ? 'হাসপাতাল'
            : m.type === 'public_toilet'
              ? 'পাবলিক টয়লেট'
              : m.type === 'park'
                ? 'পার্ক ও উদ্যান'
                : m.type === 'waste_point'
                  ? 'বর্জ্য এসটিএস'
                  : m.type === 'road_digging'
                    ? 'সড়ক খনন'
                    : 'নাগরিক অভিযোগ',
        en:
          m.type === 'hospital'
            ? 'Hospital'
            : m.type === 'public_toilet'
              ? 'Public Toilet'
              : m.type === 'park'
                ? 'Park'
                : m.type === 'waste_point'
                  ? 'Waste STS'
                  : m.type === 'road_digging'
                    ? 'Road Digging'
                    : 'Citizen Complaint',
      },
      coords: { lat: m.latitude, lng: m.longitude },
      wardNumber: m.wardNumber,
      statusLabel: { bn: m.statusBn, en: m.statusEn },
      details: { bn: m.detailsBn, en: m.detailsEn },
    }));
  }, [filteredMarkers]);

  return (
    <div className="space-y-6">
      {/* 1. Control & Filter Panel */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                language === 'bn'
                  ? 'অবস্থান, ল্যান্ডমার্ক বা বিবরণ খুঁজুন...'
                  : 'Search location, facility name or landmark...'
              }
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#006A4E] focus:bg-white transition-all"
            />
          </div>

          {/* Ward Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[#111827] whitespace-nowrap">
              {language === 'bn' ? 'ওয়ার্ড ফিল্টার:' : 'Filter Ward:'}
            </span>
            <select
              value={selectedWard}
              onChange={(e) =>
                setSelectedWard(e.target.value === 'all' ? 'all' : Number(e.target.value))
              }
              className="px-3.5 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#006A4E] font-medium"
            >
              <option value="all">
                {language === 'bn' ? 'সকল ওয়ার্ড (৫০+ ওয়ার্ড)' : 'All Wards (Metropolis)'}
              </option>
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

        {/* Layer Visibility Toggle Pills */}
        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-[#4B5563] mr-1 flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-[#006A4E]" />
            <span>{language === 'bn' ? 'তথ্য স্তর:' : 'Map Layers:'}</span>
          </span>

          {GIS_LAYER_META.map((meta) => {
            const isActive = activeLayers.includes(meta.id);
            const Icon = meta.icon;
            const label =
              meta.id === 'hospital'
                ? { bn: 'হাসপাতাল', en: 'Hospitals' }
                : meta.id === 'public_toilet'
                  ? { bn: 'পাবলিক টয়লেট', en: 'Public Toilets' }
                  : meta.id === 'park'
                    ? { bn: 'পার্ক ও বিনোদন', en: 'Parks' }
                    : meta.id === 'waste_point'
                      ? { bn: 'বর্জ্য এসটিএস', en: 'Waste STS' }
                      : meta.id === 'road_digging'
                        ? { bn: 'সড়ক খনন', en: 'Road Digging' }
                        : { bn: 'নাগরিক অভিযোগ', en: 'Complaints' };

            return (
              <button
                key={meta.id}
                type="button"
                onClick={() => toggleLayer(meta.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer border ${
                  isActive
                    ? 'bg-[#ECFDF5] border-emerald-300 text-[#006A4E] shadow-2xs'
                    : 'bg-slate-50 border-slate-200 text-slate-400 opacity-60 hover:opacity-100'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${meta.dotClass}`} />
                <Icon className="w-3.5 h-3.5" />
                <span>{pickLang(label, language)}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Google Maps Satellite/Hybrid Component */}
      <SmartCityMap
        points={mapPoints}
        selectedWard={selectedWard}
        selectedPointId={selectedPointId}
        onSelectPoint={(p) => setSelectedPointId(p.id)}
        interactiveTitle={
          language === 'bn' ? 'ঢাকা নগরী ভৌগোলিক তথ্য স্তর' : 'Dhaka Municipal Geospatial Layer'
        }
      />

      {/* 3. Verified Landmark / Marker Directory Table */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-[#111827]">
              {language === 'bn' ? 'মানচিত্রের মার্কার তালিকা' : 'Active Map Marker Directory'}
            </h3>
            <p className="text-xs text-[#4B5563]">
              {language === 'bn'
                ? `বর্তমানে ${filteredMarkers.length}টি স্থান প্রদর্শিত হচ্ছে`
                : `Showing ${filteredMarkers.length} active geolocations`}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredMarkers.slice(0, 9).map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setSelectedPointId(m.id)}
              className="text-left p-3.5 rounded-xl border border-slate-200 hover:border-[#006A4E] hover:bg-[#F8FAFC] transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#ECFDF5] text-[#006A4E]">
                  {m.type.replace('_', ' ')}
                </span>
                <span className="text-xs font-semibold text-slate-500 font-mono">
                  {language === 'bn' ? `ওয়ার্ড ${m.wardNumber}` : `Ward ${m.wardNumber}`}
                </span>
              </div>
              <h4 className="text-sm font-bold text-[#111827] group-hover:text-[#006A4E] transition-colors truncate">
                {language === 'bn' ? m.titleBn : m.titleEn}
              </h4>
              <p className="text-xs text-[#4B5563] mt-1 line-clamp-2 leading-relaxed">
                {language === 'bn' ? m.detailsBn : m.detailsEn}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
