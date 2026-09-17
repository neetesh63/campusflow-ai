import React, { useState, useEffect } from 'react';
import TopNavbar from '../components/TopNavbar';
import Sidebar from '../components/Sidebar';
import PageHeader from '../components/PageHeader';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';
import { useToast } from '../context/ToastContext';
import {
  Briefcase,
  Code2,
  BrainCircuit,
  BookOpen,
  FileCheck2,
  HelpCircle,
  Trophy,
  CheckSquare,
  Square,
  Plus,
  Minus,
  Save,
  Target,
  Search,
  Building2,
  MapPin,
  Calendar,
  ExternalLink,
  CheckCircle2,
  Clock,
  Sparkles,
  Filter,
  Send
} from 'lucide-react';
import placementService from '../services/placementService';

export default function PlacementPage() {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('opportunities'); // 'opportunities', 'applications', 'drives', 'practice'

  // Data States
  const [stats, setStats] = useState(null);
  const [opportunities, setOpportunities] = useState([]);
  const [applications, setApplications] = useState([]);
  const [drives, setDrives] = useState([]);
  const [prepData, setPrepData] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [applyingId, setApplyingId] = useState(null);

  // Search & Filter States for Opportunities
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [selectedJobType, setSelectedJobType] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  useEffect(() => {
    fetchAllPlacementData();
  }, []);

  const fetchAllPlacementData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [statsRes, oppsRes, appsRes, drivesRes, prepRes] = await Promise.all([
        placementService.getStats().catch(() => null),
        placementService.getOpportunities().catch(() => null),
        placementService.getApplications().catch(() => null),
        placementService.getDrives().catch(() => null),
        placementService.getProgress().catch(() => null)
      ]);

      if (statsRes && statsRes.data) setStats(statsRes.data);
      if (oppsRes && oppsRes.data) setOpportunities(oppsRes.data);
      if (appsRes && appsRes.data) setApplications(appsRes.data);
      if (drivesRes && drivesRes.data) setDrives(drivesRes.data);
      if (prepRes && prepRes.data) setPrepData(prepRes.data);

    } catch (err) {
      setError(err.message || 'Failed to load placement hub data.');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (opp) => {
    try {
      setApplyingId(opp.id);
      const res = await placementService.applyForOpportunity({
        opportunity_id: opp.id,
        company_name: opp.company_name,
        role: opp.role
      });

      if (res && res.success) {
        showToast(`Successfully applied to ${opp.company_name} for ${opp.role}!`, 'success');
        // Refresh applications list
        const appsRes = await placementService.getApplications();
        if (appsRes && appsRes.data) setApplications(appsRes.data);
      }
    } catch (err) {
      showToast(err.message || 'Failed to submit application.', 'error');
    } finally {
      setApplyingId(null);
    }
  };

  const handleSavePrep = async () => {
    if (!prepData) return;
    try {
      setSaving(true);
      const res = await placementService.updateProgress(prepData);
      if (res && res.success) {
        showToast('Placement preparation metrics saved successfully!', 'success');
      }
    } catch (err) {
      showToast('Failed to save preparation metrics.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const toggleResumeItem = (id) => {
    if (!prepData || !Array.isArray(prepData.resume_checklist)) return;
    const next = prepData.resume_checklist.map(item =>
      item.id === id ? { ...item, done: !item.done } : item
    );
    setPrepData({ ...prepData, resume_checklist: next });
  };

  const toggleCoreSubject = (id) => {
    if (!prepData || !Array.isArray(prepData.core_subjects)) return;
    const next = prepData.core_subjects.map(item => {
      if (item.id === id) {
        const statusMap = { 'Not Started': 'In Progress', 'In Progress': 'Completed', 'Completed': 'Not Started' };
        return { ...item, status: statusMap[item.status] || 'Not Started' };
      }
      return item;
    });
    setPrepData({ ...prepData, core_subjects: next });
  };

  // Filter Opportunities
  const filteredOpportunities = opportunities.filter(opp => {
    const matchesSearch =
      opp.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (opp.required_skills && opp.required_skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())));

    const matchesLocation = selectedLocation === 'All' || opp.location === selectedLocation;
    const matchesJobType = selectedJobType === 'All' || opp.job_type === selectedJobType;
    const matchesStatus = selectedStatus === 'All' || opp.status === selectedStatus;

    return matchesSearch && matchesLocation && matchesJobType && matchesStatus;
  });

  const getCompanyBadgeColor = (name) => {
    const colors = {
      Google: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
      Microsoft: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
      Amazon: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      TCS: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
      Infosys: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      Wipro: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      Accenture: 'bg-purple-500/10 text-purple-300 border-purple-500/20',
      Deloitte: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
    };
    return colors[name] || 'bg-slate-800 text-slate-300 border-slate-700';
  };

  const getAppStatusBadge = (status) => {
    switch (status) {
      case 'Selected':
        return <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Selected</span>;
      case 'Interview':
        return <span className="px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-xs font-bold flex items-center gap-1"><Sparkles className="w-3.5 h-3.5" /> Interview Round</span>;
      case 'Shortlisted':
        return <span className="px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30 text-xs font-bold flex items-center gap-1"><Trophy className="w-3.5 h-3.5" /> Shortlisted</span>;
      case 'Rejected':
        return <span className="px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-bold">Rejected</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700 text-xs font-bold flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> Applied</span>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
        <TopNavbar />
        <div className="flex flex-1"><Sidebar /><main className="flex-1 p-6"><LoadingSpinner message="Loading Placement Hub & Company Drives..." /></main></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
        <TopNavbar />
        <div className="flex flex-1"><Sidebar /><main className="flex-1 p-6"><ErrorMessage message={error} onRetry={fetchAllPlacementData} /></main></div>
      </div>
    );
  }

  const dsaSolved = prepData?.dsa_solved ?? 48;
  const dsaTotal = prepData?.dsa_total || 100;
  const aptSolved = prepData?.aptitude_solved ?? 35;
  const aptTotal = prepData?.aptitude_total || 50;

  const dsaPct = Math.round((dsaSolved / dsaTotal) * 100);
  const aptPct = Math.round((aptSolved / aptTotal) * 100);
  const overallPct = Math.round((dsaPct + aptPct) / 2);

  const coreSubjects = Array.isArray(prepData?.core_subjects) ? prepData.core_subjects : [];
  const resumeChecklist = Array.isArray(prepData?.resume_checklist) ? prepData.resume_checklist : [];
  const mockInterviewQuestions = Array.isArray(prepData?.mock_interview_questions) ? prepData.mock_interview_questions : [];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <TopNavbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-6 max-w-7xl mx-auto w-full space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <PageHeader
              title="Campus Placement Hub & Career Portal"
              description="Explore campus placement drives, apply to top tier tech companies, track your job applications, and prepare for interviews."
              icon={Briefcase}
            />
          </div>

          {/* Top Placement Statistics Banner */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Partner Companies</p>
              <p className="text-xl font-black text-cyan-400 mt-1">{stats?.total_companies || 8}+</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Jobs</p>
              <p className="text-xl font-black text-emerald-400 mt-1">{stats?.active_opportunities || 12}</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Students Placed</p>
              <p className="text-xl font-black text-purple-400 mt-1">{stats?.students_placed || 142}</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Average Package</p>
              <p className="text-xl font-black text-amber-400 mt-1">{stats?.avg_package || '₹8.5 LPA'}</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Highest Package</p>
              <p className="text-xl font-black text-rose-400 mt-1">{stats?.highest_package || '₹44.0 LPA'}</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Selection Rate</p>
              <p className="text-xl font-black text-cyan-300 mt-1">{stats?.selection_rate || '78.5%'}</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-slate-800 overflow-x-auto gap-2 text-xs font-bold">
            <button
              onClick={() => setActiveTab('opportunities')}
              className={`pb-3 px-4 transition-colors flex items-center gap-2 shrink-0 border-b-2 ${
                activeTab === 'opportunities'
                  ? 'border-cyan-400 text-cyan-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Job Opportunities ({opportunities.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('applications')}
              className={`pb-3 px-4 transition-colors flex items-center gap-2 shrink-0 border-b-2 ${
                activeTab === 'applications'
                  ? 'border-cyan-400 text-cyan-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Send className="w-4 h-4" />
              <span>My Applications ({applications.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('drives')}
              className={`pb-3 px-4 transition-colors flex items-center gap-2 shrink-0 border-b-2 ${
                activeTab === 'drives'
                  ? 'border-cyan-400 text-cyan-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Upcoming Drives ({drives.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('practice')}
              className={`pb-3 px-4 transition-colors flex items-center gap-2 shrink-0 border-b-2 ${
                activeTab === 'practice'
                  ? 'border-cyan-400 text-cyan-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Target className="w-4 h-4" />
              <span>Practice & Prep Hub</span>
            </button>
          </div>

          {/* TAB 1: JOB OPPORTUNITIES */}
          {activeTab === 'opportunities' && (
            <div className="space-y-6">
              {/* Search & Filter Controls */}
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
                <div className="relative flex-1 min-w-[240px]">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search by company, role, or skill (e.g. Google, Python, React)..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs">
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <Filter className="w-3.5 h-3.5" />
                    <span className="font-bold text-[11px]">Filters:</span>
                  </div>

                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-slate-200 text-xs focus:outline-none focus:border-cyan-500"
                  >
                    <option value="All">All Locations</option>
                    <option value="Bengaluru">Bengaluru</option>
                    <option value="Hyderabad">Hyderabad</option>
                    <option value="Pune">Pune</option>
                    <option value="Noida">Noida</option>
                    <option value="Remote">Remote</option>
                  </select>

                  <select
                    value={selectedJobType}
                    onChange={(e) => setSelectedJobType(e.target.value)}
                    className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-slate-200 text-xs focus:outline-none focus:border-cyan-500"
                  >
                    <option value="All">All Types</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Internship">Internship</option>
                  </select>

                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-slate-200 text-xs focus:outline-none focus:border-cyan-500"
                  >
                    <option value="All">All Status</option>
                    <option value="Open">Open</option>
                    <option value="Closing Soon">Closing Soon</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
              </div>

              {/* Opportunities Grid */}
              {filteredOpportunities.length === 0 ? (
                <EmptyState
                  icon={Building2}
                  title="No Matching Opportunities"
                  description="No company placement opportunities match your search query or filter settings."
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredOpportunities.map((opp) => (
                    <div
                      key={opp.id}
                      className="p-5 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col justify-between space-y-4 hover:border-slate-700 transition-all shadow-xl group"
                    >
                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getCompanyBadgeColor(opp.company_name)}`}>
                              {opp.company_name}
                            </span>
                            <h3 className="text-base font-bold text-slate-100 mt-1.5 group-hover:text-cyan-400 transition-colors">
                              {opp.role}
                            </h3>
                          </div>

                          <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold uppercase ${
                            opp.status === 'Open' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                            opp.status === 'Closing Soon' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                            'bg-slate-800 text-slate-500 border border-slate-700'
                          }`}>
                            {opp.status}
                          </span>
                        </div>

                        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                          {opp.description}
                        </p>

                        <div className="space-y-2 pt-1 text-xs">
                          <div className="flex items-center justify-between text-slate-300 font-semibold">
                            <span className="text-slate-400 font-normal">Package / Stipend:</span>
                            <span className="text-emerald-400 font-bold">{opp.package_offered}</span>
                          </div>

                          <div className="flex items-center justify-between text-slate-300">
                            <span className="text-slate-400 font-normal flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-cyan-400" /> Location:</span>
                            <span className="font-medium text-slate-200">{opp.location} ({opp.job_type})</span>
                          </div>

                          <div className="flex items-center justify-between text-slate-300">
                            <span className="text-slate-400 font-normal flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-amber-400" /> Deadline:</span>
                            <span className="font-medium text-amber-300">{opp.application_deadline}</span>
                          </div>
                        </div>

                        {/* Skills Badges */}
                        {Array.isArray(opp.required_skills) && opp.required_skills.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-2">
                            {opp.required_skills.map((skill, idx) => (
                              <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-800 font-mono">
                                {skill}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Action Bar */}
                      <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between gap-3">
                        <a
                          href={opp.apply_url || 'https://careers.google.com'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] font-bold text-slate-400 hover:text-cyan-400 flex items-center gap-1 transition-colors"
                        >
                          <span>Career Portal</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>

                        <button
                          onClick={() => handleApply(opp)}
                          disabled={applyingId === opp.id || opp.status === 'Closed'}
                          className={`px-4 py-2 rounded-xl text-xs font-bold shadow-lg transition-all flex items-center gap-1.5 ${
                            opp.status === 'Closed'
                              ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                              : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-cyan-500/20'
                          }`}
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>{applyingId === opp.id ? 'Applying...' : opp.status === 'Closed' ? 'Closed' : 'Apply Now'}</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: MY APPLICATIONS */}
          {activeTab === 'applications' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-200">Tracked Student Applications</h3>
                <span className="text-xs text-slate-400 font-mono">Total Submitted: {applications.length}</span>
              </div>

              {applications.length === 0 ? (
                <EmptyState
                  icon={Send}
                  title="No Applications Submitted Yet"
                  description="Browse the Job Opportunities tab and click 'Apply Now' to track your application progress!"
                />
              ) : (
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                        <th className="pb-3 pl-2">Company & Role</th>
                        <th className="pb-3">Applied Date</th>
                        <th className="pb-3">Current Status</th>
                        <th className="pb-3">Next Action / Notes</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-medium">
                      {applications.map((app) => (
                        <tr key={app.id} className="hover:bg-slate-800/40 transition-colors">
                          <td className="py-3.5 pl-2">
                            <p className="font-bold text-slate-100">{app.company_name}</p>
                            <p className="text-[11px] text-slate-400">{app.role}</p>
                          </td>
                          <td className="py-3.5 text-slate-300 font-mono">{app.applied_date}</td>
                          <td className="py-3.5">{getAppStatusBadge(app.status)}</td>
                          <td className="py-3.5 text-slate-300 font-mono text-[11px]">{app.next_action || 'Under Review'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: UPCOMING CAMPUS DRIVES */}
          {activeTab === 'drives' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-200">Scheduled On-Campus Recruitment Drives</h3>

              {drives.length === 0 ? (
                <EmptyState
                  icon={Calendar}
                  title="No Upcoming Campus Drives"
                  description="Check back later for newly scheduled campus recruitment drives."
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {drives.map((drive) => (
                    <div key={drive.id} className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getCompanyBadgeColor(drive.company_name)}`}>
                          {drive.company_name}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
                          {drive.status}
                        </span>
                      </div>

                      <div className="space-y-1.5">
                        <p className="text-xs text-slate-300 font-medium flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 text-amber-400" />
                          <span>Drive Date: <strong className="text-slate-100">{drive.drive_date}</strong></span>
                        </p>
                        <p className="text-xs text-slate-300 font-medium flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Venue: {drive.venue}</span>
                        </p>
                        <p className="text-xs text-slate-400">
                          Eligible Branches: <strong className="text-slate-200">{drive.eligible_branch}</strong> (Min CGPA: {drive.min_cgpa})
                        </p>
                      </div>

                      <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                        <span>Reg Deadline: {drive.registration_deadline}</span>
                        <span className="text-cyan-400 font-bold">&bull; Verified Campus Drive</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: PRACTICE & PREP HUB */}
          {activeTab === 'practice' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-200">Practice, Core CS & Resume Audit Tools</h3>
                <button
                  onClick={handleSavePrep}
                  disabled={saving}
                  className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg flex items-center gap-2"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{saving ? 'Saving...' : 'Save Prep Metrics'}</span>
                </button>
              </div>

              {/* Progress Tracker Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-300 flex items-center gap-2"><Code2 className="w-4 h-4 text-cyan-400" /> DSA Practice Questions</span>
                    <span className="text-cyan-400 font-bold">{dsaSolved} / {dsaTotal}</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-cyan-500 transition-all duration-300" style={{ width: `${dsaPct}%` }} />
                  </div>
                  <div className="flex items-center justify-end gap-2 pt-1">
                    <button onClick={() => setPrepData({ ...prepData, dsa_solved: Math.max(0, dsaSolved - 1) })} className="p-1.5 rounded-lg bg-slate-800 text-slate-300"><Minus className="w-3.5 h-3.5" /></button>
                    <button onClick={() => setPrepData({ ...prepData, dsa_solved: Math.min(dsaTotal, dsaSolved + 1) })} className="px-3 py-1.5 rounded-lg bg-cyan-500 text-slate-950 font-bold text-xs flex items-center gap-1"><Plus className="w-3.5 h-3.5" /> Log +1 Solved</button>
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-300 flex items-center gap-2"><BrainCircuit className="w-4 h-4 text-emerald-400" /> Aptitude & Reasoning Tests</span>
                    <span className="text-emerald-400 font-bold">{aptSolved} / {aptTotal}</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 transition-all duration-300" style={{ width: `${aptPct}%` }} />
                  </div>
                  <div className="flex items-center justify-end gap-2 pt-1">
                    <button onClick={() => setPrepData({ ...prepData, aptitude_solved: Math.max(0, aptSolved - 1) })} className="p-1.5 rounded-lg bg-slate-800 text-slate-300"><Minus className="w-3.5 h-3.5" /></button>
                    <button onClick={() => setPrepData({ ...prepData, aptitude_solved: Math.min(aptTotal, aptSolved + 1) })} className="px-3 py-1.5 rounded-lg bg-emerald-500 text-slate-950 font-bold text-xs flex items-center gap-1"><Plus className="w-3.5 h-3.5" /> Log +1 Solved</button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Core CS Checklist */}
                <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
                  <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-purple-400" />
                    <span>Core CS Fundamentals</span>
                  </h3>
                  <div className="space-y-2">
                    {coreSubjects.map(subject => (
                      <div
                        key={subject.id}
                        onClick={() => toggleCoreSubject(subject.id)}
                        className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between cursor-pointer hover:border-slate-700 transition-all"
                      >
                        <span className="text-xs font-semibold text-slate-200">{subject.name}</span>
                        <span className={`text-[10px] px-2.5 py-1 rounded-md font-bold ${
                          subject.status === 'Completed' ? 'bg-emerald-500/20 text-emerald-300' :
                          subject.status === 'In Progress' ? 'bg-amber-500/20 text-amber-300' :
                          'bg-slate-800 text-slate-400'
                        }`}>
                          {subject.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Resume Checklist */}
                <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
                  <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                    <FileCheck2 className="w-4 h-4 text-emerald-400" />
                    <span>Resume Audit Checklist</span>
                  </h3>
                  <div className="space-y-3">
                    {resumeChecklist.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => toggleResumeItem(item.id)}
                        className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-800/50 cursor-pointer transition-all"
                      >
                        {item.done ? (
                          <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-600 shrink-0" />
                        )}
                        <span className={`text-xs ${item.done ? 'line-through text-slate-500' : 'text-slate-300 font-medium'}`}>
                          {item.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
