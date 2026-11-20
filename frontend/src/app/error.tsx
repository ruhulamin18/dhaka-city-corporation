'use client';

import React, { useEffect } from 'react';
import { StatusPage } from '@/components/status/StatusPage';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    // Log internally for diagnostics without exposing technical details in the UI
    if (process.env.NODE_ENV === 'development') {
      console.error('Application route error boundary triggered:', error.digest ?? 'unknown');
    }
  }, [error]);

  return <StatusPage type="server-error" onRetry={reset} />;
}
