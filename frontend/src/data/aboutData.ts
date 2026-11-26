import {
  Award,
  BookOpen,
  Briefcase,
  Building,
  Calculator,
  CheckCircle2,
  Compass,
  Construction,
  Cpu,
  Droplets,
  FileCheck2,
  Globe,
  HeartPulse,
  Landmark,
  Leaf,
  MapPin,
  Phone,
  Recycle,
  ScrollText,
  ShieldCheck,
  Sparkles,
  Target,
  Trees,
  Users,
} from 'lucide-react';
import {
  AboutNavItem,
  CitizenCharterItem,
  CivicInfoItem,
  DepartmentInfo,
  EmergencyHelplineItem,
  HistoryMilestone,
  MayorProfile,
  OfficialContactItem,
  OrgDivision,
  OverviewStatItem,
  PersonProfile,
  WardDirectoryItem,
  ZonalOfficeItem,
} from '@/types/about';

export const ABOUT_NAV_ITEMS: AboutNavItem[] = [
  {
    slug: 'overview',
    href: '/about/overview',
    title: { bn: 'সিটি কর্পোরেশন পরিচিতি', en: 'About City Corporation' },
    shortTitle: { bn: 'পরিচিতি', en: 'Overview' },
    subtitle: {
      bn: 'ঢাকা স্মার্ট সিটি কর্পোরেশনের কাঠামো, প্রশাসনিক পরিধি এবং আধুনিক নাগরিক সেবার সামগ্রিক পরিচিতি।',
      en: 'Administrative profile, territorial scope, and core public services of Dhaka Smart City Corporation.',
    },
    icon: Landmark,
  },
  {
    slug: 'history',
    href: '/about/history',
    title: { bn: 'ইতিহাস ও পটভূমি', en: 'History & Background' },
    shortTitle: { bn: 'ইতিহাস', en: 'History' },
    subtitle: {
      bn: '১৮৬৪ সালের ঢাকা মিউনিসিপ্যালিটি থেকে ২০২৬ সালের স্মার্ট সিটি ডিজিটাল রূপান্তরের ধারাবাহিক ইতিহাস।',
      en: 'Tracing Dhaka’s civic governance from the 1864 Municipality to the 2026 Smart Digital Transformation.',
    },
    icon: BookOpen,
  },
  {
    slug: 'mission-vision',
    href: '/about/mission-vision',
    title: { bn: 'লক্ষ্য ও উদ্দেশ্য', en: 'Mission & Vision' },
    shortTitle: { bn: 'লক্ষ্য ও উদ্দেশ্য', en: 'Mission & Vision' },
    subtitle: {
      bn: 'নাগরিক-কেন্দ্রিক, স্বচ্ছ, সবুজ ও প্রযুক্তিনির্ভর বাসযোগ্য নগর গড়ে তোলার দীর্ঘমেয়াদী রূপকল্প ও অভিলক্ষ্য।',
      en: 'Our long-term vision, operational mission, and core governance values for a livable smart capital.',
    },
    icon: Target,
  },
  {
    slug: 'mayor',
    href: '/about/mayor',
    title: { bn: 'মেয়র / প্রশাসক', en: 'Mayor / Administrator' },
    shortTitle: { bn: 'মেয়র / প্রশাসক', en: 'Mayor / Admin' },
    subtitle: {
      bn: 'নগর নেতৃত্বের বাণী, অগ্রাধিকারমূলক উন্নয়ন কর্মসূচি এবং প্রশাসনিক পরিচিতি।',
      en: 'Official profile, message to citizens, and strategic municipal priorities from city leadership.',
    },
    icon: Award,
  },
  {
    slug: 'councillors',
    href: '/about/councillors',
    title: { bn: 'কাউন্সিলরবৃন্দ', en: 'Councillors' },
    shortTitle: { bn: 'কাউন্সিলরবৃন্দ', en: 'Councillors' },
    subtitle: {
      bn: 'সাধারণ ও সংরক্ষিত আসনের ওয়ার্ড কাউন্সিলরবৃন্দের তালিকা, যোগাযোগ নম্বর এবং সাক্ষাতের সময়সূচি।',
      en: 'Directory of General Ward and Reserved Women’s Seat Councillors across all municipal zones.',
    },
    icon: Users,
  },
  {
    slug: 'wards',
    href: '/about/wards',
    title: { bn: 'ওয়ার্ড তথ্য ও ডিরেক্টরি', en: 'Ward Info & Directory' },
    shortTitle: { bn: 'ওয়ার্ড ডিরেক্টরি', en: 'Wards' },
    subtitle: {
      bn: 'ওয়ার্ডভিত্তিক এলাকা, ওয়ার্ড সচিবের যোগাযোগ, বর্জ্য সংগ্রহ এবং মশক নিধন ফগিং সময়সূচি।',
      en: 'Ward-by-ward coverage, secretary contacts, daily waste pickup windows, and mosquito fogging schedules.',
    },
    icon: MapPin,
  },
  {
    slug: 'organogram',
    href: '/about/organogram',
    title: { bn: 'সাংগঠনিক কাঠামো', en: 'Organizational Structure' },
    shortTitle: { bn: 'সাংগঠনিক কাঠামো', en: 'Organogram' },
    subtitle: {
      bn: 'মেয়র/প্রশাসক, প্রধান নির্বাহী কর্মকর্তা, বিভাগীয় প্রধান এবং আঞ্চলিক নির্বাহী কর্মকর্তাদের প্রশাসনিক স্তরবিন্যাস।',
      en: 'Interactive administrative hierarchy from Mayor/Administrator and CEO down to technical divisions and zonal offices.',
    },
    icon: Building,
  },
  {
    slug: 'departments',
    href: '/about/departments',
    title: { bn: 'বিভাগ ও কর্মকর্তাবৃন্দ', en: 'Departments & Officials' },
    shortTitle: { bn: 'বিভাগ ও কর্মকর্তা', en: 'Departments' },
    subtitle: {
      bn: 'সিটি কর্পোরেশনের প্রধান কারিগরি ও প্রশাসনিক বিভাগসমূহ এবং দায়িত্বপ্রাপ্ত কর্মকর্তাবৃন্দের বিবরণ।',
      en: 'Explore municipal divisions, core operational mandates, and direct contact details of responsible officials.',
    },
    icon: Briefcase,
  },
  {
    slug: 'citizen-charter',
    href: '/about/citizen-charter',
    title: { bn: 'সিটিজেন চার্টার', en: 'Citizen Charter' },
    shortTitle: { bn: 'সিটিজেন চার্টার', en: 'Citizen Charter' },
    subtitle: {
      bn: 'নাগরিক সেবা সনদ — প্রতিটি সেবার প্রয়োজনীয় কাগজপত্র, নির্ধারিত সরকারি ফি এবং নিষ্পত্তির সর্বোচ্চ সময়সীমা।',
      en: 'Official service commitments detailing required documents, statutory fees, processing SLA, and online application links.',
    },
    icon: ScrollText,
  },
  {
    slug: 'locations',
    href: '/about/locations',
    title: { bn: 'অফিসের অবস্থান', en: 'Office Locations' },
    shortTitle: { bn: 'অফিসের অবস্থান', en: 'Locations' },
    subtitle: {
      bn: 'নগর ভবন (প্রধান কার্যালয়) এবং ৫টি আঞ্চলিক কার্যালয়ের ঠিকানা, সময়সূচি ও মানচিত্র নির্দেশিকা।',
      en: 'Nagar Bhaban headquarters and five zonal offices with working hours, helplines, and satellite map previews.',
    },
    icon: Compass,
  },
  {
    slug: 'contact',
    href: '/about/contact',
    title: { bn: 'যোগাযোগ ডিরেক্টরি', en: 'Contact Directory' },
    shortTitle: { bn: 'যোগাযোগ', en: 'Contact' },
    subtitle: {
      bn: 'জরুরি হেল্পলাইন, দপ্তরভিত্তিক ফোন ও ইমেইল ডিরেক্টরি এবং নাগরিক বার্তা প্রেরণের অনলাইন মাধ্যম।',
      en: 'Emergency helplines, official department contact directory, and direct citizen inquiry submission.',
    },
    icon: Phone,
  },
];

/* 1. OVERVIEW DATA                                                           */

export const OVERVIEW_STATS: OverviewStatItem[] = [
  {
    id: 'area',
    label: { bn: 'মোট আয়তন', en: 'Total Municipal Area' },
    value: { bn: '১০৯.২৫ বর্গ কিমি', en: '109.25 sq.km' },
    note: { bn: 'ঢাকা মহানগর এলাকা', en: 'Metropolitan jurisdiction' },
  },
  {
    id: 'wards',
    label: { bn: 'মোট ওয়ার্ড', en: 'Total Wards' },
    value: { bn: '৭৫টি ওয়ার্ড', en: '75 Wards' },
    note: { bn: '২৫টি সংরক্ষিত আসনসহ', en: 'Plus 25 reserved seats' },
  },
  {
    id: 'zones',
    label: { bn: 'আঞ্চলিক কার্যালয়', en: 'Zonal Offices' },
    value: { bn: '৫টি জোন', en: '5 Zones' },
    note: { bn: 'বিকেন্দ্রীকৃত নাগরিক সেবা', en: 'Decentralized delivery' },
  },
  {
    id: 'population',
    label: { bn: 'সেবাপ্রাপ্ত জনসংখ্যা', en: 'Population Served' },
    value: { bn: '১.২ কোটি+', en: '12 Million+' },
    note: { bn: 'স্থায়ী ও ভাসমান নাগরিক', en: 'Residents & daily commuters' },
  },
  {
    id: 'eservices',
    label: { bn: 'সক্রিয় ডিজিটাল সেবা', en: 'Active Digital Services' },
    value: { bn: '৫০+ ই-সেবা', en: '50+ E-Services' },
    note: { bn: 'QR যাচাইকৃত সনদ ও কর', en: 'QR-verified certificates & tax' },
  },
];

export const OVERVIEW_CORE_FUNCTIONS: CivicInfoItem[] = [
  {
    id: 'infrastructure',
    icon: Construction,
    title: { bn: 'সড়ক, ড্রেনেজ ও নগর অবকাঠামো', en: 'Roads, Drainage & Urban Infrastructure' },
    description: {
      bn: 'নগরীর প্রধান ও অভ্যন্তরীণ সড়ক নির্মাণ, ফুটপাত উন্নয়ন, আধুনিক স্টর্ম ওয়াটার ড্রেনেজ এবং স্মার্ট এলইডি সড়কবাতি স্থাপন ও রক্ষণাবেক্ষণ।',
      en: 'Construction and upkeep of arterial and neighborhood roads, pedestrian walkways, storm drainage corridors, and automated LED streetlights.',
    },
    meta: { bn: 'প্রকৌশল ও ট্রাফিক বিভাগ', en: 'Engineering & Traffic Wing' },
  },
  {
    id: 'revenue',
    icon: Calculator,
    title: { bn: 'হোল্ডিং ট্যাক্স ও রাজস্ব ব্যবস্থাপনা', en: 'Holding Tax & Revenue Administration' },
    description: {
      bn: 'স্বচ্ছ ডিজিটাল মূল্যায়নের মাধ্যমে হোল্ডিং ট্যাক্স আদায়, ই-ট্রেড লাইসেন্স ইস্যু ও নবায়ন এবং অনলাইন পেমেন্টে ১০% রিবেট সুবিধা প্রদান।',
      en: 'Transparent digital property assessment, online holding tax collection with 10% digital rebate, and automated trade license issuance.',
    },
    meta: { bn: 'রাজস্ব ও লাইসেন্স বিভাগ', en: 'Revenue & Licensing Wing' },
  },
  {
    id: 'waste',
    icon: Recycle,
    title: { bn: 'আধুনিক বর্জ্য ব্যবস্থাপনা', en: 'Modern Solid Waste Management' },
    description: {
      bn: 'প্রতিদিন ভোর ও সন্ধ্যায় ওয়ার্ডভিত্তিক বর্জ্য সংগ্রহ, সেকেন্ডারি ট্রান্সফার স্টেশন (STS) পরিচালনা এবং জিপিএস-মনিটরকৃত পরিচ্ছন্নতা যানবাহন।',
      en: 'Scheduled door-to-door ward waste collection, Secondary Transfer Stations (STS), and GPS-monitored compactor fleets across all zones.',
    },
    meta: { bn: 'বর্জ্য ব্যবস্থাপনা বিভাগ', en: 'Conservancy & Waste Wing' },
  },
  {
    id: 'health',
    icon: HeartPulse,
    title: { bn: 'জনস্বাস্থ্য ও মশক নিধন কার্যক্রম', en: 'Public Health & Vector Control' },
    description: {
      bn: 'নগর মাতৃসদন ও প্রাথমিক স্বাস্থ্যসেবা কেন্দ্র পরিচালনা, টিকাদান কর্মসূচি, খাদ্যমান তদারকি এবং ডেঙ্গু প্রতিরোধে নিয়মিত লার্ভিসাইডিং ও ফগিং।',
      en: 'Urban primary clinics, maternal healthcare, immunization drives, food safety inspections, and scheduled anti-dengue larviciding and fogging.',
    },
    meta: { bn: 'স্বাস্থ্য ও মশক নিধন শাখা', en: 'Public Health Wing' },
  },
  {
    id: 'egov',
    icon: Cpu,
    title: { bn: 'স্মার্ট ই-গভর্ন্যান্স ও নাগরিক সেবা', en: 'Smart E-Governance & Digital Services' },
    description: {
      bn: 'কাগজবিহীন জন্ম ও মৃত্যু নিবন্ধন, নাগরিক সনদ, জিআইএস সিটি ম্যাপ, জিও-ট্যাগযুক্ত অভিযোগ ট্র্যাকিং এবং উন্মুক্ত বাজেট স্বচ্ছতা পোর্টাল।',
      en: 'Paperless birth/death registration, QR-verified citizen certificates, interactive GIS mapping, geo-tagged complaint tracking, and open budget portals.',
    },
    meta: { bn: 'আইসিটি ও স্মার্ট সিটি সেল', en: 'ICT & Smart City Cell' },
  },
  {
    id: 'parks',
    icon: Trees,
    title: { bn: 'সবুজায়ন, পার্ক ও নাগরিক বিনোদন', en: 'Urban Greening, Parks & Public Spaces' },
    description: {
      bn: 'নগর পার্ক, খেলার মাঠ, কমিউনিটি সেন্টার, পাবলিক টয়লেট এবং ঐতিহ্যবাহী স্থাপনার সংরক্ষণ ও আধুনিকায়ন।',
      en: 'Preservation and modernization of neighborhood parks, playgrounds, municipal community centers, hygienic public toilets, and heritage sites.',
    },
    meta: { bn: 'নগর পরিকল্পনা ও সম্পত্তি বিভাগ', en: 'Urban Planning & Estate' },
  },
];

