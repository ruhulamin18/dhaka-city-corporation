'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
import { mockApi } from '@/services/mockApi';
import { PaymentService } from '@/services/payment/payment-service';
import type { ApplicationType, Complaint, ComplaintCategory, ServiceApplication } from '@/types';
import type { PaymentTransaction } from '@/types/payment';
import {
  AlertCircle,
  AlertTriangle,
  ArrowUpRight,
  CheckCircle2,
  Clock3,
  CreditCard,
  Droplets,
  FilePlus2,
  FileText,
  Lightbulb,
  MapPin,
  SearchCheck,
  Trash2,
} from 'lucide-react';

const SERVICE_NAMES: Record<ApplicationType, { bn: string; en: string }> = {
  trade_license: { bn: 'ট্রেড লাইসেন্স', en: 'Trade license' },
  birth_certificate: { bn: 'জন্ম নিবন্ধন', en: 'Birth registration' },
  citizen_certificate: { bn: 'নাগরিকত্ব সনদ', en: 'Citizenship certificate' },
  road_digging: { bn: 'সড়ক খনন অনুমতি', en: 'Road digging permit' },
};

const REPORT_CATEGORIES: {
  id: ComplaintCategory;
  title: { bn: string; en: string };
  icon: typeof AlertTriangle;
}[] = [
  { id: 'road_damage', title: { bn: 'রাস্তা ও গর্ত', en: 'Roads & potholes' }, icon: MapPin },
  { id: 'drainage', title: { bn: 'ড্রেন ও জলাবদ্ধতা', en: 'Drainage & waterlogging' }, icon: Droplets },
  { id: 'waste', title: { bn: 'ময়লা-আবর্জনা', en: 'Waste & garbage' }, icon: Trash2 },
  { id: 'street_light', title: { bn: 'সড়কবাতি', en: 'Streetlights' }, icon: Lightbulb },
  { id: 'other', title: { bn: 'অন্যান্য সমস্যা', en: 'Other issues' }, icon: AlertTriangle },
];

interface ActivityEntry {
  id: string;
  title: string;
  reference: string;
  date: string;
  href: string;
  kind: 'application' | 'complaint' | 'payment';
}

function formatDate(value: string, language: 'bn' | 'en') {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat(language === 'bn' ? 'bn-BD' : 'en-US', { dateStyle: 'medium' }).format(date);
}

