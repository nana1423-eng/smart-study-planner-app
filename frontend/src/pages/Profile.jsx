import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  
  // Edit Form State
  const [formData, setFormData] = useState({
    preferences: '',
    preferredTime: '',
    dailyHours: ''
  });
  
  const [saveStatus, setSaveStatus] = useState('');

  // Fetch the definitive profile from the backend database!
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/user/profile');
        setProfileData(res.data);
        setFormData({
            preferences: res.data.preferences || '',
            preferredTime: res.data.preferredTime || '',
            dailyHours: res.data.dailyHours || ''
        });
      } catch (err) {
        console.error("Failed to load profile", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaveStatus('Saving...');
    try {
      const res = await api.put('/user/profile', formData);
      setProfileData(res.data);
      setIsEditing(false);
      setSaveStatus('Success!');
      setTimeout(() => setSaveStatus(''), 2000);
    } catch(err) {
       console.error("Save error", err);
       setSaveStatus('Error saving profile');
    }
  };

  if (isLoading) {
      return (
          <div className="h-full flex items-center justify-center text-slate-500 font-bold">
              Fetching Profile Securely...
          </div>
      );
  }

  // Derived Display Values
  const displayName = user?.username || user?.email?.split('@')[0] || "User";
  const avatarLetter = displayName.charAt(0).toUpperCase();

  return (
    <div className="p-4 sm:p-8 text-slate-800 dark:text-slate-100 h-full flex flex-col items-center mt-2 sm:mt-6">
      <div className="max-w-4xl mx-auto w-full space-y-6 sm:space-y-8">
        
        {/* Top Header Card */}
        <div className="bg-white dark:bg-slate-800/40 p-6 sm:p-10 rounded-[2rem] sm:rounded-[2.5rem] shadow-sm border border-slate-300 dark:border-slate-700/50 flex flex-col sm:flex-row gap-6 sm:gap-8 justify-between items-center relative overflow-hidden transition duration-500">
          
          <div className="flex items-center gap-4 sm:gap-6 relative z-10 w-full sm:w-auto overflow-hidden">
            <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-indigo-500 to-emerald-400 p-1 shadow-sm shrink-0">
              <div className="w-full h-full bg-white dark:bg-slate-800/40 rounded-full flex items-center justify-center text-2xl sm:text-4xl font-black text-slate-900 dark:text-white uppercase">
                {avatarLetter}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight mb-1 sm:mb-2 truncate text-center sm:text-left">
                {displayName}
              </h1>
              <p className="text-slate-500 dark:text-slate-400 font-bold tracking-widest uppercase text-[10px] sm:text-sm truncate text-center sm:text-left">
                @{user?.username} • {user?.email}
              </p>
            </div>
          </div>
          
          <button onClick={handleLogout} className="w-full sm:w-auto bg-rose-50 border border-rose-200 hover:bg-rose-600 hover:text-white text-rose-600 font-black uppercase tracking-widest px-8 py-3 sm:py-4 rounded-xl transition-all shadow-sm shrink-0">
            Logout
          </button>
        </div>

        {/* Extended Details Form Module */}
        <div className="bg-white dark:bg-slate-800/40 p-6 sm:p-10 rounded-[2rem] sm:rounded-[2.5rem] shadow-sm border border-slate-300 dark:border-slate-700/50 transition duration-500">
           <div className="flex justify-between items-center mb-8 border-b border-slate-200 dark:border-slate-700/50 pb-4">
               <h3 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">Profile Settings</h3>
               {!isEditing && (
                 <button onClick={() => setIsEditing(true)} className="text-indigo-600 dark:text-indigo-400 hover:opacity-75 font-bold transition flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                    Edit Profile
                 </button>
               )}
           </div>

           {isEditing ? (
               <form onSubmit={handleSave} className="space-y-6">
                  <div>
                      <label className="block text-sm font-bold mb-2 tracking-wide text-slate-600 dark:text-slate-400">STUDY PREFERENCES / SUBJECTS</label>
                      <input 
                         type="text" 
                         value={formData.preferences} 
                         onChange={(e) => setFormData({...formData, preferences: e.target.value})}
                         className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-2xl px-5 py-4 font-bold shadow-inner focus:outline-none focus:ring-2 focus:ring-indigo-500"
                         placeholder="e.g. Mathematics, English, Software Engineering"
                      />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                          <label className="block text-sm font-bold mb-2 tracking-wide text-slate-600 dark:text-slate-400">OPTIMAL STUDY TIME</label>
                          <select 
                            value={formData.preferredTime}
                            onChange={(e) => setFormData({...formData, preferredTime: e.target.value})}
                            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-2xl px-5 py-4 font-bold shadow-inner focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          >
                             <option value="" disabled>Select phase</option>
                             <option value="Morning">Morning</option>
                             <option value="Afternoon">Afternoon</option>
                             <option value="Night">Night (Owl)</option>
                          </select>
                      </div>
                      <div>
                          <label className="block text-sm font-bold mb-2 tracking-wide text-slate-600 dark:text-slate-400">TARGET DAILY HOURS</label>
                          <input 
                             type="number" 
                             min="1" max="16"
                             value={formData.dailyHours} 
                             onChange={(e) => setFormData({...formData, dailyHours: e.target.value})}
                             className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-2xl px-5 py-4 font-bold shadow-inner focus:outline-none focus:ring-2 focus:ring-indigo-500"
                             placeholder="Hours per day"
                          />
                      </div>
                  </div>

                  <div className="flex gap-4 pt-4">
                     <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-black px-8 py-4 rounded-xl shadow-md transition-all">
                        Save Changes
                     </button>
                     <button type="button" onClick={() => setIsEditing(false)} className="bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-black px-8 py-4 rounded-xl hover:opacity-80 transition-all">
                        Cancel
                     </button>
                     {saveStatus && <span className="flex items-center ml-2 text-emerald-500 font-bold animate-pulse">{saveStatus}</span>}
                  </div>
               </form>
           ) : (
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-slate-50 dark:bg-slate-800/80 p-6 rounded-2xl border border-slate-200 dark:border-slate-700">
                      <p className="text-[10px] font-black tracking-widest text-slate-400 mb-1 uppercase">Username</p>
                      <p className="text-xl font-bold text-slate-900 dark:text-white">@{user?.username || <span className="italic text-slate-400">Not provided</span>}</p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800/80 p-6 rounded-2xl border border-slate-200 dark:border-slate-700">
                      <p className="text-[10px] font-black tracking-widest text-slate-400 mb-1 uppercase">Preferred Subjects</p>
                      <p className="text-xl font-bold text-slate-900 dark:text-white">{profileData?.preferences || <span className="italic text-slate-400">Not selected</span>}</p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800/80 p-6 rounded-2xl border border-slate-200 dark:border-slate-700">
                      <p className="text-[10px] font-black tracking-widest text-slate-400 mb-1 uppercase">Peak Study Focus</p>
                      <p className="text-xl font-bold text-slate-900 dark:text-white">{profileData?.preferredTime || <span className="italic text-slate-400">Not selected</span>}</p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800/80 p-6 rounded-2xl border border-slate-200 dark:border-slate-700">
                      <p className="text-[10px] font-black tracking-widest text-slate-400 mb-1 uppercase">Daily Target</p>
                      <p className="text-xl font-bold text-slate-900 dark:text-white">
                         {profileData?.dailyHours ? `${profileData.dailyHours} Hours` : <span className="italic text-slate-400">Not set</span>}
                      </p>
                  </div>
               </div>
           )}
        </div>

      </div>
    </div>
  );
}
