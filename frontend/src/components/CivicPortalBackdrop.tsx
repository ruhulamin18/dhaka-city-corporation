'use client';

import React from 'react';
import { usePathname } from 'next/navigation';

/**
 * Unified Bangladesh Government Civic Portal Background
 * Renders /images/page-bg.png across every page as a crisp, fixed full-viewport backdrop
 * while maintaining clean contrast and readability for all cards and typography.
 */
export function CivicPortalBackdrop() {
  const pathname = usePathname();
  if (
    pathname === '/citizen' ||
    pathname.startsWith('/citizen/') ||
    pathname === '/admin' ||
    pathname.startsWith('/admin/')
  ) {
    return null;
  }

  return (
    <div
      aria-hidden="true"
      className="civic-bg-layer no-print fixed inset-0 z-0 pointer-events-none select-none overflow-hidden bg-[#F8FAFC]"
    >
      <div className="absolute inset-0 bg-[url('/images/page-bg.png')] bg-cover bg-bottom bg-no-repeat" />
    </div>
  );
}

/**
 * Clean breathing space and national green-crimson-green accent trim sitting flush
 * above the Footer so the unified page-bg.png skyline horizon remains clearly visible on every page.
 */
export function CivicSkylineBand() {
  const pathname = usePathname();
  if (
    pathname === '/citizen' ||
    pathname.startsWith('/citizen/') ||
    pathname === '/admin' ||
    pathname.startsWith('/admin/')
  ) {
    return null;
  }

  return (
    <div
      aria-hidden="true"
      className="civic-bg-layer no-print relative z-10 w-full mt-12 pointer-events-none select-none"
    >
      <div className="w-full h-16 sm:h-24 lg:h-28" />
      <div className="h-1 w-full bg-gradient-to-r from-[#006A4E] via-[#C81E1E] to-[#006A4E] opacity-85" />
    </div>
  );
}
