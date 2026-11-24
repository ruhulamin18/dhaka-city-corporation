'use client';

import React, { Suspense, useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
import { mockApi } from '@/services/mockApi';
import type { ApplicationStatus, ApplicationType, ServiceApplication } from '@/types';
import { AlertCircle, CheckCircle2, Clock3, FileSearch, Loader2, Search } from 'lucide-react';

const SERVICE_NAMES: Record<ApplicationType, { bn: string; en: string }> = {
  trade_license: { bn: 'ট্রেড লাইসেন্স', en: 'Trade license' },
  birth_certificate: { bn: 'জন্ম নিবন্ধন', en: 'Birth registration' },
  citizen_certificate: { bn: 'নাগরিকত্ব সনদ', en: 'Citizenship certificate' },
  road_digging: { bn: 'সড়ক খনন অনুমতি', en: 'Road digging permit' },
};

const STATUS_NAMES: Record<ApplicationStatus, { bn: string; en: string }> = {
  pending: { bn: 'অপেক্ষমাণ', en: 'Pending' },
  under_review: { bn: 'পর্যালোচনাধীন', en: 'Under review' },
  approved: { bn: 'অনুমোদিত', en: 'Approved' },
  rejected: { bn: 'প্রত্যাখ্যাত', en: 'Rejected' },
};

function formatDate(value: string, language: 'bn' | 'en') {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat(language === 'bn' ? 'bn-BD' : 'en-US', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }).format(date);
}

