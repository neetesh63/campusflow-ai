import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import StatCard from '../components/StatCard';
import PageHeader from '../components/PageHeader';
import {
  Users,
  BookOpen,
  FileCheck,
  CalendarCheck2,
  PlusCircle,
  Megaphone,
  LifeBuoy
} from 'lucide-react';

export default function FacultyDashboard() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Faculty Portal: ${user?.full_name || 'Prof. Alan Turing'}`}
        subtitle={`Department of ${user?.department || 'Computer Science & Engineering'} • Faculty ID: FAC-2026-012`}
        action={
          <div className="flex items-center gap-3">
            <Link
              to="/assignments"
              className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 flex items-center gap-1.5 transition-all"
            >
              <PlusCircle className="w-4 h-4" /> Create Assignment
            </Link>
            <Link
              to="/attendance"
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 flex items-center gap-1.5 transition-all"
            >
              <CalendarCheck2 className="w-4 h-4 text-cyan-400" /> Mark Attendance
            </Link>
          </div>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Courses Taught"
          value="4"
          subtitle="CSE-301, CSE-302, CSE-201"
          icon={BookOpen}
          color="cyan"
        />
        <StatCard
          title="Total Students Taught"
          value="180"
          subtitle="Across 3 Sections"
          icon={Users}
          color="indigo"
        />
        <StatCard
          title="Pending Submissions to Grade"
          value="14"
          subtitle="DBMS Assignment 1"
          icon={FileCheck}
          color="amber"
        />
        <StatCard
          title="Average Class Attendance"
          value="86.4%"
          subtitle="Healthy engagement rate"
          icon={CalendarCheck2}
          color="emerald"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800">
          <h3 className="text-sm font-bold text-slate-100 mb-4">Assigned Course Overview</h3>
          <div className="space-y-3 text-xs">
            <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-white">Database Management Systems (CSE-301)</h4>
                <p className="text-slate-400 text-[11px] mt-0.5">Section A • 60 Students enrolled</p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-[10px] font-bold">
                93.7% Attendance
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-white">Operating Systems (CSE-302)</h4>
                <p className="text-slate-400 text-[11px] mt-0.5">Section B • 58 Students enrolled</p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold">
                86.6% Attendance
              </span>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-100">Assigned Complaints / Tickets</h3>
            <Link to="/complaints" className="text-xs text-cyan-400 hover:underline">View All</Link>
          </div>
          <div className="space-y-3 text-xs">
            <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-white">Missing Lab Marks in 5th Sem Portal</h4>
                <p className="text-slate-400 text-[11px] mt-0.5">Student: Alex Johnson • High Priority</p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold">
                Resolved
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
