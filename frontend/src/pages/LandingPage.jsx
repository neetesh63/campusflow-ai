import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ShieldCheck,
  CalendarCheck2,
  FileText,
  LifeBuoy,
  BookOpenCheck,
  Users,
  ArrowRight,
  CheckCircle2,
  GraduationCap,
  Building2,
  Clock,
  TrendingUp,
  BrainCircuit,
  MessageSquareCode,
  Menu,
  X
} from 'lucide-react';

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-cyan-500 selection:text-slate-950">
      {/* Header Bar */}
      <nav className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Sparkles className="w-6 h-6 text-slate-950" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              Campus<span className="text-cyan-400">Flow</span> <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-semibold">AI</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#features" className="hover:text-cyan-400 transition-colors">Features</a>
            <Link to="/how-it-works" className="hover:text-cyan-400 transition-colors">How It Works</Link>
            <Link to="/role-benefits" className="hover:text-cyan-400 transition-colors">Role Benefits</Link>
            <Link to="/ai-capabilities" className="hover:text-cyan-400 transition-colors">AI Capabilities</Link>
            <Link to="/about" className="hover:text-cyan-400 transition-colors">About Project</Link>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <Link
              to="/login?mode=signin"
              className="text-xs font-semibold text-slate-300 hover:text-white transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold shadow-lg shadow-cyan-500/20 transition-all transform hover:-translate-y-0.5"
            >
              Get Started Free
            </Link>
          </div>

          {/* Mobile menu toggle */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-900"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu panel */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-slate-900 border-b border-slate-800 px-4 pt-3 pb-6 space-y-3">
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-medium text-slate-200 hover:text-cyan-400 py-1"
            >
              Features
            </a>
            <Link
              to="/how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-medium text-slate-200 hover:text-cyan-400 py-1"
            >
              How It Works
            </Link>
            <Link
              to="/role-benefits"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-medium text-slate-200 hover:text-cyan-400 py-1"
            >
              Role Benefits
            </Link>
            <Link
              to="/ai-capabilities"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-medium text-slate-200 hover:text-cyan-400 py-1"
            >
              AI Capabilities
            </Link>
            <Link
              to="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-medium text-slate-200 hover:text-cyan-400 py-1"
            >
              About Project
            </Link>
            <div className="pt-2 flex flex-col gap-2">
              <Link
                to="/login?mode=signin"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-xl bg-slate-800 text-xs font-semibold text-slate-200"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-xl bg-cyan-500 text-slate-950 text-xs font-bold"
              >
                Get Started Free
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/10 blur-[140px] rounded-full pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-semibold mb-8 animate-pulse">
            <Sparkles className="w-4 h-4 text-cyan-400" /> Smart Campus Management Ecosystem
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-tight">
            Next-Generation <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-500 bg-clip-text text-transparent">
              AI Powered Campus Flow
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto font-normal">
            Streamlining attendance tracking, assignment submissions, notices, complaints, and personalized study planning into one intelligent platform for Students, Faculty, and Administrators.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm shadow-xl shadow-cyan-500/25 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/login?mode=signin"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold text-sm flex items-center justify-center gap-2 transition-all"
            >
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>Explore Demo Portals</span>
            </Link>
          </div>

          {/* Platform Mockup Showcase */}
          <div id="how-it-works" className="mt-16 relative max-w-5xl mx-auto rounded-3xl p-3 bg-slate-900/60 border border-slate-800 shadow-2xl backdrop-blur-md">
            <div className="bg-slate-950 rounded-2xl overflow-hidden p-6 border border-slate-800/80 text-left grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800">
                <div className="flex items-center gap-3 text-cyan-400 font-bold text-xs">
                  <CalendarCheck2 className="w-4 h-4" /> Real-time Attendance
                </div>
                <div className="mt-3 text-2xl font-black text-white">88.5%</div>
                <p className="text-[11px] text-slate-400 mt-1">Course-wise breakdown with low-attendance warnings.</p>
              </div>
              <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800">
                <div className="flex items-center gap-3 text-teal-400 font-bold text-xs">
                  <BrainCircuit className="w-4 h-4" /> Gemini AI Study Plan
                </div>
                <div className="mt-3 text-2xl font-black text-white">4.5 Hrs/Day</div>
                <p className="text-[11px] text-slate-400 mt-1">Automated revision schedule tailored to your exams.</p>
              </div>
              <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800">
                <div className="flex items-center gap-3 text-purple-400 font-bold text-xs">
                  <LifeBuoy className="w-4 h-4" /> Resolution Timeline
                </div>
                <div className="mt-3 text-2xl font-black text-white">24h Avg</div>
                <p className="text-[11px] text-slate-400 mt-1">Ticket tracking from Open to In Progress to Resolved.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid Section */}
      <section id="features" className="py-24 bg-slate-900/50 border-y border-slate-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-xs font-bold uppercase tracking-wider text-cyan-400">Integrated Modules</h2>
            <p className="text-3xl sm:text-4xl font-black text-white mt-2">Everything Your Campus Needs</p>
            <p className="text-slate-400 text-sm mt-3">From academics to administrative ticketing, CampusFlow AI consolidates every operational touchpoint.</p>
          </div>

          <div id="ai-capabilities" className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 hover:border-cyan-500/50 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-6">
                <CalendarCheck2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Attendance Management</h3>
              <p className="text-slate-400 text-xs mt-2 leading-relaxed">
                Faculty can mark present/absent/late status in seconds. Students monitor percentage gauges and receive alerts before falling below eligibility thresholds.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 hover:border-cyan-500/50 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-6">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Assignments & Submissions</h3>
              <p className="text-slate-400 text-xs mt-2 leading-relaxed">
                Digital assignment distribution, attachment support, submission status tracking, overdue indicators, and faculty evaluation notes.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 hover:border-cyan-500/50 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-6">
                <LifeBuoy className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Complaint Ticketing</h3>
              <p className="text-slate-400 text-xs mt-2 leading-relaxed">
                Structured issue reporting for hostel, IT, library, and academic grievances with status updates and administrative resolution notes.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 hover:border-cyan-500/50 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-6">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">AI Campus Assistant</h3>
              <p className="text-slate-400 text-xs mt-2 leading-relaxed">
                Google Gemini API-powered chat assistant answering campus rules, assignment clarification, study hacks, and administrative policies 24/7.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 hover:border-cyan-500/50 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-teal-500/10 text-teal-400 flex items-center justify-center mb-6">
                <BookOpenCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">AI Study Planner</h3>
              <p className="text-slate-400 text-xs mt-2 leading-relaxed">
                Generate customized daily timetables, subject priorities, break recommendations, and exam prep strategy based on your daily available study hours.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 hover:border-cyan-500/50 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center mb-6">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Campus Analytics</h3>
              <p className="text-slate-400 text-xs mt-2 leading-relaxed">
                Visual charts & real-time metrics giving administrators deep insights into attendance trends, course completion rates, and active user distribution.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Role-Based Benefits */}
      <section id="role-benefits" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-xs font-bold uppercase tracking-wider text-cyan-400">Tailored Portals</h2>
            <p className="text-3xl sm:text-4xl font-black text-white mt-2">Designed for Every Campus Stakeholder</p>
          </div>

          <div className="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Student Card */}
            <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-4">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-white">For Students</h3>
                <ul className="mt-6 space-y-3 text-xs text-slate-300">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" /> Track course-wise attendance percentage</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" /> Submit assignments & view faculty feedback</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" /> Generate personalized AI study roadmaps</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" /> File and track campus complaint tickets</li>
                </ul>
              </div>
              <Link to="/login?mode=signin" className="mt-8 block text-center px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-cyan-400 transition-colors">
                Student Login Demo
              </Link>
            </div>

            {/* Faculty Card */}
            <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-4">
                  <Users className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-white">For Faculty</h3>
                <ul className="mt-6 space-y-3 text-xs text-slate-300">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" /> Mark attendance in 1-click</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" /> Publish assignments & evaluate submissions</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" /> Broadcast notices & organize campus events</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" /> Review student grievances & academic issues</li>
                </ul>
              </div>
              <Link to="/login?mode=signin" className="mt-8 block text-center px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-blue-400 transition-colors">
                Faculty Login Demo
              </Link>
            </div>

            {/* Admin Card */}
            <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-4">
                  <Building2 className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-white">For Administrators</h3>
                <ul className="mt-6 space-y-3 text-xs text-slate-300">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" /> Full campus system analytics & charts</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" /> User role management (Student/Faculty/Admin)</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" /> Course and department catalog governance</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" /> Assign & resolve campus complaint tickets</li>
                </ul>
              </div>
              <Link to="/login?mode=signin" className="mt-8 block text-center px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-purple-400 transition-colors">
                Admin Login Demo
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-b from-slate-900 to-slate-950 border-t border-slate-800">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Ready to Experience <br />
            <span className="text-cyan-400">CampusFlow AI?</span>
          </h2>
          <p className="mt-4 text-slate-300 text-sm max-w-xl mx-auto">
            Try out the complete system using our instant 1-click demo accounts or register your new student profile now.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link
              to="/register"
              className="px-8 py-3.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold shadow-xl shadow-cyan-500/20 transition-all"
            >
              Create Account
            </Link>
            <Link
              to="/login?mode=signin"
              className="px-8 py-3.5 rounded-2xl bg-slate-900 border border-slate-700 text-slate-200 text-xs font-semibold hover:bg-slate-800 transition-all"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-12 text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span className="text-slate-300 font-semibold">CampusFlow AI</span> — Smart Campus Management Platform
          </div>
          <p>© 2026 CampusFlow AI. Developed for IBM Internship Project submission.</p>
        </div>
      </footer>
    </div>
  );
}
