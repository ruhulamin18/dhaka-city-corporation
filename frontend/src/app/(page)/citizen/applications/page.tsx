'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
import { mockApi } from '@/services/mockApi';
import type { ApplicationStatus, ApplicationType, ServiceApplication } from '@/types';
import { ArrowUpRight, FileText, Plus, Search } from 'lucide-react';

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
      }).format(date);
}

function statusStyle(status: ApplicationStatus) {
  if (status === 'approved') return 'border-emerald-200 bg-emerald-50 text-emerald-800';
  if (status === 'rejected') return 'border-rose-200 bg-rose-50 text-rose-800';
  return 'border-amber-200 bg-amber-50 text-amber-900';
}

export default function CitizenApplicationsPage() {
  const { language } = useApp();
  const { user } = useAuth();
  const [applications, setApplications] = useState<ServiceApplication[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) return;
    let active = true;
    queueMicrotask(() => {
      if (active) setIsLoading(true);
    });
    mockApi.getApplications()
      .then((items) => {
        if (!active) return;
        setApplications(items.filter(
          (item) => item.citizenId === user.id || (Boolean(user.phone) && item.phone === user.phone)
        ));
        setError('');
      })
      .catch((loadError: unknown) => {
        if (active) {
          setError(loadError instanceof Error
            ? loadError.message
            : language === 'bn' ? 'আবেদন লোড করা যায়নি।' : 'Unable to load applications.');
        }
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, [user, language]);

  const filtered = useMemo(() => {
    const query = searchTerm.trim().toLocaleLowerCase();
    return applications.filter((application) =>
      `${application.referenceId} ${application.applicantName} ${application.businessName ?? ''} ${SERVICE_NAMES[application.type].en} ${SERVICE_NAMES[application.type].bn}`
        .toLocaleLowerCase()
        .includes(query)
    );
  }, [applications, searchTerm]);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <header className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-end sm:justify-between sm:p-6">
        <div>
          <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">
            {language === 'bn' ? 'আমার আবেদনসমূহ' : 'My applications'}
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            {language === 'bn'
              ? 'আপনার দাখিল করা আবেদন ও বর্তমান অবস্থা দেখুন।'
              : 'Review applications submitted from your account and their current status.'}
          </p>
        </div>
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
          <label className="relative min-w-0 flex-1 sm:w-72">
            <span className="sr-only">{language === 'bn' ? 'আবেদন খুঁজুন' : 'Search applications'}</span>
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder={language === 'bn' ? 'রেফারেন্স বা সেবা খুঁজুন' : 'Search reference or service'}
              className="min-h-11 w-full rounded-lg border border-slate-300 pl-9 pr-3 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#006A4E]"
            />
          </label>
          <Link
            href="/citizen/applications/new"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#006A4E] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#00523C]"
          >
            <Plus className="h-4 w-4" />
            {language === 'bn' ? 'নতুন আবেদন' : 'New application'}
          </Link>
        </div>
      </header>

      {error && <p role="alert" className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800">{error}</p>}

      {isLoading ? (
        <div role="status" className="rounded-xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-600">
          {language === 'bn' ? 'আবেদন লোড হচ্ছে...' : 'Loading applications...'}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center sm:p-12">
          <FileText className="mx-auto h-8 w-8 text-[#006A4E]" />
          <h2 className="mt-3 text-base font-semibold text-slate-900">
            {searchTerm
              ? language === 'bn' ? 'কোনো আবেদন মেলেনি' : 'No matching applications'
              : language === 'bn' ? 'এখনও কোনো আবেদন নেই' : 'No applications yet'}
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            {language === 'bn' ? 'নতুন সেবা আবেদন করলে সেটি এখানে দেখা যাবে।' : 'Applications you submit will appear here.'}
          </p>
          {!searchTerm && (
            <Link href="/citizen/applications/new" className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-lg bg-[#006A4E] px-4 text-sm font-semibold text-white hover:bg-[#00523C]">
              <Plus className="h-4 w-4" />
              {language === 'bn' ? 'আবেদন শুরু করুন' : 'Start an application'}
            </Link>
          )}
        </div>
      ) : (
        <>
          <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm md:block">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-xs font-semibold text-slate-600">
                  <tr>
                    <th scope="col" className="px-4 py-3">{language === 'bn' ? 'রেফারেন্স' : 'Reference'}</th>
                    <th scope="col" className="px-4 py-3">{language === 'bn' ? 'সেবা' : 'Service'}</th>
                    <th scope="col" className="px-4 py-3">{language === 'bn' ? 'দাখিলের তারিখ' : 'Submitted'}</th>
                    <th scope="col" className="px-4 py-3">{language === 'bn' ? 'ফি' : 'Fee'}</th>
                    <th scope="col" className="px-4 py-3">{language === 'bn' ? 'অবস্থা' : 'Status'}</th>
                    <th scope="col" className="px-4 py-3 text-right">{language === 'bn' ? 'ট্র্যাকিং' : 'Track'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map((application) => (
                    <tr key={application.id} className="transition-colors hover:bg-[#ECFDF5]">
                      <td className="whitespace-nowrap px-4 py-3 font-mono text-xs font-semibold text-slate-800">{application.referenceId}</td>
                      <td className="px-4 py-3 font-medium text-slate-800">{SERVICE_NAMES[application.type][language]}</td>
                      <td className="whitespace-nowrap px-4 py-3 text-slate-600">{formatDate(application.submittedAt, language)}</td>
                      <td className="whitespace-nowrap px-4 py-3 text-slate-700">৳{application.feeBdt.toLocaleString(language === 'bn' ? 'bn-BD' : 'en-IN')}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${statusStyle(application.status)}`}>
                          {STATUS_NAMES[application.status][language]}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Link href={`/citizen/tracking?id=${encodeURIComponent(application.referenceId)}`} className="inline-flex items-center gap-1 font-semibold text-[#006A4E] hover:underline">
                          {language === 'bn' ? 'দেখুন' : 'View'}
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-3 md:hidden">
            {filtered.map((application) => (
              <article key={application.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-[background-color,border-color,transform] duration-300 hover:-translate-y-0.5 hover:border-[#006A4E] hover:bg-[#ECFDF5] motion-reduce:transform-none">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-mono text-xs font-semibold text-[#006A4E]">{application.referenceId}</p>
                    <h2 className="mt-1 text-sm font-semibold text-slate-900">{SERVICE_NAMES[application.type][language]}</h2>
                  </div>
                  <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${statusStyle(application.status)}`}>
                    {STATUS_NAMES[application.status][language]}
                  </span>
                </div>
                <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-600">
                  <span>{formatDate(application.submittedAt, language)} · ৳{application.feeBdt.toLocaleString(language === 'bn' ? 'bn-BD' : 'en-IN')}</span>
                  <Link href={`/citizen/tracking?id=${encodeURIComponent(application.referenceId)}`} className="inline-flex items-center gap-1 font-semibold text-[#006A4E]">
                    {language === 'bn' ? 'ট্র্যাক' : 'Track'} <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
