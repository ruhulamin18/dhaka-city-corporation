'use client';

import React from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { resolveServiceHref } from '@/config/status-config';
import { MegaMenuColumn, NavLinkItem } from './navData';

interface MegaMenuProps {
  id: string;
  columns: MegaMenuColumn[];
  footerCta?: {
    labelEn: string;
    labelBn: string;
    href: string;
  };
  onClose: () => void;
  onItemAction: (item: NavLinkItem) => void;
}

export function MegaMenu({
  id,
  columns,
  footerCta,
  onClose,
  onItemAction,
}: MegaMenuProps) {
  const { language } = useApp();
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      id={id}
      role="region"
      aria-label={
        language === 'bn'
          ? 'নাগরিক সেবা মেগা মেনু'
          : 'Citizen Services Mega Menu'
      }
      initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 6 }}
      transition={{ duration: prefersReducedMotion ? 0 : 0.16, ease: 'easeOut' }}
      className="absolute left-0 right-0 top-full pt-1.5 z-50"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xl overflow-hidden">
          {/* Top thin civic green accent line */}
          <div className="h-0.5 w-full bg-[#006A4E]" aria-hidden="true" />

          {/* Four-Column Mega Menu Grid (2 cols on tablet, 4 cols on xl desktop) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x divide-[#E2E8F0]">
            {columns.map((column) => {
              const ColIcon = column.icon;
              return (
                <div key={column.id} className="p-4 xl:p-5">
                  <Link
                    href={`/citizen-services/${column.id}`}
                    onClick={onClose}
                    className="group/col flex items-center gap-2 pb-3 mb-2.5 border-b border-[#E2E8F0] hover:border-[#006A4E]/40 transition-colors"
                  >
                    <span className="w-7 h-7 rounded-lg bg-[#ECFDF5] text-[#006A4E] group-hover/col:bg-[#006A4E] group-hover/col:text-white flex items-center justify-center shrink-0 transition-colors">
                      <ColIcon className="w-4 h-4" aria-hidden="true" />
                    </span>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#111827] group-hover/col:text-[#006A4E] leading-snug transition-colors">
                      {language === 'bn' ? column.titleBn : column.titleEn}
                    </h3>
                  </Link>

                  <ul className="space-y-0.5" role="menu">
                    {column.items.map((item) => {
                      const ItemIcon = item.icon;
                      const label =
                        language === 'bn' ? item.labelBn : item.labelEn;

                      return (
                        <li key={item.id} role="none">
                          {item.action ? (
                            <button
                              type="button"
                              role="menuitem"
                              onClick={() => {
                                onItemAction(item);
                                onClose();
                              }}
                              className="group w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-[13px] font-medium text-[#4B5563] hover:text-[#006A4E] hover:bg-[#ECFDF5] transition-colors text-left cursor-pointer focus-visible:outline-2 focus-visible:outline-[#006A4E]"
                            >
                              <ItemIcon
                                className="w-3.5 h-3.5 text-[#4B5563]/80 group-hover:text-[#006A4E] shrink-0 transition-colors"
                                aria-hidden="true"
                              />
                              <span className="truncate">{label}</span>
                            </button>
                          ) : (
                            <Link
                              href={resolveServiceHref(item.href, item.serviceKey)}
                              role="menuitem"
                              onClick={onClose}
                              className="group flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-[13px] font-medium text-[#4B5563] hover:text-[#006A4E] hover:bg-[#ECFDF5] transition-colors focus-visible:outline-2 focus-visible:outline-[#006A4E]"
                            >
                              <ItemIcon
                                className="w-3.5 h-3.5 text-[#4B5563]/80 group-hover:text-[#006A4E] shrink-0 transition-colors"
                                aria-hidden="true"
                              />
                              <span className="truncate">{label}</span>
                            </Link>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })}
          </div>

          {/* Bottom Bar CTA */}
          {footerCta && (
            <div className="px-5 py-3 bg-[#F8FAFC] border-t border-[#E2E8F0] flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs text-[#4B5563]">
                {language === 'bn'
                  ? 'ঢাকা সিটি কর্পোরেশনের সকল ডিজিটাল নাগরিক সেবা এক পোর্টালে।'
                  : 'All Dhaka City Corporation digital citizen services in one portal.'}
              </p>
              <Link
                href={footerCta.href}
                onClick={onClose}
                className="group inline-flex items-center gap-1.5 text-xs sm:text-[13px] font-semibold text-[#006A4E] hover:text-[#00523C] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#006A4E] rounded"
              >
                <span>
                  {language === 'bn' ? footerCta.labelBn : footerCta.labelEn}
                </span>
                <ArrowRight
                  className="w-4 h-4 transition-transform group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </Link>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
