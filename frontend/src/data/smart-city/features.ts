import {
  AlertTriangle,
  Bot,
  Compass,
  Construction,
  Droplets,
  LayoutDashboard,
  Map,
  MapPin,
  ParkingCircle,
  Siren,
  Trash2,
  Wind,
} from 'lucide-react';
import type {
  SmartCityCategoryMeta,
  SmartCityFeatureMeta,
  SmartCityFeatureSlug,
} from '@/types/smart-city';

export const SMART_CITY_CATEGORIES: SmartCityCategoryMeta[] = [
  {
    id: 'gis-mapping',
    number: '01',
    title: {
      bn: 'স্মার্ট জিআইএস ও ডিজিটাল ম্যাপিং',
      en: 'Smart GIS & Digital Mapping',
    },
    description: {
      bn: 'স্যাটেলাইট স্তর ও ইন্টারেক্টিভ ভৌগোলিক মানচিত্রের মাধ্যমে নাগরিক অবকাঠামো এবং ওয়ার্ডভিত্তিক তথ্য অনুসন্ধান।',
      en: 'Satellite-layered interactive GIS for city infrastructure exploration, ward boundaries, and geospatial navigation.',
    },
    featureSlugs: ['gis-map', 'ward-map'],
  },
  {
    id: 'urban-management',
    number: '02',
    title: {
      bn: 'স্মার্ট নগর ব্যবস্থাপনা',
      en: 'Smart Urban Management',
    },
    description: {
      bn: 'বর্জ্য অপসারণ সময়সূচি, ড্রেনেজ ও জলাবদ্ধতা মনিটরিং, সড়ক সংস্কার ও পরিকল্পিত পার্কিং নেটওয়ার্ক।',
      en: 'Municipal waste scheduling, drainage monitoring, road condition inspection, and structured smart parking.',
    },
    featureSlugs: ['waste-management', 'drainage-monitoring', 'road-monitoring', 'smart-parking'],
  },
  {
    id: 'environment-safety',
    number: '03',
    title: {
      bn: 'পরিবেশ ও জননিরাপত্তা',
      en: 'Environment & Public Safety',
    },
    description: {
      bn: 'বায়ুমান সূচক পর্যবেক্ষণ, গণসুবিধা লোকেটর, জরুরি জাতীয় এসওএস এবং দুর্যোগ সতর্কবার্তা।',
      en: 'Real-time air quality index, public facility locator, national emergency SOS, and official meteorological alerts.',
    },
    featureSlugs: ['air-quality', 'facility-locator', 'emergency-sos', 'disaster-alerts'],
  },
  {
    id: 'citizen-intelligence',
    number: '04',
    title: {
      bn: 'ডিজিটাল সিটিজেন ইন্টেলিজেন্স',
      en: 'Digital Citizen Intelligence',
    },
    description: {
      bn: 'দ্বিভাষিক কৃত্রিম বুদ্ধিমত্তা চালিত নাগরিক সহায়ক এবং সমন্বিত স্মার্ট সিটি অপারেশনস ড্যাশবোর্ড।',
      en: 'Bilingual AI citizen assistant for municipal guidance and a unified Smart City executive dashboard.',
    },
    featureSlugs: ['ai-assistant', 'dashboard'],
  },
];

