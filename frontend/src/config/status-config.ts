export type StatusPageType =
  | 'unavailable'
  | 'coming-soon'
  | 'maintenance'
  | 'not-found'
  | 'server-error'
  | 'connection-problem';

export type ServiceAvailability =
  | 'active'
  | 'coming-soon'
  | 'maintenance'
  | 'unavailable';

export type StatusIconKey =
  | 'clock'
  | 'rocket'
  | 'wrench'
  | 'search-x'
  | 'alert-triangle'
  | 'wifi-off';

export type ActionIconKey =
  | 'home'
  | 'headphones'
  | 'grid'
  | 'refresh'
  | 'wifi';

export type StatusActionType = 'link' | 'retry' | 'retry-connection';

export interface StatusActionConfig {
  id: string;
  label: string;
  labelBn: string;
  icon: ActionIconKey;
  variant: 'primary' | 'secondary';
  type: StatusActionType;
  href?: string;
}

export interface StatusPageConfig {
  type: StatusPageType;
  heading: string;
  descriptionBn: string;
  statusMessage: string;
  statusIcon: StatusIconKey;
  errorCode?: string;
  illustrationSrc: string;
  illustrationAlt: string;
  primaryAction: StatusActionConfig;
  secondaryAction: StatusActionConfig;
}

