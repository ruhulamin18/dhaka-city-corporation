'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { PaymentServiceType, PaymentTransaction } from '@/types/payment';
import {
  Search,
  Filter,
  CheckCircle2,
  Clock,
  XCircle,
  Eye,
  FileCheck2,
  Download,
} from 'lucide-react';

interface PaymentHistoryTableProps {
  transactions: PaymentTransaction[];
}

export const PaymentHistoryTable: React.FC<PaymentHistoryTableProps> = ({ transactions }) => {
  const { language } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('ALL');

  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch =
      t.transactionReference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.serviceReference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.receiptNumber && t.receiptNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
      t.payerName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = selectedType === 'ALL' || t.serviceType === selectedType;

    return matchesSearch && matchesType;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'SUCCESS':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
            {language === 'bn' ? 'সফল' : 'Success'}
          </span>
        );
      case 'INITIATED':
      case 'PENDING':
      case 'PROCESSING':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3.5 h-3.5 mr-1" />
            {language === 'bn' ? 'প্রক্রিয়াধীন' : 'Pending'}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <XCircle className="w-3.5 h-3.5 mr-1" />
            {language === 'bn' ? 'ব্যর্থ' : 'Failed'}
          </span>
        );
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    if (Number.isNaN(date.getTime())) return dateStr;
    return date.toLocaleDateString(language === 'bn' ? 'bn-BD' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Search & Filter Header */}
      <div className="p-4 sm:p-6 border-b border-slate-200 flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-80">
          <label htmlFor="payment-history-search" className="sr-only">
            {language === 'bn' ? 'লেনদেন খুঁজুন' : 'Search transactions'}
          </label>
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            id="payment-history-search"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={
              language === 'bn'
                ? 'রশিদ নং, ট্রানজেকশন বা রেফারেন্স দিয়ে খুঁজুন...'
                : 'Search by Receipt No, Txn ID, Ref...'
            }
            className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            aria-label={language === 'bn' ? 'সেবার ধরন দিয়ে ফিল্টার করুন' : 'Filter by service'}
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="text-xs sm:text-sm rounded-xl border border-slate-200 py-2 px-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
          >
            <option value="ALL">{language === 'bn' ? 'সকল সেবা' : 'All Services'}</option>
            <option value="HOLDING_TAX">{language === 'bn' ? 'হোল্ডিং ট্যাক্স' : 'Holding Tax'}</option>
            <option value="TRADE_LICENSE">{language === 'bn' ? 'ট্রেড লাইসেন্স' : 'Trade License'}</option>
            <option value="CERTIFICATE">{language === 'bn' ? 'সনদপত্র ফি' : 'Certificate Fee'}</option>
            <option value="APPLICATION">{language === 'bn' ? 'আবেদন ফি' : 'Application Fee'}</option>
            <option value="OTHER_SERVICE">{language === 'bn' ? 'অন্যান্য সেবা' : 'Other Civic'}</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
            <tr>
              <th className="px-4 py-3.5">{language === 'bn' ? 'তারিখ' : 'Date'}</th>
              <th className="px-4 py-3.5">{language === 'bn' ? 'ট্রানজেকশন / রশিদ নং' : 'Txn / Receipt No'}</th>
              <th className="px-4 py-3.5">{language === 'bn' ? 'সেবার বিবরণ ও রেফারেন্স' : 'Service & Reference'}</th>
              <th className="px-4 py-3.5">{language === 'bn' ? 'মাধ্যম' : 'Method'}</th>
              <th className="px-4 py-3.5">{language === 'bn' ? 'পরিমাণ' : 'Amount'}</th>
              <th className="px-4 py-3.5">{language === 'bn' ? 'স্ট্যাটাস' : 'Status'}</th>
              <th className="px-4 py-3.5 text-right">{language === 'bn' ? 'কার্যক্রম' : 'Action'}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {filteredTransactions.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-10 text-slate-400">
                  {language === 'bn'
                    ? 'কোনো লেনদেন রেকর্ড পাওয়া যায়নি।'
                    : 'No payment transaction records found.'}
                </td>
              </tr>
            ) : (
              filteredTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                    {formatDate(tx.completedAt || tx.initiatedAt)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-mono font-bold text-slate-900 text-xs">
                      {tx.transactionReference}
                    </div>
                    {tx.receiptNumber && (
                      <div className="font-mono text-[11px] text-emerald-700 font-semibold">
                        {tx.receiptNumber}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-semibold text-slate-800">{tx.serviceName[language]}</p>
                    <p className="text-xs text-slate-500 font-mono">
                      {tx.serviceReference} • Ward {tx.wardNumber}
                    </p>
                  </td>
                  <td className="px-4 py-3 uppercase text-xs font-semibold text-slate-600">
                    {tx.paymentMethod}
                  </td>
                  <td className="px-4 py-3 font-mono font-bold text-slate-900 whitespace-nowrap">
                    ৳{tx.amount.toLocaleString('en-IN')}
                  </td>
                  <td className="px-4 py-3">{getStatusBadge(tx.status)}</td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    {tx.receiptNumber ? (
                      <Link
                        href={`/online-payment/receipt?no=${tx.receiptNumber}`}
                        className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-medium border border-emerald-200 transition-colors"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>{language === 'bn' ? 'রশিদ' : 'Receipt'}</span>
                      </Link>
                    ) : (
                      <Link
                        href={`/online-payment/verification?ref=${tx.transactionReference}`}
                        className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-medium transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>{language === 'bn' ? 'যাচাই' : 'Verify'}</span>
                      </Link>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
