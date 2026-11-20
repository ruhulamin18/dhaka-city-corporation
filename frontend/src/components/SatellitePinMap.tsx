'use client';

import React, { useEffect, useState } from 'react';
import {
  AdvancedMarker,
  InfoWindow,
  Map as GoogleMap,
  useAdvancedMarkerRef,
  useMap,
} from '@vis.gl/react-google-maps';
import { ExternalLink, KeyRound, Loader2, MapPin, Navigation, Satellite } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useGoogleMapsContext } from '@/components/GoogleMapsProvider';
import { GoogleMapsKeyModal } from '@/components/GoogleMapsKeyModal';

export interface SatellitePinItem {
  id: string;
  lat: number;
  lng: number;
  title: string;
  subtitle?: string;
  badge?: string;
  color?: 'teal' | 'rose' | 'amber' | 'navy';
}

interface SatellitePinMapProps {
  lat: number;
  lng: number;
  zoom?: number;
  label?: string;
  subtitle?: string;
  pins?: SatellitePinItem[];
  heightClassName?: string;
  pinColor?: 'teal' | 'rose' | 'amber' | 'navy';
}

const PIN_STYLES: Record<'teal' | 'rose' | 'amber' | 'navy', string> = {
  teal: 'bg-[#006A4E] border-white text-white',
  rose: 'bg-[#C81E1E] border-white text-white',
  amber: 'bg-amber-600 border-white text-white',
  navy: 'bg-[#00523C] border-emerald-200 text-white',
};

function PinCameraSync({ lat, lng, zoom }: { lat: number; lng: number; zoom: number }) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;
    map.panTo({ lat, lng });
    map.setZoom(zoom);
  }, [map, lat, lng, zoom]);

  return null;
}

function MultiPinMarker({
  pin,
  isOpen,
  onOpen,
  onClose,
}: {
  pin: SatellitePinItem;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}) {
  const [markerRef, marker] = useAdvancedMarkerRef();
  const tone = PIN_STYLES[pin.color ?? 'rose'];

  return (
    <>
      <AdvancedMarker
        ref={markerRef}
        position={{ lat: pin.lat, lng: pin.lng }}
        title={pin.title}
        zIndex={isOpen ? 50 : 10}
        onClick={onOpen}
      >
        <div
          className={`w-7 h-7 rounded-full border-2 shadow-lg flex items-center justify-center transition-transform cursor-pointer ${tone} ${
            isOpen ? 'scale-125 ring-4 ring-emerald-300/70' : 'hover:scale-110'
          }`}
        >
          <MapPin className="w-3.5 h-3.5" />
        </div>
      </AdvancedMarker>
      {isOpen && marker && (
        <InfoWindow anchor={marker} maxWidth={240} onCloseClick={onClose}>
          <div className="p-0.5 text-[#111827] space-y-0.5">
            {pin.badge && (
              <p className="text-[10px] font-mono font-bold text-[#006A4E]">{pin.badge}</p>
            )}
            <p className="text-xs font-bold text-[#111827] leading-snug">{pin.title}</p>
            {pin.subtitle && <p className="text-[11px] text-[#4B5563]">{pin.subtitle}</p>}
          </div>
        </InfoWindow>
      )}
    </>
  );
}

