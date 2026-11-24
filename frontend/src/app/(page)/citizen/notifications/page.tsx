'use client';

import React, { useEffect, useState } from 'react';
import { useApp } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
import {
  Bell,
  CreditCard,
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
    createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
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
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
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
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    isRead: true,
    category: 'CERTIFICATE',
  },
];

export default function CitizenNotificationsPage() {
  const { language } = useApp();
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<typeof INITIAL_NOTIFICATIONS>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) return;
    let active = true;
    queueMicrotask(() => {
      if (!active) return;
      try {
        const stored = localStorage.getItem(`dscc_citizen_notifications_${user.id}`);
        if (stored) {
          setNotifications(JSON.parse(stored) as typeof INITIAL_NOTIFICATIONS);
        } else {
          setNotifications(user.id === 'usr-citizen-01' ? INITIAL_NOTIFICATIONS : []);
        }
      } catch (loadError) {
        setError(loadError instanceof Error
          ? loadError.message
          : language === 'bn' ? 'বিজ্ঞপ্তি লোড করা যায়নি।' : 'Unable to load notifications.');
      } finally {
        setIsLoaded(true);
      }
    });
    return () => {
      active = false;
    };
  }, [user, language]);

  const saveNotifications = (next: typeof INITIAL_NOTIFICATIONS) => {
    if (!user) return false;
    try {
      localStorage.setItem(`dscc_citizen_notifications_${user.id}`, JSON.stringify(next));
      setNotifications(next);
      setError('');
      return true;
    } catch (saveError) {
      setError(saveError instanceof Error
        ? saveError.message
        : language === 'bn' ? 'বিজ্ঞপ্তি সংরক্ষণ করা যায়নি।' : 'Unable to save notification changes.');
      return false;
    }
  };

  const markAllRead = () => {
    saveNotifications(notifications.map((n) => ({ ...n, isRead: true })));
  };

  const deleteNotification = (id: string) => {
    saveNotifications(notifications.filter((n) => n.id !== id));
  };

  const formatDate = (value: string) => {
    const date = new Date(value);
    return Number.isNaN(date.getTime())
      ? value
      : new Intl.DateTimeFormat(language === 'bn' ? 'bn-BD' : 'en-US', {
          dateStyle: 'medium',
          timeStyle: 'short',
        }).format(date);
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
          disabled={!isLoaded || notifications.every((item) => item.isRead)}
          className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer self-start sm:self-auto"
        >
          {language === 'bn' ? 'সব পঠিত হিসেবে চিহ্নিত করুন' : 'Mark All Read'}
        </button>
      </div>

      {error && <p role="alert" className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800">{error}</p>}

      <div className="space-y-3">
        {isLoaded && notifications.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-600">
            {language === 'bn' ? 'আপনার কোনো বিজ্ঞপ্তি নেই।' : 'You have no notifications.'}
          </div>
        )}
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
                <time dateTime={notif.createdAt} className="text-[11px] text-slate-400 block pt-0.5">{formatDate(notif.createdAt)}</time>
              </div>
            </div>

            <button
              type="button"
              onClick={() => deleteNotification(notif.id)}
              aria-label={language === 'bn' ? 'বিজ্ঞপ্তি মুছুন' : 'Delete notification'}
              className="text-slate-400 hover:text-rose-600 p-1.5 transition-colors cursor-pointer shrink-0"
              title={language === 'bn' ? 'মুছুন' : 'Delete'}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
