import React, { useState, useEffect } from 'react';
import TopNavbar from '../components/TopNavbar';
import Sidebar from '../components/Sidebar';
import PageHeader from '../components/PageHeader';
import Modal from '../components/Modal';
import FormField from '../components/FormField';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { noticeService } from '../services/noticeService';
import { Megaphone, PlusCircle, Search, Calendar, User, Trash2, Tag } from 'lucide-react';

export default function NoticesPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [notices, setNotices] = useState([]);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');

  // Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createForm, setCreateForm] = useState({
    title: '',
    content: '',
    category: 'General',
    priority: 'Medium'
  });

  const fetchNotices = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await noticeService.getNotices({ category, search });
      if (res.success) {
        setNotices(res.data);
      } else {
        setError(res.message);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch notices');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, [category]);

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!createForm.title || !createForm.content) {
      toast.error('Title and content are required.');
      return;
    }
    try {
      const res = await noticeService.createNotice(createForm);
      if (res.success) {
        toast.success('Notice published successfully!');
        setIsCreateModalOpen(false);
        setCreateForm({ title: '', content: '', category: 'General', priority: 'Medium' });
        fetchNotices();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to publish notice');
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await noticeService.deleteNotice(id);
      if (res.success) {
        toast.success('Notice deleted');
        fetchNotices();
      }
    } catch (err) {
      toast.error('Failed to delete notice');
    }
  };

  const categories = ['All', 'Academic', 'Exam', 'Placement', 'Event', 'General'];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <TopNavbar />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <PageHeader
            title="Campus Notices & Announcements"
            subtitle="Official circulars, exam schedules, placement drives, and general news"
            action={
              (user?.role === 'faculty' || user?.role === 'admin') && (
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 flex items-center gap-2 transition-all"
                >
                  <PlusCircle className="w-4 h-4" /> Publish Notice
                </button>
              )
            }
          />

          {/* Search & Category Pills */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all ${
                    category === cat
                      ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                      : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="relative max-w-xs w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search notices..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fetchNotices()}
                className="w-full pl-9 pr-4 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          {loading ? (
            <LoadingSpinner text="Fetching notices..." />
          ) : error ? (
            <ErrorMessage message={error} onRetry={fetchNotices} />
          ) : notices.length === 0 ? (
            <EmptyState title="No notices found" description="There are no announcements in this category." />
          ) : (
            <div className="mt-6 space-y-4">
              {notices.map(notice => (
                <div key={notice.id} className="p-6 rounded-3xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-md bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-[10px] font-bold uppercase">
                          {notice.category}
                        </span>
                        {notice.priority && (
                          <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold uppercase ${
                            notice.priority === 'Urgent' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-slate-800 text-slate-400'
                          }`}>
                            {notice.priority}
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-bold text-white mt-2">{notice.title}</h3>
                    </div>

                    {user?.role === 'admin' && (
                      <button
                        onClick={() => handleDelete(notice.id)}
                        className="p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                        title="Delete Notice"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <p className="text-xs text-slate-300 mt-3 leading-relaxed">{notice.content}</p>

                  <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-slate-500" /> Posted by {notice.author}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" /> {new Date(notice.published_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Create Notice Modal */}
          <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Publish Campus Notice">
            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <FormField label="Notice Title" required>
                <input
                  type="text"
                  placeholder="Mid-Semester Exam Schedule 2026"
                  value={createForm.title}
                  onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-200"
                />
              </FormField>

              <div className="grid grid-cols-2 gap-3">
                <FormField label="Category" required>
                  <select
                    value={createForm.category}
                    onChange={(e) => setCreateForm({ ...createForm, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-200"
                  >
                    <option value="Academic">Academic</option>
                    <option value="Exam">Exam</option>
                    <option value="Placement">Placement</option>
                    <option value="Event">Event</option>
                    <option value="General">General</option>
                  </select>
                </FormField>

                <FormField label="Priority Level">
                  <select
                    value={createForm.priority}
                    onChange={(e) => setCreateForm({ ...createForm, priority: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-200"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </FormField>
              </div>

              <FormField label="Notice Body / Content" required>
                <textarea
                  rows="5"
                  placeholder="Enter full notice announcement details..."
                  value={createForm.content}
                  onChange={(e) => setCreateForm({ ...createForm, content: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-200"
                />
              </FormField>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-800 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950"
                >
                  Publish Notice
                </button>
              </div>
            </form>
          </Modal>
        </main>
      </div>
    </div>
  );
}
