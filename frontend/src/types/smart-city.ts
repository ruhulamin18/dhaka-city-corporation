import type { LucideIcon } from 'lucide-react';
import type { BilingualText } from './about';
import type { GisMarker, WardInfo } from './index';

export type SmartCityFeatureSlug =
  | 'gis-map'
  | 'ward-map'
  | 'waste-management'
  | 'drainage-monitoring'
  | 'road-monitoring'
  | 'smart-parking'
  | 'air-quality'
  | 'facility-locator'
  | 'emergency-sos'
  | 'disaster-alerts'
  | 'ai-assistant'
  | 'dashboard';

export type SmartCityCategory =
  | 'gis-mapping'
  | 'urban-management'
  | 'environment-safety'
  | 'citizen-intelligence';

export interface SmartCityCategoryMeta {
  id: SmartCityCategory;
  number: string;
  title: BilingualText;
  description: BilingualText;
  featureSlugs: SmartCityFeatureSlug[];
}

export interface SmartCityFeatureMeta {
  slug: SmartCityFeatureSlug;
  category: SmartCityCategory;
  title: BilingualText;
  shortTitle: BilingualText;
  subtitle: BilingualText;
  purpose: BilingualText;
  icon: LucideIcon;
  badge?: BilingualText;
  highlightStats?: Array<{
    label: BilingualText;
    value: string;
    sublabel?: BilingualText;
  }>;
}

export interface WasteCollectionSchedule {
  wardNumber: number;
  wardName: BilingualText;
  zone: BilingualText;
  primarySchedule: BilingualText;
  secondarySchedule: BilingualText;
  nightShift?: BilingualText;
  primaryPoints: BilingualText[];
  supervisorName: BilingualText;
  supervisorPhone: string;
  vanCount: number;
}

export interface DrainageMonitoringPoint {
  id: string;
  name: BilingualText;
  wardNumber: number;
  location: BilingualText;
  coords: { lat: number; lng: number };
  waterloggingRisk: 'low' | 'moderate' | 'high' | 'severe';
  currentStatus: 'normal' | 'monitoring' | 'desilting' | 'waterlogged';
  sensorConnected: boolean;
  waterLevelCm?: number;
  lastCleanedDate: string;
  nextScheduledCleaning: string;
  culvertType: BilingualText;
}

export interface RoadConditionItem {
  id: string;
  roadName: BilingualText;
  wardNumber: number;
  zone: BilingualText;
  lengthKm: number;
  condition: 'good' | 'maintenance' | 'damaged' | 'repair_required' | 'construction';
  lastInspectionDate: string;
  contractor?: BilingualText;
  completionProgress?: number;
  estimatedCompletion?: string;
  trafficLoad: 'heavy' | 'moderate' | 'normal';
  coords: { lat: number; lng: number };
}

export interface ParkingFacility {
  id: string;
  name: BilingualText;
  wardNumber: number;
  areaName: BilingualText;
  coords: { lat: number; lng: number };
  totalCapacity: number;
  estimatedAvailable?: number;
  supportedVehicles: Array<'car' | 'bike' | 'suv' | 'bus' | 'ev'>;
  hourlyRateBdt: {
    car: number;
    bike: number;
    evChargingExtra?: number;
  };
  operatingHours: BilingualText;
  hasEvCharging: boolean;
  isAccessible: boolean;
  rules: BilingualText[];
}

export interface AirQualityStation {
  id: string;
  stationName: BilingualText;
  wardNumber: number;
  locationArea: BilingualText;
  coords: { lat: number; lng: number };
  aqi: number;
  category: 'good' | 'moderate' | 'unhealthy_sensitive' | 'unhealthy' | 'very_unhealthy' | 'hazardous';
  pm25: number;
  pm10: number;
  temperatureC: number;
  humidityPercent: number;
  lastUpdated: string;
  sourceAuthority: BilingualText;
  historical7Days: Array<{
    day: string;
    aqi: number;
  }>;
}

export type FacilityCategoryType =
  | 'hospital'
  | 'clinic'
  | 'pharmacy'
  | 'police'
  | 'fire_station'
  | 'government'
  | 'ward_office'
  | 'toilet'
  | 'park'
  | 'community_center'
  | 'education'
  | 'transport';

export interface PublicFacilityItem {
  id: string;
  name: BilingualText;
  category: FacilityCategoryType;
  wardNumber: number;
  address: BilingualText;
  phone: string;
  operatingHours: BilingualText;
  services: BilingualText[];
  coords: { lat: number; lng: number };
  emergencyDirect?: boolean;
}

export interface EmergencyContactItem {
  id: string;
  serviceName: BilingualText;
  category: 'national' | 'police' | 'fire' | 'medical' | 'utility';
  hotline: string;
  alternateNumber?: string;
  description: BilingualText;
  isDirectCall: boolean;
  isNationalPriority?: boolean;
  actionGuidance: BilingualText;
  coverageArea: BilingualText;
}

export type DisasterAlertCategory =
  | 'information'
  | 'advisory'
  | 'watch'
  | 'warning'
  | 'emergency';

export interface DisasterAlertItem {
  id: string;
  title: BilingualText;
  category: DisasterAlertCategory;
  severityLevel: 'low' | 'medium' | 'high' | 'critical';
  issuingAuthority: BilingualText;
  publishedAt: string;
  expiresAt?: string;
  affectedWards: number[] | 'all';
  affectedLocationName: BilingualText;
  instructions: BilingualText[];
  officialSource: BilingualText;
  isActive: boolean;
}

export interface SmartCityFaqItem {
  question: BilingualText;
  answer: BilingualText;
}
