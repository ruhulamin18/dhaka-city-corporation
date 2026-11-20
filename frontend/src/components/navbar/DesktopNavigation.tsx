'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { AnimatePresence } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { DropdownMenu } from './DropdownMenu';
import { MAIN_NAV_CATEGORIES, NavLinkItem, TopNavCategory } from './navData';

interface DesktopNavigationProps {
  pathname: string;
  openMenuId: string | null;
  onOpenMenu: (id: string) => void;
  onScheduleClose: () => void;
  onCancelClose: () => void;
  onToggleMenu: (id: string) => void;
  onCloseAll: () => void;
  onItemAction: (item: NavLinkItem) => void;
}

export function DesktopNavigation({
  pathname,
  openMenuId,
  onOpenMenu,
  onScheduleClose,
  onCancelClose,
  onToggleMenu,
  onCloseAll,
  onItemAction,
}: DesktopNavigationProps) {
  const { language } = useApp();
  const triggerRefs = useRef<Array<HTMLElement | null>>([]);

  const handleKeyDown = (
    e: React.KeyboardEvent,
    category: TopNavCategory,
    index: number
  ) => {
    if (e.key === 'Escape') {
      onCloseAll();
      return;
    }

    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      e.preventDefault();
      const step = e.key === 'ArrowRight' ? 1 : -1;
      const total = MAIN_NAV_CATEGORIES.length;
      for (let offset = 1; offset <= total; offset++) {
        const candidateIdx = (index + step * offset + total) % total;
        const el = triggerRefs.current[candidateIdx];
        if (el && el.offsetParent !== null) {
          el.focus();
          break;
        }
      }
      return;
    }

    if (
      (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') &&
      (category.items || category.columns)
    ) {
      e.preventDefault();
      onOpenMenu(category.id);
    }
  };

  return (
    <nav
      aria-label={language === 'bn' ? 'প্রধান নেভিগেশন' : 'Primary navigation'}
      className="hidden md:flex items-center justify-center min-w-0 flex-1"
    >
      <ul
        className="flex flex-wrap lg:flex-nowrap items-center justify-center gap-x-1 gap-y-1 xl:gap-x-1.5"
        role="menubar"
      >
        {MAIN_NAV_CATEGORIES.map((category, index) => {
          const label = language === 'bn' ? category.labelBn : category.labelEn;
          const isOpen = openMenuId === category.id;
          const hasDropdown = Boolean(category.items || category.columns);
          const isActive =
            category.href === '/'
              ? pathname === '/'
              : category.matchPaths.some((p) => pathname.startsWith(p));

          const baseTriggerClass = `relative inline-flex items-center gap-1 xl:gap-1.5 px-2 xl:px-2.5 2xl:px-3 py-1.5 lg:py-2 rounded-lg text-[12px] xl:text-[13px] 2xl:text-[14px] font-bold transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#006A4E] ${
            isOpen || isActive
              ? 'text-[#006A4E] font-bold bg-[#ECFDF5]/70'
              : 'text-[#111827] hover:text-[#006A4E] hover:bg-[#ECFDF5]/60'
          }`;

          return (
            <li
              key={category.id}
              role="none"
              className={`flex ${
                category.isMega ? 'static' : 'relative'
              } items-center`}
              onMouseEnter={() => {
                if (hasDropdown) {
                  onCancelClose();
                  onOpenMenu(category.id);
                } else {
                  onCloseAll();
                }
              }}
              onMouseLeave={() => {
                if (hasDropdown) {
                  onScheduleClose();
                }
              }}
            >
              {category.href && !hasDropdown ? (
                <Link
                  ref={(el) => {
                    triggerRefs.current[index] = el;
                  }}
                  href={category.href}
                  role="menuitem"
                  onClick={onCloseAll}
                  onKeyDown={(e) => handleKeyDown(e, category, index)}
                  className={baseTriggerClass}
                >
                  <span>{label}</span>
                  {isActive && (
                    <span
                      aria-hidden="true"
                      className="absolute left-1.5 right-1.5 bottom-0.5 h-0.5 rounded-full bg-[#006A4E]"
                    />
                  )}
                </Link>
              ) : (
                <button
                  ref={(el) => {
                    triggerRefs.current[index] = el;
                  }}
                  type="button"
                  role="menuitem"
                  aria-haspopup="true"
                  aria-expanded={isOpen}
                  aria-controls={`nav-panel-${category.id}`}
                  onClick={() => onToggleMenu(category.id)}
                  onKeyDown={(e) => handleKeyDown(e, category, index)}
                  className={`${baseTriggerClass} cursor-pointer`}
                >
                  <span>{label}</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 xl:w-4 xl:h-4 stroke-[2.2] shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-[#006A4E]' : 'text-slate-600'
                    }`}
                    aria-hidden="true"
                  />
                  {(isActive || isOpen) && (
                    <span
                      aria-hidden="true"
                      className="absolute left-1.5 right-1.5 bottom-0.5 h-0.5 rounded-full bg-[#006A4E]"
                    />
                  )}
                </button>
              )}

              {/* Standard Dropdown Menu (non-mega items) */}
              {!category.isMega && category.items && (
                <AnimatePresence>
                  {isOpen && (
                    <DropdownMenu
                      id={`nav-panel-${category.id}`}
                      titleEn={category.labelEn}
                      titleBn={category.labelBn}
                      items={category.items}
                      align={category.align}
                      pathname={pathname}
                      onClose={onCloseAll}
                      onItemAction={onItemAction}
                    />
                  )}
                </AnimatePresence>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
