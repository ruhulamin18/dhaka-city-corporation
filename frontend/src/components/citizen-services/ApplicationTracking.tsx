'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  CheckCircle2,
  Clock,
  ExternalLink,
  FileSearch,
  Lock,
  ShieldCheck,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
import { mockApi } from '@/services/mockApi';
import { CitizenServiceDefinition } from '@/types/citizen-service';

interface TrackedItem {
  id: string;
  referenceId: string;
  title: string;
  date: string;
  status: string;
  wardNumber: number;
}

interface ApplicationTrackingProps {
  service: CitizenServiceDefinition;
  refreshKey?: number;
}

function getStatusBadgeClasses(status: string): string {
  const normalized = status.toLowerCase();
  if (
    normalized === 'approved' ||
    normalized === 'resolved' ||
    normalized === 'confirmed' ||
    normalized === 'verified'
  ) {
    return 'bg-[#ECFDF5] text-[#006A4E] border-emerald-200';
  }
  if (normalized === 'rejected') {
    return 'bg-red-50 text-[#C81E1E] border-red-200';
  }
  return 'bg-amber-50 text-amber-800 border-amber-200';
}

function localizeStatus(status: string, language: 'en' | 'bn'): string {
  const normalized = status.toLowerCase();
  const map: Record<string, { bn: string; en: string }> = {
    pending: { bn: 'পর্যালোচনাধীন', en: 'Pending Review' },
    approved: { bn: 'অনুমোদিত', en: 'Approved' },
    rejected: { bn: 'প্রত্যাখ্যাত', en: 'Rejected' },
    assigned: { bn: 'দায়িত্ব অর্পিত', en: 'Assigned' },
    in_progress: { bn: 'চলমান', en: 'In Progress' },
    resolved: { bn: 'সমাধান হয়েছে', en: 'Resolved' },
    confirmed: { bn: 'নিশ্চিত', en: 'Confirmed' },
  };
  return map[normalized]?.[language] ?? status;
}

