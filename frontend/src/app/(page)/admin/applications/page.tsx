'use client';

import React, { useState, useEffect } from 'react';
import {
  FileCheck2,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  FileText,
  User,
  MapPin,
  Calendar,
  X,
  AlertCircle,
  RefreshCw,
  Award,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
import { useDebounce } from '@/hooks/useDebounce';
import { mockApi } from '@/services/mockApi';
import { ServiceApplication, ApplicationStatus } from '@/types';

export default function AdminApplicationsPage() {
  const { language } = useApp();
  const { user } = useAuth();

  const [applications, setApplications] = useState<ServiceApplication[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 200);
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Inspection modal & error feedback
  const [selectedApp, setSelectedApp] = useState<ServiceApplication | null>(null);
  const [actionRemarks, setActionRemarks] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [loadError, setLoadError] = useState('');
  const [actionError, setActionError] = useState('');

  const loadData = async () => {
    setLoading(true);
    setLoadError('');
    try {
      const apps = await mockApi.getApplications();
      setApplications(apps);
    } catch {
      setLoadError(
        language === 'bn'
          ? 'আবেদনের তালিকা লোড করা যায়নি। অনুগ্রহ করে আবার চেষ্টা করুন।'
          : 'Unable to load applications right now. Please retry.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    mockApi
      .getApplications()
      .then((apps) => {
        if (!active) return;
        setApplications(apps);
        setLoadError('');
        setLoading(false);
      })
      .catch(() => {
        if (!active) return;
        setLoadError(
          language === 'bn'
            ? 'আবেদনের তালিকা লোড করা যায়নি। অনুগ্রহ করে আবার চেষ্টা করুন।'
            : 'Unable to load applications right now. Please retry.'
        );
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [language]);

  const filteredApps = applications.filter((app) => {
    const q = debouncedSearchQuery.toLowerCase();
    const matchesSearch =
      app.referenceId.toLowerCase().includes(q) ||
      app.applicantName.toLowerCase().includes(q) ||
      app.nid.includes(debouncedSearchQuery) ||
      (app.businessName && app.businessName.toLowerCase().includes(q));

    const matchesType = typeFilter === 'all' || app.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;

    return matchesSearch && matchesType && matchesStatus;
  });

  const handleUpdateStatus = async (status: ApplicationStatus) => {
    if (!selectedApp) return;
    setIsUpdating(true);
    setActionError('');
    setActionSuccess(null);
    try {
      const reviewer = user?.nameEn || 'Authorized Scrutiny Officer';
      const updated = await mockApi.updateApplicationStatus(selectedApp.id, status, reviewer);
      if (updated) {
        setSelectedApp(updated);
        setApplications((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
        setActionSuccess(
          language === 'bn'
            ? `আবেদনের অবস্থা সফলভাবে আপডেট করা হয়েছে: ${status}`
            : `Application updated to ${status}`
        );
      }
    } catch {
      setActionError(
        language === 'bn'
          ? 'আবেদনের অবস্থা পরিবর্তন করা যায়নি। অনুগ্রহ করে আবার চেষ্টা করুন।'
          : 'Unable to update application status. Please try again.'
      );
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-emerald-50 text-[#006A4E] text-xs font-semibold uppercase tracking-wider mb-2 border border-emerald-200">
              <FileCheck2 className="w-3.5 h-3.5" />
              {language === 'bn' ? 'আবেদন যাচাই ও অনুমোদন' : 'Application Scrutiny & Approval'}
            </div>
            <h1 className="text-2xl font-bold text-slate-900">
              {language === 'bn' ? 'নাগরিক সেবা আবেদন পরীক্ষণ ডেক্স' : 'Citizen Applications Review Console'}
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              {language === 'bn'
                ? 'নাগরিকদের দাখিলকৃত আবেদন, জাতীয় পরিচয়পত্র ও প্রয়োজনীয় কাগজপত্র যাচাই করে অনুমোদন বা বাতিল করুন।'
                : 'Scrutinize citizen applications, inspect statutory document attachments, and issue digital approvals.'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadData}
              className="inline-flex items-center gap-2 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              {language === 'bn' ? 'রিফ্রেশ' : 'Refresh'}
            </button>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                language === 'bn'
                  ? 'রেফারেন্স আইডি, নাম বা এনআইডি...'
                  : 'Search by reference ID, name, NID...'
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
              <option value="all">{language === 'bn' ? 'সকল সেবার ধরন' : 'All Service Types'}</option>
              <option value="trade_license">{language === 'bn' ? 'ট্রেড লাইসেন্স' : 'Trade License'}</option>
              <option value="citizen_certificate">{language === 'bn' ? 'নাগরিকত্ব সনদ' : 'Citizenship Certificate'}</option>
              <option value="birth_certificate">{language === 'bn' ? 'জন্ম নিবন্ধন' : 'Birth Registration'}</option>
              <option value="road_digging">{language === 'bn' ? 'সড়ক খনন অনুমতি' : 'Road Digging Permit'}</option>
            </select>
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006A4E]"
            >
              <option value="all">{language === 'bn' ? 'সকল স্ট্যাটাস' : 'All Statuses'}</option>
              <option value="pending">{language === 'bn' ? 'পেন্ডিং / নতুন' : 'Pending'}</option>
              <option value="under_review">{language === 'bn' ? 'যাচাইাধীন' : 'Under Review'}</option>
              <option value="approved">{language === 'bn' ? 'অনুমোদিত' : 'Approved'}</option>
              <option value="rejected">{language === 'bn' ? 'বাতিল' : 'Rejected'}</option>
            </select>
          </div>
        </div>

        <div className="text-xs text-slate-500 pt-2 border-t border-slate-100">
          {language === 'bn' ? 'প্রদর্শিত আবেদন সংখ্যা:' : 'Total Applications Found:'}{' '}
          <strong className="text-slate-800">{filteredApps.length}</strong>
        </div>
      </div>

      {(loadError || actionError) && (
        <div
          role="alert"
          className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800"
        >
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-[#C81E1E] shrink-0" aria-hidden="true" />
            <span>{loadError || actionError}</span>
          </div>
          {loadError && (
            <button
              type="button"
              onClick={loadData}
              className="min-h-[44px] px-3 py-1.5 rounded-lg bg-white border border-rose-200 hover:bg-rose-100 text-xs font-semibold text-rose-900 cursor-pointer transition-colors"
            >
              {language === 'bn' ? 'আবার চেষ্টা করুন' : 'Retry'}
            </button>
          )}
        </div>
      )}

      {/* Applications Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600 text-xs uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="p-3.5">{language === 'bn' ? 'রেফারেন্স আইডি' : 'Reference ID'}</th>
                <th className="p-3.5">{language === 'bn' ? 'আবেদনকারী / প্রতিষ্ঠান' : 'Applicant / Business'}</th>
                <th className="p-3.5">{language === 'bn' ? 'সেবার ধরন' : 'Service Type'}</th>
                <th className="p-3.5">{language === 'bn' ? 'ফি ও পেমেন্ট' : 'Fee & Payment'}</th>
                <th className="p-3.5">{language === 'bn' ? 'অবস্থা' : 'Status'}</th>
                <th className="p-3.5">{language === 'bn' ? 'দাখিলের তারিখ' : 'Submitted Date'}</th>
                <th className="p-3.5 text-right">{language === 'bn' ? 'কার্যক্রম' : 'Action'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredApps.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-500 text-sm">
                    {language === 'bn'
                      ? 'কোনো আবেদন পাওয়া যায়নি।'
                      : 'No applications match criteria.'}
                  </td>
                </tr>
              ) : (
                filteredApps.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/60 transition">
                    <td className="p-3.5">
                      <div className="font-mono font-bold text-slate-900 text-xs">
                        {app.referenceId}
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {language === 'bn' ? 'এনআইডি:' : 'NID:'} {app.nid}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <div className="font-semibold text-slate-900">
                        {app.applicantName}
                      </div>
                      {app.businessName && (
                        <div className="text-xs text-slate-500 truncate max-w-xs">
                          {app.businessName}
                        </div>
                      )}
                      <div className="text-[11px] text-slate-400">
                        {language === 'bn' ? `ওয়ার্ড ${app.wardNumber}` : `Ward ${app.wardNumber}`}
                      </div>
                    </td>
                    <td className="p-3.5">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 capitalize">
                        {language === 'bn'
                          ? app.type === 'trade_license'
                            ? 'ট্রেড লাইসেন্স'
                            : app.type === 'citizen_certificate'
                              ? 'নাগরিকত্ব সনদ'
                              : app.type === 'birth_certificate'
                                ? 'জন্ম নিবন্ধন'
                                : 'সড়ক খনন অনুমতি'
                          : app.type.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <div className="font-bold text-slate-900 text-xs">
                        ৳ {app.feeBdt.toLocaleString('en-US')}
                      </div>
                      <span className="text-[10px] font-semibold text-emerald-700 uppercase">
                        {language === 'bn'
                          ? app.paymentStatus === 'paid' ? 'পরিশোধিত' : 'অপেক্ষমাণ'
                          : app.paymentStatus}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                          app.status === 'approved'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : app.status === 'rejected'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {language === 'bn'
                          ? app.status === 'approved'
                            ? 'অনুমোদিত'
                            : app.status === 'rejected'
                              ? 'বাতিল'
                              : app.status === 'under_review'
                                ? 'যাচাইাধীন'
                                : 'অপেক্ষমাণ'
                          : app.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="p-3.5 text-xs text-slate-500 font-mono">
                      {app.submittedAt}
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => {
                          setSelectedApp(app);
                          setActionSuccess(null);
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        {language === 'bn' ? 'যাচাই' : 'Scrutinize'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Scrutiny Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                  {selectedApp.referenceId}
                </span>
                <h2 className="text-xl font-bold text-slate-900 mt-1 capitalize">
                  {language === 'bn'
                    ? `${
                        selectedApp.type === 'trade_license'
                          ? 'ট্রেড লাইসেন্স'
                          : selectedApp.type === 'citizen_certificate'
                            ? 'নাগরিকত্ব সনদ'
                            : selectedApp.type === 'birth_certificate'
                              ? 'জন্ম নিবন্ধন'
                              : 'সড়ক খনন অনুমতি'
                      } আবেদন`
                    : `${selectedApp.type.replace('_', ' ')} Application`}
                </h2>
              </div>
              <button
                onClick={() => setSelectedApp(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {actionSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#006A4E] shrink-0" />
                <span>{actionSuccess}</span>
              </div>
            )}

            {/* Applicant Details */}
            <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-sm">
              <div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {language === 'bn' ? 'আবেদনকারী' : 'Applicant Name'}
                </div>
                <div className="font-semibold text-slate-900">{selectedApp.applicantName}</div>
                <div className="text-xs text-slate-500 font-mono mt-1">
                  {language === 'bn' ? 'এনআইডি:' : 'NID:'} {selectedApp.nid}
                </div>
                <div className="text-xs text-slate-500 font-mono">
                  {language === 'bn' ? 'ফোন:' : 'Phone:'} {selectedApp.phone}
                </div>
              </div>

              <div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {language === 'bn' ? 'ঠিকানা ও ওয়ার্ড' : 'Address & Ward'}
                </div>
                <div className="font-semibold text-slate-900">
                  {language === 'bn' ? `ওয়ার্ড ${selectedApp.wardNumber}` : `Ward ${selectedApp.wardNumber}`}
                </div>
                <div className="text-xs text-slate-600 mt-1">{selectedApp.address}</div>
                <div className="text-xs text-emerald-700 font-bold mt-1">
                  {language === 'bn'
                    ? `নির্ধারিত ফি: ৳ ${selectedApp.feeBdt} (পরিশোধিত)`
                    : `Statutory Fee: ৳ ${selectedApp.feeBdt} (Paid)`}
                </div>
              </div>
            </div>

            {/* Document Checklist Inspection */}
            <div>
              <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                {language === 'bn' ? 'সংযুক্ত নথিপত্র ও প্রমাণাদি' : 'Attached Statutory Documents'}
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 bg-white text-xs">
                  <div className="flex items-center gap-2 font-medium text-slate-800">
                    <CheckCircle2 className="w-4 h-4 text-[#006A4E]" />
                    <span>
                      {language === 'bn'
                        ? 'জাতীয় পরিচয়পত্রের কপি (উভয় পৃষ্ঠা)'
                        : 'National ID Card Copy (Front & Back)'}
                    </span>
                  </div>
                  <span className="text-emerald-700 font-semibold">
                    {language === 'bn' ? 'যাচাইকৃত এনআইডি' : 'Verified NID Gate'}
                  </span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 bg-white text-xs">
                  <div className="flex items-center gap-2 font-medium text-slate-800">
                    <CheckCircle2 className="w-4 h-4 text-[#006A4E]" />
                    <span>
                      {language === 'bn'
                        ? 'ওয়ার্ড নাগরিকত্ব / হোল্ডিং ট্যাক্স রসিদ'
                        : 'Ward Residency / Holding Tax Receipt'}
                    </span>
                  </div>
                  <span className="text-emerald-700 font-semibold">
                    {language === 'bn' ? 'সংযুক্ত' : 'Attached'}
                  </span>
                </div>
                {selectedApp.businessName && (
                  <div className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 bg-white text-xs">
                    <div className="flex items-center gap-2 font-medium text-slate-800">
                      <CheckCircle2 className="w-4 h-4 text-[#006A4E]" />
                      <span>
                        {language === 'bn'
                          ? 'দোকান ভাড়ার চুক্তিপত্র / দলিল'
                          : 'Rent Agreement / Commercial Tenancy Deed'}
                      </span>
                    </div>
                    <span className="text-emerald-700 font-semibold">
                      {language === 'bn' ? 'সংযুক্ত' : 'Attached'}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Remarks input */}
            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                {language === 'bn' ? 'কর্মকর্তার মন্তব্য / রিমার্কস' : 'Official Remarks & Reason'}
              </label>
              <textarea
                rows={2}
                value={actionRemarks}
                onChange={(e) => setActionRemarks(e.target.value)}
                placeholder={
                  language === 'bn'
                    ? 'অনুমোদন বা বাতিলের কারণ লিখুন...'
                    : 'Enter verification remarks or reason for rejection...'
                }
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006A4E]"
              />
            </div>

            {/* Approval / Rejection Action buttons */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                disabled={isUpdating}
                onClick={() => handleUpdateStatus('rejected')}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-rose-600 text-white text-xs font-semibold rounded-lg hover:bg-rose-700 transition"
              >
                <XCircle className="w-4 h-4" />
                {language === 'bn' ? 'আবেদন বাতিল' : 'Reject Application'}
              </button>

              <button
                type="button"
                disabled={isUpdating}
                onClick={() => handleUpdateStatus('under_review')}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-600 text-white text-xs font-semibold rounded-lg hover:bg-amber-700 transition"
              >
                <Clock className="w-4 h-4" />
                {language === 'bn' ? 'পুনঃযাচাইাধীন' : 'Mark Under Review'}
              </button>

              <button
                type="button"
                disabled={isUpdating}
                onClick={() => handleUpdateStatus('approved')}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#006A4E] text-white text-xs font-semibold rounded-lg hover:bg-[#00523c] transition shadow-sm"
              >
                <CheckCircle2 className="w-4 h-4" />
                {language === 'bn' ? 'অনুমোদন ও সার্টিফিকেট ইস্যু' : 'Approve & Issue Certificate'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
