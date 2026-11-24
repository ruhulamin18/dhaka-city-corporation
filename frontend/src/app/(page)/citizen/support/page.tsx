'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
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
  AlertCircle,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';

interface SupportTicket {
  id: string;
  category: string;
  subject: string;
  message: string;
  createdAt: string;
}

const TICKET_CATEGORIES: Record<string, { bn: string; en: string }> = {
  'holding-tax': { bn: 'হোল্ডিং ট্যাক্স ও মূল্যায়ন', en: 'Holding Tax & Assessment' },
  'trade-license': { bn: 'ট্রেড লাইসেন্স ও নবায়ন', en: 'Trade License & Renewal' },
  certificates: { bn: 'সনদ ও প্রত্যায়নপত্র', en: 'Certificates & Endorsements' },
  'payment-issue': { bn: 'পেমেন্ট ও চালান সমস্যা', en: 'Payment & Challan Settlement' },
  technical: { bn: 'প্রযুক্তিগত / পোর্টাল সমস্যা', en: 'Portal / Technical Issue' },
};

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
      bn: 'সনদের রেফারেন্স নম্বর দিয়ে ইস্যুকারী কার্যালয়ে যাচাই করুন। এই ডেমো পোর্টালের প্রিভিউকে স্বাক্ষরিত সরকারি নথি হিসেবে ব্যবহার করবেন না।',
      en: 'Verify the certificate reference with its issuing office. Do not treat a preview in this demo portal as a digitally signed official document.',
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
      bn: 'সমস্যার ধরন ও ওয়ার্ড অনুযায়ী সময় ভিন্ন হতে পারে। রিপোর্টের ট্র্যাকিং নম্বর দিয়ে অবস্থা দেখুন; তাৎক্ষণিক ঝুঁকি থাকলে হেল্পলাইনে যোগাযোগ করুন।',
      en: 'Response times vary by issue and ward. Check the report using its tracking ID; contact the listed helpline if there is an immediate safety risk.',
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
      bn: 'পেমেন্ট রেফারেন্স ও ব্যাংক বা মোবাইল ওয়ালেটের লেনদেন নম্বর সংরক্ষণ করে পেমেন্ট ইতিহাস দেখুন। রেকর্ড না মিললে তালিকাভুক্ত হেল্পলাইনে যোগাযোগ করুন।',
      en: 'Keep the payment reference and bank or mobile-wallet transaction ID, then check payment history. If the records do not match, contact the listed helpline.',
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
      bn: 'এই ডেমো পোর্টালে অতিরিক্ত নথি আপলোডের সুবিধা নেই। আপনার আবেদন রেফারেন্সসহ সহায়তা টিকেট জমা দিন অথবা সংশ্লিষ্ট ওয়ার্ড কার্যালয়ে যোগাযোগ করুন।',
      en: 'Additional document uploads are not available in this demo portal. Submit a support ticket with your application reference or contact your ward office.',
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
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [ticketError, setTicketError] = useState('');

  useEffect(() => {
    if (!user) return;
    let active = true;
    queueMicrotask(() => {
      if (!active) return;
      try {
        const saved = localStorage.getItem(`dscc_citizen_support_${user.id}`);
        setTickets(saved ? JSON.parse(saved) as SupportTicket[] : []);
      } catch (error) {
        setTicketError(error instanceof Error
          ? error.message
          : language === 'bn' ? 'সহায়তা টিকেট লোড করা যায়নি।' : 'Unable to load support requests.');
      }
    });
    return () => {
      active = false;
    };
  }, [user, language]);

  const toggleFaq = (id: string) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject.trim() || !ticketMessage.trim()) return;
    if (!user) return;

    setIsSubmitting(true);
    setTicketError('');
    const ticket: SupportTicket = {
      id: `TKT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      category: ticketCategory,
      subject: ticketSubject.trim(),
      message: ticketMessage.trim(),
      createdAt: new Date().toISOString(),
    };
    const next = [ticket, ...tickets];
    try {
      localStorage.setItem(`dscc_citizen_support_${user.id}`, JSON.stringify(next));
      setTickets(next);
      setTicketSubmitted(ticket.id);
      setTicketSubject('');
      setTicketMessage('');
    } catch (error) {
      setTicketError(error instanceof Error
        ? error.message
        : language === 'bn' ? 'টিকেট সংরক্ষণ করা যায়নি।' : 'Unable to save the support request.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-[#ECFDF5] text-[#006A4E] text-xs font-semibold uppercase tracking-wider mb-2">
              <Headphones className="w-3.5 h-3.5" />
              {language === 'bn' ? 'নাগরিক সহায়তা ডেস্ক' : 'Citizen Help Desk'}
            </div>
            <h1 className="text-2xl font-bold text-slate-900">
              {language === 'bn' ? 'সহায়তা ও হেল্পডেস্ক' : 'Citizen Help & Support Center'}
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              {language === 'bn'
                ? 'নাগরিক সেবা বা আবেদন সংক্রান্ত প্রশ্নের জন্য যোগাযোগের তথ্য দেখুন, সহায়তা টিকেট জমা দিন বা সাধারণ প্রশ্ন পড়ুন।'
                : 'Find contact details, submit a support request saved on this device, or browse frequently asked questions.'}
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
            {language === 'bn' ? 'জরুরি সেবা ও নিয়ন্ত্রণ কক্ষ' : 'Emergency service and control room'}
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

          {ticketError && <p role="alert" className="mb-4 flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800"><AlertCircle className="h-4 w-4" />{ticketError}</p>}

          {ticketSubmitted ? (
            <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-[#006A4E] mx-auto" />
              <h3 className="font-bold text-emerald-900">
                {language === 'bn' ? 'টিকেট সফলভাবে গ্রহণ করা হয়েছে!' : 'Support Ticket Created!'}
              </h3>
              <p className="text-xs text-emerald-800">
                {language === 'bn'
                  ? `আপনার টিকেট নম্বর ${ticketSubmitted}। এটি এই ডিভাইসে সংরক্ষিত হয়েছে।`
                  : `Your ticket ID is ${ticketSubmitted}. The request was saved on this device.`}
              </p>
              <button
                type="button"
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

          {tickets.length > 0 && (
            <section className="mt-6 border-t border-slate-200 pt-4">
              <h3 className="text-sm font-semibold text-slate-900">
                {language === 'bn' ? 'আমার সহায়তা টিকেট' : 'My support requests'}
              </h3>
              <ul className="mt-3 space-y-2">
                {tickets.slice(0, 3).map((ticket) => (
                  <li key={ticket.id} className="rounded-lg border border-slate-200 p-3">
                    <p className="font-mono text-xs font-semibold text-[#006A4E]">{ticket.id}</p>
                    <p className="mt-1 text-sm font-medium text-slate-800">{ticket.subject}</p>
                    <p className="mt-1 text-xs text-slate-600">{TICKET_CATEGORIES[ticket.category]?.[language] ?? ticket.category} · {new Intl.DateTimeFormat(language === 'bn' ? 'bn-BD' : 'en-US', { dateStyle: 'medium' }).format(new Date(ticket.createdAt))}</p>
                  </li>
                ))}
              </ul>
            </section>
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
                    type="button"
                    onClick={() => toggleFaq(faq.id)}
                    aria-expanded={isOpen}
                    aria-controls={`${faq.id}-answer`}
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
                  <div
                    id={`${faq.id}-answer`}
                    role="region"
                    aria-labelledby={`${faq.id}-question`}
                    hidden={!isOpen}
                    className="p-4 bg-white text-sm text-slate-600 leading-relaxed border-t border-slate-200"
                  >
                    {language === 'bn' ? faq.answer.bn : faq.answer.en}
                  </div>
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
                {language === 'bn' ? 'নাগরিক সেবার নির্দেশিকা দেখুন' : 'Browse citizen service information'}
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
