const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const assignmentRoutes = require('./routes/assignmentRoutes');
const noticeRoutes = require('./routes/noticeRoutes');
const eventRoutes = require('./routes/eventRoutes');
const complaintRoutes = require('./routes/complaintRoutes');
const aiRoutes = require('./routes/aiRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const supabaseRoutes = require('./routes/supabaseRoutes');
const lostFoundRoutes = require('./routes/lostFoundRoutes');
const pollRoutes = require('./routes/pollRoutes');
const placementRoutes = require('./routes/placementRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Security & Utility Middleware
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    const configured = process.env.FRONTEND_URL;
    if (!configured || configured === '*' || origin === configured || origin.startsWith(configured.replace(/\/$/, '')) || origin.endsWith('.vercel.app')) {
      return callback(null, true);
    }
    return callback(null, true); // Allow cross-origin requests for production frontend
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-demo-role']
}));
app.use(express.json());
app.use(morgan('dev'));

// Health Check Endpoints
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'CampusFlow AI Backend is running',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'CampusFlow AI Backend is running',
    services: {
      database: process.env.SUPABASE_URL ? 'configured' : 'mock-fallback',
      ai: process.env.GEMINI_API_KEY ? 'gemini-active' : 'fallback-active'
    }
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/notices', noticeRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/supabase', supabaseRoutes);
app.use('/api/lost-found', lostFoundRoutes);
app.use('/api/polls', pollRoutes);
app.use('/api/placement', placementRoutes);
app.use('/api/notifications', notificationRoutes);



// 404 Route Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `API Route ${req.originalUrl} not found`
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

app.listen(PORT, () => {
  console.log(`==================================================`);
  console.log(` CampusFlow AI Server running on http://localhost:${PORT}`);
  console.log(` Health check: http://localhost:${PORT}/api/health`);
  console.log(` Supabase test: http://localhost:${PORT}/api/supabase/test`);
  console.log(`==================================================`);
});

module.exports = app;