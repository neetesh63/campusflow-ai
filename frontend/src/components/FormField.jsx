import React from 'react';

export default function FormField({ label, error, required, children, helperText }) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-xs font-semibold text-slate-300">
          {label} {required && <span className="text-rose-400">*</span>}
        </label>
      )}
      {children}
      {helperText && !error && (
        <p className="text-[11px] text-slate-400">{helperText}</p>
      )}
      {error && (
        <p className="text-[11px] text-rose-400 font-medium">{error}</p>
      )}
    </div>
  );
}
