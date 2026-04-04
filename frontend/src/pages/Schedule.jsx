import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import { Link } from 'react-router-dom';

export default function Schedule() {
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState(null);

  const fetchSchedule = async () => {
    try {
      setLoading(true);
      const res = await api.get('/scheduler');
      setSchedule(res.data);
    } catch (err) {
      console.error("Failed to fetch schedule", err);
      setError("Could not load your schedule.");
    } finally {
      setLoading(false);
    }
  };

  const generateSchedule = async () => {
    try {
      setGenerating(true);
      const res = await api.post('/scheduler/generate');
      setSchedule(res.data);
    } catch (err) {
      console.error("Failed to generate schedule", err);
      setError("Failed to generate intelligent schedule.");
    } finally {
      setGenerating(false);
    }
  };

  useEffect(() => {
    fetchSchedule();
  }, []);

  const formatTime = (minutes) => {
    if (minutes < 60) return `${minutes}m`;
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return m > 0 ? `${h}h ${m}m` : `${h}h`;
  };

  // Group by Date for timeline render
  const groupedSchedule = Array.isArray(schedule) ? schedule.reduce((acc, session) => {
    const dateStr = session.scheduledDate || 'No Date';
    if (!acc[dateStr]) acc[dateStr] = [];
    acc[dateStr].push(session);
    return acc;
  }, {}) : {};

  const dates = Object.keys(groupedSchedule).sort();

  if (loading) {
    return (
      <div className="p-8 text-slate-800 dark:text-slate-100 flex items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 rounded-full border-4 border-slate-300 dark:border-slate-700 border-t-indigo-500 animate-spin mb-4"></div>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Loading Timeline...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 text-slate-800 dark:text-slate-100 max-w-5xl mx-auto space-y-10 min-h-screen">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tight">Your Schedule</h1>
          <p className="text-lg text-slate-500 dark:text-slate-400 mt-2 font-medium">Auto-generated timeline mapped perfectly to your deadlines.</p>
        </div>
        <button 
          onClick={generateSchedule}
          disabled={generating}
          className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-full flex items-center min-w-[200px] justify-center gap-2 transition-all shadow-[0_0_15px_rgba(79,70,229,0.3)] hover:scale-105"
        >
          {generating ? (
            <div className="w-5 h-5 rounded-full border-2 border-slate-300 border-t-white animate-spin"></div>
          ) : (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
          )}
          {generating ? 'Calculating Matrix...' : 'Regenerate Timeline'}
        </button>
      </div>

      {error && (
        <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 p-4 rounded-xl text-center mb-6">{error}</div>
      )}

      {dates.length === 0 ? (
        <div className="bg-white dark:bg-slate-800/40 border border-slate-300 dark:border-slate-700/50 p-12 rounded-[2.5rem] shadow-sm text-center">
          <div className="w-24 h-24 bg-indigo-500/10 text-indigo-400 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
          </div>
          <h2 className="text-2xl font-black mb-3 text-slate-900 dark:text-white">Your Timeline is Empty</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md mx-auto">You either have no pending assignments, or you need to click the Regenerate button to build your first AI schedule.</p>
          <Link to="/assignments" className="text-indigo-400 font-bold hover:text-slate-900 dark:text-white transition-colors">Go add an Assignment &rarr;</Link>
        </div>
      ) : (
        <div className="space-y-12">
          {dates.map((date, index) => {
            const dateObj = new Date(date + 'T00:00:00');
            const isToday = date === new Date().toISOString().split('T')[0];
            const isPast = dateObj < new Date(new Date().setHours(0,0,0,0));
            const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
            const monthDay = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            const totalMins = groupedSchedule[date].reduce((sum, s) => sum + s.durationMinutes, 0);

            return (
              <div key={date} className="relative">
                {/* Timeline vertical line connector */}
                {index !== dates.length - 1 && (
                  <div className="absolute left-[2.25rem] top-16 bottom-[-3rem] w-0.5 bg-white dark:bg-slate-800/80 -z-10"></div>
                )}
                
                {/* Date Header Segment */}
                <div className="flex items-center gap-6 mb-6">
                  <div className={`w-[4.5rem] h-[4.5rem] rounded-2xl flex flex-col items-center justify-center flex-shrink-0 shadow-lg ${isToday ? 'bg-indigo-600 text-slate-900 dark:text-white' : isPast ? 'bg-rose-500/20 text-rose-400' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}>
                    <span className="text-xs font-bold uppercase tracking-widest">{dayName.slice(0, 3)}</span>
                    <span className="text-xl font-black">{dateObj.getDate()}</span>
                  </div>
                  
                  <div>
                    <h2 className="text-2xl font-bold flex items-center gap-3">
                      {isToday ? 'Today' : monthDay}
                      {isToday && <span className="bg-indigo-500/20 text-indigo-400 text-xs px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">Current</span>}
                      {isPast && <span className="bg-rose-500/20 text-rose-400 text-xs px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">Overdue Risks</span>}
                    </h2>
                    <p className="text-slate-500 font-medium text-sm mt-1">
                      {groupedSchedule[date].length} study blocks &bull; {formatTime(totalMins)} total load
                    </p>
                  </div>
                </div>

                {/* Session Blocks Grid */}
                <div className="pl-[6rem] grid grid-cols-1 md:grid-cols-2 gap-4">
                  {groupedSchedule[date].map(session => (
                    <div 
                      key={session.id} 
                      className={`p-5 rounded-2xl border transition-all hover:-translate-y-1 hover:shadow-xl ${session.status === 'MISSED' ? 'bg-rose-950/20 border-rose-500/30' : session.status === 'COMPLETED' ? 'bg-emerald-950/20 border-emerald-500/30 opacity-70' : 'bg-white dark:bg-slate-800/50 border-slate-300 dark:border-slate-700 hover:border-indigo-500/50'}`}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <span className={`text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wide ${session.status === 'MISSED' ? 'bg-rose-500/20 text-rose-400' : session.status === 'COMPLETED' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white dark:bg-slate-900 text-indigo-400'}`}>
                          {session.status}
                        </span>
                        <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 font-semibold bg-white dark:bg-slate-900/50 px-2.5 py-1 rounded-lg">
                          <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                          {formatTime(session.durationMinutes)}
                        </div>
                      </div>
                      
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1 line-clamp-1" title={session.assignment?.title || 'No Title'}>
                        {session.assignment?.title || 'Unknown Assignment'}
                      </h3>
                      
                      {session.subject && (
                        <p className="text-slate-500 dark:text-slate-400 text-sm flex items-center gap-1.5 font-medium">
                          <span className="w-2 h-2 rounded-full bg-slate-500"></span>
                          {session.subject.name}
                        </p>
                      )}
                      
                      <div className="mt-4 pt-4 border-t border-slate-300 dark:border-slate-700/50 flex justify-between items-center">
                        <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Priority: {session.assignment?.priority || 'Normal'}</span>
                        <Link to="/focus" className={`text-sm font-bold transition-colors ${session.status === 'PENDING' ? 'text-indigo-400 hover:text-indigo-300' : 'text-slate-500 pointer-events-none'}`}>
                          {session.status === 'PENDING' ? 'Start Focus ➔' : 'Closed'}
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
