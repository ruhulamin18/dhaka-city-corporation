'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
import { mockApi } from '@/services/mockApi';
import { PaymentService } from '@/services/payment/payment-service';
import type { ApplicationType, Complaint, ServiceApplication } from '@/types';
import type { PaymentTransaction } from '@/types/payment';
import { Activity, AlertCircle, ArrowUpRight, Clock3 } from 'lucide-react';

type ActivityCategory = 'APPLICATION' | 'PAYMENT' | 'COMPLAINT';
interface ActivityItem {
  id: string;
  category: ActivityCategory;
  title: { bn: string; en: string };
  description: { bn: string; en: string };
  reference: string;
  timestamp: string;
  href: string;
}

const SERVICE_NAMES: Record<ApplicationType, { bn: string; en: string }> = {
  trade_license: { bn: 'ট্রেড লাইসেন্স', en: 'Trade license' },
  birth_certificate: { bn: 'জন্ম নিবন্ধন', en: 'Birth registration' },
  citizen_certificate: { bn: 'নাগরিকত্ব সনদ', en: 'Citizenship certificate' },
  road_digging: { bn: 'সড়ক খনন অনুমতি', en: 'Road digging permit' },
};

const STATUS_NAMES = {
  pending: { bn: 'অপেক্ষমাণ', en: 'Pending' },
  under_review: { bn: 'পর্যালোচনাধীন', en: 'Under review' },
  approved: { bn: 'অনুমোদিত', en: 'Approved' },
  rejected: { bn: 'প্রত্যাখ্যাত', en: 'Rejected' },
} as const;

function formatDate(value: string, language: 'bn' | 'en') {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat(language === 'bn' ? 'bn-BD' : 'en-US', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }).format(date);
}

