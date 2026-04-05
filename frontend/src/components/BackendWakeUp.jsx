import React, { useState, useEffect, useRef } from 'react';

const HEALTH_URL = 'https://smart-study-backend-45ib.onrender.com/api/auth/health';
const POLL_INTERVAL_MS = 4000;
const LOCAL_HOSTS = ['localhost', '127.0.0.1'];

function isLocal() {
  return LOCAL_HOSTS.includes(window.location.hostname);
}

// Animated dots for the "checking" text
function AnimatedDots() {
  const [dots, setDots] = useState('');
  useEffect(() => {
    const id = setInterval(() => setDots(d => d.length >= 3 ? '' : d + '.'), 500);
    return () => clearInterval(id);
  }, []);
  return <span className="inline-block w-6 text-left">{dots}</span>;
}

// Orbiting ring SVG spinner
function OrbitSpinner() {
  return (
    <div className="relative w-24 h-24 mx-auto mb-8">
      {/* Static glow */}
      <div className="absolute inset-0 rounded-full bg-indigo-500/20 blur-xl" />
      {/* Outer ring */}
      <svg className="absolute inset-0 w-full h-full animate-spin" style={{ animationDuration: '3s' }} viewBox="0 0 96 96">
        <circle cx="48" cy="48" r="44" fill="none" stroke="url(#grad1)" strokeWidth="3"
          strokeDasharray="120 160" strokeLinecap="round" />
        <defs>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
      {/* Inner ring (counter-rotating) */}
      <svg className="absolute inset-0 w-full h-full animate-spin" style={{ animationDuration: '2s', animationDirection: 'reverse' }} viewBox="0 0 96 96">
        <circle cx="48" cy="48" r="30" fill="none" stroke="url(#grad2)" strokeWidth="2"
          strokeDasharray="70 120" strokeLinecap="round" />
        <defs>
          <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
      {/* Center icon */}
      <div className="absolute inset-0 flex items-center justify-center">
        <svg className="w-9 h-9 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
            d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
        </svg>
      </div>
    </div>
  );
}

// Horizontal progress bar that slowly fills to ~85% then waits
function SlowProgressBar({ done }) {
  const [width, setWidth] = useState(0);
  const rafRef = useRef(null);

  useEffect(() => {
    if (done) {
      setWidth(100);
      return;
    }
    // Ease out to 85% over ~90 seconds max
    let start = null;
    const TARGET = 85;
    const DURATION = 90000;
    function step(ts) {
      if (!start) start = ts;
      const elapsed = ts - start;
      const pct = Math.min(TARGET, TARGET * (1 - Math.exp(-elapsed / (DURATION / 5))));
      setWidth(pct);
      if (pct < TARGET) {
        rafRef.current = requestAnimationFrame(step);
      }
    }
    rafRef.current = requestAnimationFrame(step);
    return () => rafRef.current && cancelAnimationFrame(rafRef.current);
  }, [done]);

  return (
    <div className="w-full max-w-xs mx-auto h-1 rounded-full bg-slate-800 overflow-hidden">
      <div
        className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-blue-500 to-sky-400 transition-all"
        style={{ width: `${width}%`, transition: done ? 'width 0.4s ease' : undefined }}
      />
    </div>
  );
}

export default function BackendWakeUp({ children }) {
  // Skip splash entirely on localhost
  if (isLocal()) return children;

  return <BackendWakeUpInner>{children}</BackendWakeUpInner>;
}

function BackendWakeUpInner({ children }) {
  const [status, setStatus] = useState('checking'); // 'checking' | 'waking' | 'ready' | 'fading'
  const [attempt, setAttempt] = useState(0);
  const timerRef = useRef(null);

  async function checkHealth() {
    try {
      const res = await fetch(HEALTH_URL, { method: 'GET', cache: 'no-store', signal: AbortSignal.timeout(8000) });
      if (res.ok) {
        setStatus('fading');
        setTimeout(() => setStatus('ready'), 700);
        return true;
      }
    } catch {
      // network error / 503 — keep polling
    }
    return false;
  }

  useEffect(() => {
    let alive = true;
    let tries = 0;

    async function poll() {
      if (!alive) return;
      const ok = await checkHealth();
      if (ok || !alive) return;
      tries++;
      setAttempt(tries);
      if (tries === 1) setStatus('waking');
      timerRef.current = setTimeout(poll, POLL_INTERVAL_MS);
    }

    poll();
    return () => {
      alive = false;
      clearTimeout(timerRef.current);
    };
  }, []);

  if (status === 'ready') return children;

  const isFading = status === 'fading';
  const isWaking = status === 'waking';
  const elapsedApprox = attempt * (POLL_INTERVAL_MS / 1000);

  const tips = [
    'Your study sessions are synced in real time.',
    'You can track streaks, points, and analytics.',
    'Atlas AI can split any big assignment into daily tasks.',
    'Focus Mode keeps you on track with a Pomodoro timer.',
  ];
  const tip = tips[attempt % tips.length];

  return (
    <>
      {/* Splash overlay */}
      <div
        className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#06080d] select-none"
        style={{
          transition: 'opacity 0.7s ease',
          opacity: isFading ? 0 : 1,
          pointerEvents: isFading ? 'none' : 'auto',
        }}
      >
        {/* Animated background orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] bg-indigo-700/20 rounded-full blur-[140px] animate-pulse" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] bg-blue-700/15 rounded-full blur-[140px] animate-pulse" style={{ animationDelay: '1.5s' }} />
        </div>

        {/* Main card */}
        <div className="relative z-10 flex flex-col items-center text-center px-8 max-w-sm w-full">
          <OrbitSpinner />

          <div className="mb-2">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs font-bold tracking-wide uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
              SmartStudy
            </span>
          </div>

          <h1 className="text-2xl font-black text-white mt-4 mb-1 tracking-tight">
            {isWaking ? 'Waking Up the Server' : 'Connecting'}
          </h1>

          <p className="text-slate-400 text-sm leading-relaxed mb-6">
            {isWaking
              ? <>Our free server is starting up. This takes about <span className="text-indigo-300 font-semibold">1–2 minutes</span> after a period of inactivity.</>
              : <>Checking if the server is available<AnimatedDots /></>
            }
          </p>

          <SlowProgressBar done={isFading} />

          {isWaking && (
            <div className="mt-4 text-xs text-slate-500">
              {elapsedApprox > 0 && `${elapsedApprox}s elapsed · `}
              Checking every 4 seconds<AnimatedDots />
            </div>
          )}

          {/* Tip rotator */}
          {isWaking && attempt >= 2 && (
            <div className="mt-8 px-5 py-4 rounded-2xl border border-slate-700/60 bg-slate-900/60 backdrop-blur-sm text-left w-full">
              <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-1">While you wait</p>
              <p className="text-sm text-slate-300 leading-relaxed">{tip}</p>
            </div>
          )}
        </div>

        {/* Footer note */}
        <p className="absolute bottom-6 text-xs text-slate-600 z-10 px-4 text-center">
          Powered by Render free tier · Thanks for your patience
        </p>
      </div>

      {/* Pre-render children underneath (invisible) so they're already mounted when splash fades */}
      <div style={{ visibility: isFading || status === 'ready' ? 'visible' : 'hidden' }}>
        {children}
      </div>
    </>
  );
}
