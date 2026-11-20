'use client';

import React, { useMemo, useState } from 'react';
import {
  AlertCircle,
  AlertTriangle,
  Calendar,
  CheckCircle2,
  Droplets,
  Gauge,
  MapPin,
  Waves,
  Wrench,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { SmartCityMap, SmartCityMapPoint } from '@/components/smart-city/SmartCityMap';
import { SmartCityComplaintModal } from '@/components/smart-city/SmartCityComplaintModal';
import { DRAINAGE_HOTSPOTS } from '@/data/smart-city/smartCityData';
import { pickLang } from '@/types/about';

export function DrainageMonitoringView() {
  const { language } = useApp();

  const [selectedWard, setSelectedWard] = useState<number | 'all'>('all');
  const [selectedPointId, setSelectedPointId] = useState<string | null>(null);
  const [reportModalOpen, setReportModalOpen] = useState(false);

  const filteredPoints = useMemo(() => {
    return DRAINAGE_HOTSPOTS.filter(
      (h) => selectedWard === 'all' || h.wardNumber === selectedWard
    );
  }, [selectedWard]);

  const mapPoints: SmartCityMapPoint[] = useMemo(() => {
    return filteredPoints.map((h) => ({
      id: h.id,
      title: h.name,
      category: 'drainage',
      categoryLabel: {
        bn: `ড্রেনেজ (${h.waterloggingRisk === 'severe' ? 'উচ্চ ঝুঁকিপূর্ণ' : 'নিয়মিত পর্যবেক্ষণ'})`,
        en: `Drainage (${h.waterloggingRisk})`,
      },
      coords: h.coords,
      wardNumber: h.wardNumber,
      address: h.location,
      statusLabel: {
        bn:
          h.currentStatus === 'normal'
            ? 'স্বাভাবিক প্রবাহ'
            : h.currentStatus === 'monitoring'
              ? 'নিবিড় পর্যবেক্ষণ'
              : h.currentStatus === 'desilting'
                ? 'স্লাজ ড্রেজিং চলমান'
                : 'পানি জমেছে',
        en:
          h.currentStatus === 'normal'
            ? 'Normal Flow'
            : h.currentStatus === 'monitoring'
              ? 'Under Monitoring'
              : h.currentStatus === 'desilting'
                ? 'Desilting in Progress'
                : 'Waterlogged',
      },
      details: {
        bn: `কালভার্ট টাইপ: ${h.culvertType.bn} | পানির উচ্চতা: ${h.waterLevelCm ?? 0} সেমি | পরবর্তী পরিষ্কার: ${h.nextScheduledCleaning}`,
        en: `Culvert: ${h.culvertType.en} | Water Level: ${h.waterLevelCm ?? 0} cm | Next Cleaning: ${h.nextScheduledCleaning}`,
      },
    }));
  }, [filteredPoints]);

  return (
    <div className="space-y-6">
      {/* 1. Top Action & Ward Filter Banner */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold text-[#006A4E] uppercase tracking-wider">
            {language === 'bn' ? 'স্টর্ম ওয়াটার ড্রেনেজ মনিটরিং' : 'Stormwater Drainage Monitoring'}
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-[#111827] mt-0.5">
            {language === 'bn' ? 'ড্রেনেজ অবস্থা ও জলাবদ্ধতা ট্র্যাকার' : 'Drainage Condition & Waterlogging Tracker'}
          </h2>
          <p className="text-xs sm:text-sm text-[#4B5563] mt-1 max-w-xl">
            {language === 'bn'
              ? 'বক্স কালভার্ট ও ড্রেনের গভীরতা পর্যবেক্ষণ করুন এবং অবরুদ্ধ ড্রেনেজের তাৎক্ষণিক ছবি ও জিপিএসসহ রিপোর্ট দিন।'
              : 'Monitor box culvert desilting schedules and submit geo-tagged drain blockage reports.'}
          </p>
        </div>

        <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-700">
              {language === 'bn' ? 'ওয়ার্ড:' : 'Ward:'}
            </span>
            <select
              value={selectedWard}
              onChange={(e) =>
                setSelectedWard(e.target.value === 'all' ? 'all' : Number(e.target.value))
              }
              className="px-3.5 py-2 text-xs sm:text-sm font-semibold bg-white border border-slate-300 rounded-xl focus:outline-none"
            >
              <option value="all">{language === 'bn' ? 'সকল ড্রেনেজ পয়েন্ট' : 'All Drainage Points'}</option>
              {[12, 19, 24, 27, 32, 36, 41, 48].map((w) => (
                <option key={w} value={w}>
                  {language === 'bn' ? `ওয়ার্ড ${w}` : `Ward ${w}`}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={() => setReportModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#C81E1E] text-white font-semibold text-sm hover:bg-[#a51818] transition-all shadow-sm cursor-pointer"
          >
            <AlertCircle className="w-4 h-4" />
            <span>{language === 'bn' ? 'অবরুদ্ধ ড্রেনের রিপোর্ট' : 'Report Blocked Drain'}</span>
          </button>
        </div>
      </div>

      {/* 2. Interactive Map */}
      <SmartCityMap
        points={mapPoints}
        selectedWard={selectedWard}
        selectedPointId={selectedPointId}
        onSelectPoint={(p) => setSelectedPointId(p.id)}
        interactiveTitle={
          language === 'bn' ? 'ঢাকা স্টর্ম ড্রেনেজ নেটওয়ার্ক ম্যাপ' : 'Dhaka Storm Drainage Network Map'
        }
      />

      {/* 3. Hotspot Monitoring Status Table */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-[#111827]">
              {language === 'bn' ? 'গুরুত্বপূর্ণ ড্রেনেজ কালভার্ট ও হটস্পট স্ট্যাটাস' : 'Key Drainage Outfalls & Waterlogging Hotspots'}
            </h3>
            <p className="text-xs text-[#4B5563]">
              {language === 'bn'
                ? 'আইওটি সেন্সর রিডিংস, পানির স্তর এবং নির্ধারিত স্লাজ পরিষ্কারের সরকারি রেকর্ড'
                : 'Sensor telemetry, culvert water level readings, and verified desilting logs'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPoints.map((pt) => {
            const isSevere = pt.waterloggingRisk === 'severe' || pt.waterloggingRisk === 'high';
            return (
              <div
                key={pt.id}
                onClick={() => setSelectedPointId(pt.id)}
                className="p-4 rounded-xl border border-slate-200 hover:border-[#006A4E] bg-[#F8FAFC] space-y-3 cursor-pointer transition-all group"
              >
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                      isSevere
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : 'bg-emerald-50 text-[#006A4E] border border-emerald-200'
                    }`}
                  >
                    {language === 'bn'
                      ? `ঝুঁকি: ${pt.waterloggingRisk === 'severe' ? 'তীব্র' : pt.waterloggingRisk === 'high' ? 'উচ্চ' : 'স্বাভাবিক'}`
                      : `Risk: ${pt.waterloggingRisk}`}
                  </span>

                  <span className="text-xs font-semibold text-slate-500 font-mono">
                    {language === 'bn' ? `ওয়ার্ড ${pt.wardNumber}` : `Ward ${pt.wardNumber}`}
                  </span>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-[#111827] group-hover:text-[#006A4E] transition-colors">
                    {pickLang(pt.name, language)}
                  </h4>
                  <p className="text-xs text-[#4B5563] mt-1 line-clamp-1">
                    {pickLang(pt.location, language)}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-200/80 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px]">
                      {language === 'bn' ? 'পানির স্তর' : 'Water Level'}
                    </span>
                    <span className="font-bold text-[#111827] flex items-center gap-1">
                      <Gauge className="w-3 h-3 text-[#006A4E]" />
                      <span>{pt.waterLevelCm} cm</span>
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[10px]">
                      {language === 'bn' ? 'পরবর্তী ড্রেজিং' : 'Next Desilting'}
                    </span>
                    <span className="font-bold text-[#111827] flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-indigo-600" />
                      <span>{pt.nextScheduledCleaning}</span>
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <SmartCityComplaintModal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        defaultCategory="drainage"
        defaultTitle={
          language === 'bn' ? 'ড্রেন উপচে পানি জমেছে ও ড্রেন ভরাট' : 'Clogged drain / Waterlogging incident'
        }
      />
    </div>
  );
}
