'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
import { PaymentLayout } from '@/components/payments/PaymentLayout';
import { PaymentHistoryTable } from '@/components/payments/PaymentHistoryTable';
import { PaymentTransaction } from '@/types/payment';
import { PaymentService } from '@/services/payment/payment-service';
import {
  History,
  TrendingUp,
  CheckCircle2,
  Clock,
  Download,
  ShieldCheck,
  CreditCard,
} from 'lucide-react';

export default function PaymentHistoryPage() {
  const { language } = useApp();
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<PaymentTransaction[]>([]);

  useEffect(() => {
    // Load persisted transaction records
    queueMicrotask(() => {
      const all = PaymentService.getAllTransactions();
      setTransactions(all);
    });
  }, []);

  const totalSuccessAmount = transactions
    .filter((t) => t.status === 'SUCCESS')
    .reduce((sum, t) => sum + t.amount, 0);

  const successCount = transactions.filter((t) => t.status === 'SUCCESS').length;
  const pendingCount = transactions.filter((t) => t.status === 'PENDING' || t.status === 'INITIATED').length;

  return (
    <PaymentLayout
      title={{
        bn: 'অনলাইন পরিশোধের ইতিহাস ও লেজার',
        en: 'Payment History & Transaction Ledger',
      }}
      description={{
        bn: 'আপনার সকল হোল্ডিং ট্যাক্স, ট্রেড লাইসেন্স, সনদপত্র ও পৌর সেবা ফি পরিশোধের পূর্ণাঙ্গ রেকর্ড ও ডিজিটাল রশিদ সংগ্রহ করুন।',
        en: 'Inspect your complete transaction ledger for property taxes, trade licenses, civic fees, and retrieve digital receipts.',
      }}
    >
      <div className="space-y-8">
        {/* Ledger Overview KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          <div className="bg-[#ECFDF5] rounded-2xl p-5 border border-emerald-200 shadow-xs flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-[#006A4E] text-white flex items-center justify-center shrink-0 shadow-xs">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-[#006A4E] font-medium">
                {language === 'bn' ? 'মোট পরিশোধিত কর ও ফি' : 'Total Amount Settled'}
              </p>
              <p className="text-xl font-bold text-[#111827] font-mono tabular-nums mt-0.5">
                ৳{totalSuccessAmount.toLocaleString('en-IN')}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-[#E2E8F0] shadow-xs flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 border border-slate-200">
              <CheckCircle2 className="w-6 h-6 text-[#006A4E]" />
            </div>
            <div>
              <p className="text-xs text-[#4B5563] font-medium">
                {language === 'bn' ? 'সফল ডিজিটাল লেনদেন' : 'Successful Payments'}
              </p>
              <p className="text-xl font-bold text-[#111827] font-mono tabular-nums mt-0.5">
                {successCount} {language === 'bn' ? 'টি' : 'txns'}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-[#E2E8F0] shadow-xs flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 border border-slate-200">
              <Clock className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <p className="text-xs text-[#4B5563] font-medium">
                {language === 'bn' ? 'প্রক্রিয়াধীন লেনদেন' : 'Pending Verification'}
              </p>
              <p className="text-xl font-bold text-[#111827] font-mono tabular-nums mt-0.5">
                {pendingCount} {language === 'bn' ? 'টি' : 'txns'}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-[#E2E8F0] shadow-xs flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 border border-slate-200">
              <ShieldCheck className="w-6 h-6 text-[#006A4E]" />
            </div>
            <div>
              <p className="text-xs text-[#4B5563] font-medium">
                {language === 'bn' ? 'ট্রেজারি স্ট্যাটাস' : 'Treasury Settlement'}
              </p>
              <p className="text-xs font-bold text-[#006A4E] mt-1">
                {language === 'bn' ? '১০০% অটো-রিকনসাইল্ড' : '100% Auto-Reconciled'}
              </p>
            </div>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-[#111827] flex items-center space-x-2">
              <History className="w-5 h-5 text-[#006A4E]" />
              <span>{language === 'bn' ? 'সকল লেনদেনের তালিকা' : 'Complete Transaction Ledger'}</span>
            </h3>
            <span className="text-xs text-[#4B5563] font-mono tabular-nums">
              {language === 'bn' ? `মোট ${transactions.length} টি রেকর্ড` : `${transactions.length} total entries`}
            </span>
          </div>

          <PaymentHistoryTable transactions={transactions} />
        </div>
      </div>
    </PaymentLayout>
  );
}
