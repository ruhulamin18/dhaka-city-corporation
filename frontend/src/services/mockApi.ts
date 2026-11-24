import {
  ApplicationStatus,
  ApplicationType,
  AuthResponse,
  AuthRole,
  AuthUser,
  CitizenRegistrationPayload,
  Complaint,
  ComplaintCategory,
  ComplaintStatus,
  DemoCredentialInfo,
  DemoUser,
  DevelopmentProject,
  FacilityBooking,
  FacilityType,
  FieldStaffMember,
  GisMarker,
  HoldingTaxCalculation,
  HoldingTaxInput,
  HoldingTaxRecord,
  Language,
  NoticeCategory,
  NoticeItem,
  OfficialRole,
  PaymentMethod,
  PaymentReceipt,
  ServiceApplication,
  TimeSlot,
  UserRole,
  VerificationResult,
  WardBudget,
  WardInfo,
} from '@/types';

const STORAGE_KEY = 'dscc_smart_city_state_v1';
const AUTH_USERS_KEY = 'dscc_auth_users_v1';
const AUTH_SESSION_KEY = 'dscc_auth_session_v1';

interface StoredAuthAccount extends AuthUser {
  password: string;
}

const SEEDED_AUTH_ACCOUNTS: StoredAuthAccount[] = [
  {
    id: 'usr-citizen-01',
    role: 'citizen',
    nameEn: 'Md. Ruhul Amin',
    nameBn: 'মো: রুহুল আমিন',
    titleEn: 'Verified Citizen · Ward 27',
    titleBn: 'যাচাইকৃত নাগরিক · ওয়ার্ড ২৭',
    avatarUrl: '/images/profile.png',
    phone: '01816648095',
    email: 'mdruhulaminridoy18@gmail.com',
    nid: '1992269184723',
    wardNumber: 27,
    password: 'citizen123',
  },
  {
    id: 'usr-citizen-02',
    role: 'citizen',
    nameEn: 'Ayesha Rahman',
    nameBn: 'আয়েশা রহমান',
    titleEn: 'Verified Citizen · Ward 12',
    titleBn: 'যাচাইকৃত নাগরিক · ওয়ার্ড ১২',
    phone: '01700000002',
    email: 'citizen02@example.test',
    wardNumber: 12,
    password: 'citizen234',
  },
  {
    id: 'usr-citizen-03',
    role: 'citizen',
    nameEn: 'Mahin Chowdhury',
    nameBn: 'মাহিন চৌধুরী',
    titleEn: 'Verified Citizen · Ward 32',
    titleBn: 'যাচাইকৃত নাগরিক · ওয়ার্ড ৩২',
    phone: '01900000003',
    email: 'citizen03@example.test',
    wardNumber: 32,
    password: 'citizen345',
  },
  {
    id: 'usr-admin-01',
    role: 'admin',
    nameEn: 'Mayor & Chief Executive Office',
    nameBn: 'মেয়র ও প্রধান নির্বাহী কার্যালয়',
    titleEn: 'Central Command & Analytics',
    titleBn: 'কেন্দ্রীয় কমান্ড ও অ্যানালিটিক্স',
    employeeId: 'EMP-ADM-001',
    email: 'admin@dscc.gov.bd',
    department: 'Mayor Secretariat',
    password: 'admin123',
  },
  {
    id: 'usr-ward-01',
    role: 'officer',
    nameEn: 'Eng. Tariqul Islam',
    nameBn: 'প্রকৌশলী তারিকুল ইসলাম',
    titleEn: 'Ward Executive Officer · Ward 19',
    titleBn: 'ওয়ার্ড নির্বাহী কর্মকর্তা · ওয়ার্ড ১৯',
    employeeId: 'EMP-WRD-019',
    email: 'ward.officer@dscc.gov.bd',
    wardNumber: 19,
    department: 'Ward Operations & Field Oversight',
    password: 'ward123',
  },
  {
    id: 'usr-ward-02',
    role: 'officer',
    nameEn: 'Nusrat Jahan',
    nameBn: 'নুসরাত জাহান',
    titleEn: 'Ward Executive Officer · Ward 27',
    titleBn: 'ওয়ার্ড নির্বাহী কর্মকর্তা · ওয়ার্ড ২৭',
    employeeId: 'EMP-WRD-027',
    email: 'ward.officer27@dscc.gov.bd',
    wardNumber: 27,
    department: 'Ward Operations & Field Oversight',
    password: 'ward234',
  },
  {
    id: 'usr-ward-03',
    role: 'officer',
    nameEn: 'Masud Rana',
    nameBn: 'মাসুদ রানা',
    titleEn: 'Ward Executive Officer · Ward 32',
    titleBn: 'ওয়ার্ড নির্বাহী কর্মকর্তা · ওয়ার্ড ৩২',
    employeeId: 'EMP-WRD-032',
    email: 'ward.officer32@dscc.gov.bd',
    wardNumber: 32,
    department: 'Ward Operations & Field Oversight',
    password: 'ward345',
  },
  {
    id: 'usr-ward-04',
    role: 'officer',
    nameEn: 'Sadia Sultana',
    nameBn: 'সাদিয়া সুলতানা',
    titleEn: 'Ward Executive Officer · Ward 41',
    titleBn: 'ওয়ার্ড নির্বাহী কর্মকর্তা · ওয়ার্ড ৪১',
    employeeId: 'EMP-WRD-041',
    email: 'ward.officer41@dscc.gov.bd',
    wardNumber: 41,
    department: 'Ward Operations & Field Oversight',
    password: 'ward456',
  },
  {
    id: 'usr-officer-01',
    role: 'officer',
    nameEn: 'Farhana Yasmin, BCS',
    nameBn: 'ফারহানা ইয়াসমিন, বিসিএস',
    titleEn: 'Department Officer · Revenue & Engineering',
    titleBn: 'বিভাগীয় কর্মকর্তা · রাজস্ব ও প্রকৌশল',
    employeeId: 'EMP-OFF-104',
    email: 'dept.officer@dscc.gov.bd',
    wardNumber: 27,
    department: 'Revenue & Engineering Wing',
    password: 'officer123',
  },
  {
    id: 'usr-officer-02',
    role: 'officer',
    nameEn: 'Arif Hossain',
    nameBn: 'আরিফ হোসেন',
    titleEn: 'Department Officer · Tax & Revenue',
    titleBn: 'বিভাগীয় কর্মকর্তা · কর ও রাজস্ব',
    employeeId: 'EMP-OFF-115',
    email: 'tax.officer@dscc.gov.bd',
    department: 'Tax & Revenue',
    password: 'officer234',
  },
  {
    id: 'usr-officer-03',
    role: 'officer',
    nameEn: 'Sharmin Akter',
    nameBn: 'শারমিন আক্তার',
    titleEn: 'Department Officer · Engineering',
    titleBn: 'বিভাগীয় কর্মকর্তা · প্রকৌশল',
    employeeId: 'EMP-OFF-207',
    email: 'engineering.officer@dscc.gov.bd',
    department: 'Infrastructure & Engineering',
    password: 'officer345',
  },
  {
    id: 'usr-officer-04',
    role: 'officer',
    nameEn: 'Mahfuzur Rahman',
    nameBn: 'মাহফুজুর রহমান',
    titleEn: 'Department Officer · Citizen Services',
    titleBn: 'বিভাগীয় কর্মকর্তা · নাগরিক সেবা',
    employeeId: 'EMP-OFF-321',
    email: 'service.officer@dscc.gov.bd',
    department: 'Citizen Services',
    password: 'officer456',
  },
  {
    id: 'usr-staff-01',
    role: 'staff',
    nameEn: 'Mohammad Shahidul Alam',
    nameBn: 'মোহাম্মদ শহীদুল আলম',
    titleEn: 'Senior Field Supervisor · Ward 12 & 27',
    titleBn: 'সিনিয়র ফিল্ড সুপারভাইজার · ওয়ার্ড ১২ ও ২৭',
    employeeId: 'EMP-STF-209',
    email: 'staff@dscc.gov.bd',
    phone: '01819334901',
    wardNumber: 12,
    department: 'Civil Engineering & Roads',
    password: 'staff123',
  },
];

export const DEMO_CREDENTIALS: DemoCredentialInfo[] = [
  {
    id: 'usr-citizen-01',
    group: 'citizen',
    role: 'citizen',
    labelEn: 'Citizen · Ward 27',
    labelBn: 'নাগরিক · ওয়ার্ড ২৭',
    identifier: '01816648095',
    password: 'citizen123',
    noteEn: 'Citizen demo account · Ward 27',
    noteBn: 'নাগরিক ডেমো অ্যাকাউন্ট · ওয়ার্ড ২৭',
  },
  {
    id: 'usr-citizen-02',
    group: 'citizen',
    role: 'citizen',
    labelEn: 'Citizen · Ward 12',
    labelBn: 'নাগরিক · ওয়ার্ড ১২',
    identifier: '01700000002',
    password: 'citizen234',
    noteEn: 'Citizen demo account · Ward 12',
    noteBn: 'নাগরিক ডেমো অ্যাকাউন্ট · ওয়ার্ড ১২',
  },
  {
    id: 'usr-citizen-03',
    group: 'citizen',
    role: 'citizen',
    labelEn: 'Citizen · Ward 32',
    labelBn: 'নাগরিক · ওয়ার্ড ৩২',
    identifier: '01900000003',
    password: 'citizen345',
    noteEn: 'Citizen demo account · Ward 32',
    noteBn: 'নাগরিক ডেমো অ্যাকাউন্ট · ওয়ার্ড ৩২',
  },
  {
    id: 'usr-ward-01',
    group: 'ward_officer',
    role: 'officer',
    labelEn: 'Ward Officer · Ward 19',
    labelBn: 'ওয়ার্ড কর্মকর্তা · ওয়ার্ড ১৯',
    identifier: 'ward.officer@dscc.gov.bd',
    password: 'ward123',
    noteEn: 'EMP-WRD-019 · Ward 19 Operations',
    noteBn: 'EMP-WRD-019 · ওয়ার্ড ১৯ কার্যক্রম',
  },
  {
    id: 'usr-ward-02',
    group: 'ward_officer',
    role: 'officer',
    labelEn: 'Ward Officer · Ward 27',
    labelBn: 'ওয়ার্ড কর্মকর্তা · ওয়ার্ড ২৭',
    identifier: 'ward.officer27@dscc.gov.bd',
    password: 'ward234',
    noteEn: 'EMP-WRD-027 · Ward 27 Operations',
    noteBn: 'EMP-WRD-027 · ওয়ার্ড ২৭ কার্যক্রম',
  },
  {
    id: 'usr-ward-03',
    group: 'ward_officer',
    role: 'officer',
    labelEn: 'Ward Officer · Ward 32',
    labelBn: 'ওয়ার্ড কর্মকর্তা · ওয়ার্ড ৩২',
    identifier: 'ward.officer32@dscc.gov.bd',
    password: 'ward345',
    noteEn: 'EMP-WRD-032 · Ward 32 Operations',
    noteBn: 'EMP-WRD-032 · ওয়ার্ড ৩২ কার্যক্রম',
  },
  {
    id: 'usr-ward-04',
    group: 'ward_officer',
    role: 'officer',
    labelEn: 'Ward Officer · Ward 41',
    labelBn: 'ওয়ার্ড কর্মকর্তা · ওয়ার্ড ৪১',
    identifier: 'ward.officer41@dscc.gov.bd',
    password: 'ward456',
    noteEn: 'EMP-WRD-041 · Ward 41 Operations',
    noteBn: 'EMP-WRD-041 · ওয়ার্ড ৪১ কার্যক্রম',
  },
  {
    id: 'usr-officer-01',
    group: 'dept_officer',
    role: 'officer',
    labelEn: 'Department Officer · Revenue & Engineering',
    labelBn: 'বিভাগীয় কর্মকর্তা · রাজস্ব ও প্রকৌশল',
    identifier: 'dept.officer@dscc.gov.bd',
    password: 'officer123',
    noteEn: 'ID: EMP-OFF-104 · Revenue & Statutory Approvals',
    noteBn: 'আইডি: EMP-OFF-104 · রাজস্ব ও সংবিধিবদ্ধ অনুমোদন',
  },
  {
    id: 'usr-officer-02',
    group: 'dept_officer',
    role: 'officer',
    labelEn: 'Department Officer · Tax & Revenue',
    labelBn: 'বিভাগীয় কর্মকর্তা · কর ও রাজস্ব',
    identifier: 'tax.officer@dscc.gov.bd',
    password: 'officer234',
    noteEn: 'EMP-OFF-115 · Tax & Revenue',
    noteBn: 'EMP-OFF-115 · কর ও রাজস্ব',
  },
  {
    id: 'usr-officer-03',
    group: 'dept_officer',
    role: 'officer',
    labelEn: 'Department Officer · Engineering',
    labelBn: 'বিভাগীয় কর্মকর্তা · প্রকৌশল',
    identifier: 'engineering.officer@dscc.gov.bd',
    password: 'officer345',
    noteEn: 'EMP-OFF-207 · Infrastructure & Engineering',
    noteBn: 'EMP-OFF-207 · অবকাঠামো ও প্রকৌশল',
  },
  {
    id: 'usr-officer-04',
    group: 'dept_officer',
    role: 'officer',
    labelEn: 'Department Officer · Citizen Services',
    labelBn: 'বিভাগীয় কর্মকর্তা · নাগরিক সেবা',
    identifier: 'service.officer@dscc.gov.bd',
    password: 'officer456',
    noteEn: 'EMP-OFF-321 · Citizen Services',
    noteBn: 'EMP-OFF-321 · নাগরিক সেবা',
  },
  {
    id: 'usr-admin-01',
    group: 'admin',
    role: 'admin',
    labelEn: 'Super Admin · Mayor Secretariat',
    labelBn: 'সুপার অ্যাডমিন · মেয়র সচিবালয়',
    identifier: 'admin@dscc.gov.bd',
    password: 'admin123',
    noteEn: 'ID: EMP-ADM-001 · Mayor Command, Citizens, Services & Audit',
    noteBn: 'আইডি: EMP-ADM-001 · মেয়র কমান্ড, নাগরিক, সেবা ও অডিট',
  },
];

