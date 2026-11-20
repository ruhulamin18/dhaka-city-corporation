'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  HelpCircle,
  PhoneCall,
  Mail,
  Clock,
  MapPin,
  Send,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  FileQuestion,
  Headphones,
  ExternalLink,
  MessageSquare,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';

interface FAQItem {
  id: string;
  question: { bn: string; en: string };
  answer: { bn: string; en: string };
  category: string;
}

const FAQS: FAQItem[] = [
  {
    id: 'faq-1',
    category: 'payments',
    question: {
      bn: 'হোল্ডিং ট্যাক্স রিবেট বা ছাড় পাওয়ার নিয়ম কী?',
      en: 'What is the rule for getting a holding tax rebate or discount?',
    },
    answer: {
      bn: 'চলতি অর্থ-বছরের প্রথম কোয়ার্টারে (জুলাই-সেপ্টেম্বর) সমুদয় বকেয়াহীন বার্ষিক হোল্ডিং ট্যাক্স একসাথে পরিশোধ করলে ১০% বিশেষ সরকারি রিবেট পাওয়া যায়। অক্টোবর-ডিসেম্বর পরিশোধে ৫% রিবেট প্রযোজ্য।',
      en: 'Paying the entire annual holding tax in full without arrears during the first quarter (July-September) grants a 10% special government rebate. Paying in the second quarter (October-December) grants a 5% rebate.',
    },
  },
  {
    id: 'faq-2',
    category: 'certificates',
    question: {
      bn: 'ডিজিটাল নাগরিক সনদ কীভাবে যাচাই করা যায়?',
      en: 'How can digital citizen certificates be verified?',
    },
    answer: {
      bn: 'ইস্যুকৃত প্রতিটি সনদে একটি সরকারি এনক্রিপ্টেড কিউআর (QR) কোড এবং ইউনিক ভেরিফিকেশন আইডি থাকে। যেকোনো স্মার্টফোন ক্যামেরা বা পোর্টালের ভেরিফিকেশন পেজ থেকে স্ক্যান করে এর সত্যতা নিশ্চিত করা যায়।',
      en: 'Every issued certificate contains an encrypted official QR code and a unique verification ID. It can be verified instantly by scanning with any smartphone camera or through the portal verification page.',
    },
  },
  {
    id: 'faq-3',
    category: 'complaints',
    question: {
      bn: 'নাগরিক সমস্যার অভিযোগ নিষ্পত্তিতে কত সময় লাগে?',
      en: 'How long does civic problem resolution take?',
    },
    answer: {
      bn: 'জরুরি নিষ্কাশন বা বর্জ্য সংক্রান্ত অভিযোগ সাধারণত ২৪ থেকে ৪৮ ঘণ্টার মধ্যে ওয়ার্ড পরিদর্শক দল পরিদর্শন ও সমাধান করে। রাস্তা সংস্কার বা বড় অবকাঠামো মেরামতের ক্ষেত্রে প্রকৌশল বিভাগ ৩ থেকে ৭ কর্মদিবসের মধ্যে কাজ শুরু করে।',
      en: 'Urgent drainage or waste management complaints are typically inspected and resolved within 24 to 48 hours by the ward inspection team. Road repair or larger infrastructure works commence within 3-7 working days by the engineering department.',
    },
  },
  {
    id: 'faq-4',
    category: 'technical',
    question: {
      bn: 'পেমেন্ট কেটে নেওয়া হয়েছে কিন্তু রসিদ পাইনি, কী করব?',
      en: 'Payment was deducted but receipt not generated, what to do?',
    },
    answer: {
      bn: 'পেমেন্ট গেটওয়ের সাময়িক বিলম্বের কারণে এমন হতে পারে। ৩-৫ মিনিট অপেক্ষা করে "পেমেন্ট ইতিহাস" পেজ দেখুন অথবা আপনার ব্যাংক/বিকাশ লেনদেন আইডি (TrxID) দিয়ে "রসিদ যাচাই" ট্যাবে অনুসন্ধান করুন। সমস্যা থাকলে হেল্পলাইন ১৬১০৬-এ কল করুন।',
      en: 'This can occur due to brief payment gateway settlement delays. Please wait 3-5 minutes and check your "Payment History" page or query the "Verify Receipt" tab with your Bank/bKash TrxID. If unresolved, call Helpline 16106.',
    },
  },
  {
    id: 'faq-5',
    category: 'applications',
    question: {
      bn: 'আবেদনে অতিরিক্ত কাগজপত্র কীভাবে জমা দেব?',
      en: 'How do I submit additional documents if requested by the officer?',
    },
    answer: {
      bn: 'যাচাইকারী কর্মকর্তা অতিরিক্ত তথ্যের জন্য অনুরোধ পাঠালে আপনার নোটিফিকেশন ও "আবেদনের অবস্থা" ট্যাবে রিমার্কসসহ সতর্কবার্তা আসবে। সেখানে থাকা "কাগজপত্র আপলোড" বাটনে ক্লিক করে ফাইল জমা দিন।',
      en: 'If a reviewing officer requests additional documents, you will receive an alert with officer remarks under Notifications and "Application Tracking". Click the "Upload Document" button on that application to submit.',
    },
  },
];

