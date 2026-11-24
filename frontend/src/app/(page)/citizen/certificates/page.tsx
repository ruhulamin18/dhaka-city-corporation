'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useApp } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
import { mockApi } from '@/services/mockApi';
import type { ApplicationType, ServiceApplication } from '@/types';
import { AlertCircle, Award, CheckCircle2, FileBadge, Loader2, Printer, X } from 'lucide-react';

interface IssuedCertificate {
  id: string;
  reference: string;
  type: ApplicationType;
  applicantName: string;
  nid: string;
  wardNumber: number;
  issueDate: string;
  issuingAuthority: { bn: string; en: string };
}

const SERVICE_NAMES: Record<ApplicationType, { bn: string; en: string }> = {
  trade_license: { bn: 'ট্রেড লাইসেন্স', en: 'Trade license' },
  birth_certificate: { bn: 'জন্ম নিবন্ধন', en: 'Birth registration' },
  citizen_certificate: { bn: 'নাগরিকত্ব সনদ', en: 'Citizenship certificate' },
  road_digging: { bn: 'সড়ক খনন অনুমতি', en: 'Road digging permit' },
};

function toCertificate(application: ServiceApplication): IssuedCertificate {
  return {
    id: application.id,
    reference: application.referenceId,
    type: application.type,
    applicantName: application.applicantName,
    nid: application.nid,
    wardNumber: application.wardNumber,
    issueDate: application.reviewedAt ?? application.submittedAt,
    issuingAuthority: application.type === 'citizen_certificate'
      ? {
          bn: `কাউন্সিলর সচিবালয় · ওয়ার্ড ${application.wardNumber}`,
          en: `Councillor Secretariat · Ward ${application.wardNumber}`,
        }
      : { bn: 'সংশ্লিষ্ট সেবা বিভাগ', en: 'Responsible service department' },
  };
}

function formatDate(value: string, language: 'bn' | 'en') {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat(language === 'bn' ? 'bn-BD' : 'en-US', { dateStyle: 'medium' }).format(date);
}

