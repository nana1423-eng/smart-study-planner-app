import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axiosConfig';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const { login, user } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(username, password);
      // Removed direct navigate('/dashboard') to prevent race condition with Context state
    } catch (err) {
      setError(err.response?.data || 'Invalid username or password');
    }
  };

  return (
    <div 
      className="min-h-screen relative flex items-center justify-center bg-cover bg-center bg-fixed text-slate-800 dark:text-slate-100"
      style={{ backgroundImage: "url('/library_study_bg.png')" }}
    >
      <div className="absolute inset-0 bg-slate-50 dark:bg-[#0f172a]/80 backdrop-blur-[5px] z-0"></div>
      
      {/* Decorative Orbs */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-600/20 rounded-full mix-blend-screen filter blur-[80px] animate-pulse z-0"></div>
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-indigo-600/20 rounded-full mix-blend-screen filter blur-[80px] animate-pulse z-0" style={{animationDelay: '1s'}}></div>
      
      <div className="relative z-10 w-full max-w-md p-8 sm:p-10 bg-slate-50 dark:bg-[#0f172a]/70 backdrop-blur-3xl rounded-[2.5rem] border border-slate-300 dark:border-slate-700/30 shadow-[0_10px_50px_rgba(0,0,0,0.6)]">
        <div className="text-center mb-10 relative mt-4">
          <Link to="/" className="absolute left-0 top-0 p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white transition bg-white dark:bg-slate-800/60 rounded-full border border-slate-300 dark:border-slate-700/50/50">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          </Link>
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-500/10">
              <svg className="w-10 h-10 text-slate-900 dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
            </div>
          </div>
          <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400 drop-shadow-sm tracking-tight">Welcome Back</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Please sign in to access your planner.</p>
        </div>
        
        {error && <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-4 rounded-xl mb-6 text-sm text-center font-medium animate-pulse shadow-inner">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold mb-2 text-slate-600 dark:text-slate-300 tracking-wide">USERNAME</label>
            <input 
              type="text" 
              className="w-full bg-white dark:bg-slate-800/60 border border-slate-300 dark:border-slate-700/50 rounded-2xl px-5 py-4 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/80 focus:border-transparent transition-all shadow-inner placeholder-slate-500 font-medium"
              placeholder="Enter your username"
              value={username} onChange={(e) => setUsername(e.target.value)} required 
            />
          </div>
          <div className="relative">
            <label className="block text-sm font-bold mb-2 text-slate-600 dark:text-slate-300 tracking-wide">PASSWORD</label>
            <input 
              type={showPassword ? "text" : "password"} 
              className="w-full bg-white dark:bg-slate-800/60 border border-slate-300 dark:border-slate-700/50 rounded-2xl px-5 py-4 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/80 focus:border-transparent transition-all shadow-inner placeholder-slate-500 font-medium pr-12"
              placeholder="••••••••"
              value={password} onChange={(e) => setPassword(e.target.value)} required 
            />
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-[2.4rem] text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white transition-colors focus:outline-none"
            >
              {showPassword ? (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path></svg>
              ) : (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
              )}
            </button>
          </div>
          
          <div className="flex items-center justify-between text-sm mt-4">
            <label className="flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="form-checkbox h-4 w-4 text-blue-500 rounded border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800/60 focus:ring-blue-500/50 transition duration-150 ease-in-out cursor-pointer"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span className="ml-2 text-slate-600 dark:text-slate-300 font-medium select-none">Remember me</span>
            </label>
            <Link to="/forgot-password" className="font-bold text-blue-400 hover:text-blue-300 transition-colors">Forgot password?</Link>
          </div>
          <button type="submit" className="w-full mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-slate-900 dark:text-white font-extrabold text-lg py-4 rounded-2xl transition-all shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:shadow-[0_0_30px_rgba(79,70,229,0.5)] hover:-translate-y-1 transform duration-300 border border-blue-400/30">
            Log In securely
          </button>
        </form>
        
        <div className="mt-8 text-center text-slate-500 dark:text-slate-400 font-medium">
          Don't have an account? <Link to="/register" className="text-blue-400 hover:text-blue-300 font-bold transition ml-1 underline underline-offset-4 decoration-blue-500/50">Sign up</Link>
        </div>
      </div>
    </div>
  );
}
