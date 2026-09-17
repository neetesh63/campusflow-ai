import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import TopNavbar from '../components/TopNavbar';
import {
  Sparkles,
  ArrowLeft,
  UserCheck,
  CalendarCheck2,
  BrainCircuit,
  CheckCircle2,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export default function HowItWorksPage() {
  const navigate = useNavigate();

  const steps = [
    {
      step: '01',
      title: 'Sign In or Quick Demo Account',
      description: 'Log in using your registered Supabase credentials or select 1-click Demo Mode (Student, Faculty, or Admin) to explore the system instantly.',
      icon: UserCheck,
      color: 'cyan'
    },
    {
      step: '02',
      title: 'Access Real-Time Academic Modules',
      description: 'Track course attendance, view pending assignments, browse notices, register for campus events, or submit complaint tickets directly from your dashboard.',
      icon: CalendarCheck2,
      color: 'blue'
    },
    {
      step: '03',
      title: 'Leverage AI & Placement Tools',
      description: 'Use the Google Gemini AI Assistant for campus queries, generate custom study schedules, calculate attendance risk buffers, and track placement prep progress.',
      icon: BrainCircuit,
      color: 'purple'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-cyan-500 selection:text-slate-950 flex flex-col">
      <TopNavbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* Header & Back Button */}
        <div className="space-y-4">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-cyan-400" /> Back
          </button>

          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold">
              <Sparkles className="w-4 h-4" /> Workflow Architecture
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">How CampusFlow AI Works</h1>
            <p className="text-slate-400 text-sm">
              Discover how our platform connects students, faculty, and administrators into a seamless digital campus experience.
            </p>
          </div>
        </div>

        {/* Step Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div
                key={idx}
                className="p-8 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col justify-between relative overflow-hidden group hover:border-cyan-500/40 transition-all shadow-xl"
              >
                <span className="absolute -top-2 -right-2 text-7xl font-black text-slate-800/40 select-none group-hover:text-cyan-500/10 transition-colors">
                  {s.step}
                </span>

                <div className="space-y-4 relative z-10">
                  <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center border border-cyan-500/20">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white">{s.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{s.description}</p>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-800/80 flex items-center text-xs font-bold text-cyan-400 gap-1">
                  <span>Step {s.step} Process</span>
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Call to Action */}
        <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 text-center space-y-4 max-w-3xl mx-auto">
          <h2 className="text-xl font-bold text-white">Ready to explore CampusFlow AI?</h2>
          <p className="text-xs text-slate-400">Sign in with an instant Demo account or create your new profile today.</p>
          <div className="flex justify-center gap-4 pt-2">
            <Link
              to="/register"
              className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold shadow-lg shadow-cyan-500/20 transition-all"
            >
              Get Started Free
            </Link>
            <Link
              to="/login"
              className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-all"
            >
              Sign In
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
