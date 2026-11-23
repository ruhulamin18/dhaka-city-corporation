'use client';

import React, { Suspense, useEffect, useState, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { QRCodeSVG } from 'qrcode.react';
import {
  CheckCircle2,
  Copy,
  Check,
  Printer,
  QrCode,
  Search,
  ShieldAlert,
  ShieldCheck,
  FileText,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { mockApi } from '@/services/mockApi';
import { VerificationResult } from '@/types';
import { StatusBadge } from '@/components/StatusBadge';
import { buildQrRecordPayload, QR_CONFIG } from '@/config/qr-config';

const SAMPLE_IDS = [
  'DSCC-TL-2026-4108',
  'DSCC-TAX-2026-7731',
  'DSCC-CERT-2026-1094',
  'DSCC-FAC-2026-309',
];

function VerifyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { language, t } = useApp();

  const initialId = searchParams.get('id') || 'DSCC-TL-2026-4108';

  const [queryId, setQueryId] = useState(initialId);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [copiedPayload, setCopiedPayload] = useState(false);
  const [showRawPayload, setShowRawPayload] = useState(false);
  const [, startTransition] = useTransition();

  const runVerification = async (idToVerify: string, updateUrl = true) => {
    const cleanId = idToVerify.trim();
    if (!cleanId) return;

    setLoading(true);
    setSearched(true);

    try {
      const res = await mockApi.verifyDocumentById(cleanId);
      setResult(res);

      if (updateUrl && typeof window !== 'undefined') {
        startTransition(() => {
          const currentUrl = new URL(window.location.href);
          currentUrl.searchParams.set('id', cleanId);
          window.history.replaceState(null, '', currentUrl.toString());
        });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    queueMicrotask(() => {
      if (active) setQueryId(initialId);
    });

    mockApi.verifyDocumentById(initialId).then((res) => {
      if (!active) return;
      setResult(res);
      setSearched(true);
    });

    return () => {
      active = false;
    };
  }, [initialId]);

  // Construct dynamic human-readable QR code payload from verified record
  const dynamicQrPayload = result
    ? buildQrRecordPayload({
        status: result.status,
        id: result.referenceId,
        type: language === 'bn' ? result.documentTypeBn : result.documentTypeEn,
        name: result.ownerName,
        ward: result.wardNumber,
        date: result.issuedAt,
        authority: language === 'bn' ? result.authorityBn : result.authorityEn,
        feePaid: result.amountPaidBdt,
        hash: result.qrHash,
      })
    : '';

  const handleCopyPayload = async () => {
    if (!dynamicQrPayload) return;
    try {
      await navigator.clipboard.writeText(dynamicQrPayload);
      setCopiedPayload(true);
      setTimeout(() => setCopiedPayload(false), 2000);
    } catch {
      // fallback
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Page Header */}
      <div>
        <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#006A4E] bg-[#ECFDF5] border border-emerald-200 px-3 py-1 rounded-full mb-3">
          <QrCode className="w-3.5 h-3.5" />
          <span>
            {language === 'bn'
              ? 'ডিএসসিসি ডিজিটাল সনদ ও রসিদ সত্যতা যাচাই পোর্টাল'
              : 'DSCC Cryptographic Document Registry'}
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#111827] tracking-tight">
          {t.verifyPage.title}
        </h1>
        <p className="mt-2 text-sm sm:text-base text-[#4B5563] max-w-2xl leading-relaxed">
          {t.verifyPage.subtitle}
        </p>
      </div>

      {/* Verification Search Card */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-7 shadow-xs">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            runVerification(queryId, true);
          }}
          className="space-y-4"
        >
          <label htmlFor="verify-ref-input" className="block text-sm font-semibold text-[#111827]">
            {t.verifyPage.inputLabel}
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="verify-ref-input"
                type="text"
                value={queryId}
                onChange={(e) => setQueryId(e.target.value)}
                placeholder={t.verifyPage.placeholder}
                className="w-full pl-10 pr-4 py-3 text-sm font-mono border border-[#E2E8F0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#006A4E] focus:border-[#006A4E] bg-[#F8FAFC] transition-colors"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !queryId.trim()}
              className="px-6 py-3 bg-[#006A4E] hover:bg-[#00523C] text-white text-sm font-semibold rounded-xl transition-colors whitespace-nowrap shrink-0 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 shadow-xs"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>{t.common.loading}</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>{t.verifyPage.verifyButton}</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Sample Reference IDs */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-2">
          <span className="text-xs text-[#4B5563] font-medium mr-1">{t.verifyPage.sampleLabel}</span>
          {SAMPLE_IDS.map((sample) => {
            const isSelected = queryId === sample;
            return (
              <button
                key={sample}
                type="button"
                onClick={() => {
                  setQueryId(sample);
                  runVerification(sample, true);
                }}
                className={`px-3 py-1.5 text-xs font-mono rounded-lg border transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-[#006A4E] text-white border-[#006A4E]'
                    : 'bg-[#ECFDF5] text-[#006A4E] border-emerald-200 hover:bg-[#006A4E] hover:text-white'
                }`}
              >
                {sample}
              </button>
            );
          })}
        </div>
      </div>

      {/* Verified Record Card */}
      {!loading && searched && result && (
        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden">
          {/* Record Top Bar */}
          <div className="bg-[#ECFDF5]/80 border-b border-emerald-200 px-6 py-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-[#006A4E]" />
              <span className="font-mono text-sm font-bold text-[#111827]">
                {result.referenceId}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handlePrint}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors cursor-pointer print:hidden"
              >
                <Printer className="w-3.5 h-3.5 text-slate-600" />
                <span>{language === 'bn' ? 'প্রিন্ট রেকর্ড' : 'Print Slip'}</span>
              </button>
              <StatusBadge
                variant={
                  result.status === 'VERIFIED'
                    ? 'success'
                    : result.status === 'PENDING'
                    ? 'warning'
                    : 'danger'
                }
                label={
                  result.status === 'VERIFIED'
                    ? t.verifyPage.verifiedBadge
                    : t.verifyPage.pendingBadge
                }
              />
            </div>
          </div>

          <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Record Attribute Rows */}
            <div className="lg:col-span-7 space-y-3.5 text-sm">
              <div className="flex justify-between gap-4 border-b border-slate-100 pb-2.5">
                <span className="text-[#4B5563]">{t.verifyPage.fields.docType}</span>
                <span className="font-bold text-[#111827] text-right">
                  {language === 'bn' ? result.documentTypeBn : result.documentTypeEn}
                </span>
              </div>
              <div className="flex justify-between gap-4 border-b border-slate-100 pb-2.5">
                <span className="text-[#4B5563]">{t.verifyPage.fields.owner}</span>
                <span className="font-semibold text-[#111827] text-right">{result.ownerName}</span>
              </div>
              <div className="flex justify-between gap-4 border-b border-slate-100 pb-2.5">
                <span className="text-[#4B5563]">{t.verifyPage.fields.ward}</span>
                <span className="font-semibold text-[#111827] tabular-nums">
                  {t.common.ward} {result.wardNumber}
                </span>
              </div>
              <div className="flex justify-between gap-4 border-b border-slate-100 pb-2.5">
                <span className="text-[#4B5563]">{t.verifyPage.fields.issuedAt}</span>
                <span className="font-semibold text-[#111827] tabular-nums">{result.issuedAt}</span>
              </div>
              <div className="flex justify-between gap-4 border-b border-slate-100 pb-2.5">
                <span className="text-[#4B5563]">{t.verifyPage.fields.authority}</span>
                <span className="font-medium text-[#111827] text-right">
                  {language === 'bn' ? result.authorityBn : result.authorityEn}
                </span>
              </div>
              {result.amountPaidBdt !== undefined && (
                <div className="flex justify-between gap-4 border-b border-slate-100 pb-2.5">
                  <span className="text-[#4B5563]">{t.verifyPage.fields.amountPaid}</span>
                  <span className="font-bold text-[#006A4E] tabular-nums">
                    ৳{result.amountPaidBdt.toLocaleString('en-IN')}
                  </span>
                </div>
              )}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1">
                <span className="text-[#4B5563] text-xs">{t.verifyPage.fields.hash}</span>
                <span className="font-mono text-xs text-[#006A4E] bg-[#ECFDF5] px-2.5 py-1 rounded-md border border-emerald-200 break-all">
                  {result.qrHash}
                </span>
              </div>
            </div>

            {/* QR Code Dynamic Card */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-6 text-center">
              <div className="bg-white p-3.5 rounded-xl border border-emerald-200 shadow-xs">
                <QRCodeSVG
                  value={dynamicQrPayload}
                  size={144}
                  level="M"
                  fgColor="#006A4E"
                  bgColor="#FFFFFF"
                />
              </div>

              <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-[#006A4E]">
                <CheckCircle2 className="w-4 h-4 text-[#006A4E]" />
                <span>
                  {language === 'bn'
                    ? 'স্ক্যানার সমর্থিত তাৎক্ষণিক বিবরণী QR'
                    : 'Dynamic Multi-Line Record Payload'}
                </span>
              </div>

              <p className="mt-1.5 text-[11px] text-[#4B5563] max-w-[240px] leading-relaxed">
                {language === 'bn'
                  ? 'যেকোনো মোবাইল ক্যামেরা দিয়ে স্ক্যান করলে ইন্টারনেট ছাড়াও অফিসিয়াল তথ্যাবলী অবিলম্বে দৃশ্যমান হবে।'
                  : 'Scan with any phone camera to display verified record fields directly on screen.'}
              </p>

              {/* Action buttons for QR */}
              <div className="mt-4 flex flex-wrap items-center justify-center gap-2 w-full pt-3 border-t border-slate-200/80">
                <button
                  type="button"
                  onClick={handleCopyPayload}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors cursor-pointer"
                  title="Copy QR text payload"
                >
                  {copiedPayload ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-500" />
                      <span>{language === 'bn' ? 'টেক্সট কপি' : 'Copy Text'}</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setShowRawPayload(!showRawPayload)}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5 text-slate-500" />
                  <span>
                    {showRawPayload
                      ? language === 'bn'
                        ? 'লুকান'
                        : 'Hide'
                      : language === 'bn'
                      ? 'পে-লোড দেখুন'
                      : 'Inspect'}
                  </span>
                </button>
              </div>

              {/* Collapsible raw payload preview */}
              {showRawPayload && (
                <div className="mt-3 w-full text-left bg-slate-900 text-slate-200 p-3 rounded-xl text-[11px] font-mono leading-relaxed overflow-x-auto select-all">
                  <pre className="whitespace-pre-wrap">{dynamicQrPayload}</pre>
                  {QR_CONFIG.ENABLE_LIVE_URL && (
                    <div className="mt-2 pt-2 border-t border-slate-700 text-[10px] text-emerald-400">
                      ✓ Live URL Verification link active
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Empty / Not Found State */}
      {!loading && searched && !result && (
        <div className="bg-white rounded-2xl border border-red-200 p-8 sm:p-10 text-center">
          <ShieldAlert className="w-10 h-10 text-[#C81E1E] mx-auto mb-3" />
          <h2 className="text-lg font-bold text-[#111827]">{t.verifyPage.notFoundTitle}</h2>
          <p className="text-sm text-[#4B5563] mt-1.5 max-w-md mx-auto leading-relaxed">
            {t.verifyPage.notFoundDesc}
          </p>
        </div>
      )}
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-4xl mx-auto px-4 py-16 text-center text-sm text-slate-500">
          Loading verification portal...
        </div>
      }
    >
      <VerifyContent />
    </Suspense>
  );
}
