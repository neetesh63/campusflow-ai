import React, { useState } from 'react';
import TopNavbar from '../components/TopNavbar';
import Sidebar from '../components/Sidebar';
import PageHeader from '../components/PageHeader';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';
import { Moon, Sun, Bell, Shield, Sliders } from 'lucide-react';

export default function SettingsPage() {
  const { isDarkMode, toggleTheme } = useTheme();
  const { toast } = useToast();

  const [emailNotifs, setEmailNotifs] = useState(true);
  const [assignmentAlerts, setAssignmentAlerts] = useState(true);
  const [noticeAlerts, setNoticeAlerts] = useState(true);

  const handleSave = () => {
    toast.success('Platform preferences saved successfully!');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <TopNavbar />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <PageHeader
            title="Platform Settings"
            subtitle="Configure theme preferences, notification alerts, and accessibility options"
          />

          <div className="max-w-3xl space-y-6">
            {/* Appearance Theme */}
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800">
              <h3 className="text-sm font-bold text-slate-100 mb-4 flex items-center gap-2">
                {isDarkMode ? <Moon className="w-4 h-4 text-cyan-400" /> : <Sun className="w-4 h-4 text-amber-400" />}
                Theme Appearance
              </h3>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-white">Current Theme: {isDarkMode ? 'Dark Mode' : 'Light Mode'}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Toggle between dark slate and clean light interface modes.</p>
                </div>
                <button
                  onClick={toggleTheme}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-cyan-400 border border-slate-700 transition-colors"
                >
                  Switch Theme
                </button>
              </div>
            </div>

            {/* Notification Settings */}
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Bell className="w-4 h-4 text-purple-400" /> Notification Preferences
              </h3>

              <div className="space-y-3 text-xs">
                <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-800/50 border border-slate-800 cursor-pointer">
                  <div>
                    <span className="font-bold text-white block">Email Digest Notifications</span>
                    <span className="text-slate-400 text-[11px]">Receive daily summary emails for urgent notices.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={emailNotifs}
                    onChange={(e) => setEmailNotifs(e.target.checked)}
                    className="w-4 h-4 rounded bg-slate-700 text-cyan-500"
                  />
                </label>

                <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-800/50 border border-slate-800 cursor-pointer">
                  <div>
                    <span className="font-bold text-white block">Assignment Deadline Alerts</span>
                    <span className="text-slate-400 text-[11px]">Get notified 24 hours prior to assignment due dates.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={assignmentAlerts}
                    onChange={(e) => setAssignmentAlerts(e.target.checked)}
                    className="w-4 h-4 rounded bg-slate-700 text-cyan-500"
                  />
                </label>

                <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-800/50 border border-slate-800 cursor-pointer">
                  <div>
                    <span className="font-bold text-white block">Campus Notice Circulars</span>
                    <span className="text-slate-400 text-[11px]">Receive pop-up alerts for urgent administrative circulars.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={noticeAlerts}
                    onChange={(e) => setNoticeAlerts(e.target.checked)}
                    className="w-4 h-4 rounded bg-slate-700 text-cyan-500"
                  />
                </label>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleSave}
                  className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all"
                >
                  Save Settings
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
