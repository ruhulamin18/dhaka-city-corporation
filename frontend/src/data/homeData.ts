import type { LucideIcon } from 'lucide-react';
import {
  Baby,
  Calculator,
  CheckCircle2,
  ClipboardCheck,
  Construction,
  CreditCard,
  FileBadge2,
  FileCheck2,
  FileText,
  MapPin,
  Megaphone,
  QrCode,
  Store,
  Trash2,
  Users,
} from 'lucide-react';
import { NoticeCategory } from '@/types';

export interface PopularServiceItem {
  id: string;
  href: string;
  icon: LucideIcon;
  titleEn: string;
  titleBn: string;
  iconBg: string;
  meta: string;
}

export interface HeroStatItem {
  id: string;
  icon: LucideIcon;
  valueEn: string;
  valueBn: string;
  labelEn: string;
  labelBn: string;
}

export interface HowItWorksStep {
  icon: LucideIcon;
  step: string;
  titleEn: string;
  titleBn: string;
  descEn: string;
  descBn: string;
}

export const POPULAR_SERVICES: PopularServiceItem[] = [
  {
    id: 'birthDeath',
    href: '/citizen-services/registration-certificates/birth-registration',
    icon: Baby,
    titleEn: 'Birth & Death Registration',
    titleBn: 'জন্ম ও মৃত্যু নিবন্ধন',
    iconBg: 'bg-[#E6F7F2] text-[#006A4E]',
    meta: 'QR Verified · 24h',
  },
  {
    id: 'citizenCert',
    href: '/citizen-services/registration-certificates/citizenship-certificate',
    icon: FileCheck2,
    titleEn: 'Citizen Certificates',
    titleBn: 'নাগরিক সনদপত্র',
    iconBg: 'bg-sky-50 text-sky-700',
    meta: 'Digital Certificate',
  },
  {
    id: 'tradeLicense',
    href: '/citizen-services/business-licensing/new-trade-license',
    icon: Store,
    titleEn: 'Trade License',
    titleBn: 'ট্রেড লাইসেন্স',
    iconBg: 'bg-amber-50 text-amber-600',
    meta: 'New & Renewal',
  },
  {
    id: 'holdingTax',
    href: '/citizen-services/tax-revenue/holding-tax-payment',
    icon: Calculator,
    titleEn: 'Holding Tax Payment',
    titleBn: 'হোল্ডিং ট্যাক্স পরিশোধ',
    iconBg: 'bg-[#ECFDF5] text-[#006A4E]',
    meta: '10% Online Rebate',
  },
  {
    id: 'submitComplaint',
    href: '/complaints?tab=submit',
    icon: Megaphone,
    titleEn: 'Submit Complaint',
    titleBn: 'অভিযোগ দাখিল',
    iconBg: 'bg-[#FEF2F2] text-[#C81E1E]',
    meta: 'GPS Geo-Tagged',
  },
  {
    id: 'roadDrain',
    href: '/citizen-services/infrastructure-public-services/road-repair-request',
    icon: Construction,
    titleEn: 'Road & Drain Service',
    titleBn: 'সড়ক ও ড্রেন সেবা',
    iconBg: 'bg-indigo-50 text-indigo-700',
    meta: 'Excavation & Repair',
  },
  {
    id: 'wasteManagement',
    href: '/citizen-services/infrastructure-public-services/waste-management',
    icon: Trash2,
    titleEn: 'Waste Management',
    titleBn: 'বর্জ্য ব্যবস্থাপনা',
    iconBg: 'bg-emerald-50 text-emerald-700',
    meta: 'Smart Bins & Schedule',
  },
  {
    id: 'wardInfo',
    href: '/about/wards',
    icon: MapPin,
    titleEn: 'Ward Information',
    titleBn: 'ওয়ার্ড তথ্য ও সেবা',
    iconBg: 'bg-purple-50 text-purple-700',
    meta: 'Councillor Directory',
  },
];

export const HERO_STATS: HeroStatItem[] = [
  {
    id: 'citizens',
    icon: Users,
    valueEn: '12,48,320',
    valueBn: '১২,৪৮,৩২০',
    labelEn: 'Registered Citizens',
    labelBn: 'নিবন্ধিত নাগরিক',
  },
  {
    id: 'services',
    icon: FileText,
    valueEn: '50+',
    valueBn: '৫০+',
    labelEn: 'Online Services',
    labelBn: 'অনলাইন ই-সেবা',
  },
  {
    id: 'resolution',
    icon: ClipboardCheck,
    valueEn: '97%',
    valueBn: '৯৭%',
    labelEn: 'Complaint Resolution',
    labelBn: 'অভিযোগ নিষ্পত্তি হার',
  },
  {
    id: 'certificates',
    icon: FileBadge2,
    valueEn: '12,430+',
    valueBn: '১২,৪৩০+',
    labelEn: 'Digital Certificates Issued',
    labelBn: 'ডিজিটাল সনদ ইস্যু',
  },
];

export const HOW_IT_WORKS_STEPS: HowItWorksStep[] = [
  {
    icon: CheckCircle2,
    step: '01',
    titleEn: 'Select Service & Submit Online',
    titleBn: 'সেবা নির্বাচন ও অনলাইন আবেদন',
    descEn:
      'Choose Trade License, Holding Tax, Birth/Citizen Certificate, or submit a GPS-tagged complaint from your dashboard.',
    descBn:
      'ট্রেড লাইসেন্স, হোল্ডিং ট্যাক্স, জন্ম/নাগরিক সনদ বা জিপিএস-ট্যাগযুক্ত অভিযোগ অনলাইনে সহজেই দাখিল করুন।',
  },
  {
    icon: CreditCard,
    step: '02',
    titleEn: 'Pay Securely via bKash, Nagad or Card',
    titleBn: 'বিকাশ, নগদ বা কার্ডে নিরাপদ পেমেন্ট',
    descEn:
      'Instant digital fee calculation with 10% online holding tax rebate and automated transaction receipt.',
    descBn:
      'তাৎক্ষণিক সরকারি ফি হিসাব, ১০% অনলাইন রিবেট এবং স্বয়ংক্রিয় ডিজিটাল পেমেন্ট রসিদ।',
  },
  {
    icon: QrCode,
    step: '03',
    titleEn: 'Download QR-Verified Certificate or Track Live',
    titleBn: 'QR যাচাইকৃত সনদ ডাউনলোড ও লাইভ ট্র্যাকিং',
    descEn:
      'Verify any municipal certificate publicly via QR code or monitor real-time complaint resolution with proof photos.',
    descBn:
      'যেকোনো সনদ QR কোড দিয়ে তাৎক্ষণিক যাচাই করুন অথবা অভিযোগ সমাধানের প্রতিটি ধাপ লাইভ ট্র্যাক করুন।',
  },
];

export const NOTICE_CATEGORIES_ORDER: ReadonlyArray<NoticeCategory | 'all'> = [
  'all',
  'revenue',
  'public_health',
  'tender',
  'infrastructure',
  'general',
];