function stripPassword(acc: StoredAuthAccount): AuthUser {
  const { password: _removed, ...safeUser } = acc;
  void _removed;
  return safeUser;
}

function normalizePhone(input: string): string {
  return input.replace(/[\s-]/g, '').trim();
}

function readAuthAccounts(): StoredAuthAccount[] {
  if (typeof window === 'undefined') return SEEDED_AUTH_ACCOUNTS;
  try {
    const raw = window.localStorage.getItem(AUTH_USERS_KEY);
    if (!raw) return SEEDED_AUTH_ACCOUNTS;
    const parsed = JSON.parse(raw) as StoredAuthAccount[];
    const merged = parsed.map((account) => {
      const seededAccount = SEEDED_AUTH_ACCOUNTS.find((seed) => seed.id === account.id);
      return seededAccount?.avatarUrl && !account.avatarUrl
        ? { ...account, avatarUrl: seededAccount.avatarUrl }
        : account;
    });
    const existingIds = new Set(merged.map((account) => account.id));
    for (const seed of SEEDED_AUTH_ACCOUNTS) {
      if (!existingIds.has(seed.id)) merged.push(seed);
    }
    return merged;
  } catch {
    return SEEDED_AUTH_ACCOUNTS;
  }
}

function writeAuthAccounts(accounts: StoredAuthAccount[]): boolean {
  if (typeof window === 'undefined') return false;
  try {
    window.localStorage.setItem(AUTH_USERS_KEY, JSON.stringify(accounts));
    return true;
  } catch {
    return false;
  }
}

export function getDashboardPathForRole(role: AuthRole): string {
  switch (role) {
    case 'admin':
      return '/admin';
    case 'officer':
      return '/admin';
    case 'staff':
      return '/dashboard/staff';
    case 'citizen':
    default:
      return '/citizen';
  }
}

// Helper to create deterministic inline SVG inspection previews (zero external URLs)
function makeCivicPreviewSvg(label: string, accent: string, detail: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="400" viewBox="0 0 640 400">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#00523C"/>
        <stop offset="100%" stop-color="${accent}"/>
      </linearGradient>
    </defs>
    <rect width="640" height="400" fill="url(#g)"/>
    <rect x="28" y="28" width="584" height="344" rx="14" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.28)" stroke-width="2"/>
    <circle cx="96" cy="110" r="32" fill="rgba(255,255,255,0.18)"/>
    <path d="M84 110 L94 120 L110 98" fill="none" stroke="#ffffff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
    <text x="148" y="106" fill="#ffffff" font-family="sans-serif" font-size="22" font-weight="700">${label}</text>
    <text x="148" y="134" fill="#D1FAE5" font-family="sans-serif" font-size="14">${detail}</text>
    <rect x="64" y="184" width="512" height="140" rx="10" fill="rgba(6,78,59,0.4)"/>
    <path d="M90 290 L190 230 L270 265 L380 210 L550 295" fill="none" stroke="#A7F3D0" stroke-width="4" stroke-linecap="round"/>
    <text x="86" y="312" fill="#ECFDF5" font-family="monospace" font-size="13">DSCC GEO-TAGGED FIELD SNAPSHOT · VERIFIED METADATA</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const DEMO_USERS: Record<UserRole, DemoUser> = {
  public: {
    id: 'usr-public',
    role: 'public',
    nameEn: 'Guest Resident',
    nameBn: 'অতিথি নাগরিক',
    titleEn: 'Public Portal Visitor',
    titleBn: 'পাবলিক পোর্টাল দর্শক',
  },
  citizen: {
    id: 'usr-citizen-01',
    role: 'citizen',
    nameEn: 'Tanvir Ahmed Chowdhury',
    nameBn: 'তানভীর আহমেদ চৌধুরী',
    titleEn: 'Verified Citizen · Ward 27',
    titleBn: 'নিবন্ধিত নাগরিক · ওয়ার্ড ২৭',
    wardNumber: 27,
    nid: '1992269184723',
    phone: '01711-482910',
  },
  officer: {
    id: 'usr-officer-01',
    role: 'officer',
    nameEn: 'Farhana Yasmin, BCS',
    nameBn: 'ফারহানা ইয়াসমিন, বিসিএস',
    titleEn: 'Zonal Executive Officer · Zone 3',
    titleBn: 'আঞ্চলিক নির্বাহী কর্মকর্তা · অঞ্চল ৩',
    wardNumber: 27,
    department: 'Revenue & Engineering Desk',
  },
  staff: {
    id: 'usr-staff-01',
    role: 'staff',
    nameEn: 'Eng. Tariqul Islam',
    nameBn: 'প্রকৌশলী তারিকুল ইসলাম',
    titleEn: 'Senior Field Supervisor · Ward 12 & 27',
    titleBn: 'সিনিয়র ফিল্ড সুপারভাইজার · ওয়ার্ড ১২ ও ২৭',
    wardNumber: 12,
    department: 'Civil Engineering & Roads',
    phone: '01819-334901',
  },
  admin: {
    id: 'usr-admin-01',
    role: 'admin',
    nameEn: 'Mayor & Chief Executive Office',
    nameBn: 'মেয়র ও প্রধান নির্বাহী কার্যালয়',
    titleEn: 'Central Command & Analytics',
    titleBn: 'কেন্দ্রীয় কমান্ড ও অ্যানালিটিক্স',
  },
};

export const INITIAL_WARDS: WardInfo[] = [
  {
    wardNumber: 12,
    zoneEn: 'Zone 2 (Mirpur-Pallabi)',
    zoneBn: 'অঞ্চল ২ (মিরপুর-পল্লবী)',
    nameEn: 'Mirpur Section 10 & Shah Ali',
    nameBn: 'মিরপুর সেকশন ১০ ও শাহ আলী',
    councillorEn: 'Md. Golam Mostafa',
    councillorBn: 'মো. গোলাম মোস্তফা',
    councillorPhone: '01711-220912',
    emergencyPhone: '02-58051212',
    wasteScheduleEn: 'Daily 06:30 AM – 09:30 AM (Primary Van)',
    wasteScheduleBn: 'প্রতিদিন সকাল ০৬:৩০ – ০৯:৩০ (প্রাইমারি ভ্যান)',
    foggingScheduleEn: 'Mon, Wed, Fri · 05:15 PM – 07:30 PM',
    foggingScheduleBn: 'সোম, বুধ, শুক্র · বিকাল ০৫:১৫ – সন্ধ্যা ০৭:৩০',
    population: 148500,
    areaSqKm: 3.4,
    mapX: 24,
    mapY: 28,
  },
  {
    wardNumber: 19,
    zoneEn: 'Zone 3 (Gulshan-Banani)',
    zoneBn: 'অঞ্চল ৩ (গুলশান-বনানী)',
    nameEn: 'Banani, Korail & Gulshan-1',
    nameBn: 'বনানী, কড়াইল ও গুলশান-১',
    councillorEn: 'Mofizur Rahman Babu',
    councillorBn: 'মফিজুর রহমান বাবু',
    councillorPhone: '01715-391819',
    emergencyPhone: '02-58811919',
    wasteScheduleEn: 'Daily 07:00 AM – 10:00 AM & Night 09:00 PM',
    wasteScheduleBn: 'প্রতিদিন সকাল ০৭:০০ – ১০:০০ ও রাত ০৯:০০',
    foggingScheduleEn: 'Sun, Tue, Thu · 05:30 PM – 08:00 PM',
    foggingScheduleBn: 'রবি, মঙ্গল, বৃহঃ · বিকাল ০৫:৩০ – রাত ০৮:০০',
    population: 162000,
    areaSqKm: 4.8,
    mapX: 64,
    mapY: 26,
  },
  {
    wardNumber: 24,
    zoneEn: 'Zone 4 (Old Dhaka)',
    zoneBn: 'অঞ্চল ৪ (পুরান ঢাকা)',
    nameEn: 'Lalbagh & Azimpur Heritage',
    nameBn: 'লালবাগ ও আজিমপুর হেরিটেজ',
    councillorEn: 'Haji Mokbul Hossain',
    councillorBn: 'হাজী মকবুল হোসেন',
    councillorPhone: '01817-662424',
    emergencyPhone: '02-57312424',
    wasteScheduleEn: 'Daily 06:00 AM – 09:00 AM',
    wasteScheduleBn: 'প্রতিদিন সকাল ০৬:০০ – ০৯:০০',
    foggingScheduleEn: 'Daily Canal Belt · 05:00 PM – 07:00 PM',
    foggingScheduleBn: 'প্রতিদিন খাল পাড় · বিকাল ০৫:০০ – সন্ধ্যা ০৭:০০',
    population: 134000,
    areaSqKm: 2.1,
    mapX: 34,
    mapY: 74,
  },
  {
    wardNumber: 27,
    zoneEn: 'Zone 1 (Dhanmondi-Kalabagan)',
    zoneBn: 'অঞ্চল ১ (ধানমন্ডি-কলাবাগান)',
    nameEn: 'Dhanmondi Lake & Green Road',
    nameBn: 'ধানমন্ডি লেক ও গ্রীন রোড',
    councillorEn: 'Sabina Yasmin Chowdhury',
    councillorBn: 'সাবিনা ইয়াসমিন চৌধুরী',
    councillorPhone: '01712-904527',
    emergencyPhone: '02-58612727',
    wasteScheduleEn: 'Daily 07:00 AM – 09:30 AM',
    wasteScheduleBn: 'প্রতিদিন সকাল ০৭:০০ – ০৯:৩০',
    foggingScheduleEn: 'Tue, Thu, Sat · 05:30 PM – 07:45 PM',
    foggingScheduleBn: 'মঙ্গল, বৃহঃ, শনি · বিকাল ০৫:৩০ – সন্ধ্যা ০৭:৪৫',
    population: 118400,
    areaSqKm: 2.9,
    mapX: 38,
    mapY: 52,
  },
  {
    wardNumber: 32,
    zoneEn: 'Zone 5 (Mohammadpur)',
    zoneBn: 'অঞ্চল ৫ (মোহাম্মদপুর)',
    nameEn: 'Mohammadpur Tajmahal Road',
    nameBn: 'মোহাম্মদপুর তাজমহল রোড',
    councillorEn: 'Syed Hasan Noor',
    councillorBn: 'সৈয়দ হাসান নূর',
    councillorPhone: '01911-773232',
    emergencyPhone: '02-58153232',
    wasteScheduleEn: 'Daily 06:45 AM – 10:00 AM',
    wasteScheduleBn: 'প্রতিদিন সকাল ০৬:৪৫ – ১০:০০',
    foggingScheduleEn: 'Mon, Thu, Sat · 05:00 PM – 07:30 PM',
    foggingScheduleBn: 'সোম, বৃহঃ, শনি · বিকাল ০৫:০০ – সন্ধ্যা ০৭:৩০',
    population: 155200,
    areaSqKm: 3.1,
    mapX: 18,
    mapY: 48,
  },
  {
    wardNumber: 36,
    zoneEn: 'Zone 1 (Motijheel-Paltan)',
    zoneBn: 'অঞ্চল ১ (মতিঝিল-পল্টন)',
    nameEn: 'Motijheel Commercial & Paltan',
    nameBn: 'মতিঝিল বাণিজ্যিক ও পল্টন',
    councillorEn: 'Ariful Haque Rony',
    councillorBn: 'আরিফুল হক রনি',
    councillorPhone: '01716-553636',
    emergencyPhone: '02-22338363',
    wasteScheduleEn: 'Night Shift 10:00 PM – 04:00 AM',
    wasteScheduleBn: 'রাত ১০:০০ – ভোর ০৪:০০ (বাণিজ্যিক শিফট)',
    foggingScheduleEn: 'Sun, Wed, Fri · 06:00 PM – 08:30 PM',
    foggingScheduleBn: 'রবি, বুধ, শুক্র · সন্ধ্যা ০৬:০০ – রাত ০৮:৩০',
    population: 129000,
    areaSqKm: 2.6,
    mapX: 56,
    mapY: 64,
  },
  {
    wardNumber: 41,
    zoneEn: 'Zone 6 (Uttara East)',
    zoneBn: 'অঞ্চল ৬ (উত্তরা পূর্ব)',
    nameEn: 'Uttara Sector 4, 6 & 8',
    nameBn: 'উত্তরা সেক্টর ৪, ৬ ও ৮',
    councillorEn: 'Dr. Nazmul Huda',
    councillorBn: 'ডা. নাজমুল হুদা',
    councillorPhone: '01730-884141',
    emergencyPhone: '02-58954141',
    wasteScheduleEn: 'Daily 07:30 AM – 10:30 AM',
    wasteScheduleBn: 'প্রতিদিন সকাল ০৭:৩০ – ১০:৩০',
    foggingScheduleEn: 'Mon, Wed, Sat · 05:15 PM – 07:30 PM',
    foggingScheduleBn: 'সোম, বুধ, শনি · বিকাল ০৫:১৫ – সন্ধ্যা ০৭:৩০',
    population: 141800,
    areaSqKm: 5.2,
    mapX: 54,
    mapY: 12,
  },
  {
    wardNumber: 48,
    zoneEn: 'Zone 7 (Demra-Jatrabari)',
    zoneBn: 'অঞ্চল ৭ (ডেমরা-যাত্রাবাড়ী)',
    nameEn: 'Jatrabari & Demra Growth Hub',
    nameBn: 'যাত্রাবাড়ী ও ডেমরা গ্রোথ হাব',
    councillorEn: 'Kamrul Hasan Ripon',
    councillorBn: 'কামরুল হাসান রিপন',
    councillorPhone: '01819-484810',
    emergencyPhone: '02-75444848',
    wasteScheduleEn: 'Daily 06:00 AM – 09:15 AM',
    wasteScheduleBn: 'প্রতিদিন সকাল ০৬:০০ – ০৯:১৫',
    foggingScheduleEn: 'Sun, Tue, Fri · 05:00 PM – 07:30 PM',
    foggingScheduleBn: 'রবি, মঙ্গল, শুক্র · বিকাল ০৫:০০ – সন্ধ্যা ০৭:৩০',
    population: 171200,
    areaSqKm: 4.5,
    mapX: 78,
    mapY: 78,
  },
];