export default function ApplicationTracking({
  service,
  refreshKey = 0,
}: ApplicationTrackingProps) {
  const { language } = useApp();
  const { user, isAuthenticated, getDashboardPath } = useAuth();
  const [items, setItems] = useState<TrackedItem[]>([]);
  const [loadedKey, setLoadedKey] = useState<string>('');

  const currentFetchKey =
    isAuthenticated && user
      ? `${user.id}:${service.id}:${service.interactionMode}:${refreshKey}`
      : '';

  useEffect(() => {
    if (!currentFetchKey || !user) return;
    let active = true;

    async function loadUserRecords() {
      try {
        const mapped: TrackedItem[] = [];
        const userPhoneClean = (user?.phone ?? '').replace(/[\s-]/g, '');
        const userNameLower = (user?.nameEn ?? '').toLowerCase();

        if (service.interactionMode === 'complaint') {
          const complaints = await mockApi.getComplaints();
          const filtered = complaints.filter((c) => {
            const matchCategory =
              !service.backendIntegration.complaintCategory ||
              c.category === service.backendIntegration.complaintCategory;
            const phoneClean = c.phone.replace(/[\s-]/g, '');
            const matchesUser =
              (userPhoneClean && phoneClean === userPhoneClean) ||
              c.citizenName.toLowerCase() === userNameLower ||
              user?.role !== 'citizen';
            return matchCategory && matchesUser;
          });
          for (const c of filtered.slice(0, 5)) {
            mapped.push({
              id: c.id,
              referenceId: c.trackingId,
              title: c.title,
              date: c.createdAt.slice(0, 10),
              status: c.status,
              wardNumber: c.wardNumber,
            });
          }
        } else if (service.interactionMode === 'facility-booking') {
          const bookings = await mockApi.getBookings();
          const filtered = bookings.filter((b) => {
            const matchType =
              !service.backendIntegration.facilityType ||
              b.facilityType === service.backendIntegration.facilityType;
            const phoneClean = b.phone.replace(/[\s-]/g, '');
            const matchesUser =
              (userPhoneClean && phoneClean === userPhoneClean) ||
              b.applicantName.toLowerCase() === userNameLower ||
              user?.role !== 'citizen';
            return matchType && matchesUser;
          });
          for (const b of filtered.slice(0, 5)) {
            mapped.push({
              id: b.id,
              referenceId: b.bookingId,
              title: language === 'bn' ? b.facilityNameBn : b.facilityNameEn,
              date: b.bookingDate,
              status: b.status,
              wardNumber: b.wardNumber,
            });
          }
        } else {
          const apps = await mockApi.getApplications();
          const filtered = apps.filter((a) => {
            const matchType =
              !service.backendIntegration.applicationType ||
              a.type === service.backendIntegration.applicationType;
            const phoneClean = a.phone.replace(/[\s-]/g, '');
            const matchesUser =
              (userPhoneClean && phoneClean === userPhoneClean) ||
              (user?.nid && a.nid === user.nid) ||
              a.applicantName.toLowerCase() === userNameLower ||
              user?.role !== 'citizen';
            return matchType && matchesUser;
          });
          for (const a of filtered.slice(0, 5)) {
            mapped.push({
              id: a.id,
              referenceId: a.referenceId,
              title: a.businessName || a.address,
              date: a.submittedAt,
              status: a.status,
              wardNumber: a.wardNumber,
            });
          }
        }

        if (active) {
          setItems(mapped);
          setLoadedKey(currentFetchKey);
        }
      } catch {
        if (active) {
          setItems([]);
          setLoadedKey(currentFetchKey);
        }
      }
    }

    loadUserRecords();
    return () => {
      active = false;
    };
  }, [
    currentFetchKey,
    user,
    service.interactionMode,
    service.backendIntegration.applicationType,
    service.backendIntegration.complaintCategory,
    service.backendIntegration.facilityType,
    language,
  ]);

  const visibleItems = isAuthenticated && user ? items : [];
  const isLoading = Boolean(currentFetchKey) && loadedKey !== currentFetchKey;

  const loginRedirectUrl = `/login?redirect=${encodeURIComponent(
    `/citizen-services/${service.categorySlug}/${service.slug}?action=apply`
  )}`;

  return (
    <section
      id="application-tracking"
      className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-xs"
    >
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#ECFDF5] text-[#006A4E]">
            <FileSearch className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {language === 'bn' ? 'আবেদনের অবস্থা ও ট্র্যাকিং' : 'Application Tracking & History'}
            </h2>
            <p className="text-xs text-slate-500">
              {language === 'bn'
                ? 'আপনার জমা দেওয়া আবেদন বা অনুরোধের সর্বশেষ অগ্রগতি দেখুন'
                : 'Monitor the status of your submissions linked to your account'}
            </p>
          </div>
        </div>

        <Link
          href="/verify"
          className="inline-flex items-center gap-1.5 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-1.5 text-xs font-semibold text-[#006A4E] hover:border-[#006A4E] transition-colors"
        >
          <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
          <span>{language === 'bn' ? 'পাবলিক QR যাচাই' : 'Public QR Verify'}</span>
        </Link>
      </div>

      {!isAuthenticated ? (
        <div className="rounded-xl border border-slate-200 bg-[#F8FAFC] p-4 sm:flex sm:items-center sm:justify-between sm:gap-4">
          <div className="flex items-start gap-3">
            <Lock className="mt-0.5 h-5 w-5 shrink-0 text-[#006A4E]" aria-hidden="true" />
            <div>
              <p className="text-sm font-semibold text-slate-900">
                {language === 'bn'
                  ? 'ব্যক্তিগত আবেদনের ইতিহাস দেখতে লগইন করুন'
                  : 'Sign in to view your personal application history'}
              </p>
              <p className="mt-0.5 text-xs text-slate-600">
                {language === 'bn'
                  ? 'নিরাপত্তার স্বার্থে আপনার ব্যক্তিগত আবেদন, রসিদ ও ডাউনলোড শুধু লগইনকৃত অ্যাকাউন্টে প্রদর্শিত হয়।'
                  : 'For citizen privacy, personal submissions, receipts, and status logs require authentication.'}
              </p>
            </div>
          </div>
          <Link
            href={loginRedirectUrl}
            className="mt-3 inline-flex shrink-0 items-center justify-center rounded-xl bg-[#006A4E] px-4 py-2 text-xs font-semibold text-white hover:bg-[#00523C] transition-colors sm:mt-0"
          >
            {language === 'bn' ? 'লগইন করুন' : 'Sign In'}
          </Link>
        </div>
      ) : isLoading ? (
        <div className="rounded-xl border border-slate-100 bg-[#F8FAFC] p-4 text-sm text-slate-500">
          {language === 'bn' ? 'আপনার রেকর্ড লোড হচ্ছে...' : 'Loading your records...'}
        </div>
      ) : visibleItems.length === 0 ? (
        <div className="rounded-xl border border-slate-100 bg-[#F8FAFC] p-4 text-sm text-slate-600">
          {language === 'bn'
            ? 'এই সেবার অধীনে এখনো কোনো আবেদন পাওয়া যায়নি। উপরের ফর্ম থেকে নতুন আবেদন জমা দিন।'
            : 'No previous submissions found for this service yet. Use the form above to submit a new request.'}
        </div>
      ) : (
        <div className="space-y-2.5">
          {visibleItems.map((item) => (
            <div
              key={item.id}
              className="flex flex-col gap-2 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-bold text-[#006A4E]">
                    {item.referenceId}
                  </span>
                  <span className="text-xs text-slate-400">•</span>
                  <span className="text-xs text-slate-500">
                    {language === 'bn' ? `ওয়ার্ড ${item.wardNumber}` : `Ward ${item.wardNumber}`}
                  </span>
                </div>
                <p className="mt-0.5 text-sm font-semibold text-slate-800">{item.title}</p>
                <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-500">
                  <Clock className="h-3 w-3" aria-hidden="true" />
                  <span>{item.date}</span>
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1 rounded-md border px-2.5 py-1 text-xs font-semibold ${getStatusBadgeClasses(
                    item.status
                  )}`}
                >
                  <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                  {localizeStatus(item.status, language)}
                </span>
              </div>
            </div>
          ))}

          <div className="pt-2 text-right">
            <Link
              href={getDashboardPath()}
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#006A4E] hover:text-[#00523C] transition-colors"
            >
              <span>
                {language === 'bn'
                  ? 'ড্যাশবোর্ডে সব আবেদন দেখুন'
                  : 'View all records in Dashboard'}
              </span>
              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>
        </div>
      )}
    </section>
  );
}
