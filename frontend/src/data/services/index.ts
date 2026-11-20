import {
  Calculator,
  Construction,
  FileBadge2,
  Store,
} from 'lucide-react';
import {
  CitizenServiceCategory,
  CitizenServiceDefinition,
  ServiceCategorySlug,
} from '@/types/citizen-service';
import { REGISTRATION_SERVICES } from './registration';
import { BUSINESS_SERVICES } from './business';
import { TAXATION_SERVICES } from './taxation';
import { INFRASTRUCTURE_SERVICES } from './infrastructure';
import { SERVICE_DEPARTMENTS } from './departments';

export const CITIZEN_SERVICE_CATEGORIES: CitizenServiceCategory[] = [
  {
    slug: 'registration-certificates',
    order: 1,
    title: { bn: 'নিবন্ধন ও সনদপত্র', en: 'Registration & Certificates' },
    shortTitle: { bn: 'নিবন্ধন ও সনদপত্র', en: 'Registration & Certificates' },
    description: {
      bn: 'জন্ম ও মৃত্যু নিবন্ধন, নাগরিকত্ব, চারিত্রিক, স্থায়ী বাসিন্দা, পারিবারিক ও আয় সনদপত্রের তথ্য, যাচাই এবং অনলাইন আবেদন।',
      en: 'Birth & death registration, verification, and official municipal certificates including citizenship, character, residency, family, and income.',
    },
    icon: FileBadge2,
  },
  {
    slug: 'business-licensing',
    order: 2,
    title: { bn: 'ব্যবসা ও লাইসেন্স', en: 'Business & Licensing' },
    shortTitle: { bn: 'ব্যবসা ও লাইসেন্স', en: 'Business & Licensing' },
    description: {
      bn: 'নতুন ট্রেড লাইসেন্স, বার্ষিক নবায়ন, লাইসেন্স সংশোধন, ডুপ্লিকেট প্রতিলিপি ও কিউআর লাইসেন্স যাচাইকরণ।',
      en: 'New Trade Licenses, annual renewals, license amendments, duplicate re-issuance, and instant QR verification.',
    },
    icon: Store,
  },
  {
    slug: 'tax-revenue',
    order: 3,
    title: { bn: 'কর ও রাজস্ব', en: 'Tax & Revenue' },
    shortTitle: { bn: 'কর ও রাজস্ব', en: 'Tax & Revenue' },
    description: {
      bn: 'হোল্ডিং ট্যাক্স মূল্যায়ন ক্যালকুলেটর, কর পরিশোধ তথ্য, পুনর্মূল্যায়ন, কর ছাড়পত্র, পরিশোধের ইতিহাস ও ডিজিটাল রসিদ।',
      en: 'Holding tax assessment calculator, payment records, reassessment appeals, tax clearance certificates, and digital receipts.',
    },
    icon: Calculator,
  },
  {
    slug: 'infrastructure-public-services',
    order: 4,
    title: { bn: 'অবকাঠামো ও জনসেবা', en: 'Infrastructure & Public Services' },
    shortTitle: { bn: 'অবকাঠামো ও জনসেবা', en: 'Infrastructure & Public Services' },
    description: {
      bn: 'সড়ক, ড্রেন, সড়কবাতি, জলাবদ্ধতা, বর্জ্য ও মশক নিধন আবেদন এবং পার্ক, কমিউনিটি সেন্টার, কবরস্থান ও পাবলিক টয়লেট সেবা।',
      en: 'Road, drain, streetlight, waterlogging, waste & mosquito control requests plus parks, community centers, cemeteries, and public toilets.',
    },
    icon: Construction,
  },
];

export const ALL_CITIZEN_SERVICES: CitizenServiceDefinition[] = [
  ...REGISTRATION_SERVICES,
  ...BUSINESS_SERVICES,
  ...TAXATION_SERVICES,
  ...INFRASTRUCTURE_SERVICES,
];

export function getCategoryBySlug(slug: string): CitizenServiceCategory | undefined {
  return CITIZEN_SERVICE_CATEGORIES.find((c) => c.slug === slug);
}

export function getServicesByCategory(
  categorySlug: ServiceCategorySlug
): CitizenServiceDefinition[] {
  return ALL_CITIZEN_SERVICES.filter((s) => s.categorySlug === categorySlug);
}

export function getServiceBySlugs(
  categorySlug: string,
  serviceSlug: string
): CitizenServiceDefinition | undefined {
  return ALL_CITIZEN_SERVICES.find(
    (s) => s.categorySlug === categorySlug && s.slug === serviceSlug
  );
}

export function getServiceBySlug(serviceSlug: string): CitizenServiceDefinition | undefined {
  return ALL_CITIZEN_SERVICES.find((s) => s.slug === serviceSlug);
}

export function getRelatedServices(
  service: CitizenServiceDefinition
): CitizenServiceDefinition[] {
  const matched = service.relatedSlugs
    .map((slug) => getServiceBySlug(slug))
    .filter((item): item is CitizenServiceDefinition => Boolean(item));
  if (matched.length > 0) return matched;
  return ALL_CITIZEN_SERVICES.filter(
    (s) => s.categorySlug === service.categorySlug && s.slug !== service.slug
  ).slice(0, 3);
}

export function getDepartmentForService(service: CitizenServiceDefinition) {
  return SERVICE_DEPARTMENTS[service.departmentId] ?? SERVICE_DEPARTMENTS.estate;
}

export function getServiceHref(
  service: Pick<CitizenServiceDefinition, 'categorySlug' | 'slug'>
): string {
  return `/citizen-services/${service.categorySlug}/${service.slug}`;
}

export function searchCitizenServices(
  query: string,
  categoryFilter: ServiceCategorySlug | 'all' = 'all'
): CitizenServiceDefinition[] {
  const trimmed = query.trim().toLowerCase();
  return ALL_CITIZEN_SERVICES.filter((service) => {
    if (categoryFilter !== 'all' && service.categorySlug !== categoryFilter) {
      return false;
    }
    if (!trimmed) return true;

    const category = getCategoryBySlug(service.categorySlug);
    const haystack = [
      service.title.bn,
      service.title.en,
      service.shortDescription.bn,
      service.shortDescription.en,
      service.overview.whatItIs.bn,
      service.overview.whatItIs.en,
      category?.title.bn ?? '',
      category?.title.en ?? '',
      ...service.keywords,
    ]
      .join(' ')
      .toLowerCase();

    return haystack.includes(trimmed);
  });
}

export { SERVICE_DEPARTMENTS };
