import React from 'react';
import Modal from './Modal';
import { AlertTriangle } from 'lucide-react';

export default function ConfirmDialog({ isOpen, onClose, onConfirm, title = "Confirm Action", message = "Are you sure you want to perform this destructive action?", confirmText = "Confirm", confirmVariant = "danger" }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="max-w-md">
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-2xl bg-rose-500/10 text-rose-400 shrink-0 border border-rose-500/20">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <div>
          <p className="text-sm text-slate-300">{message}</p>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-3">
        <button
          onClick={onClose}
          className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={() => { onConfirm(); onClose(); }}
          className={`px-4 py-2 text-xs font-semibold rounded-xl text-white transition-colors ${
            confirmVariant === 'danger'
              ? 'bg-rose-600 hover:bg-rose-500 shadow-lg shadow-rose-600/20'
              : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/20'
          }`}
        >
          {confirmText}
        </button>
      </div>
    </Modal>
  );
}
