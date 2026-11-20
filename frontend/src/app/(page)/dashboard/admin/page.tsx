'use client';

import React, { useEffect, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Plus } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
import { useHydrated } from '@/hooks/useHydrated';
import { mockApi } from '@/services/mockApi';
import { NoticeCategory, NoticeItem } from '@/types';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { WorkspaceHeader } from '@/components/common/WorkspaceHeader';
import { StatisticCard } from '@/components/common/StatisticCard';
import { NoticeCard } from '@/components/common/NoticeCard';

function AdminDashboardContent() {
  const { language, t } = useApp();
  const { user } = useAuth();
  const mounted = useHydrated();
  const [stats, setStats] = useState<{
    totalRevenueBdt: number;
    pendingApplications: number;
    resolvedComplaints: number;
    totalComplaints: number;
    activeCitizens: number;
    wardComplaintSeries: { ward: string; open: number; resolved: number }[];
    monthlyRevenueSeries: { month: string; crore: number }[];
  } | null>(null);
  const [notices, setNotices] = useState<NoticeItem[]>([]);

  // Notice CMS State
  const [titleEn, setTitleEn] = useState('');
  const [titleBn, setTitleBn] = useState('');
  const [summaryEn, setSummaryEn] = useState('');
  const [summaryBn, setSummaryBn] = useState('');
  const [category, setCategory] = useState<NoticeCategory>('general');
  const [isUrgent, setIsUrgent] = useState(false);

  const loadData = async () => {
    const [s, n] = await Promise.all([mockApi.getAdminStats(), mockApi.getNotices()]);
    setStats(s);
    setNotices(n);
  };

  useEffect(() => {
    let active = true;
    Promise.all([mockApi.getAdminStats(), mockApi.getNotices()]).then(([s, n]) => {
      if (!active) return;
      setStats(s);
      setNotices(n);
    });
    return () => {
      active = false;
    };
  }, []);

  const handlePublishNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleEn.trim()) return;
    await mockApi.createNotice({
      titleEn,
      titleBn: titleBn || titleEn,
      summaryEn: summaryEn || titleEn,
      summaryBn: summaryBn || summaryEn || titleEn,
      category,
      isUrgent,
    });
    setTitleEn('');
    setTitleBn('');
    setSummaryEn('');
    setSummaryBn('');
    setIsUrgent(false);
    await loadData();
  };

  const handleDeleteNotice = async (id: string) => {
    await mockApi.deleteNotice(id);
    await loadData();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Portal Upgrade Banner */}
      <div className="p-4 bg-slate-900 text-white rounded-xl flex items-center justify-between border border-slate-800 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#006A4E] text-white flex items-center justify-center font-bold">
            ★
          </div>
          <div>
            <div className="font-bold text-sm">
              {language === 'bn' ? 'নতুন সমন্বিত অ্যাডমিন পোর্টাল প্রস্তুত' : 'Unified Admin Portal Available'}
            </div>
            <div className="text-xs text-slate-300">
              {language === 'bn'
                ? 'ফি ইঞ্জিন, অভিযোগ ডেস্ক ও পূর্ণাঙ্গ প্রশাসনিক সুবিধার জন্য নতুন পোর্টালে যান।'
                : 'Access the full suite with Fee Engine, Grievance Console, and Treasury Ledger.'}
            </div>
          </div>
        </div>
        <a
          href="/admin"
          className="px-4 py-2 bg-[#006A4E] text-white text-xs font-bold rounded-lg hover:bg-[#00523c] transition shadow-sm"
        >
          {language === 'bn' ? 'অ্যাডমিন পোর্টালে যান' : 'Go to Admin Portal (/admin)'}
        </a>
      </div>

      <WorkspaceHeader
        kicker={
          language === 'bn' ? 'মেয়র ও কেন্দ্রীয় কমান্ড পোর্টাল' : 'Mayor & Central Executive Command'
        }
        title={
          language === 'bn'
            ? 'অ্যাডমিন ও মেয়র অ্যানালিটিক্স ড্যাশবোর্ড'
            : 'Admin & Mayor Analytics Portal'
        }
        userName={(language === 'bn' ? user?.nameBn : user?.nameEn) || 'Administrator'}
        userMeta={`${user?.employeeId || 'EMP-ADM-001'} · ${user?.email || 'admin@dscc.gov.bd'}`}
      />

      {/* KPI Cards */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatisticCard
            label="Total Municipal Revenue (YTD)"
            value={`৳${(stats.totalRevenueBdt / 10000000).toFixed(2)} Cr`}
          />
          <StatisticCard
            label="Pending E-Service Queue"
            value={stats.pendingApplications}
            tone="warning"
          />
          <StatisticCard
            label="Complaints Resolved (Live DB)"
            value={`${stats.resolvedComplaints} / ${stats.totalComplaints}`}
            tone="primary"
          />
          <StatisticCard
            label="Registered Digital Citizens"
            value={stats.activeCitizens.toLocaleString()}
          />
        </div>
      )}

      {/* Charts */}
      {stats && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="civic-card bg-white rounded-xl border border-[#E2E8F0] p-6">
            <h2 className="text-base font-bold text-[#111827] mb-4">
              Ward-Wise Complaint Resolution
            </h2>
            <div className="h-72 w-full">
              {mounted && (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.wardComplaintSeries} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                    <XAxis dataKey="ward" tick={{ fontSize: 12, fill: '#4B5563' }} />
                    <YAxis tick={{ fontSize: 12, fill: '#4B5563' }} />
                    <Tooltip />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                    <Bar dataKey="resolved" name="Resolved" fill="#006A4E" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="open" name="Open / Active" fill="#C81E1E" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          <div className="civic-card bg-white rounded-xl border border-[#E2E8F0] p-6">
            <h2 className="text-base font-bold text-[#111827] mb-4">
              Monthly Digital Revenue Collection (BDT Crore)
            </h2>
            <div className="h-72 w-full">
              {mounted && (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.monthlyRevenueSeries} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                    <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#4B5563' }} />
                    <YAxis tick={{ fontSize: 12, fill: '#4B5563' }} />
                    <Tooltip />
                    <Bar dataKey="crore" name="Revenue (Cr ৳)" fill="#006A4E" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Notice CMS Manager */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <form
          onSubmit={handlePublishNotice}
          className="lg:col-span-5 civic-card bg-white rounded-xl border border-[#E2E8F0] p-6 space-y-4"
        >
          <h2 className="text-base font-bold text-[#111827] flex items-center gap-2">
            <Plus className="w-4 h-4 text-[#006A4E]" />
            <span>Notice Board CMS Publisher</span>
          </h2>

          <div>
            <label className="block text-xs font-semibold text-[#111827] mb-1">Title (English)</label>
            <input
              type="text"
              required
              value={titleEn}
              onChange={(e) => setTitleEn(e.target.value)}
              placeholder="e.g. Ward 19 Smart Waste Pickup Timing Update"
              className="w-full px-3 py-2 text-sm border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006A4E]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#111827] mb-1">Title (বাংলা)</label>
            <input
              type="text"
              value={titleBn}
              onChange={(e) => setTitleBn(e.target.value)}
              placeholder="ওয়ার্ড ১৯ বর্জ্য সংগ্রহের সময়সূচি হালনাগাদ"
              className="w-full px-3 py-2 text-sm border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006A4E]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#111827] mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as NoticeCategory)}
                className="w-full px-3 py-2 text-sm border border-[#E2E8F0] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#006A4E]"
              >
                <option value="general">General</option>
                <option value="revenue">Revenue & Tax</option>
                <option value="public_health">Public Health</option>
                <option value="tender">E-Tender</option>
                <option value="infrastructure">Engineering</option>
              </select>
            </div>
            <div className="flex items-end pb-2">
              <label className="flex items-center gap-2 text-xs font-semibold text-[#111827] cursor-pointer">
                <input
                  type="checkbox"
                  checked={isUrgent}
                  onChange={(e) => setIsUrgent(e.target.checked)}
                  className="w-4 h-4 accent-[#C81E1E]"
                />
                <span>Mark Urgent</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#111827] mb-1">Summary (English)</label>
            <textarea
              rows={2}
              value={summaryEn}
              onChange={(e) => setSummaryEn(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006A4E]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#111827] mb-1">Summary (বাংলা)</label>
            <textarea
              rows={2}
              value={summaryBn}
              onChange={(e) => setSummaryBn(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006A4E]"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-[#006A4E] hover:bg-[#00523C] text-white text-sm font-semibold rounded-lg transition-colors cursor-pointer"
          >
            Publish Notice to Public Portal
          </button>
        </form>

        <div className="lg:col-span-7 civic-card bg-white rounded-xl border border-[#E2E8F0] overflow-hidden">
          <div className="px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between">
            <h2 className="text-base font-bold text-[#111827]">Live Notice Inventory</h2>
            <span className="text-xs font-mono text-[#4B5563] tabular-nums">{notices.length} active</span>
          </div>
          <div className="divide-y divide-slate-100 max-h-[460px] overflow-y-auto">
            {notices.map((n) => (
              <NoticeCard
                key={n.id}
                notice={n}
                language={language}
                urgentLabel={t.notices.urgent}
                variant="admin"
                onDelete={handleDeleteNotice}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <AdminDashboardContent />
    </ProtectedRoute>
  );
}
