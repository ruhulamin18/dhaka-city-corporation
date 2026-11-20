'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
import {
  Award,
  Download,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Building2,
  Printer,
  X,
  FileBadge,
  Eye,
} from 'lucide-react';

interface IssuedCert {
  id: string;
  certNumber: string;
  title: { bn: string; en: string };
  category: { bn: string; en: string };
  recipientName: string;
  recipientNid: string;
  wardNumber: number;
  issueDate: string;
  validUntil: string;
  issuingAuthority: { bn: string; en: string };
  qrUrl: string;
}

const ISSUED_CERTS: IssuedCert[] = [
  {
    id: 'CRT-001',
    certNumber: 'DSCC-CRT-2026-98124',
    title: { bn: 'নাগরিকত্ব প্রত্যয়নপত্র', en: 'Citizenship Certificate' },
    category: { bn: 'পৌর সনদ', en: 'Civic Certificate' },
    recipientName: 'Md. Ruhul Amin',
    recipientNid: '1992269184723',
    wardNumber: 27,
    issueDate: '2026-01-20',
    validUntil: 'আজীবন বৈধ / Lifetime',
    issuingAuthority: {
      bn: 'কাউন্সিলর কার্যালয়, ওয়ার্ড নং ২৭, ঢাকা দক্ষিণ সিটি কর্পোরেশন',
      en: 'Councillor Office, Ward 27, Dhaka South City Corporation',
    },
    qrUrl: 'https://dscc.gov.bd/online-payment/verification?ref=CERT-2026-98124',
  },
  {
    id: 'CRT-002',
    certNumber: 'DSCC-TRD-2026-19284',
    title: { bn: 'ই-ট্রেড লাইসেন্স সনদপত্র (২০২৫-২৬)', en: 'Digital E-Trade License (2025-26)' },
    category: { bn: 'বাণিজ্য লাইসেন্স', en: 'Trade License' },
    recipientName: 'Md. Ruhul Amin (M/S Meghna Enterprise)',
    recipientNid: '1992269184723',
    wardNumber: 21,
    issueDate: '2026-02-02',
    validUntil: '৩০ জুন, ২০২৬ / 30 June, 2026',
    issuingAuthority: {
      bn: 'বাণিজ্য ও লাইসেন্স শাখা, রাজস্ব বিভাগ, নগর ভবন, ঢাকা',
      en: 'Commerce & Licensing Wing, Nagar Bhaban, Dhaka',
    },
    qrUrl: 'https://dscc.gov.bd/online-payment/verification?ref=TRAD/DSCC/019284/2026',
  },
  {
    id: 'CRT-003',
    certNumber: 'DSCC-CH-2025-44019',
    title: { bn: 'চারিত্রিক প্রত্যয়নপত্র', en: 'Character Certificate' },
    category: { bn: 'পৌর সনদ', en: 'Civic Certificate' },
    recipientName: 'Md. Ruhul Amin',
    recipientNid: '1992269184723',
    wardNumber: 27,
    issueDate: '2025-11-15',
    validUntil: '৬ মাস / 6 Months',
    issuingAuthority: {
      bn: 'কাউন্সিলর কার্যালয়, ওয়ার্ড নং ২৭',
      en: 'Councillor Office, Ward No 27',
    },
    qrUrl: 'https://dscc.gov.bd/online-payment/verification?ref=DSCC-CH-2025-44019',
  },
];

