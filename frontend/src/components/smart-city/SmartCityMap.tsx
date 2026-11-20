'use client';

import React, { useCallback, useMemo, useState } from 'react';
import {
  AdvancedMarker,
  InfoWindow,
  Map as GoogleMap,
  useAdvancedMarkerRef,
  useMap,
} from '@vis.gl/react-google-maps';
import {
  Compass,
  Cross,
  ExternalLink,
  KeyRound,
  Layers,
  MapPin,
  Navigation,
  ParkingCircle,
  Phone,
  Recycle,
  Satellite,
  Trees,
  Wind,
  Wrench,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useGoogleMapsContext } from '@/components/GoogleMapsProvider';
import { GoogleMapsKeyModal } from '@/components/GoogleMapsKeyModal';
import { DHAKA_CENTER, getWardCenter } from '@/lib/dhakaCoords';
import { pickLang } from '@/types/about';

export interface SmartCityMapPoint {
  id: string;
  title: { bn: string; en: string };
  categoryLabel?: { bn: string; en: string };
  category: string;
  coords: { lat: number; lng: number };
  wardNumber?: number;
  address?: { bn: string; en: string };
  phone?: string;
  operatingHours?: { bn: string; en: string };
  statusLabel?: { bn: string; en: string };
  details?: { bn: string; en: string };
}

export interface SmartCityMapProps {
  points: SmartCityMapPoint[];
  selectedWard?: number | 'all';
  selectedPointId?: string | null;
  onSelectPoint?: (point: SmartCityMapPoint) => void;
  heightClass?: string;
  defaultMapType?: 'hybrid' | 'satellite' | 'roadmap';
  interactiveTitle?: string;
}

const PIN_COLORS: Record<string, { bg: string; border: string; hex: string }> = {
  hospital: { bg: 'bg-[#C81E1E]', border: 'border-white', hex: '#C81E1E' },
  clinic: { bg: 'bg-[#C81E1E]', border: 'border-white', hex: '#C81E1E' },
  pharmacy: { bg: 'bg-emerald-600', border: 'border-white', hex: '#059669' },
  police: { bg: 'bg-blue-700', border: 'border-white', hex: '#1D4ED8' },
  fire_station: { bg: 'bg-amber-600', border: 'border-white', hex: '#D97706' },
  ward_office: { bg: 'bg-[#006A4E]', border: 'border-white', hex: '#006A4E' },
  toilet: { bg: 'bg-sky-600', border: 'border-white', hex: '#0284C7' },
  public_toilet: { bg: 'bg-sky-600', border: 'border-white', hex: '#0284C7' },
  park: { bg: 'bg-emerald-700', border: 'border-white', hex: '#047857' },
  waste_point: { bg: 'bg-amber-700', border: 'border-white', hex: '#B45309' },
  waste: { bg: 'bg-amber-700', border: 'border-white', hex: '#B45309' },
  road: { bg: 'bg-orange-600', border: 'border-white', hex: '#EA580C' },
  road_digging: { bg: 'bg-orange-600', border: 'border-white', hex: '#EA580C' },
  drainage: { bg: 'bg-cyan-700', border: 'border-white', hex: '#0E7490' },
  parking: { bg: 'bg-indigo-600', border: 'border-white', hex: '#4F46E5' },
  air_quality: { bg: 'bg-purple-600', border: 'border-white', hex: '#9333EA' },
  complaint: { bg: 'bg-[#C81E1E]', border: 'border-white', hex: '#C81E1E' },
  default: { bg: 'bg-[#006A4E]', border: 'border-white', hex: '#006A4E' },
};

