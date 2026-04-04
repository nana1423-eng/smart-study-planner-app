import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function FloatingDock() {
  const { user } = useAuth();

  if (!user) return null;

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path> },
    { name: 'Analytics', path: '/analytics', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path> },
    { name: 'Assignments', path: '/assignments', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path> },
    { name: 'Timeline', path: '/timeline', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path> },
    { name: 'Subjects', path: '/subjects', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path> },
    { name: 'Groups', path: '/groups', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path> },
    { name: 'Resources', path: '/resources', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z"></path> },
    { name: 'Profile', path: '/profile', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path> },
  ];

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] pb-2">
      <div className="flex items-center gap-2 px-4 py-3 rounded-3xl bg-white dark:bg-slate-800/40/80 backdrop-blur-xl border border-white/50 shadow-[0_8px_32px_rgba(0,0,0,0.08)]">
        {navItems.map((item) => (
          <div key={item.name} className="relative group">
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `flex items-center justify-center w-12 h-12 rounded-2xl transition-all duration-300 ${
                  isActive
                    ? 'bg-indigo-900/30 text-indigo-400 shadow-inner scale-105'
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:bg-[#0f172a] hover:text-slate-900 dark:text-white hover:scale-110'
                }`
              }
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {item.icon}
              </svg>
            </NavLink>
            
            {/* Tooltip */}
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-bold rounded-lg opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 pointer-events-none whitespace-nowrap shadow-lg">
              {item.name}
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white dark:bg-slate-900 rotate-45"></div>
            </div>
          </div>
        ))}

        <div className="w-px h-8 bg-slate-200 mx-2"></div>

        {/* Command Center Quick Actions */}
        <div className="relative group">
          <NavLink
            to="/focus"
            className={({ isActive }) =>
              `flex items-center justify-center w-12 h-12 rounded-2xl transition-all duration-300 ${
                isActive
                  ? 'bg-rose-50 text-rose-600 shadow-inner scale-105'
                  : 'text-slate-500 dark:text-slate-400 hover:bg-rose-50 hover:text-rose-600 hover:scale-110'
              }`
            }
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </NavLink>
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-rose-600 text-white text-xs font-bold rounded-lg opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 pointer-events-none whitespace-nowrap shadow-lg">
            Focus Mode
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-rose-600 rotate-45"></div>
          </div>
        </div>

        <div className="relative group">
          <NavLink
            to="/ai-assistant"
            className={({ isActive }) =>
              `flex items-center justify-center w-12 h-12 rounded-2xl transition-all duration-300 ${
                isActive
                  ? 'bg-gradient-to-tr from-indigo-500 to-emerald-400 text-slate-900 dark:text-white shadow-md scale-105'
                  : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:bg-[#0f172a] hover:text-emerald-500 hover:scale-110'
              }`
            }
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
            </svg>
          </NavLink>
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-emerald-500 text-white text-xs font-bold rounded-lg opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 pointer-events-none whitespace-nowrap shadow-lg">
            Atlas AI
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-emerald-500 rotate-45"></div>
          </div>
        </div>

      </div>
    </div>
  );
}