export const INITIAL_NOTICES: NoticeItem[] = [
  {
    id: 'not-01',
    titleEn: '10% Rebate on Annual Holding Tax Paid Online Before December 31',
    titleBn: '৩১ ডিসেম্বরের মধ্যে অনলাইনে বার্ষিক হোল্ডিং ট্যাক্স পরিশোধে ১০% বিশেষ ছাড়',
    summaryEn:
      'Property owners across all 50 wards receive an automatic 10% rebate on FY2026-27 holding tax when paid via bKash, Nagad, Rocket, or Card through the Unified Citizen Portal.',
    summaryBn:
      'অর্থবছর ২০২৬-২৭ এর বার্ষিক হোল্ডিং ট্যাক্স নাগরিক পোর্টালের মাধ্যমে বিকাশ, নগদ, রকেট বা কার্ডে পরিশোধ করলে স্বয়ংক্রিয়ভাবে ১০% রিবেট সুবিধা পাওয়া যাবে।',
    category: 'revenue',
    publishedAt: '2026-11-16',
    referenceCode: 'DSCC/REV/2026/409',
    isUrgent: true,
    type: 'notice',
    fileSize: 'PDF • 385 KB',
  },
  {
    id: 'not-02',
    titleEn: 'Special Dengue Larvicide & Evening Fogging Drive in Wards 12, 24 & 32',
    titleBn: 'ওয়ার্ড ১২, ২৪ ও ৩২-এ বিশেষ ডেঙ্গু লার্ভিসাইড ও সান্ধ্যকালীন ফগিং অভিযান',
    summaryEn:
      'Public Health Engineering teams will conduct intensive drain larvicide spraying from 8:00 AM and thermal fogging from 5:00 PM daily for 14 days. Residents are requested to clear stagnant rooftop water.',
    summaryBn:
      'জনস্বাস্থ্য প্রকৌশল দল প্রতিদিন সকাল ৮টায় লার্ভিসাইড ছিটানো ও বিকাল ৫টায় ফগিং পরিচালনা করবে। বাসাবাড়ির ছাদ ও আঙিনায় জমে থাকা পানি অপসারণের অনুরোধ করা হলো।',
    category: 'public_health',
    publishedAt: '2026-11-15',
    referenceCode: 'DSCC/HLT/2026/118',
    isUrgent: true,
    type: 'notice',
    fileSize: 'PDF • 512 KB',
  },
  {
    id: 'not-03',
    titleEn: 'E-Tender Notice: Solar Smart LED Streetlight Replacement (Phase 3)',
    titleBn: 'ই-টেন্ডার বিজ্ঞপ্তি: সোলার স্মার্ট এলইডি সড়কবাতি স্থাপন (পর্যায়-৩)',
    summaryEn:
      'Sealed e-tenders are invited from Grade-A electrical contractors for installing 2,400 IoT-dimmable LED streetlamps across Zone 2 and Zone 5 arterial roads. Submission deadline: 10 Dec 2026.',
    summaryBn:
      'অঞ্চল ২ ও ৫-এর প্রধান সড়কে ২,৪০০টি আইওটি-নিয়ন্ত্রিত স্মার্ট এলইডি সড়কবাতি স্থাপনের জন্য এ-গ্রেড ঠিকাদারি প্রতিষ্ঠানের নিকট হতে ই-টেন্ডার আহ্বান করা যাচ্ছে। শেষ তারিখ: ১০ ডিসেম্বর ২০২৬।',
    category: 'tender',
    publishedAt: '2026-11-12',
    referenceCode: 'DSCC/ENG/ET-2026-88',
    type: 'notice',
    fileSize: 'PDF • 740 KB',
  },
  {
    id: 'not-04',
    titleEn: 'Temporary Nighttime Utility Excavation on Green Road (Ward 27)',
    titleBn: 'গ্রীন রোডে (ওয়ার্ড ২৭) রাত্রীকালীন ইউটিলিটি রাস্তা খনন সংক্রান্ত বিজ্ঞপ্তি',
    summaryEn:
      'Fiber-optic & storm-drainage tie-in works approved from 11:00 PM to 5:00 AM until 25 Nov. One traffic lane remains open; restoration guaranteed within 48 hours.',
    summaryBn:
      'আগামী ২৫ নভেম্বর পর্যন্ত রাত ১১টা থেকে ভোর ৫টা পর্যন্ত গ্রীন রোডে ফাইবার ও ড্রেনেজ সংযোগ কাজ চলবে। ৪৮ ঘণ্টার মধ্যে রাস্তা পুনর্নির্মাণ সম্পন্ন হবে।',
    category: 'infrastructure',
    publishedAt: '2026-11-10',
    referenceCode: 'DSCC/ENG/RD-2026/214',
    type: 'notice',
    fileSize: 'PDF • 290 KB',
  },
  {
    id: 'not-05',
    titleEn: 'Paperless Trade License Renewal Window Open for FY 2026–27',
    titleBn: '২০২৬-২৭ অর্থবছরের কাগজবিহীন ট্রেড লাইসেন্স নবায়ন কার্যক্রম শুরু',
    summaryEn:
      'Business owners can renew existing trade licenses in under 3 minutes using their NID and previous license number to receive an instant QR-verifiable PDF certificate.',
    summaryBn:
      'ব্যবসায়ীগণ এনআইডি ও পূর্ববর্তী লাইসেন্স নম্বর ব্যবহার করে মাত্র ৩ মিনিটেই ট্রেড লাইসেন্স নবায়ন এবং QR-কোডযুক্ত সনদ ডাউনলোড করতে পারবেন।',
    category: 'revenue',
    publishedAt: '2026-11-05',
    referenceCode: 'DSCC/REV/2026/382',
    type: 'notice',
    fileSize: 'PDF • 460 KB',
  },
  {
    id: 'not-06',
    titleEn: 'Public Hearing on Ward-Wise Open Budget Execution for Q2 FY26-27',
    titleBn: '২য় প্রান্তিকের ওয়ার্ডভিত্তিক উন্মুক্ত বাজেট বাস্তবায়ন বিষয়ে গণশুনানি',
    summaryEn:
      'Citizens are invited to review ongoing drainage and park renovation milestones in the Transparency Hub and submit feedback prior to the 28 November Mayor Townhall.',
    summaryBn:
      'আগামী ২৮ নভেম্বর মেয়র টাউনহলের পূর্বে ট্রান্সপারেন্সি হাব থেকে ড্রেনেজ ও পার্ক সংস্কার কাজের অগ্রগতি পর্যবেক্ষণ ও মতামত প্রদানের আহ্বান জানানো হচ্ছে।',
    category: 'general',
    publishedAt: '2026-11-02',
    referenceCode: 'DSCC/GEN/2026/091',
    type: 'notice',
    fileSize: 'PDF • 340 KB',
  },
  {
    id: 'news-01',
    titleEn: 'Mayor Inaugurates 5 New Secondary Transfer Stations (STS) for Zero Open Waste',
    titleBn: 'উন্মুক্ত বর্জ্যমুক্ত নগর গড়তে মেয়রের ৫টি নতুন সেকেন্ডারি ট্রান্সফার স্টেশন (STS) উদ্বোধন',
    summaryEn:
      'Honorable Mayor launched modern odor-controlled compaction transfer stations in Wards 24, 36, and 48 today, eliminating 38 open garbage dumps across South Dhaka.',
    summaryBn:
      'মাননীয় মেয়র আজ দক্ষিণ ঢাকার ৩টি অঞ্চলে আধুনিক কম্প্যাক্টযুক্ত ৫টি বর্জ্য স্থানান্তর কেন্দ্র উদ্বোধন করেছেন, যার ফলে ৩৮টি উন্মুক্ত ময়লার ভাগাড় সম্পূর্ণ অপসারিত হলো।',
    category: 'infrastructure',
    publishedAt: '2026-11-18',
    referenceCode: 'DSCC/PR/2026/044',
    type: 'news',
    fileSize: 'PDF • 420 KB',
  },
  {
    id: 'news-02',
    titleEn: 'Dhaka Smart City Corporation Launches 24/7 AI-Assisted Citizen Complaint Desk',
    titleBn: 'ঢাকা স্মার্ট সিটি কর্পোরেশনের ২৪/৭ এআই নাগরিক অভিযোগ ও ট্র্যাকিং ডেস্কে নাগরিক সাড়া',
    summaryEn:
      'Over 14,000 complaints resolved within a record 48-hour SLA in the past quarter through automated GPS geolocation and direct ward field team assignment.',
    summaryBn:
      'স্বয়ংক্রিয় জিপিএস ট্র্যাকিং ও ওয়ার্ড টিম সমন্বয়ের মাধ্যমে গত প্রান্তিকে ১৪,০০০-এর বেশি নাগরিক অভিযোগ ৪৮ ঘণ্টার গড় সময়সীমায় সমাধান সম্পন্ন হয়েছে।',
    category: 'general',
    publishedAt: '2026-11-14',
    referenceCode: 'DSCC/PR/2026/043',
    type: 'news',
    fileSize: 'PDF • 530 KB',
  },
  {
    id: 'news-03',
    titleEn: 'Tree Plantation & Urban Micro-Forest Drive Commences Along Buriganga Riverfront',
    titleBn: 'বুড়িগঙ্গা তীরবর্তী অঞ্চলে ৫০,০০০ বৃক্ষরোপণ ও নগর বন সৃজন কর্মসূচি শুরু',
    summaryEn:
      'A citywide greening initiative in partnership with environmental organizations will plant 50,000 indigenous trees to enhance air quality and pedestrian shading.',
    summaryBn:
      'পরিবেশ সংগঠনের সাথে যৌথ উদ্যোগে বুড়িগঙ্গার তীরজুড়ে দেশীয় প্রজাতির ৫০ হাজার বৃক্ষরোপণ কর্মসূচি শুরু হয়েছে।',
    category: 'public_health',
    publishedAt: '2026-11-08',
    referenceCode: 'DSCC/PR/2026/041',
    type: 'news',
    fileSize: 'PDF • 380 KB',
  },
];