export default function CitizenDashboardPage() {
  const { language } = useApp();
  const { user } = useAuth();
  const [applications, setApplications] = useState<ServiceApplication[]>([]);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [payments, setPayments] = useState<PaymentTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const citizenName = language === 'bn'
    ? user?.nameBn || user?.nameEn || 'নাগরিক'
    : user?.nameEn || 'Citizen';
  const citizenWard = user?.wardNumber ?? 0;

  useEffect(() => {
    if (!user) return;
    let active = true;
    queueMicrotask(() => {
      if (active) setIsLoading(true);
    });
    Promise.all([mockApi.getApplications(), mockApi.getComplaints()])
      .then(([allApplications, allComplaints]) => {
        if (!active) return;
        setApplications(allApplications.filter(
          (item) => item.citizenId === user.id || (Boolean(user.phone) && item.phone === user.phone)
        ));
        setComplaints(allComplaints.filter(
          (item) =>
            item.citizenId === user.id ||
            (Boolean(user.phone) && item.phone === user.phone)
        ));
        setPayments(PaymentService.getAllTransactions().filter((item) => item.userId === user.id));
        setError('');
      })
      .catch((loadError: unknown) => {
        if (active) {
          setError(loadError instanceof Error
            ? loadError.message
            : language === 'bn' ? 'ড্যাশবোর্ডের তথ্য লোড করা যায়নি।' : 'Unable to load dashboard data.');
        }
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, [user, language]);

  const activity = useMemo<ActivityEntry[]>(() => {
    const applicationEntries = applications.map((item) => ({
      id: item.id,
      title: `${SERVICE_NAMES[item.type][language]} · ${
        item.status === 'approved'
          ? language === 'bn' ? 'অনুমোদিত' : 'Approved'
          : item.status === 'rejected'
            ? language === 'bn' ? 'প্রত্যাখ্যাত' : 'Rejected'
            : language === 'bn' ? 'পর্যালোচনাধীন' : 'In progress'
      }`,
      reference: item.referenceId,
      date: item.submittedAt,
      href: `/citizen/tracking?id=${encodeURIComponent(item.referenceId)}`,
      kind: 'application' as const,
    }));
    const complaintEntries = complaints.map((item) => ({
      id: item.id,
      title: language === 'bn' ? 'নাগরিক সমস্যা রিপোর্ট জমা হয়েছে' : 'Civic issue report submitted',
      reference: item.trackingId,
      date: item.createdAt,
      href: '/citizen/complaints',
      kind: 'complaint' as const,
    }));
    const paymentEntries = payments.map((item) => ({
      id: item.id,
      title: item.serviceName[language],
      reference: item.transactionReference,
      date: item.completedAt ?? item.initiatedAt,
      href: '/online-payment/history',
      kind: 'payment' as const,
    }));
    return [...applicationEntries, ...complaintEntries, ...paymentEntries]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  }, [applications, complaints, language, payments]);

  const pendingApplications = applications.filter((item) => item.status === 'pending' || item.status === 'under_review').length;
  const resolvedComplaints = complaints.filter((item) => item.status === 'resolved').length;
  const recentApplications = applications.slice(0, 5);

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <header className="rounded-2xl bg-[#006A4E] p-5 text-white shadow-sm sm:p-7">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-emerald-100">
              {language === 'bn' ? `ওয়ার্ড ${citizenWard} নাগরিক পোর্টাল` : `Citizen portal · Ward ${citizenWard}`}
            </p>
            <h1 className="mt-1 text-2xl font-bold sm:text-3xl">
              {language === 'bn' ? `স্বাগতম, ${citizenName}` : `Welcome, ${citizenName}`}
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-emerald-50">
              {language === 'bn'
                ? 'আপনার সেবা আবেদন, পেমেন্ট এবং এলাকার সমস্যা রিপোর্ট এক জায়গা থেকে পরিচালনা করুন।'
                : 'Manage service applications, payments, and local issue reports in one place.'}
            </p>
          </div>
          <Link href="/citizen/profile" className="inline-flex min-h-11 items-center justify-center rounded-lg border border-white/40 px-4 text-sm font-semibold text-white hover:bg-white/10">
            {language === 'bn' ? 'প্রোফাইল দেখুন' : 'View profile'}
          </Link>
        </div>
      </header>

      {error && <p role="alert" className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800"><AlertCircle className="mr-2 inline h-4 w-4" />{error}</p>}

      <section aria-label={language === 'bn' ? 'সারসংক্ষেপ' : 'Overview'} className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          {
            label: { bn: 'মোট আবেদন', en: 'Applications' },
            value: applications.length,
            icon: FileText,
          },
          {
            label: { bn: 'পর্যালোচনাধীন', en: 'Awaiting decision' },
            value: pendingApplications,
            icon: Clock3,
          },
          {
            label: { bn: 'নাগরিক রিপোর্ট', en: 'Issue reports' },
            value: complaints.length,
            icon: AlertTriangle,
          },
          {
            label: { bn: 'সমাধানকৃত সমস্যা', en: 'Issues resolved' },
            value: resolvedComplaints,
            icon: CheckCircle2,
          },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <article key={item.label.en} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-[background-color,border-color,transform] duration-300 hover:-translate-y-0.5 hover:border-[#006A4E] hover:bg-[#ECFDF5] motion-reduce:transform-none sm:p-5">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#ECFDF5] text-[#006A4E]">
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-xs font-medium text-slate-600">{item.label[language]}</p>
                  <p className="mt-0.5 text-xl font-bold tabular-nums text-slate-900">
                    {isLoading ? '—' : item.value.toLocaleString(language === 'bn' ? 'bn-BD' : 'en-US')}
                  </p>
                </div>
              </div>
            </article>
          );
        })}
      </section>

      <section>
        <h2 className="mb-3 text-base font-semibold text-slate-900">
          {language === 'bn' ? 'দ্রুত কার্যক্রম' : 'Quick actions'}
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { href: '/citizen/applications/new', title: { bn: 'সেবা আবেদন', en: 'Apply for a service' }, icon: FilePlus2 },
            { href: '/citizen/tracking', title: { bn: 'আবেদন ট্র্যাকিং', en: 'Track an application' }, icon: SearchCheck },
            { href: '/online-payment', title: { bn: 'পেমেন্ট ও ফি', en: 'Payments & fees' }, icon: CreditCard },
            { href: '/citizen/complaints', title: { bn: 'আমার রিপোর্ট', en: 'My reports' }, icon: FileText },
          ].map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.href}
                href={action.href}
                className="group flex min-h-20 items-center justify-between rounded-xl border border-slate-200 bg-white p-4 transition-[background-color,border-color,transform] duration-300 hover:-translate-y-0.5 hover:border-[#006A4E] hover:bg-[#ECFDF5] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#006A4E] motion-reduce:transform-none"
              >
                <span className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#ECFDF5] text-[#006A4E]">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="text-sm font-semibold text-slate-800 group-hover:text-[#00523C]">{action.title[language]}</span>
                </span>
                <ArrowUpRight className="h-4 w-4 shrink-0 text-slate-400 group-hover:text-[#006A4E]" />
              </Link>
            );
          })}
        </div>
      </section>

      <section
        aria-labelledby="dashboard-reporting-title"
        className="overflow-hidden rounded-2xl border border-emerald-200 bg-white shadow-sm"
      >
        <div className="grid lg:grid-cols-[0.8fr_1.2fr]">
          <div className="flex flex-col items-start justify-center bg-[#ECFDF5] p-5 sm:p-6">
            <span className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#006A4E] text-white">
              <AlertTriangle className="h-5 w-5" />
            </span>
            <h2 id="dashboard-reporting-title" className="text-lg font-bold text-slate-900">
              {language === 'bn' ? 'আপনার এলাকার সমস্যা জানান' : 'Report a problem in your area'}
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600">
              {language === 'bn'
                ? 'ছবি, ওয়ার্ড ও সঠিক অবস্থানসহ রিপোর্ট জমা দিন। ট্র্যাকিং নম্বর দিয়ে অগ্রগতি দেখুন।'
                : 'Submit a report with photos, ward, and location, then follow progress with your tracking ID.'}
            </p>
            <Link
              href="/citizen/complaints?new=1"
              className="mt-4 inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#006A4E] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#00523C] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#006A4E]"
            >
              {language === 'bn' ? 'এখনই রিপোর্ট করুন' : 'Start a report'}
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="p-5 sm:p-6">
            <h3 className="mb-3 text-sm font-semibold text-slate-800">
              {language === 'bn' ? 'সমস্যার ধরন বেছে নিন' : 'Choose a problem category'}
            </h3>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {REPORT_CATEGORIES.map((category) => {
                const Icon = category.icon;
                return (
                  <Link
                    key={category.id}
                    href={`/citizen/complaints?new=1&category=${category.id}`}
                    className="group flex min-h-12 items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-700 transition-[background-color,border-color,transform] duration-300 hover:-translate-y-0.5 hover:border-[#006A4E] hover:bg-[#ECFDF5] hover:text-[#00523C] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#006A4E] motion-reduce:transform-none"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#ECFDF5] text-[#006A4E] transition-colors group-hover:bg-white">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span>{category.title[language]}</span>
                    <ArrowUpRight className="ml-auto h-4 w-4 shrink-0 text-slate-400 group-hover:text-[#006A4E]" />
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 p-4 sm:p-5">
            <h2 className="text-base font-semibold text-slate-900">{language === 'bn' ? 'সাম্প্রতিক আবেদন' : 'Recent applications'}</h2>
            <Link href="/citizen/applications" className="text-sm font-semibold text-[#006A4E] hover:underline">
              {language === 'bn' ? 'সব দেখুন' : 'View all'}
            </Link>
          </div>
          {isLoading ? (
            <p role="status" className="p-6 text-sm text-slate-600">{language === 'bn' ? 'লোড হচ্ছে...' : 'Loading...'}</p>
          ) : recentApplications.length === 0 ? (
            <div className="p-6 text-sm text-slate-600">
              {language === 'bn' ? 'এখনও কোনো আবেদন নেই।' : 'No applications submitted yet.'}
              <Link href="/citizen/applications/new" className="ml-1 font-semibold text-[#006A4E] hover:underline">
                {language === 'bn' ? 'আবেদন শুরু করুন' : 'Start an application'}
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[560px] text-left text-sm">
                <thead className="bg-slate-50 text-xs font-semibold text-slate-600">
                  <tr>
                    <th scope="col" className="px-4 py-3">{language === 'bn' ? 'রেফারেন্স' : 'Reference'}</th>
                    <th scope="col" className="px-4 py-3">{language === 'bn' ? 'সেবা' : 'Service'}</th>
                    <th scope="col" className="px-4 py-3">{language === 'bn' ? 'তারিখ' : 'Date'}</th>
                    <th scope="col" className="px-4 py-3">{language === 'bn' ? 'অবস্থা' : 'Status'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentApplications.map((item) => (
                    <tr key={item.id} className="transition-colors hover:bg-[#ECFDF5]">
                      <td className="px-4 py-3 font-mono text-xs font-semibold text-slate-800">{item.referenceId}</td>
                      <td className="px-4 py-3 text-slate-700">{SERVICE_NAMES[item.type][language]}</td>
                      <td className="whitespace-nowrap px-4 py-3 text-slate-600">{formatDate(item.submittedAt, language)}</td>
                      <td className="px-4 py-3 text-slate-700">{item.status === 'approved' ? language === 'bn' ? 'অনুমোদিত' : 'Approved' : item.status === 'rejected' ? language === 'bn' ? 'প্রত্যাখ্যাত' : 'Rejected' : language === 'bn' ? 'পর্যালোচনাধীন' : 'In progress'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 p-4 sm:p-5">
            <h2 className="text-base font-semibold text-slate-900">{language === 'bn' ? 'সাম্প্রতিক কার্যক্রম' : 'Recent activity'}</h2>
            <Link href="/citizen/activity" className="text-sm font-semibold text-[#006A4E] hover:underline">
              {language === 'bn' ? 'সব দেখুন' : 'View all'}
            </Link>
          </div>
          {isLoading ? (
            <p role="status" className="p-6 text-sm text-slate-600">{language === 'bn' ? 'লোড হচ্ছে...' : 'Loading...'}</p>
          ) : activity.length === 0 ? (
            <div className="p-6 text-sm text-slate-600">{language === 'bn' ? 'এখনও কোনো কার্যক্রম নেই।' : 'Activity will appear here when you submit a request or report.'}</div>
          ) : (
            <ul className="divide-y divide-slate-100">
              {activity.map((item) => (
                <li key={`${item.kind}-${item.id}`} className="flex items-start justify-between gap-3 p-4 transition-colors hover:bg-[#ECFDF5]">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                    <p className="mt-1 font-mono text-xs text-slate-600">{item.reference}</p>
                    <p className="mt-1 text-xs text-slate-500">{formatDate(item.date, language)}</p>
                  </div>
                  <Link href={item.href} aria-label={`${language === 'bn' ? 'রেকর্ড দেখুন' : 'View record'} ${item.reference}`} className="mt-1 shrink-0 text-[#006A4E] hover:underline">
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