export const STATUS_PAGE_CONFIGS: Record<StatusPageType, StatusPageConfig> = {
  unavailable: {
    type: 'unavailable',
    heading: 'Service Temporarily Unavailable',
    descriptionBn:
      'এই সেবাটি বর্তমানে সাময়িকভাবে বন্ধ রয়েছে। আমরা যত দ্রুত সম্ভব সেবাটি পুনরায় চালু করার চেষ্টা করছি।',
    statusMessage: 'Please try again later.',
    statusIcon: 'clock',
    illustrationSrc: '/images/status/unavailable.jpg',
    illustrationAlt:
      'Service temporarily unavailable — municipal digital maintenance illustration',
    primaryAction: {
      id: 'go-home',
      label: 'Go to Homepage',
      labelBn: 'হোমপেজে ফিরে যান',
      icon: 'home',
      variant: 'primary',
      type: 'link',
      href: '/',
    },
    secondaryAction: {
      id: 'contact-support',
      label: 'Contact Support',
      labelBn: 'সহায়তায় যোগাযোগ করুন',
      icon: 'headphones',
      variant: 'secondary',
      type: 'link',
      href: '/about/contact',
    },
  },

  'coming-soon': {
    type: 'coming-soon',
    heading: 'Coming Soon',
    descriptionBn:
      'এই সেবাটি বর্তমানে উন্নয়নাধীন রয়েছে। খুব শিগগিরই নাগরিকদের জন্য সেবাটি চালু করা হবে।',
    statusMessage: 'This service will be available soon.',
    statusIcon: 'rocket',
    illustrationSrc: '/images/status/coming-soon.jpg',
    illustrationAlt:
      'Coming soon — Dhaka smart city digital service launch illustration',
    primaryAction: {
      id: 'go-home',
      label: 'Go to Homepage',
      labelBn: 'হোমপেজে ফিরে যান',
      icon: 'home',
      variant: 'primary',
      type: 'link',
      href: '/',
    },
    secondaryAction: {
      id: 'explore-services',
      label: 'Explore Services',
      labelBn: 'সেবাসমূহ দেখুন',
      icon: 'grid',
      variant: 'secondary',
      type: 'link',
      href: '/#services',
    },
  },

  maintenance: {
    type: 'maintenance',
    heading: 'Under Maintenance',
    descriptionBn:
      'সেবাটির মান উন্নয়ন ও প্রযুক্তিগত রক্ষণাবেক্ষণের জন্য বর্তমানে কাজ চলছে। কাজ সম্পন্ন হলে সেবাটি পুনরায় চালু করা হবে।',
    statusMessage: 'We will be back shortly.',
    statusIcon: 'wrench',
    illustrationSrc: '/images/status/maintenance.jpg',
    illustrationAlt:
      'Under maintenance — municipal server upgrade and tools illustration',
    primaryAction: {
      id: 'go-home',
      label: 'Go to Homepage',
      labelBn: 'হোমপেজে ফিরে যান',
      icon: 'home',
      variant: 'primary',
      type: 'link',
      href: '/',
    },
    secondaryAction: {
      id: 'contact-support',
      label: 'Contact Support',
      labelBn: 'সহায়তায় যোগাযোগ করুন',
      icon: 'headphones',
      variant: 'secondary',
      type: 'link',
      href: '/about/contact',
    },
  },

  'not-found': {
    type: 'not-found',
    heading: 'Page Not Found',
    descriptionBn:
      'দুঃখিত! আপনি যে পেজটি খুঁজছেন সেটি খুঁজে পাওয়া যায়নি। অনুগ্রহ করে সঠিক লিংক ব্যবহার করুন অথবা হোমপেজে ফিরে যান।',
    statusMessage: 'Error Code: 404',
    statusIcon: 'search-x',
    errorCode: '404',
    illustrationSrc: '/images/status/not-found.jpg',
    illustrationAlt:
      'Page not found — city map navigation magnifying glass illustration',
    primaryAction: {
      id: 'go-home',
      label: 'Go to Homepage',
      labelBn: 'হোমপেজে ফিরে যান',
      icon: 'home',
      variant: 'primary',
      type: 'link',
      href: '/',
    },
    secondaryAction: {
      id: 'explore-services',
      label: 'Explore Services',
      labelBn: 'সেবাসমূহ দেখুন',
      icon: 'grid',
      variant: 'secondary',
      type: 'link',
      href: '/#services',
    },
  },

  'server-error': {
    type: 'server-error',
    heading: 'Something Went Wrong',
    descriptionBn:
      'দুঃখিত! আপনার অনুরোধটি সম্পন্ন করতে একটি অপ্রত্যাশিত সমস্যা হয়েছে। অনুগ্রহ করে কিছুক্ষণ পর আবার চেষ্টা করুন।',
    statusMessage: 'Error Code: 500',
    statusIcon: 'alert-triangle',
    errorCode: '500',
    illustrationSrc: '/images/status/server-error.jpg',
    illustrationAlt:
      'Something went wrong — municipal server system alert illustration',
    primaryAction: {
      id: 'try-again',
      label: 'Try Again',
      labelBn: 'আবার চেষ্টা করুন',
      icon: 'refresh',
      variant: 'primary',
      type: 'retry',
    },
    secondaryAction: {
      id: 'go-home',
      label: 'Go to Homepage',
      labelBn: 'হোমপেজে ফিরে যান',
      icon: 'home',
      variant: 'secondary',
      type: 'link',
      href: '/',
    },
  },

  'connection-problem': {
    type: 'connection-problem',
    heading: 'Connection Problem',
    descriptionBn:
      'সার্ভারের সঙ্গে সংযোগ স্থাপন করা যাচ্ছে না। অনুগ্রহ করে আপনার ইন্টারনেট সংযোগ পরীক্ষা করে আবার চেষ্টা করুন।',
    statusMessage: 'Check your connection and try again.',
    statusIcon: 'wifi-off',
    illustrationSrc: '/images/status/connection-problem.jpg',
    illustrationAlt:
      'Connection problem — laptop and cloud server broken signal illustration',
    primaryAction: {
      id: 'retry-connection',
      label: 'Retry Connection',
      labelBn: 'পুনরায় সংযোগ চেষ্টা করুন',
      icon: 'wifi',
      variant: 'primary',
      type: 'retry-connection',
    },
    secondaryAction: {
      id: 'go-home',
      label: 'Go to Homepage',
      labelBn: 'হোমপেজে ফিরে যান',
      icon: 'home',
      variant: 'secondary',
      type: 'link',
      href: '/',
    },
  },
};

/**
 * Centralized Municipal Service Status Registry
 * Toggle any service between 'active', 'coming-soon', 'maintenance', or 'unavailable'
 * from this single source of truth. Navbar links and route guards read from here.
 */
export const serviceStatus = {
  birthRegistration: 'active',
  tradeLicense: 'active',
  holdingTax: 'active',
  gisMap: 'active',
  complaints: 'active',
  certificateVerify: 'active',
  openTransparency: 'active',
  facilityBooking: 'active',
  smartParking: 'active',
  airQualityMonitoring: 'active',
  smartDrainageSensors: 'active',
  cemeteryServices: 'active',
  tenderPortal: 'coming-soon',
  recruitmentPortal: 'coming-soon',
} as const satisfies Record<string, ServiceAvailability>;

export type ServiceKey = keyof typeof serviceStatus;

export interface ServiceMetadata {
  key: ServiceKey;
  nameEn: string;
  nameBn: string;
  /** Optional real scheduled maintenance completion time. Omit if none exists. */
  expectedCompletionTime?: string;
}

