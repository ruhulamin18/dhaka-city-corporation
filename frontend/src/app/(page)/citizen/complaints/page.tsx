'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
import {
  AlertTriangle,
  Camera,
  MapPin,
  Send,
  CheckCircle2,
  Clock,
  Building2,
  Trash2,
  X,
  UploadCloud,
  FileText,
  ShieldAlert,
  HelpCircle,
  Lightbulb,
} from 'lucide-react';

interface ComplaintItem {
  id: string;
  title: { bn: string; en: string };
  category: { bn: string; en: string };
  categoryKey: string;
  description: { bn: string; en: string };
  suggestedSolution?: { bn: string; en: string };
  location: string;
  wardNumber: number;
  coordinates?: string;
  photoUrl?: string;
  submittedAt: string;
  status: 'SUBMITTED' | 'UNDER_REVIEW' | 'ASSIGNED' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  statusLabel: { bn: string; en: string };
  assignedDept?: { bn: string; en: string };
  officerRemarks?: { bn: string; en: string };
  resolvedAt?: string;
  resolutionPhoto?: string;
}

const INITIAL_COMPLAINTS: ComplaintItem[] = [
  {
    id: 'CMP-2026-88412',
    title: {
      bn: 'প্রধান সড়কে বিপজ্জনক বড় গর্ত ও ভাঙা ম্যানহোল',
      en: 'Dangerous Large Pothole & Broken Manhole on Main Road',
    },
    category: { bn: 'সড়ক ও অবকাঠামো', en: 'Road & Infrastructure' },
    categoryKey: 'road',
    description: {
      bn: 'ধানমন্ডি রোড নং ৯/এ এর প্রবেশমুখে পরপর কয়েকটি গভীর গর্ত সৃষ্টি হয়েছে। যানবাহন ও পথচারীদের চলাচলে মারাত্মক ঝুঁকি তৈরি হচ্ছে।',
      en: 'Several deep potholes have formed at the entrance of Road 9/A, Dhanmondi, creating severe accident hazards.',
    },
    suggestedSolution: {
      bn: 'জরুরি ভিত্তিতে পিচ ঢালাই করে রাস্তা সমতল করা এবং ড্রেনের স্ল্যাব পরিবর্তন করা।',
      en: 'Urgent asphalt patching and replacement of broken drain slabs.',
    },
    location: 'ধানমন্ডি ৯/এ প্রবেশমুখ, সিটি ব্যাংকের বিপরীত পাশে',
    wardNumber: 27,
    coordinates: '23.7516° N, 90.3782° E',
    photoUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=500&auto=format&fit=crop&q=60',
    submittedAt: '2026-02-14 09:30 AM',
    status: 'IN_PROGRESS',
    statusLabel: { bn: 'কাজ চলমান', en: 'In Progress' },
    assignedDept: { bn: 'সিভিল ইঞ্জিনিয়ারিং ও সড়ক বিভাগ', en: 'Civil Engineering & Roads' },
    officerRemarks: {
      bn: 'তদন্তকারী প্রকৌশলী পরিদর্শন সম্পন্ন করেছেন। সংস্কারকাজে রোলার ও বিটুমিন টিম নিয়োজিত রয়েছে।',
      en: 'Site inspected. Bitumen crew and heavy machinery deployed for prompt patching.',
    },
  },
  {
    id: 'CMP-2025-99214',
    title: {
      bn: 'সড়কবাতি অকেজো থাকায় রাতে অন্ধকারের ঝুঁকি',
      en: 'Non-Functional Streetlights Causing Nighttime Hazard',
    },
    category: { bn: 'বিদ্যুৎ ও আলোকায়ন', en: 'Lighting & Electrical' },
    categoryKey: 'lighting',
    description: {
      bn: 'গত এক সপ্তাহ ধরে রোড ১২ এর ৩টি সড়কবাতি জ্বলছে না। সন্ধ্যার পর পুরো এলাকা অন্ধকার থাকে।',
      en: '3 consecutive municipal streetlights on Road 12 have been non-functional for a week.',
    },
    location: 'রোড নং ১২/এ সংলগ্ন আবাসিক গলি',
    wardNumber: 27,
    submittedAt: '2025-12-18 04:15 PM',
    status: 'RESOLVED',
    statusLabel: { bn: 'সমাধানকৃত', en: 'Resolved' },
    assignedDept: { bn: 'বিদ্যুৎ ও মেকানিক্যাল বিভাগ', en: 'Electrical & Mechanical' },
    officerRemarks: {
      bn: 'নতুন ১০০ ওয়াট এলইডি বাল্ব স্থাপন ও সার্কিট সংস্কার করে আলোকায়ন নিশ্চিত করা হয়েছে।',
      en: 'Installed new 100W energy-efficient LEDs and tested wiring circuit. Issue resolved.',
    },
    resolvedAt: '2025-12-20',
  },
];

