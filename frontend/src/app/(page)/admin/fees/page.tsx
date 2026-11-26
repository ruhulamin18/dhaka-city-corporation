'use client';

import React, { useState } from 'react';
import {
  Sliders,
  DollarSign,
  FileText,
  Clock,
  Save,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  History,
  ShieldCheck,
  Edit2,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';

interface FeeRule {
  id: string;
  serviceKey: string;
  serviceNameBn: string;
  serviceNameEn: string;
  category: string;
  baseFeeBdt: number;
  vatPercent: number;
  processingDays: number;
  fiscalYear: string;
  gazetteRef: string;
  mandatoryDocuments: string[];
  optionalDocuments: string[];
  lastModifiedBy: string;
  lastModifiedAt: string;
}

const INITIAL_FEE_RULES: FeeRule[] = [
  {
    id: 'fee-1',
    serviceKey: 'holding_tax',
    serviceNameBn: 'হোল্ডিং ট্যাক্স ও মূল্যায়ন',
    serviceNameEn: 'Holding Tax Assessment',
    category: 'revenue',
    baseFeeBdt: 18, // per sq ft residential
    vatPercent: 7,
    processingDays: 1,
    fiscalYear: '2025-2026',
    gazetteRef: 'DCC-REV-2025/GZ-104',
    mandatoryDocuments: [
      'National ID Card (NID)',
      'Proof of Ownership / Deed Copy',
      'Recent Utility Bill Copy',
    ],
    optionalDocuments: ['Previous Tax Payment Receipt', 'Building Plan Approval (RAJUK)'],
    lastModifiedBy: 'Farhana Yasmin, BCS (Revenue Wing)',
    lastModifiedAt: '2026-11-15 14:30',
  },
  {
    id: 'fee-2',
    serviceKey: 'trade_license',
    serviceNameBn: 'ট্রেড লাইসেন্স ইস্যু ও নবায়ন',
    serviceNameEn: 'Trade License Issuance & Renewal',
    category: 'licensing',
    baseFeeBdt: 3000,
    vatPercent: 15,
    processingDays: 3,
    fiscalYear: '2025-2026',
    gazetteRef: 'DCC-COMM-2025/GZ-089',
    mandatoryDocuments: [
      'NID of Proprietor / Directors',
      'Rent Agreement or Holding Tax Receipt',
      'Passport-size Photograph',
      'TIN Certificate',
    ],
    optionalDocuments: ['Memorandum & Articles of Association (for Ltd Co)', 'Environmental Clearance'],
    lastModifiedBy: 'Mayor Secretariat',
    lastModifiedAt: '2026-11-10 11:20',
  },
  {
    id: 'fee-3',
    serviceKey: 'citizen_certificate',
    serviceNameBn: 'নাগরিকত্ব ও চারিত্রিক সনদ',
    serviceNameEn: 'Citizenship & Character Certificate',
    category: 'civil_registry',
    baseFeeBdt: 100,
    vatPercent: 0,
    processingDays: 1,
    fiscalYear: '2025-2026',
    gazetteRef: 'DCC-SEC-2025/GZ-012',
    mandatoryDocuments: [
      'National ID Card (NID) of Citizen',
      'Proof of Ward Residency (Holding Tax or Rent receipt)',
    ],
    optionalDocuments: ['Birth Registration Certificate (for minors)'],
    lastModifiedBy: 'Eng. Tariqul Islam (Ward 19)',
    lastModifiedAt: '2026-11-02 09:45',
  },
  {
    id: 'fee-4',
    serviceKey: 'road_digging',
    serviceNameBn: 'সড়ক খনন অনুমতি ও নিরাপত্তা জামানত',
    serviceNameEn: 'Road Cutting & Right-of-Way Permit',
    category: 'engineering',
    baseFeeBdt: 12500,
    vatPercent: 15,
    processingDays: 7,
    fiscalYear: '2025-2026',
    gazetteRef: 'DCC-ENG-2025/GZ-210',
    mandatoryDocuments: [
      'Utility Agency Authorization Letter (DESCO/WASA/Titas)',
      'Detailed Trenching & Route Alignment Map',
      'Work Schedule & Restoration Commitment Deed',
    ],
    optionalDocuments: ['Environmental Impact Mitigation Plan'],
    lastModifiedBy: 'Eng. Tariqul Islam (Ward Operations)',
    lastModifiedAt: '2026-10-28 16:15',
  },
];

interface AuditEntry {
  id: string;
  serviceKey: string;
  fieldChanged: string;
  oldValue: string;
  newValue: string;
  changedBy: string;
  timestamp: string;
}

export default function FeeDocumentEnginePage() {
  const { language } = useApp();
  const { user } = useAuth();

  const [rules, setRules] = useState<FeeRule[]>(INITIAL_FEE_RULES);
  const [selectedRule, setSelectedRule] = useState<FeeRule>(INITIAL_FEE_RULES[0]);
  const [isEditing, setIsEditing] = useState(false);

  // Edit fields
  const [editBaseFee, setEditBaseFee] = useState(selectedRule.baseFeeBdt);
  const [editVat, setEditVat] = useState(selectedRule.vatPercent);
  const [editSla, setEditSla] = useState(selectedRule.processingDays);
  const [editFiscalYear, setEditFiscalYear] = useState(selectedRule.fiscalYear);
  const [editGazette, setEditGazette] = useState(selectedRule.gazetteRef);
  const [newMandatoryDoc, setNewMandatoryDoc] = useState('');
  const [newOptionalDoc, setNewOptionalDoc] = useState('');

  // Status
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [auditLogs, setAuditLogs] = useState<AuditEntry[]>([
    {
      id: 'aud-1',
      serviceKey: 'trade_license',
      fieldChanged: 'baseFeeBdt',
      oldValue: '2500',
      newValue: '3000',
      changedBy: 'Farhana Yasmin, BCS',
      timestamp: '2026-11-10 11:20:04',
    },
    {
      id: 'aud-2',
      serviceKey: 'holding_tax',
      fieldChanged: 'gazetteRef',
      oldValue: 'DCC-REV-2024/GZ-077',
      newValue: 'DCC-REV-2025/GZ-104',
      changedBy: 'Mayor Secretariat',
      timestamp: '2026-11-15 14:30:19',
    },
  ]);

  const handleSelectRule = (rule: FeeRule) => {
    setSelectedRule(rule);
    setEditBaseFee(rule.baseFeeBdt);
    setEditVat(rule.vatPercent);
    setEditSla(rule.processingDays);
    setEditFiscalYear(rule.fiscalYear);
    setEditGazette(rule.gazetteRef);
    setIsEditing(false);
  };

  const handleAddMandatoryDoc = () => {
    if (!newMandatoryDoc.trim()) return;
    const updated = {
      ...selectedRule,
      mandatoryDocuments: [...selectedRule.mandatoryDocuments, newMandatoryDoc.trim()],
    };
    setSelectedRule(updated);
    setNewMandatoryDoc('');
  };

  const handleRemoveMandatoryDoc = (idx: number) => {
    const updated = {
      ...selectedRule,
      mandatoryDocuments: selectedRule.mandatoryDocuments.filter((_, i) => i !== idx),
    };
    setSelectedRule(updated);
  };

  const handleAddOptionalDoc = () => {
    if (!newOptionalDoc.trim()) return;
    const updated = {
      ...selectedRule,
      optionalDocuments: [...selectedRule.optionalDocuments, newOptionalDoc.trim()],
    };
    setSelectedRule(updated);
    setNewOptionalDoc('');
  };

  const handleRemoveOptionalDoc = (idx: number) => {
    const updated = {
      ...selectedRule,
      optionalDocuments: selectedRule.optionalDocuments.filter((_, i) => i !== idx),
    };
    setSelectedRule(updated);
  };

  const handleSave = () => {
    const updatedRule: FeeRule = {
      ...selectedRule,
      baseFeeBdt: editBaseFee,
      vatPercent: editVat,
      processingDays: editSla,
      fiscalYear: editFiscalYear,
      gazetteRef: editGazette,
      lastModifiedBy: user?.nameEn || 'Authorized Officer',
      lastModifiedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
    };

    // Add Audit Entry
    const newAudit: AuditEntry = {
      id: `aud-${Date.now()}`,
      serviceKey: selectedRule.serviceKey,
      fieldChanged: 'baseFeeBdt, vat, sla, gazetteRef',
      oldValue: `৳${selectedRule.baseFeeBdt} | ${selectedRule.processingDays} days`,
      newValue: `৳${editBaseFee} | ${editSla} days`,
      changedBy: user?.nameEn || 'Authorized Officer',
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
    };

    setRules((prev) => prev.map((r) => (r.id === updatedRule.id ? updatedRule : r)));
    setSelectedRule(updatedRule);
    setAuditLogs((prev) => [newAudit, ...prev]);
    setIsEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-[#ECFDF5] text-[#006A4E] text-xs font-semibold uppercase tracking-wider mb-2">
              <Sliders className="w-3.5 h-3.5" />
              {language === 'bn' ? 'সরকারি বিধি ও ফি ইঞ্জিন' : 'Official Fee & Rules Policy Engine'}
            </div>
            <h1 className="text-2xl font-bold text-slate-900">
              {language === 'bn'
                ? 'সেবা ফি ও প্রয়োজনীয় কাগজপত্র কনফিগারেশন'
                : 'Fee Schedules & Mandatory Document Engine'}
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              {language === 'bn'
                ? 'সিটি কর্পোরেশনের সকল নাগরিক সেবার সরকারি ফি, ভ্যাট, নিষ্পত্তির সময়সীমা এবং বাধ্যতামূলক ডকুমেন্টের শর্তাবলি।'
                : 'Configure statutory fees, VAT rates, SLA processing windows, and document checklists with cryptographic audit trail.'}
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-600 bg-slate-50 px-3 py-2 rounded-lg border border-slate-200">
            <ShieldCheck className="w-4 h-4 text-[#006A4E]" />
            <span>
              {language === 'bn'
                ? 'গেজেট অনুমোদিত বিধি ব্যবস্থা'
                : 'Official Gazette Compliant Engine'}
            </span>
          </div>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 text-emerald-900 text-sm">
          <CheckCircle2 className="w-5 h-5 text-[#006A4E] shrink-0" />
          <div>
            <span className="font-bold">
              {language === 'bn' ? 'সফলভাবে সংরক্ষিত!' : 'Fee Configuration Saved!'}
            </span>{' '}
            {language === 'bn'
              ? 'নাগরিক পোর্টাল ও পেমেন্ট সিস্টেমে নতুন নীতি ও ফি শিডিউল তাৎক্ষণিকভাবে কার্যকর হয়েছে।'
              : 'The updated fee schedule and mandatory document checklist is now live across the citizen portal.'}
          </div>
        </div>
      )}

      {/* Main Grid: Left Rules List, Right Detail Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Rules Selector */}
        <div className="lg:col-span-4 space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 px-1">
            {language === 'bn' ? 'সেবাসমূহ তালিকা' : 'Service Schedule Index'}
          </div>

          {rules.map((rule) => {
            const isSelected = selectedRule.id === rule.id;
            return (
              <button
                key={rule.id}
                onClick={() => handleSelectRule(rule)}
                className={`w-full text-left p-4 rounded-xl border transition flex items-center justify-between ${
                  isSelected
                    ? 'border-[#006A4E] bg-emerald-50/50 shadow-sm'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="text-sm font-bold text-slate-900">
                    {language === 'bn' ? rule.serviceNameBn : rule.serviceNameEn}
                  </div>
                  <div className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                    <span className="font-semibold text-emerald-700">
                      ৳ {rule.baseFeeBdt.toLocaleString('en-US')}
                    </span>
                    <span>•</span>
                    <span>{rule.processingDays} {language === 'bn' ? 'দিন' : 'Days'} SLA</span>
                  </div>
                </div>
                <ArrowRight
                  className={`w-4 h-4 ${
                    isSelected ? 'text-[#006A4E]' : 'text-slate-300'
                  }`}
                />
              </button>
            );
          })}
        </div>

        {/* Configuration Panel */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                {selectedRule.category.toUpperCase()} • {selectedRule.fiscalYear}
              </span>
              <h2 className="text-xl font-bold text-slate-900">
                {language === 'bn' ? selectedRule.serviceNameBn : selectedRule.serviceNameEn}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              {!isEditing ? (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="inline-flex items-center gap-2 px-3.5 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-semibold rounded-lg transition"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  {language === 'bn' ? 'এডিট করুন' : 'Edit Configuration'}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSave}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#006A4E] text-white hover:bg-[#00523c] text-xs font-semibold rounded-lg transition shadow-sm"
                >
                  <Save className="w-3.5 h-3.5" />
                  {language === 'bn' ? 'সংরক্ষণ ও কার্যকর' : 'Save & Publish'}
                </button>
              )}
            </div>
          </div>

          {/* Pricing & Statutory Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
                {language === 'bn' ? 'মূল সরকারি ফি (BDT)' : 'Base Statutory Fee (BDT)'}
              </label>
              {isEditing ? (
                <input
                  type="number"
                  value={editBaseFee}
                  onChange={(e) => setEditBaseFee(Number(e.target.value))}
                  className="w-full px-3 py-1.5 text-base font-bold bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006A4E]"
                />
              ) : (
                <div className="text-2xl font-black text-slate-900">
                  ৳ {selectedRule.baseFeeBdt.toLocaleString('en-US')}
                </div>
              )}
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
                {language === 'bn' ? 'ভ্যাট / সরকারি ট্যাক্স (%)' : 'VAT Rate (%)'}
              </label>
              {isEditing ? (
                <input
                  type="number"
                  value={editVat}
                  onChange={(e) => setEditVat(Number(e.target.value))}
                  className="w-full px-3 py-1.5 text-base font-bold bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006A4E]"
                />
              ) : (
                <div className="text-2xl font-black text-slate-900">
                  {selectedRule.vatPercent}%
                </div>
              )}
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
                {language === 'bn' ? 'নিষ্পত্তির সর্বোচ্চ সীমা (দিন)' : 'Max SLA Window (Days)'}
              </label>
              {isEditing ? (
                <input
                  type="number"
                  value={editSla}
                  onChange={(e) => setEditSla(Number(e.target.value))}
                  className="w-full px-3 py-1.5 text-base font-bold bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006A4E]"
                />
              ) : (
                <div className="text-2xl font-black text-slate-900">
                  {selectedRule.processingDays} {language === 'bn' ? 'দিন' : 'Days'}
                </div>
              )}
            </div>
          </div>

          {/* Legal Reference & Fiscal Year */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                {language === 'bn' ? 'অর্থ-বছর' : 'Fiscal Year'}
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={editFiscalYear}
                  onChange={(e) => setEditFiscalYear(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
                />
              ) : (
                <div className="text-sm font-semibold text-slate-800 bg-slate-50 px-3 py-2 rounded-lg border border-slate-200">
                  {selectedRule.fiscalYear}
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                {language === 'bn' ? 'সরকারি গেজেট নোটিফিকেশন নম্বর' : 'Gazette Notification Ref'}
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={editGazette}
                  onChange={(e) => setEditGazette(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg font-mono"
                />
              ) : (
                <div className="text-sm font-mono text-slate-800 bg-slate-50 px-3 py-2 rounded-lg border border-slate-200">
                  {selectedRule.gazetteRef}
                </div>
              )}
            </div>
          </div>

          {/* Mandatory Documents Checklist */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                {language === 'bn'
                  ? 'বাধ্যতামূলক প্রয়োজনীয় ডকুমেন্টের তালিকা'
                  : 'Mandatory Required Documents (Citizen Must Upload)'}
              </label>
              <span className="text-xs text-rose-600 font-semibold">
                * {selectedRule.mandatoryDocuments.length} {language === 'bn' ? 'টি আবশ্যক' : 'Required'}
              </span>
            </div>

            <div className="space-y-2">
              {selectedRule.mandatoryDocuments.map((doc, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-lg bg-rose-50/40 border border-rose-200 text-sm font-medium text-slate-800"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-700 text-xs flex items-center justify-center font-bold">
                      {idx + 1}
                    </span>
                    <span>{doc}</span>
                  </div>
                  {isEditing && (
                    <button
                      type="button"
                      onClick={() => handleRemoveMandatoryDoc(idx)}
                      className="text-rose-500 hover:text-rose-700 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {isEditing && (
              <div className="flex gap-2 mt-3">
                <input
                  type="text"
                  value={newMandatoryDoc}
                  onChange={(e) => setNewMandatoryDoc(e.target.value)}
                  placeholder={
                    language === 'bn'
                      ? 'নতুন আবশ্যক ডকুমেন্টের নাম...'
                      : 'e.g. Ward Councillor Character Certificate'
                  }
                  className="flex-1 px-3 py-1.5 text-sm border border-slate-200 rounded-lg"
                />
                <button
                  type="button"
                  onClick={handleAddMandatoryDoc}
                  className="px-3 py-1.5 bg-slate-800 text-white text-xs font-semibold rounded-lg hover:bg-slate-700 flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  {language === 'bn' ? 'যোগ করুন' : 'Add'}
                </button>
              </div>
            )}
          </div>

          {/* Optional Documents */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                {language === 'bn'
                  ? 'ঐচ্ছিক / সহায়ক ডকুমেন্ট'
                  : 'Optional / Auxiliary Documents'}
              </label>
              <span className="text-xs text-slate-500">
                {selectedRule.optionalDocuments.length} {language === 'bn' ? 'টি ঐচ্ছিক' : 'Optional'}
              </span>
            </div>

            <div className="space-y-2">
              {selectedRule.optionalDocuments.map((doc, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200 text-sm font-medium text-slate-700"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 text-xs flex items-center justify-center font-bold">
                      {idx + 1}
                    </span>
                    <span>{doc}</span>
                  </div>
                  {isEditing && (
                    <button
                      type="button"
                      onClick={() => handleRemoveOptionalDoc(idx)}
                      className="text-slate-400 hover:text-rose-600 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {isEditing && (
              <div className="flex gap-2 mt-3">
                <input
                  type="text"
                  value={newOptionalDoc}
                  onChange={(e) => setNewOptionalDoc(e.target.value)}
                  placeholder={
                    language === 'bn'
                      ? 'নতুন ঐচ্ছিক ডকুমেন্টের নাম...'
                      : 'e.g. Bank Solvency Certificate'
                  }
                  className="flex-1 px-3 py-1.5 text-sm border border-slate-200 rounded-lg"
                />
                <button
                  type="button"
                  onClick={handleAddOptionalDoc}
                  className="px-3 py-1.5 bg-slate-800 text-white text-xs font-semibold rounded-lg hover:bg-slate-700 flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  {language === 'bn' ? 'যোগ করুন' : 'Add'}
                </button>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <div>
              {language === 'bn' ? 'সর্বশেষ পরিবর্তনকারী:' : 'Last modified by:'}{' '}
              <span className="font-semibold text-slate-700">{selectedRule.lastModifiedBy}</span>
            </div>
            <div>
              {language === 'bn' ? 'তারিখ ও সময়:' : 'Timestamp:'}{' '}
              <span className="font-mono">{selectedRule.lastModifiedAt}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Audit Trail Log */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
          <History className="w-5 h-5 text-[#006A4E]" />
          <h2 className="text-lg font-bold text-slate-900">
            {language === 'bn' ? 'ফি ও নীতি পরিবর্তনের অডিট লগ' : 'Statutory Fee & Policy Audit Log'}
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600 text-xs uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="p-3">{language === 'bn' ? 'অডিট আইডি' : 'Audit ID'}</th>
                <th className="p-3">{language === 'bn' ? 'সেবা' : 'Service'}</th>
                <th className="p-3">{language === 'bn' ? 'পরিবর্তিত ক্ষেত্র' : 'Field Changed'}</th>
                <th className="p-3">{language === 'bn' ? 'পূর্বের মান' : 'Old Value'}</th>
                <th className="p-3">{language === 'bn' ? 'নতুন মান' : 'New Value'}</th>
                <th className="p-3">{language === 'bn' ? 'অনুমোদনকারী' : 'Authorized By'}</th>
                <th className="p-3">{language === 'bn' ? 'সময়' : 'Timestamp'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/50">
                  <td className="p-3 font-mono text-xs text-slate-500">{log.id}</td>
                  <td className="p-3 font-semibold text-slate-800 capitalize">
                    {log.serviceKey.replace('_', ' ')}
                  </td>
                  <td className="p-3 text-xs text-slate-600 font-mono">{log.fieldChanged}</td>
                  <td className="p-3 text-xs text-rose-600 bg-rose-50/30 font-mono">{log.oldValue}</td>
                  <td className="p-3 text-xs text-emerald-700 bg-emerald-50/30 font-mono font-bold">
                    {log.newValue}
                  </td>
                  <td className="p-3 text-xs text-slate-700 font-medium">{log.changedBy}</td>
                  <td className="p-3 text-xs text-slate-500 font-mono">{log.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
