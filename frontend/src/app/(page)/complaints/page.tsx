'use client';

import React, { Suspense, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  AlertCircle,
  ArrowRight,
  Camera,
  CheckCircle2,
  Cpu,
  Lock,
  LogIn,
  MapPin,
  Search,
  ShieldAlert,
  Star,
  Upload,
  UserPlus,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
import { getSampleCitizenPhoto, mockApi } from '@/services/mockApi';
import { Complaint, ComplaintCategory, ComplaintStatus, WardInfo } from '@/types';
import { resolveWardParam } from '@/data/cityMapData';
import { InteractiveCityMap } from '@/components/InteractiveCityMap';
import { SatellitePinMap } from '@/components/SatellitePinMap';
import { StatusBadge } from '@/components/StatusBadge';
import { EmptyState } from '@/components/common/EmptyState';

const STEPS: ComplaintStatus[] = ['pending', 'assigned', 'in_progress', 'resolved'];

function ComplaintsContent() {
  const { language, t } = useApp();
  const { user, isAuthenticated, getDashboardPath } = useAuth();
  const searchParams = useSearchParams();
  const trackParam = searchParams.get('track');
  const tabParam = searchParams.get('tab');
  const wardParam = searchParams.get('ward');

  const isCitizen = isAuthenticated && user?.role === 'citizen';

  const [activeTab, setActiveTab] = useState<'submit' | 'track'>(
    trackParam ? 'track' : tabParam === 'submit' ? 'submit' : 'track'
  );
  const [wards, setWards] = useState<WardInfo[]>([]);
  const [complaints, setComplaints] = useState<Complaint[]>([]);

  // Submit Form State
  const [citizenName, setCitizenName] = useState(user?.role === 'citizen' ? user.nameEn : '');
  const [phone, setPhone] = useState(user?.role === 'citizen' ? user.phone || '' : '');
  const [category, setCategory] = useState<ComplaintCategory>('road_damage');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const parsedWard = resolveWardParam(wardParam);
  const [wardNumber, setWardNumber] = useState<number>(
    parsedWard !== 'all' ? parsedWard : user?.wardNumber || 27
  );
  const [pickedCoords, setPickedCoords] = useState<{
    x: number;
    y: number;
    lat: number;
    lng: number;
  }>({ x: 38, y: 52, lat: 23.7461, lng: 90.3742 });
  const [photoPreview, setPhotoPreview] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Tracker State
  const [trackId, setTrackId] = useState(trackParam || 'CMP-2026-8492');
  const [trackedComplaint, setTrackedComplaint] = useState<Complaint | null>(null);
  const [rating, setRating] = useState(5);
  const [feedback, setFeedback] = useState('');

  const loadAll = async (targetTrackId?: string) => {
    const [w, list] = await Promise.all([mockApi.getWards(), mockApi.getComplaints()]);
    setWards(w);
    setComplaints(list);
    const idToFind = targetTrackId || trackId;
    const match = list.find((c) => c.trackingId.toUpperCase() === idToFind.trim().toUpperCase());
    if (match) setTrackedComplaint(match);
  };

  useEffect(() => {
    let active = true;
    const idToFind = trackParam || 'CMP-2026-8492';
    Promise.all([mockApi.getWards(), mockApi.getComplaints()]).then(([w, list]) => {
      if (!active) return;
      setWards(w);
      setComplaints(list);
      const match = list.find((c) => c.trackingId.toUpperCase() === idToFind.trim().toUpperCase());
      if (match) setTrackedComplaint(match);
    });
    return () => {
      active = false;
    };
  }, [trackParam]);

  useEffect(() => {
    if (user?.role === 'citizen') {
      queueMicrotask(() => {
        setCitizenName((prev) => prev || user.nameEn);
        setPhone((prev) => prev || user.phone || '');
      });
    }
  }, [user]);

  useEffect(() => {
    const nextWard = resolveWardParam(wardParam);
    queueMicrotask(() => {
      if (trackParam) {
        setActiveTab('track');
        setTrackId(trackParam);
      } else if (tabParam === 'submit') {
        setActiveTab('submit');
      } else if (tabParam === 'track') {
        setActiveTab('track');
      }
      if (nextWard !== 'all') {
        setWardNumber(nextWard);
      }
    });
  }, [trackParam, tabParam, wardParam]);

  // Live AI Auto-Routing Simulation
  const aiRoute = useMemo(
    () => mockApi.autoRouteComplaint(category, `${title} ${description}`),
    [category, title, description]
  );

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') setPhotoPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setSubmitError(
        language === 'bn'
          ? 'অনুগ্রহ করে সমস্যার একটি সংক্ষিপ্ত শিরোনাম লিখুন। আপনার বাকি তথ্য অক্ষুণ্ণ রয়েছে।'
          : 'Please enter a short issue headline. Your other entered details have been preserved.'
      );
      return;
    }
    setSubmitting(true);
    setSubmitError('');
    try {
      const created = await mockApi.submitComplaint({
        citizenName,
        phone,
        wardNumber,
        category,
        title,
        description: description || title,
        latitude: pickedCoords.lat,
        longitude: pickedCoords.lng,
        locationLabel: `Ward ${wardNumber} (${pickedCoords.lat.toFixed(4)}°N, ${pickedCoords.lng.toFixed(4)}°E)`,
        photoUrl: photoPreview || undefined,
      });
      await loadAll(created.trackingId);
      setTrackId(created.trackingId);
      setTrackedComplaint(created);
      setActiveTab('track');
      setTitle('');
      setDescription('');
      setPhotoPreview('');
    } catch (err: unknown) {
      setSubmitError(
        err instanceof Error
          ? err.message
          : language === 'bn'
            ? 'অভিযোগটি জমা দেওয়া যায়নি। আপনার লেখা তথ্য ও ছবি অক্ষুণ্ণ রয়েছে—অনুগ্রহ করে আবার চেষ্টা করুন।'
            : 'Unable to submit your complaint right now. Your details and photo are preserved—please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleTrackSearch = async (id: string) => {
    setTrackId(id);
    const found = await mockApi.getComplaintByTrackingId(id);
    setTrackedComplaint(found);
  };

  const handleRate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackedComplaint) return;
    const updated = await mockApi.rateComplaint(trackedComplaint.id, rating, feedback);
    if (updated) {
      setTrackedComplaint(updated);
      await loadAll(updated.trackingId);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#111827]">{t.complaintsPage.title}</h1>
          <p className="mt-1.5 text-sm sm:text-base text-[#4B5563] max-w-3xl">
            {t.complaintsPage.subtitle}
          </p>
        </div>

        <div className="flex bg-[#F8FAFC] p-1 rounded-xl border border-[#E2E8F0] self-start">
          <button
            type="button"
            onClick={() => setActiveTab('submit')}
            className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'submit' ? 'bg-[#006A4E] text-white shadow-xs' : 'text-[#4B5563] hover:text-[#111827]'
            }`}
          >
            {t.complaintsPage.submitTab}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('track')}
            className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'track' ? 'bg-[#006A4E] text-white shadow-xs' : 'text-[#4B5563] hover:text-[#111827]'
            }`}
          >
            {t.complaintsPage.trackTab}
          </button>
        </div>
      </div>

      {/* TAB 1: SUBMIT GEO-TAGGED COMPLAINT (CITIZEN LOGIN REQUIRED) */}
      {activeTab === 'submit' && !isCitizen && (
        <div className="max-w-xl mx-auto py-6">
          <div className="civic-card bg-white rounded-xl border border-[#E2E8F0] p-8 text-center space-y-5">
            <div className="w-14 h-14 rounded-2xl bg-[#ECFDF5] text-[#006A4E] flex items-center justify-center mx-auto">
              {isAuthenticated ? (
                <ShieldAlert className="w-7 h-7 text-[#C81E1E]" />
              ) : (
                <Lock className="w-7 h-7 text-[#006A4E]" />
              )}
            </div>

            {isAuthenticated && user ? (
              <>
                <div>
                  <h2 className="text-xl font-bold text-[#111827]">
                    {language === 'bn'
                      ? 'নাগরিক অ্যাকাউন্ট প্রয়োজন'
                      : 'Citizen Account Required to File Complaints'}
                  </h2>
                  <p className="text-sm text-[#4B5563] mt-2 leading-relaxed">
                    {language === 'bn'
                      ? `আপনি বর্তমানে অফিসিয়াল অ্যাকাউন্ট (${user.nameBn}) হিসেবে লগইন আছেন। নতুন অভিযোগ দাখিল করতে নাগরিক অ্যাকাউন্ট প্রয়োজন। আপনি সর্বজনীন স্ট্যাটাস ট্র্যাকার দেখতে পারেন অথবা আপনার অফিসিয়াল ড্যাশবোর্ডে যেতে পারেন।`
                      : `You are currently signed in with an official account (${user.nameEn}). Submitting verified civic complaints requires a registered Citizen account.`}
                  </p>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
                  <Link
                    href={getDashboardPath(user.role)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#006A4E] hover:bg-[#00523C] text-white text-sm font-semibold rounded-lg transition-colors"
                  >
                    <span>{language === 'bn' ? 'আমার ড্যাশবোর্ড' : 'Go to My Dashboard'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <button
                    type="button"
                    onClick={() => setActiveTab('track')}
                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-[#111827] text-sm font-semibold rounded-lg transition-colors cursor-pointer"
                  >
                    {t.complaintsPage.trackTab}
                  </button>
                </div>
              </>
            ) : (
              <>
                <div>
                  <p className="text-xs font-semibold text-[#006A4E] uppercase tracking-wider">
                    {language === 'bn' ? 'যাচাইকৃত নাগরিক সেবা' : 'Verified Citizen Action'}
                  </p>
                  <h2 className="text-xl font-bold text-[#111827] mt-1">
                    {language === 'bn'
                      ? 'অভিযোগ দাখিল করতে নাগরিক লগইন করুন'
                      : 'Citizen Login Required to Submit Complaint'}
                  </h2>
                  <p className="text-sm text-[#4B5563] mt-2 leading-relaxed">
                    {language === 'bn'
                      ? 'ভুয়া অভিযোগ প্রতিরোধ ও তাৎক্ষণিক SMS আপডেট নিশ্চিত করতে নতুন অভিযোগ দাখিলের জন্য নাগরিক লগইন বাধ্যতামূলক। তবে যে কেউ লগইন ছাড়াই অভিযোগের স্ট্যাটাস ট্র্যাক করতে পারবেন।'
                      : 'To prevent spam and deliver live SMS updates, submitting a geo-tagged civic complaint requires Citizen sign-in. Tracking existing complaints remains 100% public.'}
                  </p>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
                  <Link
                    href={`/login?redirect=${encodeURIComponent(
                      wardParam ? `/complaints?tab=submit&ward=${wardParam}` : '/complaints?tab=submit'
                    )}`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#006A4E] hover:bg-[#00523C] text-white text-sm font-semibold rounded-lg transition-colors"
                  >
                    <LogIn className="w-4 h-4 text-emerald-200" />
                    <span>{language === 'bn' ? 'নাগরিক লগইন করুন' : 'Login as Citizen'}</span>
                  </Link>
                  <Link
                    href="/register"
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-300 hover:border-[#006A4E] text-[#006A4E] text-sm font-semibold rounded-lg transition-colors"
                  >
                    <UserPlus className="w-4 h-4 text-[#006A4E]" />
                    <span>{language === 'bn' ? 'নতুন নিবন্ধন' : 'Register'}</span>
                  </Link>
                  <button
                    type="button"
                    onClick={() => setActiveTab('track')}
                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-[#4B5563] text-sm font-semibold rounded-lg transition-colors cursor-pointer"
                  >
                    {language === 'bn' ? 'স্ট্যাটাস ট্র্যাক করুন' : 'Track Existing'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {activeTab === 'submit' && isCitizen && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <form
            onSubmit={handleSubmit}
            className="lg:col-span-6 civic-card bg-white rounded-xl border border-slate-200 p-6 space-y-5"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="complaint-citizen-name" className="block text-xs font-semibold text-slate-700 mb-1">
                  {language === 'bn' ? 'অভিযোগকারীর নাম' : 'Your Name'}
                </label>
                <input
                  id="complaint-citizen-name"
                  type="text"
                  required
                  value={citizenName}
                  onChange={(e) => setCitizenName(e.target.value)}
                  className="w-full min-h-[44px] px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006A4E]"
                />
              </div>

              <div>
                <label htmlFor="complaint-phone" className="block text-xs font-semibold text-slate-700 mb-1">
                  {language === 'bn' ? 'মোবাইল নম্বর' : 'Mobile Number'}
                </label>
                <input
                  id="complaint-phone"
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full min-h-[44px] px-3 py-2 text-sm font-mono border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006A4E]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="complaint-category" className="block text-xs font-semibold text-slate-700 mb-1">
                  {language === 'bn' ? 'সমস্যার ধরন' : 'Issue Category'}
                </label>
                <select
                  id="complaint-category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ComplaintCategory)}
                  className="w-full min-h-[44px] px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#006A4E]"
                >
                  {(
                    ['road_damage', 'drainage', 'waste', 'street_light', 'mosquito', 'other'] as ComplaintCategory[]
                  ).map((cat) => (
                    <option key={cat} value={cat}>
                      {t.complaintsPage.categories[cat]}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="complaint-ward" className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.common.ward}
                </label>
                <select
                  id="complaint-ward"
                  value={wardNumber}
                  onChange={(e) => setWardNumber(Number(e.target.value))}
                  className="w-full min-h-[44px] px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#006A4E]"
                >
                  {wards.map((w) => (
                    <option key={w.wardNumber} value={w.wardNumber}>
                      Ward {w.wardNumber} — {language === 'bn' ? w.nameBn : w.nameEn}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="complaint-title" className="block text-xs font-semibold text-slate-700 mb-1">
                {language === 'bn' ? 'সমস্যার সংক্ষিপ্ত শিরোনাম' : 'Issue Headline'}
              </label>
              <input
                id="complaint-title"
                type="text"
                required
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (submitError) setSubmitError('');
                }}
                placeholder={
                  language === 'bn'
                    ? 'যেমন: মিরপুর ১০ নম্বর মেইন রোডে বড় গর্ত'
                    : 'e.g. Broken storm drain cover near School Gate'
                }
                className="w-full min-h-[44px] px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006A4E]"
              />
            </div>

            <div>
              <label htmlFor="complaint-description" className="block text-xs font-semibold text-slate-700 mb-1">
                {language === 'bn' ? 'বিস্তারিত বিবরণ' : 'Detailed Description'}
              </label>
              <textarea
                id="complaint-description"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={
                  language === 'bn'
                    ? 'সমস্যার অবস্থান ও বিস্তারিত লিখুন...'
                    : 'Describe exact landmark and severity...'
                }
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006A4E]"
              />
            </div>

            {/* Simulated Rule-Based Auto-Routing Preview */}
            <div className="bg-[#ECFDF5] border border-emerald-200 rounded-xl p-4 flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#006A4E] text-white flex items-center justify-center shrink-0">
                <Cpu className="w-4 h-4" aria-hidden="true" />
              </div>
              <div className="text-xs space-y-1">
                <p className="font-bold text-[#111827]">{t.complaintsPage.autoRouteLabel}</p>
                <p className="text-[#4B5563]">
                  {language === 'bn' ? 'প্রস্তাবিত বিভাগ:' : 'Suggested Department:'}{' '}
                  <strong className="text-[#006A4E]">
                    {language === 'bn' ? aiRoute.departmentBn : aiRoute.departmentEn}
                  </strong>
                </p>
                <p className="text-[#4B5563] tabular-nums">
                  Target SLA: {aiRoute.slaHours}h · Priority: {aiRoute.priority.toUpperCase()}
                </p>
                <p className="text-[11px] text-slate-600 pt-0.5">
                  {language === 'bn'
                    ? 'নোট: এটি নিয়ম-ভিত্তিক স্বয়ংক্রিয় নির্দেশনা। সঠিক বিভাগ নিশ্চিত করতে প্রয়োজনে উপরের "সমস্যার ধরন" পরিবর্তন করুন।'
                    : 'Note: Rule-based routing preview. If unsure, adjust "Issue Category" above or choose "Other".'}
                </p>
              </div>
            </div>

            {/* Photo Upload */}
            <div>
              <label className="block text-xs font-semibold text-[#111827] mb-2">
                {language === 'bn' ? 'সমস্যার ছবি সংযুক্ত করুন' : 'Attach Street Photo'}
              </label>
              <div className="flex flex-wrap items-center gap-3">
                <label className="inline-flex items-center gap-2 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-[#111827] text-xs font-semibold rounded-lg cursor-pointer">
                  <Upload className="w-3.5 h-3.5" />
                  <span>{language === 'bn' ? 'ফাইল আপলোড' : 'Upload Image'}</span>
                  <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                </label>
                <button
                  type="button"
                  onClick={() =>
                    setPhotoPreview(getSampleCitizenPhoto(t.complaintsPage.categories[category]))
                  }
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white border border-slate-300 hover:border-[#006A4E] text-[#111827] text-xs font-semibold rounded-lg cursor-pointer"
                >
                  <Camera className="w-3.5 h-3.5 text-[#006A4E]" />
                  <span>{language === 'bn' ? 'নমুনা ছবি ব্যবহার করুন' : 'Use Sample Field Photo'}</span>
                </button>
              </div>
              {photoPreview && (
                <div className="relative mt-3 w-full max-w-xs h-36 rounded-lg border border-[#E2E8F0] overflow-hidden">
                  <Image
                    src={photoPreview}
                    alt="Complaint preview"
                    fill
                    sizes="320px"
                    referrerPolicy="no-referrer"
                    className="object-cover"
                  />
                </div>
              )}
            </div>

            {submitError && (
              <div
                role="alert"
                className="flex items-start gap-2.5 rounded-lg border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800"
              >
                <AlertCircle className="w-4 h-4 text-[#C81E1E] shrink-0 mt-0.5" aria-hidden="true" />
                <span>{submitError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full min-h-[44px] py-3 bg-[#006A4E] hover:bg-[#00523C] disabled:opacity-60 text-white text-sm font-semibold rounded-lg transition-colors cursor-pointer"
            >
              {submitting ? t.common.loading : t.complaintsPage.submitButton}
            </button>
          </form>

          {/* Interactive GPS Coordinate Picker */}
          <div className="lg:col-span-6 space-y-4">
            <div className="civic-card bg-white rounded-xl border border-[#E2E8F0] p-5">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-bold text-[#111827] flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#006A4E]" />
                  <span>{language === 'bn' ? 'GPS লোকেশন পিন করুন' : 'Geo-Tag Location Picker'}</span>
                </h2>
                <span className="font-mono text-xs text-[#4B5563] tabular-nums">
                  {pickedCoords.lat.toFixed(4)}°N, {pickedCoords.lng.toFixed(4)}°E
                </span>
              </div>

              <InteractiveCityMap
                wards={wards}
                mode="picker"
                selectedWard={wardNumber}
                pickedCoords={pickedCoords}
                onPickLocation={(coords) => {
                  setPickedCoords({ x: coords.x, y: coords.y, lat: coords.lat, lng: coords.lng });
                  setWardNumber(coords.wardNumber);
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: LIVE STATUS TRACKER */}
      {activeTab === 'track' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-4 space-y-4">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleTrackSearch(trackId);
              }}
              className="civic-card bg-white rounded-xl border border-slate-200 p-5 space-y-3"
            >
              <label className="block text-xs font-semibold text-slate-700">
                {language === 'bn' ? 'ট্র্যাকিং আইডি খুঁজুন' : 'Search by Tracking ID'}
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={trackId}
                  onChange={(e) => setTrackId(e.target.value)}
                  placeholder={t.complaintsPage.trackingPlaceholder}
                  className="flex-1 px-3 py-2 text-xs font-mono border border-slate-300 rounded-lg"
                />
                <button
                  type="submit"
                  className="px-3.5 py-2 bg-[#006A4E] hover:bg-[#00523C] text-white text-xs font-semibold rounded-lg cursor-pointer transition-colors"
                >
                  <Search className="w-4 h-4" />
                </button>
              </div>
            </form>

            <div className="civic-card bg-white rounded-xl border border-[#E2E8F0] p-5 space-y-2.5">
              <h3 className="text-xs font-bold text-[#4B5563] uppercase tracking-wide">
                {language === 'bn' ? 'সাম্প্রতিক অভিযোগসমূহ' : 'Recent Filed Reports'}
              </h3>
              {complaints.slice(0, 6).map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => handleTrackSearch(c.trackingId)}
                  className={`w-full text-left p-3 rounded-lg border transition-colors cursor-pointer ${
                    trackedComplaint?.id === c.id
                      ? 'bg-[#ECFDF5] border-[#006A4E]'
                      : 'border-[#E2E8F0] hover:bg-[#F8FAFC]'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-mono font-bold text-[#006A4E]">{c.trackingId}</span>
                    <span className="text-[#4B5563] tabular-nums">Ward {c.wardNumber}</span>
                  </div>
                  <p className="text-xs font-medium text-[#111827] line-clamp-1">{c.title}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="lg:col-span-8">
            {trackedComplaint ? (
              <div className="civic-card bg-white rounded-xl border border-[#E2E8F0] p-6 space-y-6">
                <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 pb-4">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-[#4B5563] mb-1">
                      <span className="font-mono font-bold text-[#006A4E]">
                        {trackedComplaint.trackingId}
                      </span>
                      <span>·</span>
                      <span>
                        {language === 'bn' ? trackedComplaint.departmentBn : trackedComplaint.departmentEn}
                      </span>
                      <span>·</span>
                      <span className="tabular-nums">Ward {trackedComplaint.wardNumber}</span>
                    </div>
                    <h2 className="text-xl font-bold text-[#111827]">{trackedComplaint.title}</h2>
                  </div>
                  <StatusBadge
                    variant={
                      trackedComplaint.status === 'resolved'
                        ? 'success'
                        : trackedComplaint.status === 'pending'
                          ? 'warning'
                          : 'neutral'
                    }
                    label={t.complaintsPage.steps[trackedComplaint.status]}
                  />
                </div>

                {/* 4-Step Progress Stepper */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {STEPS.map((step, index) => {
                    const currentIdx = STEPS.indexOf(trackedComplaint.status);
                    const done = index <= currentIdx;
                    return (
                      <div
                        key={step}
                        className={`p-3 rounded-lg border ${
                          done
                            ? 'bg-[#ECFDF5] border-emerald-200 text-[#006A4E]'
                            : 'bg-[#F8FAFC] border-[#E2E8F0] text-slate-400'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 text-xs font-bold mb-1">
                          <CheckCircle2
                            className={`w-4 h-4 ${done ? 'text-[#006A4E]' : 'text-slate-300'}`}
                          />
                          <span>0{index + 1}</span>
                        </div>
                        <p className="text-xs font-semibold">{t.complaintsPage.steps[step]}</p>
                      </div>
                    );
                  })}
                </div>

                <div className="text-sm text-slate-700 space-y-3">
                  <p>{trackedComplaint.description}</p>
                  {trackedComplaint.latitude !== undefined && trackedComplaint.longitude !== undefined ? (
                    <>
                      <p className="text-xs font-mono text-slate-500 tabular-nums">
                        GPS: {trackedComplaint.latitude.toFixed(4)}°N, {trackedComplaint.longitude.toFixed(4)}°E
                        {trackedComplaint.assignedStaffName
                          ? ` · Assigned Staff: ${trackedComplaint.assignedStaffName}`
                          : ''}
                      </p>
                      <SatellitePinMap
                        lat={trackedComplaint.latitude}
                        lng={trackedComplaint.longitude}
                        zoom={16}
                        label={`${trackedComplaint.trackingId} · Ward ${trackedComplaint.wardNumber}`}
                        subtitle={trackedComplaint.locationLabel}
                        heightClassName="h-52"
                        pinColor={trackedComplaint.status === 'resolved' ? 'teal' : 'rose'}
                      />
                    </>
                  ) : (
                    <p className="text-xs text-slate-500">
                      {language === 'bn' ? 'এই রিপোর্টে জিপিএস স্থানাঙ্ক দেওয়া হয়নি।' : 'No GPS coordinates were provided for this report.'}
                    </p>
                  )}
                </div>

                {/* Before / Field Proof Photos */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {trackedComplaint.photoUrl && (
                    <div className="border border-slate-200 rounded-xl overflow-hidden">
                      <div className="bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600 border-b border-slate-200">
                        {language === 'bn' ? 'নাগরিকের পাঠানো ছবি' : 'Citizen Reported Photo'}
                      </div>
                      <div className="relative w-full h-44">
                        <Image
                          src={trackedComplaint.photoUrl}
                          alt="Citizen evidence"
                          fill
                          sizes="(max-width: 640px) 100vw, 33vw"
                          referrerPolicy="no-referrer"
                          className="object-cover"
                        />
                      </div>
                    </div>
                  )}

                  {trackedComplaint.proofPhotoUrl && (
                    <div className="border border-emerald-200 rounded-xl overflow-hidden">
                      <div className="bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-800 border-b border-emerald-200">
                        {language === 'bn' ? 'মাঠকর্মীর সমাধান প্রমাণ' : 'Field Staff Resolution Proof'}
                      </div>
                      <div className="relative w-full h-44">
                        <Image
                          src={trackedComplaint.proofPhotoUrl}
                          alt="Resolution proof"
                          fill
                          sizes="(max-width: 640px) 100vw, 33vw"
                          referrerPolicy="no-referrer"
                          className="object-cover"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {trackedComplaint.resolutionNote && (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3.5 text-xs text-emerald-900">
                    <strong>Resolution Note:</strong> {trackedComplaint.resolutionNote}
                  </div>
                )}

                {/* Citizen Rating Feedback */}
                {trackedComplaint.status === 'resolved' && (
                  <div className="border-t border-slate-200 pt-5">
                    {trackedComplaint.rating ? (
                      <div className="flex items-center gap-3 text-sm text-slate-700">
                        <div className="flex items-center gap-0.5 text-amber-500">
                          {Array.from({ length: trackedComplaint.rating }).map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-amber-500" />
                          ))}
                        </div>
                        <span className="font-medium">
                          Citizen Feedback: &ldquo;{trackedComplaint.feedback}&rdquo;
                        </span>
                      </div>
                    ) : isCitizen ? (
                      <form onSubmit={handleRate} className="space-y-3">
                        <p className="text-xs font-bold text-[#111827]">
                          {language === 'bn'
                            ? 'কাজের মান মূল্যায়ন করুন'
                            : 'Rate Field Resolution Quality'}
                        </p>
                        <div className="flex items-center gap-1.5">
                          {[1, 2, 3, 4, 5].map((num) => (
                            <button
                              key={num}
                              type="button"
                              aria-label={`Rate ${num} out of 5 stars`}
                              aria-pressed={num <= rating}
                              onClick={() => setRating(num)}
                              className="p-1 cursor-pointer"
                            >
                              <Star
                                className={`w-5 h-5 ${
                                  num <= rating ? 'text-amber-500 fill-amber-500' : 'text-slate-300'
                                }`}
                                aria-hidden="true"
                              />
                            </button>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                            placeholder="Share feedback on repair speed & quality..."
                            className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006A4E]"
                          />
                          <button
                            type="submit"
                            className="px-4 py-2 bg-[#006A4E] hover:bg-[#00523C] text-white text-xs font-semibold rounded-lg cursor-pointer transition-colors"
                          >
                            Submit Rating
                          </button>
                        </div>
                      </form>
                    ) : !isAuthenticated ? (
                      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#ECFDF5] border border-emerald-200 rounded-lg p-3.5">
                        <div className="flex items-center gap-2 text-xs text-[#111827]">
                          <Lock className="w-4 h-4 text-[#006A4E] shrink-0" />
                          <span>
                            {language === 'bn'
                              ? 'সমাধানের মান রেটিং দিতে নাগরিক হিসেবে লগইন করুন।'
                              : 'Sign in with a Citizen account to submit a verified star rating.'}
                          </span>
                        </div>
                        <Link
                          href={`/login?redirect=${encodeURIComponent(
                            `/complaints?track=${trackedComplaint.trackingId}`
                          )}`}
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#006A4E] hover:bg-[#00523C] text-white text-xs font-semibold rounded-lg transition-colors whitespace-nowrap"
                        >
                          <LogIn className="w-3.5 h-3.5 text-emerald-200" />
                          <span>{language === 'bn' ? 'নাগরিক লগইন' : 'Citizen Login'}</span>
                        </Link>
                      </div>
                    ) : (
                      <p className="text-xs text-[#4B5563]">
                        {language === 'bn'
                          ? 'স্টার রেটিং শুধুমাত্র যাচাইকৃত নাগরিক অ্যাকাউন্টের জন্য সংরক্ষিত।'
                          : 'Resolution star ratings can only be submitted by verified Citizen accounts.'}
                      </p>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <EmptyState message={`No complaint found for Tracking ID "${trackId}".`} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function ComplaintsPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto p-12 text-sm text-slate-500">Loading Complaint System...</div>}>
      <ComplaintsContent />
    </Suspense>
  );
}
