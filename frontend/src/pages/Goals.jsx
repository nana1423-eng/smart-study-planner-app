import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';

export default function Goals() {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newGoal, setNewGoal] = useState({ type: 'DAILY_HOURS', period: 'DAILY', targetValue: 120, subjectId: '' });
  const [subjects, setSubjects] = useState([]);

  const fetchGoals = async () => {
    try {
      setLoading(true);
      const res = await api.get('/goals/progress');
      setGoals(res.data);
    } catch (error) {
      console.error('Error fetching goals', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubjects = async () => {
    try {
      const res = await api.get('/subjects');
      setSubjects(res.data);
    } catch (error) {
      console.error('Error fetching subjects', error);
    }
  };

  useEffect(() => {
    fetchGoals();
    fetchSubjects();
  }, []);

  const createGoal = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...newGoal,
        subjectId: newGoal.type === 'SUBJECT_HOURS' ? (newGoal.subjectId || null) : null
      };
      await api.post('/goals', payload);
      setIsModalOpen(false);
      fetchGoals(); // Refresh with newly created goal
    } catch (error) {
      console.error('Error creating goal', error);
    }
  };

  const getSubjectName = (subjectId) => {
    if (!subjectId) return '';
    const subject = subjects.find(s => s.id === subjectId);
    return subject ? subject.name : 'Unknown Subject';
  };

  const formatGoalTitle = (goal) => {
    if (goal.type === 'DAILY_HOURS') return 'Daily Study Target';
    if (goal.type === 'WEEKLY_HOURS') return 'Weekly Study Target';
    if (goal.type === 'SUBJECT_HOURS') return `${getSubjectName(goal.subjectId)} Target`;
    return 'Study Target';
  };

  if (loading) {
    return (
      <div className="p-8 text-slate-800 dark:text-slate-100 flex items-center justify-center min-h-[50vh]">
        <div className="w-12 h-12 rounded-full border-4 border-slate-300 dark:border-slate-700 border-t-indigo-500 animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-8 text-slate-800 dark:text-slate-100 max-w-7xl mx-auto h-full space-y-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tight">Active Goals</h1>
          <p className="text-lg text-slate-500 dark:text-slate-400 mt-2 font-medium">Set your study targets and crush them.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-6 rounded-full flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(79,70,229,0.3)] hover:scale-105"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
          Set New Goal
        </button>
      </div>

      {/* Goal Cards Grid */}
      {goals.length === 0 ? (
        <div className="bg-white dark:bg-slate-800/40 border border-slate-300 dark:border-slate-700/50 p-12 rounded-[2.5rem] shadow-sm text-center">
          <div className="w-20 h-20 bg-indigo-500/10 text-indigo-400 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
          </div>
          <h2 className="text-2xl font-black mb-3 text-slate-900 dark:text-white">No Goals Yet</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-md mx-auto">Set a daily, weekly, or subject-specific target to start tracking your progress visually.</p>
          <button onClick={() => setIsModalOpen(true)} className="text-indigo-400 font-bold hover:text-slate-900 dark:text-white transition-colors">Create your first goal &rarr;</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {goals.map(goal => {
            const isOverachieved = goal.completionPercentage >= 100;
            const displayPercentage = Math.min(goal.completionPercentage, 100);
            
            return (
              <div key={goal.id} className="bg-white dark:bg-slate-800/60 p-6 rounded-3xl border border-slate-300 dark:border-slate-700/50 flex flex-col justify-between relative overflow-hidden group hover:border-slate-500 transition-colors">
                <div className="absolute top-0 right-0 w-32 h-32 bg-slate-400/5 blur-[50px] rounded-full group-hover:bg-indigo-500/10 transition-colors"></div>
                
                <div className="flex justify-between items-start mb-6 relative z-10">
                  <div>
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 px-2 py-1 rounded-md">{goal.period}</span>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-3 leading-tight">{formatGoalTitle(goal)}</h3>
                  </div>
                  {isOverachieved && (
                    <div className="bg-emerald-500/20 text-emerald-400 p-1.5 rounded-full" title="Target Met!">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path></svg>
                    </div>
                  )}
                </div>

                <div className="relative z-10">
                  <div className="flex justify-between text-sm mb-2 font-medium">
                    <span className="text-slate-600 dark:text-slate-300">{Math.floor(goal.currentValue / 60)}h {goal.currentValue % 60}m</span>
                    <span className="text-slate-500 text-xs mt-0.5">/ {goal.targetValue > 60 ? `${Math.floor(goal.targetValue / 60)}h ` : ''}{goal.targetValue % 60 > 0 || goal.targetValue < 60 ? `${goal.targetValue % 60}m` : ''}</span>
                  </div>
                  
                  <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden shadow-inner flex">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ease-out ${isOverachieved ? 'bg-gradient-to-r from-emerald-500 to-teal-400' : 'bg-gradient-to-r from-indigo-600 to-blue-500'}`}
                      style={{ width: `${displayPercentage}%` }}
                    ></div>
                  </div>
                  
                  <div className="flex justify-between mt-3 flex-row-reverse items-center">
                     <span className={`text-2xl font-black ${isOverachieved ? 'text-emerald-400' : 'text-slate-900 dark:text-white'}`}>
                      {goal.completionPercentage}%
                    </span>
                    {isOverachieved && <span className="text-xs font-bold text-emerald-500 animate-pulse">Smashing it!</span>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Goal Creation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700/50 rounded-3xl p-8 max-w-md w-full shadow-2xl relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-6">Set New Target</h2>
            
            <form onSubmit={createGoal} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-500 dark:text-slate-400 mb-2">Goal Type</label>
                <select 
                  className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={newGoal.type}
                  onChange={(e) => setNewGoal({...newGoal, type: e.target.value})}
                >
                  <option value="DAILY_HOURS">Daily Total Study</option>
                  <option value="WEEKLY_HOURS">Weekly Total Study</option>
                  <option value="SUBJECT_HOURS">Subject Specific</option>
                </select>
              </div>

              {newGoal.type === 'SUBJECT_HOURS' && (
                <div>
                  <label className="block text-sm font-bold text-slate-500 dark:text-slate-400 mb-2">Subject</label>
                  <select 
                    className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={newGoal.subjectId}
                    onChange={(e) => setNewGoal({...newGoal, subjectId: e.target.value})}
                    required
                  >
                    <option value="" disabled>Select a subject</option>
                    {subjects.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-500 dark:text-slate-400 mb-2">Period</label>
                  <select 
                    className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={newGoal.period}
                    onChange={(e) => setNewGoal({...newGoal, period: e.target.value})}
                  >
                    <option value="DAILY">Daily</option>
                    <option value="WEEKLY">Weekly</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-500 dark:text-slate-400 mb-2">Target (Minutes)</label>
                  <input 
                    type="number" 
                    min="1"
                    step="1"
                    required
                    className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={newGoal.targetValue}
                    onChange={(e) => setNewGoal({...newGoal, targetValue: parseInt(e.target.value) || ''})}
                  />
                </div>
              </div>

              <div className="pt-2">
                <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl transition-colors">
                  Save Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
