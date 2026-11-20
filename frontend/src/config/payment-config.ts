import { BillLookupRecord, PaymentProviderMethod } from '@/types/payment';

export interface PaymentMethodConfig {
  id: PaymentProviderMethod;
  name: { bn: string; en: string };
  logo: string;
  category: 'mfs' | 'card' | 'bank';
  gatewayFeePercentage: number;
  minAmount: number;
  maxAmount: number;
  description: { bn: string; en: string };
  popular?: boolean;
}

export const PAYMENT_METHODS: PaymentMethodConfig[] = [
  {
    id: 'bkash',
    name: { bn: 'বিকাশ', en: 'bKash' },
    logo: '/images/payment/bkash.svg',
    category: 'mfs',
    gatewayFeePercentage: 0,
    minAmount: 10,
    maxAmount: 250000,
    description: {
      bn: 'বিকাশ ওয়ালেট অথবা কিউআর কোড দিয়ে দ্রুত ও নিরাপদ পরিশোধ',
      en: 'Fast and secure payment via bKash wallet or QR code',
    },
    popular: true,
  },
  {
    id: 'nagad',
    name: { bn: 'নগদ', en: 'Nagad' },
    logo: '/images/payment/nagad.svg',
    category: 'mfs',
    gatewayFeePercentage: 0,
    minAmount: 10,
    maxAmount: 250000,
    description: {
      bn: 'বাংলাদেশ ডাক বিভাগের ডিজিটাল লেনদেন সেবা',
      en: 'Postal Department digital financial service',
    },
    popular: true,
  },
  {
    id: 'rocket',
    name: { bn: 'রকেট', en: 'Rocket' },
    logo: '/images/payment/rocket.svg',
    category: 'mfs',
    gatewayFeePercentage: 0,
    minAmount: 10,
    maxAmount: 200000,
    description: {
      bn: 'ডাচ-বাংলা ব্যাংক মোবাইল ব্যাংকিং সার্ভিস',
      en: 'Dutch-Bangla Bank mobile financial service',
    },
  },
  {
    id: 'card',
    name: { bn: 'ভিসা / মাস্টারকার্ড / এমেক্স', en: 'Visa / Mastercard / Amex' },
    logo: '/images/payment/cards.svg',
    category: 'card',
    gatewayFeePercentage: 0,
    minAmount: 50,
    maxAmount: 1000000,
    description: {
      bn: 'যেকোনো স্থানীয় বা আন্তর্জাতিক ডেবিট/ক্রেডিট কার্ড',
      en: 'Any domestic or international debit/credit card',
    },
  },
  {
    id: 'internet_banking',
    name: { bn: 'ইন্টারনেট ব্যাংকিং', en: 'Internet Banking' },
    logo: '/images/payment/bank.svg',
    category: 'bank',
    gatewayFeePercentage: 0,
    minAmount: 100,
    maxAmount: 2500000,
    description: {
      bn: 'সোনালী ব্যাংক, ব্র্যাক ব্যাংক, সিটি টাচ, ইবিএল স্কাইব্যাংক ও অন্যান্য',
      en: 'Sonali, BRAC, Citytouch, EBL Skybanking & more',
    },
  },
];

export const STATUTORY_CERTIFICATE_FEES = [
  {
    code: 'BIRTH_CERT',
    name: { bn: 'জন্ম নিবন্ধন সনদ (ইংরেজি প্রতিলিপি)', en: 'Birth Registration Certificate (English Copy)' },
    fee: 100,
    deliveryDays: '১-২ কর্মদিবস',
  },
  {
    code: 'CITIZEN_CERT',
    name: { bn: 'নাগরিকত্ব সনদপত্র', en: 'Citizenship Certificate' },
    fee: 150,
    deliveryDays: '১-৩ কর্মদিবস',
  },
  {
    code: 'CHARACTER_CERT',
    name: { bn: 'চারিত্রিক সনদপত্র', en: 'Character Certificate' },
    fee: 100,
    deliveryDays: '১-২ কর্মদিবস',
  },
  {
    code: 'DEATH_CERT',
    name: { bn: 'মৃত্যু নিবন্ধন সনদ', en: 'Death Certificate' },
    fee: 100,
    deliveryDays: '১-৩ কর্মদিবস',
  },
  {
    code: 'INHERITANCE_CERT',
    name: { bn: 'ওয়ারিশান সনদপত্র', en: 'Inheritance (Waris) Certificate' },
    fee: 250,
    deliveryDays: '৩-৫ কর্মদিবস',
  },
  {
    code: 'INCOME_CERT',
    name: { bn: 'পারিবারিক আয়ের সনদ', en: 'Family Income Solvency Certificate' },
    fee: 200,
    deliveryDays: '২-৩ কর্মদিবস',
  },
];

