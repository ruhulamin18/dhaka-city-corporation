'use client';

import { useSyncExternalStore } from 'react';

const emptySubscribe = () => () => {};

/**
 * Hydration-safe client mount guard without triggering cascading setState effects.
 * Used for browser-only visualizations (e.g., Recharts ResponsiveContainer).
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}
