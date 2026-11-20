import type { LucideIcon } from 'lucide-react';
import {
  AlertTriangle,
  Archive,
  Award,
  Baby,
  BadgeCheck,
  BarChart3,
  Bell,
  BookOpen,
  Bot,
  Briefcase,
  Building,
  Building2,
  Calculator,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  ClipboardList,
  CloudRain,
  Compass,
  Construction,
  CreditCard,
  Download,
  Droplets,
  FileBadge2,
  FileCheck2,
  FileClock,
  FileEdit,
  FilePlus2,
  FileSpreadsheet,
  FileText,
  FolderCheck,
  FolderClock,
  FolderKanban,
  History,
  Home,
  Images,
  Info,
  Landmark,
  Lamp,
  LayoutDashboard,
  Leaf,
  Map,
  MapPin,
  Megaphone,
  Newspaper,
  ParkingCircle,
  Phone,
  Receipt,
  RefreshCw,
  ScrollText,
  ShieldAlert,
  ShieldCheck,
  Siren,
  Store,
  Target,
  Trash2,
  Trees,
  UserCheck,
  Users,
  Wallet,
  Wind,
  Wrench,
} from 'lucide-react';

import type { ServiceKey } from '@/config/status-config';

export type NavItemAction = 'openAssistant';

export interface NavLinkItem {
  id: string;
  labelEn: string;
  labelBn: string;
  href: string;
  icon: LucideIcon;
  action?: NavItemAction;
  accent?: 'crimson';
  serviceKey?: ServiceKey;
}

export interface MegaMenuColumn {
  id: string;
  titleEn: string;
  titleBn: string;
  icon: LucideIcon;
  items: NavLinkItem[];
}

export interface TopNavCategory {
  id:
    | 'home'
    | 'about'
    | 'citizen-services'
    | 'public-tools'
    | 'smart-city'
    | 'contact'
    | string;
  labelEn: string;
  labelBn: string;
  href?: string;
  matchPaths: string[];
  isMega?: boolean;
  align?: 'left' | 'right';
  items?: NavLinkItem[];
  columns?: MegaMenuColumn[];
  footerCta?: {
    labelEn: string;
    labelBn: string;
    href: string;
  };
}

