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
import { eventService } from '../services/eventService';
import { CalendarDays, PlusCircle, MapPin, Clock, Users, Tag } from 'lucide-react';

export default function EventsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);

  // Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createForm, setCreateForm] = useState({
    title: '',
    description: '',
    venue: '',
    event_date: '',
    event_time: '',
    category: 'Hackathon'
  });

  const fetchEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await eventService.getEvents();
      if (res.success) {
        setEvents(res.data);
      } else {
        setError(res.message);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!createForm.title || !createForm.venue || !createForm.event_date) {
      toast.error('Title, venue, and event date are required.');
      return;
    }
    try {
      const res = await eventService.createEvent(createForm);
      if (res.success) {
        toast.success('Campus event created successfully!');
        setIsCreateModalOpen(false);
        setCreateForm({ title: '', description: '', venue: '', event_date: '', event_time: '', category: 'Hackathon' });
        fetchEvents();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to create event');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <TopNavbar />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <PageHeader
            title="Campus Events & Activities"
            subtitle="Explore hackathons, technical workshops, guest lectures, and cultural fests"
            action={
              (user?.role === 'faculty' || user?.role === 'admin') && (
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 flex items-center gap-2 transition-all"
                >
                  <PlusCircle className="w-4 h-4" /> Create Event
                </button>
              )
            }
          />

          {loading ? (
            <LoadingSpinner text="Fetching campus events..." />
          ) : error ? (
            <ErrorMessage message={error} onRetry={fetchEvents} />
          ) : events.length === 0 ? (
            <EmptyState title="No upcoming events" description="Check back soon for new campus activities." />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map(evt => (
                <div key={evt.id} className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-all">
                  <div>
                    <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-[10px] font-bold uppercase">
                      {evt.category || 'Event'}
                    </span>
                    <h3 className="text-lg font-bold text-white mt-3 leading-snug">{evt.title}</h3>
                    <p className="text-xs text-slate-400 mt-2 line-clamp-3 leading-relaxed">{evt.description}</p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-800/80 space-y-2.5 text-xs text-slate-300">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-cyan-400 shrink-0" />
                      <span className="truncate">{evt.venue}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-cyan-400 shrink-0" />
                      <span>{evt.event_date} ({evt.event_time})</span>
                    </div>

                    <div className="flex items-center gap-2 text-slate-400 text-[11px] pt-1">
                      <Users className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span className="truncate">Organizer: {evt.organizer}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Create Event Modal */}
          <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Create Campus Event">
            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <FormField label="Event Title" required>
                <input
                  type="text"
                  placeholder="HackCampus 2026 - 36-Hour Hackathon"
                  value={createForm.title}
                  onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-200"
                />
              </FormField>

              <div className="grid grid-cols-2 gap-3">
                <FormField label="Category">
                  <select
                    value={createForm.category}
                    onChange={(e) => setCreateForm({ ...createForm, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-200"
                  >
                    <option value="Hackathon">Hackathon</option>
                    <option value="Workshop">Workshop</option>
                    <option value="Lecture">Guest Lecture</option>
                    <option value="Sports">Sports</option>
                    <option value="Cultural">Cultural</option>
                  </select>
                </FormField>

                <FormField label="Event Date" required>
                  <input
                    type="date"
                    value={createForm.event_date}
                    onChange={(e) => setCreateForm({ ...createForm, event_date: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-200"
                  />
                </FormField>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <FormField label="Venue Location" required>
                  <input
                    type="text"
                    placeholder="Main University Auditorium"
                    value={createForm.venue}
                    onChange={(e) => setCreateForm({ ...createForm, venue: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-200"
                  />
                </FormField>

                <FormField label="Event Time">
                  <input
                    type="text"
                    placeholder="09:00 AM - 05:00 PM"
                    value={createForm.event_time}
                    onChange={(e) => setCreateForm({ ...createForm, event_time: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-200"
                  />
                </FormField>
              </div>

              <FormField label="Event Description">
                <textarea
                  rows="4"
                  placeholder="Detail event schedule, guidelines, prerequisites, and registration details..."
                  value={createForm.description}
                  onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
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
                  Publish Event
                </button>
              </div>
            </form>
          </Modal>
        </main>
      </div>
    </div>
  );
}