export const INITIAL_APPLICATIONS: ServiceApplication[] = [
  {
    id: 'app-01',
    referenceId: 'DSCC-TL-2026-4108',
    type: 'trade_license',
    applicantName: 'Tanvir Ahmed Chowdhury',
    applicantNameBn: 'তানভীর আহমেদ চৌধুরী',
    nid: '1992269184723',
    phone: '01711-482910',
    wardNumber: 27,
    businessName: 'Bengal Green Tech Solutions Ltd.',
    businessCategory: 'IT & Software Consultancy',
    address: 'House 42, Road 9/A, Dhanmondi, Dhaka-1209',
    feeBdt: 4500,
    paymentStatus: 'paid',
    transactionId: 'BKASH-9X204811',
    status: 'approved',
    submittedAt: '2026-11-01',
    reviewedAt: '2026-11-02',
    reviewedBy: 'Farhana Yasmin, ZEO',
    qrHash: 'SHA256:9F84A2C71E0B44D9',
  },
  {
    id: 'app-02',
    referenceId: 'DSCC-CERT-2026-1094',
    type: 'citizen_certificate',
    applicantName: 'Nusrat Jahan Mim',
    applicantNameBn: 'নুসরাত জাহান মীম',
    nid: '1998441029384',
    phone: '01812-774019',
    wardNumber: 19,
    address: 'Block C, Road 11, Banani, Dhaka-1213',
    feeBdt: 100,
    paymentStatus: 'paid',
    transactionId: 'NAGAD-55192044',
    status: 'approved',
    submittedAt: '2026-11-08',
    reviewedAt: '2026-11-08',
    reviewedBy: 'Mofizur Rahman Babu, Councillor',
    qrHash: 'SHA256:3D12B90F88AC10E4',
  },
  {
    id: 'app-03',
    referenceId: 'DSCC-TL-2026-5219',
    type: 'trade_license',
    applicantName: 'Md. Rafiqul Islam',
    applicantNameBn: 'মো. রফিকুল ইসলাম',
    nid: '1986112948571',
    phone: '01914-882031',
    wardNumber: 12,
    businessName: 'Padma Organic Agro Mart',
    businessCategory: 'Retail Grocery & Agro',
    address: 'Plot 14, Main Road, Mirpur-10, Dhaka-1216',
    feeBdt: 3200,
    paymentStatus: 'paid',
    transactionId: 'ROCKET-33910422',
    status: 'pending',
    submittedAt: '2026-11-16',
    qrHash: 'SHA256:7A49E11C22BD905F',
  },
  {
    id: 'app-04',
    referenceId: 'DSCC-RD-2026-0831',
    type: 'road_digging',
    applicantName: 'Dhaka Fiber Grid Corp.',
    applicantNameBn: 'ঢাকা ফাইবার গ্রিড কর্পোরেশন',
    nid: '1979001122334',
    phone: '01755-901122',
    wardNumber: 36,
    businessName: 'Underground Duct Extension (45m)',
    address: 'Toyenbee Circular Road, Motijheel, Dhaka-1000',
    feeBdt: 18500,
    paymentStatus: 'paid',
    transactionId: 'CARD-77120491',
    status: 'pending',
    submittedAt: '2026-11-17',
    qrHash: 'SHA256:5C81F23A09EB712A',
    details: { lengthMeters: 45, surfaceType: 'Bituminous Asphalt' },
  },
];

export const INITIAL_TAX_RECORDS: HoldingTaxRecord[] = [
  {
    id: 'tax-01',
    receiptId: 'DSCC-TAX-2026-7731',
    holdingNumber: '27-0412-B',
    ownerName: 'Tanvir Ahmed Chowdhury',
    wardNumber: 27,
    propertyType: 'Residential',
    areaSqFt: 2400,
    amountPaidBdt: 14850,
    fiscalYear: '2026-27',
    paymentMethod: 'bkash',
    transactionId: 'BKASH-88120455',
    paidAt: '2026-11-04',
    qrHash: 'SHA256:4B22C80E99FA112C',
  },
];

export const INITIAL_BOOKINGS: FacilityBooking[] = [
  {
    id: 'bk-01',
    bookingId: 'DSCC-FAC-2026-309',
    facilityType: 'community_center',
    facilityNameEn: 'Dhanmondi Smart Community Hall',
    facilityNameBn: 'ধানমন্ডি স্মার্ট কমিউনিটি হল',
    wardNumber: 27,
    bookingDate: '2026-11-24',
    slot: 'evening',
    applicantName: 'Tanvir Ahmed Chowdhury',
    phone: '01711-482910',
    purpose: 'Community Civic Seminar',
    feeBdt: 12000,
    transactionId: 'NAGAD-22019481',
    status: 'confirmed',
    createdAt: '2026-11-10',
  },
  {
    id: 'bk-02',
    bookingId: 'DSCC-FAC-2026-314',
    facilityType: 'community_center',
    facilityNameEn: 'Mirpur-10 Municipal Auditorium',
    facilityNameBn: 'মিরপুর-১০ পৌর অডিটোরিয়াম',
    wardNumber: 12,
    bookingDate: '2026-11-22',
    slot: 'morning',
    applicantName: 'Anisur Rahman',
    phone: '01811-552019',
    purpose: 'Family Reception',
    feeBdt: 10000,
    transactionId: 'BKASH-44109283',
    status: 'confirmed',
    createdAt: '2026-11-11',
  },
];

export const FIELD_STAFF: FieldStaffMember[] = [
  {
    id: 'stf-01',
    nameEn: 'Eng. Tariqul Islam',
    nameBn: 'প্রকৌশলী তারিকুল ইসলাম',
    departmentEn: 'Civil Engineering & Roads',
    departmentBn: 'প্রকৌশল ও সড়ক বিভাগ',
    wardNumber: 12,
    phone: '01819-334901',
    activeTasks: 2,
  },
  {
    id: 'stf-02',
    nameEn: 'Md. Shafiqul Alam',
    nameBn: 'মো. শফিকুল আলম',
    departmentEn: 'Waste & Conservancy Dept.',
    departmentBn: 'বর্জ্য ও পরিচ্ছন্নতা বিভাগ',
    wardNumber: 24,
    phone: '01718-994022',
    activeTasks: 1,
  },
  {
    id: 'stf-03',
    nameEn: 'Karim Uddin Bhuiyan',
    nameBn: 'করিম উদ্দিন ভূঁইয়া',
    departmentEn: 'Electrical & Streetlight Unit',
    departmentBn: 'বিদ্যুৎ ও সড়কবাতি ইউনিট',
    wardNumber: 27,
    phone: '01912-661045',
    activeTasks: 1,
  },
  {
    id: 'stf-04',
    nameEn: 'Dr. Sadia Afrin',
    nameBn: 'ডা. সাদিয়া আফরিন',
    departmentEn: 'Public Health & Vector Control',
    departmentBn: 'জনস্বাস্থ্য ও মশক নিয়ন্ত্রণ',
    wardNumber: 32,
    phone: '01711-885409',
    activeTasks: 1,
  },
];

export const INITIAL_COMPLAINTS: Complaint[] = [
  {
    id: 'cmp-01',
    trackingId: 'CMP-2026-8492',
    citizenName: 'Mahmudul Hasan',
    phone: '01714-228901',
    wardNumber: 12,
    category: 'road_damage',
    departmentEn: 'Civil Engineering & Roads',
    departmentBn: 'প্রকৌশল ও সড়ক বিভাগ',
    title: 'Deep pothole near Mirpur-10 Roundabout East Lane',
    description:
      'Heavy monsoon wear has created a 1.5m pothole slowing bus traffic and risking two-wheeler safety near Block B gate.',
    latitude: 23.8069,
    longitude: 90.3687,
    locationLabel: 'Mirpur-10 Roundabout East, Ward 12',
    photoUrl: makeCivicPreviewSvg('Road Surface Damage', '#006A4E', 'Ward 12 · 23.8069°N, 90.3687°E'),
    assignedStaffId: 'stf-01',
    assignedStaffName: 'Eng. Tariqul Islam',
    status: 'in_progress',
    priority: 'urgent',
    createdAt: '2026-11-14T09:20:00Z',
    updatedAt: '2026-11-16T14:15:00Z',
  },
  {
    id: 'cmp-02',
    trackingId: 'CMP-2026-8510',
    citizenName: 'Sharmin Akter',
    phone: '01815-441092',
    wardNumber: 27,
    category: 'street_light',
    departmentEn: 'Electrical & Streetlight Unit',
    departmentBn: 'বিদ্যুৎ ও সড়কবাতি ইউনিট',
    title: 'Three LED poles dark along Dhanmondi Road 9/A',
    description: 'Poles #14, #15, and #16 have been non-functional since Tuesday evening creating a dark stretch near the school.',
    latitude: 23.7461,
    longitude: 90.3742,
    locationLabel: 'Dhanmondi Road 9/A, Ward 27',
    photoUrl: makeCivicPreviewSvg('Streetlight Outage Report', '#1E3A8A', 'Ward 27 · Poles #14–#16'),
    proofPhotoUrl: makeCivicPreviewSvg('LED Driver Replaced & Tested', '#059669', 'Resolved by Karim Uddin Bhuiyan'),
    assignedStaffId: 'stf-03',
    assignedStaffName: 'Karim Uddin Bhuiyan',
    status: 'resolved',
    priority: 'high',
    rating: 5,
    feedback: 'Repaired within 18 hours with bright LED replacement. Great work!',
    resolutionNote: 'Replaced faulty relay timer and restored all 3 smart LED luminaires.',
    createdAt: '2026-11-10T18:30:00Z',
    updatedAt: '2026-11-11T11:45:00Z',
  },
  {
    id: 'cmp-03',
    trackingId: 'CMP-2026-8544',
    citizenName: 'Rezaul Karim',
    phone: '01911-338291',
    wardNumber: 24,
    category: 'drainage',
    departmentEn: 'Drainage & Storm Water Dept.',
    departmentBn: 'ড্রেনেজ ও পানি নিষ্কাশন বিভাগ',
    title: 'Blocked storm drain inlet behind Azimpur Colony',
    description: 'Plastic debris clogging main culvert causing water accumulation near mosque lane.',
    latitude: 23.7275,
    longitude: 90.3849,
    locationLabel: 'Azimpur Gate Lane, Ward 24',
    photoUrl: makeCivicPreviewSvg('Drainage Culvert Blockage', '#B45309', 'Ward 24 · Culvert #08'),
    assignedStaffId: 'stf-01',
    assignedStaffName: 'Eng. Tariqul Islam',
    status: 'assigned',
    priority: 'high',
    createdAt: '2026-11-17T08:10:00Z',
    updatedAt: '2026-11-17T10:30:00Z',
  },
  {
    id: 'cmp-04',
    trackingId: 'CMP-2026-8589',
    citizenName: 'Nadia Sultana',
    phone: '01722-908112',
    wardNumber: 32,
    category: 'waste',
    departmentEn: 'Waste & Conservancy Dept.',
    departmentBn: 'বর্জ্য ও পরিচ্ছন্নতা বিভাগ',
    title: 'Overflowing secondary waste bin near Tajmahal Park',
    description: 'Needs additional compacting truck pickup after weekend market.',
    latitude: 23.7654,
    longitude: 90.3621,
    locationLabel: 'Tajmahal Road Corner, Ward 32',
    photoUrl: makeCivicPreviewSvg('Secondary Bin Overflow', '#059669', 'Ward 32 · Transfer Point'),
    status: 'pending',
    priority: 'normal',
    createdAt: '2026-11-18T07:45:00Z',
    updatedAt: '2026-11-18T07:45:00Z',
  },
];