export const SERVICE_METADATA: Record<ServiceKey, ServiceMetadata> = {
  birthRegistration: {
    key: 'birthRegistration',
    nameEn: 'Birth & Death Registration',
    nameBn: 'জন্ম ও মৃত্যু নিবন্ধন',
  },
  tradeLicense: {
    key: 'tradeLicense',
    nameEn: 'Trade License Services',
    nameBn: 'ট্রেড লাইসেন্স সেবা',
  },
  holdingTax: {
    key: 'holdingTax',
    nameEn: 'Holding Tax Assessment & Payment',
    nameBn: 'হোল্ডিং ট্যাক্স মূল্যায়ন ও পরিশোধ',
  },
  gisMap: {
    key: 'gisMap',
    nameEn: 'Interactive GIS City Map',
    nameBn: 'ইন্টারেক্টিভ জিআইএস সিটি ম্যাপ',
  },
  complaints: {
    key: 'complaints',
    nameEn: 'Citizen Complaints & Resolution',
    nameBn: 'নাগরিক অভিযোগ ও সমাধান',
  },
  certificateVerify: {
    key: 'certificateVerify',
    nameEn: 'QR Certificate Verification',
    nameBn: 'কিউআর সনদ যাচাইকরণ',
  },
  openTransparency: {
    key: 'openTransparency',
    nameEn: 'Open Budget & Development Projects',
    nameBn: 'উন্মুক্ত বাজেট ও উন্নয়ন প্রকল্প',
  },
  facilityBooking: {
    key: 'facilityBooking',
    nameEn: 'Community Center & Facility Booking',
    nameBn: 'কমিউনিটি সেন্টার ও ফ্যাসিলিটি বুকিং',
  },
  smartParking: {
    key: 'smartParking',
    nameEn: 'Smart Parking Management',
    nameBn: 'স্মার্ট পার্কিং ব্যবস্থাপনা',
  },
  airQualityMonitoring: {
    key: 'airQualityMonitoring',
    nameEn: 'Real-Time Air Quality Monitoring',
    nameBn: 'রিয়েল-টাইম বায়ুমান পর্যবেক্ষণ',
  },
  smartDrainageSensors: {
    key: 'smartDrainageSensors',
    nameEn: 'Smart Drainage IoT Monitoring',
    nameBn: 'স্মার্ট ড্রেনেজ মনিটরিং',
  },
  cemeteryServices: {
    key: 'cemeteryServices',
    nameEn: 'Online Cemetery & Crematorium Services',
    nameBn: 'অনলাইন কবরস্থান ও শ্মশান সেবা',
  },
  tenderPortal: {
    key: 'tenderPortal',
    nameEn: 'Municipal e-Tender Portal',
    nameBn: 'দরপত্র (ই-টেন্ডার) পোর্টাল',
  },
  recruitmentPortal: {
    key: 'recruitmentPortal',
    nameEn: 'Online Recruitment & Careers',
    nameBn: 'অনলাইন নিয়োগ পোর্টাল',
  },
};

export function isServiceKey(value: string | null | undefined): value is ServiceKey {
  return Boolean(value && value in serviceStatus);
}

export function getServiceStatus(key: ServiceKey): ServiceAvailability {
  return serviceStatus[key];
}

export function getStatusRouteForAvailability(
  availability: Exclude<ServiceAvailability, 'active'>,
  serviceKey?: ServiceKey
): string {
  const basePath =
    availability === 'coming-soon'
      ? '/coming-soon'
      : availability === 'maintenance'
        ? '/maintenance'
        : '/unavailable';

  return serviceKey ? `${basePath}?service=${encodeURIComponent(serviceKey)}` : basePath;
}

/**
 * Single centralized route resolver used by Navbar, MegaMenu, MobileNavigation,
 * and service cards. Returns the actual route when active, or routes cleanly
 * to the corresponding status page without duplicating logic.
 */
export function resolveServiceHref(defaultHref: string, serviceKey?: ServiceKey): string {
  if (!serviceKey) return defaultHref;
  const status = getServiceStatus(serviceKey);
  if (status === 'active') return defaultHref;
  return getStatusRouteForAvailability(status, serviceKey);
}

export function getServiceMetaByParam(
  serviceParam: string | null | undefined
): ServiceMetadata | null {
  if (!isServiceKey(serviceParam)) return null;
  return SERVICE_METADATA[serviceParam];
}