/* 2. HISTORY & BACKGROUND DATA                                               */

export const HISTORY_INTRO = {
  lead: {
    bn: 'বাংলার চার শতাব্দীর ঐতিহ্যবাহী রাজধানী ঢাকার প্রাতিষ্ঠানিক পৌর শাসনের সূচনা হয় ১৮৬৪ সালে। সময়ের বিবর্তনে একটি ক্ষুদ্র মিউনিসিপ্যাল কমিটি থেকে আজ এটি বাংলাদেশের সর্ববৃহৎ প্রযুক্তিনির্ভর স্মার্ট সিটি কর্পোরেশনে রূপান্তরিত হয়েছে।',
    en: 'Formal municipal governance in Dhaka began in 1864, evolving over more than 160 years from a small colonial municipal committee into Bangladesh’s flagship citizen-centric Smart City Corporation.',
  },
  body: {
    bn: 'স্বাধীনতা-পরবর্তী দ্রুত নগরায়ণ, জনসংখ্যা বৃদ্ধি এবং নাগরিক চাহিদার বহুমুখী সম্প্রসারণের সাথে তাল মিলিয়ে নগর ব্যবস্থাপনায় যুক্ত হয়েছে আধুনিক প্রকৌশল, আঞ্চলিক বিকেন্দ্রীকরণ এবং সর্বশেষ ২০২৬ সালের পূর্ণাঙ্গ ডিজিটাল সেবা প্ল্যাটফর্ম।',
    en: 'Keeping pace with post-independence urbanization and expanding civic expectations, the corporation introduced zonal decentralization, modern drainage and waste infrastructure, and culminated in the unified 2026 Smart Digital Service Platform.',
  },
};

export const HISTORY_MILESTONES: HistoryMilestone[] = [
  {
    id: '1864',
    year: { bn: '১৮৬৪', en: '1864' },
    era: { bn: 'প্রাতিষ্ঠানিক সূচনা', en: 'Foundational Era' },
    title: { bn: 'ঢাকা মিউনিসিপ্যালিটি প্রতিষ্ঠা', en: 'Establishment of Dhaka Municipality' },
    description: {
      bn: '১ আগস্ট ১৮৬৪ সালে আনুষ্ঠানিকভাবে ঢাকা মিউনিসিপ্যালিটি গঠিত হয়। এর মাধ্যমে সড়ক আলোকসজ্জা, প্রাথমিক স্যানিটেশন, পানীয় জল সরবরাহ ও নগর পরিচ্ছন্নতার প্রাতিষ্ঠানিক দায়িত্ব শুরু হয়।',
      en: 'Formally constituted on August 1, 1864, Dhaka Municipality introduced organized urban sanitation, street lighting, public markets, and potable water distribution.',
    },
    impact: {
      bn: 'বাংলাদেশে আধুনিক স্থানীয় সরকার ব্যবস্থার প্রথম প্রাতিষ্ঠানিক ভিত্তি স্থাপিত হয়।',
      en: 'Laid the institutional foundation for modern urban local government in Bengal.',
    },
  },
  {
    id: '1978',
    year: { bn: '১৯৭৮', en: '1978' },
    era: { bn: 'মিউনিসিপ্যাল কর্পোরেশন', en: 'Corporation Upgrade' },
    title: { bn: 'ঢাকা মিউনিসিপ্যাল কর্পোরেশনে উন্নীতকরণ', en: 'Elevated to Dhaka Municipal Corporation' },
    description: {
      bn: 'স্বাধীন বাংলাদেশের ক্রমবর্ধমান রাজধানীর প্রশাসনিক সক্ষমতা বাড়াতে ঢাকা পৌরসভাকে ‘ঢাকা মিউনিসিপ্যাল কর্পোরেশন’ মর্যাদায় উন্নীত করা হয় এবং নতুন ওয়ার্ড সংযুক্ত করা হয়।',
      en: 'Upgraded to Municipal Corporation status to manage rapid metropolitan growth in independent Bangladesh, expanding technical departments and ward representation.',
    },
    impact: {
      bn: 'বৃহৎ নগর প্রকৌশল, রাজস্ব ও জনস্বাস্থ্য বিভাগ আনুষ্ঠানিকভাবে সম্প্রসারিত হয়।',
      en: 'Expanded dedicated engineering, revenue assessment, and public health divisions.',
    },
  },
  {
    id: '1990',
    year: { bn: '১৯৯০', en: '1990' },
    era: { bn: 'সিটি কর্পোরেশন মর্যাদা', en: 'City Corporation Era' },
    title: { bn: 'ঢাকা সিটি কর্পোরেশন (ডিসিসি) ও নগর ভবন', en: 'Dhaka City Corporation & Nagar Bhaban' },
    description: {
      bn: 'আইনগত সংস্কারের মাধ্যমে ‘ঢাকা সিটি কর্পোরেশন’ হিসেবে নতুন যাত্রা শুরু হয় এবং সরাসরি ভোটে নির্বাচিত মেয়র ও ওয়ার্ড কাউন্সিলর ব্যবস্থা প্রবর্তন করা হয়।',
      en: 'Reconstituted as Dhaka City Corporation with direct democratic representation for the Mayor and Ward Councillors, anchored at the iconic Nagar Bhaban headquarters.',
    },
    impact: {
      bn: 'নগর প্রশাসনে জনপ্রতিনিধিত্বমূলক জবাবদিহিতা ও নাগরিক অংশগ্রহণ নিশ্চিত হয়।',
      en: 'Established elected municipal leadership and ward-level citizen accountability.',
    },
  },
  {
    id: '2011',
    year: { bn: '২০১১', en: '2011' },
    era: { bn: 'আঞ্চলিক বিকেন্দ্রীকরণ', en: 'Administrative Modernization' },
    title: { bn: 'প্রশাসনিক পুনর্গঠন ও আঞ্চলিক কার্যালয় সম্প্রসারণ', en: 'Administrative Restructuring & Zonal Expansion' },
    description: {
      bn: 'নাগরিক সেবা দ্রুত ও সহজলভ্য করতে স্থানীয় সরকার (সিটি কর্পোরেশন) আইন সংশোধনের মাধ্যমে প্রশাসনিক পুনর্গঠন, আঞ্চলিক কার্যালয় শক্তিশালীকরণ এবং আধুনিক বর্জ্য স্থানান্তর কেন্দ্র (STS) চালু হয়।',
      en: 'Restructured under the Local Government (City Corporation) Act to decentralize services into agile Zonal Offices and modernize secondary waste transfer infrastructure.',
    },
    impact: {
      bn: 'আঞ্চলিক পর্যায়ে সেবা প্রাপ্তির সময় অর্ধেকে নেমে আসে।',
      en: 'Significantly reduced citizen turnaround times through zonal decentralization.',
    },
  },
  {
    id: '2026',
    year: { bn: '২০২৬', en: '2026' },
    era: { bn: 'স্মার্ট ডিজিটাল যুগ', en: 'Smart City Transformation' },
    title: { bn: 'স্মার্ট সিটি কর্পোরেশন ডিজিটাল প্ল্যাটফর্ম', en: 'Smart City Corporation Digital Transformation' },
    description: {
      bn: '৫০টিরও বেশি অনলাইন ই-সেবা, QR-যাচাইকৃত ডিজিটাল সনদ ও ট্রেড লাইসেন্স, ইন্টারেক্টিভ জিআইএস সিটি ম্যাপ, জিপিএস-ট্যাগযুক্ত অভিযোগ ট্র্যাকিং এবং উন্মুক্ত বাজেট ড্যাশবোর্ড একীভূত করে পূর্ণাঙ্গ স্মার্ট সিটি পোর্টাল চালু করা হয়েছে।',
      en: 'Launched the unified Smart City portal combining 50+ e-services, QR-verified certificates, interactive GIS mapping, geo-tagged complaint routing, and open fiscal transparency.',
    },
    impact: {
      bn: '১২ লক্ষাধিক নিবন্ধিত নাগরিক ঘরে বসেই স্বচ্ছ ও কাগজবিহীন নগর সেবা গ্রহণ করছেন।',
      en: 'Over 1.24 million registered citizens now access paperless, traceable municipal services online.',
    },
  },
];

/* 3. MISSION & VISION DATA                                                   */

export const VISION_STATEMENT = {
  kicker: { bn: 'রূপকল্প (VISION)', en: 'VISION' },
  title: {
    bn: 'পরিচ্ছন্ন, নিরাপদ, পরিবেশবান্ধব ও প্রযুক্তিনির্ভর স্মার্ট ঢাকা',
    en: 'A Clean, Safe, Sustainable, and Technology-Driven Smart Dhaka',
  },
  description: {
    bn: 'একটি আধুনিক, মানবিক ও জলবায়ু-সহনশীল মহানগর গড়ে তোলা — যেখানে প্রতিটি নাগরিক বৈষম্যহীনভাবে দ্রুত, স্বচ্ছ এবং শতভাগ ডিজিটাল পৌর সেবা লাভ করবে।',
    en: 'To build a modern, inclusive, and climate-resilient metropolis where every citizen enjoys equitable, transparent, and seamless digital municipal services.',
  },
};

export const MISSION_STATEMENT = {
  kicker: { bn: 'অভিলক্ষ্য (MISSION)', en: 'MISSION' },
  title: {
    bn: 'স্বচ্ছ শাসন, আধুনিক অবকাঠামো ও নাগরিক সন্তুষ্টি নিশ্চিতকরণ',
    en: 'Delivering Accountable Governance, Modern Infrastructure & Citizen Trust',
  },
  description: {
    bn: 'দক্ষ বর্জ্য ও ড্রেনেজ ব্যবস্থাপনা, কাগজবিহীন রাজস্ব ও সনদ সেবা, তথ্যভিত্তিক নগর পরিকল্পনা এবং দ্রুত অভিযোগ নিষ্পত্তির মাধ্যমে নাগরিক জীবনমানের স্থায়ী উন্নয়ন সাধন।',
    en: 'To continuously elevate urban livability through reliable waste and drainage systems, paperless licensing and revenue services, data-driven planning, and SLA-backed grievance resolution.',
  },
};

export const STRATEGIC_VALUES: CivicInfoItem[] = [
  {
    id: 'transparency',
    icon: ShieldCheck,
    title: { bn: 'স্বচ্ছতা ও জবাবদিহিতা', en: 'Transparency & Accountability' },
    description: {
      bn: 'উন্মুক্ত ওয়ার্ডভিত্তিক বাজেট, চলমান উন্নয়ন প্রকল্পের লাইভ অগ্রগতি এবং ই-টেন্ডার প্রক্রিয়ার মাধ্যমে শতভাগ আর্থিক স্বচ্ছতা নিশ্চিত করা।',
      en: 'Publishing open ward-wise budgets, real-time project completion progress, and e-GP tender disclosures for complete fiscal accountability.',
    },
  },
  {
    id: 'paperless',
    icon: FileCheck2,
    title: { bn: 'কাগজবিহীন ডিজিটাল সেবা', en: 'Paperless Service Delivery' },
    description: {
      bn: 'ট্রেড লাইসেন্স, হোল্ডিং ট্যাক্স এবং জন্ম-নাগরিক সনদ আবেদন থেকে শুরু করে QR-যাচাইকৃত সনদ ডাউনলোড পর্যন্ত সম্পূর্ণ অনলাইন ব্যবস্থা।',
      en: 'End-to-end digital workflows from application submission and mobile payment to cryptographically signed QR certificate downloads.',
    },
  },
  {
    id: 'green',
    icon: Leaf,
    title: { bn: 'পরিচ্ছন্ন ও সবুজ নগরী', en: 'Clean & Green City' },
    description: {
      bn: 'স্মার্ট বর্জ্য সংগ্রহ, সবুজ পার্ক ও জলাশয় পুনরুদ্ধার, বায়ুমান পর্যবেক্ষণ এবং জ্বালানি সাশ্রয়ী এলইডি সড়কবাতি সম্প্রসারণ।',
      en: 'Expanding smart waste collection, restoring urban parks and canals, monitoring air quality, and operating energy-efficient LED lighting.',
    },
  },
  {
    id: 'citizen-first',
    icon: Users,
    title: { bn: 'নাগরিক-প্রথম সুশাসন', en: 'Citizen-First Governance' },
    description: {
      bn: 'সিটিজেন চার্টার অনুযায়ী নির্ধারিত সময়সীমায় সেবা প্রদান, ২৪/৭ হেল্পলাইন এবং নাগরিক রেটিংভিত্তিক মাঠকর্মী মূল্যায়ন।',
      en: 'Honoring Citizen Charter SLAs, maintaining round-the-clock helplines, and evaluating field operations through verified citizen feedback.',
    },
  },
  {
    id: 'inclusion',
    icon: Globe,
    title: { bn: 'ডিজিটাল অন্তর্ভুক্তি', en: 'Digital Inclusion' },
    description: {
      bn: 'বাংলা ও ইংরেজি দ্বিভাষিক পোর্টাল, মোবাইলবান্ধব ইন্টারফেস এবং ওয়ার্ড ডিজিটাল সেন্টারের মাধ্যমে সর্বস্তরের নাগরিকের প্রবেশগম্যতা।',
      en: 'Ensuring universal access across all demographics via bilingual Bangla-English interfaces, mobile-first tools, and ward helpdesks.',
    },
  },
  {
    id: 'resilience',
    icon: Droplets,
    title: { bn: 'দুর্যোগ ও জলাবদ্ধতা সহনশীলতা', en: 'Disaster & Flood Resilience' },
    description: {
      bn: 'বর্ষা মৌসুমে দ্রুত পানি নিষ্কাশন, জরুরি রেসপন্স টিম, ডেঙ্গু প্রতিরোধ কন্ট্রোল রুম এবং দুর্যোগ সতর্কবার্তা সিস্টেম।',
      en: 'Rapid monsoon drainage response, emergency engineering squads, dedicated dengue control rooms, and real-time civic alert broadcasts.',
    },
  },
];

