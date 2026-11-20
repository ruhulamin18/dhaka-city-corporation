'use client';

import React from 'react';
import {
  getServiceStatus,
  SERVICE_METADATA,
  ServiceKey,
} from '@/config/status-config';
import { StatusPage } from './StatusPage';

interface ServiceStatusGuardProps {
  serviceKey: ServiceKey;
  children: React.ReactNode;
}

/**
 * Reusable route-level service availability guard.
 * Reads directly from centralized serviceStatus config — zero duplicated logic.
 */
export function ServiceStatusGuard({
  serviceKey,
  children,
}: ServiceStatusGuardProps) {
  const status = getServiceStatus(serviceKey);

  if (status === 'active') {
    return <>{children}</>;
  }

  const meta = SERVICE_METADATA[serviceKey];

  return (
    <StatusPage
      type={status}
      serviceNameBn={meta.nameBn}
      serviceNameEn={meta.nameEn}
      expectedCompletionTime={meta.expectedCompletionTime}
    />
  );
}
