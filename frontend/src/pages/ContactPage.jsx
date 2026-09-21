import React, { useState } from 'react';
import PublicNavbar from '../components/PublicNavbar';
import { useToast } from '../context/ToastContext';
import { Mail, Phone, MapPin, Send, MessageSquare } from 'lucide-react';
import FormField from '../components/FormField';

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const { toast } = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please complete all required fields.');
      return;
    }
    toast.success('Thank you! Your inquiry has been dispatched to campus administration.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-cyan-500 selection:text-slate-950 flex flex-col">
      <PublicNavbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl font-black text-white">Campus Help & Contact Desk</h1>
          <p className="text-xs text-slate-400 mt-2">Have questions about CampusFlow AI? Reach out to our technical support team.</p>
        </div>

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="space-y-4">
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex items-start gap-4">
              <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400 shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-200">Email Support</h3>
                <p className="text-xs text-slate-400 mt-0.5">support@campusflow.edu</p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex items-start gap-4">
              <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400 shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-200">Campus Helpline</h3>
                <p className="text-xs text-slate-400 mt-0.5">+1 (800) 555-FLOW</p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex items-start gap-4">
              <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-200">Office Location</h3>
                <p className="text-xs text-slate-400 mt-0.5">Innovation Hub, Science Block B</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 p-8 rounded-3xl bg-slate-900 border border-slate-800">
            <h2 className="text-lg font-bold text-white mb-6">Send Message</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="Your Name" required>
                  <input
                    type="text"
                    placeholder="Alex Johnson"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                </FormField>

                <FormField label="Email Address" required>
                  <input
                    type="email"
                    placeholder="alex@campusflow.edu"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                </FormField>
              </div>

              <FormField label="Subject">
                <input
                  type="text"
                  placeholder="Inquiry about portal access"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </FormField>

              <FormField label="Message" required>
                <textarea
                  rows="4"
                  placeholder="Describe your inquiry..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </FormField>

              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-2"
              >
                <Send className="w-4 h-4" /> Dispatch Inquiry
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