/* 4. MAYOR / ADMINISTRATOR DATA                                              */

export const MAYOR_PROFILE: MayorProfile = {
  name: {
    bn: 'ড. এ. কে. এম. শফিকুল ইসলাম',
    en: 'Dr. A. K. M. Shafiqul Islam',
  },
  designation: {
    bn: 'প্রশাসক / প্রধান নগর নির্বাহী, ঢাকা স্মার্ট সিটি কর্পোরেশন',
    en: 'Administrator / Chief Municipal Executive, Dhaka Smart City Corporation',
  },
  tenure: {
    bn: 'দায়িত্বকাল: ২০২৪ – বর্তমান',
    en: 'Tenure: 2024 – Present',
  },
  office: {
    bn: 'নগর ভবন, লেভেল-৩ (প্রধান নির্বাহীর দপ্তর), ফুলবাড়িয়া, ঢাকা-১০০০',
    en: 'Nagar Bhaban, Level 3 (Executive Secretariat), Fulbaria, Dhaka-1000',
  },
  phone: '+880-2-223383501',
  email: 'mayor.office@dscc.smartcity.gov.bd',
  officeHours: {
    bn: 'রবিবার – বৃহস্পতিবার, সকাল ৯:০০টা – বিকাল ৫:০০টা (নাগরিক সাক্ষাৎ: মঙ্গলবার ও বৃহস্পতিবার দুপুর ২:৩০ – ৪:৩০)',
    en: 'Sunday – Thursday, 9:00 AM – 5:00 PM (Public Hearing: Tue & Thu, 2:30 PM – 4:30 PM)',
  },
  messageTitle: {
    bn: 'নগরবাসীর প্রতি বার্তা',
    en: 'Message to the Citizens of Dhaka',
  },
  messageBody: [
    {
      bn: 'প্রিয় ঢাকাবাসী, একটি বাসযোগ্য, পরিচ্ছন্ন ও নিরাপদ মহানগর গড়ে তোলা কেবল প্রশাসনের একার দায়িত্ব নয় — এটি সিটি কর্পোরেশন ও সচেতন নাগরিকদের যৌথ অঙ্গীকার। আমরা প্রতিটি নাগরিক সেবাকে দালালমুক্ত, কাগজবিহীন এবং হাতের মুঠোয় নিয়ে আসতে নিরলসভাবে কাজ করছি।',
      en: 'Dear Citizens of Dhaka, building a livable, clean, and safe capital is a shared partnership between municipal institutions and engaged residents. Our administration is committed to delivering every municipal service transparently, without intermediaries, directly to your fingertips.',
    },
    {
      bn: 'এই স্মার্ট সিটি পোর্টালের মাধ্যমে এখন আপনি ঘরে বসেই হোল্ডিং ট্যাক্স পরিশোধ, ট্রেড লাইসেন্স নবায়ন, QR-যাচাইকৃত সনদ গ্রহণ এবং জিপিএস লোকেশনসহ যেকোনো নগর সমস্যা সরাসরি সংশ্লিষ্ট প্রকৌশলী বা পরিচ্ছন্নতা টিমের কাছে পৌঁছে দিতে পারছেন। আসুন, আমরা সবাই মিলে আগামী প্রজন্মের জন্য একটি সবুজ ও স্মার্ট ঢাকা গড়ে তুলি।',
      en: 'Through this Smart City portal, citizens can pay holding taxes, renew trade licenses, download QR-verified certificates, and report geo-tagged civic issues directly to our rapid-response field squads. Together, let us build a greener, smarter Dhaka for generations to come.',
    },
  ],
  biography: [
    {
      bn: 'ড. এ. কে. এম. শফিকুল ইসলাম বাংলাদেশ সিভিল সার্ভিস (প্রশাসন) ক্যাডারের একজন জ্যেষ্ঠ কর্মকর্তা এবং নগর পরিকল্পনা ও স্থানীয় সরকার ব্যবস্থাপনায় দুই দশকেরও বেশি অভিজ্ঞতাসম্পন্ন।',
      en: 'Dr. A. K. M. Shafiqul Islam is a senior public administrator with over two decades of experience in urban governance, municipal finance reform, and public infrastructure management.',
    },
    {
      bn: 'সিটি কর্পোরেশনের দায়িত্ব গ্রহণের পূর্বে তিনি স্থানীয় সরকার বিভাগ এবং একাধিক জাতীয় ডিজিটাল গভর্ন্যান্স প্রকল্পে নেতৃত্ব দিয়েছেন, যা ওয়ার্ড পর্যায়ে ই-সেবা সম্প্রসারণে গুরুত্বপূর্ণ ভূমিকা রেখেছে।',
      en: 'Prior to leading the City Corporation, he spearheaded national local-government digitization initiatives and metropolitan drainage modernization programs across major Bangladeshi cities.',
    },
  ],
  education: [
    {
      bn: 'পিএইচডি (নগর পরিকল্পনা ও সুশাসন) — ঢাকা বিশ্ববিদ্যালয়',
      en: 'Ph.D. in Urban Governance & Planning — University of Dhaka',
    },
    {
      bn: 'এমপিএ (পাবলিক পলিসি অ্যান্ড ম্যানেজমেন্ট) — লি কুয়ান ইউ স্কুল অব পাবলিক পলিসি',
      en: 'Master in Public Administration — Lee Kuan Yew School of Public Policy',
    },
    {
      bn: 'স্নাতক ও স্নাতকোত্তর (অর্থনীতি) — ঢাকা বিশ্ববিদ্যালয়',
      en: 'B.S.S. & M.S.S. in Economics — University of Dhaka',
    },
  ],
  priorities: [
    {
      id: 'zero-waterlogging',
      icon: Droplets,
      title: { bn: 'জলাবদ্ধতা নিরসন ও খাল পুনরুদ্ধার', en: 'Zero Waterlogging & Canal Recovery' },
      description: {
        bn: 'প্রধান স্টর্ম ড্রেনেজ লাইন সংস্কার, পাম্প স্টেশন আধুনিকায়ন এবং দখলমুক্ত খালগুলোতে সবুজ ওয়াকওয়ে নির্মাণ।',
        en: 'Upgrading primary storm drains, automating pumping stations, and restoring encroached urban canals with green walkways.',
      },
    },
    {
      id: 'smart-waste-24',
      icon: Recycle,
      title: { bn: 'রাত্রিকালীন স্মার্ট বর্জ্য অপসারণ', en: 'Night-Time Smart Waste Clearance' },
      description: {
        bn: 'প্রতিটি ওয়ার্ডে আধুনিক সেকেন্ডারি ট্রান্সফার স্টেশন ও জিপিএস-মনিটরকৃত ট্রাকের মাধ্যমে সূর্যোদয়ের আগেই সড়ক পরিচ্ছন্নকরণ।',
        en: 'Completing road and STS waste clearance before sunrise across every ward via GPS-tracked compactor vehicles.',
      },
    },
    {
      id: 'paperless-tax',
      icon: CheckCircle2,
      title: { bn: 'শতভাগ অনলাইন রাজস্ব ও সনদ সেবা', en: '100% Online Revenue & Certificates' },
      description: {
        bn: 'নগর ভবনে সশরীরে উপস্থিতি ছাড়াই QR-যাচাইকৃত ট্রেড লাইসেন্স, নাগরিক সনদ ও হোল্ডিং ট্যাক্স রসিদ নিশ্চিতকরণ।',
        en: 'Eliminating in-person queues with instant QR-verified trade licenses, citizen certificates, and online tax rebates.',
      },
    },
    {
      id: 'dengue-free',
      icon: Sparkles,
      title: { bn: 'বছরব্যাপী সমন্বিত মশক নিধন', en: 'Year-Round Vector Control' },
      description: {
        bn: 'হটস্পট ম্যাপিং ও ওয়ার্ডভিত্তিক নিয়মিত ফগিং এবং লার্ভিসাইডিং তদারকির মাধ্যমে ডেঙ্গু ঝুঁকি হ্রাস।',
        en: 'GIS hotspot mapping paired with audited daily larviciding and evening fogging cycles to curb dengue outbreaks.',
      },
    },
  ],
};

/* 5. COUNCILLORS DATA                                                        */

export const COUNCILLOR_ZONES = [
  { id: 'all', label: { bn: 'সকল জোন (১–৫)', en: 'All Zones (1–5)' } },
  { id: 'zone-1', label: { bn: 'জোন-১ (ধানমন্ডি ও নিউমার্কেট)', en: 'Zone 1 (Dhanmondi & New Market)' } },
  { id: 'zone-2', label: { bn: 'জোন-২ (মতিঝিল ও শাহজাহানপুর)', en: 'Zone 2 (Motijheel & Shahjahanpur)' } },
  { id: 'zone-3', label: { bn: 'জোন-৩ (লালবাগ ও আজিমপুর)', en: 'Zone 3 (Lalbagh & Azimpur)' } },
  { id: 'zone-4', label: { bn: 'জোন-৪ (গুলশান ও বনানী)', en: 'Zone 4 (Gulshan & Banani)' } },
  { id: 'zone-5', label: { bn: 'জোন-৫ (মিরপুর ও উত্তরা)', en: 'Zone 5 (Mirpur & Uttara)' } },
];

