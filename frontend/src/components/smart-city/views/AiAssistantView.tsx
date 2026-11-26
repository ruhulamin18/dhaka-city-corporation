'use client';

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Bot,
  CheckCircle2,
  HelpCircle,
  Lock,
  MessageSquare,
  Send,
  Sparkles,
  User,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { mockApi } from '@/services/mockApi';

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  actionHref?: string;
  actionLabel?: string;
  timestamp: string;
}

export function AiAssistantView() {
  const { language } = useApp();

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'bot',
      text:
        language === 'bn'
          ? 'স্বাগতম! আমি ঢাকা সিটি কর্পোরেশনের ডিজিটাল এআই নাগরিক সহায়ক। ট্রেড লাইসেন্স, হোল্ডিং ট্যাক্স, বর্জ্য অপসারণ বা যেকোনো নাগরিক সেবা ও নিয়ামাবলি সম্পর্কে জানতে আমাকে প্রশ্ন করতে পারেন।'
          : 'Welcome! I am the Dhaka City Corporation Digital AI Citizen Assistant. Ask me anything about trade licenses, holding taxes, waste schedules, or municipal citizen charters.',
      timestamp: 'Online',
    },
  ]);

  const seqRef = useRef(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    {
      bn: 'ট্রেড লাইসেন্স করতে কী কী কাগজ লাগে?',
      en: 'What documents are required for a Trade License?',
    },
    {
      bn: 'হোল্ডিং ট্যাক্স হিসাব ও ছাড় কীভাবে পাব?',
      en: 'How to calculate holding tax and get the 10% rebate?',
    },
    {
      bn: 'রাস্তার খানাখন্দ বা ড্রেন বন্ধ হলে কীভাবে রিপোর্ট করব?',
      en: 'How to report damaged roads or clogged drains?',
    },
    {
      bn: 'নিকটস্থ ওয়ার্ড কাউন্সিলর অফিস ও হেল্পলাইন কোথায়?',
      en: 'Where is my nearest Ward Councillor Secretariat?',
    },
  ];

  const handleSendQuery = async (queryText: string) => {
    const trimmed = queryText.trim();
    if (!trimmed || loading) return;

    seqRef.current += 1;
    const userMsg: ChatMessage = {
      id: `u-${seqRef.current}`,
      sender: 'user',
      text: trimmed,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const reply = await mockApi.askCityAssistant(trimmed, language);
      seqRef.current += 1;
      const botMsg: ChatMessage = {
        id: `b-${seqRef.current}`,
        sender: 'bot',
        text: reply.answer,
        actionHref: reply.actionHref,
        actionLabel: reply.actionLabel,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch {
      seqRef.current += 1;
      setMessages((prev) => [
        ...prev,
        {
          id: `b-${seqRef.current}`,
          sender: 'bot',
          text:
            language === 'bn'
              ? 'দুঃখিত, এই মুহূর্তে এআই সহায়কের উত্তর পাওয়া যায়নি। নাগরিক সেবা নির্দেশিকা দেখুন অথবা ১৬১০৬ হেল্পলাইনে যোগাযোগ করুন।'
              : 'Sorry, the AI assistant could not process your request right now. Please check Citizen Services or call 16106 for assistance.',
          actionHref: '/citizen-services',
          actionLabel: language === 'bn' ? 'নাগরিক সেবা নির্দেশিকা' : 'Open Citizen Services',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Privacy & Official Scope Notice */}
      <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-[#006A4E] text-xs sm:text-sm flex items-start gap-3 shadow-xs">
        <Lock className="w-4 h-4 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong>{language === 'bn' ? 'গোপনীয়তা ও সেবা নীতিমালা: ' : 'Data Privacy Notice: '}</strong>
          {language === 'bn'
            ? 'এই সহকারীটি শুধুমাত্র সিটিজেন চার্টার, প্রয়োজনীয় কাগজপত্র ও সরকারি প্রক্রিয়ার দিকনির্দেশনা প্রদান করে। আপনার ব্যক্তিগত ট্যাক্স রেকর্ড বা সনদ দেখতে আপনার নাগরিক অ্যাকাউন্টে লগইন করতে হবে।'
            : 'This AI provides general civic guidance grounded in official city charters. Private financial and certificate records strictly require authentication.'}
        </div>
      </div>

      {/* 2. Chat Conversation Canvas */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden flex flex-col h-[600px]">
        {/* Chat Header */}
        <div className="bg-[#006A4E] text-white p-4 px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/15 border border-white/20 flex items-center justify-center">
              <Bot className="w-6 h-6 text-emerald-200" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base">
                {language === 'bn' ? 'ঢাকা স্মার্ট সিটি নাগরিক এআই ডেস্ক' : 'Dhaka Smart City AI Civic Desk'}
              </h3>
              <div className="flex items-center gap-1.5 text-xs text-emerald-100">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>{language === 'bn' ? 'সার্বক্ষণিক সক্রিয়' : 'Online & Ready'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Messages Scroll Area */}
        <div
          aria-live="polite"
          aria-relevant="additions"
          className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-50/50"
        >
          {messages.map((msg) => {
            const isBot = msg.sender === 'bot';
            return (
              <div
                key={msg.id}
                className={`flex items-start gap-3 ${isBot ? '' : 'flex-row-reverse'}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                    isBot ? 'bg-[#006A4E] text-white' : 'bg-slate-700 text-white'
                  }`}
                >
                  {isBot ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </div>

                <div
                  className={`max-w-xl p-4 rounded-2xl text-xs sm:text-sm space-y-2.5 shadow-2xs leading-relaxed ${
                    isBot
                      ? 'bg-white border border-slate-200 text-[#111827]'
                      : 'bg-[#006A4E] text-white'
                  }`}
                >
                  <p>{msg.text}</p>

                  {msg.actionHref && (
                    <div className="pt-2 border-t border-slate-100">
                      <Link
                        href={msg.actionHref}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#ECFDF5] text-[#006A4E] font-bold text-xs hover:bg-emerald-100 transition-colors"
                      >
                        <span>{msg.actionLabel || (language === 'bn' ? 'বিস্তারিত দেখুন' : 'View Service')}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  )}

                  <div
                    className={`text-[10px] text-right font-mono ${
                      isBot ? 'text-slate-400' : 'text-emerald-100/80'
                    }`}
                  >
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex items-center gap-2 text-xs text-slate-500 italic p-2">
              <Bot className="w-4 h-4 animate-spin text-[#006A4E]" />
              <span>{language === 'bn' ? 'এআই উত্তর প্রস্তুত করছে...' : 'AI is processing your query...'}</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts Bar */}
        <div className="p-3 bg-white border-t border-slate-100 flex items-center gap-2 overflow-x-auto scrollbar-none">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#006A4E]" />
            <span>{language === 'bn' ? 'সচরাচর প্রশ্ন:' : 'Prompts:'}</span>
          </span>
          {quickPrompts.map((p, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleSendQuery(language === 'bn' ? p.bn : p.en)}
              className="min-h-[44px] sm:min-h-[36px] px-3.5 py-1.5 rounded-full text-xs bg-slate-100 hover:bg-[#ECFDF5] hover:text-[#006A4E] text-[#111827] transition-colors whitespace-nowrap border border-slate-200/80 shrink-0 cursor-pointer"
            >
              {language === 'bn' ? p.bn : p.en}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendQuery(input);
          }}
          className="p-4 bg-white border-t border-slate-200 flex items-center gap-3"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              language === 'bn'
                ? 'নাগরিক সেবা বা ফি সম্পর্কে বাংলায় প্রশ্ন করুন...'
                : 'Ask any question regarding municipal services...'
            }
            className="flex-1 px-4 py-3 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#006A4E] focus:bg-white transition-all"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="px-5 py-3 rounded-xl bg-[#006A4E] text-white hover:bg-[#00523C] disabled:opacity-50 transition-all font-semibold text-xs sm:text-sm flex items-center gap-2 cursor-pointer shadow-xs shrink-0"
          >
            <span>{language === 'bn' ? 'পাঠান' : 'Send'}</span>
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
