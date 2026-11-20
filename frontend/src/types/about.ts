import type { LucideIcon } from 'lucide-react';
import { Language } from './index';

export interface BilingualText {
  bn: string;
  en: string;
}

export function pickLang(text: BilingualText, language: Language): string {
  return language === 'bn' ? text.bn : text.en;
}

export type AboutPageSlug =
  | 'overview'
  | 'history'
  | 'mission-vision'
  | 'mayor'
  | 'councillors'
  | 'wards'
  | 'organogram'
  | 'departments'
  | 'citizen-charter'
  | 'locations'
  | 'contact';

export interface AboutNavItem {
  slug: AboutPageSlug;
  href: string;
  title: BilingualText;
  shortTitle: BilingualText;
  subtitle: BilingualText;
  icon: LucideIcon;
}

export interface OverviewStatItem {
  id: string;
  label: BilingualText;
  value: BilingualText;
  note: BilingualText;
}

export interface CivicInfoItem {
  id: string;
  icon: LucideIcon;
  title: BilingualText;
  description: BilingualText;
  meta?: BilingualText;
}

export interface HistoryMilestone {
  id: string;
  year: BilingualText;
  era: BilingualText;
  title: BilingualText;
  description: BilingualText;
  impact: BilingualText;
}

export interface MayorProfile {
  name: BilingualText;
  designation: BilingualText;
  tenure: BilingualText;
  office: BilingualText;
  phone: string;
  email: string;
  officeHours: BilingualText;
  messageTitle: BilingualText;
  messageBody: BilingualText[];
  biography: BilingualText[];
  education: BilingualText[];
  priorities: CivicInfoItem[];
}

export type CouncillorSeatType = 'general' | 'reserved';

export interface PersonProfile {
  id: string;
  name: BilingualText;
  designation: BilingualText;
  badgeText: BilingualText;
  zoneId?: string;
  zoneLabel?: BilingualText;
  wardNumber?: number;
  seatType?: CouncillorSeatType;
  departmentId?: DepartmentId;
  phone: string;
  email: string;
  officeHours: BilingualText;
  officeLocation?: BilingualText;
}

export interface WardDirectoryItem {
  wardNumber: number;
  zoneId: string;
  zoneLabel: BilingualText;
  areaName: BilingualText;
  coveredAreas: BilingualText;
  councillorName: BilingualText;
  councillorPhone: string;
  secretaryName: BilingualText;
  secretaryPhone: string;
  wasteSchedule: BilingualText;
  foggingSchedule: BilingualText;
  population: BilingualText;
}

export type DepartmentId =
  | 'engineering'
  | 'revenue'
  | 'conservancy'
  | 'health'
  | 'license'
  | 'birth_death'
  | 'it_smart';

export interface OrgDivision {
  id: string;
  title: BilingualText;
  headTitle: BilingualText;
  summary: BilingualText;
  keyDuties: BilingualText[];
  unitsCount: BilingualText;
}

export interface DepartmentInfo {
  id: DepartmentId;
  name: BilingualText;
  overview: BilingualText;
  responsibilities: BilingualText[];
  hotline: string;
  officeFloor: BilingualText;
}

export interface CitizenCharterItem {
  id: string;
  departmentId: DepartmentId;
  departmentName: BilingualText;
  serviceName: BilingualText;
  requiredDocs: BilingualText;
  fee: BilingualText;
  processingTime: BilingualText;
  responsibleOfficer: BilingualText;
  applyHref: string;
}

export interface ZonalOfficeItem {
  id: string;
  zoneNumber: number;
  title: BilingualText;
  wardsCovered: BilingualText;
  address: BilingualText;
  executiveOfficer: BilingualText;
  phone: string;
  email: string;
  hours: BilingualText;
  lat: number;
  lng: number;
}

export interface EmergencyHelplineItem {
  id: string;
  code: string;
  title: BilingualText;
  description: BilingualText;
  availability: BilingualText;
  accent: 'crimson' | 'green';
}

export interface OfficialContactItem {
  id: string;
  officeName: BilingualText;
  category: 'headquarters' | 'revenue' | 'engineering' | 'health' | 'zonal';
  categoryLabel: BilingualText;
  officerTitle: BilingualText;
  phone: string;
  email: string;
  roomOrFloor: BilingualText;
}