function renderPinIcon(category: string) {
  switch (category) {
    case 'hospital':
    case 'clinic':
      return <Cross className="w-3.5 h-3.5 text-white" />;
    case 'toilet':
    case 'public_toilet':
      return <Layers className="w-3.5 h-3.5 text-white" />;
    case 'park':
      return <Trees className="w-3.5 h-3.5 text-white" />;
    case 'waste':
    case 'waste_point':
      return <Recycle className="w-3.5 h-3.5 text-white" />;
    case 'road':
    case 'road_digging':
      return <Wrench className="w-3.5 h-3.5 text-white" />;
    case 'parking':
      return <ParkingCircle className="w-3.5 h-3.5 text-white" />;
    case 'air_quality':
      return <Wind className="w-3.5 h-3.5 text-white" />;
    default:
      return <MapPin className="w-3.5 h-3.5 text-white" />;
  }
}

function MapViewController({
  selectedWard,
  selectedPoint,
}: {
  selectedWard: number | 'all';
  selectedPoint: SmartCityMapPoint | null;
}) {
  const map = useMap();

  React.useEffect(() => {
    if (!map) return;
    if (selectedPoint) {
      map.panTo({ lat: selectedPoint.coords.lat, lng: selectedPoint.coords.lng });
      map.setZoom(16);
      return;
    }
    if (selectedWard !== 'all') {
      const center = getWardCenter(selectedWard);
      map.panTo(center);
      map.setZoom(15);
    } else {
      map.panTo(DHAKA_CENTER);
      map.setZoom(13);
    }
  }, [map, selectedWard, selectedPoint]);

  return null;
}

function MapPointMarker({
  point,
  isSelected,
  onSelect,
  language,
}: {
  point: SmartCityMapPoint;
  isSelected: boolean;
  onSelect: (point: SmartCityMapPoint) => void;
  language: 'en' | 'bn';
}) {
  const [markerRef] = useAdvancedMarkerRef();
  const palette = PIN_COLORS[point.category] ?? PIN_COLORS.default;

  return (
    <AdvancedMarker
      ref={markerRef}
      position={{ lat: point.coords.lat, lng: point.coords.lng }}
      title={pickLang(point.title, language)}
      zIndex={isSelected ? 50 : 10}
      onClick={() => onSelect(point)}
    >
      <div
        className={`relative flex items-center justify-center w-8 h-8 rounded-full border-2 shadow-lg transition-transform ${
          palette.bg
        } ${palette.border} ${isSelected ? 'scale-125 ring-4 ring-white ring-offset-2 ring-offset-emerald-800' : 'hover:scale-110'}`}
      >
        {renderPinIcon(point.category)}
        {isSelected && (
          <span className="absolute -bottom-1 w-2 h-2 rounded-full bg-white animate-ping" />
        )}
      </div>
    </AdvancedMarker>
  );
}

