const jwt = require('jsonwebtoken');
const { supabase } = require('../config/supabase');

const JWT_SECRET = process.env.JWT_SECRET || 'campusflow-ai-super-secret-jwt-key-2026';

// Demo users array for instant login testing
const DEMO_USERS = [
  {
    id: 'student-id-303',
    email: 'student@campusflow.edu',
    password: 'password123',
    full_name: 'Alex Johnson',
    role: 'student',
    department: 'Computer Science & Engineering',
    semester: 6,
    enrollment_number: 'CS2026-089',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
  },
  {
    id: 'faculty-id-202',
    email: 'faculty@campusflow.edu',
    password: 'password123',
    full_name: 'Prof. Alan Turing',
    role: 'faculty',
    department: 'Computer Science & Engineering',
    semester: null,
    enrollment_number: 'FAC-2026-012',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'
  },
  {
    id: 'admin-id-101',
    email: 'admin@campusflow.edu',
    password: 'password123',
    full_name: 'Dr. Sarah Connor',
    role: 'admin',
    department: 'Administration',
    semester: null,
    enrollment_number: 'ADM-2026-001',
    avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150'
  }
];

async function loginUser(req, res) {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Try Supabase auth if connected
    if (supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (!error && data?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        const userPayload = {
          id: data.user.id,
          email: data.user.email,
          role: profile?.role || 'student',
          full_name: profile?.full_name || 'User',
          department: profile?.department,
          semester: profile?.semester,
          enrollment_number: profile?.enrollment_number
        };

        const token = jwt.sign(userPayload, JWT_SECRET, { expiresIn: '7d' });

        return res.json({
          success: true,
          message: 'Login successful',
          data: {
            user: userPayload,
            token
          }
        });
      }
    }

    // Check Demo Users fallback
    const targetEmail = email.toLowerCase().trim();
    let foundUser = DEMO_USERS.find(u => u.email === targetEmail);

    // If role requested specifically and not found, match by role
    if (!foundUser && role) {
      foundUser = DEMO_USERS.find(u => u.role === role);
    }

    if (!foundUser) {
      foundUser = DEMO_USERS[0]; // Fallback to student demo user
    }

    const token = jwt.sign(foundUser, JWT_SECRET, { expiresIn: '7d' });

    return res.json({
      success: true,
      message: 'Login successful (Demo Mode)',
      data: {
        user: foundUser,
        token
      }
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to process login',
      error: error.message
    });
  }
}

async function registerUser(req, res) {
  try {
    const { email, password, full_name, role = 'student', department, semester, enrollment_number } = req.body;

    if (!email || !password || !full_name) {
      return res.status(400).json({
        success: false,
        message: 'Full name, email, and password are required'
      });
    }

    const newUser = {
      id: `user-${Date.now()}`,
      email,
      full_name,
      role,
      department: department || 'Computer Science',
      semester: parseInt(semester) || 1,
      enrollment_number: enrollment_number || `REG-${Date.now().toString().slice(-4)}`
    };

    if (supabase) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name, role, department }
        }
      });

      if (!error && data?.user) {
        await supabase.from('profiles').insert([{
          id: data.user.id,
          full_name,
          email,
          role,
          department,
          semester: parseInt(semester) || 1,
          enrollment_number
        }]);

        newUser.id = data.user.id;
      }
    }

    const token = jwt.sign(newUser, JWT_SECRET, { expiresIn: '7d' });

    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: newUser,
        token
      }
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to register user',
      error: error.message
    });
  }
}

async function getProfile(req, res) {
  return res.json({
    success: true,
    message: 'Profile retrieved successfully',
    data: req.user
  });
}

async function updateProfile(req, res) {
  const { full_name, department, semester, enrollment_number } = req.body;
  const updatedUser = {
    ...req.user,
    full_name: full_name || req.user.full_name,
    department: department || req.user.department,
    semester: semester ? parseInt(semester) : req.user.semester,
    enrollment_number: enrollment_number || req.user.enrollment_number
  };

  return res.json({
    success: true,
    message: 'Profile updated successfully',
    data: updatedUser
  });
}

module.exports = {
  loginUser,
  registerUser,
  getProfile,
  updateProfile,
  DEMO_USERS
};
