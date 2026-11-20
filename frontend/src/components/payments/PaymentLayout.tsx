'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import {
  CreditCard,
  Building,
  FileText,
  Award,
  Layers,
  History,
  Download,
  ShieldCheck,
  PhoneCall,
  Home,
  CheckCircle2,
  Lock,
} from 'lucide-react';

interface PaymentLayoutProps {
  title: { bn: string; en: string };
  description: { bn: string; en: string };
  badgeText?: { bn: string; en: string };
  children: React.ReactNode;
}

const PAYMENT_NAV_ITEMS = [
  {
    href: '/online-payment',
    label: { bn: 'পেমেন্ট হাব', en: 'Payment Hub' },
    icon: CreditCard,
  },
  {
    href: '/online-payment/holding-tax',
    label: { bn: 'হোল্ডিং ট্যাক্স', en: 'Holding Tax' },
    icon: Building,
  },
  {
    href: '/online-payment/trade-license',
    label: { bn: 'ট্রেড লাইসেন্স ফি', en: 'Trade License' },
    icon: FileText,
  },
  {
    href: '/online-payment/certificate-fee',
    label: { bn: 'সনদপত্র ফি', en: 'Certificate Fee' },
    icon: Award,
  },
  {
    href: '/online-payment/application-fee',
    label: { bn: 'আবেদন ফি', en: 'Application Fee' },
    icon: FileText,
  },
  {
    href: '/online-payment/other-service-fees',
    label: { bn: 'অন্যান্য সেবা ফি', en: 'Other Civic Fees' },
    icon: Layers,
  },
  {
    href: '/online-payment/history',
    label: { bn: 'পরিশোধের ইতিহাস', en: 'Payment History' },
    icon: History,
  },
  {
    href: '/online-payment/receipt',
    label: { bn: 'রশিদ ডাউনলোড', en: 'Download Receipt' },
    icon: Download,
  },
  {
    href: '/online-payment/verification',
    label: { bn: 'পেমেন্ট যাচাই', en: 'Verification' },
    icon: ShieldCheck,
  },
];

export const PaymentLayout: React.FC<PaymentLayoutProps> = ({
  title,
  description,
  badgeText,
  children,
}) => {
  const { language } = useApp();
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Top Banner / Hero */}
      <section className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white relative overflow-hidden shadow-lg border-b border-emerald-700/50">
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px] opacity-10 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 relative z-10">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-xs md:text-sm text-emerald-200/90 mb-4">
            <Link
              href="/"
              className="flex items-center hover:text-white transition-colors"
            >
              <Home className="w-3.5 h-3.5 mr-1" />
              <span>{language === 'bn' ? 'হোম' : 'Home'}</span>
            </Link>
            <span>/</span>
            <Link
              href="/online-payment"
              className="hover:text-white transition-colors"
            >
              {language === 'bn' ? 'অনলাইন পেমেন্ট' : 'Online Payment'}
            </Link>
            {pathname !== '/online-payment' && (
              <>
                <span>/</span>
                <span className="text-white font-medium truncate max-w-[200px] md:max-w-none">
                  {title[language]}
                </span>
              </>
            )}
          </nav>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="space-y-2">
              <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-100 text-xs font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                <span>
                  {badgeText
                    ? badgeText[language]
                    : language === 'bn'
                    ? 'সরকারি ই-পেমেন্ট গেটওয়ে সিকিউর পোর্টাল'
                    : 'Official Secure Government E-Payment Portal'}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
                {title[language]}
              </h1>
              <p className="text-emerald-100/90 text-sm md:text-base max-w-3xl leading-relaxed">
                {description[language]}
              </p>
            </div>

            {/* Quick Helpline Support */}
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-3 rounded-xl border border-white/15 self-start md:self-auto shrink-0">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/30 flex items-center justify-center text-emerald-300">
                <PhoneCall className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] text-emerald-200">
                  {language === 'bn' ? 'পেমেন্ট হেল্পলাইন (টোল ফ্রি)' : 'Payment Helpline (Toll Free)'}
                </p>
                <p className="text-lg font-bold tracking-wide text-white">16106 / 09612-316106</p>
              </div>
            </div>
          </div>
        </div>

        {/* 8-Service Horizontal Tab Navigation */}
        <div className="bg-emerald-950/60 backdrop-blur border-t border-emerald-700/40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex space-x-1 overflow-x-auto py-2.5 no-scrollbar scroll-smooth">
              {PAYMENT_NAV_ITEMS.map((item) => {
                const isActive =
                  item.href === '/online-payment'
                    ? pathname === '/online-payment'
                    : pathname.startsWith(item.href);
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`inline-flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs md:text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                      isActive
                        ? 'bg-emerald-600 text-white shadow-sm ring-1 ring-emerald-400/50'
                        : 'text-emerald-200 hover:text-white hover:bg-emerald-800/50'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-emerald-300'}`} />
                    <span>{item.label[language]}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
        {children}
      </main>

      {/* Security & Regulatory Footer Bar */}
      <footer className="border-t border-slate-200 bg-white/80 backdrop-blur py-6 mt-12 text-slate-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
            <div className="flex items-center space-x-3 text-emerald-800">
              <Lock className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                {language === 'bn'
                  ? '২৫৬-বিট এসএসএল (SSL) এনক্রিপশন এবং বাংলাদেশ ব্যাংক পিএসডি নীতিমালা অনুযায়ী সুরক্ষিত লেনদেন।'
                  : 'Protected by 256-bit SSL encryption under Bangladesh Bank Payment Systems Department regulations.'}
              </span>
            </div>
            <div className="flex items-center space-x-6 text-slate-500">
              <div className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{language === 'bn' ? 'সরাসরি সিটি ট্রেজারি জমা' : 'Direct City Treasury Settlement'}</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{language === 'bn' ? 'তাৎক্ষণিক ই-রশিদ প্রাপ্তি' : 'Instant Verified E-Receipt'}</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
