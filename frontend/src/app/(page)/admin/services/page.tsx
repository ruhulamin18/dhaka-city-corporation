'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Layers,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  ExternalLink,
  Edit2,
  Sliders,
  DollarSign,
  Plus,
  X,
  Power,
  ShieldCheck,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';

interface ServiceItem {
  id: string;
  nameBn: string;
  nameEn: string;
  departmentBn: string;
  departmentEn: string;
  feeBdt: number;
  slaDays: number;
  status: 'active' | 'maintenance' | 'disabled';
}

const ALL_SERVICES_CATALOGUE: ServiceItem[] = [
  {
    id: 'srv-01',
    nameBn: 'হোল্ডিং ট্যাক্স মূল্যায়ন ও পরিশোধ',
    nameEn: 'Holding Tax Assessment & Payment',
    departmentBn: 'রাজস্ব বিভাগ',
    departmentEn: 'Revenue Wing',
    feeBdt: 18,
    slaDays: 1,
    status: 'active',
  },
  {
    id: 'srv-02',
    nameBn: 'ই-ট্রেড লাইসেন্স ইস্যু ও নবায়ন',
    nameEn: 'E-Trade License Issuance & Renewal',
    departmentBn: 'বাণিজ্য ও লাইসেন্সিং বিভাগ',
    departmentEn: 'Commercial & Licensing Wing',
    feeBdt: 3000,
    slaDays: 3,
    status: 'active',
  },
  {
    id: 'srv-03',
    nameBn: 'নাগরিকত্ব ও চারিত্রিক সনদপত্র',
    nameEn: 'Citizenship & Character Certificate',
    departmentBn: 'সিভিল রেজিস্ট্রি ও সচিবালয়',
    departmentEn: 'Civil Registry & Secretariat',
    feeBdt: 100,
    slaDays: 1,
    status: 'active',
  },
  {
    id: 'srv-04',
    nameBn: 'ওয়ারিশান ও উত্তরাধিকার সনদ',
    nameEn: 'Succession & Heirship Certificate',
    departmentBn: 'কাউন্সিলর ও আইনি শাখা',
    departmentEn: 'Legal & Councillor Wing',
    feeBdt: 500,
    slaDays: 7,
    status: 'active',
  },
  {
    id: 'srv-05',
    nameBn: 'সড়ক খনন ও রাইট-অব-ওয়ে অনুমতি',
    nameEn: 'Road Cutting & Right-of-Way Permit',
    departmentBn: 'পূর্ত ও সড়ক প্রকৌশল বিভাগ',
    departmentEn: 'Civil Engineering & Roads',
    feeBdt: 12500,
    slaDays: 7,
    status: 'active',
  },
  {
    id: 'srv-06',
    nameBn: 'ভবন নির্মাণ অনুমোদন নো-অবজেকশন (NOC)',
    nameEn: 'Building Construction NOC Clearance',
    departmentBn: 'নগর পরিকল্পনা শাখা',
    departmentEn: 'Urban Planning Wing',
    feeBdt: 5000,
    slaDays: 10,
    status: 'active',
  },
  {
    id: 'srv-07',
    nameBn: 'বর্জ্য অপসারণ ও বিশেষ পরিচ্ছন্নতা সেবা',
    nameEn: 'Bulk Waste Disposal & Sanitation Service',
    departmentBn: 'বর্জ্য ও পরিচ্ছন্নতা বিভাগ',
    departmentEn: 'Waste & Conservancy Dept.',
    feeBdt: 1200,
    slaDays: 2,
    status: 'active',
  },
  {
    id: 'srv-08',
    nameBn: 'ড্রেনেজ সংযোগ ও নিষ্কাশন অনুমোদন',
    nameEn: 'Drainage Connection Approval',
    departmentBn: 'পানি ও নিষ্কাশন প্রকৌশল',
    departmentEn: 'Water & Drainage Engineering',
    feeBdt: 3500,
    slaDays: 5,
    status: 'active',
  },
  {
    id: 'srv-09',
    nameBn: 'মশক নিধন ও বিশেষ ফগিং স্প্রে অনুরোধ',
    nameEn: 'Vector Control & Mosquito Fogging Request',
    departmentBn: 'স্বাস্থ্য ও জনস্বাস্থ্য শাখা',
    departmentEn: 'Public Health Wing',
    feeBdt: 0,
    slaDays: 1,
    status: 'active',
  },
  {
    id: 'srv-10',
    nameBn: 'সড়কবাতি মেরামত ও নতুন বাতি স্থাপন',
    nameEn: 'Streetlight Repair & New Installation',
    departmentBn: 'বিদ্যুৎ ও লাইটিং শাখা',
    departmentEn: 'Electrical & Lighting Unit',
    feeBdt: 0,
    slaDays: 2,
    status: 'active',
  },
  {
    id: 'srv-11',
    nameBn: 'বিজ্ঞাপনী ফলক ও বিলবোর্ড লাইসেন্স',
    nameEn: 'Outdoor Advertising Billboard License',
    departmentBn: 'বিজ্ঞাপন ও এস্টেট শাখা',
    departmentEn: 'Estate & Advertising Dept.',
    feeBdt: 15000,
    slaDays: 7,
    status: 'active',
  },
  {
    id: 'srv-12',
    nameBn: 'কমিউনিটি সেন্টার বুকিং ও ভাড়া',
    nameEn: 'Municipal Community Centre Booking',
    departmentBn: 'সামাজিক কল্যাণ ও এস্টেট',
    departmentEn: 'Social Welfare & Community Wing',
    feeBdt: 25000,
    slaDays: 1,
    status: 'active',
  },
];

