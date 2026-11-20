'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  Users,
  AlertTriangle,
  FileCheck2,
  DollarSign,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ChevronRight,
  Sliders,
  MapPin,
  ExternalLink,
  RefreshCw,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { useApp } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
import { mockApi } from '@/services/mockApi';
import { Complaint, ServiceApplication } from '@/types';

export default function AdminDashboardPage() {
  const { language } = useApp();
  const { user } = useAuth();

  const [stats, setStats] = useState<{
    totalRevenueBdt: number;
    pendingApplications: number;
    resolvedComplaints: number;
    totalComplaints: number;
    activeCitizens: number;
    wardComplaintSeries: { ward: string; open: number; resolved: number }[];
    monthlyRevenueSeries: { month: string; crore: number }[];
  } | null>(null);

  const [applications, setApplications] = useState<ServiceApplication[]>([]);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [s, apps, cmps] = await Promise.all([
        mockApi.getAdminStats(),
        mockApi.getApplications(),
        mockApi.getComplaints(),
      ]);
      setStats(s);
      setApplications(apps.slice(0, 5));
      setComplaints(cmps.slice(0, 5));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    Promise.all([
      mockApi.getAdminStats(),
      mockApi.getApplications(),
      mockApi.getComplaints(),
    ]).then(([s, apps, cmps]) => {
      if (!active) return;
      setStats(s);
      setApplications(apps.slice(0, 5));
      setComplaints(cmps.slice(0, 5));
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* Executive Welcome Banner */}
      <div className="bg-slate-900 text-white rounded-xl p-6 shadow-sm border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-2 border border-emerald-500/30">
            <ShieldCheck className="w-3.5 h-3.5" />
            {language === 'bn' ? 'কেন্দ্রীয় নির্বাহী কমান্ড সেন্টার' : 'Central Executive Command'}
          </div>
          <h1 className="text-2xl font-bold">
            {language === 'bn'
              ? `স্বাগতম, ${user?.nameBn || user?.nameEn || 'কর্মকর্তা'}`
              : `Welcome, ${user?.nameEn || 'Administrative Officer'}`}
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            {language === 'bn'
              ? 'সিটি কর্পোরেশনের সকল নাগরিক আবেদন, নাগরিক অভিযোগ ও রাজস্ব ব্যবস্থাপনার সামগ্রিক চিত্র।'
              : 'Holistic overview of citizen applications, field grievance resolution, and municipal revenue operations.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadData}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 text-xs font-semibold transition border border-slate-700"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            {language === 'bn' ? 'রিফ্রেশ ডাটা' : 'Refresh Data'}
          </button>
          <Link
            href="/admin/fees"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#006A4E] text-white text-xs font-semibold hover:bg-[#00523c] transition shadow-sm"
          >
            <Sliders className="w-3.5 h-3.5" />
            {language === 'bn' ? 'ফি ইঞ্জিন কনফিগার' : 'Fee Rules Engine'}
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {language === 'bn' ? 'মোট রাজস্ব আদায়' : 'Total Revenue'}
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#006A4E] flex items-center justify-center font-bold">
              ৳
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">
            ৳ {stats?.totalRevenueBdt ? (stats.totalRevenueBdt / 10000000).toFixed(2) : '42.80'} কোটি
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold mt-2">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+14.2% {language === 'bn' ? 'পূর্ববর্তী কোয়ার্টারের তুলনায়' : 'vs last quarter'}</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {language === 'bn' ? 'পেন্ডিং আবেদন' : 'Pending Applications'}
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <FileCheck2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">
            {stats?.pendingApplications || 14}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-amber-700 font-semibold mt-2">
            <Clock className="w-3.5 h-3.5" />
            <span>
              {language === 'bn' ? 'যাচাই ও অনুমোদনের অপেক্ষায়' : 'Awaiting officer scrutiny'}
            </span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {language === 'bn' ? 'নাগরিক অভিযোগ' : 'Civic Grievances'}
            </span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">
            {stats ? stats.totalComplaints - stats.resolvedComplaints : 28}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-rose-600 font-semibold mt-2">
            <span>
              {stats?.resolvedComplaints || 42} {language === 'bn' ? 'নিষ্পন্ন' : 'resolved'} (
              {stats ? Math.round((stats.resolvedComplaints / stats.totalComplaints) * 100) : 60}%)
            </span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {language === 'bn' ? 'নিবন্ধিত নাগরিক' : 'Registered Citizens'}
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">
            {stats?.activeCitizens ? stats.activeCitizens.toLocaleString('en-US') : '1,248,320'}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-blue-600 font-semibold mt-2">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? 'জাতীয় পরিচয়পত্র যাচাইকৃত' : 'NID Verified'}</span>
          </div>
        </div>
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Monthly Revenue Chart */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {language === 'bn' ? 'মাসিক রাজস্ব আদায়ের চিত্র' : 'Monthly Revenue Performance'}
              </h2>
              <p className="text-xs text-slate-500">
                {language === 'bn' ? 'হোল্ডিং ট্যাক্স, ট্রেড লাইসেন্স ও অন্যান্য ফি (কোটি টাকায়)' : 'Holding tax, trade license & civic fees (in BDT Crore)'}
              </p>
            </div>
            <Link
              href="/admin/payments"
              className="text-xs font-semibold text-[#006A4E] hover:underline inline-flex items-center gap-1"
            >
              {language === 'bn' ? 'লেজার দেখুন' : 'Full Ledger'}
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={
                  stats?.monthlyRevenueSeries || [
                    { month: 'Jul', crore: 32.5 },
                    { month: 'Aug', crore: 28.4 },
                    { month: 'Sep', crore: 41.2 },
                    { month: 'Oct', crore: 36.8 },
                    { month: 'Nov', crore: 42.8 },
                  ]
                }
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="month" stroke="#64748B" fontSize={12} />
                <YAxis stroke="#64748B" fontSize={12} unit=" Cr" />
                <Tooltip
                  formatter={(value: any) => [`BDT ${value} Crore`, 'Revenue']}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #E2E8F0' }}
                />
                <Bar dataKey="crore" fill="#006A4E" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Ward Complaint Distribution */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {language === 'bn' ? 'ওয়ার্ড ভিত্তিক অভিযোগ সমাধান' : 'Ward Grievance Clearance'}
              </h2>
              <p className="text-xs text-slate-500">
                {language === 'bn' ? 'চলতি মাসে ওয়ার্ড অনুযায়ী উন্মুক্ত বনাম নিষ্পন্ন' : 'Current month open vs resolved'}
              </p>
            </div>
            <Link
              href="/admin/complaints"
              className="text-xs font-semibold text-[#006A4E] hover:underline inline-flex items-center gap-1"
            >
              {language === 'bn' ? 'অভিযোগ ডেস্ক' : 'Grievance Desk'}
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={
                  stats?.wardComplaintSeries || [
                    { ward: 'W-01', open: 6, resolved: 14 },
                    { ward: 'W-12', open: 4, resolved: 19 },
                    { ward: 'W-19', open: 8, resolved: 22 },
                    { ward: 'W-27', open: 3, resolved: 18 },
                    { ward: 'W-34', open: 5, resolved: 15 },
                  ]
                }
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="ward" stroke="#64748B" fontSize={12} />
                <YAxis stroke="#64748B" fontSize={12} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #E2E8F0' }} />
                <Legend />
                <Bar dataKey="open" name={language === 'bn' ? 'উন্মুক্ত' : 'Open'} fill="#F59E0B" radius={[4, 4, 0, 0]} />
                <Bar dataKey="resolved" name={language === 'bn' ? 'নিষ্পন্ন' : 'Resolved'} fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Two Column Work queues */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Pending Applications Queue */}
        <div className="lg:col-span-6 bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <FileCheck2 className="w-5 h-5 text-[#006A4E]" />
              <h2 className="text-base font-bold text-slate-900">
                {language === 'bn' ? 'যাচাইয়ের অপেক্ষায় সাম্প্রতিক আবেদন' : 'Applications Awaiting Scrutiny'}
              </h2>
            </div>
            <Link
              href="/admin/applications"
              className="text-xs font-semibold text-[#006A4E] hover:underline"
            >
              {language === 'bn' ? 'সকল আবেদন দেখুন' : 'View All'}
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {applications.length === 0 ? (
              <p className="text-sm text-slate-500 py-4 text-center">
                {language === 'bn' ? 'কোনো নতুন আবেদন নেই।' : 'No pending applications.'}
              </p>
            ) : (
              applications.map((app) => (
                <div key={app.id} className="py-3 flex items-center justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold text-slate-800">
                      {app.applicantName}
                    </div>
                    <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                      <span className="font-mono text-slate-600">{app.referenceId}</span>
                      <span>•</span>
                      <span>Ward {app.wardNumber}</span>
                      <span>•</span>
                      <span className="font-semibold text-emerald-700">৳ {app.feeBdt}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                        app.status === 'approved'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : app.status === 'rejected'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {app.status}
                    </span>
                    <Link
                      href="/admin/applications"
                      className="p-1.5 text-slate-400 hover:text-slate-700 rounded hover:bg-slate-100"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Live Civic Complaints Queue */}
        <div className="lg:col-span-6 bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              <h2 className="text-base font-bold text-slate-900">
                {language === 'bn' ? 'জরুরি নাগরিক অভিযোগ' : 'Priority Civic Grievances'}
              </h2>
            </div>
            <Link
              href="/admin/complaints"
              className="text-xs font-semibold text-[#006A4E] hover:underline"
            >
              {language === 'bn' ? 'সকল অভিযোগ দেখুন' : 'View All'}
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {complaints.length === 0 ? (
              <p className="text-sm text-slate-500 py-4 text-center">
                {language === 'bn' ? 'কোনো নতুন অভিযোগ নেই।' : 'No open complaints.'}
              </p>
            ) : (
              complaints.map((cmp) => (
                <div key={cmp.id} className="py-3 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-slate-800 truncate">
                      {cmp.title}
                    </div>
                    <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                      <span className="font-mono text-slate-600">{cmp.trackingId}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        Ward {cmp.wardNumber}
                      </span>
                      <span>•</span>
                      <span className="text-slate-600 capitalize">{cmp.category}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                        cmp.status === 'resolved'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : cmp.status === 'in_progress'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {cmp.status.replace('_', ' ')}
                    </span>
                    <Link
                      href="/admin/complaints"
                      className="p-1.5 text-slate-400 hover:text-slate-700 rounded hover:bg-slate-100"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
