import React, { useState, useEffect } from 'react';
import TopNavbar from '../components/TopNavbar';
import Sidebar from '../components/Sidebar';
import PageHeader from '../components/PageHeader';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';
import { useToast } from '../context/ToastContext';
import {
  Bell,
  CheckCheck,
  Check,
  Megaphone,
  LifeBuoy,
  PackageSearch,
  CalendarDays,
  Sparkles,
  FileText,
  Clock,
  ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../services/apiClient';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get('/notifications');
      if (res.success && res.data) {
        setNotifications(res.data.notifications || []);
        setUnreadCount(res.data.unreadCount || 0);
      }
    } catch (err) {
      setError(err.message || 'Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications(prev =>
        prev.map(n => (n.id === id ? { ...n, is_read: true } : n))
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
      if (showToast) showToast('Notification marked as read', 'success');
    } catch (err) {
      console.warn('Failed to mark read:', err.message);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await api.patch('/notifications/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      setUnreadCount(0);
      if (showToast) showToast('All notifications marked as read', 'success');
    } catch (err) {
      console.warn('Failed to mark all read:', err.message);
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'notice':
        return <Megaphone className="w-5 h-5 text-cyan-400" />;
      case 'complaint':
        return <LifeBuoy className="w-5 h-5 text-rose-400" />;
      case 'lost_found':
        return <PackageSearch className="w-5 h-5 text-amber-400" />;
      case 'event':
        return <CalendarDays className="w-5 h-5 text-emerald-400" />;
      case 'announcement':
        return <Sparkles className="w-5 h-5 text-purple-400" />;
      case 'assignment':
        return <FileText className="w-5 h-5 text-blue-400" />;
      default:
        return <Bell className="w-5 h-5 text-cyan-400" />;
    }
  };

  const getTypeBadge = (type) => {
    const labels = {
      notice: 'Academic Notice',
      complaint: 'Complaint Ticket',
      lost_found: 'Lost & Found',
      event: 'Campus Event',
      announcement: 'Announcement',
      assignment: 'Assignment'
    };
    return labels[type] || 'General';
  };

  const formatTimeAgo = (isoString) => {
    if (!isoString) return 'Just now';
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} mins ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hours ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} days ago (${date.toLocaleDateString()})`;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <TopNavbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 max-w-5xl mx-auto w-full space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate(-1)}
                className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
                title="Go Back"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <PageHeader
                title="Campus Notifications"
                description="View all system alerts, complaint status updates, notices, and event registrations."
                icon={Bell}
              />
            </div>

            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-cyan-500/20 flex items-center gap-2 transition-all self-start sm:self-auto"
              >
                <CheckCheck className="w-4 h-4" />
                <span>Mark All as Read ({unreadCount})</span>
              </button>
            )}
          </div>

          {loading ? (
            <LoadingSpinner message="Loading all notifications..." />
          ) : error ? (
            <ErrorMessage message={error} onRetry={fetchNotifications} />
          ) : notifications.length === 0 ? (
            <EmptyState
              icon={Bell}
              title="No Notifications Found"
              description="You have no notifications at this time. Check back later for campus announcements!"
            />
          ) : (
            <div className="space-y-3">
              {notifications.map((item) => (
                <div
                  key={item.id}
                  className={`p-5 rounded-2xl border transition-all flex items-start gap-4 ${
                    !item.is_read
                      ? 'bg-slate-900/90 border-cyan-500/40 shadow-lg shadow-cyan-500/5'
                      : 'bg-slate-900/50 border-slate-800/80 text-slate-300'
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-slate-950 flex items-center justify-center shrink-0 border border-slate-800 shadow-inner">
                    {getTypeIcon(item.type)}
                  </div>

                  <div className="flex-1 space-y-1.5 min-w-0">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider bg-slate-800 text-cyan-400 border border-slate-700/60">
                          {getTypeBadge(item.type)}
                        </span>
                        {!item.is_read && (
                          <span className="text-[9px] px-2 py-0.5 rounded-full font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                            Unread
                          </span>
                        )}
                        {item.is_demo && (
                          <span className="text-[9px] px-2 py-0.5 rounded-md font-bold bg-slate-800 text-slate-400 border border-slate-700">
                            Demo Mode
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1 text-[11px] text-slate-500">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{formatTimeAgo(item.created_at)}</span>
                      </div>
                    </div>

                    <h3 className={`text-sm font-bold ${!item.is_read ? 'text-slate-100' : 'text-slate-300'}`}>
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {item.message}
                    </p>
                  </div>

                  {!item.is_read && (
                    <button
                      onClick={() => handleMarkAsRead(item.id)}
                      title="Mark as read"
                      className="p-2 rounded-xl bg-slate-800 hover:bg-cyan-500/20 text-slate-400 hover:text-cyan-300 transition-colors shrink-0"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
