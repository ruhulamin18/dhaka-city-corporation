import { FacilityType } from '@/types';

export type CitizenTab =
  | 'overview'
  | 'tradeLicense'
  | 'holdingTax'
  | 'certificates'
  | 'roadDigging'
  | 'facilityBooking';

export const VALID_CITIZEN_TABS: ReadonlyArray<CitizenTab> = [
  'overview',
  'tradeLicense',
  'holdingTax',
  'certificates',
  'roadDigging',
  'facilityBooking',
];

export function isValidCitizenTab(value: string | null): value is CitizenTab {
  return value !== null && (VALID_CITIZEN_TABS as readonly string[]).includes(value);
}

export interface MunicipalFacilityItem {
  type: FacilityType;
  nameEn: string;
  nameBn: string;
  wardNumber: number;
  feeBdt: number;
}

export const CITIZEN_FACILITIES: MunicipalFacilityItem[] = [
  {
    type: 'community_center',
    nameEn: 'Dhanmondi Smart Community Hall',
    nameBn: 'ধানমন্ডি স্মার্ট কমিউনিটি হল',
    wardNumber: 27,
    feeBdt: 12000,
  },
  {
    type: 'community_center',
    nameEn: 'Mirpur-10 Municipal Auditorium',
    nameBn: 'মিরপুর-১০ পৌর অডিটোরিয়াম',
    wardNumber: 12,
    feeBdt: 10000,
  },
  {
    type: 'cemetery',
    nameEn: 'Azimpur Municipal Cemetery Slot & Burial Permit',
    nameBn: 'আজিমপুর পৌর কবরস্থান স্লট ও দাফন অনুমতি',
    wardNumber: 24,
    feeBdt: 1500,
  },
  {
    type: 'cemetery',
    nameEn: 'Banani Smart Graveyard Management Service',
    nameBn: 'বনানী স্মার্ট কবরস্থান ব্যবস্থাপনা সেবা',
    wardNumber: 19,
    feeBdt: 2000,
  },
];
