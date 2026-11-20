'use client';

import React, { useMemo, useState } from 'react';
import {
  Car,
  Clock,
  ExternalLink,
  Info,
  MapPin,
  Navigation,
  ParkingCircle,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { SmartCityMap, SmartCityMapPoint } from '@/components/smart-city/SmartCityMap';
import { PARKING_FACILITIES } from '@/data/smart-city/smartCityData';
import { pickLang } from '@/types/about';

export function SmartParkingView() {
  const { language } = useApp();

  const [selectedWard, setSelectedWard] = useState<number | 'all'>('all');
  const [vehicleFilter, setVehicleFilter] = useState<'all' | 'car' | 'bike' | 'ev'>('all');
  const [selectedPointId, setSelectedPointId] = useState<string | null>(null);

  const filteredParking = useMemo(() => {
    return PARKING_FACILITIES.filter((p) => {
      const matchWard = selectedWard === 'all' || p.wardNumber === selectedWard;
      const matchVehicle =
        vehicleFilter === 'all'
          ? true
          : vehicleFilter === 'ev'
            ? p.hasEvCharging
            : p.supportedVehicles.includes(vehicleFilter);
      return matchWard && matchVehicle;
    });
  }, [selectedWard, vehicleFilter]);

  const mapPoints: SmartCityMapPoint[] = useMemo(() => {
    return filteredParking.map((p) => ({
      id: p.id,
      title: p.name,
      category: 'parking',
      categoryLabel: {
        bn: `স্মার্ট পার্কিং (${p.totalCapacity} স্থান)`,
        en: `Smart Parking (${p.totalCapacity} bays)`,
      },
      coords: p.coords,
      wardNumber: p.wardNumber,
      address: p.areaName,
      statusLabel: {
        bn: `কার: ৳${p.hourlyRateBdt.car}/ঘণ্টা | বাইক: ৳${p.hourlyRateBdt.bike}/ঘণ্টা`,
        en: `Car: BDT ${p.hourlyRateBdt.car}/hr | Bike: BDT ${p.hourlyRateBdt.bike}/hr`,
      },
      details: {
        bn: `সময়সূচি: ${p.operatingHours.bn} ${p.hasEvCharging ? '| ইভি ফাস্ট চার্জিং চালু' : ''}`,
        en: `Hours: ${p.operatingHours.en} ${p.hasEvCharging ? '| Fast EV Charging Available' : ''}`,
      },
    }));
  }, [filteredParking]);

  return (
    <div className="space-y-6">
      {/* 1. Header Toolbar & Vehicle Filters */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-bold text-[#006A4E] uppercase tracking-wider">
              {language === 'bn' ? 'স্মার্ট পার্কিং নেটওয়ার্ক' : 'Municipal Smart Parking Network'}
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-[#111827] mt-0.5">
              {language === 'bn' ? 'অনুমোদিত পার্কিং লট ও সরকারি রেট' : 'Certified Parking Lots & Statutory Tariffs'}
            </h2>
            <p className="text-xs sm:text-sm text-[#4B5563] mt-1 max-w-xl">
              {language === 'bn'
                ? 'অনুমোদিত অন-স্ট্রিট ও বহুতল পার্কিংয়ের অবস্থান, রেট এবং ইভি চার্জিং সুবিধা অন্বেষণ করুন।'
                : 'Locate official municipal parking plazas, verified hourly rates, and EV charging stations.'}
            </p>
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
              className="px-3.5 py-2 text-xs sm:text-sm font-semibold bg-white border border-slate-300 rounded-xl focus:outline-none"
            >
              <option value="all">{language === 'bn' ? 'সকল পার্কিং জোন' : 'All Parking Zones'}</option>
              {[12, 19, 24, 27, 32, 36, 41, 48].map((w) => (
                <option key={w} value={w}>
                  {language === 'bn' ? `ওয়ার্ড ${w}` : `Ward ${w}`}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Vehicle Type Tabs */}
        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-700 mr-1">
            {language === 'bn' ? 'যানবাহনের ধরন:' : 'Vehicle Type:'}
          </span>
          {[
            { id: 'all', bn: 'সকল যানবাহন', en: 'All Vehicles' },
            { id: 'car', bn: 'গাড়ি / এসইউভি (Car)', en: 'Cars & SUVs' },
            { id: 'bike', bn: 'মোটরসাইকেল (Bike)', en: 'Motorcycles' },
            { id: 'ev', bn: 'ইভি চার্জিং স্পট (EV)', en: 'EV Charging' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setVehicleFilter(tab.id as 'all' | 'car' | 'bike' | 'ev')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                vehicleFilter === tab.id
                  ? 'bg-[#006A4E] text-white border-[#006A4E] shadow-2xs'
                  : 'bg-white border-slate-200 text-[#4B5563] hover:bg-slate-50'
              }`}
            >
              {language === 'bn' ? tab.bn : tab.en}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Interactive Google Maps */}
      <SmartCityMap
        points={mapPoints}
        selectedWard={selectedWard}
        selectedPointId={selectedPointId}
        onSelectPoint={(p) => setSelectedPointId(p.id)}
        interactiveTitle={
          language === 'bn' ? 'ঢাকা স্মার্ট পার্কিং নেটওয়ার্ক ম্যাপ' : 'Dhaka Smart Parking Network Map'
        }
      />

      {/* 3. Facility Detail Cards */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs space-y-4">
        <h3 className="text-lg font-bold text-[#111827]">
          {language === 'bn' ? 'অনুমোদিত পার্কিং লটের তালিকা' : 'Certified Parking Plaza Directory'}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredParking.map((pl) => (
            <div
              key={pl.id}
              onClick={() => setSelectedPointId(pl.id)}
              className="p-4 rounded-xl border border-slate-200 hover:border-[#006A4E] bg-[#F8FAFC] space-y-3 cursor-pointer transition-all group"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200">
                  {language === 'bn' ? `ধারণক্ষমতা: ${pl.totalCapacity}` : `Capacity: ${pl.totalCapacity} bays`}
                </span>
                {pl.hasEvCharging && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-0.5">
                    <Zap className="w-2.5 h-2.5" />
                    <span>EV Ready</span>
                  </span>
                )}
              </div>

              <div>
                <h4 className="text-sm font-bold text-[#111827] group-hover:text-[#006A4E] transition-colors">
                  {pickLang(pl.name, language)}
                </h4>
                <div className="text-xs text-[#4B5563] mt-1 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#006A4E] shrink-0" />
                  <span>{pickLang(pl.areaName, language)}</span>
                </div>
              </div>

              {/* Rates */}
              <div className="pt-2 border-t border-slate-200/80 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px]">
                    {language === 'bn' ? 'গাড়ির রেট' : 'Car Tariff'}
                  </span>
                  <span className="font-bold text-[#111827]">
                    ৳{pl.hourlyRateBdt.car} / {language === 'bn' ? 'ঘণ্টা' : 'hr'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">
                    {language === 'bn' ? 'বাইক রেট' : 'Bike Tariff'}
                  </span>
                  <span className="font-bold text-[#111827]">
                    ৳{pl.hourlyRateBdt.bike} / {language === 'bn' ? 'ঘণ্টা' : 'hr'}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-xs">
                <span className="text-[#4B5563] flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" />
                  <span className="truncate max-w-[130px]">{pickLang(pl.operatingHours, language)}</span>
                </span>

                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${pl.coords.lat},${pl.coords.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-[#006A4E] hover:underline flex items-center gap-1"
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
