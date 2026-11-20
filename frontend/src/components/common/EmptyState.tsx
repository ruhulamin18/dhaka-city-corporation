import React from 'react';

export interface EmptyStateProps {
  message: string;
  bordered?: boolean;
  className?: string;
}

export function EmptyState({ message, bordered = true, className = '' }: EmptyStateProps) {
  return (
    <div
      className={`${
        bordered ? 'civic-card bg-white rounded-xl border border-[#E2E8F0]' : ''
      } p-8 sm:p-10 text-center text-sm text-[#4B5563] ${className}`.trim()}
    >
      {message}
    </div>
  );
}
