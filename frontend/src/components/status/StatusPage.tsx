'use client';

import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import {
  STATUS_PAGE_CONFIGS,
  StatusPageType,
} from '@/config/status-config';
import { StatusIllustration } from './StatusIllustration';
import { StatusMessage } from './StatusMessage';
import { StatusActions } from './StatusActions';

export interface StatusPageProps {
  type: StatusPageType;
  /** Optional service title shown subtly above heading when routed from a specific service */
  serviceNameBn?: string;
  serviceNameEn?: string;
  /** Optional actual scheduled maintenance completion time (never invent) */
  expectedCompletionTime?: string;
  /** Optional retry callback for error boundaries or failed API fetches */
  onRetry?: () => void | Promise<void>;
  /**
   * 'page' renders the full unified portal status page (default).
   * 'inline' renders a contained status card inside a single affected service section.
   */
  variant?: 'page' | 'inline';
}

export function StatusPage({
  type,
  serviceNameBn,
  serviceNameEn,
  expectedCompletionTime,
  onRetry,
  variant = 'page',
}: StatusPageProps) {
  const prefersReducedMotion = useReducedMotion();
  const config = STATUS_PAGE_CONFIGS[type];
  const isInline = variant === 'inline';

  const serviceContextLine =
    serviceNameBn && serviceNameEn
      ? `${serviceNameBn} · ${serviceNameEn}`
      : serviceNameBn || serviceNameEn || null;

  const content = (
    <motion.div
      initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: prefersReducedMotion ? 0 : 0.25, ease: [0.16, 1, 0.3, 1] }}
      className={`w-full mx-auto flex flex-col items-center text-center ${
        isInline ? 'max-w-xl py-8 px-5' : 'max-w-2xl'
      }`}
    >
      {/* Central Editorial Illustration */}
      <StatusIllustration
        src={config.illustrationSrc}
        alt={config.illustrationAlt}
        statusIcon={config.statusIcon}
        type={config.type}
        compact={isInline}
      />

      {/* Optional Unboxed Service Context Line */}
      {serviceContextLine && (
        <p className="mt-3 text-xs sm:text-sm font-medium text-[#087A5B] tracking-tight">
          {serviceContextLine}
        </p>
      )}

      {/* Primary Display Heading */}
      <h1
        className={`font-inter font-extrabold text-[#163B32] tracking-tight text-balance ${
          isInline
            ? 'mt-3 text-2xl sm:text-3xl'
            : 'mt-4 text-3xl sm:text-4xl lg:text-[42px] leading-[1.15]'
        }`}
      >
        {config.heading}
      </h1>

      {/* Bengali Description */}
      <p
        className={`font-bengali text-[#163B32]/90 leading-relaxed max-w-xl ${
          isInline ? 'mt-2.5 text-sm sm:text-base' : 'mt-3.5 text-base sm:text-lg'
        }`}
      >
        {config.descriptionBn}
      </p>

      {/* Soft Mint Status Information Container */}
      <div className={isInline ? 'mt-5 w-full' : 'mt-6 sm:mt-7 w-full'}>
        <StatusMessage
          message={config.statusMessage}
          icon={config.statusIcon}
          expectedCompletionTime={
            type === 'maintenance' ? expectedCompletionTime : undefined
          }
          compact={isInline}
        />
      </div>

      {/* Primary & Secondary Action Buttons */}
      <div className={isInline ? 'mt-5 w-full' : 'mt-6 sm:mt-7 w-full'}>
        <StatusActions
          primaryAction={config.primaryAction}
          secondaryAction={config.secondaryAction}
          onRetry={onRetry}
          compact={isInline}
        />
      </div>
    </motion.div>
  );

  if (isInline) {
    return (
      <section
        aria-label={config.heading}
        className="w-full rounded-2xl bg-white/95 border border-[#E5E7EB] shadow-xs"
      >
        {content}
      </section>
    );
  }

  return (
    <section
      aria-label={config.heading}
      className="relative w-full min-h-[calc(100vh-220px)] flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-16"
    >
      {/* Subtle airy white center halo so the illustration and typography stay razor-sharp while the Dhaka skyline shows cleanly along the lower horizon */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[72%] bg-gradient-to-b from-white/92 via-white/85 to-transparent"
      />

      <div className="relative z-10 w-full flex flex-col items-center justify-center">
        {content}
      </div>
    </section>
  );
}
