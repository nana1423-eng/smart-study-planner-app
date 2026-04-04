import React, { useState, useEffect, useRef } from 'react';
import api from '../api/axiosConfig';

export default function FocusMode() {
  const [mode, setMode] = useState('STUDY'); // 'STUDY' | 'BREAK'
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [sessionHistory, setSessionHistory] = useState([]);
  
  const timerRef = useRef(null);

  useEffect(() => {
    // Load persisted state if exists
    const savedState = localStorage.getItem('pomodoroState');
    if (savedState) {
      const parsed = JSON.parse(savedState);
      const elapsed = parsed.isActive 
        ? Math.floor((Date.now() - parsed.lastTick) / 1000)
        : 0;
      
      const newTimeLeft = Math.max(0, parsed.timeLeft - elapsed);
      setMode(parsed.mode);
      setTimeLeft(newTimeLeft);
      setIsActive(parsed.isActive);
      setSessionId(parsed.sessionId);
    }
    
    fetchHistory();
  }, []);

  useEffect(() => {
    // Persist down to localStorage automatically
    localStorage.setItem('pomodoroState', JSON.stringify({
      mode,
      timeLeft,
      isActive,
      sessionId,
      lastTick: Date.now()
    }));
  }, [mode, timeLeft, isActive, sessionId]);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      // Timer finished!
      handleTimerComplete();
    }
    return () => clearInterval(timerRef.current);
  }, [isActive, timeLeft]);

  const fetchHistory = async () => {
    try {
      const res = await api.get('/sessions/history');
      setSessionHistory(res.data);
    } catch (err) {
      console.error("Failed to fetch history", err);
    }
  };

  const startSession = async () => {
    setIsActive(true);
    if (!sessionId) {
      try {
        const res = await api.post('/sessions/start', {
          type: mode,
          startTime: new Date().toISOString()
        });
        setSessionId(res.data.id);
      } catch (err) {
        console.error("Failed to start session", err);
      }
    }
  };

  const endSession = async (completed) => {
    if (sessionId) {
      try {
        const durationSec = (mode === 'STUDY' ? 25 * 60 : 5 * 60) - timeLeft;
        const durationMinutes = Math.floor(durationSec / 60);

        await api.post('/sessions/end', {
          sessionId,
          endTime: new Date().toISOString(),
          durationMinutes: Math.max(0, durationMinutes)
        });
        setSessionId(null);
        fetchHistory();
      } catch (err) {
        console.error("Failed to end session", err);
      }
    }
  };

  const handleTimerComplete = async () => {
    clearInterval(timerRef.current);
    setIsActive(false);
    await endSession(true);

    // Auto-switch
    if (mode === 'STUDY') {
      setMode('BREAK');
      setTimeLeft(5 * 60);
      new window.Notification("Study session complete! Time for a break.");
    } else {
      setMode('STUDY');
      setTimeLeft(25 * 60);
      new window.Notification("Break's over! Back to work.");
    }
  };

  const toggleTimer = () => {
    if (isActive) {
      setIsActive(false);
    } else {
      startSession();
    }
  };

  const resetTimer = async () => {
    setIsActive(false);
    if (sessionId) {
      await endSession(false);
    }
    setTimeLeft(mode === 'STUDY' ? 25 * 60 : 5 * 60);
  };

  const switchMode = (newMode) => {
    if (isActive) {
      if (window.confirm("Switching modes will cancel your current session. Continue?")) {
        resetTimer().then(() => {
          setMode(newMode);
          setTimeLeft(newMode === 'STUDY' ? 25 * 60 : 5 * 60);
        });
      }
    } else {
      setMode(newMode);
      setTimeLeft(newMode === 'STUDY' ? 25 * 60 : 5 * 60);
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Determine dynamic ring color based on mode and time
  const ringColor = mode === 'STUDY' 
    ? (timeLeft < 60 ? 'text-rose-500' : 'text-indigo-500')
    : 'text-emerald-500';

  const progressPercentage = mode === 'STUDY' 
    ? ((25 * 60 - timeLeft) / (25 * 60)) * 100
    : ((5 * 60 - timeLeft) / (5 * 60)) * 100;

  return (
    <div className="p-8 text-slate-800 dark:text-slate-100 flex flex-col md:flex-row gap-8 max-w-7xl mx-auto h-full">
      {/* Main Timer Section */}
      <div className="flex-1 flex flex-col items-center justify-center bg-white dark:bg-slate-800/40 rounded-[3rem] border border-slate-300 dark:border-slate-700/50 p-12 shadow-2xl relative overflow-hidden">
        {/* Ambient background glow */}
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 blur-[120px] rounded-full pointer-events-none transition-colors duration-1000 ${mode === 'STUDY' ? 'bg-indigo-600/20' : 'bg-emerald-600/20'}`}></div>
        
        <div className="flex gap-4 mb-12 relative z-10 bg-white dark:bg-slate-900/50 p-2 rounded-full border border-slate-300 dark:border-slate-700/50 backdrop-blur-md">
          <button 
            onClick={() => switchMode('STUDY')}
            className={`px-6 py-2 rounded-full font-bold text-sm transition-all shadow-sm ${mode === 'STUDY' ? 'bg-indigo-600 text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white'}`}
          >
            Pomodoro
          </button>
          <button 
            onClick={() => switchMode('BREAK')}
            className={`px-6 py-2 rounded-full font-bold text-sm transition-all shadow-sm ${mode === 'BREAK' ? 'bg-emerald-600 text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white'}`}
          >
            Short Break
          </button>
        </div>

        <div className="relative flex justify-center items-center w-80 h-80 mb-12">
          {/* Circular Progress */}
          <svg className="w-full h-full transform -rotate-90 absolute inset-0 drop-shadow-2xl">
            <circle cx="160" cy="160" r="145" fill="none" className="stroke-slate-800" strokeWidth="12"></circle>
            <circle 
              cx="160" 
              cy="160" 
              r="145" 
              fill="none" 
              className={`${ringColor} transition-all duration-1000 ease-linear`}
              strokeWidth="12" 
              strokeLinecap="round"
              strokeDasharray="911.06" // 2 * PI * 145 = 911.06
              strokeDashoffset={911.06 - (progressPercentage / 100) * 911.06}
            ></circle>
          </svg>
          <div className="relative z-10 flex flex-col items-center">
            <h1 className="text-7xl font-black text-slate-900 dark:text-white tracking-widest tabular-nums drop-shadow-md">
              {formatTime(timeLeft)}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 font-bold mt-2 tracking-widest uppercase text-sm">
              {mode === 'STUDY' ? 'Focus Session' : 'Relax'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6 relative z-10">
          <button 
            onClick={toggleTimer}
            className={`w-20 h-20 rounded-full flex items-center justify-center transition-all hover:scale-110 shadow-[0_0_30px_rgba(0,0,0,0.3)] border-2 ${isActive ? 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-amber-500' : (mode === 'STUDY' ? 'bg-indigo-600 border-indigo-500 text-slate-900 dark:text-white shadow-indigo-500/30' : 'bg-emerald-600 border-emerald-500 text-slate-900 dark:text-white shadow-emerald-500/30')}`}
          >
            {isActive ? (
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 4.5A1.5 1.5 0 016.5 3h1A1.5 1.5 0 019 4.5v11A1.5 1.5 0 017.5 17h-1A1.5 1.5 0 015 15.5v-11zm7 0A1.5 1.5 0 0113.5 3h1A1.5 1.5 0 0116 4.5v11a1.5 1.5 0 01-1.5 1.5h-1A1.5 1.5 0 0112 15.5v-11z" clipRule="evenodd"></path></svg>
            ) : (
              <svg className="w-10 h-10 ml-1.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"></path></svg>
            )}
          </button>
          
          <button 
            onClick={resetTimer}
            className="w-14 h-14 rounded-full bg-white dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white transition-all shadow-md group"
          >
             <svg className="w-6 h-6 group-hover:-rotate-90 transition-transform duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
          </button>
        </div>
      </div>

      {/* History Sidebar */}
      <div className="w-full md:w-80 flex flex-col gap-6">
        <div className="bg-white dark:bg-slate-800/40 border border-slate-300 dark:border-slate-700/50 rounded-3xl p-6 shadow-sm flex-1 overflow-hidden flex flex-col">
          <h3 className="font-black text-xl mb-6 text-slate-900 dark:text-white tracking-tight flex items-center justify-between">
            Today's Focus
            <span className="text-xs bg-indigo-500/20 text-indigo-400 px-3 py-1 rounded-full">{sessionHistory.filter(s => s.type === 'STUDY' && new Date(s.endTime).toDateString() === new Date().toDateString()).length} completed</span>
          </h3>
          
          <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
            {sessionHistory.length === 0 ? (
              <div className="text-slate-500 dark:text-slate-400 text-sm text-center py-8">No sessions completed yet. Start focusing!</div>
            ) : (
              sessionHistory.map(session => (
                <div key={session.id} className="p-4 bg-white dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between hover:border-slate-300 dark:border-slate-700 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${session.type === 'STUDY' ? 'bg-indigo-500' : 'bg-emerald-500'}`}></div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">{session.type === 'STUDY' ? 'Study Block' : 'Break'}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{session.endTime && new Date(session.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                  </div>
                  <div className="font-black text-slate-600 dark:text-slate-300 text-sm">
                    {session.durationMinutes || 0}m
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
