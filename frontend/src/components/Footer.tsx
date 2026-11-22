'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Building2, Github, Mail, PhoneCall } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export function Footer() {
  const pathname = usePathname();
  const { language } = useApp();
  const isBn = language === 'bn';

  if (
    pathname === '/citizen' ||
    pathname.startsWith('/citizen/') ||
    pathname === '/admin' ||
    pathname.startsWith('/admin/')
  ) {
    return null;
  }

  const citizenLinks = [
    {
      href: '/track',
      labelBn: 'আবেদন ও অভিযোগ ট্র্যাকিং',
      labelEn: 'Track Application & Grievance',
    },
    {
      href: '/verify',
      labelBn: 'ডিজিটাল সনদ ও রসিদ যাচাই',
      labelEn: 'Verify Certificate & Receipt',
    },
    {
      href: '/citizen-services',
      labelBn: 'নাগরিক সেবা নির্দেশিকা ও তালিকা',
      labelEn: 'Citizen Service Guides & Directory',
    },
    {
      href: '/tax-calculator',
      labelBn: 'হোল্ডিং ট্যাক্স ক্যালকুলেটর',
      labelEn: 'Holding Tax Calculator',
    },
    {
      href: '/city-map',
      labelBn: 'ইন্টারেক্টিভ জিআইএস সিটি ম্যাপ',
      labelEn: 'Interactive GIS City Map',
    },
  ];

  const workspaceLinks = [
    {
      href: '/citizen',
      labelBn: 'নাগরিক সেবা পোর্টাল (Citizen Portal)',
      labelEn: 'Citizen Service Portal',
    },
    {
      href: '/admin',
      labelBn: 'প্রশাসনিক কমান্ড পোর্টাল (Admin Portal)',
      labelEn: 'Administrative Command Portal',
    },
    {
      href: '/projects',
      labelBn: 'উন্মুক্ত বাজেট ও উন্নয়ন প্রকল্প (Projects & Budget)',
      labelEn: 'Projects & Open Budget',
    },
    {
      href: '/notices',
      labelBn: 'ডিজিটাল নোটিশ ও সরকারি প্রজ্ঞাপন (Notice Board)',
      labelEn: 'Public Notices & Decrees',
    },
    {
      href: '/about/contact',
      labelBn: 'জরুরি হেল্পডেস্ক ও কন্ট্রোল রুম (Helplines)',
      labelEn: 'Emergency Helplines & Control Room',
    },
  ];

  return (
    <footer className="relative z-10 overflow-hidden no-print bg-[#125A3E] text-emerald-50 border-t border-[#00523C]">
      {/* Layer 1: Clearly visible bg2.png etched cleanly into the civic green surface via multiply */}
      <div
        aria-hidden="true"
        className="civic-bg-layer absolute inset-0 bg-[url('/images/bg2.png')] bg-cover bg-center bg-no-repeat mix-blend-multiply opacity-85 contrast-[1.4] pointer-events-none select-none"
      />

      {/* Layer 2: Soft translucent Deep Bangladesh Civic Green (#006A4E) shade overlay */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-[#006A4E]/35 via-[#006A4E]/20 to-[#004D38]/45 pointer-events-none select-none"
      />

      {/* Footer Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-7">
          {/* Column 1: White Brand Card + Description + Address & Email */}
          <div className="lg:col-span-4 space-y-4">
            <Link
              href="/"
              aria-label={
                isBn
                  ? 'ঢাকা সিটি কর্পোরেশন — হোম পেজ'
                  : 'Dhaka City Corporation — Home'
              }
              className="inline-flex items-center bg-white rounded-xl px-4 py-2.5 shadow-sm hover:shadow-md transition-shadow focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <Image
                src="/images/logo.png"
                alt={
                  isBn
                    ? 'ঢাকা সিটি কর্পোরেশন লোগো'
                    : 'Dhaka City Corporation Logo'
                }
                width={2172}
                height={724}
                referrerPolicy="no-referrer"
                className="h-12 sm:h-14 w-auto object-contain"
              />
            </Link>

            <p className="text-sm text-emerald-50/95 leading-relaxed max-w-sm">
              {isBn
                ? 'নাগরিক সেবা গ্রহণ, হোল্ডিং ট্যাক্স পরিশোধ, ট্রেড লাইসেন্স, কিউআর সনদ যাচাই এবং জিও-ট্যাগযুক্ত অভিযোগ সমাধানের সমন্বিত সরকারি ডিজিটাল সেবা প্ল্যাটফর্ম।'
                : 'Integrated digital civic platform for online citizen services, holding tax payments, trade licenses, QR certificate verification, and geo-tagged complaint resolution.'}
            </p>

            <div className="space-y-2 pt-1 text-sm text-emerald-50/95">
              <div className="flex items-start gap-2.5">
                <Building2
                  className="w-4 h-4 text-emerald-200 shrink-0 mt-0.5"
                  aria-hidden="true"
                />
                <span>
                  {isBn
                    ? 'নগর ভবন, ফুলবাড়িয়া, ঢাকা-১০০০, বাংলাদেশ'
                    : 'Nagar Bhaban, Fulbaria, Dhaka-1000, Bangladesh'}
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail
                  className="w-4 h-4 text-emerald-200 shrink-0"
                  aria-hidden="true"
                />
                <a
                  href="mailto:info@dscc.smartcity.gov.bd"
                  className="font-inter hover:text-white hover:underline underline-offset-2 transition-colors"
                >
                  info@dscc.smartcity.gov.bd
                </a>
              </div>
            </div>
          </div>

          {/* Column 2: Citizen Portal Menu */}
          <div className="lg:col-span-3">
            <h3 className="text-sm font-bold text-white pb-2.5 mb-3.5 border-b border-white/20">
              {isBn ? 'নাগরিক পোর্টাল মেনু' : 'Citizen Portal Menu'}
            </h3>
            <ul className="space-y-2.5 text-sm text-emerald-50/90">
              {citizenLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="hover:text-white hover:underline underline-offset-4 transition-colors"
                  >
                    {isBn ? item.labelBn : item.labelEn}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Institutional Workspaces */}
          <div className="lg:col-span-3">
            <h3 className="text-sm font-bold text-white pb-2.5 mb-3.5 border-b border-white/20">
              {isBn ? 'প্রাতিষ্ঠানিক কর্মক্ষেত্রসমূহ' : 'Institutional Workspaces'}
            </h3>
            <ul className="space-y-2.5 text-sm text-emerald-50/90">
              {workspaceLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="hover:text-white hover:underline underline-offset-4 transition-colors"
                  >
                    {isBn ? item.labelBn : item.labelEn}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Emergency Support Center Cards */}
          <div className="lg:col-span-2">
            <h3 className="text-sm font-bold text-white pb-2.5 mb-3.5 border-b border-white/20">
              {isBn ? 'জরুরি সহায়তা কেন্দ্র' : 'Emergency Support'}
            </h3>
            <div className="space-y-3">
              <a
                href="tel:16106"
                className="block rounded-xl bg-[#073624]/85 hover:bg-[#052B1D]/95 border border-white/10 px-4 py-3.5 shadow-sm transition-colors"
              >
                <p className="text-xs text-emerald-100/90 font-medium">
                  {isBn ? 'পৌর সেবা কন্ট্রোল রুম' : 'Civic Control Room'}
                </p>
                <div className="mt-1.5 flex items-center gap-2 text-lg font-extrabold text-white tabular-nums tracking-wide">
                  <PhoneCall
                    className="w-4 h-4 text-emerald-200 shrink-0"
                    aria-hidden="true"
                  />
                  <span>{isBn ? '১৬১০৬' : '16106'}</span>
                </div>
              </a>

              <a
                href="tel:999"
                className="block rounded-xl bg-[#073624]/85 hover:bg-[#052B1D]/95 border border-white/10 px-4 py-3.5 shadow-sm transition-colors"
              >
                <p className="text-xs text-emerald-100/90 font-medium">
                  {isBn ? 'জাতীয় তথ্য ও জরুরি সেবা' : 'National Info & Emergency'}
                </p>
                <p className="mt-1.5 text-lg font-extrabold text-white tabular-nums tracking-wide">
                  {isBn ? '৩৩৩ / ৯৯৯' : '333 / 999'}
                </p>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Policy Links Bar */}
        <div className="mt-10 pt-5 border-t border-white/20 flex flex-col gap-3 pr-0 sm:pr-14">
          {/* Policy Links */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-3 gap-y-1 text-xs text-emerald-100/90">
            <Link
              href="/about/citizen-charter"
              className="hover:text-white hover:underline underline-offset-2 transition-colors"
            >
              {isBn ? 'নাগরিক সেবা সনদ' : 'Citizen Charter'}
            </Link>
            <span className="text-white/40" aria-hidden="true">
              •
            </span>
            <Link
              href="/privacy-policy"
              className="hover:text-white hover:underline underline-offset-2 transition-colors"
            >
              {isBn ? 'তথ্য গোপনীয়তা নীতি' : 'Privacy Policy'}
            </Link>
            <span className="text-white/40" aria-hidden="true">
              •
            </span>
            <Link
              href="/accessibility"
              className="hover:text-white hover:underline underline-offset-2 transition-colors"
            >
              {isBn ? 'প্রবেশগম্যতা' : 'Accessibility'}
            </Link>
          </div>

          {/* Copyright & Developer Credit Bar */}
          <div className="pt-3 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs sm:text-sm text-emerald-100/80">
            <p className="text-center sm:text-left">
              {isBn
                ? '© ২০২৬ ঢাকা সিটি কর্পোরেশন — স্মার্ট নাগরিক সেবা ও ডিজিটাল প্ল্যাটফর্ম।'
                : '© 2026 Dhaka Smart City Corporation — Digital Citizen Service Platform.'}
            </p>

            <div className="flex items-center gap-1.5 text-center sm:text-right">
              <span>
                {isBn ? 'ডিজাইন ও ডেভেলপমেন্ট: ' : 'Designed & Developed by '}
              </span>
              <a
                href="https://github.com/ruhulamin18"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Md. Ruhul Amin GitHub Profile"
                className="font-semibold text-white hover:text-emerald-300 underline-offset-4 hover:underline transition-colors inline-flex items-center gap-1"
              >
                <Github className="w-3.5 h-3.5 text-emerald-200 shrink-0" aria-hidden="true" />
                <span>{isBn ? 'মোঃ রুহুল আমিন' : 'Md. Ruhul Amin'}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
