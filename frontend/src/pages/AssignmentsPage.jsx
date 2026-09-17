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
import { assignmentService } from '../services/assignmentService';
import { FileText, PlusCircle, Calendar, CheckCircle2, Clock, Upload, Paperclip } from 'lucide-react';

export default function AssignmentsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [assignments, setAssignments] = useState([]);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('All');

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);

  // Forms
  const [createForm, setCreateForm] = useState({
    title: '',
    description: '',
    course_code: 'CSE-301',
    due_date: '',
    total_points: '100'
  });

  const [submitForm, setSubmitForm] = useState({
    submission_text: '',
    attachment_url: ''
  });

  const fetchAssignments = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await assignmentService.getAssignments();
      if (res.success) {
        setAssignments(res.data);
      } else {
        setError(res.message);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch assignments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!createForm.title || !createForm.due_date) {
      toast.error('Title and due date are required.');
      return;
    }
    try {
      const res = await assignmentService.createAssignment(createForm);
      if (res.success) {
        toast.success('Assignment created and published!');
        setIsCreateModalOpen(false);
        setCreateForm({ title: '', description: '', course_code: 'CSE-301', due_date: '', total_points: '100' });
        fetchAssignments();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to create assignment');
    }
  };

  const handleSubmitAssignment = async (e) => {
    e.preventDefault();
    if (!selectedAssignment) return;
    try {
      const res = await assignmentService.submitAssignment({
        assignment_id: selectedAssignment.id,
        submission_text: submitForm.submission_text,
        attachment_url: submitForm.attachment_url
      });
      if (res.success) {
        toast.success(`Assignment "${selectedAssignment.title}" submitted successfully!`);
        setIsSubmitModalOpen(false);
        setSubmitForm({ submission_text: '', attachment_url: '' });
        fetchAssignments();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to submit assignment');
    }
  };

  const filteredAssignments = assignments.filter(a => {
    if (filterStatus === 'All') return true;
    return a.status.toLowerCase() === filterStatus.toLowerCase();
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <TopNavbar />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <PageHeader
            title="Course Assignments"
            subtitle="Manage course tasks, track submission deadlines, and submit student work"
            action={
              (user?.role === 'faculty' || user?.role === 'admin') && (
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 flex items-center gap-2 transition-all"
                >
                  <PlusCircle className="w-4 h-4" /> Create Assignment
                </button>
              )
            }
          />

          {/* Filter Pills */}
          <div className="flex items-center gap-2 pb-6 border-b border-slate-800">
            {['All', 'Pending', 'Submitted', 'Graded'].map(st => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  filterStatus === st
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                    : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {loading ? (
            <LoadingSpinner text="Fetching course assignments..." />
          ) : error ? (
            <ErrorMessage message={error} onRetry={fetchAssignments} />
          ) : filteredAssignments.length === 0 ? (
            <EmptyState title="No assignments found" description="There are no assignments matching the selected filter." />
          ) : (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAssignments.map(asg => (
                <div key={asg.id} className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-all">
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-xs text-cyan-400">{asg.course_code}</span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        asg.status === 'Graded' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                        asg.status === 'Submitted' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' :
                        'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}>
                        {asg.status}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-white mt-2 leading-snug">{asg.title}</h3>
                    <p className="text-xs text-slate-400 mt-2 line-clamp-3 leading-relaxed">{asg.description}</p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-800/80 space-y-3">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        Due: {new Date(asg.due_date).toLocaleDateString()}
                      </span>
                      <span className="font-semibold text-slate-300">Max Points: {asg.total_points}</span>
                    </div>

                    {asg.grade && (
                      <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300">
                        <strong>Grade: {asg.grade}</strong> — {asg.feedback}
                      </div>
                    )}

                    {user?.role === 'student' && asg.status === 'Pending' && (
                      <button
                        onClick={() => { setSelectedAssignment(asg); setIsSubmitModalOpen(true); }}
                        className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <Upload className="w-4 h-4" /> Submit Work
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Create Assignment Modal (Faculty/Admin) */}
          <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Create New Assignment">
            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <FormField label="Assignment Title" required>
                <input
                  type="text"
                  placeholder="Relational Database Schema Normalization"
                  value={createForm.title}
                  onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-200"
                />
              </FormField>

              <FormField label="Course Code" required>
                <input
                  type="text"
                  placeholder="CSE-301"
                  value={createForm.course_code}
                  onChange={(e) => setCreateForm({ ...createForm, course_code: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-200"
                />
              </FormField>

              <FormField label="Submission Due Date" required>
                <input
                  type="datetime-local"
                  value={createForm.due_date}
                  onChange={(e) => setCreateForm({ ...createForm, due_date: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-200"
                />
              </FormField>

              <FormField label="Assignment Description" required>
                <textarea
                  rows="4"
                  placeholder="Detail instructions, expectations, and reference materials..."
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
                  Publish Assignment
                </button>
              </div>
            </form>
          </Modal>

          {/* Student Submit Modal */}
          <Modal isOpen={isSubmitModalOpen} onClose={() => setIsSubmitModalOpen(false)} title={`Submit Work: ${selectedAssignment?.title}`}>
            <form onSubmit={handleSubmitAssignment} className="space-y-4">
              <FormField label="Submission Notes / Text" required>
                <textarea
                  rows="4"
                  placeholder="Add your solution summary, code snippet, or submission description..."
                  value={submitForm.submission_text}
                  onChange={(e) => setSubmitForm({ ...submitForm, submission_text: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-200"
                />
              </FormField>

              <FormField label="Attachment URL / Drive Link (Optional)">
                <input
                  type="text"
                  placeholder="https://drive.google.com/your-submission-pdf"
                  value={submitForm.attachment_url}
                  onChange={(e) => setSubmitForm({ ...submitForm, attachment_url: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-200"
                />
              </FormField>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsSubmitModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-800 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950"
                >
                  Confirm Submission
                </button>
              </div>
            </form>
          </Modal>
        </main>
      </div>
    </div>
  );
}
