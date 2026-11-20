'use client';

import React from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'motion/react';
import { useApp } from '@/context/AppContext';
import { resolveServiceHref } from '@/config/status-config';
import { NavLinkItem } from './navData';

interface DropdownMenuProps {
  id: string;
  titleEn: string;
  titleBn: string;
  items: NavLinkItem[];
  align?: 'left' | 'right';
  pathname: string;
  onClose: () => void;
  onItemAction: (item: NavLinkItem) => void;
}

export function DropdownMenu({
  id,
  titleEn,
  titleBn,
  items,
  align = 'left',
  pathname,
  onClose,
  onItemAction,
}: DropdownMenuProps) {
  const { language } = useApp();
  const prefersReducedMotion = useReducedMotion();
  const isTwoColumn = items.length > 8;

  return (
    <motion.div
      id={id}
      role="menu"
      aria-label={language === 'bn' ? titleBn : titleEn}
      initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 6 }}
      transition={{ duration: prefersReducedMotion ? 0 : 0.15, ease: 'easeOut' }}
      className={`absolute top-full pt-2 z-50 ${
        align === 'right' ? 'right-0' : 'left-0'
      }`}
    >
      <div
        className={`bg-white rounded-xl border border-[#E2E8F0] shadow-xl overflow-hidden ${
          isTwoColumn ? 'w-[460px] xl:w-[510px]' : 'w-[280px] xl:w-[300px]'
        } max-w-[calc(100vw-2rem)]`}
      >
        {/* Top thin civic green bar */}
        <div className="h-0.5 w-full bg-[#006A4E]" aria-hidden="true" />

        {/* Subtle Category Header */}
        <div className="px-4 py-2.5 bg-[#F8FAFC] border-b border-[#E2E8F0]">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#006A4E]">
            {language === 'bn' ? titleBn : titleEn}
          </p>
        </div>

        {/* Menu Items */}
        <ul
          className={`p-2 ${
            isTwoColumn ? 'grid grid-cols-2 gap-x-1 gap-y-0.5' : 'space-y-0.5'
          }`}
        >
          {items.map((item) => {
            const Icon = item.icon;
            const label = language === 'bn' ? item.labelBn : item.labelEn;
            const isCrimson = item.accent === 'crimson';
            const resolvedHref = resolveServiceHref(item.href, item.serviceKey);
            const isItemActive = !item.action && pathname === resolvedHref;

            const itemClassName = `group w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] transition-colors text-left focus-visible:outline-2 focus-visible:outline-[#006A4E] ${
              isCrimson
                ? 'font-medium text-[#C81E1E] hover:bg-[#FEF2F2]'
                : isItemActive
                  ? 'font-semibold bg-[#ECFDF5] text-[#006A4E]'
                  : 'font-medium text-[#4B5563] hover:text-[#006A4E] hover:bg-[#ECFDF5]'
            }`;

            const iconClassName = `w-4 h-4 shrink-0 transition-colors ${
              isCrimson
                ? 'text-[#C81E1E]'
                : isItemActive
                  ? 'text-[#006A4E]'
                  : 'text-[#4B5563]/80 group-hover:text-[#006A4E]'
            }`;

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
                    className={`${itemClassName} cursor-pointer`}
                  >
                    <Icon className={iconClassName} aria-hidden="true" />
                    <span className="truncate">{label}</span>
                  </button>
                ) : (
                  <Link
                    href={resolvedHref}
                    role="menuitem"
                    aria-current={isItemActive ? 'page' : undefined}
                    onClick={onClose}
                    className={itemClassName}
                  >
                    <Icon className={iconClassName} aria-hidden="true" />
                    <span className="truncate">{label}</span>
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </motion.div>
  );
}
