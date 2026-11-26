'use client';

import React, { useState } from 'react';
import {
  BarChart3,
  Download,
  Printer,
  Calendar,
  TrendingUp,
  FileCheck2,
  AlertTriangle,
  Receipt,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function AdminReportsPage() {
  const { language } = useApp();
  const [timeframe, setTimeframe] = useState('FY 2025-2026');

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-[#ECFDF5] text-[#006A4E] text-xs font-semibold uppercase tracking-wider mb-2">
              <BarChart3 className="w-3.5 h-3.5" />
              {language === 'bn' ? 'কার্যক্ষমতা ও মেট্রিক্স' : 'Executive Metrics & Performance'}
            </div>
            <h1 className="text-2xl font-bold text-slate-900">
              {language === 'bn' ? 'সিটি কর্পোরেশন সামগ্রিক প্রতিবেদন' : 'Municipal Performance & Governance Reports'}
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              {language === 'bn'
                ? 'সেবা নিষ্পত্তি, রাজস্ব আহরণ, নাগরিক অভিযোগ সমাধান ও এসএলএ বাস্তবায়ন প্রতিবেদন।'
                : 'Audited performance analytics on service delivery, statutory revenue, and citizen grievance resolution.'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              className="px-3 py-2 text-xs font-semibold border border-slate-200 rounded-lg bg-white"
            >
              <option value="Current Month">{language === 'bn' ? 'চলতি মাস (নভেম্বর ২০২৬)' : 'Current Month (Nov 2026)'}</option>
              <option value="Q2 FY 2025-26">{language === 'bn' ? '২য় প্রান্তিক (অক্টো - ডিসে ২০২৬)' : 'Q2 (Oct - Dec 2026)'}</option>
              <option value="FY 2025-2026">{language === 'bn' ? 'পূর্ণ অর্থবছর ২০২৫-২০২৬' : 'Full Fiscal Year 2025-2026'}</option>
            </select>

            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-3.5 py-2 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800 transition shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              {language === 'bn' ? 'প্রিন্ট রিপোর্ট' : 'Print Report'}
            </button>
          </div>
        </div>
      </div>

      {/* KPI Performance Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            SLA Compliance Rate
          </span>
          <div className="text-3xl font-black text-[#006A4E] mt-1">94.8%</div>
          <span className="text-xs text-slate-500 mt-1 inline-block">
            Within statutory target window
          </span>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Total Applications
          </span>
          <div className="text-3xl font-black text-slate-900 mt-1">8,420</div>
          <span className="text-xs text-emerald-600 font-semibold mt-1 inline-block">
            96.2% Approval Rate
          </span>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Grievances Resolved
          </span>
          <div className="text-3xl font-black text-slate-900 mt-1">1,140</div>
          <span className="text-xs text-emerald-600 font-semibold mt-1 inline-block">
            Avg. 2.4 days turnaround
          </span>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Total Revenue
          </span>
          <div className="text-3xl font-black text-slate-900 mt-1">৳ 184.5 Cr</div>
          <span className="text-xs text-emerald-600 font-semibold mt-1 inline-block">
            +18.4% YoY Growth
          </span>
        </div>
      </div>

      {/* Department Breakdown Table */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <h2 className="text-base font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
          Departmental Efficiency & Clearance Index
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600 text-xs uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="p-3">{language === 'bn' ? 'বিভাগ' : 'Department'}</th>
                <th className="p-3">{language === 'bn' ? 'প্রাপ্ত আবেদন' : 'Applications Received'}</th>
                <th className="p-3">{language === 'bn' ? 'নিষ্পত্তিকৃত' : 'Processed'}</th>
                <th className="p-3">{language === 'bn' ? 'গড় সময় (SLA)' : 'Average SLA'}</th>
                <th className="p-3">{language === 'bn' ? 'নাগরিক সন্তুষ্টি' : 'Citizen Satisfaction'}</th>
                <th className="p-3">{language === 'bn' ? 'অবস্থা' : 'Status'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="p-3 font-semibold text-slate-800">
                  {language === 'bn' ? 'রাজস্ব ও হোল্ডিং ট্যাক্স শাখা' : 'Revenue & Holding Tax Wing'}
                </td>
                <td className="p-3 font-mono">3,850</td>
                <td className="p-3 font-mono text-emerald-700 font-bold">3,790 (98.4%)</td>
                <td className="p-3">1.2 Days</td>
                <td className="p-3 font-bold text-emerald-700">4.8 / 5.0</td>
                <td className="p-3">
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    EXCELLENT
                  </span>
                </td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-slate-800">
                  {language === 'bn' ? 'বাণিজ্য ও ট্রেড লাইসেন্স' : 'Commercial & Trade Licensing'}
                </td>
                <td className="p-3 font-mono">2,120</td>
                <td className="p-3 font-mono text-emerald-700 font-bold">2,050 (96.7%)</td>
                <td className="p-3">2.8 Days</td>
                <td className="p-3 font-bold text-emerald-700">4.6 / 5.0</td>
                <td className="p-3">
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    GOOD
                  </span>
                </td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-slate-800">
                  {language === 'bn' ? 'নাগরিক নিবন্ধন ও সনদ' : 'Civil Registry & Certificates'}
                </td>
                <td className="p-3 font-mono">1,890</td>
                <td className="p-3 font-mono text-emerald-700 font-bold">1,870 (98.9%)</td>
                <td className="p-3">0.8 Days</td>
                <td className="p-3 font-bold text-emerald-700">4.9 / 5.0</td>
                <td className="p-3">
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    EXCELLENT
                  </span>
                </td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-slate-800">
                  {language === 'bn' ? 'পুরকৌশল ও সড়ক বিভাগ' : 'Civil Engineering & Roads'}
                </td>
                <td className="p-3 font-mono">560</td>
                <td className="p-3 font-mono text-amber-700 font-bold">490 (87.5%)</td>
                <td className="p-3">5.9 Days</td>
                <td className="p-3 font-bold text-slate-700">4.2 / 5.0</td>
                <td className="p-3">
                  <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    MONITORED
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
