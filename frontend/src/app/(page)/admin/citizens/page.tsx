'use client';

import React, { useState } from 'react';
import {
  Users,
  Search,
  Filter,
  ShieldCheck,
  CheckCircle2,
  MapPin,
  Phone,
  Mail,
  FileText,
  Eye,
  X,
  CreditCard,
  AlertTriangle,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';

interface CitizenRecord {
  id: string;
  nameEn: string;
  nameBn: string;
  nid: string;
  phone: string;
  email: string;
  wardNumber: number;
  holdingNumber: string;
  nidVerified: boolean;
  status: 'active' | 'pending_verification' | 'restricted';
  totalApplications: number;
  totalComplaints: number;
  taxClearance: 'paid' | 'due' | 'overdue';
}

const SEEDED_CITIZENS: CitizenRecord[] = [
  {
    id: 'cit-01',
    nameEn: 'Md. Ruhul Amin',
    nameBn: 'মো: রুহুল আমিন',
    nid: '1992269184723',
    phone: '01816648095',
    email: 'mdruhulaminridoy18@gmail.com',
    wardNumber: 27,
    holdingNumber: 'H-27/412',
    nidVerified: true,
    status: 'active',
    totalApplications: 4,
    totalComplaints: 3,
    taxClearance: 'paid',
  },
  {
    id: 'cit-02',
    nameEn: 'Tahsina Rahman',
    nameBn: 'তাহসিনা রহমান',
    nid: '1988269145901',
    phone: '01712-445890',
    email: 'tahsina.r@gmail.com',
    wardNumber: 19,
    holdingNumber: 'H-19/88',
    nidVerified: true,
    status: 'active',
    totalApplications: 2,
    totalComplaints: 1,
    taxClearance: 'paid',
  },
  {
    id: 'cit-03',
    nameEn: 'Alhaj Nurul Islam',
    nameBn: 'আলহাজ্ব নুরুল ইসলাম',
    nid: '1965269123891',
    phone: '01911-342091',
    email: 'nurul.islam@yahoo.com',
    wardNumber: 12,
    holdingNumber: 'H-12/304',
    nidVerified: true,
    status: 'active',
    totalApplications: 6,
    totalComplaints: 4,
    taxClearance: 'due',
  },
  {
    id: 'cit-04',
    nameEn: 'Kamrul Hasan',
    nameBn: 'কামরুল হাসান',
    nid: '1995269189004',
    phone: '01671-556789',
    email: 'kamrul.hasan@outlook.com',
    wardNumber: 24,
    holdingNumber: 'H-24/115',
    nidVerified: false,
    status: 'pending_verification',
    totalApplications: 1,
    totalComplaints: 0,
    taxClearance: 'due',
  },
];

export default function AdminCitizensPage() {
  const { language } = useApp();
  const [citizens, setCitizens] = useState<CitizenRecord[]>(SEEDED_CITIZENS);
  const [searchQuery, setSearchQuery] = useState('');
  const [wardFilter, setWardFilter] = useState('all');
  const [selectedCitizen, setSelectedCitizen] = useState<CitizenRecord | null>(null);

  const filtered = citizens.filter((c) => {
    const matchesSearch =
      c.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.nameBn.includes(searchQuery) ||
      c.nid.includes(searchQuery) ||
      c.phone.includes(searchQuery) ||
      c.holdingNumber.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesWard = wardFilter === 'all' || c.wardNumber.toString() === wardFilter;

    return matchesSearch && matchesWard;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-[#ECFDF5] text-[#006A4E] text-xs font-semibold uppercase tracking-wider mb-2">
              <Users className="w-3.5 h-3.5" />
              {language === 'bn' ? 'জাতীয় নাগরিক ডেটাবেস' : 'Civil Registry & Citizen Records'}
            </div>
            <h1 className="text-2xl font-bold text-slate-900">
              {language === 'bn' ? 'নাগরিক রেজিস্ট্রি ও পরিচিতি ব্যবস্থাপনা' : 'Citizen Registry & Identity Oversight'}
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              {language === 'bn'
                ? 'জাতীয় পরিচয়পত্র যাচাইকৃত নাগরিক প্রোফাইল, হোল্ডিং নম্বর, সেবা আবেদন এবং ট্যাক্স ক্লিয়ারেন্স তথ্য।'
                : 'National Identity verified citizen records, municipal property holding affiliations, and service histories.'}
            </p>
          </div>
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
                  ? 'নাম, এনআইডি, ফোন অথবা হোল্ডিং নম্বর দিয়ে খুঁজুন...'
                  : 'Search by citizen name, NID, phone, holding #...'
              }
              className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006A4E]"
            />
          </div>

          <div>
            <select
              value={wardFilter}
              onChange={(e) => setWardFilter(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006A4E]"
            >
              <option value="all">{language === 'bn' ? 'সকল ওয়ার্ড' : 'All Wards'}</option>
              <option value="12">{language === 'bn' ? 'ওয়ার্ড ১২' : 'Ward 12'}</option>
              <option value="19">{language === 'bn' ? 'ওয়ার্ড ১৯' : 'Ward 19'}</option>
              <option value="24">{language === 'bn' ? 'ওয়ার্ড ২৪' : 'Ward 24'}</option>
              <option value="27">{language === 'bn' ? 'ওয়ার্ড ২৭' : 'Ward 27'}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Citizens Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600 text-xs uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="p-3.5">{language === 'bn' ? 'নাগরিক / এনআইডি' : 'Citizen / NID'}</th>
                <th className="p-3.5">{language === 'bn' ? 'যোগাযোগের তথ্য' : 'Contact Details'}</th>
                <th className="p-3.5">{language === 'bn' ? 'ওয়ার্ড ও হোল্ডিং' : 'Ward & Holding'}</th>
                <th className="p-3.5">{language === 'bn' ? 'যাচাই অবস্থা' : 'Verification'}</th>
                <th className="p-3.5">{language === 'bn' ? 'কর পরিশোধ' : 'Tax Clearance'}</th>
                <th className="p-3.5">{language === 'bn' ? 'আবেদনসমূহ' : 'Applications'}</th>
                <th className="p-3.5 text-right">{language === 'bn' ? 'প্রোফাইল' : 'Profile'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((cit) => (
                <tr key={cit.id} className="hover:bg-slate-50/60 transition">
                  <td className="p-3.5">
                    <div className="font-semibold text-slate-900">
                      {language === 'bn' ? cit.nameBn : cit.nameEn}
                    </div>
                    <div className="text-xs text-slate-500 font-mono">
                      NID: {cit.nid}
                    </div>
                  </td>
                  <td className="p-3.5">
                    <div className="text-xs font-mono text-slate-800">{cit.phone}</div>
                    <div className="text-xs text-slate-400">{cit.email}</div>
                  </td>
                  <td className="p-3.5">
                    <div className="text-xs font-semibold text-slate-800">
                      Ward {cit.wardNumber}
                    </div>
                    <div className="text-xs text-slate-500 font-mono">
                      {cit.holdingNumber}
                    </div>
                  </td>
                  <td className="p-3.5">
                    {cit.nidVerified ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3" />
                        Verified
                      </span>
                    ) : (
                      <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        Pending
                      </span>
                    )}
                  </td>
                  <td className="p-3.5">
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                        cit.taxClearance === 'paid'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {cit.taxClearance}
                    </span>
                  </td>
                  <td className="p-3.5 text-xs text-slate-700 font-medium">
                    {cit.totalApplications} Submitted
                  </td>
                  <td className="p-3.5 text-right">
                    <button
                      onClick={() => setSelectedCitizen(cit)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      {language === 'bn' ? 'প্রোফাইল' : 'View'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Citizen Detail Modal */}
      {selectedCitizen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold text-[#006A4E] uppercase tracking-wider">
                  Citizen Dossier
                </span>
                <h2 className="text-xl font-bold text-slate-900">
                  {selectedCitizen.nameEn}
                </h2>
                <div className="text-xs text-slate-500">{selectedCitizen.nameBn}</div>
              </div>
              <button
                onClick={() => setSelectedCitizen(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">{language === 'bn' ? 'জাতীয় পরিচয়পত্র' : 'National ID'}</span>
                <span className="font-mono font-bold text-slate-800">{selectedCitizen.nid}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">{language === 'bn' ? 'মোবাইল নম্বর' : 'Mobile Phone'}</span>
                <span className="font-mono text-slate-800">{selectedCitizen.phone}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">{language === 'bn' ? 'ওয়ার্ড নম্বর' : 'Ward Number'}</span>
                <span className="font-semibold text-slate-800">
                  {language === 'bn' ? `ওয়ার্ড ${selectedCitizen.wardNumber}` : `Ward ${selectedCitizen.wardNumber}`}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">{language === 'bn' ? 'হোল্ডিং নম্বর' : 'Holding Number'}</span>
                <span className="font-mono text-slate-800">{selectedCitizen.holdingNumber}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">{language === 'bn' ? 'দাখিলকৃত আবেদন' : 'Applications Filed'}</span>
                <span className="font-bold text-emerald-700">{selectedCitizen.totalApplications}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">{language === 'bn' ? 'নাগরিক অভিযোগ' : 'Civic Grievances'}</span>
                <span className="font-bold text-slate-800">{selectedCitizen.totalComplaints}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-500">{language === 'bn' ? 'হোল্ডিং ট্যাক্স অবস্থা' : 'Holding Tax Status'}</span>
                <span className="font-bold text-emerald-700 uppercase">{selectedCitizen.taxClearance}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedCitizen(null)}
                className="px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
