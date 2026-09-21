import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PublicNavbar from '../components/PublicNavbar';
import {
  CalendarCheck2,
  FileText,
  LifeBuoy,
  Sparkles,
  BookOpenCheck,
  TrendingUp,
  PackageSearch,
  Megaphone,
  ArrowLeft,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

export default function FeaturesPage() {
  const navigate = useNavigate();

  const features = [
    {
      icon: CalendarCheck2,
      title: 'Attendance Management',
      color: 'cyan',
      description: 'Faculty can mark student attendance (present, absent, late) with a single click. Students receive automated percentage gauges and risk alerts when near 75% thresholds.',
      capabilities: [
        '1-Click Faculty Marking Interface',
        'Course-wise Percentage & History Breakdown',
        '75% Eligibility Buffer Calculator',
        'Automatic Warning Badges for Low Attendance'
      ]
    },
    {
      icon: FileText,
      title: 'Assignments & Submissions',
      color: 'blue',
      description: 'Digital assignment creation, deadline tracking, file attachment integration, student submission portal, and faculty grading workflow.',
      capabilities: [
        'Course-wise Assignment Publication',
        'Submission Status Tracking (Submitted, Overdue, Graded)',
        'Personal Study Assignment Planner',
        'Faculty Feedback & Grade Allocation'
      ]
    },
    {
      icon: LifeBuoy,
      title: 'Complaint Ticketing System',
      color: 'purple',
      description: 'Structured grievance reporting for campus infrastructure, IT services, hostel issues, and academic queries with status tracking.',
      capabilities: [
        'Priority Categorization (Low, Medium, High, Urgent)',
        'Real-Time Status Workflow (Open → In Progress → Resolved)',
        'Admin Ticket Assignment & Resolution Notes',
        'Student Ticket Reopen Option'
      ]
    },
    {
      icon: Sparkles,
      title: 'AI Campus Assistant',
      color: 'amber',
      description: 'Powered by Google Gemini API, providing 24/7 intelligent answers tailored to individual student attendance records, pending assignments, and campus notices.',
      capabilities: [
        'Context-Aware AI Guidance',
        'Attendance & Assignment Quick Queries',
        'Campus Rulebook Clarification',
        'Graceful Offline Fallback Engine'
      ]
    },
    {
      icon: BookOpenCheck,
      title: 'Smart AI Study Planner',
      color: 'teal',
      description: 'Generates customized daily study schedules based on subject priority, assignment due dates, exam timelines, and available daily hours.',
      capabilities: [
        'Custom Daily Revision Timetables',
        'Focus Subject Hour Weighting',
        'Pomodoro Break Recommendations',
        'Strategic Exam Preparation Tips'
      ]
    },
    {
      icon: TrendingUp,
      title: 'Campus Analytics & Governance',
      color: 'rose',
      description: 'Real-time dashboard visual metrics giving administrators and faculty deep visibility into institutional performance and student attendance trends.',
      capabilities: [
        'System-wide Attendance Analytics',
        'Course & User Catalog Governance',
        'Multi-role Permission Controls (Student, Faculty, Admin)',
        'Ticket Resolution Velocity Metrics'
      ]
    },
    {
      icon: PackageSearch,
      title: 'Lost & Found Portal',
      color: 'emerald',
      description: 'Report lost or found items across campus with description, location, category, and intelligent AI matching suggestions.',
      capabilities: [
        'Item Category & Location Tags',
        'AI Match Confidence Scoring (50% - 99%)',
        'Privacy-Protected Contact Requests',
        'Admin Claim Resolution'
      ]
    },
    {
      icon: Megaphone,
      title: 'Notices & Event Announcements',
      color: 'cyan',
      description: 'Instant campus notice broadcasting and event registration hub for academic schedules, placement drives, and cultural events.',
      capabilities: [
        'Categorized Notice Board (Academic, Exam, Placement, Event)',
        'Campus Event Registration & Ticket Records',
        'Notification Bell Preview Panel',
        'Filtered Announcement Feeds'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-cyan-500 selection:text-slate-950 flex flex-col">
      <PublicNavbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* Page Header */}
        <div className="space-y-4">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-cyan-400" /> Back
          </button>

          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold">
              <Sparkles className="w-4 h-4" /> Comprehensive Feature Set
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">CampusFlow AI Platform Features</h1>
            <p className="text-slate-400 text-sm">
              Explore the full suite of production-ready modules designed to streamline academic operations, administrative governance, and AI-assisted learning.
            </p>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((f, idx) => {
            const Icon = f.icon;
            return (
              <div
                key={idx}
                className="p-8 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col justify-between hover:border-cyan-500/40 transition-all shadow-xl space-y-6"
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center border border-cyan-500/20">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-white">{f.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{f.description}</p>

                  <div className="pt-4 border-t border-slate-800/80 space-y-2">
                    <p className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">Key Capabilities:</p>
                    <ul className="space-y-1.5 text-xs text-slate-300">
                      {f.capabilities.map((cap, cIdx) => (
                        <li key={cIdx} className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                          <span>{cap}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Call to Action */}
        <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 text-center space-y-4 max-w-3xl mx-auto">
          <h2 className="text-2xl font-black text-white">Experience the Platform in Action</h2>
          <p className="text-xs text-slate-400">
            Sign in using our instant 1-click Demo accounts for Student, Faculty, or Administrator roles, or register your own profile.
          </p>
          <div className="flex justify-center gap-4 pt-2">
            <Link
              to="/register"
              className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-2"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/login?mode=signin"
              className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-all"
            >
              Sign In / Explore Demo
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
