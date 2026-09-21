import React, { useState, useEffect, useRef } from 'react';
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
import { supabase } from '../services/supabaseClient';
import { FileText, PlusCircle, Calendar, CheckCircle2, Clock, Upload, Paperclip, File, Image as ImageIcon, X, AlertCircle, Loader2, ExternalLink } from 'lucide-react';

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

  // File Upload State
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

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

  const resetSubmitModal = () => {
    setIsSubmitModalOpen(false);
    setSelectedAssignment(null);
    setSelectedFile(null);
    if (filePreview) URL.revokeObjectURL(filePreview);
    setFilePreview(null);
    setSubmitForm({ submission_text: '', attachment_url: '' });
    setUploading(false);
    setSubmitting(false);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // File validation: Size limit 10MB
    const MAX_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      toast.error('File size exceeds the 10MB limit. Please select a smaller file.');
      return;
    }

    // Allowed extensions & mime types
    const allowedTypes = [
      'image/jpeg', 'image/png', 'image/webp', 'image/gif',
      'application/pdf', 'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.pdf', '.doc', '.docx'];
    const ext = '.' + file.name.split('.').pop().toLowerCase();

    if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(ext)) {
      toast.error('Unsupported file format. Please upload an Image (JPG, PNG, WEBP), PDF, or Word Document.');
      return;
    }

    setSelectedFile(file);

    // Create preview for image files
    if (file.type.startsWith('image/')) {
      const previewUrl = URL.createObjectURL(file);
      setFilePreview(previewUrl);
    } else {
      setFilePreview(null);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (filePreview) URL.revokeObjectURL(filePreview);
    setFilePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

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
    if (!selectedAssignment || submitting) return;

    setSubmitting(true);
    let finalAttachmentUrl = submitForm.attachment_url;

    try {
      // If student selected a local file from device, upload it to Supabase Storage
      if (selectedFile) {
        setUploading(true);
        const safeFileName = selectedFile.name.replace(/[^a-zA-Z0-9._-]/g, '_');
        const storagePath = `assignments/${user?.id || 'demo'}/${selectedAssignment.id}/${Date.now()}-${safeFileName}`;

        if (supabase) {
          const { data, error: uploadErr } = await supabase.storage
            .from('assignment-attachments')
            .upload(storagePath, selectedFile, { cacheControl: '3600', upsert: true });

          if (uploadErr) {
            console.warn('Supabase storage upload fallback warning:', uploadErr.message);
            // Fallback for demo mode
            finalAttachmentUrl = filePreview || URL.createObjectURL(selectedFile);
          } else {
            const { data: pubUrlData } = supabase.storage
              .from('assignment-attachments')
              .getPublicUrl(storagePath);
            finalAttachmentUrl = pubUrlData?.publicUrl || storagePath;
          }
        } else {
          finalAttachmentUrl = filePreview || URL.createObjectURL(selectedFile);
        }
        setUploading(false);
      }

      const res = await assignmentService.submitAssignment({
        assignment_id: selectedAssignment.id,
        submission_text: submitForm.submission_text,
        attachment_url: finalAttachmentUrl
      });

      if (res.success) {
        toast.success(`Assignment "${selectedAssignment.title}" submitted successfully!`);
        resetSubmitModal();
        fetchAssignments();
      } else {
        toast.error(res.message || 'Failed to submit assignment');
      }
    } catch (err) {
      toast.error(err.message || 'Error submitting assignment');
    } finally {
      setUploading(false);
      setSubmitting(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
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

          {/* Student Submit Modal with Native File Upload */}
          <Modal isOpen={isSubmitModalOpen} onClose={resetSubmitModal} title={`Submit Work: ${selectedAssignment?.title}`}>
            <form onSubmit={handleSubmitAssignment} className="space-y-4">
              <FormField label="Submission Notes / Summary" required>
                <textarea
                  rows="3"
                  placeholder="Describe your solution, key findings, or implementation details..."
                  value={submitForm.submission_text}
                  onChange={(e) => setSubmitForm({ ...submitForm, submission_text: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-200 focus:border-cyan-500 focus:outline-none"
                />
              </FormField>

              {/* Native Device File Upload Section */}
              <FormField label="Upload Attachment (Device File / Photos / PDF)">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*,.pdf,.doc,.docx"
                  onChange={handleFileSelect}
                  className="hidden"
                />

                {!selectedFile ? (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-700 hover:border-cyan-500 rounded-2xl p-4 text-center cursor-pointer bg-slate-900/60 hover:bg-slate-900 transition-all flex flex-col items-center justify-center gap-2 group"
                  >
                    <div className="w-10 h-10 rounded-full bg-slate-800 group-hover:bg-cyan-500/10 text-slate-400 group-hover:text-cyan-400 flex items-center justify-center transition-all">
                      <Upload className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-200 group-hover:text-cyan-400">
                        Click or tap to choose file from device
                      </p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Supports Gallery Photos, PDF, Word Docs (Max 10MB)
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-700 flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 overflow-hidden">
                        {filePreview ? (
                          <div className="w-12 h-12 rounded-xl border border-slate-700 overflow-hidden bg-slate-800 flex-shrink-0">
                            <img src={filePreview} alt="Preview" className="w-full h-full object-cover" />
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center flex-shrink-0 border border-cyan-500/20">
                            <File className="w-5 h-5" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-slate-200 truncate">{selectedFile.name}</p>
                          <p className="text-[10px] text-slate-400">{formatFileSize(selectedFile.size)}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveFile}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors"
                        title="Remove attachment"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between text-[11px] pt-2 border-t border-slate-800">
                      <span className="text-cyan-400 font-medium flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> File ready for submission
                      </span>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="text-slate-400 hover:text-slate-200 text-[11px] underline"
                      >
                        Choose different file
                      </button>
                    </div>
                  </div>
                )}
              </FormField>

              {/* Optional Secondary External Link / Drive Input */}
              <FormField label="Or External Drive / Cloud Link (Optional)">
                <input
                  type="text"
                  placeholder="https://drive.google.com/file/d/your-submission"
                  value={submitForm.attachment_url}
                  onChange={(e) => setSubmitForm({ ...submitForm, attachment_url: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-200 focus:border-cyan-500 focus:outline-none"
                />
              </FormField>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={resetSubmitModal}
                  disabled={submitting}
                  className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || uploading}
                  className="px-5 py-2.5 text-xs font-bold rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 flex items-center gap-2 transition-all disabled:opacity-50 shadow-lg shadow-cyan-500/20"
                >
                  {submitting || uploading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {uploading ? 'Uploading File...' : 'Submitting...'}
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" /> Confirm & Submit
                    </>
                  )}
                </button>
              </div>
            </form>
          </Modal>
        </main>
      </div>
    </div>
  );
}

