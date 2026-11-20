'use client';

import React, { useState } from 'react';
import {
  AlertCircle,
  Activity,
  CheckCircle2,
  Clock,
  Droplets,
  HeartPulse,
  Info,
  MapPin,
  ShieldAlert,
  Thermometer,
  Wind,
} from 'lucide-react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useApp } from '@/context/AppContext';
import { AIR_QUALITY_STATIONS } from '@/data/smart-city/smartCityData';
import { pickLang } from '@/types/about';

export function AirQualityView() {
  const { language } = useApp();

  const [selectedStationId, setSelectedStationId] = useState<string>(AIR_QUALITY_STATIONS[0].id);

  const activeStation =
    AIR_QUALITY_STATIONS.find((s) => s.id === selectedStationId) ?? AIR_QUALITY_STATIONS[0];

  const getAqiColor = (aqi: number) => {
    if (aqi <= 50) return { bg: 'bg-emerald-500', text: 'text-emerald-700', border: 'border-emerald-300', labelBn: 'ভালো (Good)', labelEn: 'Good' };
    if (aqi <= 100) return { bg: 'bg-amber-400', text: 'text-amber-700', border: 'border-amber-300', labelBn: 'মধ্যম (Moderate)', labelEn: 'Moderate' };
    if (aqi <= 150) return { bg: 'bg-orange-500', text: 'text-orange-700', border: 'border-orange-300', labelBn: 'সংবেদনশীলদের জন্য অস্বাস্থ্যকর', labelEn: 'Unhealthy for Sensitive' };
    if (aqi <= 200) return { bg: 'bg-[#C81E1E]', text: 'text-[#C81E1E]', border: 'border-rose-300', labelBn: 'অস্বাস্থ্যকর (Unhealthy)', labelEn: 'Unhealthy' };
    if (aqi <= 300) return { bg: 'bg-purple-600', text: 'text-purple-700', border: 'border-purple-300', labelBn: 'খুবই অস্বাস্থ্যকর (Very Unhealthy)', labelEn: 'Very Unhealthy' };
    return { bg: 'bg-rose-950', text: 'text-rose-950', border: 'border-rose-900', labelBn: 'বিপজ্জনক (Hazardous)', labelEn: 'Hazardous' };
  };

  const aqiBadge = getAqiColor(activeStation.aqi);

  return (
    <div className="space-y-6">
      {/* 1. Header Toolbar with Station Selector */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold text-[#006A4E] uppercase tracking-wider">
            {language === 'bn' ? 'পরিবেশ অধিদপ্তর ও ডিএসসিসি' : 'Department of Environment & DSCC'}
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-[#111827] mt-0.5">
            {language === 'bn' ? 'রিয়েল-টাইম বায়ুমান সূচক (AQI)' : 'Continuous Air Quality Index (AQI)'}
          </h2>
          <p className="text-xs sm:text-sm text-[#4B5563] mt-1 max-w-xl">
            {language === 'bn'
              ? 'ঢাকা শহরের সার্বক্ষণিক স্টেশনসমূহের পিএম২.৫ ও পিএম১০ রিডিং এবং স্বাস্থ্য পরামর্শ।'
              : 'Continuous particulate matter telemetry from official urban monitoring stations.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-700">
            {language === 'bn' ? 'স্টেশন:' : 'Station:'}
          </span>
          <select
            value={selectedStationId}
            onChange={(e) => setSelectedStationId(e.target.value)}
            className="px-3.5 py-2 text-xs sm:text-sm font-semibold bg-[#ECFDF5] border border-emerald-300 text-[#006A4E] rounded-xl focus:outline-none"
          >
            {AIR_QUALITY_STATIONS.map((s) => (
              <option key={s.id} value={s.id}>
                {language === 'bn' ? s.stationName.bn : s.stationName.en}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 2. Primary Telemetry Dashboard Card */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-8 shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          {/* Gauge / Dial Indicator */}
          <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-[#F8FAFC] border border-slate-200 text-center space-y-2">
            <span className="text-xs font-bold text-[#4B5563] uppercase tracking-wider">
              {language === 'bn' ? 'বর্তমান একিউআই মান' : 'Current Air Quality Index'}
            </span>
            <div
              className={`w-28 h-28 rounded-full ${aqiBadge.bg} text-white flex flex-col items-center justify-center shadow-lg font-extrabold`}
            >
              <span className="text-3xl tabular-nums tracking-tight">{activeStation.aqi}</span>
              <span className="text-[10px] uppercase font-bold tracking-wider">AQI</span>
            </div>
            <div className={`text-sm font-bold ${aqiBadge.text}`}>
              {language === 'bn' ? aqiBadge.labelBn : aqiBadge.labelEn}
            </div>
            <span className="text-[11px] text-slate-500 font-mono">
              {language === 'bn' ? 'হালনাগাদ: ' : 'Updated: '}
              {activeStation.lastUpdated}
            </span>
          </div>

          {/* Environmental Components Matrix */}
          <div className="lg:col-span-2 space-y-4">
            <div>
              <span className="text-[11px] font-bold text-[#006A4E] uppercase tracking-wider">
                {language === 'bn' ? activeStation.locationArea.bn : activeStation.locationArea.en}
              </span>
              <h3 className="text-xl font-bold text-[#111827]">
                {pickLang(activeStation.stationName, language)}
              </h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-400 block font-semibold">PM2.5 DUST</span>
                <span className="text-lg font-extrabold text-[#111827] tabular-nums">
                  {activeStation.pm25} µg/m³
                </span>
                <span className="text-[10px] text-rose-600 block font-medium">Primary Pollutant</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-400 block font-semibold">PM10 PARTICLES</span>
                <span className="text-lg font-extrabold text-[#111827] tabular-nums">
                  {activeStation.pm10} µg/m³
                </span>
                <span className="text-[10px] text-slate-500 block">Inhalable dust</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-400 block font-semibold">TEMPERATURE</span>
                <span className="text-lg font-extrabold text-[#111827] tabular-nums flex items-center gap-1">
                  <Thermometer className="w-4 h-4 text-[#C81E1E]" />
                  <span>{activeStation.temperatureC}°C</span>
                </span>
                <span className="text-[10px] text-slate-500 block">Ambient temp</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-400 block font-semibold">HUMIDITY</span>
                <span className="text-lg font-extrabold text-[#111827] tabular-nums flex items-center gap-1">
                  <Droplets className="w-4 h-4 text-sky-600" />
                  <span>{activeStation.humidityPercent}%</span>
                </span>
                <span className="text-[10px] text-slate-500 block">Relative air moisture</span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-[#006A4E] flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>
                {language === 'bn' ? 'তথ্যসূত্র: ' : 'Official Authority: '}
                <strong>{pickLang(activeStation.sourceAuthority, language)}</strong>
              </span>
            </div>
          </div>
        </div>

        {/* 7-Day Historical Trend Recharts Area Chart */}
        <div className="mt-8 pt-6 border-t border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-bold text-[#111827] flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-[#006A4E]" />
              <span>{language === 'bn' ? 'গত ৭ দিনের একিউআই (AQI) ট্রেন্ড' : '7-Day Historical AQI Trend'}</span>
            </h4>
            <span className="text-xs text-slate-400 font-mono">Continuous Telemetry</span>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activeStation.historical7Days}>
                <defs>
                  <linearGradient id="aqiGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C81E1E" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#C81E1E" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#64748B' }} />
                <YAxis domain={[100, 220]} tick={{ fontSize: 11, fill: '#64748B' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1E293B',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="aqi"
                  stroke="#C81E1E"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#aqiGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 3. Official Health Guidance Cards */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs space-y-4">
        <h3 className="text-lg font-bold text-[#111827] flex items-center gap-2">
          <HeartPulse className="w-5 h-5 text-[#C81E1E]" />
          <span>{language === 'bn' ? 'পরিবেশ ও জনস্বাস্থ্য সতর্কতা নির্দেশিকা' : 'Environmental Health Guidance'}</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs leading-relaxed">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <div className="font-bold text-[#111827]">
              {language === 'bn' ? 'সংবেদনশীল ব্যক্তি (শিশু ও বয়োবৃদ্ধ)' : 'Sensitive Groups (Children & Elderly)'}
            </div>
            <p className="text-[#4B5563]">
              {language === 'bn'
                ? 'বাইরে দীর্ঘক্ষণ শরীরচর্চা বা খেলাধুলা এড়িয়ে চলুন। হাঁপানি বা শ্বাসকষ্টের রোগীদের ইনহেলার সাথে রাখা জরুরি।'
                : 'Avoid prolonged outdoor workouts. Asthmatic individuals must keep emergency medication at hand.'}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <div className="font-bold text-[#111827]">
              {language === 'bn' ? 'সাধারণ নাগরিক ও পথচারী' : 'General Public & Commuters'}
            </div>
            <p className="text-[#4B5563]">
              {language === 'bn'
                ? 'ব্যস্ত সড়কে চলাচলের সময় N95 বা সমমানের সুরক্ষিত মাস্ক ব্যবহার করুন এবং চোখ জ্বালাপোড়া করলে বিশুদ্ধ পানি দিয়ে ধুয়ে নিন।'
                : 'Wear N95 masks during peak traffic hours on arterial corridors and rinse eyes with clean water.'}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <div className="font-bold text-[#111827]">
              {language === 'bn' ? 'বাসাবাড়ি ও নির্মাণ এলাকা' : 'Residential & Construction Sites'}
            </div>
            <p className="text-[#4B5563]">
              {language === 'bn'
                ? 'নির্মাণস্থলে বাধ্যতামূলক পানি স্প্রে করতে হবে এবং নির্মাণসামগ্রী ত্রিপল দিয়ে ঢেকে রাখতে হবে।'
                : 'Mandatory water spraying at construction sites; building aggregates must remain tarp-covered.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
