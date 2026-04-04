import React, { useState, useEffect, useRef } from 'react';
import api from '../api/axiosConfig';
import { Link } from 'react-router-dom';

export default function NotificationCenter() {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications');
      setNotifications(res.data);
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    }
  };

  const generateAndFetch = async () => {
    try {
      await api.post('/notifications/generate');
      await fetchNotifications();
    } catch (err) {
      console.error("Failed to generate notifications", err);
    }
  }

  useEffect(() => {
    // Initial fetch
    generateAndFetch();

    // Poll every 60 seconds
    const intervalId = setInterval(() => {
      generateAndFetch();
    }, 60000);

    return () => clearInterval(intervalId);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAsRead = async (ids) => {
    try {
      await api.post('/notifications/mark-read', { ids });
      // Update local state instead of refetching instantly to feel faster
      setNotifications(prev => prev.map(n => ids.includes(n.id) ? { ...n, read: true } : n));
    } catch (err) {
      console.error("Failed to mark as read", err);
    }
  };

  const markAllAsRead = () => {
    const unreadIds = notifications.filter(n => !n.read).map(n => n.id);
    if (unreadIds.length > 0) {
      handleMarkAsRead(unreadIds);
    }
  };

  const getIcon = (type) => {
    switch(type) {
      case 'DEADLINE': 
        return <svg className="w-5 h-5 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>;
      case 'INACTIVITY':
        return <svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>;
      default:
        return <svg className="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white transition-colors rounded-full hover:bg-white dark:bg-slate-800"
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-slate-900 animate-pulse"></span>
        )}
      </button>

      {/* Dropdown Pane */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900/95 backdrop-blur-xl border border-slate-300 dark:border-slate-700 shadow-2xl rounded-2xl overflow-hidden z-50 transform origin-top-right transition-all">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-white dark:bg-slate-900">
            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              Notifications
              {unreadCount > 0 && <span className="bg-rose-500/20 text-rose-400 text-xs px-2 py-0.5 rounded-full">{unreadCount} new</span>}
            </h3>
            {unreadCount > 0 && (
              <button onClick={markAllAsRead} className="text-xs text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
                Mark all read
              </button>
            )}
          </div>
          
          <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-slate-500 flex flex-col items-center">
                <svg className="w-10 h-10 mb-3 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path></svg>
                <p>You're all caught up!</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-200 dark:divide-slate-800/50">
                {notifications.map(n => (
                  <div 
                    key={n.id} 
                    onClick={() => { if (!n.read) handleMarkAsRead([n.id]) }}
                    className={`p-4 hover:bg-white dark:bg-slate-800/50 transition-colors cursor-pointer flex gap-4 ${!n.read ? 'bg-indigo-900/10' : ''}`}
                  >
                    <div className="mt-1 flex-shrink-0">
                      {getIcon(n.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm ${!n.read ? 'text-slate-900 dark:text-white font-medium' : 'text-slate-500 dark:text-slate-400'}`}>
                        {n.message}
                      </p>
                      <p className="text-xs text-slate-500 mt-1.5 font-medium">
                        {new Date(n.createdAt).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    {!n.read && (
                      <div className="w-2 h-2 rounded-full bg-indigo-500 mt-2 flex-shrink-0 ml-2"></div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="p-3 border-t border-slate-200 dark:border-slate-800 text-center bg-white dark:bg-slate-900/50">
            <Link to="/settings" onClick={() => setIsOpen(false)} className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white font-medium transition-colors">
              Notification Settings
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
