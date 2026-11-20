'use client';

import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { CheckCircle2, Landmark, Printer, ShieldCheck, X } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export interface QrCertificateData {
  referenceId: string;
  titleEn: string;
  titleBn: string;
  ownerName: string;
  wardNumber: number;
  issuedAt: string;
  amountBdt: number;
  transactionId?: string;
  status: string;
  qrHash: string;
  extraMeta?: string;
}

interface QrCertificateModalProps {
  open: boolean;
  data: QrCertificateData | null;
  onClose: () => void;
}

export function QrCertificateModal({ open, data, onClose }: QrCertificateModalProps) {
  const { language, t } = useApp();

  if (!open || !data) return null;

  const verifyUrl = `https://dscc.smartcity.gov.bd/verify?id=${encodeURIComponent(data.referenceId)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="print-only-sheet bg-white rounded-xl border border-slate-200 max-w-xl w-full overflow-hidden shadow-2xl my-8">
        <div className="no-print bg-slate-50 border-b border-slate-200 px-6 py-3 flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-600">
            {language === 'bn' ? 'ডিজিটাল সনদ ও QR রসিদ প্রিভিউ' : 'Official QR Digital Certificate & Receipt'}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-[#006A4E] hover:bg-[#00523C] rounded-lg transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{t.common.printPdf}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-[#4B5563] hover:text-[#111827] rounded-lg cursor-pointer"
              aria-label={t.common.close}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Official Sheet */}
        <div className="p-8 space-y-6">
          <div className="flex items-start justify-between border-b-2 border-[#006A4E] pb-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#006A4E] text-white flex items-center justify-center shrink-0">
                <Landmark className="w-6 h-6 text-emerald-200" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#006A4E]">
                  {language === 'bn' ? 'ঢাকা স্মার্ট সিটি কর্পোরেশন' : 'Dhaka Smart City Corporation'}
                </h2>
                <p className="text-xs text-[#4B5563]">
                  {language === 'bn'
                    ? 'নগর ভবন, ঢাকা-১০০০ · ডিজিটাল ই-সার্ভিস বিভাগ'
                    : 'Nagar Bhaban, Dhaka-1000 · Digital E-Service Authority'}
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#ECFDF5] text-[#006A4E] border border-emerald-200 text-xs font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {data.status.toUpperCase()}
              </span>
            </div>
          </div>

          <div className="text-center py-1">
            <h3 className="text-xl font-bold text-[#111827]">
              {language === 'bn' ? data.titleBn : data.titleEn}
            </h3>
            <p className="text-xs font-mono text-[#4B5563] mt-1 tabular-nums">
              REF: {data.referenceId}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-center bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-5">
            <div className="sm:col-span-2 space-y-2.5 text-sm">
              <div className="flex justify-between gap-4 border-b border-[#E2E8F0] pb-1.5">
                <span className="text-[#4B5563]">{language === 'bn' ? 'প্রাপকের নাম' : 'Issued To'}</span>
                <span className="font-semibold text-[#111827] text-right">{data.ownerName}</span>
              </div>
              <div className="flex justify-between gap-4 border-b border-[#E2E8F0] pb-1.5">
                <span className="text-[#4B5563]">{language === 'bn' ? 'ওয়ার্ড নম্বর' : 'Ward Jurisdiction'}</span>
                <span className="font-semibold text-[#111827] tabular-nums">
                  {t.common.ward} {data.wardNumber}
                </span>
              </div>
              <div className="flex justify-between gap-4 border-b border-[#E2E8F0] pb-1.5">
                <span className="text-[#4B5563]">{language === 'bn' ? 'ইস্যুর তারিখ' : 'Issue Date'}</span>
                <span className="font-semibold text-[#111827] tabular-nums">{data.issuedAt}</span>
              </div>
              <div className="flex justify-between gap-4 border-b border-[#E2E8F0] pb-1.5">
                <span className="text-[#4B5563]">{language === 'bn' ? 'পরিশোধিত ফি' : 'Fee Paid'}</span>
                <span className="font-bold text-[#006A4E] tabular-nums">
                  ৳{data.amountBdt.toLocaleString()}
                </span>
              </div>
              {data.transactionId && (
                <div className="flex justify-between gap-4">
                  <span className="text-[#4B5563]">{language === 'bn' ? 'ট্রানজেকশন আইডি' : 'Transaction ID'}</span>
                  <span className="font-mono text-xs text-[#111827]">{data.transactionId}</span>
                </div>
              )}
              {data.extraMeta && (
                <p className="text-xs text-[#4B5563] pt-1">{data.extraMeta}</p>
              )}
            </div>

            <div className="flex flex-col items-center justify-center bg-white border border-[#E2E8F0] rounded-lg p-3">
              <QRCodeSVG
                value={verifyUrl}
                size={112}
                level="M"
                fgColor="#006A4E"
                bgColor="#FFFFFF"
              />
              <span className="text-[10px] font-mono text-[#4B5563] mt-2 text-center">
                SCAN TO VERIFY
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-[#E2E8F0] text-xs text-[#4B5563]">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#006A4E]" />
              <span className="font-mono">{data.qrHash}</span>
            </div>
            <span>
              {language === 'bn'
                ? 'সিস্টেম জেনারেটেড · স্বাক্ষর নিষ্প্রয়োজন'
                : 'Digitally Signed · Verify at /verify'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
