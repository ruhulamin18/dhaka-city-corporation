'use client';

import React, { useMemo, useState } from 'react';
import { CheckCircle2, Mail, Phone, PhoneCall, Send } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { AboutPageLayout } from '@/components/about/AboutPageLayout';
import { SearchFilterBar } from '@/components/about/SearchFilterBar';
import { EmptyState } from '@/components/common/EmptyState';
import { EMERGENCY_HELPLINES, OFFICIAL_CONTACTS_LIST } from '@/data/aboutData';
import { pickLang } from '@/types/about';

export default function AboutContactPage() {
  const { language } = useApp();

  // Directory Filter State
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');

  // Contact Form State
  const [senderName, setSenderName] = useState('');
  const [senderContact, setSenderContact] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);

  const filteredContacts = useMemo(() => {
    const q = query.trim().toLowerCase();
    return OFFICIAL_CONTACTS_LIST.filter((item) => {
      if (category !== 'all' && item.category !== category) return false;
      if (!q) return true;
      return (
        item.officeName.en.toLowerCase().includes(q) ||
        item.officeName.bn.toLowerCase().includes(q) ||
        item.officerTitle.en.toLowerCase().includes(q) ||
        item.officerTitle.bn.toLowerCase().includes(q) ||
        item.phone.includes(q) ||
        item.email.toLowerCase().includes(q)
      );
    });
  }, [query, category]);

  const hasActiveFilters = query.trim().length > 0 || category !== 'all';

  const handleSubmitMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!senderName.trim() || !senderContact.trim() || !message.trim()) return;
    const refCode = `MSG-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    setSubmittedRef(refCode);
    setSenderName('');
    setSenderContact('');
    setSubject('');
    setMessage('');
  };

  return (
    <AboutPageLayout activeSlug="contact">
      {/* Top Emergency Helpline Strip */}
      <section aria-labelledby="emergency-helpline-heading" className="space-y-3.5">
        <div className="flex items-center justify-between gap-4">
          <h2 id="emergency-helpline-heading" className="text-lg sm:text-xl font-bold text-[#111827]">
            {language === 'bn' ? 'জরুরি হেল্পলাইন ও হটলাইন নম্বর' : 'Emergency & Civic Helplines'}
          </h2>
          <span className="text-xs font-semibold text-[#C81E1E]">
            {language === 'bn' ? 'সরাসরি কল করতে নম্বরে ক্লিক করুন' : 'Tap any helpline to dial'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {EMERGENCY_HELPLINES.map((item) => {
            const isCrimson = item.accent === 'crimson';
            return (
              <a
                key={item.id}
                href={`tel:${item.code.replace(/[^+\d]/g, '')}`}
                className={`civic-card rounded-xl border p-4 flex flex-col justify-between gap-2.5 transition-colors ${
                  isCrimson
                    ? 'bg-[#FEF2F2]/70 border-red-200 hover:border-[#C81E1E]'
                    : 'bg-[#ECFDF5]/70 border-emerald-200 hover:border-[#006A4E]'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`text-xs font-semibold ${
                      isCrimson ? 'text-[#C81E1E]' : 'text-[#006A4E]'
                    }`}
                  >
                    {pickLang(item.availability, language)}
                  </span>
                  <PhoneCall
                    className={`w-4 h-4 shrink-0 ${
                      isCrimson ? 'text-[#C81E1E]' : 'text-[#006A4E]'
                    }`}
                    aria-hidden="true"
                  />
                </div>
                <div>
                  <p
                    className={`text-xl font-extrabold font-mono tabular-nums ${
                      isCrimson ? 'text-[#C81E1E]' : 'text-[#006A4E]'
                    }`}
                  >
                    {item.code}
                  </p>
                  <p className="text-xs font-bold text-[#111827] mt-1">
                    {pickLang(item.title, language)}
                  </p>
                  <p className="text-[11px] text-[#4B5563] mt-0.5 leading-snug">
                    {pickLang(item.description, language)}
                  </p>
                </div>
              </a>
            );
          })}
        </div>
      </section>

      {/* Main Grid: Contact Directory (7 cols) + Send Us a Message Form (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Official Contact Directory */}
        <section aria-labelledby="official-directory-heading" className="lg:col-span-7 space-y-4">
          <h2 id="official-directory-heading" className="text-lg sm:text-xl font-bold text-[#111827]">
            {language === 'bn' ? 'দপ্তরভিত্তিক যোগাযোগ ডিরেক্টরি' : 'Official Contact Directory'}
          </h2>

          <SearchFilterBar
            searchValue={query}
            onSearchChange={setQuery}
            searchPlaceholder={
              language === 'bn'
                ? 'দপ্তরের নাম, ফোন বা ইমেইল খুঁজুন...'
                : 'Search office name, desk, phone, or email...'
            }
            searchAriaLabel={
              language === 'bn' ? 'দপ্তর যোগাযোগ অনুসন্ধান' : 'Search official contacts'
            }
            filters={[
              {
                id: 'contact-category-filter',
                label: language === 'bn' ? 'দপ্তরের ধরন' : 'Office Category',
                value: category,
                onChange: setCategory,
                options: [
                  { value: 'all', label: language === 'bn' ? 'সকল দপ্তর' : 'All Offices' },
                  { value: 'headquarters', label: language === 'bn' ? 'নগর ভবন (প্রধান)' : 'Headquarters' },
                  { value: 'revenue', label: language === 'bn' ? 'রাজস্ব ও লাইসেন্স' : 'Revenue & License' },
                  { value: 'engineering', label: language === 'bn' ? 'প্রকৌশল ও বর্জ্য' : 'Engineering & Waste' },
                  { value: 'health', label: language === 'bn' ? 'স্বাস্থ্য ও নিবন্ধন' : 'Health & Registration' },
                  { value: 'zonal', label: language === 'bn' ? 'আঞ্চলিক কার্যালয়' : 'Zonal Offices' },
                ],
              },
            ]}
            resultCountText={
              language === 'bn'
                ? `${filteredContacts.length}টি দপ্তর পাওয়া গেছে`
                : `Showing ${filteredContacts.length} of ${OFFICIAL_CONTACTS_LIST.length} desks`
            }
            hasActiveFilters={hasActiveFilters}
            resetLabel={language === 'bn' ? 'রিসেট' : 'Reset'}
            onReset={() => {
              setQuery('');
              setCategory('all');
            }}
          />

          {filteredContacts.length === 0 ? (
            <EmptyState
              message={
                language === 'bn'
                  ? 'আপনার অনুসন্ধানের সাথে মিলে যায় এমন কোনো দপ্তর পাওয়া যায়নি।'
                  : 'No official desks match your search query.'
              }
            />
          ) : (
            <div className="civic-card bg-white rounded-xl border border-[#E2E8F0] divide-y divide-slate-100 overflow-hidden">
              {filteredContacts.map((item) => (
                <div
                  key={item.id}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#F8FAFC] transition-colors"
                >
                  <div className="space-y-0.5 min-w-0">
                    <p className="text-xs font-semibold text-[#006A4E]">
                      {pickLang(item.categoryLabel, language)}
                      <span className="mx-1.5 text-slate-300" aria-hidden="true">
                        ·
                      </span>
                      {pickLang(item.roomOrFloor, language)}
                    </p>
                    <h3 className="text-sm sm:text-base font-bold text-[#111827]">
                      {pickLang(item.officeName, language)}
                    </h3>
                    <p className="text-xs text-[#4B5563]">{pickLang(item.officerTitle, language)}</p>
                  </div>

                  <div className="flex flex-wrap sm:flex-col items-start sm:items-end gap-1.5 shrink-0 text-xs">
                    <a
                      href={`tel:${item.phone.replace(/[^+\d]/g, '')}`}
                      className="inline-flex items-center gap-1.5 font-mono font-bold text-[#006A4E] hover:underline tabular-nums"
                    >
                      <Phone className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>{item.phone}</span>
                    </a>
                    <a
                      href={`mailto:${item.email}`}
                      className="inline-flex items-center gap-1.5 text-[#4B5563] hover:text-[#006A4E]"
                    >
                      <Mail className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>{item.email}</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Send Us a Message Form */}
        <section aria-labelledby="send-message-heading" className="lg:col-span-5">
          <div className="civic-card bg-white rounded-xl border border-[#E2E8F0] p-6 space-y-5">
            <div>
              <p className="text-xs font-semibold text-[#006A4E]">
                {language === 'bn' ? 'নাগরিক তথ্য ও মতামত ডেস্ক' : 'Citizen Inquiry & Feedback Desk'}
              </p>
              <h2 id="send-message-heading" className="text-xl font-bold text-[#111827] mt-0.5">
                {language === 'bn' ? 'আমাদের বার্তা পাঠান' : 'Send Us a Message'}
              </h2>
              <p className="text-xs text-[#4B5563] mt-1">
                {language === 'bn'
                  ? 'যেকোনো সাধারণ জিজ্ঞাসা, পরামর্শ বা সেবাবিষয়ক তথ্যের জন্য নিচের ফর্মটি পূরণ করুন।'
                  : 'Submit general inquiries, suggestions, or document assistance requests to our citizen helpdesk.'}
              </p>
            </div>

            {submittedRef && (
              <div
                role="status"
                aria-live="polite"
                className="rounded-xl bg-[#ECFDF5] border border-emerald-200 p-4 flex items-start gap-3 text-xs text-[#111827]"
              >
                <CheckCircle2 className="w-4 h-4 text-[#006A4E] shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <p className="font-bold text-[#006A4E]">
                    {language === 'bn'
                      ? 'আপনার বার্তা সফলভাবে গৃহীত হয়েছে!'
                      : 'Your message has been received!'}
                  </p>
                  <p className="text-[#4B5563] mt-0.5">
                    {language === 'bn'
                      ? `ট্র্যাকিং নম্বর: ${submittedRef}। সংশ্লিষ্ট ডেস্ক ২ কর্মদিবসের মধ্যে যোগাযোগ করবে।`
                      : `Reference ID: ${submittedRef}. Our helpdesk team will respond within 2 working days.`}
                  </p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmitMessage} className="space-y-4">
              <div>
                <label htmlFor="contact-name" className="block text-xs font-semibold text-[#111827] mb-1">
                  {language === 'bn' ? 'আপনার পূর্ণ নাম *' : 'Your Full Name *'}
                </label>
                <input
                  id="contact-name"
                  type="text"
                  required
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  placeholder={language === 'bn' ? 'যেমন: তানভীর আহমেদ' : 'e.g. Tanvir Ahmed'}
                  className="w-full px-3.5 py-2.5 text-sm bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#006A4E]"
                />
              </div>

              <div>
                <label htmlFor="contact-phone-email" className="block text-xs font-semibold text-[#111827] mb-1">
                  {language === 'bn' ? 'মোবাইল নম্বর অথবা ইমেইল *' : 'Mobile Number or Email *'}
                </label>
                <input
                  id="contact-phone-email"
                  type="text"
                  required
                  value={senderContact}
                  onChange={(e) => setSenderContact(e.target.value)}
                  placeholder={language === 'bn' ? '017XXXXXXXX বা email@example.com' : '017XXXXXXXX or email@example.com'}
                  className="w-full px-3.5 py-2.5 text-sm bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#006A4E]"
                />
              </div>

              <div>
                <label htmlFor="contact-subject" className="block text-xs font-semibold text-[#111827] mb-1">
                  {language === 'bn' ? 'বিষয়' : 'Subject'}
                </label>
                <input
                  id="contact-subject"
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder={
                    language === 'bn'
                      ? 'যেমন: হোল্ডিং ট্যাক্স বা ওয়ার্ড সেবা সম্পর্কিত'
                      : 'e.g. Holding tax assessment or ward office inquiry'
                  }
                  className="w-full px-3.5 py-2.5 text-sm bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#006A4E]"
                />
              </div>

              <div>
                <label htmlFor="contact-message" className="block text-xs font-semibold text-[#111827] mb-1">
                  {language === 'bn' ? 'বিস্তারিত বার্তা *' : 'Message *'}
                </label>
                <textarea
                  id="contact-message"
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={
                    language === 'bn'
                      ? 'আপনার জিজ্ঞাসা বা পরামর্শ বিস্তারিত লিখুন...'
                      : 'Write your question or feedback in detail...'
                  }
                  className="w-full px-3.5 py-2.5 text-sm bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#006A4E]"
                />
              </div>

              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-[#006A4E] hover:bg-[#00523C] text-white text-sm font-semibold transition-colors cursor-pointer"
              >
                <Send className="w-4 h-4" aria-hidden="true" />
                <span>{language === 'bn' ? 'বার্তা পাঠান' : 'Send Message'}</span>
              </button>
            </form>
          </div>
        </section>
      </div>
    </AboutPageLayout>
  );
}
