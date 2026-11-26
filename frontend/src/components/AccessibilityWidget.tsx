'use client';

import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  Accessibility,
  AlignJustify,
  Contrast,
  Eye,
  Heading,
  Link2,
  MousePointerClick,
  RotateCcw,
  X,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useDialogA11y } from '@/hooks/useDialogA11y';

const STORAGE_KEY = 'dscc_a11y_settings_v1';

interface AccessibilitySettings {
  fontPercent: number;
  monochrome: boolean;
  invertColors: boolean;
  bigCursor: boolean;
  highlightLinks: boolean;
  highlightHeadings: boolean;
  readingGuide: boolean;
}

const DEFAULT_SETTINGS: AccessibilitySettings = {
  fontPercent: 100,
  monochrome: false,
  invertColors: false,
  bigCursor: false,
  highlightLinks: false,
  highlightHeadings: false,
  readingGuide: false,
};

const MIN_FONT = 85;
const MAX_FONT = 130;
const FONT_STEP = 5;

export function openAccessibilityDrawer() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('dscc:open-accessibility'));
  }
}

export function AccessibilityWidget() {
  const { language } = useApp();
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState<AccessibilitySettings>(DEFAULT_SETTINGS);
  const [hydrated, setHydrated] = useState(false);

  const guideBarRef = useRef<HTMLDivElement | null>(null);

  // Global event listeners to open/toggle accessibility drawer from anywhere
  useEffect(() => {
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const handleToggle = () => setOpen((prev) => !prev);

    window.addEventListener('dscc:open-accessibility', handleOpen);
    window.addEventListener('dscc:close-accessibility', handleClose);
    window.addEventListener('dscc:toggle-accessibility', handleToggle);

    if (typeof window !== 'undefined' && window.location.hash === '#accessibility-tools') {
      setOpen(true);
    }

    return () => {
      window.removeEventListener('dscc:open-accessibility', handleOpen);
      window.removeEventListener('dscc:close-accessibility', handleClose);
      window.removeEventListener('dscc:toggle-accessibility', handleToggle);
    };
  }, []);

  // Hydrate persisted preferences safely after mount
  useEffect(() => {
    queueMicrotask(() => {
      try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as Partial<AccessibilitySettings>;
          setSettings({
            fontPercent:
              typeof parsed.fontPercent === 'number'
                ? Math.min(MAX_FONT, Math.max(MIN_FONT, parsed.fontPercent))
                : 100,
            monochrome: Boolean(parsed.monochrome),
            invertColors: Boolean(parsed.invertColors),
            bigCursor: Boolean(parsed.bigCursor),
            highlightLinks: Boolean(parsed.highlightLinks),
            highlightHeadings: Boolean(parsed.highlightHeadings),
            readingGuide: Boolean(parsed.readingGuide),
          });
        }
      } catch {
        // Ignore storage errors
      }
      setHydrated(true);
    });
  }, []);

  // Apply settings to documentElement and persist
  useEffect(() => {
    if (!hydrated) return;
    const root = document.documentElement;

    if (settings.fontPercent === 100) {
      root.style.removeProperty('font-size');
    } else {
      root.style.fontSize = `${settings.fontPercent}%`;
    }

    root.classList.toggle('a11y-big-cursor', settings.bigCursor);
    root.classList.toggle('a11y-highlight-links', settings.highlightLinks);
    root.classList.toggle('a11y-highlight-headings', settings.highlightHeadings);

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {
      // Ignore storage errors
    }
  }, [settings, hydrated]);

  // Smooth 60fps mousemove tracker for the horizontal Reading Guide bar
  useEffect(() => {
    if (!settings.readingGuide) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (guideBarRef.current) {
        guideBarRef.current.style.transform = `translate3d(0, ${e.clientY - 22}px, 0)`;
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [settings.readingGuide]);

  useDialogA11y(open, () => setOpen(false));

  const increaseFont = () => {
    setSettings((prev) => ({
      ...prev,
      fontPercent: Math.min(MAX_FONT, prev.fontPercent + FONT_STEP),
    }));
  };

  const decreaseFont = () => {
    setSettings((prev) => ({
      ...prev,
      fontPercent: Math.max(MIN_FONT, prev.fontPercent - FONT_STEP),
    }));
  };

  const toggleSetting = (
    key: Exclude<keyof AccessibilitySettings, 'fontPercent'>
  ) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleReset = () => {
    setSettings(DEFAULT_SETTINGS);
    const root = document.documentElement;
    root.style.removeProperty('font-size');
    root.classList.remove(
      'a11y-big-cursor',
      'a11y-highlight-links',
      'a11y-highlight-headings'
    );
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore storage errors
    }
  };

  const activeCount =
    (settings.fontPercent !== 100 ? 1 : 0) +
    (settings.monochrome ? 1 : 0) +
    (settings.invertColors ? 1 : 0) +
    (settings.bigCursor ? 1 : 0) +
    (settings.highlightLinks ? 1 : 0) +
    (settings.highlightHeadings ? 1 : 0) +
    (settings.readingGuide ? 1 : 0);

  // Composited viewport filter overlay so fixed modals stay intact & the drawer itself stays excluded
  const filterParts: string[] = [];
  if (settings.monochrome) filterParts.push('grayscale(100%)');
  if (settings.invertColors) filterParts.push('invert(100%) hue-rotate(180deg)');
  const backdropFilterValue = filterParts.join(' ');

  const toggleItems: {
    key: Exclude<keyof AccessibilitySettings, 'fontPercent'>;
    labelBn: string;
    labelEn: string;
    icon: React.ComponentType<{ className?: string }>;
  }[] = [
    { key: 'monochrome', labelBn: 'মনোক্রোম', labelEn: 'Monochrome', icon: Eye },
    { key: 'invertColors', labelBn: 'ইনভার্ট', labelEn: 'Invert Colors', icon: Contrast },
    { key: 'bigCursor', labelBn: 'বড় কার্সর', labelEn: 'Big Cursor', icon: MousePointerClick },
    { key: 'highlightLinks', labelBn: 'লিঙ্ক হাইলাইট', labelEn: 'Highlight Links', icon: Link2 },
    {
      key: 'highlightHeadings',
      labelBn: 'শিরোনাম হাইলাইট',
      labelEn: 'Highlight Headings',
      icon: Heading,
    },
    { key: 'readingGuide', labelBn: 'পড়ার গাইড', labelEn: 'Reading Guide', icon: AlignJustify },
  ];

  return (
    <>
      {/* Full-viewport page filter overlay (below z-[60] accessibility drawer so widget is excluded) */}
      {backdropFilterValue && (
        <div
          aria-hidden="true"
          className="no-print fixed inset-0 pointer-events-none z-[55]"
          style={{
            backdropFilter: backdropFilterValue,
            WebkitBackdropFilter: backdropFilterValue,
          }}
        />
      )}

      {/* Horizontal Reading Guide Ruler */}
      {settings.readingGuide && (
        <div
          ref={guideBarRef}
          aria-hidden="true"
          className="no-print fixed top-0 left-0 right-0 h-11 pointer-events-none z-[58] bg-amber-300/20 border-y-2 border-[#006A4E] shadow-sm transition-transform duration-75 ease-out"
          style={{ transform: 'translate3d(0, 45vh, 0)' }}
        />
      )}

      {/* Pinned Middle-Right Accessibility Widget */}
      <div
        data-a11y-widget="true"
        className="no-print fixed right-0 top-1/2 -translate-y-1/2 z-[60] flex items-center"
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.aside
              key="a11y-drawer"
              initial={{ x: 300, opacity: 0.4 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 300, opacity: 0.4 }}
              transition={{ type: 'spring', stiffness: 360, damping: 32 }}
              role="dialog"
              aria-modal="true"
              aria-label={language === 'bn' ? 'এক্সেসিবিলিটি প্যানেল' : 'Accessibility Controls'}
              className="w-72 bg-white rounded-l-2xl shadow-2xl border border-r-0 border-[#E2E8F0] overflow-hidden"
            >
              {/* Drawer Header */}
              <div className="px-4 py-3.5 bg-[#006A4E] text-white flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="w-8 h-8 rounded-lg bg-[#00523C] border border-white/15 flex items-center justify-center shrink-0">
                    <Accessibility className="w-4 h-4 text-white" />
                  </span>
                  <div>
                    <h2 className="text-sm font-bold leading-tight">
                      {language === 'bn' ? 'এক্সেসিবিলিটি' : 'Accessibility'}
                    </h2>
                    <p className="text-[11px] text-emerald-100">
                      {language === 'bn' ? 'সহজ পাঠ ও দৃশ্যমানতা' : 'Visual & Reading Tools'}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label={language === 'bn' ? 'বন্ধ করুন' : 'Close accessibility panel'}
                  className="min-h-[44px] min-w-[44px] rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Controls Body */}
              <div className="p-4 space-y-4 max-h-[75vh] overflow-y-auto">
                {/* Font Size Scaler */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#111827]">
                      {language === 'bn' ? 'ফন্টের আকার' : 'Text Size'}
                    </span>
                    <span className="font-mono font-bold text-[#006A4E] tabular-nums">
                      {settings.fontPercent}%
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={increaseFont}
                      disabled={settings.fontPercent >= MAX_FONT}
                      className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] hover:bg-[#006A4E] hover:text-white hover:border-[#006A4E] disabled:opacity-40 text-xs font-semibold text-[#111827] transition-colors cursor-pointer"
                    >
                      <span className="font-bold">A+</span>
                      <span>{language === 'bn' ? 'ফন্ট বৃদ্ধি' : 'Increase'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={decreaseFont}
                      disabled={settings.fontPercent <= MIN_FONT}
                      className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] hover:bg-[#006A4E] hover:text-white hover:border-[#006A4E] disabled:opacity-40 text-xs font-semibold text-[#111827] transition-colors cursor-pointer"
                    >
                      <span className="font-bold">A-</span>
                      <span>{language === 'bn' ? 'ফন্ট হ্রাস' : 'Decrease'}</span>
                    </button>
                  </div>
                </div>

                {/* Toggle Switch List */}
                <div className="divide-y divide-slate-100 border-t border-slate-100 pt-1">
                  {toggleItems.map((item) => {
                    const Icon = item.icon;
                    const active = settings[item.key];
                    return (
                      <button
                        key={item.key}
                        type="button"
                        role="switch"
                        aria-checked={active}
                        onClick={() => toggleSetting(item.key)}
                        className="w-full py-2.5 flex items-center justify-between gap-3 text-left group cursor-pointer"
                      >
                        <span className="flex items-center gap-2.5 text-xs sm:text-sm font-medium text-[#111827] group-hover:text-[#006A4E]">
                          <span
                            className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                              active
                                ? 'bg-[#ECFDF5] text-[#006A4E]'
                                : 'bg-slate-100 text-[#4B5563] group-hover:text-[#006A4E]'
                            }`}
                          >
                            <Icon className="w-3.5 h-3.5" />
                          </span>
                          <span>{language === 'bn' ? item.labelBn : item.labelEn}</span>
                        </span>

                        {/* Modern Pill Switch */}
                        <span
                          className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors ${
                            active ? 'bg-[#006A4E]' : 'bg-slate-300'
                          }`}
                        >
                          <span
                            className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow-sm transition-transform ${
                              active ? 'translate-x-4.5' : 'translate-x-1'
                            }`}
                          />
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Full-Width Reset Button */}
                <div className="pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#F8FAFC] hover:bg-[#FEF2F2] hover:text-[#C81E1E] hover:border-red-200 border border-[#E2E8F0] text-xs font-semibold text-[#4B5563] transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>{language === 'bn' ? 'রিসেট' : 'Reset All'}</span>
                  </button>
                </div>
              </div>
            </motion.aside>
          ) : (
            <motion.div
              key="a11y-trigger"
              initial={{ x: 24, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 24, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative group"
            >
              <button
                type="button"
                onClick={() => setOpen(true)}
                aria-label={
                  language === 'bn'
                    ? 'সহজ পাঠ ও দৃশ্যমানতা (এক্সেসিবিলিটি)'
                    : 'Accessibility & Reading Tools'
                }
                className="relative w-12 h-12 rounded-l-2xl bg-[#006A4E] hover:bg-[#00523C] text-white shadow-xl border border-r-0 border-white/25 flex items-center justify-center transition-colors cursor-pointer"
              >
                <Accessibility className="w-6 h-6" aria-hidden="true" />
                {activeCount > 0 && (
                  <span className="absolute -top-1.5 -left-1.5 min-w-5 h-5 px-1 rounded-full bg-[#C81E1E] text-white border-2 border-white text-[10px] font-bold flex items-center justify-center tabular-nums">
                    {activeCount}
                  </span>
                )}
              </button>

              {/* Hover Tooltip Message */}
              <div
                role="tooltip"
                className="pointer-events-none opacity-0 translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 group-focus-within:opacity-100 group-focus-within:translate-x-0 transition-all duration-150 absolute right-full top-1/2 -translate-y-1/2 mr-3 px-3 py-1.5 rounded-lg bg-[#00523C] text-white text-xs font-semibold whitespace-nowrap shadow-lg border border-white/15"
              >
                <span>
                  {language === 'bn'
                    ? 'সহজ পাঠ ও এক্সেসিবিলিটি টুলস'
                    : 'Accessibility & Reading Tools'}
                </span>
                <span
                  aria-hidden="true"
                  className="absolute top-1/2 -right-1 -translate-y-1/2 w-2 h-2 rotate-45 bg-[#00523C]"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