export function SatellitePinMap({
  lat,
  lng,
  zoom = 15,
  label,
  subtitle,
  pins,
  heightClassName = 'h-52',
  pinColor = 'rose',
}: SatellitePinMapProps) {
  const { language } = useApp();
  const { apiKey, isLoadingKey } = useGoogleMapsContext();
  const [mapType, setMapType] = useState<'hybrid' | 'satellite'>('hybrid');
  const [openPinId, setOpenPinId] = useState<string | null>(null);
  const [keyModalOpen, setKeyModalOpen] = useState<boolean>(false);

  const singlePinColor = PIN_STYLES[pinColor];
  const iframeMapCode = mapType === 'satellite' ? 'k' : 'h';

  return (
    <div className="relative w-full rounded-xl border border-slate-200 overflow-hidden bg-slate-900 shadow-sm">
      {/* Compact Satellite Mode Toggle */}
      <div className="absolute top-2.5 left-2.5 z-20 inline-flex items-center bg-slate-950/75 backdrop-blur-md p-0.5 rounded-lg border border-white/15">
        <button
          type="button"
          onClick={() => setMapType('hybrid')}
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold transition-colors cursor-pointer ${
            mapType === 'hybrid' ? 'bg-[#006A4E] text-white' : 'text-slate-200 hover:text-white'
          }`}
        >
          <Satellite className="w-3 h-3" />
          <span>{language === 'bn' ? 'স্যাটেলাইট' : 'Satellite'}</span>
        </button>
        <button
          type="button"
          onClick={() => setMapType('satellite')}
          className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-colors cursor-pointer ${
            mapType === 'satellite' ? 'bg-[#006A4E] text-white' : 'text-slate-200 hover:text-white'
          }`}
        >
          {language === 'bn' ? 'পিওর' : 'Clean'}
        </button>
      </div>

      {/* Top-Right API Key Setup Icon */}
      <div className="absolute top-2.5 right-2.5 z-20">
        <button
          type="button"
          onClick={() => setKeyModalOpen(true)}
          className="p-1 bg-slate-950/75 hover:bg-slate-900 text-slate-300 hover:text-emerald-400 rounded-lg border border-white/15 backdrop-blur-md transition-colors cursor-pointer"
          title="Google Maps API Key Setup"
        >
          <KeyRound className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Explicit Height Container (CF2) */}
      <div className={`relative w-full ${heightClassName}`}>
        {isLoadingKey ? (
          <div className="w-full h-full flex items-center justify-center bg-slate-900 text-slate-300 gap-2 text-xs">
            <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
            <span>{language === 'bn' ? 'স্যাটেলাইট ম্যাপ লোড হচ্ছে...' : 'Loading Satellite Map...'}</span>
          </div>
        ) : !apiKey ? (
          /* Live Interactive Google Maps Satellite / Hybrid Embed */
          <iframe
            title={label || 'Google Maps Satellite'}
            src={`https://maps.google.com/maps?q=${lat},${lng}&t=${iframeMapCode}&z=${zoom}&ie=UTF8&iwloc=&output=embed`}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full h-full"
          />
        ) : (
          <GoogleMap
            mapId="DEMO_MAP_ID"
            style={{ width: '100%', height: '100%' }}
            defaultCenter={{ lat, lng }}
            defaultZoom={zoom}
            mapTypeId={mapType}
            gestureHandling="cooperative"
            mapTypeControl={false}
            streetViewControl={false}
            fullscreenControl={true}
            zoomControl={true}
            clickableIcons={false}
            onClick={() => setOpenPinId(null)}
            internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
          >
            <PinCameraSync lat={lat} lng={lng} zoom={zoom} />

            {pins && pins.length > 0 ? (
              pins.map((pin) => (
                <MultiPinMarker
                  key={pin.id}
                  pin={pin}
                  isOpen={openPinId === pin.id}
                  onOpen={() => setOpenPinId(pin.id)}
                  onClose={() => setOpenPinId(null)}
                />
              ))
            ) : (
              <AdvancedMarker position={{ lat, lng }} title={label}>
                <div
                  className={`w-8 h-8 rounded-full border-2 shadow-xl flex items-center justify-center animate-bounce ${singlePinColor}`}
                >
                  <MapPin className="w-4 h-4" />
                </div>
              </AdvancedMarker>
            )}
          </GoogleMap>
        )}
      </div>

      {/* Satellite Telemetry Bar */}
      {(label || subtitle) && (
        <div className="bg-white border-t border-slate-200 px-3 py-1.5 flex items-center justify-between text-xs text-[#111827]">
          <div className="truncate mr-2">
            {label && <span className="font-semibold">{label}</span>}
            {subtitle && <span className="text-[#4B5563] ml-1.5 text-[11px]">{subtitle}</span>}
          </div>
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[11px] font-bold text-[#006A4E] hover:underline whitespace-nowrap"
          >
            <Navigation className="w-3 h-3" />
            <span>{language === 'bn' ? 'ম্যাপে রুট' : 'Directions'}</span>
            <ExternalLink className="w-2.5 h-2.5" />
          </a>
        </div>
      )}

      {/* API Key Modal */}
      <GoogleMapsKeyModal isOpen={keyModalOpen} onClose={() => setKeyModalOpen(false)} />
    </div>
  );
}
