import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

export function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

export function RoleGuard({ allowedRoles = [], children }) {
  const { user } = useAuth();

  if (!user || !allowedRoles.includes(user.role)) {
    return (
      <div className="p-8 text-center bg-slate-900 rounded-3xl border border-slate-800 my-8">
        <h3 className="text-xl font-bold text-rose-400">Access Restricted</h3>
        <p className="text-slate-400 text-sm mt-2">
          Your current role (<span className="capitalize text-slate-200 font-bold">{user?.role || 'Guest'}</span>) does not have permission to view this administrative page.
        </p>
      </div>
    );
  }

  return children;
}