export const BASE_GIS_MARKERS: GisMarker[] = [
  {
    id: 'gis-h1',
    type: 'hospital',
    titleEn: 'Dhaka Smart Urban Maternity Hospital',
    titleBn: 'ঢাকা স্মার্ট নগর মাতৃসদন হাসপাতাল',
    wardNumber: 27,
    x: 41,
    y: 50,
    latitude: 23.745,
    longitude: 90.376,
    statusEn: 'Open 24/7 · Emergency Ready',
    statusBn: '২৪ ঘণ্টা খোলা · জরুরি সেবা চালু',
    detailsEn: '65 beds, Dengue diagnostic corner & maternal ICU.',
    detailsBn: '৬৫ শয্যা, ডেঙ্গু শনাক্তকরণ কর্নার ও মাতৃ আইসিইউ।',
    addressEn: 'Plot 14, Road 27, Dhanmondi, Dhaka-1209',
    addressBn: 'প্লট ১৪, রোড ২৭, ধানমন্ডি, ঢাকা-১২০৯',
    phone: '+880 2-9661234',
    operatingHoursEn: '24 Hours / 7 Days',
    operatingHoursBn: '২৪ ঘণ্টা / প্রতিদিন',
  },
  {
    id: 'gis-h2',
    type: 'hospital',
    titleEn: 'Mirpur Municipal Primary Health Complex',
    titleBn: 'মিরপুর পৌর প্রাথমিক স্বাস্থ্য কমপ্লেক্স',
    wardNumber: 12,
    x: 22,
    y: 31,
    latitude: 23.808,
    longitude: 90.367,
    statusEn: 'Open 08:00 AM – 10:00 PM',
    statusBn: 'খোলা সকাল ০৮:০০ – রাত ১০:০০',
    detailsEn: 'Free vaccination, outpatient clinic & pharmacy.',
    detailsBn: 'বিনামূল্যে টিকাদান, বহির্বিভাগ ও ফার্মেসি।',
    addressEn: 'Section 12, Block C, Mirpur, Dhaka-1216',
    addressBn: 'সেকশন ১২, ব্লক সি, মিরপুর, ঢাকা-১২১৬',
    phone: '+880 2-9015543',
    operatingHoursEn: '08:00 AM – 10:00 PM (Daily)',
    operatingHoursBn: 'সকাল ০৮:০০ – রাত ১০:০০ (প্রতিদিন)',
  },
  {
    id: 'gis-t1',
    type: 'public_toilet',
    titleEn: 'Motijheel Smart Solar Public Toilet',
    titleBn: 'মতিঝিল স্মার্ট সোলার পাবলিক টয়লেট',
    wardNumber: 36,
    x: 59,
    y: 63,
    latitude: 23.733,
    longitude: 90.417,
    statusEn: 'Operational · Wheelchair Accessible',
    statusBn: 'চালু · হুইলচেয়ার বান্ধব',
    detailsEn: 'Separate male/female/accessible cabins with water purifier.',
    detailsBn: 'নারী-পুরুষ ও বিশেষ চাহিদাসম্পন্নদের পৃথক ব্যবস্থা ও বিশুদ্ধ পানি।',
    addressEn: 'Near Shapla Chattar, Motijheel C/A, Dhaka-1000',
    addressBn: 'শাপলা চত্বরের নিকট, মতিঝিল বা/এ, ঢাকা-১০০০',
    phone: '+880 1711-002233',
    operatingHoursEn: '06:00 AM – 11:00 PM',
    operatingHoursBn: 'সকাল ০৬:০০ – রাত ১১:০০',
  },
  {
    id: 'gis-t2',
    type: 'public_toilet',
    titleEn: 'Gulshan-1 Circle Smart Restroom',
    titleBn: 'গুলশান-১ সার্কেল স্মার্ট রেস্টরুম',
    wardNumber: 19,
    x: 67,
    y: 29,
    latitude: 23.78,
    longitude: 90.416,
    statusEn: 'Operational · Attendant On-Site',
    statusBn: 'চালু · সার্বক্ষণিক তত্ত্বাবধায়ক',
    detailsEn: 'Automated hygiene sanitization every 30 minutes.',
    detailsBn: 'প্রতি ৩০ মিনিটে স্বয়ংক্রিয় জীবাণুমুক্তকরণ ব্যবস্থা।',
    addressEn: 'Gulshan 1 Roundabout (South East Corner), Dhaka-1212',
    addressBn: 'গুলশান ১ গোলচত্বর (দক্ষিণ-পূর্ব কোণ), ঢাকা-১২১২',
    phone: '+880 1819-445566',
    operatingHoursEn: '06:00 AM – 11:30 PM',
    operatingHoursBn: 'সকাল ০৬:০০ – রাত ১১:৩০',
  },
  {
    id: 'gis-p1',
    type: 'park',
    titleEn: 'Dhanmondi Lakefront Eco Park',
    titleBn: 'ধানমন্ডি লেকফ্রন্ট ইকো পার্ক',
    wardNumber: 27,
    x: 35,
    y: 55,
    latitude: 23.743,
    longitude: 90.371,
    statusEn: 'Open · Jogging Track Lit',
    statusBn: 'খোলা · আলোকিত জগিং ট্র্যাক',
    detailsEn: '3.2 km pedestrian loop, solar benches & free Wi-Fi zone.',
    detailsBn: '৩.২ কি.মি. হাঁটার পথ, সোলার বেঞ্চ ও ফ্রি ওয়াই-ফাই জোন।',
    addressEn: 'Lake Road, Sector 8A, Dhanmondi, Dhaka-1209',
    addressBn: 'লেক রোড, সেক্টর ৮এ, ধানমন্ডি, ঢাকা-১২০৯',
    phone: '+880 2-8141200',
    operatingHoursEn: '05:00 AM – 10:00 PM',
    operatingHoursBn: 'সকাল ০৫:০০ – রাত ১০:০০',
  },
  {
    id: 'gis-p2',
    type: 'park',
    titleEn: 'Uttara Sector-6 Botanical Playground',
    titleBn: 'উত্তরা সেক্টর-৬ বোটানিক্যাল খেলার মাঠ',
    wardNumber: 41,
    x: 52,
    y: 15,
    latitude: 23.869,
    longitude: 90.402,
    statusEn: 'Open · Newly Renovated',
    statusBn: 'খোলা · নবনির্মিত',
    detailsEn: 'Kids play zone, open-air gym and rainwater retention basin.',
    detailsBn: 'শিশুদের খেলার স্থান, ওপেন জিম ও বৃষ্টির পানি সংরক্ষণ জলাধার।',
    addressEn: 'Road 4, Sector 6, Uttara Model Town, Dhaka-1230',
    addressBn: 'রোড ৪, সেক্টর ৬, উত্তরা মডেল টাউন, ঢাকা-১২৩০',
    phone: '+880 2-8951122',
    operatingHoursEn: '05:30 AM – 09:30 PM',
    operatingHoursBn: 'সকাল ০৫:৩০ – রাত ০৯:৩০',
  },
  {
    id: 'gis-w1',
    type: 'waste_point',
    titleEn: 'Ward 24 Secondary Transfer Station (STS)',
    titleBn: 'ওয়ার্ড ২৪ সেকেন্ডারি ট্রান্সফার স্টেশন (STS)',
    wardNumber: 24,
    x: 31,
    y: 72,
    latitude: 23.726,
    longitude: 90.382,
    statusEn: 'Active Compactor · Zero Odor Seal',
    statusBn: 'কম্প্যাক্টর চালু · দুর্গন্ধমুক্ত',
    detailsEn: 'Handles 42 tons/day with automated compactor haulage.',
    detailsBn: 'দৈনিক ৪২ টন বর্জ্য স্বয়ংক্রিয় কম্প্যাক্টরে প্রক্রিয়াজাত হয়।',
    addressEn: 'Shahid Nagar Road, Lalbagh, Dhaka-1211',
    addressBn: 'শহীদ নগর রোড, লালবাগ, ঢাকা-১২১১',
    phone: '+880 1713-998877',
    operatingHoursEn: '10:00 PM – 06:00 AM (Collection)',
    operatingHoursBn: 'রাত ১০:০০ – সকাল ০৬:০০ (বর্জ্য অপসারণ)',
  },
  {
    id: 'gis-w2',
    type: 'waste_point',
    titleEn: 'Demra Eco-Sorting Transfer Hub',
    titleBn: 'ডেমরা ইকো-সর্টিং ট্রান্সফার হাব',
    wardNumber: 48,
    x: 76,
    y: 75,
    latitude: 23.719,
    longitude: 90.471,
    statusEn: 'Active · Organic Composting',
    statusBn: 'চালু · জৈব সার প্রক্রিয়াজাতকরণ',
    detailsEn: 'Segregates recyclable plastics and organic market waste.',
    detailsBn: 'প্লাস্টিক রিসাইক্লিং ও জৈব সার তৈরির আধুনিক কেন্দ্র।',
    addressEn: 'Staff Quarter Road, Demra, Dhaka-1360',
    addressBn: 'স্টাফ কোয়ার্টার রোড, ডেমরা, ঢাকা-১৩৬০',
    phone: '+880 1713-556677',
    operatingHoursEn: '08:00 PM – 05:00 AM',
    operatingHoursBn: 'রাত ০৮:০০ – ভোর ০৫:০০',
  },
  {
    id: 'gis-r1',
    type: 'road_digging',
    titleEn: 'Green Road Fiber & Storm Drain Tie-In',
    titleBn: 'গ্রীন রোড ফাইবার ও স্টর্ম ড্রেন সংযোগ কাজ',
    wardNumber: 27,
    x: 44,
    y: 56,
    latitude: 23.748,
    longitude: 90.384,
    statusEn: 'Active Permit (11 PM – 5 AM)',
    statusBn: 'অনুমোদিত খনন (রাত ১১টা – ভোর ৫টা)',
    detailsEn: 'Permit DSCC-RD-2026-0791 · Restoration due 25 Nov.',
    detailsBn: 'অনুমতি DSCC-RD-2026-0791 · পুনর্নির্মাণ ২৫ নভেম্বর।',
    addressEn: 'Green Road intersection to Panthapath, Dhaka-1205',
    addressBn: 'গ্রীন রোড মোড় হতে পান্থপথ সংযোগ, ঢাকা-১২০৫',
    phone: '+880 2-9670011',
    operatingHoursEn: '11:00 PM – 05:00 AM (Night Work Only)',
    operatingHoursBn: 'রাত ১১:০০ – ভোর ০৫:০০ (শুধু নৈশকালীন কাজ)',
  },
  {
    id: 'gis-r2',
    type: 'road_digging',
    titleEn: 'Motijheel Circular Road Ducting',
    titleBn: 'মতিঝিল সার্কুলার রোড ডাক্টিং কাজ',
    wardNumber: 36,
    x: 54,
    y: 67,
    latitude: 23.731,
    longitude: 90.415,
    statusEn: 'Permit Under Review',
    statusBn: 'অনুমোদন পর্যালোচনাধীন',
    detailsEn: '45m underground utility trenching request.',
    detailsBn: '৪৫ মিটার ভূগর্ভস্থ ইউটিলিটি ট্রেঞ্চিং আবেদন।',
    addressEn: 'Dilkusha Commercial Area, Motijheel, Dhaka-1000',
    addressBn: 'দিলকুশা বাণিজ্যিক এলাকা, মতিঝিল, ঢাকা-১০০০',
    phone: '+880 2-9552211',
    operatingHoursEn: 'Pending Engineering Approval',
    operatingHoursBn: 'প্রকৌশল অনুমোদন প্রক্রিয়াধীন',
  },
];

export const INITIAL_BUDGETS: WardBudget[] = [
  { wardNumber: 12, wardLabel: 'Ward 12', allocatedCrore: 42.5, spentCrore: 34.8, utilizationPercent: 82 },
  { wardNumber: 19, wardLabel: 'Ward 19', allocatedCrore: 38.0, spentCrore: 31.2, utilizationPercent: 82 },
  { wardNumber: 24, wardLabel: 'Ward 24', allocatedCrore: 46.2, spentCrore: 39.7, utilizationPercent: 86 },
  { wardNumber: 27, wardLabel: 'Ward 27', allocatedCrore: 35.4, spentCrore: 29.8, utilizationPercent: 84 },
  { wardNumber: 32, wardLabel: 'Ward 32', allocatedCrore: 40.8, spentCrore: 30.1, utilizationPercent: 74 },
  { wardNumber: 36, wardLabel: 'Ward 36', allocatedCrore: 49.0, spentCrore: 41.5, utilizationPercent: 85 },
  { wardNumber: 41, wardLabel: 'Ward 41', allocatedCrore: 37.6, spentCrore: 27.9, utilizationPercent: 74 },
  { wardNumber: 48, wardLabel: 'Ward 48', allocatedCrore: 52.4, spentCrore: 40.2, utilizationPercent: 77 },
];

export const INITIAL_PROJECTS: DevelopmentProject[] = [
  {
    id: 'prj-01',
    titleEn: 'Mirpur-10 to Pallabi Smart Box Culvert & Footpath Upgrade',
    titleBn: 'মিরপুর-১০ থেকে পল্লবী স্মার্ট বক্স কালভার্ট ও ফুটপাত উন্নয়ন',
    wardNumber: 12,
    contractorEn: 'Padma Civil Engineering Consortium',
    contractorBn: 'পদ্মা সিভিল ইঞ্জিনিয়ারিং কনসোর্টিয়াম',
    budgetBdt: 184000000,
    progressPercent: 78,
    deadline: '2027-01-30',
    status: 'on_track',
    sectorEn: 'Drainage & Roads',
    sectorBn: 'ড্রেনেজ ও সড়ক',
  },
  {
    id: 'prj-02',
    titleEn: 'Dhanmondi Lakefront Solar Lighting & Eco-Walkway',
    titleBn: 'ধানমন্ডি লেকফ্রন্ট সোলার লাইটিং ও ইকো-ওয়াকওয়ে',
    wardNumber: 27,
    contractorEn: 'GreenGrid Infrastructure Ltd.',
    contractorBn: 'গ্রীনগ্রিড ইনফ্রাস্ট্রাকচার লি.',
    budgetBdt: 92500000,
    progressPercent: 100,
    deadline: '2026-10-15',
    status: 'completed',
    sectorEn: 'Parks & Lighting',
    sectorBn: 'পার্ক ও সড়কবাতি',
  },
  {
    id: 'prj-03',
    titleEn: 'Lalbagh Heritage Street Paving & Underground Wiring',
    titleBn: 'লালবাগ হেরিটেজ সড়ক পেভিং ও ভূগর্ভস্থ বৈদ্যুতিক লাইন',
    wardNumber: 24,
    contractorEn: 'Meghna Builders & Associates',
    contractorBn: 'মেঘনা বিল্ডার্স অ্যান্ড অ্যাসোসিয়েটস',
    budgetBdt: 146000000,
    progressPercent: 64,
    deadline: '2027-03-20',
    status: 'on_track',
    sectorEn: 'Urban Renewal',
    sectorBn: 'নগর উন্নয়ন',
  },
  {
    id: 'prj-04',
    titleEn: 'Demra-Jatrabari Automated Waste Transfer Terminal',
    titleBn: 'ডেমরা-যাত্রাবাড়ী স্বয়ংক্রিয় বর্জ্য ট্রান্সফার টার্মিনাল',
    wardNumber: 48,
    contractorEn: 'CleanTech Municipal Systems',
    contractorBn: 'ক্লিনটেক মিউনিসিপ্যাল সিস্টেমস',
    budgetBdt: 215000000,
    progressPercent: 48,
    deadline: '2027-05-10',
    status: 'delayed',
    sectorEn: 'Waste Management',
    sectorBn: 'বর্জ্য ব্যবস্থাপনা',
  },
  {
    id: 'prj-05',
    titleEn: 'Motijheel Smart Traffic & Pedestrian Underpass Escalators',
    titleBn: 'মতিঝিল স্মার্ট ট্রাফিক ও পথচারী আন্ডারপাস এসকেলেটর',
    wardNumber: 36,
    contractorEn: 'Apex Urban Transit Corp.',
    contractorBn: 'অ্যাপেক্স আরবান ট্রানজিট কর্পোরেশন',
    budgetBdt: 162000000,
    progressPercent: 88,
    deadline: '2026-12-28',
    status: 'on_track',
    sectorEn: 'Mobility & Safety',
    sectorBn: 'যাতায়াত ও নিরাপত্তা',
  },
];