export const CITIZEN_SERVICES_COLUMNS: MegaMenuColumn[] = [
  {
    id: 'registration-certificates',
    titleEn: 'Registration & Certificates',
    titleBn: 'নিবন্ধন ও সনদপত্র',
    icon: FileBadge2,
    items: [
      {
        id: 'birth-registration',
        labelEn: 'Birth Registration',
        labelBn: 'জন্ম নিবন্ধন',
        href: '/citizen-services/registration-certificates/birth-registration',
        icon: Baby,
        serviceKey: 'birthRegistration',
      },
      {
        id: 'birth-correction',
        labelEn: 'Birth Certificate Correction',
        labelBn: 'জন্ম সনদ সংশোধন',
        href: '/citizen-services/registration-certificates/birth-certificate-correction',
        icon: FileEdit,
      },
      {
        id: 'birth-verification',
        labelEn: 'Birth Certificate Verification',
        labelBn: 'জন্ম সনদ যাচাই',
        href: '/citizen-services/registration-certificates/birth-certificate-verification',
        icon: BadgeCheck,
      },
      {
        id: 'death-registration',
        labelEn: 'Death Registration',
        labelBn: 'মৃত্যু নিবন্ধন',
        href: '/citizen-services/registration-certificates/death-registration',
        icon: FileText,
      },
      {
        id: 'death-download',
        labelEn: 'Death Certificate Download',
        labelBn: 'মৃত্যু সনদ ডাউনলোড',
        href: '/citizen-services/registration-certificates/death-certificate-download',
        icon: Download,
      },
      {
        id: 'citizenship-cert',
        labelEn: 'Citizenship Certificate',
        labelBn: 'নাগরিকত্ব সনদ',
        href: '/citizen-services/registration-certificates/citizenship-certificate',
        icon: UserCheck,
      },
      {
        id: 'character-cert',
        labelEn: 'Character Certificate',
        labelBn: 'চারিত্রিক সনদ',
        href: '/citizen-services/registration-certificates/character-certificate',
        icon: ShieldCheck,
      },
      {
        id: 'permanent-resident-cert',
        labelEn: 'Permanent Resident Certificate',
        labelBn: 'স্থায়ী বাসিন্দা সনদ',
        href: '/citizen-services/registration-certificates/permanent-resident-certificate',
        icon: Home,
      },
      {
        id: 'family-cert',
        labelEn: 'Family Certificate',
        labelBn: 'পারিবারিক সনদ',
        href: '/citizen-services/registration-certificates/family-certificate',
        icon: Users,
      },
      {
        id: 'income-cert',
        labelEn: 'Income Certificate',
        labelBn: 'আয় সনদপত্র',
        href: '/citizen-services/registration-certificates/income-certificate',
        icon: FileSpreadsheet,
      },
    ],
  },
  {
    id: 'business-licensing',
    titleEn: 'Business & Licensing',
    titleBn: 'ব্যবসা ও লাইসেন্স',
    icon: Store,
    items: [
      {
        id: 'new-trade-license',
        labelEn: 'New Trade License',
        labelBn: 'নতুন ট্রেড লাইসেন্স',
        href: '/citizen-services/business-licensing/new-trade-license',
        icon: FilePlus2,
        serviceKey: 'tradeLicense',
      },
      {
        id: 'trade-license-renewal',
        labelEn: 'Trade License Renewal',
        labelBn: 'ট্রেড লাইসেন্স নবায়ন',
        href: '/citizen-services/business-licensing/trade-license-renewal',
        icon: RefreshCw,
      },
      {
        id: 'license-modification',
        labelEn: 'License Modification',
        labelBn: 'লাইসেন্স সংশোধন',
        href: '/citizen-services/business-licensing/license-modification',
        icon: FileEdit,
      },
      {
        id: 'duplicate-trade-license',
        labelEn: 'Duplicate Trade License',
        labelBn: 'ডুপ্লিকেট ট্রেড লাইসেন্স',
        href: '/citizen-services/business-licensing/duplicate-trade-license',
        icon: FileText,
      },
      {
        id: 'trade-license-verification',
        labelEn: 'Trade License Verification',
        labelBn: 'ট্রেড লাইসেন্স যাচাই',
        href: '/citizen-services/business-licensing/trade-license-verification',
        icon: BadgeCheck,
      },
    ],
  },
  {
    id: 'tax-revenue',
    titleEn: 'Tax & Revenue',
    titleBn: 'কর ও রাজস্ব',
    icon: Calculator,
    items: [
      {
        id: 'holding-tax-assessment',
        labelEn: 'Holding Tax Assessment',
        labelBn: 'হোল্ডিং ট্যাক্স মূল্যায়ন',
        href: '/citizen-services/tax-revenue/holding-tax-assessment',
        icon: Calculator,
        serviceKey: 'holdingTax',
      },
      {
        id: 'holding-tax-payment',
        labelEn: 'Holding Tax Payment',
        labelBn: 'হোল্ডিং ট্যাক্স পরিশোধ',
        href: '/citizen-services/tax-revenue/holding-tax-payment',
        icon: CreditCard,
      },
      {
        id: 'tax-reassessment',
        labelEn: 'Tax Reassessment',
        labelBn: 'কর পুনর্মূল্যায়ন',
        href: '/citizen-services/tax-revenue/tax-reassessment',
        icon: RefreshCw,
      },
      {
        id: 'tax-clearance',
        labelEn: 'Tax Clearance Certificate',
        labelBn: 'কর ছাড়পত্র',
        href: '/citizen-services/tax-revenue/tax-clearance-certificate',
        icon: FileCheck2,
      },
      {
        id: 'tax-history',
        labelEn: 'Tax Payment History',
        labelBn: 'কর পরিশোধের ইতিহাস',
        href: '/citizen-services/tax-revenue/tax-payment-history',
        icon: History,
      },
      {
        id: 'digital-payment-receipt',
        labelEn: 'Digital Payment Receipt',
        labelBn: 'ডিজিটাল পেমেন্ট রসিদ',
        href: '/citizen-services/tax-revenue/digital-payment-receipt',
        icon: Receipt,
      },
    ],
  },
  {
    id: 'infrastructure-public-services',
    titleEn: 'Infrastructure & Public Services',
    titleBn: 'অবকাঠামো ও জনসেবা',
    icon: Construction,
    items: [
      {
        id: 'road-repair-request',
        labelEn: 'Road Repair Request',
        labelBn: 'সড়ক মেরামত আবেদন',
        href: '/citizen-services/infrastructure-public-services/road-repair-request',
        icon: Construction,
      },
      {
        id: 'drain-cleaning-request',
        labelEn: 'Drain Cleaning Request',
        labelBn: 'ড্রেন পরিষ্কার আবেদন',
        href: '/citizen-services/infrastructure-public-services/drain-cleaning-request',
        icon: Droplets,
      },
      {
        id: 'street-light-repair',
        labelEn: 'Street Light Repair',
        labelBn: 'সড়কবাতি মেরামত',
        href: '/citizen-services/infrastructure-public-services/streetlight-repair',
        icon: Lamp,
      },
      {
        id: 'waterlogging-report',
        labelEn: 'Waterlogging Report',
        labelBn: 'জলাবদ্ধতা রিপোর্ট',
        href: '/citizen-services/infrastructure-public-services/waterlogging-report',
        icon: CloudRain,
      },
      {
        id: 'waste-management',
        labelEn: 'Waste Management',
        labelBn: 'বর্জ্য ব্যবস্থাপনা',
        href: '/citizen-services/infrastructure-public-services/waste-management',
        icon: Trash2,
      },
      {
        id: 'mosquito-control',
        labelEn: 'Mosquito Control',
        labelBn: 'মশক নিধন কার্যক্রম',
        href: '/citizen-services/infrastructure-public-services/mosquito-control',
        icon: ShieldAlert,
      },
      {
        id: 'park-playground',
        labelEn: 'Parks & Playgrounds',
        labelBn: 'পার্ক ও খেলার মাঠ',
        href: '/citizen-services/infrastructure-public-services/parks-playgrounds',
        icon: Trees,
      },
      {
        id: 'community-center',
        labelEn: 'Community Center Booking',
        labelBn: 'কমিউনিটি সেন্টার বুকিং',
        href: '/citizen-services/infrastructure-public-services/community-center-booking',
        icon: Building2,
      },
      {
        id: 'cemetery-services',
        labelEn: 'Cemetery & Cremation Services',
        labelBn: 'কবরস্থান ও শ্মশান সেবা',
        href: '/citizen-services/infrastructure-public-services/cemetery-cremation-services',
        icon: Landmark,
        serviceKey: 'cemeteryServices',
      },
      {
        id: 'public-toilet-info',
        labelEn: 'Public Toilet Information',
        labelBn: 'পাবলিক টয়লেট তথ্য',
        href: '/citizen-services/infrastructure-public-services/public-toilet-information',
        icon: MapPin,
      },
    ],
  },
];

