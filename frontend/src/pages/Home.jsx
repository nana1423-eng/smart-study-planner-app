import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { user } = useAuth();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (user) return <Navigate to="/dashboard" />;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-800 dark:text-slate-100 overflow-x-hidden font-sans selection:bg-blue-500/30">
      
      {/* Dynamic Animated Mesh & Grid Background */}
      <div className="fixed inset-0 bg-[#06080d] z-0 pointer-events-none overflow-hidden">
        {/* Vercel-style Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
        
        {/* Glowing Orbs */}
        <div className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] md:w-[50vw] md:h-[50vw] bg-indigo-600/20 rounded-full mix-blend-screen filter blur-[150px] animate-blob"></div>
        <div className="absolute top-[20%] right-[-10%] w-[60vw] h-[60vw] md:w-[40vw] md:h-[40vw] bg-fuchsia-600/20 rounded-full mix-blend-screen filter blur-[150px] animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[-20%] left-[20%] w-[80vw] h-[80vw] md:w-[60vw] md:h-[60vw] bg-blue-600/20 rounded-full mix-blend-screen filter blur-[150px] animate-blob animation-delay-4000"></div>
        <div className="absolute inset-0 bg-[#06080d]/40 backdrop-blur-[20px]"></div>
      </div>



      {/* 1. Professional Navbar */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 border-b ${scrolled ? 'bg-slate-950/90 backdrop-blur-2xl border-slate-200 dark:border-slate-800 shadow-sm' : 'bg-transparent border-transparent py-4'}`}>
        <div className="max-w-6xl mx-auto px-6 h-16 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-blue-600/10 border border-blue-500/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-800 dark:text-slate-100">SmartStudy</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-500 dark:text-slate-400">
            <a href="#features" className="hover:text-slate-800 dark:text-slate-100 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-slate-800 dark:text-slate-100 transition-colors">How it Works</a>
            <a href="#ai-highlight" className="hover:text-slate-800 dark:text-slate-100 transition-colors">AI Engine</a>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:text-slate-100 transition-colors px-4 py-2">Log In</Link>
            <Link to="/register" className="text-sm font-bold bg-blue-600 text-white px-5 py-2.5 rounded-md hover:bg-blue-500 transition-colors shadow-sm shadow-blue-500/20">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 w-full pt-32">
        
        {/* 2. Hero Section */}
        <section className="max-w-7xl mx-auto px-6 pt-20 pb-24 text-center">

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 font-bold text-sm mb-8 shadow-[0_0_20px_rgba(99,102,241,0.2)] animate-pulse">
            <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
            Atlas AI Core Now Live
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-[5rem] font-black tracking-tighter mb-6 leading-[1.1] max-w-5xl mx-auto">
            The ultimate academic <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-fuchsia-400 animate-gradient bg-300%">
              command center.
            </span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 mb-10 max-w-2xl mx-auto font-medium leading-relaxed">
            SmartStudy automatically breaks down huge assignments into manageable daily tasks so you never have to cram again. Focus better, stress less, and improve your grades.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/register" className="group relative inline-flex items-center justify-center bg-gradient-to-r from-blue-600 to-indigo-600 text-slate-900 dark:text-white px-10 py-4 rounded-full font-bold text-lg shadow-[0_0_30px_rgba(59,130,246,0.5)] hover:shadow-[0_0_50px_rgba(79,70,229,0.7)] hover:-translate-y-1 transition-all duration-300 border border-white/10">
              <span>Start Planning</span>
              <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
            </Link>
            <a href="#how-it-works" className="inline-flex items-center justify-center bg-white dark:bg-slate-800/60 hover:bg-slate-200 dark:hover:bg-slate-700/80 backdrop-blur-xl border border-slate-300 dark:border-slate-700/50 text-slate-900 dark:text-white px-10 py-4 rounded-full font-bold text-lg transition-all hover:-translate-y-1 duration-300">
              See How It Works
            </a>
          </div>
        </section>

        {/* 3. Dashboard Preview */}
        <section className="max-w-[75rem] mx-auto px-6 pb-32 perspective-1000 z-20 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-blue-600/20 to-fuchsia-600/20 blur-[150px] -z-10 rounded-full opacity-50"></div>
          <div className="relative rounded-2xl overflow-hidden border border-slate-300 dark:border-slate-700/50/50 shadow-[0_0_80px_rgba(79,70,229,0.2)] hover:shadow-[0_0_120px_rgba(79,70,229,0.3)] ring-1 ring-white/10 group transform-gpu hover:-translate-y-2 transition-all duration-700 ease-out">
            {/* Fake Browser Chrome */}
            <div className="h-12 bg-[#090b14]/90 backdrop-blur-md border-b border-slate-300 dark:border-slate-700/50/50 flex items-center px-4 gap-3">
              <div className="flex gap-2">
                <div className="w-3.5 h-3.5 rounded-full bg-rose-500/90 shadow-sm"></div>
                <div className="w-3.5 h-3.5 rounded-full bg-amber-500/90 shadow-sm"></div>
                <div className="w-3.5 h-3.5 rounded-full bg-emerald-500/90 shadow-sm"></div>
              </div>
              <div className="mx-auto bg-[#131620] px-4 py-1.5 rounded-md w-72 text-center text-[11px] text-slate-500 dark:text-slate-400 font-mono border border-white/5 flex items-center justify-center gap-2 shadow-inner">
                <svg className="w-3 h-3 text-slate-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"></path></svg>
                smartstudy.app
              </div>
            </div>
            {/* Dashboard Mockup Body */}
            <div className="bg-slate-950 p-6 md:p-10 grid md:grid-cols-3 gap-6 relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 to-indigo-500/5 pointer-events-none"></div>
              <div className="md:col-span-2 space-y-6">
                <div className="h-40 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0f172a]/50 flex flex-col justify-end p-4 relative overflow-hidden">
                  <div className="absolute top-4 left-4 text-sm font-bold text-slate-600 dark:text-slate-300">Weekly Performance</div>
                  <div className="flex items-end gap-3 h-20">
                    {[40, 70, 45, 90, 60, 30, 80].map((h, i) => (
                      <div key={i} className="flex-1 bg-gradient-to-t from-blue-600 to-indigo-400 rounded-t-sm opacity-80" style={{height: `${h}%`}}></div>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="h-32 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0f172a]/50 p-5 flex flex-col justify-between">
                    <div className="text-slate-500 dark:text-slate-400 text-sm font-medium">Study Streak</div>
                    <div className="text-4xl font-black text-slate-900 dark:text-white">12 <span className="text-lg text-teal-400">Days</span></div>
                  </div>
                  <div className="h-32 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0f172a]/50 p-5 flex flex-col justify-between">
                    <div className="text-slate-500 dark:text-slate-400 text-sm font-medium">Total Points</div>
                    <div className="text-4xl font-black text-slate-900 dark:text-white">2,450</div>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="text-sm font-bold text-slate-600 dark:text-slate-300 mb-2">Today's Tasks</div>
                {[1,2,3,4].map(i => (
                  <div key={i} className="h-16 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0f172a]/80 p-3 flex items-center gap-4">
                    <div className={`w-4 h-4 rounded-full border-2 ${i===1 ? 'bg-blue-500 border-blue-500' : 'border-slate-300 dark:border-slate-700'}`}></div>
                    <div className="flex-1">
                      <div className="h-2 w-3/4 bg-slate-700 rounded mb-2"></div>
                      <div className="h-1.5 w-1/2 bg-white dark:bg-slate-800/60 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Glow sweep effect */}
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 group-hover:animate-[shimmer_2s_infinite]"></div>
          </div>
        </section>

        {/* 4. Features (Redesigned Bento Box) */}
        <section id="features" className="max-w-7xl mx-auto px-6 py-32 relative">
          {/* Background Ambient Glow for Features */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-gradient-to-br from-indigo-600/30 via-fuchsia-600/20 to-teal-500/20 rounded-full blur-[150px] pointer-events-none"></div>
          
          <div className="text-center mb-24 relative z-10">
            <h2 className="text-5xl md:text-6xl font-black mb-6 tracking-tighter">
              Built for <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 via-indigo-400 to-cyan-400">Excellence.</span>
            </h2>
            <p className="text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed font-medium">
              Everything you need to organize your academic life without the bloat. Simple, stunning, and built to guarantee you full marks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
            {/* Feature 1 (Large Card - spans 2 columns) */}
            <div className="md:col-span-2 relative group rounded-[2.5rem] p-[1px] overflow-hidden bg-gradient-to-b from-slate-700/50 to-slate-800/20 hover:from-indigo-500/50 hover:to-fuchsia-500/50 transition-all duration-500">
              <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-3xl"></div>
              <div className="relative h-full bg-[#0b101e]/80 p-10 md:p-12 rounded-[2.5rem] flex flex-col justify-between overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 blur-[60px] rounded-full group-hover:bg-indigo-500/30 transition-colors duration-500"></div>
                <div className="absolute bottom-0 right-10 opacity-10 group-hover:opacity-20 group-hover:scale-110 transition-all duration-700">
                  <svg className="w-48 h-48 text-indigo-400" fill="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                </div>
                
                <div>
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 p-[1px] mb-8 shadow-lg shadow-indigo-500/30 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500">
                    <div className="w-full h-full bg-slate-950 rounded-[15px] flex items-center justify-center">
                      <svg className="w-8 h-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                    </div>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-black mb-4 text-slate-900 dark:text-white tracking-wide">Smart Task Breakdown</h3>
                  <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-lg max-w-md">
                    Upload huge assignments and watch the intelligent engine divide them into bite-sized actionable items tailored to your deadline.
                  </p>
                </div>
                
                {/* Fake UI Element inside the card */}
                <div className="mt-10 p-4 rounded-2xl bg-white dark:bg-slate-900/50 border border-slate-300 dark:border-slate-700/50 flex flex-col gap-3 group-hover:border-indigo-500/30 transition-colors">
                  <div className="h-2 w-1/3 bg-indigo-500/50 rounded-full"></div>
                  <div className="h-2 w-full bg-white dark:bg-slate-800 rounded-full"></div>
                  <div className="h-2 w-5/6 bg-white dark:bg-slate-800 rounded-full"></div>
                </div>
              </div>
            </div>

            {/* Feature 2 (Tall Card) */}
            <div className="md:col-span-1 relative group rounded-[2.5rem] p-[1px] overflow-hidden bg-gradient-to-b from-slate-700/50 to-slate-800/20 hover:from-teal-400/50 hover:to-emerald-500/50 transition-all duration-500">
              <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-3xl"></div>
              <div className="relative h-full bg-[#0b101e]/80 p-10 flex flex-col justify-between rounded-[2.5rem] overflow-hidden">
                <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-teal-900/40 to-transparent group-hover:from-teal-800/40 transition-colors duration-500"></div>
                <div>
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-400 to-emerald-600 p-[1px] mb-8 shadow-lg shadow-teal-500/20 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                    <div className="w-full h-full bg-slate-950 rounded-[15px] flex items-center justify-center">
                      <svg className="w-8 h-8 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    </div>
                  </div>
                  <h3 className="text-2xl font-black mb-4 text-slate-900 dark:text-white">Focus Pomodoro</h3>
                  <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                    A sleek, distraction-free timer built into your workflow. Enter the flow state effortlessly.
                  </p>
                </div>
                {/* Timer Graphic */}
                <div className="mt-8 relative w-32 h-32 mx-auto">
                  <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="#1e293b" strokeWidth="8"></circle>
                    <circle cx="50" cy="50" r="45" fill="none" stroke="#2dd4bf" strokeWidth="8" strokeDasharray="283" strokeDashoffset="60" className="group-hover:strokeDashoffset-0 transition-all duration-1000 ease-out"></circle>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center text-xl font-bold text-slate-900 dark:text-white">25:00</div>
                </div>
              </div>
            </div>

            {/* Feature 3 (Wide Card - spans all 3 columns below) */}
            <div className="md:col-span-3 relative group rounded-[2.5rem] p-[1px] overflow-hidden bg-gradient-to-b from-slate-700/50 to-slate-800/20 hover:from-amber-400/50 hover:to-orange-500/50 transition-all duration-500">
              <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-3xl"></div>
              <div className="relative h-full bg-[#0b101e]/80 p-10 md:p-12 rounded-[2.5rem] flex flex-col md:flex-row items-center gap-10 overflow-hidden">
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-orange-500/5 blur-[100px] pointer-events-none group-hover:bg-orange-500/10 transition-colors duration-700"></div>
                
                <div className="flex-1 z-10">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-600 p-[1px] mb-8 shadow-lg shadow-orange-500/20 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500">
                    <div className="w-full h-full bg-slate-950 rounded-[15px] flex items-center justify-center">
                      <svg className="w-8 h-8 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
                    </div>
                  </div>
                  <h3 className="text-3xl font-black mb-4 text-slate-900 dark:text-white">Gamified Execution</h3>
                  <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-lg max-w-xl">
                    Earn points, track your rewards, and visualize your daily progress with interactive charts that keep your motivation peaking.
                  </p>
                </div>

                <div className="flex-1 w-full bg-white dark:bg-slate-900/60 rounded-2xl p-6 border border-slate-300 dark:border-slate-700/50 z-10 group-hover:border-orange-500/30 transition-colors relative overflow-hidden">
                  {/* Decorative chart */}
                  <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-orange-500/10 to-transparent"></div>
                  <div className="flex items-end justify-between h-32 gap-2 relative z-10">
                    {[30, 50, 40, 70, 60, 90, 80].map((h, i) => (
                      <div key={i} className="w-full bg-white dark:bg-slate-800 rounded-t-lg group-hover:bg-gradient-to-t group-hover:from-orange-600 group-hover:to-amber-400 transition-all duration-700 delay-75" style={{height: `${h}%`}}></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* 6. AI Highlight */}
        <section id="ai-highlight" className="my-20 relative px-6 py-24 overflow-hidden border-y border-slate-200 dark:border-slate-800/50 bg-slate-950/50">
          <div className="absolute inset-0 bg-blue-900/5 mix-blend-screen pointer-events-none"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-blue-600/10 to-indigo-600/10 rounded-full blur-[100px] pointer-events-none"></div>
          
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16 relative z-10">
            <div className="flex-1 space-y-8">
              <div className="inline-flex items-center gap-2 text-blue-400 font-bold tracking-wide text-sm uppercase">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
                Engineered with Intelligence
              </div>
              <h2 className="text-4xl md:text-5xl font-black leading-tight">We break down the mountain. <br/><span className="text-slate-500 dark:text-slate-400">You just climb.</span></h2>
              <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-medium">Have a huge final essay due in 2 weeks? SmartStudy automatically splits the workload into tiny daily tasks, ensuring you never cram the night before.</p>
              <ul className="space-y-4">
                {['Automatic deadline calculations', 'Workload balancing based on your limits', 'Adaptive rescheduling if you miss a day'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-600 dark:text-slate-300 font-medium">
                    <div className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs">✓</div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex-1 w-full">
              {/* Fake UI for AI Splitting */}
              <div className="bg-slate-50 dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700/50 rounded-2xl p-6 shadow-2xl relative">
                <div className="absolute -top-4 -right-4 bg-indigo-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">AI Split Active</div>
                <div className="border border-slate-300 dark:border-slate-700/50/50 bg-white dark:bg-slate-800/60 p-4 rounded-xl mb-4">
                  <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">Assignment</div>
                  <div className="font-bold text-lg">Final History Research Paper</div>
                  <div className="text-sm text-red-400 mt-2">Due in 14 days</div>
                </div>
                <div className="flex justify-center my-4">
                  <svg className="w-6 h-6 text-slate-500 dark:text-slate-400 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg>
                </div>
                <div className="space-y-3">
                  {[
                    {day: 'Day 1-2', task: 'Research and Source Gathering'},
                    {day: 'Day 3-5', task: 'Outline formatting & Thesis'},
                    {day: 'Day 6-10', task: 'Drafting main body paragraphs'},
                  ].map((tt, i) => (
                    <div key={i} className="flex items-center gap-4 bg-slate-950 border border-slate-200 dark:border-slate-800 p-3 rounded-lg">
                      <div className="text-xs font-bold text-indigo-400 bg-indigo-400/10 px-2 py-1 rounded">{tt.day}</div>
                      <div className="text-sm font-medium text-slate-600 dark:text-slate-300">{tt.task}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5. How it Works & 7. Planner Preview Combined */}
        <section id="how-it-works" className="max-w-7xl mx-auto px-6 py-24 text-center">
          <h2 className="text-3xl md:text-5xl font-black mb-16">Three steps to success.</h2>
          
          <div className="grid md:grid-cols-3 gap-12 relative">
            <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-blue-500/50 via-indigo-500/50 to-teal-500/50 z-0"></div>
            
            <div className="relative z-10 flex flex-col items-center group">
              <div className="w-24 h-24 rounded-full bg-slate-50 dark:bg-[#0f172a] border-4 border-blue-500 text-blue-400 flex items-center justify-center text-3xl font-black mb-6 shadow-md shadow-blue-500/10 group-hover:bg-blue-500 group-hover:text-white transition-all duration-300">1</div>
              <h3 className="text-2xl font-bold mb-3">Add Your Classes</h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed px-4">Simply type in your classes, exams, and large assignments into the easy-to-use dashboard.</p>
            </div>
            
            <div className="relative z-10 flex flex-col items-center group">
              <div className="w-24 h-24 rounded-full bg-slate-50 dark:bg-[#0f172a] border-4 border-indigo-500 text-indigo-400 flex items-center justify-center text-3xl font-black mb-6 shadow-md shadow-indigo-500/10 group-hover:bg-indigo-500 group-hover:text-white transition-all duration-300">2</div>
              <h3 className="text-2xl font-bold mb-3">Focus on Today</h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed px-4">Follow the automatically generated daily plan. Just log in and see exactly what you need to do today.</p>
            </div>
            
            <div className="relative z-10 flex flex-col items-center group">
              <div className="w-24 h-24 rounded-full bg-slate-50 dark:bg-[#0f172a] border-4 border-teal-500 text-teal-400 flex items-center justify-center text-3xl font-black mb-6 shadow-md shadow-teal-500/10 group-hover:bg-teal-500 group-hover:text-slate-900 dark:text-white transition-all duration-300">3</div>
              <h3 className="text-2xl font-bold mb-3">Earn Rewards</h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed px-4">Watch your charts go green. Build your streak, earn points, and level up your productivity naturally.</p>
            </div>
          </div>
        </section>

        {/* 7. Planner Preview */}
        <section className="max-w-7xl mx-auto px-6 py-24 border-t border-slate-200 dark:border-slate-800/50">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black mb-6">Your Month at a Glance.</h2>
            <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">See exactly what needs to be done today, tomorrow, and next week. No surprises.</p>
          </div>
          <div className="bg-slate-50 dark:bg-[#0f172a] border border-slate-300 dark:border-slate-700/50/50 rounded-[2rem] p-4 md:p-8 shadow-2xl overflow-hidden relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-1/2 bg-gradient-to-b from-blue-500/10 to-transparent pointer-events-none"></div>
            <div className="grid grid-cols-7 gap-2 md:gap-4 text-center">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                <div key={day} className="text-sm font-bold text-slate-500 dark:text-slate-400 py-2">{day}</div>
              ))}
              {Array.from({length: 31}).map((_, i) => (
                <div key={i} className={`h-20 md:h-32 rounded-xl border border-slate-200 dark:border-slate-800/50 p-2 text-left relative transition-colors ${i === 14 ? 'bg-indigo-900/30' : i === 8 || i === 22 ? 'bg-white dark:bg-slate-800/60' : 'bg-slate-950/50 hover:bg-slate-50 dark:bg-[#0f172a]/80 cursor-default'}`}>
                  <span className={`text-sm font-bold ${i === 14 ? 'text-indigo-400' : 'text-slate-500 dark:text-slate-400'}`}>{i + 1}</span>
                  {i === 14 && (
                    <div className="mt-2 w-full bg-blue-500 text-white text-[10px] md:text-xs font-bold px-1 py-0.5 rounded truncate">
                      History Paper
                    </div>
                  )}
                  {i === 8 && (
                    <div className="mt-2 w-full bg-indigo-500 text-white text-[10px] md:text-xs font-bold px-1 py-0.5 rounded truncate">
                      Math Quiz
                    </div>
                  )}
                  {i === 22 && (
                    <div className="mt-2 w-full bg-teal-500 text-slate-900 dark:text-white text-[10px] md:text-xs font-bold px-1 py-0.5 rounded truncate">
                      Physics Lab
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 8. CTA Section */}
        <section className="mt-10 mb-20 px-6">
          <div className="max-w-5xl mx-auto bg-gradient-to-br from-indigo-900/80 to-purple-900/80 border border-indigo-500/30 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden backdrop-blur-xl shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-400/20 blur-[80px] rounded-full"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-400/20 blur-[80px] rounded-full"></div>
            
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white mb-6 relative z-10">Ready to transform your grades?</h2>
            <p className="text-xl text-indigo-200 mb-10 max-w-2xl mx-auto relative z-10">Join thousands of proactive students who have optimized their entirely study workflow with SmartStudy.</p>
            <div className="relative z-10">
              <Link to="/register" className="inline-block bg-white dark:bg-slate-800/60 text-indigo-900 px-12 py-5 rounded-full font-black text-xl hover:bg-slate-100 hover:scale-105 transition-all shadow-[0_0_40px_rgba(255,255,255,0.3)]">
                Create Your Free Account
              </Link>
              <div className="mt-6 text-indigo-300/80 text-sm font-medium">No credit card required. Setup takes 30 seconds.</div>
            </div>
          </div>
        </section>
      </main>

      {/* 9. Footer */}
      <footer className="bg-slate-950 border-t border-slate-200 dark:border-slate-800 pt-16 pb-8 px-6 relative z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 rounded bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                <svg className="w-3 h-3 text-slate-900 dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
              </div>
              <span className="text-lg font-bold text-slate-900 dark:text-white">SmartStudy</span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xs leading-relaxed">
              The premium academic organizer. Built for students who demand excellence and structured productivity.
            </p>
          </div>
          <div>
            <h4 className="text-slate-900 dark:text-white font-bold mb-4">Platform</h4>
            <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
              <li><a href="#" className="hover:text-blue-400 transition-colors">Features</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Integrations</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Changelog</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-slate-900 dark:text-white font-bold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
              <li><a href="#" className="hover:text-blue-400 transition-colors">About</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto border-t border-slate-200 dark:border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-600 dark:text-slate-300 font-medium">
          <div className="flex flex-col gap-1">
            <span>&copy; {new Date().getFullYear()} Smart Study Planner. All rights reserved.</span>
            <span className="text-slate-500 dark:text-slate-400">Developed by <span className="text-slate-700 dark:text-slate-200 font-semibold">Kelvin Kwaku Yeboah</span> • <a href="mailto:yeboahn1423@gmail.com" className="hover:text-blue-400 transition-colors">yeboahn1423@gmail.com</a> • <a href="tel:0247862212" className="hover:text-blue-400 transition-colors">0247862212</a></span>
          </div>
          <div className="flex gap-4">
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">Twitter</a>
            <a href="https://github.com/kelvinkwakuyeboah" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">GitHub</a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">LinkedIn</a>
          </div>
        </div>
      </footer>

      {/* Tailwind Custom Keyframes for Shimmer injected globally if not present but we can use classes */}
      <style dangerouslySetInnerHTML={{__html:`
        @keyframes shimmer {
          100% { transform: translateX(100%) skewX(12deg); }
        }
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-blob { animation: blob 12s infinite cubic-bezier(0.4, 0, 0.2, 1); }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
        .animate-gradient { background-size: 200% auto; animation: gradient 4s linear infinite; }
        .bg-300\\% { background-size: 300% auto; }
      `}} />
    </div>
  );
}
