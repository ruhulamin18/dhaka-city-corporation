import {
  DepartmentContactInfo,
  ServiceFeeSchedule,
} from '@/types/citizen-service';

export const SERVICE_DEPARTMENTS: Record<string, DepartmentContactInfo> = {
  birth_death: {
    id: 'birth_death',
    name: {
      bn: 'জন্ম ও মৃত্যু নিবন্ধন শাখা',
      en: 'Birth & Death Registration Wing',
    },
    phone: '+880-2-223383545',
    email: 'registrar@dscc.smartcity.gov.bd',
    officeAddress: {
      bn: 'আঞ্চলিক কার্যালয়সমূহ ও সংশ্লিষ্ট ওয়ার্ড অফিস (প্রধান কার্যালয়: নগর ভবন, ফুলবাড়িয়া, ঢাকা-১০০০)',
      en: 'All Zonal & Respective Ward Offices (HQ: Nagar Bhaban, Fulbaria, Dhaka-1000)',
    },
    hours: {
      bn: 'রবিবার – বৃহস্পতিবার, সকাল ৯:০০টা – বিকাল ৫:০০টা',
      en: 'Sunday – Thursday, 9:00 AM – 5:00 PM',
    },
    supportHref: '/about/contact',
  },
  license: {
    id: 'license',
    name: {
      bn: 'লাইসেন্স শাখা (ই-ট্রেড উইং)',
      en: 'Licensing Wing (E-Trade Desk)',
    },
    phone: '+880-2-223383525',
    email: 'license@dscc.smartcity.gov.bd',
    officeAddress: {
      bn: 'নগর ভবন, লেভেল-৫ (লাইসেন্স উইং), ফুলবাড়িয়া, ঢাকা-১০০০',
      en: 'Nagar Bhaban, Level 5 (License Wing), Fulbaria, Dhaka-1000',
    },
    hours: {
      bn: 'রবিবার – বৃহস্পতিবার, সকাল ৯:০০টা – বিকাল ৫:০০টা',
      en: 'Sunday – Thursday, 9:00 AM – 5:00 PM',
    },
    supportHref: '/about/contact',
  },
  revenue: {
    id: 'revenue',
    name: {
      bn: 'রাজস্ব ও কর মূল্যায়ন বিভাগ',
      en: 'Revenue & Tax Assessment Department',
    },
    phone: '+880-2-223383521',
    email: 'cro@dscc.smartcity.gov.bd',
    officeAddress: {
      bn: 'নগর ভবন, ৫ ফিনিক্স রোড, ফুলবাড়িয়া, ঢাকা-১০০০',
      en: 'Nagar Bhaban, 5 Phoenix Road, Fulbaria, Dhaka-1000',
    },
    hours: {
      bn: 'রবিবার – বৃহস্পতিবার, সকাল ৯:০০টা – বিকাল ৫:০০টা',
      en: 'Sunday – Thursday, 9:00 AM – 5:00 PM',
    },
    supportHref: '/about/contact',
  },
  engineering: {
    id: 'engineering',
    name: {
      bn: 'প্রকৌশল ও সড়ক বিভাগ',
      en: 'Engineering, Roads & Drainage Department',
    },
    phone: '+880-2-223383511',
    email: 'ce@dscc.smartcity.gov.bd',
    officeAddress: {
      bn: 'নগর ভবন (প্রকৌশল শাখা), ফুলবাড়িয়া, ঢাকা-১০০০',
      en: 'Nagar Bhaban (Engineering Wing), Fulbaria, Dhaka-1000',
    },
    hours: {
      bn: 'রবিবার – বৃহস্পতিবার, সকাল ৯:০০টা – বিকাল ৫:০০টা',
      en: 'Sunday – Thursday, 9:00 AM – 5:00 PM',
    },
    supportHref: '/about/contact',
  },
  conservancy: {
    id: 'conservancy',
    name: {
      bn: 'বর্জ্য ব্যবস্থাপনা ও পরিচ্ছন্নতা বিভাগ',
      en: 'Waste Management & Conservancy Department',
    },
    phone: '+880-2-223383531',
    email: 'cwmo@dscc.smartcity.gov.bd',
    officeAddress: {
      bn: 'নগর ভবন (বর্জ্য ব্যবস্থাপনা সেল), ফুলবাড়িয়া, ঢাকা-১০০০',
      en: 'Nagar Bhaban (Conservancy Cell), Fulbaria, Dhaka-1000',
    },
    hours: {
      bn: 'রবিবার – বৃহস্পতিবার, সকাল ৯:০০টা – বিকাল ৫:০০টা (জরুরি কন্ট্রোল রুম: ১৬১০৬)',
      en: 'Sunday – Thursday, 9:00 AM – 5:00 PM (Control Room: 16106)',
    },
    supportHref: '/about/contact',
  },
  health: {
    id: 'health',
    name: {
      bn: 'স্বাস্থ্য ও মশক নিধন বিভাগ',
      en: 'Public Health & Vector Control Department',
    },
    phone: '+880-2-223383540',
    email: 'cho@dscc.smartcity.gov.bd',
    officeAddress: {
      bn: 'নগর ভবন, লেভেল-৬, ফুলবাড়িয়া, ঢাকা-১০০০',
      en: 'Nagar Bhaban, Level 6, Fulbaria, Dhaka-1000',
    },
    hours: {
      bn: 'রবিবার – বৃহস্পতিবার, সকাল ৯:০০টা – বিকাল ৫:০০টা',
      en: 'Sunday – Thursday, 9:00 AM – 5:00 PM',
    },
    supportHref: '/about/contact',
  },
  estate: {
    id: 'estate',
    name: {
      bn: 'সমাজকল্যাণ ও সম্পত্তি বিভাগ',
      en: 'Social Welfare & Estate Department',
    },
    phone: '+880-2-223383500',
    email: 'info@dscc.smartcity.gov.bd',
    officeAddress: {
      bn: 'নগর ভবন, ৫ ফিনিক্স রোড, ফুলবাড়িয়া, ঢাকা-১০০০',
      en: 'Nagar Bhaban, 5 Phoenix Road, Fulbaria, Dhaka-1000',
    },
    hours: {
      bn: 'রবিবার – বৃহস্পতিবার, সকাল ৯:০০টা – বিকাল ৫:০০টা',
      en: 'Sunday – Thursday, 9:00 AM – 5:00 PM',
    },
    supportHref: '/about/contact',
  },
};

export const UPDATING_FEE_SCHEDULE: ServiceFeeSchedule = {
  isVerified: false,
  applicationFee: {
    bn: 'তথ্য হালনাগাদ করা হচ্ছে।',
    en: 'Information is being updated.',
  },
  serviceCharge: {
    bn: 'তথ্য হালনাগাদ করা হচ্ছে।',
    en: 'Information is being updated.',
  },
  processingTime: {
    bn: 'তথ্য হালনাগাদ করা হচ্ছে।',
    en: 'Information is being updated.',
  },
  paymentMethods: {
    bn: 'তথ্য হালনাগাদ করা হচ্ছে।',
    en: 'Information is being updated.',
  },
};
