import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/apiClient';
import StatCard from '../components/StatCard';
import PageHeader from '../components/PageHeader';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  CalendarCheck2,
  FileText,
  Clock,
  Sparkles,
  LifeBuoy,
  Megaphone,
  CalendarDays,
  CheckCircle2,
  AlertTriangle,
  BookOpenCheck,
  Inbox
} from 'lucide-react';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchStats = async () => {
      setLoading(true);
      try {
        const res = await api.get('/dashboard');
        if (isMounted && res.success) {
          setStats(res.data);
        }
      } catch (err) {
        console.warn('Dashboard fetch warning:', err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchStats();
    return () => { isMounted = false; };
  }, []);

  const isDemo = Boolean(user?.is_demo || stats?.is_demo);

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Welcome back, ${user?.full_name?.split(' ')[0] || 'Student'}!`}
        subtitle={`${user?.department || 'Computer Science'} • Semester ${user?.semester || '1'} • Reg: ${user?.enrollment_number || 'STU-2026-NEW'}`}
        action={
          <Link
            to="/study-planner"
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 flex items-center gap-2 transition-all"
          >
            <Sparkles className="w-4 h-4" /> AI Study Plan Shortcut
          </Link>
        }
      />

      {loading ? (
        <LoadingSpinner text="Loading your dashboard stats..." />
      ) : (
        <>
          {/* Overview Metric Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <StatCard
              title="Overall Attendance"
              value={stats?.totalClassesHeld > 0 || isDemo ? `${stats?.attendancePercentage || 0}%` : 'N/A'}
              subtitle={stats?.totalClassesHeld > 0 ? `${stats?.totalClassesAttended} of ${stats?.totalClassesHeld} classes attended` : 'No attendance logs yet'}
              icon={CalendarCheck2}
              color={stats?.attendancePercentage >= 75 || isDemo ? 'cyan' : 'amber'}
            />
            <StatCard
              title="Pending Assignments"
              value={stats?.pendingAssignments ?? 0}
              subtitle={stats?.pendingAssignments > 0 ? `${stats?.pendingAssignments} pending submission` : 'No pending assignments'}
              icon={FileText}
              color="amber"
            />
            <StatCard
              title="Active Complaints"
              value={stats?.openComplaints ?? 0}
              subtitle={stats?.openComplaints > 0 ? 'Tickets in progress' : 'No active tickets'}
              icon={LifeBuoy}
              color="indigo"
            />
            <StatCard
              title="AI Study Roadmap"
              value={stats?.activeStudyPlans > 0 || isDemo ? (isDemo ? '4.5 h/d' : `${stats.activeStudyPlans} Active`) : '0 Active'}
              subtitle={stats?.activeStudyPlans > 0 || isDemo ? 'Targeting Exams' : 'Create a plan in AI Planner'}
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
                  {stats?.upcomingDeadlines && stats.upcomingDeadlines.length > 0 ? (
                    stats.upcomingDeadlines.map((item, idx) => (
                      <div key={item.id || idx} className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between">
                        <div>
                          <h4 className="text-xs font-bold text-white">{item.title}</h4>
                          <p className="text-[11px] text-slate-400 mt-0.5">Subject: {item.subject || item.course || 'Academic Task'}</p>
                        </div>
                        <div className="text-right">
                          <span className="inline-block px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-bold">
                            {item.dueIn || (item.dueDate ? `Due: ${new Date(item.dueDate).toLocaleDateString()}` : 'Pending')}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-8 text-center bg-slate-950/40 rounded-2xl border border-slate-800/60 flex flex-col items-center justify-center">
                      <Inbox className="w-8 h-8 text-slate-500 mb-2" />
                      <p className="text-xs font-semibold text-slate-300">No pending academic deadlines</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">You are all caught up with your assignments!</p>
                    </div>
                  )}
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
                  {stats?.recentNotices && stats.recentNotices.length > 0 ? (
                    stats.recentNotices.map((n, idx) => (
                      <div key={n.id || idx} className="p-3.5 rounded-2xl bg-slate-800/50 border border-slate-800">
                        <span className="text-[9px] px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-300 font-bold uppercase">{n.category || 'General'}</span>
                        <h4 className="text-xs font-bold text-slate-200 mt-1">{n.title}</h4>
                        <p className="text-[11px] text-slate-400 mt-0.5">{n.date}</p>
                      </div>
                    ))
                  ) : (
                    <div className="py-6 text-center text-xs text-slate-400">
                      No active campus notices.
                    </div>
                  )}
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
        </>
      )}
    </div>
  );
}

