'use client';

import React, { useState } from 'react';
import {
  History,
  Search,
  Filter,
  Shield,
  Clock,
  User,
  Key,
  FileCheck2,
  AlertTriangle,
  Lock,
  Download,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';

interface AuditRecord {
  id: string;
  eventType: 'fee_change' | 'application_approval' | 'application_rejection' | 'complaint_assigned' | 'complaint_resolved' | 'auth_login';
  action: string;
  actor: string;
  actorRole: string;
  ipAddress: string;
  details: string;
  timestamp: string;
}

const SEEDED_AUDIT_LOGS: AuditRecord[] = [
  {
    id: 'AUD-9981',
    eventType: 'fee_change',
    action: 'Fee Schedule Update',
    actor: 'Farhana Yasmin, BCS',
    actorRole: 'Revenue Officer',
    ipAddress: '10.12.4.88 (GovNet)',
    details: 'Trade License base fee adjusted from ৳2500 to ৳3000 under Gazette GZ-089',
    timestamp: '2026-11-20 18:22:15',
  },
  {
    id: 'AUD-9980',
    eventType: 'application_approval',
    action: 'Application Approved & Certificate Issued',
    actor: 'Mayor & Chief Executive Office',
    actorRole: 'Super Admin',
    ipAddress: '10.10.1.2 (Nagar Bhaban)',
    details: 'Citizenship Certificate issued for Md. Ruhul Amin (NID: 1992269184723)',
    timestamp: '2026-11-20 17:40:02',
  },
  {
    id: 'AUD-9979',
    eventType: 'complaint_assigned',
    action: 'Field Inspector Assigned',
    actor: 'Eng. Tariqul Islam',
    actorRole: 'Ward 19 Officer',
    ipAddress: '10.14.19.12 (GovNet)',
    details: 'Assigned Karim Uddin Bhuiyan to Streetlight malfunction CMP-2026-9104',
    timestamp: '2026-11-20 16:15:30',
  },
  {
    id: 'AUD-9978',
    eventType: 'complaint_resolved',
    action: 'Civic Grievance Closed',
    actor: 'Eng. Tariqul Islam',
    actorRole: 'Ward 19 Officer',
    ipAddress: '10.14.19.12 (GovNet)',
    details: 'Pothole restoration verified with field after-photo on Road 11, Banani',
    timestamp: '2026-11-20 15:30:11',
  },
  {
    id: 'AUD-9977',
    eventType: 'auth_login',
    action: 'Administrative Access Login',
    actor: 'Md. Ruhul Amin',
    actorRole: 'Citizen Account',
    ipAddress: '103.145.24.11',
    details: 'Successful biometric NID authenticated session initiated',
    timestamp: '2026-11-20 14:02:44',
  },
];

export default function AdminAuditLogsPage() {
  const { language } = useApp();
  const [logs, setLogs] = useState<AuditRecord[]>(SEEDED_AUDIT_LOGS);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  const filtered = logs.filter((log) => {
    const matchesSearch =
      log.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.actor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = typeFilter === 'all' || log.eventType === typeFilter;

    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-[#ECFDF5] text-[#006A4E] text-xs font-semibold uppercase tracking-wider mb-2">
              <History className="w-3.5 h-3.5" />
              {language === 'bn' ? 'অডিট ও নিরাপত্তা রেকর্ড' : 'Cryptographic Audit & Security Ledger'}
            </div>
            <h1 className="text-2xl font-bold text-slate-900">
              {language === 'bn' ? 'প্রশাসনিক অডিট লগ ও ট্রেইল' : 'System Audit Trail & Security Logs'}
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              {language === 'bn'
                ? 'ফি পরিবর্তন, আবেদন অনুমোদন, কর্মকর্তা নিয়োগ ও প্রশাসনিক সিদ্ধান্তের অপরিবর্তনীয় রেকর্ড।'
                : 'Immutable record of statutory fee modifications, application scrutinies, and officer allocations.'}
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
                  ? 'অডিট আইডি, কর্মকর্তা, অ্যাকশন বা বিবরণ...'
                  : 'Search by audit ID, officer, action or details...'
              }
              className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006A4E]"
            />
          </div>

          <div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006A4E]"
            >
              <option value="all">{language === 'bn' ? 'সকল ঘটনা' : 'All Event Types'}</option>
              <option value="fee_change">Fee Changes</option>
              <option value="application_approval">Application Approvals</option>
              <option value="complaint_assigned">Officer Assignments</option>
              <option value="complaint_resolved">Grievance Resolutions</option>
              <option value="auth_login">Auth / Login</option>
            </select>
          </div>
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600 text-xs uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="p-3.5">Audit ID</th>
                <th className="p-3.5">Action & Event</th>
                <th className="p-3.5">Authorized Actor</th>
                <th className="p-3.5">IP Address</th>
                <th className="p-3.5">Event Details</th>
                <th className="p-3.5">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/60 transition">
                  <td className="p-3.5 font-mono font-bold text-slate-900 text-xs">
                    {log.id}
                  </td>
                  <td className="p-3.5">
                    <div className="font-semibold text-slate-900 text-xs">
                      {log.action}
                    </div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">
                      {log.eventType.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="p-3.5">
                    <div className="font-medium text-slate-800 text-xs">{log.actor}</div>
                    <div className="text-[10px] text-slate-400">{log.actorRole}</div>
                  </td>
                  <td className="p-3.5 font-mono text-xs text-slate-500">
                    {log.ipAddress}
                  </td>
                  <td className="p-3.5 text-xs text-slate-600 max-w-sm">
                    {log.details}
                  </td>
                  <td className="p-3.5 font-mono text-xs text-slate-500">
                    {log.timestamp}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
