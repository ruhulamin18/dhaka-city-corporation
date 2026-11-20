'use client';

import React from 'react';
import Link from 'next/link';
import { Phone, ShieldAlert, Sparkles, Trash2, UserCheck } from 'lucide-react';
import { Language, WardInfo } from '@/types';
import { SatellitePinMap } from '@/components/SatellitePinMap';
import { getWardCenter } from '@/lib/dhakaCoords';

export interface WardDirectoryCardProps {
  ward: WardInfo;
  language: Language;
  labels: {
    wardPrefix: string;
    councillor: string;
    emergency: string;
    wasteSchedule: string;
    foggingSchedule: string;
    population: string;
    area: string;
    viewOnMap: string;
    complaints: string;
  };
}

export function WardDirectoryCard({ ward, language, labels }: WardDirectoryCardProps) {
  const wardName = language === 'bn' ? ward.nameBn : ward.nameEn;
  const zoneName = language === 'bn' ? ward.zoneBn : ward.zoneEn;
  const center = getWardCenter(ward.wardNumber);

  return (
    <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 space-y-4">
      <div className="border-b border-slate-100 pb-3">
        <p className="text-xs font-semibold text-[#006A4E]">{zoneName}</p>
        <h3 className="text-lg font-bold text-[#111827] mt-0.5">
          {labels.wardPrefix} {ward.wardNumber}: {wardName}
        </h3>
      </div>

      {/* Live Satellite Preview of Selected Ward */}
      <SatellitePinMap
        lat={center.lat}
        lng={center.lng}
        zoom={14}
        label={`${labels.wardPrefix} ${ward.wardNumber} · ${wardName}`}
        subtitle={zoneName}
        heightClassName="h-44"
        pinColor="teal"
      />

      <div className="space-y-3 text-sm">
        <div className="flex items-start gap-3">
          <span className="w-7 h-7 rounded-lg bg-[#ECFDF5] text-[#006A4E] flex items-center justify-center shrink-0">
            <UserCheck className="w-3.5 h-3.5" aria-hidden="true" />
          </span>
          <div>
            <p className="text-xs text-[#4B5563]">{labels.councillor}</p>
            <p className="font-semibold text-[#111827]">
              {language === 'bn' ? ward.councillorBn : ward.councillorEn}
            </p>
            <p className="text-xs font-mono text-[#4B5563] tabular-nums">
              {ward.councillorPhone}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <span className="w-7 h-7 rounded-lg bg-[#FEF2F2] text-[#C81E1E] flex items-center justify-center shrink-0">
            <Phone className="w-3.5 h-3.5" aria-hidden="true" />
          </span>
          <div>
            <p className="text-xs text-[#4B5563]">{labels.emergency}</p>
            <p className="font-semibold font-mono text-[#111827] tabular-nums">
              {ward.emergencyPhone}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <span className="w-7 h-7 rounded-lg bg-[#ECFDF5] text-[#006A4E] flex items-center justify-center shrink-0">
            <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
          </span>
          <div>
            <p className="text-xs text-[#4B5563]">{labels.wasteSchedule}</p>
            <p className="font-medium text-[#111827]">
              {language === 'bn' ? ward.wasteScheduleBn : ward.wasteScheduleEn}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <span className="w-7 h-7 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
            <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
          </span>
          <div>
            <p className="text-xs text-[#4B5563]">{labels.foggingSchedule}</p>
            <p className="font-medium text-[#111827]">
              {language === 'bn' ? ward.foggingScheduleBn : ward.foggingScheduleEn}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100 text-xs">
        <div>
          <span className="text-[#4B5563] block">{labels.population}</span>
          <span className="font-bold text-[#111827] tabular-nums">
            {ward.population.toLocaleString()}
          </span>
        </div>
        <div>
          <span className="text-[#4B5563] block">{labels.area}</span>
          <span className="font-bold text-[#111827] tabular-nums">
            {ward.areaSqKm} sq.km
          </span>
        </div>
      </div>

      <div className="pt-2 flex gap-2">
        <Link
          href={`/city-map?ward=${ward.wardNumber}`}
          className="flex-1 text-center px-3 py-2 text-xs font-semibold text-white bg-[#006A4E] hover:bg-[#00523C] rounded-lg transition-colors"
        >
          {labels.viewOnMap}
        </Link>
        <Link
          href={`/complaints?tab=submit&ward=${ward.wardNumber}`}
          className="inline-flex items-center gap-1 px-3 py-2 text-xs font-semibold text-[#006A4E] bg-[#ECFDF5] hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors"
        >
          <ShieldAlert className="w-3.5 h-3.5" aria-hidden="true" />
          <span>{labels.complaints}</span>
        </Link>
      </div>
    </div>
  );
}
