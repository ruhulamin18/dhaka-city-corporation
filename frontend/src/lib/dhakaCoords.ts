import { WardInfo } from '@/types';

export const DHAKA_CENTER = { lat: 23.7644, lng: 90.389 };

export const WARD_CENTROIDS: Record<number, { lat: number; lng: number }> = {
  12: { lat: 23.8069, lng: 90.3687 }, // Mirpur Section 10 & Shah Ali
  19: { lat: 23.7808, lng: 90.4152 }, // Banani, Korail & Gulshan-1
  24: { lat: 23.7231, lng: 90.3886 }, // Lalbagh & Azimpur Heritage
  27: { lat: 23.7461, lng: 90.3742 }, // Dhanmondi Lake & Green Road
  32: { lat: 23.7654, lng: 90.3621 }, // Mohammadpur Tajmahal Road
  36: { lat: 23.733, lng: 90.4172 }, // Motijheel Commercial & Paltan
  41: { lat: 23.869, lng: 90.402 }, // Uttara Sector 4, 6 & 8
  48: { lat: 23.719, lng: 90.471 }, // Jatrabari & Demra Growth Hub
};

export function getWardCenter(wardNumber: number): { lat: number; lng: number } {
  return WARD_CENTROIDS[wardNumber] ?? DHAKA_CENTER;
}

export function findNearestWard(lat: number, lng: number, wards: WardInfo[]): number {
  if (wards.length === 0) return 27;
  let closestWard = wards[0].wardNumber;
  let bestDist = Infinity;

  for (const w of wards) {
    const center = getWardCenter(w.wardNumber);
    const dLat = center.lat - lat;
    const dLng = center.lng - lng;
    const dist = dLat * dLat + dLng * dLng;
    if (dist < bestDist) {
      bestDist = dist;
      closestWard = w.wardNumber;
    }
  }

  return closestWard;
}
