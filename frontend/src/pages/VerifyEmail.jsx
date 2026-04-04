import React, { useState } from 'react';
import { useNavigate, Navigate, useLocation } from 'react-router-dom';
import api from '../api/axiosConfig';
import { useAuth } from '../context/AuthContext';

export default function VerifyOTP() {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, logout, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Email can come from the logged-in user OR from registration state (new users aren't logged in yet)
  const email = user?.email || location.state?.email;

  // If already verified, bounce to dashboard
  if (user?.emailVerified) {
      return <Navigate to="/dashboard" replace />;
  }

  // If no email is available at all, send to register
  if (!email) {
      return <Navigate to="/register" replace />;
  }

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;
    
    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

    if (element.nextSibling && element.value !== '') {
        element.nextSibling.focus();
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length < 6) {
        setError("Please enter the full 6-digit code.");
        return;
    }
    setError('');
    setIsSubmitting(true);
    
    try {
        await api.post('/auth/verify-email', { email: email, otp: code });
        setSuccess("Success! Your email is verified.");
        
        // We technically need to refresh the JWT token so user.isEmailVerified goes true.
        // We will just instantly logout & ask them to fully login, or hot-swap context.
        setTimeout(() => {
            logout();
            navigate('/login', { state: { message: "Account verified securely! Please log in." }});
        }, 1500);

    } catch (err) {
        setError(err.response?.data || 'Invalid or expired OTP. Please try again.');
        setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-slate-50 dark:bg-[#0f172a] text-slate-800 dark:text-slate-100 py-12 px-4 sm:px-6 lg:px-8 font-sans selection:bg-indigo-900/30">
      
      {/* Decorative Orbs */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full mix-blend-screen filter blur-[100px] animate-pulse z-0"></div>
      
      <div className="relative z-10 max-w-lg w-full bg-white dark:bg-[#1e293b]/70 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-slate-700/50 p-10">
        <div className="text-center mb-8">
            <div className="mx-auto w-20 h-20 bg-indigo-50 dark:bg-indigo-500/10 rounded-full flex items-center justify-center mb-4 border border-indigo-100 dark:border-indigo-500/20 shadow-inner">
               <svg className="w-10 h-10 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
            </div>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Verify Your Email</h2>
            <p className="mt-3 text-slate-500 dark:text-slate-400 font-medium">
               We sent a 6-digit confirmation code to <span className="text-indigo-500 dark:text-indigo-400 font-bold">{email}</span>. Please enter it below to unlock your dashboard.
            </p>
        </div>

        {error && <div className="bg-rose-500/10 border border-rose-500/30 text-rose-500 px-4 py-3 rounded-xl mb-6 text-sm text-center font-bold">{error}</div>}
        {success && <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 px-4 py-3 rounded-xl mb-6 text-sm text-center font-bold animate-pulse">{success}</div>}

        <form onSubmit={handleVerify}>
            <div className="flex justify-between gap-2 sm:gap-4 mb-8">
                {otp.map((data, index) => {
                    return (
                        <input
                            className="w-10 h-14 sm:w-14 sm:h-16 bg-slate-50 dark:bg-[#0f172a]/60 border border-slate-300 dark:border-slate-700/50 rounded-xl sm:rounded-2xl text-center text-xl sm:text-2xl font-black text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all shadow-inner"
                            type="text"
                            name="otp"
                            maxLength="1"
                            key={index}
                            value={data}
                            onChange={e => handleChange(e.target, index)}
                            onFocus={e => e.target.select()}
                        />
                    );
                })}
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-indigo-600 to-indigo-600 hover:from-indigo-500 hover:to-indigo-500 text-white font-extrabold text-lg py-4 rounded-2xl transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_30px_rgba(79,70,229,0.5)] transform hover:-translate-y-1 disabled:opacity-50 disabled:hover:translate-y-0"
            >
                {isSubmitting ? 'Verifying Context...' : 'Verify Email Address'}
            </button>
        </form>
        
        <div className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400 font-medium">
            <button onClick={logout} className="text-indigo-500 hover:text-indigo-400 font-bold underline underline-offset-4 decoration-indigo-500/30 transition">Sign in with a different account</button>
        </div>
      </div>
    </div>
  );
}