export const OTHER_CIVIC_SERVICES = [
  {
    code: 'COMMUNITY_CENTER',
    name: { bn: 'কমিউনিটি সেন্টার বুকিং ফি', en: 'Community Center Booking Fee' },
    description: {
      bn: 'ঢাকা দক্ষিণ/উত্তর সিটি কর্পোরেশন আওতাধীন আধুনিক কমিউনিটি সেন্টার ভাড়া',
      en: 'Rental booking fee for City Corporation community centers',
    },
    standardFee: 25000,
    vatRate: 0.15,
  },
  {
    code: 'SPECIAL_WASTE',
    name: { bn: 'বিশেষ বর্জ্য অপসারণ ফি', en: 'Special Waste Removal Fee' },
    description: {
      bn: 'নির্মাণ ধ্বংসাবশেষ, শিল্প বর্জ্য বা বিশেষ মেগা ইভেন্ট আবর্জনা অপসারণ',
      en: 'Construction debris, commercial waste or mega event clean-up',
    },
    standardFee: 3500,
    vatRate: 0,
  },
  {
    code: 'ROAD_CUTTING',
    name: { bn: 'রাস্তা খনন ও পুনঃনির্মাণ ফি', en: 'Road Cutting & Restoration Fee' },
    description: {
      bn: 'ইউটিলিটি সংযোগের (গ্যাস, পানি, বিদ্যুৎ) জন্য অনুমতি ও পুনঃনির্মাণ জামানত',
      en: 'Trenching permission fee & road reconstruction security deposit',
    },
    standardFee: 12000,
    vatRate: 0.05,
  },
  {
    code: 'PARK_VENUE',
    name: { bn: 'পৌর পার্ক ও খেলার মাঠ বরাদ্দ ফি', en: 'Municipal Park & Field Booking' },
    description: {
      bn: 'নাগরিক মেলা, ক্রীড়া উৎসব বা জনসচেতনতামূলক সমাবেশের অনুমতি ফি',
      en: 'Civic fairs, cultural events, or public sports reservation',
    },
    standardFee: 7500,
    vatRate: 0.15,
  },
];

