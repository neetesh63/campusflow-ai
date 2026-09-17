import React, { useState, useEffect } from 'react';
import TopNavbar from '../components/TopNavbar';
import Sidebar from '../components/Sidebar';
import PageHeader from '../components/PageHeader';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import StatCard from '../components/StatCard';
import { analyticsService } from '../services/analyticsService';
import { BarChart3, TrendingUp, Users, FileCheck, LifeBuoy, Building2 } from 'lucide-react';

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const fetchAnalytics = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await analyticsService.getAnalytics();
      if (res.success) {
        setData(res.data);
      } else {
        setError(res.message);
      }
    } catch (err) {
      setError(err.message || 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <TopNavbar />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <PageHeader
            title="Campus Visual Analytics"
            subtitle="System operational statistics, attendance trends, and assignment submission performance"
          />

          {loading ? (
            <LoadingSpinner text="Compiling campus analytics dataset..." />
          ) : error ? (
            <ErrorMessage message={error} onRetry={fetchAnalytics} />
          ) : (
            <div className="space-y-6">
              {/* Stat Summary */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <StatCard
                  title="Monthly Avg Attendance"
                  value="87.4%"
                  subtitle="Across all departments"
                  icon={TrendingUp}
                  color="cyan"
                  trend="+1.2%"
                />
                <StatCard
                  title="Assignment Completion"
                  value="88.0%"
                  subtitle="Average course completion"
                  icon={FileCheck}
                  color="emerald"
                />
                <StatCard
                  title="Ticket Resolution Rate"
                  value="94.2%"
                  subtitle="Resolved within SLAs"
                  icon={LifeBuoy}
                  color="indigo"
                />
                <StatCard
                  title="Active Departments"
                  value="3"
                  subtitle="CSE, IT, ECE"
                  icon={Building2}
                  color="amber"
                />
              </div>

              {/* Attendance Trend Visual Chart */}
              <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800">
                <h3 className="text-sm font-bold text-slate-100 mb-4 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-cyan-400" /> Monthly Attendance Trend (Jan - Jun)
                </h3>
                <div className="h-44 flex items-end justify-between gap-4 pt-6 px-4 border-b border-slate-800 pb-2">
                  {data?.attendanceTrend?.map((item, idx) => (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                      <span className="text-[10px] font-bold text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity">
                        {item.averagePercentage}%
                      </span>
                      <div
                        className="w-full max-w-[48px] bg-gradient-to-t from-cyan-600 to-cyan-400 rounded-t-xl transition-all group-hover:brightness-125"
                        style={{ height: `${item.averagePercentage}%` }}
                      />
                      <span className="text-xs font-semibold text-slate-400 mt-2">{item.month}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Assignment Completion Rate Breakdown */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800">
                  <h3 className="text-sm font-bold text-slate-100 mb-4">Course Assignment Completion Rate</h3>
                  <div className="space-y-4">
                    {data?.assignmentCompletionRate?.map((c, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between text-xs font-semibold">
                          <span className="text-slate-200">{c.course}</span>
                          <span className="text-cyan-400">{c.completed}% Completed</span>
                        </div>
                        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full bg-cyan-500 rounded-full" style={{ width: `${c.completed}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800">
                  <h3 className="text-sm font-bold text-slate-100 mb-4">Complaint Ticket Status Breakdown</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {data?.complaintStatusDistribution?.map((st, idx) => (
                      <div key={idx} className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 text-center">
                        <span className="text-2xl font-black text-white">{st.count}</span>
                        <p className="text-xs text-slate-400 font-medium mt-1">{st.status} Tickets</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