export const COUNCILLORS_LIST: PersonProfile[] = [
  {
    id: 'c-w27',
    name: { bn: 'মোঃ ওমর বিন আব্দাল আজিজ', en: 'Md. Omar Bin Abdal Aziz' },
    designation: { bn: 'ওয়ার্ড কাউন্সিলর (সাধারণ আসন)', en: 'Ward Councillor (General Seat)' },
    badgeText: { bn: 'ওয়ার্ড ২৭ · জোন-১', en: 'Ward 27 · Zone 1' },
    zoneId: 'zone-1',
    zoneLabel: { bn: 'জোন-১', en: 'Zone 1' },
    wardNumber: 27,
    seatType: 'general',
    phone: '01711-270027',
    email: 'ward27.councillor@dscc.smartcity.gov.bd',
    officeHours: { bn: 'রবি – বৃহঃ, সকাল ১০:০০ – দুপুর ২:০০', en: 'Sun – Thu, 10:00 AM – 2:00 PM' },
    officeLocation: { bn: 'ধানমন্ডি রোড-৭/এ, ওয়ার্ড কার্যালয়', en: 'Dhanmondi Road 7/A, Ward Office' },
  },
  {
    id: 'c-w15',
    name: { bn: 'রফিকুল ইসলাম বাবলা', en: 'Rafiqul Islam Babla' },
    designation: { bn: 'ওয়ার্ড কাউন্সিলর (সাধারণ আসন)', en: 'Ward Councillor (General Seat)' },
    badgeText: { bn: 'ওয়ার্ড ১৫ · জোন-১', en: 'Ward 15 · Zone 1' },
    zoneId: 'zone-1',
    zoneLabel: { bn: 'জোন-১', en: 'Zone 1' },
    wardNumber: 15,
    seatType: 'general',
    phone: '01711-150015',
    email: 'ward15.councillor@dscc.smartcity.gov.bd',
    officeHours: { bn: 'রবি – বৃহঃ, সকাল ৯:৩০ – বিকাল ৩:০০', en: 'Sun – Thu, 9:30 AM – 3:00 PM' },
    officeLocation: { bn: 'সাতমসজিদ রোড, ধানমন্ডি', en: 'Satmasjid Road, Dhanmondi' },
  },
  {
    id: 'c-r01',
    name: { bn: 'নাসরিন আহমেদ রীতা', en: 'Nasrin Ahmed Rita' },
    designation: { bn: 'সংরক্ষিত নারী আসন কাউন্সিলর', en: 'Reserved Women’s Seat Councillor' },
    badgeText: { bn: 'সংরক্ষিত আসন-৫ (ওয়ার্ড ১৫, ১৮, ২৭) · জোন-১', en: 'Reserved Seat 5 (Wards 15, 18, 27) · Zone 1' },
    zoneId: 'zone-1',
    zoneLabel: { bn: 'জোন-১', en: 'Zone 1' },
    wardNumber: 18,
    seatType: 'reserved',
    phone: '01712-550105',
    email: 'reserved05@dscc.smartcity.gov.bd',
    officeHours: { bn: 'রবি – বৃহঃ, সকাল ১০:০০ – বিকাল ৪:০০', en: 'Sun – Thu, 10:00 AM – 4:00 PM' },
    officeLocation: { bn: 'কলাবাগান কমিউনিটি সেন্টার কমপ্লেক্স', en: 'Kalabagan Community Center Complex' },
  },
  {
    id: 'c-w36',
    name: { bn: 'মাহবুবুর রহমান তুষার', en: 'Mahbubur Rahman Tushar' },
    designation: { bn: 'ওয়ার্ড কাউন্সিলর (সাধারণ আসন)', en: 'Ward Councillor (General Seat)' },
    badgeText: { bn: 'ওয়ার্ড ৩৬ · জোন-২', en: 'Ward 36 · Zone 2' },
    zoneId: 'zone-2',
    zoneLabel: { bn: 'জোন-২', en: 'Zone 2' },
    wardNumber: 36,
    seatType: 'general',
    phone: '01711-360036',
    email: 'ward36.councillor@dscc.smartcity.gov.bd',
    officeHours: { bn: 'রবি – বৃহঃ, সকাল ১০:০০ – বিকাল ৩:০০', en: 'Sun – Thu, 10:00 AM – 3:00 PM' },
    officeLocation: { bn: 'মতিঝিল এজিবি কলোনি সংলগ্ন', en: 'Adjacent to Motijheel AGB Colony' },
  },
  {
    id: 'c-r02',
    name: { bn: 'ফারহানা ইয়াসমিন ডলি', en: 'Farhana Yasmin Dolly' },
    designation: { bn: 'সংরক্ষিত নারী আসন কাউন্সিলর', en: 'Reserved Women’s Seat Councillor' },
    badgeText: { bn: 'সংরক্ষিত আসন-৯ (ওয়ার্ড ১১, ১২, ৩৬) · জোন-২', en: 'Reserved Seat 9 (Wards 11, 12, 36) · Zone 2' },
    zoneId: 'zone-2',
    zoneLabel: { bn: 'জোন-২', en: 'Zone 2' },
    wardNumber: 11,
    seatType: 'reserved',
    phone: '01712-550109',
    email: 'reserved09@dscc.smartcity.gov.bd',
    officeHours: { bn: 'রবি – বৃহঃ, সকাল ১০:৩০ – বিকাল ৩:৩০', en: 'Sun – Thu, 10:30 AM – 3:30 PM' },
    officeLocation: { bn: 'শাহজাহানপুর কমিউনিটি কমপ্লেক্স', en: 'Shahjahanpur Community Complex' },
  },
  {
    id: 'c-w24',
    name: { bn: 'হাজী মোঃ মোকাদ্দেস হোসেন জাহিদ', en: 'Hazi Md. Mokaddes Hossain Zahid' },
    designation: { bn: 'ওয়ার্ড কাউন্সিলর (সাধারণ আসন)', en: 'Ward Councillor (General Seat)' },
    badgeText: { bn: 'ওয়ার্ড ২৪ · জোন-৩', en: 'Ward 24 · Zone 3' },
    zoneId: 'zone-3',
    zoneLabel: { bn: 'জোন-৩', en: 'Zone 3' },
    wardNumber: 24,
    seatType: 'general',
    phone: '01711-240024',
    email: 'ward24.councillor@dscc.smartcity.gov.bd',
    officeHours: { bn: 'রবি – বৃহঃ, সকাল ৯:৩০ – দুপুর ২:৩০', en: 'Sun – Thu, 9:30 AM – 2:30 PM' },
    officeLocation: { bn: 'লালবাগ কেল্লার মোড়, ওয়ার্ড অফিস', en: 'Lalbagh Fort Crossing, Ward Office' },
  },
  {
    id: 'c-w19',
    name: { bn: 'মোঃ মফিজুর রহমান', en: 'Md. Mofizur Rahman' },
    designation: { bn: 'ওয়ার্ড কাউন্সিলর (সাধারণ আসন)', en: 'Ward Councillor (General Seat)' },
    badgeText: { bn: 'ওয়ার্ড ১৯ · জোন-৪', en: 'Ward 19 · Zone 4' },
    zoneId: 'zone-4',
    zoneLabel: { bn: 'জোন-৪', en: 'Zone 4' },
    wardNumber: 19,
    seatType: 'general',
    phone: '01711-190019',
    email: 'ward19.councillor@dscc.smartcity.gov.bd',
    officeHours: { bn: 'রবি – বৃহঃ, সকাল ১০:০০ – বিকাল ৪:০০', en: 'Sun – Thu, 10:00 AM – 4:00 PM' },
    officeLocation: { bn: 'বনানী রোড-১১, কমিউনিটি ভবন', en: 'Banani Road 11, Community Bhaban' },
  },
  {
    id: 'c-r04',
    name: { bn: 'সালমা আক্তার শিমুল', en: 'Salma Akter Shimul' },
    designation: { bn: 'সংরক্ষিত নারী আসন কাউন্সিলর', en: 'Reserved Women’s Seat Councillor' },
    badgeText: { bn: 'সংরক্ষিত আসন-১৪ (ওয়ার্ড ১৮, ১৯, ২০) · জোন-৪', en: 'Reserved Seat 14 (Wards 18, 19, 20) · Zone 4' },
    zoneId: 'zone-4',
    zoneLabel: { bn: 'জোন-৪', en: 'Zone 4' },
    wardNumber: 19,
    seatType: 'reserved',
    phone: '01712-550114',
    email: 'reserved14@dscc.smartcity.gov.bd',
    officeHours: { bn: 'রবি – বৃহঃ, সকাল ১০:০০ – দুপুর ৩:০০', en: 'Sun – Thu, 10:00 AM – 3:00 PM' },
    officeLocation: { bn: 'গুলশান-২ আঞ্চলিক কার্যালয় সংলগ্ন', en: 'Adjacent to Gulshan-2 Zonal Office' },
  },
  {
    id: 'c-w12',
    name: { bn: 'মুরাদ হোসেন চৌধুরী', en: 'Murad Hossain Chowdhury' },
    designation: { bn: 'ওয়ার্ড কাউন্সিলর (সাধারণ আসন)', en: 'Ward Councillor (General Seat)' },
    badgeText: { bn: 'ওয়ার্ড ১২ · জোন-৫', en: 'Ward 12 · Zone 5' },
    zoneId: 'zone-5',
    zoneLabel: { bn: 'জোন-৫', en: 'Zone 5' },
    wardNumber: 12,
    seatType: 'general',
    phone: '01711-120012',
    email: 'ward12.councillor@dscc.smartcity.gov.bd',
    officeHours: { bn: 'রবি – বৃহঃ, সকাল ৯:৩০ – বিকাল ৩:৩০', en: 'Sun – Thu, 9:30 AM – 3:30 PM' },
    officeLocation: { bn: 'মিরপুর-১০ গোলচত্বর সংলগ্ন ওয়ার্ড ভবন', en: 'Mirpur-10 Circle Ward Bhaban' },
  },
  {
    id: 'c-w01',
    name: { bn: 'মোঃ আফসার উদ্দিন খান', en: 'Md. Afsar Uddin Khan' },
    designation: { bn: 'ওয়ার্ড কাউন্সিলর (সাধারণ আসন)', en: 'Ward Councillor (General Seat)' },
    badgeText: { bn: 'ওয়ার্ড ০১ · জোন-৫', en: 'Ward 01 · Zone 5' },
    zoneId: 'zone-5',
    zoneLabel: { bn: 'জোন-৫', en: 'Zone 5' },
    wardNumber: 1,
    seatType: 'general',
    phone: '01711-010001',
    email: 'ward01.councillor@dscc.smartcity.gov.bd',
    officeHours: { bn: 'রবি – বৃহঃ, সকাল ১০:০০ – বিকাল ৪:০০', en: 'Sun – Thu, 10:00 AM – 4:00 PM' },
    officeLocation: { bn: 'উত্তরা সেক্টর-৪, কল্যাণ সমিতি রোড', en: 'Uttara Sector 4, Kalyan Samity Road' },
  },
];

/* 6. WARD DIRECTORY DATA                                                     */

export const WARD_DIRECTORY_LIST: WardDirectoryItem[] = [
  {
    wardNumber: 27,
    zoneId: 'zone-1',
    zoneLabel: { bn: 'জোন-১', en: 'Zone 1' },
    areaName: { bn: 'ধানমন্ডি ও শুক্রাবাদ', en: 'Dhanmondi & Shukrabad' },
    coveredAreas: {
      bn: 'ধানমন্ডি রোড ১–১৫/এ, সোবহানবাগ, শুক্রাবাদ, তল্লাবাগ, রাসেল স্কয়ার',
      en: 'Dhanmondi Roads 1–15/A, Sobhanbag, Shukrabad, Tallabag, Russel Square',
    },
    councillorName: { bn: 'মোঃ ওমর বিন আব্দাল আজিজ', en: 'Md. Omar Bin Abdal Aziz' },
    councillorPhone: '01711-270027',
    secretaryName: { bn: 'কামরুল হাসান (ওয়ার্ড সচিব)', en: 'Kamrul Hasan (Ward Secretary)' },
    secretaryPhone: '01819-270127',
    wasteSchedule: { bn: 'প্রতিদিন সন্ধ্যা ৬:৩০ – রাত ৯:৩০', en: 'Daily 6:30 PM – 9:30 PM' },
    foggingSchedule: { bn: 'প্রতি রবি, মঙ্গল ও বৃহঃ বিকাল ৫:০০টা', en: 'Sun, Tue & Thu at 5:00 PM' },
    population: { bn: '১,৪২,৫০০ জন', en: '142,500' },
  },
  {
    wardNumber: 15,
    zoneId: 'zone-1',
    zoneLabel: { bn: 'জোন-১', en: 'Zone 1' },
    areaName: { bn: 'জিগাতলা ও সাতমসজিদ রোড', en: 'Jigatola & Satmasjid Road' },
    coveredAreas: {
      bn: 'জিগাতলা, ঝিগাতলা স্টাফ কোয়ার্টার, শংকর, পশ্চিম ধানমন্ডি, রায়েরবাজার একাংশ',
      en: 'Jigatola, Staff Quarter, Shankar, West Dhanmondi, Rayerbazar (Part)',
    },
    councillorName: { bn: 'রফিকুল ইসলাম বাবলা', en: 'Rafiqul Islam Babla' },
    councillorPhone: '01711-150015',
    secretaryName: { bn: 'আব্দুর রহিম (ওয়ার্ড সচিব)', en: 'Abdur Rahim (Ward Secretary)' },
    secretaryPhone: '01819-150115',
    wasteSchedule: { bn: 'প্রতিদিন সন্ধ্যা ৬:০০ – রাত ৯:০০', en: 'Daily 6:00 PM – 9:00 PM' },
    foggingSchedule: { bn: 'প্রতি শনি, সোম ও বুধ বিকাল ৪:৪৫টা', en: 'Sat, Mon & Wed at 4:45 PM' },
    population: { bn: '১,৫৮,২০০ জন', en: '158,200' },
  },
  {
    wardNumber: 19,
    zoneId: 'zone-4',
    zoneLabel: { bn: 'জোন-৪', en: 'Zone 4' },
    areaName: { bn: 'বনানী, গুলশান-১ ও মহাখালী', en: 'Banani, Gulshan-1 & Mohakhali' },
    coveredAreas: {
      bn: 'বনানী আবাসিক এলাকা, গুলশান-১ ও ২, কড়াইল সংলগ্ন, মহাখালী ওয়্যারলেস',
      en: 'Banani Residential, Gulshan 1 & 2, Mohakhali Wireless & Commercial Zone',
    },
    councillorName: { bn: 'মোঃ মফিজুর রহমান', en: 'Md. Mofizur Rahman' },
    councillorPhone: '01711-190019',
    secretaryName: { bn: 'তানজিনা আক্তার (ওয়ার্ড সচিব)', en: 'Tanjina Akter (Ward Secretary)' },
    secretaryPhone: '01819-190119',
    wasteSchedule: { bn: 'প্রতিদিন সন্ধ্যা ৭:০০ – রাত ১০:০০', en: 'Daily 7:00 PM – 10:00 PM' },
    foggingSchedule: { bn: 'প্রতিদিন সকাল ৮:০০ (লার্ভিসাইডিং) ও বিকাল ৫:১৫', en: 'Daily 8:00 AM Larviciding & 5:15 PM Fogging' },
    population: { bn: '১,৬৮,০০০ জন', en: '168,000' },
  },
  {
    wardNumber: 36,
    zoneId: 'zone-2',
    zoneLabel: { bn: 'জোন-২', en: 'Zone 2' },
    areaName: { bn: 'মতিঝিল ও আরামবাগ', en: 'Motijheel & Arambagh' },
    coveredAreas: {
      bn: 'মতিঝিল বাণিজ্যিক এলাকা, দিলকুশা, আরামবাগ, ফকিরাপুল, এজিবি কলোনি',
      en: 'Motijheel Commercial Area, Dilkusha, Arambagh, Fakirapool, AGB Colony',
    },
    councillorName: { bn: 'মাহবুবুর রহমান তুষার', en: 'Mahbubur Rahman Tushar' },
    councillorPhone: '01711-360036',
    secretaryName: { bn: 'শহীদুল ইসলাম (ওয়ার্ড সচিব)', en: 'Shahidul Islam (Ward Secretary)' },
    secretaryPhone: '01819-360136',
    wasteSchedule: { bn: 'প্রতিদিন রাত ৮:০০ – রাত ১১:০০ (বাণিজ্যিক)', en: 'Daily 8:00 PM – 11:00 PM (Commercial)' },
    foggingSchedule: { bn: 'প্রতি রবি, মঙ্গল ও বৃহঃ বিকাল ৫:০০টা', en: 'Sun, Tue & Thu at 5:00 PM' },
    population: { bn: '১,২৪,৮০০ জন', en: '124,800' },
  },
  {
    wardNumber: 24,
    zoneId: 'zone-3',
    zoneLabel: { bn: 'জোন-৩', en: 'Zone 3' },
    areaName: { bn: 'লালবাগ ও আজিমপুর', en: 'Lalbagh & Azimpur' },
    coveredAreas: {
      bn: 'লালবাগ কেল্লা এলাকা, আজিমপুর কলোনি, পলাশী, জগন্নাথ সাহা রোড, শহীদনগর',
      en: 'Lalbagh Fort Area, Azimpur Colony, Palashi, Jagannath Saha Road, Shahidnagar',
    },
    councillorName: { bn: 'হাজী মোঃ মোকাদ্দেস হোসেন জাহিদ', en: 'Hazi Md. Mokaddes Hossain Zahid' },
    councillorPhone: '01711-240024',
    secretaryName: { bn: 'মোঃ সাইফুল্লাহ (ওয়ার্ড সচিব)', en: 'Md. Saifullah (Ward Secretary)' },
    secretaryPhone: '01819-240124',
    wasteSchedule: { bn: 'প্রতিদিন ভোর ৬:০০ – সকাল ৯:০০ ও সন্ধ্যা ৬:৩০', en: 'Daily 6:00 AM – 9:00 AM & 6:30 PM' },
    foggingSchedule: { bn: 'প্রতি শনি, সোম ও বুধ বিকাল ৪:৩০টা', en: 'Sat, Mon & Wed at 4:30 PM' },
    population: { bn: '১,৮১,৪০০ জন', en: '181,400' },
  },
  {
    wardNumber: 12,
    zoneId: 'zone-5',
    zoneLabel: { bn: 'জোন-৫', en: 'Zone 5' },
    areaName: { bn: 'মিরপুর-১০ ও কাজীপাড়া', en: 'Mirpur-10 & Kazipara' },
    coveredAreas: {
      bn: 'মিরপুর সেকশন-১০, সেনপাড়া পর্বতা, পশ্চিম কাজীপাড়া, শেওড়াপাড়া একাংশ',
      en: 'Mirpur Section 10, Senpara Parbata, West Kazipara, Shewrapara (Part)',
    },
    councillorName: { bn: 'মুরাদ হোসেন চৌধুরী', en: 'Murad Hossain Chowdhury' },
    councillorPhone: '01711-120012',
    secretaryName: { bn: 'ফারুক আহমেদ (ওয়ার্ড সচিব)', en: 'Faruk Ahmed (Ward Secretary)' },
    secretaryPhone: '01819-120112',
    wasteSchedule: { bn: 'প্রতিদিন সন্ধ্যা ৬:০০ – রাত ৯:০০', en: 'Daily 6:00 PM – 9:00 PM' },
    foggingSchedule: { bn: 'প্রতি রবি, মঙ্গল ও বৃহঃ বিকাল ৫:০০টা', en: 'Sun, Tue & Thu at 5:00 PM' },
    population: { bn: '১,৯৬,০০০ জন', en: '196,000' },
  },
  {
    wardNumber: 1,
    zoneId: 'zone-5',
    zoneLabel: { bn: 'জোন-৫', en: 'Zone 5' },
    areaName: { bn: 'উত্তরা মডেল টাউন (সেক্টর ১–১০)', en: 'Uttara Model Town (Sectors 1–10)' },
    coveredAreas: {
      bn: 'উত্তরা সেক্টর ১, ৩, ৪, ৬, ৭, ৯, ১০ এবং আব্দুল্লাহপুর সংলগ্ন',
      en: 'Uttara Sectors 1, 3, 4, 6, 7, 9, 10 & Abdullahpur Approach',
    },
    councillorName: { bn: 'মোঃ আফসার উদ্দিন খান', en: 'Md. Afsar Uddin Khan' },
    councillorPhone: '01711-010001',
    secretaryName: { bn: 'নুসরাত জাহান (ওয়ার্ড সচিব)', en: 'Nusrat Jahan (Ward Secretary)' },
    secretaryPhone: '01819-010101',
    wasteSchedule: { bn: 'প্রতিদিন সন্ধ্যা ৬:৩০ – রাত ৯:৩০', en: 'Daily 6:30 PM – 9:30 PM' },
    foggingSchedule: { bn: 'প্রতি শনি, সোম ও বুধ বিকাল ৫:০০টা', en: 'Sat, Mon & Wed at 5:00 PM' },
    population: { bn: '২,১০,৫০০ জন', en: '210,500' },
  },
];

