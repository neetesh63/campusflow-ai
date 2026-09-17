import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

export default function ErrorState({ title = "Something went wrong", message = "Failed to load requested information.", onRetry }) {
  return (
    <div className="p-8 text-center bg-rose-950/20 border border-rose-500/30 rounded-3xl flex flex-col items-center justify-center max-w-lg mx-auto my-6">
      <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center mb-3">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h3 className="text-sm font-bold text-rose-300">{title}</h3>
      <p className="text-xs text-rose-200/80 mt-1 max-w-sm">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold flex items-center gap-2 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Try Again
        </button>
      )}
    </div>
  );
}
