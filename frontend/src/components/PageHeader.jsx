import React from 'react';

export default function PageHeader({ title, subtitle, action }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-800/80 mb-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight">{title}</h1>
        {subtitle && (
          <p className="text-xs sm:text-sm text-slate-400 mt-1">{subtitle}</p>
        )}
      </div>
      {action && (
        <div className="shrink-0 flex items-center gap-3">
          {action}
        </div>
      )}
    </div>
  );
}
