import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ServiceDetailPage from '@/components/citizen-services/ServiceDetailPage';
import {
  ALL_CITIZEN_SERVICES,
  getCategoryBySlug,
  getServiceBySlugs,
} from '@/data/services';

interface ServiceDetailRouteProps {
  params: Promise<{ category: string; service: string }>;
}

export function generateStaticParams() {
  return ALL_CITIZEN_SERVICES.map((svc) => ({
    category: svc.categorySlug,
    service: svc.slug,
  }));
}

export async function generateMetadata({
  params,
}: ServiceDetailRouteProps): Promise<Metadata> {
  const { category: categorySlug, service: serviceSlug } = await params;
  const service = getServiceBySlugs(categorySlug, serviceSlug);
  const category = getCategoryBySlug(categorySlug);
  if (!service || !category) {
    return { title: 'Service Not Found | Dhaka City Corporation' };
  }
  return {
    title: `${service.title.en} | ${category.title.en} | Dhaka City Corporation`,
    description: service.shortDescription.en,
  };
}

export default async function CitizenServiceDetailRoute({
  params,
}: ServiceDetailRouteProps) {
  const { category: categorySlug, service: serviceSlug } = await params;
  const service = getServiceBySlugs(categorySlug, serviceSlug);
  const category = getCategoryBySlug(categorySlug);

  if (!service || !category) {
    notFound();
  }

  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-7xl px-4 py-16 text-center text-sm text-slate-500">
          Loading service details...
        </div>
      }
    >
      <ServiceDetailPage
        categorySlug={category.slug}
        serviceSlug={service.slug}
      />
    </Suspense>
  );
}