export const SMART_CITY_FEATURES: Record<SmartCityFeatureSlug, SmartCityFeatureMeta> = {
  'gis-map': {
    slug: 'gis-map',
    category: 'gis-mapping',
    title: {
      bn: 'ইন্টারঅ্যাক্টিভ জিআইএস ম্যাপ',
      en: 'Interactive GIS Map',
    },
    shortTitle: {
      bn: 'জিআইএস ম্যাপ',
      en: 'GIS Map',
    },
    subtitle: {
      bn: 'স্যাটেলাইট ও হাইব্রিড স্তরের মাধ্যমে ঢাকা নগরীর সরকারি অফিস, হাসপাতাল, পার্ক ও ইউটিলিটি অবকাঠামো অন্বেষণ করুন।',
      en: 'Explore Dhaka municipal infrastructure, public services, hospitals, and parks with multi-layer Google Maps satellite views.',
    },
    purpose: {
      bn: 'নাগরিকদের জন্য নির্ভরযোগ্য ভৌগোলিক অবস্থান অনুসন্ধান, ওয়ার্ডভিত্তিক ফিল্টারিং ও অবকাঠামোগত স্তর চিহ্নিতকরণের ডিজিটাল মাধ্যম।',
      en: 'Provide an authoritative GIS mapping system for visual exploration of ward boundaries, government facilities, and utilities.',
    },
    icon: Map,
    badge: { bn: 'স্যাটেলাইট জিআইএস', en: 'Satellite GIS' },
    highlightStats: [
      { label: { bn: 'নিবন্ধিত জিআইএস মার্কার', en: 'Verified GIS Points' }, value: '180+' },
      { label: { bn: 'ভৌগোলিক তথ্য স্তর', en: 'Map Layers' }, value: '6' },
      { label: { bn: 'আওতাভুক্ত ওয়ার্ড', en: 'Covered Wards' }, value: '54' },
    ],
  },
  'ward-map': {
    slug: 'ward-map',
    category: 'gis-mapping',
    title: {
      bn: 'ওয়ার্ডভিত্তিক ডিজিটাল ম্যাপ',
      en: 'Ward-Based Digital Map',
    },
    shortTitle: {
      bn: 'ওয়ার্ড ম্যাপ',
      en: 'Ward Map',
    },
    subtitle: {
      bn: 'আপনার নির্দিষ্ট ওয়ার্ড নির্বাচন করে কাউন্সিলর অফিস, জনসংখ্যা তথ্য, বর্জ্য ভ্যান সময়সূচি ও স্থানীয় জনসুবিধাসমূহ দেখুন।',
      en: 'Select any ward to inspect its administrative boundaries, councillor contact, population, waste schedule, and local amenities.',
    },
    purpose: {
      bn: 'ওয়ার্ডভিত্তিক নাগরিক অধিকার, স্থানীয় প্রতিনিধির তথ্য ও জরুরি নাগরিক সুবিধাসমূহ এক নজরে উপস্থাপন।',
      en: 'Empower citizens with localized administrative transparency, ward councillor details, and emergency neighborhood facilities.',
    },
    icon: MapPin,
    badge: { bn: 'ওয়ার্ড পোর্টাল', en: 'Ward Portal' },
    highlightStats: [
      { label: { bn: 'ডিজিটালাইজড ওয়ার্ড', en: 'Digital Wards' }, value: '8' },
      { label: { bn: 'কাউন্সিলর ডিরেক্টরি', en: 'Councillors' }, value: '100%' },
      { label: { bn: 'জরুরি ওয়ার্ড হেল্পলাইন', en: 'Emergency Lines' }, value: '24/7' },
    ],
  },
  'waste-management': {
    slug: 'waste-management',
    category: 'urban-management',
    title: {
      bn: 'স্মার্ট বর্জ্য ব্যবস্থাপনা',
      en: 'Smart Waste Management',
    },
    shortTitle: {
      bn: 'বর্জ্য ব্যবস্থাপনা',
      en: 'Waste Management',
    },
    subtitle: {
      bn: 'ওয়ার্ডভিত্তিক সকাল ও রাতের প্রাথমিক বর্জ্য ভ্যানের সময়সূচি, উৎসস্থলে বর্জ্য পৃথকীকরণ নির্দেশিকা ও অপসারিত না হওয়া বর্জ্যের রিপোর্ট।',
      en: 'Ward-wise primary collection schedules, source segregation protocols, secondary transfer stations, and uncollected waste reporting.',
    },
    purpose: {
      bn: 'একটি পরিচ্ছন্ন, পরিবেশবান্ধব ও টেকসই ঢাকা গড়ার লক্ষ্যে ডিজিটাল বর্জ্য ব্যবস্থাপনা ও নাগরিক প্রতিবেদন সুবিধা।',
      en: 'Digitize municipal solid waste collection schedules, enforce segregation guidelines, and ensure zero-tolerance uncollected waste resolution.',
    },
    icon: Trash2,
    badge: { bn: 'দৈনিক শিফট', en: 'Daily Schedule' },
    highlightStats: [
      { label: { bn: 'প্রতিদিনের অপসারিত বর্জ্য', en: 'Daily Collection' }, value: '3,200 Ton' },
      { label: { bn: 'কম্প্যাক্টর ও ভ্যান বহর', en: 'Active Fleet' }, value: '420+' },
      { label: { bn: 'এসটিএস স্থানান্তর কেন্দ্র', en: 'STS Stations' }, value: '62' },
    ],
  },
  'drainage-monitoring': {
    slug: 'drainage-monitoring',
    category: 'urban-management',
    title: {
      bn: 'স্মার্ট ড্রেনেজ মনিটরিং',
      en: 'Smart Drainage Monitoring',
    },
    shortTitle: {
      bn: 'ড্রেনেজ মনিটরিং',
      en: 'Drainage Monitoring',
    },
    subtitle: {
      bn: 'ড্রেনেজ নেটওয়ার্কের পরিষ্কারকরণ সূচি, জলাবদ্ধতাপ্রবণ এলাকার সতর্কতা এবং অবরুদ্ধ ড্রেনের তাৎক্ষণিক নাগরিক প্রতিবেদন।',
      en: 'Monitor drainage cleaning operations, track flood-vulnerable low-lying hotspots, and submit geo-tagged drain blockage reports.',
    },
    purpose: {
      bn: 'বর্ষা মৌসুমে দ্রুত পানি নিষ্কাশন এবং ড্রেন ভরাট বা বন্ধ হয়ে যাওয়া রোধে কার্যকর পর্যবেক্ষণ ও নাগরিক সহভাগিতা।',
      en: 'Prevent seasonal urban waterlogging through proactive culvert desilting, monitoring sensor telemetry, and swift citizen complaint dispatch.',
    },
    icon: Droplets,
    badge: { bn: 'জলাবদ্ধতা ট্র্যাকার', en: 'Waterlogging Tracker' },
    highlightStats: [
      { label: { bn: 'প্রধান ড্রেনেজ নেটওয়ার্ক', en: 'Main Drain Network' }, value: '290 km' },
      { label: { bn: 'চিহ্নিত ঝুঁকিপূর্ণ হটস্পট', en: 'Monitored Hotspots' }, value: '24' },
      { label: { bn: 'নিয়মিত পাম্পিং স্টেশন', en: 'Storm Pump Stations' }, value: '7' },
    ],
  },
  'road-monitoring': {
    slug: 'road-monitoring',
    category: 'urban-management',
    title: {
      bn: 'সড়ক অবস্থা পর্যবেক্ষণ',
      en: 'Road Condition Monitoring',
    },
    shortTitle: {
      bn: 'সড়ক পর্যবেক্ষণ',
      en: 'Road Monitoring',
    },
    subtitle: {
      bn: 'প্রধান ও আঞ্চলিক সড়কসমূহের চলমান সংস্কার কাজ, রাস্তার বর্তমান অবস্থা ও ভাঙা সড়ক সংস্কারের জন্য ছবি ও জিপিএসসহ রিপোর্ট।',
      en: 'Explore road pavement health categories, ongoing resurfacing projects, excavation permits, and report potholes with GPS coordinates.',
    },
    purpose: {
      bn: 'নিরাপদ নগর চলাচলের জন্য রাস্তার গুণগত মান নিশ্চিতকরণ এবং নাগরিকদের অংশগ্রহণে দ্রুত সড়ক মেরামত।',
      en: 'Track arterial and ward road health, enforce excavation restoration SLAs, and empower citizens to submit road repair complaints.',
    },
    icon: Construction,
    badge: { bn: 'সড়ক মেরামত ট্র্যাকার', en: 'Repair Tracker' },
    highlightStats: [
      { label: { bn: 'মোট সড়ক নেটওয়ার্ক', en: 'Road Network' }, value: '2,240 km' },
      { label: { bn: 'চলমান উন্নয়ন প্রকল্প', en: 'Active Projects' }, value: '38' },
      { label: { bn: 'গড় মেরামত সময়', en: 'Avg Resolution' }, value: '72 Hrs' },
    ],
  },
  'smart-parking': {
    slug: 'smart-parking',
    category: 'urban-management',
    title: {
      bn: 'স্মার্ট পার্কিং',
      en: 'Smart Parking',
    },
    shortTitle: {
      bn: 'স্মার্ট পার্কিং',
      en: 'Smart Parking',
    },
    subtitle: {
      bn: 'ঢাকা শহরের অনুমোদিত অন-স্ট্রিট ও অফ-স্ট্রিট পার্কিং স্পট, নির্ধারিত সরকারি রেট, ইভি চার্জিং সুবিধা ও নেভিগেশন নির্দেশনা।',
      en: 'Discover official municipal on-street and multi-storey parking facilities, statutory hourly rates, EV charging spots, and directions.',
    },
    purpose: {
      bn: 'শহরের যানজট হ্রাস এবং নিয়মতান্ত্রিক ও ন্যায্যমূল্যে যানবাহন পার্কিংয়ের ডিজিটাল তথ্য প্রদান।',
      en: 'Minimize curb congestion by providing transparent municipal parking locations, certified tariffs, and accessibility provisions.',
    },
    icon: ParkingCircle,
    badge: { bn: 'অনুমোদিত স্পট', en: 'Official Spots' },
    highlightStats: [
      { label: { bn: 'অনুমোদিত পার্কিং অঞ্চল', en: 'Official Lots' }, value: '16' },
      { label: { bn: 'মোট পার্কিং ধারণক্ষমতা', en: 'Total Bay Capacity' }, value: '4,850' },
      { label: { bn: 'ইভি চার্জিং স্টেশন', en: 'EV Stations' }, value: '12' },
    ],
  },
  'air-quality': {
    slug: 'air-quality',
    category: 'environment-safety',
    title: {
      bn: 'বায়ুমান পর্যবেক্ষণ',
      en: 'Air Quality Monitoring',
    },
    shortTitle: {
      bn: 'বায়ুমান সূচক',
      en: 'Air Quality',
    },
    subtitle: {
      bn: 'ঢাকা শহরের বিভিন্ন পর্যবেক্ষণ কেন্দ্রের সার্বক্ষণিক একিউআই (AQI), PM2.5, PM10 মাত্রা ও স্বাস্থ্য সুরক্ষামূলক নির্দেশনা।',
      en: 'Verified continuous Air Quality Index (AQI), PM2.5 and PM10 concentrations from urban monitoring stations with health advisories.',
    },
    purpose: {
      bn: 'বায়ুদূষণ সম্পর্কে জনসচেতনতা বৃদ্ধি এবং নাগরিকদের স্বাস্থ্য সুরক্ষায় নির্ভরযোগ্য পরিবেশগত তথ্য সরবরাহ।',
      en: 'Provide certified environmental health guidance, historical particulate trends, and protective health recommendations for sensitive groups.',
    },
    icon: Wind,
    badge: { bn: 'রিয়েল-টাইম সূচক', en: 'AQI Telemetry' },
    highlightStats: [
      { label: { bn: 'পর্যবেক্ষণ কেন্দ্র', en: 'Official Stations' }, value: '5' },
      { label: { bn: 'প্রধান উপাদান পরিমাপ', en: 'Metrics Tracked' }, value: 'PM2.5 / PM10' },
      { label: { bn: 'হালনাগাদের হার', en: 'Update Frequency' }, value: 'Hourly' },
    ],
  },
  'facility-locator': {
    slug: 'facility-locator',
    category: 'environment-safety',
    title: {
      bn: 'পাবলিক ফ্যাসিলিটি লোকেটর',
      en: 'Public Facility Locator',
    },
    shortTitle: {
      bn: 'ফ্যাসিলিটি লোকেটর',
      en: 'Facility Locator',
    },
    subtitle: {
      bn: 'হাসপাতাল, থানা, ফায়ার সার্ভিস, ওয়ার্ড কার্যালয়, পাবলিক টয়লেট ও পার্কের ঠিকানা, ফোন নম্বর এবং মানচিত্র নেভিগেশন।',
      en: 'Comprehensive directory and satellite locator for municipal hospitals, police stations, fire brigades, public toilets, and ward offices.',
    },
    purpose: {
      bn: 'জরুরি ও নিত্যপ্রয়োজনীয় গণসেবা কেন্দ্রের সঠিক ঠিকানা ও তাৎক্ষণিক যোগাযোগের ব্যবস্থা নিশ্চিতকরণ।',
      en: 'Equip residents and visitors with validated contact records, operating hours, and turn-by-turn directions to critical civic facilities.',
    },
    icon: Compass,
    badge: { bn: 'গণসুবিধা ডিরেক্টরি', en: 'Civic Facilities' },
    highlightStats: [
      { label: { bn: 'তালিকাভুক্ত গণসুবিধা', en: 'Listed Facilities' }, value: '240+' },
      { label: { bn: 'সুবিধা বিভাগ', en: 'Categories' }, value: '12' },
      { label: { bn: 'যাচাইকৃত যোগাযোগ', en: 'Verified Contacts' }, value: '100%' },
    ],
  },
  'emergency-sos': {
    slug: 'emergency-sos',
    category: 'environment-safety',
    title: {
      bn: 'জরুরি এসওএস (SOS)',
      en: 'Emergency SOS',
    },
    shortTitle: {
      bn: 'জরুরি এসওএস',
      en: 'Emergency SOS',
    },
    subtitle: {
      bn: 'জাতীয় জরুরি সেবা ৯৯৯, ফায়ার সার্ভিস, পুলিশ কন্ট্রোল রুম, অ্যাম্বুলেন্স ও ইউটিলিটি বিপর্যয়ে তাৎক্ষণিক কল ও লোকেশন শেয়ার।',
      en: 'Direct access to Bangladesh National Emergency 999, Fire Brigade, Police HQ, Ambulance services, and disaster safety protocols.',
    },
    purpose: {
      bn: 'সংকট মুহূর্তে প্রতিটি সেকেন্ড মূল্যবান—সরাসরি জরুরি নম্বরে কল এবং নিরাপদ ও নির্ভুল নির্দেশনা প্রদান।',
      en: 'Zero-friction emergency telephone dispatch, verified agency contact matrices, and clear safety guidance for life-threatening situations.',
    },
    icon: Siren,
    badge: { bn: 'জরুরি হেল্পলাইন', en: 'Emergency 999' },
    highlightStats: [
      { label: { bn: 'জাতীয় হেল্পলাইন', en: 'National Hotline' }, value: '999' },
      { label: { bn: 'ফায়ার সার্ভিস হটলাইন', en: 'Fire Service' }, value: '16163' },
      { label: { bn: 'ওয়াসা কন্ট্রোল রুম', en: 'WASA Emergency' }, value: '16162' },
    ],
  },
  'disaster-alerts': {
    slug: 'disaster-alerts',
    category: 'environment-safety',
    title: {
      bn: 'দুর্যোগ সতর্কবার্তা',
      en: 'Disaster Alerts',
    },
    shortTitle: {
      bn: 'দুর্যোগ বার্তা',
      en: 'Disaster Alerts',
    },
    subtitle: {
      bn: 'আবহাওয়া অধিদপ্তর ও দুর্যোগ ব্যবস্থাপনা কর্তৃপক্ষের সরকারি সতর্কতা, ভারী বর্ষণ, তাপপ্রবাহ, ঘূর্ণিঝড় ও ডেঙ্গু সংক্রান্ত বার্তা।',
      en: 'Official meteorological alerts, flood bulletins, heavy rainfall warnings, heatwave advisories, and dengue epidemic health alerts.',
    },
    purpose: {
      bn: 'প্রাকৃতিক ও নগর দুর্যোগের ক্ষয়ক্ষতি কমাতে নাগরিকদের সময়োপযোগী সরকারি বার্তা এবং জীবনরক্ষাকারী পরামর্শ প্রদান।',
      en: 'Disseminate official warnings from authorized government agencies, detailing affected municipal zones and practical survival protocols.',
    },
    icon: AlertTriangle,
    badge: { bn: 'সরকারি বুলেটিন', en: 'Official Bulletins' },
    highlightStats: [
      { label: { bn: 'সতর্কতা স্তর', en: 'Severity Tiers' }, value: '5 Tiers' },
      { label: { bn: 'সরকারি তথ্যসূত্র', en: 'Official Sources' }, value: 'BMD / FFWC' },
      { label: { bn: 'জরুরি টিম প্রস্তুতি', en: 'Response Units' }, value: 'Active' },
    ],
  },
  'ai-assistant': {
    slug: 'ai-assistant',
    category: 'citizen-intelligence',
    title: {
      bn: 'এআই নাগরিক সহায়ক',
      en: 'AI Citizen Assistant',
    },
    shortTitle: {
      bn: 'এআই সহায়ক',
      en: 'AI Assistant',
    },
    subtitle: {
      bn: 'ট্রেড লাইসেন্স, হোল্ডিং ট্যাক্স, জন্ম নিবন্ধন ও অন্যান্য নাগরিক সেবার তথ্যে কৃত্রিম বুদ্ধিমত্তা চালিত তাৎক্ষণিক উত্তর ও দিকনির্দেশনা।',
      en: 'Conversational bilingual AI assistant trained on official Dhaka City Corporation citizen charters, procedures, and statutory guidelines.',
    },
    purpose: {
      bn: 'সরকারি সেবা সংক্রান্ত যেকোনো প্রশ্নের সহজ ও দ্রুত সমাধান, প্রয়োজনীয় কাগজপত্রের তালিকা ও সংশ্লিষ্ট পাতায় সরাসরি ন্যাভিগেশন।',
      en: 'Provide 24/7 intelligent municipal guidance in conversational Bengali and English, directing citizens to verified submission workflows.',
    },
    icon: Bot,
    badge: { bn: 'ডিজিটাল বুদ্ধিমত্তা', en: 'Bilingual AI' },
    highlightStats: [
      { label: { bn: 'সমর্থিত ভাষা', en: 'Languages' }, value: 'বাংলা / English' },
      { label: { bn: 'আওতাভুক্ত সরকারি সেবা', en: 'Services Covered' }, value: '31+' },
      { label: { bn: 'গড় উত্তর প্রদানের সময়', en: 'Response Time' }, value: '< 1 Sec' },
    ],
  },
  'dashboard': {
    slug: 'dashboard',
    category: 'citizen-intelligence',
    title: {
      bn: 'স্মার্ট সিটি ড্যাশবোর্ড',
      en: 'Smart City Dashboard',
    },
    shortTitle: {
      bn: 'সিটি ড্যাশবোর্ড',
      en: 'City Dashboard',
    },
    subtitle: {
      bn: 'নগর অবকাঠামো, বর্জ্য নিষ্কাশন, রাজস্ব আদায়, নাগরিক অভিযোগ নিষ্পত্তি ও উন্নয়ন প্রকল্পের কেন্দ্রীয় রিয়েল-টাইম পরিসংখ্যান।',
      en: 'Executive public analytics dashboard featuring municipal KPIs, grievance resolution rates, revenue collection, and project milestones.',
    },
    purpose: {
      bn: 'নাগরিক সেবা ও উন্নয়ন কর্মকাণ্ডে শতভাগ স্বচ্ছতা, জবাবদিহিতা ও তথ্যের সার্বজনীন উন্মুক্তকরণ।',
      en: 'Deliver radical institutional transparency by visualizing municipal operations, budget expenditures, and infrastructure health.',
    },
    icon: LayoutDashboard,
    badge: { bn: 'স্বচ্ছতা ও অ্যানালিটিক্স', en: 'Open Analytics' },
    highlightStats: [
      { label: { bn: 'অভিযোগ নিষ্পত্তির হার', en: 'Resolution Rate' }, value: '94.2%' },
      { label: { bn: 'সক্রিয় উন্নয়ন প্রকল্প', en: 'Active Projects' }, value: '42' },
      { label: { bn: 'ডিজিটাল নাগরিক সেবা', en: 'e-Services' }, value: '31' },
    ],
  },
};
