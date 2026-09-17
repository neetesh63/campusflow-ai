import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import TopNavbar from '../components/TopNavbar';
import {
  Sparkles,
  BrainCircuit,
  CalendarCheck2,
  PackageSearch,
  BookOpenCheck,
  ArrowLeft,
  ShieldCheck
} from 'lucide-react';

export default function AICapabilitiesPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-cyan-500 selection:text-slate-950 flex flex-col">
      <TopNavbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        <div className="space-y-4">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-cyan-400" /> Back
          </button>

          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold">
              <Sparkles className="w-4 h-4" /> Google Gemini API Powered
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">AI Capabilities</h1>
            <p className="text-slate-400 text-sm">
              Discover the intelligent features integrated into CampusFlow AI to assist students and optimize administration.
            </p>
          </div>
        </div>

        {/* AI Capabilities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center border border-cyan-500/20">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">AI Campus Assistant</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Provides real-time answers for student queries regarding attendance, pending assignments, college notices, upcoming events, and study tips.
            </p>
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] text-cyan-300 space-y-1">
              <p className="font-bold text-slate-200">Sample Questions:</p>
              <p>• "What is my attendance percentage?"</p>
              <p>• "Which assignments are pending this week?"</p>
              <p>• "What are the latest college notices?"</p>
            </div>
          </div>

          <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20">
              <BookOpenCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Smart Study Scheduler</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Generates customized daily revision schedules and assignment completion plans based on assignment deadlines, priority, and available study hours.
            </p>
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] text-purple-300 space-y-1">
              <p className="font-bold text-slate-200">Key Features:</p>
              <p>• Priority-weighted time allocation</p>
              <p>• Pomodoro session recommendations</p>
              <p>• Realistic daily study hour bounds</p>
            </div>
          </div>

          <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
              <PackageSearch className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">AI Lost & Found Matcher</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Analyzes reported lost items and found items to suggest probable matches based on description, location, category, and date parameters.
            </p>
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] text-amber-300 space-y-1">
              <p className="font-bold text-slate-200">Safety Policy:</p>
              <p>• Match confidence scores (50% - 99%)</p>
              <p>• Suggestions only — never automatically marks returned</p>
              <p>• Protects student contact details</p>
            </div>
          </div>

          <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <CalendarCheck2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Attendance Risk Predictor</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Uses transparent mathematical formulas to forecast required upcoming consecutive classes and maximum skippable sessions for a target 75% threshold.
            </p>
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] text-emerald-300 space-y-1">
              <p className="font-bold text-slate-200">Risk Classifications:</p>
              <p>• Safe (85%+ Attendance)</p>
              <p>• Warning (75% - 84% Attendance)</p>
              <p>• Critical (&lt;75% Eligibility Warning)</p>
            </div>
          </div>
        </div>

        {/* Try AI Assistant Button */}
        <div className="text-center pt-4">
          <Link
            to="/ai-assistant"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-xl shadow-cyan-500/20 transition-all"
          >
            <Sparkles className="w-4 h-4 text-slate-950 fill-current" />
            <span>Launch AI Campus Assistant</span>
          </Link>
        </div>
      </main>
    </div>
  );
}