export function SmartCityMap({
  points,
  selectedWard = 'all',
  selectedPointId = null,
  onSelectPoint,
  heightClass = 'h-[520px] lg:h-[620px]',
  defaultMapType = 'hybrid',
  interactiveTitle,
}: SmartCityMapProps) {
  const { language } = useApp();
  const { apiKey, quotaExceeded } = useGoogleMapsContext();

  const [mapType, setMapType] = useState<'hybrid' | 'satellite' | 'roadmap'>(defaultMapType);
  const [dismissedId, setDismissedId] = useState<string | null>(null);
  const [clickedPoint, setClickedPoint] = useState<SmartCityMapPoint | null>(null);
  const [keyModalOpen, setKeyModalOpen] = useState<boolean>(false);
  const [showMatrixOverlay, setShowMatrixOverlay] = useState<boolean>(false);

  const activePoint = useMemo(() => {
    if (clickedPoint) return clickedPoint;
    if (selectedPointId && selectedPointId !== dismissedId) {
      return points.find((p) => p.id === selectedPointId) ?? null;
    }
    return null;
  }, [clickedPoint, selectedPointId, dismissedId, points]);

  const handleSelectPoint = useCallback(
    (point: SmartCityMapPoint) => {
      setDismissedId(null);
      setClickedPoint(point);
      if (onSelectPoint) onSelectPoint(point);
    },
    [onSelectPoint]
  );

  const handleClosePoint = useCallback(() => {
    if (activePoint) {
      setDismissedId(activePoint.id);
    }
    setClickedPoint(null);
  }, [activePoint]);

  const initialCenter = useMemo(() => {
    if (selectedWard && selectedWard !== 'all') {
      return getWardCenter(selectedWard);
    }
    return DHAKA_CENTER;
  }, [selectedWard]);

  // Center for Google Maps iframe embed
  const embedCenter = useMemo(() => {
    if (activePoint) {
      return { lat: activePoint.coords.lat, lng: activePoint.coords.lng };
    }
    if (selectedWard && selectedWard !== 'all') {
      return getWardCenter(selectedWard);
    }
    return DHAKA_CENTER;
  }, [activePoint, selectedWard]);

  const showFallback = !apiKey || quotaExceeded;
  const iframeMapCode = mapType === 'satellite' ? 'k' : mapType === 'roadmap' ? 'm' : 'h';
  const iframeZoom = activePoint ? 16 : selectedWard !== 'all' ? 15 : 13;

  return (
    <div className={`relative w-full ${heightClass} rounded-2xl overflow-hidden border border-[#E2E8F0] shadow-sm bg-slate-900`}>
      {/* 1. Header Toolbar: Mode Switcher & Layer Title */}
      <div className="absolute top-3 left-3 right-3 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        <div className="pointer-events-auto bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-slate-200/80 shadow-md flex items-center gap-2">
          <Satellite className="w-4 h-4 text-[#006A4E]" />
          <span className="text-xs font-bold text-[#111827]">
            {interactiveTitle || (language === 'bn' ? 'স্যাটেলাইট জিআইএস ভিউয়ার' : 'Satellite GIS Viewer')}
          </span>
          <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-emerald-50 text-[#006A4E] font-semibold border border-emerald-200">
            {points.length} {language === 'bn' ? 'মার্কার' : 'Points'}
          </span>
        </div>

        {/* Top-Right Controls: Map Switcher & Key Modal */}
        <div className="pointer-events-auto flex items-center gap-2">
          {/* Map Type Switcher Controls */}
          <div className="bg-white/95 backdrop-blur-md p-1 rounded-xl border border-slate-200 shadow-md flex items-center gap-1">
            <button
              type="button"
              onClick={() => setMapType('hybrid')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                mapType === 'hybrid'
                  ? 'bg-[#006A4E] text-white shadow-xs'
                  : 'text-[#4B5563] hover:text-[#111827] hover:bg-slate-100'
              }`}
            >
              {language === 'bn' ? 'হাইব্রিড' : 'Hybrid'}
            </button>
            <button
              type="button"
              onClick={() => setMapType('satellite')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                mapType === 'satellite'
                  ? 'bg-[#006A4E] text-white shadow-xs'
                  : 'text-[#4B5563] hover:text-[#111827] hover:bg-slate-100'
              }`}
            >
              {language === 'bn' ? 'স্যাটেলাইট' : 'Satellite'}
            </button>
            <button
              type="button"
              onClick={() => setMapType('roadmap')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                mapType === 'roadmap'
                  ? 'bg-[#006A4E] text-white shadow-xs'
                  : 'text-[#4B5563] hover:text-[#111827] hover:bg-slate-100'
              }`}
            >
              {language === 'bn' ? 'রোডম্যাপ' : 'Roadmap'}
            </button>
          </div>

          {/* API Key Modal Button */}
          <button
            type="button"
            onClick={() => setKeyModalOpen(true)}
            className="p-2 bg-white/95 hover:bg-white text-slate-700 hover:text-[#006A4E] rounded-xl border border-slate-200 shadow-md backdrop-blur-md transition-colors cursor-pointer"
            title="Google Maps API Key Setup"
          >
            <KeyRound className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Interactive Map Container */}
      {!showFallback ? (
        <GoogleMap
          mapId="dscc-smart-city-map"
          defaultCenter={initialCenter}
          defaultZoom={selectedWard !== 'all' ? 15 : 13}
          mapTypeId={mapType}
          gestureHandling="greedy"
          disableDefaultUI
          className="w-full h-full"
        >
          <MapViewController selectedWard={selectedWard} selectedPoint={activePoint} />

          {points.map((pt) => (
            <MapPointMarker
              key={pt.id}
              point={pt}
              isSelected={activePoint?.id === pt.id}
              onSelect={handleSelectPoint}
              language={language}
            />
          ))}

          {activePoint && (
            <InfoWindow
              position={{ lat: activePoint.coords.lat, lng: activePoint.coords.lng }}
              onCloseClick={handleClosePoint}
              headerContent={
                <div className="font-bold text-sm text-[#111827] pr-4">
                  {pickLang(activePoint.title, language)}
                </div>
              }
            >
              <div className="p-1 max-w-[260px] text-xs space-y-2 text-[#4B5563]">
                {activePoint.categoryLabel && (
                  <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-[#006A4E] border border-emerald-200">
                    {pickLang(activePoint.categoryLabel, language)}
                  </span>
                )}
                {activePoint.address && (
                  <div className="flex items-start gap-1.5 text-slate-700">
                    <MapPin className="w-3.5 h-3.5 text-[#006A4E] shrink-0 mt-0.5" />
                    <span>{pickLang(activePoint.address, language)}</span>
                  </div>
                )}
                {activePoint.phone && (
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-[#006A4E] shrink-0" />
                    <a
                      href={`tel:${activePoint.phone}`}
                      className="text-[#006A4E] font-semibold hover:underline"
                    >
                      {activePoint.phone}
                    </a>
                  </div>
                )}
                {activePoint.details && (
                  <p className="text-slate-600 border-t border-slate-100 pt-1.5 leading-relaxed">
                    {pickLang(activePoint.details, language)}
                  </p>
                )}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${activePoint.coords.lat},${activePoint.coords.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#006A4E] hover:underline"
                  >
                    <Navigation className="w-3 h-3" />
                    <span>{language === 'bn' ? 'দিকনির্দেশনা' : 'Directions'}</span>
                    <ExternalLink className="w-2.5 h-2.5 ml-0.5" />
                  </a>
                </div>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      ) : (
        /* Live Google Maps Satellite / Hybrid Embed with Overlaid Civic Points */
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

          {/* Toggle Button for Coordinate Grid Blueprint */}
          <div className="absolute top-16 left-3 z-10 pointer-events-auto">
            <button
              type="button"
              onClick={() => setShowMatrixOverlay((prev) => !prev)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-950/85 hover:bg-slate-900 text-emerald-300 hover:text-white text-xs font-semibold rounded-xl border border-white/20 backdrop-blur-md shadow-lg transition-colors cursor-pointer"
            >
              <Compass className="w-3.5 h-3.5 text-emerald-400" />
              <span>{showMatrixOverlay ? (language === 'bn' ? 'ম্যাপে ফিরুন' : 'Hide Matrix') : (language === 'bn' ? 'সকল মার্কার তালিকা' : 'View Markers Matrix')}</span>
            </button>
          </div>

          {/* Overlaid Coordinate Matrix Drawer */}
          {showMatrixOverlay && (
            <div className="absolute inset-0 top-14 z-20 bg-slate-950/90 backdrop-blur-md p-6 text-slate-200 overflow-y-auto animate-fade-in pointer-events-auto">
              <div className="max-w-4xl mx-auto space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2 text-emerald-400 text-sm font-bold">
                    <Compass className="w-4 h-4" />
                    <span>{language === 'bn' ? 'ঢাকা স্মার্ট সিটি জিআইএস স্থানাঙ্ক তালিকা' : 'Dhaka Smart City GIS Coordinates Matrix'}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowMatrixOverlay(false)}
                    className="text-xs px-3 py-1 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300"
                  >
                    ✕ {language === 'bn' ? 'বন্ধ করুন' : 'Close'}
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {points.map((p) => {
                    const isSelected = activePoint?.id === p.id;
                    const palette = PIN_COLORS[p.category] ?? PIN_COLORS.default;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => {
                          handleSelectPoint(p);
                          setShowMatrixOverlay(false);
                        }}
                        className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#006A4E] border-emerald-400 text-white shadow-lg'
                            : 'bg-slate-900/90 border-slate-700 text-slate-300 hover:bg-slate-800 hover:border-slate-500'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className={`w-2.5 h-2.5 rounded-full ${palette.bg}`} />
                          <span className="text-[11px] font-mono text-emerald-300 font-semibold">
                            {p.coords.lat.toFixed(4)}, {p.coords.lng.toFixed(4)}
                          </span>
                        </div>
                        <div className="text-xs font-bold truncate">
                          {pickLang(p.title, language)}
                        </div>
                        {p.address && (
                          <div className="text-[11px] text-slate-400 truncate mt-1">
                            {pickLang(p.address, language)}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Quick Horizontal Marker Carousel at bottom */}
          <div className="absolute bottom-4 left-3 right-3 sm:right-auto z-10 flex items-center gap-2 overflow-x-auto pb-1 max-w-full sm:max-w-xl pointer-events-auto">
            {points.slice(0, 10).map((p) => {
              const isSelected = activePoint?.id === p.id;
              const palette = PIN_COLORS[p.category] ?? PIN_COLORS.default;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handleSelectPoint(p)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold backdrop-blur-md border shadow-md whitespace-nowrap cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-[#006A4E] text-white border-emerald-300 scale-105'
                      : 'bg-slate-950/85 text-slate-200 border-white/20 hover:bg-slate-900 hover:text-white'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${palette.bg}`} />
                  <span>{pickLang(p.title, language)}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. Floating Detail Card for currently selected point */}
      {activePoint && (
        <div className="absolute bottom-16 sm:bottom-4 left-4 right-4 sm:right-auto sm:max-w-sm z-20 bg-white/95 backdrop-blur-md rounded-2xl p-4 border border-slate-200 shadow-xl text-slate-800 animate-fade-in pointer-events-auto">
          <div className="flex items-start justify-between gap-2">
            <div>
              <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-[#ECFDF5] text-[#006A4E] mb-1">
                {activePoint.categoryLabel
                  ? pickLang(activePoint.categoryLabel, language)
                  : activePoint.category.toUpperCase()}
              </span>
              <h3 className="font-bold text-sm text-[#111827]">
                {pickLang(activePoint.title, language)}
              </h3>
            </div>
            <button
              type="button"
              onClick={handleClosePoint}
              className="text-slate-400 hover:text-slate-600 p-1 rounded-md text-xs font-bold"
            >
              ✕
            </button>
          </div>

          {activePoint.address && (
            <p className="text-xs text-[#4B5563] mt-1.5 leading-relaxed">
              {pickLang(activePoint.address, language)}
            </p>
          )}

          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
            {activePoint.phone ? (
              <a
                href={`tel:${activePoint.phone}`}
                className="inline-flex items-center gap-1 text-[#006A4E] font-bold hover:underline"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>{activePoint.phone}</span>
              </a>
            ) : (
              <span className="text-[11px] font-mono text-slate-500">
                {activePoint.coords.lat.toFixed(4)}, {activePoint.coords.lng.toFixed(4)}
              </span>
            )}

            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${activePoint.coords.lat},${activePoint.coords.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-semibold text-[#006A4E] hover:underline"
            >
              <Navigation className="w-3 h-3" />
              <span>{language === 'bn' ? 'ম্যাপে রুট' : 'Directions'}</span>
              <ExternalLink className="w-2.5 h-2.5 ml-0.5" />
            </a>
          </div>
        </div>
      )}

      {/* API Key Modal */}
      <GoogleMapsKeyModal isOpen={keyModalOpen} onClose={() => setKeyModalOpen(false)} />
    </div>
  );
}
