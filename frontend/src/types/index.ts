export type Language = 'en' | 'bn';

export type UserRole = 'public' | 'citizen' | 'officer' | 'staff' | 'admin';

export type AuthRole = 'citizen' | 'officer' | 'staff' | 'admin';

export type OfficialRole = 'admin' | 'officer' | 'staff';

export type FontScale = 'sm' | 'md' | 'lg';

export interface DemoUser {
  id: string;
  role: UserRole;
  nameEn: string;
  nameBn: string;
  titleEn: string;
  titleBn: string;
  wardNumber?: number;
  department?: string;
  nid?: string;
  phone?: string;
}

export interface AuthUser {
  id: string;
  role: AuthRole;
  nameEn: string;
  nameBn: string;
  titleEn: string;
  titleBn: string;
  phone?: string;
  nid?: string;
  employeeId?: string;
  email?: string;
  wardNumber?: number;
  department?: string;
}

export interface CitizenRegistrationPayload {
  fullName: string;
  phone: string;
  nid: string;
  wardNumber: number;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  user?: AuthUser;
  errorEn?: string;
  errorBn?: string;
}

export interface DemoCredentialInfo {
  role: AuthRole;
  labelEn: string;
  labelBn: string;
  identifier: string;
  password: string;
  noteEn: string;
  noteBn: string;
}

export type ApplicationType =
  | 'trade_license'
  | 'birth_certificate'
  | 'citizen_certificate'
  | 'road_digging';

export type ApplicationStatus = 'pending' | 'under_review' | 'approved' | 'rejected';

export type PaymentMethod = 'bkash' | 'nagad' | 'rocket' | 'card';

export interface ServiceApplication {
  id: string;
  referenceId: string;
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
  paymentStatus: 'paid' | 'unpaid';
  transactionId?: string;
  status: ApplicationStatus;
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  qrHash: string;
  notes?: string;
  details?: Record<string, string | number>;
}

export interface HoldingTaxInput {
  wardNumber: number;
  holdingNumber: string;
  ownerName: string;
  propertyType: 'residential' | 'commercial' | 'industrial' | 'mixed';
  areaSqFt: number;
  floors: number;
  roadWidthCategory: 'main_road' | 'lane';
}

export interface HoldingTaxCalculation {
  annualValuationBdt: number;
  annualTaxBdt: number;
  quarterlyTaxBdt: number;
  conservancyFeeBdt: number;
  streetLightFeeBdt: number;
  totalPayableBdt: number;
}

export interface HoldingTaxRecord {
  id: string;
  receiptId: string;
  holdingNumber: string;
  ownerName: string;
  wardNumber: number;
  propertyType: string;
  areaSqFt: number;
  amountPaidBdt: number;
  fiscalYear: string;
  paymentMethod: PaymentMethod;
  transactionId: string;
  paidAt: string;
  qrHash: string;
}

export type FacilityType = 'community_center' | 'cemetery';

export type TimeSlot = 'morning' | 'evening' | 'full_day';

export interface FacilityBooking {
  id: string;
  bookingId: string;
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
  transactionId: string;
  status: 'confirmed' | 'pending';
  createdAt: string;
}

export type ComplaintCategory =
  | 'road_damage'
  | 'drainage'
  | 'waste'
  | 'street_light'
  | 'mosquito';

export type ComplaintStatus = 'pending' | 'assigned' | 'in_progress' | 'resolved';

export interface Complaint {
  id: string;
  trackingId: string;
  citizenName: string;
  phone: string;
  wardNumber: number;
  category: ComplaintCategory;
  departmentEn: string;
  departmentBn: string;
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  locationLabel: string;
  photoUrl?: string;
  proofPhotoUrl?: string;
  assignedStaffId?: string;
  assignedStaffName?: string;
  status: ComplaintStatus;
  priority: 'normal' | 'high' | 'urgent';
  rating?: number;
  feedback?: string;
  createdAt: string;
  updatedAt: string;
  resolutionNote?: string;
}

export interface FieldStaffMember {
  id: string;
  nameEn: string;
  nameBn: string;
  departmentEn: string;
  departmentBn: string;
  wardNumber: number;
  phone: string;
  activeTasks: number;
}

export interface WardInfo {
  wardNumber: number;
  zoneEn: string;
  zoneBn: string;
  nameEn: string;
  nameBn: string;
  councillorEn: string;
  councillorBn: string;
  councillorPhone: string;
  emergencyPhone: string;
  wasteScheduleEn: string;
  wasteScheduleBn: string;
  foggingScheduleEn: string;
  foggingScheduleBn: string;
  population: number;
  areaSqKm: number;
  mapX: number;
  mapY: number;
}

export type NoticeCategory =
  | 'revenue'
  | 'tender'
  | 'public_health'
  | 'infrastructure'
  | 'general';

export interface NoticeItem {
  id: string;
  titleEn: string;
  titleBn: string;
  summaryEn: string;
  summaryBn: string;
  category: NoticeCategory;
  publishedAt: string;
  referenceCode: string;
  isUrgent?: boolean;
  type?: 'notice' | 'news';
  fileSize?: string;
}

export type GisLayerType =
  | 'hospital'
  | 'public_toilet'
  | 'park'
  | 'waste_point'
  | 'road_digging'
  | 'complaint';

export interface GisMarker {
  id: string;
  type: GisLayerType;
  titleEn: string;
  titleBn: string;
  wardNumber: number;
  x: number;
  y: number;
  latitude: number;
  longitude: number;
  statusEn: string;
  statusBn: string;
  detailsEn: string;
  detailsBn: string;
  addressEn?: string;
  addressBn?: string;
  phone?: string;
  operatingHoursEn?: string;
  operatingHoursBn?: string;
}

export interface WardBudget {
  wardNumber: number;
  wardLabel: string;
  allocatedCrore: number;
  spentCrore: number;
  utilizationPercent: number;
}

export interface DevelopmentProject {
  id: string;
  titleEn: string;
  titleBn: string;
  wardNumber: number;
  contractorEn: string;
  contractorBn: string;
  budgetBdt: number;
  progressPercent: number;
  deadline: string;
  status: 'on_track' | 'completed' | 'delayed';
  sectorEn: string;
  sectorBn: string;
}

export interface VerificationResult {
  valid: boolean;
  referenceId: string;
  documentTypeEn: string;
  documentTypeBn: string;
  ownerName: string;
  wardNumber: number;
  issuedAt: string;
  expiresAt?: string;
  status: 'VERIFIED' | 'PENDING' | 'REVOKED';
  authorityEn: string;
  authorityBn: string;
  amountPaidBdt?: number;
  qrHash: string;
}

export interface PaymentReceipt {
  transactionId: string;
  method: PaymentMethod;
  amountBdt: number;
  paidAt: string;
  referenceId: string;
  payerName: string;
}
