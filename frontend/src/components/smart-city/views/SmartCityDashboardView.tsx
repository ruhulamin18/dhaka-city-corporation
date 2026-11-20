'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Activity,
  AlertCircle,
  BarChart3,
  Building,
  CheckCircle2,
  Clock,
  Droplets,
  FileCheck,
  Layers,
  MapPin,
  PieChart as PieIcon,
  RefreshCw,
  ShieldCheck,
  TrendingUp,
  Users,
} from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useApp } from '@/context/AppContext';
import { mockApi } from '@/services/mockApi';

const COMPLAINT_CATEGORY_PIE = [
  { nameBn: 'বর্জ্য অপসারণ', nameEn: 'Waste Management', value: 38, color: '#006A4E' },
  { nameBn: 'সড়ক মেরামত ও গর্ত', nameEn: 'Road Repairs', value: 26, color: '#EA580C' },
  { nameBn: 'ড্রেনেজ ও জলাবদ্ধতা', nameEn: 'Drainage & Waterlogging', value: 18, color: '#0284C7' },
  { nameBn: 'মশক নিধন স্প্রে', nameEn: 'Mosquito Control', value: 12, color: '#D97706' },
  { nameBn: 'সড়কবাতি মেরামত', nameEn: 'Streetlight Hazards', value: 6, color: '#6366F1' },
];

