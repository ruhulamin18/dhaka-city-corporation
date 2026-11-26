'use client';

import React, { useState } from 'react';
import {
  Receipt,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Download,
  DollarSign,
  TrendingUp,
  CreditCard,
  Building2,
  Calendar,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';

interface TransactionRecord {
  id: string;
  trxId: string;
  referenceId: string;
  payerName: string;
  purpose: string;
  amountBdt: number;
  gateway: 'bkash' | 'nagad' | 'sonali_bank' | 'card';
  status: 'successful' | 'reconciled' | 'pending';
  timestamp: string;
  wardNumber: number;
}

const SEEDED_TRANSACTIONS: TransactionRecord[] = [
  {
    id: 'tx-01',
    trxId: 'BK-20261120-9482',
    referenceId: 'DSCC-HT-2026-4819',
    payerName: 'Md. Ruhul Amin',
    purpose: 'Holding Tax (FY 2025-26)',
    amountBdt: 14750,
    gateway: 'bkash',
    status: 'reconciled',
    timestamp: '2026-11-20 18:45',
    wardNumber: 27,
  },
  {
    id: 'tx-02',
    trxId: 'SB-20261120-1102',
    referenceId: 'DSCC-TL-2026-3021',
    payerName: 'Tahsina Rahman (Delta Tech)',
    purpose: 'Trade License Renewal',
    amountBdt: 3450,
    gateway: 'sonali_bank',
    status: 'reconciled',
    timestamp: '2026-11-20 16:10',
    wardNumber: 19,
  },
  {
    id: 'tx-03',
    trxId: 'NG-20261120-7731',
    referenceId: 'DSCC-CERT-2026-8812',
    payerName: 'Kamrul Hasan',
    purpose: 'Citizenship Certificate',
    amountBdt: 100,
    gateway: 'nagad',
    status: 'successful',
    timestamp: '2026-11-20 14:22',
    wardNumber: 24,
  },
  {
    id: 'tx-04',
    trxId: 'CD-20261120-6644',
    referenceId: 'DSCC-RD-2026-9041',
    payerName: 'DESCO Distribution Division',
    purpose: 'Road Cutting Security Deposit',
    amountBdt: 14375,
    gateway: 'card',
    status: 'reconciled',
    timestamp: '2026-11-20 11:05',
    wardNumber: 12,
  },
  {
    id: 'tx-05',
    trxId: 'BK-20261119-3329',
    referenceId: 'DSCC-HT-2026-7720',
    payerName: 'Alhaj Nurul Islam',
    purpose: 'Holding Tax Q1 & Q2',
    amountBdt: 22800,
    gateway: 'bkash',
    status: 'reconciled',
    timestamp: '2026-11-19 15:30',
    wardNumber: 12,
  },
];

export default function AdminPaymentsPage() {
  const { language } = useApp();
  const [transactions, setTransactions] = useState<TransactionRecord[]>(SEEDED_TRANSACTIONS);
  const [searchQuery, setSearchQuery] = useState('');
  const [gatewayFilter, setGatewayFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = transactions.filter((tx) => {
    const matchesSearch =
      tx.trxId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.referenceId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.payerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.purpose.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesGateway = gatewayFilter === 'all' || tx.gateway === gatewayFilter;
    const matchesStatus = statusFilter === 'all' || tx.status === statusFilter;

    return matchesSearch && matchesGateway && matchesStatus;
  });

  const totalCollected = transactions.reduce((acc, tx) => acc + tx.amountBdt, 0);

  const handleExportCSV = () => {
    const headers = ['Transaction ID', 'Reference ID', 'Payer Name', 'Purpose', 'Amount (BDT)', 'Gateway', 'Status', 'Timestamp'];
    const rows = filtered.map((tx) => [
      tx.trxId,
      tx.referenceId,
      `"${tx.payerName}"`,
      `"${tx.purpose}"`,
      tx.amountBdt,
      tx.gateway,
      tx.status,
      tx.timestamp,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `DSCC_Revenue_Reconciliation_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-[#ECFDF5] text-[#006A4E] text-xs font-semibold uppercase tracking-wider mb-2">
              <Receipt className="w-3.5 h-3.5" />
              {language === 'bn' ? 'রাজস্ব লেজার ও ব্যাংক সমাধান' : 'Revenue Ledger & Bank Reconciliation'}
            </div>
            <h1 className="text-2xl font-bold text-slate-900">
              {language === 'bn' ? 'পেমেন্ট ব্যবস্থাপনা ও রাজস্ব হিসাব' : 'Payment Reconciliation Console'}
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              {language === 'bn'
                ? 'অনলাইন পেমেন্ট গেটওয়ে, সোনালী ব্যাংক ই-সেবা ও চালান লেনদেনের রিয়েল-টাইম হিসাব।'
                : 'Monitor incoming civic revenue streams across bKash, Nagad, cards, and Sonali Bank e-Challan gateway.'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#006A4E] text-white text-xs font-semibold rounded-lg hover:bg-[#00523c] transition shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              {language === 'bn' ? 'এক্সপোর্ট CSV' : 'Export Reconciliation CSV'}
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            {language === 'bn' ? 'আজকের রাজস্ব সংগ্রহ' : "Today's Collection"}
          </span>
          <div className="text-2xl font-black text-slate-900 mt-1">
            ৳ {totalCollected.toLocaleString('en-US')}
          </div>
          <span className="text-xs text-emerald-600 font-semibold mt-1 inline-block">
            {transactions.length} Verified Transactions
          </span>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            {language === 'bn' ? 'ব্যাংক সমাধান সম্পন্ন' : 'Reconciled With Treasury'}
          </span>
          <div className="text-2xl font-black text-emerald-700 mt-1">
            98.5%
          </div>
          <span className="text-xs text-slate-500 mt-1 inline-block">
            Auto-cleared via Bangladesh Bank RTGS
          </span>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            {language === 'bn' ? 'সক্রিয় গেটওয়ে' : 'Connected Gateways'}
          </span>
          <div className="text-2xl font-black text-slate-900 mt-1">
            4 Gateways
          </div>
          <span className="text-xs text-slate-500 mt-1 inline-block">
            bKash • Nagad • Sonali Bank • Cards
          </span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                language === 'bn'
                  ? 'TrxID, রেফারেন্স নম্বর বা নাগরিকের নাম...'
                  : 'Search by TrxID, Reference ID, payer...'
              }
              className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006A4E]"
            />
          </div>

          <div>
            <select
              value={gatewayFilter}
              onChange={(e) => setGatewayFilter(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006A4E]"
            >
              <option value="all">{language === 'bn' ? 'সকল গেটওয়ে' : 'All Gateways'}</option>
              <option value="bkash">{language === 'bn' ? 'বিকাশ' : 'bKash'}</option>
              <option value="nagad">{language === 'bn' ? 'নগদ' : 'Nagad'}</option>
              <option value="sonali_bank">{language === 'bn' ? 'সোনালী ব্যাংক' : 'Sonali Bank'}</option>
              <option value="card">{language === 'bn' ? 'কার্ড (ডেবিট / ক্রেডিট)' : 'Cards / Debit / Credit'}</option>
            </select>
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006A4E]"
            >
              <option value="all">{language === 'bn' ? 'সকল স্ট্যাটাস' : 'All Statuses'}</option>
              <option value="reconciled">{language === 'bn' ? 'সমন্বিত' : 'Reconciled'}</option>
              <option value="successful">{language === 'bn' ? 'সফল' : 'Successful'}</option>
              <option value="pending">{language === 'bn' ? 'অপেক্ষমাণ' : 'Pending'}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600 text-xs uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="p-3.5">{language === 'bn' ? 'লেনদেন আইডি' : 'Transaction ID'}</th>
                <th className="p-3.5">{language === 'bn' ? 'রেফারেন্স আইডি' : 'Reference ID'}</th>
                <th className="p-3.5">{language === 'bn' ? 'প্রদানকারী / ওয়ার্ড' : 'Payer / Ward'}</th>
                <th className="p-3.5">{language === 'bn' ? 'উদ্দেশ্য' : 'Purpose'}</th>
                <th className="p-3.5">{language === 'bn' ? 'পরিমাণ' : 'Amount'}</th>
                <th className="p-3.5">{language === 'bn' ? 'গেটওয়ে' : 'Gateway'}</th>
                <th className="p-3.5">{language === 'bn' ? 'অবস্থা' : 'Status'}</th>
                <th className="p-3.5">{language === 'bn' ? 'তারিখ ও সময়' : 'Date & Time'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50/60 transition">
                  <td className="p-3.5 font-mono font-bold text-slate-900 text-xs">
                    {tx.trxId}
                  </td>
                  <td className="p-3.5 font-mono text-xs text-slate-600">
                    {tx.referenceId}
                  </td>
                  <td className="p-3.5">
                    <div className="font-semibold text-slate-900">{tx.payerName}</div>
                    <div className="text-[11px] text-slate-400">Ward {tx.wardNumber}</div>
                  </td>
                  <td className="p-3.5 text-xs text-slate-700 font-medium">
                    {tx.purpose}
                  </td>
                  <td className="p-3.5 font-bold text-slate-900">
                    ৳ {tx.amountBdt.toLocaleString('en-US')}
                  </td>
                  <td className="p-3.5">
                    <span className="capitalize text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {tx.gateway.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="p-3.5">
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                        tx.status === 'reconciled'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : tx.status === 'successful'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {tx.status}
                    </span>
                  </td>
                  <td className="p-3.5 text-xs text-slate-500 font-mono">
                    {tx.timestamp}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