export default function CitizenComplaintsPage() {
  const { language } = useApp();
  const { user } = useAuth();

  const [complaints, setComplaints] = useState<ComplaintItem[]>(INITIAL_COMPLAINTS);
  const [activeTab, setActiveTab] = useState<'LIST' | 'NEW'>('LIST');

  // Form states
  const [problemTitle, setProblemTitle] = useState('');
  const [problemCategory, setProblemCategory] = useState('road_broken');
  const [description, setDescription] = useState('');
  const [suggestedSolution, setSuggestedSolution] = useState('');
  const [locationAddress, setLocationAddress] = useState('');
  const [wardNumber, setWardNumber] = useState<number>(user?.wardNumber || 27);
  const [coordinates, setCoordinates] = useState('23.7505° N, 90.3800° E');
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successId, setSuccessId] = useState<string | null>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitComplaint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!problemTitle.trim() || !description.trim() || !locationAddress.trim()) return;

    setIsSubmitting(true);
    const newId = `CMP-2026-${Math.floor(10000 + Math.random() * 90000)}`;

    setTimeout(() => {
      const newComplaint: ComplaintItem = {
        id: newId,
        title: { bn: problemTitle, en: problemTitle },
        category: {
          bn:
            problemCategory.startsWith('road')
              ? 'সড়ক ও অবকাঠামো'
              : problemCategory.startsWith('drain')
              ? 'ড্রেনেজ ও পানি নিষ্কাশন'
              : problemCategory.startsWith('waste')
              ? 'বর্জ্য ব্যবস্থাপনা'
              : 'জননিরাপত্তা ও পরিবেশ',
          en:
            problemCategory.startsWith('road')
              ? 'Road & Infrastructure'
              : problemCategory.startsWith('drain')
              ? 'Drainage & Water'
              : problemCategory.startsWith('waste')
              ? 'Waste Management'
              : 'Public Safety & Environment',
        },
        categoryKey: problemCategory,
        description: { bn: description, en: description },
        suggestedSolution: suggestedSolution ? { bn: suggestedSolution, en: suggestedSolution } : undefined,
        location: locationAddress,
        wardNumber,
        coordinates,
        photoUrl: selectedPhoto || undefined,
        submittedAt: new Date().toLocaleDateString(language === 'bn' ? 'bn-BD' : 'en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        status: 'SUBMITTED',
        statusLabel: { bn: 'জমা হয়েছে', en: 'Submitted' },
        assignedDept: { bn: 'তদন্ত ও পরিবীক্ষণ শাখা', en: 'Field Investigation Wing' },
        officerRemarks: {
          bn: 'অভিযোগটি গ্রহণ করা হয়েছে। দায়িত্বপ্রাপ্ত মাঠ কর্মকর্তা অতিদ্রুত সরেজমিনে পরিদর্শন করবেন।',
          en: 'Complaint received. Designated field officer scheduled for on-site inspection.',
        },
      };

      setComplaints([newComplaint, ...complaints]);
      setIsSubmitting(false);
      setSuccessId(newId);
      setActiveTab('LIST');

      // Reset form
      setProblemTitle('');
      setDescription('');
      setSuggestedSolution('');
      setLocationAddress('');
      setSelectedPhoto(null);
    }, 800);
  };

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold mb-2">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
            <span>{language === 'bn' ? 'নাগরিক সেবা অভিযোগ প্রতিকার ব্যবস্থা' : 'Civic Problem Grievance System'}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            {language === 'bn' ? 'নাগরিক সমস্যা ও এলাকাভিত্তিক অভিযোগ' : 'Civic Issue Reporting & Complaints'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl mt-1">
            {language === 'bn'
              ? 'আপনার এলাকার ভাঙা রাস্তা, খোলা ম্যানহোল, ড্রেনেজ বা ময়লা আবর্জনার সমস্যা ছবি ও জিপিএস লোকেশনসহ সিটি কর্পোরেশনকে অবহিত করুন।'
              : 'Report potholes, waterlogging, waste, and streetlight defects directly to zonal engineering teams.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setActiveTab('LIST');
              setSuccessId(null);
            }}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'LIST'
                ? 'bg-[#006A4E] text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {language === 'bn' ? 'আমার অভিযোগ তালিকা' : 'My Complaints'} ({complaints.length})
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('NEW');
              setSuccessId(null);
            }}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'NEW'
                ? 'bg-rose-700 text-white shadow-xs'
                : 'bg-rose-50 text-rose-800 border border-rose-200 hover:bg-rose-100'
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
            <span>{language === 'bn' ? 'নতুন সমস্যা রিপোর্ট' : 'Report Problem'}</span>
          </button>
        </div>
      </div>

      {successId && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl flex items-center justify-between text-xs font-semibold text-emerald-900 animate-in fade-in">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>
              {language === 'bn'
                ? `আপনার নাগরিক অভিযোগটি সফলভাবে দাখিল হয়েছে। ট্র্যাকিং ট্রানজেকশন আইডি: ${successId}`
                : `Grievance report submitted successfully. Tracking Complaint ID: ${successId}`}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setSuccessId(null)}
            className="text-emerald-700 hover:text-emerald-900"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* VIEW 1: NEW COMPLAINT FORM */}
      {activeTab === 'NEW' && (
        <form
          onSubmit={handleSubmitComplaint}
          className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6"
        >
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Camera className="w-4 h-4 text-rose-600" />
              <span>{language === 'bn' ? 'নাগরিক সমস্যার বিস্তারিত বিবরণ' : 'Grievance Problem Details'}</span>
            </h3>
            <span className="text-[11px] text-slate-400">
              {language === 'bn' ? '* চিহ্নিত ঘরগুলো আবশ্যক' : '* Mandatory fields'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Category */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {language === 'bn' ? 'সমস্যার প্রধান খাত *' : 'Problem Category *'}
              </label>
              <select
                value={problemCategory}
                onChange={(e) => setProblemCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#006A4E]"
                required
              >
                <optgroup label={language === 'bn' ? 'সড়ক ও অবকাঠামো' : 'Road & Infrastructure'}>
                  <option value="road_broken">Broken Road / রাস্তা ভাঙা</option>
                  <option value="road_pothole">Pothole on Main Road / রাস্তায় বড় গর্ত</option>
                  <option value="road_footpath">Damaged Footpath / ফুটপাত নষ্ট</option>
                  <option value="road_streetlight">Streetlight Not Working / সড়কবাতি অকেজো</option>
                </optgroup>
                <optgroup label={language === 'bn' ? 'ড্রেনেজ ও পানি নিষ্কাশন' : 'Drainage & Water'}>
                  <option value="drain_clean">Drain Cleaning Required / ড্রেন পরিষ্কার প্রয়োজন</option>
                  <option value="drain_waterlog">Severe Waterlogging / জলাবদ্ধতা</option>
                  <option value="drain_blocked">Blocked Drain / ড্রেন বন্ধ</option>
                </optgroup>
                <optgroup label={language === 'bn' ? 'বর্জ্য ও পরিচ্ছন্নতা' : 'Waste Management'}>
                  <option value="waste_uncollected">Garbage Not Collected / আবর্জনা সরানো হয়নি</option>
                  <option value="waste_dumping">Illegal Waste Dumping / অবৈধ বর্জ্য স্তূপ</option>
                </optgroup>
                <optgroup label={language === 'bn' ? 'জননিরাপত্তা ও পরিবেশ' : 'Public Safety'}>
                  <option value="safety_manhole">Open / Broken Manhole / খোলা বিপজ্জনক ম্যানহোল</option>
                  <option value="safety_mosquito">Mosquito Breeding Hotspot / মশার প্রজননক্ষেত্র</option>
                  <option value="safety_other">Other Civic Issue / অন্যান্য সমস্যা</option>
                </optgroup>
              </select>
            </div>

            {/* Ward */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {language === 'bn' ? 'আওতাধীন ওয়ার্ড নম্বর *' : 'Jurisdiction Ward *'}
              </label>
              <select
                value={wardNumber}
                onChange={(e) => setWardNumber(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#006A4E]"
              >
                {Array.from({ length: 54 }, (_, i) => i + 1).map((w) => (
                  <option key={w} value={w}>
                    {language === 'bn' ? `ওয়ার্ড নং ${w}` : `Ward No ${w}`}
                  </option>
                ))}
              </select>
            </div>

            {/* Problem Title */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {language === 'bn'
                  ? 'সমস্যার সংক্ষিপ্ত শিরোনাম (যেমন: প্রধান সড়কে বড় গর্ত সৃষ্টি হয়েছে) *'
                  : 'Problem Title (e.g. Large Pothole on Main Road) *'}
              </label>
              <input
                type="text"
                value={problemTitle}
                onChange={(e) => setProblemTitle(e.target.value)}
                placeholder={
                  language === 'bn'
                    ? 'যেমন: প্রধান সড়কের সংযোগস্থলে ঝুঁকিপূর্ণ গর্ত ও ড্রেন ক্ষতিগ্রস্ত'
                    : 'e.g. Severe pothole and broken drain near main intersection'
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#006A4E]"
                required
              />
            </div>

            {/* Description */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {language === 'bn' ? 'সমস্যার বিস্তারিত বিবরণ *' : 'Detailed Problem Description *'}
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={
                  language === 'bn'
                    ? 'সড়কের বিভিন্ন স্থানে বড় গর্ত তৈরি হয়েছে। এতে যানবাহন ও পথচারীদের চলাচলে সমস্যা এবং দুর্ঘটনার ঝুঁকি তৈরি হচ্ছে...'
                    : 'Provide full details of the civic issue, affected area, and hazards caused...'
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#006A4E]"
                required
              />
            </div>

            {/* Optional Suggested Solution */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                <span>
                  {language === 'bn'
                    ? 'সম্ভাব্য সমাধান (নাগরিকের পরামর্শ — ঐচ্ছিক)'
                    : 'Suggested Solution (Optional Citizen Proposal)'}
                </span>
              </label>
              <input
                type="text"
                value={suggestedSolution}
                onChange={(e) => setSuggestedSolution(e.target.value)}
                placeholder={
                  language === 'bn'
                    ? 'যেমন: ক্ষতিগ্রস্ত সড়কটি মেরামত করা এবং আশপাশের পানি নিষ্কাশনের ড্রেন সংস্কার করা'
                    : 'e.g. Repair damaged road surface and reconstruct stormwater drainage slab'
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#006A4E] bg-slate-50/60"
              />
            </div>

            {/* Location & GPS */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {language === 'bn' ? 'সঠিক সড়ক / এলাকা / ল্যান্ডমার্ক *' : 'Street / Landmark Address *'}
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={locationAddress}
                  onChange={(e) => setLocationAddress(e.target.value)}
                  placeholder={language === 'bn' ? 'রোড ৯/এ, সিটি ব্যাংক ভবনের বিপরীতে' : 'Road 9/A, Opp City Bank'}
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#006A4E]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {language === 'bn' ? 'জিপিএস স্থানাঙ্ক (স্বয়ংক্রিয়)' : 'GPS Coordinates (Auto)'}
              </label>
              <input
                type="text"
                value={coordinates}
                onChange={(e) => setCoordinates(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-mono bg-slate-50 focus:outline-none"
              />
            </div>

            {/* Photo Upload with Preview & Remove */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {language === 'bn' ? 'সমস্যার বাস্তব ছবি আপলোড (ঐচ্ছিক কিন্তু সুপারিশকৃত)' : 'Problem Photograph Upload (Recommended)'}
              </label>
              {selectedPhoto ? (
                <div className="relative inline-block border-2 border-emerald-500 rounded-xl overflow-hidden p-1 bg-slate-50">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={selectedPhoto} alt="Problem Preview" className="w-48 h-32 object-cover rounded-lg" />
                  <button
                    type="button"
                    onClick={() => setSelectedPhoto(null)}
                    className="absolute top-2 right-2 p-1 bg-rose-600 hover:bg-rose-700 text-white rounded-full shadow-md cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <label className="border-2 border-dashed border-slate-300 hover:border-[#006A4E] rounded-xl p-5 flex flex-col items-center justify-center cursor-pointer transition-colors bg-slate-50/50">
                  <UploadCloud className="w-8 h-8 text-slate-400 mb-1" />
                  <span className="text-xs font-semibold text-slate-700">
                    {language === 'bn' ? 'ছবি নির্বাচন করতে ক্লিক করুন' : 'Click to upload picture'}
                  </span>
                  <span className="text-[11px] text-slate-400 mt-0.5">JPG, PNG, WebP (Max 5MB)</span>
                  <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                </label>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setActiveTab('LIST')}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
            >
              {language === 'bn' ? 'বাতিল করুন' : 'Cancel'}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-rose-700 hover:bg-rose-800 disabled:opacity-60 text-white font-bold text-xs shadow-md flex items-center gap-2 cursor-pointer transition-colors"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? (language === 'bn' ? 'দাখিল হচ্ছে...' : 'Submitting...') : (language === 'bn' ? 'রিপোর্ট দাখিল করুন' : 'Submit Report')}</span>
            </button>
          </div>
        </form>
      )}

      {/* VIEW 2: COMPLAINTS LIST & TRACKING */}
      {activeTab === 'LIST' && (
        <div className="space-y-4">
          {complaints.map((cmp) => (
            <div
              key={cmp.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4 hover:border-slate-300 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                    {cmp.id}
                  </span>
                  <span className="text-xs font-semibold text-slate-500">
                    {cmp.category[language]} · Ward {cmp.wardNumber}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">{cmp.submittedAt}</span>
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                      cmp.status === 'RESOLVED'
                        ? 'bg-emerald-100 text-[#006A4E]'
                        : cmp.status === 'IN_PROGRESS'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {cmp.statusLabel[language]}
                  </span>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-5">
                {cmp.photoUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={cmp.photoUrl}
                    alt={cmp.title[language]}
                    className="w-full md:w-48 h-32 object-cover rounded-xl border border-slate-200 shrink-0"
                  />
                )}
                <div className="space-y-2 flex-1">
                  <h3 className="text-base font-bold text-slate-900 leading-snug">
                    {cmp.title[language]}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{cmp.description[language]}</p>

                  {cmp.suggestedSolution && (
                    <div className="p-2.5 bg-amber-50/60 rounded-xl border border-amber-200/80 text-xs text-amber-900 flex items-start gap-2">
                      <Lightbulb className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                      <p>
                        <span className="font-bold">{language === 'bn' ? 'নাগরিক প্রস্তাবিত সমাধান: ' : 'Citizen Proposal: '}</span>
                        {cmp.suggestedSolution[language]}
                      </p>
                    </div>
                  )}

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                    <span className="flex items-center gap-1 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {cmp.location}
                    </span>
                    {cmp.assignedDept && (
                      <span className="flex items-center gap-1 font-medium text-emerald-800">
                        <Building2 className="w-3.5 h-3.5" />
                        {cmp.assignedDept[language]}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Officer Remarks / Progress Tracker */}
              {cmp.officerRemarks && (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                  <div className="flex items-center justify-between text-slate-500 font-semibold text-[11px]">
                    <span className="flex items-center gap-1 text-[#006A4E]">
                      <ShieldAlert className="w-3.5 h-3.5" />
                      {language === 'bn' ? 'সিটি কর্পোরেশন কর্মকর্তা আপডেট' : 'City Corporation Official Update'}
                    </span>
                    {cmp.resolvedAt && (
                      <span className="text-emerald-700 font-bold">
                        {language === 'bn' ? `নিষ্পত্তি: ${cmp.resolvedAt}` : `Resolved on: ${cmp.resolvedAt}`}
                      </span>
                    )}
                  </div>
                  <p className="text-slate-700 leading-relaxed">{cmp.officerRemarks[language]}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