export function SmartCityDashboardView() {
  const { language } = useApp();

  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    mockApi.getAdminStats().then((data) => {
      if (!active) return;
      setStats(data);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, []);

  const wardData = stats?.wardComplaintSeries ?? [
    { ward: 'W-12', open: 3, resolved: 28 },
    { ward: 'W-19', open: 2, resolved: 34 },
    { ward: 'W-24', open: 4, resolved: 22 },
    { ward: 'W-27', open: 1, resolved: 42 },
    { ward: 'W-32', open: 5, resolved: 30 },
    { ward: 'W-36', open: 2, resolved: 25 },
    { ward: 'W-41', open: 3, resolved: 29 },
    { ward: 'W-48', open: 6, resolved: 36 },
  ];

  const revenueData = stats?.monthlyRevenueSeries ?? [
    { month: 'Jul', crore: 38.4 },
    { month: 'Aug', crore: 41.2 },
    { month: 'Sep', crore: 44.8 },
    { month: 'Oct', crore: 49.1 },
    { month: 'Nov', crore: 54.6 },
  ];

  return (
    <div className="space-y-8">
      {/* 1. Executive Operations KPI Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs space-y-1">
          <div className="flex items-center justify-between text-[#006A4E]">
            <span className="text-xs font-bold uppercase tracking-wider">
              {language === 'bn' ? 'মোট আওতাভুক্ত ওয়ার্ড' : 'Municipal Wards'}
            </span>
            <Building className="w-4 h-4" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#111827] tabular-nums">
            54
          </div>
          <span className="text-[11px] text-slate-500 block">
            {language === 'bn' ? 'উত্তর ও দক্ষিণ ঢাকা সিটি কর্পোরেশন' : 'Metropolitan Civic Zones'}
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs space-y-1">
          <div className="flex items-center justify-between text-[#006A4E]">
            <span className="text-xs font-bold uppercase tracking-wider">
              {language === 'bn' ? 'অভিযোগ নিষ্পত্তির হার' : 'Resolution Rate'}
            </span>
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#006A4E] tabular-nums">
            94.2%
          </div>
          <span className="text-[11px] text-emerald-600 block font-medium">
            {language === 'bn' ? 'গড় সমাধান সময়: ৪৮ ঘণ্টা' : 'Avg SLA: 48 Hours'}
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs space-y-1">
          <div className="flex items-center justify-between text-indigo-600">
            <span className="text-xs font-bold uppercase tracking-wider">
              {language === 'bn' ? 'দৈনিক বর্জ্য অপসারণ' : 'Daily Waste Cleared'}
            </span>
            <TrendingUp className="w-4 h-4" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#111827] tabular-nums">
            3,200 T
          </div>
          <span className="text-[11px] text-slate-500 block">
            {language === 'bn' ? 'মাতুয়াইল ও আমিনবাজার ল্যান্ডফিল' : 'Matuail & Aminbazar Landfills'}
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs space-y-1">
          <div className="flex items-center justify-between text-amber-600">
            <span className="text-xs font-bold uppercase tracking-wider">
              {language === 'bn' ? 'ডিজিটাল নাগরিক সেবা' : 'Digital Services'}
            </span>
            <FileCheck className="w-4 h-4" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#111827] tabular-nums">
            31+
          </div>
          <span className="text-[11px] text-slate-500 block">
            {language === 'bn' ? '১০০% পেপারলেস কিউআর সনদ' : '100% Paperless QR Certs'}
          </span>
        </div>
      </div>

      {/* 2. Visual Analytics Grid (Recharts) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ward Complaint Resolution Bar Chart */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-[#111827] flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-[#006A4E]" />
                <span>{language === 'bn' ? 'ওয়ার্ডভিত্তিক নাগরিক অভিযোগ ও নিষ্পত্তি' : 'Ward Grievance Resolution Status'}</span>
              </h3>
              <p className="text-xs text-[#4B5563]">
                {language === 'bn' ? 'সমাধানকৃত বনাম অপেক্ষমাণ অভিযোগ' : 'Resolved vs Pending Incidents'}
              </p>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600">
              Live Feed
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={wardData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="ward" tick={{ fontSize: 11, fill: '#64748B' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748B' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1E293B',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Bar dataKey="resolved" fill="#006A4E" name={language === 'bn' ? 'সমাধান সম্পন্ন' : 'Resolved'} radius={[4, 4, 0, 0]} />
                <Bar dataKey="open" fill="#C81E1E" name={language === 'bn' ? 'অপেক্ষমাণ' : 'Pending'} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue Collection Line Chart */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-[#111827] flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#006A4E]" />
                <span>{language === 'bn' ? 'মাসিক রাজস্ব আদায় প্রবৃদ্ধি (কোটি টাকা)' : 'Monthly Municipal Revenue (Crore BDT)'}</span>
              </h3>
              <p className="text-xs text-[#4B5563]">
                {language === 'bn' ? 'হোল্ডিং ট্যাক্স ও ট্রেড লাইসেন্স ফি সংকলন' : 'Holding Tax & Trade License Revenue Ledger'}
              </p>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-[#006A4E] font-bold">
              FY2026-27
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748B' }} />
                <YAxis domain={[30, 60]} tick={{ fontSize: 11, fill: '#64748B' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1E293B',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="crore"
                  stroke="#006A4E"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#006A4E' }}
                  name={language === 'bn' ? 'আদায় (কোটি ৳)' : 'Revenue (Cr BDT)'}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 3. Breakdown of Complaints by Category & Environmental Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pie Chart of Incident Types */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-[#111827] flex items-center gap-2">
            <PieIcon className="w-4 h-4 text-[#006A4E]" />
            <span>{language === 'bn' ? 'অভিযোগের খাতভিত্তিক অনুপাত' : 'Incident Category Distribution'}</span>
          </h3>

          <div className="h-52 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={COMPLAINT_CATEGORY_PIE}
                  dataKey="value"
                  nameKey={language === 'bn' ? 'nameBn' : 'nameEn'}
                  cx="50%"
                  cy="50%"
                  outerRadius={75}
                  innerRadius={45}
                  paddingAngle={3}
                >
                  {COMPLAINT_CATEGORY_PIE.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs">
            {COMPLAINT_CATEGORY_PIE.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-700">{language === 'bn' ? item.nameBn : item.nameEn}</span>
                </div>
                <span className="font-bold text-[#111827]">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Environmental & Infrastructure Telemetry Cards */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-[#111827] flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#006A4E]" />
            <span>{language === 'bn' ? 'নগর পরিবেশ ও ইউটিলিটি পর্যবেক্ষণ স্থিতি' : 'Urban Environment & Utility Telemetry'}</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="text-xs text-slate-500 font-semibold uppercase">
                {language === 'bn' ? 'নগরীর গড় বায়ুমান' : 'Citywide Average AQI'}
              </div>
              <div className="text-2xl font-bold text-orange-600">162 AQI</div>
              <p className="text-xs text-[#4B5563]">
                {language === 'bn' ? 'অস্বাস্থ্যকর মাত্রা (Unhealthy)' : 'Unhealthy threshold for particulate dust.'}
              </p>
              <Link
                href="/smart-city/air-quality"
                className="text-xs font-semibold text-[#006A4E] hover:underline block pt-1"
              >
                {language === 'bn' ? 'স্টেশনভিত্তিক রিডিং দেখুন →' : 'View Station Details →'}
              </Link>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="text-xs text-slate-500 font-semibold uppercase">
                {language === 'bn' ? 'স্মার্ট এলইডি সড়কবাতি কভারেজ' : 'Smart Solar Streetlamp Network'}
              </div>
              <div className="text-2xl font-bold text-[#006A4E]">64,800+</div>
              <p className="text-xs text-[#4B5563]">
                {language === 'bn' ? 'আইওটি টাইমার দ্বারা স্বয়ংক্রিয় নিয়ন্ত্রিত' : 'Centralized automated photocell dimming.'}
              </p>
              <Link
                href="/smart-city/road-monitoring"
                className="text-xs font-semibold text-[#006A4E] hover:underline block pt-1"
              >
                {language === 'bn' ? 'সড়ক উন্নয়ন দেখুন →' : 'View Road Projects →'}
              </Link>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="text-xs text-slate-500 font-semibold uppercase">
                {language === 'bn' ? 'স্টর্ম ড্রেনেজ পাম্পিং আউটফল' : 'Stormwater Outfall Regulators'}
              </div>
              <div className="text-2xl font-bold text-[#006A4E]">7 Stations</div>
              <p className="text-xs text-[#4B5563]">
                {language === 'bn' ? 'রামপুরা, কল্যাণপুর ও ধোলাইখাল পাম্পিং ইউনিট' : 'Rampura, Kallyanpur & Dholai Khal.'}
              </p>
              <Link
                href="/smart-city/drainage-monitoring"
                className="text-xs font-semibold text-[#006A4E] hover:underline block pt-1"
              >
                {language === 'bn' ? 'ড্রেনেজ অবস্থা দেখুন →' : 'View Drainage Hotspots →'}
              </Link>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="text-xs text-slate-500 font-semibold uppercase">
                {language === 'bn' ? 'অনুমোদিত পার্কিং ধারণক্ষমতা' : 'Certified Parking Space'}
              </div>
              <div className="text-2xl font-bold text-indigo-700">4,850 Bays</div>
              <p className="text-xs text-[#4B5563]">
                {language === 'bn' ? '১৬টি মাল্টি-স্টোরেড ও অন-স্ট্রিট সুবিধা' : '16 multi-level lots with EV charging.'}
              </p>
              <Link
                href="/smart-city/smart-parking"
                className="text-xs font-semibold text-[#006A4E] hover:underline block pt-1"
              >
                {language === 'bn' ? 'পার্কিং লট লোকেটর →' : 'View Parking Locator →'}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
