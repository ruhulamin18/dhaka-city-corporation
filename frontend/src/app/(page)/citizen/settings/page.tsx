'use client';

import React, { useEffect, useState } from 'react';
import {
  Settings,
  Shield,
  Bell,
  Lock,
  Globe,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Save,
  Laptop,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
import { mockApi } from '@/services/mockApi';

export default function CitizenSettingsPage() {
  const { language, setLanguage } = useApp();
  const { user } = useAuth();

  // Notification toggles
  const [smsAppUpdates, setSmsAppUpdates] = useState(true);
  const [emailTaxReminders, setEmailTaxReminders] = useState(true);
  const [complaintAlerts, setComplaintAlerts] = useState(true);
  const [newsletterUpdates, setNewsletterUpdates] = useState(false);

  // Security Form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  // Save Preferences
  const [settingsSaved, setSettingsSaved] = useState(false);
  const [settingsError, setSettingsError] = useState('');

  useEffect(() => {
    if (!user) return;
    let active = true;
    queueMicrotask(() => {
      if (!active) return;
      try {
        const saved = localStorage.getItem(`dscc_citizen_settings_${user.id}`);
        if (!saved) return;
        const preferences = JSON.parse(saved) as {
          smsAppUpdates?: boolean;
          emailTaxReminders?: boolean;
          complaintAlerts?: boolean;
          newsletterUpdates?: boolean;
        };
        setSmsAppUpdates(preferences.smsAppUpdates ?? true);
        setEmailTaxReminders(preferences.emailTaxReminders ?? true);
        setComplaintAlerts(preferences.complaintAlerts ?? true);
        setNewsletterUpdates(preferences.newsletterUpdates ?? false);
      } catch (error) {
        setSettingsError(error instanceof Error
          ? error.message
          : language === 'bn' ? 'পছন্দের সেটিংস লোড করা যায়নি।' : 'Unable to load preferences.');
      }
    });
    return () => {
      active = false;
    };
  }, [user, language]);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess(false);

    if (newPassword.length < 6) {
      setPasswordError(
        language === 'bn'
          ? 'নতুন পাসওয়ার্ড ন্যূনতম ৬ অক্ষরের হতে হবে।'
          : 'New password must be at least 6 characters.'
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError(
        language === 'bn'
          ? 'নতুন পাসওয়ার্ড দুটি মিলছে না।'
          : 'New passwords do not match.'
      );
      return;
    }

    if (newPassword === currentPassword) {
      setPasswordError(language === 'bn'
        ? 'নতুন পাসওয়ার্ডটি বর্তমান পাসওয়ার্ড থেকে আলাদা হতে হবে।'
        : 'The new password must be different from the current password.');
      return;
    }
    if (!user) return;

    try {
      const changed = await mockApi.changeCitizenPassword(user.id, currentPassword, newPassword);
      if (!changed) {
        setPasswordError(language === 'bn'
          ? 'বর্তমান পাসওয়ার্ড সঠিক নয়।'
          : 'The current password is incorrect.');
        return;
      }
      setPasswordSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      window.setTimeout(() => setPasswordSuccess(false), 4000);
    } catch (error) {
      setPasswordError(error instanceof Error
        ? error.message
        : language === 'bn' ? 'পাসওয়ার্ড পরিবর্তন করা যায়নি।' : 'Unable to update the password.');
    }
  };

  const handleSavePreferences = () => {
    if (!user) return;
    setSettingsError('');
    try {
      localStorage.setItem(`dscc_citizen_settings_${user.id}`, JSON.stringify({
        smsAppUpdates,
        emailTaxReminders,
        complaintAlerts,
        newsletterUpdates,
      }));
      setSettingsSaved(true);
      window.setTimeout(() => setSettingsSaved(false), 3000);
    } catch (error) {
      setSettingsError(error instanceof Error
        ? error.message
        : language === 'bn' ? 'পছন্দসমূহ সংরক্ষণ করা যায়নি।' : 'Unable to save preferences.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-[#ECFDF5] text-[#006A4E] text-xs font-semibold uppercase tracking-wider mb-2">
              <Settings className="w-3.5 h-3.5" />
              {language === 'bn' ? 'অ্যাকাউন্ট ও নিরাপত্তা' : 'Account & Security'}
            </div>
            <h1 className="text-2xl font-bold text-slate-900">
              {language === 'bn' ? 'নাগরিক অ্যাকাউন্ট সেটিংস' : 'Citizen Account Settings'}
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              {language === 'bn'
                ? 'পাসওয়ার্ড পরিবর্তন, নোটিফিকেশন অগ্রাধিকার ও নিরাপত্তা নিয়ন্ত্রণ পরিচালনা করুন।'
                : 'Manage security credentials, notification preferences, and privacy controls.'}
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-600 bg-slate-50 px-3 py-2 rounded-lg border border-slate-200">
            <Shield className="w-4 h-4 text-[#006A4E]" />
            <span>
              {language === 'bn' ? 'জাতীয় পরিচয়পত্র যাচাইকৃত' : 'NID Verified Account'}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Security / Password Column */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
              <Lock className="w-5 h-5 text-[#006A4E]" />
              <h2 className="text-lg font-bold text-slate-900">
                {language === 'bn' ? 'পাসওয়ার্ড পরিবর্তন' : 'Change Password'}
              </h2>
            </div>

            {passwordSuccess && (
              <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-2 text-emerald-800 text-sm">
                <CheckCircle2 className="w-4 h-4 text-[#006A4E] shrink-0" />
                <span>
                  {language === 'bn'
                    ? 'পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে।'
                    : 'Password updated successfully.'}
                </span>
              </div>
            )}

            {passwordError && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-center gap-2 text-rose-800 text-sm">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{passwordError}</span>
              </div>
            )}

            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label htmlFor="current-password" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  {language === 'bn' ? 'বর্তমান পাসওয়ার্ড' : 'Current Password'}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="current-password"
                    autoComplete="current-password"
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006A4E]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword
                      ? language === 'bn' ? 'পাসওয়ার্ড লুকান' : 'Hide password'
                      : language === 'bn' ? 'পাসওয়ার্ড দেখান' : 'Show password'}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="new-password" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  {language === 'bn' ? 'নতুন পাসওয়ার্ড' : 'New Password'}
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="new-password"
                  autoComplete="new-password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006A4E]"
                />
              </div>

              <div>
                <label htmlFor="confirm-password" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  {language === 'bn' ? 'নতুন পাসওয়ার্ড নিশ্চিত করুন' : 'Confirm New Password'}
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="confirm-password"
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006A4E]"
                />
              </div>

              <button
                type="submit"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#006A4E] text-white text-sm font-semibold rounded-lg hover:bg-[#00523c] transition shadow-sm"
              >
                <Lock className="w-4 h-4" />
                {language === 'bn' ? 'পাসওয়ার্ড আপডেট করুন' : 'Update Password'}
              </button>
            </form>
          </div>

          {/* Active Sessions */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
              <Laptop className="w-5 h-5 text-[#006A4E]" />
              <h2 className="text-lg font-bold text-slate-900">
                {language === 'bn' ? 'সক্রিয় লগইন সেশন' : 'Active Login Sessions'}
              </h2>
            </div>

            <div className="space-y-3">
              <div className="flex items-start justify-between p-3.5 bg-slate-50 rounded-lg border border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-md bg-emerald-100 text-[#006A4E] flex items-center justify-center font-bold">
                    <Laptop className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-800">
                      {language === 'bn' ? 'এই ডিভাইস · বর্তমান সেশন' : 'This device · Current session'}
                    </div>
                    <div className="text-xs text-slate-500">
                      {language === 'bn' ? 'আপনি এই ডিভাইস থেকে লগ ইন করেছেন।' : 'You are signed in on this device.'}
                    </div>
                  </div>
                </div>
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {language === 'bn' ? 'সক্রিয়' : 'Active'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Notifications & Preferences Column */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
              <Bell className="w-5 h-5 text-[#006A4E]" />
              <h2 className="text-lg font-bold text-slate-900">
                {language === 'bn' ? 'বিজ্ঞপ্তি ও নোটিফিকেশন সেটিংস' : 'Notification Preferences'}
              </h2>
            </div>

            {settingsError && <p role="alert" className="mb-4 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800">{settingsError}</p>}

            {settingsSaved && (
              <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-2 text-emerald-800 text-sm">
                <CheckCircle2 className="w-4 h-4 text-[#006A4E] shrink-0" />
                <span>
                  {language === 'bn'
                    ? 'পছন্দসমূহ সফলভাবে সংরক্ষিত হয়েছে।'
                    : 'Preferences saved successfully.'}
                </span>
              </div>
            )}

            <div className="space-y-4">
              <label className="flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition cursor-pointer">
                <div>
                  <div className="text-sm font-semibold text-slate-800">
                    {language === 'bn' ? 'এসএমএস সতর্কবার্তা (আবেদনের অগ্রগতি)' : 'SMS Application Alerts'}
                  </div>
                  <div className="text-xs text-slate-500">
                    {language === 'bn'
                      ? 'যাচাইকরণ, অনুমোদন ও সার্টিফিকেট প্রস্তুত হলে সাথে সাথে মোবাইল এসএমএস'
                      : 'Receive instant SMS when application is approved or certificate issued'}
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={smsAppUpdates}
                  onChange={(e) => setSmsAppUpdates(e.target.checked)}
                  className="w-4 h-4 text-[#006A4E] rounded border-slate-300 focus:ring-[#006A4E]"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition cursor-pointer">
                <div>
                  <div className="text-sm font-semibold text-slate-800">
                    {language === 'bn' ? 'ইমেইল ট্যাক্স রিমাইন্ডার' : 'Email Tax Reminders'}
                  </div>
                  <div className="text-xs text-slate-500">
                    {language === 'bn'
                      ? 'হোল্ডিং ট্যাক্স রিবেট শেষ তারিখ ও বার্ষিক বিলিং নোটিশ'
                      : 'Notices for holding tax rebate deadlines and annual billing'}
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={emailTaxReminders}
                  onChange={(e) => setEmailTaxReminders(e.target.checked)}
                  className="w-4 h-4 text-[#006A4E] rounded border-slate-300 focus:ring-[#006A4E]"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition cursor-pointer">
                <div>
                  <div className="text-sm font-semibold text-slate-800">
                    {language === 'bn' ? 'অভিযোগ নিষ্পত্তির আপডেট' : 'Civic Issue Resolution Updates'}
                  </div>
                  <div className="text-xs text-slate-500">
                    {language === 'bn'
                      ? 'পরিদর্শক দল নিযুক্ত ও সমস্যা সমাধানের ছবিসহ বিজ্ঞপ্তি'
                      : 'Status alerts when municipal inspection team updates progress'}
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={complaintAlerts}
                  onChange={(e) => setComplaintAlerts(e.target.checked)}
                  className="w-4 h-4 text-[#006A4E] rounded border-slate-300 focus:ring-[#006A4E]"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition cursor-pointer">
                <div>
                  <div className="text-sm font-semibold text-slate-800">
                    {language === 'bn' ? 'ওয়ার্ড ও সিটি কর্পোরেশন নোটিশ' : 'City Announcements & Bulletins'}
                  </div>
                  <div className="text-xs text-slate-500">
                    {language === 'bn'
                      ? 'জরুরি ডেঙ্গু নিয়ন্ত্রণ, ড্রেনেজ বা ওয়ার্ড উন্নয়ন বিষয়ক ঘোষণা'
                      : 'Municipal public announcements and development news'}
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={newsletterUpdates}
                  onChange={(e) => setNewsletterUpdates(e.target.checked)}
                  className="w-4 h-4 text-[#006A4E] rounded border-slate-300 focus:ring-[#006A4E]"
                />
              </label>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={handleSavePreferences}
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#006A4E] text-white text-sm font-semibold rounded-lg hover:bg-[#00523c] transition shadow-sm"
              >
                <Save className="w-4 h-4" />
                {language === 'bn' ? 'পছন্দসমূহ সংরক্ষণ করুন' : 'Save Preferences'}
              </button>
            </div>
          </div>

          {/* Language Preference */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
              <Globe className="w-5 h-5 text-[#006A4E]" />
              <h2 className="text-lg font-bold text-slate-900">
                {language === 'bn' ? 'পছন্দের ভাষা' : 'Preferred Language'}
              </h2>
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setLanguage('bn')}
                className={`flex-1 py-3 px-4 rounded-lg border text-center transition font-semibold ${
                  language === 'bn'
                    ? 'border-[#006A4E] bg-emerald-50 text-[#006A4E]'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                বাংলা (Bengali)
              </button>
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`flex-1 py-3 px-4 rounded-lg border text-center transition font-semibold ${
                  language === 'en'
                    ? 'border-[#006A4E] bg-emerald-50 text-[#006A4E]'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                English
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
