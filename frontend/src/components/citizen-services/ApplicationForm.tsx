'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  AlertCircle,
  Building2,
  Calculator,
  CheckCircle2,
  Clock,
  Download,
  FileCheck2,
  Info,
  Lock,
  MapPin,
  Phone,
  Printer,
  Search,
  Send,
  ShieldCheck,
  Upload,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
import { INITIAL_WARDS, mockApi } from '@/services/mockApi';
import { getDepartmentForService } from '@/data/services';
import {
  CitizenServiceDefinition,
  ServiceFormField,
  SubmittedServiceResult,
  pickText,
} from '@/types/citizen-service';
import {
  HoldingTaxCalculation,
  HoldingTaxInput,
  HoldingTaxRecord,
  ServiceApplication,
  TimeSlot,
  VerificationResult,
} from '@/types';

interface ApplicationFormProps {
  service: CitizenServiceDefinition;
  onSubmitted?: () => void;
}

const ALLOWED_EXTENSIONS = ['.pdf', '.jpg', '.jpeg', '.png'];

function normalizePhoneInput(raw: string): string {
  return raw.replace(/[\s-]/g, '').trim();
}

export default function ApplicationForm({
  service,
  onSubmitted,
}: ApplicationFormProps) {
  const { language } = useApp();
  const { user, isAuthenticated, getDashboardPath } = useAuth();
  const department = getDepartmentForService(service);

  const [values, setValues] = useState<Record<string, string>>({});
  const [files, setFiles] = useState<Record<string, File | null>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submittedResult, setSubmittedResult] =
    useState<SubmittedServiceResult | null>(null);

  // Public verification state
  const [verificationResult, setVerificationResult] =
    useState<VerificationResult | null>(null);
  const [verificationSearched, setVerificationSearched] = useState(false);

  // Holding tax calculator state
  const [taxCalculation, setTaxCalculation] =
    useState<HoldingTaxCalculation | null>(null);

  // Private authenticated records state
  const [taxRecords, setTaxRecords] = useState<HoldingTaxRecord[]>([]);
  const [approvedCertificates, setApprovedCertificates] = useState<
    ServiceApplication[]
  >([]);
  const [loadedPrivateKey, setLoadedPrivateKey] = useState<string>('');
  const [historyFilter, setHistoryFilter] = useState('');

  // Public directory filter state
  const [directoryQuery, setDirectoryQuery] = useState('');
  const [directoryWard, setDirectoryWard] = useState('all');

  const needsPrivateTaxData =
    service.interactionMode === 'tax-payment' ||
    service.interactionMode === 'tax-history' ||
    service.interactionMode === 'receipt-lookup';
  const needsPrivateCertData =
    service.interactionMode === 'document-download' ||
    service.interactionMode === 'receipt-lookup';

  const privateFetchKey =
    isAuthenticated && user && (needsPrivateTaxData || needsPrivateCertData)
      ? `${user.id}:${service.id}`
      : '';

  useEffect(() => {
    if (!privateFetchKey) return;
    let active = true;

    async function fetchPrivateData() {
      try {
        const [records, apps] = await Promise.all([
          needsPrivateTaxData ? mockApi.getTaxRecords() : Promise.resolve([]),
          needsPrivateCertData ? mockApi.getApplications() : Promise.resolve([]),
        ]);
        if (!active) return;
        setTaxRecords(records);
        setApprovedCertificates(
          apps.filter((a) => a.status === 'approved' || a.status === 'pending')
        );
        setLoadedPrivateKey(privateFetchKey);
      } catch {
        if (!active) return;
        setTaxRecords([]);
        setApprovedCertificates([]);
        setLoadedPrivateKey(privateFetchKey);
      }
    }

    fetchPrivateData();
    return () => {
      active = false;
    };
  }, [privateFetchKey, needsPrivateTaxData, needsPrivateCertData]);

  const visibleTaxRecords = useMemo(
    () => (isAuthenticated ? taxRecords : []),
    [isAuthenticated, taxRecords]
  );
  const visibleApprovedCertificates = isAuthenticated ? approvedCertificates : [];
  const loadingPrivateData =
    Boolean(privateFetchKey) && loadedPrivateKey !== privateFetchKey;

  const getFieldValue = (name: string): string => {
    if (name in values) return values[name];
    if (!isAuthenticated || !user) return '';
    if (
      name === 'applicantName' ||
      name === 'ownerName' ||
      name === 'citizenName' ||
      name === 'reporterName' ||
      name === 'fullName'
    ) {
      return language === 'bn' ? user.nameBn : user.nameEn;
    }
    if (name === 'phone' || name === 'mobile') {
      return user.phone ?? '';
    }
    if (name === 'nid' || name === 'applicantNid') {
      return user.nid ?? '';
    }
    if (name === 'wardNumber' || name === 'ward') {
      return user.wardNumber ? String(user.wardNumber) : '';
    }
    return '';
  };

  const handleFieldChange = (name: string, nextValue: string) => {
    setValues((prev) => ({ ...prev, [name]: nextValue }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleFileChange = (field: ServiceFormField, file: File | null) => {
    if (!file) {
      setFiles((prev) => ({ ...prev, [field.name]: null }));
      return;
    }
    const maxMb = field.maxFileSizeMb ?? 5;
    const lowerName = file.name.toLowerCase();
    const validExt = ALLOWED_EXTENSIONS.some((ext) => lowerName.endsWith(ext));
    if (!validExt) {
      setErrors((prev) => ({
        ...prev,
        [field.name]:
          language === 'bn'
            ? 'শুধুমাত্র PDF, JPG, JPEG অথবা PNG ফাইল আপলোড করা যাবে।'
            : 'Only PDF, JPG, JPEG, or PNG files are allowed.',
      }));
      return;
    }
    if (file.size > maxMb * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        [field.name]:
          language === 'bn'
            ? `ফাইলের আকার সর্বোচ্চ ${maxMb} MB হতে হবে।`
            : `File size must not exceed ${maxMb} MB.`,
      }));
      return;
    }
    setFiles((prev) => ({ ...prev, [field.name]: file }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field.name];
      return next;
    });
  };

  const validateFields = (): boolean => {
    const nextErrors: Record<string, string> = {};

    for (const field of service.formFields) {
      if (field.type === 'file') {
        if (field.required && !files[field.name]) {
          nextErrors[field.name] =
            language === 'bn'
              ? `${field.label.bn} আপলোড করা আবশ্যক।`
              : `${field.label.en} is required.`;
        }
        continue;
      }

      const raw = getFieldValue(field.name).trim();
      if (field.required && !raw) {
        nextErrors[field.name] =
          language === 'bn'
            ? `${field.label.bn} পূরণ করা আবশ্যক।`
            : `${field.label.en} is required.`;
        continue;
      }

      if (!raw) continue;

      if (field.pattern === 'bd_phone') {
        const clean = normalizePhoneInput(raw);
        if (!/^01[3-9]\d{8}$/.test(clean)) {
          nextErrors[field.name] =
            language === 'bn'
              ? 'সঠিক ১১ ডিজিটের বাংলাদেশি মোবাইল নম্বর লিখুন (যেমন: 017XXXXXXXX)।'
              : 'Enter a valid 11-digit Bangladeshi mobile number (e.g., 017XXXXXXXX).';
        }
      }

      if (field.pattern === 'nid') {
        const clean = raw.replace(/\s/g, '');
        if (!/^\d{10}$|^\d{13}$|^\d{17}$/.test(clean)) {
          nextErrors[field.name] =
            language === 'bn'
              ? 'এনআইডি নম্বর ১০, ১৩ অথবা ১৭ ডিজিটের হতে হবে।'
              : 'NID number must be 10, 13, or 17 digits.';
        }
      }

      if (field.minLength && raw.length < field.minLength) {
        nextErrors[field.name] =
          language === 'bn'
            ? `কমপক্ষে ${field.minLength} অক্ষর লিখুন।`
            : `Please enter at least ${field.minLength} characters.`;
      }

      if (field.maxLength && raw.length > field.maxLength) {
        nextErrors[field.name] =
          language === 'bn'
            ? `সর্বোচ্চ ${field.maxLength} অক্ষর লেখা যাবে।`
            : `Must be at most ${field.maxLength} characters.`;
      }
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleVerificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    if (!validateFields()) return;

    const refField = service.formFields[0];
    const refId = getFieldValue(refField?.name ?? 'referenceId').trim();
    setSubmitting(true);
    try {
      const result = await mockApi.verifyDocumentById(refId);
      setVerificationResult(result);
      setVerificationSearched(true);
    } catch {
      setSubmitError(
        language === 'bn'
          ? 'যাচাইকরণে সাময়িক ত্রুটি হয়েছে। অনুগ্রহ করে পুনরায় চেষ্টা করুন।'
          : 'Unable to complete verification right now. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleTaxCalculation = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    if (!validateFields()) return;

    const wardNumber = Number(getFieldValue('wardNumber')) || 27;
    const areaSqFt = Number(getFieldValue('areaSqFt')) || 1200;
    const floors = Number(getFieldValue('floors')) || 1;
    const propertyType = (getFieldValue('propertyType') ||
      'residential') as HoldingTaxInput['propertyType'];
    const roadWidthCategory = (getFieldValue('roadWidthCategory') ||
      'lane') as HoldingTaxInput['roadWidthCategory'];

    const calc = mockApi.calculateHoldingTax({
      wardNumber,
      holdingNumber: getFieldValue('holdingNumber') || 'N/A',
      ownerName: getFieldValue('ownerName') || 'Property Owner',
      propertyType,
      areaSqFt,
      floors,
      roadWidthCategory,
    });
    setTaxCalculation(calc);
  };

  const handlePortalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    if (!validateFields()) return;

    setSubmitting(true);
    try {
      const wardNumber =
        Number(getFieldValue('wardNumber') || getFieldValue('ward')) ||
        user?.wardNumber ||
        27;
      const applicantName =
        getFieldValue('applicantName') ||
        getFieldValue('ownerName') ||
        getFieldValue('citizenName') ||
        getFieldValue('reporterName') ||
        getFieldValue('fullName') ||
        user?.nameEn ||
        'Citizen Applicant';
      const phone =
        normalizePhoneInput(
          getFieldValue('phone') || getFieldValue('mobile') || user?.phone || '01700000000'
        );
      const nid =
        getFieldValue('nid') ||
        getFieldValue('applicantNid') ||
        user?.nid ||
        '1990000000000';
      const address =
        getFieldValue('address') ||
        getFieldValue('locationLabel') ||
        getFieldValue('businessAddress') ||
        `Ward ${wardNumber}, Dhaka`;

      if (service.interactionMode === 'complaint') {
        const title =
          getFieldValue('title') ||
          getFieldValue('issueType') ||
          `${service.title.en} — Ward ${wardNumber}`;
        const description =
          getFieldValue('description') ||
          getFieldValue('details') ||
          address;
        const created = await mockApi.submitComplaint({
          citizenName: applicantName,
          phone,
          wardNumber,
          category: service.backendIntegration.complaintCategory ?? 'road_damage',
          title,
          description,
          latitude: 23.7465,
          longitude: 90.376,
          locationLabel: address,
        });

        setSubmittedResult({
          referenceId: created.trackingId,
          submittedAt: created.createdAt.slice(0, 10),
          statusLabel: { bn: 'অভিযোগ গৃহীত ও বিভাগে প্রেরিত', en: 'Request Logged & Routed' },
          summary: {
            bn: `আপনার অনুরোধটি সফলভাবে নিবন্ধিত হয়েছে এবং ${created.departmentBn}-এ প্রেরণ করা হয়েছে।`,
            en: `Your request has been logged and routed to ${created.departmentEn}.`,
          },
          departmentName: {
            bn: created.departmentBn,
            en: created.departmentEn,
          },
          mode: 'portal-recorded',
        });
        onSubmitted?.();
      } else if (service.interactionMode === 'facility-booking') {
        const facilityName =
          getFieldValue('facilityName') ||
          getFieldValue('centerName') ||
          'Municipal Community Center';
        const bookingDate =
          getFieldValue('bookingDate') ||
          getFieldValue('eventDate') ||
          new Date().toISOString().slice(0, 10);
        const slot = (getFieldValue('slot') ||
          getFieldValue('timeSlot') ||
          'evening') as TimeSlot;
        const purpose =
          getFieldValue('purpose') ||
          getFieldValue('eventType') ||
          'Civic / Family Event';

        const { booking } = await mockApi.bookFacility({
          facilityType: service.backendIntegration.facilityType ?? 'community_center',
          facilityNameEn: facilityName,
          facilityNameBn: facilityName,
          wardNumber,
          bookingDate,
          slot,
          applicantName,
          phone,
          purpose,
          feeBdt: 0,
          paymentMethod: 'bkash',
        });

        setSubmittedResult({
          referenceId: booking.bookingId,
          submittedAt: booking.createdAt,
          statusLabel: { bn: 'বুকিং অনুরোধ গৃহীত', en: 'Booking Request Recorded' },
          summary: {
            bn: 'আপনার বুকিং অনুরোধটি পোর্টালে সংরক্ষিত হয়েছে। অফিসিয়াল ফি ও চূড়ান্ত অনুমোদনের তথ্য সংশ্লিষ্ট বিভাগ হতে জানানো হবে।',
            en: 'Your booking request has been recorded in the portal. Official fee confirmation and final approval will be issued by the Estate Department.',
          },
          departmentName: department.name,
          mode: 'portal-recorded',
        });
        onSubmitted?.();
      } else {
        const details: Record<string, string | number> = {
          serviceSlug: service.slug,
          serviceTitle: service.title.en,
        };
        for (const field of service.formFields) {
          if (field.type === 'file') {
            if (files[field.name]) {
              details[field.name] = files[field.name]?.name ?? '';
            }
          } else {
            const val = getFieldValue(field.name).trim();
            if (val) details[field.name] = val;
          }
        }

        const { application } = await mockApi.submitApplication({
          type: service.backendIntegration.applicationType ?? 'citizen_certificate',
          applicantName,
          nid,
          phone,
          wardNumber,
          businessName: getFieldValue('businessName') || undefined,
          businessCategory: getFieldValue('businessCategory') || undefined,
          address,
          feeBdt: 0,
          paymentMethod: 'bkash',
          details,
        });

        setSubmittedResult({
          referenceId: application.referenceId,
          submittedAt: application.submittedAt,
          statusLabel: { bn: 'আবেদন গৃহীত (যাচাইকরণ অপেক্ষমাণ)', en: 'Application Submitted (Under Review)' },
          summary: {
            bn: 'আপনার আবেদনটি ঢাকা সিটি কর্পোরেশন পোর্টালে সংরক্ষিত হয়েছে। নিচের রেফারেন্স নম্বরটি সংরক্ষণ করুন এবং ড্যাশবোর্ড বা QR যাচাই থেকে অগ্রগতি দেখুন।',
            en: 'Your application has been recorded in the Dhaka City Corporation portal. Save the reference ID below to track status in your dashboard or verify later.',
          },
          departmentName: department.name,
          mode: 'portal-recorded',
        });
        onSubmitted?.();
      }
    } catch {
      setSubmitError(
        language === 'bn'
          ? 'আবেদন জমা দেওয়ার সময় ত্রুটি হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।'
          : 'An error occurred while submitting your request. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const filteredDirectory = useMemo(() => {
    const entries = service.publicDirectoryEntries ?? [];
    const q = directoryQuery.trim().toLowerCase();
    return entries.filter((entry) => {
      const wardMatches =
        directoryWard === 'all' ||
        entry.ward.en.toLowerCase().includes(directoryWard.toLowerCase()) ||
        entry.ward.bn.includes(directoryWard);
      if (!wardMatches) return false;
      if (!q) return true;
      const haystack = [
        entry.name.bn,
        entry.name.en,
        entry.ward.bn,
        entry.ward.en,
        entry.location.bn,
        entry.location.en,
        ...entry.facilities.flatMap((f) => [f.bn, f.en]),
      ]
        .join(' ')
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [service.publicDirectoryEntries, directoryQuery, directoryWard]);

  const filteredTaxRecords = useMemo(() => {
    const q = historyFilter.trim().toLowerCase();
    if (!q) return visibleTaxRecords;
    return visibleTaxRecords.filter(
      (r) =>
        r.holdingNumber.toLowerCase().includes(q) ||
        r.receiptId.toLowerCase().includes(q) ||
        r.ownerName.toLowerCase().includes(q) ||
        r.fiscalYear.toLowerCase().includes(q)
    );
  }, [visibleTaxRecords, historyFilter]);

  const loginRedirectUrl = `/login?redirect=${encodeURIComponent(
    `/citizen-services/${service.categorySlug}/${service.slug}?action=apply`
  )}`;
  const registerRedirectUrl = `/register?redirect=${encodeURIComponent(
    `/citizen-services/${service.categorySlug}/${service.slug}?action=apply`
  )}`;

  const renderField = (field: ServiceFormField) => {
    const value = getFieldValue(field.name);
    const error = errors[field.name];
    const baseInputClass = `w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-colors ${
      error
        ? 'border-[#C81E1E] focus:border-[#C81E1E] focus:ring-red-100'
        : 'border-[#E2E8F0] focus:border-[#006A4E] focus:ring-emerald-100'
    }`;

    return (
      <div
        key={field.name}
        className={field.fullWidth || field.type === 'textarea' ? 'sm:col-span-2' : ''}
      >
        <label
          htmlFor={`field-${field.name}`}
          className="mb-1.5 block text-sm font-semibold text-slate-800"
        >
          {pickText(field.label, language)}
          {field.required && <span className="ml-1 text-[#C81E1E]">*</span>}
        </label>

        {field.type === 'textarea' ? (
          <textarea
            id={`field-${field.name}`}
            rows={3}
            value={value}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            placeholder={field.placeholder ? pickText(field.placeholder, language) : ''}
            className={baseInputClass}
          />
        ) : field.type === 'select' ? (
          <select
            id={`field-${field.name}`}
            value={value}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            className={baseInputClass}
          >
            <option value="">
              {language === 'bn' ? 'নির্বাচন করুন...' : 'Select an option...'}
            </option>
            {(field.options ?? []).map((opt) => (
              <option key={opt.value} value={opt.value}>
                {pickText(opt.label, language)}
              </option>
            ))}
          </select>
        ) : field.type === 'ward' ? (
          <select
            id={`field-${field.name}`}
            value={value}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            className={baseInputClass}
          >
            <option value="">
              {language === 'bn' ? 'ওয়ার্ড নির্বাচন করুন...' : 'Select Ward...'}
            </option>
            {INITIAL_WARDS.map((w) => (
              <option key={w.wardNumber} value={String(w.wardNumber)}>
                {language === 'bn'
                  ? `ওয়ার্ড ${w.wardNumber} — ${w.nameBn}`
                  : `Ward ${w.wardNumber} — ${w.nameEn}`}
              </option>
            ))}
          </select>
        ) : field.type === 'file' ? (
          <div
            className={`rounded-xl border border-dashed p-3.5 transition-colors ${
              error ? 'border-[#C81E1E] bg-red-50/40' : 'border-slate-300 bg-[#F8FAFC]'
            }`}
          >
            <label
              htmlFor={`field-${field.name}`}
              className="flex cursor-pointer items-center justify-between gap-3"
            >
              <div className="flex items-center gap-2.5 text-sm text-slate-700">
                <Upload className="h-4 w-4 shrink-0 text-[#006A4E]" aria-hidden="true" />
                <span className="truncate">
                  {files[field.name]
                    ? files[field.name]?.name
                    : language === 'bn'
                      ? 'ফাইল নির্বাচন করুন (PDF, JPG, PNG · সর্বোচ্চ ৫ MB)'
                      : 'Choose file (PDF, JPG, PNG · Max 5 MB)'}
                </span>
              </div>
              <span className="shrink-0 rounded-lg bg-[#ECFDF5] px-2.5 py-1 text-xs font-semibold text-[#006A4E]">
                {language === 'bn' ? 'আপলোড' : 'Browse'}
              </span>
            </label>
            <input
              id={`field-${field.name}`}
              type="file"
              accept={field.accept ?? '.pdf,.jpg,.jpeg,.png'}
              onChange={(e) => handleFileChange(field, e.target.files?.[0] ?? null)}
              className="sr-only"
            />
          </div>
        ) : (
          <input
            id={`field-${field.name}`}
            type={field.type}
            value={value}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            placeholder={field.placeholder ? pickText(field.placeholder, language) : ''}
            className={baseInputClass}
          />
        )}

        {field.helperText && !error && (
          <p className="mt-1 text-xs text-slate-500">
            {pickText(field.helperText, language)}
          </p>
        )}
        {error && (
          <p className="mt-1 flex items-center gap-1 text-xs font-medium text-[#C81E1E]">
            <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <span>{error}</span>
          </p>
        )}
      </div>
    );
  };

  // 1. PUBLIC DIRECTORY MODE (Parks, Cemeteries, Public Toilets)
  if (service.interactionMode === 'public-directory') {
    const entries = service.publicDirectoryEntries ?? [];
    const uniqueWards = Array.from(new Set(entries.map((e) => e.ward.en)));

    return (
      <section
        id="service-action-panel"
        className="rounded-2xl border border-[#006A4E]/30 bg-white p-6 shadow-sm"
      >
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ECFDF5] text-[#006A4E]">
              <MapPin className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                {language === 'bn'
                  ? 'তালিকা ও অবস্থান অনুসন্ধান'
                  : 'Public Directory & Locations'}
              </h2>
              <p className="text-xs text-slate-500">
                {language === 'bn'
                  ? 'লগইন ছাড়াই ওয়ার্ড ও নাম অনুযায়ী অনুসন্ধান করুন'
                  : 'Search and filter publicly accessible locations without logging in'}
              </p>
            </div>
          </div>

          <Link
            href={
              entries[0]?.mapLayer
                ? `/city-map?layer=${encodeURIComponent(entries[0].mapLayer)}`
                : '/city-map'
            }
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#006A4E] px-4 py-2 text-xs font-semibold text-white hover:bg-[#00523C] transition-colors"
          >
            <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
            <span>{language === 'bn' ? 'ইন্টারঅ্যাক্টিভ সিটি ম্যাপে দেখুন' : 'Open Interactive City Map'}</span>
          </Link>
        </div>

        <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="relative sm:col-span-2">
            <Search
              className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
              aria-hidden="true"
            />
            <input
              type="text"
              value={directoryQuery}
              onChange={(e) => setDirectoryQuery(e.target.value)}
              placeholder={
                language === 'bn'
                  ? 'নাম, এলাকা বা সুবিধার নাম লিখে খুঁজুন...'
                  : 'Search by name, area, or facility...'
              }
              className="w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] py-2.5 pl-10 pr-4 text-sm text-slate-900 focus:border-[#006A4E] focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-100"
            />
          </div>
          <select
            value={directoryWard}
            onChange={(e) => setDirectoryWard(e.target.value)}
            aria-label={language === 'bn' ? 'ওয়ার্ড ফিল্টার' : 'Filter by ward'}
            className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3.5 py-2.5 text-sm text-slate-800 focus:border-[#006A4E] focus:bg-white focus:outline-none"
          >
            <option value="all">
              {language === 'bn' ? 'সকল ওয়ার্ড' : 'All Wards'}
            </option>
            {uniqueWards.map((w) => (
              <option key={w} value={w}>
                {w}
              </option>
            ))}
          </select>
        </div>

        {filteredDirectory.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-[#F8FAFC] p-6 text-center text-sm text-slate-600">
            {language === 'bn'
              ? 'আপনার অনুসন্ধানের সাথে মিলে এমন কোনো তথ্য পাওয়া যায়নি।'
              : 'No directory entries matched your filter.'}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {filteredDirectory.map((entry) => (
              <div
                key={entry.id}
                className="flex flex-col justify-between rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-4"
              >
                <div>
                  <div className="mb-1.5 flex items-center justify-between gap-2">
                    <span className="rounded-md bg-[#ECFDF5] px-2 py-0.5 text-xs font-semibold text-[#006A4E]">
                      {pickText(entry.ward, language)}
                    </span>
                    {entry.hours && (
                      <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                        <Clock className="h-3 w-3" aria-hidden="true" />
                        {pickText(entry.hours, language)}
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-bold text-slate-900">
                    {pickText(entry.name, language)}
                  </h3>
                  <p className="mt-1 flex items-start gap-1.5 text-xs text-slate-600">
                    <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#006A4E]" aria-hidden="true" />
                    <span>{pickText(entry.location, language)}</span>
                  </p>

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {entry.facilities.map((fac, idx) => (
                      <span
                        key={idx}
                        className="rounded-md border border-slate-200 bg-white px-2 py-0.5 text-[11px] font-medium text-slate-700"
                      >
                        {pickText(fac, language)}
                      </span>
                    ))}
                  </div>
                </div>

                {(entry.accessibility || entry.contact) && (
                  <div className="mt-3 space-y-1 border-t border-slate-200/80 pt-2.5 text-xs text-slate-600">
                    {entry.accessibility && (
                      <p>
                        <strong className="text-slate-700">
                          {language === 'bn' ? 'প্রবেশগম্যতা: ' : 'Accessibility: '}
                        </strong>
                        {pickText(entry.accessibility, language)}
                      </p>
                    )}
                    {entry.contact && (
                      <p className="flex items-center gap-1.5 font-medium text-[#006A4E]">
                        <Phone className="h-3 w-3" aria-hidden="true" />
                        <span>{entry.contact}</span>
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    );
  }

  // 2. PUBLIC VERIFICATION MODE (Birth Certificate Verification / Trade License Verification)
  if (service.interactionMode === 'verification') {
    const sampleIds =
      service.categorySlug === 'business-licensing'
        ? ['DSCC-TL-2026-4108', 'DSCC-TL-2026-5219']
        : ['DSCC-CERT-2026-1094', 'DSCC-TL-2026-4108'];

    return (
      <section
        id="service-action-panel"
        className="rounded-2xl border border-[#006A4E]/30 bg-white p-6 shadow-sm"
      >
        <div className="mb-4 flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ECFDF5] text-[#006A4E]">
            <ShieldCheck className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {pickText(service.primaryCtaLabel, language)}
            </h2>
            <p className="text-xs text-slate-500">
              {language === 'bn'
                ? 'লগইন ছাড়াই তাৎক্ষণিকভাবে সনদ বা লাইসেন্সের সত্যতা যাচাই করুন'
                : 'Verify document authenticity immediately without logging in'}
            </p>
          </div>
        </div>

        <form onSubmit={handleVerificationSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {service.formFields.map(renderField)}
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
            <span>{language === 'bn' ? 'নমুনা রেফারেন্স আইডি:' : 'Sample IDs to test:'}</span>
            {sampleIds.map((sample) => (
              <button
                key={sample}
                type="button"
                onClick={() =>
                  handleFieldChange(
                    service.formFields[0]?.name ?? 'referenceId',
                    sample
                  )
                }
                className="rounded-md border border-emerald-200 bg-[#ECFDF5] px-2 py-0.5 font-mono font-semibold text-[#006A4E] hover:bg-emerald-100 transition-colors cursor-pointer"
              >
                {sample}
              </button>
            ))}
          </div>

          {submitError && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-[#C81E1E]">
              {submitError}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#006A4E] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#00523C] disabled:opacity-60 transition-colors cursor-pointer"
          >
            <Search className="h-4 w-4" aria-hidden="true" />
            <span>
              {submitting
                ? language === 'bn'
                  ? 'যাচাই করা হচ্ছে...'
                  : 'Verifying...'
                : pickText(service.primaryCtaLabel, language)}
            </span>
          </button>
        </form>

        {verificationSearched && (
          <div className="mt-5">
            {verificationResult ? (
              <div className="rounded-xl border border-emerald-200 bg-[#ECFDF5]/80 p-5">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-[#006A4E]">
                    <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
                    <span className="font-bold">
                      {language === 'bn'
                        ? 'নথিটি যাচাইকৃত পাওয়া গেছে'
                        : 'Document Record Found'}
                    </span>
                  </div>
                  <span className="rounded-md bg-[#006A4E] px-2.5 py-0.5 font-mono text-xs font-semibold text-white">
                    {verificationResult.status}
                  </span>
                </div>
                <dl className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
                  <div>
                    <dt className="text-xs text-slate-500">
                      {language === 'bn' ? 'রেফারেন্স নম্বর' : 'Reference ID'}
                    </dt>
                    <dd className="font-mono font-bold text-slate-900">
                      {verificationResult.referenceId}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-slate-500">
                      {language === 'bn' ? 'নথির ধরন' : 'Document Type'}
                    </dt>
                    <dd className="font-semibold text-slate-900">
                      {language === 'bn'
                        ? verificationResult.documentTypeBn
                        : verificationResult.documentTypeEn}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-slate-500">
                      {language === 'bn' ? 'স্বত্বাধিকারী / আবেদনকারী' : 'Holder / Applicant'}
                    </dt>
                    <dd className="font-semibold text-slate-900">
                      {verificationResult.ownerName}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-slate-500">
                      {language === 'bn' ? 'ইস্যুর তারিখ ও ওয়ার্ড' : 'Issued Date & Ward'}
                    </dt>
                    <dd className="font-semibold text-slate-900">
                      {verificationResult.issuedAt} ·{' '}
                      {language === 'bn'
                        ? `ওয়ার্ড ${verificationResult.wardNumber}`
                        : `Ward ${verificationResult.wardNumber}`}
                    </dd>
                  </div>
                </dl>
              </div>
            ) : (
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                <p className="font-semibold">
                  {language === 'bn'
                    ? 'এই রেফারেন্স নম্বরের কোনো রেকর্ড পোর্টাল ডেটাবেজে পাওয়া যায়নি।'
                    : 'No matching record was found in the portal registry for this reference ID.'}
                </p>
                <p className="mt-1 text-xs text-amber-800">
                  {language === 'bn'
                    ? 'নম্বরটি সঠিকভাবে লেখা হয়েছে কিনা যাচাই করুন অথবা জাতীয়/কেন্দ্রীয় ডেটাবেজ সংযোগের জন্য সংশ্লিষ্ট আঞ্চলিক অফিসে যোগাযোগ করুন।'
                    : 'Please verify the ID spelling or contact your zonal office if this certificate was issued on an external legacy system.'}
                </p>
              </div>
            )}
          </div>
        )}
      </section>
    );
  }

  // 3. HOLDING TAX CALCULATOR MODE (Public)
  if (service.interactionMode === 'tax-calculator') {
    return (
      <section
        id="service-action-panel"
        className="rounded-2xl border border-[#006A4E]/30 bg-white p-6 shadow-sm"
      >
        <div className="mb-4 flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ECFDF5] text-[#006A4E]">
            <Calculator className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {language === 'bn'
                ? 'অনলাইন হোল্ডিং ট্যাক্স আনুমানিক হিসাব ক্যালকুলেটর'
                : 'Holding Tax Assessment Estimator'}
            </h2>
            <p className="text-xs text-slate-500">
              {language === 'bn'
                ? 'লগইন ছাড়াই আনুমানিক বার্ষিক ও ত্রৈমাসিক হোল্ডিং কর হিসাব করুন'
                : 'Estimate annual and quarterly holding tax without logging in'}
            </p>
          </div>
        </div>

        <form onSubmit={handleTaxCalculation} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {service.formFields.map(renderField)}
          </div>

          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#006A4E] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#00523C] transition-colors cursor-pointer"
          >
            <Calculator className="h-4 w-4" aria-hidden="true" />
            <span>{pickText(service.primaryCtaLabel, language)}</span>
          </button>
        </form>

        {taxCalculation && (
          <div className="mt-5 rounded-xl border border-emerald-200 bg-[#ECFDF5]/70 p-5">
            <h3 className="mb-3 text-sm font-bold text-[#006A4E]">
              {language === 'bn'
                ? 'আনুমানিক কর মূল্যায়ন বিবরণী'
                : 'Estimated Holding Tax Breakdown'}
            </h3>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-lg bg-white p-3 border border-emerald-100">
                <p className="text-xs text-slate-500">
                  {language === 'bn' ? 'বার্ষিক মূল্যায়ন' : 'Annual Valuation'}
                </p>
                <p className="mt-1 text-base font-bold text-slate-900">
                  ৳ {taxCalculation.annualValuationBdt.toLocaleString()}
                </p>
              </div>
              <div className="rounded-lg bg-white p-3 border border-emerald-100">
                <p className="text-xs text-slate-500">
                  {language === 'bn' ? 'মোট বার্ষিক কর (আনুমানিক)' : 'Estimated Annual Total'}
                </p>
                <p className="mt-1 text-base font-bold text-[#006A4E]">
                  ৳ {taxCalculation.totalPayableBdt.toLocaleString()}
                </p>
              </div>
              <div className="rounded-lg bg-white p-3 border border-emerald-100">
                <p className="text-xs text-slate-500">
                  {language === 'bn' ? 'ত্রৈমাসিক কিস্তি' : 'Quarterly Installment'}
                </p>
                <p className="mt-1 text-base font-bold text-slate-900">
                  ৳ {taxCalculation.quarterlyTaxBdt.toLocaleString()}
                </p>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-xs text-slate-600">
              <span>
                {language === 'bn' ? 'হোল্ডিং কর: ' : 'Holding Tax: '}৳{' '}
                {taxCalculation.annualTaxBdt.toLocaleString()}
              </span>
              <span>
                {language === 'bn' ? 'বর্জ্য/পরিচ্ছন্নতা রেট: ' : 'Conservancy Fee: '}৳{' '}
                {taxCalculation.conservancyFeeBdt.toLocaleString()}
              </span>
              <span>
                {language === 'bn' ? 'সড়কবাতি রেট: ' : 'Streetlight Fee: '}৳{' '}
                {taxCalculation.streetLightFeeBdt.toLocaleString()}
              </span>
            </div>
            <p className="mt-3 text-xs text-slate-600">
              {language === 'bn'
                ? 'দ্রষ্টব্য: এটি একটি প্রাথমিক আনুমানিক হিসাব। চূড়ান্ত কর নির্ধারণ রাজস্ব বিভাগের মাঠপর্যায়ের পরিদর্শন ও সরকারি তফসিলের ওপর নির্ভরশীল।'
                : 'Note: This is an indicative estimate only. Final holding tax assessment is determined by the Revenue Department after official inspection.'}
            </p>
          </div>
        )}
      </section>
    );
  }

  // AUTH GATE for protected interaction modes
  if (service.requiresAuthForAction && !isAuthenticated) {
    return (
      <section
        id="service-action-panel"
        className="rounded-2xl border border-[#006A4E]/30 bg-white p-6 shadow-sm"
      >
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3.5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#ECFDF5] text-[#006A4E]">
              <Lock className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                {language === 'bn'
                  ? 'অনলাইন আবেদন / ব্যক্তিগত তথ্য দেখতে লগইন প্রয়োজন'
                  : 'Sign In Required to Proceed'}
              </h2>
              <p className="mt-1 text-sm leading-relaxed text-slate-600">
                {language === 'bn'
                  ? 'আপনি লগইন ছাড়াই এই সেবার সমস্ত নিয়মাবলি, যোগ্যতা ও প্রয়োজনীয় কাগজপত্র দেখতে পারবেন। অনলাইন আবেদন জমা দিতে বা ব্যক্তিগত রেকর্ড দেখতে আপনার নাগরিক অ্যাকাউন্টে লগইন করুন—লগইনের পর স্বয়ংক্রিয়ভাবে এই ফর্মে ফিরে আসবেন।'
                  : 'All service guidelines, eligibility rules, and document checklists are publicly readable. Sign in to submit your request or view personal records—you will be returned directly to this service form.'}
              </p>
            </div>
          </div>

          <div className="flex shrink-0 flex-wrap items-center gap-2.5">
            <Link
              href={loginRedirectUrl}
              className="inline-flex items-center justify-center rounded-xl bg-[#006A4E] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#00523C] transition-colors"
            >
              {language === 'bn' ? 'লগইন করে আবেদন করুন' : 'Sign In to Continue'}
            </Link>
            <Link
              href={registerRedirectUrl}
              className="inline-flex items-center justify-center rounded-xl border border-[#006A4E] bg-white px-4 py-2.5 text-sm font-semibold text-[#006A4E] hover:bg-[#ECFDF5] transition-colors"
            >
              {language === 'bn' ? 'নতুন নিবন্ধন' : 'Register'}
            </Link>
          </div>
        </div>
      </section>
    );
  }

  // 4. TAX PAYMENT / TAX HISTORY / RECEIPT LOOKUP (Honest payment gateway status — NO fake payment)
  if (
    service.interactionMode === 'tax-payment' ||
    service.interactionMode === 'tax-history' ||
    service.interactionMode === 'receipt-lookup'
  ) {
    return (
      <section
        id="service-action-panel"
        className="rounded-2xl border border-[#006A4E]/30 bg-white p-6 shadow-sm space-y-5"
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ECFDF5] text-[#006A4E]">
              <FileCheck2 className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                {pickText(service.title, language)}
              </h2>
              <p className="text-xs text-slate-500">
                {language === 'bn'
                  ? 'আপনার অ্যাকাউন্টের সাথে সংযুক্ত হোল্ডিং ট্যাক্স ও রসিদ রেকর্ড'
                  : 'Holding tax records and digital receipts linked to your account'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3.5 py-2 text-xs font-semibold text-slate-700 hover:border-[#006A4E] hover:text-[#006A4E] transition-colors cursor-pointer"
          >
            <Printer className="h-3.5 w-3.5" aria-hidden="true" />
            <span>{language === 'bn' ? 'প্রিন্ট করুন' : 'Print View'}</span>
          </button>
        </div>

        {service.interactionMode === 'tax-payment' && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
            <div className="flex items-start gap-2.5">
              <Info className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" aria-hidden="true" />
              <div className="space-y-1">
                <p className="font-bold">
                  {language === 'bn'
                    ? 'অনলাইন পেমেন্ট গেটওয়ে সংযোগ প্রক্রিয়াধীন'
                    : 'Live Payment Gateway Integration Pending'}
                </p>
                <p className="text-xs leading-relaxed text-amber-900">
                  {language === 'bn'
                    ? 'নিরাপদ আর্থিক লেনদেনের জন্য সরকারি চালান / লাইভ পেমেন্ট গেটওয়ে (Ekpay / SSLCommerz / Sonali e-Sheba) সংযোগের কাজ চলমান রয়েছে। এই পোর্টাল থেকে কোনো ভুয়া লেনদেন সম্পন্ন করা হয় না। কর পরিশোধের জন্য অনুগ্রহ করে আপনার আঞ্চলিক রাজস্ব অফিস বা অনুমোদিত ব্যাংক শাখায় যোগাযোগ করুন এবং নিচে আপনার পূর্ববর্তী রসিদগুলো দেখুন।'
                    : 'Live municipal payment gateway integration (Ekpay / Treasury Challan / Bank Gateway) is pending production activation. To protect citizens, this portal does not simulate fake financial checkouts. Please pay via authorized bank branches or your Zonal Revenue Office and review your recorded receipts below.'}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="relative">
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            aria-hidden="true"
          />
          <input
            type="text"
            value={historyFilter}
            onChange={(e) => setHistoryFilter(e.target.value)}
            placeholder={
              language === 'bn'
                ? 'হোল্ডিং নম্বর, রসিদ আইডি বা অর্থবছর দিয়ে খুঁজুন...'
                : 'Filter by holding number, receipt ID, or fiscal year...'
            }
            className="w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] py-2.5 pl-10 pr-4 text-sm text-slate-900 focus:border-[#006A4E] focus:bg-white focus:outline-none"
          />
        </div>

        {loadingPrivateData ? (
          <p className="text-sm text-slate-500">
            {language === 'bn' ? 'তথ্য লোড হচ্ছে...' : 'Loading records...'}
          </p>
        ) : filteredTaxRecords.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-[#F8FAFC] p-5 text-sm text-slate-600">
            {language === 'bn'
              ? 'কোনো হোল্ডিং ট্যাক্স রসিদ পাওয়া যায়নি।'
              : 'No holding tax payment records found matching your query.'}
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-[#E2E8F0]">
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
              <thead className="bg-[#F8FAFC] text-xs font-semibold uppercase tracking-wide text-slate-600">
                <tr>
                  <th className="px-4 py-3">
                    {language === 'bn' ? 'রসিদ নম্বর' : 'Receipt ID'}
                  </th>
                  <th className="px-4 py-3">
                    {language === 'bn' ? 'হোল্ডিং নম্বর' : 'Holding No.'}
                  </th>
                  <th className="px-4 py-3">
                    {language === 'bn' ? 'অর্থবছর' : 'Fiscal Year'}
                  </th>
                  <th className="px-4 py-3">
                    {language === 'bn' ? 'পরিশোধিত পরিমাণ' : 'Amount Paid'}
                  </th>
                  <th className="px-4 py-3">
                    {language === 'bn' ? 'তারিখ' : 'Paid Date'}
                  </th>
                  <th className="px-4 py-3 text-right">
                    {language === 'bn' ? 'যাচাই' : 'Verify'}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {filteredTaxRecords.map((rec) => (
                  <tr key={rec.id} className="hover:bg-[#F8FAFC]/70">
                    <td className="px-4 py-3 font-mono text-xs font-bold text-[#006A4E]">
                      {rec.receiptId}
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-800">
                      {rec.holdingNumber}
                    </td>
                    <td className="px-4 py-3 text-slate-600">{rec.fiscalYear}</td>
                    <td className="px-4 py-3 font-semibold text-slate-900">
                      ৳ {rec.amountPaidBdt.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-slate-600">{rec.paidAt}</td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/verify?id=${encodeURIComponent(rec.receiptId)}`}
                        className="inline-flex items-center gap-1 rounded-lg bg-[#ECFDF5] px-2.5 py-1 text-xs font-semibold text-[#006A4E] hover:bg-emerald-100 transition-colors"
                      >
                        <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>{language === 'bn' ? 'যাচাই' : 'Verify'}</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    );
  }

  // 5. DOCUMENT DOWNLOAD MODE (e.g., Death Certificate Download)
  if (service.interactionMode === 'document-download') {
    return (
      <section
        id="service-action-panel"
        className="rounded-2xl border border-[#006A4E]/30 bg-white p-6 shadow-sm space-y-5"
      >
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ECFDF5] text-[#006A4E]">
            <Download className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {pickText(service.primaryCtaLabel, language)}
            </h2>
            <p className="text-xs text-slate-500">
              {language === 'bn'
                ? 'আপনার অনুমোদিত ডিজিটাল সনদপত্র খুঁজুন ও প্রিন্ট/সংরক্ষণ করুন'
                : 'Locate and print your approved digital certificate records'}
            </p>
          </div>
        </div>

        {service.backendIntegration.missingBackendNote && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs leading-relaxed text-amber-900">
            <strong className="font-semibold">
              {language === 'bn' ? 'সিস্টেম তথ্য: ' : 'Integration Note: '}
            </strong>
            {pickText(service.backendIntegration.missingBackendNote, language)}
          </div>
        )}

        {loadingPrivateData ? (
          <p className="text-sm text-slate-500">
            {language === 'bn' ? 'সনদপত্রের তালিকা লোড হচ্ছে...' : 'Loading certificates...'}
          </p>
        ) : visibleApprovedCertificates.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-[#F8FAFC] p-5 text-sm text-slate-600">
            {language === 'bn'
              ? 'আপনার অ্যাকাউন্টে ডাউনলোডযোগ্য কোনো অনুমোদিত সনদ এখনো যুক্ত হয়নি।'
              : 'No downloadable approved certificates are linked to your account yet.'}
          </div>
        ) : (
          <div className="space-y-3">
            {visibleApprovedCertificates.map((cert) => (
              <div
                key={cert.id}
                className="flex flex-col gap-3 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-mono text-xs font-bold text-[#006A4E]">
                    {cert.referenceId}
                  </p>
                  <p className="mt-0.5 text-sm font-bold text-slate-900">
                    {cert.applicantName}
                  </p>
                  <p className="text-xs text-slate-500">
                    {cert.address} · {cert.submittedAt}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/verify?id=${encodeURIComponent(cert.referenceId)}`}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-[#006A4E] bg-white px-3.5 py-2 text-xs font-semibold text-[#006A4E] hover:bg-[#ECFDF5] transition-colors"
                  >
                    <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>{language === 'bn' ? 'যাচাই ও ভিউ' : 'Verify & View'}</span>
                  </Link>
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-[#006A4E] px-3.5 py-2 text-xs font-semibold text-white hover:bg-[#00523C] transition-colors cursor-pointer"
                  >
                    <Printer className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>{language === 'bn' ? 'প্রিন্ট কপি' : 'Print Copy'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    );
  }

  // 6. APPLICATION / COMPLAINT / FACILITY BOOKING FORM
  return (
    <section
      id="service-action-panel"
      className="rounded-2xl border border-[#006A4E]/30 bg-white p-6 shadow-sm"
    >
      <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ECFDF5] text-[#006A4E]">
            <Send className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {language === 'bn' ? 'অনলাইন আবেদন ফর্ম' : 'Online Service Form'}
            </h2>
            <p className="text-xs text-slate-500">
              {language === 'bn'
                ? 'সঠিক তথ্য ও প্রয়োজনীয় সংযুক্তি দিয়ে ফর্মটি জমা দিন'
                : 'Complete the required fields accurately and attach supporting files'}
            </p>
          </div>
        </div>

        {user && (
          <span className="inline-flex items-center gap-1.5 rounded-md border border-emerald-200 bg-[#ECFDF5] px-2.5 py-1 text-xs font-medium text-[#006A4E]">
            <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
            {language === 'bn' ? user.nameBn : user.nameEn}
          </span>
        )}
      </div>

      {service.backendIntegration.missingBackendNote && (
        <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs leading-relaxed text-amber-900">
          <strong className="font-semibold">
            {language === 'bn' ? 'ব্যাকএন্ড নোট: ' : 'Backend Notice: '}
          </strong>
          {pickText(service.backendIntegration.missingBackendNote, language)}
        </div>
      )}

      {submittedResult ? (
        <div className="rounded-2xl border border-emerald-200 bg-[#ECFDF5]/80 p-6">
          <div className="flex items-start gap-3">
            <CheckCircle2
              className="mt-0.5 h-6 w-6 shrink-0 text-[#006A4E]"
              aria-hidden="true"
            />
            <div className="flex-1">
              <h3 className="text-base font-bold text-[#006A4E]">
                {pickText(submittedResult.statusLabel, language)}
              </h3>
              <p className="mt-1 text-sm leading-relaxed text-slate-700">
                {pickText(submittedResult.summary, language)}
              </p>

              <div className="mt-4 grid grid-cols-1 gap-3 rounded-xl border border-emerald-200 bg-white p-4 sm:grid-cols-3">
                <div>
                  <p className="text-xs text-slate-500">
                    {language === 'bn' ? 'রেফারেন্স আইডি' : 'Reference ID'}
                  </p>
                  <p className="mt-0.5 font-mono text-sm font-bold text-[#006A4E]">
                    {submittedResult.referenceId}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">
                    {language === 'bn' ? 'জমার তারিখ' : 'Submitted Date'}
                  </p>
                  <p className="mt-0.5 text-sm font-semibold text-slate-900">
                    {submittedResult.submittedAt}
                  </p>
                </div>
                {submittedResult.departmentName && (
                  <div>
                    <p className="text-xs text-slate-500">
                      {language === 'bn' ? 'সংশ্লিষ্ট বিভাগ' : 'Assigned Department'}
                    </p>
                    <p className="mt-0.5 flex items-center gap-1 text-sm font-semibold text-slate-900">
                      <Building2 className="h-3.5 w-3.5 text-[#006A4E]" aria-hidden="true" />
                      <span>{pickText(submittedResult.departmentName, language)}</span>
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2.5">
                <Link
                  href={getDashboardPath()}
                  className="inline-flex items-center justify-center rounded-xl bg-[#006A4E] px-4 py-2 text-xs font-semibold text-white hover:bg-[#00523C] transition-colors"
                >
                  {language === 'bn' ? 'ড্যাশবোর্ডে ট্র্যাক করুন' : 'Track in Dashboard'}
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setSubmittedResult(null);
                    setValues({});
                    setFiles({});
                    setErrors({});
                  }}
                  className="inline-flex items-center justify-center rounded-xl border border-[#006A4E] bg-white px-4 py-2 text-xs font-semibold text-[#006A4E] hover:bg-[#ECFDF5] transition-colors cursor-pointer"
                >
                  {language === 'bn' ? 'নতুন আবেদন জমা দিন' : 'Submit Another Request'}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <form onSubmit={handlePortalSubmit} className="space-y-5" noValidate>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {service.formFields.map(renderField)}
          </div>

          {submitError && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-[#C81E1E]">
              {submitError}
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
            <p className="text-xs text-slate-500">
              {language === 'bn'
                ? 'জমা দেওয়ার পূর্বে সকল তথ্য সঠিকভাবে যাচাই করে নিন।'
                : 'Please verify all entered details before submitting your request.'}
            </p>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#006A4E] px-6 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-[#00523C] disabled:opacity-60 transition-colors cursor-pointer"
            >
              <Send className="h-4 w-4" aria-hidden="true" />
              <span>
                {submitting
                  ? language === 'bn'
                    ? 'জমা দেওয়া হচ্ছে...'
                    : 'Submitting...'
                  : pickText(service.primaryCtaLabel, language)}
              </span>
            </button>
          </div>
        </form>
      )}
    </section>
  );
}