/* 7. ORGANIZATIONAL STRUCTURE DATA                                           */

export const ORG_DIVISIONS: OrgDivision[] = [
  {
    id: 'engineering',
    title: { bn: 'প্রকৌশল বিভাগ', en: 'Engineering Division' },
    headTitle: { bn: 'প্রধান প্রকৌশলী', en: 'Chief Engineer' },
    summary: {
      bn: 'নগরীর সড়ক, সেতু, ফুটপাত, স্টর্ম ড্রেনেজ, ট্রাফিক সিগন্যাল এবং স্মার্ট এলইডি সড়কবাতি নির্মাণ ও রক্ষণাবেক্ষণের সর্বোচ্চ কারিগরি বিভাগ।',
      en: 'Lead technical authority for arterial roads, footpaths, storm drainage networks, traffic engineering, and automated LED street lighting.',
    },
    keyDuties: [
      { bn: 'সড়ক নির্মাণ, কার্পেটিং ও খনন অনুমতি তদারকি', en: 'Road surfacing, rehabilitation, and excavation permit supervision' },
      { bn: 'বর্ষা মৌসুমে জলাবদ্ধতা নিরসন ও পাম্প স্টেশন পরিচালনা', en: 'Monsoon drainage clearing and pumping station operations' },
      { bn: 'বিদ্যুৎ সার্কেল ও স্মার্ট এলইডি সড়কবাতি রক্ষণাবেক্ষণ', en: 'Electrical circle & smart LED streetlight maintenance' },
    ],
    unitsCount: { bn: '৬টি কারিগরি সার্কেল', en: '6 Technical Circles' },
  },
  {
    id: 'revenue',
    title: { bn: 'রাজস্ব বিভাগ', en: 'Revenue Division' },
    headTitle: { bn: 'প্রধান রাজস্ব কর্মকর্তা', en: 'Chief Revenue Officer' },
    summary: {
      bn: 'হোল্ডিং ট্যাক্স মূল্যায়ন ও আদায়, ই-ট্রেড লাইসেন্স, মার্কেট ভাড়া এবং ডিজিটাল পেমেন্ট ব্যবস্থাপনার মাধ্যমে সিটি কর্পোরেশনের নিজস্ব আয় পরিচালনা।',
      en: 'Manages municipal self-revenue through property holding tax assessment, e-trade licensing, market leases, and digital payment reconciliation.',
    },
    keyDuties: [
      { bn: 'হোল্ডিং নম্বর বরাদ্দ ও অনলাইন ট্যাক্স অ্যাসেসমেন্ট', en: 'Holding registration and online property tax assessment' },
      { bn: 'নতুন ট্রেড লাইসেন্স ইস্যু ও বার্ষিক নবায়ন', en: 'New trade license issuance and annual digital renewal' },
      { bn: 'পৌর বাজার ও সম্পত্তি ইজারা ব্যবস্থাপনা', en: 'Municipal market stall and commercial asset management' },
    ],
    unitsCount: { bn: '৫টি আঞ্চলিক রাজস্ব সার্কেল', en: '5 Zonal Revenue Circles' },
  },
  {
    id: 'health',
    title: { bn: 'জনস্বাস্থ্য বিভাগ', en: 'Public Health Division' },
    headTitle: { bn: 'প্রধান স্বাস্থ্য কর্মকর্তা', en: 'Chief Health Officer' },
    summary: {
      bn: 'নগর মাতৃসদন, প্রাথমিক স্বাস্থ্যসেবা, ইপিআই টিকাদান, জন্ম-মৃত্যু নিবন্ধন এবং বছরব্যাপী মশক নিধন কার্যক্রম পরিচালনা।',
      en: 'Oversees urban maternity hospitals, primary healthcare centers, EPI vaccination, vital registration, and city-wide vector control.',
    },
    keyDuties: [
      { bn: 'ওয়ার্ডভিত্তিক ডেঙ্গু প্রতিরোধ, লার্ভিসাইডিং ও ফগিং', en: 'Ward-level dengue prevention, larviciding, and fogging' },
      { bn: 'অনলাইন জন্ম ও মৃত্যু নিবন্ধন যাচাই ও ইস্যু', en: 'Online birth & death registration verification and issuance' },
      { bn: 'খাদ্য নিরাপত্তা ও ভেজালবিরোধী মোবাইল কোর্ট সহায়তা', en: 'Food safety inspection and mobile court coordination' },
    ],
    unitsCount: { bn: '২৮টি নগর স্বাস্থ্য কেন্দ্র', en: '28 Urban Health Centers' },
  },
  {
    id: 'waste',
    title: { bn: 'বর্জ্য ব্যবস্থাপনা বিভাগ', en: 'Waste Management Division' },
    headTitle: { bn: 'প্রধান বর্জ্য ব্যবস্থাপনা কর্মকর্তা', en: 'Chief Waste Management Officer' },
    summary: {
      bn: 'প্রতিদিন ৫,০০০+ মেট্রিক টন নগর বর্জ্য সংগ্রহ, সেকেন্ডারি ট্রান্সফার স্টেশন (STS) পরিচালনা এবং আধুনিক ল্যান্ডফিল ব্যবস্থাপনা।',
      en: 'Coordinates daily collection of 5,000+ metric tons of municipal waste, Secondary Transfer Stations (STS), and sanitary landfill operations.',
    },
    keyDuties: [
      { bn: 'দৈনিক সড়ক ঝাড়ুদার ও বর্জ্য সংগ্রহ ভ্যান সমন্বয়', en: 'Daily street sweeping and primary waste collection coordination' },
      { bn: 'আধুনিক এসটিএস (STS) ও কম্প্যাক্টর ফ্লিট তদারকি', en: 'Modern STS and GPS-tracked compactor fleet monitoring' },
      { bn: 'মেডিকেল ও ই-বর্জ্য নিরাপদ নিষ্পত্তি তদারকি', en: 'Safe disposal compliance for medical and electronic waste' },
    ],
    unitsCount: { bn: '৫৪টি আধুনিক STS', en: '54 Modern STS Hubs' },
  },
  {
    id: 'planning',
    title: { bn: 'নগর পরিকল্পনা বিভাগ', en: 'Urban Planning Division' },
    headTitle: { bn: 'প্রধান নগর পরিকল্পনাবিদ', en: 'Chief Town Planner' },
    summary: {
      bn: 'জিআইএস ম্যাপিং, টেকসই নগর নকশা, পার্ক ও খেলার মাঠ উন্নয়ন এবং জলবায়ু-সহনশীল মহাপরিকল্পনা বাস্তবায়ন।',
      en: 'Leads GIS spatial planning, sustainable urban design, public park revitalization, and climate-resilient metropolitan master planning.',
    },
    keyDuties: [
      { bn: 'ইন্টারেক্টিভ জিআইএস সিটি ম্যাপ ও ওয়ার্ড ডেটাবেস হালনাগাদ', en: 'Interactive GIS City Map and ward spatial database upkeep' },
      { bn: 'পার্ক, খেলার মাঠ ও পাবলিক স্পেস নকশা প্রণয়ন', en: 'Design and modernization of parks, playgrounds, and public plazas' },
      { bn: 'নগর পরিবহন ও পথচারীবান্ধব করিডোর পরিকল্পনা', en: 'Pedestrian-friendly corridors and urban mobility planning' },
    ],
    unitsCount: { bn: '৩টি পরিকল্পনা ও জিআইএস সেল', en: '3 Planning & GIS Cells' },
  },
  {
    id: 'admin',
    title: { bn: 'প্রশাসন ও হিসাব বিভাগ', en: 'Administration & Accounts' },
    headTitle: { bn: 'সচিব ও প্রধান হিসাবরক্ষণ কর্মকর্তা', en: 'Secretary & Chief Accounts Officer' },
    summary: {
      bn: 'মানবসম্পদ ব্যবস্থাপনা, কর্পোরেশন বোর্ড সভা সমন্বয়, বাজেট প্রণয়ন, অডিট এবং আইসিটি/স্মার্ট সিটি সেবা পরিচালনা।',
      en: 'Handles human resources, corporation board governance, annual budgeting, statutory audits, and ICT/Smart City systems.',
    },
    keyDuties: [
      { bn: 'বার্ষিক উন্মুক্ত বাজেট প্রণয়ন ও ব্যয় অডিট', en: 'Annual open budget formulation and expenditure auditing' },
      { bn: 'কর্মকর্তা-কর্মচারী প্রশাসন ও প্রশিক্ষণ ব্যবস্থাপনা', en: 'Human resources administration and capacity building' },
      { bn: 'ডিজিটাল পোর্টাল, সাইবার নিরাপত্তা ও ই-নথি পরিচালনা', en: 'Digital portal operations, cybersecurity, and e-Nothi governance' },
    ],
    unitsCount: { bn: '৪টি কেন্দ্রীয় শাখা', en: '4 Central Branches' },
  },
];

/* 8. DEPARTMENTS & OFFICIALS DATA                                            */

