'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useApp } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
import { mockApi } from '@/services/mockApi';
import {
  deleteReportPhotos,
  loadReportPhoto,
  saveReportPhotos,
} from '@/services/civic-report-photo-store';
import type { Complaint, ComplaintCategory, ComplaintStatus } from '@/types';
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Clock3,
  ImagePlus,
  MapPin,
  Navigation,
  ShieldCheck,
  Trash2,
  UploadCloud,
  X,
} from 'lucide-react';

const MAX_PHOTOS = 3;
const MAX_PHOTO_BYTES = 5 * 1024 * 1024;
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp'];

const CATEGORIES: {
  id: ComplaintCategory;
  title: { bn: string; en: string };
  icon: string;
}[] = [
  { id: 'road_damage', title: { bn: 'রাস্তা ভাঙা ও গর্ত', en: 'Broken Road / Potholes' }, icon: '01' },
  { id: 'drainage', title: { bn: 'ড্রেন ও জলাবদ্ধতা সমস্যা', en: 'Drainage & Waterlogging' }, icon: '02' },
  { id: 'waste', title: { bn: 'ময়লা-আবর্জনা জমে থাকা', en: 'Garbage / Waste Pileup' }, icon: '03' },
  { id: 'street_light', title: { bn: 'সড়কবাতি নষ্ট', en: 'Broken Streetlight' }, icon: '04' },
  { id: 'other', title: { bn: 'অবৈধ দখল বা অন্যান্য', en: 'Encroachment / Other' }, icon: '05' },
];

interface DraftPhoto {
  file: File;
  previewUrl: string;
}

interface ComplaintPhotoUrls {
  [complaintId: string]: string[];
}

function getCategory(category: ComplaintCategory) {
  return CATEGORIES.find((item) => item.id === category) ?? CATEGORIES[CATEGORIES.length - 1];
}

function getStatusLabel(status: ComplaintStatus, language: 'bn' | 'en') {
  const labels: Record<ComplaintStatus, { bn: string; en: string }> = {
    pending: { bn: 'পর্যালোচনাধীন', en: 'Pending' },
    assigned: { bn: 'দায়িত্বপ্রাপ্ত', en: 'Assigned' },
    in_progress: { bn: 'কাজ চলমান', en: 'In progress' },
    resolved: { bn: 'সমাধানকৃত', en: 'Resolved' },
  };
  return labels[status][language];
}

