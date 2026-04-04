import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';

export default function Groups() {
  const [groups, setGroups] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const fetchGroups = async () => {
    try {
      const res = await api.get('/groups');
      setGroups(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post('/groups', { name, description });
    setName('');
    setDescription('');
    fetchGroups();
  };

  return (
    <div className="p-8 text-slate-800 dark:text-slate-100">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tight mb-12 hover:scale-[1.01] transition-transform w-fit">
          Study Groups
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-slate-800/40 p-8 rounded-[2rem] border border-slate-300 dark:border-slate-700/50 shadow-sm h-fit relative overflow-hidden transition duration-500 hover:shadow-md hover:border-indigo-100">

            <h2 className="text-2xl font-black mb-6 text-slate-900 dark:text-white tracking-tight">Create Group</h2>
            <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
              <div>
                <label className="block text-sm font-bold tracking-wide text-slate-500 dark:text-slate-400 mb-1.5 uppercase">Group Name</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} required 
                  className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700/50 rounded-xl px-4 py-3 text-slate-800 dark:text-slate-100 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all shadow-sm"/>
              </div>
              <div>
                <label className="block text-sm font-bold tracking-wide text-slate-500 dark:text-slate-400 mb-1.5 uppercase">Description</label>
                <textarea value={description} onChange={e => setDescription(e.target.value)} required rows="4"
                  className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700/50 rounded-xl px-4 py-3 text-slate-800 dark:text-slate-100 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all shadow-sm resize-none"/>
              </div>
              <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 mt-6 rounded-xl transition-all shadow-sm hover:shadow-md hover:scale-[1.02] flex justify-center items-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                Create Group
              </button>
            </form>
          </div>
          
          <div className="md:col-span-2 space-y-6">
            {groups.map(g => (
              <div key={g.id} className="bg-white dark:bg-slate-800/40 p-8 rounded-[2rem] border border-slate-300 dark:border-slate-700/50 transition-all hover:border-slate-300 hover:shadow-md shadow-sm group relative overflow-hidden flex justify-between items-center">
                {/* Decorative Side Bar */}
                <div className="absolute top-0 left-0 w-2 h-full bg-indigo-900/300 z-10 transition-shadow group-hover:shadow-[0_0_5px_rgba(99,102,241,0.5)]"></div>
                
                <div className="pl-4 relative z-10 w-3/4">
                  <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-2 tracking-tight group-hover:text-indigo-400 transition-colors">{g.name}</h3>
                  <p className="text-slate-600 dark:text-slate-300 font-medium leading-relaxed">{g.description}</p>
                </div>
                <div className="relative z-10 text-right">
                  <span className="flex items-center gap-1.5 bg-indigo-900/30 px-4 py-2 rounded-xl text-indigo-300 border border-indigo-200 text-[10px] font-black tracking-widest uppercase shadow-sm">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    Joined
                  </span>
                </div>
              </div>
            ))}
            {groups.length === 0 && (
              <div className="p-12 text-center bg-slate-50 dark:bg-[#0f172a] border-2 border-dashed border-slate-300 dark:border-slate-700/50 rounded-[2rem] shadow-sm">
                <svg className="w-16 h-16 text-slate-600 dark:text-slate-300 mb-4 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                <p className="text-slate-500 dark:text-slate-400 font-medium text-lg">You haven't joined any groups yet. Create one to collaborate with friends!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
