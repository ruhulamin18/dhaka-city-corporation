'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { QRCodeSVG } from 'qrcode.react';
import { CheckCircle2, QrCode, Search, ShieldAlert, ShieldCheck } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { mockApi } from '@/services/mockApi';
import { VerificationResult } from '@/types';
import { StatusBadge } from '@/components/StatusBadge';

const SAMPLE_IDS = [
  'DSCC-TL-2026-4108',
  'DSCC-TAX-2026-7731',
  'DSCC-CERT-2026-1094',
  'DSCC-FAC-2026-309',
];

function VerifyContent() {
  const { language, t } = useApp();
  const searchParams = useSearchParams();
  const initialId = searchParams.get('id') || 'DSCC-TL-2026-4108';

  const [queryId, setQueryId] = useState(initialId);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);

  const runVerification = async (idToVerify: string) => {
    if (!idToVerify.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const res = await mockApi.verifyDocumentById(idToVerify);
      setResult(res);
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

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#006A4E] bg-[#ECFDF5] border border-emerald-200 px-3 py-1 rounded-full mb-3">
          <QrCode className="w-3.5 h-3.5" />
          <span>DSCC Cryptographic Document Registry</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#111827]">{t.verifyPage.title}</h1>
        <p className="mt-2 text-sm sm:text-base text-[#4B5563]">{t.verifyPage.subtitle}</p>
      </div>

      {/* Verification Search Card */}
      <div className="civic-card bg-white rounded-xl border border-[#E2E8F0] p-6 mb-8">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            runVerification(queryId);
          }}
          className="space-y-4"
        >
          <label htmlFor="verify-ref-input" className="block text-sm font-semibold text-[#111827]">
            {t.verifyPage.inputLabel}
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="verify-ref-input"
                type="text"
                value={queryId}
                onChange={(e) => setQueryId(e.target.value)}
                placeholder={t.verifyPage.placeholder}
                className="w-full pl-10 pr-4 py-3 text-sm font-mono border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006A4E]"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-[#006A4E] hover:bg-[#00523C] text-white text-sm font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              {loading ? t.common.loading : t.verifyPage.verifyButton}
            </button>
          </div>
        </form>

        <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-2">
          <span className="text-xs text-[#4B5563]">{t.verifyPage.sampleLabel}</span>
          {SAMPLE_IDS.map((sample) => (
            <button
              key={sample}
              type="button"
              onClick={() => {
                setQueryId(sample);
                runVerification(sample);
              }}
              className="px-2.5 py-1 text-xs font-mono bg-[#ECFDF5] hover:bg-[#006A4E] text-[#006A4E] hover:text-white rounded border border-emerald-200 transition-colors cursor-pointer"
            >
              {sample}
            </button>
          ))}
        </div>
      </div>

      {/* Result State */}
      {!loading && searched && result && (
        <div className="civic-card bg-white rounded-xl border border-[#E2E8F0] overflow-hidden">
          <div className="bg-[#ECFDF5]/60 border-b border-emerald-200 px-6 py-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-[#006A4E]" />
              <span className="font-mono text-sm font-bold text-[#111827]">{result.referenceId}</span>
            </div>
            <StatusBadge
              variant={result.status === 'VERIFIED' ? 'success' : result.status === 'PENDING' ? 'warning' : 'danger'}
              label={result.status === 'VERIFIED' ? t.verifyPage.verifiedBadge : t.verifyPage.pendingBadge}
            />
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            <div className="md:col-span-2 space-y-3 text-sm">
              <div className="flex justify-between gap-4 border-b border-slate-100 pb-2">
                <span className="text-[#4B5563]">{t.verifyPage.fields.docType}</span>
                <span className="font-bold text-[#111827] text-right">
                  {language === 'bn' ? result.documentTypeBn : result.documentTypeEn}
                </span>
              </div>
              <div className="flex justify-between gap-4 border-b border-slate-100 pb-2">
                <span className="text-[#4B5563]">{t.verifyPage.fields.owner}</span>
                <span className="font-semibold text-[#111827] text-right">{result.ownerName}</span>
              </div>
              <div className="flex justify-between gap-4 border-b border-slate-100 pb-2">
                <span className="text-[#4B5563]">{t.verifyPage.fields.ward}</span>
                <span className="font-semibold text-[#111827] tabular-nums">
                  {t.common.ward} {result.wardNumber}
                </span>
              </div>
              <div className="flex justify-between gap-4 border-b border-slate-100 pb-2">
                <span className="text-[#4B5563]">{t.verifyPage.fields.issuedAt}</span>
                <span className="font-semibold text-[#111827] tabular-nums">{result.issuedAt}</span>
              </div>
              <div className="flex justify-between gap-4 border-b border-slate-100 pb-2">
                <span className="text-[#4B5563]">{t.verifyPage.fields.authority}</span>
                <span className="font-medium text-[#111827] text-right">
                  {language === 'bn' ? result.authorityBn : result.authorityEn}
                </span>
              </div>
              {result.amountPaidBdt !== undefined && (
                <div className="flex justify-between gap-4 border-b border-slate-100 pb-2">
                  <span className="text-[#4B5563]">{t.verifyPage.fields.amountPaid}</span>
                  <span className="font-bold text-[#111827] tabular-nums">
                    ৳{result.amountPaidBdt.toLocaleString()}
                  </span>
                </div>
              )}
              <div className="flex justify-between gap-4">
                <span className="text-[#4B5563]">{t.verifyPage.fields.hash}</span>
                <span className="font-mono text-xs text-[#006A4E]">{result.qrHash}</span>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center bg-[#ECFDF5]/50 border border-emerald-200 rounded-xl p-5">
              <QRCodeSVG
                value={`https://dscc.smartcity.gov.bd/verify?id=${result.referenceId}`}
                size={136}
                fgColor="#006A4E"
                bgColor="#FFFFFF"
              />
              <div className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-[#006A4E]">
                <CheckCircle2 className="w-4 h-4" />
                <span>QR Signature Valid</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {!loading && searched && !result && (
        <div className="civic-card bg-white rounded-xl border border-red-200 p-8 text-center">
          <ShieldAlert className="w-10 h-10 text-[#C81E1E] mx-auto mb-3" />
          <h2 className="text-lg font-bold text-[#111827]">{t.verifyPage.notFoundTitle}</h2>
          <p className="text-sm text-[#4B5563] mt-1 max-w-md mx-auto">{t.verifyPage.notFoundDesc}</p>
        </div>
      )}
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={<div className="max-w-4xl mx-auto p-12 text-sm text-slate-500">Loading verification portal...</div>}>
      <VerifyContent />
    </Suspense>
  );
}
