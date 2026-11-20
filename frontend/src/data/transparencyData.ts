export interface SectorAllocationItem {
  name: string;
  value: number;
  color: string;
}

export const TRANSPARENCY_SECTORS: SectorAllocationItem[] = [
  { name: 'Drainage & Flood Control', value: 34, color: '#006A4E' },
  { name: 'Roads & Footpaths', value: 28, color: '#059669' },
  { name: 'Waste & Smart Bins', value: 18, color: '#10B981' },
  { name: 'Parks & LED Lighting', value: 12, color: '#D97706' },
  { name: 'Public Health', value: 8, color: '#C81E1E' },
];
