'use client';

import React, { Suspense, useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  MapPin,
  Calendar,
  Building2,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { mockApi } from '@/services/mockApi';
import { Complaint, VerificationResult } from '@/types';

function TrackContent() {
  const { language } = useApp();
  const searchParams = useSearchParams();
  const initialId = searchParams.get('id') || '';

  const [queryId, setQueryId] = useState(initialId);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [appResult, setAppResult] = useState<VerificationResult | null>(null);
  const [complaintResult, setComplaintResult] = useState<Complaint | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const sampleIds = ['DSCC-TL-2026-4108', 'DSCC-CERT-2026-1094', 'CMP-2026-8801'];

  const handleTrack = useCallback(
    async (targetId: string) => {
      const clean = targetId.trim().toUpperCase();
      if (!clean) return;

      setLoading(true);
      setSearched(true);
      setErrorMsg('');
      setAppResult(null);
      setComplaintResult(null);

      try {
        if (clean.startsWith('CMP-')) {
          const cmp = await mockApi.getComplaintByTrackingId(clean);
          if (cmp) {
            setComplaintResult(cmp);
          } else {
            setErrorMsg(
              language === 'bn'
                ? 'এই ট্র্যাকিং নম্বরের কোনো অভিযোগ পাওয়া যায়নি।'
                : 'No civic grievance found matching this tracking ID.'
            );
          }
        } else {
          const doc = await mockApi.verifyDocumentById(clean);
          if (doc) {
            setAppResult(doc);
          } else {
            setErrorMsg(
              language === 'bn'
                ? 'এই রেফারেন্স নম্বরের কোনো আবেদন বা রেকর্ড পাওয়া যায়নি।'
                : 'No application or statutory record found matching this reference ID.'
            );
          }
        }
      } catch (e) {
        console.error(e);
        setErrorMsg(
          language === 'bn'
            ? 'তথ্য অনুসন্ধানে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।'
            : 'Unable to query status at this moment. Please try again.'
        );
      } finally {
        setLoading(false);
      }
    },
    [language]
  );

  useEffect(() => {
    if (!initialId) return;
    let active = true;
    const clean = initialId.trim().toUpperCase();
    if (!clean) return;

    if (clean.startsWith('CMP-')) {
      mockApi.getComplaintByTrackingId(clean).then((cmp) => {
        if (!active) return;
        if (cmp) {
          setComplaintResult(cmp);
        } else {
          setErrorMsg(
            language === 'bn'
              ? 'এই ট্র্যাকিং নম্বরের কোনো অভিযোগ পাওয়া যায়নি।'
              : 'No civic grievance found matching this tracking ID.'
          );
        }
        setSearched(true);
      });
    } else {
      mockApi.verifyDocumentById(clean).then((doc) => {
        if (!active) return;
        if (doc) {
          setAppResult(doc);
        } else {
          setErrorMsg(
            language === 'bn'
              ? 'এই রেফারেন্স নম্বরের কোনো আবেদন বা রেকর্ড পাওয়া যায়নি।'
              : 'No application or statutory record found matching this reference ID.'
          );
        }
        setSearched(true);
      });
    }

    return () => {
      active = false;
    };
  }, [initialId, language]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Page Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#006A4E] bg-[#ECFDF5] border border-emerald-200 px-3 py-1 rounded-full mb-3">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>{language === 'bn' ? 'উন্মুক্ত নাগরিক ট্র্যাকার' : 'Public Status Tracker'}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B2545] tracking-tight">
          {language === 'bn'
            ? 'আবেদন ও অভিযোগের বর্তমান অবস্থা জানুন'
            : 'Track Application & Civic Grievance Status'}
        </h1>
        <p className="mt-2 text-sm text-[#4B5563] max-w-xl mx-auto">
          {language === 'bn'
            ? 'কোনো প্রকার লগইন ছাড়াই আপনার আবেদনের রেফারেন্স নম্বর বা অভিযোগের ট্র্যাকিং আইডি দিয়ে সর্বশেষ অগ্রগতি যাচাই করুন।'
            : 'Check the real-time public status of any submitted application or civic report without logging in.'}
        </p>
      </div>

      {/* Search Input Box */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-sm mb-8">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleTrack(queryId);
          }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={queryId}
              onChange={(e) => setQueryId(e.target.value)}
              placeholder={
                language === 'bn'
                  ? 'উদা: DSCC-TL-2026-4108 অথবা CMP-2026-8801'
                  : 'e.g. DSCC-TL-2026-4108 or CMP-2026-8801'
              }
              className="w-full pl-10 pr-4 py-3 text-sm bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#006A4E] focus:bg-white transition"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !queryId.trim()}
            className="px-6 py-3 bg-[#006A4E] text-white text-sm font-semibold rounded-xl hover:bg-[#00523C] transition shadow-xs disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Search className="w-4 h-4" />
            )}
            <span>{language === 'bn' ? 'অবস্থা অনুসন্ধান' : 'Track Status'}</span>
          </button>
        </form>

        {/* Sample IDs */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs text-slate-500">
          <span>{language === 'bn' ? 'নমুনা আইডি দিয়ে দেখুন:' : 'Try sample IDs:'}</span>
          {sampleIds.map((sample) => (
            <button
              key={sample}
              type="button"
              onClick={() => {
                setQueryId(sample);
                handleTrack(sample);
              }}
              className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 font-mono text-[11px] hover:bg-[#ECFDF5] hover:text-[#006A4E] transition border border-slate-200"
            >
              {sample}
            </button>
          ))}
        </div>
      </div>

      {/* Error State */}
      {errorMsg && (
        <div className="p-5 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3 text-rose-800 text-sm mb-6">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <div className="font-semibold">{errorMsg}</div>
            <p className="text-xs text-rose-700 mt-1">
              {language === 'bn'
                ? 'আইডি নম্বরটি সঠিকভাবে প্রবেশ করিয়েছেন কিনা অনুগ্রহ করে যাচাই করুন।'
                : 'Please verify the ID format and ensure all characters are correct.'}
            </p>
          </div>
        </div>
      )}

      {/* Result 1: Service Application Status */}
      {appResult && (
        <div className="bg-white rounded-2xl border border-emerald-200 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
            <div>
              <span className="font-mono text-xs font-bold text-[#006A4E] bg-[#ECFDF5] px-2.5 py-1 rounded-md">
                {appResult.referenceId}
              </span>
              <h2 className="text-xl font-bold text-slate-900 mt-2">
                {language === 'bn' ? appResult.documentTypeBn : appResult.documentTypeEn}
              </h2>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider self-start sm:self-auto ${
                appResult.status === 'VERIFIED'
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              {appResult.status}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold block">
                {language === 'bn' ? 'আবেদনকারী / স্বত্বাধিকারী' : 'Applicant / Owner'}
              </span>
              <span className="font-semibold text-slate-800 mt-0.5 block">{appResult.ownerName}</span>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold block">
                {language === 'bn' ? 'ওয়ার্ড ও সংশ্লিষ্ট কর্তৃপক্ষ' : 'Ward & Authority'}
              </span>
              <span className="font-semibold text-slate-800 mt-0.5 block">
                Ward {appResult.wardNumber} · {language === 'bn' ? appResult.authorityBn : appResult.authorityEn}
              </span>
            </div>
          </div>

          {/* Workflow Stage */}
          <div className="pt-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-3">
              {language === 'bn' ? 'সেবা অগ্রগতি পর্যায়' : 'Service Progress Pipeline'}
            </span>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 font-semibold">
                ✓ {language === 'bn' ? 'আবেদন গৃহীত' : 'Submitted'}
              </div>
              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 font-semibold">
                ✓ {language === 'bn' ? 'যাচাই সম্পন্ন' : 'Verified'}
              </div>
              <div
                className={`p-3 rounded-lg font-semibold border ${
                  appResult.status === 'VERIFIED'
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                    : 'bg-amber-50 border-amber-200 text-amber-800'
                }`}
              >
                {appResult.status === 'VERIFIED'
                  ? language === 'bn'
                    ? '✓ সনদ অনুমোদিত'
                    : '✓ Approved'
                  : language === 'bn'
                  ? '⌛ প্রক্রিয়াকরণ চলছে'
                  : '⌛ Under Review'}
              </div>
            </div>
          </div>

          <div className="p-4 bg-[#ECFDF5] border border-emerald-200 rounded-xl flex items-center justify-between">
            <span className="text-xs text-[#006A4E] font-medium">
              {language === 'bn'
                ? 'পূর্ণাঙ্গ সার্টিফিকেট ডাউনলোড বা আবেদন সংক্রান্ত বিস্তারিত দেখতে নাগরিক পোর্টালে লগইন করুন।'
                : 'Log in to the Citizen Portal to download the official certificate or view private notices.'}
            </span>
            <Link
              href="/login"
              className="text-xs font-bold text-[#006A4E] hover:underline shrink-0 inline-flex items-center gap-1"
            >
              <span>{language === 'bn' ? 'লগইন করুন' : 'Login'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}

      {/* Result 2: Civic Complaint Status */}
      {complaintResult && (
        <div className="bg-white rounded-2xl border border-amber-200 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
            <div>
              <span className="font-mono text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-md">
                {complaintResult.trackingId}
              </span>
              <h2 className="text-xl font-bold text-slate-900 mt-2">
                {complaintResult.title}
              </h2>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider self-start sm:self-auto ${
                complaintResult.status === 'resolved'
                  ? 'bg-emerald-100 text-emerald-800'
                  : complaintResult.status === 'in_progress'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              {complaintResult.status.replace('_', ' ')}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold block">
                {language === 'bn' ? 'স্থান ও ওয়ার্ড' : 'Location & Ward'}
              </span>
              <span className="font-semibold text-slate-800 mt-0.5 block">
                Ward {complaintResult.wardNumber} · {complaintResult.locationLabel}
              </span>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold block">
                {language === 'bn' ? 'দায়িত্বপ্রাপ্ত বিভাগ' : 'Assigned Department'}
              </span>
              <span className="font-semibold text-slate-800 mt-0.5 block">
                {language === 'bn' ? complaintResult.departmentBn : complaintResult.departmentEn}
              </span>
            </div>
          </div>

          {complaintResult.resolutionNote && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900">
              <span className="font-bold block mb-1">
                {language === 'bn' ? 'ফিল্ড টিমের সমাধানের বিবরণ:' : 'Field Inspection & Resolution Note:'}
              </span>
              {complaintResult.resolutionNote}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function PublicStatusTrackerPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-4xl mx-auto px-4 py-16 text-center text-sm text-slate-500">
          Loading Public Status Tracker...
        </div>
      }
    >
      <TrackContent />
    </Suspense>
  );
}
