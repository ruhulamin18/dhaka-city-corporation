import { Language } from '@/types';

export interface TranslationDictionary {
  brandName: string;
  brandShort: string;
  nav: {
    services: string;
    complaints: string;
    cityMap: string;
    transparency: string;
    verifyQr: string;
    citizenPortal: string;
    officerDesk: string;
    staffPortal: string;
    adminPortal: string;
  };
  accessibility: {
    highContrast: string;
    fontSize: string;
    demoRole: string;
    roles: {
      public: string;
      citizen: string;
      officer: string;
      staff: string;
      admin: string;
    };
  };
  hero: {
    kicker: string;
    headline: string;
    subheadline: string;
    searchPlaceholder: string;
    searchButton: string;
    primaryCta: string;
    secondaryCta: string;
    stats: {
      eservicesLabel: string;
      eservicesValue: string;
      resolvedLabel: string;
      resolvedValue: string;
      certificatesLabel: string;
      certificatesValue: string;
      responseLabel: string;
      responseValue: string;
    };
  };
  quickServices: {
    title: string;
    subtitle: string;
    applyNow: string;
    items: {
      tradeLicense: { title: string; desc: string; meta: string };
      holdingTax: { title: string; desc: string; meta: string };
      facilityBooking: { title: string; desc: string; meta: string };
      certificates: { title: string; desc: string; meta: string };
      smartComplaint: { title: string; desc: string; meta: string };
      roadDigging: { title: string; desc: string; meta: string };
    };
  };
  notices: {
    title: string;
    subtitle: string;
    searchPlaceholder: string;
    allCategories: string;
    urgent: string;
    categories: {
      revenue: string;
      tender: string;
      public_health: string;
      infrastructure: string;
      general: string;
    };
    empty: string;
    readDetails: string;
    close: string;
  };
  wardDirectory: {
    title: string;
    subtitle: string;
    selectWard: string;
    councillor: string;
    emergency: string;
    wasteSchedule: string;
    foggingSchedule: string;
    population: string;
    area: string;
    viewOnMap: string;
  };
  citizenPortal: {
    title: string;
    subtitle: string;
    tabs: {
      overview: string;
      tradeLicense: string;
      holdingTax: string;
      certificates: string;
      roadDigging: string;
      facilityBooking: string;
    };
    myApplications: string;
    myBookings: string;
    taxPayments: string;
    viewQrReceipt: string;
    payNow: string;
    submitAndPay: string;
    calculateTax: string;
  };
  verifyPage: {
    title: string;
    subtitle: string;
    inputLabel: string;
    placeholder: string;
    verifyButton: string;
    sampleLabel: string;
    verifiedBadge: string;
    pendingBadge: string;
    notFoundTitle: string;
    notFoundDesc: string;
    fields: {
      referenceId: string;
      docType: string;
      owner: string;
      ward: string;
      issuedAt: string;
      authority: string;
      amountPaid: string;
      hash: string;
    };
  };
  complaintsPage: {
    title: string;
    subtitle: string;
    submitTab: string;
    trackTab: string;
    autoRouteLabel: string;
    trackingPlaceholder: string;
    trackButton: string;
    submitButton: string;
    steps: {
      pending: string;
      assigned: string;
      in_progress: string;
      resolved: string;
    };
    categories: {
      road_damage: string;
      drainage: string;
      waste: string;
      street_light: string;
      mosquito: string;
    };
  };
  cityMapPage: {
    title: string;
    subtitle: string;
    layersTitle: string;
    allWards: string;
    layers: {
      hospital: string;
      public_toilet: string;
      park: string;
      waste_point: string;
      road_digging: string;
      complaint: string;
    };
    reportHere: string;
  };
  transparencyPage: {
    title: string;
    subtitle: string;
    totalBudget: string;
    utilizedBudget: string;
    activeProjects: string;
    completedRate: string;
    wardChartTitle: string;
    sectorChartTitle: string;
    projectsTitle: string;
  };
  assistant: {
    title: string;
    subtitle: string;
    placeholder: string;
    greeting: string;
    suggestions: string[];
  };
  common: {
    ward: string;
    bdt: string;
    status: string;
    date: string;
    actions: string;
    printPdf: string;
    close: string;
    loading: string;
    approved: string;
    under_review: string;
    pending: string;
    rejected: string;
    confirmed: string;
    switchRoleHint: string;
  };
  footer: {
    description: string;
    hotlinesTitle: string;
    linksTitle: string;
    copyright: string;
  };
}

