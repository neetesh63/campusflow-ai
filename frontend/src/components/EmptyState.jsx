import React from 'react';
import { Inbox } from 'lucide-react';

export default function EmptyState({ title = "No data found", description = "There are no records available at this time.", icon: Icon = Inbox, actionButton }) {
  return (
    <div className="p-12 text-center bg-slate-900/60 border border-slate-800 rounded-3xl flex flex-col items-center justify-center max-w-lg mx-auto my-6">
      <div className="w-16 h-16 rounded-2xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center text-slate-400 mb-4">
        <Icon className="w-8 h-8 text-slate-400" />
      </div>
      <h3 className="text-base font-bold text-slate-200">{title}</h3>
      <p className="text-xs text-slate-400 mt-1 max-w-sm">{description}</p>
      {actionButton && (
        <div className="mt-5">{actionButton}</div>
      )}
    </div>
  );
}
