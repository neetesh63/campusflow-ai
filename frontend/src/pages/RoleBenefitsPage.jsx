import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import TopNavbar from '../components/TopNavbar';
import {
  GraduationCap,
  Users,
  Building2,
  CheckCircle2,
  ArrowLeft,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function RoleBenefitsPage() {
  const navigate = useNavigate();
  const { loginAsDemoRole } = useAuth();
  const { showToast } = useToast();

  const handleDemoLogin = (role) => {
    const demoUser = loginAsDemoRole(role);
    if (showToast) showToast(`Signed in as Demo ${role.toUpperCase()}: ${demoUser.full_name}`, 'success');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-cyan-500 selection:text-slate-950 flex flex-col">
      <TopNavbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        <div className="space-y-4">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-cyan-400" /> Back
          </button>

          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold">
              <Sparkles className="w-4 h-4" /> Customized Portals
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">Role-Based Benefits</h1>
            <p className="text-slate-400 text-sm">
              Explore how CampusFlow AI optimizes daily campus life for Students, Faculty, and Administrators.
            </p>
          </div>
        </div>

        {/* Roles Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Student */}
          <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center border border-cyan-500/20">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Student Portal</h3>
              <ul className="space-y-3 text-xs text-slate-300">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" /> Course-wise attendance % & risk calculator</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" /> Personal assignment planner & AI schedule</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" /> AI Assistant for study queries & rules</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" /> Campus complaint ticketing & status updates</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" /> Lost & Found reporting & contact requests</li>
              </ul>
            </div>
            <button
              onClick={() => handleDemoLogin('student')}
              className="w-full py-3 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-bold transition-all"
            >
              Demo Student Login
            </button>
          </div>

          {/* Faculty */}
          <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Faculty Portal</h3>
              <ul className="space-y-3 text-xs text-slate-300">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" /> 1-Click class attendance marking</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" /> Assignment publication & submissions review</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" /> Publish campus notices & announcements</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" /> Manage campus events & poll surveys</li>
              </ul>
            </div>
            <button
              onClick={() => handleDemoLogin('faculty')}
              className="w-full py-3 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-bold transition-all"
            >
              Demo Faculty Login
            </button>
          </div>

          {/* Admin */}
          <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Admin Portal</h3>
              <ul className="space-y-3 text-xs text-slate-300">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" /> System-wide analytics & visual metrics</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" /> User role management & governance</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" /> Course & department catalog control</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" /> Complaint assignment & resolution Notes</li>
              </ul>
            </div>
            <button
              onClick={() => handleDemoLogin('admin')}
              className="w-full py-3 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-bold transition-all"
            >
              Demo Admin Login
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
