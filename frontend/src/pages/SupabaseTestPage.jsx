import React, { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';
import TopNavbar from '../components/TopNavbar';
import Sidebar from '../components/Sidebar';
import PageHeader from '../components/PageHeader';
import { Database, CheckCircle2, XCircle, RefreshCw, PlusCircle, Bell } from 'lucide-react';

export default function SupabaseTestPage() {
  const [loading, setLoading] = useState(true);
  const [supabaseStatus, setSupabaseStatus] = useState('checking');
  const [backendHealth, setBackendHealth] = useState(null);
  const [notices, setNotices] = useState([]);
  const [errorMsg, setErrorMsg] = useState(null);
  const [inserting, setInserting] = useState(false);

  useEffect(() => {
    checkBackendHealth();
    fetchNoticesFromSupabase();
  }, []);

  const checkBackendHealth = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/supabase/test');
      const data = await res.json();
      setBackendHealth(data);
    } catch (err) {
      setBackendHealth({ success: false, message: 'Backend health check failed: ' + err.message });
    }
  };

  const fetchNoticesFromSupabase = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      if (!supabase) {
        setSupabaseStatus('unconfigured');
        setErrorMsg('Supabase client is unconfigured. Verify VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in frontend/.env');
        setLoading(false);
        return;
      }

      // Query notices from Supabase database
      const { data, error } = await supabase
        .from('notices')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        setSupabaseStatus('error');
        setErrorMsg(error.message);
      } else {
        setSupabaseStatus('connected');
        setNotices(data || []);
      }
    } catch (err) {
      setSupabaseStatus('error');
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  const seedSampleNotice = async () => {
    setInserting(true);
    try {
      if (!supabase) {
        alert('Supabase is not configured in frontend/.env');
        setInserting(false);
        return;
      }

      const sampleNotice = {
        title: `Campus Announcement #${Math.floor(Math.random() * 900 + 100)}`,
        content: `Official notice generated from CampusFlow AI Supabase Test Page at ${new Date().toLocaleTimeString()}. Supabase integration is functioning seamlessly!`,
        category: ['Academic', 'Exam', 'Placement', 'General'][Math.floor(Math.random() * 4)],
        published_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('notices')
        .insert([sampleNotice])
        .select();

      if (error) {
        alert(`Failed to insert notice: ${error.message}`);
      } else {
        await fetchNoticesFromSupabase();
      }
    } catch (err) {
      alert(`Insert error: ${err.message}`);
    } finally {
      setInserting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <TopNavbar />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <PageHeader
            title="Supabase Database Connection Test"
            subtitle="Verify frontend and backend Supabase client connections and fetch records from the notices table"
          />

          {/* Connection Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {/* Backend Health Check Card */}
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  <Database className="w-4 h-4 text-cyan-400" /> Backend Service-Role Connection
                </span>
                {backendHealth?.success ? (
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[11px] font-bold border border-emerald-500/20 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Connected
                  </span>
                ) : (
                  <span className="px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-400 text-[11px] font-bold border border-rose-500/20 flex items-center gap-1">
                    <XCircle className="w-3.5 h-3.5" /> Disconnected
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-300 font-mono bg-slate-800 p-2.5 rounded-xl border border-slate-700/50">
                GET /api/supabase/test &rarr; {backendHealth?.message || 'Checking backend...'}
              </p>
            </div>

            {/* Frontend Anon Connection Card */}
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  <Database className="w-4 h-4 text-purple-400" /> Frontend Anon Client
                </span>
                {supabaseStatus === 'connected' ? (
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[11px] font-bold border border-emerald-500/20 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Active
                  </span>
                ) : (
                  <span className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 text-[11px] font-bold border border-amber-500/20 flex items-center gap-1">
                    <XCircle className="w-3.5 h-3.5" /> {supabaseStatus}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-300 font-mono bg-slate-800 p-2.5 rounded-xl border border-slate-700/50 truncate">
                VITE_SUPABASE_URL &rarr; {import.meta.env.VITE_SUPABASE_URL || 'Not Set'}
              </p>
            </div>
          </div>

          {/* Table Controls */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <Bell className="w-5 h-5 text-cyan-400" /> Supabase `notices` Table Records ({notices.length})
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">Records fetched live via Supabase PostgreSQL Client</p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={fetchNoticesFromSupabase}
                disabled={loading}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 flex items-center gap-2 transition-all"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh
              </button>

              <button
                onClick={seedSampleNotice}
                disabled={inserting}
                className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-all"
              >
                <PlusCircle className="w-3.5 h-3.5" /> Add Sample Notice
              </button>
            </div>
          </div>

          {/* Error Message Alert */}
          {errorMsg && (
            <div className="mb-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-medium">
              ⚠️ Supabase Query Error: {errorMsg}
            </div>
          )}

          {/* Notices Records Grid */}
          {loading ? (
            <div className="p-12 text-center text-slate-400 text-sm animate-pulse">
              Connecting to Supabase PostgreSQL database...
            </div>
          ) : notices.length === 0 ? (
            <div className="p-12 rounded-3xl bg-slate-900 border border-slate-800 text-center">
              <Bell className="w-10 h-10 text-slate-600 mx-auto mb-3" />
              <p className="text-sm font-bold text-slate-300">No notices found in Supabase `notices` table.</p>
              <p className="text-xs text-slate-500 mt-1 mb-4">Click "Add Sample Notice" above to insert a live record into Supabase!</p>
              <button
                onClick={seedSampleNotice}
                disabled={inserting}
                className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold inline-flex items-center gap-2"
              >
                <PlusCircle className="w-4 h-4" /> Insert First Notice
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {notices.map((notice) => (
                <div key={notice.id} className="p-5 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col justify-between space-y-4 hover:border-slate-700 transition-all">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-[10px] font-bold">
                        {notice.category || 'General'}
                      </span>
                      <span className="text-[10px] text-slate-500">
                        {notice.created_at ? new Date(notice.created_at).toLocaleDateString() : 'Just now'}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-100 line-clamp-2">{notice.title}</h3>
                    <p className="text-xs text-slate-400 mt-2 line-clamp-3">{notice.content}</p>
                  </div>
                  <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                    <span>ID: {String(notice.id).substring(0, 12)}...</span>
                    <span className="text-emerald-400 font-semibold">&bull; Supabase Live</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