function formatDate(value: string, language: 'bn' | 'en') {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat(language === 'bn' ? 'bn-BD' : 'en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

export default function CitizenComplaintsPage() {
  const { language } = useApp();
  const { user } = useAuth();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [persistedPhotos, setPersistedPhotos] = useState<ComplaintPhotoUrls>({});
  const [activeTab, setActiveTab] = useState<'list' | 'new'>('list');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [category, setCategory] = useState<ComplaintCategory>('road_damage');
  const [description, setDescription] = useState('');
  const [locationAddress, setLocationAddress] = useState('');
  const [wardNumber, setWardNumber] = useState(user?.wardNumber ?? 27);
  const [coordinates, setCoordinates] = useState<{ latitude: number; longitude: number } | null>(null);
  const [photos, setPhotos] = useState<DraftPhoto[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [error, setError] = useState('');
  const [successId, setSuccessId] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const draftUrlsRef = useRef<string[]>([]);

  useEffect(() => {
    if (!user) return;
    let active = true;
    queueMicrotask(() => {
      if (active) setIsLoading(true);
    });
    mockApi.getComplaints()
      .then((all) => {
        if (!active) return;
        const ownReports = all.filter(
          (complaint) =>
            complaint.citizenId === user.id ||
            (Boolean(user.phone) && complaint.phone === user.phone)
        );
        setComplaints(ownReports);
        setError('');
      })
      .catch((loadError: unknown) => {
        if (active) {
          setError(loadError instanceof Error
            ? loadError.message
            : language === 'bn'
              ? 'অভিযোগের তথ্য লোড করা যায়নি।'
              : 'Unable to load your reports.');
        }
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, [user, language]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('new') !== '1') return;
    const selectedCategory = CATEGORIES.find((item) => item.id === params.get('category'))?.id;
    let active = true;
    queueMicrotask(() => {
      if (!active) return;
      setActiveTab('new');
      if (selectedCategory) setCategory(selectedCategory);
    });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;
    const createdUrls: string[] = [];
    queueMicrotask(() => {
      if (active) setPersistedPhotos({});
    });
    Promise.all(
      complaints.map(async (complaint) => {
        const urls = await Promise.all(
          (complaint.photoIds ?? []).map(async (id) => {
            const blob = await loadReportPhoto(id);
            if (!blob) return null;
            const url = URL.createObjectURL(blob);
            createdUrls.push(url);
            return url;
          })
        );
        return [complaint.id, urls.filter((url): url is string => Boolean(url))] as const;
      })
    )
      .then((items) => {
        if (active) setPersistedPhotos(Object.fromEntries(items));
      })
      .catch((photoError: unknown) => {
        if (active) {
          setError(photoError instanceof Error
            ? photoError.message
            : language === 'bn'
              ? 'রিপোর্টের ছবি লোড করা যায়নি।'
              : 'Unable to load report photos.');
        }
      });
    return () => {
      active = false;
      createdUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [complaints, language]);

  useEffect(() => () => {
    draftUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
  }, []);

  const addPhotos = (selectedFiles: FileList | File[]) => {
    const incoming = Array.from(selectedFiles);
    const accepted: DraftPhoto[] = [];
    let validationMessage = '';
    let remaining = MAX_PHOTOS - photos.length;

    for (const file of incoming) {
      const extension = file.name.split('.').pop()?.toLowerCase() ?? '';
      const validType =
        ALLOWED_MIME_TYPES.includes(file.type) ||
        (!file.type && ALLOWED_EXTENSIONS.includes(extension));
      if (!validType) {
        validationMessage = language === 'bn'
          ? 'শুধু JPG, PNG বা WEBP ছবি আপলোড করুন।'
          : 'Choose JPG, PNG, or WEBP images only.';
        continue;
      }
      if (file.size > MAX_PHOTO_BYTES) {
        validationMessage = language === 'bn'
          ? `${file.name}: ছবির আকার ৫ MB-এর বেশি।`
          : `${file.name}: the image is larger than 5 MB.`;
        continue;
      }
      if (remaining <= 0) {
        validationMessage = language === 'bn'
          ? 'সর্বোচ্চ ৩টি ছবি যোগ করা যাবে।'
          : 'You can add up to 3 photos.';
        break;
      }
      accepted.push({ file, previewUrl: URL.createObjectURL(file) });
      draftUrlsRef.current.push(accepted[accepted.length - 1].previewUrl);
      remaining -= 1;
    }

    if (accepted.length) setPhotos((current) => [...current, ...accepted]);
    setUploadError(validationMessage);
  };

  const removeDraftPhoto = (previewUrl: string) => {
    URL.revokeObjectURL(previewUrl);
    draftUrlsRef.current = draftUrlsRef.current.filter((url) => url !== previewUrl);
    setPhotos((current) => current.filter((photo) => photo.previewUrl !== previewUrl));
    setUploadError('');
  };

  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError(language === 'bn'
        ? 'এই ব্রাউজারে অবস্থান সেবা পাওয়া যায়নি।'
        : 'Location services are unavailable in this browser.');
      return;
    }
    setError('');
    setIsGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      ({ coords: position }) => {
        setCoordinates({ latitude: position.latitude, longitude: position.longitude });
        setIsGettingLocation(false);
      },
      () => {
        setError(language === 'bn'
          ? 'অবস্থান পাওয়া যায়নি। ব্রাউজারের অনুমতি পরীক্ষা করে আবার চেষ্টা করুন।'
          : 'Location could not be retrieved. Check browser permission and try again.');
        setIsGettingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const resetForm = () => {
    draftUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    draftUrlsRef.current = [];
    setPhotos([]);
    setDescription('');
    setLocationAddress('');
    setCoordinates(null);
    setUploadError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    if (!user || !description.trim() || !locationAddress.trim()) return;

    setIsSubmitting(true);
    let savedPhotoIds: string[] = [];
    try {
      if (photos.length) {
        savedPhotoIds = await saveReportPhotos(photos.map((photo) => photo.file));
      }
      const created = await mockApi.submitComplaint({
        citizenId: user.id,
        citizenName: user.nameEn,
        phone: user.phone ?? '',
        wardNumber,
        category,
        title: getCategory(category).title.en,
        description: description.trim(),
        latitude: coordinates?.latitude,
        longitude: coordinates?.longitude,
        locationLabel: locationAddress.trim(),
        photoIds: savedPhotoIds,
      });
      setComplaints((current) => [created, ...current]);
      setSuccessId(created.trackingId);
      setActiveTab('list');
      resetForm();
    } catch (submitError: unknown) {
      if (savedPhotoIds.length) {
        try {
          await deleteReportPhotos(savedPhotoIds);
        } catch (cleanupError) {
          console.error('Unable to clean up report photos after a failed submission:', cleanupError);
        }
      }
      setError(submitError instanceof Error
        ? submitError.message
        : language === 'bn'
          ? 'রিপোর্ট জমা দেওয়া যায়নি। আবার চেষ্টা করুন।'
          : 'Unable to submit the report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <header className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-3xl">
            <span className="mb-2 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-[#ECFDF5] px-3 py-1 text-xs font-semibold text-[#006A4E]">
              <AlertTriangle className="h-4 w-4" />
              {language === 'bn' ? 'নাগরিক সমস্যা ও অভিযোগ দাখিল' : 'Civic Problem Reporting'}
            </span>
            <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">
              {language === 'bn' ? 'সমস্যা জানান' : 'Report a Civic Problem'}
            </h1>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              {language === 'bn'
                ? 'সমস্যার ধরন, ওয়ার্ড ও সঠিক অবস্থান জানান। ছবি দিলে সংশ্লিষ্ট দল সমস্যাটি বুঝতে পারবে।'
                : 'Choose a category, ward, and precise location. Photos help the responsible team understand the issue.'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setActiveTab('new');
              setSuccessId('');
              setError('');
            }}
            className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#006A4E] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#00523C] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#006A4E]"
          >
            <ImagePlus className="h-4 w-4" />
            {language === 'bn' ? 'নতুন রিপোর্ট' : 'New report'}
          </button>
        </div>
      </header>

      {successId && (
        <div role="status" aria-live="polite" className="flex items-start gap-3 rounded-xl border border-emerald-300 bg-[#ECFDF5] p-4 text-sm text-emerald-950">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#006A4E]" />
          <p className="min-w-0 flex-1">
            {language === 'bn' ? 'রিপোর্ট জমা হয়েছে। ট্র্যাকিং নম্বর: ' : 'Report submitted. Tracking ID: '}
            <span className="font-mono font-bold">{successId}</span>
          </p>
          <button
            type="button"
            aria-label={language === 'bn' ? 'বার্তা বন্ধ করুন' : 'Dismiss message'}
            onClick={() => setSuccessId('')}
            className="rounded-md p-1 text-emerald-800 hover:bg-emerald-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#006A4E]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {error && (
        <div role="alert" className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
          <p className="flex-1">{error}</p>
          <button type="button" onClick={() => setError('')} aria-label={language === 'bn' ? 'ত্রুটি বন্ধ করুন' : 'Dismiss error'}>
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <div role="tablist" aria-label={language === 'bn' ? 'রিপোর্ট প্যানেল' : 'Report views'} className="flex w-full gap-2 border-b border-slate-200">
        {(['list', 'new'] as const).map((tab) => (
          <button
            key={tab}
            id={`report-tab-${tab}`}
            type="button"
            role="tab"
            aria-selected={activeTab === tab}
            aria-controls={`report-panel-${tab}`}
            onClick={() => setActiveTab(tab)}
            className={`min-h-11 rounded-t-lg border-b-2 px-4 text-sm font-semibold transition-colors ${
              activeTab === tab
                ? 'border-[#006A4E] text-[#006A4E]'
                : 'border-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            {tab === 'list'
              ? `${language === 'bn' ? 'আমার রিপোর্ট' : 'My reports'} (${complaints.length})`
              : language === 'bn' ? 'সমস্যা জানান' : 'Report a problem'}
          </button>
        ))}
      </div>

      {activeTab === 'new' ? (
        <form
          id="report-panel-new"
          role="tabpanel"
          aria-labelledby="report-tab-new"
          onSubmit={handleSubmit}
          className="space-y-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7"
        >
          <fieldset>
            <legend className="mb-3 text-sm font-semibold text-slate-900">
              {language === 'bn' ? 'সমস্যার ধরন নির্বাচন করুন' : 'Select a problem category'}
            </legend>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {CATEGORIES.map((item) => {
                const selected = category === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => setCategory(item.id)}
                    className={`flex min-h-16 items-center gap-3 rounded-xl border p-3 text-left transition-[background-color,border-color,transform] duration-300 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#006A4E] motion-reduce:transform-none ${
                      selected
                        ? 'border-[#006A4E] bg-[#ECFDF5] text-[#00523C]'
                        : 'border-slate-200 bg-white text-slate-800 hover:border-[#006A4E] hover:bg-[#ECFDF5]'
                    }`}
                  >
                    <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${selected ? 'bg-[#006A4E] text-white' : 'bg-slate-100 text-slate-600'}`}>
                      {item.icon}
                    </span>
                    <span className="text-sm font-semibold">{item.title[language]}</span>
                  </button>
                );
              })}
            </div>
          </fieldset>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="report-ward" className="mb-1.5 block text-sm font-semibold text-slate-800">
                {language === 'bn' ? 'ওয়ার্ড নম্বর' : 'Ward'}
              </label>
              <select
                id="report-ward"
                value={wardNumber}
                onChange={(event) => setWardNumber(Number(event.target.value))}
                className="min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#006A4E]"
              >
                {Array.from({ length: 54 }, (_, index) => index + 1).map((ward) => (
                  <option key={ward} value={ward}>
                    {language === 'bn' ? `ওয়ার্ড নং ${ward}` : `Ward ${ward}`}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="report-address" className="mb-1.5 block text-sm font-semibold text-slate-800">
                {language === 'bn' ? 'সড়ক / ল্যান্ডমার্কের ঠিকানা' : 'Street / landmark address'}
              </label>
              <input
                id="report-address"
                value={locationAddress}
                onChange={(event) => setLocationAddress(event.target.value)}
                required
                maxLength={240}
                placeholder={language === 'bn' ? 'যেমন: রোড ৯/এ, সিটি ব্যাংকের বিপরীতে' : 'e.g. Road 9/A, opposite City Bank'}
                className="min-h-11 w-full rounded-lg border border-slate-300 px-3 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#006A4E]"
              />
            </div>

            <div className="sm:col-span-2">
              <div className="mb-1.5 flex flex-wrap items-center justify-between gap-2">
                <span className="text-sm font-semibold text-slate-800">
                  {language === 'bn' ? 'সমস্যার বিস্তারিত বিবরণ' : 'Problem description'}
                </span>
                <button
                  type="button"
                  onClick={useCurrentLocation}
                  disabled={isGettingLocation}
                  className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-emerald-200 bg-[#ECFDF5] px-3 text-xs font-semibold text-[#006A4E] hover:bg-emerald-100 disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#006A4E]"
                >
                  <Navigation className="h-4 w-4" />
                  {isGettingLocation
                    ? language === 'bn' ? 'অবস্থান নেওয়া হচ্ছে...' : 'Getting location...'
                    : language === 'bn' ? 'বর্তমান অবস্থান ব্যবহার করুন' : 'Use current location'}
                </button>
              </div>
              <textarea
                id="report-description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                required
                minLength={10}
                maxLength={2000}
                rows={5}
                placeholder={language === 'bn'
                  ? 'সমস্যাটি কোথায়, কতদিন ধরে আছে এবং চলাচল বা নিরাপত্তায় কী প্রভাব ফেলছে তা লিখুন।'
                  : 'Describe where the issue is, how long it has been present, and how it affects access or safety.'}
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#006A4E]"
              />
              <p className="mt-1 text-xs text-slate-500">
                {language === 'bn' ? `${description.length}/২০০০ অক্ষর` : `${description.length}/2000 characters`}
              </p>
              {coordinates && (
                <p className="mt-2 inline-flex items-center gap-1.5 text-xs text-emerald-800">
                  <MapPin className="h-3.5 w-3.5" />
                  {coordinates.latitude.toFixed(5)}, {coordinates.longitude.toFixed(5)}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-800">
              {language === 'bn' ? 'সমস্যার ছবি (সর্বোচ্চ ৩টি, প্রতিটি ৫ MB)' : 'Problem photos (up to 3, 5 MB each)'}
            </label>
            <div
              onDragOver={(event) => {
                event.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(event) => {
                event.preventDefault();
                setIsDragging(false);
                addPhotos(event.dataTransfer.files);
              }}
              className={`rounded-xl border-2 border-dashed p-5 text-center transition-colors ${
                isDragging ? 'border-[#006A4E] bg-[#ECFDF5]' : 'border-slate-300 bg-slate-50'
              }`}
            >
              <UploadCloud className="mx-auto h-8 w-8 text-[#006A4E]" />
              <p className="mt-2 text-sm font-semibold text-slate-800">
                {language === 'bn' ? 'ছবি টেনে আনুন অথবা নির্বাচন করুন' : 'Drag photos here or choose files'}
              </p>
              <p className="mt-1 text-xs text-slate-500">JPG, PNG, WEBP · 5 MB max per photo</p>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="mt-3 min-h-10 rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-800 hover:border-[#006A4E] hover:bg-[#ECFDF5] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#006A4E]"
              >
                {language === 'bn' ? 'ছবি নির্বাচন করুন' : 'Choose photos'}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                multiple
                onChange={(event) => {
                  if (event.target.files) addPhotos(event.target.files);
                  event.target.value = '';
                }}
                className="sr-only"
                aria-label={language === 'bn' ? 'সমস্যার ছবি নির্বাচন করুন' : 'Choose problem photos'}
              />
            </div>
            {uploadError && <p role="alert" className="mt-2 text-sm text-rose-700">{uploadError}</p>}
            {photos.length > 0 && (
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {photos.map((photo) => (
                  <figure key={photo.previewUrl} className="relative overflow-hidden rounded-xl border border-slate-200 bg-white">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={photo.previewUrl} alt={photo.file.name} className="h-32 w-full object-cover" />
                    <figcaption className="truncate px-2 py-1 text-xs text-slate-600">{photo.file.name}</figcaption>
                    <button
                      type="button"
                      onClick={() => removeDraftPhoto(photo.previewUrl)}
                      aria-label={language === 'bn' ? `${photo.file.name} সরান` : `Remove ${photo.file.name}`}
                      className="absolute right-2 top-2 rounded-full bg-slate-950/75 p-2 text-white hover:bg-rose-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </figure>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => {
                resetForm();
                setActiveTab('list');
              }}
              className="min-h-11 rounded-lg border border-slate-300 px-5 text-sm font-semibold text-slate-700 hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#006A4E]"
            >
              {language === 'bn' ? 'বাতিল' : 'Cancel'}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="min-h-11 rounded-lg bg-[#006A4E] px-5 text-sm font-semibold text-white hover:bg-[#00523C] disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#006A4E]"
            >
              {isSubmitting
                ? language === 'bn' ? 'রিপোর্ট জমা হচ্ছে...' : 'Submitting report...'
                : language === 'bn' ? 'রিপোর্ট জমা দিন' : 'Submit report'}
            </button>
          </div>
        </form>
      ) : (
        <section
          id="report-panel-list"
          role="tabpanel"
          aria-labelledby="report-tab-list"
          className="space-y-4"
        >
          {isLoading ? (
            <div role="status" className="rounded-xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-600">
              <Clock3 className="mx-auto mb-2 h-5 w-5 animate-spin text-[#006A4E] motion-reduce:animate-none" />
              {language === 'bn' ? 'রিপোর্ট লোড হচ্ছে...' : 'Loading your reports...'}
            </div>
          ) : complaints.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center sm:p-12">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#ECFDF5] text-[#006A4E]">
                <MapPin className="h-6 w-6" />
              </div>
              <h2 className="mt-4 text-base font-semibold text-slate-900">
                {language === 'bn' ? 'এখনও কোনো রিপোর্ট নেই' : 'No reports yet'}
              </h2>
              <p className="mx-auto mt-1 max-w-md text-sm leading-6 text-slate-600">
                {language === 'bn'
                  ? 'আপনার এলাকার নাগরিক সমস্যা জানালে রিপোর্টের অবস্থা এখানে দেখা যাবে।'
                  : 'Reports about civic issues in your area and their status will appear here.'}
              </p>
              <button
                type="button"
                onClick={() => setActiveTab('new')}
                className="mt-4 min-h-11 rounded-lg bg-[#006A4E] px-4 text-sm font-semibold text-white hover:bg-[#00523C]"
              >
                {language === 'bn' ? 'প্রথম রিপোর্ট জমা দিন' : 'Submit your first report'}
              </button>
            </div>
          ) : (
            complaints.map((complaint) => {
              const categoryInfo = getCategory(complaint.category);
              const photoUrls = complaint.photoIds?.length
                ? persistedPhotos[complaint.id] ?? []
                : complaint.photoUrl
                  ? [complaint.photoUrl]
                  : [];
              return (
                <article
                  key={complaint.id}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-[background-color,border-color,transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:border-[#006A4E] hover:bg-[#ECFDF5] motion-reduce:transform-none sm:p-6"
                >
                  <div className="flex flex-col gap-3 border-b border-slate-100 pb-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <p className="font-mono text-sm font-bold text-[#006A4E]">{complaint.trackingId}</p>
                      <h2 className="mt-1 text-base font-semibold text-slate-900">{categoryInfo.title[language]}</h2>
                    </div>
                    <span className={`inline-flex w-fit items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${
                      complaint.status === 'resolved'
                        ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                        : complaint.status === 'in_progress'
                          ? 'border-sky-200 bg-sky-50 text-sky-800'
                          : 'border-amber-200 bg-amber-50 text-amber-900'
                    }`}>
                      {complaint.status === 'resolved' ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Clock3 className="h-3.5 w-3.5" />}
                      {getStatusLabel(complaint.status, language)}
                    </span>
                  </div>

                  <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-[minmax(0,1fr)_auto]">
                    <div>
                      <p className="whitespace-pre-wrap text-sm leading-6 text-slate-700">{complaint.description}</p>
                      <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-600">
                        <span className="inline-flex items-center gap-1.5">
                          <MapPin className="h-4 w-4 text-slate-500" />
                          {complaint.locationLabel}
                        </span>
                        <span className="font-medium">
                          {language === 'bn' ? `ওয়ার্ড ${complaint.wardNumber}` : `Ward ${complaint.wardNumber}`}
                        </span>
                        <span>{formatDate(complaint.createdAt, language)}</span>
                      </div>
                      {complaint.latitude !== undefined && complaint.longitude !== undefined && (
                        <p className="mt-2 text-xs text-slate-500">
                          {complaint.latitude.toFixed(5)}, {complaint.longitude.toFixed(5)}
                        </p>
                      )}
                    </div>
                    {photoUrls.length > 0 && (
                      <div className="flex gap-2 overflow-x-auto md:max-w-[320px]">
                        {photoUrls.map((url, index) => (
                          <a
                            key={`${complaint.id}-${index}`}
                            href={url}
                            target="_blank"
                            rel="noreferrer"
                            className="block h-24 w-28 shrink-0 overflow-hidden rounded-lg border border-slate-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#006A4E]"
                            aria-label={language === 'bn' ? `রিপোর্টের ছবি ${index + 1} বড় করে দেখুন` : `View report photo ${index + 1}`}
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={url} alt={`${categoryInfo.title[language]} ${index + 1}`} className="h-full w-full object-cover" />
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-3 text-xs text-slate-600">
                    <ShieldCheck className="h-4 w-4 text-[#006A4E]" />
                    <span>{language === 'bn' ? 'দায়িত্বপ্রাপ্ত বিভাগ' : 'Assigned department'}: {language === 'bn' ? complaint.departmentBn : complaint.departmentEn}</span>
                  </div>
                </article>
              );
            })
          )}
        </section>
      )}
    </div>
  );
}
