'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ArrowRight,
  Building2,
  ChevronRight,
  Clock,
  Globe2,
  Home,
  Lock,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
import {
  getCategoryBySlug,
  getDepartmentForService,
  getServiceBySlugs,
} from '@/data/services';
import { pickText } from '@/types/citizen-service';
import ServiceOverview from './ServiceOverview';
import EligibilitySection from './EligibilitySection';
import RequiredDocuments from './RequiredDocuments';
import ApplicationSteps from './ApplicationSteps';
import FeeInformation from './FeeInformation';
import ApplicationForm from './ApplicationForm';
import ApplicationTracking from './ApplicationTracking';
import ServiceFAQ from './ServiceFAQ';
import RelatedServices from './RelatedServices';

interface ServiceDetailPageProps {
  categorySlug: string;
  serviceSlug: string;
}

export default function ServiceDetailPage({
  categorySlug,
  serviceSlug,
}: ServiceDetailPageProps) {
  const { language } = useApp();
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const actionParam = searchParams.get('action');

  const category = getCategoryBySlug(categorySlug);
  const service = getServiceBySlugs(categorySlug, serviceSlug);

  const [manualExpanded, setManualExpanded] = useState(false);
  const [trackingRefreshKey, setTrackingRefreshKey] = useState(0);

  const isFormExpanded =
    manualExpanded ||
    !service?.requiresAuthForAction ||
    (actionParam === 'apply' && isAuthenticated);

  useEffect(() => {
    if (actionParam === 'apply' && isAuthenticated && service) {
      const target = document.getElementById('service-action-panel');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [actionParam, isAuthenticated, service]);

  if (!category || !service) {
    return null;
  }

  const department = getDepartmentForService(service);
  const ServiceIcon = service.icon;

  const handlePrimaryAction = () => {
    if (service.requiresAuthForAction && !isAuthenticated) {
      const targetUrl = `/citizen-services/${categorySlug}/${serviceSlug}?action=apply`;
      router.push(`/login?redirect=${encodeURIComponent(targetUrl)}`);
      return;
    }
    setManualExpanded(true);
    setTimeout(() => {
      document
        .getElementById('service-action-panel')
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 60);
  };

  const quickNavLinks = [
    { id: 'service-overview', label: { bn: 'সারসংক্ষেপ', en: 'Overview' } },
    { id: 'eligibility', label: { bn: 'যোগ্যতা', en: 'Eligibility' } },
    { id: 'required-documents', label: { bn: 'কাগজপত্র', en: 'Documents' } },
    { id: 'application-steps', label: { bn: 'ধাপসমূহ', en: 'Steps' } },
    { id: 'fee-information', label: { bn: 'ফি ও সময়', en: 'Fees' } },
    { id: 'service-action-panel', label: { bn: 'আবেদন / সেবা', en: 'Action' } },
    { id: 'service-faq', label: { bn: 'প্রশ্নোত্তর', en: 'FAQ' } },
  ];

  const showTrackingSection =
    service.interactionMode === 'application' ||
    service.interactionMode === 'complaint' ||
    service.interactionMode === 'facility-booking';

  return (
    <div className="min-h-screen pb-16">
      {/* Civic Green Header Banner */}
      <div className="bg-gradient-to-br from-[#006A4E] via-[#005A42] to-[#004633] text-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
          {/* Breadcrumb */}
          <nav
            aria-label={language === 'bn' ? 'ব্রেডক্রাম্ব' : 'Breadcrumb'}
            className="mb-5 flex flex-wrap items-center gap-1.5 text-xs font-medium text-emerald-100/90"
          >
            <Link
              href="/"
              className="inline-flex items-center gap-1 hover:text-white transition-colors"
            >
              <Home className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{language === 'bn' ? 'হোম' : 'Home'}</span>
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-emerald-200/70" aria-hidden="true" />
            <Link
              href="/citizen-services"
              className="hover:text-white transition-colors"
            >
              {language === 'bn' ? 'নাগরিক সেবা' : 'Citizen Services'}
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-emerald-200/70" aria-hidden="true" />
            <Link
              href={`/citizen-services/${category.slug}`}
              className="hover:text-white transition-colors"
            >
              {pickText(category.shortTitle, language)}
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-emerald-200/70" aria-hidden="true" />
            <span className="font-semibold text-white">
              {pickText(service.title, language)}
            </span>
          </nav>

          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-white ring-1 ring-white/25 backdrop-blur-xs">
                <ServiceIcon className="h-7 w-7" aria-hidden="true" />
              </div>

              <div>
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <span className="rounded-md bg-white/15 px-2.5 py-0.5 text-xs font-semibold text-emerald-50">
                    {pickText(category.title, language)}
                  </span>
                  {service.requiresAuthForAction ? (
                    <span className="inline-flex items-center gap-1 rounded-md bg-black/20 px-2.5 py-0.5 text-xs font-medium text-emerald-100">
                      <Lock className="h-3 w-3" aria-hidden="true" />
                      {language === 'bn'
                        ? 'তথ্য সবার জন্য উন্মুক্ত · আবেদনে লগইন'
                        : 'Public Info · Login to Apply'}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-md bg-emerald-400/20 px-2.5 py-0.5 text-xs font-medium text-emerald-50">
                      <Globe2 className="h-3 w-3" aria-hidden="true" />
                      {language === 'bn'
                        ? 'লগইন ছাড়াই ব্যবহারযোগ্য'
                        : 'Open Public Tool'}
                    </span>
                  )}
                </div>

                <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                  {pickText(service.title, language)}
                </h1>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-emerald-50/90 sm:text-base">
                  {pickText(service.shortDescription, language)}
                </p>
              </div>
            </div>

            <div className="flex shrink-0 flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handlePrimaryAction}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-[#006A4E] shadow-sm hover:bg-[#ECFDF5] transition-colors cursor-pointer"
              >
                <span>{pickText(service.primaryCtaLabel, language)}</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* In-page Quick Navigation */}
          <div className="mt-6 flex flex-wrap gap-2 border-t border-white/15 pt-4">
            {quickNavLinks.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="rounded-lg bg-white/10 px-3 py-1.5 text-xs font-semibold text-emerald-50 hover:bg-white/20 transition-colors"
              >
                {pickText(item.label, language)}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content + Sticky Sidebar */}
      <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Left Main Column */}
          <div className="space-y-6 lg:col-span-8">
            <ServiceOverview service={service} />
            <EligibilitySection service={service} />
            <RequiredDocuments service={service} />
            <ApplicationSteps service={service} />
            <FeeInformation service={service} />

            {/* Interactive Action Panel */}
            {isFormExpanded ? (
              <ApplicationForm
                service={service}
                onSubmitted={() => setTrackingRefreshKey((k) => k + 1)}
              />
            ) : (
              <section
                id="service-action-panel"
                className="rounded-2xl border border-[#006A4E]/30 bg-white p-6 shadow-sm"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">
                      {language === 'bn'
                        ? 'এই সেবার জন্য আবেদন শুরু করুন'
                        : 'Ready to Start This Service?'}
                    </h2>
                    <p className="mt-1 text-sm text-slate-600">
                      {service.requiresAuthForAction && !isAuthenticated
                        ? language === 'bn'
                          ? 'আবেদন জমা দিতে লগইন প্রয়োজন। লগইনের পর সরাসরি এই ফর্মে ফিরে আসবেন।'
                          : 'Sign in to submit your application. After logging in, you will return directly to this form.'
                        : language === 'bn'
                          ? 'অনলাইন ফর্মটি খুলতে নিচের বাটনে ক্লিক করুন।'
                          : 'Click the button to open the online request form.'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handlePrimaryAction}
                    className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#006A4E] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#00523C] transition-colors cursor-pointer"
                  >
                    <span>{pickText(service.primaryCtaLabel, language)}</span>
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              </section>
            )}

            {showTrackingSection && (
              <ApplicationTracking
                service={service}
                refreshKey={trackingRefreshKey}
              />
            )}

            <ServiceFAQ service={service} />
            <RelatedServices service={service} />
          </div>

          {/* Right Sticky Sidebar */}
          <aside className="space-y-5 lg:col-span-4">
            <div className="sticky top-28 space-y-5">
              {/* Quick Action Summary Card */}
              <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-xs">
                <h2 className="text-base font-bold text-slate-900">
                  {language === 'bn' ? 'এক নজরে সেবা' : 'Quick Service Summary'}
                </h2>

                <dl className="mt-4 space-y-3 text-sm">
                  <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-2.5">
                    <dt className="text-slate-500">
                      {language === 'bn' ? 'বিভাগ' : 'Category'}
                    </dt>
                    <dd className="text-right font-semibold text-slate-900">
                      {pickText(category.shortTitle, language)}
                    </dd>
                  </div>
                  <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-2.5">
                    <dt className="text-slate-500">
                      {language === 'bn' ? 'প্রবেশাধিকার' : 'Access Mode'}
                    </dt>
                    <dd className="text-right font-semibold text-[#006A4E]">
                      {service.requiresAuthForAction
                        ? language === 'bn'
                          ? 'পাবলিক তথ্য / লগইন আবেদন'
                          : 'Public Info / Auth Apply'
                        : language === 'bn'
                          ? 'সম্পূর্ণ উন্মুক্ত'
                          : 'Fully Public'}
                    </dd>
                  </div>
                  <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-2.5">
                    <dt className="text-slate-500">
                      {language === 'bn' ? 'প্রয়োজনীয় নথি' : 'Documents'}
                    </dt>
                    <dd className="text-right font-semibold text-slate-900">
                      {service.requiredDocuments.length}{' '}
                      {language === 'bn' ? 'টি' : 'items'}
                    </dd>
                  </div>
                  <div className="flex items-start justify-between gap-2">
                    <dt className="text-slate-500">
                      {language === 'bn' ? 'ধাপসংখ্যা' : 'Process Steps'}
                    </dt>
                    <dd className="text-right font-semibold text-slate-900">
                      {service.steps.length} {language === 'bn' ? 'টি ধাপ' : 'steps'}
                    </dd>
                  </div>
                </dl>

                <button
                  type="button"
                  onClick={handlePrimaryAction}
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#006A4E] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#00523C] transition-colors cursor-pointer"
                >
                  <span>{pickText(service.primaryCtaLabel, language)}</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>

              {/* Responsible Department Contact Card */}
              <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-xs">
                <div className="mb-3 flex items-center gap-2 text-[#006A4E]">
                  <Building2 className="h-5 w-5" aria-hidden="true" />
                  <h2 className="text-base font-bold text-slate-900">
                    {language === 'bn'
                      ? 'সংশ্লিষ্ট বিভাগ ও যোগাযোগ'
                      : 'Department & Support'}
                  </h2>
                </div>

                <p className="text-sm font-bold text-slate-900">
                  {pickText(department.name, language)}
                </p>

                <ul className="mt-3 space-y-2.5 text-xs text-slate-600">
                  <li className="flex items-start gap-2">
                    <Phone
                      className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#006A4E]"
                      aria-hidden="true"
                    />
                    <span className="font-medium text-slate-800">{department.phone}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Mail
                      className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#006A4E]"
                      aria-hidden="true"
                    />
                    <span>{department.email}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <MapPin
                      className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#006A4E]"
                      aria-hidden="true"
                    />
                    <span>{pickText(department.officeAddress, language)}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Clock
                      className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#006A4E]"
                      aria-hidden="true"
                    />
                    <span>{pickText(department.hours, language)}</span>
                  </li>
                </ul>

                <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-100 pt-3.5">
                  <Link
                    href={department.supportHref}
                    className="inline-flex flex-1 items-center justify-center rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2 text-xs font-semibold text-slate-700 hover:border-[#006A4E] hover:text-[#006A4E] transition-colors"
                  >
                    {language === 'bn' ? 'বিভাগীয় তথ্য' : 'Department Info'}
                  </Link>
                  <Link
                    href="/about/contact"
                    className="inline-flex flex-1 items-center justify-center rounded-lg bg-[#ECFDF5] px-3 py-2 text-xs font-semibold text-[#006A4E] hover:bg-emerald-100 transition-colors"
                  >
                    {language === 'bn' ? 'জরুরি হেল্পডেস্ক' : 'Contact Helpdesk'}
                  </Link>
                </div>
              </div>

              {/* Public Verification Shortcut */}
              <div className="rounded-2xl border border-emerald-200 bg-[#ECFDF5]/80 p-5">
                <div className="flex items-start gap-2.5">
                  <ShieldCheck
                    className="mt-0.5 h-5 w-5 shrink-0 text-[#006A4E]"
                    aria-hidden="true"
                  />
                  <div>
                    <h3 className="text-sm font-bold text-[#006A4E]">
                      {language === 'bn'
                        ? 'কিউআর সনদ যাচাইকরণ'
                        : 'Instant QR Document Verification'}
                    </h3>
                    <p className="mt-1 text-xs leading-relaxed text-slate-700">
                      {language === 'bn'
                        ? 'ইস্যুকৃত যেকোনো ট্রেড লাইসেন্স, সনদপত্র বা হোল্ডিং ট্যাক্স রসিদ অনলাইনে যাচাই করুন।'
                        : 'Verify any issued trade license, municipal certificate, or tax receipt online.'}
                    </p>
                    <Link
                      href="/verify"
                      className="mt-2.5 inline-flex items-center gap-1 text-xs font-bold text-[#006A4E] hover:text-[#00523C]"
                    >
                      <span>{language === 'bn' ? 'যাচাই পেজে যান' : 'Go to Verification'}</span>
                      <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
