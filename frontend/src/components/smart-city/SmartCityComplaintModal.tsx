'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  AlertCircle,
  Camera,
  CheckCircle2,
  Crosshair,
  Loader2,
  MapPin,
  Upload,
  X,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { mockApi } from '@/services/mockApi';
import { DHAKA_CENTER, getWardCenter } from '@/lib/dhakaCoords';
import { ComplaintCategory } from '@/types';

export interface SmartCityComplaintModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCategory?: ComplaintCategory;
  defaultTitle?: string;
  defaultWard?: number;
}

export function SmartCityComplaintModal({
  isOpen,
  onClose,
  defaultCategory = 'waste',
  defaultTitle = '',
  defaultWard = 27,
}: SmartCityComplaintModalProps) {
  const { language } = useApp();

  const [category, setCategory] = useState<ComplaintCategory>(defaultCategory);
  const [citizenName, setCitizenName] = useState('Md. Citizen');
  const [phone, setPhone] = useState('01711-000000');
  const [title, setTitle] = useState(defaultTitle);
  const [description, setDescription] = useState('');
  const [wardNumber, setWardNumber] = useState<number>(defaultWard);
  const [locationLabel, setLocationLabel] = useState('');
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [coords, setCoords] = useState<{ lat: number; lng: number }>(getWardCenter(defaultWard));
  const [isCapturingGps, setIsCapturingGps] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [createdTrackingId, setCreatedTrackingId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCaptureLocation = () => {
    setIsCapturingGps(true);
    if (typeof navigator !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCoords({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
          setIsCapturingGps(false);
        },
        () => {
          // Fallback to ward centroid if denied
          const centroid = getWardCenter(wardNumber);
          setCoords(centroid);
          setIsCapturingGps(false);
        },
        { timeout: 5000 }
      );
    } else {
      setCoords(getWardCenter(wardNumber));
      setIsCapturingGps(false);
    }
  };

  const handleSimulatePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPhotoPreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    setSubmitting(true);
    try {
      const res = await mockApi.submitComplaint({
        citizenName: citizenName.trim() || 'Citizen of Dhaka',
        phone: phone.trim() || '01711-000000',
        category,
        title: title.trim(),
        description: description.trim(),
        wardNumber,
        locationLabel: locationLabel.trim() || `Ward ${wardNumber} Roadway`,
        latitude: coords.lat,
        longitude: coords.lng,
        photoUrl: photoPreview || undefined,
      });
      setCreatedTrackingId(res.trackingId);
    } catch {
      // Fallback tracking ID
      setCreatedTrackingId(`CMP-2026-${Math.floor(1000 + Math.random() * 9000)}`);
    } finally {
      setSubmitting(false);
    }
  };

  const resetAndClose = () => {
    setCreatedTrackingId(null);
    setTitle('');
    setDescription('');
    setPhotoPreview(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-[#E2E8F0] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-[#006A4E] text-white px-6 py-4.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-5 h-5 text-emerald-200" />
            <h3 className="font-bold text-base sm:text-lg">
              {language === 'bn' ? 'স্মার্ট নগর সমস্যা প্রতিবেদন দাখিল' : 'Submit Smart City Incident Report'}
            </h3>
          </div>
          <button
            type="button"
            onClick={resetAndClose}
            className="p-1 rounded-lg text-emerald-100 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success View */}
        {createdTrackingId ? (
          <div className="p-6 sm:p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#ECFDF5] text-[#006A4E] mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <h4 className="text-xl font-bold text-[#111827]">
                {language === 'bn' ? 'প্রতিবেদন সফলভাবে জমা হয়েছে!' : 'Report Successfully Submitted!'}
              </h4>
              <p className="text-xs sm:text-sm text-[#4B5563] mt-1 max-w-sm mx-auto">
                {language === 'bn'
                  ? 'আপনার অভিযোগটি সংশ্লিষ্ট ওয়ার্ড পরিদর্শক ও ফিল্ড ইঞ্জিনিয়ারিং টিমকে পাঠানো হয়েছে।'
                  : 'Your incident report has been dispatched to the designated ward field supervisor.'}
              </p>
            </div>

            <div className="bg-[#F8FAFC] p-4 rounded-xl border border-slate-200 inline-block text-left">
              <div className="text-[11px] font-semibold text-[#4B5563]">
                {language === 'bn' ? 'ট্র্যাকিং আইডি নম্বর' : 'Tracking Reference ID'}:
              </div>
              <div className="text-lg font-mono font-bold text-[#006A4E] tracking-wider">
                {createdTrackingId}
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href={`/complaints?tab=track&id=${createdTrackingId}`}
                onClick={resetAndClose}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#006A4E] text-white font-semibold text-sm hover:bg-[#00523C] transition-colors"
              >
                {language === 'bn' ? 'অগ্রগতি ট্র্যাক করুন' : 'Track Status Live'}
              </Link>
              <button
                type="button"
                onClick={resetAndClose}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-100 text-[#111827] font-semibold text-sm hover:bg-slate-200 transition-colors"
              >
                {language === 'bn' ? 'সম্পন্ন' : 'Done'}
              </button>
            </div>
          </div>
        ) : (
          /* Submission Form */
          <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
            {/* Category Switcher */}
            <div>
              <label className="block text-xs font-semibold text-[#111827] mb-1.5">
                {language === 'bn' ? 'সমস্যার ধরণ' : 'Incident Category'}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'waste', bn: 'বর্জ্য', en: 'Waste' },
                  { id: 'drainage', bn: 'ড্রেনেজ', en: 'Drainage' },
                  { id: 'road_damage', bn: 'সড়ক মেরামত', en: 'Road Damage' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id as ComplaintCategory)}
                    className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                      category === cat.id
                        ? 'bg-[#ECFDF5] border-[#006A4E] text-[#006A4E] shadow-xs'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {language === 'bn' ? cat.bn : cat.en}
                  </button>
                ))}
              </div>
            </div>

            {/* Citizen Name & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#111827] mb-1">
                  {language === 'bn' ? 'অভিযোগকারীর নাম' : 'Citizen Name'} *
                </label>
                <input
                  type="text"
                  required
                  value={citizenName}
                  onChange={(e) => setCitizenName(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006A4E]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#111827] mb-1">
                  {language === 'bn' ? 'মোবাইল নম্বর' : 'Phone Number'} *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006A4E]"
                />
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-xs font-semibold text-[#111827] mb-1">
                {language === 'bn' ? 'সংক্ষিপ্ত শিরোনাম' : 'Incident Summary / Title'} *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={
                  language === 'bn'
                    ? 'যেমন: ড্রেন উপচে পানি রাস্তায় জমেছে'
                    : 'e.g. Clogged box culvert causing waterlogging'
                }
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006A4E]"
              />
            </div>

            {/* Ward & Location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#111827] mb-1">
                  {language === 'bn' ? 'ওয়ার্ড নম্বর' : 'Ward Number'}
                </label>
                <select
                  value={wardNumber}
                  onChange={(e) => {
                    const w = Number(e.target.value);
                    setWardNumber(w);
                    setCoords(getWardCenter(w));
                  }}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006A4E]"
                >
                  {[12, 19, 24, 27, 32, 36, 41, 48].map((w) => (
                    <option key={w} value={w}>
                      {language === 'bn' ? `ওয়ার্ড ${w}` : `Ward ${w}`}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#111827] mb-1">
                  {language === 'bn' ? 'নির্দিষ্ট স্থান / ল্যান্ডমার্ক' : 'Specific Address / Landmark'}
                </label>
                <input
                  type="text"
                  value={locationLabel}
                  onChange={(e) => setLocationLabel(e.target.value)}
                  placeholder={
                    language === 'bn' ? 'রোড ২, ধানমন্ডি লেক সংলগ্ন' : 'Road 2, near Lake corner'
                  }
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006A4E]"
                />
              </div>
            </div>

            {/* GPS Pin Capture */}
            <div className="p-3 bg-[#F8FAFC] rounded-xl border border-slate-200 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs">
                <MapPin className="w-4 h-4 text-[#006A4E] shrink-0" />
                <span className="font-mono text-slate-700">
                  GPS: {coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}
                </span>
              </div>
              <button
                type="button"
                onClick={handleCaptureLocation}
                disabled={isCapturingGps}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-white border border-slate-300 rounded-lg hover:bg-slate-50 text-[#006A4E] transition-colors cursor-pointer"
              >
                {isCapturingGps ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Crosshair className="w-3.5 h-3.5" />
                )}
                <span>{language === 'bn' ? 'আমার লোকেশন নিন' : 'Fetch GPS'}</span>
              </button>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold text-[#111827] mb-1">
                {language === 'bn' ? 'বিস্তারিত বর্ণনা' : 'Detailed Description'} *
              </label>
              <textarea
                required
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={
                  language === 'bn'
                    ? 'সমস্যার গভীরতা, কতদিন ধরে সমস্যাটি রয়েছে ইত্যাদি বিস্তারিত লিখুন...'
                    : 'Describe the issue severity, how long it has persisted, and any obstruction details...'
                }
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006A4E]"
              />
            </div>

            {/* Photo Attachment */}
            <div>
              <label className="block text-xs font-semibold text-[#111827] mb-1">
                {language === 'bn' ? 'ছবি সংযুক্ত করুন (ঐচ্ছিক)' : 'Attach Photograph (Optional)'}
              </label>
              <div className="border-2 border-dashed border-slate-300 hover:border-[#006A4E] rounded-xl p-3 text-center transition-colors">
                {photoPreview ? (
                  <div className="relative inline-block">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={photoPreview}
                      alt="Complaint attachment"
                      className="max-h-24 rounded-lg mx-auto shadow-xs"
                    />
                    <button
                      type="button"
                      onClick={() => setPhotoPreview(null)}
                      aria-label={language === 'bn' ? 'ছবি সরান' : 'Remove photo'}
                      className="absolute -top-2 -right-2 p-1 bg-red-600 text-white rounded-full shadow-md cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>
                  </div>
                ) : (
                  <label className="cursor-pointer flex flex-col items-center justify-center gap-1 text-slate-500">
                    <Camera className="w-6 h-6 text-slate-400" />
                    <span className="text-xs font-medium text-[#006A4E]">
                      {language === 'bn' ? 'ছবি নির্বাচন বা ক্যামেরা চালু করুন' : 'Click to upload or take photo'}
                    </span>
                    <span className="text-[10px] text-slate-400">JPG, PNG (Max 5MB)</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleSimulatePhotoUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={resetAndClose}
                className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                {language === 'bn' ? 'বাতিল' : 'Cancel'}
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#006A4E] text-white font-semibold text-sm rounded-xl hover:bg-[#00523C] disabled:opacity-50 transition-colors shadow-sm cursor-pointer"
              >
                {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>{language === 'bn' ? 'প্রতিবেদন দাখিল করুন' : 'Submit Incident Report'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