interface PersistedState {
  applications: ServiceApplication[];
  taxRecords: HoldingTaxRecord[];
  bookings: FacilityBooking[];
  complaints: Complaint[];
  notices: NoticeItem[];
}

function getDefaultState(): PersistedState {
  return {
    applications: INITIAL_APPLICATIONS,
    taxRecords: INITIAL_TAX_RECORDS,
    bookings: INITIAL_BOOKINGS,
    complaints: INITIAL_COMPLAINTS,
    notices: INITIAL_NOTICES,
  };
}

function readState(): PersistedState {
  if (typeof window === 'undefined') {
    return getDefaultState();
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultState();
    const parsed = JSON.parse(raw) as Partial<PersistedState>;
    return {
      applications: parsed.applications ?? INITIAL_APPLICATIONS,
      taxRecords: parsed.taxRecords ?? INITIAL_TAX_RECORDS,
      bookings: parsed.bookings ?? INITIAL_BOOKINGS,
      complaints: parsed.complaints ?? INITIAL_COMPLAINTS,
      notices: parsed.notices ?? INITIAL_NOTICES,
    };
  } catch {
    return getDefaultState();
  }
}

function writeState(state: PersistedState): boolean {
  if (typeof window === 'undefined') return false;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch {
    return false;
  }
}

const delay = (ms = 180) => new Promise((resolve) => setTimeout(resolve, ms));

function makeHash(seed: string): string {
  let acc = 2166136261;
  for (let i = 0; i < seed.length; i += 1) {
    acc ^= seed.charCodeAt(i);
    acc = Math.imul(acc, 16777619);
  }
  return `SHA256:${Math.abs(acc).toString(16).toUpperCase().padStart(8, '0')}9F4C2A1B`;
}

