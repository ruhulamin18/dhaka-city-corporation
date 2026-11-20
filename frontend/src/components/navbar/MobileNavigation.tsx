'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import {
  ArrowRight,
  ChevronDown,
  Mail,
  PhoneCall,
  X,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { resolveServiceHref } from '@/config/status-config';
import { BrandSection } from './BrandSection';
import { LoginButton } from './LoginButton';
import { MAIN_NAV_CATEGORIES, NavLinkItem, TopNavCategory } from './navData';

interface MobileNavigationProps {
  isOpen: boolean;
  onClose: () => void;
  onItemAction: (item: NavLinkItem) => void;
  pathname: string;
}

interface MobileMenuAccordionProps {
  category: TopNavCategory;
  isExpanded: boolean;
  onToggle: () => void;
  onCloseDrawer: () => void;
  onItemAction: (item: NavLinkItem) => void;
  isActive: boolean;
  pathname: string;
}

function MobileMenuAccordion({
  category,
  isExpanded,
  onToggle,
  onCloseDrawer,
  onItemAction,
  isActive,
  pathname,
}: MobileMenuAccordionProps) {
  const { language } = useApp();
  const prefersReducedMotion = useReducedMotion();
  const [openSubGroupId, setOpenSubGroupId] = useState<string | null>(
    category.columns?.[0]?.id ?? null
  );

  const label = language === 'bn' ? category.labelBn : category.labelEn;

  if (category.href && !category.items && !category.columns) {
    return (
      <Link
        href={category.href}
        onClick={onCloseDrawer}
        className={`flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-semibold transition-colors ${
          isActive
            ? 'bg-[#ECFDF5] text-[#006A4E] border border-emerald-200/80'
            : 'text-[#111827] hover:bg-[#F8FAFC] hover:text-[#006A4E]'
        }`}
      >
        <span>{label}</span>
      </Link>
    );
  }

  return (
    <div className="border-b border-[#E2E8F0] last:border-b-0 py-0.5">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isExpanded}
        className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
          isExpanded || isActive
            ? 'text-[#006A4E] bg-[#ECFDF5]/70'
            : 'text-[#111827] hover:bg-[#F8FAFC] hover:text-[#006A4E]'
        }`}
      >
        <span>{label}</span>
        <ChevronDown
          className={`w-4 h-4 shrink-0 transition-transform duration-200 ${
            isExpanded ? 'rotate-180 text-[#006A4E]' : 'text-[#4B5563]'
          }`}
          aria-hidden="true"
        />
      </button>

      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={prefersReducedMotion ? { opacity: 1 } : { height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={prefersReducedMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.18 }}
            className="overflow-hidden"
          >
            {/* Nested Accordion for 4-column Citizen Services Mega Menu */}
            {category.columns ? (
              <div className="pl-2 pr-1 pt-1.5 pb-2.5 space-y-1.5">
                {category.columns.map((col) => {
                  const ColIcon = col.icon;
                  const subOpen = openSubGroupId === col.id;
                  return (
                    <div
                      key={col.id}
                      className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC]/70 overflow-hidden"
                    >
                      <button
                        type="button"
                        onClick={() =>
                          setOpenSubGroupId(subOpen ? null : col.id)
                        }
                        aria-expanded={subOpen}
                        className="w-full flex items-center justify-between gap-2 px-3 py-2.5 text-xs font-bold text-[#111827] hover:text-[#006A4E] cursor-pointer"
                      >
                        <span className="flex items-center gap-2 min-w-0">
                          <ColIcon
                            className="w-3.5 h-3.5 text-[#006A4E] shrink-0"
                            aria-hidden="true"
                          />
                          <span className="truncate">
                            {language === 'bn' ? col.titleBn : col.titleEn}
                          </span>
                        </span>
                        <ChevronDown
                          className={`w-3.5 h-3.5 text-[#4B5563] shrink-0 transition-transform ${
                            subOpen ? 'rotate-180 text-[#006A4E]' : ''
                          }`}
                          aria-hidden="true"
                        />
                      </button>

                      {subOpen && (
                        <ul className="px-2 pb-2 pt-1 space-y-0.5 bg-white border-t border-[#E2E8F0]">
                          {col.items.map((item) => {
                            const Icon = item.icon;
                            const itemLabel =
                              language === 'bn' ? item.labelBn : item.labelEn;
                            return (
                              <li key={item.id}>
                                <Link
                                  href={resolveServiceHref(item.href, item.serviceKey)}
                                  onClick={onCloseDrawer}
                                  className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] font-medium text-[#4B5563] hover:text-[#006A4E] hover:bg-[#ECFDF5] transition-colors"
                                >
                                  <Icon
                                    className="w-3.5 h-3.5 text-[#006A4E]/80 shrink-0"
                                    aria-hidden="true"
                                  />
                                  <span>{itemLabel}</span>
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </div>
                  );
                })}

                {category.footerCta && (
                  <Link
                    href={category.footerCta.href}
                    onClick={onCloseDrawer}
                    className="mt-1 flex items-center justify-between px-3 py-2.5 rounded-xl bg-[#ECFDF5] text-xs font-semibold text-[#006A4E] hover:bg-emerald-100 transition-colors"
                  >
                    <span>
                      {language === 'bn'
                        ? category.footerCta.labelBn
                        : category.footerCta.labelEn}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </Link>
                )}
              </div>
            ) : (
              <ul className="pl-3 pr-1 pt-1 pb-2.5 space-y-0.5">
                {category.items?.map((item) => {
                  const Icon = item.icon;
                  const itemLabel =
                    language === 'bn' ? item.labelBn : item.labelEn;
                  const isCrimson = item.accent === 'crimson';
                  const resolvedHref = resolveServiceHref(item.href, item.serviceKey);
                  const isItemActive = !item.action && pathname === resolvedHref;

                  const cls = `w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] transition-colors text-left ${
                    isCrimson
                      ? 'font-medium text-[#C81E1E] hover:bg-[#FEF2F2]'
                      : isItemActive
                        ? 'font-semibold bg-[#ECFDF5] text-[#006A4E]'
                        : 'font-medium text-[#4B5563] hover:text-[#006A4E] hover:bg-[#ECFDF5]'
                  }`;

                  return (
                    <li key={item.id}>
                      {item.action ? (
                        <button
                          type="button"
                          onClick={() => {
                            onItemAction(item);
                            onCloseDrawer();
                          }}
                          className={`${cls} cursor-pointer`}
                        >
                          <Icon
                            className={`w-3.5 h-3.5 shrink-0 ${
                              isCrimson ? 'text-[#C81E1E]' : 'text-[#006A4E]/80'
                            }`}
                            aria-hidden="true"
                          />
                          <span>{itemLabel}</span>
                        </button>
                      ) : (
                        <Link
                          href={resolvedHref}
                          aria-current={isItemActive ? 'page' : undefined}
                          onClick={onCloseDrawer}
                          className={cls}
                        >
                          <Icon
                            className={`w-3.5 h-3.5 shrink-0 ${
                              isCrimson
                                ? 'text-[#C81E1E]'
                                : isItemActive
                                  ? 'text-[#006A4E]'
                                  : 'text-[#006A4E]/80'
                            }`}
                            aria-hidden="true"
                          />
                          <span>{itemLabel}</span>
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function MobileNavigation({
  isOpen,
  onClose,
  onItemAction,
  pathname,
}: MobileNavigationProps) {
  const { language } = useApp();
  const prefersReducedMotion = useReducedMotion();
  const [expandedId, setExpandedId] = useState<string | null>('citizen-services');

  // Prevent background scrolling while drawer is open
  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 md:hidden"
          role="dialog"
          aria-modal="true"
          aria-label={
            language === 'bn' ? 'মোবাইল নেভিগেশন মেনু' : 'Mobile navigation menu'
          }
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.18 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#111827]/45 backdrop-blur-[1px]"
            aria-hidden="true"
          />

          {/* Slide-in Drawer Panel */}
          <motion.aside
            initial={prefersReducedMotion ? { opacity: 0 } : { x: '100%' }}
            animate={prefersReducedMotion ? { opacity: 1 } : { x: 0 }}
            exit={prefersReducedMotion ? { opacity: 0 } : { x: '100%' }}
            transition={{
              duration: prefersReducedMotion ? 0 : 0.22,
              ease: 'easeOut',
            }}
            className="fixed inset-y-0 right-0 w-full max-w-sm bg-white border-l border-[#E2E8F0] shadow-2xl flex flex-col"
          >
            {/* Drawer Header */}
            <div className="px-4 py-3.5 border-b border-[#E2E8F0] flex items-center justify-between gap-3 bg-white shrink-0">
              <BrandSection compact onNavigate={onClose} />
              <button
                type="button"
                onClick={onClose}
                aria-label={language === 'bn' ? 'মেনু বন্ধ করুন' : 'Close menu'}
                className="p-2 rounded-lg border border-[#E2E8F0] text-[#4B5563] hover:text-[#111827] hover:bg-[#F8FAFC] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Accordion Menus */}
            <nav
              className="flex-1 overflow-y-auto px-3 py-2"
              aria-label={
                language === 'bn' ? 'প্রধান মোবাইল মেনু' : 'Primary mobile navigation'
              }
            >
              {MAIN_NAV_CATEGORIES.map((cat) => {
                const isActive =
                  cat.href === '/'
                    ? pathname === '/'
                    : cat.matchPaths.some((p) => pathname.startsWith(p));
                return (
                  <MobileMenuAccordion
                    key={cat.id}
                    category={cat}
                    isExpanded={expandedId === cat.id}
                    onToggle={() =>
                      setExpandedId(expandedId === cat.id ? null : cat.id)
                    }
                    onCloseDrawer={onClose}
                    onItemAction={onItemAction}
                    isActive={isActive}
                    pathname={pathname}
                  />
                );
              })}
            </nav>

            {/* Drawer Footer: Login / Dashboard + Helpline */}
            <div className="p-4 border-t border-[#E2E8F0] bg-[#F8FAFC] space-y-3 shrink-0">
              <LoginButton variant="mobile" onNavigate={onClose} />

              <div className="flex items-center justify-between gap-2 pt-1 text-[11px] text-[#4B5563]">
                <a
                  href="tel:16106"
                  className="inline-flex items-center gap-1.5 font-semibold text-[#111827] hover:text-[#006A4E]"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-[#C81E1E]" />
                  <span>16106</span>
                </a>
                <a
                  href="mailto:info@dscc.smartcity.gov.bd"
                  className="inline-flex items-center gap-1 text-[#4B5563] hover:text-[#006A4E] truncate"
                >
                  <Mail className="w-3.5 h-3.5 text-[#006A4E] shrink-0" />
                  <span className="font-inter truncate">info@dscc.smartcity.gov.bd</span>
                </a>
              </div>
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
