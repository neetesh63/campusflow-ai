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
import { complaintService } from '../services/complaintService';
import { LifeBuoy, PlusCircle, AlertCircle, CheckCircle2, Clock, MessageSquare, ShieldAlert } from 'lucide-react';

export default function ComplaintsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [complaints, setComplaints] = useState([]);
  const [error, setError] = useState(null);

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);

  // Forms
  const [createForm, setCreateForm] = useState({
    title: '',
    description: '',
    category: 'IT / Infrastructure',
    priority: 'Medium'
  });

  const [updateForm, setUpdateForm] = useState({
    status: 'In Progress',
    assigned_to: '',
    resolution_note: ''
  });

  const fetchComplaints = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await complaintService.getComplaints();
      if (res.success) {
        setComplaints(res.data);
      } else {
        setError(res.message);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch complaints');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!createForm.title || !createForm.description) {
      toast.error('Title and description are required.');
      return;
    }
    try {
      const res = await complaintService.createComplaint(createForm);
      if (res.success) {
        toast.success('Complaint ticket filed successfully!');
        setIsCreateModalOpen(false);
        setCreateForm({ title: '', description: '', category: 'IT / Infrastructure', priority: 'Medium' });
        fetchComplaints();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to file complaint');
    }
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    if (!selectedTicket) return;
    try {
      const res = await complaintService.updateStatus(selectedTicket.id, updateForm);
      if (res.success) {
        toast.success(`Ticket ${selectedTicket.id} updated to ${updateForm.status}!`);
        setIsUpdateModalOpen(false);
        fetchComplaints();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update ticket status');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <TopNavbar />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <PageHeader
            title="Campus Complaint Desk & Support Tickets"
            subtitle="File grievances for IT, hostel, academic, or infrastructure issues and track resolution timelines"
            action={
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 flex items-center gap-2 transition-all"
              >
                <PlusCircle className="w-4 h-4" /> Raise Complaint Ticket
              </button>
            }
          />

          {loading ? (
            <LoadingSpinner text="Fetching complaint tickets..." />
          ) : error ? (
            <ErrorMessage message={error} onRetry={fetchComplaints} />
          ) : complaints.length === 0 ? (
            <EmptyState title="No complaints logged" description="You have no active or historical tickets." />
          ) : (
            <div className="space-y-4">
              {complaints.map(ticket => (
                <div key={ticket.id} className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 hover:border-slate-700 transition-all">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-cyan-400">{ticket.id}</span>
                      <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[10px] font-bold">
                        {ticket.category}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        ticket.priority === 'Urgent' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                        ticket.priority === 'High' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                        'bg-slate-800 text-slate-400'
                      }`}>
                        Priority: {ticket.priority}
                      </span>
                    </div>

                    <span className={`self-start sm:self-auto px-3 py-1 rounded-full text-xs font-bold ${
                      ticket.status === 'Resolved' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                      ticket.status === 'In Progress' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' :
                      ticket.status === 'Rejected' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                      'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}>
                      Status: {ticket.status}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-white">{ticket.title}</h3>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">{ticket.description}</p>
                  </div>

                  {ticket.resolution_note && (
                    <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700/80 text-xs text-cyan-300">
                      <strong className="text-cyan-400 font-bold block mb-0.5">Resolution Note:</strong>
                      {ticket.resolution_note}
                    </div>
                  )}

                  <div className="pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-400">
                    <div className="flex items-center gap-4">
                      <span>Filed by: <strong className="text-slate-200">{ticket.student_name}</strong></span>
                      {ticket.assigned_to && (
                        <span>Assigned to: <strong className="text-slate-200">{ticket.assigned_to}</strong></span>
                      )}
                    </div>

                    {(user?.role === 'faculty' || user?.role === 'admin') && (
                      <button
                        onClick={() => {
                          setSelectedTicket(ticket);
                          setUpdateForm({
                            status: ticket.status,
                            assigned_to: ticket.assigned_to || user.full_name,
                            resolution_note: ticket.resolution_note || ''
                          });
                          setIsUpdateModalOpen(true);
                        }}
                        className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 font-semibold text-xs transition-colors self-end sm:self-auto"
                      >
                        Update Ticket Status
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Raise Complaint Modal */}
          <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="File Complaint / Support Ticket">
            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <FormField label="Ticket Summary Title" required>
                <input
                  type="text"
                  placeholder="WiFi Connection Intermittent in Hostel Block C"
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
                    <option value="IT / Infrastructure">IT / Infrastructure</option>
                    <option value="Academics / Marks">Academics / Marks</option>
                    <option value="Hostel / Mess">Hostel / Mess</option>
                    <option value="Library">Library</option>
                    <option value="General">General</option>
                  </select>
                </FormField>

                <FormField label="Priority">
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

              <FormField label="Detailed Issue Description" required>
                <textarea
                  rows="4"
                  placeholder="Describe the exact location, timing, and problem details..."
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
                  Submit Ticket
                </button>
              </div>
            </form>
          </Modal>

          {/* Update Status Modal (Faculty/Admin) */}
          <Modal isOpen={isUpdateModalOpen} onClose={() => setIsUpdateModalOpen(false)} title={`Update Ticket ${selectedTicket?.id}`}>
            <form onSubmit={handleUpdateSubmit} className="space-y-4">
              <FormField label="Status" required>
                <select
                  value={updateForm.status}
                  onChange={(e) => setUpdateForm({ ...updateForm, status: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-200"
                >
                  <option value="Open">Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </FormField>

              <FormField label="Assigned Technician / Faculty">
                <input
                  type="text"
                  value={updateForm.assigned_to}
                  onChange={(e) => setUpdateForm({ ...updateForm, assigned_to: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-200"
                />
              </FormField>

              <FormField label="Resolution Note / Comments">
                <textarea
                  rows="3"
                  placeholder="Explain steps taken or resolution details..."
                  value={updateForm.resolution_note}
                  onChange={(e) => setUpdateForm({ ...updateForm, resolution_note: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-200"
                />
              </FormField>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsUpdateModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-800 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950"
                >
                  Save Status
                </button>
              </div>
            </form>
          </Modal>
        </main>
      </div>
    </div>
  );
}
