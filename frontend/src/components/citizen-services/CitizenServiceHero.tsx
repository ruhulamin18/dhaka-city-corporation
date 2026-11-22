'use client';

import React from 'react';
import Image from 'next/image';

interface CitizenServiceHeroProps {
  children: React.ReactNode;
  innerClassName?: string;
}

export function CitizenServiceHero({
  children,
  innerClassName = 'mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16',
}: CitizenServiceHeroProps) {
  return (
    <div className="relative overflow-hidden text-white">
      {/* Background Hero Image with Non-distorted Fit & Smooth Aspect Handling */}
      <div
        className="absolute inset-0 pointer-events-none select-none overflow-hidden"
        aria-hidden="true"
      >
        <Image
          src="/images/citizen-services-hero.png"
          alt="Dhaka Smart City Corporation Citizen Services Hero Banner"
          fill
          priority
          sizes="100vw"
          referrerPolicy="no-referrer"
          className="object-cover object-center select-none"
        />
        {/* Subtle Bangladesh Civic Green Gradient Overlay for High-Contrast Text Legibility */}
        <div
          className="absolute inset-0 bg-gradient-to-r from-[#004D38]/75 via-[#006A4E]/60 to-[#003D2D]/70"
          aria-hidden="true"
        />
      </div>

      {/* Foreground Content - Exact Heights & Responsive Spacing Preserved */}
      <div className={`relative z-10 ${innerClassName}`}>
        {children}
      </div>
    </div>
  );
}

export default CitizenServiceHero;
