import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setIsSubmitted(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-slate-950 text-slate-800 dark:text-slate-100 overflow-hidden font-sans">
      
      {/* Dynamic Animated Mesh Background matching Home.jsx */}
      <div className="absolute inset-0 bg-slate-950 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] md:w-[50vw] md:h-[50vw] bg-indigo-900/40 rounded-full mix-blend-screen filter blur-[120px] animate-blob"></div>
        <div className="absolute top-[20%] right-[-10%] w-[60vw] h-[60vw] md:w-[40vw] md:h-[40vw] bg-purple-900/40 rounded-full mix-blend-screen filter blur-[120px] animate-blob" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-[-20%] left-[20%] w-[80vw] h-[80vw] md:w-[60vw] md:h-[60vw] bg-blue-900/40 rounded-full mix-blend-screen filter blur-[120px] animate-blob" style={{animationDelay: '4s'}}></div>
        <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[30px]"></div>
      </div>
      
      <div className="relative z-10 w-full max-w-md p-8 sm:p-10 bg-slate-50 dark:bg-[#0f172a]/70 backdrop-blur-3xl rounded-[2.5rem] border border-slate-300 dark:border-slate-700/30 shadow-[0_10px_50px_rgba(0,0,0,0.6)]">
        
        <div className="text-center mb-10 relative mt-4">
          <Link to="/login" className="absolute left-0 top-0 p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white transition bg-white dark:bg-slate-800/60 rounded-full border border-slate-300 dark:border-slate-700/50/50 group">
            <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          </Link>
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center shadow-md shadow-indigo-500/10">
              <svg className="w-8 h-8 text-slate-900 dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
            </div>
          </div>
          <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400 drop-shadow-sm tracking-tight mb-2">Password Reset</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium">
            {!isSubmitted ? "Enter your email and we'll send you a link to get back into your account." : "Check your inbox!"}
          </p>
        </div>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold mb-2 text-slate-600 dark:text-slate-300 tracking-wide">EMAIL ADDRESS</label>
              <input 
                type="email" 
                className="w-full bg-white dark:bg-slate-800/60 border border-slate-300 dark:border-slate-700/50 rounded-2xl px-5 py-4 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/80 focus:border-transparent transition-all shadow-inner placeholder-slate-500 font-medium"
                placeholder="student@university.edu"
                value={email} onChange={(e) => setEmail(e.target.value)} required 
              />
            </div>
            
            <button 
              type="submit" 
              disabled={loading}
              className="w-full mt-4 flex justify-center items-center bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-slate-900 dark:text-white font-extrabold text-lg py-4 rounded-2xl transition-all shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:shadow-[0_0_30px_rgba(79,70,229,0.5)] hover:-translate-y-1 transform duration-300 border border-blue-400/30 active:scale-95 disabled:opacity-70 disabled:hover:translate-y-0"
            >
              {loading ? (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-slate-900 dark:text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : "Send Reset Link"}
            </button>
          </form>
        ) : (
          <div className="text-center space-y-6 animate-in fade-in zoom-in duration-500">
            <div className="bg-teal-500/20 text-emerald-300 border border-teal-500/50 p-6 rounded-2xl">
              <p className="font-semibold mb-2">Recovery link sent to:</p>
              <p className="text-slate-900 dark:text-white font-bold tracking-wider">{email}</p>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
              If an account with that email exists, we've sent instructions on how to reset your password. Please check your spam folder just in case.
            </p>
            <Link to="/login" className="inline-block mt-4 text-blue-400 pt-2 hover:text-blue-300 font-bold transition">
              Return to login
            </Link>
          </div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{__html:`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob { animation: blob 15s infinite; }
      `}} />
    </div>
  );
}