export default function AdminServicesPage() {
  const { language } = useApp();
  const [services, setServices] = useState<ServiceItem[]>(ALL_SERVICES_CATALOGUE);
  const [searchQuery, setSearchQuery] = useState('');
  const [deptFilter, setDeptFilter] = useState('all');

  const filtered = services.filter((srv) => {
    const matchesSearch =
      srv.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      srv.nameBn.includes(searchQuery) ||
      srv.departmentEn.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDept = deptFilter === 'all' || srv.departmentEn === deptFilter;

    return matchesSearch && matchesDept;
  });

  const toggleStatus = (id: string) => {
    setServices((prev) =>
      prev.map((s) => {
        if (s.id !== id) return s;
        const nextStatus = s.status === 'active' ? 'maintenance' : 'active';
        return { ...s, status: nextStatus };
      })
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-[#ECFDF5] text-[#006A4E] text-xs font-semibold uppercase tracking-wider mb-2">
              <Layers className="w-3.5 h-3.5" />
              {language === 'bn' ? 'নাগরিক সেবা ক্যাটালগ' : 'Service Catalogue Engine'}
            </div>
            <h1 className="text-2xl font-bold text-slate-900">
              {language === 'bn' ? 'সেবা ক্যাটালগ ও প্রবিধান ব্যবস্থাপনা' : 'Citizen Service Catalogue & Controls'}
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              {language === 'bn'
                ? 'সিটি কর্পোরেশনের সকল নাগরিক সেবার স্থিতি, সরকারি বিভাগ ও সময়সীমা তদারকি।'
                : 'Manage operational status, statutory fees, and SLA guarantees for municipal digital services.'}
            </p>
          </div>

          <Link
            href="/admin/fees"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#006A4E] text-white text-xs font-semibold rounded-lg hover:bg-[#00523c] transition shadow-sm"
          >
            <Sliders className="w-3.5 h-3.5" />
            {language === 'bn' ? 'ফি ইঞ্জিন কনফিগার' : 'Fee Rules Engine'}
          </Link>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                language === 'bn'
                  ? 'সেবার নাম বা বিভাগ দিয়ে খুঁজুন...'
                  : 'Search by service name or department...'
              }
              className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006A4E]"
            />
          </div>

          <div>
            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006A4E]"
            >
              <option value="all">{language === 'bn' ? 'সকল বিভাগ' : 'All Departments'}</option>
              <option value="Revenue Wing">Revenue Wing</option>
              <option value="Commercial & Licensing Wing">Commercial & Licensing</option>
              <option value="Civil Registry & Secretariat">Civil Registry</option>
              <option value="Civil Engineering & Roads">Civil Engineering</option>
              <option value="Waste & Conservancy Dept.">Waste & Conservancy</option>
            </select>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((srv) => (
          <div
            key={srv.id}
            className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:border-[#006A4E]/30 transition space-y-4 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider truncate">
                  {srv.departmentEn}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                    srv.status === 'active'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}
                >
                  {srv.status}
                </span>
              </div>

              <h3 className="font-bold text-slate-900 text-base leading-snug">
                {language === 'bn' ? srv.nameBn : srv.nameEn}
              </h3>
            </div>

            <div className="space-y-3 pt-3 border-t border-slate-100">
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span>{language === 'bn' ? 'সরকারি ফি:' : 'Statutory Fee:'}</span>
                <span className="font-bold text-slate-900">
                  {srv.feeBdt === 0 ? 'বিনামূল্যে (Free)' : `৳ ${srv.feeBdt.toLocaleString('en-US')}`}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-600">
                <span>{language === 'bn' ? 'সর্বোচ্চ সময়সীমা (SLA):' : 'Guaranteed SLA:'}</span>
                <span className="font-bold text-emerald-800">
                  {srv.slaDays} {language === 'bn' ? 'কার্যদিবস' : 'Working Days'}
                </span>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => toggleStatus(srv.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                    srv.status === 'active'
                      ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      : 'bg-emerald-600 text-white hover:bg-emerald-700'
                  }`}
                >
                  <Power className="w-3.5 h-3.5" />
                  {srv.status === 'active'
                    ? language === 'bn'
                      ? 'রক্ষণাবেক্ষণ চালু'
                      : 'Set Maintenance'
                    : language === 'bn'
                    ? 'সক্রিয় করুন'
                    : 'Activate'}
                </button>

                <Link
                  href="/admin/fees"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#006A4E] hover:underline"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  {language === 'bn' ? 'ফি নীতি' : 'Fee Rules'}
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
