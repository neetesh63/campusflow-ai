import React from 'react';
import { Loader2 } from 'lucide-react';

export default function LoadingSpinner({ text = "Loading CampusFlow AI...", fullScreen = false }) {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-10 h-10 text-cyan-400 animate-spin" />
        <p className="text-sm font-semibold text-slate-300 animate-pulse">{text}</p>
      </div>
    );
  }

  return (
    <div className="p-8 flex flex-col items-center justify-center gap-3 w-full">
      <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
      <p className="text-xs font-semibold text-slate-400">{text}</p>
    </div>
  );
}