export const MAIN_NAV_CATEGORIES: TopNavCategory[] = [
  {
    id: 'home',
    labelEn: 'Home',
    labelBn: 'হোম',
    href: '/',
    matchPaths: ['/'],
  },
  {
    id: 'about',
    labelEn: 'About Us',
    labelBn: 'আমাদের সম্পর্কে',
    matchPaths: ['/about'],
    align: 'left',
    items: [
      {
        id: 'about-corp',
        labelEn: 'About City Corporation',
        labelBn: 'সিটি কর্পোরেশন পরিচিতি',
        href: '/about/overview',
        icon: Landmark,
      },
      {
        id: 'history-background',
        labelEn: 'History & Background',
        labelBn: 'ইতিহাস ও পটভূমি',
        href: '/about/history',
        icon: BookOpen,
      },
      {
        id: 'mission-vision',
        labelEn: 'Mission & Vision',
        labelBn: 'লক্ষ্য ও উদ্দেশ্য',
        href: '/about/mission-vision',
        icon: Target,
      },
      {
        id: 'mayor-admin',
        labelEn: 'Mayor / Administrator',
        labelBn: 'মেয়র / প্রশাসক',
        href: '/about/mayor',
        icon: Award,
      },
      {
        id: 'councillors',
        labelEn: 'Councillors',
        labelBn: 'কাউন্সিলরবৃন্দ',
        href: '/about/councillors',
        icon: Users,
      },
      {
        id: 'ward-information',
        labelEn: 'Ward Information',
        labelBn: 'ওয়ার্ড তথ্য ও ডিরেক্টরি',
        href: '/about/wards',
        icon: MapPin,
      },
      {
        id: 'org-structure',
        labelEn: 'Organizational Structure',
        labelBn: 'সাংগঠনিক কাঠামো',
        href: '/about/organogram',
        icon: Building,
      },
      {
        id: 'departments-officials',
        labelEn: 'Departments & Officials',
        labelBn: 'বিভাগ ও কর্মকর্তাবৃন্দ',
        href: '/about/departments',
        icon: Briefcase,
      },
      {
        id: 'citizen-charter',
        labelEn: 'Citizen Charter',
        labelBn: 'সিটিজেন চার্টার',
        href: '/about/citizen-charter',
        icon: ScrollText,
      },
      {
        id: 'office-locations',
        labelEn: 'Office Locations',
        labelBn: 'অফিসের অবস্থান',
        href: '/about/locations',
        icon: Compass,
      },
      {
        id: 'contact-directory',
        labelEn: 'Contact Directory',
        labelBn: 'যোগাযোগ ডিরেক্টরি',
        href: '/about/contact',
        icon: Phone,
      },
    ],
  },
  {
    id: 'citizen-services',
    labelEn: 'Citizen Services',
    labelBn: 'নাগরিক সেবা',
    matchPaths: ['/citizen-services', '/verify'],
    isMega: true,
    columns: CITIZEN_SERVICES_COLUMNS,
    footerCta: {
      labelEn: 'Explore All Citizen Services',
      labelBn: 'সকল নাগরিক সেবা দেখুন',
      href: '/citizen-services',
    },
  },
  {
    id: 'public-tools',
    labelEn: 'Public Tools',
    labelBn: 'পাবলিক টুলস',
    matchPaths: ['/tax-calculator', '/verify', '/track', '/online-payment'],
    align: 'left',
    items: [
      {
        id: 'tool-tax-calc',
        labelEn: 'Holding Tax Calculator',
        labelBn: 'হোল্ডিং ট্যাক্স ক্যালকুলেটর',
        href: '/tax-calculator',
        icon: Calculator,
      },
      {
        id: 'tool-verify',
        labelEn: 'QR & Certificate Verify',
        labelBn: 'সনদ ও রসিদ যাচাই',
        href: '/verify',
        icon: BadgeCheck,
      },
      {
        id: 'tool-track',
        labelEn: 'Public Status Tracker',
        labelBn: 'পাবলিক স্ট্যাটাস ট্র্যাকার',
        href: '/track',
        icon: ClipboardCheck,
      },
      {
        id: 'tool-payment-guide',
        labelEn: 'Payment Fee Guide',
        labelBn: 'অনলাইন ফি নির্দেশিকা',
        href: '/online-payment',
        icon: CreditCard,
      },
    ],
  },
  {
    id: 'smart-city',
    labelEn: 'Smart City',
    labelBn: 'স্মার্ট সিটি ও স্বচ্ছতা',
    matchPaths: ['/city-map', '/projects', '/transparency', '/notices'],
    align: 'right',
    items: [
      {
        id: 'smart-gis-map',
        labelEn: 'Interactive GIS City Map',
        labelBn: 'ইন্টারঅ্যাক্টিভ জিআইএস সিটি ম্যাপ',
        href: '/city-map',
        icon: Map,
      },
      {
        id: 'smart-projects-budget',
        labelEn: 'Projects & Open Budget',
        labelBn: 'উন্নয়ন প্রকল্প ও উন্মুক্ত বাজেট',
        href: '/projects',
        icon: FolderKanban,
      },
      {
        id: 'smart-notices-news',
        labelEn: 'Notice Board & News',
        labelBn: 'ডিজিটাল নোটিশ বোর্ড ও সংবাদ',
        href: '/notices',
        icon: Bell,
      },
    ],
  },
];
