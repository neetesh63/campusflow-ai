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
import { lostAndFoundService } from '../services/lostAndFoundService';
import {
  Search,
  Filter,
  PlusCircle,
  HelpCircle,
  CheckCircle2,
  MapPin,
  Calendar,
  Sparkles,
  MessageSquare,
  Tag,
  Clock,
  ShieldCheck,
  PackageCheck,
  Send
} from 'lucide-react';

export default function LostFoundPage() {
  const { user } = useAuth();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);

  // Filters
  const [activeTab, setActiveTab] = useState('all'); // all, lost, found, my
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportType, setReportType] = useState('lost'); // lost or found
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [contactMessage, setContactMessage] = useState('');

  // AI & Matching state
  const [matchingLoading, setMatchingLoading] = useState(false);
  const [matchResults, setMatchResults] = useState(null);

  // Report Form State
  const [reportForm, setReportForm] = useState({
    item_name: '',
    description: '',
    category: 'Electronics',
    location: '',
    incident_date: new Date().toISOString().split('T')[0],
    image_url: '',
    contact_preference: 'In-App Request'
  });

  const fetchItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        category: selectedCategory,
        status: selectedStatus,
        search: searchQuery
      };

      if (activeTab === 'lost' || activeTab === 'found') {
        params.report_type = activeTab;
      } else if (activeTab === 'my') {
        params.my_items = 'true';
      }

      const res = await lostAndFoundService.getItems(params);
      if (res.success) {
        setItems(res.data);
      } else {
        setError(res.message);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch items');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [activeTab, selectedCategory, selectedStatus]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchItems();
  };

  const openReportModal = (type) => {
    setReportType(type);
    setReportForm({
      item_name: '',
      description: '',
      category: 'Electronics',
      location: '',
      incident_date: new Date().toISOString().split('T')[0],
      image_url: '',
      contact_preference: 'In-App Request'
    });
    setIsReportModalOpen(true);
  };

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    if (!reportForm.item_name || !reportForm.description || !reportForm.location) {
      toast.error('Item name, description, and location are required.');
      return;
    }

    try {
      const payload = {
        ...reportForm,
        report_type: reportType
      };

      const res = await lostAndFoundService.createReport(payload);
      if (res.success) {
        toast.success(`Successfully posted ${reportType.toUpperCase()} item report!`);
        setIsReportModalOpen(false);
        fetchItems();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to submit report');
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    if (!selectedItem) return;
    try {
      const res = await lostAndFoundService.updateStatus(selectedItem.id, newStatus);
      if (res.success) {
        toast.success(`Report status updated to ${newStatus.toUpperCase()}`);
        setSelectedItem({ ...selectedItem, status: newStatus });
        fetchItems();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update status');
    }
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    if (!contactMessage || !selectedItem) return;

    try {
      const res = await lostAndFoundService.sendContactRequest(selectedItem.id, contactMessage);
      if (res.success) {
        toast.success('In-app contact request delivered to item reporter!');
        setIsContactModalOpen(false);
        setContactMessage('');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to send contact request');
    }
  };

  const handleRunMatch = async (itemId) => {
    setMatchingLoading(true);
    setMatchResults(null);
    try {
      const res = await lostAndFoundService.findMatches(itemId);
      if (res.success) {
        setMatchResults(res.data);
      }
    } catch (err) {
      toast.error('Failed to run match query: ' + err.message);
    } finally {
      setMatchingLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <TopNavbar />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <PageHeader
            title="Campus Lost & Found Portal"
            subtitle="Report misplaced belongings, browse found items across campus, and connect securely with owners"
            action={
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openReportModal('lost')}
                  className="px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold text-xs flex items-center gap-1.5 transition-all"
                >
                  <HelpCircle className="w-4 h-4 text-rose-400" /> I Lost Something
                </button>
                <button
                  onClick={() => openReportModal('found')}
                  className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 flex items-center gap-1.5 transition-all"
                >
                  <PlusCircle className="w-4 h-4" /> I Found Something
                </button>
              </div>
            }
          />

          {/* Navigation Tabs & Toolbar */}
          <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 mb-6 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Type Tabs */}
              <div className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-2xl border border-slate-700/60 overflow-x-auto">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    activeTab === 'all' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  All Items
                </button>
                <button
                  onClick={() => setActiveTab('lost')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    activeTab === 'lost' ? 'bg-rose-500 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Lost Reports
                </button>
                <button
                  onClick={() => setActiveTab('found')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    activeTab === 'found' ? 'bg-emerald-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Found Reports
                </button>
                <button
                  onClick={() => setActiveTab('my')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    activeTab === 'my' ? 'bg-purple-500 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  My Submissions
                </button>
              </div>

              {/* Search Bar */}
              <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search item name, brand, location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-800/80 border border-slate-700/60 rounded-xl text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-cyan-500"
                />
              </form>
            </div>

            {/* Filter Controls */}
            <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-800/60 text-xs">
              <span className="text-slate-400 font-medium flex items-center gap-1">
                <Filter className="w-3.5 h-3.5 text-cyan-400" /> Filter By:
              </span>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                <option value="All">All Categories</option>
                <option value="Electronics">Electronics</option>
                <option value="Documents">Documents & IDs</option>
                <option value="Books">Books & Stationary</option>
                <option value="Accessories">Accessories & Keys</option>
                <option value="Clothing">Clothing</option>
                <option value="Other">Other Items</option>
              </select>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                <option value="all">All Statuses</option>
                <option value="open">Active / Open</option>
                <option value="claimed">Claimed</option>
                <option value="returned">Returned</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          </div>

          {/* List Results */}
          {loading ? (
            <LoadingSpinner text="Searching campus lost and found items..." />
          ) : error ? (
            <ErrorMessage message={error} onRetry={fetchItems} />
          ) : items.length === 0 ? (
            <EmptyState
              title="No items found"
              description="No lost or found reports match your current filter parameters."
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {items.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    setSelectedItem(item);
                    setMatchResults(null);
                    setIsDetailModalOpen(true);
                  }}
                  className="p-5 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col justify-between space-y-4 hover:border-slate-700 transition-all cursor-pointer group"
                >
                  <div>
                    {/* Header Badges */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        item.report_type === 'lost'
                          ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      }`}>
                        {item.report_type === 'lost' ? '🔍 LOST ITEM' : '💡 FOUND ITEM'}
                      </span>

                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                        item.status === 'open' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' :
                        item.status === 'returned' || item.status === 'claimed' ? 'bg-emerald-500/10 text-emerald-400' :
                        'bg-slate-800 text-slate-400'
                      }`}>
                        {item.status}
                      </span>
                    </div>

                    {/* Image or Icon Preview */}
                    {item.image_url ? (
                      <div className="w-full h-36 rounded-2xl bg-slate-800 overflow-hidden mb-3">
                        <img
                          src={item.image_url}
                          alt={item.item_name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                    ) : (
                      <div className="w-full h-24 rounded-2xl bg-slate-800/60 border border-slate-700/40 flex items-center justify-center mb-3 text-slate-500">
                        <Tag className="w-8 h-8 opacity-40" />
                      </div>
                    )}

                    <h3 className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors line-clamp-1">
                      {item.item_name}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 space-y-1.5 text-xs text-slate-400">
                    <div className="flex items-center gap-1.5 text-slate-300 font-medium truncate">
                      <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span className="truncate">{item.location}</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" /> {item.incident_date}
                      </span>
                      <span>By: {item.reporter_name || 'Campus User'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Submit Lost/Found Report Modal */}
          <Modal
            isOpen={isReportModalOpen}
            onClose={() => setIsReportModalOpen(false)}
            title={reportType === 'lost' ? 'Report a Lost Item' : 'Report a Found Item'}
          >
            <form onSubmit={handleReportSubmit} className="space-y-4">
              <FormField label="Item Name & Short Description" required>
                <input
                  type="text"
                  placeholder={reportType === 'lost' ? 'e.g. Blue AirPods Pro in Silicon Case' : 'e.g. Parker Pen and Notebook'}
                  value={reportForm.item_name}
                  onChange={(e) => setReportForm({ ...reportForm, item_name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-200"
                />
              </FormField>

              <div className="grid grid-cols-2 gap-3">
                <FormField label="Category" required>
                  <select
                    value={reportForm.category}
                    onChange={(e) => setReportForm({ ...reportForm, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-200"
                  >
                    <option value="Electronics">Electronics</option>
                    <option value="Documents">Documents & IDs</option>
                    <option value="Books">Books & Stationary</option>
                    <option value="Accessories">Accessories & Keys</option>
                    <option value="Clothing">Clothing</option>
                    <option value="Other">Other</option>
                  </select>
                </FormField>

                <FormField label="Incident Date" required>
                  <input
                    type="date"
                    value={reportForm.incident_date}
                    onChange={(e) => setReportForm({ ...reportForm, incident_date: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-200"
                  />
                </FormField>
              </div>

              <FormField label="Campus Location" required>
                <input
                  type="text"
                  placeholder="e.g. Central Library 2nd Floor / Cafeteria Block B"
                  value={reportForm.location}
                  onChange={(e) => setReportForm({ ...reportForm, location: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-200"
                />
              </FormField>

              <FormField label="Detailed Description" required>
                <textarea
                  rows="3"
                  placeholder="Describe unique marks, color, brand, condition, or contents..."
                  value={reportForm.description}
                  onChange={(e) => setReportForm({ ...reportForm, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-200"
                />
              </FormField>

              <FormField label="Photo Image URL (Optional)">
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={reportForm.image_url}
                  onChange={(e) => setReportForm({ ...reportForm, image_url: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-200"
                />
              </FormField>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsReportModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-800 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/20"
                >
                  Post Report
                </button>
              </div>
            </form>
          </Modal>

          {/* Item Detail Modal */}
          {selectedItem && (
            <Modal isOpen={isDetailModalOpen} onClose={() => setIsDetailModalOpen(false)} title="Item Details & Matching">
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase ${
                    selectedItem.report_type === 'lost' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  }`}>
                    {selectedItem.report_type === 'lost' ? '🔍 LOST REPORT' : '💡 FOUND REPORT'}
                  </span>
                  <span className="text-xs text-slate-400 capitalize font-bold bg-slate-800 px-2.5 py-0.5 rounded-full">
                    Status: {selectedItem.status}
                  </span>
                </div>

                {selectedItem.image_url && (
                  <div className="w-full h-48 rounded-2xl bg-slate-800 overflow-hidden">
                    <img src={selectedItem.image_url} alt={selectedItem.item_name} className="w-full h-full object-cover" />
                  </div>
                )}

                <div>
                  <h3 className="text-base font-bold text-white">{selectedItem.item_name}</h3>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">{selectedItem.description}</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-800/70 border border-slate-700/60 grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Location:</span>
                    <strong className="text-cyan-400">{selectedItem.location}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Category:</span>
                    <strong className="text-slate-200">{selectedItem.category}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Incident Date:</span>
                    <strong className="text-slate-200">{selectedItem.incident_date}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Posted By:</span>
                    <strong className="text-slate-200">{selectedItem.reporter_name || 'Campus User'}</strong>
                  </div>
                </div>

                {/* Owner Actions */}
                {(user?.id === selectedItem.user_id || user?.role === 'admin' || user?.role === 'faculty') && (
                  <div className="p-3.5 rounded-2xl bg-slate-800/40 border border-slate-700/50 space-y-2">
                    <p className="text-xs font-bold text-slate-300">Reporter Control Options:</p>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => handleStatusUpdate('claimed')}
                        className="px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold"
                      >
                        Mark Claimed
                      </button>
                      <button
                        onClick={() => handleStatusUpdate('returned')}
                        className="px-3 py-1 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-bold"
                      >
                        Mark Returned
                      </button>
                      <button
                        onClick={() => handleStatusUpdate('closed')}
                        className="px-3 py-1 rounded-xl bg-slate-700 text-slate-300 text-xs font-bold"
                      >
                        Close Post
                      </button>
                    </div>
                  </div>
                )}

                {/* AI / Smart Match Action */}
                <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-cyan-400" /> Automated Item Match Engine
                    </span>
                    <button
                      onClick={() => handleRunMatch(selectedItem.id)}
                      disabled={matchingLoading}
                      className="px-3 py-1 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-colors disabled:opacity-50"
                    >
                      {matchingLoading ? 'Searching...' : 'Find Matches'}
                    </button>
                  </div>

                  {matchResults && (
                    <div className="space-y-3 pt-2">
                      <p className="text-xs text-slate-300 italic bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                        {matchResults.aiSummary}
                      </p>

                      {matchResults.matches?.length === 0 ? (
                        <p className="text-xs text-slate-400">No counterpart items matched this report yet.</p>
                      ) : (
                        <div className="space-y-2">
                          <p className="text-xs font-bold text-slate-200">Candidate Counterpart Reports:</p>
                          {matchResults.matches.map(m => (
                            <div key={m.id} className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                              <div>
                                <span className="font-bold text-white">{m.item_name}</span>
                                <span className="text-[11px] text-slate-400 block">{m.location} &bull; {m.incident_date}</span>
                              </div>
                              <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-bold text-[10px]">
                                {m.matchScore}% Score
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Contact Action */}
                <div className="pt-2 flex justify-end gap-3">
                  <button
                    onClick={() => setIsDetailModalOpen(false)}
                    className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-800 text-slate-300"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      setIsDetailModalOpen(false);
                      setIsContactModalOpen(true);
                    }}
                    className="px-5 py-2 text-xs font-bold rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 flex items-center gap-1.5 shadow-lg shadow-cyan-500/20"
                  >
                    <Send className="w-3.5 h-3.5" /> Contact Reporter
                  </button>
                </div>
              </div>
            </Modal>
          )}

          {/* In-App Contact Request Modal */}
          <Modal isOpen={isContactModalOpen} onClose={() => setIsContactModalOpen(false)} title="Send In-App Request to Item Owner">
            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div className="p-3 rounded-xl bg-slate-800/80 text-xs text-slate-300">
                Contacting owner of: <strong className="text-cyan-400">{selectedItem?.item_name}</strong>
              </div>

              <FormField label="Your Message / Proof of Ownership" required>
                <textarea
                  rows="4"
                  placeholder="Describe details only the real owner would know (e.g., serial number, wallpaper, contents)..."
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-200"
                />
              </FormField>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsContactModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-800 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" /> Send Request
                </button>
              </div>
            </form>
          </Modal>
        </main>
      </div>
    </div>
  );
}
