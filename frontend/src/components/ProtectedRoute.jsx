import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <div className="min-h-screen flex items-center justify-center dark:bg-slate-900 dark:text-white">Loading...</div>;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // The Email Verification Interceptor (Temporarily Disabled for Local Testing)
  /*
  if (user && user.emailVerified === false) {
    if (window.location.pathname !== '/verify-email') {
       return <Navigate to="/verify-email" replace />;
    }
  }
  */

  return children;
}
