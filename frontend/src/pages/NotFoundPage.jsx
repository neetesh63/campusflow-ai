import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import TopNavbar from '../components/TopNavbar';
import { AlertCircle, Home, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-slate-950">
      <TopNavbar />

      <main className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center space-y-6 bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center mx-auto border border-rose-500/20">
            <AlertCircle className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h1 className="text-4xl font-black text-white">404</h1>
            <h2 className="text-lg font-bold text-slate-200">Page Not Found</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              The page you are looking for doesn't exist or has been moved to another route.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => navigate(-1)}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Go Back
            </button>
            <Link
              to="/"
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 transition-colors"
            >
              <Home className="w-4 h-4" /> Back to Home
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
