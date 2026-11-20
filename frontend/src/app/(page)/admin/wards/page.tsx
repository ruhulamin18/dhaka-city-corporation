'use client';

import React, { useState } from 'react';
import {
  Building2,
  Search,
  MapPin,
  Phone,
  User,
  Users,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';

interface WardDetail {
  wardNumber: number;
  zone: string;
  areaNameBn: string;
  areaNameEn: string;
  officerNameEn: string;
  officerPhone: string;
  councillorNameEn: string;
  populationEstimate: number;
  openGrievances: number;
  revenueTargetCrore: number;
  revenueAchievedCrore: number;
}

const SEEDED_WARDS: WardDetail[] = [
  {
    wardNumber: 1,
    zone: 'Zone 01',
    areaNameBn: 'উত্তরা মডেল টাউন (সেক্টর ১ - ৯)',
    areaNameEn: 'Uttara Model Town (Sectors 1-9)',
    officerNameEn: 'Eng. Farhad Hossain',
    officerPhone: '01819-223401',
    councillorNameEn: 'Alhaj Md. Afsar Uddin',
    populationEstimate: 185000,
    openGrievances: 6,
    revenueTargetCrore: 14.5,
    revenueAchievedCrore: 12.8,
  },
  {
    wardNumber: 12,
    zone: 'Zone 04',
    areaNameBn: 'মিরপুর মডেল ও পাইকপাড়া',
    areaNameEn: 'Mirpur Model & Paikpara',
    officerNameEn: 'Eng. Tariqul Islam',
    officerPhone: '01819-334901',
    councillorNameEn: 'Iqbal Hossain Chowdhury',
    populationEstimate: 210000,
    openGrievances: 4,
    revenueTargetCrore: 11.2,
    revenueAchievedCrore: 10.4,
  },
  {
    wardNumber: 19,
    zone: 'Zone 03',
    areaNameBn: 'গুলশান, বনানী ও বারিধারা',
    areaNameEn: 'Gulshan, Banani & Baridhara Diplomatic Zone',
    officerNameEn: 'Eng. Tariqul Islam',
    officerPhone: '01819-334901',
    councillorNameEn: 'Mofazzal Hossain',
    populationEstimate: 165000,
    openGrievances: 8,
    revenueTargetCrore: 38.0,
    revenueAchievedCrore: 34.2,
  },
  {
    wardNumber: 24,
    zone: 'Zone 03',
    areaNameBn: 'তেজগাঁও শিল্প এলাকা ও হাতিরঝিল',
    areaNameEn: 'Tejgaon Industrial Area & Hatirjheel',
    officerNameEn: 'Md. Shafiqul Alam',
    officerPhone: '01718-994022',
    councillorNameEn: 'Shafiqur Rahman',
    populationEstimate: 195000,
    openGrievances: 7,
    revenueTargetCrore: 22.0,
    revenueAchievedCrore: 19.8,
  },
  {
    wardNumber: 27,
    zone: 'Zone 05',
    areaNameBn: 'ধানমন্ডি, পান্থপথ ও ফার্মগেট',
    areaNameEn: 'Dhanmondi, Panthapath & Farmgate',
    officerNameEn: 'Farhana Yasmin, BCS',
    officerPhone: '01816-648095',
    councillorNameEn: 'Md. Delwar Hossain',
    populationEstimate: 230000,
    openGrievances: 3,
    revenueTargetCrore: 28.5,
    revenueAchievedCrore: 26.1,
  },
  {
    wardNumber: 32,
    zone: 'Zone 04',
    areaNameBn: 'লালবাগ কেল্লা ও চকবাজার',
    areaNameEn: 'Lalbagh Fort & Chawkbazar Heritage Zone',
    officerNameEn: 'Dr. Sadia Afrin',
    officerPhone: '01711-885409',
    councillorNameEn: 'Haji Abdul Malek',
    populationEstimate: 175000,
    openGrievances: 5,
    revenueTargetCrore: 9.8,
    revenueAchievedCrore: 8.9,
  },
];

export default function AdminWardsPage() {
  const { language } = useApp();
  const [wards, setWards] = useState<WardDetail[]>(SEEDED_WARDS);
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = wards.filter(
    (w) =>
      w.wardNumber.toString().includes(searchQuery) ||
      w.areaNameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.areaNameBn.includes(searchQuery) ||
      w.zone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.officerNameEn.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-[#ECFDF5] text-[#006A4E] text-xs font-semibold uppercase tracking-wider mb-2">
              <Building2 className="w-3.5 h-3.5" />
              {language === 'bn' ? 'প্রশাসনিক কাঠামো' : 'Zonal & Ward Administration'}
            </div>
            <h1 className="text-2xl font-bold text-slate-900">
              {language === 'bn' ? 'ওয়ার্ড ও আঞ্চলিক জোন ব্যবস্থাপনা' : 'Ward & Departmental Command'}
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              {language === 'bn'
                ? 'ওয়ার্ড নির্বাহী কর্মকর্তা, কাউন্সিলর কার্যালয়, রাজস্ব লক্ষ্যমাত্রা ও নাগরিক অভিযোগের স্থিতি।'
                : 'Oversee executive ward officers, councillor secretariats, revenue targets, and field progress.'}
            </p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              language === 'bn'
                ? 'ওয়ার্ড নম্বর, এলাকার নাম বা জোন দিয়ে খুঁজুন...'
                : 'Search by ward number, locality name, zone or officer...'
            }
            className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006A4E]"
          />
        </div>
      </div>

      {/* Ward Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((w) => {
          const revenuePercent = Math.round((w.revenueAchievedCrore / w.revenueTargetCrore) * 100);
          return (
            <div
              key={w.wardNumber}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:border-[#006A4E]/30 transition space-y-4"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-base text-slate-900">
                      Ward {w.wardNumber}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {w.zone}
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-[#006A4E] mt-0.5">
                    {language === 'bn' ? w.areaNameBn : w.areaNameEn}
                  </div>
                </div>

                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#006A4E] flex items-center justify-center font-bold text-xs">
                  W{w.wardNumber}
                </div>
              </div>

              <div className="space-y-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
                <div className="flex justify-between">
                  <span className="text-slate-400">Ward Officer:</span>
                  <span className="font-semibold text-slate-800">{w.officerNameEn}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Officer Phone:</span>
                  <span className="font-mono text-slate-700">{w.officerPhone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Ward Councillor:</span>
                  <span className="font-medium text-slate-800">{w.councillorNameEn}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Population:</span>
                  <span className="font-mono text-slate-800">
                    {w.populationEstimate.toLocaleString('en-US')}
                  </span>
                </div>
              </div>

              {/* Revenue Target Progress */}
              <div className="pt-2 border-t border-slate-100 space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-500">Revenue Achievement:</span>
                  <span className="text-emerald-700">
                    ৳{w.revenueAchievedCrore} Cr / ৳{w.revenueTargetCrore} Cr ({revenuePercent}%)
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#006A4E] rounded-full"
                    style={{ width: `${Math.min(100, revenuePercent)}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 text-xs">
                <span className="flex items-center gap-1 text-amber-700 font-semibold">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  {w.openGrievances} Open Grievances
                </span>
                <span className="text-slate-400">SLA: 96.2%</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
