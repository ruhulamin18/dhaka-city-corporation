import {
  Baby,
  BadgeCheck,
  Download,
  FileEdit,
  FileSpreadsheet,
  FileText,
  Home,
  ShieldCheck,
  UserCheck,
  Users,
} from 'lucide-react';
import { CitizenServiceDefinition } from '@/types/citizen-service';
import { UPDATING_FEE_SCHEDULE } from './departments';

export const REGISTRATION_SERVICES: CitizenServiceDefinition[] = [
  {
    id: 'birth-registration',
    slug: 'birth-registration',
    categorySlug: 'registration-certificates',
    icon: Baby,
    title: { bn: 'জন্ম নিবন্ধন', en: 'Birth Registration' },
    shortDescription: {
      bn: 'নবজাতক ও ঢাকা সিটি কর্পোরেশন এলাকার নাগরিকদের নতুন জন্ম নিবন্ধনের জন্য অনলাইন আবেদন ও তথ্য নির্দেশিকা।',
      en: 'Online application and service guide for registering a new birth within Dhaka City Corporation jurisdiction.',
    },
    availability: 'active',
    requiresAuthForAction: true,
    interactionMode: 'application',
    primaryCtaLabel: { bn: 'আবেদন করুন', en: 'Apply Now' },
    keywords: ['birth', 'bdris', 'newborn', 'certificate', 'জন্ম', 'নিবন্ধন', 'নবজাতক', 'সনদ'],
    overview: {
      whatItIs: {
        bn: 'জন্ম নিবন্ধন হলো নাগরিকের পরিচয়, বয়স ও নাগরিকত্বের প্রথম সরকারি দালিলিক প্রমাণপত্র নিবন্ধন প্রক্রিয়া।',
        en: 'Birth registration is the official municipal civil registry process that records a citizen’s legal identity, date of birth, and parentage.',
      },
      whyNeeded: {
        bn: 'শিক্ষা প্রতিষ্ঠানে ভর্তি, পাসপোর্ট, জাতীয় পরিচয়পত্র, টিকা গ্রহণ এবং সরকারি সকল নাগরিক সেবায় জন্ম নিবন্ধন সনদ অপরিহার্য।',
        en: 'Required for school enrollment, passport issuance, national ID registration, immunization tracking, and official public services.',
      },
      whoCanUse: {
        bn: 'ঢাকা সিটি কর্পোরেশনের আওতাধীন ওয়ার্ডসমূহে জন্মগ্রহণকারী বা স্থায়ী/বর্তমান বাসিন্দা ও অভিভাবকগণ।',
        en: 'Parents, legal guardians, or residents born or permanently residing within Dhaka City Corporation wards.',
      },
      deliverable: {
        bn: 'রেফারেন্স নম্বরসহ নিবন্ধন আবেদন রসিদ এবং অনুমোদনের পর কিউআর-যাচাইযোগ্য ডিজিটাল জন্ম নিবন্ধন সনদ।',
        en: 'Tracked registration submission reference and a QR-verifiable digital birth registration certificate upon registrar approval.',
      },
    },
    eligibility: {
      isOfficiallyVerified: true,
      items: [
        {
          bn: 'ঢাকা সিটি কর্পোরেশনের আওতাধীন ওয়ার্ডে জন্মগ্রহণকারী অথবা স্থায়ী/বর্তমান ঠিকানার বাসিন্দা হতে হবে।',
          en: 'Must be born within or maintain a verified residential address inside Dhaka City Corporation wards.',
        },
        {
          bn: 'অপ্রাপ্তবয়স্কদের ক্ষেত্রে পিতা, মাতা বা আইনগত অভিভাবক আবেদন দাখিল করতে পারবেন।',
          en: 'For minors, a parent or legal guardian must submit the registration application.',
        },
        {
          bn: 'পিতা-মাতার হালনাগাদ জন্ম নিবন্ধন বা জাতীয় পরিচয়পত্রের তথ্য প্রযোজ্য সরকারি বিধিমালা অনুযায়ী যাচাই সাপেক্ষে।',
          en: 'Parental NID or birth registration details are verified according to applicable civil registry rules.',
        },
      ],
    },
    requiredDocuments: [
      {
        id: 'br-doc-1',
        title: { bn: 'হাসপাতালের জন্ম ছাড়পত্র বা ইপিআই (EPI) টিকা কার্ড', en: 'Hospital Discharge Slip or EPI Immunization Card' },
        note: { bn: 'প্রাতিষ্ঠানিক জন্মের প্রমাণ হিসেবে (পোর্টাল সিটিজেন চার্টার অনুযায়ী)', en: 'Proof of birth date and place (per portal Citizen Charter)' },
        required: true,
        verifiedSource: true,
      },
      {
        id: 'br-doc-2',
        title: { bn: 'পিতা ও মাতার জাতীয় পরিচয়পত্র (NID) এর কপি', en: 'Copies of Father’s and Mother’s National ID (NID)' },
        required: true,
        verifiedSource: true,
      },
      {
        id: 'br-doc-3',
        title: { bn: 'হালনাগাদ হোল্ডিং ট্যাক্স পরিশোধের রসিদ বা ঠিকানার প্রমাণপত্র', en: 'Updated Holding Tax Receipt or Proof of Residence' },
        required: true,
        verifiedSource: true,
      },
    ],
    steps: [
      {
        stepNumber: 1,
        title: { bn: 'সেবার শর্তাবলি ও কাগজপত্র প্রস্তুত করুন', en: 'Review Requirements & Prepare Documents' },
        description: {
          bn: 'প্রয়োজনীয় প্রমাণপত্র স্ক্যান বা স্পষ্ট ছবি (PDF/JPG/PNG) হিসেবে প্রস্তুত রাখুন।',
          en: 'Prepare scanned copies or clear images (PDF/JPG/PNG) of the required supporting documents.',
        },
      },
      {
        stepNumber: 2,
        title: { bn: 'নাগরিক অ্যাকাউন্টে লগইন করুন', en: 'Sign In to Citizen Account' },
        description: {
          bn: 'আবেদন শুরু করতে "আবেদন করুন" বাটনে ক্লিক করে আপনার নাগরিক পোর্টালে লগইন করুন।',
          en: 'Click Apply Now and authenticate with your Citizen Portal account.',
        },
      },
      {
        stepNumber: 3,
        title: { bn: 'আবেদন ফরম পূরণ ও নথি সংযুক্ত করুন', en: 'Complete Form & Attach Supporting Files' },
        description: {
          bn: 'আবেদনকারীর নাম, জন্ম তারিখ, জন্মস্থান, পিতা-মাতার তথ্য ও ঠিকানা নির্ভুলভাবে পূরণ করুন।',
          en: 'Enter applicant details, date and place of birth, parent details, and residential address accurately.',
        },
      },
      {
        stepNumber: 4,
        title: { bn: 'আবেদন দাখিল ও ট্র্যাকিং করুন', en: 'Submit & Track Progress' },
        description: {
          bn: 'আবেদন জমার পর প্রাপ্ত রেফারেন্স নম্বর দিয়ে আবেদনের সর্বশেষ অবস্থা অনুসরণ করুন।',
          en: 'Use the generated reference number to track review status from your dashboard.',
        },
      },
    ],
    fees: {
      isVerified: true,
      applicationFee: {
        bn: 'জন্মের ০–৪৫ দিনের মধ্যে বিনামূল্যে; এর পরে সরকারি নির্ধারিত ফি প্রযোজ্য (পোর্টাল সিটিজেন চার্টার)',
        en: 'Free within 0–45 days of birth; standard government statutory fee applies thereafter (Citizen Charter)',
      },
      serviceCharge: { bn: 'তথ্য হালনাগাদ করা হচ্ছে।', en: 'Information is being updated.' },
      processingTime: { bn: '২ – ৫ কর্মদিবস (পোর্টাল সিটিজেন চার্টার অনুযায়ী)', en: '2 – 5 working days (per portal Citizen Charter)' },
      paymentMethods: { bn: 'তথ্য হালনাগাদ করা হচ্ছে।', en: 'Information is being updated.' },
    },
    faqs: [
      {
        id: 'br-faq-1',
        question: { bn: 'নবজাতকের জন্ম নিবন্ধনের জন্য কোনো লগইন ছাড়া কি তথ্য দেখা যাবে?', en: 'Can I view birth registration requirements without logging in?' },
        answer: {
          bn: 'হ্যাঁ, প্রয়োজনীয় কাগজপত্র, যোগ্যতা, ধাপসমূহ ও যোগাযোগের তথ্য সবার জন্য উন্মুক্ত। শুধুমাত্র অনলাইন আবেদন দাখিলের সময় নাগরিক অ্যাকাউন্ট লগইন প্রয়োজন।',
          en: 'Yes. All requirements, eligibility rules, and steps are completely public. Login is only needed when submitting the online application.',
        },
      },
      {
        id: 'br-faq-2',
        question: { bn: 'আবেদন জমা দেওয়ার পর কীভাবে অবস্থা যাচাই করব?', en: 'How do I check my application status after submitting?' },
        answer: {
          bn: 'আবেদন দাখিলের পর একটি রেফারেন্স নম্বর (DSCC-BC-2026-...) পাবেন, যা নাগরিক ড্যাশবোর্ড ও কিউআর যাচাই পেজে ব্যবহার করা যাবে।',
          en: 'You will receive a tracking reference ID (DSCC-BC-2026-...) that can be monitored in your Citizen Dashboard or checked via QR Verification.',
        },
      },
    ],
    departmentId: 'birth_death',
    relatedSlugs: ['birth-certificate-correction', 'birth-certificate-verification', 'citizenship-certificate'],
    formFields: [
      { name: 'childNameBn', type: 'text', label: { bn: 'নিবন্ধনকারীর পূর্ণ নাম (বাংলায়)', en: 'Registrant Full Name (Bangla)' }, placeholder: { bn: 'যেমন: আরিয়ান আহমেদ', en: 'e.g. আরিয়ান আহমেদ' }, required: true },
      { name: 'applicantName', type: 'text', label: { bn: 'নিবন্ধনকারীর পূর্ণ নাম (ইংরেজিতে)', en: 'Registrant Full Name (English)' }, placeholder: { bn: 'e.g. Ariyan Ahmed', en: 'e.g. Ariyan Ahmed' }, required: true },
      { name: 'dateOfBirth', type: 'date', label: { bn: 'জন্ম তারিখ', en: 'Date of Birth' }, required: true },
      {
        name: 'gender',
        type: 'select',
        label: { bn: 'লিঙ্গ', en: 'Gender' },
        required: true,
        options: [
          { value: 'male', label: { bn: 'পুরুষ', en: 'Male' } },
          { value: 'female', label: { bn: 'নারী', en: 'Female' } },
          { value: 'other', label: { bn: 'অন্যান্য', en: 'Other' } },
        ],
      },
      { name: 'placeOfBirth', type: 'text', label: { bn: 'জন্মস্থান (হাসপাতাল / বাসা)', en: 'Place of Birth (Hospital / Residence)' }, required: true, fullWidth: true },
      { name: 'fatherName', type: 'text', label: { bn: 'পিতার পূর্ণ নাম', en: 'Father’s Full Name' }, required: true },
      { name: 'motherName', type: 'text', label: { bn: 'মাতার পূর্ণ নাম', en: 'Mother’s Full Name' }, required: true },
      { name: 'nid', type: 'text', label: { bn: 'পিতা/মাতা বা আবেদনকারীর এনআইডি নম্বর', en: 'Parent / Applicant NID Number' }, pattern: 'nid', required: true },
      { name: 'phone', type: 'tel', label: { bn: 'মোবাইল নম্বর', en: 'Mobile Number' }, pattern: 'bd_phone', required: true },
      { name: 'wardNumber', type: 'ward', label: { bn: 'ওয়ার্ড নম্বর', en: 'Ward Number' }, required: true },
      { name: 'address', type: 'textarea', label: { bn: 'স্থায়ী ও বর্তমান ঠিকানা', en: 'Permanent & Present Address' }, required: true, fullWidth: true },
      { name: 'supportingDocument', type: 'file', label: { bn: 'জন্মের প্রমাণপত্র (হাসপাতাল ছাড়পত্র / টিকা কার্ড)', en: 'Birth Proof Document (Hospital Slip / EPI Card)' }, accept: '.pdf,.jpg,.jpeg,.png', maxFileSizeMb: 5, required: true, fullWidth: true },
    ],
    backendIntegration: {
      supportedInPortal: true,
      existingHandler: 'mockApi.submitApplication',
      applicationType: 'birth_certificate',
      apiEndpointContract: 'POST /api/v1/civil-registry/birth-registrations',
      missingBackendNote: {
        bn: 'আবেদনটি নাগরিক পোর্টালে ট্র্যাকিংসহ সংরক্ষিত হয়; জাতীয় BDRIS সার্ভারের সাথে সরাসরি ডেটা সিঙ্ক প্রোডাকশন ব্যাকএন্ডের জন্য নির্ধারিত।',
        en: 'Submissions are recorded and trackable in the Citizen Portal; direct synchronization with the national BDRIS registry requires production backend APIs.',
      },
    },
  },
  {
    id: 'birth-certificate-correction',
    slug: 'birth-certificate-correction',
    categorySlug: 'registration-certificates',
    icon: FileEdit,
    title: { bn: 'জন্ম সনদ সংশোধন', en: 'Birth Certificate Correction' },
    shortDescription: {
      bn: 'বিদ্যমান জন্ম নিবন্ধন সনদে নাম, জন্ম তারিখ, পিতা-মাতার নাম বা ঠিকানার বানান সংশোধনের অনলাইন আবেদন।',
      en: 'Apply online to correct spelling, date of birth, parent names, or address details on an existing Birth Certificate.',
    },
    availability: 'active',
    requiresAuthForAction: true,
    interactionMode: 'application',
    primaryCtaLabel: { bn: 'সংশোধনের আবেদন করুন', en: 'Apply for Correction' },
    keywords: ['birth correction', 'bdris correction', 'spelling fix', 'জন্ম সনদ সংশোধন', 'সংশোধন', 'জন্ম নিবন্ধন'],
    overview: {
      whatItIs: {
        bn: 'পূর্বে নিবন্ধিত জন্ম সনদের যেকোনো মুদ্রণ বা তথ্যগত ত্রুটি (নাম, জন্ম তারিখ, পিতা-মাতার নাম, ঠিকানা) সংশোধনের আনুষ্ঠানিক সেবা।',
        en: 'Official civil registry amendment workflow to rectify clerical or factual inaccuracies on an issued birth certificate.',
      },
      whyNeeded: {
        bn: 'জাতীয় পরিচয়পত্র, পাসপোর্ট, শিক্ষা সনদ ও অন্যান্য সরকারি নথির সাথে জন্ম সনদের তথ্যের পূর্ণ মিল রাখতে সংশোধন প্রয়োজন।',
        en: 'Ensures full identity consistency across NID, passport, academic transcripts, and municipal records.',
      },
      whoCanUse: {
        bn: 'ঢাকা সিটি কর্পোরেশন হতে ইস্যুকৃত ১৭-ডিজিট ডিজিটাল জন্ম নিবন্ধন নম্বরধারী নাগরিক বা অভিভাবকগণ।',
        en: 'Citizens or guardians holding an existing Dhaka City Corporation digital birth registration number.',
      },
      deliverable: {
        bn: 'সংশোধন আবেদনের রেফারেন্স নম্বর এবং নিবন্ধকের অনুমোদনের পর হালনাগাদকৃত জন্ম সনদ।',
        en: 'Correction tracking reference and an amended digital birth certificate upon registrar verification.',
      },
    },
    eligibility: {
      isOfficiallyVerified: false,
      items: [
        { bn: 'অনলাইন ১৭-ডিজিট জন্ম নিবন্ধন নম্বর থাকতে হবে।', en: 'Must possess a valid 17-digit online birth registration number.' },
        { bn: 'প্রস্তাবিত সংশোধনের স্বপক্ষে বৈধ প্রমাণপত্র (এসএসসি সনদ, এনআইডি, পাসপোর্ট বা হলফনামা) সংযুক্ত করতে হবে (সরকারি যাচাইয়ের অপেক্ষায় রয়েছে)।', en: 'Valid supporting proof (SSC certificate, NID, passport, or affidavit) is required (awaiting official verification).' },
      ],
    },
    requiredDocuments: [
      { id: 'bcc-doc-1', title: { bn: 'বিদ্যমান জন্ম নিবন্ধন সনদের কপি', en: 'Copy of Existing Birth Certificate' }, required: true },
      { id: 'bcc-doc-2', title: { bn: 'সংশোধনের স্বপক্ষে প্রমাণপত্র (শিক্ষা সনদ / এনআইডি / পাসপোর্ট)', en: 'Supporting Evidence (Academic Certificate / NID / Passport)' }, required: true },
      { id: 'bcc-doc-3', title: { bn: 'পিতা-মাতার জাতীয় পরিচয়পত্র (প্রযোজ্য ক্ষেত্রে)', en: 'Parents’ NID Copies (if correcting parent details)' }, required: false },
    ],
    steps: [
      { stepNumber: 1, title: { bn: 'বিদ্যমান নিবন্ধন নম্বর ও প্রমাণপত্র প্রস্তুত রাখুন', en: 'Prepare Existing Registration ID & Proof' }, description: { bn: 'ভুল তথ্য ও সঠিক তথ্যের স্বপক্ষে দালিলিক প্রমাণ স্ক্যান করুন।', en: 'Scan documents verifying the accurate name, date, or parentage.' } },
      { stepNumber: 2, title: { bn: 'নাগরিক অ্যাকাউন্টে লগইন করে আবেদন করুন', en: 'Sign In & Submit Correction Form' }, description: { bn: 'কোন তথ্যটি সংশোধন করতে চান তা নির্বাচন করে সঠিক তথ্য লিখুন এবং নথি আপলোড করুন।', en: 'Select the fields to amend, enter corrected values, and upload supporting files.' } },
      { stepNumber: 3, title: { bn: 'আঞ্চলিক নিবন্ধকের যাচাই ও অনুমোদন', en: 'Registrar Verification & Approval' }, description: { bn: 'রেফারেন্স নম্বরের মাধ্যমে আবেদনের অগ্রগতি অনুসরণ করুন।', en: 'Track approval progress via your generated portal reference number.' } },
    ],
    fees: UPDATING_FEE_SCHEDULE,
    faqs: [
      {
        id: 'bcc-faq-1',
        question: { bn: 'জন্ম তারিখ সংশোধনের জন্য কী ধরনের প্রমাণপত্র প্রয়োজন?', en: 'What proof is accepted for correcting a Date of Birth?' },
        answer: {
          bn: 'শিক্ষা বোর্ডের সনদ, হাসপাতালের মূল জন্ম ছাড়পত্র বা প্রযোজ্য সরকারি বিধিমালা অনুযায়ী গ্রহণযোগ্য প্রমাণপত্র প্রয়োজন।',
          en: 'Board academic certificates, original hospital birth records, or other proof recognized under civil registration regulations.',
        },
      },
    ],
    departmentId: 'birth_death',
    relatedSlugs: ['birth-registration', 'birth-certificate-verification', 'citizenship-certificate'],
    formFields: [
      { name: 'birthRegistrationNumber', type: 'text', label: { bn: 'বিদ্যমান জন্ম নিবন্ধন নম্বর', en: 'Existing Birth Registration Number' }, placeholder: { bn: '১৭ ডিজিট নিবন্ধন নম্বর', en: '17-digit registration number' }, required: true },
      {
        name: 'correctionType',
        type: 'select',
        label: { bn: 'সংশোধনের বিষয়', en: 'Field to Correct' },
        required: true,
        options: [
          { value: 'name', label: { bn: 'নিবন্ধনকারীর নাম সংশোধন', en: 'Name Spelling Correction' } },
          { value: 'dob', label: { bn: 'জন্ম তারিখ সংশোধন', en: 'Date of Birth Correction' } },
          { value: 'parents', label: { bn: 'পিতা/মাতার নাম সংশোধন', en: 'Father/Mother Name Correction' } },
          { value: 'address', label: { bn: 'ঠিকানা সংশোধন', en: 'Address Correction' } },
        ],
      },
      { name: 'applicantName', type: 'text', label: { bn: 'আবেদনকারীর পূর্ণ নাম', en: 'Applicant Full Name' }, required: true },
      { name: 'nid', type: 'text', label: { bn: 'আবেদনকারীর এনআইডি নম্বর', en: 'Applicant NID Number' }, pattern: 'nid', required: true },
      { name: 'phone', type: 'tel', label: { bn: 'মোবাইল নম্বর', en: 'Mobile Number' }, pattern: 'bd_phone', required: true },
      { name: 'wardNumber', type: 'ward', label: { bn: 'ওয়ার্ড নম্বর', en: 'Ward Number' }, required: true },
      { name: 'currentValue', type: 'text', label: { bn: 'সনদে বর্তমানে থাকা তথ্য', en: 'Current (Incorrect) Information' }, required: true },
      { name: 'correctedValue', type: 'text', label: { bn: 'সঠিক / প্রস্তাবিত তথ্য', en: 'Requested (Correct) Information' }, required: true },
      { name: 'proofDocument', type: 'file', label: { bn: 'সংশোধনের স্বপক্ষে প্রমাণপত্র আপলোড', en: 'Upload Supporting Proof' }, accept: '.pdf,.jpg,.jpeg,.png', maxFileSizeMb: 5, required: true, fullWidth: true },
    ],
    backendIntegration: {
      supportedInPortal: true,
      existingHandler: 'mockApi.submitApplication',
      applicationType: 'birth_certificate',
      apiEndpointContract: 'POST /api/v1/civil-registry/birth-corrections',
      missingBackendNote: {
        bn: 'আবেদনটি পোর্টালে ট্র্যাকিংসহ সংরক্ষিত হয়; কেন্দ্রীয় BDRIS সংশোধন অনুমোদন সার্ভার সংযোগ প্রোডাকশন ব্যাকএন্ডের জন্য নির্ধারিত।',
        en: 'Correction requests are recorded in the portal; central BDRIS amendment API integration is required for production live sync.',
      },
    },
  },
  {
    id: 'birth-certificate-verification',
    slug: 'birth-certificate-verification',
    categorySlug: 'registration-certificates',
    icon: BadgeCheck,
    title: { bn: 'জন্ম সনদ যাচাই', en: 'Birth Certificate Verification' },
    shortDescription: {
      bn: 'জন্ম নিবন্ধন নম্বর বা ডিজিটাল রেফারেন্স আইডি দিয়ে তাৎক্ষণিকভাবে সনদের সত্যতা অনলাইনে যাচাই করুন।',
      en: 'Verify the authenticity and issuance status of a digital Birth Registration Certificate publicly without login.',
    },
    availability: 'active',
    requiresAuthForAction: false,
    interactionMode: 'verification',
    primaryCtaLabel: { bn: 'সনদ যাচাই করুন', en: 'Verify Certificate' },
    keywords: ['birth verify', 'certificate verification', 'qr check', 'জন্ম সনদ যাচাই', 'সনদ যাচাই', 'কিউআর'],
    overview: {
      whatItIs: { bn: 'ডিজিটাল জন্ম নিবন্ধন ও নাগরিক সনদের সত্যতা অনলাইনে তাৎক্ষণিক যাচাইয়ের উন্মুক্ত সেবা।', en: 'Public online verification tool confirming whether a digital certificate reference ID is authentic and active.' },
      whyNeeded: { bn: 'শিক্ষা প্রতিষ্ঠান, নিয়োগকর্তা, ব্যাংক ও সরকারি দপ্তর জাল সনদ প্রতিরোধে সহজেই সত্যতা যাচাই করতে পারেন।', en: 'Helps schools, employers, banks, and public agencies instantly confirm document authenticity and prevent forgery.' },
      whoCanUse: { bn: 'যেকোনো নাগরিক বা প্রতিষ্ঠান — কোনো লগইন ছাড়াই।', en: 'Any citizen, verifier, or institution — no login required.' },
      deliverable: { bn: 'সনদের বৈধতা, ধারকের নাম, ইস্যুর তারিখ, ইস্যুকারী কর্তৃপক্ষ এবং কিউআর নিরাপত্তা হ্যাশ।', en: 'Verification report displaying authenticity status, holder name, issue date, issuing authority, and cryptographic hash.' },
    },
    eligibility: {
      isOfficiallyVerified: true,
      items: [
        { bn: 'সবার জন্য সম্পূর্ণ উন্মুক্ত — কোনো লগইনের প্রয়োজন নেই।', en: 'Completely open to the public — no login required.' },
        { bn: 'বৈধ ডিজিটাল সনদের রেফারেন্স আইডি থাকতে হবে।', en: 'Requires a valid digital certificate reference ID.' },
      ],
    },
    requiredDocuments: [
      { id: 'bcv-doc-1', title: { bn: 'সনদের রেফারেন্স আইডি / নিবন্ধন নম্বর', en: 'Certificate Reference ID / Registration Number' }, note: { bn: 'কোনো ফাইল আপলোড প্রয়োজন নেই', en: 'No file upload required' }, required: true, verifiedSource: true },
    ],
    steps: [
      { stepNumber: 1, title: { bn: 'রেফারেন্স আইডি লিখুন', en: 'Enter Reference ID' }, description: { bn: 'সনদের উপরে মুদ্রিত রেফারেন্স নম্বর নিচের ঘরে লিখুন।', en: 'Enter the certificate reference ID into the verification field below.' } },
      { stepNumber: 2, title: { bn: 'তাৎক্ষণিক ফলাফল দেখুন', en: 'View Instant Verification' }, description: { bn: 'সনদটি বৈধ, অপেক্ষমাণ নাকি বাতিল—তা তাৎক্ষণিকভাবে যাচাই করুন।', en: 'Immediately review document validity, holder details, and issuing seal.' } },
    ],
    fees: {
      isVerified: true,
      applicationFee: { bn: 'বিনামূল্যে', en: 'Free of Charge' },
      serviceCharge: { bn: 'প্রযোজ্য নয়', en: 'Not Applicable' },
      processingTime: { bn: 'তাৎক্ষণিক', en: 'Instant' },
      paymentMethods: { bn: 'প্রযোজ্য নয়', en: 'Not Applicable' },
    },
    faqs: [
      {
        id: 'bcv-faq-1',
        question: { bn: 'এই পোর্টালে জমা দেওয়া নতুন জন্ম নিবন্ধন আবেদন কি এখানে যাচাই করা যাবে?', en: 'Can I verify a newly submitted application from this portal here?' },
        answer: {
          bn: 'হ্যাঁ, এই পোর্টালে দাখিলকৃত যেকোনো সনদের রেফারেন্স আইডি (যেমন DSCC-CERT-2026-1094 বা আপনার নতুন DSCC-BC-...) সাথে সাথেই যাচাই করা যাবে।',
          en: 'Yes. Any reference ID submitted in this portal (or sample ID DSCC-CERT-2026-1094) can be verified immediately.',
        },
      },
    ],
    departmentId: 'birth_death',
    relatedSlugs: ['birth-registration', 'birth-certificate-correction', 'death-certificate-download'],
    formFields: [
      { name: 'referenceId', type: 'text', label: { bn: 'সনদ রেফারেন্স আইডি', en: 'Certificate Reference ID' }, placeholder: { bn: 'যেমন: DSCC-CERT-2026-1094', en: 'e.g. DSCC-CERT-2026-1094' }, required: true, fullWidth: true },
    ],
    backendIntegration: {
      supportedInPortal: true,
      existingHandler: 'mockApi.verifyDocumentById',
      apiEndpointContract: 'GET /api/v1/civil-registry/verify?referenceId={id}',
      missingBackendNote: {
        bn: 'পোর্টালে নিবন্ধিত সনদ তাৎক্ষণিকভাবে যাচাই হয়; জাতীয় BDRIS ডেটাবেজের সাথে সরাসরি যাচাই সংযোগ প্রোডাকশন ব্যাকএন্ডের জন্য নির্ধারিত।',
        en: 'Verifies against the portal registry; live national BDRIS lookup requires production government API integration.',
      },
    },
  },
  {
    id: 'death-registration',
    slug: 'death-registration',
    categorySlug: 'registration-certificates',
    icon: FileText,
    title: { bn: 'মৃত্যু নিবন্ধন', en: 'Death Registration' },
    shortDescription: {
      bn: 'ঢাকা সিটি কর্পোরেশন এলাকায় সংঘটিত মৃত্যুর সরকারি নিবন্ধন এবং ডিজিটাল মৃত্যু সনদের অনলাইন আবেদন।',
      en: 'Register a death within Dhaka City Corporation jurisdiction and apply for an official Death Certificate.',
    },
    availability: 'active',
    requiresAuthForAction: true,
    interactionMode: 'application',
    primaryCtaLabel: { bn: 'মৃত্যু নিবন্ধনের আবেদন করুন', en: 'Apply for Death Registration' },
    keywords: ['death registration', 'death certificate', 'মৃত্যু নিবন্ধন', 'মৃত্যু সনদ'],
    overview: {
      whatItIs: { bn: 'সিটি কর্পোরেশন এলাকার কোনো নাগরিকের মৃত্যু সরকারি সিভিল রেজিস্ট্রিতে লিপিবদ্ধ করার আনুষ্ঠানিক প্রক্রিয়া।', en: 'Official civil registry process recording the date, place, and cause of death of a resident within DSCC.' },
      whyNeeded: { bn: 'উত্তরাধিকার সনদ, সম্পত্তি নামজারি, পেনশন, ব্যাংক হিসাব নিষ্পত্তি ও বীমা দাবির জন্য মৃত্যু সনদ অপরিহার্য।', en: 'Legally required for succession certificates, estate mutation, pension settlement, banking, and insurance claims.' },
      whoCanUse: { bn: 'মৃত ব্যক্তির পরিবারের সদস্য বা আইনগত উত্তরাধিকারী।', en: 'Family members or legal next of kin of the deceased.' },
      deliverable: { bn: 'নিবন্ধন ট্র্যাকিং নম্বর এবং নিবন্ধকের অনুমোদনের পর ডিজিটাল মৃত্যু সনদ।', en: 'Tracked registration reference and an official QR-verifiable digital Death Certificate upon approval.' },
    },
    eligibility: {
      isOfficiallyVerified: true,
      items: [
        { bn: 'মৃত্যুর স্থান বা মৃত ব্যক্তির স্থায়ী/বর্তমান ঠিকানা ঢাকা সিটি কর্পোরেশনের আওতাধীন হতে হবে।', en: 'The place of death or deceased’s residence must fall within Dhaka City Corporation wards.' },
        { bn: 'হাসপাতাল/চিকিৎসকের মৃত্যু প্রত্যয়নপত্র বা কবরস্থান/শ্মশান রসিদ দাখিল করতে হবে।', en: 'Hospital/physician death confirmation or municipal burial/cremation receipt is required.' },
      ],
    },
    requiredDocuments: [
      { id: 'dr-doc-1', title: { bn: 'চিকিৎসক বা হাসপাতালের মৃত্যু প্রত্যয়নপত্র / দাফন রসিদ', en: 'Hospital/Physician Death Confirmation or Burial Receipt' }, required: true, verifiedSource: true },
      { id: 'dr-doc-2', title: { bn: 'মৃত ব্যক্তির জাতীয় পরিচয়পত্র (NID) বা জন্ম সনদ', en: 'Deceased’s NID or Birth Registration Certificate' }, required: true, verifiedSource: true },
      { id: 'dr-doc-3', title: { bn: 'আবেদনকারীর জাতীয় পরিচয়পত্র (NID)', en: 'Applicant’s National ID (NID)' }, required: true, verifiedSource: true },
    ],
    steps: [
      { stepNumber: 1, title: { bn: 'প্রয়োজনীয় প্রত্যয়নপত্র সংগ্রহ করুন', en: 'Collect Medical & Identity Documents' }, description: { bn: 'হাসপাতালের মৃত্যু সনদ বা দাফন রসিদ এবং এনআইডি প্রস্তুত রাখুন।', en: 'Keep hospital death proof or burial slip and NID copies ready.' } },
      { stepNumber: 2, title: { bn: 'লগইন করে নিবন্ধন ফরম পূরণ করুন', en: 'Sign In & Complete Registration Form' }, description: { bn: 'মৃত ব্যক্তির তথ্য, মৃত্যুর তারিখ, স্থান ও আবেদনকারীর সম্পর্ক উল্লেখ করে দাখিল করুন।', en: 'Sign in, provide deceased details, date/place of death, and attach supporting proof.' } },
      { stepNumber: 3, title: { bn: 'অনুমোদন ও সনদ ডাউনলোড', en: 'Approval & Certificate Download' }, description: { bn: 'যাচাই শেষে "মৃত্যু সনদ ডাউনলোড" পাতা থেকে সনদ সংগ্রহ করুন।', en: 'Once approved, download the certificate from the Death Certificate Download service.' } },
    ],
    fees: UPDATING_FEE_SCHEDULE,
    faqs: [
      {
        id: 'dr-faq-1',
        question: { bn: 'মৃত্যুর কত দিনের মধ্যে নিবন্ধন করা উচিত?', en: 'How soon should a death be registered?' },
        answer: {
          bn: 'সরকারি বিধিমালা অনুযায়ী মৃত্যুর ৪৫ দিনের মধ্যে নিবন্ধন করা উত্তম; তবে বিলম্ব হলেও প্রযোজ্য প্রক্রিয়ায় নিবন্ধন করা যায়।',
          en: 'Under civil registry rules, registering within 45 days is recommended, though late registrations are processed with applicable verification.',
        },
      },
    ],
    departmentId: 'birth_death',
    relatedSlugs: ['death-certificate-download', 'cemetery-cremation-services', 'family-certificate'],
    formFields: [
      { name: 'deceasedName', type: 'text', label: { bn: 'মৃত ব্যক্তির পূর্ণ নাম', en: 'Full Name of Deceased' }, required: true },
      { name: 'dateOfDeath', type: 'date', label: { bn: 'মৃত্যুর তারিখ', en: 'Date of Death' }, required: true },
      { name: 'placeOfDeath', type: 'text', label: { bn: 'মৃত্যুর স্থান (হাসপাতাল / বাসা)', en: 'Place of Death (Hospital / Home)' }, required: true, fullWidth: true },
      { name: 'causeOfDeath', type: 'text', label: { bn: 'মৃত্যুর কারণ (চিকিৎসকের প্রত্যয়ন অনুযায়ী)', en: 'Cause of Death (as per medical note)' }, required: true },
      { name: 'relationWithDeceased', type: 'text', label: { bn: 'মৃত ব্যক্তির সাথে আবেদনকারীর সম্পর্ক', en: 'Applicant Relationship to Deceased' }, placeholder: { bn: 'যেমন: পুত্র / কন্যা / স্ত্রী', en: 'e.g. Son / Daughter / Spouse' }, required: true },
      { name: 'applicantName', type: 'text', label: { bn: 'আবেদনকারীর পূর্ণ নাম', en: 'Applicant Full Name' }, required: true },
      { name: 'nid', type: 'text', label: { bn: 'আবেদনকারীর এনআইডি নম্বর', en: 'Applicant NID Number' }, pattern: 'nid', required: true },
      { name: 'phone', type: 'tel', label: { bn: 'মোবাইল নম্বর', en: 'Mobile Number' }, pattern: 'bd_phone', required: true },
      { name: 'wardNumber', type: 'ward', label: { bn: 'ওয়ার্ড নম্বর', en: 'Ward Number' }, required: true },
      { name: 'address', type: 'textarea', label: { bn: 'স্থায়ী ঠিকানা', en: 'Permanent Address' }, required: true, fullWidth: true },
      { name: 'deathProof', type: 'file', label: { bn: 'মৃত্যুর প্রত্যয়নপত্র / দাফন রসিদ আপলোড', en: 'Upload Medical Death Certificate / Burial Slip' }, accept: '.pdf,.jpg,.jpeg,.png', maxFileSizeMb: 5, required: true, fullWidth: true },
    ],
    backendIntegration: {
      supportedInPortal: true,
      existingHandler: 'mockApi.submitApplication',
      applicationType: 'birth_certificate',
      apiEndpointContract: 'POST /api/v1/civil-registry/death-registrations',
      missingBackendNote: {
        bn: 'আবেদনটি পোর্টালে সংরক্ষিত ও ট্র্যাকযোগ্য; জাতীয় BDRIS মৃত্যু নিবন্ধন সার্ভারের সাথে সরাসরি সংযোগ প্রোডাকশন ব্যাকএন্ডের জন্য নির্ধারিত।',
        en: 'Submissions are recorded in the portal; direct national BDRIS death registry sync requires production backend integration.',
      },
    },
  },
  {
    id: 'death-certificate-download',
    slug: 'death-certificate-download',
    categorySlug: 'registration-certificates',
    icon: Download,
    title: { bn: 'মৃত্যু সনদ ডাউনলোড', en: 'Death Certificate Download' },
    shortDescription: {
      bn: 'অনুমোদিত ডিজিটাল মৃত্যু সনদ রেফারেন্স আইডি দিয়ে সুরক্ষিতভাবে অনুসন্ধান, প্রিন্ট ও ডাউনলোড করুন।',
      en: 'Securely look up, print, and download your approved digital Death Registration Certificate.',
    },
    availability: 'active',
    requiresAuthForAction: true,
    interactionMode: 'document-download',
    primaryCtaLabel: { bn: 'মৃত্যু সনদ ডাউনলোড করুন', en: 'Download Death Certificate' },
    keywords: ['death certificate download', 'print death certificate', 'মৃত্যু সনদ ডাউনলোড', 'মৃত্যু সনদ'],
    overview: {
      whatItIs: { bn: 'অনুমোদিত মৃত্যু নিবন্ধন সনদের কিউআর-যুক্ত ডিজিটাল কপি পুনরুদ্ধার ও প্রিন্ট করার সুরক্ষিত সেবা।', en: 'Authenticated document retrieval service allowing authorized applicants to view and print approved death certificates.' },
      whyNeeded: { bn: 'দাপ্তরিক, আইনি ও ব্যাংকিং কাজে অনুমোদিত মৃত্যু সনদের কপি যেকোনো সময় সংগ্রহ করা যায়।', en: 'Provides convenient access to approved death certificate copies for legal, estate, and banking procedures.' },
      whoCanUse: { bn: 'নিবন্ধিত নাগরিক অ্যাকাউন্টধারী অনুমোদিত আবেদনকারীগণ (ব্যক্তিগত নথির গোপনীয়তার জন্য লগইন আবশ্যক)।', en: 'Authenticated portal applicants (login required to protect personal civil registry documents).' },
      deliverable: { bn: 'অনুমোদিত ডিজিটাল সনদের প্রিন্টযোগ্য ও যাচাইযোগ্য কপি।', en: 'Printable and verifiable copy of the approved municipal certificate.' },
    },
    eligibility: {
      isOfficiallyVerified: true,
      items: [
        { bn: 'মৃত্যু নিবন্ধন আবেদনটি অনুমোদিত হতে হবে এবং রেফারেন্স নম্বর থাকতে হবে।', en: 'Death registration must be approved with an assigned reference ID.' },
        { bn: 'নথি ডাউনলোডের জন্য নাগরিক অ্যাকাউন্টে লগইন বাধ্যতামূলক।', en: 'Citizen Portal login is required before downloading private certificates.' },
      ],
    },
    requiredDocuments: [
      { id: 'dcd-doc-1', title: { bn: 'অনুমোদিত মৃত্যু সনদ রেফারেন্স আইডি', en: 'Approved Certificate Reference ID' }, required: true, verifiedSource: true },
    ],
    steps: [
      { stepNumber: 1, title: { bn: 'নাগরিক অ্যাকাউন্টে লগইন করুন', en: 'Sign In to Citizen Account' }, description: { bn: 'ব্যক্তিগত সনদ ডাউনলোডের জন্য প্রথমে লগইন করুন।', en: 'Authenticate with your Citizen Portal account.' } },
      { stepNumber: 2, title: { bn: 'রেফারেন্স নম্বর দিয়ে সনদ প্রিন্ট/সংরক্ষণ করুন', en: 'Look Up & Print / Save PDF' }, description: { bn: 'রেফারেন্স আইডি দিয়ে সনদ খুঁজে বের করে প্রিন্ট বা পিডিএফ হিসেবে সংরক্ষণ করুন।', en: 'Enter your reference ID or choose from your approved documents to print/save.' } },
    ],
    fees: {
      isVerified: true,
      applicationFee: { bn: 'বিনামূল্যে (অনুমোদিত ডিজিটাল কপি)', en: 'Free of Charge (Approved Digital Copy)' },
      serviceCharge: { bn: 'প্রযোজ্য নয়', en: 'Not Applicable' },
      processingTime: { bn: 'তাৎক্ষণিক', en: 'Instant' },
      paymentMethods: { bn: 'প্রযোজ্য নয়', en: 'Not Applicable' },
    },
    faqs: [
      {
        id: 'dcd-faq-1',
        question: { bn: 'অনলাইন ডাউনলোডের জন্য লগইন কেন প্রয়োজন?', en: 'Why is login required to download a Death Certificate?' },
        answer: {
          bn: 'নাগরিকদের সংবেদনশীল ব্যক্তিগত নথির গোপনীয়তা ও সুরক্ষা নিশ্চিত করতে ডাউনলোড সুবিধা শুধুমাত্র লগইনকৃত অ্যাকাউন্টের জন্য সংরক্ষিত।',
          en: 'To protect sensitive personal civil records, downloads are restricted to authenticated Citizen Portal accounts.',
        },
      },
    ],
    departmentId: 'birth_death',
    relatedSlugs: ['death-registration', 'birth-certificate-verification', 'cemetery-cremation-services'],
    formFields: [
      { name: 'referenceId', type: 'text', label: { bn: 'মৃত্যু সনদ রেফারেন্স আইডি', en: 'Death Certificate Reference ID' }, placeholder: { bn: 'যেমন: DSCC-CERT-2026-1094', en: 'e.g. DSCC-CERT-2026-1094' }, required: true, fullWidth: true },
    ],
    backendIntegration: {
      supportedInPortal: true,
      existingHandler: 'mockApi.getApplications',
      apiEndpointContract: 'GET /api/v1/civil-registry/death-certificates/{referenceId}/download',
      missingBackendNote: {
        bn: 'অনুমোদিত পোর্টাল সনদ প্রিন্ট/সংরক্ষণ করা যায়; ডিজিটালি স্বাক্ষরিত সরকারি পিডিএফ সার্ভারের জন্য ব্যাকএন্ড সংযোগ প্রয়োজন।',
        en: 'Supports viewing and printing portal-approved certificates; server-signed PKI PDF generation requires production backend APIs.',
      },
    },
  },
  {
    id: 'citizenship-certificate',
    slug: 'citizenship-certificate',
    categorySlug: 'registration-certificates',
    icon: UserCheck,
    title: { bn: 'নাগরিকত্ব সনদ', en: 'Citizenship Certificate' },
    shortDescription: {
      bn: 'ওয়ার্ড কাউন্সিলর ও সিটি কর্পোরেশন কর্তৃক প্রদত্ত নাগরিকত্ব প্রত্যয়নপত্রের জন্য অনলাইন আবেদন।',
      en: 'Apply online for an official Ward Councillor & Dhaka City Corporation Citizenship Certificate.',
    },
    availability: 'active',
    requiresAuthForAction: true,
    interactionMode: 'application',
    primaryCtaLabel: { bn: 'আবেদন করুন', en: 'Apply Now' },
    keywords: ['citizenship', 'nationality', 'ward certificate', 'নাগরিকত্ব সনদ', 'নাগরিক সনদ'],
    overview: {
      whatItIs: { bn: 'ঢাকা সিটি কর্পোরেশনের সংশ্লিষ্ট ওয়ার্ডের স্থায়ী বা নিয়মিত নাগরিক হিসেবে সরকারি প্রত্যয়নপত্র।', en: 'Official municipal attestation confirming an applicant’s citizenship and local ward residency.' },
      whyNeeded: { bn: 'সরকারি চাকরি, পাসপোর্ট, জমি রেজিস্ট্রেশন, শিক্ষা ভর্তি এবং বিভিন্ন প্রাতিষ্ঠানিক যাচাইয়ে নাগরিকত্ব সনদ প্রয়োজন।', en: 'Required for government employment, passport applications, land registration, admissions, and institutional verification.' },
      whoCanUse: { bn: 'ঢাকা সিটি কর্পোরেশনের যেকোনো ওয়ার্ডের বাসিন্দা বাংলাদেশি নাগরিকগণ।', en: 'Bangladeshi citizens residing within any Dhaka City Corporation ward.' },
      deliverable: { bn: 'তাৎক্ষণিক রেফারেন্স নম্বর এবং কিউআর-যাচাইযোগ্য ডিজিটাল নাগরিকত্ব সনদ।', en: 'Instant reference number and QR-verifiable Digital Citizenship Certificate.' },
    },
    eligibility: {
      isOfficiallyVerified: true,
      items: [
        { bn: 'আবেদনকারীকে বাংলাদেশি নাগরিক এবং সংশ্লিষ্ট ওয়ার্ডের বাসিন্দা হতে হবে।', en: 'Applicant must be a Bangladeshi citizen residing within the selected ward.' },
        { bn: 'বৈধ জাতীয় পরিচয়পত্র (NID) অথবা জন্ম নিবন্ধন সনদ থাকতে হবে।', en: 'Valid National ID (NID) or Birth Registration Certificate is required.' },
      ],
    },
    requiredDocuments: [
      { id: 'cc-doc-1', title: { bn: 'জাতীয় পরিচয়পত্র (NID) বা জন্ম নিবন্ধন সনদ', en: 'National ID (NID) or Birth Certificate' }, required: true, verifiedSource: true },
      { id: 'cc-doc-2', title: { bn: 'হালনাগাদ হোল্ডিং ট্যাক্স রসিদ বা ইউটিলিটি বিল', en: 'Updated Holding Tax Receipt or Utility Bill' }, required: true, verifiedSource: true },
    ],
    steps: [
      { stepNumber: 1, title: { bn: 'কাগজপত্র প্রস্তুত করুন', en: 'Prepare Identification & Address Proof' }, description: { bn: 'এনআইডি এবং বর্তমান ঠিকানার প্রমাণপত্র স্ক্যান করে রাখুন।', en: 'Keep digital copies of your NID and residence proof ready.' } },
      { stepNumber: 2, title: { bn: 'লগইন করে আবেদন জমা দিন', en: 'Sign In & Submit Application' }, description: { bn: 'নাগরিক অ্যাকাউন্টে লগইন করে তথ্য ও নথি জমা দিন।', en: 'Authenticate, fill out the form, attach files, and submit.' } },
      { stepNumber: 3, title: { bn: 'ডিজিটাল সনদ সংগ্রহ করুন', en: 'Download Verified Certificate' }, description: { bn: 'অনুমোদনের পর রেফারেন্স আইডি দিয়ে সনদ যাচাই ও প্রিন্ট করুন।', en: 'Verify and print your issued certificate using its reference ID.' } },
    ],
    fees: {
      isVerified: true,
      applicationFee: { bn: 'তথ্য হালনাগাদ করা হচ্ছে।', en: 'Information is being updated.' },
      processingTime: { bn: '১ – ৩ কর্মদিবস (পোর্টাল সিটিজেন চার্টার অনুযায়ী)', en: '1 – 3 working days (per portal Citizen Charter)' },
      paymentMethods: { bn: 'তথ্য হালনাগাদ করা হচ্ছে।', en: 'Information is being updated.' },
    },
    faqs: [
      {
        id: 'cc-faq-1',
        question: { bn: 'ভাড়াটিয়া বাসিন্দারা কি নাগরিকত্ব সনদের আবেদন করতে পারবেন?', en: 'Can tenants apply for a Citizenship Certificate from their current ward?' },
        answer: {
          bn: 'হ্যাঁ, বৈধ বর্তমান ঠিকানার প্রমাণপত্র (ইউটিলিটি বিল / ভাড়ার চুক্তিপত্র) ও এনআইডি সহ সংশ্লিষ্ট ওয়ার্ডে আবেদন করা যায়।',
          en: 'Yes, tenants can apply in their current ward with valid address proof (utility bill or rent agreement) and NID.',
        },
      },
    ],
    departmentId: 'birth_death',
    relatedSlugs: ['character-certificate', 'permanent-resident-certificate', 'family-certificate'],
    formFields: [
      { name: 'applicantName', type: 'text', label: { bn: 'আবেদনকারীর পূর্ণ নাম', en: 'Applicant Full Name' }, required: true },
      { name: 'fatherOrSpouseName', type: 'text', label: { bn: 'পিতা / স্বামীর নাম', en: 'Father’s / Spouse’s Name' }, required: true },
      { name: 'motherName', type: 'text', label: { bn: 'মাতার নাম', en: 'Mother’s Name' }, required: true },
      { name: 'nid', type: 'text', label: { bn: 'জাতীয় পরিচয়পত্র নম্বর (NID)', en: 'NID Number' }, pattern: 'nid', required: true },
      { name: 'phone', type: 'tel', label: { bn: 'মোবাইল নম্বর', en: 'Mobile Number' }, pattern: 'bd_phone', required: true },
      { name: 'wardNumber', type: 'ward', label: { bn: 'ওয়ার্ড নম্বর', en: 'Ward Number' }, required: true },
      { name: 'address', type: 'textarea', label: { bn: 'বর্তমান ও স্থায়ী ঠিকানা', en: 'Present & Permanent Address' }, required: true, fullWidth: true },
      { name: 'purpose', type: 'text', label: { bn: 'সনদের প্রয়োজনীয়তা', en: 'Purpose of Certificate' }, placeholder: { bn: 'যেমন: চাকরি / পাসপোর্ট / প্রাতিষ্ঠানিক কাজ', en: 'e.g. Employment / Passport / Official use' }, required: true, fullWidth: true },
      { name: 'identityFile', type: 'file', label: { bn: 'এনআইডি ও ঠিকানার প্রমাণপত্র আপলোড', en: 'Upload NID & Address Proof' }, accept: '.pdf,.jpg,.jpeg,.png', maxFileSizeMb: 5, required: true, fullWidth: true },
    ],
    backendIntegration: {
      supportedInPortal: true,
      existingHandler: 'mockApi.submitApplication',
      applicationType: 'citizen_certificate',
      apiEndpointContract: 'POST /api/v1/certificates/citizenship',
      missingBackendNote: {
        bn: 'আবেদনটি পোর্টালে সংরক্ষিত ও যাচাইযোগ্য; ওয়ার্ড কাউন্সিলর ডিজিটাল স্বাক্ষর সার্ভার সংযোগ প্রোডাকশন ব্যাকএন্ডের জন্য নির্ধারিত।',
        en: 'Submissions are recorded and verifiable in the portal; Ward Councillor digital signature integration requires production backend APIs.',
      },
    },
  },
  {
    id: 'character-certificate',
    slug: 'character-certificate',
    categorySlug: 'registration-certificates',
    icon: ShieldCheck,
    title: { bn: 'চারিত্রিক সনদ', en: 'Character Certificate' },
    shortDescription: {
      bn: 'চাকরি, শিক্ষা প্রতিষ্ঠান ও প্রাতিষ্ঠানিক প্রয়োজনে ওয়ার্ড কার্যালয়ের চারিত্রিক সনদের অনলাইন আবেদন।',
      en: 'Apply online for a municipal Character Certificate attested by your Ward Office for employment or academic needs.',
    },
    availability: 'active',
    requiresAuthForAction: true,
    interactionMode: 'application',
    primaryCtaLabel: { bn: 'আবেদন করুন', en: 'Apply Now' },
    keywords: ['character certificate', 'good conduct', 'চারিত্রিক সনদ', 'প্রত্যয়নপত্র'],
    overview: {
      whatItIs: { bn: 'ওয়ার্ড কাউন্সিলর কার্যালয় কর্তৃক প্রদত্ত নাগরিকের সদাচরণ ও চারিত্রিক প্রত্যয়নপত্র।', en: 'Municipal attestation certifying an applicant’s good standing and conduct within their local ward.' },
      whyNeeded: { bn: 'সরকারি/বেসরকারি চাকরি, উচ্চশিক্ষা ভর্তি ও বিভিন্ন দাপ্তরিক যাচাইয়ে চারিত্রিক সনদ চাওয়া হয়।', en: 'Frequently requested for job onboarding, university admissions, and official background requirements.' },
      whoCanUse: { bn: 'ঢাকা সিটি কর্পোরেশন এলাকার নিবন্ধিত বাসিন্দাগণ।', en: 'Verified residents of Dhaka City Corporation wards.' },
      deliverable: { bn: 'রেফারেন্স নম্বর ও কিউআর-যাচাইযোগ্য ডিজিটাল চারিত্রিক সনদ।', en: 'Reference number and QR-verifiable Digital Character Certificate.' },
    },
    eligibility: {
      isOfficiallyVerified: true,
      items: [
        { bn: 'সংশ্লিষ্ট ওয়ার্ডের বৈধ বাসিন্দা ও এনআইডি/জন্ম সনদধারী হতে হবে।', en: 'Must be a resident of the ward with valid NID or Birth Certificate.' },
      ],
    },
    requiredDocuments: [
      { id: 'chc-doc-1', title: { bn: 'জাতীয় পরিচয়পত্র (NID) বা জন্ম সনদ', en: 'National ID (NID) or Birth Certificate' }, required: true, verifiedSource: true },
      { id: 'chc-doc-2', title: { bn: 'ঠিকানার প্রমাণপত্র (হোল্ডিং ট্যাক্স / ইউটিলিটি বিল)', en: 'Address Proof (Holding Tax / Utility Bill)' }, required: true, verifiedSource: true },
    ],
    steps: [
      { stepNumber: 1, title: { bn: 'তথ্য ও নথি প্রস্তুত করুন', en: 'Prepare Personal & Address Proof' }, description: { bn: 'এনআইডি ও ওয়ার্ড ঠিকানার প্রমাণ স্ক্যান করে রাখুন।', en: 'Scan your NID and proof of local residence.' } },
      { stepNumber: 2, title: { bn: 'লগইন করে ফরম জমা দিন', en: 'Sign In & Submit Form' }, description: { bn: 'নাগরিক অ্যাকাউন্টে লগইন করে আবেদন দাখিল করুন এবং রেফারেন্স নম্বর সংরক্ষণ করুন।', en: 'Log in, fill in required details, attach proof, and save your reference ID.' } },
    ],
    fees: UPDATING_FEE_SCHEDULE,
    faqs: [
      {
        id: 'chc-faq-1',
        question: { bn: 'চারিত্রিক সনদ কি অনলাইনে যাচাই করা যায়?', en: 'Can the Character Certificate be verified online?' },
        answer: {
          bn: 'হ্যাঁ, অনুমোদিত সনদের রেফারেন্স আইডি দিয়ে কিউআর যাচাই পাতা থেকে যেকোনো প্রতিষ্ঠান সত্যতা যাচাই করতে পারবে।',
          en: 'Yes. Any employer or institution can verify the issued reference ID via the portal’s QR Verification service.',
        },
      },
    ],
    departmentId: 'birth_death',
    relatedSlugs: ['citizenship-certificate', 'permanent-resident-certificate', 'income-certificate'],
    formFields: [
      { name: 'applicantName', type: 'text', label: { bn: 'আবেদনকারীর পূর্ণ নাম', en: 'Applicant Full Name' }, required: true },
      { name: 'fatherName', type: 'text', label: { bn: 'পিতার নাম', en: 'Father’s Name' }, required: true },
      { name: 'nid', type: 'text', label: { bn: 'জাতীয় পরিচয়পত্র নম্বর (NID)', en: 'NID Number' }, pattern: 'nid', required: true },
      { name: 'phone', type: 'tel', label: { bn: 'মোবাইল নম্বর', en: 'Mobile Number' }, pattern: 'bd_phone', required: true },
      { name: 'wardNumber', type: 'ward', label: { bn: 'ওয়ার্ড নম্বর', en: 'Ward Number' }, required: true },
      { name: 'purpose', type: 'text', label: { bn: 'প্রয়োজনীয়তার উদ্দেশ্য', en: 'Purpose' }, required: true },
      { name: 'address', type: 'textarea', label: { bn: 'পূর্ণ ঠিকানা', en: 'Full Residential Address' }, required: true, fullWidth: true },
      { name: 'supportingDoc', type: 'file', label: { bn: 'এনআইডি ও ঠিকানার প্রমাণপত্র', en: 'NID & Address Proof' }, accept: '.pdf,.jpg,.jpeg,.png', maxFileSizeMb: 5, required: true, fullWidth: true },
    ],
    backendIntegration: {
      supportedInPortal: true,
      existingHandler: 'mockApi.submitApplication',
      applicationType: 'citizen_certificate',
      apiEndpointContract: 'POST /api/v1/certificates/character',
      missingBackendNote: {
        bn: 'আবেদনটি পোর্টালে সংরক্ষিত হয়; ওয়ার্ড কার্যালয়ের ডিজিটাল স্বাক্ষর অনুমোদন প্রোডাকশন ব্যাকএন্ডের জন্য নির্ধারিত।',
        en: 'Recorded in the portal; Ward Office digital countersignature requires production backend APIs.',
      },
    },
  },
  {
    id: 'permanent-resident-certificate',
    slug: 'permanent-resident-certificate',
    categorySlug: 'registration-certificates',
    icon: Home,
    title: { bn: 'স্থায়ী বাসিন্দা সনদ', en: 'Permanent Resident Certificate' },
    shortDescription: {
      bn: 'ঢাকা সিটি কর্পোরেশনের নির্দিষ্ট ওয়ার্ডের স্থায়ী বাসিন্দা হিসেবে সরকারি প্রত্যয়নপত্রের অনলাইন আবেদন।',
      en: 'Apply online for a Permanent Resident Certificate confirming long-term residency in a DSCC ward.',
    },
    availability: 'active',
    requiresAuthForAction: true,
    interactionMode: 'application',
    primaryCtaLabel: { bn: 'আবেদন করুন', en: 'Apply Now' },
    keywords: ['permanent resident', 'domicile', 'residence certificate', 'স্থায়ী বাসিন্দা সনদ', 'বাসিন্দা সনদ'],
    overview: {
      whatItIs: { bn: 'কোনো নাগরিক নির্দিষ্ট ওয়ার্ডের স্থায়ী বাসিন্দা—তা প্রত্যয়নকারী সিটি কর্পোরেশন সনদ।', en: 'Official municipal certificate attesting permanent residency within a specific Dhaka City Corporation ward.' },
      whyNeeded: { bn: 'কোটা যাচাই, সরকারি নিয়োগ, শিক্ষা বৃত্তি, ব্যাংকিং ও আইনি কাজে স্থায়ী ঠিকানার প্রমাণ হিসেবে ব্যবহৃত হয়।', en: 'Used to substantiate permanent domicile for public recruitment, scholarships, banking, and legal filings.' },
      whoCanUse: { bn: 'ঢাকা সিটি কর্পোরেশনের আওতাধীন স্থায়ী বাড়ি/ফ্ল্যাট মালিক বা দীর্ঘমেয়াদি স্থায়ী বাসিন্দাগণ।', en: 'Permanent homeowners and documented permanent residents within DSCC wards.' },
      deliverable: { bn: 'আবেদন রেফারেন্স নম্বর এবং যাচাই শেষে কিউআর-যুক্ত স্থায়ী বাসিন্দা সনদ।', en: 'Tracked application reference and a QR-verifiable Permanent Resident Certificate.' },
    },
    eligibility: {
      isOfficiallyVerified: false,
      items: [
        { bn: 'এনআইডি-তে স্থায়ী ঠিকানা সংশ্লিষ্ট ওয়ার্ডের আওতাধীন হতে হবে অথবা সম্পত্তি/হোল্ডিং মালিকানার প্রমাণ থাকতে হবে (সরকারি যাচাইয়ের অপেক্ষায় রয়েছে)।', en: 'Permanent address on NID must match the ward or be supported by holding/property ownership records (awaiting official verification).' },
      ],
    },
    requiredDocuments: [
      { id: 'prc-doc-1', title: { bn: 'জাতীয় পরিচয়পত্র (NID) এর কপি', en: 'Copy of National ID (NID)' }, required: true },
      { id: 'prc-doc-2', title: { bn: 'হালনাগাদ হোল্ডিং ট্যাক্স রসিদ বা মালিকানার দলিল', en: 'Latest Holding Tax Receipt or Ownership Deed' }, required: true },
    ],
    steps: [
      { stepNumber: 1, title: { bn: 'স্থায়ী ঠিকানার প্রমাণপত্র প্রস্তুত করুন', en: 'Prepare Domicile & Tax Proof' }, description: { bn: 'এনআইডি এবং হোল্ডিং ট্যাক্স রসিদ/দলিল স্ক্যান করুন।', en: 'Prepare scanned copies of NID and holding tax receipt or ownership deed.' } },
      { stepNumber: 2, title: { bn: 'লগইন করে আবেদন জমা দিন', en: 'Sign In & Submit Request' }, description: { bn: 'হোল্ডিং নম্বর ও স্থায়ী ঠিকানাসহ আবেদন দাখিল করুন।', en: 'Log in, provide holding details and permanent address, and submit.' } },
    ],
    fees: UPDATING_FEE_SCHEDULE,
    faqs: [
      {
        id: 'prc-faq-1',
        question: { bn: 'স্থায়ী ঠিকানা ও বর্তমান ঠিকানা ভিন্ন হলে কী করব?', en: 'What if my permanent and present addresses differ?' },
        answer: {
          bn: 'স্থায়ী বাসিন্দা সনদ শুধুমাত্র স্থায়ী ঠিকানার সংশ্লিষ্ট ওয়ার্ড থেকে আবেদন করতে হবে।',
          en: 'A Permanent Resident Certificate must be requested from the ward where your permanent domicile is recorded.',
        },
      },
    ],
    departmentId: 'birth_death',
    relatedSlugs: ['citizenship-certificate', 'family-certificate', 'holding-tax-payment'],
    formFields: [
      { name: 'applicantName', type: 'text', label: { bn: 'আবেদনকারীর পূর্ণ নাম', en: 'Applicant Full Name' }, required: true },
      { name: 'nid', type: 'text', label: { bn: 'জাতীয় পরিচয়পত্র নম্বর (NID)', en: 'NID Number' }, pattern: 'nid', required: true },
      { name: 'phone', type: 'tel', label: { bn: 'মোবাইল নম্বর', en: 'Mobile Number' }, pattern: 'bd_phone', required: true },
      { name: 'wardNumber', type: 'ward', label: { bn: 'স্থায়ী ওয়ার্ড নম্বর', en: 'Permanent Ward Number' }, required: true },
      { name: 'holdingNumber', type: 'text', label: { bn: 'হোল্ডিং নম্বর', en: 'Holding Number' }, placeholder: { bn: 'যেমন: 27-0412-B', en: 'e.g. 27-0412-B' }, required: true },
      { name: 'yearsOfResidency', type: 'number', label: { bn: 'বসবাসের সময়কাল (বছর)', en: 'Years of Residency' }, required: true },
      { name: 'address', type: 'textarea', label: { bn: 'স্থায়ী ঠিকানা', en: 'Full Permanent Address' }, required: true, fullWidth: true },
      { name: 'residenceProof', type: 'file', label: { bn: 'হোল্ডিং ট্যাক্স রসিদ / মালিকানার প্রমাণপত্র', en: 'Upload Holding Tax Receipt / Ownership Proof' }, accept: '.pdf,.jpg,.jpeg,.png', maxFileSizeMb: 5, required: true, fullWidth: true },
    ],
    backendIntegration: {
      supportedInPortal: true,
      existingHandler: 'mockApi.submitApplication',
      applicationType: 'citizen_certificate',
      apiEndpointContract: 'POST /api/v1/certificates/permanent-resident',
      missingBackendNote: {
        bn: 'আবেদনটি পোর্টালে সংরক্ষিত হয়; হোল্ডিং রেজিস্ট্রি ও ওয়ার্ড যাচাই সার্ভার সংযোগ প্রোডাকশন ব্যাকএন্ডের জন্য নির্ধারিত।',
        en: 'Recorded in the portal; automated holding ledger cross-check requires production backend APIs.',
      },
    },
  },
  {
    id: 'family-certificate',
    slug: 'family-certificate',
    categorySlug: 'registration-certificates',
    icon: Users,
    title: { bn: 'পারিবারিক সনদ', en: 'Family Certificate' },
    shortDescription: {
      bn: 'পরিবারের সদস্যদের সম্পর্ক ও উত্তরাধিকার সংক্রান্ত পারিবারিক সনদের অনলাইন আবেদন ও নির্দেশিকা।',
      en: 'Apply online for a Family Certificate verifying family members and relationships for official or inheritance matters.',
    },
    availability: 'active',
    requiresAuthForAction: true,
    interactionMode: 'application',
    primaryCtaLabel: { bn: 'আবেদন করুন', en: 'Apply Now' },
    keywords: ['family certificate', 'warish', 'heir', 'পারিবারিক সনদ', 'ওয়ারিশ সনদ', 'পরিবার'],
    overview: {
      whatItIs: { bn: 'পরিবার প্রধান ও পরিবারের সদস্যদের পারস্পরিক সম্পর্ক প্রত্যয়নকারী সিটি কর্পোরেশন সনদ।', en: 'Official municipal document listing family members and their legal relationship to the household head.' },
      whyNeeded: { bn: 'পেনশন, ব্যাংক নমিনি, ভিসা প্রসেসিং, শিক্ষা সহায়তা এবং পারিবারিক/উত্তরাধিকার নথিতে এই সনদ ব্যবহৃত হয়।', en: 'Used for pension claims, visa sponsorship, banking nominations, and legal family documentation.' },
      whoCanUse: { bn: 'ঢাকা সিটি কর্পোরেশন এলাকার স্থায়ী বা নিবন্ধিত পরিবারের প্রাপ্তবয়স্ক সদস্য।', en: 'Adult family members residing within Dhaka City Corporation wards.' },
      deliverable: { bn: 'রেফারেন্স নম্বর এবং যাচাই শেষে ডিজিটাল পারিবারিক সনদ।', en: 'Tracked reference number and a QR-verifiable Digital Family Certificate.' },
    },
    eligibility: {
      isOfficiallyVerified: false,
      items: [
        { bn: 'আবেদনকারী ও তালিকাভুক্ত পরিবারের সদস্যদের বৈধ এনআইডি বা জন্ম নিবন্ধন নম্বর থাকতে হবে (সরকারি যাচাইয়ের অপেক্ষায় রয়েছে)।', en: 'Applicant and listed family members must have valid NID or Birth Registration records (awaiting official verification).' },
      ],
    },
    requiredDocuments: [
      { id: 'fc-doc-1', title: { bn: 'আবেদনকারী ও পরিবারের সদস্যদের এনআইডি / জন্ম সনদের কপি', en: 'NID / Birth Certificates of Applicant & Family Members' }, required: true },
      { id: 'fc-doc-2', title: { bn: 'হালনাগাদ হোল্ডিং ট্যাক্স রসিদ বা ঠিকানার প্রমাণপত্র', en: 'Latest Holding Tax Receipt or Address Proof' }, required: true },
    ],
    steps: [
      { stepNumber: 1, title: { bn: 'পরিবারের সদস্যদের তালিকা ও পরিচয়পত্র প্রস্তুত করুন', en: 'Compile Family Member Details & IDs' }, description: { bn: 'সকল সদস্যের নাম, সম্পর্ক এবং এনআইডি/জন্ম সনদ প্রস্তুত রাখুন।', en: 'Prepare full names, relationships, and ID copies for all listed members.' } },
      { stepNumber: 2, title: { bn: 'লগইন করে আবেদন জমা দিন', en: 'Sign In & Submit Application' }, description: { bn: 'সদস্যদের বিবরণ ও প্রমাণপত্র সংযুক্ত করে দাখিল করুন।', en: 'Log in, enter family roster details, attach documents, and submit.' } },
    ],
    fees: UPDATING_FEE_SCHEDULE,
    faqs: [
      {
        id: 'fc-faq-1',
        question: { bn: 'মৃত ব্যক্তির উত্তরাধিকারের জন্য কি মৃত্যু সনদ সংযুক্ত করতে হবে?', en: 'Is a Death Certificate required when applying for deceased family succession?' },
        answer: {
          bn: 'হ্যাঁ, পরিবার প্রধান মৃত হলে অনুমোদিত মৃত্যু সনদ সংযুক্ত করা আবশ্যক।',
          en: 'Yes. If the head of household is deceased, an approved Death Certificate must be attached.',
        },
      },
    ],
    departmentId: 'birth_death',
    relatedSlugs: ['death-registration', 'citizenship-certificate', 'permanent-resident-certificate'],
    formFields: [
      { name: 'householdHeadName', type: 'text', label: { bn: 'পরিবার প্রধানের পূর্ণ নাম', en: 'Head of Family Full Name' }, required: true },
      { name: 'applicantName', type: 'text', label: { bn: 'আবেদনকারীর পূর্ণ নাম', en: 'Applicant Full Name' }, required: true },
      { name: 'nid', type: 'text', label: { bn: 'আবেদনকারীর এনআইডি নম্বর', en: 'Applicant NID Number' }, pattern: 'nid', required: true },
      { name: 'phone', type: 'tel', label: { bn: 'মোবাইল নম্বর', en: 'Mobile Number' }, pattern: 'bd_phone', required: true },
      { name: 'wardNumber', type: 'ward', label: { bn: 'ওয়ার্ড নম্বর', en: 'Ward Number' }, required: true },
      { name: 'memberCount', type: 'number', label: { bn: 'মোট তালিকাভুক্ত সদস্য সংখ্যা', en: 'Total Listed Family Members' }, required: true },
      { name: 'familyMembersList', type: 'textarea', label: { bn: 'সদস্যদের নাম ও সম্পর্ক (প্রতি লাইনে একজন)', en: 'Family Members & Relationships (one per line)' }, placeholder: { bn: 'যেমন: ১. ফাতেমা বেগম (স্ত্রী), ২. রাফি আহমেদ (পুত্র)', en: 'e.g. 1. Fatema Begum (Spouse), 2. Rafi Ahmed (Son)' }, required: true, fullWidth: true },
      { name: 'address', type: 'text', label: { bn: 'পূর্ণ ঠিকানা', en: 'Full Residential Address' }, required: true, fullWidth: true },
      { name: 'familyDocs', type: 'file', label: { bn: 'পরিবারের সদস্যদের পরিচয়পত্র সংযুক্ত করুন', en: 'Upload Family Identification Documents' }, accept: '.pdf,.jpg,.jpeg,.png', maxFileSizeMb: 5, required: true, fullWidth: true },
    ],
    backendIntegration: {
      supportedInPortal: true,
      existingHandler: 'mockApi.submitApplication',
      applicationType: 'citizen_certificate',
      apiEndpointContract: 'POST /api/v1/certificates/family',
      missingBackendNote: {
        bn: 'আবেদনটি পোর্টালে সংরক্ষিত হয়; ওয়ার্ড তদন্ত ও ডিজিটাল অনুমোদন সার্ভার প্রোডাকশন ব্যাকএন্ডের জন্য নির্ধারিত।',
        en: 'Logged in the portal; Ward field verification and official digital signing require production backend APIs.',
      },
    },
  },
  {
    id: 'income-certificate',
    slug: 'income-certificate',
    categorySlug: 'registration-certificates',
    icon: FileSpreadsheet,
    title: { bn: 'আয় সনদপত্র', en: 'Income Certificate' },
    shortDescription: {
      bn: 'শিক্ষাবৃত্তি, টিউশন মওকুফ ও সামাজিক সহায়তার জন্য বার্ষিক পারিবারিক আয় সনদপত্রের অনলাইন আবেদন।',
      en: 'Apply online for a municipal Annual Income Certificate for scholarships, fee waivers, or welfare support.',
    },
    availability: 'active',
    requiresAuthForAction: true,
    interactionMode: 'application',
    primaryCtaLabel: { bn: 'আবেদন করুন', en: 'Apply Now' },
    keywords: ['income certificate', 'annual income', 'scholarship', 'আয় সনদপত্র', 'বার্ষিক আয়', 'বৃত্তি'],
    overview: {
      whatItIs: { bn: 'আবেদনকারী বা অভিভাবকের পেশা ও বার্ষিক আয়ের পরিমাণ প্রত্যয়নকারী সিটি কর্পোরেশন সনদ।', en: 'Municipal attestation certifying an applicant’s or guardian’s occupation and declared annual income.' },
      whyNeeded: { bn: 'বিশ্ববিদ্যালয় ও সরকারি শিক্ষাবৃত্তি, টিউশন ফি মওকুফ, চিকিৎসা সহায়তা এবং সামাজিক নিরাপত্তা কর্মসূচিতে আয় সনদ প্রয়োজন।', en: 'Required for university scholarships, tuition waivers, medical assistance, and social safety-net applications.' },
      whoCanUse: { bn: 'ঢাকা সিটি কর্পোরেশন এলাকার বাসিন্দা অভিভাবক বা নাগরিকগণ।', en: 'Residents and legal guardians residing within Dhaka City Corporation wards.' },
      deliverable: { bn: 'আবেদন রেফারেন্স নম্বর এবং যাচাই শেষে ডিজিটাল আয় সনদপত্র।', en: 'Tracked application reference and a QR-verifiable Digital Income Certificate.' },
    },
    eligibility: {
      isOfficiallyVerified: false,
      items: [
        { bn: 'আবেদনকারীকে সংশ্লিষ্ট ওয়ার্ডের বাসিন্দা হতে হবে এবং আয়ের উৎস সংক্রান্ত প্রাথমিক প্রমাণপত্র দিতে হবে (সরকারি যাচাইয়ের অপেক্ষায় রয়েছে)।', en: 'Must reside in the ward and declare verifiable occupation/income details (awaiting official verification).' },
      ],
    },
    requiredDocuments: [
      { id: 'ic-doc-1', title: { bn: 'আবেদনকারী/অভিভাবকের জাতীয় পরিচয়পত্র (NID)', en: 'Applicant/Guardian National ID (NID)' }, required: true },
      { id: 'ic-doc-2', title: { bn: 'আয়ের প্রমাণপত্র (বেতন স্লিপ / ট্রেড লাইসেন্স / আয়কর রিটার্ন / হলফনামা)', en: 'Income Proof (Salary Slip / Trade License / Tax Return / Declaration)' }, required: true },
    ],
    steps: [
      { stepNumber: 1, title: { bn: 'আয়ের তথ্য ও প্রমাণপত্র প্রস্তুত করুন', en: 'Prepare Income Proof & NID' }, description: { bn: 'পেশা, বার্ষিক আয় ও সংশ্লিষ্ট নথি স্ক্যান করে রাখুন।', en: 'Scan your NID and relevant income or occupation proof.' } },
      { stepNumber: 2, title: { bn: 'লগইন করে আবেদন জমা দিন', en: 'Sign In & Submit Form' }, description: { bn: 'বার্ষিক আয়ের তথ্য ও প্রয়োজনীয়তা উল্লেখ করে আবেদন দাখিল করুন।', en: 'Authenticate, enter income and purpose details, attach proof, and submit.' } },
    ],
    fees: UPDATING_FEE_SCHEDULE,
    faqs: [
      {
        id: 'ic-faq-1',
        question: { bn: 'শিক্ষার্থীর বৃত্তির জন্য কার নামে আবেদন করতে হবে?', en: 'Whose details should be entered for a student scholarship income certificate?' },
        answer: {
          bn: 'অভিভাবকের (পিতা/মাতা) নাম, পেশা ও বার্ষিক আয় এবং বিবরণে শিক্ষার্থীর নাম ও প্রতিষ্ঠানের তথ্য উল্লেখ করুন।',
          en: 'Provide the earning parent/guardian’s occupation and annual income, and mention the student’s scholarship purpose.',
        },
      },
    ],
    departmentId: 'birth_death',
    relatedSlugs: ['citizenship-certificate', 'family-certificate', 'character-certificate'],
    formFields: [
      { name: 'applicantName', type: 'text', label: { bn: 'আবেদনকারী / অভিভাবকের পূর্ণ নাম', en: 'Applicant / Guardian Full Name' }, required: true },
      { name: 'occupation', type: 'text', label: { bn: 'পেশা', en: 'Occupation' }, placeholder: { bn: 'যেমন: বেসরকারি চাকরি / ক্ষুদ্র ব্যবসা', en: 'e.g. Private Service / Small Business' }, required: true },
      { name: 'annualIncomeBdt', type: 'number', label: { bn: 'বার্ষিক আনুমানিক আয় (টাকা)', en: 'Estimated Annual Income (BDT)' }, placeholder: { bn: 'যেমন: 360000', en: 'e.g. 360000' }, required: true },
      { name: 'nid', type: 'text', label: { bn: 'জাতীয় পরিচয়পত্র নম্বর (NID)', en: 'NID Number' }, pattern: 'nid', required: true },
      { name: 'phone', type: 'tel', label: { bn: 'মোবাইল নম্বর', en: 'Mobile Number' }, pattern: 'bd_phone', required: true },
      { name: 'wardNumber', type: 'ward', label: { bn: 'ওয়ার্ড নম্বর', en: 'Ward Number' }, required: true },
      { name: 'purpose', type: 'text', label: { bn: 'আয় সনদের উদ্দেশ্য', en: 'Purpose of Income Certificate' }, placeholder: { bn: 'যেমন: বিশ্ববিদ্যালয়ের শিক্ষাবৃত্তি', en: 'e.g. University Scholarship' }, required: true, fullWidth: true },
      { name: 'address', type: 'textarea', label: { bn: 'পূর্ণ ঠিকানা', en: 'Full Residential Address' }, required: true, fullWidth: true },
      { name: 'incomeProof', type: 'file', label: { bn: 'আয়ের প্রমাণপত্র ও এনআইডি আপলোড', en: 'Upload Income Proof & NID' }, accept: '.pdf,.jpg,.jpeg,.png', maxFileSizeMb: 5, required: true, fullWidth: true },
    ],
    backendIntegration: {
      supportedInPortal: true,
      existingHandler: 'mockApi.submitApplication',
      applicationType: 'citizen_certificate',
      apiEndpointContract: 'POST /api/v1/certificates/income',
      missingBackendNote: {
        bn: 'আবেদনটি পোর্টালে সংরক্ষিত হয়; ওয়ার্ড কার্যালয়ের সরেজমিন যাচাই ও চূড়ান্ত ডিজিটাল সনদ জারির জন্য ব্যাকএন্ড API প্রয়োজন।',
        en: 'Submissions are saved in the portal; Ward Office review and official digitally signed issuance require production backend APIs.',
      },
    },
  },
];