export const DEPARTMENTS_LIST: DepartmentInfo[] = [
  {
    id: 'engineering',
    name: { bn: 'প্রকৌশল বিভাগ', en: 'Engineering' },
    overview: {
      bn: 'নগরীর সড়ক, ড্রেন, ফুটপাত, ওভারব্রিজ এবং সড়কবাতি নির্মাণ ও জরুরি মেরামত কার্যক্রম পরিচালনা করে।',
      en: 'Plans, constructs, and maintains city roads, storm drains, pedestrian bridges, and smart LED streetlights.',
    },
    responsibilities: [
      { bn: 'সড়ক মেরামত ও পুনঃকার্পেটিং প্রকল্প বাস্তবায়ন', en: 'Road rehabilitation and asphalt carpeting projects' },
      { bn: 'রাস্তা খননের অনুমতি (NOC) প্রদান ও পুনরুদ্ধার তদারকি', en: 'Road excavation NOC issuance and reinstatement audit' },
      { bn: 'স্মার্ট এলইডি সড়কবাতি ও ট্রাফিক সিগন্যাল পরিচালনা', en: 'Smart LED lighting and urban traffic signal operations' },
    ],
    hotline: '+880-2-223383510',
    officeFloor: { bn: 'নগর ভবন, লেভেল-৭ ও ৮', en: 'Nagar Bhaban, Levels 7 & 8' },
  },
  {
    id: 'revenue',
    name: { bn: 'রাজস্ব বিভাগ', en: 'Revenue' },
    overview: {
      bn: 'হোল্ডিং ট্যাক্স নির্ধারণ, পুনর্মূল্যায়ন, অনলাইন রাজস্ব আদায় এবং কর ছাড়পত্র প্রদানের দায়িত্বপ্রাপ্ত।',
      en: 'Administers property holding tax assessment, reassessments, online revenue collection, and digital tax clearance.',
    },
    responsibilities: [
      { bn: 'আবাসিক ও বাণিজ্যিক হোল্ডিং ট্যাক্স মূল্যায়ন', en: 'Residential and commercial holding tax assessment' },
      { bn: 'অনলাইন কর পরিশোধে ১০% রিবেট প্রক্রিয়াকরণ', en: 'Processing 10% online early-payment tax rebates' },
      { bn: 'বকেয়া রাজস্ব নিষ্পত্তি ও ডিজিটাল পেমেন্ট রসিদ যাচাই', en: 'Arrears settlement and digital payment receipt verification' },
    ],
    hotline: '+880-2-223383520',
    officeFloor: { bn: 'নগর ভবন, লেভেল-৫', en: 'Nagar Bhaban, Level 5' },
  },
  {
    id: 'conservancy',
    name: { bn: 'বর্জ্য ব্যবস্থাপনা', en: 'Conservancy / Waste' },
    overview: {
      bn: 'নগরীর ৭৫টি ওয়ার্ড থেকে দৈনিক বর্জ্য সংগ্রহ, পরিবহন, সেকেন্ডারি ট্রান্সফার স্টেশন এবং ল্যান্ডফিল পরিচালনা।',
      en: 'Manages daily municipal waste collection across 75 wards, STS hubs, street sweeping, and landfill operations.',
    },
    responsibilities: [
      { bn: 'রাত ও ভোরের নির্ধারিত সময়ে বর্জ্য অপসারণ', en: 'Scheduled evening and pre-dawn waste removal' },
      { bn: 'স্মার্ট বিন ও সেকেন্ডারি ট্রান্সফার স্টেশন (STS) তদারকি', en: 'Smart bin network and STS facility monitoring' },
      { bn: 'কোরবানি ও উৎসবকালীন বিশেষ পরিচ্ছন্নতা অভিযান', en: 'Rapid clearance campaigns during Eid and civic events' },
    ],
    hotline: '+880-2-223383530',
    officeFloor: { bn: 'নগর ভবন, লেভেল-৯', en: 'Nagar Bhaban, Level 9' },
  },
  {
    id: 'health',
    name: { bn: 'স্বাস্থ্য বিভাগ', en: 'Health' },
    overview: {
      bn: 'নগরবাসীর প্রাথমিক স্বাস্থ্যসেবা, টিকাদান, মশক নিধন এবং ডেঙ্গু নিয়ন্ত্রণ কার্যক্রম সমন্বয় করে।',
      en: 'Delivers urban primary healthcare, immunization, food safety inspection, and city-wide mosquito control.',
    },
    responsibilities: [
      { bn: 'দৈনিক লার্ভিসাইডিং ও বিকালের ফগিং কর্মসূচি', en: 'Daily larviciding and evening fogging operations' },
      { bn: 'নগর মাতৃসদন ও প্রাথমিক ক্লিনিক পরিচালনা', en: 'Urban maternity centers and primary health clinics' },
      { bn: 'কবরস্থান ও শ্মশান ব্যবস্থাপনা ও দাফন অনুমতি', en: 'Municipal cemetery management and burial permits' },
    ],
    hotline: '+880-2-223383540',
    officeFloor: { bn: 'নগর ভবন, লেভেল-৬', en: 'Nagar Bhaban, Level 6' },
  },
  {
    id: 'license',
    name: { bn: 'লাইসেন্স শাখা', en: 'License' },
    overview: {
      bn: 'ব্যবসায়িক প্রতিষ্ঠানের নতুন ই-ট্রেড লাইসেন্স ইস্যু, বার্ষিক নবায়ন, সংশোধন এবং QR যাচাইকরণ।',
      en: 'Issues new business e-trade licenses, processes renewals and amendments, and maintains the QR verification registry.',
    },
    responsibilities: [
      { bn: 'অনলাইন নতুন ট্রেড লাইসেন্স অনুমোদন ও নবায়ন', en: 'Online new trade license approval and renewal' },
      { bn: 'ব্যবসার ধরন বা ঠিকানা সংশোধন প্রক্রিয়াকরণ', en: 'Business category and address modification processing' },
      { bn: 'বাণিজ্যিক সাইনবোর্ড ও বিজ্ঞাপন কর নির্ধারণ', en: 'Commercial signage and advertisement fee regulation' },
    ],
    hotline: '+880-2-223383525',
    officeFloor: { bn: 'নগর ভবন, লেভেল-৫ (লাইসেন্স উইং)', en: 'Nagar Bhaban, Level 5 (License Wing)' },
  },
  {
    id: 'birth_death',
    name: { bn: 'জন্ম ও মৃত্যু নিবন্ধন', en: 'Birth & Death' },
    overview: {
      bn: 'নাগরিকের জন্ম ও মৃত্যু নিবন্ধন, সনদ সংশোধন, নাগরিকত্ব ও চারিত্রিক সনদ ডিজিটালভাবে প্রদান।',
      en: 'Administers vital birth and death registration, record corrections, and digital citizenship certificates.',
    },
    responsibilities: [
      { bn: 'অনলাইন জন্ম ও মৃত্যু নিবন্ধন সনদ ইস্যু', en: 'Online birth and death certificate issuance' },
      { bn: 'তথ্য সংশোধন ও অনলাইন QR সনদ যাচাইকরণ', en: 'Record correction and public QR verification support' },
      { bn: 'নাগরিকত্ব, ওয়ারিশ ও চারিত্রিক সনদ সমন্বয়', en: 'Citizenship, succession, and character certificate processing' },
    ],
    hotline: '+880-2-223383545',
    officeFloor: { bn: 'আঞ্চলিক কার্যালয়সমূহ ও ওয়ার্ড অফিস', en: 'All Zonal & Ward Offices' },
  },
  {
    id: 'it_smart',
    name: { bn: 'আইটি ও স্মার্ট সিটি', en: 'IT / Smart City' },
    overview: {
      bn: 'সিটি কর্পোরেশনের ডিজিটাল পোর্টাল, জিআইএস ম্যাপ, এআই অভিযোগ রাউটিং এবং পেমেন্ট গেটওয়ে পরিচালনা করে।',
      en: 'Operates the Smart City web portal, GIS mapping infrastructure, complaint routing engine, and payment integrations.',
    },
    responsibilities: [
      { bn: '৫০+ অনলাইন ই-সেবা ও ডিজিটাল পেমেন্ট গেটওয়ে রক্ষণাবেক্ষণ', en: 'Maintenance of 50+ e-services and digital payment gateways' },
      { bn: 'ইন্টারেক্টিভ জিআইএস ম্যাপ ও অভিযোগ ট্র্যাকিং সিস্টেম', en: 'Interactive GIS City Map and live complaint tracking' },
      { bn: 'তথ্য নিরাপত্তা ও QR ক্রিপ্টোগ্রাফিক সনদ যাচাই সিস্টেম', en: 'Information security and QR cryptographic verification' },
    ],
    hotline: '+880-2-223383560',
    officeFloor: { bn: 'নগর ভবন, লেভেল-১০ (আইসিটি সেল)', en: 'Nagar Bhaban, Level 10 (ICT Cell)' },
  },
];

export const DEPARTMENT_OFFICIALS: PersonProfile[] = [
  {
    id: 'off-eng-1',
    name: { bn: 'প্রকৌ. আশিকুর রহমান', en: 'Engr. Ashiqur Rahman' },
    designation: { bn: 'প্রধান প্রকৌশলী', en: 'Chief Engineer' },
    badgeText: { bn: 'প্রকৌশল বিভাগ · নগর ভবন', en: 'Engineering · Nagar Bhaban' },
    departmentId: 'engineering',
    phone: '+880-2-223383511',
    email: 'ce@dscc.smartcity.gov.bd',
    officeHours: { bn: 'রবি – বৃহঃ, সকাল ৯:০০ – বিকাল ৫:০০', en: 'Sun – Thu, 9:00 AM – 5:00 PM' },
  },
  {
    id: 'off-eng-2',
    name: { bn: 'প্রকৌ. তানভীর আহমেদ সিদ্দিকী', en: 'Engr. Tanvir Ahmed Siddiqui' },
    designation: { bn: 'তত্ত্বাবধায়ক প্রকৌশলী (ড্রেনেজ ও সড়ক)', en: 'Superintending Engineer (Drainage & Roads)' },
    badgeText: { bn: 'প্রকৌশল বিভাগ · সার্কেল-১', en: 'Engineering · Circle 1' },
    departmentId: 'engineering',
    phone: '+880-2-223383512',
    email: 'se.drainage@dscc.smartcity.gov.bd',
    officeHours: { bn: 'রবি – বৃহঃ, সকাল ৯:০০ – বিকাল ৫:০০', en: 'Sun – Thu, 9:00 AM – 5:00 PM' },
  },
  {
    id: 'off-rev-1',
    name: { bn: 'আরিফুল হক (উপসচিব)', en: 'Ariful Haque (Deputy Secretary)' },
    designation: { bn: 'প্রধান রাজস্ব কর্মকর্তা', en: 'Chief Revenue Officer' },
    badgeText: { bn: 'রাজস্ব বিভাগ · নগর ভবন', en: 'Revenue · Nagar Bhaban' },
    departmentId: 'revenue',
    phone: '+880-2-223383521',
    email: 'cro@dscc.smartcity.gov.bd',
    officeHours: { bn: 'রবি – বৃহঃ, সকাল ৯:০০ – বিকাল ৫:০০', en: 'Sun – Thu, 9:00 AM – 5:00 PM' },
  },
  {
    id: 'off-rev-2',
    name: { bn: 'সাবিনা ইয়াসমিন', en: 'Sabina Yasmin' },
    designation: { bn: 'উপ-প্রধান রাজস্ব কর্মকর্তা (কর মূল্যায়ন)', en: 'Deputy Chief Revenue Officer (Assessment)' },
    badgeText: { bn: 'রাজস্ব বিভাগ · কর শাখা', en: 'Revenue · Tax Assessment' },
    departmentId: 'revenue',
    phone: '+880-2-223383522',
    email: 'dcro.tax@dscc.smartcity.gov.bd',
    officeHours: { bn: 'রবি – বৃহঃ, সকাল ৯:০০ – বিকাল ৫:০০', en: 'Sun – Thu, 9:00 AM – 5:00 PM' },
  },
  {
    id: 'off-con-1',
    name: { bn: 'কর্নেল মোঃ নাসির উদ্দিন', en: 'Col. Md. Nasir Uddin' },
    designation: { bn: 'প্রধান বর্জ্য ব্যবস্থাপনা কর্মকর্তা', en: 'Chief Waste Management Officer' },
    badgeText: { bn: 'বর্জ্য ব্যবস্থাপনা · নগর ভবন', en: 'Conservancy · Nagar Bhaban' },
    departmentId: 'conservancy',
    phone: '+880-2-223383531',
    email: 'cwmo@dscc.smartcity.gov.bd',
    officeHours: { bn: 'রবি – বৃহঃ, সকাল ৯:০০ – বিকাল ৫:০০', en: 'Sun – Thu, 9:00 AM – 5:00 PM' },
  },
  {
    id: 'off-con-2',
    name: { bn: 'মোঃ সাইফুল ইসলাম', en: 'Md. Saiful Islam' },
    designation: { bn: 'সহকারী প্রধান বর্জ্য ব্যবস্থাপনা কর্মকর্তা', en: 'Asst. Chief Waste Management Officer' },
    badgeText: { bn: 'বর্জ্য ব্যবস্থাপনা · STS অপারেশনস', en: 'Conservancy · STS Operations' },
    departmentId: 'conservancy',
    phone: '+880-2-223383532',
    email: 'sts.ops@dscc.smartcity.gov.bd',
    officeHours: { bn: 'রবি – বৃহঃ, সকাল ৯:০০ – বিকাল ৫:০০', en: 'Sun – Thu, 9:00 AM – 5:00 PM' },
  },
  {
    id: 'off-hlth-1',
    name: { bn: 'ডা. ফজলে শামসুল কবির', en: 'Dr. Fazle Shamsul Kabir' },
    designation: { bn: 'প্রধান স্বাস্থ্য কর্মকর্তা', en: 'Chief Health Officer' },
    badgeText: { bn: 'স্বাস্থ্য বিভাগ · নগর ভবন', en: 'Public Health · Nagar Bhaban' },
    departmentId: 'health',
    phone: '+880-2-223383541',
    email: 'cho@dscc.smartcity.gov.bd',
    officeHours: { bn: 'রবি – বৃহঃ, সকাল ৯:০০ – বিকাল ৫:০০', en: 'Sun – Thu, 9:00 AM – 5:00 PM' },
  },
  {
    id: 'off-hlth-2',
    name: { bn: 'ডা. নিশাত পারভীন', en: 'Dr. Nishat Parveen' },
    designation: { bn: 'উপ-প্রধান স্বাস্থ্য কর্মকর্তা (মশক নিধন)', en: 'Deputy Chief Health Officer (Vector Control)' },
    badgeText: { bn: 'স্বাস্থ্য বিভাগ · ডেঙ্গু নিয়ন্ত্রণ সেল', en: 'Public Health · Dengue Control Cell' },
    departmentId: 'health',
    phone: '+880-2-223383542',
    email: 'vector.control@dscc.smartcity.gov.bd',
    officeHours: { bn: 'রবি – বৃহঃ, সকাল ৯:০০ – বিকাল ৫:০০', en: 'Sun – Thu, 9:00 AM – 5:00 PM' },
  },
  {
    id: 'off-lic-1',
    name: { bn: 'মাহমুদুল হাসান চৌধুরী', en: 'Mahmudul Hasan Chowdhury' },
    designation: { bn: 'উপ-প্রধান রাজস্ব কর্মকর্তা (লাইসেন্স)', en: 'Deputy Chief Revenue Officer (Licensing)' },
    badgeText: { bn: 'লাইসেন্স শাখা · ই-ট্রেড উইং', en: 'License · E-Trade Wing' },
    departmentId: 'license',
    phone: '+880-2-223383526',
    email: 'license@dscc.smartcity.gov.bd',
    officeHours: { bn: 'রবি – বৃহঃ, সকাল ৯:০০ – বিকাল ৫:০০', en: 'Sun – Thu, 9:00 AM – 5:00 PM' },
  },
  {
    id: 'off-bd-1',
    name: { bn: 'রোকেয়া সুলতানা', en: 'Rokeya Sultana' },
    designation: { bn: 'কেন্দ্রীয় নিবন্ধক (জন্ম ও মৃত্যু)', en: 'Central Registrar (Birth & Death)' },
    badgeText: { bn: 'জন্ম ও মৃত্যু নিবন্ধন · কেন্দ্রীয় শাখা', en: 'Birth & Death · Central Desk' },
    departmentId: 'birth_death',
    phone: '+880-2-223383546',
    email: 'registrar@dscc.smartcity.gov.bd',
    officeHours: { bn: 'রবি – বৃহঃ, সকাল ৯:০০ – বিকাল ৫:০০', en: 'Sun – Thu, 9:00 AM – 5:00 PM' },
  },
  {
    id: 'off-it-1',
    name: { bn: 'মোঃ রাকিবুল ইসলাম', en: 'Md. Rakibul Islam' },
    designation: { bn: 'সিস্টেম অ্যানালিস্ট ও প্রধান (স্মার্ট সিটি সেল)', en: 'System Analyst & Head (Smart City Cell)' },
    badgeText: { bn: 'আইটি ও স্মার্ট সিটি · লেভেল-১০', en: 'IT / Smart City · Level 10' },
    departmentId: 'it_smart',
    phone: '+880-2-223383561',
    email: 'ict.head@dscc.smartcity.gov.bd',
    officeHours: { bn: 'রবি – বৃহঃ, সকাল ৯:০০ – বিকাল ৫:০০', en: 'Sun – Thu, 9:00 AM – 5:00 PM' },
  },
  {
    id: 'off-it-2',
    name: { bn: 'নুসরাত ফারিয়া আলম', en: 'Nusrat Faria Alam' },
    designation: { bn: 'সিনিয়র প্রোগ্রামার (জিআইএস ও ই-সেবা)', en: 'Senior Programmer (GIS & E-Services)' },
    badgeText: { bn: 'আইটি ও স্মার্ট সিটি · জিআইএস ল্যাব', en: 'IT / Smart City · GIS Lab' },
    departmentId: 'it_smart',
    phone: '+880-2-223383562',
    email: 'gis.support@dscc.smartcity.gov.bd',
    officeHours: { bn: 'রবি – বৃহঃ, সকাল ৯:০০ – বিকাল ৫:০০', en: 'Sun – Thu, 9:00 AM – 5:00 PM' },
  },
];