export default function CitizenCertificatesPage() {
  const { language } = useApp();
  const [selectedCert, setSelectedCert] = useState<IssuedCert | null>(null);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-semibold mb-2">
            <Award className="w-3.5 h-3.5 text-blue-600" />
            <span>{language === 'bn' ? 'ডিজিটাল সিলযুক্ত পৌর সনদপত্র' : 'Digitally Certified Records'}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            {language === 'bn' ? 'আমার ইস্যুকৃত সরকারি সনদসমূহ' : 'My Issued Civic Certificates'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            {language === 'bn'
              ? 'সিটি কর্পোরেশন কর্তৃক ইস্যুকৃত সকল নাগরিকত্ব সনদ, ট্রেড লাইসেন্স ও প্রত্যয়নপত্র এখানে ডিজিটাল ফরম্যাটে সংরক্ষিত রয়েছে। যেকোনো সময় প্রিন্ট ও পিডিএফ ডাউনলোড করা যাবে।'
              : 'Official authorized certificates issued by the City Corporation, equipped with verifiable QR codes and legally recognized digital seals.'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {ISSUED_CERTS.map((cert) => (
          <div
            key={cert.id}
            className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between hover:shadow-md hover:border-emerald-500 transition-all group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#006A4E] flex items-center justify-center font-bold">
                  <FileBadge className="w-5 h-5" />
                </div>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-[#006A4E]">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>{language === 'bn' ? 'বৈধ সনদ' : 'Valid'}</span>
                </span>
              </div>

              <div>
                <span className="font-mono text-[11px] font-bold text-emerald-800 block">
                  {cert.certNumber}
                </span>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-[#006A4E] transition-colors mt-0.5">
                  {cert.title[language]}
                </h3>
              </div>

              <div className="text-xs space-y-1 text-slate-600 pt-2 border-t border-slate-100">
                <p>
                  <span className="text-slate-400">{language === 'bn' ? 'প্রাপক: ' : 'Recipient: '}</span>
                  <span className="font-semibold text-slate-800">{cert.recipientName}</span>
                </p>
                <p>
                  <span className="text-slate-400">{language === 'bn' ? 'ইস্যু তারিখ: ' : 'Issued: '}</span>
                  <span>{cert.issueDate}</span>
                </p>
                <p>
                  <span className="text-slate-400">{language === 'bn' ? 'মেয়াদ: ' : 'Validity: '}</span>
                  <span className="font-medium text-slate-700">{cert.validUntil}</span>
                </p>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSelectedCert(cert)}
                className="flex-1 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>{language === 'bn' ? 'সনদ দেখুন' : 'View'}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedCert(cert);
                  setTimeout(() => window.print(), 100);
                }}
                className="py-2 px-3 rounded-xl bg-[#006A4E] hover:bg-[#00523C] text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{language === 'bn' ? 'PDF' : 'PDF'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Official Certificate Inspection Modal */}
      {selectedCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden max-h-[92vh] flex flex-col">
            <div className="bg-emerald-900 text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-300" />
                <span className="text-sm font-bold">{selectedCert.title[language]}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="px-3 py-1 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold flex items-center gap-1"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>{language === 'bn' ? 'প্রিন্ট' : 'Print'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedCert(null)}
                  className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-8 space-y-6 overflow-y-auto print:p-0">
              {/* Institutional Certificate Layout */}
              <div className="border-4 border-double border-emerald-800 p-8 rounded-xl text-center space-y-4 relative bg-radial from-white to-slate-50">
                <div className="w-14 h-14 rounded-full bg-[#006A4E] text-white flex items-center justify-center mx-auto shadow-sm">
                  <Building2 className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900">ঢাকা সিটি কর্পোরেশন</h2>
                  <p className="text-xs font-semibold text-emerald-800">{selectedCert.issuingAuthority[language]}</p>
                  <span className="inline-block mt-2 px-4 py-1 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-950 font-mono text-xs font-bold">
                    সনদ নং: {selectedCert.certNumber}
                  </span>
                </div>

                <div className="py-4 text-sm text-slate-800 leading-relaxed max-w-lg mx-auto">
                  <p>
                    এই মর্মে প্রত্যয়ন করা যাচ্ছে যে, <span className="font-bold">{selectedCert.recipientName}</span>,
                    জাতীয় পরিচয়পত্র নং <span className="font-mono font-bold">{selectedCert.recipientNid}</span>, ওয়ার্ড
                    নং <span className="font-bold">{selectedCert.wardNumber}</span> এর একজন স্থায়ী ও নিয়মিত করদাতা নাগরিক।
                    উক্ত সনদের যাবতীয় তথ্য ঢাকা সিটি কর্পোরেশনের কেন্দ্রীয় ডাটাবেজে যথাযথভাবে নথিভুক্ত রয়েছে।
                  </p>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-slate-200 text-xs">
                  <div className="text-left font-mono">
                    <p className="text-slate-400">QR VERIFICATION</p>
                    <div className="w-16 h-16 bg-slate-900 rounded flex items-center justify-center text-white text-[9px] font-bold mt-1">
                      VALID QR
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                    <div className="inline-flex items-center gap-1 text-emerald-700 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-300">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>ডিজিটালভাবে স্বাক্ষরিত</span>
                    </div>
                    <p className="text-[11px] text-slate-500">মেয়াদ: {selectedCert.validUntil}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
