import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import NotificationCenter from './NotificationCenter';
import api from '../api/axiosConfig';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  
  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.trim().length >= 2) {
        setIsSearching(true);
        try {
          const res = await api.get(`/search?q=${encodeURIComponent(searchQuery)}`);
          setSearchResults(res.data);
          setShowSearchDropdown(true);
        } catch (error) {
          console.error('Search error', error);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
        setShowSearchDropdown(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  // Handle clicking outside to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('#global-search-container')) {
        setShowSearchDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // When User is logged in, they see the robust Top Bar for secondary actions
  if (user) {
    return (
      <header className="bg-white/80 dark:bg-[#0f172a]/80 backdrop-blur-2xl border-b border-slate-200 dark:border-slate-700/50 h-20 flex items-center justify-between px-4 sm:px-8 sticky top-0 z-30 shadow-sm transition-all duration-300">
        {/* Mobile Hamburger Toggle */}
        <button 
          onClick={onToggleSidebar}
          className="lg:hidden p-2.5 mr-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
        </button>

        {/* Search Bar - Global System */}
        <div id="global-search-container" className="flex-1 max-w-xl px-0 sm:px-4 relative">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search assignments, subjects, tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => { if(searchQuery.trim().length >= 2) setShowSearchDropdown(true); }}
              className="block w-full pl-10 pr-3 py-2 border border-slate-300 dark:border-slate-700 rounded-xl leading-5 bg-slate-50 dark:bg-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all sm:text-sm text-slate-900 dark:text-white shadow-inner"
            />
            {isSearching && (
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <div className="w-4 h-4 border-2 border-slate-500 border-t-indigo-500 rounded-full animate-spin"></div>
              </div>
            )}
          </div>

          {/* Search Results Dropdown */}
          {showSearchDropdown && (
            <div className="absolute top-12 left-4 right-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden transform opacity-100 scale-100 transition-all origin-top">
              {searchResults.length > 0 ? (
                <div className="max-h-96 overflow-y-auto custom-scrollbar">
                  {searchResults.map((item) => (
                    <Link 
                      key={`${item.type}-${item.id}`} 
                      to={item.url}
                      onClick={() => { setShowSearchDropdown(false); setSearchQuery(''); }}
                      className="block hover:bg-slate-50 dark:hover:bg-slate-800 p-4 border-b border-slate-100 dark:border-slate-800/50 last:border-0 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg flex-shrink-0 ${
                          item.type === 'SUBJECT' ? 'bg-indigo-500/10 text-indigo-400' :
                          item.type === 'ASSIGNMENT' ? 'bg-fuchsia-500/10 text-fuchsia-400' :
                          'bg-emerald-500/10 text-emerald-400'
                        }`}>
                          {item.type === 'SUBJECT' && <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>}
                          {item.type === 'ASSIGNMENT' && <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg>}
                          {item.type === 'SUBTASK' && <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>}
                        </div>
                        <div>
                          <p className="text-slate-900 dark:text-white font-bold text-sm line-clamp-1">{item.title}</p>
                          <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5 line-clamp-1">{item.description}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center text-slate-400">
                  <svg className="w-8 h-8 mx-auto mb-2 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                  <p className="text-sm font-medium">No results found for "{searchQuery}"</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Secondary Actions */}
        <div className="flex items-center gap-4 sm:gap-6 ml-4">
          {/* Theme Toggle Button */}
          <button 
            onClick={toggleTheme} 
            className="p-2 rounded-xl text-slate-400 hover:text-indigo-400 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
            title="Toggle theme"
          >
            {theme === 'dark' ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
            )}
          </button>

          <NotificationCenter />

          <div className="w-px h-8 bg-slate-800 hidden sm:block"></div>
          
          <Link to="/profile" className="flex items-center gap-4 hover:opacity-80 transition cursor-pointer group">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-slate-100 leading-tight group-hover:text-indigo-400 transition-colors">
                {user.fullName || user.username || 'User'}
              </p>
              <p className="text-xs text-slate-400 font-medium">Student</p>
            </div>
            <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-indigo-500 to-blue-500 p-[2px] shadow-sm transition-all group-hover:shadow-md group-hover:scale-105">
              <div className="w-full h-full rounded-full bg-slate-800/40 flex items-center justify-center text-indigo-300 font-black text-lg">
                {(user.fullName || user.username || 'U').charAt(0).toUpperCase()}
              </div>
            </div>
          </Link>
        </div>
      </header>
    );
  }

  // Hide the global navbar on the landing page since it has its own dedicated professional navbar
  if (location.pathname === '/' && !user) {
    return null;
  }

  if (!user) {
    return (
      <nav className="fixed top-0 w-full z-50 bg-slate-800/40/90 border-b border-slate-700/50 backdrop-blur-xl p-5 shadow-sm transition-all">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link to="/" className="font-black text-xl text-white tracking-wider hover:text-indigo-400 transition-colors">StudyPlanner</Link>
          <div className="flex gap-4 items-center">
            <Link to="/login" className="text-slate-300 hover:text-indigo-400 transition font-bold px-4 py-2">Log in</Link>
            <Link to="/register" className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-full font-bold transition shadow-sm hover:shadow-md">Get Started</Link>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-slate-800/40 border-b border-slate-700/50 p-4 shadow-sm">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="font-black text-xl text-white tracking-wider hover:text-indigo-400 transition-colors">StudyPlanner</Link>
        <div className="flex gap-6 items-center font-bold text-sm">
          <Link to="/dashboard" className="text-slate-300 hover:text-indigo-400 transition">Dashboard</Link>
          <Link to="/profile" className="text-slate-300 hover:text-indigo-400 transition">Profile</Link>
          <Link to="/subjects" className="text-slate-300 hover:text-indigo-400 transition">Subjects</Link>
          <Link to="/assignments" className="text-slate-300 hover:text-indigo-400 transition">Assignments</Link>
          <Link to="/focus" className="text-slate-300 hover:text-indigo-400 transition">Focus Mode</Link>
          <Link to="/groups" className="text-slate-300 hover:text-indigo-400 transition">Study Groups</Link>
          <Link to="/ai-assistant" className="text-fuchsia-600 hover:text-fuchsia-700 flex items-center gap-1 transition-all hover:scale-105 mr-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
            Atlas AI
          </Link>
          <button onClick={handleLogout} className="bg-rose-50 text-rose-600 hover:bg-rose-100 px-4 py-2 rounded-xl transition ml-4 font-bold border border-rose-200">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
