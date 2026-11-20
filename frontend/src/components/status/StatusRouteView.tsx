'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  getServiceMetaByParam,
  StatusPageType,
} from '@/config/status-config';
import { StatusPage } from './StatusPage';

interface StatusRouteViewProps {
  type: StatusPageType;
}

function StatusRouteContent({ type }: StatusRouteViewProps) {
  const searchParams = useSearchParams();
  const serviceParam = searchParams.get('service');
  const untilParam = searchParams.get('until');
  const serviceMeta = getServiceMetaByParam(serviceParam);

  const expectedCompletionTime =
    type === 'maintenance'
      ? untilParam || serviceMeta?.expectedCompletionTime
      : undefined;

  return (
    <StatusPage
      type={type}
      serviceNameBn={serviceMeta?.nameBn}
      serviceNameEn={serviceMeta?.nameEn}
      expectedCompletionTime={expectedCompletionTime}
    />
  );
}

export function StatusRouteView({ type }: StatusRouteViewProps) {
  return (
    <Suspense fallback={<StatusPage type={type} />}>
      <StatusRouteContent type={type} />
    </Suspense>
  );
}
