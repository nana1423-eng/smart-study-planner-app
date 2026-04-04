import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import { Link } from 'react-router-dom';

export default function Insights() {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        setLoading(true);
        const res = await api.get('/insights');
        setInsights(res.data);
      } catch (err) {
        console.error("Failed to fetch insights", err);
        setError("Could not analyze your study metrics. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchInsights();
  }, []);

  const getStyleForType = (type) => {
    switch (type) {
      case 'POSITIVE':
        return 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 group-hover:border-emerald-500/50';
      case 'WARNING':
        return 'bg-amber-500/10 border-amber-500/30 text-amber-400 group-hover:border-amber-500/50';
      case 'INFO':
        return 'bg-blue-500/10 border-blue-500/30 text-blue-400 group-hover:border-blue-500/50';
      case 'NEUTRAL':
      default:
        return 'bg-slate-500/10 border-slate-500/30 text-slate-500 dark:text-slate-400 group-hover:border-slate-500/50';
    }
  };

  const getIconSvg = (iconType, typeClass) => {
    const baseClass = "w-8 h-8 mb-4 " + typeClass.split('text-')[1]?.split(' ')[0]; // Extract text color
    
    switch (iconType) {
      case 'TREND_UP':
        return <svg className={`w-8 h-8 mb-4`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>;
      case 'TREND_DOWN':
        return <svg className={`w-8 h-8 mb-4`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6"></path></svg>;
      case 'TIME':
        return <svg className={`w-8 h-8 mb-4`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>;
      case 'CALENDAR':
        return <svg className={`w-8 h-8 mb-4`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>;
      case 'ALERT':
        return <svg className={`w-8 h-8 mb-4`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>;
      default:
        return <svg className={`w-8 h-8 mb-4`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>;
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-slate-800 dark:text-slate-100 flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 rounded-full border-4 border-slate-300 dark:border-slate-700 border-t-indigo-500 animate-spin mb-4"></div>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Atlas AI is analyzing your study patterns...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-slate-800 dark:text-slate-100 flex items-center justify-center min-h-[80vh]">
        <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 p-6 rounded-2xl max-w-md text-center shadow-lg">
          <svg className="w-12 h-12 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
          <h2 className="text-lg font-bold mb-2">Analysis Failed</h2>
          <p className="text-sm opacity-80">{error}</p>
        </div>
      </div>
    );
  }

  const hasInsufficientData = insights.length === 1 && insights[0].title === "Not Enough Data";

  return (
    <div className="p-8 text-slate-800 dark:text-slate-100 max-w-7xl mx-auto space-y-10 min-h-screen">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-4">
        <div>
          <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-indigo-500 tracking-tight flex items-center gap-3">
            <svg className="w-10 h-10 text-fuchsia-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
            Atlas AI Insights
          </h1>
          <p className="text-lg text-slate-500 dark:text-slate-400 mt-2 font-medium">Personalized algorithmic analysis of your study habits and productivity curves.</p>
        </div>
      </div>

      {hasInsufficientData ? (
        <div className="bg-white dark:bg-slate-800/40 border border-slate-300 dark:border-slate-700/50 p-12 rounded-[2.5rem] shadow-sm text-center relative overflow-hidden group">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-fuchsia-500/10 blur-[80px] rounded-full"></div>
          <div className="w-24 h-24 bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-400 rounded-full flex items-center justify-center mx-auto mb-6 relative z-10 shadow-xl">
            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
          </div>
          <h2 className="text-3xl font-black mb-3 text-slate-900 dark:text-white relative z-10">Data Gathering in Progress</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-lg mx-auto relative z-10 text-lg">
            {insights[0].description}
          </p>
          <Link to="/focus" className="relative z-10 inline-flex items-center gap-2 bg-gradient-to-r from-fuchsia-600 to-indigo-600 hover:from-fuchsia-500 hover:to-indigo-500 text-slate-900 dark:text-white font-bold py-3 px-8 rounded-full transition-transform hover:scale-105 shadow-[0_0_30px_rgba(192,38,211,0.3)]">
            Start a Study Session
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {insights.map((insight, idx) => {
            const styleClass = getStyleForType(insight.type);
            const isPositive = insight.type === 'POSITIVE';
            
            return (
              <div key={idx} className={`p-8 rounded-[2.5rem] border flex flex-col justify-between relative overflow-hidden group transition-all duration-300 hover:-translate-y-1 shadow-sm hover:shadow-xl ${styleClass.replace('bg-', 'bg-').split(' text-')[0]}`}>
                
                {/* Background Glow */}
                <div className={`absolute -top-10 -right-10 w-40 h-40 blur-[50px] rounded-full opacity-50 ${isPositive ? 'bg-emerald-500' : 'bg-current'}`}></div>
                
                <div className="relative z-10">
                  <div className={`inline-flex items-center justify-center p-3 rounded-2xl mb-6 ${styleClass.split(' ')[0].replace('/10', '/20')}`}>
                    {getIconSvg(insight.iconType, styleClass)}
                  </div>
                  
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">{insight.title}</h3>
                  <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-medium opacity-90">
                    {insight.description}
                  </p>
                </div>

                <div className="relative z-10 mt-8 pt-6 border-t border-current border-opacity-20 flex justify-between items-center">
                  <span className="text-sm font-bold opacity-80 uppercase tracking-wider">AI Confirmed</span>
                  <svg className="w-5 h-5 opacity-60" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
