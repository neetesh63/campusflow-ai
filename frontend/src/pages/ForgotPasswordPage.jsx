import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { Sparkles, Mail, ArrowLeft, Send } from 'lucide-react';
import FormField from '../components/FormField';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }
    setSubmitted(true);
    toast.success('Password reset instructions sent to your email.');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-8 text-slate-100">
        <div className="text-center">
          <Link to="/" className="inline-flex items-center gap-2 font-bold text-xl tracking-tight text-white mb-2">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-slate-950" />
            </div>
            <span>Campus<span className="text-cyan-400">Flow</span> AI</span>
          </Link>
          <h2 className="text-xl font-bold mt-2">Reset Password</h2>
          <p className="text-xs text-slate-400 mt-1">Enter your registered email to receive a reset link</p>
        </div>

        {submitted ? (
          <div className="mt-6 p-6 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-center">
            <Send className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-cyan-300">Reset Email Dispatched</h3>
            <p className="text-xs text-slate-300 mt-2">
              We have sent a verification code to <span className="font-semibold text-white">{email}</span>. Check your inbox to set a new password.
            </p>
            <Link to="/login" className="mt-4 inline-block text-xs font-bold text-cyan-400 hover:underline">
              Return to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <FormField label="Email Address" required>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  placeholder="student@campusflow.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </FormField>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" /> Send Reset Link
            </button>
          </form>
        )}

        <div className="mt-6 text-center">
          <Link to="/login" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
