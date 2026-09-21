import React from 'react';
import PublicNavbar from '../components/PublicNavbar';
import { Sparkles, ShieldCheck, Code, Cpu, Server, Database, BrainCircuit, Globe, Layers } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-cyan-500 selection:text-slate-950 flex flex-col">
      <PublicNavbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold mb-4">
            <Sparkles className="w-4 h-4" /> Technical Project Architecture
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">About CampusFlow AI</h1>
          <p className="mt-4 text-slate-300 text-sm max-w-2xl mx-auto">
            CampusFlow AI is an end-to-end intelligent campus management platform created for college semester submissions, IBM internship evaluations, and enterprise campus deployment.
          </p>
        </div>

        {/* Tech Stack Cards */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 text-center">
            <Code className="w-8 h-8 text-cyan-400 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-white">Frontend Stack</h3>
            <p className="text-xs text-slate-400 mt-1">React 19, Vite, Tailwind CSS, Axios, Lucide React</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 text-center">
            <Server className="w-8 h-8 text-blue-400 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-white">Backend Layer</h3>
            <p className="text-xs text-slate-400 mt-1">Node.js, Express.js REST API, Helmet, CORS, Morgan</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 text-center">
            <Database className="w-8 h-8 text-emerald-400 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-white">Database & Auth</h3>
            <p className="text-xs text-slate-400 mt-1">Supabase PostgreSQL, Supabase Auth, Row Level Security</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 text-center">
            <BrainCircuit className="w-8 h-8 text-purple-400 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-white">Artificial Intelligence</h3>
            <p className="text-xs text-slate-400 mt-1">Google Gemini API with Graceful Intelligent Fallback</p>
          </div>
        </div>

        {/* Project Highlights */}
        <div className="mt-12 p-8 rounded-3xl bg-slate-900/60 border border-slate-800">
          <h2 className="text-xl font-bold text-white mb-4">Key Architectural Principles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-300">
            <div className="flex gap-3">
              <ShieldCheck className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-100 block text-sm">Role-Based Access Control (RBAC)</strong>
                Strict security segregation between Student, Faculty, and Administrator API endpoints and UI views.
              </div>
            </div>

            <div className="flex gap-3">
              <Globe className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-100 block text-sm">High Availability & Graceful Fallbacks</strong>
                Features robust AI fallback response generators so key features remain operational under network constraints.
              </div>
            </div>

            <div className="flex gap-3">
              <Layers className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-100 block text-sm">Modern SaaS Aesthetic</strong>
                Designed with dark slate tones, cyan accents, glassmorphism, responsive sidebar, toast notifications, and modal dialogs.
              </div>
            </div>

            <div className="flex gap-3">
              <Cpu className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-100 block text-sm">Deployment Ready</strong>
                Pre-configured for frontend hosting on Vercel, backend API on Render, and database on Supabase.
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
