'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, ArrowUp, MessageSquareText, Send, X } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { mockApi } from '@/services/mockApi';

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  actionHref?: string;
  actionLabel?: string;
}

export function AiAssistantWidget() {
  const { language, t } = useApp();
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [topHovered, setTopHovered] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const seqRef = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 180);
    };
    const onOpenAssistant = () => {
      setOpen(true);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('dscc:open-ai-assistant', onOpenAssistant);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('dscc:open-ai-assistant', onOpenAssistant);
    };
  }, []);

  const isExpanded = hovered || open;

  const scrollToTop = () => {
    setTopHovered(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const activeMessages: ChatMessage[] =
    messages.length > 0
      ? messages
      : [
          {
            id: 'greeting',
            sender: 'bot',
            text: t.assistant.greeting,
          },
        ];

  const sendQuery = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    seqRef.current += 1;
    const userMsg: ChatMessage = {
      id: `u-${seqRef.current}`,
      sender: 'user',
      text: trimmed,
    };

    setMessages((prev) =>
      prev.length === 0
        ? [{ id: 'greeting', sender: 'bot', text: t.assistant.greeting }, userMsg]
        : [...prev, userMsg]
    );
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
      };
      setMessages((prev) => [...prev, botMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="no-print fixed bottom-5 right-5 z-40 flex flex-col items-end gap-2.5">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ duration: 0.18 }}
            className="mb-1 w-[340px] sm:w-[380px] bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[520px]"
          >
            {/* Header */}
            <div className="bg-[#006A4E] text-white px-4 py-3.5 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold">{t.assistant.title}</h3>
                <p className="text-[11px] text-emerald-100">{t.assistant.subtitle}</p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="p-1.5 rounded-lg text-emerald-100 hover:text-white hover:bg-white/10 cursor-pointer"
                aria-label={t.common.close}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#F8FAFC]">
              {activeMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-xl px-3.5 py-2.5 text-xs leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-[#006A4E] text-white'
                        : 'bg-white border border-[#E2E8F0] text-[#111827]'
                    }`}
                  >
                    <p>{msg.text}</p>
                    {msg.actionHref && msg.actionLabel && (
                      <Link
                        href={msg.actionHref}
                        onClick={() => setOpen(false)}
                        className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-[#006A4E] hover:underline"
                      >
                        <span>{msg.actionLabel}</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    )}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="text-xs text-[#4B5563] px-2">
                  {language === 'bn' ? 'উত্তর প্রস্তুত হচ্ছে...' : 'Typing response...'}
                </div>
              )}
            </div>

            {/* Quick Suggestion Chips */}
            <div className="px-3 py-2 bg-white border-t border-[#E2E8F0] flex flex-wrap gap-1.5">
              {t.assistant.suggestions.map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => sendQuery(chip)}
                  className="text-[11px] px-2.5 py-1 rounded-md bg-[#F8FAFC] hover:bg-[#ECFDF5] text-[#4B5563] hover:text-[#006A4E] border border-[#E2E8F0] transition-colors cursor-pointer text-left"
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendQuery(input);
              }}
              className="p-3 bg-white border-t border-[#E2E8F0] flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t.assistant.placeholder}
                className="flex-1 text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006A4E]"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="p-2 bg-[#006A4E] hover:bg-[#00523C] disabled:opacity-50 text-white rounded-lg transition-colors cursor-pointer"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Circular-to-Pill Animated Nagorik AI Launcher */}
      <motion.button
        type="button"
        onClick={() => setOpen(!open)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocus={() => setHovered(true)}
        onBlur={() => setHovered(false)}
        aria-label={t.assistant.title}
        aria-expanded={open}
        animate={{
          paddingLeft: isExpanded ? 16 : 13,
          paddingRight: isExpanded ? 18 : 13,
        }}
        transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
        className="h-12 inline-flex items-center justify-center rounded-full bg-[#006A4E] hover:bg-[#00523C] text-white shadow-lg border border-white/15 transition-colors cursor-pointer overflow-hidden"
      >
        <MessageSquareText className="w-5 h-5 text-emerald-200 shrink-0" aria-hidden="true" />
        <motion.span
          initial={false}
          animate={{
            width: isExpanded ? 'auto' : 0,
            opacity: isExpanded ? 1 : 0,
            marginLeft: isExpanded ? 8 : 0,
          }}
          transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
          className="text-sm font-semibold whitespace-nowrap overflow-hidden inline-block"
        >
          {t.assistant.title}
        </motion.span>
      </motion.button>

      {/* Circular-to-Pill Animated Back to Top Button (Visible Only After Scrolling) */}
      <AnimatePresence>
        {scrolled && (
          <motion.button
            key="back-to-top"
            type="button"
            onClick={scrollToTop}
            onMouseEnter={() => setTopHovered(true)}
            onMouseLeave={() => setTopHovered(false)}
            onFocus={() => setTopHovered(true)}
            onBlur={() => setTopHovered(false)}
            initial={{ opacity: 0, y: 12, scale: 0.88 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              paddingLeft: topHovered ? 16 : 14,
              paddingRight: topHovered ? 18 : 14,
            }}
            exit={{ opacity: 0, y: 12, scale: 0.88 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
            aria-label={language === 'bn' ? 'উপরে ফিরে যান' : 'Back to Top'}
            className="h-11 inline-flex items-center justify-center rounded-full bg-white text-[#006A4E] border border-[#E2E8F0] shadow-lg hover:bg-[#006A4E] hover:text-white hover:border-[#006A4E] focus-visible:bg-[#006A4E] focus-visible:text-white focus-visible:border-[#006A4E] transition-colors cursor-pointer overflow-hidden"
          >
            <ArrowUp className="w-4 h-4 shrink-0" aria-hidden="true" />
            <motion.span
              initial={false}
              animate={{
                width: topHovered ? 'auto' : 0,
                opacity: topHovered ? 1 : 0,
                marginLeft: topHovered ? 8 : 0,
              }}
              transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
              className="text-xs sm:text-sm font-semibold whitespace-nowrap overflow-hidden inline-block"
            >
              {language === 'bn' ? 'উপরে ফিরে যান' : 'Back to Top'}
            </motion.span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
