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
import { Search } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useHydrated } from '@/hooks/useHydrated';
import { mockApi } from '@/services/mockApi';
import { DevelopmentProject, WardBudget } from '@/types';
import { TRANSPARENCY_SECTORS } from '@/data/transparencyData';
import { StatisticCard } from '@/components/common/StatisticCard';
import { ProjectCard } from '@/components/common/ProjectCard';
import { EmptyState } from '@/components/common/EmptyState';

export default function TransparencyPage() {
  const { language, t } = useApp();
  const [budgets, setBudgets] = useState<WardBudget[]>([]);
  const [projects, setProjects] = useState<DevelopmentProject[]>([]);
  const [query, setQuery] = useState('');
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

  const totalAllocated = useMemo(
    () => budgets.reduce((sum, b) => sum + b.allocatedCrore, 0),
    [budgets]
  );
  const totalSpent = useMemo(
    () => budgets.reduce((sum, b) => sum + b.spentCrore, 0),
    [budgets]
  );
  const avgProgress = useMemo(
    () =>
      projects.length > 0
        ? Math.round(projects.reduce((sum, p) => sum + p.progressPercent, 0) / projects.length)
        : 0,
    [projects]
  );

  const filteredProjects = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return projects;
    return projects.filter(
      (p) =>
        p.titleEn.toLowerCase().includes(q) ||
        p.titleBn.toLowerCase().includes(q) ||
        p.contractorEn.toLowerCase().includes(q) ||
        p.contractorBn.toLowerCase().includes(q) ||
        p.sectorEn.toLowerCase().includes(q) ||
        p.sectorBn.toLowerCase().includes(q) ||
        `ward ${p.wardNumber}`.includes(q) ||
        String(p.wardNumber) === q
    );
  }, [projects, query]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#111827]">{t.transparencyPage.title}</h1>
        <p className="mt-1.5 text-sm sm:text-base text-[#4B5563] max-w-3xl">
          {t.transparencyPage.subtitle}
        </p>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatisticCard
          label={t.transparencyPage.totalBudget}
          value={`৳${totalAllocated.toFixed(1)} Cr`}
        />
        <StatisticCard
          label={t.transparencyPage.utilizedBudget}
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
        <div className="lg:col-span-7 civic-card bg-white rounded-xl border border-[#E2E8F0] p-6">
          <h2 className="text-base font-bold text-[#111827] mb-4">
            {t.transparencyPage.wardChartTitle}
          </h2>
          <div className="h-72 w-full">
            {mounted && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={budgets} margin={{ top: 8, right: 12, left: -12, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="wardLabel" tick={{ fontSize: 12, fill: '#4B5563' }} />
                  <YAxis tick={{ fontSize: 12, fill: '#4B5563' }} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Bar dataKey="allocatedCrore" name="Allocated (Cr)" fill="#006A4E" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="spentCrore" name="Spent (Cr)" fill="#10B981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="lg:col-span-5 civic-card bg-white rounded-xl border border-[#E2E8F0] p-6">
          <h2 className="text-base font-bold text-[#111827] mb-4">
            {t.transparencyPage.sectorChartTitle}
          </h2>
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
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* Ongoing Development Projects */}
      <div className="civic-card bg-white rounded-xl border border-[#E2E8F0] overflow-hidden">
        <div className="px-6 py-4 border-b border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-base font-bold text-[#111827]">{t.transparencyPage.projectsTitle}</h2>
          <div className="relative w-full sm:w-72">
            <Search
              className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              aria-hidden="true"
            />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label={
                language === 'bn'
                  ? 'ঠিকাদার, ওয়ার্ড বা প্রকল্প খুঁজুন'
                  : 'Search contractor, ward, or project'
              }
              placeholder={
                language === 'bn'
                  ? 'ঠিকাদার, ওয়ার্ড বা প্রকল্প খুঁজুন...'
                  : 'Search contractor, ward, or project...'
              }
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006A4E]"
            />
          </div>
        </div>

        {filteredProjects.length === 0 ? (
          <EmptyState
            bordered={false}
            message={
              language === 'bn'
                ? 'আপনার অনুসন্ধানের সাথে মিলে যায় এমন কোনো প্রকল্প পাওয়া যায়নি।'
                : 'No development projects match your search criteria.'
            }
          />
        ) : (
          <div className="divide-y divide-slate-200">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} language={language} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
