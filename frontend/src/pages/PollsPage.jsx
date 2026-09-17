import React, { useState, useEffect } from 'react';
import TopNavbar from '../components/TopNavbar';
import Sidebar from '../components/Sidebar';
import PageHeader from '../components/PageHeader';
import Modal from '../components/Modal';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Vote, Plus, CheckCircle2, Lock, BarChart2, ShieldCheck, Clock } from 'lucide-react';
import axios from 'axios';

export default function PollsPage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const role = user?.role || 'student';

  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [votingId, setVotingId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Poll Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [endDate, setEndDate] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchPolls();
  }, []);

  const fetchPolls = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get('/api/polls');
      if (res.data.success) {
        setPolls(res.data.data || []);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load campus polls.');
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (pollId, optionIndex) => {
    try {
      setVotingId(pollId);
      const res = await axios.post(`/api/polls/${pollId}/vote`, { option_index: optionIndex });
      if (res.data.success) {
        showToast('Your vote has been recorded!', 'success');
        fetchPolls();
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to submit vote.', 'error');
    } finally {
      setVotingId(null);
    }
  };

  const handleAddOption = () => {
    if (options.length < 6) {
      setOptions([...options, '']);
    }
  };

  const handleOptionChange = (index, value) => {
    const next = [...options];
    next[index] = value;
    setOptions(next);
  };

  const handleCreatePoll = async (e) => {
    e.preventDefault();
    const cleanOptions = options.map(o => o.trim()).filter(Boolean);
    if (!title || cleanOptions.length < 2) {
      showToast('Please provide a title and at least 2 valid options.', 'error');
      return;
    }

    try {
      setSubmitting(true);
      const res = await axios.post('/api/polls', {
        title,
        description,
        options: cleanOptions,
        end_date: endDate || null,
        is_anonymous: isAnonymous
      });

      if (res.data.success) {
        showToast('New campus poll published!', 'success');
        setIsModalOpen(false);
        setTitle('');
        setDescription('');
        setOptions(['', '']);
        setEndDate('');
        fetchPolls();
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to create poll', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <TopNavbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 max-w-7xl mx-auto w-full space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <PageHeader
              title="Campus Feedback & Polls"
              description="Cast your voice on academic decisions, campus initiatives, and student welfare."
              icon={Vote}
            />
            {(role === 'faculty' || role === 'admin') && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-4 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-cyan-500/20 flex items-center gap-2 transition-all self-start md:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Create Campus Poll</span>
              </button>
            )}
          </div>

          {loading ? (
            <LoadingSpinner message="Fetching campus polls..." />
          ) : error ? (
            <ErrorMessage message={error} onRetry={fetchPolls} />
          ) : polls.length === 0 ? (
            <EmptyState
              icon={Vote}
              title="No Active Polls"
              description="There are currently no active campus polls. Check back soon for new student surveys!"
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {polls.map((poll) => {
                const total = poll.totalVotes || 0;
                return (
                  <div
                    key={poll.id}
                    className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between space-y-4 hover:border-slate-700/80 transition-all shadow-lg"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <span className="px-2.5 py-1 rounded-md bg-cyan-500/10 text-cyan-400 text-[10px] font-bold uppercase tracking-wide border border-cyan-500/20 flex items-center gap-1">
                          <BarChart2 className="w-3 h-3" />
                          {poll.is_active ? 'Active Poll' : 'Closed Poll'}
                        </span>
                        {poll.is_anonymous && (
                          <span className="text-[10px] text-slate-400 flex items-center gap-1 bg-slate-800 px-2 py-0.5 rounded-md">
                            <ShieldCheck className="w-3 h-3 text-emerald-400" />
                            Anonymous
                          </span>
                        )}
                      </div>

                      <h3 className="text-base font-bold text-slate-100">{poll.title}</h3>
                      {poll.description && (
                        <p className="text-xs text-slate-400 leading-relaxed">{poll.description}</p>
                      )}
                    </div>

                    {/* Options List */}
                    <div className="space-y-2.5 pt-2">
                      {poll.options.map((option, idx) => {
                        const count = poll.optionCounts ? poll.optionCounts[idx]?.count || 0 : 0;
                        const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
                        const isVoted = poll.hasVoted && poll.userVotedOption === idx;

                        return (
                          <div key={idx} className="space-y-1">
                            <button
                              disabled={poll.hasVoted || !poll.is_active || votingId === poll.id}
                              onClick={() => handleVote(poll.id, idx)}
                              className={`w-full text-left p-3 rounded-xl border text-xs font-medium relative overflow-hidden transition-all flex items-center justify-between ${
                                isVoted
                                  ? 'border-cyan-500 bg-cyan-500/10 text-cyan-300 font-bold'
                                  : poll.hasVoted
                                  ? 'border-slate-800 bg-slate-900 text-slate-300 cursor-default'
                                  : 'border-slate-800 bg-slate-800/40 hover:border-slate-700 hover:bg-slate-800 text-slate-200'
                              }`}
                            >
                              {/* Background Progress Bar */}
                              {poll.hasVoted && (
                                <div
                                  className="absolute left-0 top-0 bottom-0 bg-cyan-500/15 transition-all duration-500"
                                  style={{ width: `${percentage}%` }}
                                />
                              )}

                              <span className="relative z-10 flex items-center gap-2">
                                {isVoted && <CheckCircle2 className="w-4 h-4 text-cyan-400" />}
                                {option}
                              </span>

                              {poll.hasVoted && (
                                <span className="relative z-10 text-[11px] font-bold text-slate-400">
                                  {percentage}% ({count})
                                </span>
                              )}
                            </button>
                          </div>
                        );
                      })}
                    </div>

                    {/* Poll Footer */}
                    <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        <span>Total Votes: {total}</span>
                      </div>

                      {poll.hasVoted ? (
                        <span className="text-emerald-400 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Vote Submitted
                        </span>
                      ) : (
                        <span className="text-amber-400 font-medium">Click option to vote</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Create Poll Modal */}
          <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title="Create New Campus Poll"
          >
            <form onSubmit={handleCreatePoll} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Poll Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Preferred Exam Mode for 5th Semester"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Description (Optional)</label>
                <textarea
                  rows={2}
                  placeholder="Provide context or details for students..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-300">Poll Options * (Min 2)</label>
                {options.map((opt, idx) => (
                  <input
                    key={idx}
                    type="text"
                    required
                    placeholder={`Option ${idx + 1}`}
                    value={opt}
                    onChange={(e) => handleOptionChange(idx, e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                  />
                ))}
                {options.length < 6 && (
                  <button
                    type="button"
                    onClick={handleAddOption}
                    className="text-xs text-cyan-400 hover:underline font-semibold"
                  >
                    + Add Another Option
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">End Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div className="flex items-center pt-6">
                  <label className="flex items-center gap-2 text-xs font-medium text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isAnonymous}
                      onChange={(e) => setIsAnonymous(e.target.checked)}
                      className="rounded bg-slate-950 border-slate-800 text-cyan-500 focus:ring-0"
                    />
                    <span>Anonymous Poll</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-semibold rounded-xl hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-cyan-500 text-slate-950 text-xs font-bold rounded-xl hover:bg-cyan-400 shadow-md shadow-cyan-500/20"
                >
                  {submitting ? 'Publishing...' : 'Publish Poll'}
                </button>
              </div>
            </form>
          </Modal>
        </main>
      </div>
    </div>
  );
}
