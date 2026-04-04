import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Sidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(true);

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navGroups = [
    {
      groupName: 'Main',
      items: [
        { name: 'Dashboard', path: '/dashboard', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
        { name: 'Focus Mode', path: '/focus', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
      ]
    },
    {
      groupName: 'Workspace',
      items: [
        { name: 'Planner Board', path: '/planner', icon: 'M4 6h16M4 10h16M4 14h16M4 18h16' },
        { name: 'Auto Schedule', path: '/schedule', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
        { name: 'Assignments', path: '/assignments', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4' },
        { name: 'Subjects', path: '/subjects', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
      ]
    },
    {
      groupName: 'Progress',
      items: [
        { name: 'Analytics', path: '/analytics', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
        { name: 'Insights', path: '/insights', icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z' },
        { name: 'Goals', path: '/goals', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
      ]
    },
    {
      groupName: 'Connectivity',
      items: [
        { name: 'Atlas AI', path: '/ai-assistant', icon: 'M13 10V3L4 14h7v7l9-11h-7z' }, // using placeholder generic icon for AI
        { name: 'Study Groups', path: '/groups', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
      ]
    }
  ];

  return (
    <aside 
      className={`h-[calc(100vh-2rem)] my-4 ml-4 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-3xl flex flex-col justify-between sticky top-4 z-40 shadow-sm transition-all duration-300 ease-in-out relative overflow-visible ${isExpanded ? 'w-64' : 'w-20'}`}
    >
      {/* Top: Logo / App Name */}
      <div className="flex flex-col h-full overflow-hidden z-10">
        <div className="h-24 flex items-center justify-between px-5 relative shrink-0">
           <Link to="/dashboard" className="flex items-center gap-3 overflow-hidden ml-1 group">
             <div className="min-w-[40px] w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shrink-0 transition-transform group-hover:scale-105">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
             </div>
             <span className={`text-xl font-black text-slate-900 dark:text-white tracking-tight whitespace-nowrap transition-opacity duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0 hidden'}`}>
                StudyPlanner
             </span>
           </Link>
           
           <button 
             onClick={() => setIsExpanded(!isExpanded)}
             className={`absolute -right-4 top-8 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-900 p-1.5 rounded-full shadow-md z-50 transition-all duration-300 hover:scale-110 ${!isExpanded ? 'rotate-180' : ''}`}
           >
             <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
             </svg>
           </button>
        </div>

        {/* Middle: Main Navigation */}
        <nav className="p-3 mt-2 flex-1 overflow-y-auto custom-scrollbar">
          {navGroups.map((group, groupIndex) => (
            <div key={group.groupName} className={`${groupIndex > 0 ? 'mt-6' : ''}`}>
              <p className={`px-4 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 transition-all duration-300 ${isExpanded ? 'block' : 'hidden'}`}>
                {group.groupName}
              </p>
              
              <div className="space-y-1">
                {group.items.map((item) => {
                  const isActive = location.pathname.startsWith(item.path);
                  
                  return (
                    <Link 
                      key={item.name} 
                      to={item.path}
                      title={!isExpanded ? item.name : ""}
                      className={`relative flex items-center gap-4 px-4 py-2.5 rounded-xl transition-all duration-200 font-bold group overflow-hidden ${isActive ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 shadow-sm ring-1 ring-indigo-200 dark:ring-indigo-500/20' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-100 cursor-pointer'}`}
                    >
                      <svg className={`w-5 h-5 shrink-0 transition-colors duration-300 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-500 group-hover:text-indigo-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon}></path>
                      </svg>
                      <span className={`whitespace-nowrap transition-opacity duration-300 text-sm ${isExpanded ? 'opacity-100 w-auto' : 'opacity-0 w-0 hidden'}`}>
                        {item.name}
                      </span>
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>

      {/* Bottom: Logout */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-800 space-y-2 shrink-0 z-10 relative bg-slate-50 dark:bg-[#0f172a] rounded-b-3xl">
         <button 
           onClick={handleLogout} 
           title={!isExpanded ? "Logout" : ""}
           className="w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 font-bold text-rose-600 dark:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 hover:text-rose-700 dark:hover:text-rose-400 border border-transparent text-left group overflow-hidden cursor-pointer"
         >
            <svg className="w-5 h-5 shrink-0 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
            <span className={`whitespace-nowrap transition-opacity duration-300 text-sm ${isExpanded ? 'opacity-100 w-auto' : 'opacity-0 w-0 hidden'}`}>
              Logout
            </span>
         </button>
      </div>
    </aside>
  );
}
