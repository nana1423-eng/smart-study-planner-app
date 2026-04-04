import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';

export default function Subjects() {
  const [subjects, setSubjects] = useState([]);
  const [name, setName] = useState('');
  const [color, setColor] = useState('#3B82F6');
  const [difficulty, setDifficulty] = useState('Medium');

  const fetchSubjects = async () => {
    const res = await api.get('/subjects');
    setSubjects(res.data);
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post('/subjects', { name, color, difficulty });
    setName('');
    fetchSubjects();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this subject? All assignments associated with it will also be deleted.')) {
      await api.delete(`/subjects/${id}`);
      fetchSubjects();
    }
  };

  return (
    <div className="p-8 text-slate-800 dark:text-slate-100">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tight mb-12 hover:scale-[1.01] transition-transform w-fit">
          Manage Subjects
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-slate-800/40 p-8 rounded-[2rem] border border-slate-300 dark:border-slate-700/50 shadow-sm h-fit relative overflow-hidden transition duration-500 hover:shadow-md hover:border-indigo-100">

            <h2 className="text-2xl font-black mb-6 text-slate-900 dark:text-white tracking-tight">Add New Subject</h2>
            <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
              <div>
                <label className="block text-sm font-bold tracking-wide text-slate-500 dark:text-slate-400 mb-1.5 uppercase">Subject Name</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} required 
                  className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700/50 rounded-xl px-4 py-3 text-slate-800 dark:text-slate-100 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all shadow-sm"/>
              </div>
              <div>
                <label className="block text-sm font-bold tracking-wide text-slate-500 dark:text-slate-400 mb-1.5 uppercase">Color Theme</label>
                <div className="flex items-center gap-4">
                  <input type="color" value={color} onChange={e => setColor(e.target.value)} 
                    className="w-14 h-14 rounded-xl cursor-pointer bg-slate-50 dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700/50 p-1 shadow-sm hover:scale-105 transition-transform"/>
                  <span className="text-sm font-mono text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800/60 px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700/50 uppercase tracking-widest">{color}</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold tracking-wide text-slate-500 dark:text-slate-400 mb-1.5 uppercase">Difficulty</label>
                <select value={difficulty} onChange={e => setDifficulty(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700/50 rounded-xl px-4 py-3 text-slate-800 dark:text-slate-100 focus:border-indigo-500 outline-none transition-all shadow-sm cursor-pointer">
                  <option className="bg-white dark:bg-slate-800/40" value="Low">Low</option>
                  <option className="bg-white dark:bg-slate-800/40" value="Medium">Medium</option>
                  <option className="bg-white dark:bg-slate-800/40" value="High">High</option>
                </select>
              </div>
              <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 mt-6 rounded-xl transition-all shadow-sm hover:scale-[1.02] hover:shadow-md flex justify-center items-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                Create Subject
              </button>
            </form>
          </div>
          
          <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6 h-fit content-start">
            {subjects.map(sub => (
              <div key={sub.id} className="bg-white dark:bg-slate-800/40 p-6 rounded-2xl border border-slate-300 dark:border-slate-700/50 transition-all hover:border-slate-300 hover:shadow-md shadow-sm group relative overflow-hidden flex flex-col justify-between">
                {/* Subject Color Bar */}
                <div className="absolute top-0 left-0 w-2 h-full z-10 transition-shadow duration-300 group-hover:shadow-[0_0_5px_inherit]" style={{backgroundColor: sub.color, color: sub.color}}></div>
                
                {/* Decorative Background Blob matching subject color */}
                <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-[60px] opacity-[0.03] pointer-events-none transition-opacity duration-500 group-hover:opacity-[0.08]" style={{backgroundColor: sub.color}}></div>
                
                <div className="flex justify-between items-start mb-6 relative z-10 pl-4">
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">{sub.name}</h3>
                    <div className="flex items-center gap-2">
                       <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Difficulty</span>
                       <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded bg-slate-50 dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700/50 ${sub.difficulty === 'High' ? 'text-rose-500' : 'text-indigo-400'}`}>{sub.difficulty}</span>
                    </div>
                  </div>
                  <button onClick={() => handleDelete(sub.id)} className="text-[10px] font-black tracking-widest uppercase bg-rose-50 text-rose-500 hover:bg-rose-600 hover:text-white border border-rose-200 px-3 py-1.5 rounded transition shadow-sm opacity-0 group-hover:opacity-100 hover:shadow-md">
                    Delete
                  </button>
                </div>

                <div className="relative z-10 pl-4">
                   <div className="flex justify-between text-xs font-bold tracking-wide text-slate-500 dark:text-slate-400 mb-2">
                      <span>Performance</span>
                      <span className="text-slate-800 dark:text-slate-100">{sub.overallPerformance}%</span>
                   </div>
                   <div className="w-full bg-white dark:bg-slate-800/60 rounded-full h-2 overflow-hidden shadow-inner">
                      <div className="h-full rounded-full transition-all duration-1000 ease-out" style={{width: `${sub.overallPerformance}%`, backgroundColor: sub.color}}></div>
                   </div>
                </div>
              </div>
            ))}
            {subjects.length === 0 && (
              <div className="sm:col-span-2 p-12 text-center bg-white dark:bg-slate-800/40 border border-slate-300 dark:border-slate-700/50 rounded-[2rem] shadow-sm">
                <svg className="w-16 h-16 text-slate-600 dark:text-slate-300 mb-4 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
                <p className="text-slate-500 dark:text-slate-400 font-medium text-lg">No subjects registered yet. Create one to get started!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
