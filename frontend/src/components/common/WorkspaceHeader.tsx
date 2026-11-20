import React from 'react';
import { ShieldCheck } from 'lucide-react';

export interface WorkspaceHeaderProps {
  kicker: string;
  title: string;
  userName: string;
  userMeta: string;
  actions?: React.ReactNode;
}

export function WorkspaceHeader({
  kicker,
  title,
  userName,
  userMeta,
  actions,
}: WorkspaceHeaderProps) {
  return (
    <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <p className="text-xs font-semibold text-[#006A4E]">{kicker}</p>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#111827] mt-0.5">{title}</h1>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {actions}
        <div className="flex items-center gap-3 bg-[#ECFDF5] border border-emerald-200 rounded-lg px-4 py-2.5 text-xs">
          <ShieldCheck className="w-4 h-4 text-[#006A4E] shrink-0" aria-hidden="true" />
          <div>
            <p className="font-bold text-[#111827]">{userName}</p>
            <p className="font-mono text-[#4B5563]">{userMeta}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
