import React, { useState, useEffect, useRef } from 'react';
import api from '../api/axiosConfig';

export default function Assignments() {
  const [assignments, setAssignments] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [activeSubtasks, setActiveSubtasks] = useState({});
  
  const [title, setTitle] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [deadline, setDeadline] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [difficulty, setDifficulty] = useState(3);
  const [weight, setWeight] = useState('Homework');
  const [description, setDescription] = useState('');

  const fetchData = async () => {
    const [subRes, assRes] = await Promise.all([
      api.get('/subjects'),
      api.get('/assignments')
    ]);
    setSubjects(subRes.data);
    setAssignments(assRes.data);
    if (subRes.data.length > 0 && !subjectId) {
      setSubjectId(subRes.data[0].id);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post('/assignments', { title, subjectId, deadline, priority, difficulty, weight, description });
    setTitle('');
    setDescription('');
    fetchData();
  };


  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this assignment?')) {
      await api.delete(`/assignments/${id}`);
      fetchData();
    }
  };

  const handleComplete = async (id) => {
    await api.put(`/assignments/${id}/complete`);
    fetchData();
  };

  const loadSubtasks = async (assignmentId) => {
    const res = await api.get(`/assignments/${assignmentId}/subtasks`);
    setActiveSubtasks(prev => ({...prev, [assignmentId]: res.data}));
  };

  const generateSubtasks = async (assignmentId) => {
    const res = await api.post(`/assignments/${assignmentId}/subtasks/generate`);
    setActiveSubtasks(prev => ({...prev, [assignmentId]: res.data}));
  };

  const toggleSubtask = async (assignmentId, subtaskId) => {
    await api.put(`/assignments/${assignmentId}/subtasks/${subtaskId}/toggle`);
    loadSubtasks(assignmentId);
  };

  return (
    <div className="p-8 text-slate-800 dark:text-slate-100">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-8">
          Assignments & Tasks
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-slate-800/40 p-8 rounded-[2rem] border border-slate-300 dark:border-slate-700/50 shadow-sm h-fit relative overflow-hidden transition duration-500 hover:shadow-md hover:border-indigo-100">
            <h2 className="text-2xl font-black mb-6 text-slate-900 dark:text-white tracking-tight">New Assignment</h2>
            <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
              <div>
                <label className="block text-sm font-bold tracking-wide text-slate-500 dark:text-slate-400 mb-1.5 uppercase">Title</label>
                <input type="text" value={title} onChange={e => setTitle(e.target.value)} required 
                  className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700/50 rounded-xl px-4 py-3 text-slate-800 dark:text-slate-100 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all shadow-sm"/>
              </div>
              <div>
                <label className="block text-sm font-bold tracking-wide text-slate-500 dark:text-slate-400 mb-1.5 uppercase">Subject</label>
                <select value={subjectId} onChange={e => setSubjectId(e.target.value)} required
                  className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700/50 rounded-xl px-4 py-3 text-slate-800 dark:text-slate-100 outline-none focus:border-indigo-500 transition-all shadow-sm hover:cursor-pointer">
                  {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold tracking-wide text-slate-500 dark:text-slate-400 mb-1.5 uppercase">Deadline</label>
                <input type="datetime-local" value={deadline} onChange={e => setDeadline(e.target.value)} required 
                  className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700/50 rounded-xl px-4 py-3 text-slate-800 dark:text-slate-100 outline-none focus:border-indigo-500 transition-all shadow-sm"/>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold tracking-wide text-slate-500 dark:text-slate-400 mb-1.5 uppercase">Priority</label>
                  <select value={priority} onChange={e => setPriority(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700/50 rounded-xl px-3 py-3 text-slate-800 dark:text-slate-100 outline-none focus:border-indigo-500 transition-all shadow-sm hover:cursor-pointer">
                    <option>Low</option><option>Medium</option><option>High</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold tracking-wide text-slate-500 dark:text-slate-400 mb-1.5 uppercase">Weight</label>
                  <select value={weight} onChange={e => setWeight(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700/50 rounded-xl px-3 py-3 text-slate-800 dark:text-slate-100 outline-none focus:border-indigo-500 transition-all shadow-sm hover:cursor-pointer">
                    <option>Homework</option><option>Quiz</option><option>Exam</option>
                  </select>
                </div>
              </div>
              <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-all shadow-sm hover:shadow-md hover:scale-[1.02] mt-6 flex justify-center items-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                Add Assignment
              </button>
            </form>
          </div>
          
          <div className="lg:col-span-2 space-y-4">
            {assignments.map(a => (
              <div key={a.id} className="bg-white dark:bg-slate-800/40 p-6 rounded-2xl border border-slate-300 dark:border-slate-700/50 transition-all hover:border-slate-300 hover:shadow-md shadow-sm group relative overflow-hidden">
                {/* Status Indicator Bar */}
                <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${a.status === 'COMPLETED' ? 'bg-emerald-400' : a.priority === 'High' ? 'bg-rose-500' : a.priority === 'Medium' ? 'bg-amber-400' : 'bg-indigo-400'}`}></div>
                
                <div className="flex justify-between items-start ml-2">
                  <div>
                    <h3 className={`text-xl font-bold ${a.status === 'COMPLETED' ? 'text-slate-500 dark:text-slate-400 line-through' : 'text-slate-900 dark:text-white'}`}>{a.title}</h3>
                    <div className="flex gap-3 mt-3 text-xs font-bold tracking-wide flex-wrap">
                      <span className="bg-slate-50 dark:bg-[#0f172a] px-3 py-1.5 rounded-md text-slate-600 dark:text-slate-300 border border-slate-300 dark:border-slate-700/50">{a.subject?.name}</span>
                      <span className="flex items-center gap-1.5 bg-indigo-900/30 text-indigo-300 px-3 py-1.5 rounded-md border border-indigo-100">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        {new Date(a.deadline).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <span className={`px-3 py-1.5 rounded-md border uppercase ${a.priority==='High'?'bg-rose-50 text-rose-600 border-rose-100':a.priority==='Medium'?'bg-amber-50 text-amber-600 border-amber-100':'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
                        {a.priority}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-3 items-end">
                    <div className="flex gap-2 items-center">
                      <span className={`inline-block px-3 py-1.5 text-[10px] uppercase tracking-widest font-black rounded border ${a.status === 'COMPLETED' ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-slate-50 dark:bg-[#0f172a] border-slate-300 dark:border-slate-700/50 text-slate-500 dark:text-slate-400'}`}>
                        {a.status}
                      </span>
                      {a.status !== 'COMPLETED' && (
                        <button onClick={() => handleComplete(a.id)} className="text-[10px] font-black tracking-widest uppercase bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white border border-emerald-200 px-3 py-1.5 rounded transition shadow-sm hover:shadow-md">Done</button>
                      )}
                      <button onClick={() => handleDelete(a.id)} className="text-[10px] font-black tracking-widest uppercase bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white border border-rose-200 px-3 py-1.5 rounded transition shadow-sm hover:shadow-md">Delete</button>
                    </div>
                    {!activeSubtasks[a.id] ? (
                      <button onClick={() => loadSubtasks(a.id)} className="text-xs font-bold text-indigo-400 hover:text-indigo-800 transition flex items-center gap-1">View Subtasks <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"></path></svg></button>
                    ) : (
                      <button onClick={() => setActiveSubtasks(p => ({...p, [a.id]: null}))} className="text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:text-slate-200 transition flex items-center gap-1">Hide Subtasks <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 15l7-7 7 7"></path></svg></button>
                    )}
                  </div>
                </div>

                {/* Subtasks Section */}
                {activeSubtasks[a.id] && (
                  <div className="mt-5 pt-4 border-t border-slate-300 dark:border-slate-700/30 ml-2">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-sm font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <svg className="w-4 h-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                        Subtasks
                      </h4>
                      {activeSubtasks[a.id].length === 0 && (
                        <button onClick={() => generateSubtasks(a.id)} className="bg-indigo-900/30 hover:bg-indigo-900/50 text-indigo-400 border border-indigo-200 px-4 py-1.5 font-bold rounded-lg text-xs transition flex items-center gap-1 shadow-sm">
                           <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                           Auto-Generate Tasks
                        </button>
                      )}
                    </div>
                    {activeSubtasks[a.id].length > 0 ? (
                      <div className="space-y-2">
                        {activeSubtasks[a.id].map(st => (
                          <div key={st.id} className="flex items-center gap-3 bg-slate-50 dark:bg-[#0f172a] p-3 rounded-xl border border-slate-300 dark:border-slate-700/30 hover:bg-white dark:bg-slate-800/60 transition-colors">
                            <input type="checkbox" checked={st.status === 'COMPLETED'} onChange={() => toggleSubtask(a.id, st.id)}
                              className="w-5 h-5 rounded border-slate-300 text-indigo-400 focus:ring-indigo-500 bg-white dark:bg-slate-800/40 hover:cursor-pointer" />
                            <span className={`${st.status === 'COMPLETED' ? 'line-through text-slate-500 dark:text-slate-400' : 'text-slate-700 dark:text-slate-200 font-medium'}`}>{st.title}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium italic bg-slate-50 dark:bg-[#0f172a] p-4 rounded-xl text-center border border-slate-300 dark:border-slate-700/30">No subtasks found. Let Atlas AI generate a breakdown for you!</p>
                    )}
                  </div>
                )}
              </div>
            ))}
            {assignments.length === 0 && <div className="text-slate-500 dark:text-slate-400 text-center py-10 font-bold border-2 border-dashed border-slate-300 dark:border-slate-700/50 rounded-2xl">No assignments yet. Add one!</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
