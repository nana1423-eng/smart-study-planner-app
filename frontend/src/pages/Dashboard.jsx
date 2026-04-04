import React, { useEffect, useState } from 'react';
import api from '../api/axiosConfig';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState([]);
  const [todaySessions, setTodaySessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [assRes, schedRes] = await Promise.all([
          api.get('/assignments'),
          api.get('/scheduler')
        ]);
        
        // Pick upcoming top tasks globally
        const upcoming = assRes.data
            .filter(a => a.status !== 'COMPLETED' && new Date(a.deadline) > new Date())
            .sort((a,b) => new Date(a.deadline) - new Date(b.deadline));
        setAssignments(upcoming);

        // Filter explicitly for "Today"
        const localDate = new Date();
        const year = localDate.getFullYear();
        const month = String(localDate.getMonth() + 1).padStart(2, '0');
        const day = String(localDate.getDate()).padStart(2, '0');
        const todayStr = `${year}-${month}-${day}`;

        const todayBlocks = schedRes.data
            .filter(s => s.date === todayStr)
            .sort((a,b) => {
               if(!a.startTime) return 1;
               if(!b.startTime) return -1;
               return a.startTime.localeCompare(b.startTime);
            });
            
        setTodaySessions(todayBlocks);

      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (isLoading) return <div className="h-full flex items-center justify-center text-slate-800 dark:text-slate-100 text-xl font-bold">Loading...</div>;

  const highPriorityCount = assignments.filter(a => a.priority === 'High').length;
  
  // Hero insight logic
  let heroInsight = "Here's your study overview.";
  if (highPriorityCount > 0) {
      heroInsight = `You have ${highPriorityCount} high-priority deadline${highPriorityCount > 1 ? 's' : ''} actively pending. Let's get to work!`;
  } else if (todaySessions.length > 0) {
      heroInsight = `You have ${todaySessions.length} study block${todaySessions.length > 1 ? 's' : ''} scheduled for today. You're on track.`;
  } else if (assignments.length === 0) {
      heroInsight = "You have absolutely nothing due. Take a break, you earned it!";
  } else {
      heroInsight = "You have no scheduled sessions today. Consider knocking out a quick assignment!";
  }

  return (
    <div className="p-8 text-slate-800 dark:text-slate-100 h-full">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Dynamic Hero Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tight hover:scale-[1.01] transition-transform capitalize">
              Welcome Back{user?.username ? `, ${user.username}` : ''}
            </h1>
            <div className="flex items-center gap-3 mt-3">
               <div className={`w-2 h-2 rounded-full ${highPriorityCount > 0 ? 'bg-rose-500 animate-pulse' : 'bg-emerald-500'}`}></div>
               <p className="text-lg text-slate-600 dark:text-slate-400 font-medium">{heroInsight}</p>
            </div>
          </div>
          
          <div className="flex gap-4">
             <Link to="/planner" className="px-6 py-3 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 rounded-xl font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition shadow-sm">
                Open Planner
             </Link>
             <Link to="/assignments" className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-600/30 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4"></path></svg>
                New Task
             </Link>
          </div>
        </div>

        {/* Lower Grid: Dynamic Execution Widgets */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Today's Execution Engine (Primary Focus) */}
          <div className="lg:col-span-8 bg-white dark:bg-slate-800/40 p-8 rounded-[2.5rem] border border-slate-300 dark:border-slate-700/50 shadow-sm flex flex-col transition duration-500 hover:shadow-md">
            <div className="flex justify-between items-center mb-8 border-b border-slate-100 dark:border-slate-700/50 pb-4">
              <div className="flex items-center gap-4">
                 <div className="p-3 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-2xl"><svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg></div>
                 <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Today's Execution</h3>
              </div>
              <span className="text-sm font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">{new Date().toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}</span>
            </div>
            
            {todaySessions.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-500 dark:text-slate-400 py-12">
                <svg className="w-16 h-16 mb-4 text-slate-300 dark:text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path></svg>
                <p className="font-medium text-lg text-slate-400 dark:text-slate-500">No study blocks scheduled today.</p>
                <Link to="/planner" className="mt-4 text-indigo-500 hover:text-indigo-600 font-bold">Auto-Schedule tasks →</Link>
              </div>
            ) : (
              <div className="space-y-4 flex-1">
                {todaySessions.map(session => (
                  <div key={session.id} className="group flex items-center justify-between p-5 bg-slate-50 dark:bg-[#0f172a]/80 rounded-2xl border border-slate-200 dark:border-slate-700/50 hover:border-slate-300 dark:hover:border-slate-600 transition hover:bg-white dark:hover:bg-slate-800/80 shadow-sm relative overflow-hidden">
                    {/* The colored subject stripe */}
                    <div className="absolute left-0 top-0 bottom-0 w-1.5 opacity-80" style={{backgroundColor: session.subjectColor || '#6366f1'}}></div>
                    
                    <div className="flex items-center gap-6 pl-2">
                       <div className="text-center shrink-0">
                          <p className="text-lg font-black text-slate-900 dark:text-white">{session.startTime || '--:--'}</p>
                          <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">{session.durationMinutes} MIN</p>
                       </div>
                       
                       <div className="w-px h-10 bg-slate-200 dark:bg-slate-700 mx-1"></div>
                       
                       <div>
                          <h4 className="text-slate-900 dark:text-white font-bold text-[17px] truncate pr-2 max-w-[200px] sm:max-w-xs">{session.assignmentTitle}</h4>
                          <span className="text-xs text-slate-500 dark:text-slate-400 font-bold flex items-center gap-1.5 mt-0.5">
                             <span className="w-2 h-2 rounded-full" style={{backgroundColor: session.subjectColor || '#6366f1'}}></span>
                             Scheduled Block
                          </span>
                       </div>
                    </div>
                    
                    <div>
                       <Link 
                         to={`/focus?assignmentId=${session.assignmentId}`}
                         className="flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-slate-300 dark:hover:border-slate-500 font-bold rounded-xl transition shadow-sm group-hover:shadow group-hover:-translate-y-0.5"
                       >
                          <svg className="w-4 h-4 text-indigo-500 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                          Start Focus
                       </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Quick Actions & Mini-Metrics Sidebar */}
          <div className="lg:col-span-4 space-y-8">
             
             {/* Quick Actions Panel */}
             <div className="bg-white dark:bg-slate-800/40 p-8 rounded-[2.5rem] border border-slate-300 dark:border-slate-700/50 shadow-sm transition duration-500 hover:shadow-md">
               <h3 className="text-xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">Quick Actions</h3>
               <div className="space-y-4">
                 <Link to="/ai-assistant" className="group flex items-center justify-between p-4 bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700/30 rounded-2xl hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:border-indigo-200 dark:hover:border-indigo-800 transition duration-300">
                   <div className="flex items-center gap-3">
                     <div className="p-2.5 bg-white dark:bg-slate-800/40 rounded-xl text-indigo-500 dark:text-indigo-400 shadow-sm border border-slate-200 dark:border-slate-700/30"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg></div>
                     <div>
                       <h4 className="text-slate-900 dark:text-white font-bold group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition text-sm">Atlas AI Chat</h4>
                       <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Ask questions instantly</p>
                     </div>
                   </div>
                   <svg className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 transition transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                 </Link>
                 
                 <Link to="/metrics" className="group flex items-center justify-between p-4 bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700/30 rounded-2xl hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:border-emerald-200 dark:hover:border-emerald-800 transition duration-300">
                   <div className="flex items-center gap-3">
                     <div className="p-2.5 bg-white dark:bg-slate-800/40 rounded-xl text-emerald-500 dark:text-emerald-400 shadow-sm border border-slate-200 dark:border-slate-700/30"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg></div>
                     <div>
                       <h4 className="text-slate-900 dark:text-white font-bold group-hover:text-emerald-600 dark:group-hover:text-emerald-300 transition text-sm">Study Metrics</h4>
                       <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">View your consistency</p>
                     </div>
                   </div>
                   <svg className="w-4 h-4 text-slate-400 group-hover:text-emerald-500 transition transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                 </Link>
               </div>
             </div>
             
             {/* Mini Upcoming Tracker Fallback */}
             <div className="bg-white dark:bg-slate-800/40 p-8 rounded-[2.5rem] border border-slate-300 dark:border-slate-700/50 shadow-sm transition duration-500 hover:shadow-md">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Active Deadlines</h3>
                  <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></div>
                </div>
                
                {assignments.length > 0 ? (
                    <div className="space-y-4">
                       {assignments.slice(0, 3).map(a => (
                          <Link key={a.id} to={`/assignments`} className="block group">
                             <div className="flex justify-between items-start mb-1">
                                <h4 className="text-slate-900 dark:text-white font-bold text-sm truncate group-hover:text-indigo-500 transition">{a.title}</h4>
                             </div>
                             <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 dark:text-slate-400">
                                <span className="uppercase tracking-widest">{new Date(a.deadline).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
                                <span className={a.priority === 'High' ? 'text-rose-500' : ''}>{a.priority} Priority</span>
                             </div>
                          </Link>
                       ))}
                       <Link to="/assignments" className="block text-center text-xs font-bold text-slate-400 hover:text-indigo-500 transition pt-2 border-t border-slate-100 dark:border-slate-700/50 mt-4">
                          View all {assignments.length} assignments...
                       </Link>
                    </div>
                ) : (
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium pb-2">No active assignments on your checklist!</p>
                )}
             </div>

          </div>
        </div>

      </div>
    </div>
  );
}
