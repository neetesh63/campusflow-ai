import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import StatCard from '../components/StatCard';
import PageHeader from '../components/PageHeader';
import {
  CalendarCheck2,
  FileText,
  Clock,
  Sparkles,
  LifeBuoy,
  Megaphone,
  CalendarDays,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  BookOpenCheck
} from 'lucide-react';

export default function StudentDashboard() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Welcome back, ${user?.full_name?.split(' ')[0] || 'Student'}!`}
        subtitle={`${user?.department || 'Computer Science'} • Semester ${user?.semester || '6'} • Reg: ${user?.enrollment_number || 'CS2026-089'}`}
        action={
          <Link
            to="/study-planner"
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 flex items-center gap-2 transition-all"
          >
            <Sparkles className="w-4 h-4" /> AI Study Plan Shortcut
          </Link>
        }
      />

      {/* Overview Metric Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Overall Attendance"
          value="88.5%"
          subtitle="142 of 160 classes attended"
          icon={CalendarCheck2}
          color="cyan"
          trend="+2.1%"
        />
        <StatCard
          title="Pending Assignments"
          value="3"
          subtitle="2 due within next 48h"
          icon={FileText}
          color="amber"
        />
        <StatCard
          title="Active Complaints"
          value="1"
          subtitle="Status: In Progress"
          icon={LifeBuoy}
          color="indigo"
        />
        <StatCard
          title="AI Study Roadmap"
          value="4.5 h/d"
          subtitle="Targeting End-Sem Exams"
          icon={BookOpenCheck}
          color="emerald"
        />
      </div>

      {/* Grid: Assignments & Notices */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Upcoming Deadlines & Pending Assignments */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-cyan-400" />
                <h3 className="text-sm font-bold text-slate-100">Upcoming Academic Deadlines</h3>
              </div>
              <Link to="/assignments" className="text-xs text-cyan-400 hover:underline font-medium">View All</Link>
            </div>

            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white">Relational Database Schema Normalization</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">Course: CSE-301 DBMS • Prof. Alan Turing</p>
                </div>
                <div className="text-right">
                  <span className="inline-block px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-bold">
                    Due in 2 days
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white">Process Synchronization Semaphores Lab</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">Course: CSE-302 Operating Systems</p>
                </div>
                <div className="text-right">
                  <span className="inline-block px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold">
                    Submitted
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white">VLSM Subnet Allocation Assignment</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">Course: CSE-303 Networks</p>
                </div>
                <div className="text-right">
                  <span className="inline-block px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-[10px] font-bold">
                    Graded: 92/100
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick AI Campus Assistant Banner */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-cyan-950/80 via-slate-900 to-blue-950/80 border border-cyan-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
                <Sparkles className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Need help with your course assignments?</h3>
                <p className="text-xs text-slate-300 mt-0.5">Ask CampusFlow AI Assistant for explanations, study guides, and campus information.</p>
              </div>
            </div>
            <Link
              to="/ai-assistant"
              className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold shrink-0 transition-colors"
            >
              Launch AI Chat
            </Link>
          </div>
        </div>

        {/* Right Col: Recent Notices & Events */}
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Megaphone className="w-5 h-5 text-purple-400" />
                <h3 className="text-sm font-bold text-slate-100">Recent Notices</h3>
              </div>
              <Link to="/notices" className="text-xs text-purple-400 hover:underline font-medium">View All</Link>
            </div>

            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-slate-800/50 border border-slate-800">
                <span className="text-[9px] px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-300 font-bold uppercase">Exam Notice</span>
                <h4 className="text-xs font-bold text-slate-200 mt-1">Mid-Term Exam Schedule Autumn 2026</h4>
                <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">Exams commence October 5th. Hall tickets available next week.</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-800/50 border border-slate-800">
                <span className="text-[9px] px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-300 font-bold uppercase">Placement Drive</span>
                <h4 className="text-xs font-bold text-slate-200 mt-1">IBM & Tech Corp Campus Recruitment</h4>
                <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">Eligible 7th semester students register before Sept 25th.</p>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-emerald-400" />
                <h3 className="text-sm font-bold text-slate-100">Upcoming Events</h3>
              </div>
              <Link to="/events" className="text-xs text-emerald-400 hover:underline font-medium">View All</Link>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-800/50 border border-slate-800">
              <h4 className="text-xs font-bold text-slate-200">HackCampus 2026 - 36h Hackathon</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">Oct 10, 2026 • Main Auditorium</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
