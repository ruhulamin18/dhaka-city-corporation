import type { LucideIcon } from 'lucide-react';
import {
  AlertCircle,
  Construction,
  Cross,
  Layers,
  Recycle,
  Trees,
} from 'lucide-react';
import { GisLayerType } from '@/types';

export interface GisLayerMetaItem {
  id: GisLayerType;
  icon: LucideIcon;
  dotClass: string;
}

export const GIS_LAYER_META: GisLayerMetaItem[] = [
  { id: 'hospital', icon: Cross, dotClass: 'bg-[#C81E1E]' },
  { id: 'public_toilet', icon: Layers, dotClass: 'bg-sky-600' },
  { id: 'park', icon: Trees, dotClass: 'bg-[#006A4E]' },
  { id: 'waste_point', icon: Recycle, dotClass: 'bg-amber-600' },
  { id: 'road_digging', icon: Construction, dotClass: 'bg-orange-600' },
  { id: 'complaint', icon: AlertCircle, dotClass: 'bg-[#00523C]' },
];

export const ALL_GIS_LAYERS: GisLayerType[] = GIS_LAYER_META.map((item) => item.id);

const GIS_LAYER_ALIAS_MAP: Record<string, GisLayerType> = {
  hospital: 'hospital',
  health: 'hospital',
  public_toilet: 'public_toilet',
  toilet: 'public_toilet',
  park: 'park',
  waste_point: 'waste_point',
  waste: 'waste_point',
  bin: 'waste_point',
  road_digging: 'road_digging',
  road: 'road_digging',
  complaint: 'complaint',
};

/**
 * Resolves a `?layer=` URL query parameter (including short aliases like `bin`, `toilet`)
 * into a validated GisLayerType, or returns null if unrecognized.
 */
export function resolveGisLayerParam(param: string | null): GisLayerType | null {
  if (!param) return null;
  return GIS_LAYER_ALIAS_MAP[param.trim().toLowerCase()] ?? null;
}

/**
 * Parses a `?ward=` URL query parameter into a valid positive ward integer or 'all'.
 */
export function resolveWardParam(param: string | null): number | 'all' {
  if (!param) return 'all';
  const parsed = Number(param);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : 'all';
}
