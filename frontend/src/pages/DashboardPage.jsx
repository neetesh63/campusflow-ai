import React from 'react';
import { useAuth } from '../context/AuthContext';
import TopNavbar from '../components/TopNavbar';
import Sidebar from '../components/Sidebar';
import StudentDashboardPage from './StudentDashboardPage';
import FacultyDashboardPage from './FacultyDashboardPage';
import AdminDashboardPage from './AdminDashboardPage';

export default function DashboardPage() {
  const { user } = useAuth();
  const role = user?.role || 'student';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <TopNavbar />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {role === 'admin' && <AdminDashboardPage />}
          {role === 'faculty' && <FacultyDashboardPage />}
          {role === 'student' && <StudentDashboardPage />}
        </main>
      </div>
    </div>
  );
}
