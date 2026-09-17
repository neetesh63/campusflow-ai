import React, { useState, useEffect } from 'react';
import TopNavbar from '../components/TopNavbar';
import Sidebar from '../components/Sidebar';
import PageHeader from '../components/PageHeader';
import StatCard from '../components/StatCard';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import FormField from '../components/FormField';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { attendanceService } from '../services/attendanceService';
import { CalendarCheck2, AlertTriangle, PlusCircle, CheckCircle2, XCircle, Clock } from 'lucide-react';

export default function AttendancePage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isMarkModalOpen, setIsMarkModalOpen] = useState(false);

  // Faculty Mark Attendance Form State
  const [markForm, setMarkForm] = useState({
    course_code: 'CSE-301',
    date: new Date().toISOString().split('T')[0],
    student_status: 'present'
  });

  const fetchAttendance = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await attendanceService.getRecords();
      if (res.success) {
        setData(res.data);
      } else {
        setError(res.message);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch attendance');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  const handleMarkSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        course_code: markForm.course_code,
        date: markForm.date,
        student_records: [
          { student_id: 'student-id-303', course_name: markForm.course_code, status: markForm.student_status }
        ]
      };
      const res = await attendanceService.markAttendance(payload);
      if (res.success) {
        toast.success(`Attendance marked as ${markForm.student_status.toUpperCase()}!`);
        setIsMarkModalOpen(false);
        fetchAttendance();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to mark attendance');
    }
  };

  const columns = [
    { header: 'Course Code', accessor: 'course_code', render: (r) => <span className="font-bold text-cyan-400">{r.course_code}</span> },
    { header: 'Course Name', accessor: 'course_name' },
    { header: 'Date', accessor: 'date' },
    {
      header: 'Status',
      accessor: 'status',
      render: (r) => (
        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
          r.status === 'present' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
          r.status === 'absent' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
          'bg-amber-500/10 text-amber-400 border border-amber-500/20'
        }`}>
          {r.status}
        </span>
      )
    },
    { header: 'Marked By', accessor: 'marked_by' }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <TopNavbar />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <PageHeader
            title="Attendance Management"
            subtitle="Track real-time course percentage gauges and daily attendance logs"
            action={
              (user?.role === 'faculty' || user?.role === 'admin') && (
                <button
                  onClick={() => setIsMarkModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 flex items-center gap-2 transition-all"
                >
                  <PlusCircle className="w-4 h-4" /> Mark Class Attendance
                </button>
              )
            }
          />

          {loading ? (
            <LoadingSpinner text="Fetching attendance records..." />
          ) : error ? (
            <ErrorMessage message={error} onRetry={fetchAttendance} />
          ) : (
            <div className="space-y-6">
              {/* Low Attendance Alert */}
              {data?.lowAttendanceWarning && (
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-3 text-amber-300 text-xs font-medium">
                  <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
                  <span>
                    <strong>Low Attendance Warning:</strong> Your overall attendance is currently below 75%. Please attend upcoming classes to avoid eligibility restrictions.
                  </span>
                </div>
              )}

              {/* Stats Overview */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <StatCard
                  title="Overall Attendance Percentage"
                  value={`${data?.overallPercentage}%`}
                  subtitle={`${data?.overallAttended} of ${data?.overallTotal} total sessions`}
                  icon={CalendarCheck2}
                  color={data?.overallPercentage >= 75 ? 'cyan' : 'amber'}
                />
                <StatCard
                  title="Sessions Attended"
                  value={data?.overallAttended || 0}
                  subtitle="Present & Verified"
                  icon={CheckCircle2}
                  color="emerald"
                />
                <StatCard
                  title="Sessions Missed"
                  value={(data?.overallTotal || 0) - (data?.overallAttended || 0)}
                  subtitle="Absent or Leave"
                  icon={XCircle}
                  color="rose"
                />
              </div>

              {/* Module 5: AI Attendance Risk Predictor Widget */}
              {(() => {
                const attended = data?.overallAttended || 34;
                const total = data?.overallTotal || 40;
                const currentPct = total > 0 ? (attended / total) * 100 : 0;
                const targetPct = 75; // Mandatory target

                // Mathematical calculations
                // Required classes: (attended + R) / (total + R) >= targetPct / 100
                // attended + R >= 0.75 * total + 0.75 * R => 0.25 * R >= 0.75 * total - attended
                let requiredClasses = 0;
                if (currentPct < targetPct) {
                  requiredClasses = Math.ceil((targetPct * total - 100 * attended) / (100 - targetPct));
                  requiredClasses = Math.max(0, requiredClasses);
                }

                // Max skippable: (attended) / (total + S) >= targetPct / 100
                // 100 * attended >= 75 * total + 75 * S => 75 * S <= 100 * attended - 75 * total
                let maxSkippable = 0;
                if (currentPct >= targetPct) {
                  maxSkippable = Math.floor((100 * attended - targetPct * total) / targetPct);
                  maxSkippable = Math.max(0, maxSkippable);
                }

                const riskStatus = currentPct >= 85 ? 'Safe' : currentPct >= 75 ? 'Warning' : 'Critical';
                const statusColor = riskStatus === 'Safe' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : riskStatus === 'Warning' ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' : 'bg-rose-500/20 text-rose-300 border-rose-500/30';

                return (
                  <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                          <span>AI Attendance Risk Predictor & Target Calculator</span>
                        </h3>
                        <p className="text-xs text-slate-400">Transparent mathematical forecasting based on target 75% attendance threshold.</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-black uppercase border ${statusColor} self-start sm:self-auto`}>
                        Status: {riskStatus}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                      <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
                        <p className="text-[11px] font-semibold text-slate-400">Current Standing</p>
                        <p className="text-lg font-black text-cyan-400 mt-0.5">{currentPct.toFixed(1)}%</p>
                        <p className="text-[10px] text-slate-500 mt-1">{attended} Attended / {total} Total Classes</p>
                      </div>

                      <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
                        <p className="text-[11px] font-semibold text-slate-400">Required Next Classes</p>
                        <p className="text-lg font-black text-amber-400 mt-0.5">
                          {currentPct >= targetPct ? '0 Classes' : `${requiredClasses} Consecutive Classes`}
                        </p>
                        <p className="text-[10px] text-slate-500 mt-1">Needed to reach target {targetPct}%</p>
                      </div>

                      <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
                        <p className="text-[11px] font-semibold text-slate-400">Max Skippable Sessions</p>
                        <p className="text-lg font-black text-emerald-400 mt-0.5">
                          {currentPct >= targetPct ? `${maxSkippable} Classes` : '0 Classes (Risk Warning)'}
                        </p>
                        <p className="text-[10px] text-slate-500 mt-1">Buffer before falling below {targetPct}%</p>
                      </div>
                    </div>
                  </div>
                );
              })()}


              {/* Course-Wise Percentage Cards */}
              <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800">
                <h3 className="text-sm font-bold text-slate-100 mb-4">Course-Wise Attendance Breakdown</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {data?.courseSummary?.map((course, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-cyan-400">{course.course_code}</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            course.percentage >= 85 ? 'bg-emerald-500/10 text-emerald-400' :
                            course.percentage >= 75 ? 'bg-cyan-500/10 text-cyan-400' : 'bg-amber-500/10 text-amber-400'
                          }`}>
                            {course.percentage}%
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-white mt-1">{course.course_name}</h4>
                      </div>

                      {/* Progress Bar */}
                      <div className="mt-4">
                        <div className="w-full h-2 rounded-full bg-slate-700 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              course.percentage >= 75 ? 'bg-cyan-500' : 'bg-amber-500'
                            }`}
                            style={{ width: `${course.percentage}%` }}
                          />
                        </div>
                        <p className="text-[10px] text-slate-400 mt-1">
                          Attended {course.attended} / {course.total_classes} classes
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Attendance Logs Table */}
              <div>
                <h3 className="text-sm font-bold text-slate-100 mb-3">Attendance History Log</h3>
                <DataTable columns={columns} data={data?.recentLogs || []} searchPlaceholder="Search attendance logs..." />
              </div>
            </div>
          )}

          {/* Mark Attendance Modal (Faculty/Admin) */}
          <Modal isOpen={isMarkModalOpen} onClose={() => setIsMarkModalOpen(false)} title="Mark Class Attendance">
            <form onSubmit={handleMarkSubmit} className="space-y-4">
              <FormField label="Course Code" required>
                <select
                  value={markForm.course_code}
                  onChange={(e) => setMarkForm({ ...markForm, course_code: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-200"
                >
                  <option value="CSE-301">CSE-301: Database Management Systems</option>
                  <option value="CSE-302">CSE-302: Operating Systems</option>
                  <option value="CSE-303">CSE-303: Computer Networks</option>
                  <option value="CSE-304">CSE-304: Design & Analysis of Algorithms</option>
                </select>
              </FormField>

              <FormField label="Session Date" required>
                <input
                  type="date"
                  value={markForm.date}
                  onChange={(e) => setMarkForm({ ...markForm, date: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-200"
                />
              </FormField>

              <FormField label="Select Attendance Status" required>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setMarkForm({ ...markForm, student_status: 'present' })}
                    className={`py-2 rounded-xl text-xs font-bold border transition-colors ${
                      markForm.student_status === 'present'
                        ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                        : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                    }`}
                  >
                    Present
                  </button>
                  <button
                    type="button"
                    onClick={() => setMarkForm({ ...markForm, student_status: 'absent' })}
                    className={`py-2 rounded-xl text-xs font-bold border transition-colors ${
                      markForm.student_status === 'absent'
                        ? 'bg-rose-500 text-white border-rose-400'
                        : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                    }`}
                  >
                    Absent
                  </button>
                  <button
                    type="button"
                    onClick={() => setMarkForm({ ...markForm, student_status: 'late' })}
                    className={`py-2 rounded-xl text-xs font-bold border transition-colors ${
                      markForm.student_status === 'late'
                        ? 'bg-amber-500 text-slate-950 border-amber-400'
                        : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                    }`}
                  >
                    Late
                  </button>
                </div>
              </FormField>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsMarkModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-800 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950"
                >
                  Submit Record
                </button>
              </div>
            </form>
          </Modal>
        </main>
      </div>
    </div>
  );
}
