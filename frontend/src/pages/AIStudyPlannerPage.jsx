import React, { useState } from 'react';
import TopNavbar from '../components/TopNavbar';
import Sidebar from '../components/Sidebar';
import PageHeader from '../components/PageHeader';
import FormField from '../components/FormField';
import LoadingSpinner from '../components/LoadingSpinner';
import { useToast } from '../context/ToastContext';
import { aiService } from '../services/aiService';
import { BookOpenCheck, Sparkles, Clock, CheckCircle2, AlertTriangle, Coffee, ArrowRight } from 'lucide-react';

export default function AIStudyPlannerPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [planResult, setPlanResult] = useState(null);

  const [form, setForm] = useState({
    subjects: 'Database Systems, Operating Systems, Computer Networks, Data Structures',
    dailyHours: '4',
    examDate: '2026-10-15',
    weakSubjects: 'Database Normalization, Operating System Semaphores',
    preferredTime: 'Evening',
    preparationLevel: 'Intermediate'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.subjects || !form.dailyHours) {
      toast.error('Subjects and daily available study hours are required.');
      return;
    }

    setLoading(true);
    try {
      const res = await aiService.generateStudyPlan(form);
      if (res.success && res.data) {
        setPlanResult(res.data);
        toast.success('AI Study Plan generated successfully!');
      } else {
        const msg = res.message || 'Failed to generate study plan';
        toast.error(msg);
      }
    } catch (err) {
      const msg = err.message || err.data?.message || 'Error generating AI study plan';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <TopNavbar />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <PageHeader
            title="AI Study Roadmap Planner"
            subtitle="Enter your target subjects and available hours to generate an optimized daily study schedule"
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Input Questionnaire Form */}
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 h-fit">
              <div className="flex items-center gap-2 mb-4 text-cyan-400 font-bold text-sm">
                <Sparkles className="w-5 h-5" /> Study Plan Generator
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <FormField label="Subjects List (Comma Separated)" required>
                  <input
                    type="text"
                    value={form.subjects}
                    onChange={(e) => setForm({ ...form, subjects: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-200"
                  />
                </FormField>

                <div className="grid grid-cols-2 gap-3">
                  <FormField label="Daily Study Hours" required>
                    <input
                      type="number"
                      min="1"
                      max="16"
                      value={form.dailyHours}
                      onChange={(e) => setForm({ ...form, dailyHours: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-200"
                    />
                  </FormField>

                  <FormField label="Target Exam Date">
                    <input
                      type="date"
                      value={form.examDate}
                      onChange={(e) => setForm({ ...form, examDate: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-200"
                    />
                  </FormField>
                </div>

                <FormField label="Focus / Weak Topics">
                  <input
                    type="text"
                    value={form.weakSubjects}
                    onChange={(e) => setForm({ ...form, weakSubjects: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-200"
                  />
                </FormField>

                <div className="grid grid-cols-2 gap-3">
                  <FormField label="Preferred Time">
                    <select
                      value={form.preferredTime}
                      onChange={(e) => setForm({ ...form, preferredTime: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-200"
                    >
                      <option value="Morning">Morning</option>
                      <option value="Afternoon">Afternoon</option>
                      <option value="Evening">Evening</option>
                      <option value="Night">Night</option>
                    </select>
                  </FormField>

                  <FormField label="Current Prep Level">
                    <select
                      value={form.preparationLevel}
                      onChange={(e) => setForm({ ...form, preparationLevel: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-200"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </FormField>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  {loading ? 'Analyzing & Building Schedule...' : 'Generate AI Study Plan'} <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>

            {/* Generated Plan Display Area */}
            <div className="lg:col-span-2 space-y-6">
              {loading ? (
                <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-3xl">
                  <LoadingSpinner text="Consulting Gemini AI engine to craft your personalized schedule..." />
                </div>
              ) : planResult ? (
                <div className="space-y-6 animate-in fade-in duration-300">
                  {/* Overview Card */}
                  <div className="p-6 rounded-3xl bg-gradient-to-r from-cyan-950/90 to-slate-900 border border-cyan-500/30">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">AI Strategy Summary</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold">
                        Engine: {planResult.source === 'gemini-api' ? 'Google Gemini API' : 'CampusFlow Safe AI'}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-slate-100 leading-relaxed">{planResult.plan?.overview}</p>
                  </div>

                  {/* Daily Schedule Blocks */}
                  <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800">
                    <h3 className="text-sm font-bold text-slate-100 mb-4 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-cyan-400" /> Daily Time Slot Schedule
                    </h3>
                    <div className="space-y-3">
                      {planResult.plan?.dailySchedule?.map((slot, idx) => (
                        <div key={idx} className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div>
                            <span className="text-xs font-bold text-cyan-400">{slot.timeSlot}</span>
                            <h4 className="text-xs font-bold text-white mt-0.5">{slot.subject}</h4>
                            <p className="text-[11px] text-slate-400 mt-1">{slot.activity}</p>
                          </div>
                          <span className="self-start sm:self-auto text-[10px] px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-medium">
                            {slot.breakDuration}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Subject Priority Grid & Tips */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800">
                      <h3 className="text-sm font-bold text-slate-100 mb-3 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Exam Preparation Tips
                      </h3>
                      <ul className="space-y-2 text-xs text-slate-300">
                        {planResult.plan?.examTips?.map((tip, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-cyan-400 font-bold">•</span>
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800">
                      <h3 className="text-sm font-bold text-slate-100 mb-3 flex items-center gap-2">
                        <Coffee className="w-4 h-4 text-amber-400" /> Rest & Break Advice
                      </h3>
                      <ul className="space-y-2 text-xs text-slate-300">
                        {planResult.plan?.breakRecommendations?.map((rec, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-amber-400 font-bold">•</span>
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-3xl">
                  <BookOpenCheck className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                  <h3 className="text-base font-bold text-slate-300">No Study Plan Generated Yet</h3>
                  <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">Fill in your subject details on the left form and click "Generate AI Study Plan".</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
