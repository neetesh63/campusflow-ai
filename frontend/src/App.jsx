import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { ProtectedRoute } from './components/ProtectedRoute';

// Public Pages
import LandingPage from './pages/LandingPage';
import FeaturesPage from './pages/FeaturesPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import HowItWorksPage from './pages/HowItWorksPage';
import RoleBenefitsPage from './pages/RoleBenefitsPage';
import AICapabilitiesPage from './pages/AICapabilitiesPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import SupabaseTestPage from './pages/SupabaseTestPage';
import NotFoundPage from './pages/NotFoundPage';

// Authenticated & Module Pages
import DashboardPage from './pages/DashboardPage';
import AttendancePage from './pages/AttendancePage';
import AssignmentsPage from './pages/AssignmentsPage';
import NoticesPage from './pages/NoticesPage';
import EventsPage from './pages/EventsPage';
import ComplaintsPage from './pages/ComplaintsPage';
import LostAndFoundPage from './pages/LostAndFoundPage';
import PollsPage from './pages/PollsPage';
import PlacementHubPage from './pages/PlacementHubPage';
import NotificationsPage from './pages/NotificationsPage';
import AIAssistantPage from './pages/AIAssistantPage';
import AIStudyPlannerPage from './pages/AIStudyPlannerPage';
import AnalyticsPage from './pages/AnalyticsPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import UserManagementPage from './pages/UserManagementPage';
import CourseManagementPage from './pages/CourseManagementPage';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/features" element={<FeaturesPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<SignupPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/how-it-works" element={<HowItWorksPage />} />
              <Route path="/role-benefits" element={<RoleBenefitsPage />} />
              <Route path="/ai-capabilities" element={<AICapabilitiesPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/supabase-test" element={<SupabaseTestPage />} />

              {/* Protected Routes */}
              <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
              <Route path="/attendance" element={<ProtectedRoute><AttendancePage /></ProtectedRoute>} />
              <Route path="/assignments" element={<ProtectedRoute><AssignmentsPage /></ProtectedRoute>} />
              <Route path="/notices" element={<ProtectedRoute><NoticesPage /></ProtectedRoute>} />
              <Route path="/events" element={<ProtectedRoute><EventsPage /></ProtectedRoute>} />
              <Route path="/complaints" element={<ProtectedRoute><ComplaintsPage /></ProtectedRoute>} />
              <Route path="/lost-found" element={<ProtectedRoute><LostAndFoundPage /></ProtectedRoute>} />
              <Route path="/lost-and-found" element={<ProtectedRoute><LostAndFoundPage /></ProtectedRoute>} />
              <Route path="/polls" element={<ProtectedRoute><PollsPage /></ProtectedRoute>} />
              <Route path="/placement" element={<ProtectedRoute><PlacementHubPage /></ProtectedRoute>} />
              <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
              <Route path="/ai-assistant" element={<ProtectedRoute><AIAssistantPage /></ProtectedRoute>} />
              <Route path="/study-planner" element={<ProtectedRoute><AIStudyPlannerPage /></ProtectedRoute>} />
              <Route path="/analytics" element={<ProtectedRoute><AnalyticsPage /></ProtectedRoute>} />

              <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />

              {/* Admin Routes */}
              <Route path="/admin/users" element={<ProtectedRoute><UserManagementPage /></ProtectedRoute>} />
              <Route path="/admin/courses" element={<ProtectedRoute><CourseManagementPage /></ProtectedRoute>} />

              {/* Fallback 404 Route */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </BrowserRouter>
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}