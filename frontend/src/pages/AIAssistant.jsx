import React, { useState } from 'react';
import api from '../api/axiosConfig';

export default function AIAssistant() {
  const [messages, setMessages] = useState([
    { role: 'ai', content: 'Hello! I am your SmartStudy AI. You can ask me to summarize a topic, or have me generate a personalized study schedule for you based on your current workload.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      let aiResponseText = "";

      if (userMsg.content.toLowerCase().includes('schedule')) {
        const res = await api.post('/ai/schedule', { studentId: "123", courseProgress: [] });
        if (res.data.rawText) {
          aiResponseText = res.data.rawText;
        } else {
          const scheduleStr = res.data.schedule.map(s => `- **${s.day}**: ${s.task} (${s.duration_mins} mins)`).join('\n');
          aiResponseText = `Here is your optimized schedule:\n\n${scheduleStr}`;
        }
      } else if (userMsg.content.toLowerCase().includes('summarize') || userMsg.content.toLowerCase().includes('summary')) {
        const topic = userMsg.content.replace(/summarize/i, '').trim();
        const res = await api.post('/ai/summary', { topic: topic || "General Topic" });
        const bullets = res.data.bullets.map(b => `• ${b}`).join('\n');
        aiResponseText = `${res.data.summary}\n\n${bullets}`;
      } else {
        const res = await api.post('/ai/ask', { question: userMsg.content, context: "General chat context" });
        aiResponseText = res.data.answer;
      }

      setMessages(prev => [...prev, { role: 'ai', content: aiResponseText }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'ai', content: 'Sorry, I encountered an error connecting to the AI core.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-8 text-slate-800 dark:text-slate-100">
      <div className="max-w-5xl mx-auto h-[85vh] flex flex-col bg-white dark:bg-slate-800/40 border border-slate-300 dark:border-slate-700/50 rounded-3xl shadow-sm overflow-hidden relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-indigo-900/30 blur-[80px] rounded-full pointer-events-none"></div>
        {/* Header */}
        <div className="bg-slate-50 dark:bg-[#0f172a] border-b border-slate-300 dark:border-slate-700/50 p-6 flex items-center justify-between z-10 shrink-0">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-600 p-[1px] shadow-sm">
                <div className="w-full h-full bg-white dark:bg-slate-800/40 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                </div>
              </div>
              <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></span>
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Atlas Intelligence</h1>
              <p className="text-xs text-indigo-400 font-bold tracking-widest uppercase mt-0.5">Online</p>
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 z-10 custom-scrollbar">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[75%] rounded-3xl p-5 shadow-sm text-sm leading-relaxed ${msg.role === 'user' ? 'bg-indigo-600 text-slate-900 dark:text-white rounded-br-sm' : 'bg-slate-50 dark:bg-[#0f172a] text-slate-800 dark:text-slate-100 border border-slate-300 dark:border-slate-700/50 rounded-bl-sm'}`}>
                {msg.role === 'ai' && (
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 rounded-lg bg-indigo-900/50 flex items-center justify-center text-indigo-300">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                    </div>
                    <span className="text-[10px] font-black text-indigo-300 uppercase tracking-widest">Atlas</span>
                  </div>
                )}
                <div className="whitespace-pre-wrap">{msg.content}</div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-slate-50 dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700/50 rounded-3xl p-5 rounded-bl-sm flex gap-2 items-center shadow-sm">
                <div className="w-2h-2 rounded-full bg-indigo-400 animate-bounce"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-indigo-900/300 animate-bounce delay-100"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-indigo-600 animate-bounce delay-200"></div>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-5 bg-white dark:bg-slate-800/40 border-t border-slate-300 dark:border-slate-700/50 z-10 shrink-0">
          <form onSubmit={handleSend} className="relative flex items-center gap-4">
            <input
              type="text"
              className="flex-1 bg-slate-50 dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700/50 text-slate-800 dark:text-slate-100 px-6 py-4 rounded-full focus:outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400 transition-all font-medium placeholder-slate-400 shadow-sm"
              placeholder="Ask for a schedule, summary, or general question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="w-14 h-14 bg-indigo-600 text-white rounded-full flex items-center justify-center hover:bg-indigo-700 hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              <svg className="w-6 h-6 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
            </button>
          </form>
        </div>
        
      </div>
    </div>
  );
}
