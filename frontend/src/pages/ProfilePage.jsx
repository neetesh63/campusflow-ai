import React, { useState } from 'react';
import TopNavbar from '../components/TopNavbar';
import Sidebar from '../components/Sidebar';
import PageHeader from '../components/PageHeader';
import FormField from '../components/FormField';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { User, Mail, Shield, GraduationCap, Building, Save } from 'lucide-react';

export default function ProfilePage() {
  const { user, setUser } = useAuth();
  const { toast } = useToast();

  const [form, setForm] = useState({
    full_name: user?.full_name || '',
    email: user?.email || '',
    department: user?.department || 'Computer Science & Engineering',
    semester: user?.semester || '6',
    enrollment_number: user?.enrollment_number || 'CS2026-089'
  });

  const handleSave = (e) => {
    e.preventDefault();
    const updated = { ...user, ...form };
    setUser(updated);
    localStorage.setItem('campusflow_user', JSON.stringify(updated));
    toast.success('Profile details updated successfully!');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <TopNavbar />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <PageHeader
            title="User Account Profile"
            subtitle="Manage your personal information, role badge, and academic credentials"
          />

          <div className="max-w-3xl space-y-6">
            {/* Header Avatar Card */}
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center gap-6">
              <img
                src={user?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.full_name || 'User')}&background=06b6d4&color=090d16`}
                alt={user?.full_name}
                className="w-20 h-20 rounded-2xl border-2 border-cyan-500/40 object-cover shadow-xl"
              />
              <div className="text-center sm:text-left">
                <h2 className="text-xl font-bold text-white">{user?.full_name}</h2>
                <p className="text-xs text-slate-400 mt-0.5">{user?.email}</p>
                <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs font-bold capitalize">
                  <Shield className="w-3.5 h-3.5" /> {user?.role || 'student'} Profile
                </div>
              </div>
            </div>

            {/* Profile Form */}
            <form onSubmit={handleSave} className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-slate-100 mb-4">Edit Profile Details</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="Full Name" required>
                  <input
                    type="text"
                    value={form.full_name}
                    onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-200"
                  />
                </FormField>

                <FormField label="Email Address">
                  <input
                    type="email"
                    disabled
                    value={form.email}
                    className="w-full px-3.5 py-2.5 bg-slate-800/50 border border-slate-800 rounded-xl text-xs text-slate-400 cursor-not-allowed"
                  />
                </FormField>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="Department">
                  <input
                    type="text"
                    value={form.department}
                    onChange={(e) => setForm({ ...form, department: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-200"
                  />
                </FormField>

                {user?.role === 'student' && (
                  <FormField label="Semester">
                    <input
                      type="number"
                      value={form.semester}
                      onChange={(e) => setForm({ ...form, semester: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-200"
                    />
                  </FormField>
                )}
              </div>

              <FormField label="Enrollment / Reg Number">
                <input
                  type="text"
                  value={form.enrollment_number}
                  onChange={(e) => setForm({ ...form, enrollment_number: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-200"
                />
              </FormField>

              <div className="pt-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 flex items-center gap-2 transition-all"
                >
                  <Save className="w-4 h-4" /> Save Profile
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