export const translations: Record<Language, TranslationDictionary> = {
  en: {
    brandName: 'Dhaka Smart City',
    brandShort: 'DSCC',
    nav: {
      services: 'Services',
      complaints: 'Complaints',
      cityMap: 'City Map',
      transparency: 'Transparency',
      verifyQr: 'Verify QR',
      citizenPortal: 'Citizen Portal',
      officerDesk: 'Officer Desk',
      staffPortal: 'Staff Tasks',
      adminPortal: 'Mayor Admin',
    },
    accessibility: {
      highContrast: 'High Contrast',
      fontSize: 'Text Size',
      demoRole: 'Active Role',
      roles: {
        public: 'Public Visitor',
        citizen: 'Citizen',
        officer: 'Dept. Officer',
        staff: 'Field Staff',
        admin: 'Mayor / Admin',
      },
    },
    hero: {
      kicker: 'Paperless Municipal Governance · Fiscal Year 2026–27',
      headline: 'Fast, transparent digital civic services for every Dhaka resident.',
      subheadline:
        'Apply for trade licenses, calculate and pay holding taxes, book community facilities, report geo-tagged street issues, and verify official QR certificates in seconds.',
      searchPlaceholder: 'Search services, wards, notices, or IDs (e.g. Trade License, Ward 12, Holding Tax)...',
      searchButton: 'Search',
      primaryCta: 'Open Citizen Portal',
      secondaryCta: 'Report Street Issue',
      stats: {
        eservicesLabel: 'Active E-Services',
        eservicesValue: '18',
        resolvedLabel: 'Complaints Resolved',
        resolvedValue: '94.2%',
        certificatesLabel: 'QR Certificates Issued',
        certificatesValue: '142,890',
        responseLabel: 'Avg. Field Dispatch',
        responseValue: '4.5 hrs',
      },
    },
    quickServices: {
      title: 'Quick-Service Hub',
      subtitle: 'Direct 1-click access to end-to-end paperless municipal workflows—no office visits required.',
      applyNow: 'Launch Service',
      items: {
        tradeLicense: {
          title: 'Trade License (New / Renewal)',
          desc: 'Apply online, pay statutory fees via mobile banking, and download a QR-verified digital license.',
          meta: 'Revenue Dept · 24h Review',
        },
        holdingTax: {
          title: 'Holding Tax Calculator & Pay',
          desc: 'Auto-calculate quarterly or annual property assessment by Ward and square footage, then pay instantly.',
          meta: 'Assessment · Instant Receipt',
        },
        facilityBooking: {
          title: 'Community Center & Cemetery',
          desc: 'Check live slot calendars for municipal auditoriums, community halls, and cemetery management.',
          meta: 'Social Welfare · Live Slots',
        },
        certificates: {
          title: 'Birth & Citizen Certificates',
          desc: 'Request official birth registration extracts, character, and residency certificates with QR hash.',
          meta: 'Civil Registry · Verified',
        },
        smartComplaint: {
          title: 'Smart Geo-Tagged Complaint',
          desc: 'Pin broken roads, drainage clogs, or faulty streetlights on the ward map with live tracking ID.',
          meta: 'AI Auto-Routed · Live GPS',
        },
        roadDigging: {
          title: 'Road Digging Permission',
          desc: 'Submit utility excavation requests with automatic restoration deposit calculation and GIS tracking.',
          meta: 'Engineering · GIS Tracked',
        },
      },
    },
    notices: {
      title: 'Dynamic Notice Board',
      subtitle: 'Real-time searchable circulars, e-tenders, and public health directives—no scanned PDFs.',
      searchPlaceholder: 'Filter notices by keyword or reference...',
      allCategories: 'All Notices',
      urgent: 'Urgent',
      categories: {
        revenue: 'Revenue & Tax',
        tender: 'E-Tender',
        public_health: 'Public Health',
        infrastructure: 'Engineering',
        general: 'General',
      },
      empty: 'No notices match your current search filter.',
      readDetails: 'Read Notice',
      close: 'Close',
    },
    wardDirectory: {
      title: 'Interactive Ward Directory',
      subtitle: 'Select a ward to view Councillor contacts, emergency lines, waste pickup, and mosquito fogging schedules.',
      selectWard: 'Select Ward',
      councillor: 'Ward Councillor',
      emergency: 'Ward Emergency Desk',
      wasteSchedule: 'Door-to-Door Waste Collection',
      foggingSchedule: 'Larvicide & Mosquito Fogging',
      population: 'Est. Residents',
      area: 'Jurisdiction Area',
      viewOnMap: 'Inspect on City Map',
    },
    citizenPortal: {
      title: 'Unified Citizen E-Service Portal',
      subtitle: 'Manage applications, calculate holding taxes, reserve municipal facilities, and download QR-coded certificates.',
      tabs: {
        overview: 'Overview',
        tradeLicense: 'Trade License',
        holdingTax: 'Holding Tax',
        certificates: 'Certificates',
        roadDigging: 'Road Digging',
        facilityBooking: 'Facility Booking',
      },
      myApplications: 'Recent Applications & Certificates',
      myBookings: 'Facility Reservations',
      taxPayments: 'Holding Tax Ledger',
      viewQrReceipt: 'View QR Certificate',
      payNow: 'Pay Now',
      submitAndPay: 'Submit & Proceed to Payment',
      calculateTax: 'Calculate Assessment',
    },
    verifyPage: {
      title: 'Public QR & Document Verification',
      subtitle: 'Verify the authenticity of any Dhaka Smart City digital trade license, tax receipt, or citizen certificate.',
      inputLabel: 'Certificate, License, or Receipt ID',
      placeholder: 'Enter ID (e.g. DSCC-TL-2026-4108)',
      verifyButton: 'Verify Authenticity',
      sampleLabel: 'Try sample verification IDs:',
      verifiedBadge: 'VERIFIED AUTHENTIC',
      pendingBadge: 'PENDING APPROVAL',
      notFoundTitle: 'No Matching Official Record Found',
      notFoundDesc: 'Please verify the reference ID printed beneath the QR code and try again.',
      fields: {
        referenceId: 'Reference ID',
        docType: 'Document Type',
        owner: 'Issued To',
        ward: 'Ward Jurisdiction',
        issuedAt: 'Issue / Payment Date',
        authority: 'Issuing Authority',
        amountPaid: 'Statutory Fee Paid',
        hash: 'Cryptographic Signature',
      },
    },
    complaintsPage: {
      title: 'Smart Geo-Tagged Complaint System',
      subtitle: 'Report municipal issues with exact GPS coordinates, automatic AI department routing, and live resolution proof.',
      submitTab: 'Submit New Complaint',
      trackTab: 'Live Status Tracker',
      autoRouteLabel: 'AI Auto-Routing Assessment',
      trackingPlaceholder: 'Enter Tracking ID (e.g. CMP-2026-8492)',
      trackButton: 'Track Status',
      submitButton: 'Submit Geo-Tagged Report',
      steps: {
        pending: 'Pending Intake',
        assigned: 'Assigned to Staff',
        in_progress: 'Field Work In Progress',
        resolved: 'Resolved & Verified',
      },
      categories: {
        road_damage: 'Road Damage / Pothole',
        drainage: 'Drainage & Waterlogging',
        waste: 'Waste & Garbage Dumping',
        street_light: 'Street Light Outage',
        mosquito: 'Mosquito / Dengue Breeding',
      },
    },
    cityMapPage: {
      title: 'Interactive GIS City Map',
      subtitle: 'Explore municipal hospitals, public toilets, parks, waste transfer stations, active road digging, and live citizen complaints.',
      layersTitle: 'Map Layers',
      allWards: 'All Wards',
      layers: {
        hospital: 'City Hospitals & Clinics',
        public_toilet: 'Smart Public Toilets',
        park: 'Parks & Playgrounds',
        waste_point: 'Waste Collection Stations',
        road_digging: 'Active Road Digging',
        complaint: 'Reported Complaints',
      },
      reportHere: 'Report Issue at This Ward',
    },
    transparencyPage: {
      title: 'Open Budget & Project Tracker',
      subtitle: 'Full public fiscal transparency across all Dhaka Smart City wards—track allocated budgets, utilization, and contractor progress.',
      totalBudget: 'Total FY26-27 Budget',
      utilizedBudget: 'Utilized Expenditure',
      activeProjects: 'Ongoing Projects',
      completedRate: 'Avg. Physical Progress',
      wardChartTitle: 'Ward-Wise Allocation vs. Expenditure (BDT Crore)',
      sectorChartTitle: 'Sectoral Allocation Breakdown',
      projectsTitle: 'Active Municipal Development Projects',
    },
    assistant: {
      title: 'Nagorik AI Assistant',
      subtitle: 'Instant Bangla & English civic guidance',
      placeholder: 'Ask about trade license, tax, or complaints...',
      greeting:
        'Assalamu Alaikum! I am the Dhaka Smart City Assistant. Ask me in English or বাংলা about Trade Licenses, Holding Tax, Complaint Tracking, or Facility Booking.',
      suggestions: [
        'ট্রেড লাইসেন্স করতে কী কী কাগজ লাগে?',
        'How to pay holding tax?',
        'Track my complaint',
        'Book a community center',
      ],
    },
    common: {
      ward: 'Ward',
      bdt: '৳',
      status: 'Status',
      date: 'Date',
      actions: 'Actions',
      printPdf: 'Print / Save PDF',
      close: 'Close',
      loading: 'Loading civic records...',
      approved: 'Approved',
      under_review: 'Under Review',
      pending: 'Pending',
      rejected: 'Rejected',
      confirmed: 'Confirmed',
      switchRoleHint: 'Switch Demo Role in top bar to preview this workspace.',
    },
    footer: {
      description:
        'Dhaka Smart City Corporation (DSCC) Digital Citizen Service Platform — built for transparent, paperless, mobile-first urban governance.',
      hotlinesTitle: 'Emergency & Civic Hotlines',
      linksTitle: 'Platform Modules',
      copyright: '© 2026 Dhaka Smart City Corporation. Digital Citizen Service Platform.',
    },
  },
  bn: {
    brandName: 'ঢাকা স্মার্ট সিটি',
    brandShort: 'ডিএসসিসি',
    nav: {
      services: 'সেবাসমূহ',
      complaints: 'অভিযোগ',
      cityMap: 'সিটি ম্যাপ',
      transparency: 'বাজেট ও স্বচ্ছতা',
      verifyQr: 'QR যাচাই',
      citizenPortal: 'নাগরিক পোর্টাল',
      officerDesk: 'অফিসার ডেস্ক',
      staffPortal: 'ফিল্ড স্টাফ',
      adminPortal: 'মেয়র অ্যাডমিন',
    },
    accessibility: {
      highContrast: 'হাই-কন্ট্রাস্ট',
      fontSize: 'ফন্ট',
      demoRole: 'সক্রিয় রোল',
      roles: {
        public: 'সাধারণ দর্শক',
        citizen: 'নাগরিক',
        officer: 'কর্মকর্তা',
        staff: 'মাঠকর্মী',
        admin: 'মেয়র / অ্যাডমিন',
      },
    },
    hero: {
      kicker: 'কাগজবিহীন স্মার্ট ই-গভর্ন্যান্স · অর্থবছর ২০২৬–২৭',
      headline: 'ঢাকার প্রতিটি নাগরিকের জন্য দ্রুত, স্বচ্ছ ও ডিজিটাল পৌর সেবা।',
      subheadline:
        'ঘরে বসেই ট্রেড লাইসেন্স আবেদন, হোল্ডিং ট্যাক্স হিসাব ও পরিশোধ, কমিউনিটি সেন্টার বুকিং, জিও-ট্যাগড অভিযোগ এবং QR-কোড সনদ যাচাই করুন মুহূর্তেই।',
      searchPlaceholder: 'সেবা, ওয়ার্ড, নোটিশ বা আইডি খুঁজুন (যেমন: ট্রেড লাইসেন্স, Ward 12, হোল্ডিং ট্যাক্স)...',
      searchButton: 'খুঁজুন',
      primaryCta: 'নাগরিক পোর্টালে যান',
      secondaryCta: 'অভিযোগ জানান',
      stats: {
        eservicesLabel: 'সক্রিয় ই-সেবা',
        eservicesValue: '১৮টি',
        resolvedLabel: 'অভিযোগ সমাধান হার',
        resolvedValue: '৯৪.২%',
        certificatesLabel: 'QR সনদ ইস্যু',
        certificatesValue: '১,৪২,৮৯০',
        responseLabel: 'গড় মাঠপর্যায়ে সাড়া',
        responseValue: '৪.৫ ঘণ্টা',
      },
    },
    quickServices: {
      title: 'কুইক-সার্ভিস হাব',
      subtitle: 'অফিসে না গিয়ে এক ক্লিকেই প্রয়োজনীয় সকল কাগজবিহীন নাগরিক সেবা গ্রহণ করুন।',
      applyNow: 'সেবা গ্রহণ করুন',
      items: {
        tradeLicense: {
          title: 'ট্রেড লাইসেন্স (নতুন / নবায়ন)',
          desc: 'অনলাইনে আবেদন করে মোবাইল ব্যাংকিংয়ে ফি পরিশোধ করুন এবং QR-কোডযুক্ত লাইসেন্স ডাউনলোড করুন।',
          meta: 'রাজস্ব বিভাগ · ২৪ ঘণ্টায় যাচাই',
        },
        holdingTax: {
          title: 'হোল্ডিং ট্যাক্স ক্যালকুলেটর ও পেমেন্ট',
          desc: 'ওয়ার্ড ও আয়তন অনুযায়ী স্বয়ংক্রিয়ভাবে কর হিসাব করুন এবং তাৎক্ষণিক ডিজিটাল রসিদ পান।',
          meta: 'কর নির্ধারণ · তাৎক্ষণিক রসিদ',
        },
        facilityBooking: {
          title: 'কমিউনিটি সেন্টার ও কবরস্থান বুকিং',
          desc: 'সিটি কর্পোরেশনের হলরুম ও কবরস্থানের লাইভ স্লট ক্যালেন্ডার দেখে অনলাইনে বুকিং সম্পন্ন করুন।',
          meta: 'সমাজকল্যাণ · লাইভ স্লট',
        },
        certificates: {
          title: 'জন্ম ও নাগরিক সনদপত্র',
          desc: 'কিউআর হ্যাশসহ ডিজিটাল জন্ম নিবন্ধন সনদ, চারিত্রিক ও নাগরিকত্ব সনদের আবেদন করুন।',
          meta: 'নাগরিক নিবন্ধন · যাচাইযোগ্য',
        },
        smartComplaint: {
          title: 'জিও-ট্যাগড স্মার্ট অভিযোগ',
          desc: 'ভাঙা রাস্তা, ড্রেন জ্যাম বা সড়কবাতির সমস্যা ছবি ও GPS পিনসহ পাঠিয়ে লাইভ ট্র্যাকিং আইডি পান।',
          meta: 'AI অটো-রাউটিং · লাইভ GPS',
        },
        roadDigging: {
          title: 'রাস্তা খননের অনুমতি',
          desc: 'ইউটিলিটি সংযোগের জন্য রাস্তা খনন আবেদন, স্বয়ংক্রিয় নিরাপত্তা জামানত হিসাব ও GIS ট্র্যাকিং।',
          meta: 'প্রকৌশল বিভাগ · GIS মনিটরিং',
        },
      },
    },
    notices: {
      title: 'ডায়নামিক ডিজিটাল নোটিশ বোর্ড',
      subtitle: 'তারিখ ও ক্যাটাগরি অনুযায়ী সার্চযোগ্য পরিপত্র, ই-টেন্ডার ও জরুরি নির্দেশিকা—স্ক্যান করা পিডিএফ নয়।',
      searchPlaceholder: 'কী-ওয়ার্ড বা স্মারক নম্বর দিয়ে খুঁজুন...',
      allCategories: 'সকল নোটিশ',
      urgent: 'জরুরি',
      categories: {
        revenue: 'রাজস্ব ও কর',
        tender: 'ই-টেন্ডার',
        public_health: 'জনস্বাস্থ্য',
        infrastructure: 'প্রকৌশল',
        general: 'সাধারণ',
      },
      empty: 'আপনার অনুসন্ধানের সাথে কোনো নোটিশ পাওয়া যায়নি।',
      readDetails: 'বিস্তারিত পড়ুন',
      close: 'বন্ধ করুন',
    },
    wardDirectory: {
      title: 'ইন্টারেক্টিভ ওয়ার্ড ডিরেক্টরি',
      subtitle: 'ওয়ার্ড নির্বাচন করে কাউন্সিলরের তথ্য, জরুরি নম্বর, বর্জ্য সংগ্রহ ও মশক-নিধন সময়সূচি দেখুন।',
      selectWard: 'ওয়ার্ড নির্বাচন করুন',
      councillor: 'ওয়ার্ড কাউন্সিলর',
      emergency: 'ওয়ার্ড জরুরি ডেস্ক',
      wasteSchedule: 'বাসাবাড়ি বর্জ্য সংগ্রহ সূচি',
      foggingSchedule: 'মশক-নিধন ও ফগিং সূচি',
      population: 'আনুমানিক জনসংখ্যা',
      area: 'আয়তন',
      viewOnMap: 'সিটি ম্যাপে দেখুন',
    },
    citizenPortal: {
      title: 'ইউনিফাইড নাগরিক ই-সার্ভিস পোর্টাল',
      subtitle: 'আবেদন পরিচালনা, হোল্ডিং ট্যাক্স পরিশোধ, হল বুকিং এবং QR-কোডযুক্ত ডিজিটাল সনদ সংগ্রহ করুন।',
      tabs: {
        overview: 'ড্যাশবোর্ড',
        tradeLicense: 'ট্রেড লাইসেন্স',
        holdingTax: 'হোল্ডিং ট্যাক্স',
        certificates: 'সনদপত্র',
        roadDigging: 'রাস্তা খনন',
        facilityBooking: 'ফ্যাসিলিটি বুকিং',
      },
      myApplications: 'সাম্প্রতিক আবেদন ও সনদসমূহ',
      myBookings: 'ফ্যাসিলিটি বুকিং তালিকা',
      taxPayments: 'হোল্ডিং ট্যাক্স পরিশোধ বিবরণী',
      viewQrReceipt: 'QR সনদ / রসিদ দেখুন',
      payNow: 'পেমেন্ট করুন',
      submitAndPay: 'আবেদন জমা ও পেমেন্ট করুন',
      calculateTax: 'কর হিসাব করুন',
    },
    verifyPage: {
      title: 'পাবলিক QR ও সনদ যাচাইকরণ',
      subtitle: 'ঢাকা স্মার্ট সিটির যেকোনো ট্রেড লাইসেন্স, ট্যাক্স রসিদ বা নাগরিক সনদের সত্যতা তাৎক্ষণিক যাচাই করুন।',
      inputLabel: 'সনদ, লাইসেন্স বা রসিদ নম্বর',
      placeholder: 'নম্বর লিখুন (যেমন: DSCC-TL-2026-4108)',
      verifyButton: 'সত্যতা যাচাই করুন',
      sampleLabel: 'নমুনা আইডি দিয়ে পরীক্ষা করুন:',
      verifiedBadge: 'শতভাগ যাচাইকৃত ও বৈধ',
      pendingBadge: 'অনুমোদন অপেক্ষমাণ',
      notFoundTitle: 'কোনো বৈধ রেকর্ড পাওয়া যায়নি',
      notFoundDesc: 'অনুগ্রহ করে QR কোডের নিচে থাকা রেফারেন্স নম্বরটি সঠিকভাবে যাচাই করে পুনরায় চেষ্টা করুন।',
      fields: {
        referenceId: 'রেফারেন্স নম্বর',
        docType: 'নথির ধরন',
        owner: 'প্রাপকের নাম',
        ward: 'ওয়ার্ড অঞ্চল',
        issuedAt: 'ইস্যু / পরিশোধের তারিখ',
        authority: 'ইস্যুকারী কর্তৃপক্ষ',
        amountPaid: 'পরিশোধিত সরকারি ফি',
        hash: 'ডিজিটাল সিগনেচার হ্যাশ',
      },
    },
    complaintsPage: {
      title: 'জিও-ট্যাগড স্মার্ট অভিযোগ ও সমাধান ব্যবস্থা',
      subtitle: 'সঠিক GPS লোকেশন ও ছবিসহ অভিযোগ জানান—AI অটো-রাউটিংয়ের মাধ্যমে সংশ্লিষ্ট বিভাগে পৌঁছাবে এবং লাইভ স্ট্যাটাস দেখা যাবে।',
      submitTab: 'নতুন অভিযোগ করুন',
      trackTab: 'লাইভ স্ট্যাটাস ট্র্যাকার',
      autoRouteLabel: 'AI অটো-রাউটিং বিশ্লেষণ',
      trackingPlaceholder: 'ট্র্যাকিং আইডি লিখুন (যেমন: CMP-2026-8492)',
      trackButton: 'স্ট্যাটাস দেখুন',
      submitButton: 'জিও-ট্যাগড অভিযোগ পাঠান',
      steps: {
        pending: 'গৃহীত (অপেক্ষমাণ)',
        assigned: 'মাঠকর্মী নির্ধারিত',
        in_progress: 'সমাধান কাজ চলমান',
        resolved: 'সমাধান সম্পন্ন',
      },
      categories: {
        road_damage: 'রাস্তা ভাঙা / খানাখন্দ',
        drainage: 'ড্রেনেজ ও জলাবদ্ধতা',
        waste: 'বর্জ্য ও ময়লা আবর্জনা',
        street_light: 'সড়কবাতি বিকল',
        mosquito: 'মশা ও ডেঙ্গু প্রজনন',
      },
    },
    cityMapPage: {
      title: 'ইন্টারেক্টিভ GIS সিটি ম্যাপ',
      subtitle: 'ঢাকা স্মার্ট সিটির হাসপাতাল, পাবলিক টয়লেট, পার্ক, বর্জ্য কেন্দ্র, চলমান রাস্তা খনন ও অভিযোগের লাইভ পিন দেখুন।',
      layersTitle: 'ম্যাপ লেয়ারসমূহ',
      allWards: 'সকল ওয়ার্ড',
      layers: {
        hospital: 'সিটি হাসপাতাল ও ক্লিনিক',
        public_toilet: 'স্মার্ট পাবলিক টয়লেট',
        park: 'পার্ক ও খেলার মাঠ',
        waste_point: 'বর্জ্য সংগ্রহ কেন্দ্র',
        road_digging: 'চলমান রাস্তা খনন',
        complaint: 'নাগরিক অভিযোগসমূহ',
      },
      reportHere: 'এই ওয়ার্ডে অভিযোগ জানান',
    },
    transparencyPage: {
      title: 'ওপেন বাজেট ও উন্নয়ন প্রকল্প ট্র্যাকার',
      subtitle: 'ওয়ার্ডভিত্তিক বাজেট বরাদ্দ, ব্যয়ের হিসাব এবং ঠিকাদারি প্রকল্পের অগ্রগতি সর্বসাধারণের জন্য উন্মুক্ত।',
      totalBudget: 'মোট বাজেট (২০২৬-২৭)',
      utilizedBudget: 'ব্যয়িত অর্থ',
      activeProjects: 'চলমান উন্নয়ন প্রকল্প',
      completedRate: 'গড় প্রকল্প অগ্রগতি',
      wardChartTitle: 'ওয়ার্ডভিত্তিক বাজেট বরাদ্দ বনাম ব্যয় (কোটি টাকা)',
      sectorChartTitle: 'খাতভিত্তিক বাজেট বিভাজন',
      projectsTitle: 'চলমান পৌর উন্নয়ন প্রকল্পসমূহ',
    },
    assistant: {
      title: 'নাগরিক AI সহায়ক',
      subtitle: 'বাংলা ও ইংরেজিতে তাৎক্ষণিক সেবা নির্দেশিকা',
      placeholder: 'ট্রেড লাইসেন্স, ট্যাক্স বা অভিযোগ সম্পর্কে লিখুন...',
      greeting:
        'আসসালামু আলাইকুম! আমি ঢাকা স্মার্ট সিটি সহায়ক। ট্রেড লাইসেন্স, হোল্ডিং ট্যাক্স, অভিযোগ ট্র্যাকিং বা কমিউনিটি সেন্টার বুকিং সম্পর্কে বাংলা বা ইংরেজিতে প্রশ্ন করুন।',
      suggestions: [
        'ট্রেড লাইসেন্স করতে কী কী কাগজ লাগে?',
        'How to pay holding tax?',
        'Track my complaint',
        'Book a community center',
      ],
    },
    common: {
      ward: 'ওয়ার্ড',
      bdt: '৳',
      status: 'অবস্থা',
      date: 'তারিখ',
      actions: 'পদক্ষেপ',
      printPdf: 'প্রিন্ট / PDF সংরক্ষণ',
      close: 'বন্ধ করুন',
      loading: 'তথ্য লোড হচ্ছে...',
      approved: 'অনুমোদিত',
      under_review: 'পুনঃযাচাইাধীন',
      pending: 'অপেক্ষমাণ',
      rejected: 'বাতিল',
      confirmed: 'নিশ্চিতকৃত',
      switchRoleHint: 'এই প্যানেল পরীক্ষা করতে উপরের বার থেকে রোল পরিবর্তন করুন।',
    },
    footer: {
      description:
        'ঢাকা স্মার্ট সিটি কর্পোরেশন (ডিএসসিসি) ডিজিটাল নাগরিক সেবা প্ল্যাটফর্ম — দ্রুত, স্বচ্ছ এবং কাগজবিহীন নগর সেবার অঙ্গীকার।',
      hotlinesTitle: 'জরুরি ও নাগরিক হটলাইন',
      linksTitle: 'প্ল্যাটফর্ম মডিউল',
      copyright: '© ২০২৬ ঢাকা স্মার্ট সিটি কর্পোরেশন। সর্বস্বত্ব সংরক্ষিত।',
    },
  },
};
