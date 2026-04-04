import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Profile from './pages/Profile';
import Subjects from './pages/Subjects';
import Assignments from './pages/Assignments';
import FocusMode from './pages/FocusMode';
import Analytics from './pages/Analytics';
import Goals from './pages/Goals';
import Insights from './pages/Insights';
import Schedule from './pages/Schedule';
import Planner from './pages/Planner';
import Dashboard from './pages/Dashboard';
import Groups from './pages/Groups';
import Home from './pages/Home';
import AIAssistant from './pages/AIAssistant';
import VerifyEmail from './pages/VerifyEmail';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import { processQueue } from './utils/offlineSync';
import api from './api/axiosConfig';
import { ThemeProvider } from './context/ThemeContext';

function App() {
  React.useEffect(() => {
    const handleOnline = () => {
      console.log("Back online! Syncing...");
      processQueue(api);
    };
    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, []);

  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="flex bg-slate-50 dark:bg-[#0f172a] min-h-screen text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300 selection:bg-indigo-900/30">
            <Sidebar />
            <div className="flex-1 flex flex-col min-h-screen relative z-10 overflow-x-hidden">
              <Navbar />
              <Routes>
                <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/profile" element={
              <ProtectedRoute><Profile /></ProtectedRoute>
            } />
            <Route path="/subjects" element={
              <ProtectedRoute><Subjects /></ProtectedRoute>
            } />
            <Route path="/assignments" element={
              <ProtectedRoute><Assignments /></ProtectedRoute>
            } />
            <Route path="/focus" element={
              <ProtectedRoute><FocusMode /></ProtectedRoute>
            } />
            <Route path="/analytics" element={
              <ProtectedRoute><Analytics /></ProtectedRoute>
            } />
            <Route path="/goals" element={
              <ProtectedRoute><Goals /></ProtectedRoute>
            } />
            <Route path="/insights" element={
              <ProtectedRoute><Insights /></ProtectedRoute>
            } />
            <Route path="/schedule" element={
              <ProtectedRoute><Schedule /></ProtectedRoute>
            } />
            <Route path="/planner" element={
              <ProtectedRoute><Planner /></ProtectedRoute>
            } />
            <Route path="/dashboard" element={
              <ProtectedRoute><Dashboard /></ProtectedRoute>
            } />
            <Route path="/groups" element={
              <ProtectedRoute><Groups /></ProtectedRoute>
            } />
            <Route path="/ai-assistant" element={
              <ProtectedRoute><AIAssistant /></ProtectedRoute>
            } />
            <Route path="/verify-email" element={<VerifyEmail />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
