'use client';

import React, { useEffect, useState } from 'react';
import { useApp } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
import {
  User,
  ShieldCheck,
  Mail,
  Phone,
  Save,
  CheckCircle2,
  Lock,
} from 'lucide-react';

export default function CitizenProfilePage() {
  const { language } = useApp();
  const { user, updateCitizenAccount } = useAuth();

  const [name, setName] = useState('');
  const [nameBn, setNameBn] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [wardNumber, setWardNumber] = useState<number>(27);
  const [presentAddress, setPresentAddress] = useState('');
  const [permanentAddress, setPermanentAddress] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  useEffect(() => {
    if (!user) return;
    let active = true;
    queueMicrotask(() => {
      if (!active) return;
      setName(user.nameEn);
      setNameBn(user.nameBn);
      setEmail(user.email ?? '');
      setPhone(user.phone ?? '');
      setWardNumber(user.wardNumber ?? 27);
      try {
        const saved = localStorage.getItem(`dscc_citizen_profile_${user.id}`);
        if (saved) {
          const details = JSON.parse(saved) as { presentAddress?: string; permanentAddress?: string };
          setPresentAddress(details.presentAddress ?? '');
          setPermanentAddress(details.permanentAddress ?? '');
        }
      } catch (error) {
        setSaveError(error instanceof Error ? error.message : 'Unable to load saved profile details.');
      }
    });
    return () => {
      active = false;
    };
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSaving(true);
    setSaveError('');
    try {
      localStorage.setItem(`dscc_citizen_profile_${user.id}`, JSON.stringify({
        presentAddress,
        permanentAddress,
      }));
      const updated = await updateCitizenAccount({
        nameEn: name.trim(),
        nameBn: nameBn.trim(),
        email: email.trim(),
        phone: phone.trim(),
        wardNumber,
      });
      if (!updated) throw new Error('Unable to update the citizen account.');
      setIsSaved(true);
      window.setTimeout(() => setIsSaved(false), 3000);
    } catch (error) {
      setSaveError(error instanceof Error
        ? error.message
        : language === 'bn' ? 'প্রোফাইল সংরক্ষণ করা যায়নি।' : 'Unable to save profile changes.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Profile Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
        <div className="w-20 h-20 rounded-2xl bg-[#006A4E] text-white flex items-center justify-center font-bold text-3xl shadow-sm shrink-0">
          {(language === 'bn' ? nameBn : name).charAt(0) || '•'}
        </div>
        <div className="flex-1 text-center sm:text-left space-y-1.5">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              {language === 'bn' ? nameBn : name}
            </h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-[#006A4E]">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'যাচাইকৃত নাগরিক' : 'Verified Resident'}</span>
            </span>
          </div>
          <p className="text-xs text-slate-500">
            {language === 'bn'
              ? `ঢাকা দক্ষিণ সিটি কর্পোরেশন · ওয়ার্ড নং ${wardNumber} (ধানমন্ডি এলাকা)`
              : `Dhaka City Corporation · Ward No ${wardNumber} (Dhanmondi Zone)`}
          </p>
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-600 pt-1">
            <span className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              {email}
            </span>
            <span className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-slate-400" />
              {phone}
            </span>
          </div>
        </div>
      </div>

      {isSaved && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl text-xs font-semibold text-emerald-800 flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            {language === 'bn'
              ? 'আপনার প্রোফাইলের তথ্য সফলভাবে সংরক্ষিত হয়েছে।'
              : 'Your profile changes have been saved successfully.'}
          </span>
        </div>
      )}
      {saveError && <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800">{saveError}</p>}

      {/* Profile Form */}
      <form onSubmit={handleSave} className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <User className="w-4 h-4 text-[#006A4E]" />
            <span>{language === 'bn' ? 'ব্যক্তিগত ও যোগাযোগ তথ্য' : 'Personal & Contact Information'}</span>
          </h2>
          <span className="text-[11px] text-slate-400">
            {language === 'bn' ? '* চিহ্নিত তথ্য পরিবর্তনযোগ্য' : '* Editable fields'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="profile-name-en" className="block text-xs font-semibold text-slate-700 mb-1">
              {language === 'bn' ? 'পূর্ণ নাম (ইংরেজি) *' : 'Full Name (English) *'}
            </label>
            <input
              type="text"
              id="profile-name-en"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#006A4E]"
              required
            />
          </div>

          <div>
            <label htmlFor="profile-name-bn" className="block text-xs font-semibold text-slate-700 mb-1">
              {language === 'bn' ? 'পূর্ণ নাম (বাংলা) *' : 'Full Name (Bangla) *'}
            </label>
            <input
              type="text"
              id="profile-name-bn"
              value={nameBn}
              onChange={(e) => setNameBn(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#006A4E]"
              required
            />
          </div>

          <div>
            <label htmlFor="profile-email" className="block text-xs font-semibold text-slate-700 mb-1">
              {language === 'bn' ? 'ইমেইল ঠিকানা' : 'Email Address'}
            </label>
            <input
              type="email"
              id="profile-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#006A4E]"
            />
          </div>

          <div>
            <label htmlFor="profile-phone" className="block text-xs font-semibold text-slate-700 mb-1">
              {language === 'bn' ? 'মোবাইল নম্বর *' : 'Mobile Number *'}
            </label>
            <input
              type="tel"
              id="profile-phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#006A4E]"
              required
            />
          </div>

          {/* Locked Government Verified Field */}
          <div>
            <label htmlFor="profile-nid" className="block text-xs font-semibold text-slate-500 mb-1 flex items-center justify-between">
              <span>{language === 'bn' ? 'জাতীয় পরিচয়পত্র নম্বর (NID)' : 'National ID (NID)'}</span>
              <span className="text-[10px] text-slate-400 flex items-center gap-0.5">
                <Lock className="w-3 h-3" /> {language === 'bn' ? 'সুরক্ষিত' : 'Locked'}
              </span>
            </label>
            <input
              id="profile-nid"
              type="text"
              value={user?.nid ?? ''}
              readOnly
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-100 font-mono text-sm text-slate-600 cursor-not-allowed"
            />
          </div>

          <div>
            <label htmlFor="profile-ward" className="block text-xs font-semibold text-slate-700 mb-1">
              {language === 'bn' ? 'আওতাধীন ওয়ার্ড নম্বর *' : 'Assigned Ward *'}
            </label>
            <select
              id="profile-ward"
              value={wardNumber}
              onChange={(e) => setWardNumber(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#006A4E]"
            >
              {Array.from({ length: 54 }, (_, i) => i + 1).map((w) => (
                <option key={w} value={w}>
                  {language === 'bn' ? `ওয়ার্ড নং ${w}` : `Ward No ${w}`}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="profile-present-address" className="block text-xs font-semibold text-slate-700 mb-1">
              {language === 'bn' ? 'বর্তমান ঠিকানা *' : 'Present Address *'}
            </label>
            <input
              type="text"
              id="profile-present-address"
              value={presentAddress}
              onChange={(e) => setPresentAddress(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#006A4E]"
              required
            />
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="profile-permanent-address" className="block text-xs font-semibold text-slate-700 mb-1">
              {language === 'bn' ? 'স্থায়ী ঠিকানা' : 'Permanent Address'}
            </label>
            <input
              type="text"
              id="profile-permanent-address"
              value={permanentAddress}
              onChange={(e) => setPermanentAddress(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#006A4E]"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2.5 rounded-xl bg-[#006A4E] hover:bg-[#00523C] disabled:opacity-60 text-white text-xs font-bold transition-colors shadow-md flex items-center gap-1.5 cursor-pointer"
          >
            <Save className="w-4 h-4" />
          <span>{isSaving
            ? language === 'bn' ? 'সংরক্ষণ হচ্ছে...' : 'Saving...'
            : language === 'bn' ? 'পরিবর্তন সংরক্ষণ করুন' : 'Save Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
