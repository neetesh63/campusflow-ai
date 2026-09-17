import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Sparkles, Lock, Mail, User, GraduationCap, Users, Building2, ArrowRight, Home } from 'lucide-react';
import FormField from '../components/FormField';

export default function LoginPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialMode = searchParams.get('mode') === 'register' ? 'register' : 'signin';
  const [mode, setMode] = useState(initialMode);

  // Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [fullName, setFullName] = useState('');
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [semester, setSemester] = useState('6');

  const [loading, setLoading] = useState(false);
  const { user, login, register, loginAsDemoRole } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  // Sync mode state with search parameter
  useEffect(() => {
    const paramMode = searchParams.get('mode');
    if (paramMode === 'register') {
      setMode('register');
    } else if (paramMode === 'signin') {
      setMode('signin');
    }
  }, [searchParams]);

  // Redirect authenticated user to Dashboard
  useEffect(() => {
    if (user) {
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);

  const handleModeSwitch = (targetMode) => {
    setMode(targetMode);
    setSearchParams({ mode: targetMode });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter email and password.');
      return;
    }

    setLoading(true);
    if (mode === 'register') {
      if (!fullName) {
        toast.error('Please enter your full name.');
        setLoading(false);
        return;
      }
      const res = await register({
        full_name: fullName,
        email,
        password,
        role,
        department,
        semester
      });
      setLoading(false);
      if (res.success) {
        toast.success(`Account created successfully for ${res.user.full_name}!`);
        navigate('/dashboard', { replace: true });
      } else {
        toast.error(res.message || 'Registration failed');
      }
    } else {
      const res = await login(email, password, role);
      setLoading(false);
      if (res.success) {
        toast.success(`Welcome back, ${res.user.full_name}!`);
        navigate(from, { replace: true });
      } else {
        toast.error(res.message || 'Invalid login credentials');
      }
    }
  };

  const handleDemoLogin = (targetRole) => {
    const demoUser = loginAsDemoRole(targetRole);
    toast.success(`Signed in as Demo ${targetRole.toUpperCase()}: ${demoUser.full_name}`);
    navigate('/dashboard', { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 selection:bg-cyan-500 selection:text-slate-950">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-8 relative">
        {/* Home Link */}
        <Link
          to="/"
          className="absolute top-6 left-6 text-xs text-slate-400 hover:text-cyan-400 flex items-center gap-1 font-medium transition-colors"
        >
          <Home className="w-3.5 h-3.5" /> Home
        </Link>

        {/* Brand Header */}
        <div className="text-center pt-2">
          <Link to="/" className="inline-flex items-center gap-2 font-bold text-xl tracking-tight text-white mb-2">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Sparkles className="w-6 h-6 text-slate-950" />
            </div>
            <span>Campus<span className="text-cyan-400">Flow</span> AI</span>
          </Link>
          <h2 className="text-xl font-bold text-slate-100 mt-2">
            {mode === 'register' ? 'Create Your Account' : 'Welcome Back'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {mode === 'register' ? 'Register new profile in Supabase Database' : 'Sign in with Supabase Auth or Instant Demo Account'}
          </p>
        </div>

        {/* Mode Switcher Buttons */}
        <div className="mt-5 p-1 bg-slate-950 rounded-2xl border border-slate-800 flex text-xs font-bold">
          <button
            type="button"
            onClick={() => handleModeSwitch('signin')}
            className={`flex-1 py-2 rounded-xl transition-all ${
              mode === 'signin' ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20' : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => handleModeSwitch('register')}
            className={`flex-1 py-2 rounded-xl transition-all ${
              mode === 'register' ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20' : 'text-slate-400 hover:text-white'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Demo Account Instant Action Buttons */}
        {mode === 'signin' && (
          <div className="mt-5 p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 text-center">
              🚀 Quick 1-Click Demo Mode Login
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleDemoLogin('student')}
                className="px-2 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-[11px] font-semibold flex flex-col items-center gap-1 transition-all"
              >
                <GraduationCap className="w-4 h-4 text-cyan-400" />
                <span>Student</span>
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('faculty')}
                className="px-2 py-2 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-300 text-[11px] font-semibold flex flex-col items-center gap-1 transition-all"
              >
                <Users className="w-4 h-4 text-blue-400" />
                <span>Faculty</span>
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('admin')}
                className="px-2 py-2 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-300 text-[11px] font-semibold flex flex-col items-center gap-1 transition-all"
              >
                <Building2 className="w-4 h-4 text-purple-400" />
                <span>Admin</span>
              </button>
            </div>
          </div>
        )}

        {/* Divider */}
        <div className="my-5 flex items-center gap-3">
          <div className="flex-1 h-px bg-slate-800" />
          <span className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">
            {mode === 'register' ? 'Fill Profile Details' : 'Or Supabase Auth'}
          </span>
          <div className="flex-1 h-px bg-slate-800" />
        </div>

        {/* Login / Register Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          <FormField label="Account Role" required>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="student">Student Account</option>
              <option value="faculty">Faculty Account</option>
              <option value="admin">Administrator Account</option>
            </select>
          </FormField>

          {mode === 'register' && (
            <FormField label="Full Name" required>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Alex Johnson"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </FormField>
          )}

          <FormField label="Email Address" required>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
              <input
                type="email"
                placeholder="user@campusflow.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </FormField>

          {mode === 'register' && (
            <div className="grid grid-cols-2 gap-3">
              <FormField label="Department">
                <input
                  type="text"
                  placeholder="CSE / IT"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </FormField>
              {role === 'student' && (
                <FormField label="Semester">
                  <input
                    type="number"
                    placeholder="6"
                    value={semester}
                    onChange={(e) => setSemester(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                </FormField>
              )}
            </div>
          )}

          <FormField label="Password" required>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </FormField>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading
              ? 'Processing...'
              : mode === 'register'
              ? 'Register with Supabase'
              : 'Sign In with Supabase'}{' '}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Visible Switcher Paragraph */}
        <p className="mt-6 text-center text-xs text-slate-400">
          {mode === 'register' ? (
            <>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => handleModeSwitch('signin')}
                className="text-cyan-400 font-semibold hover:underline"
              >
                Sign In
              </button>
            </>
          ) : (
            <>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => handleModeSwitch('register')}
                className="text-cyan-400 font-semibold hover:underline"
              >
                Create Account
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}

