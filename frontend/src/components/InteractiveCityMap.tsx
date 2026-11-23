'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  AdvancedMarker,
  InfoWindow,
  Map as GoogleMap,
  MapMouseEvent,
  useAdvancedMarkerRef,
  useMap,
} from '@vis.gl/react-google-maps';
import {
  AlertCircle,
  Construction,
  Cross,
  ExternalLink,
  KeyRound,
  Layers,
  Loader2,
  LocateFixed,
  MapPin,
  Navigation,
  Recycle,
  Satellite,
  Trees,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useGoogleMapsContext } from '@/components/GoogleMapsProvider';
import { GoogleMapsKeyModal } from '@/components/GoogleMapsKeyModal';
import { DHAKA_CENTER, findNearestWard, getWardCenter } from '@/lib/dhakaCoords';
import { GisLayerType, GisMarker, WardInfo } from '@/types';

interface InteractiveCityMapProps {
  wards: WardInfo[];
  markers?: GisMarker[];
  activeLayers?: GisLayerType[];
  selectedWard?: number | 'all';
  mode?: 'explorer' | 'picker';
  pickedCoords?: { x: number; y: number; lat: number; lng: number } | null;
  focusedMarker?: GisMarker | null;
  onPickLocation?: (coords: {
    x: number;
    y: number;
    lat: number;
    lng: number;
    wardNumber: number;
  }) => void;
  onSelectMarker?: (marker: GisMarker) => void;
}

type MapTypeChoice = 'hybrid' | 'satellite' | 'roadmap';

const LAYER_COLORS: Record<GisLayerType, { bg: string; border: string; hex: string }> = {
  hospital: { bg: 'bg-[#C81E1E]', border: 'border-white', hex: '#C81E1E' },
  public_toilet: { bg: 'bg-sky-600', border: 'border-white', hex: '#0284C7' },
  park: { bg: 'bg-[#006A4E]', border: 'border-white', hex: '#006A4E' },
  waste_point: { bg: 'bg-amber-600', border: 'border-white', hex: '#D97706' },
  road_digging: { bg: 'bg-orange-600', border: 'border-white', hex: '#EA580C' },
  complaint: { bg: 'bg-[#00523C]', border: 'border-emerald-200', hex: '#00523C' },
};

function renderLayerIcon(type: GisLayerType) {
  switch (type) {
    case 'hospital':
      return <Cross className="w-3.5 h-3.5 text-white" />;
    case 'public_toilet':
      return <Layers className="w-3.5 h-3.5 text-white" />;
    case 'park':
      return <Trees className="w-3.5 h-3.5 text-white" />;
    case 'waste_point':
      return <Recycle className="w-3.5 h-3.5 text-white" />;
    case 'road_digging':
      return <Construction className="w-3.5 h-3.5 text-white" />;
    case 'complaint':
    default:
      return <AlertCircle className="w-3.5 h-3.5 text-white" />;
  }
}

interface GisAdvancedMarkerProps {
  marker: GisMarker;
  isSelected: boolean;
  language: 'en' | 'bn';
  onSelect: (marker: GisMarker) => void;
  onCloseInfo: () => void;
}

function GisAdvancedMarker({
  marker,
  isSelected,
  language,
  onSelect,
  onCloseInfo,
}: GisAdvancedMarkerProps) {
  const [markerRef, markerInstance] = useAdvancedMarkerRef();
  const palette = LAYER_COLORS[marker.type];

  return (
    <>
      <AdvancedMarker
        ref={markerRef}
        position={{ lat: marker.latitude, lng: marker.longitude }}
        title={language === 'bn' ? marker.titleBn : marker.titleEn}
        zIndex={isSelected ? 50 : 10}
        onClick={() => onSelect(marker)}
      >
        <div
          className={`w-7 h-7 rounded-full border-2 shadow-lg flex items-center justify-center transition-transform cursor-pointer ${
            palette.bg
          } ${palette.border} ${
            isSelected
              ? 'scale-125 ring-4 ring-white ring-offset-2 ring-offset-emerald-700'
              : 'hover:scale-110'
          }`}
        >
          {renderLayerIcon(marker.type)}
        </div>
      </AdvancedMarker>

      {isSelected && markerInstance && (
        <InfoWindow
          anchor={markerInstance}
          maxWidth={280}
          onCloseClick={onCloseInfo}
          headerContent={
            <div className="font-bold text-xs text-[#111827] pr-2">
              {language === 'bn' ? marker.titleBn : marker.titleEn}
            </div>
          }
        >
          <div className="p-1 space-y-1.5 text-xs text-[#4B5563]">
            <p className="text-[11px] leading-snug">
              {language === 'bn' ? marker.detailsBn : marker.detailsEn}
            </p>
            <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-100 font-mono">
              <span>Ward {marker.wardNumber}</span>
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${marker.latitude},${marker.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#006A4E] font-bold hover:underline inline-flex items-center gap-0.5"
              >
                <span>Google Maps</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>
          </div>
        </InfoWindow>
      )}
    </>
  );
}

function MapCameraController({
  selectedWard,
  mode,
  pickedCoords,
  focusedMarker,
}: {
  selectedWard?: number | 'all';
  mode?: 'explorer' | 'picker';
  pickedCoords?: { lat: number; lng: number } | null;
  focusedMarker?: GisMarker | null;
}) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;
    if (focusedMarker) {
      map.panTo({ lat: focusedMarker.latitude, lng: focusedMarker.longitude });
      map.setZoom(16);
      return;
    }

    if (mode === 'picker' && pickedCoords) {
      map.panTo({ lat: pickedCoords.lat, lng: pickedCoords.lng });
      map.setZoom(16);
      return;
    }

    if (selectedWard && selectedWard !== 'all') {
      const center = getWardCenter(selectedWard);
      map.panTo(center);
      map.setZoom(14);
    } else {
      map.panTo(DHAKA_CENTER);
      map.setZoom(12);
    }
  }, [map, selectedWard, mode, pickedCoords, focusedMarker]);

  return null;
}

