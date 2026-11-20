import type { LucideIcon } from 'lucide-react';
import type { ServiceAvailability } from '@/config/status-config';
import type { ApplicationType, ComplaintCategory, FacilityType } from '@/types';

export interface BilingualString {
  bn: string;
  en: string;
}

export type ServiceCategorySlug =
  | 'registration-certificates'
  | 'business-licensing'
  | 'tax-revenue'
  | 'infrastructure-public-services';

export type ServiceInteractionMode =
  | 'application'
  | 'complaint'
  | 'verification'
  | 'tax-calculator'
  | 'tax-payment'
  | 'tax-history'
  | 'receipt-lookup'
  | 'facility-booking'
  | 'public-directory'
  | 'document-download';

export type FormFieldType =
  | 'text'
  | 'tel'
  | 'email'
  | 'date'
  | 'number'
  | 'select'
  | 'textarea'
  | 'ward'
  | 'file';

export interface ServiceFormFieldOption {
  value: string;
  label: BilingualString;
}

export interface ServiceFormField {
  name: string;
  type: FormFieldType;
  label: BilingualString;
  placeholder?: BilingualString;
  helperText?: BilingualString;
  required?: boolean;
  options?: ServiceFormFieldOption[];
  accept?: string;
  maxFileSizeMb?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: 'bd_phone' | 'nid' | 'holding_no';
  fullWidth?: boolean;
}

export interface ServiceDocumentItem {
  id: string;
  title: BilingualString;
  note?: BilingualString;
  required: boolean;
  verifiedSource?: boolean;
}

export interface ServiceStepItem {
  stepNumber: number;
  title: BilingualString;
  description: BilingualString;
}

export interface ServiceFeeSchedule {
  isVerified: boolean;
  applicationFee?: BilingualString;
  serviceCharge?: BilingualString;
  additionalFees?: BilingualString;
  processingTime?: BilingualString;
  paymentMethods?: BilingualString;
  note?: BilingualString;
}

export interface ServiceFaqItem {
  id: string;
  question: BilingualString;
  answer: BilingualString;
}

export interface DepartmentContactInfo {
  id: string;
  name: BilingualString;
  phone: string;
  email: string;
  officeAddress: BilingualString;
  hours: BilingualString;
  supportHref: string;
}

export interface PublicDirectoryEntry {
  id: string;
  name: BilingualString;
  ward: BilingualString;
  location: BilingualString;
  facilities: BilingualString[];
  hours?: BilingualString;
  accessibility?: BilingualString;
  contact?: string;
  mapLayer?: string;
}

export interface ServiceBackendIntegration {
  supportedInPortal: boolean;
  existingHandler?:
    | 'mockApi.submitApplication'
    | 'mockApi.submitComplaint'
    | 'mockApi.verifyDocumentById'
    | 'mockApi.calculateHoldingTax'
    | 'mockApi.getTaxRecords'
    | 'mockApi.bookFacility'
    | 'mockApi.getApplications';
  applicationType?: ApplicationType;
  complaintCategory?: ComplaintCategory;
  facilityType?: FacilityType;
  missingBackendNote?: BilingualString;
  apiEndpointContract: string;
}

export interface CitizenServiceCategory {
  slug: ServiceCategorySlug;
  order: number;
  title: BilingualString;
  shortTitle: BilingualString;
  description: BilingualString;
  icon: LucideIcon;
}

export interface CitizenServiceDefinition {
  id: string;
  slug: string;
  categorySlug: ServiceCategorySlug;
  icon: LucideIcon;
  title: BilingualString;
  shortDescription: BilingualString;
  availability: ServiceAvailability;
  requiresAuthForAction: boolean;
  interactionMode: ServiceInteractionMode;
  primaryCtaLabel: BilingualString;
  keywords: string[];
  overview: {
    whatItIs: BilingualString;
    whyNeeded: BilingualString;
    whoCanUse: BilingualString;
    deliverable: BilingualString;
  };
  eligibility: {
    isOfficiallyVerified: boolean;
    items: BilingualString[];
  };
  requiredDocuments: ServiceDocumentItem[];
  steps: ServiceStepItem[];
  fees: ServiceFeeSchedule;
  faqs: ServiceFaqItem[];
  departmentId: string;
  relatedSlugs: string[];
  formFields: ServiceFormField[];
  publicDirectoryEntries?: PublicDirectoryEntry[];
  backendIntegration: ServiceBackendIntegration;
  guidelinesSummary?: BilingualString;
}

export interface SubmittedServiceResult {
  referenceId: string;
  submittedAt: string;
  statusLabel: BilingualString;
  summary: BilingualString;
  departmentName?: BilingualString;
  mode: 'portal-recorded' | 'verification-result';
}

export function pickText(text: BilingualString, lang: 'en' | 'bn'): string {
  return lang === 'bn' ? text.bn : text.en;
}
