import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('campusflow_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        localStorage.removeItem('campusflow_user');
      }
    }
    return null;
  });

  const [token, setToken] = useState(localStorage.getItem('campusflow_token'));
  const [loading, setLoading] = useState(true);

  // Initialize Supabase Auth Session listener & Local Storage sync
  useEffect(() => {
    let subscription = null;

    const initAuth = async () => {
      if (supabase) {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            await syncSupabaseUser(session.user, session.access_token);
          }
        } catch (err) {
          console.warn('Supabase session fetch warning:', err.message);
        }

        const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
          if (event === 'SIGNED_IN' && session?.user) {
            await syncSupabaseUser(session.user, session.access_token);
          } else if (event === 'SIGNED_OUT') {
            setUser(null);
            setToken(null);
            localStorage.removeItem('campusflow_user');
            localStorage.removeItem('campusflow_token');
          }
        });

        subscription = authListener?.subscription;
      }
      setLoading(false);
    };

    initAuth();

    return () => {
      if (subscription) subscription.unsubscribe();
    };
  }, []);

  const syncSupabaseUser = async (sbUser, accessToken) => {
    let userProfile = {
      id: sbUser.id,
      email: sbUser.email,
      full_name: sbUser.user_metadata?.full_name || sbUser.email?.split('@')[0] || 'Campus User',
      role: sbUser.user_metadata?.role || 'student',
      department: sbUser.user_metadata?.department || 'Computer Science',
      avatar_url: sbUser.user_metadata?.avatar_url
    };

    // Try fetching detailed profile from Supabase profiles table
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', sbUser.id)
        .maybeSingle();

      if (profile) {
        userProfile = {
          ...userProfile,
          full_name: profile.full_name || userProfile.full_name,
          role: profile.role || userProfile.role,
          department: profile.department || userProfile.department,
          semester: profile.semester,
          enrollment_number: profile.enrollment_number,
          avatar_url: profile.avatar_url || userProfile.avatar_url
        };
      }
    } catch (e) {
      console.warn('Profile sync warning:', e.message);
    }

    setUser(userProfile);
    setToken(accessToken || `sb_token_${sbUser.id}`);
    localStorage.setItem('campusflow_user', JSON.stringify(userProfile));
    localStorage.setItem('campusflow_token', accessToken || `sb_token_${sbUser.id}`);
    return userProfile;
  };

  const login = async (email, password, role = 'student') => {
    setLoading(true);
    try {
      // 1. Try Supabase Auth first if available
      if (supabase) {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });

        if (!error && data?.user) {
          const syncedUser = await syncSupabaseUser(data.user, data.session?.access_token);
          return { success: true, user: syncedUser, source: 'supabase' };
        }
      }

      // 2. Try Backend API Auth fallback
      const res = await authService.login(email, password, role);
      if (res.success && res.data) {
        const { user: userData, token: userToken } = res.data;
        setUser(userData);
        setToken(userToken);
        localStorage.setItem('campusflow_user', JSON.stringify(userData));
        localStorage.setItem('campusflow_token', userToken);
        return { success: true, user: userData, source: 'backend' };
      }

      return { success: false, message: res.message || 'Invalid email or password' };
    } catch (err) {
      return { success: false, message: err.message || 'Authentication failed' };
    } finally {
      setLoading(false);
    }
  };

  const register = async (formData) => {
    setLoading(true);
    try {
      const { email, password, full_name, role = 'student', department, semester, enrollment_number } = formData;

      // 1. Try Supabase Auth SignUp
      if (supabase) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name, role, department }
          }
        });

        if (!error && data?.user) {
          // Insert profile into database table
          try {
            await supabase.from('profiles').upsert([
              {
                id: data.user.id,
                full_name,
                email,
                role,
                department,
                semester: semester ? parseInt(semester) : 1,
                enrollment_number
              }
            ]);
          } catch (pe) {
            console.warn('Profile table insert warning:', pe.message);
          }

          const registeredUser = await syncSupabaseUser(data.user, data.session?.access_token);
          return { success: true, user: registeredUser, source: 'supabase' };
        }
      }

      // 2. Fallback to Backend API Registration
      const res = await authService.register(formData);
      if (res.success && res.data) {
        const { user: userData, token: userToken } = res.data;
        setUser(userData);
        setToken(userToken);
        localStorage.setItem('campusflow_user', JSON.stringify(userData));
        localStorage.setItem('campusflow_token', userToken);
        return { success: true, user: userData, source: 'backend' };
      }

      return { success: false, message: res.message || 'Registration failed' };
    } catch (err) {
      return { success: false, message: err.message || 'Registration error' };
    } finally {
      setLoading(false);
    }
  };

  const loginAsDemoRole = (role) => {
    const demoProfiles = {
      student: {
        id: 'student-id-303',
        email: 'student@campusflow.edu',
        full_name: 'Alex Johnson',
        role: 'student',
        department: 'Computer Science & Engineering',
        semester: 6,
        enrollment_number: 'CS2026-089',
        avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
      },
      faculty: {
        id: 'faculty-id-202',
        email: 'faculty@campusflow.edu',
        full_name: 'Prof. Alan Turing',
        role: 'faculty',
        department: 'Computer Science & Engineering',
        enrollment_number: 'FAC-2026-012',
        avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'
      },
      admin: {
        id: 'admin-id-101',
        email: 'admin@campusflow.edu',
        full_name: 'Dr. Sarah Connor',
        role: 'admin',
        department: 'Administration',
        enrollment_number: 'ADM-2026-001',
        avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150'
      }
    };

    const target = demoProfiles[role] || demoProfiles.student;
    const fakeToken = `demo_token_${role}_${Date.now()}`;
    setUser(target);
    setToken(fakeToken);
    localStorage.setItem('campusflow_user', JSON.stringify(target));
    localStorage.setItem('campusflow_token', fakeToken);
    return target;
  };

  const logout = async () => {
    if (supabase) {
      try {
        await supabase.auth.signOut();
      } catch (e) {
        console.warn('Supabase signout warning:', e.message);
      }
    }
    setUser(null);
    setToken(null);
    localStorage.removeItem('campusflow_user');
    localStorage.removeItem('campusflow_token');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, loginAsDemoRole, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
