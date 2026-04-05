import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axiosConfig';

export default function Register() {
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [emailError, setEmailError] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register, login, user } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  // Strict RFC 5322 Regex 
  const validateEmail = (inputEmail) => {
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (!inputEmail) {
      setEmailError('');
      return false;
    }
    if (!emailRegex.test(inputEmail)) {
      setEmailError('Please enter a valid email format (e.g., you@domain.com)');
      return false;
    }
    setEmailError('');
    return true;
  };

  const handleEmailChange = (e) => {
    const val = e.target.value;
    setEmail(val);
    validateEmail(val);
  };

  const calculateStrength = (pass) => {
    let strength = 0;
    if (pass.length > 0) strength += 1;
    if (pass.length > 7) strength += 1;
    if (/[A-Z]/.test(pass) && /[0-9]/.test(pass)) strength += 1;
    if (/[^A-Za-z0-9]/.test(pass)) strength += 1;
    return Math.min(4, strength); // 0 to 4
  };

  const handlePasswordChange = (e) => {
    const val = e.target.value;
    setPassword(val);
    setPasswordStrength(calculateStrength(val));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return setError("Passwords do not match.");
    }
    if (!validateEmail(email)) {
      return setError("Please fix the email format before registering.");
    }
    if (!termsAccepted) {
      return setError("You must accept the Terms and Conditions.");
    }
    try {
      await register(fullName, username, email, password);
      await login(username, password);
      // Wait for AuthContext to update the user state and handle navigation via useEffect
    } catch (err) {
      setError(err.response?.data || 'An error occurred. Please try a different username.');
    }
  };

  return (
    <div 
      className="min-h-screen relative flex items-center justify-center bg-cover bg-center bg-fixed text-slate-800 dark:text-slate-100 py-12"
      style={{ backgroundImage: "url('/library_study_bg.png')" }}
    >
      <div className="absolute inset-0 bg-slate-50 dark:bg-[#0f172a]/80 backdrop-blur-[5px] z-0"></div>
      
      {/* Decorative Orbs */}
      <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-indigo-600/20 rounded-full mix-blend-screen filter blur-[80px] animate-pulse z-0 delay-500"></div>
      <div className="absolute bottom-1/3 left-1/4 w-72 h-72 bg-indigo-600/20 rounded-full mix-blend-screen filter blur-[80px] animate-pulse z-0" style={{animationDelay: '1.5s'}}></div>
      
      <div className="relative z-10 w-full max-w-md p-8 sm:p-10 bg-slate-50 dark:bg-[#0f172a]/70 backdrop-blur-3xl rounded-[2.5rem] border border-slate-300 dark:border-slate-700/30 shadow-[0_10px_50px_rgba(0,0,0,0.6)]">
        <div className="text-center mb-10 relative mt-4">
          <Link to="/" className="absolute left-0 top-0 p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white transition bg-white dark:bg-slate-800/60 rounded-full border border-slate-300 dark:border-slate-700/50/50">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          </Link>
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center shadow-md shadow-indigo-500/10">
              <svg className="w-10 h-10 text-slate-900 dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
            </div>
          </div>
          <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-indigo-400 drop-shadow-sm tracking-tight">Create Account</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Join the Smart Study Planner ecosystem.</p>
        </div>
        
        {error && <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-4 rounded-xl mb-6 text-sm text-center font-medium animate-pulse shadow-inner">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-bold mb-2 text-slate-600 dark:text-slate-300 tracking-wide">FULL NAME</label>
            <input 
              type="text" 
              className="w-full bg-white dark:bg-slate-800/60 border border-slate-300 dark:border-slate-700/50 rounded-2xl px-5 py-4 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/80 transition-all shadow-inner placeholder-slate-500 font-medium"
              placeholder="Your full name"
              value={fullName} onChange={(e) => setFullName(e.target.value)} required 
            />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2 text-slate-600 dark:text-slate-300 tracking-wide">USERNAME</label>
            <input 
              type="text" 
              className="w-full bg-white dark:bg-slate-800/60 border border-slate-300 dark:border-slate-700/50 rounded-2xl px-5 py-4 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/80 transition-all shadow-inner placeholder-slate-500 font-medium"
              placeholder="Choose a username"
              value={username} onChange={(e) => setUsername(e.target.value)} required 
            />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2 text-slate-600 dark:text-slate-300 tracking-wide">EMAIL ADDRESS</label>
            <input 
              type="email" 
              className={`w-full bg-white dark:bg-slate-800/60 border ${emailError ? 'border-red-500 focus:ring-red-500/80' : 'border-slate-300 dark:border-slate-700/50 focus:ring-indigo-500/80'} rounded-2xl px-5 py-4 text-slate-900 dark:text-white focus:outline-none focus:ring-2 transition-all shadow-inner placeholder-slate-500 font-medium`}
              placeholder="you@example.com"
              value={email} onChange={handleEmailChange} required 
            />
            {emailError && <p className="text-red-500 text-xs font-bold mt-2 px-2 animate-pulse">{emailError}</p>}
          </div>
          <div>
            <label className="block text-sm font-bold mb-2 text-slate-600 dark:text-slate-300 tracking-wide">PASSWORD</label>
            <input 
              type="password" 
              className="w-full bg-white dark:bg-slate-800/60 border border-slate-300 dark:border-slate-700/50 rounded-2xl px-5 py-4 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/80 transition-all shadow-inner placeholder-slate-500 font-medium mb-2"
              placeholder="••••••••"
              value={password} onChange={handlePasswordChange} required 
            />
            
            {password.length > 0 && (
              <div className="flex flex-col gap-1 px-1">
                <div className="flex gap-1 h-1.5 w-full bg-white dark:bg-slate-800/60 rounded-full overflow-hidden">
                  {[...Array(4)].map((_, i) => (
                    <div 
                      key={i} 
                      className={`h-full flex-1 transition-colors duration-300 ${i < passwordStrength ? ['bg-red-500', 'bg-orange-500', 'bg-yellow-400', 'bg-teal-500'][passwordStrength - 1] : 'bg-transparent'}`}
                    ></div>
                  ))}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 text-right mt-1 font-medium">
                  {passwordStrength === 1 && <span className="text-red-400">Weak</span>}
                  {passwordStrength === 2 && <span className="text-orange-400">Fair</span>}
                  {passwordStrength === 3 && <span className="text-yellow-400">Good</span>}
                  {passwordStrength === 4 && <span className="text-teal-400">Strong</span>}
                </div>
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-bold mb-2 text-slate-600 dark:text-slate-300 tracking-wide">CONFIRM PASSWORD</label>
            <input 
              type="password" 
              className="w-full bg-white dark:bg-slate-800/60 border border-slate-300 dark:border-slate-700/50 rounded-2xl px-5 py-4 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/80 transition-all shadow-inner placeholder-slate-500 font-medium"
              placeholder="••••••••"
              value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required 
            />
          </div>

          <div className="flex items-center mt-2">
            <label className="flex items-start cursor-pointer group">
              <input 
                type="checkbox" 
                className="form-checkbox mt-1 h-4 w-4 text-indigo-500 rounded border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800/60 focus:ring-indigo-500/50 transition duration-150 ease-in-out cursor-pointer"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
              />
              <span className="ml-3 text-sm text-slate-500 dark:text-slate-400 font-medium select-none group-hover:text-slate-600 dark:text-slate-300 transition-colors">
                I agree to the <a href="#" className="text-indigo-400 hover:text-purple-300 transition-colors">Terms of Service</a> and <a href="#" className="text-indigo-400 hover:text-purple-300 transition-colors">Privacy Policy</a>
              </span>
            </label>
          </div>

          <button type="submit" className="w-full mt-6 bg-gradient-to-r from-indigo-600 to-indigo-600 hover:from-indigo-500 hover:to-indigo-500 text-slate-900 dark:text-white font-extrabold text-lg py-4 rounded-2xl transition-all shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:shadow-[0_0_30px_rgba(236,72,153,0.5)] hover:-translate-y-1 transform duration-300 border border-indigo-400/30">
            Sign Up Now
          </button>
        </form>
        
        <div className="mt-8 text-center text-slate-500 dark:text-slate-400 font-medium">
          Already have an account? <Link to="/login" className="text-indigo-400 hover:text-purple-300 font-bold transition ml-1 underline underline-offset-4 decoration-indigo-500/50">Log in</Link>
        </div>
      </div>
    </div>
  );
}
