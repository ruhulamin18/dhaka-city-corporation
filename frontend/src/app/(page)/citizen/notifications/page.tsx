'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  Bell,
  CheckCircle2,
  Clock,
  CreditCard,
  FileText,
  AlertTriangle,
  Award,
  Trash2,
} from 'lucide-react';

const INITIAL_NOTIFICATIONS = [
  {
    id: 'NOTIF-001',
    title: { bn: 'হোল্ডিং ট্যাক্স পেমেন্ট সফল হয়েছে', en: 'Holding Tax Payment Confirmed' },
    message: {
      bn: 'হোল্ডিং H-10482 এর জন্য ৳২৭,৯২৭ টাকা পরিশোধ সফল হয়েছে। ডিজিটাল রশিদ সংগ্রহ করুন।',
      en: 'Payment of ৳27,927 for Holding H-10482 confirmed. Official receipt available.',
    },
    timestamp: '১০ মিনিট আগে',
    isRead: false,
    category: 'PAYMENT',
  },
  {
    id: 'NOTIF-002',
    title: { bn: 'নাগরিক সমস্যা পরিদর্শনে কর্মকর্তা নিয়োগ', en: 'Officer Assigned to Civic Grievance' },
    message: {
      bn: 'আপনার অভিযোগ নং CMP-2026-88412 (রাস্তার গর্ত) তদন্তে সহকারী প্রকৌশলী সাইট পরিদর্শনে গেছেন।',
      en: 'Assistant Engineer assigned to inspect your pothole grievance CMP-2026-88412.',
    },
    timestamp: '২ ঘন্টা আগে',
    isRead: false,
    category: 'COMPLAINT',
  },
  {
    id: 'NOTIF-003',
    title: { bn: 'ই-ট্রেড লাইসেন্স নবায়ন সম্পন্ন', en: 'E-Trade License Renewal Completed' },
    message: {
      bn: 'মেসার্স মেঘনা এন্টারপ্রাইজ এর ট্রেড লাইসেন্স নবায়িত হয়েছে এবং সনদ ইস্যু করা হয়েছে।',
      en: 'Trade License renewal for M/S Meghna Enterprise finalized and ready for download.',
    },
    timestamp: '১ দিন আগে',
    isRead: true,
    category: 'CERTIFICATE',
  },
];

export default function CitizenNotificationsPage() {
  const { language } = useApp();
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  const markAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            {language === 'bn' ? 'বিজ্ঞপ্তি ও নোটিফিকেশন সেন্টার' : 'Notifications & Alerts Center'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {language === 'bn'
              ? 'আপনার আবেদন, লেনদেন, অভিযোগ ও সেবা সংক্রান্ত সকল তাৎক্ষণিক নোটিফিকেশন।'
              : 'Real-time alerts regarding applications, payment transactions, and civic resolutions.'}
          </p>
        </div>

        <button
          type="button"
          onClick={markAllRead}
          className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer self-start sm:self-auto"
        >
          {language === 'bn' ? 'সব পঠিত হিসেবে চিহ্নিত করুন' : 'Mark All Read'}
        </button>
      </div>

      <div className="space-y-3">
        {notifications.map((notif) => (
          <div
            key={notif.id}
            className={`p-5 rounded-2xl border transition-all flex items-start justify-between gap-4 ${
              notif.isRead
                ? 'bg-white border-slate-200'
                : 'bg-emerald-50/40 border-emerald-300 ring-1 ring-emerald-500/20'
            }`}
          >
            <div className="flex items-start gap-3.5">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                  notif.category === 'PAYMENT'
                    ? 'bg-emerald-100 text-[#006A4E]'
                    : notif.category === 'COMPLAINT'
                    ? 'bg-rose-100 text-rose-700'
                    : 'bg-blue-100 text-blue-700'
                }`}
              >
                {notif.category === 'PAYMENT' ? (
                  <CreditCard className="w-4 h-4" />
                ) : notif.category === 'COMPLAINT' ? (
                  <AlertTriangle className="w-4 h-4" />
                ) : (
                  <Award className="w-4 h-4" />
                )}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900">{notif.title[language]}</h3>
                  {!notif.isRead && (
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                  )}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{notif.message[language]}</p>
                <span className="text-[11px] text-slate-400 block pt-0.5">{notif.timestamp}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => deleteNotification(notif.id)}
              className="text-slate-400 hover:text-rose-600 p-1.5 transition-colors cursor-pointer shrink-0"
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
