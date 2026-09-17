import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  CalendarCheck2,
  FileText,
  Megaphone,
  CalendarDays,
  LifeBuoy,
  Sparkles,
  BookOpenCheck,
  BarChart3,
  User,
  Settings,
  Users,
  Building2,
  LogOut,
  PackageSearch,
  Vote,
  Briefcase,
  Bell
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const role = user?.role || 'student';

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // Common links available for all authenticated users
  const mainNav = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Attendance', path: '/attendance', icon: CalendarCheck2 },
    { name: 'Assignments', path: '/assignments', icon: FileText },
    { name: 'Notices', path: '/notices', icon: Megaphone },
    { name: 'Events', path: '/events', icon: CalendarDays },
    { name: 'Complaints', path: '/complaints', icon: LifeBuoy },
    { name: 'Lost & Found', path: '/lost-found', icon: PackageSearch },
    { name: 'Campus Polls', path: '/polls', icon: Vote },
    { name: 'Placement Hub', path: '/placement', icon: Briefcase },
    { name: 'Notifications', path: '/notifications', icon: Bell },
  ];



  // Dedicated AI & Productivity section
  const aiNav = [
    { name: 'AI Assistant', path: '/ai-assistant', icon: Sparkles, badge: 'Smart' },
    { name: 'AI Study Planner', path: '/study-planner', icon: BookOpenCheck, badge: 'AI' },
  ];

  // Admin exclusive navigation
  const adminNav = [
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
    { name: 'User Management', path: '/admin/users', icon: Users },
    { name: 'Courses & Depts', path: '/admin/courses', icon: Building2 },
  ];

  const settingsNav = [
    { name: 'My Profile', path: '/profile', icon: User },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 shrink-0 bg-slate-900 border-r border-slate-800 text-slate-300 min-h-[calc(100vh-4rem)] p-4 flex flex-col justify-between hidden md:flex">
      <div className="space-y-6">
        {/* User Role Badge Card */}
        <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/50 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-sm">
            {role.charAt(0).toUpperCase()}
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-bold text-slate-200 truncate">{user?.full_name || 'Guest User'}</p>
            <p className="text-[10px] text-cyan-400 font-medium capitalize">{role} Portal</p>
          </div>
        </div>

        {/* Main Navigation Group */}
        <div>
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider px-3 mb-2">Main Menu</p>
          <nav className="space-y-1">
            {mainNav.map(item => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                        : 'hover:bg-slate-800 hover:text-slate-100 text-slate-400'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* AI Services Group */}
        <div>
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider px-3 mb-2 flex items-center gap-1">
            <span>AI Powered</span>
          </p>
          <nav className="space-y-1">
            {aiNav.map(item => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                        : 'hover:bg-slate-800 hover:text-slate-100 text-slate-400'
                    }`
                  }
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 shrink-0 text-cyan-400" />
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 font-bold">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Admin Navigation Group */}
        {(role === 'admin' || role === 'faculty') && (
          <div>
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider px-3 mb-2">Management</p>
            <nav className="space-y-1">
              {adminNav.map(item => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                        isActive
                          ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                          : 'hover:bg-slate-800 hover:text-slate-100 text-slate-400'
                      }`
                    }
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.name}</span>
                  </NavLink>
                );
              })}
            </nav>
          </div>
        )}
      </div>

      {/* Footer Profile/Settings */}
      <div className="pt-4 border-t border-slate-800 space-y-1">
        {settingsNav.map(item => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  isActive ? 'text-cyan-400 bg-slate-800' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.name}</span>
            </NavLink>
          );
        })}

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-rose-400 hover:bg-rose-500/10 transition-colors text-left"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
