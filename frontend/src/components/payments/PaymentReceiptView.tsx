'use client';

import React from 'react';
import Link from 'next/link';
import { QRCodeSVG } from 'qrcode.react';
import { useApp } from '@/context/AppContext';
import { PaymentReceipt } from '@/types/payment';
import { buildQrRecordPayload, QR_CONFIG } from '@/config/qr-config';
import {
  Printer,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Building2,
  Share2,
  Download,
} from 'lucide-react';

interface PaymentReceiptViewProps {
  receipt: PaymentReceipt;
}

export const PaymentReceiptView: React.FC<PaymentReceiptViewProps> = ({ receipt }) => {
  const { language } = useApp();

  const qrPayload = buildQrRecordPayload({
    status: 'VERIFIED',
    id: receipt.receiptNumber,
    type: language === 'bn' ? receipt.serviceName.bn : receipt.serviceName.en,
    name: receipt.payerName,
    ward: receipt.wardNumber,
    date: receipt.paidAt,
    authority: language === 'bn' ? QR_CONFIG.AUTHORITY_NAME_BN : QR_CONFIG.AUTHORITY_NAME_EN,
    feePaid: receipt.breakdown.total,
    hash: receipt.verificationReference,
  });

  const handlePrint = () => {
    window.print();
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString(language === 'bn' ? 'bn-BD' : 'en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar (hidden on print) */}
      <div className="print:hidden flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex items-center space-x-2">
          <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-semibold text-emerald-800">
            {language === 'bn' ? 'বৈধ সরকারি ডিজিটাল রসিদ' : 'Verified Official Digital Receipt'}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <Link
            href={`/online-payment/verification?ref=${receipt.receiptNumber}`}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>{language === 'bn' ? 'অনলাইন যাচাই' : 'Verify Online'}</span>
          </Link>
          <button
            onClick={handlePrint}
            className="inline-flex items-center space-x-1.5 px-4 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors shadow-xs cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? 'রশিদ প্রিন্ট / PDF সংরক্ষণ' : 'Print / Save PDF'}</span>
          </button>
        </div>
      </div>

      {/* Printable Receipt Container */}
      <div
        id="official-receipt-print"
        className="bg-white rounded-2xl border-2 border-slate-300 shadow-md p-6 sm:p-10 relative overflow-hidden print:border-none print:shadow-none print:p-0"
      >
        {/* Subtle Watermark */}
        <div className="absolute inset-0 flex items-center justify-center opacity-4 pointer-events-none select-none">
          <Building2 className="w-96 h-96 text-emerald-900" />
        </div>

        {/* Institutional Government Header */}
        <div className="border-b-2 border-emerald-800/80 pb-6 text-center space-y-2 relative z-10">
          <div className="w-14 h-14 rounded-full bg-emerald-700 text-white flex items-center justify-center mx-auto shadow-sm">
            <Building2 className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              {language === 'bn' ? 'ঢাকা সিটি কর্পোরেশন' : 'Dhaka City Corporation'}
            </h2>
            <p className="text-xs sm:text-sm font-semibold text-emerald-800">
              {language === 'bn' ? 'রাজস্ব বিভাগ ও কেন্দ্রীয় ই-ট্রেজারি শাখা' : 'Revenue Department & Central e-Treasury Branch'}
            </p>
            <p className="text-[11px] text-slate-500">
              {language === 'bn' ? 'নগর ভবন, ঢাকা | হেল্পলাইন: ১৬১০৬' : 'Nagar Bhaban, Dhaka | Helpline: 16106'}
            </p>
          </div>

          <div className="inline-block mt-2 px-4 py-1 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold uppercase tracking-wider">
            {language === 'bn' ? 'অফিসিয়াল ই-পেমেন্ট আদায় রশিদ' : 'Official E-Payment Realization Receipt'}
          </div>
        </div>

        {/* Meta Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-b border-slate-200 text-xs relative z-10">
          <div>
            <span className="text-slate-500 block mb-0.5">{language === 'bn' ? 'রশিদ নম্বর' : 'Receipt Number'}</span>
            <span className="font-mono font-bold text-slate-900 text-sm">{receipt.receiptNumber}</span>
          </div>
          <div>
            <span className="text-slate-500 block mb-0.5">{language === 'bn' ? 'তারিখ ও সময়' : 'Date & Time'}</span>
            <span className="font-medium text-slate-800">{formatDate(receipt.paidAt)}</span>
          </div>
          <div>
            <span className="text-slate-500 block mb-0.5">{language === 'bn' ? 'ট্রানজেকশন রেফারেন্স' : 'Transaction Ref'}</span>
            <span className="font-mono font-semibold text-slate-800">{receipt.transactionReference}</span>
          </div>
          <div>
            <span className="text-slate-500 block mb-0.5">{language === 'bn' ? 'পরিশোধের মাধ্যম' : 'Payment Method'}</span>
            <span className="font-semibold text-emerald-700 uppercase">{receipt.paymentMethod}</span>
          </div>
        </div>

        {/* Payer & Service Details */}
        <div className="py-6 grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
          <div className="space-y-2 text-xs">
            <h4 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider text-emerald-800">
              {language === 'bn' ? 'করদাতা / আবেদনকারীর তথ্য' : 'Taxpayer / Applicant Info'}
            </h4>
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1.5">
              <p>
                <span className="text-slate-500">{language === 'bn' ? 'পূর্ণ নাম: ' : 'Full Name: '}</span>
                <span className="font-bold text-slate-900">{receipt.payerName}</span>
              </p>
              <p>
                <span className="text-slate-500">{language === 'bn' ? 'মোবাইল: ' : 'Mobile: '}</span>
                <span className="font-medium text-slate-800">{receipt.payerPhone}</span>
              </p>
              {receipt.payerAddress && (
                <p>
                  <span className="text-slate-500">{language === 'bn' ? 'ঠিকানা: ' : 'Address: '}</span>
                  <span className="text-slate-700">{receipt.payerAddress}</span>
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <h4 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider text-emerald-800">
              {language === 'bn' ? 'সেবা ও আওতাধীন অঞ্চল' : 'Service & Jurisdiction'}
            </h4>
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1.5">
              <p>
                <span className="text-slate-500">{language === 'bn' ? 'সেবার খাত: ' : 'Service Type: '}</span>
                <span className="font-bold text-slate-900">{receipt.serviceName[language]}</span>
              </p>
              <p>
                <span className="text-slate-500">{language === 'bn' ? 'হোল্ডিং/লাইসেন্স নং: ' : 'Holding/License No: '}</span>
                <span className="font-mono font-bold text-emerald-800">{receipt.serviceReference}</span>
              </p>
              <p>
                <span className="text-slate-500">{language === 'bn' ? 'ওয়ার্ড নম্বর: ' : 'Ward No: '}</span>
                <span className="font-bold text-slate-800">{receipt.wardNumber}</span>
                {receipt.fiscalYear && (
                  <span className="ml-3 text-slate-500 font-normal">
                    ({language === 'bn' ? 'অর্থবছর: ' : 'FY: '} {receipt.fiscalYear})
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Breakdown Table */}
        <div className="relative z-10 mb-6">
          <div className="overflow-x-auto rounded-xl border border-slate-300">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 border-b border-slate-300 text-slate-700 font-bold uppercase text-[11px]">
                <tr>
                  <th className="px-4 py-2.5">#</th>
                  <th className="px-4 py-2.5">{language === 'bn' ? 'আদায়কৃত খাতের বিবরণ' : 'Description of Realization'}</th>
                  <th className="px-4 py-2.5 text-right">{language === 'bn' ? 'পরিমাণ (টাকা)' : 'Amount (BDT)'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-800">
                {receipt.breakdown.items.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="px-4 py-2 text-slate-500 font-mono">{idx + 1}</td>
                    <td className="px-4 py-2 font-medium">{item.label}</td>
                    <td className="px-4 py-2 text-right font-mono font-semibold">
                      ৳{item.amount.toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
                <tr className="bg-emerald-50 text-emerald-950 font-bold border-t-2 border-emerald-700 text-sm">
                  <td colSpan={2} className="px-4 py-3 text-right">
                    {language === 'bn' ? 'সর্বমোট আদায়কৃত অর্থ' : 'Total Amount Realized'}
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-emerald-900 text-base">
                    ৳{receipt.breakdown.total.toLocaleString('en-IN')}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Verification QR & Seals */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-200 items-center relative z-10 text-xs">
          <div className="flex items-center space-x-4">
            <div className="bg-white border-2 border-emerald-300 rounded-lg p-1.5 flex flex-col items-center justify-center shrink-0 text-center font-mono text-[9px] text-slate-600 shadow-xs">
              <QRCodeSVG
                value={qrPayload}
                size={76}
                level="M"
                fgColor="#006A4E"
                bgColor="#FFFFFF"
              />
              <span className="mt-1 font-mono text-[9px] text-[#006A4E] font-bold truncate max-w-[80px]">
                {receipt.receiptNumber}
              </span>
            </div>
            <div>
              <p className="font-bold text-slate-900">
                {language === 'bn' ? 'অনলাইন সত্যতা যাচাই কোড' : 'Digital Verification Token'}
              </p>
              <p className="font-mono text-[11px] text-emerald-800 font-bold mt-0.5">
                {receipt.verificationReference}
              </p>
              <p className="text-[10px] text-slate-500 mt-1">
                {language === 'bn'
                  ? 'এই রসিদের সঠিকতা যাচাই করতে উপরের কিউআর কোড স্ক্যান করুন অথবা dscc.gov.bd ভিজিট করুন।'
                  : 'Scan QR code or visit dscc.gov.bd/online-payment/verification to verify.'}
              </p>
            </div>
          </div>

          <div className="text-right space-y-1">
            <div className="inline-flex items-center space-x-1.5 text-emerald-700 font-bold text-xs bg-emerald-50 px-3 py-1 rounded-full border border-emerald-300">
              <CheckCircle2 className="w-4 h-4" />
              <span>{language === 'bn' ? 'ইলেকট্রনিক্যালি সত্যায়িত' : 'Electronically Verified'}</span>
            </div>
            <p className="text-[10px] text-slate-500 italic">
              {receipt.notes?.[language] ||
                (language === 'bn'
                  ? 'এটি একটি কম্পিউটার জেনারেটেড সরকারি পেমেন্ট রশিদ, যাতে কোন ম্যানুয়াল স্বাক্ষরের প্রয়োজন নেই।'
                  : 'This is a computer-generated official receipt requiring no physical signature.')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
