'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { AnimatePresence } from 'motion/react';
import { Globe, Menu, X } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { UtilityBar } from './navbar/UtilityBar';
import { BrandSection } from './navbar/BrandSection';
import { DesktopNavigation } from './navbar/DesktopNavigation';
import { MegaMenu } from './navbar/MegaMenu';
import { LoginButton } from './navbar/LoginButton';
import { MobileNavigation } from './navbar/MobileNavigation';
import { MAIN_NAV_CATEGORIES, NavLinkItem } from './navbar/navData';

export function Navbar() {
  const pathname = usePathname();
  const { language, setLanguage } = useApp();

  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const headerRef = useRef<HTMLElement>(null);
  const closeTimerRef = useRef<number | null>(null);

  const cancelScheduledClose = useCallback(() => {
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  const closeAllMenus = useCallback(() => {
    cancelScheduledClose();
    setOpenMenuId(null);
  }, [cancelScheduledClose]);

  const scheduleClose = useCallback(() => {
    cancelScheduledClose();
    closeTimerRef.current = window.setTimeout(() => {
      setOpenMenuId(null);
    }, 130);
  }, [cancelScheduledClose]);

  const handleOpenMenu = useCallback(
    (id: string) => {
      cancelScheduledClose();
      setOpenMenuId(id);
    },
    [cancelScheduledClose]
  );

  const handleToggleMenu = useCallback(
    (id: string) => {
      cancelScheduledClose();
      setOpenMenuId((prev) => (prev === id ? null : id));
    },
    [cancelScheduledClose]
  );

  const handleItemAction = useCallback((item: Pick<NavLinkItem, 'action'>) => {
    if (item.action === 'openAssistant') {
      window.dispatchEvent(new CustomEvent('dscc:open-ai-assistant'));
    }
  }, []);

  // Close menus on click outside or Escape key
  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (
        headerRef.current &&
        !headerRef.current.contains(event.target as Node)
      ) {
        setOpenMenuId(null);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpenMenuId(null);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Cleanup hover timer on unmount
  useEffect(() => {
    return () => {
      if (closeTimerRef.current !== null) {
        window.clearTimeout(closeTimerRef.current);
      }
    };
  }, []);

  if (
    pathname === '/citizen' ||
    pathname.startsWith('/citizen/') ||
    pathname === '/admin' ||
    (pathname.startsWith('/admin/') && !pathname.startsWith('/admin/login'))
  ) {
    return null;
  }

  const activeMegaCategory = MAIN_NAV_CATEGORIES.find(
    (cat) => cat.id === openMenuId && cat.isMega && cat.columns
  );

  return (
    <>
      {/* A. Top Utility Bar (Deep Bangladesh Civic Green #006A4E) */}
      <UtilityBar />

      {/* B. Main Sticky Navigation Bar (Pure White Surface with Subtle Backdrop Blur) */}
      <header
        ref={headerRef}
        className="no-print sticky top-0 z-40 bg-white/95 backdrop-blur-md text-[#111827] border-b border-[#E2E8F0] shadow-xs"
      >
        <div className="max-w-[1440px] mx-auto px-3 sm:px-5 lg:px-6 xl:px-8 min-h-[68px] md:min-h-[76px] lg:h-[84px] xl:h-[90px] 2xl:h-[94px] py-1.5 lg:py-0 flex items-center justify-between gap-2 xl:gap-3">
          {/* Left Section — Branding */}
          <BrandSection onNavigate={closeAllMenus} />

          {/* Center Section — Main Navigation on All Laptops & Desktops (md+) */}
          <DesktopNavigation
            pathname={pathname}
            openMenuId={openMenuId}
            onOpenMenu={handleOpenMenu}
            onScheduleClose={scheduleClose}
            onCancelClose={cancelScheduledClose}
            onToggleMenu={handleToggleMenu}
            onCloseAll={closeAllMenus}
            onItemAction={handleItemAction}
          />

          {/* Right Section — Language Convert & Login / Citizen Portal & Mobile Drawer Trigger */}
          <div className="flex items-center gap-2 xl:gap-2.5 shrink-0">
            {/* Bangla to English Convert Button */}
            <button
              type="button"
              onClick={() => setLanguage(language === 'bn' ? 'en' : 'bn')}
              className="inline-flex items-center gap-1.5 min-h-[44px] sm:min-h-[38px] px-3 py-1.5 rounded-lg border border-[#CBD5E1] bg-slate-50 hover:bg-[#ECFDF5] hover:border-[#006A4E] text-xs font-bold text-[#111827] hover:text-[#006A4E] transition-all cursor-pointer shadow-2xs focus-visible:outline-2 focus-visible:outline-[#006A4E]"
              title={
                language === 'bn'
                  ? 'ইংরেজিতে পরিবর্তন করুন (Switch to English)'
                  : 'বাংলায় পরিবর্তন করুন (Switch to Bangla)'
              }
              aria-label={
                language === 'bn'
                  ? 'Switch to English'
                  : 'বাংলায় পরিবর্তন করুন'
              }
            >
              <Globe className="w-3.5 h-3.5 text-[#006A4E] shrink-0" aria-hidden="true" />
              <span className="font-bold tracking-tight">
                {language === 'bn' ? 'English' : 'বাংলা'}
              </span>
            </button>

            <LoginButton variant="desktop" onNavigate={closeAllMenus} />

            {/* Mobile-Only Hamburger Trigger (Never shown on laptops md+) */}
            <button
              type="button"
              onClick={() => {
                closeAllMenus();
                setMobileOpen((prev) => !prev);
              }}
              aria-expanded={mobileOpen}
              aria-label={
                language === 'bn'
                  ? 'নেভিগেশন মেনু খুলুন'
                  : 'Toggle navigation menu'
              }
              className="md:hidden inline-flex items-center justify-center min-h-[44px] min-w-[44px] gap-1.5 p-2 rounded-lg border border-[#E2E8F0] text-[#111827] hover:bg-[#ECFDF5] hover:text-[#006A4E] hover:border-emerald-200 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#006A4E]"
            >
              {mobileOpen ? (
                <X className="w-5 h-5" aria-hidden="true" />
              ) : (
                <Menu className="w-5 h-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Four-Column Citizen Services Mega Menu (Full-Width Aligned to Header) */}
        <AnimatePresence>
          {activeMegaCategory?.columns && (
            <div
              onMouseEnter={cancelScheduledClose}
              onMouseLeave={scheduleClose}
            >
              <MegaMenu
                id={`nav-panel-${activeMegaCategory.id}`}
                columns={activeMegaCategory.columns}
                footerCta={activeMegaCategory.footerCta}
                onClose={closeAllMenus}
                onItemAction={handleItemAction}
              />
            </div>
          )}
        </AnimatePresence>
      </header>

      {/* Slide-In Mobile Navigation Drawer (< lg only) */}
      <MobileNavigation
        isOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        onItemAction={handleItemAction}
        pathname={pathname}
      />
    </>
  );
}