export default function CitizenCertificatesPage() {
  const { language } = useApp();
  const { user } = useAuth();
  const [certificates, setCertificates] = useState<IssuedCertificate[]>([]);
  const [selectedCert, setSelectedCert] = useState<IssuedCertificate | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!user) return;
    let active = true;
    queueMicrotask(() => {
      if (active) setIsLoading(true);
    });
    mockApi.getApplications()
      .then((applications) => {
        if (!active) return;
        setCertificates(
          applications
            .filter((application) =>
              (application.citizenId === user.id || application.phone === user.phone) &&
              application.status === 'approved'
            )
            .map(toCertificate)
        );
        setError('');
      })
      .catch((loadError: unknown) => {
        if (active) {
          setError(loadError instanceof Error
            ? loadError.message
            : language === 'bn' ? 'সনদপত্র লোড করা যায়নি।' : 'Unable to load certificates.');
        }
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, [user, language]);

  useEffect(() => {
    if (!selectedCert) return;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    document.documentElement.classList.add('print-certificate-mode');
    closeButtonRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSelectedCert(null);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.documentElement.classList.remove('print-certificate-mode');
      previousFocus?.focus();
    };
  }, [selectedCert]);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <header className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex items-start gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#ECFDF5] text-[#006A4E]"><Award className="h-5 w-5" /></span>
          <div>
            <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">{language === 'bn' ? 'আমার সনদপত্র' : 'My certificates'}</h1>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              {language === 'bn'
                ? 'আপনার অ্যাকাউন্টের অনুমোদিত আবেদন থেকে ইস্যু করা সনদপত্র দেখুন ও প্রিন্ট করুন।'
                : 'View and print certificates associated with applications approved on your account.'}
            </p>
          </div>
        </div>
      </header>

      {error && <p role="alert" className="flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800"><AlertCircle className="h-4 w-4" />{error}</p>}

      {isLoading ? (
        <div role="status" className="rounded-xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-600">
          <Loader2 className="mx-auto mb-2 h-5 w-5 animate-spin text-[#006A4E] motion-reduce:animate-none" />
          {language === 'bn' ? 'সনদপত্র লোড হচ্ছে...' : 'Loading certificates...'}
        </div>
      ) : certificates.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center sm:p-12">
          <FileBadge className="mx-auto h-8 w-8 text-slate-400" />
          <h2 className="mt-3 text-base font-semibold text-slate-900">{language === 'bn' ? 'কোনো অনুমোদিত সনদ নেই' : 'No approved certificates'}</h2>
          <p className="mt-1 text-sm text-slate-600">
            {language === 'bn' ? 'অনুমোদিত আবেদন থেকে ইস্যু হওয়া সনদ এখানে দেখা যাবে।' : 'Certificates from approved applications will appear here.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {certificates.map((certificate) => (
            <article key={certificate.id} className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-[background-color,border-color,transform] duration-300 hover:-translate-y-0.5 hover:border-[#006A4E] hover:bg-[#ECFDF5] motion-reduce:transform-none">
              <div>
                <div className="flex items-start justify-between gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#ECFDF5] text-[#006A4E]"><FileBadge className="h-5 w-5" /></span>
                  <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-800">
                    <CheckCircle2 className="h-3.5 w-3.5" />{language === 'bn' ? 'অনুমোদিত' : 'Approved'}
                  </span>
                </div>
                <p className="mt-4 break-all font-mono text-xs font-semibold text-[#006A4E]">{certificate.reference}</p>
                <h2 className="mt-1 text-base font-semibold text-slate-900">{SERVICE_NAMES[certificate.type][language]}</h2>
                <dl className="mt-4 space-y-2 border-t border-slate-100 pt-3 text-sm">
                  <div className="flex justify-between gap-3">
                    <dt className="text-slate-500">{language === 'bn' ? 'ইস্যুর তারিখ' : 'Issued'}</dt>
                    <dd className="text-right text-slate-800">{formatDate(certificate.issueDate, language)}</dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-slate-500">{language === 'bn' ? 'ওয়ার্ড' : 'Ward'}</dt>
                    <dd className="text-slate-800">{certificate.wardNumber}</dd>
                  </div>
                </dl>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCert(certificate)}
                className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#006A4E] px-4 text-sm font-semibold text-white hover:bg-[#00523C] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#006A4E]"
              >
                <FileBadge className="h-4 w-4" />{language === 'bn' ? 'সনদ দেখুন' : 'View certificate'}
              </button>
            </article>
          ))}
        </div>
      )}

      {selectedCert && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-3 sm:p-6"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setSelectedCert(null);
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="certificate-dialog-title"
            className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between gap-3 border-b border-slate-200 px-4 py-3 sm:px-6">
              <h2 id="certificate-dialog-title" className="text-base font-semibold text-slate-900">{SERVICE_NAMES[selectedCert.type][language]}</h2>
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => window.print()} className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-[#006A4E] px-3 text-sm font-semibold text-white hover:bg-[#00523C]">
                  <Printer className="h-4 w-4" />{language === 'bn' ? 'প্রিন্ট' : 'Print'}
                </button>
                <button
                  ref={closeButtonRef}
                  type="button"
                  aria-label={language === 'bn' ? 'সনদ বন্ধ করুন' : 'Close certificate'}
                  onClick={() => setSelectedCert(null)}
                  className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#006A4E]"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="p-4 sm:p-8">
              <article className="print-certificate space-y-6 rounded-xl border-4 border-double border-[#006A4E] p-5 text-center sm:p-8">
                <div>
                  <p className="text-sm font-bold text-[#006A4E]">{language === 'bn' ? 'ঢাকা সিটি কর্পোরেশন' : 'Dhaka City Corporation'}</p>
                  <p className="mt-1 text-xs text-slate-600">{selectedCert.issuingAuthority[language]}</p>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{SERVICE_NAMES[selectedCert.type][language]}</h3>
                  <p className="mt-2 break-all font-mono text-sm font-semibold text-[#006A4E]">{selectedCert.reference}</p>
                </div>
                <p className="mx-auto max-w-xl text-sm leading-7 text-slate-700">
                  {language === 'bn'
                    ? `${selectedCert.applicantName} (ওয়ার্ড ${selectedCert.wardNumber})-এর আবেদনটি অনুমোদিত হিসেবে রেকর্ড করা হয়েছে।`
                    : `The application for ${selectedCert.applicantName}, Ward ${selectedCert.wardNumber}, is recorded as approved.`}
                </p>
                <dl className="grid grid-cols-1 gap-3 border-t border-slate-200 pt-4 text-left text-sm sm:grid-cols-2">
                  <div><dt className="text-slate-500">{language === 'bn' ? 'জাতীয় পরিচয়পত্র' : 'National ID'}</dt><dd className="font-mono text-slate-800">{selectedCert.nid || '—'}</dd></div>
                  <div><dt className="text-slate-500">{language === 'bn' ? 'অনুমোদনের তারিখ' : 'Approval date'}</dt><dd className="text-slate-800">{formatDate(selectedCert.issueDate, language)}</dd></div>
                </dl>
                <p className="text-xs text-slate-500">
                  {language === 'bn' ? 'এই ডেমো প্রিভিউটি অনুমোদন রেকর্ডের সারাংশ; এটি স্বাক্ষরিত সরকারি নথি নয়।' : 'This demo preview summarizes an approval record; it is not a digitally signed official document.'}
                </p>
              </article>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
