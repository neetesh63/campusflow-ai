import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Sparkles, User, Mail, Lock, ArrowRight } from 'lucide-react';
import FormField from '../components/FormField';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    role: 'student',
    department: 'Computer Science & Engineering',
    semester: '6',
    enrollment_number: ''
  });

  const [loading, setLoading] = useState(false);
  const { user, register } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Redirect authenticated user to Dashboard immediately
  useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.full_name || !formData.email || !formData.password) {
      toast.error('Full name, email, and password are required.');
      return;
    }

    setLoading(true);
    const res = await register(formData);
    setLoading(false);

    if (res.success) {
      toast.success(`Account created successfully for ${res.user.full_name}!`);
      navigate('/dashboard', { replace: true });
    } else {
      toast.error(res.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 selection:bg-cyan-500 selection:text-slate-950">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-8">
        <div className="text-center">
          <Link to="/" className="inline-flex items-center gap-2 font-bold text-xl tracking-tight text-white mb-2">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Sparkles className="w-6 h-6 text-slate-950" />
            </div>
            <span>Campus<span className="text-cyan-400">Flow</span> AI</span>
          </Link>
          <h2 className="text-xl font-bold text-slate-100 mt-2">Create Your Account</h2>
          <p className="text-xs text-slate-400 mt-1">Register new user account in Supabase Database</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-3.5">
          <FormField label="Account Role" required>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="student">Student Profile</option>
              <option value="faculty">Faculty Profile</option>
              <option value="admin">Administrator Profile</option>
            </select>
          </FormField>

          <FormField label="Full Name" required>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
              <input
                type="text"
                name="full_name"
                placeholder="Alex Johnson"
                value={formData.full_name}
                onChange={handleChange}
                className="w-full pl-9 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </FormField>

          <FormField label="Campus Email" required>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
              <input
                type="email"
                name="email"
                placeholder="student@campusflow.edu"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-9 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </FormField>

          <div className="grid grid-cols-2 gap-3">
            <FormField label="Department">
              <input
                type="text"
                name="department"
                placeholder="CSE / IT"
                value={formData.department}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </FormField>

            {formData.role === 'student' && (
              <FormField label="Semester">
                <input
                  type="number"
                  name="semester"
                  placeholder="6"
                  value={formData.semester}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </FormField>
            )}
          </div>

          <FormField label="Password" required>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-9 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </FormField>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? 'Registering with Supabase...' : 'Register Account'} <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="text-cyan-400 font-semibold hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