export const mockApi = {
  // Notices
  async getNotices(category?: NoticeCategory | 'all', query?: string): Promise<NoticeItem[]> {
    await delay(120);
    const { notices } = readState();
    return notices.filter((item) => {
      const catOk = !category || category === 'all' || item.category === category;
      if (!catOk) return false;
      if (!query?.trim()) return true;
      const q = query.toLowerCase();
      return (
        item.titleEn.toLowerCase().includes(q) ||
        item.titleBn.toLowerCase().includes(q) ||
        item.summaryEn.toLowerCase().includes(q) ||
        item.summaryBn.toLowerCase().includes(q) ||
        item.referenceCode.toLowerCase().includes(q)
      );
    });
  },

  async createNotice(payload: Omit<NoticeItem, 'id' | 'publishedAt' | 'referenceCode'>): Promise<NoticeItem> {
    await delay(200);
    const state = readState();
    const created: NoticeItem = {
      ...payload,
      id: `not-${Date.now()}`,
      publishedAt: new Date().toISOString().slice(0, 10),
      referenceCode: `DSCC/ADM/2026/${Math.floor(500 + Math.random() * 499)}`,
    };
    state.notices = [created, ...state.notices];
    writeState(state);
    return created;
  },

  async deleteNotice(id: string): Promise<void> {
    await delay(150);
    const state = readState();
    state.notices = state.notices.filter((n) => n.id !== id);
    writeState(state);
  },

  // Wards
  async getWards(): Promise<WardInfo[]> {
    await delay(80);
    return INITIAL_WARDS;
  },

  // Applications (Trade License, Certificates, Road Digging)
  async getApplications(): Promise<ServiceApplication[]> {
    await delay(120);
    return readState().applications;
  },

  async submitApplication(input: {
    citizenId?: string;
    type: ApplicationType;
    applicantName: string;
    applicantNameBn?: string;
    nid: string;
    phone: string;
    wardNumber: number;
    businessName?: string;
    businessCategory?: string;
    address: string;
    feeBdt: number;
    paymentMethod: PaymentMethod;
    details?: Record<string, string | number>;
  }): Promise<{ application: ServiceApplication; receipt: PaymentReceipt }> {
    await delay(300);
    const state = readState();
    const prefixMap: Record<ApplicationType, string> = {
      trade_license: 'TL',
      birth_certificate: 'BC',
      citizen_certificate: 'CERT',
      road_digging: 'RD',
    };
    const serial = Math.floor(1000 + Math.random() * 8999);
    const referenceId = `DSCC-${prefixMap[input.type]}-2026-${serial}`;
    const transactionId = `${input.paymentMethod.toUpperCase()}-${Math.floor(10000000 + Math.random() * 89999999)}`;
    const nowDate = new Date().toISOString().slice(0, 10);

    const application: ServiceApplication = {
      id: `app-${Date.now()}`,
      referenceId,
      citizenId: input.citizenId,
      type: input.type,
      applicantName: input.applicantName,
      applicantNameBn: input.applicantNameBn,
      nid: input.nid,
      phone: input.phone,
      wardNumber: input.wardNumber,
      businessName: input.businessName,
      businessCategory: input.businessCategory,
      address: input.address,
      feeBdt: input.feeBdt,
      paymentStatus: 'paid',
      transactionId,
      status: input.type === 'citizen_certificate' ? 'approved' : 'pending',
      submittedAt: nowDate,
      reviewedAt: input.type === 'citizen_certificate' ? nowDate : undefined,
      reviewedBy: input.type === 'citizen_certificate' ? 'Automated Civil Registry Seal' : undefined,
      qrHash: makeHash(referenceId + input.nid),
      details: input.details,
    };

    state.applications = [application, ...state.applications];
    if (!writeState(state)) {
      throw new Error('Unable to save the application to local storage.');
    }

    return {
      application,
      receipt: {
        transactionId,
        method: input.paymentMethod,
        amountBdt: input.feeBdt,
        paidAt: new Date().toISOString(),
        referenceId,
        payerName: input.applicantName,
      },
    };
  },

  async updateApplicationStatus(
    id: string,
    status: ApplicationStatus,
    reviewerName: string
  ): Promise<ServiceApplication | null> {
    await delay(200);
    const state = readState();
    const idx = state.applications.findIndex((a) => a.id === id);
    if (idx === -1) return null;
    const updated: ServiceApplication = {
      ...state.applications[idx],
      status,
      reviewedAt: new Date().toISOString().slice(0, 10),
      reviewedBy: reviewerName,
    };
    state.applications[idx] = updated;
    writeState(state);
    return updated;
  },

  // Holding Tax
  calculateHoldingTax(input: HoldingTaxInput): HoldingTaxCalculation {
    const ratePerSqFt: Record<HoldingTaxInput['propertyType'], number> = {
      residential: 18,
      mixed: 28,
      commercial: 42,
      industrial: 35,
    };
    const roadMultiplier = input.roadWidthCategory === 'main_road' ? 1.15 : 1.0;
    const annualValuationBdt = Math.round(
      input.areaSqFt * Math.max(1, input.floors) * ratePerSqFt[input.propertyType] * roadMultiplier
    );
    const annualTaxBdt = Math.round(annualValuationBdt * 0.07);
    const conservancyFeeBdt = Math.round(annualValuationBdt * 0.02);
    const streetLightFeeBdt = Math.round(annualValuationBdt * 0.015);
    const totalPayableBdt = annualTaxBdt + conservancyFeeBdt + streetLightFeeBdt;
    const quarterlyTaxBdt = Math.round(totalPayableBdt / 4);
    return {
      annualValuationBdt,
      annualTaxBdt,
      quarterlyTaxBdt,
      conservancyFeeBdt,
      streetLightFeeBdt,
      totalPayableBdt,
    };
  },

  async getTaxRecords(): Promise<HoldingTaxRecord[]> {
    await delay(100);
    return readState().taxRecords;
  },

  async payHoldingTax(
    input: HoldingTaxInput,
    amountBdt: number,
    method: PaymentMethod
  ): Promise<{ record: HoldingTaxRecord; receipt: PaymentReceipt }> {
    await delay(260);
    const state = readState();
    const receiptId = `DSCC-TAX-2026-${Math.floor(1000 + Math.random() * 8999)}`;
    const transactionId = `${method.toUpperCase()}-${Math.floor(10000000 + Math.random() * 89999999)}`;
    const record: HoldingTaxRecord = {
      id: `tax-${Date.now()}`,
      receiptId,
      holdingNumber: input.holdingNumber,
      ownerName: input.ownerName,
      wardNumber: input.wardNumber,
      propertyType: input.propertyType,
      areaSqFt: input.areaSqFt,
      amountPaidBdt: amountBdt,
      fiscalYear: '2026-27',
      paymentMethod: method,
      transactionId,
      paidAt: new Date().toISOString().slice(0, 10),
      qrHash: makeHash(receiptId + input.holdingNumber),
    };
    state.taxRecords = [record, ...state.taxRecords];
    writeState(state);
    return {
      record,
      receipt: {
        transactionId,
        method,
        amountBdt,
        paidAt: new Date().toISOString(),
        referenceId: receiptId,
        payerName: input.ownerName,
      },
    };
  },

  // Facility Bookings
  async getBookings(): Promise<FacilityBooking[]> {
    await delay(100);
    return readState().bookings;
  },

  async bookFacility(input: {
    facilityType: FacilityType;
    facilityNameEn: string;
    facilityNameBn: string;
    wardNumber: number;
    bookingDate: string;
    slot: TimeSlot;
    applicantName: string;
    phone: string;
    purpose: string;
    feeBdt: number;
    paymentMethod: PaymentMethod;
  }): Promise<{ booking: FacilityBooking; receipt: PaymentReceipt }> {
    await delay(260);
    const state = readState();
    const bookingId = `DSCC-FAC-2026-${Math.floor(400 + Math.random() * 599)}`;
    const transactionId = `${input.paymentMethod.toUpperCase()}-${Math.floor(10000000 + Math.random() * 89999999)}`;
    const booking: FacilityBooking = {
      id: `bk-${Date.now()}`,
      bookingId,
      facilityType: input.facilityType,
      facilityNameEn: input.facilityNameEn,
      facilityNameBn: input.facilityNameBn,
      wardNumber: input.wardNumber,
      bookingDate: input.bookingDate,
      slot: input.slot,
      applicantName: input.applicantName,
      phone: input.phone,
      purpose: input.purpose,
      feeBdt: input.feeBdt,
      transactionId,
      status: 'confirmed',
      createdAt: new Date().toISOString().slice(0, 10),
    };
    state.bookings = [booking, ...state.bookings];
    writeState(state);
    return {
      booking,
      receipt: {
        transactionId,
        method: input.paymentMethod,
        amountBdt: input.feeBdt,
        paidAt: new Date().toISOString(),
        referenceId: bookingId,
        payerName: input.applicantName,
      },
    };
  },

  // Public QR Verification
  async verifyDocumentById(referenceId: string): Promise<VerificationResult | null> {
    await delay(180);
    const clean = referenceId.trim().toUpperCase();
    if (!clean) return null;
    const state = readState();

    const app = state.applications.find((a) => a.referenceId.toUpperCase() === clean);
    if (app) {
      const typeMap: Record<ApplicationType, { en: string; bn: string }> = {
        trade_license: { en: 'Digital Trade License', bn: 'ডিজিটাল ট্রেড লাইসেন্স' },
        birth_certificate: { en: 'Birth Registration Extract', bn: 'জন্ম নিবন্ধন সনদ' },
        citizen_certificate: { en: 'Citizen & Residency Certificate', bn: 'নাগরিকত্ব ও চারিত্রিক সনদ' },
        road_digging: { en: 'Road Excavation Permit', bn: 'রাস্তা খনন অনুমতিপত্র' },
      };
      return {
        valid: app.status !== 'rejected',
        referenceId: app.referenceId,
        documentTypeEn: typeMap[app.type].en,
        documentTypeBn: typeMap[app.type].bn,
        ownerName: app.businessName ? `${app.applicantName} (${app.businessName})` : app.applicantName,
        wardNumber: app.wardNumber,
        issuedAt: app.reviewedAt || app.submittedAt,
        expiresAt: app.type === 'trade_license' ? '2027-06-30' : undefined,
        status: app.status === 'approved' ? 'VERIFIED' : app.status === 'pending' ? 'PENDING' : 'REVOKED',
        authorityEn: app.reviewedBy || 'Dhaka Smart City Revenue & Registry',
        authorityBn: 'ঢাকা স্মার্ট সিটি কর্পোরেশন রাজস্ব ও নিবন্ধন বিভাগ',
        amountPaidBdt: app.feeBdt,
        qrHash: app.qrHash,
      };
    }

    const tax = state.taxRecords.find((t) => t.receiptId.toUpperCase() === clean);
    if (tax) {
      return {
        valid: true,
        referenceId: tax.receiptId,
        documentTypeEn: `Holding Tax Clearance (${tax.fiscalYear})`,
        documentTypeBn: `হোল্ডিং ট্যাক্স পরিশোধ রসিদ (${tax.fiscalYear})`,
        ownerName: `${tax.ownerName} · Holding ${tax.holdingNumber}`,
        wardNumber: tax.wardNumber,
        issuedAt: tax.paidAt,
        status: 'VERIFIED',
        authorityEn: 'DSCC Assessment & Revenue Collector',
        authorityBn: 'ডিএসসিসি কর নির্ধারণ ও রাজস্ব শাখা',
        amountPaidBdt: tax.amountPaidBdt,
        qrHash: tax.qrHash,
      };
    }

    const bk = state.bookings.find((b) => b.bookingId.toUpperCase() === clean);
    if (bk) {
      return {
        valid: true,
        referenceId: bk.bookingId,
        documentTypeEn: `Facility Reservation (${bk.facilityNameEn})`,
        documentTypeBn: `ফ্যাসিলিটি বুকিং পাস (${bk.facilityNameBn})`,
        ownerName: bk.applicantName,
        wardNumber: bk.wardNumber,
        issuedAt: bk.createdAt,
        status: 'VERIFIED',
        authorityEn: 'DSCC Social Welfare & Estate Office',
        authorityBn: 'ডিএসসিসি সমাজকল্যাণ ও সম্পত্তি বিভাগ',
        amountPaidBdt: bk.feeBdt,
        qrHash: makeHash(bk.bookingId),
      };
    }

    return null;
  },

  // Complaints & AI Auto-Routing
  autoRouteComplaint(category: ComplaintCategory, text = ''): {
    departmentEn: string;
    departmentBn: string;
    slaHours: number;
    priority: 'normal' | 'high' | 'urgent';
  } {
    const lower = text.toLowerCase();
    if (lower.includes('dengue') || lower.includes('ডেঙ্গু') || category === 'mosquito') {
      return {
        departmentEn: 'Public Health & Vector Control',
        departmentBn: 'জনস্বাস্থ্য ও মশক নিয়ন্ত্রণ বিভাগ',
        slaHours: 12,
        priority: 'urgent',
      };
    }
    if (lower.includes('water') || lower.includes('flood') || lower.includes('জলাবদ্ধ') || category === 'drainage') {
      return {
        departmentEn: 'Drainage & Storm Water Dept.',
        departmentBn: 'ড্রেনেজ ও পানি নিষ্কাশন বিভাগ',
        slaHours: 16,
        priority: 'high',
      };
    }
    if (lower.includes('light') || lower.includes('বাতি') || category === 'street_light') {
      return {
        departmentEn: 'Electrical & Streetlight Unit',
        departmentBn: 'বিদ্যুৎ ও সড়কবাতি ইউনিট',
        slaHours: 24,
        priority: 'high',
      };
    }
    if (lower.includes('garbage') || lower.includes('waste') || lower.includes('ময়লা') || category === 'waste') {
      return {
        departmentEn: 'Waste & Conservancy Dept.',
        departmentBn: 'বর্জ্য ও পরিচ্ছন্নতা বিভাগ',
        slaHours: 8,
        priority: 'normal',
      };
    }
    if (category === 'other') {
      return {
        departmentEn: 'Ward Operations & Public Space',
        departmentBn: 'ওয়ার্ড পরিচালনা ও জনপরিসর বিভাগ',
        slaHours: 48,
        priority: 'normal',
      };
    }
    return {
      departmentEn: 'Civil Engineering & Roads',
      departmentBn: 'প্রকৌশল ও সড়ক বিভাগ',
      slaHours: 24,
      priority: lower.includes('accident') || lower.includes('গর্ত') ? 'urgent' : 'high',
    };
  },

  async getComplaints(): Promise<Complaint[]> {
    await delay(120);
    return readState().complaints;
  },

  async getComplaintByTrackingId(trackingId: string): Promise<Complaint | null> {
    await delay(140);
    const clean = trackingId.trim().toUpperCase();
    return readState().complaints.find((c) => c.trackingId.toUpperCase() === clean) ?? null;
  },

  async submitComplaint(input: {
    citizenId?: string;
    citizenName: string;
    phone: string;
    wardNumber: number;
    category: ComplaintCategory;
    title: string;
    description: string;
    latitude?: number;
    longitude?: number;
    locationLabel: string;
    photoUrl?: string;
    photoIds?: string[];
  }): Promise<Complaint> {
    await delay(260);
    const state = readState();
    const route = this.autoRouteComplaint(input.category, `${input.title} ${input.description}`);
    const year = new Date().getFullYear();
    let trackingId = '';
    do {
      trackingId = `CMP-${year}-${Math.floor(1000 + Math.random() * 9000)}`;
    } while (state.complaints.some((complaint) => complaint.trackingId === trackingId));
    const created: Complaint = {
      id: `cmp-${Date.now()}`,
      trackingId,
      citizenId: input.citizenId,
      citizenName: input.citizenName,
      phone: input.phone,
      wardNumber: input.wardNumber,
      category: input.category,
      departmentEn: route.departmentEn,
      departmentBn: route.departmentBn,
      title: input.title,
      description: input.description,
      latitude: input.latitude,
      longitude: input.longitude,
      locationLabel: input.locationLabel,
      photoUrl: input.photoUrl || (input.photoIds
        ? undefined
        : makeCivicPreviewSvg(
            'Citizen Civic Report',
            '#006A4E',
            `Ward ${input.wardNumber}${input.latitude !== undefined ? ` · ${input.latitude.toFixed(4)}°N` : ''}`
          )),
      photoIds: input.photoIds,
      status: 'pending',
      priority: route.priority,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    state.complaints = [created, ...state.complaints];
    if (!writeState(state)) {
      throw new Error('Unable to save the complaint to local storage.');
    }
    return created;
  },

  async assignComplaint(complaintId: string, staffId: string): Promise<Complaint | null> {
    await delay(180);
    const state = readState();
    const idx = state.complaints.findIndex((c) => c.id === complaintId);
    const staff = FIELD_STAFF.find((s) => s.id === staffId);
    if (idx === -1 || !staff) return null;
    const updated: Complaint = {
      ...state.complaints[idx],
      assignedStaffId: staff.id,
      assignedStaffName: staff.nameEn,
      status: 'assigned',
      updatedAt: new Date().toISOString(),
    };
    state.complaints[idx] = updated;
    if (!writeState(state)) {
      throw new Error('Unable to save the complaint update to local storage.');
    }
    return updated;
  },

  async updateComplaintStatus(
    complaintId: string,
    status: ComplaintStatus,
    resolutionNote?: string,
    proofPhotoUrl?: string
  ): Promise<Complaint | null> {
    await delay(200);
    const state = readState();
    const idx = state.complaints.findIndex((c) => c.id === complaintId);
    if (idx === -1) return null;
    const prev = state.complaints[idx];
    const updated: Complaint = {
      ...prev,
      status,
      resolutionNote: resolutionNote ?? prev.resolutionNote,
      proofPhotoUrl:
        proofPhotoUrl ??
        (status === 'resolved'
          ? prev.proofPhotoUrl || makeCivicPreviewSvg('Field Resolution Completed', '#059669', `Verified · ${prev.trackingId}`)
          : prev.proofPhotoUrl),
      updatedAt: new Date().toISOString(),
    };
    state.complaints[idx] = updated;
    writeState(state);
    return updated;
  },

  async rateComplaint(complaintId: string, rating: number, feedback: string): Promise<Complaint | null> {
    await delay(150);
    const state = readState();
    const idx = state.complaints.findIndex((c) => c.id === complaintId);
    if (idx === -1) return null;
    const updated: Complaint = {
      ...state.complaints[idx],
      rating,
      feedback,
    };
    state.complaints[idx] = updated;
    writeState(state);
    return updated;
  },

  // GIS Map
  async getGisMarkers(): Promise<GisMarker[]> {
    await delay(100);
    const { complaints } = readState();
    const complaintMarkers: GisMarker[] = complaints
      .filter(
        (c): c is Complaint & { latitude: number; longitude: number } =>
          c.latitude != null && c.longitude != null
      )
      .map((c) => {
      const ward = INITIAL_WARDS.find((w) => w.wardNumber === c.wardNumber);
      const offsetX = ((c.longitude - 90.35) * 400) % 12;
      const offsetY = ((23.82 - c.latitude) * 400) % 12;
      return {
        id: `gis-${c.id}`,
        type: 'complaint',
        titleEn: `${c.trackingId}: ${c.title}`,
        titleBn: `${c.trackingId}: ${c.title}`,
        wardNumber: c.wardNumber,
        x: Math.min(88, Math.max(12, (ward?.mapX ?? 45) + offsetX - 4)),
        y: Math.min(88, Math.max(12, (ward?.mapY ?? 45) + offsetY - 4)),
        latitude: c.latitude,
        longitude: c.longitude,
        statusEn: c.status.replace('_', ' ').toUpperCase(),
        statusBn:
          c.status === 'resolved'
            ? 'সমাধান সম্পন্ন'
            : c.status === 'in_progress'
              ? 'কাজ চলমান'
              : c.status === 'assigned'
                ? 'মাঠকর্মী নির্ধারিত'
                : 'অপেক্ষমাণ',
        detailsEn: `${c.departmentEn} · ${c.locationLabel}`,
        detailsBn: `${c.departmentBn} · ${c.locationLabel}`,
      };
      });
    return [...BASE_GIS_MARKERS, ...complaintMarkers];
  },

  // Transparency & Analytics
  async getWardBudgets(): Promise<WardBudget[]> {
    await delay(100);
    return INITIAL_BUDGETS;
  },

  async getProjects(): Promise<DevelopmentProject[]> {
    await delay(100);
    return INITIAL_PROJECTS;
  },

  async getAdminStats() {
    await delay(120);
    const state = readState();
    const appRevenue = state.applications
      .filter((a) => a.paymentStatus === 'paid')
      .reduce((sum, a) => sum + a.feeBdt, 0);
    const taxRevenue = state.taxRecords.reduce((sum, t) => sum + t.amountPaidBdt, 0);
    const bookingRevenue = state.bookings.reduce((sum, b) => sum + b.feeBdt, 0);
    const pendingApps = state.applications.filter((a) => a.status === 'pending').length;
    const resolvedComplaints = state.complaints.filter((c) => c.status === 'resolved').length;
    return {
      totalRevenueBdt: 482500000 + appRevenue + taxRevenue + bookingRevenue,
      pendingApplications: pendingApps,
      resolvedComplaints,
      totalComplaints: state.complaints.length,
      activeCitizens: 284910 + state.applications.length,
      wardComplaintSeries: INITIAL_WARDS.map((w) => ({
        ward: `W-${w.wardNumber}`,
        open: state.complaints.filter((c) => c.wardNumber === w.wardNumber && c.status !== 'resolved').length + (w.wardNumber % 4),
        resolved: state.complaints.filter((c) => c.wardNumber === w.wardNumber && c.status === 'resolved').length + 14 + (w.wardNumber % 7),
      })),
      monthlyRevenueSeries: [
        { month: 'Jul', crore: 38.4 },
        { month: 'Aug', crore: 41.2 },
        { month: 'Sep', crore: 44.8 },
        { month: 'Oct', crore: 49.1 },
        { month: 'Nov', crore: 54.6 },
      ],
    };
  },

  // Smart Bilingual AI Assistant Simulator
  async askCityAssistant(
    query: string,
    lang: Language
  ): Promise<{ answer: string; actionHref?: string; actionLabel?: string }> {
    await delay(220);
    const q = query.toLowerCase();

    if (q.includes('ট্রেড') || q.includes('trade') || q.includes('license') || q.includes('লাইসেন্স')) {
      return {
        answer:
          lang === 'bn'
            ? 'নতুন ট্রেড লাইসেন্সের জন্য প্রয়োজন: (১) আবেদনকারীর জাতীয় পরিচয়পত্র (NID), (২) ভাড়ার চুক্তিপত্র বা মালিকানার দলিল, (৩) পাসপোর্ট সাইজ ছবি ও (৪) হোল্ডিং ট্যাক্স পরিশোধের রসিদ। নাগরিক পোর্টাল থেকে অনলাইনে আবেদন করে বিকাশ/নগদে ফি পরিশোধ করলেই QR-কোডযুক্ত সনদ পাবেন।'
            : 'For a Trade License (New/Renewal), you need: (1) Applicant NID, (2) Shop lease agreement or ownership deed, (3) Passport photo, and (4) Latest Holding Tax receipt. You can submit online in the Citizen Portal and get a QR-verified certificate.',
        actionHref: '/dashboard/citizen?tab=tradeLicense',
        actionLabel: lang === 'bn' ? 'ট্রেড লাইসেন্স আবেদন খুলুন' : 'Open Trade License Form',
      };
    }

    if (q.includes('tax') || q.includes('holding') || q.includes('হোল্ডিং') || q.includes('ট্যাক্স') || q.includes('কর')) {
      return {
        answer:
          lang === 'bn'
            ? 'হোল্ডিং ট্যাক্স ক্যালকুলেটরে আপনার ওয়ার্ড, ফ্লোর সংখ্যা ও আয়তন (বর্গফুট) লিখলেই স্বয়ংক্রিয়ভাবে করের পরিমাণ হিসাব হবে। ৩১ ডিসেম্বরের মধ্যে অনলাইনে পরিশোধে ১০% ছাড় রয়েছে এবং সাথে সাথে QR রসিদ পাওয়া যায়।'
            : 'Use our Holding Tax Calculator in the Citizen Portal—enter your Ward, square footage, and floors for an instant assessment. Paying online before December 31 grants a 10% rebate with an immediate QR receipt.',
        actionHref: '/dashboard/citizen?tab=holdingTax',
        actionLabel: lang === 'bn' ? 'হোল্ডিং ট্যাক্স ক্যালকুলেটর' : 'Open Tax Calculator',
      };
    }

    if (
      q.includes('complaint') ||
      q.includes('track') ||
      q.includes('অভিযোগ') ||
      q.includes('রাস্তা') ||
      q.includes('মশা') ||
      q.includes('ট্র্যাক')
    ) {
      return {
        answer:
          lang === 'bn'
            ? 'রাস্তা ভাঙা, জলাবদ্ধতা, ময়লা বা সড়কবাতির সমস্যা ছবি ও GPS লোকেশনসহ পাঠালে AI স্বয়ংক্রিয়ভাবে সংশ্লিষ্ট বিভাগে পৌঁছে দেয়। যেমন "CMP-2026-8492" দিয়ে লাইভ ট্র্যাকার থেকে বর্তমান অবস্থা দেখতে পারেন।'
            : 'Submit geo-tagged street, drainage, waste, or streetlight issues on our Complaints page. Our AI automatically routes them to the right department and provides a Tracking ID like CMP-2026-8492 to monitor live progress.',
        actionHref: '/complaints',
        actionLabel: lang === 'bn' ? 'অভিযোগ ও ট্র্যাকার দেখুন' : 'Go to Smart Complaints',
      };
    }

    if (
      q.includes('community') ||
      q.includes('book') ||
      q.includes('hall') ||
      q.includes('কমিউনিটি') ||
      q.includes('বুকিং') ||
      q.includes('কবরস্থান')
    ) {
      return {
        answer:
          lang === 'bn'
            ? 'কমিউনিটি সেন্টার, অডিটোরিয়াম ও কবরস্থান ব্যবস্থাপনার জন্য নাগরিক পোর্টালের ফ্যাসিলিটি বুকিং ক্যালেন্ডার থেকে ফাঁকা স্লট দেখে অনলাইনেই বুকিং নিশ্চিত করা যায়।'
            : 'You can check live morning, evening, and full-day availability for Municipal Community Centers and Cemetery services in the Citizen Portal Facility Calendar.',
        actionHref: '/dashboard/citizen?tab=facilityBooking',
        actionLabel: lang === 'bn' ? 'ফ্যাসিলিটি বুকিং দেখুন' : 'Open Facility Calendar',
      };
    }

    if (q.includes('verify') || q.includes('qr') || q.includes('যাচাই') || q.includes('সনদ')) {
      return {
        answer:
          lang === 'bn'
            ? 'যেকোনো ডিজিটাল ট্রেড লাইসেন্স, নাগরিক সনদ বা ট্যাক্স রসিদের সত্যতা যাচাই করতে "QR যাচাই" পেজে গিয়ে রেফারেন্স আইডি (যেমন: DSCC-TL-2026-4108) লিখুন।'
            : 'To verify any digital license, tax receipt, or citizen certificate, open the Verify QR page and enter the reference ID (such as DSCC-TL-2026-4108).',
        actionHref: '/verify',
        actionLabel: lang === 'bn' ? 'QR যাচাই পাতা খুলুন' : 'Open QR Verification',
      };
    }

    return {
      answer:
        lang === 'bn'
          ? 'আমি আপনাকে ট্রেড লাইসেন্স, হোল্ডিং ট্যাক্স, জিও-ট্যাগড অভিযোগ ট্র্যাকিং, কমিউনিটি সেন্টার বুকিং, ওয়ার্ড কাউন্সিলর তথ্য এবং QR সনদ যাচাইয়ে সাহায্য করতে পারি। অনুগ্রহ করে নির্দিষ্ট বিষয়টি লিখুন।'
          : 'I can assist you with Trade Licenses, Holding Tax calculations, Geo-Tagged Complaint tracking, Community Center bookings, Ward schedules, and QR Certificate verification. What would you like to do today?',
      actionHref: '/dashboard/citizen',
      actionLabel: lang === 'bn' ? 'নাগরিক পোর্টালে যান' : 'Explore Citizen Portal',
    };
  },

  // --- AUTHENTICATION & SESSION MANAGEMENT (BACKEND-READY) ---

  getStoredSession(): AuthUser | null {
    if (typeof window === 'undefined') return null;
    try {
      const raw = window.localStorage.getItem(AUTH_SESSION_KEY);
      if (!raw) return null;
      const storedUser = JSON.parse(raw) as AuthUser;
      const seededAvatar = SEEDED_AUTH_ACCOUNTS.find(
        (account) => account.id === storedUser.id
      )?.avatarUrl;
      return storedUser.avatarUrl || !seededAvatar
        ? storedUser
        : { ...storedUser, avatarUrl: seededAvatar };
    } catch {
      return null;
    }
  },

  saveSession(user: AuthUser): void {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(user));
    } catch {
      // ignore
    }
  },

  clearSession(): void {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.removeItem(AUTH_SESSION_KEY);
    } catch {
      // ignore
    }
  },

  async updateCitizenAccount(
    userId: string,
    profile: Pick<AuthUser, 'nameEn' | 'nameBn' | 'phone' | 'email' | 'wardNumber'>
  ): Promise<AuthUser | null> {
    const accounts = readAuthAccounts();
    const index = accounts.findIndex((account) => account.id === userId && account.role === 'citizen');
    if (index < 0) return null;

    const updated = { ...accounts[index], ...profile };
    accounts[index] = updated;
    if (!writeAuthAccounts(accounts)) {
      throw new Error('Unable to save the citizen profile.');
    }

    const safeUser = stripPassword(updated);
    this.saveSession(safeUser);
    return safeUser;
  },

  async changeCitizenPassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<boolean> {
    const accounts = readAuthAccounts();
    const index = accounts.findIndex(
      (account) => account.id === userId && account.role === 'citizen'
    );
    if (index < 0 || accounts[index].password !== currentPassword) return false;

    accounts[index] = { ...accounts[index], password: newPassword };
    if (!writeAuthAccounts(accounts)) {
      throw new Error('Unable to save the updated password.');
    }
    return true;
  },

  async loginCitizen(phoneInput: string, password: string): Promise<AuthResponse> {
    await delay(220);
    const cleanPhone = normalizePhone(phoneInput);
    if (!/^01[3-9]\d{8}$/.test(cleanPhone)) {
      return {
        success: false,
        errorEn: 'Please enter a valid 11-digit Bangladeshi mobile number (e.g., 017XXXXXXXX).',
        errorBn: 'অনুগ্রহ করে সঠিক ১১ ডিজিটের বাংলাদেশি মোবাইল নম্বর লিখুন (যেমন: 017XXXXXXXX)।',
      };
    }

    const accounts = readAuthAccounts();
    const matched = accounts.find(
      (a) => a.role === 'citizen' && normalizePhone(a.phone || '') === cleanPhone && a.password === password
    );

    if (!matched) {
      return {
        success: false,
        errorEn: 'Invalid mobile number or password. Please check your credentials.',
        errorBn: 'মোবাইল নম্বর অথবা পাসওয়ার্ড সঠিক নয়। অনুগ্রহ করে আবার যাচাই করুন।',
      };
    }

    const safeUser = stripPassword(matched);
    this.saveSession(safeUser);
    return { success: true, user: safeUser };
  },

  async loginOfficial(
    identifierInput: string,
    password: string,
    selectedRole: OfficialRole
  ): Promise<AuthResponse> {
    await delay(220);
    const cleanId = identifierInput.trim().toLowerCase();
    if (!cleanId || !password.trim()) {
      return {
        success: false,
        errorEn: 'Employee ID / Email and password are required.',
        errorBn: 'অফিসিয়াল আইডি / ইমেইল এবং পাসওয়ার্ড আবশ্যক।',
      };
    }

    const accounts = readAuthAccounts();
    const matched = accounts.find(
      (a) =>
        a.role === selectedRole &&
        ((a.email && a.email.toLowerCase() === cleanId) ||
          (a.employeeId && a.employeeId.toLowerCase() === cleanId)) &&
        a.password === password
    );

    if (!matched) {
      return {
        success: false,
        errorEn: 'Invalid official credentials for the selected role.',
        errorBn: 'নির্বাচিত পদের জন্য অফিসিয়াল আইডি বা পাসওয়ার্ড সঠিক নয়।',
      };
    }

    const safeUser = stripPassword(matched);
    this.saveSession(safeUser);
    return { success: true, user: safeUser };
  },

  async registerCitizen(payload: CitizenRegistrationPayload): Promise<AuthResponse> {
    await delay(260);
    const cleanPhone = normalizePhone(payload.phone);
    const cleanNid = payload.nid.replace(/\s/g, '').trim();

    if (!payload.fullName.trim()) {
      return {
        success: false,
        errorEn: 'Full name is required.',
        errorBn: 'আপনার পূর্ণ নাম লিখুন।',
      };
    }
    if (!/^01[3-9]\d{8}$/.test(cleanPhone)) {
      return {
        success: false,
        errorEn: 'Please enter a valid 11-digit Bangladeshi mobile number.',
        errorBn: 'সঠিক ১১ ডিজিটের বাংলাদেশি মোবাইল নম্বর লিখুন।',
      };
    }
    if (!/^\d{10}$|^\d{17}$/.test(cleanNid)) {
      return {
        success: false,
        errorEn: 'NID number must be 10 or 17 digits.',
        errorBn: 'জাতীয় পরিচয়পত্র (NID) নম্বর ১০ অথবা ১৭ ডিজিটের হতে হবে।',
      };
    }
    if (payload.password.length < 6) {
      return {
        success: false,
        errorEn: 'Password must be at least 6 characters long.',
        errorBn: 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।',
      };
    }

    const accounts = readAuthAccounts();
    const duplicatePhone = accounts.some(
      (a) => a.role === 'citizen' && normalizePhone(a.phone || '') === cleanPhone
    );
    if (duplicatePhone) {
      return {
        success: false,
        errorEn: 'An account with this mobile number is already registered.',
        errorBn: 'এই মোবাইল নম্বর দিয়ে ইতিমধ্যে একটি অ্যাকাউন্ট নিবন্ধিত আছে।',
      };
    }

    const newAccount: StoredAuthAccount = {
      id: `usr-citizen-${Date.now()}`,
      role: 'citizen',
      nameEn: payload.fullName.trim(),
      nameBn: payload.fullName.trim(),
      titleEn: `Verified Citizen · Ward ${payload.wardNumber}`,
      titleBn: `নিবন্ধিত নাগরিক · ওয়ার্ড ${payload.wardNumber}`,
      phone: cleanPhone,
      nid: cleanNid,
      wardNumber: payload.wardNumber,
      password: payload.password,
    };

    writeAuthAccounts([newAccount, ...accounts]);
    const safeUser = stripPassword(newAccount);
    this.saveSession(safeUser);
    return { success: true, user: safeUser };
  },
};

export function getSampleCitizenPhoto(label: string): string {
  return makeCivicPreviewSvg(label, '#006A4E', 'Uploaded Field Inspection Photo');
}