function buildActivities(
  applications: ServiceApplication[],
  complaints: Complaint[],
  payments: PaymentTransaction[]
): ActivityItem[] {
  return [
    ...applications.map((item) => ({
      id: item.id,
      category: 'APPLICATION' as const,
      title: { bn: `${SERVICE_NAMES[item.type].bn} আবেদন`, en: `${SERVICE_NAMES[item.type].en} application` },
      description: {
        bn: `বর্তমান অবস্থা: ${STATUS_NAMES[item.status].bn}`,
        en: `Current status: ${STATUS_NAMES[item.status].en}`,
      },
      reference: item.referenceId,
      timestamp: item.submittedAt,
      href: `/citizen/tracking?id=${encodeURIComponent(item.referenceId)}`,
    })),
    ...complaints.map((item) => ({
      id: item.id,
      category: 'COMPLAINT' as const,
      title: { bn: 'নাগরিক সমস্যা রিপোর্ট', en: 'Civic issue report' },
      description: { bn: item.locationLabel, en: item.locationLabel },
      reference: item.trackingId,
      timestamp: item.createdAt,
      href: '/citizen/complaints',
    })),
    ...payments.map((item) => ({
      id: item.id,
      category: 'PAYMENT' as const,
      title: item.serviceName,
      description: {
        bn: `৳${item.amount.toLocaleString('bn-BD')} · ${item.status === 'SUCCESS' ? 'সফল' : 'প্রক্রিয়াধীন'}`,
        en: `৳${item.amount.toLocaleString('en-IN')} · ${item.status.toLowerCase()}`,
      },
      reference: item.transactionReference,
      timestamp: item.completedAt ?? item.initiatedAt,
      href: '/online-payment/history',
    })),
  ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

export default function CitizenActivityPage() {
  const { language } = useApp();
  const { user } = useAuth();
  const [items, setItems] = useState<ActivityItem[]>([]);
  const [filter, setFilter] = useState<'ALL' | ActivityCategory>('ALL');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) return;
    let active = true;
    queueMicrotask(() => {
      if (active) setIsLoading(true);
    });
    Promise.all([mockApi.getApplications(), mockApi.getComplaints()])
      .then(([allApplications, allComplaints]) => {
        if (!active) return;
        const applications = allApplications.filter(
          (item) => item.citizenId === user.id || (Boolean(user.phone) && item.phone === user.phone)
        );
        const complaints = allComplaints.filter(
          (item) => item.citizenId === user.id || (Boolean(user.phone) && item.phone === user.phone)
        );
        const payments = PaymentService.getAllTransactions().filter((item) => item.userId === user.id);
        setItems(buildActivities(applications, complaints, payments));
        setError('');
      })
      .catch((loadError: unknown) => {
        if (active) {
          setError(loadError instanceof Error
            ? loadError.message
            : language === 'bn' ? 'কার্যক্রম লোড করা যায়নি।' : 'Unable to load activity.');
        }
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, [user, language]);

  const filtered = useMemo(
    () => items.filter((item) => filter === 'ALL' || item.category === filter),
    [filter, items]
  );
  const categories: { id: 'ALL' | ActivityCategory; label: { bn: string; en: string } }[] = [
    { id: 'ALL', label: { bn: 'সব', en: 'All' } },
    { id: 'APPLICATION', label: { bn: 'আবেদন', en: 'Applications' } },
    { id: 'PAYMENT', label: { bn: 'পেমেন্ট', en: 'Payments' } },
    { id: 'COMPLAINT', label: { bn: 'রিপোর্ট', en: 'Reports' } },
  ];

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <header className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-end sm:justify-between sm:p-6">
        <div>
          <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#006A4E]"><Activity className="h-4 w-4" />{language === 'bn' ? 'আমার নাগরিক রেকর্ড' : 'My civic records'}</span>
          <h1 className="mt-1 text-xl font-bold text-slate-900 sm:text-2xl">{language === 'bn' ? 'কার্যক্রমের ইতিহাস' : 'Activity history'}</h1>
          <p className="mt-1 text-sm text-slate-600">{language === 'bn' ? 'আপনার আবেদন, পেমেন্ট এবং রিপোর্টের সময়রেখা।' : 'A timeline of applications, payments, and issue reports associated with your account.'}</p>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {categories.map((item) => (
            <button
              key={item.id}
              type="button"
              aria-pressed={filter === item.id}
              onClick={() => setFilter(item.id)}
              className={`min-h-10 shrink-0 rounded-lg border px-3 text-xs font-semibold transition-colors ${
                filter === item.id
                  ? 'border-[#006A4E] bg-[#ECFDF5] text-[#00523C]'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              {item.label[language]}
            </button>
          ))}
        </div>
      </header>

      {error && <p role="alert" className="flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800"><AlertCircle className="h-4 w-4" />{error}</p>}

      <section aria-label={language === 'bn' ? 'কার্যক্রমের সময়রেখা' : 'Activity timeline'} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
        {isLoading ? (
          <p role="status" className="text-sm text-slate-600">{language === 'bn' ? 'কার্যক্রম লোড হচ্ছে...' : 'Loading activity...'}</p>
        ) : filtered.length === 0 ? (
          <div className="py-8 text-center">
            <Clock3 className="mx-auto h-7 w-7 text-slate-400" />
            <p className="mt-2 text-sm font-medium text-slate-800">{language === 'bn' ? 'কোনো কার্যক্রম পাওয়া যায়নি' : 'No activity found'}</p>
            <p className="mt-1 text-sm text-slate-600">{language === 'bn' ? 'আপনার অ্যাকাউন্টের সেবা কার্যক্রম এখানে দেখা যাবে।' : 'Your account activity will appear here as you use civic services.'}</p>
          </div>
        ) : (
          <ol className="relative space-y-7 before:absolute before:bottom-2 before:left-3 before:top-2 before:w-px before:bg-slate-200">
            {filtered.map((item) => (
              <li key={`${item.category}-${item.id}`} className="relative pl-9">
                <span className={`absolute left-0 top-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white text-white ${
                  item.category === 'COMPLAINT' ? 'bg-[#006A4E]' : item.category === 'PAYMENT' ? 'bg-slate-700' : 'bg-amber-600'
                }`}>
                  <span className="h-1.5 w-1.5 rounded-full bg-white" />
                </span>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-900">{item.title[language]}</p>
                    <p className="mt-1 text-sm leading-6 text-slate-600">{item.description[language]}</p>
                    <p className="mt-1 font-mono text-xs text-[#006A4E]">{item.reference}</p>
                    <p className="mt-1 text-xs text-slate-500">{formatDate(item.timestamp, language)}</p>
                  </div>
                  <Link href={item.href} className="inline-flex min-h-9 shrink-0 items-center gap-1 self-start text-xs font-semibold text-[#006A4E] hover:underline">
                    {language === 'bn' ? 'রেকর্ড দেখুন' : 'View record'} <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </li>
            ))}
          </ol>
        )}
      </section>
    </div>
  );
}