/* 9. CITIZEN CHARTER DATA                                                    */

export const CITIZEN_CHARTER_ITEMS: CitizenCharterItem[] = [
  {
    id: 'cc-birth',
    departmentId: 'birth_death',
    departmentName: { bn: 'জন্ম ও মৃত্যু নিবন্ধন', en: 'Birth & Death' },
    serviceName: { bn: 'অনলাইন জন্ম নিবন্ধন সনদ (৪৫ দিনের মধ্যে)', en: 'Online Birth Registration Certificate (Within 45 Days)' },
    requiredDocs: {
      bn: 'হাসপাতাল ছাড়পত্র/ইপিআই টিকা কার্ড, পিতা-মাতার এনআইডি ও হোল্ডিং ট্যাক্স রসিদ',
      en: 'Hospital discharge/EPI vaccine card, Parents’ NID, Holding tax receipt',
    },
    fee: { bn: '৳০ (বিনামূল্যে)', en: '৳0 (Free)' },
    processingTime: { bn: '৩ কর্মদিবস', en: '3 Working Days' },
    responsibleOfficer: { bn: 'সহকারী স্বাস্থ্য কর্মকর্তা / আঞ্চলিক নিবন্ধক', en: 'Asst. Health Officer / Zonal Registrar' },
    applyHref: '/dashboard/citizen?tab=certificates',
  },
  {
    id: 'cc-citizen',
    departmentId: 'birth_death',
    departmentName: { bn: 'জন্ম ও মৃত্যু নিবন্ধন', en: 'Birth & Death' },
    serviceName: { bn: 'ডিজিটাল নাগরিকত্ব ও চারিত্রিক সনদ', en: 'Digital Citizenship & Character Certificate' },
    requiredDocs: {
      bn: 'জাতীয় পরিচয়পত্র (NID) / জন্ম সনদ, পাসপোর্ট সাইজ ছবি, হালনাগাদ হোল্ডিং ট্যাক্স কপি',
      en: 'NID / Birth Certificate, Passport photo, Updated holding tax copy',
    },
    fee: { bn: '৳১০০', en: '৳100' },
    processingTime: { bn: '২ কর্মদিবস', en: '2 Working Days' },
    responsibleOfficer: { bn: 'সংশ্লিষ্ট ওয়ার্ড সচিব ও কাউন্সিলর', en: 'Ward Secretary & Councillor' },
    applyHref: '/dashboard/citizen?tab=certificates',
  },
  {
    id: 'cc-tl-new',
    departmentId: 'license',
    departmentName: { bn: 'লাইসেন্স শাখা', en: 'License' },
    serviceName: { bn: 'নতুন ই-ট্রেড লাইসেন্স ইস্যু', en: 'New E-Trade License Issuance' },
    requiredDocs: {
      bn: 'এনআইডি, দোকান/অফিস ভাড়ার চুক্তিপত্র বা দলিল, ছবি, টিআইএন (প্রযোজ্য ক্ষেত্রে)',
      en: 'NID, Commercial lease/deed, Photo, TIN certificate (if applicable)',
    },
    fee: { bn: '৳৩,২০০ – ৳৫,৫০০ (+১৫% ভ্যাট)', en: '৳3,200 – ৳5,500 (+15% VAT)' },
    processingTime: { bn: '৩ কর্মদিবস', en: '3 Working Days' },
    responsibleOfficer: { bn: 'উপ-প্রধান রাজস্ব কর্মকর্তা (লাইসেন্স)', en: 'Deputy Chief Revenue Officer (License)' },
    applyHref: '/dashboard/citizen?tab=tradeLicense',
  },
  {
    id: 'cc-tl-renew',
    departmentId: 'license',
    departmentName: { bn: 'লাইসেন্স শাখা', en: 'License' },
    serviceName: { bn: 'ই-ট্রেড লাইসেন্স বার্ষিক নবায়ন', en: 'E-Trade License Annual Renewal' },
    requiredDocs: {
      bn: 'পূর্ববর্তী ট্রেড লাইসেন্স নম্বর ও অনলাইন ফি পরিশোধ রসিদ',
      en: 'Previous Trade License ID and online fee payment receipt',
    },
    fee: { bn: 'ব্যবসার ধরন অনুযায়ী নির্ধারিত', en: 'As per business schedule' },
    processingTime: { bn: 'তাৎক্ষণিক (২৪ ঘণ্টা)', en: 'Instant (Within 24 Hours)' },
    responsibleOfficer: { bn: 'লাইসেন্স সুপারভাইজার (সংশ্লিষ্ট জোন)', en: 'License Supervisor (Respective Zone)' },
    applyHref: '/dashboard/citizen?tab=tradeLicense',
  },
  {
    id: 'cc-holding-tax',
    departmentId: 'revenue',
    departmentName: { bn: 'রাজস্ব বিভাগ', en: 'Revenue' },
    serviceName: { bn: 'অনলাইন হোল্ডিং ট্যাক্স পরিশোধ ও কর ছাড়পত্র', en: 'Online Holding Tax Payment & Clearance' },
    requiredDocs: {
      bn: 'হোল্ডিং নম্বর ও ওয়ার্ড নম্বর (অনলাইন পরিশোধে ১০% রিবেট প্রযোজ্য)',
      en: 'Holding number & Ward number (10% rebate on online payment)',
    },
    fee: { bn: 'মূল্যায়নকৃত বার্ষিক কর', en: 'Per annual property valuation' },
    processingTime: { bn: 'তাৎক্ষণিক ডিজিটাল রসিদ', en: 'Instant Digital Receipt' },
    responsibleOfficer: { bn: 'কর কর্মকর্তা (আঞ্চলিক রাজস্ব সার্কেল)', en: 'Tax Officer (Zonal Revenue Circle)' },
    applyHref: '/tax-calculator',
  },
  {
    id: 'cc-road-dig',
    departmentId: 'engineering',
    departmentName: { bn: 'প্রকৌশল বিভাগ', en: 'Engineering' },
    serviceName: { bn: 'রাস্তা খনন ও ইউটিলিটি সংযোগ অনুমতি (NOC)', en: 'Road Excavation & Utility Permit (NOC)' },
    requiredDocs: {
      bn: 'আবেদনপত্র, সড়কের মাপ ও নকশা, ইউটিলিটি সংস্থার চাহিদাপত্র ও পুনঃনির্মাণ জামানত',
      en: 'Application, site sketch, utility agency demand note & reinstatement fee',
    },
    fee: { bn: '৳৫,০০০ থেকে (দৈর্ঘ্য ও সারফেস ভেদে)', en: 'From ৳5,000 (by length & surface)' },
    processingTime: { bn: '৫ কর্মদিবস', en: '5 Working Days' },
    responsibleOfficer: { bn: 'নির্বাহী প্রকৌশলী (সংশ্লিষ্ট জোন)', en: 'Executive Engineer (Respective Zone)' },
    applyHref: '/dashboard/citizen?tab=roadDigging',
  },
  {
    id: 'cc-facility',
    departmentId: 'health',
    departmentName: { bn: 'স্বাস্থ্য ও সম্পত্তি', en: 'Health & Estate' },
    serviceName: { bn: 'কমিউনিটি সেন্টার ও পৌর কবরস্থান স্লট বুকিং', en: 'Community Center & Municipal Cemetery Booking' },
    requiredDocs: {
      bn: 'আবেদনকারীর এনআইডি ও নির্ধারিত তারিখের প্রাপ্যতা নিশ্চিতকরণ',
      en: 'Applicant NID and slot availability confirmation',
    },
    fee: { bn: '৳১,৫০০ – ৳১২,০০০', en: '৳1,500 – ৳12,000' },
    processingTime: { bn: 'তাৎক্ষণিক অনলাইন কনফার্মেশন', en: 'Instant Online Confirmation' },
    responsibleOfficer: { bn: 'আঞ্চলিক নির্বাহী কর্মকর্তা', en: 'Zonal Executive Officer' },
    applyHref: '/dashboard/citizen?tab=facilityBooking',
  },
  {
    id: 'cc-complaint',
    departmentId: 'conservancy',
    departmentName: { bn: 'বর্জ্য ও প্রকৌশল', en: 'Conservancy & Eng.' },
    serviceName: { bn: 'সড়কবাতি, ড্রেন পরিষ্কার ও বর্জ্য অপসারণ অভিযোগ', en: 'Streetlight, Drain Cleaning & Waste Complaint' },
    requiredDocs: {
      bn: 'সমস্যার ছবি ও জিপিএস লোকেশন পিন (অনলাইন অভিযোগ পোর্টাল)',
      en: 'Street photo and GPS pin via Online Complaint Portal',
    },
    fee: { bn: '৳০ (বিনামূল্যে)', en: '৳0 (Free)' },
    processingTime: { bn: '২৪ – ৪৮ ঘণ্টা (SLA)', en: '24 – 48 Hours (SLA)' },
    responsibleOfficer: { bn: 'সহকারী প্রকৌশলী / বর্জ্য পরিদর্শক', en: 'Asst. Engineer / Conservancy Inspector' },
    applyHref: '/complaints?tab=submit',
  },
];

/* 10. OFFICE LOCATIONS DATA                                                  */

export const HEADQUARTERS_OFFICE = {
  title: { bn: 'নগর ভবন (প্রধান কার্যালয়)', en: 'Nagar Bhaban (Headquarters)' },
  subtitle: {
    bn: 'ঢাকা স্মার্ট সিটি কর্পোরেশন — কেন্দ্রীয় প্রশাসনিক সদর দপ্তর',
    en: 'Dhaka Smart City Corporation — Central Administrative Headquarters',
  },
  address: {
    bn: 'নগর ভবন, ৫ ফিনিক্স রোড, ফুলবাড়িয়া, ঢাকা-১০০০, বাংলাদেশ',
    en: 'Nagar Bhaban, 5 Phoenix Road, Fulbaria, Dhaka-1000, Bangladesh',
  },
  hours: {
    bn: 'রবিবার – বৃহস্পতিবার: সকাল ৯:০০টা – বিকাল ৫:০০টা (শুক্র ও শনিবার সাপ্তাহিক ছুটি)',
    en: 'Sunday – Thursday: 9:00 AM – 5:00 PM (Closed Friday & Saturday)',
  },
  helpline: '16106',
  phone: '+880-2-223383500',
  email: 'info@dscc.smartcity.gov.bd',
  lat: 23.7244,
  lng: 90.4071,
};

