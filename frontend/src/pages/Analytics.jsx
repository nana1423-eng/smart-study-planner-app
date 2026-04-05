import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, 
  LineChart, Line, AreaChart, Area 
} from 'recharts';
import { Link } from 'react-router-dom';

export default function Analytics() {
  const [summary, setSummary] = useState(null);
  const [weeklyTrend, setWeeklyTrend] = useState([]);
  const [subjectStats, setSubjectStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const [sumRes, weekRes, subRes] = await Promise.all([
          api.get('/analytics/summary'),
          api.get('/analytics/weekly'),
          api.get('/analytics/subjects')
        ]);
        
        setSummary(sumRes.data);
        setWeeklyTrend(weekRes.data);
        setSubjectStats(subRes.data);
      } catch (err) {
        console.error("Failed to fetch analytics", err);
        setError("Could not load analytics data. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="p-8 text-slate-800 dark:text-slate-100 flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 rounded-full border-4 border-slate-300 dark:border-slate-700 border-t-indigo-500 animate-spin mb-4"></div>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Crunching the numbers...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-slate-800 dark:text-slate-100 flex items-center justify-center min-h-[80vh]">
        <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 p-6 rounded-2xl max-w-md text-center shadow-lg">
          <svg className="w-12 h-12 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
          <h2 className="text-lg font-bold mb-2">Error Loading Analytics</h2>
          <p className="text-sm opacity-80">{error}</p>
        </div>
      </div>
    );
  }

  const hasData = summary && summary.totalSessions > 0;

  return (
    <div className="p-4 sm:p-8 text-slate-800 dark:text-slate-100 max-w-7xl mx-auto space-y-8 sm:space-y-10 min-h-screen">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-4 text-center sm:text-left">
        <div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">Analytics</h1>
          <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 mt-2 font-medium">Deep dive into your performance metrics.</p>
        </div>
      </div>

      {!hasData ? (
        <div className="bg-white dark:bg-slate-800/40 border border-slate-300 dark:border-slate-700/50 p-6 sm:p-12 rounded-[2rem] sm:rounded-[2.5rem] shadow-sm text-center">
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-indigo-500/10 text-indigo-400 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
          </div>
          <h2 className="text-xl sm:text-2xl font-black mb-3 text-slate-900 dark:text-white">No Data Yet</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md mx-auto text-sm sm:text-base">Complete your first study session or mark an assignment as complete to start seeing performance metrics.</p>
          <Link to="/focus" className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-8 rounded-full transition-transform hover:scale-105 shadow-[0_0_20px_rgba(79,70,229,0.4)]">
            Start a Focus Session
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
          </Link>
        </div>
      ) : (
        <>
          {/* Top Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-slate-800/60 p-6 rounded-3xl border border-slate-300 dark:border-slate-700/50 flex flex-col justify-between relative overflow-hidden group hover:border-indigo-500/30 transition-colors">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-[40px] rounded-full group-hover:bg-indigo-500/20 transition-colors"></div>
              <div className="text-slate-500 dark:text-slate-400 font-medium mb-2 relative z-10 flex items-center justify-between">
                Total Study Time
                <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              </div>
              <div className="text-4xl font-black text-slate-900 dark:text-white relative z-10">{summary.totalHours.toFixed(1)} <span className="text-lg text-slate-500">hrs</span></div>
            </div>

            <div className="bg-white dark:bg-slate-800/60 p-6 rounded-3xl border border-slate-300 dark:border-slate-700/50 flex flex-col justify-between relative overflow-hidden group hover:border-emerald-500/30 transition-colors">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-[40px] rounded-full group-hover:bg-emerald-500/20 transition-colors"></div>
              <div className="text-slate-500 dark:text-slate-400 font-medium mb-2 relative z-10 flex items-center justify-between">
                Total Sessions
                <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
              </div>
              <div className="text-4xl font-black text-slate-900 dark:text-white relative z-10">{summary.totalSessions}</div>
            </div>

            <div className="bg-white dark:bg-slate-800/60 p-6 rounded-3xl border border-slate-300 dark:border-slate-700/50 flex flex-col justify-between relative overflow-hidden group hover:border-amber-500/30 transition-colors">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 blur-[40px] rounded-full group-hover:bg-amber-500/20 transition-colors"></div>
              <div className="text-slate-500 dark:text-slate-400 font-medium mb-2 relative z-10 flex items-center justify-between">
                Task Completion
                <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              </div>
              <div className="text-4xl font-black text-slate-900 dark:text-white relative z-10">{summary.completionRate}%</div>
              <div className="w-full bg-slate-700 h-1.5 mt-4 rounded-full overflow-hidden">
                <div className="bg-amber-400 h-full rounded-full" style={{ width: `${summary.completionRate}%` }}></div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800/60 p-6 rounded-3xl border border-slate-300 dark:border-slate-700/50 flex flex-col justify-between relative overflow-hidden group hover:border-fuchsia-500/30 transition-colors">
              <div className="absolute top-0 right-0 w-32 h-32 bg-fuchsia-500/10 blur-[40px] rounded-full group-hover:bg-fuchsia-500/20 transition-colors"></div>
              <div className="text-slate-500 dark:text-slate-400 font-medium mb-2 relative z-10 flex items-center justify-between">
                Current Streak
                <svg className="w-5 h-5 text-fuchsia-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
              </div>
              <div className="text-4xl font-black text-slate-900 dark:text-white relative z-10">{summary.streak} <span className="text-lg text-slate-500">days</span></div>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Weekly Trend Chart */}
            <div className="bg-white dark:bg-slate-800/40 p-8 rounded-[2.5rem] border border-slate-300 dark:border-slate-700/50 shadow-sm relative">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 tracking-tight flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"></path></svg>
                Weekly Trend
              </h3>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={weeklyTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorStudy" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                    <XAxis dataKey="date" stroke="#94a3b8" tick={{fontSize: 12}} tickLine={false} axisLine={false} />
                    <YAxis stroke="#94a3b8" tick={{fontSize: 12}} tickLine={false} axisLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)' }}
                      itemStyle={{ color: '#e2e8f0', fontWeight: 'bold' }}
                      formatter={(value) => [`${value} hrs`, 'Study Time']}
                      labelStyle={{ color: '#94a3b8' }}
                    />
                    <Area type="monotone" dataKey="studyHours" stroke="#818cf8" strokeWidth={3} fillOpacity={1} fill="url(#colorStudy)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Subject Breakdown Chart */}
            <div className="bg-white dark:bg-slate-800/40 p-8 rounded-[2.5rem] border border-slate-300 dark:border-slate-700/50 shadow-sm relative">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 tracking-tight flex items-center gap-2">
                <svg className="w-5 h-5 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
                Subject Performance
              </h3>
              <div className="h-[300px] w-full">
                {subjectStats.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-slate-500 text-sm">No subject data mapped to study sessions yet.</div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={subjectStats} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} maxBarSize={40}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                      <XAxis dataKey="subjectName" stroke="#94a3b8" tick={{fontSize: 12}} tickLine={false} axisLine={false} />
                      <YAxis stroke="#94a3b8" tick={{fontSize: 12}} tickLine={false} axisLine={false} />
                      <Tooltip 
                        cursor={{ fill: '#1e293b' }}
                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                        itemStyle={{ color: '#2dd4bf', fontWeight: 'bold' }}
                        formatter={(value) => [`${value} hrs`, 'Study Time']}
                      />
                      <Bar dataKey="studyHours" fill="#2dd4bf" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

          </div>
        </>
      )}
    </div>
  );
}