function TrackingContent() {
  const { language } = useApp();
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const [queryId, setQueryId] = useState(searchParams.get('id') ?? '');
  const [application, setApplication] = useState<ServiceApplication | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const trackApplication = useCallback(async (reference: string) => {
    const clean = reference.trim().toLocaleLowerCase();
    if (!clean || !user?.phone) return;
    setIsLoading(true);
    setError('');
    setApplication(null);
    try {
      const applications = await mockApi.getApplications();
      const match = applications.find(
        (item) =>
          (item.citizenId === user.id || item.phone === user.phone) &&
          (item.referenceId.toLocaleLowerCase() === clean || item.id.toLocaleLowerCase() === clean)
      );
      if (!match) {
        setError(language === 'bn'
          ? 'এই রেফারেন্সে আপনার কোনো আবেদন পাওয়া যায়নি।'
          : 'No application for this reference was found in your account.');
        return;
      }
      setApplication(match);
    } catch (loadError: unknown) {
      setError(loadError instanceof Error
        ? loadError.message
        : language === 'bn' ? 'আবেদনের অবস্থা লোড করা যায়নি।' : 'Unable to load application status.');
    } finally {
      setIsLoading(false);
    }
  }, [language, user]);

  useEffect(() => {
    const reference = searchParams.get('id');
    if (!reference) return;
    queueMicrotask(() => {
      setQueryId(reference);
      void trackApplication(reference);
    });
  }, [searchParams, trackApplication]);

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void trackApplication(queryId);
  };

  const steps = application
    ? [
        {
          title: { bn: 'আবেদন দাখিল', en: 'Application submitted' },
          done: true,
          current: false,
        },
        {
          title: { bn: 'বিভাগীয় পর্যালোচনা', en: 'Department review' },
          done: application.status === 'approved' || application.status === 'rejected',
          current: application.status === 'pending' || application.status === 'under_review',
        },
        {
          title: application.status === 'rejected'
            ? { bn: 'প্রত্যাখ্যাত', en: 'Rejected' }
            : { bn: 'সিদ্ধান্ত', en: 'Decision' },
          done: application.status === 'approved' || application.status === 'rejected',
          current: false,
        },
      ]
    : [];

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <header className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm sm:p-8">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#ECFDF5] text-[#006A4E]">
          <FileSearch className="h-6 w-6" />
        </div>
        <h1 className="mt-3 text-xl font-bold text-slate-900 sm:text-2xl">
          {language === 'bn' ? 'আবেদনের অবস্থা ট্র্যাক করুন' : 'Track an application'}
        </h1>
        <p className="mx-auto mt-1 max-w-xl text-sm leading-6 text-slate-600">
          {language === 'bn'
            ? 'আপনার আবেদন রেফারেন্স লিখুন। এখানে শুধু আপনার অ্যাকাউন্টের আবেদন দেখানো হবে।'
            : 'Enter an application reference. Only applications associated with your account are shown.'}
        </p>
        <form onSubmit={handleSearch} className="mx-auto mt-5 flex max-w-xl flex-col gap-2 sm:flex-row">
          <label className="relative min-w-0 flex-1">
            <span className="sr-only">{language === 'bn' ? 'আবেদন রেফারেন্স' : 'Application reference'}</span>
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={queryId}
              onChange={(event) => setQueryId(event.target.value)}
              placeholder="DSCC-XX-2026-XXXX"
              required
              className="min-h-11 w-full rounded-lg border border-slate-300 pl-9 pr-3 font-mono text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#006A4E]"
            />
          </label>
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#006A4E] px-5 text-sm font-semibold text-white hover:bg-[#00523C] disabled:opacity-60"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin motion-reduce:animate-none" /> : <Search className="h-4 w-4" />}
            {language === 'bn' ? 'খুঁজুন' : 'Search'}
          </button>
        </form>
      </header>

      {error && (
        <div role="alert" className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {application ? (
        <article className="space-y-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <div className="flex flex-col gap-3 border-b border-slate-200 pb-5 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="font-mono text-sm font-bold text-[#006A4E]">{application.referenceId}</p>
              <h2 className="mt-1 text-lg font-bold text-slate-900">{SERVICE_NAMES[application.type][language]}</h2>
              <p className="mt-1 text-sm text-slate-600">
                {language === 'bn' ? 'দাখিলের তারিখ' : 'Submitted'}: {formatDate(application.submittedAt, language)}
              </p>
            </div>
            <span className={`inline-flex w-fit items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-semibold ${
              application.status === 'approved'
                ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                : application.status === 'rejected'
                  ? 'border-rose-200 bg-rose-50 text-rose-800'
                  : 'border-amber-200 bg-amber-50 text-amber-900'
            }`}>
              {application.status === 'approved' ? <CheckCircle2 className="h-4 w-4" /> : <Clock3 className="h-4 w-4" />}
              {STATUS_NAMES[application.status][language]}
            </span>
          </div>

          <ol className="space-y-5">
            {steps.map((step, index) => (
              <li key={step.title.en} className="flex items-start gap-3">
                <span className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                  step.done ? 'bg-[#006A4E] text-white' : step.current ? 'border-2 border-amber-500 bg-amber-50 text-amber-900' : 'bg-slate-100 text-slate-500'
                }`}>
                  {step.done ? <CheckCircle2 className="h-4 w-4" /> : index + 1}
                </span>
                <div>
                  <p className={`text-sm font-semibold ${step.current ? 'text-amber-900' : 'text-slate-900'}`}>{step.title[language]}</p>
                  {index === 0 && (
                    <p className="mt-0.5 text-xs text-slate-600">{formatDate(application.submittedAt, language)}</p>
                  )}
                  {index === 1 && step.current && (
                    <p className="mt-0.5 text-xs text-slate-600">
                      {language === 'bn' ? 'সিদ্ধান্তের আগে বিভাগীয় পর্যালোচনা প্রয়োজন।' : 'Department review is required before a decision.'}
                    </p>
                  )}
                  {index === 2 && application.reviewedAt && step.done && (
                    <p className="mt-0.5 text-xs text-slate-600">{formatDate(application.reviewedAt, language)}</p>
                  )}
                </div>
              </li>
            ))}
          </ol>

          {application.reviewedBy && (
            <p className="border-t border-slate-100 pt-4 text-sm text-slate-600">
              {language === 'bn' ? 'পর্যালোচনাকারী' : 'Reviewed by'}: {application.reviewedBy}
            </p>
          )}
        </article>
      ) : !isLoading && !error ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-600">
          {language === 'bn' ? 'ট্র্যাক করতে একটি আবেদন রেফারেন্স লিখুন।' : 'Enter an application reference to view its status.'}
        </div>
      ) : null}

      <div className="text-center">
        <Link href="/citizen/applications" className="text-sm font-semibold text-[#006A4E] hover:underline">
          {language === 'bn' ? 'আমার সব আবেদন দেখুন' : 'View all my applications'}
        </Link>
      </div>
    </div>
  );
}

export default function TrackingPage() {
  return (
    <Suspense fallback={<div role="status" className="p-8 text-center text-sm text-slate-600"><Loader2 className="mx-auto mb-2 h-6 w-6 animate-spin text-[#006A4E] motion-reduce:animate-none" />Loading...</div>}>
      <TrackingContent />
    </Suspense>
  );
}