export const ZONAL_OFFICES: ZonalOfficeItem[] = [
  {
    id: 'zone-1',
    zoneNumber: 1,
    title: { bn: 'আঞ্চলিক কার্যালয় — জোন ১ (ধানমন্ডি)', en: 'Zonal Office — Zone 1 (Dhanmondi)' },
    wardsCovered: { bn: 'ওয়ার্ড ১৫, ১৬, ১৭, ১৮, ১৯, ২০, ২১ ও ২৭', en: 'Wards 15, 16, 17, 18, 19, 20, 21 & 27' },
    address: {
      bn: 'হাউজ-২৪, রোড-২, ধানমন্ডি আবাসিক এলাকা, ঢাকা-১২০৫',
      en: 'House 24, Road 2, Dhanmondi Residential Area, Dhaka-1205',
    },
    executiveOfficer: { bn: 'মোঃ তৌহিদুল ইসলাম (উপসচিব)', en: 'Md. Towhidul Islam (Deputy Secretary)' },
    phone: '+880-2-223361001',
    email: 'zone1@dscc.smartcity.gov.bd',
    hours: { bn: 'রবি – বৃহঃ, সকাল ৯:০০ – বিকাল ৫:০০', en: 'Sun – Thu, 9:00 AM – 5:00 PM' },
    lat: 23.7461,
    lng: 90.3742,
  },
  {
    id: 'zone-2',
    zoneNumber: 2,
    title: { bn: 'আঞ্চলিক কার্যালয় — জোন ২ (মতিঝিল ও খিলগাঁও)', en: 'Zonal Office — Zone 2 (Motijheel & Khilgaon)' },
    wardsCovered: { bn: 'ওয়ার্ড ১–১৩ ও ৩৬ (মতিঝিল, শাহজাহানপুর, খিলগাঁও)', en: 'Wards 1–13 & 36 (Motijheel, Shahjahanpur, Khilgaon)' },
    address: {
      bn: 'খিলগাঁও কমিউনিটি সেন্টার কমপ্লেক্স, শাহজাহানপুর, ঢাকা-১২১৭',
      en: 'Khilgaon Community Center Complex, Shahjahanpur, Dhaka-1217',
    },
    executiveOfficer: { bn: 'শামীমা আক্তার জাহান', en: 'Shamima Akter Jahan' },
    phone: '+880-2-223361002',
    email: 'zone2@dscc.smartcity.gov.bd',
    hours: { bn: 'রবি – বৃহঃ, সকাল ৯:০০ – বিকাল ৫:০০', en: 'Sun – Thu, 9:00 AM – 5:00 PM' },
    lat: 23.733,
    lng: 90.4172,
  },
  {
    id: 'zone-3',
    zoneNumber: 3,
    title: { bn: 'আঞ্চলিক কার্যালয় — জোন ৩ (লালবাগ ও আজিমপুর)', en: 'Zonal Office — Zone 3 (Lalbagh & Azimpur)' },
    wardsCovered: { bn: 'ওয়ার্ড ২২–২৯ ও ৫৫–৫৭ (লালবাগ, হাজারীবাগ, আজিমপুর)', en: 'Wards 22–29 & 55–57 (Lalbagh, Hazaribagh, Azimpur)' },
    address: {
      bn: 'আজিমপুর কমিউনিটি সেন্টার ভবন, আজিমপুর রোড, ঢাকা-১২০৫',
      en: 'Azimpur Community Center Building, Azimpur Road, Dhaka-1205',
    },
    executiveOfficer: { bn: 'মোঃ জহিরুল ইসলাম', en: 'Md. Zahirul Islam' },
    phone: '+880-2-223361003',
    email: 'zone3@dscc.smartcity.gov.bd',
    hours: { bn: 'রবি – বৃহঃ, সকাল ৯:০০ – বিকাল ৫:০০', en: 'Sun – Thu, 9:00 AM – 5:00 PM' },
    lat: 23.7267,
    lng: 90.3863,
  },
  {
    id: 'zone-4',
    zoneNumber: 4,
    title: { bn: 'আঞ্চলিক কার্যালয় — জোন ৪ (গুলশান ও বনানী)', en: 'Zonal Office — Zone 4 (Gulshan & Banani)' },
    wardsCovered: { bn: 'ওয়ার্ড ১৮, ১৯, ২০ ও ২১ (গুলশান, বনানী, বারিধারা)', en: 'Wards 18, 19, 20 & 21 (Gulshan, Banani, Baridhara)' },
    address: {
      bn: 'গুলশান সেন্টার পয়েন্ট সংলগ্ন, রোড-৯০, গুলশান-২, ঢাকা-১২১২',
      en: 'Adjacent to Gulshan Center Point, Road 90, Gulshan-2, Dhaka-1212',
    },
    executiveOfficer: { bn: 'মোঃ রেজাউল করিম', en: 'Md. Rezaul Karim' },
    phone: '+880-2-223361004',
    email: 'zone4@dscc.smartcity.gov.bd',
    hours: { bn: 'রবি – বৃহঃ, সকাল ৯:০০ – বিকাল ৫:০০', en: 'Sun – Thu, 9:00 AM – 5:00 PM' },
    lat: 23.7937,
    lng: 90.4066,
  },
  {
    id: 'zone-5',
    zoneNumber: 5,
    title: { bn: 'আঞ্চলিক কার্যালয় — জোন ৫ (মিরপুর ও উত্তরা)', en: 'Zonal Office — Zone 5 (Mirpur & Uttara)' },
    wardsCovered: { bn: 'ওয়ার্ড ১–১৪ (মিরপুর, পল্লবী ও উত্তরা মডেল টাউন)', en: 'Wards 1–14 (Mirpur, Pallabi & Uttara Model Town)' },
    address: {
      bn: 'মিরপুর-১০ পৌর অডিটোরিয়াম কমপ্লেক্স, বেগম রোকেয়া সরণি, ঢাকা-১২১৬',
      en: 'Mirpur-10 Municipal Auditorium Complex, Begum Rokeya Ave, Dhaka-1216',
    },
    executiveOfficer: { bn: 'নাজমুল হুদা শামীম', en: 'Nazmul Huda Shamim' },
    phone: '+880-2-223361005',
    email: 'zone5@dscc.smartcity.gov.bd',
    hours: { bn: 'রবি – বৃহঃ, সকাল ৯:০০ – বিকাল ৫:০০', en: 'Sun – Thu, 9:00 AM – 5:00 PM' },
    lat: 23.8069,
    lng: 90.3687,
  },
];

/* 11. CONTACT DIRECTORY & EMERGENCY HELPLINES DATA                           */

export const EMERGENCY_HELPLINES: EmergencyHelplineItem[] = [
  {
    id: '999',
    code: '999',
    title: { bn: 'জাতীয় জরুরি সেবা', en: 'National Emergency' },
    description: { bn: 'পুলিশ, ফায়ার সার্ভিস ও অ্যাম্বুলেন্স', en: 'Police, Fire Service & Ambulance' },
    availability: { bn: '২৪/৭ টোল-ফ্রি', en: '24/7 Toll-Free' },
    accent: 'crimson',
  },
  {
    id: '333',
    code: '333',
    title: { bn: 'সরকারি তথ্য ও সেবা', en: 'National Info Desk' },
    description: { bn: 'সরকারি সেবা ও সামাজিক সমস্যা প্রতিকার', en: 'Government Services & Civic Help' },
    availability: { bn: '২৪/৭ সক্রিয়', en: '24/7 Active' },
    accent: 'green',
  },
  {
    id: '16106',
    code: '16106',
    title: { bn: 'সিটি কর্পোরেশন হটলাইন', en: 'City Corp. Hotline' },
    description: { bn: 'অভিযোগ, বর্জ্য, সড়কবাতি ও কর সহায়তা', en: 'Complaints, Waste, Lights & Tax Help' },
    availability: { bn: '২৪/৭ কন্ট্রোল রুম', en: '24/7 Control Room' },
    accent: 'green',
  },
  {
    id: 'dengue',
    code: '01709-900888',
    title: { bn: 'ডেঙ্গু কন্ট্রোল রুম', en: 'Dengue Control Room' },
    description: { bn: 'জরুরি ফগিং ও লার্ভিসাইডিং টিম প্রেরণ', en: 'Rapid Fogging & Larviciding Dispatch' },
    availability: { bn: 'সকাল ৮টা – রাত ১০টা', en: '8:00 AM – 10:00 PM' },
    accent: 'crimson',
  },
  {
    id: 'fire',
    code: '16163',
    title: { bn: 'ফায়ার সার্ভিস হটলাইন', en: 'Fire Service Hotline' },
    description: { bn: 'অগ্নিনির্বাপণ ও জরুরি উদ্ধার তৎপরতা', en: 'Firefighting & Emergency Rescue' },
    availability: { bn: '২৪/৭ জরুরি সাড়া', en: '24/7 Rapid Response' },
    accent: 'crimson',
  },
];

export const OFFICIAL_CONTACTS_LIST: OfficialContactItem[] = [
  {
    id: 'cnt-hq',
    officeName: { bn: 'মেয়র / প্রশাসকের দপ্তর (সচিবালয়)', en: 'Office of the Mayor / Administrator' },
    category: 'headquarters',
    categoryLabel: { bn: 'নগর ভবন (প্রধান)', en: 'Headquarters' },
    officerTitle: { bn: 'একান্ত সচিব', en: 'Private Secretary' },
    phone: '+880-2-223383501',
    email: 'mayor.office@dscc.smartcity.gov.bd',
    roomOrFloor: { bn: 'নগর ভবন, লেভেল-৩', en: 'Nagar Bhaban, Level 3' },
  },
  {
    id: 'cnt-ceo',
    officeName: { bn: 'প্রধান নির্বাহী কর্মকর্তার (CEO) দপ্তর', en: 'Chief Executive Officer (CEO) Secretariat' },
    category: 'headquarters',
    categoryLabel: { bn: 'নগর ভবন (প্রধান)', en: 'Headquarters' },
    officerTitle: { bn: 'স্টাফ অফিসার (CEO)', en: 'Staff Officer to CEO' },
    phone: '+880-2-223383505',
    email: 'ceo@dscc.smartcity.gov.bd',
    roomOrFloor: { bn: 'নগর ভবন, লেভেল-৪', en: 'Nagar Bhaban, Level 4' },
  },
  {
    id: 'cnt-rev',
    officeName: { bn: 'হোল্ডিং ট্যাক্স ও ই-ট্রেড লাইসেন্স হেল্পডেস্ক', en: 'Holding Tax & E-Trade License Helpdesk' },
    category: 'revenue',
    categoryLabel: { bn: 'রাজস্ব ও লাইসেন্স', en: 'Revenue & License' },
    officerTitle: { bn: 'প্রধান রাজস্ব কর্মকর্তার দপ্তর', en: 'Chief Revenue Officer Desk' },
    phone: '+880-2-223383520',
    email: 'revenue.help@dscc.smartcity.gov.bd',
    roomOrFloor: { bn: 'নগর ভবন, লেভেল-৫', en: 'Nagar Bhaban, Level 5' },
  },
  {
    id: 'cnt-eng',
    officeName: { bn: 'সড়ক, ড্রেনেজ ও সড়কবাতি কন্ট্রোল ডেস্ক', en: 'Roads, Drainage & Streetlight Control Desk' },
    category: 'engineering',
    categoryLabel: { bn: 'প্রকৌশল ও বর্জ্য', en: 'Engineering & Waste' },
    officerTitle: { bn: 'কেন্দ্রীয় প্রকৌশল কন্ট্রোল রুম', en: 'Central Engineering Control' },
    phone: '+880-2-223383510',
    email: 'engineering@dscc.smartcity.gov.bd',
    roomOrFloor: { bn: 'নগর ভবন, লেভেল-৭', en: 'Nagar Bhaban, Level 7' },
  },
  {
    id: 'cnt-health',
    officeName: { bn: 'জনস্বাস্থ্য, জন্ম নিবন্ধন ও মশক নিধন ডেস্ক', en: 'Public Health, Vital Registration & Fogging Desk' },
    category: 'health',
    categoryLabel: { bn: 'স্বাস্থ্য ও নিবন্ধন', en: 'Health & Registration' },
    officerTitle: { bn: 'প্রধান স্বাস্থ্য কর্মকর্তার দপ্তর', en: 'Chief Health Officer Desk' },
    phone: '+880-2-223383540',
    email: 'health@dscc.smartcity.gov.bd',
    roomOrFloor: { bn: 'নগর ভবন, লেভেল-৬', en: 'Nagar Bhaban, Level 6' },
  },
  {
    id: 'cnt-z1',
    officeName: { bn: 'আঞ্চলিক কার্যালয় জোন-১ (ধানমন্ডি)', en: 'Zonal Office Zone-1 (Dhanmondi)' },
    category: 'zonal',
    categoryLabel: { bn: 'আঞ্চলিক কার্যালয়', en: 'Zonal Office' },
    officerTitle: { bn: 'আঞ্চলিক নির্বাহী কর্মকর্তা', en: 'Zonal Executive Officer' },
    phone: '+880-2-223361001',
    email: 'zone1@dscc.smartcity.gov.bd',
    roomOrFloor: { bn: 'ধানমন্ডি রোড-২, ঢাকা', en: 'Dhanmondi Road 2, Dhaka' },
  },
  {
    id: 'cnt-z4',
    officeName: { bn: 'আঞ্চলিক কার্যালয় জোন-৪ (গুলশান-বনানী)', en: 'Zonal Office Zone-4 (Gulshan-Banani)' },
    category: 'zonal',
    categoryLabel: { bn: 'আঞ্চলিক কার্যালয়', en: 'Zonal Office' },
    officerTitle: { bn: 'আঞ্চলিক নির্বাহী কর্মকর্তা', en: 'Zonal Executive Officer' },
    phone: '+880-2-223361004',
    email: 'zone4@dscc.smartcity.gov.bd',
    roomOrFloor: { bn: 'গুলশান-২, রোড-৯০, ঢাকা', en: 'Gulshan-2, Road 90, Dhaka' },
  },
  {
    id: 'cnt-z5',
    officeName: { bn: 'আঞ্চলিক কার্যালয় জোন-৫ (মিরপুর-উত্তরা)', en: 'Zonal Office Zone-5 (Mirpur-Uttara)' },
    category: 'zonal',
    categoryLabel: { bn: 'আঞ্চলিক কার্যালয়', en: 'Zonal Office' },
    officerTitle: { bn: 'আঞ্চলিক নির্বাহী কর্মকর্তা', en: 'Zonal Executive Officer' },
    phone: '+880-2-223361005',
    email: 'zone5@dscc.smartcity.gov.bd',
    roomOrFloor: { bn: 'মিরপুর-১০ অডিটোরিয়াম কমপ্লেক্স', en: 'Mirpur-10 Auditorium Complex' },
  },
];
