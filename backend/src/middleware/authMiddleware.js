const jwt = require('jsonwebtoken');
const { supabase } = require('../config/supabase');

const JWT_SECRET = process.env.JWT_SECRET || 'campusflow-ai-super-secret-jwt-key-2026';

const DEMO_PROFILES = {
  student: {
    id: 'student-id-303',
    email: 'student@campusflow.edu',
    role: 'student',
    full_name: 'Alex Johnson',
    department: 'Computer Science & Engineering',
    semester: 6,
    enrollment_number: 'CS2026-089',
    is_demo: true
  },
  faculty: {
    id: 'faculty-id-202',
    email: 'faculty@campusflow.edu',
    role: 'faculty',
    full_name: 'Prof. Alan Turing',
    department: 'Computer Science & Engineering',
    enrollment_number: 'FAC-2026-012',
    is_demo: true
  },
  admin: {
    id: 'admin-id-101',
    email: 'admin@campusflow.edu',
    role: 'admin',
    full_name: 'Dr. Sarah Connor',
    department: 'Administration',
    enrollment_number: 'ADM-2026-001',
    is_demo: true
  }
};

/**
 * Helper to normalize role strings to lowercase
 */
function normalizeRole(roleStr) {
  if (!roleStr) return 'student';
  const clean = String(roleStr).toLowerCase().trim();
  if (clean === 'teacher' || clean === 'professor' || clean === 'instructor') return 'faculty';
  if (clean === 'administrator' || clean === 'superadmin') return 'admin';
  return clean;
}

/**
 * Verify JWT or Supabase Token & attach user profile to request
 */
async function authenticateUser(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    const headerDemoRole = req.headers['x-demo-role'] ? normalizeRole(req.headers['x-demo-role']) : null;

    // 1. If Authorization header is missing or non-Bearer
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      if (headerDemoRole && DEMO_PROFILES[headerDemoRole]) {
        req.user = { ...DEMO_PROFILES[headerDemoRole], is_demo: true };
        return next();
      }
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Please sign in or use a demo account.'
      });
    }

    const token = authHeader.split(' ')[1];

    // 2. Check if token is a Demo Mode Token (e.g., demo_token_faculty_1726245123)
    if (token.startsWith('demo_token_')) {
      let matchedRole = 'student';
      if (token.includes('faculty') || headerDemoRole === 'faculty') matchedRole = 'faculty';
      else if (token.includes('admin') || headerDemoRole === 'admin') matchedRole = 'admin';

      req.user = { ...(DEMO_PROFILES[matchedRole] || DEMO_PROFILES.student), is_demo: true };
      return next();
    }

    // 2.5 Check if token is a local Supabase client fallback token (e.g. sb_token_<uuid>)
    if (token.startsWith('sb_token_')) {
      const sbId = token.replace('sb_token_', '');
      req.user = {
        id: sbId,
        email: 'user@campusflow.edu',
        role: 'student',
        full_name: 'Campus User',
        is_demo: false
      };
      return next();
    }

    // 3. Attempt standard backend JWT verification
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      if (decoded && decoded.role) {
        req.user = {
          ...decoded,
          role: normalizeRole(decoded.role),
          is_demo: false
        };
        return next();
      }
    } catch (jwtErr) {
      // JWT failed, proceed to check Supabase token
    }

    // 4. Attempt Supabase Auth verification if Supabase client is active
    if (supabase) {
      try {
        const { data: { user }, error } = await supabase.auth.getUser(token);
        if (!error && user) {
          let userRole = normalizeRole(user.user_metadata?.role);

          try {
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', user.id)
              .maybeSingle();

            if (profile && profile.role) {
              userRole = normalizeRole(profile.role);
            }
          } catch (pe) {
            console.warn('Profile database lookup warning:', pe.message);
          }

          req.user = {
            id: user.id,
            email: user.email,
            role: userRole,
            full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
            department: user.user_metadata?.department || 'Computer Science',
            is_demo: false
          };
          return next();
        }
      } catch (sbAuthErr) {
        console.warn('Supabase getUser error:', sbAuthErr.message);
      }
    }

    // 4.5 Attempt Supabase Auth token decoding fallback (extract user claims without network call)
    try {
      const decoded = jwt.decode(token);
      if (decoded && (decoded.sub || decoded.email)) {
        req.user = {
          id: decoded.sub || decoded.id || 'real-user-id',
          email: decoded.email || 'user@campusflow.edu',
          role: normalizeRole(decoded.user_metadata?.role || decoded.role || 'student'),
          full_name: decoded.user_metadata?.full_name || decoded.email?.split('@')[0] || 'Campus User',
          department: decoded.user_metadata?.department || 'Computer Science',
          is_demo: false
        };
        return next();
      }
    } catch (decodeErr) {}

    // 5. If token was provided but failed verification in all providers, check demo role fallback
    if (headerDemoRole && DEMO_PROFILES[headerDemoRole]) {
      req.user = { ...DEMO_PROFILES[headerDemoRole], is_demo: true };
      return next();
    }

    return res.status(401).json({
      success: false,
      message: 'Unauthorized access. Invalid or expired authentication token.'
    });

  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized access',
      error: error.message
    });
  }
}

/**
 * Role Guard Middleware
 * Usage: requireRole(['faculty', 'admin'])
 */
function requireRole(allowedRoles = []) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Please sign in.'
      });
    }

    const userRole = normalizeRole(req.user.role);

    if (!userRole) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden. User profile or role is missing.'
      });
    }

    const normalizedAllowed = allowedRoles.map(r => normalizeRole(r));

    if (!normalizedAllowed.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden. Action requires one of the following roles: ${allowedRoles.join(', ')}`
      });
    }

    next();
  };
}

module.exports = {
  authenticateUser,
  requireRole,
  normalizeRole
};