export function InteractiveCityMap({
  wards,
  markers = [],
  activeLayers = ['hospital', 'public_toilet', 'park', 'waste_point', 'road_digging', 'complaint'],
  selectedWard = 'all',
  mode = 'explorer',
  pickedCoords = null,
  focusedMarker = null,
  onPickLocation,
  onSelectMarker,
}: InteractiveCityMapProps) {
  const { language } = useApp();
  const { apiKey, isLoadingKey } = useGoogleMapsContext();

  const [mapType, setMapType] = useState<MapTypeChoice>('hybrid');
  const [activeMarkerId, setActiveMarkerId] = useState<string | null>(focusedMarker?.id ?? null);
  const [locating, setLocating] = useState<boolean>(false);
  const [keyModalOpen, setKeyModalOpen] = useState<boolean>(false);

  useEffect(() => {
    if (focusedMarker) {
      setActiveMarkerId(focusedMarker.id);
    }
  }, [focusedMarker]);

  const initialCenter = useMemo(() => {
    if (focusedMarker) {
      return { lat: focusedMarker.latitude, lng: focusedMarker.longitude };
    }
    if (mode === 'picker' && pickedCoords) {
      return { lat: pickedCoords.lat, lng: pickedCoords.lng };
    }
    if (selectedWard !== 'all') {
      return getWardCenter(selectedWard);
    }
    return DHAKA_CENTER;
  }, [selectedWard, mode, pickedCoords, focusedMarker]);

  // Center for embed iframe
  const embedCenter = useMemo(() => {
    if (focusedMarker) {
      return { lat: focusedMarker.latitude, lng: focusedMarker.longitude };
    }
    if (mode === 'picker' && pickedCoords) {
      return { lat: pickedCoords.lat, lng: pickedCoords.lng };
    }
    if (activeMarkerId) {
      const m = markers.find((item) => item.id === activeMarkerId);
      if (m) return { lat: m.latitude, lng: m.longitude };
    }
    if (selectedWard !== 'all') {
      return getWardCenter(selectedWard);
    }
    return DHAKA_CENTER;
  }, [mode, pickedCoords, activeMarkerId, markers, selectedWard, focusedMarker]);

  const visibleMarkers = useMemo(() => {
    return markers.filter((m) => {
      const layerMatch = activeLayers.includes(m.type);
      const wardMatch = selectedWard === 'all' || m.wardNumber === selectedWard;
      return layerMatch && wardMatch;
    });
  }, [markers, activeLayers, selectedWard]);

  const handleMapClick = useCallback(
    (e: MapMouseEvent) => {
      if (mode !== 'picker' || !onPickLocation || !e.detail.latLng) return;
      const lat = e.detail.latLng.lat;
      const lng = e.detail.latLng.lng;
      const ward = findNearestWard(lat, lng, wards);
      const x = Math.round(((lng - 90.34) / (90.46 - 90.34)) * 100);
      const y = Math.round(((23.86 - lat) / (23.86 - 23.7)) * 100);
      onPickLocation({ x, y, lat, lng, wardNumber: ward });
    },
    [mode, onPickLocation, wards]
  );

  const handleLocateMe = useCallback(() => {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocating(false);
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const ward = findNearestWard(lat, lng, wards);
        const x = Math.round(((lng - 90.34) / (90.46 - 90.34)) * 100);
        const y = Math.round(((23.86 - lat) / (23.86 - 23.7)) * 100);
        onPickLocation?.({ x, y, lat, lng, wardNumber: ward });
      },
      () => setLocating(false),
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }, [onPickLocation, wards]);

  const handleSelectMarker = useCallback(
    (m: GisMarker) => {
      setActiveMarkerId(m.id);
      onSelectMarker?.(m);
    },
    [onSelectMarker]
  );

  const iframeMapCode = mapType === 'satellite' ? 'k' : mapType === 'roadmap' ? 'm' : 'h';
  const iframeZoom = mode === 'picker' ? 16 : selectedWard === 'all' ? 13 : 15;

  return (
    <div className="relative w-full bg-slate-900 rounded-xl border border-slate-200 overflow-hidden shadow-sm">
      {/* Top-Left Map Type Switcher (Satellite Default) */}
      <div className="absolute top-3 left-3 z-20 flex flex-wrap items-center gap-2">
        <div className="inline-flex items-center bg-slate-950/80 backdrop-blur-md p-1 rounded-lg border border-white/15 shadow-lg">
          <button
            type="button"
            onClick={() => setMapType('hybrid')}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors cursor-pointer ${
              mapType === 'hybrid'
                ? 'bg-[#006A4E] text-white'
                : 'text-slate-200 hover:text-white'
            }`}
          >
            <Satellite className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? 'হাইব্রিড' : 'Hybrid'}</span>
          </button>
          <button
            type="button"
            onClick={() => setMapType('satellite')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors cursor-pointer ${
              mapType === 'satellite'
                ? 'bg-[#006A4E] text-white'
                : 'text-slate-200 hover:text-white'
            }`}
          >
            {language === 'bn' ? 'স্যাটেলাইট' : 'Satellite'}
          </button>
          <button
            type="button"
            onClick={() => setMapType('roadmap')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors cursor-pointer ${
              mapType === 'roadmap'
                ? 'bg-[#006A4E] text-white'
                : 'text-slate-200 hover:text-white'
            }`}
          >
            {language === 'bn' ? 'রোডম্যাপ' : 'Roadmap'}
          </button>
        </div>

        {mode === 'picker' && (
          <button
            type="button"
            onClick={handleLocateMe}
            disabled={locating}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#006A4E]/95 hover:bg-[#00523C] text-white text-[11px] font-semibold rounded-lg border border-white/20 shadow-lg transition-colors cursor-pointer"
          >
            <LocateFixed className={`w-3.5 h-3.5 text-emerald-200 ${locating ? 'animate-spin' : ''}`} />
            <span>{language === 'bn' ? 'আমার লোকেশন' : 'My GPS'}</span>
          </button>
        )}
      </div>

      {/* Top-Right API Key Configuration Pill */}
      <div className="absolute top-3 right-3 z-20">
        <button
          type="button"
          onClick={() => setKeyModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-950/80 hover:bg-slate-900 text-emerald-300 hover:text-white text-[11px] font-semibold rounded-lg border border-white/15 backdrop-blur-md shadow-lg transition-colors cursor-pointer"
          title="Google Maps Platform Key Setup"
        >
          <KeyRound className="w-3.5 h-3.5 text-emerald-400" />
          <span>{apiKey ? (language === 'bn' ? 'API কী সক্রিয়' : 'API Key Active') : (language === 'bn' ? 'API কী সেটআপ' : 'Setup API Key')}</span>
        </button>
      </div>

      {/* Picker Hint Pill */}
      {mode === 'picker' && (
        <div className="absolute bottom-14 left-3 z-20 bg-[#00523C]/95 backdrop-blur-sm text-white text-xs font-medium px-3 py-1.5 rounded-lg border border-white/15 shadow-md pointer-events-none">
          {language === 'bn'
            ? 'সঠিক GPS লোকেশন দেখতে ম্যাপ প্যান বা জুম করুন'
            : 'Explore live Google Maps satellite view for coordinates'}
        </div>
      )}

      {/* Explicit Height Map Container (CF2) */}
      <div
        className={`relative w-full ${
          mode === 'picker' ? 'h-80 sm:h-96' : 'h-[460px] sm:h-[540px]'
        }`}
      >
        {apiKey ? (
          <GoogleMap
            mapId="DEMO_MAP_ID"
            style={{ width: '100%', height: '100%' }}
            defaultCenter={initialCenter}
            defaultZoom={mode === 'picker' ? 15 : selectedWard === 'all' ? 12 : 14}
            mapTypeId={mapType}
            gestureHandling="greedy"
            mapTypeControl={false}
            streetViewControl={true}
            fullscreenControl={true}
            zoomControl={true}
            clickableIcons={false}
            onClick={handleMapClick}
            internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
          >
            <MapCameraController
              selectedWard={selectedWard}
              mode={mode}
              pickedCoords={pickedCoords}
              focusedMarker={focusedMarker}
            />

            {/* Explorer Mode: Ward Centroid Pills + Civic GIS Markers */}
            {mode === 'explorer' &&
              wards
                .filter((w) => selectedWard === 'all' || w.wardNumber === selectedWard)
                .map((ward) => {
                  const pos = getWardCenter(ward.wardNumber);
                  const isFocused = selectedWard === ward.wardNumber;
                  return (
                    <AdvancedMarker
                      key={`ward-pill-${ward.wardNumber}`}
                      position={pos}
                      zIndex={isFocused ? 8 : 2}
                    >
                      <div
                        className={`px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wide shadow-md border backdrop-blur-sm pointer-events-none ${
                          isFocused
                            ? 'bg-[#006A4E]/95 text-white border-white'
                            : 'bg-[#00523C]/85 text-emerald-100 border-white/30'
                        }`}
                      >
                        W-{ward.wardNumber}
                      </div>
                    </AdvancedMarker>
                  );
                })}

            {mode === 'explorer' &&
              visibleMarkers.map((marker) => (
                <GisAdvancedMarker
                  key={marker.id}
                  marker={marker}
                  isSelected={activeMarkerId === marker.id}
                  language={language}
                  onSelect={handleSelectMarker}
                  onCloseInfo={() => setActiveMarkerId(null)}
                />
              ))}

            {/* Picker Mode: Draggable-feel Dropped GPS Pin */}
            {mode === 'picker' && pickedCoords && (
              <AdvancedMarker
                position={{ lat: pickedCoords.lat, lng: pickedCoords.lng }}
                zIndex={100}
              >
                <div className="flex flex-col items-center -translate-y-2">
                  <div className="bg-[#006A4E] text-white text-[10px] font-mono px-2.5 py-1 rounded-md shadow-lg border border-emerald-200/60 mb-1 whitespace-nowrap">
                    {pickedCoords.lat.toFixed(5)}°N, {pickedCoords.lng.toFixed(5)}°E
                  </div>
                  <div className="w-8 h-8 rounded-full bg-[#C81E1E] border-2 border-white shadow-xl flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-white" />
                  </div>
                </div>
              </AdvancedMarker>
            )}
          </GoogleMap>
        ) : (
          /* Live Interactive Google Maps Satellite / Hybrid Embed */
          <div className="relative w-full h-full bg-slate-900 overflow-hidden">
            <iframe
              title="Google Maps Dhaka Satellite"
              src={`https://maps.google.com/maps?q=${embedCenter.lat},${embedCenter.lng}&t=${iframeMapCode}&z=${iframeZoom}&ie=UTF8&iwloc=&output=embed`}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full"
            />

            {/* Overlaid Marker Pills for Instant Navigation */}
            {visibleMarkers.length > 0 && mode === 'explorer' && (
              <div className="absolute bottom-3 left-3 right-3 z-10 flex items-center gap-1.5 overflow-x-auto pb-1 pointer-events-auto">
                {visibleMarkers.slice(0, 8).map((m) => {
                  const isSelected = activeMarkerId === m.id;
                  const palette = LAYER_COLORS[m.type];
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => handleSelectMarker(m)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold backdrop-blur-md border shadow-md whitespace-nowrap cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-[#006A4E] text-white border-emerald-300 scale-105'
                          : 'bg-slate-950/85 text-slate-200 border-white/20 hover:bg-slate-900 hover:text-white'
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${palette.bg}`} />
                      <span>{language === 'bn' ? m.titleBn : m.titleEn}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Satellite Telemetry Footer Strip */}
      <div className="bg-white border-t border-[#E2E8F0] px-4 py-2 flex flex-wrap items-center justify-between gap-2 text-xs text-[#4B5563]">
        <span className="inline-flex items-center gap-1.5 font-mono tabular-nums text-[11px]">
          <Satellite className="w-3.5 h-3.5 text-[#006A4E]" />
          <span>
            Google Maps Satellite · Dhaka Metro ({selectedWard === 'all' ? 'All Wards' : `Ward ${selectedWard}`})
          </span>
        </span>
        <span className="font-medium text-slate-700">
          {mode === 'picker'
            ? pickedCoords
              ? `${pickedCoords.lat.toFixed(4)}°N, ${pickedCoords.lng.toFixed(4)}°E`
              : language === 'bn'
                ? 'পিন নির্বাচন করুন'
                : 'Select pin'
            : language === 'bn'
              ? `দৃশ্যমান পিন: ${visibleMarkers.length}টি`
              : `Visible Markers: ${visibleMarkers.length}`}
        </span>
      </div>

      {/* API Key Modal */}
      <GoogleMapsKeyModal isOpen={keyModalOpen} onClose={() => setKeyModalOpen(false)} />
    </div>
  );
}
