import React from 'react';
import { Link } from 'react-router-dom';
import StatCard from '../components/StatCard';
import PageHeader from '../components/PageHeader';
import {
  Users,
  GraduationCap,
  Building2,
  BookOpen,
  LifeBuoy,
  BarChart3,
  UserCheck,
  Megaphone,
  CalendarDays,
  ArrowRight
} from 'lucide-react';

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Campus Administration Dashboard"
        subtitle="Full operational oversight across Students, Faculty, Courses, and System Analytics"
        action={
          <div className="flex items-center gap-3">
            <Link
              to="/admin/users"
              className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 flex items-center gap-1.5 transition-all"
            >
              <Users className="w-4 h-4" /> Manage Users
            </Link>
            <Link
              to="/analytics"
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 flex items-center gap-1.5 transition-all"
            >
              <BarChart3 className="w-4 h-4 text-cyan-400" /> System Analytics
            </Link>
          </div>
        }
      />

      {/* Metric Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Registered Users"
          value="1,420"
          subtitle="Students, Faculty, Staff"
          icon={Users}
          color="cyan"
          trend="+12%"
        />
        <StatCard
          title="Enrolled Students"
          value="1,250"
          subtitle="Across 6 Departments"
          icon={GraduationCap}
          color="indigo"
        />
        <StatCard
          title="Faculty Members"
          value="120"
          subtitle="Active Academic Staff"
          icon={UserCheck}
          color="emerald"
        />
        <StatCard
          title="Open Complaints"
          value="8"
          subtitle="3 Pending Assignment"
          icon={LifeBuoy}
          color="rose"
        />
      </div>

      {/* Quick Admin Operations */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          to="/notices"
          className="p-6 rounded-3xl bg-slate-900 border border-slate-800 hover:border-cyan-500/50 transition-all group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <Megaphone className="w-5 h-5" />
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
          </div>
          <h3 className="text-base font-bold text-white">Notice & Announcements</h3>
          <p className="text-xs text-slate-400 mt-1">Publish campus circulars, exam notices, placement announcements.</p>
        </Link>

        <Link
          to="/events"
          className="p-6 rounded-3xl bg-slate-900 border border-slate-800 hover:border-cyan-500/50 transition-all group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <CalendarDays className="w-5 h-5" />
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
          </div>
          <h3 className="text-base font-bold text-white">Campus Event Manager</h3>
          <p className="text-xs text-slate-400 mt-1">Organize hackathons, workshops, guest lectures, sports events.</p>
        </Link>

        <Link
          to="/complaints"
          className="p-6 rounded-3xl bg-slate-900 border border-slate-800 hover:border-cyan-500/50 transition-all group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center">
              <LifeBuoy className="w-5 h-5" />
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
          </div>
          <h3 className="text-base font-bold text-white">Complaint Resolution</h3>
          <p className="text-xs text-slate-400 mt-1">Assign unresolved grievances to specific faculty or maintenance teams.</p>
        </Link>
      </div>

      {/* System Health Breakdown */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800">
        <h3 className="text-sm font-bold text-slate-100 mb-4">Department & Course Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60">
            <h4 className="font-bold text-cyan-400">Computer Science & Engineering</h4>
            <p className="text-slate-300 mt-1">520 Students • 45 Faculty • 14 Active Courses</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60">
            <h4 className="font-bold text-blue-400">Information Technology</h4>
            <p className="text-slate-300 mt-1">410 Students • 38 Faculty • 10 Active Courses</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60">
            <h4 className="font-bold text-purple-400">Electronics & Communication</h4>
            <p className="text-slate-300 mt-1">320 Students • 37 Faculty • 10 Active Courses</p>
          </div>
        </div>
      </div>
    </div>
  );
}