export default function CitizenSupportPage() {
  const { language } = useApp();
  const { user } = useAuth();

  const [expandedFaq, setExpandedFaq] = useState<string | null>('faq-1');
  const [ticketCategory, setTicketCategory] = useState('holding-tax');
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketMessage, setTicketMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ticketSubmitted, setTicketSubmitted] = useState<string | null>(null);

  const toggleFaq = (id: string) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject.trim() || !ticketMessage.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const generatedId = `TKT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
      setIsSubmitting(false);
      setTicketSubmitted(generatedId);
      setTicketSubject('');
      setTicketMessage('');
    }, 700);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-[#ECFDF5] text-[#006A4E] text-xs font-semibold uppercase tracking-wider mb-2">
              <Headphones className="w-3.5 h-3.5" />
              {language === 'bn' ? '২৪/৭ নাগরিক সেবা ডেস্ক' : '24/7 Citizen Help Desk'}
            </div>
            <h1 className="text-2xl font-bold text-slate-900">
              {language === 'bn' ? 'সহায়তা ও হেল্পডেস্ক' : 'Citizen Help & Support Center'}
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              {language === 'bn'
                ? 'যেকোনো নাগরিক সেবা, ফি পরিশোধ বা আবেদন সংক্রান্ত জিজ্ঞাসার জন্য যোগাযোগ করুন বা সহায়তা টিকেট জমা দিন।'
                : 'Get immediate assistance, submit support tickets, or find answers to frequently asked questions.'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="tel:16106"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#006A4E] text-white text-sm font-semibold rounded-lg hover:bg-[#00523c] transition shadow-sm"
            >
              <PhoneCall className="w-4 h-4 animate-bounce" />
              {language === 'bn' ? 'কল করুন: ১৬১০৬' : 'Hotline: 16106'}
            </a>
          </div>
        </div>
      </div>

      {/* Emergency & Official Contact Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:border-[#006A4E]/40 transition">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-[#006A4E] flex items-center justify-center mb-3">
            <PhoneCall className="w-5 h-5" />
          </div>
          <h3 className="font-semibold text-slate-900 text-base">
            {language === 'bn' ? 'জরুরি নাগরিক হেল্পলাইন' : 'Emergency Citizen Hotline'}
          </h3>
          <p className="text-xs text-slate-500 mt-1 mb-3">
            {language === 'bn' ? 'সার্বক্ষণিক জরুরি সেবা ও নিয়ন্ত্রণ কক্ষ' : 'Toll-free 24/7 Central Control Room'}
          </p>
          <div className="space-y-1 text-sm font-medium text-slate-800">
            <div>
              {language === 'bn' ? 'হটলাইন:' : 'Hotline:'}{' '}
              <a href="tel:16106" className="text-[#006A4E] font-bold">16106</a>
            </div>
            <div>
              {language === 'bn' ? 'কন্ট্রোল রুম:' : 'Control Room:'}{' '}
              <a href="tel:029556014" className="text-slate-700">02-9556014</a>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:border-[#006A4E]/40 transition">
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
            <Mail className="w-5 h-5" />
          </div>
          <h3 className="font-semibold text-slate-900 text-base">
            {language === 'bn' ? 'ইমেইল ও অনলাইন ডেস্ক' : 'Email & Digital Desk'}
          </h3>
          <p className="text-xs text-slate-500 mt-1 mb-3">
            {language === 'bn' ? 'সাধারণ জিজ্ঞাসা ও প্রযুক্তিগত সহায়তা' : 'General inquiries and technical support'}
          </p>
          <div className="space-y-1 text-sm font-medium text-slate-800">
            <div>
              {language === 'bn' ? 'ইমেইল:' : 'Email:'}{' '}
              <a href="mailto:support@dhakacity.gov.bd" className="text-blue-600 underline">support@dhakacity.gov.bd</a>
            </div>
            <div className="text-xs text-slate-500">
              {language === 'bn' ? 'কার্যদিবসে ৪ ঘণ্টার মধ্যে জবাব' : 'Response within 4 hours on working days'}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:border-[#006A4E]/40 transition">
          <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center mb-3">
            <MapPin className="w-5 h-5" />
          </div>
          <h3 className="font-semibold text-slate-900 text-base">
            {language === 'bn'
              ? `ওয়ার্ড ${user?.wardNumber || 27} কাউন্সিলর কার্যালয়`
              : `Ward ${user?.wardNumber || 27} Councillor Office`}
          </h3>
          <p className="text-xs text-slate-500 mt-1 mb-3">
            {language === 'bn' ? 'সরাসরি সেবা ও ওয়ার্ড কাউন্সিলর সচিব' : 'Local ward executive office & secretary'}
          </p>
          <div className="space-y-1 text-xs text-slate-700">
            <div className="flex items-center gap-1.5 font-medium text-slate-800">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              {language === 'bn' ? 'রবি - বৃহস্পতি: সকাল ৯টা - বিকাল ৫টা' : 'Sun - Thu: 9:00 AM - 5:00 PM'}
            </div>
            <div>
              {language === 'bn' ? 'ফোন: ০১৮১৬-৬৪৮০৯৫' : 'Phone: +880 1816-648095'}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Support Ticket Submission */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
            <MessageSquare className="w-5 h-5 text-[#006A4E]" />
            <h2 className="text-lg font-bold text-slate-900">
              {language === 'bn' ? 'সহায়তা টিকেট জমা দিন' : 'Submit Support Request'}
            </h2>
          </div>

          {ticketSubmitted ? (
            <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-[#006A4E] mx-auto" />
              <h3 className="font-bold text-emerald-900">
                {language === 'bn' ? 'টিকেট সফলভাবে গ্রহণ করা হয়েছে!' : 'Support Ticket Created!'}
              </h3>
              <p className="text-xs text-emerald-800">
                {language === 'bn'
                  ? `আপনার টিকেট নম্বর ${ticketSubmitted}। শীঘ্রই আমাদের সহায়তা কর্মকর্তা আপনার সাথে যোগাযোগ করবেন।`
                  : `Your ticket ID is ${ticketSubmitted}. A representative will review and reply shortly.`}
              </p>
              <button
                onClick={() => setTicketSubmitted(null)}
                className="mt-2 text-xs font-semibold px-4 py-2 bg-[#006A4E] text-white rounded-lg hover:bg-[#00523c]"
              >
                {language === 'bn' ? 'অন্য আরেকটি টিকেট পাঠান' : 'Submit Another Ticket'}
              </button>
            </div>
          ) : (
            <form onSubmit={handleTicketSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  {language === 'bn' ? 'সমস্যার ধরন / বিভাগ' : 'Inquiry Category'}
                </label>
                <select
                  value={ticketCategory}
                  onChange={(e) => setTicketCategory(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006A4E]"
                >
                  <option value="holding-tax">
                    {language === 'bn' ? 'হোল্ডিং ট্যাক্স ও মূল্যায়ন' : 'Holding Tax & Assessment'}
                  </option>
                  <option value="trade-license">
                    {language === 'bn' ? 'ট্রেড লাইসেন্স ও নবায়ন' : 'Trade License & Renewal'}
                  </option>
                  <option value="certificates">
                    {language === 'bn' ? 'সনদ ও প্রত্যায়নপত্র' : 'Certificates & Endorsements'}
                  </option>
                  <option value="payment-issue">
                    {language === 'bn' ? 'পেমেন্ট ও চালান সমস্যা' : 'Payment & Challan Settlement'}
                  </option>
                  <option value="technical">
                    {language === 'bn' ? 'প্রযুক্তিগত / পোর্টাল সমস্যা' : 'Portal / Technical Issue'}
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  {language === 'bn' ? 'বিষয় / সারসংক্ষেপ' : 'Subject'}
                </label>
                <input
                  type="text"
                  required
                  value={ticketSubject}
                  onChange={(e) => setTicketSubject(e.target.value)}
                  placeholder={
                    language === 'bn'
                      ? 'উদা: হোল্ডিং ট্যাক্স রসিদ সংক্রান্ত প্রশ্ন'
                      : 'e.g. Inquiry regarding holding tax receipt'
                  }
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006A4E]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  {language === 'bn' ? 'বিস্তারিত বিবরণ' : 'Detailed Description'}
                </label>
                <textarea
                  required
                  rows={4}
                  value={ticketMessage}
                  onChange={(e) => setTicketMessage(e.target.value)}
                  placeholder={
                    language === 'bn'
                      ? 'আপনার সমস্যা বা প্রশ্নের বিস্তারিত তথ্য এখানে লিখুন...'
                      : 'Provide details about your query or issue...'
                  }
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006A4E]"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#006A4E] text-white text-sm font-semibold rounded-lg hover:bg-[#00523c] transition disabled:opacity-60"
              >
                {isSubmitting ? (
                  <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                {language === 'bn' ? 'টিকেট জমা দিন' : 'Submit Ticket'}
              </button>
            </form>
          )}
        </div>

        {/* FAQs Accordion */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
            <FileQuestion className="w-5 h-5 text-[#006A4E]" />
            <h2 className="text-lg font-bold text-slate-900">
              {language === 'bn' ? 'সাধারণ জিজ্ঞাসা (FAQ)' : 'Frequently Asked Questions'}
            </h2>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq) => {
              const isOpen = expandedFaq === faq.id;
              return (
                <div
                  key={faq.id}
                  className="border border-slate-200 rounded-lg overflow-hidden transition"
                >
                  <button
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full flex items-center justify-between p-4 text-left bg-slate-50 hover:bg-slate-100 transition"
                  >
                    <span className="font-semibold text-slate-800 text-sm">
                      {language === 'bn' ? faq.question.bn : faq.question.en}
                    </span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-slate-500 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="p-4 bg-white text-sm text-slate-600 leading-relaxed border-t border-slate-200">
                      {language === 'bn' ? faq.answer.bn : faq.answer.en}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-6 p-4 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-700">
                {language === 'bn' ? 'নাগরিক সেবা নির্দেশিকা দেখতে চান?' : 'Need citizen services charter?'}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                {language === 'bn' ? 'সকল ৩১টি নাগরিক সেবার পূর্ণাঙ্গ চার্টার ও সময়সীমা' : 'Explore all 31 citizen services guidelines'}
              </p>
            </div>
            <Link
              href="/citizen/services"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#006A4E] hover:underline"
            >
              {language === 'bn' ? 'সেবা তালিকা' : 'View Directory'}
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
