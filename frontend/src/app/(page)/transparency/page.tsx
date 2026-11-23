'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  Calendar,
  CheckCircle2,
  ChevronDown,
  Download,
  Filter,
  Layers,
  Search,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useHydrated } from '@/hooks/useHydrated';
import { mockApi } from '@/services/mockApi';
import { DevelopmentProject, WardBudget } from '@/types';
import { TRANSPARENCY_SECTORS } from '@/data/transparencyData';
import { StatisticCard } from '@/components/common/StatisticCard';
import { ProjectCard } from '@/components/common/ProjectCard';
import { EmptyState } from '@/components/common/EmptyState';
import { ProjectDetailsModal } from '@/components/ProjectDetailsModal';

type FiscalYear = '2026-27' | '2025-26';
type ProjectStatusFilter = 'all' | 'on_track' | 'completed' | 'delayed';

export default function TransparencyPage() {
  const { language, t } = useApp();
  const [budgets, setBudgets] = useState<WardBudget[]>([]);
  const [projects, setProjects] = useState<DevelopmentProject[]>([]);
  const [query, setQuery] = useState('');
  const [fiscalYear, setFiscalYear] = useState<FiscalYear>('2026-27');
  const [statusFilter, setStatusFilter] = useState<ProjectStatusFilter>('all');
  const [wardFilter, setWardFilter] = useState<number | 'all'>('all');
  const [selectedProject, setSelectedProject] = useState<DevelopmentProject | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [exportNotice, setExportNotice] = useState(false);

  const mounted = useHydrated();

  useEffect(() => {
    let active = true;
    Promise.all([mockApi.getWardBudgets(), mockApi.getProjects()]).then(([b, p]) => {
      if (!active) return;
      setBudgets(b);
      setProjects(p);
    });
    return () => {
      active = false;
    };
  }, []);

  // Scale budgets dynamically based on chosen Fiscal Year
  const currentBudgets = useMemo(() => {
    if (fiscalYear === '2026-27') return budgets;
    // Fiscal Year 2025-26 baseline (historic comparative factor 0.88x)
    return budgets.map((b) => ({
      ...b,
      allocatedCrore: Number((b.allocatedCrore * 0.88).toFixed(1)),
      spentCrore: Number((b.spentCrore * 0.85).toFixed(1)),
      utilizationPercent: Math.round(((b.spentCrore * 0.85) / (b.allocatedCrore * 0.88)) * 100),
    }));
  }, [budgets, fiscalYear]);

  const totalAllocated = useMemo(
    () => currentBudgets.reduce((sum, b) => sum + b.allocatedCrore, 0),
    [currentBudgets]
  );
  const totalSpent = useMemo(
    () => currentBudgets.reduce((sum, b) => sum + b.spentCrore, 0),
    [currentBudgets]
  );
  const avgProgress = useMemo(
    () =>
      projects.length > 0
        ? Math.round(projects.reduce((sum, p) => sum + p.progressPercent, 0) / projects.length)
        : 0,
    [projects]
  );

  // Available unique wards for the ward filter dropdown
  const availableWards = useMemo(() => {
    const list = Array.from(new Set(projects.map((p) => p.wardNumber))).sort((a, b) => a - b);
    return list;
  }, [projects]);

  // Filtered projects based on search query, status tabs, and ward filter
  const filteredProjects = useMemo(() => {
    const q = query.trim().toLowerCase();
    return projects.filter((p) => {
      // Status filter
      if (statusFilter !== 'all' && p.status !== statusFilter) return false;
      // Ward filter
      if (wardFilter !== 'all' && p.wardNumber !== wardFilter) return false;
      // Search query
      if (!q) return true;
      return (
        p.titleEn.toLowerCase().includes(q) ||
        p.titleBn.toLowerCase().includes(q) ||
        p.contractorEn.toLowerCase().includes(q) ||
        p.contractorBn.toLowerCase().includes(q) ||
        p.sectorEn.toLowerCase().includes(q) ||
        p.sectorBn.toLowerCase().includes(q) ||
        `ward ${p.wardNumber}`.includes(q) ||
        `ওয়ার্ড ${p.wardNumber}`.includes(q) ||
        String(p.wardNumber) === q
      );
    });
  }, [projects, query, statusFilter, wardFilter]);

  const handleOpenProject = (project: DevelopmentProject) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  // CSV Export with UTF-8 BOM so Bengali characters display properly in MS Excel
  const handleExportCSV = () => {
    const headers = [
      'Project ID',
      'Title (EN)',
      'Title (BN)',
      'Sector (EN)',
      'Sector (BN)',
      'Ward',
      'Contractor (EN)',
      'Contractor (BN)',
      'Budget (BDT)',
      'Budget (Crore)',
      'Progress (%)',
      'Status',
      'Deadline',
    ];

    const rows = filteredProjects.map((p) => [
      `"${p.id}"`,
      `"${p.titleEn.replace(/"/g, '""')}"`,
      `"${p.titleBn.replace(/"/g, '""')}"`,
      `"${p.sectorEn}"`,
      `"${p.sectorBn}"`,
      p.wardNumber,
      `"${p.contractorEn.replace(/"/g, '""')}"`,
      `"${p.contractorBn.replace(/"/g, '""')}"`,
      p.budgetBdt,
      (p.budgetBdt / 10000000).toFixed(2),
      p.progressPercent,
      p.status,
      `"${p.deadline}"`,
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `DSCC_Development_Projects_${fiscalYear}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setExportNotice(true);
    setTimeout(() => setExportNotice(false), 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 space-y-8">
      {/* Page Header with Fiscal Year Selector & Export CSV */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#ECFDF5] border border-emerald-200 text-[#006A4E] text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? 'ডিএসসিসি উন্মুক্ত বাজেট ও স্বচ্ছতা' : 'DSCC Open Budget & Civic Transparency'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#111827]">
            {t.transparencyPage.title}
          </h1>
          <p className="mt-1.5 text-sm sm:text-base text-[#4B5563] max-w-3xl">
            {t.transparencyPage.subtitle}
          </p>
        </div>

        {/* Action Controls: Fiscal Year Dropdown & Export Button */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-slate-300 shadow-xs">
            <Calendar className="w-4 h-4 text-[#006A4E]" />
            <label htmlFor="fiscal-year-select" className="text-xs font-semibold text-slate-700">
              {language === 'bn' ? 'অর্থবছর:' : 'Fiscal Year:'}
            </label>
            <select
              id="fiscal-year-select"
              value={fiscalYear}
              onChange={(e) => setFiscalYear(e.target.value as FiscalYear)}
              className="text-xs font-bold text-[#111827] bg-transparent focus:outline-none cursor-pointer"
            >
              <option value="2026-27">{language === 'bn' ? '২০২৬-২৭ (বর্তমান)' : '2026-27 (Current)'}</option>
              <option value="2025-26">{language === 'bn' ? '২০২৫-২৬ (পূর্ববর্তী)' : '2025-26 (Previous)'}</option>
            </select>
          </div>

          <button
            type="button"
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#006A4E] hover:bg-[#00523C] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? 'বাজেট রিপোর্ট ডাউনলোড (CSV)' : 'Export Report (CSV)'}</span>
          </button>
        </div>
      </div>

      {exportNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-2 text-xs text-[#006A4E] font-medium animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>
            {language === 'bn'
              ? `প্রকল্প তালিকা ও বাজেট রিপোর্ট (অর্থবছর ${fiscalYear}) সফলভাবে ডাউনলোড হয়েছে।`
              : `Projects & budget report (Fiscal Year ${fiscalYear}) exported successfully.`}
          </span>
        </div>
      )}

      {/* KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <StatisticCard
          label={`${t.transparencyPage.totalBudget} (${fiscalYear})`}
          value={`৳${totalAllocated.toFixed(1)} Cr`}
        />
        <StatisticCard
          label={`${t.transparencyPage.utilizedBudget} (${fiscalYear})`}
          value={`৳${totalSpent.toFixed(1)} Cr`}
          tone="primary"
        />
        <StatisticCard
          label={t.transparencyPage.activeProjects}
          value={projects.length}
        />
        <StatisticCard
          label={t.transparencyPage.completedRate}
          value={`${avgProgress}%`}
          tone="primary"
        />
      </div>

      {/* Recharts Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 civic-card bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-[#111827]">
              {t.transparencyPage.wardChartTitle}
            </h2>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold">
              FY {fiscalYear}
            </span>
          </div>
          <div className="h-72 w-full">
            {mounted && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={currentBudgets} margin={{ top: 8, right: 12, left: -12, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="wardLabel" tick={{ fontSize: 12, fill: '#4B5563' }} />
                  <YAxis tick={{ fontSize: 12, fill: '#4B5563' }} />
                  <Tooltip
                    formatter={(val) => [`৳${val} Cr`, '']}
                    contentStyle={{ borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '12px' }}
                  />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Bar
                    dataKey="allocatedCrore"
                    name={language === 'bn' ? 'বরাদ্দকৃত বাজেট (কোটি)' : 'Allocated (Cr)'}
                    fill="#006A4E"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="spentCrore"
                    name={language === 'bn' ? 'ব্যয়িত অর্থ (কোটি)' : 'Spent (Cr)'}
                    fill="#10B981"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="lg:col-span-5 civic-card bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-[#111827]">
              {t.transparencyPage.sectorChartTitle}
            </h2>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-50 text-[#006A4E] font-semibold">
              {language === 'bn' ? 'খাতভিত্তিক' : 'Sector Breakdown'}
            </span>
          </div>
          <div className="h-72 w-full">
            {mounted && (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={TRANSPARENCY_SECTORS}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="48%"
                    innerRadius={56}
                    outerRadius={88}
                    paddingAngle={3}
                  >
                    {TRANSPARENCY_SECTORS.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val) => [`${val}%`, '']}
                    contentStyle={{ borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '12px' }}
                  />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* Development Projects Section with Multi-Filter & Search */}
      <div className="civic-card bg-white rounded-xl border border-[#E2E8F0] overflow-hidden shadow-xs">
        {/* Filter Controls Bar */}
        <div className="p-5 border-b border-[#E2E8F0] bg-slate-50/70 space-y-3.5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-[#111827]">
                {t.transparencyPage.projectsTitle}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {language === 'bn'
                  ? `মোট ${filteredProjects.length}টি প্রকল্প প্রদর্শিত হচ্ছে`
                  : `Displaying ${filteredProjects.length} active development projects`}
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Ward Filter */}
              <div className="flex items-center gap-1.5 bg-white px-2.5 py-1.5 rounded-lg border border-slate-300">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                <label htmlFor="filter-ward" className="text-xs font-semibold text-slate-600">
                  {language === 'bn' ? 'ওয়ার্ড:' : 'Ward:'}
                </label>
                <select
                  id="filter-ward"
                  value={wardFilter}
                  onChange={(e) =>
                    setWardFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))
                  }
                  className="text-xs font-bold text-[#111827] bg-transparent focus:outline-none cursor-pointer"
                >
                  <option value="all">{language === 'bn' ? 'সকল ওয়ার্ড' : 'All Wards'}</option>
                  {availableWards.map((w) => (
                    <option key={w} value={w}>
                      {language === 'bn' ? `ওয়ার্ড ${w}` : `Ward ${w}`}
                    </option>
                  ))}
                </select>
              </div>

              {/* Search Box */}
              <div className="relative w-full sm:w-64">
                <Search
                  className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                  aria-hidden="true"
                />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={
                    language === 'bn'
                      ? 'ঠিকাদার, ওয়ার্ড বা প্রকল্প খুঁজুন...'
                      : 'Search contractor, ward, or project...'
                  }
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006A4E]"
                />
              </div>
            </div>
          </div>

          {/* Status Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
            <span className="text-slate-500 font-semibold whitespace-nowrap text-xs">
              {language === 'bn' ? 'প্রকল্প অবস্থা:' : 'Status:'}
            </span>
            {(
              [
                { id: 'all', labelBn: 'সকল প্রকল্প', labelEn: 'All Projects' },
                { id: 'on_track', labelBn: 'চলমান (সময়মতো)', labelEn: 'On Track' },
                { id: 'completed', labelBn: 'সম্পন্ন', labelEn: 'Completed' },
                { id: 'delayed', labelBn: 'বিলম্বিত', labelEn: 'Delayed' },
              ] as const
            ).map((tab) => {
              const isActive = statusFilter === tab.id;
              const count =
                tab.id === 'all'
                  ? projects.length
                  : projects.filter((p) => p.status === tab.id).length;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setStatusFilter(tab.id)}
                  className={`px-3 py-1.5 rounded-lg font-semibold text-xs whitespace-nowrap border transition-all cursor-pointer flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-[#006A4E] text-white border-[#006A4E] shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <span>{language === 'bn' ? tab.labelBn : tab.labelEn}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono tabular-nums ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {filteredProjects.length === 0 ? (
          <EmptyState
            bordered={false}
            message={
              language === 'bn'
                ? 'আপনার অনুসন্ধানের সাথে মিলে যায় এমন কোনো উন্নয়ন প্রকল্প পাওয়া যায়নি।'
                : 'No development projects match your search or filter criteria.'
            }
          />
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                language={language}
                onViewDetails={handleOpenProject}
              />
            ))}
          </div>
        )}
      </div>

      {/* Project Details Modal */}
      <ProjectDetailsModal
        project={selectedProject}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        language={language}
      />
    </div>
  );
}
