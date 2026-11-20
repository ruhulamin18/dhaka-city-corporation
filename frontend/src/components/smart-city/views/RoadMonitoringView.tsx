'use client';

import React, { useMemo, useState } from 'react';
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  Construction,
  Filter,
  MapPin,
  Search,
  Wrench,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { SmartCityMap, SmartCityMapPoint } from '@/components/smart-city/SmartCityMap';
import { SmartCityComplaintModal } from '@/components/smart-city/SmartCityComplaintModal';
import { ROAD_CONDITIONS } from '@/data/smart-city/smartCityData';
import { pickLang } from '@/types/about';

export function RoadMonitoringView() {
  const { language } = useApp();

  const [selectedWard, setSelectedWard] = useState<number | 'all'>('all');
  const [conditionFilter, setConditionFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPointId, setSelectedPointId] = useState<string | null>(null);
  const [reportModalOpen, setReportModalOpen] = useState(false);

  const filteredRoads = useMemo(() => {
    return ROAD_CONDITIONS.filter((r) => {
      const matchWard = selectedWard === 'all' || r.wardNumber === selectedWard;
      const matchCond = conditionFilter === 'all' || r.condition === conditionFilter;
      const q = searchQuery.trim().toLowerCase();
      const matchQuery =
        !q ||
        r.roadName.bn.toLowerCase().includes(q) ||
        r.roadName.en.toLowerCase().includes(q);
      return matchWard && matchCond && matchQuery;
    });
  }, [selectedWard, conditionFilter, searchQuery]);

  const mapPoints: SmartCityMapPoint[] = useMemo(() => {
    return filteredRoads.map((r) => ({
      id: r.id,
      title: r.roadName,
      category: 'road',
      categoryLabel: {
        bn:
          r.condition === 'good'
            ? 'উন্নত সড়ক'
            : r.condition === 'maintenance'
              ? 'সংস্কার চলমান'
              : r.condition === 'damaged'
                ? 'ক্ষতিগ্রস্ত সড়ক'
                : r.condition === 'repair_required'
                  ? 'মেরামত আবশ্যক'
                  : 'উন্নয়ন কাজ চলমান',
        en:
          r.condition === 'good'
            ? 'Good Pavement'
            : r.condition === 'maintenance'
              ? 'Maintenance'
              : r.condition === 'damaged'
                ? 'Damaged'
                : r.condition === 'repair_required'
                  ? 'Repair Required'
                  : 'Construction in Progress',
      },
      coords: r.coords,
      wardNumber: r.wardNumber,
      statusLabel: {
        bn: `দৈর্ঘ্য: ${r.lengthKm} কিমি | ট্রাফিক: ${r.trafficLoad}`,
        en: `Length: ${r.lengthKm} km | Traffic: ${r.trafficLoad}`,
      },
      details: {
        bn: `সর্বশেষ পরিদর্শন: ${r.lastInspectionDate} ${r.contractor ? `| ঠিকাদার: ${r.contractor.bn}` : ''}`,
        en: `Last Inspected: ${r.lastInspectionDate} ${r.contractor ? `| Contractor: ${r.contractor.en}` : ''}`,
      },
    }));
  }, [filteredRoads]);

  return (
    <div className="space-y-6">
      {/* 1. Header Toolbar */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-bold text-[#006A4E] uppercase tracking-wider">
              {language === 'bn' ? 'সড়ক অবকাঠামো পর্যবেক্ষণ' : 'Road Infrastructure Monitoring'}
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-[#111827] mt-0.5">
              {language === 'bn' ? 'রাস্তার অবস্থা ও সংস্কার ট্র্যাকার' : 'Road Pavement Health & Repair Tracker'}
            </h2>
            <p className="text-xs sm:text-sm text-[#4B5563] mt-1 max-w-xl">
              {language === 'bn'
                ? 'প্রধান সড়ক ও গলিপথের অবস্থা অন্বেষণ করুন এবং ভাঙা সড়কের ছবি ও জিপিএসসহ রিপোর্ট দিন।'
                : 'Inspect municipal pavement conditions, track construction progress, and report potholes.'}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setReportModalOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#C81E1E] text-white font-semibold text-sm hover:bg-[#a51818] transition-all shadow-sm cursor-pointer shrink-0"
          >
            <AlertCircle className="w-4 h-4" />
            <span>{language === 'bn' ? 'ভাঙা সড়কের রিপোর্ট' : 'Report Damaged Road'}</span>
          </button>
        </div>

        {/* Filters */}
        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-slate-700">
              {language === 'bn' ? 'অবস্থা:' : 'Condition:'}
            </span>
            {[
              { id: 'all', bn: 'সকল অবস্থা', en: 'All Conditions' },
              { id: 'good', bn: 'উন্নত (ভালো)', en: 'Good' },
              { id: 'maintenance', bn: 'সংস্কারাধীন', en: 'Maintenance' },
              { id: 'damaged', bn: 'ক্ষতিগ্রস্ত', en: 'Damaged' },
              { id: 'repair_required', bn: 'মেরামত আবশ্যক', en: 'Repair Required' },
              { id: 'construction', bn: 'উন্নয়ন চলমান', en: 'Construction' },
            ].map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setConditionFilter(c.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                  conditionFilter === c.id
                    ? 'bg-[#006A4E] text-white border-[#006A4E] shadow-2xs'
                    : 'bg-white border-slate-200 text-[#4B5563] hover:bg-slate-50'
                }`}
              >
                {language === 'bn' ? c.bn : c.en}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-700">
              {language === 'bn' ? 'ওয়ার্ড:' : 'Ward:'}
            </span>
            <select
              value={selectedWard}
              onChange={(e) =>
                setSelectedWard(e.target.value === 'all' ? 'all' : Number(e.target.value))
              }
              className="px-3.5 py-1.5 text-xs font-semibold bg-white border border-slate-300 rounded-xl focus:outline-none"
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
      </div>

      {/* 2. Interactive Map */}
      <SmartCityMap
        points={mapPoints}
        selectedWard={selectedWard}
        selectedPointId={selectedPointId}
        onSelectPoint={(p) => setSelectedPointId(p.id)}
        interactiveTitle={
          language === 'bn' ? 'ঢাকা সড়ক স্বাস্থ্য ও উন্নয়ন মানচিত্র' : 'Dhaka Road Condition & Civil Works Map'
        }
      />

      {/* 3. Detailed Road Ledger */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs space-y-4">
        <h3 className="text-lg font-bold text-[#111827]">
          {language === 'bn' ? 'সড়ক স্বাস্থ্য ও উন্নয়ন প্রকল্পের বিবরণ' : 'Municipal Pavement Health & Construction Ledger'}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredRoads.map((r) => {
            const isGood = r.condition === 'good';
            const isWarning = r.condition === 'damaged' || r.condition === 'repair_required';
            return (
              <div
                key={r.id}
                onClick={() => setSelectedPointId(r.id)}
                className="p-4 rounded-xl border border-slate-200 hover:border-[#006A4E] bg-[#F8FAFC] space-y-3 cursor-pointer transition-all group"
              >
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                      isGood
                        ? 'bg-emerald-50 text-[#006A4E] border border-emerald-200'
                        : isWarning
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : 'bg-amber-50 text-amber-800 border border-amber-200'
                    }`}
                  >
                    {r.condition.replace('_', ' ')}
                  </span>
                  <span className="text-xs font-semibold text-slate-500 font-mono">
                    {language === 'bn' ? `ওয়ার্ড ${r.wardNumber}` : `Ward ${r.wardNumber}`}
                  </span>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-[#111827] group-hover:text-[#006A4E] transition-colors">
                    {pickLang(r.roadName, language)}
                  </h4>
                  <div className="text-xs text-[#4B5563] mt-0.5">
                    {language === 'bn' ? `দৈর্ঘ্য: ${r.lengthKm} কিমি` : `Length: ${r.lengthKm} km`} ·{' '}
                    <span className="font-semibold">{r.trafficLoad.toUpperCase()} TRAFFIC</span>
                  </div>
                </div>

                {r.completionProgress !== undefined && (
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">
                        {language === 'bn' ? 'কাজের অগ্রগতি' : 'Progress'}:
                      </span>
                      <span className="font-bold text-[#006A4E]">{r.completionProgress}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#006A4E] rounded-full transition-all"
                        style={{ width: `${r.completionProgress}%` }}
                      />
                    </div>
                  </div>
                )}

                <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-[11px] text-[#4B5563]">
                  <span>
                    {language === 'bn' ? 'পরিদর্শন: ' : 'Inspected: '}
                    {r.lastInspectionDate}
                  </span>
                  {r.contractor && (
                    <span className="font-semibold text-slate-700 truncate max-w-[160px]">
                      {pickLang(r.contractor, language)}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <SmartCityComplaintModal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        defaultCategory="road_damage"
        defaultTitle={
          language === 'bn' ? 'রাস্তা ভাঙা ও খানাখন্দ মেরামতের আবেদন' : 'Damaged road & pothole repair request'
        }
      />
    </div>
  );
}