// Realistic Pre-seeded Mock Records for Live Lookup Testing
export const SEED_BILL_LOOKUP_RECORDS: BillLookupRecord[] = [
  // 1. Holding Tax Records
  {
    id: 'BILL-HLD-001',
    serviceType: 'HOLDING_TAX',
    referenceNumber: 'H-10482',
    wardNumber: 19,
    payerName: { bn: 'আলহাজ্ব ড. রফিকুল ইসলাম', en: 'Alhaj Dr. Rafiqul Islam' },
    payerPhone: '01711-234567',
    payerAddress: {
      bn: 'বাড়ি নং ৪২, রোড নং ৭, বনানী, ঢাকা-১২১৩',
      en: 'House 42, Road 7, Banani, Dhaka-1213',
    },
    propertyOrBusinessDetails: {
      bn: '৬ তলা আবাসিক ভবন (আয়তন: ৫,২০০ বর্গফুট)',
      en: '6-Story Residential Building (Area: 5,200 sq.ft)',
    },
    fiscalYear: '২০২৫-২০২৬ (১ম ও ২য় প্রান্তিক)',
    categoryLabel: { bn: 'আবাসিক হোল্ডিং ট্যাক্স', en: 'Residential Holding Tax' },
    subItems: [
      {
        label: { bn: 'সাধারণ পৌর কর (১২%)', en: 'General Municipal Tax (12%)' },
        amount: 14200,
      },
      {
        label: { bn: 'আলোকায়ন কর (৩%)', en: 'Street Lighting Tax (3%)' },
        amount: 3550,
      },
      {
        label: { bn: 'পরিচ্ছন্নতা ও বর্জ্য ব্যবস্থাপনা কর (৭%)', en: 'Conservancy & Sanitation Tax (7%)' },
        amount: 8280,
      },
    ],
    arrearsAmount: 4500,
    currentAmount: 26030,
    rebateAmount: 2603, // 10% timely payment rebate on current
    vatOrServiceCharge: 0,
    totalPayable: 27927,
    paymentStatus: 'unpaid',
    lastPaymentDate: '2025-05-14',
    lastReceiptNumber: 'DSCC-RCP-2025-10492',
  },
  {
    id: 'BILL-HLD-002',
    serviceType: 'HOLDING_TAX',
    referenceNumber: 'H-20915',
    wardNumber: 34,
    payerName: { bn: 'বেগম সুফিয়া কামাল', en: 'Begum Sufia Kamal' },
    payerPhone: '01819-876543',
    payerAddress: {
      bn: 'হোল্ডিং নং ১২/এ, নাজিরাবাজার, পুরান ঢাকা',
      en: 'Holding 12/A, Nazirabazar, Old Dhaka',
    },
    propertyOrBusinessDetails: {
      bn: 'বাণিজ্যিক ও আবাসিক মিশ্র বহুতল ভবন',
      en: 'Commercial & Residential Mixed-Use Complex',
    },
    fiscalYear: '২০২৫-২০২৬ (সম্পূর্ণ বছর)',
    categoryLabel: { bn: 'বাণিজ্যিক হোল্ডিং ট্যাক্স', en: 'Commercial Holding Tax' },
    subItems: [
      {
        label: { bn: 'সাধারণ পৌর কর (১৫%)', en: 'General Commercial Tax (15%)' },
        amount: 32000,
      },
      {
        label: { bn: 'আলোকায়ন ও নিষ্কাশন কর', en: 'Lighting & Drainage Tax' },
        amount: 8000,
      },
    ],
    arrearsAmount: 0,
    currentAmount: 40000,
    rebateAmount: 4000,
    vatOrServiceCharge: 0,
    totalPayable: 36000,
    paymentStatus: 'unpaid',
  },

  // 2. Trade License Records
  {
    id: 'BILL-TRD-001',
    serviceType: 'TRADE_LICENSE',
    referenceNumber: 'TRAD/DSCC/019284/2026',
    secondaryReference: 'TIN-4892104921',
    wardNumber: 21,
    payerName: { bn: 'মেসার্স মেঘনা এন্টারপ্রাইজ (স্বত্বাধিকারী: মো: তারিক জামিল)', en: 'M/S Meghna Enterprise (Prop: Md. Tariq Jamil)' },
    payerPhone: '01914-556677',
    payerAddress: {
      bn: 'দোকান নং ১৫, বায়তুল মোকাররম সুপার মার্কেট, ঢাকা',
      en: 'Shop 15, Baitul Mukarram Super Market, Dhaka',
    },
    propertyOrBusinessDetails: {
      bn: 'পাইকারি ও খুচরা ইলেকট্রনিক্স পণ্য বিপণন (লাইসেন্স নবায়ন)',
      en: 'Wholesale & Retail Electronics Merchandising (Renewal)',
    },
    fiscalYear: '২০২৫-২০২৬',
    categoryLabel: { bn: 'ব্যবসা ও বাণিজ্য নবায়ন ফি', en: 'Trade License Renewal Fee' },
    subItems: [
      {
        label: { bn: 'মূল ট্রেড লাইসেন্স ফি (শ্রেণি: খ)', en: 'Base Trade License Fee (Class B)' },
        amount: 4500,
      },
      {
        label: { bn: 'সাইনবোর্ড কর (১২ বর্গফুট)', en: 'Signboard Advertisement Tax (12 sq.ft)' },
        amount: 900,
      },
      {
        label: { bn: 'উৎস কর (সরকার নির্ধারিত)', en: 'Source Tax (AIT)' },
        amount: 1000,
      },
    ],
    arrearsAmount: 0,
    currentAmount: 6400,
    rebateAmount: 0,
    vatOrServiceCharge: 810, // 15% VAT on service
    totalPayable: 7210,
    paymentStatus: 'unpaid',
  },

  // 3. Certificate Records
  {
    id: 'BILL-CRT-001',
    serviceType: 'CERTIFICATE',
    referenceNumber: 'CERT-2026-98124',
    wardNumber: 7,
    payerName: { bn: 'তানভীর আহমেদ চৌধুরী', en: 'Tanvir Ahmed Chowdhury' },
    payerPhone: '01678-990011',
    payerAddress: {
      bn: 'সেকশন ৬, ব্লক ডি, মিরপুর, ঢাকা-১২১৬',
      en: 'Section 6, Block D, Mirpur, Dhaka-1216',
    },
    propertyOrBusinessDetails: {
      bn: 'নাগরিকত্ব ও চারিত্রিক সনদপত্র আবেদন',
      en: 'Citizenship & Character Certificate Issuance',
    },
    categoryLabel: { bn: 'পৌর সনদপত্র ফি', en: 'Civic Certificate Fee' },
    subItems: [
      {
        label: { bn: 'নাগরিকত্ব সনদ সরকারি ফি', en: 'Citizenship Certificate Statutory Fee' },
        amount: 150,
      },
      {
        label: { bn: 'ডিজিটাল কিউআর ভেরিফিকেশন ও সিল ফি', en: 'Digital QR Verification & Seal Fee' },
        amount: 50,
      },
    ],
    arrearsAmount: 0,
    currentAmount: 200,
    rebateAmount: 0,
    vatOrServiceCharge: 0,
    totalPayable: 200,
    paymentStatus: 'unpaid',
  },

  // 4. Application Fee Records
  {
    id: 'BILL-APP-001',
    serviceType: 'APPLICATION',
    referenceNumber: 'APP-DSCC-2026-44109',
    wardNumber: 15,
    payerName: { bn: 'ফারহানা ইয়াসমিন', en: 'Farhana Yasmin' },
    payerPhone: '01552-334455',
    payerAddress: {
      bn: 'রোড ১২/বি, ধানমন্ডি আ/এ, ঢাকা',
      en: 'Road 12/B, Dhanmondi R/A, Dhaka',
    },
    propertyOrBusinessDetails: {
      bn: 'নতুন হোল্ডিং নম্বর বরাদ্দ ও সার্ভে আবেদন',
      en: 'New Holding Assessment & Survey Application',
    },
    categoryLabel: { bn: 'পৌর সেবা আবেদন ফি', en: 'Civic Application Review Fee' },
    subItems: [
      {
        label: { bn: 'হোল্ডিং এসেসমেন্ট স্কুটিনি ফি', en: 'Holding Assessment Scrutiny Fee' },
        amount: 500,
      },
      {
        label: { bn: 'মাঠ পরিদর্শন ও জিআইএস ম্যাপিং ফি', en: 'Field Inspection & GIS Mapping Fee' },
        amount: 1000,
      },
    ],
    arrearsAmount: 0,
    currentAmount: 1500,
    rebateAmount: 0,
    vatOrServiceCharge: 0,
    totalPayable: 1500,
    paymentStatus: 'unpaid',
  },

  // 5. Other Civic Services
  {
    id: 'BILL-OTH-001',
    serviceType: 'OTHER_SERVICE',
    referenceNumber: 'DSCC-OTH-2026-7811',
    wardNumber: 26,
    payerName: { bn: 'ইঞ্জিনিয়ার মশিউর রহমান', en: 'Engr. Moshiur Rahman' },
    payerPhone: '01712-887766',
    payerAddress: {
      bn: 'আজিমপুর গভঃ কোয়ার্টার রোড, লালবাগ, ঢাকা',
      en: 'Azimpur Govt. Quarter Road, Lalbagh, Dhaka',
    },
    propertyOrBusinessDetails: {
      bn: 'আজিমপুর আধুনিক কমিউনিটি সেন্টার (সান্ধ্যকালীন শিফট বুকিং)',
      en: 'Azimpur Community Center (Evening Shift Booking)',
    },
    categoryLabel: { bn: 'কমিউনিটি সেন্টার বুকিং ফি', en: 'Community Center Booking Fee' },
    subItems: [
      {
        label: { bn: 'হল ভাড়া (সন্ধ্যা ৬:০০ - রাত ১১:০০)', en: 'Hall Rental (6:00 PM - 11:00 PM)' },
        amount: 25000,
      },
      {
        label: { bn: 'পরিচ্ছন্নতা ও বিদ্যুৎ চার্জ', en: 'Sanitation & Electricity Utility Surcharge' },
        amount: 3000,
      },
    ],
    arrearsAmount: 0,
    currentAmount: 28000,
    rebateAmount: 0,
    vatOrServiceCharge: 4200, // 15% VAT
    totalPayable: 32200,
    paymentStatus: 'unpaid',
  },
];
