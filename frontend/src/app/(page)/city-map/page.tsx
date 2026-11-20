'use client';

import React, { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { MapPin } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { mockApi } from '@/services/mockApi';
import { GisLayerType, GisMarker, WardInfo } from '@/types';
import {
  ALL_GIS_LAYERS,
  GIS_LAYER_META,
  resolveGisLayerParam,
  resolveWardParam,
} from '@/data/cityMapData';
import { InteractiveCityMap } from '@/components/InteractiveCityMap';

function CityMapContent() {
  const { language, t } = useApp();
  const searchParams = useSearchParams();
  const wardParam = searchParams.get('ward');
  const layerParam = searchParams.get('layer');

  const initialWard = resolveWardParam(wardParam);
  const resolvedLayer = resolveGisLayerParam(layerParam);

  const [wards, setWards] = useState<WardInfo[]>([]);
  const [markers, setMarkers] = useState<GisMarker[]>([]);
  const [selectedWard, setSelectedWard] = useState<number | 'all'>(initialWard);
  const [activeLayers, setActiveLayers] = useState<GisLayerType[]>(
    resolvedLayer ? [resolvedLayer] : ALL_GIS_LAYERS
  );
  const [selectedMarker, setSelectedMarker] = useState<GisMarker | null>(null);

  useEffect(() => {
    let active = true;
    Promise.all([mockApi.getWards(), mockApi.getGisMarkers()]).then(([w, m]) => {
      if (!active) return;
      setWards(w);
      setMarkers(m);
      if (m.length > 0) {
        const preferred = resolvedLayer
          ? m.find(
              (marker) =>
                marker.type === resolvedLayer &&
                (initialWard === 'all' || marker.wardNumber === initialWard)
            )
          : initialWard !== 'all'
            ? m.find((marker) => marker.wardNumber === initialWard)
            : m[0];
        setSelectedMarker(preferred ?? m[0]);
      }
    });
    return () => {
      active = false;
    };
  }, [initialWard, resolvedLayer]);

  // Sync filter state when navigating to /city-map with new ?ward= or ?layer= query parameters
  useEffect(() => {
    const nextWard = resolveWardParam(wardParam);
    const nextLayer = resolveGisLayerParam(layerParam);
    queueMicrotask(() => {
      setSelectedWard(nextWard);
      setActiveLayers(nextLayer ? [nextLayer] : ALL_GIS_LAYERS);
    });
  }, [wardParam, layerParam]);

  const toggleLayer = (layer: GisLayerType) => {
    setActiveLayers((prev) =>
      prev.includes(layer) ? prev.filter((l) => l !== layer) : [...prev, layer]
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#111827]">{t.cityMapPage.title}</h1>
          <p className="mt-1.5 text-sm sm:text-base text-[#4B5563] max-w-3xl">
            {t.cityMapPage.subtitle}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <label
            htmlFor="map-ward-filter"
            className="text-xs font-semibold text-[#111827] whitespace-nowrap"
          >
            {t.common.ward}:
          </label>
          <select
            id="map-ward-filter"
            value={selectedWard}
            onChange={(e) =>
              setSelectedWard(e.target.value === 'all' ? 'all' : Number(e.target.value))
            }
            className="px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006A4E]"
          >
            <option value="all">{t.cityMapPage.allWards}</option>
            {wards.map((w) => (
              <option key={w.wardNumber} value={w.wardNumber}>
                {t.common.ward} {w.wardNumber} — {language === 'bn' ? w.nameBn : w.nameEn}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Layer Controls & Selected Marker Inspector */}
        <div className="lg:col-span-4 space-y-6">
          <div className="civic-card bg-white rounded-xl border border-[#E2E8F0] p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-[#111827]">{t.cityMapPage.layersTitle}</h2>
              {activeLayers.length !== ALL_GIS_LAYERS.length && (
                <button
                  type="button"
                  onClick={() => setActiveLayers(ALL_GIS_LAYERS)}
                  className="text-[11px] font-semibold text-[#006A4E] hover:underline cursor-pointer"
                >
                  {language === 'bn' ? 'সব দেখুন' : 'Show All'}
                </button>
              )}
            </div>
            <div className="space-y-2">
              {GIS_LAYER_META.map((layer) => {
                const Icon = layer.icon;
                const enabled = activeLayers.includes(layer.id);
                const count = markers.filter(
                  (m) =>
                    m.type === layer.id &&
                    (selectedWard === 'all' || m.wardNumber === selectedWard)
                ).length;
                return (
                  <button
                    key={layer.id}
                    type="button"
                    aria-pressed={enabled}
                    onClick={() => toggleLayer(layer.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg border text-left text-xs font-medium transition-colors cursor-pointer ${
                      enabled
                        ? 'bg-[#ECFDF5] border-[#006A4E] text-[#111827]'
                        : 'bg-white border-[#E2E8F0] text-slate-400'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`w-6 h-6 rounded-md flex items-center justify-center text-white ${layer.dotClass}`}
                      >
                        <Icon className="w-3.5 h-3.5" aria-hidden="true" />
                      </span>
                      <span>{t.cityMapPage.layers[layer.id]}</span>
                    </div>
                    <span className="font-mono font-bold tabular-nums">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {selectedMarker && (
            <div className="civic-card bg-white rounded-xl border border-[#E2E8F0] p-5 space-y-3">
              <div className="flex items-center justify-between text-xs text-[#4B5563]">
                <span className="font-semibold text-[#006A4E]">
                  {t.cityMapPage.layers[selectedMarker.type]}
                </span>
                <span className="tabular-nums">
                  {t.common.ward} {selectedMarker.wardNumber}
                </span>
              </div>
              <h3 className="text-base font-bold text-[#111827]">
                {language === 'bn' ? selectedMarker.titleBn : selectedMarker.titleEn}
              </h3>
              <p className="text-xs font-semibold text-[#111827]">
                {language === 'bn' ? selectedMarker.statusBn : selectedMarker.statusEn}
              </p>
              <p className="text-sm text-[#4B5563]">
                {language === 'bn' ? selectedMarker.detailsBn : selectedMarker.detailsEn}
              </p>
              <p className="text-xs font-mono text-[#4B5563] tabular-nums">
                GPS: {selectedMarker.latitude.toFixed(4)}°N, {selectedMarker.longitude.toFixed(4)}°E
              </p>
              <div className="pt-2">
                <Link
                  href={`/complaints?tab=submit&ward=${selectedMarker.wardNumber}`}
                  className="inline-flex items-center gap-1.5 w-full justify-center px-4 py-2 bg-[#006A4E] hover:bg-[#00523C] text-white text-xs font-semibold rounded-lg transition-colors"
                >
                  <MapPin className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>{t.cityMapPage.reportHere}</span>
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Map Canvas */}
        <div className="lg:col-span-8">
          <InteractiveCityMap
            wards={wards}
            markers={markers}
            activeLayers={activeLayers}
            selectedWard={selectedWard}
            mode="explorer"
            onSelectMarker={(m) => setSelectedMarker(m)}
          />
        </div>
      </div>
    </div>
  );
}

export default function CityMapPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto p-12 text-sm text-slate-500">
          Loading GIS City Map...
        </div>
      }
    >
      <CityMapContent />
    </Suspense>
  );
}
