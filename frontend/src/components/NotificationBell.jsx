import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
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
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import api from '../services/apiClient';

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Fetch notifications from API
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
      console.warn('Failed to load notifications:', err.message);
      setError(err.message || 'Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 45000);
    return () => clearInterval(interval);
  }, []);

  // Listen for Escape key & outside clicks
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleToggle = () => {
    const nextState = !isOpen;
    setIsOpen(nextState);
    if (nextState) {
      fetchNotifications();
    }
  };

  const handleMarkAsRead = async (id, e) => {
    if (e) e.stopPropagation();
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications(prev =>
        prev.map(n => (n.id === id ? { ...n, is_read: true } : n))
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.warn('Failed to mark notification read:', err.message);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await api.patch('/notifications/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.warn('Failed to mark all notifications read:', err.message);
    }
  };

  const handleViewAllClick = () => {
    setIsOpen(false);
    navigate('/notifications');
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'notice':
        return <Megaphone className="w-4 h-4 text-cyan-400" />;
      case 'complaint':
        return <LifeBuoy className="w-4 h-4 text-rose-400" />;
      case 'lost_found':
        return <PackageSearch className="w-4 h-4 text-amber-400" />;
      case 'event':
        return <CalendarDays className="w-4 h-4 text-emerald-400" />;
      case 'announcement':
        return <Sparkles className="w-4 h-4 text-purple-400" />;
      case 'assignment':
        return <FileText className="w-4 h-4 text-blue-400" />;
      default:
        return <Bell className="w-4 h-4 text-cyan-400" />;
    }
  };

  const getTargetRoute = (type) => {
    switch (type) {
      case 'notice':
        return '/notices';
      case 'complaint':
        return '/complaints';
      case 'lost_found':
        return '/lost-found';
      case 'event':
        return '/events';
      case 'assignment':
        return '/assignments';
      default:
        return '/notifications';
    }
  };

  const handleNotificationClick = (item) => {
    if (!item.is_read) {
      handleMarkAsRead(item.id);
    }
    setIsOpen(false);
    navigate(getTargetRoute(item.type));
  };

  const formatTimeAgo = (isoString) => {
    if (!isoString) return 'Just now';
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  // Preview only latest 5 notifications
  const previewNotifications = notifications.slice(0, 5);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Bell Button */}
      <button
        onClick={handleToggle}
        aria-label="Campus Notifications"
        aria-expanded={isOpen}
        className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 relative transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <>
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
            <span className="absolute top-1 text-[9px] font-black leading-none right-1 min-w-[14px] h-[14px] px-1 rounded-full bg-cyan-500 text-slate-950 flex items-center justify-center border border-slate-900">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          </>
        )}
      </button>

      {/* Notification Dropdown Panel */}
      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150"
          role="dialog"
          aria-label="Campus Notifications Preview Panel"
        >
          {/* Header */}
          <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold text-slate-100">Notifications</h3>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  {unreadCount} new
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-[11px] font-medium text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Mark all as read</span>
              </button>
            )}
          </div>

          {/* Body Preview List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-slate-800/60">
            {loading && notifications.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400 space-y-2">
                <div className="w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto" />
                <p>Fetching notifications...</p>
              </div>
            ) : error ? (
              <div className="p-6 text-center space-y-2">
                <AlertCircle className="w-6 h-6 text-rose-400 mx-auto" />
                <p className="text-xs text-slate-300">{error}</p>
                <button
                  onClick={fetchNotifications}
                  className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-cyan-400 text-xs rounded-lg font-medium"
                >
                  Retry
                </button>
              </div>
            ) : previewNotifications.length === 0 ? (
              <div className="p-8 text-center space-y-2">
                <Bell className="w-8 h-8 text-slate-600 mx-auto" />
                <p className="text-xs font-bold text-slate-300">No Notifications</p>
                <p className="text-[11px] text-slate-500">You are all caught up!</p>
              </div>
            ) : (
              previewNotifications.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleNotificationClick(item)}
                  className={`p-3.5 flex items-start gap-3 hover:bg-slate-800/60 cursor-pointer transition-colors relative ${
                    !item.is_read ? 'bg-cyan-500/5' : ''
                  }`}
                >
                  <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center shrink-0 mt-0.5 border border-slate-700/50">
                    {getTypeIcon(item.type)}
                  </div>

                  <div className="flex-1 min-w-0 pr-4 space-y-1">
                    <p className={`text-xs font-bold truncate ${!item.is_read ? 'text-slate-100' : 'text-slate-300'}`}>
                      {item.title}
                    </p>
                    <p className="text-[11px] text-slate-400 leading-snug line-clamp-2">
                      {item.message}
                    </p>
                    <div className="flex items-center gap-2 pt-1">
                      <span className="text-[10px] text-slate-500 font-medium">
                        {formatTimeAgo(item.created_at)}
                      </span>
                      {item.is_demo && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-bold">
                          Demo Mode
                        </span>
                      )}
                    </div>
                  </div>

                  {!item.is_read && (
                    <button
                      onClick={(e) => handleMarkAsRead(item.id, e)}
                      title="Mark as read"
                      className="p-1 text-slate-500 hover:text-cyan-400 rounded-md hover:bg-slate-800 transition-colors shrink-0"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Footer Action: Navigates to full page /notifications */}
          <div className="p-2 border-t border-slate-800 bg-slate-900/90 text-center">
            <button
              onClick={handleViewAllClick}
              className="w-full py-2 text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center justify-center gap-1 hover:bg-slate-800/50 rounded-xl transition-colors"
            >
              <span>View All Notifications</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
