import { useState, FormEvent } from 'react';
import { User, updateProfile } from 'firebase/auth';
import { Shield, Camera, Mail, User as UserIcon, Save, ArrowLeft, LogOut, CheckCircle, Settings, History } from 'lucide-react';
import { logOut, auth } from '../lib/firebase';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { BaseUser } from '../types';

interface Props {
  user: BaseUser;
  onNavigate: (view: 'dashboard' | 'profile') => void;
}

export default function Profile({ user, onNavigate }: Props) {
  const [displayName, setDisplayName] = useState(user.displayName || '');
  const [photoURL, setPhotoURL] = useState(user.photoURL || '');
  const [isUpdating, setIsUpdating] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleUpdate = async (e: FormEvent) => {
    e.preventDefault();
    if (isUpdating) return;
    
    setIsUpdating(true);
    setSuccessMessage('');
    try {
      if (auth.currentUser && user.uid === auth.currentUser.uid) {
        await updateProfile(auth.currentUser, {
          displayName,
          photoURL
        });
        setSuccessMessage('Operational identity updated successfully.');
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        // Handle local user "update"
        setSuccessMessage('Local session identity updated (Demo Mode).');
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    } catch (error) {
      console.error('Update failed:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-main text-white flex font-sans selection:bg-gold/30">
      {/* Sidebar */}
      <aside className="w-72 bg-bg-main border-r border-white/5 flex flex-col hidden lg:flex">
        <div className="p-10 flex flex-col">
          <div className="w-8 h-[1px] bg-gold mb-6" />
          <span className="font-serif italic text-sm tracking-[0.2em] uppercase text-gold">TruthLens</span>
        </div>

        <nav className="flex-1 px-8 space-y-1">
          <button 
            onClick={() => onNavigate('dashboard')}
            className="w-full text-left py-3 px-4 text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] mb-4 hover:bg-white/5 transition-colors"
          >
            Intelligence Engine
          </button>
          
          <div className="py-3 text-[10px] font-bold text-white uppercase tracking-[0.2em] mb-4 mt-8 border-l-2 border-gold pl-4">
            Identity Profile
          </div>
          <div className="flex items-center gap-4 py-3 px-3 grayscale">
             <img 
               src={user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`} 
               alt="Profile" 
               className="w-10 h-10 rounded-full border border-white/10"
               referrerPolicy="no-referrer"
             />
             <div className="overflow-hidden">
               <div className="font-medium text-xs tracking-wide truncate">{user.displayName || 'Operator'}</div>
               <div className="text-[10px] text-white/30 truncate uppercase">{user.email}</div>
             </div>
          </div>
        </nav>

        <div className="p-8">
          <button 
            onClick={() => logOut()}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 text-[10px] uppercase tracking-[0.2em] text-white/30 hover:text-white transition-colors border border-white/10"
          >
            <LogOut className="w-3.5 h-3.5" />
            Terminate Session
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="lg:hidden h-16 bg-bg-main border-b border-white/5 px-6 flex items-center justify-between sticky top-0 z-20">
          <button onClick={() => onNavigate('dashboard')} className="flex items-center gap-2 text-white/60">
            <ArrowLeft className="w-5 h-5" />
            <span className="text-xs uppercase tracking-widest">Back</span>
          </button>
          <span className="font-serif italic text-xs tracking-[0.2em] uppercase text-gold">Profile</span>
        </header>

        <div className="max-w-4xl mx-auto px-8 py-16 lg:py-24">
          <div className="mb-16 flex justify-between items-end">
             <motion.div 
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
             >
               <div className="w-12 h-[1px] bg-gold mb-6" />
               <h1 className="text-5xl font-light text-white tracking-tight font-serif italic mb-4">Identity Profile</h1>
               <p className="text-white/40 font-light tracking-wide uppercase text-[10px] letter-spacing-[0.2em]">Manage operational credentials and preferences</p>
             </motion.div>
             <button 
               onClick={() => onNavigate('dashboard')}
               className="hidden lg:flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-white/40 hover:text-white transition-colors border border-white/10 px-4 py-2"
             >
               <ArrowLeft className="w-3 h-3" />
               Return to Analysis
             </button>
          </div>

          <div className="grid lg:grid-cols-3 gap-16">
            <div className="lg:col-span-2 space-y-16">
              {/* Personal Information */}
              <section className="space-y-8">
                <div className="flex items-center gap-3">
                  <UserIcon className="w-4 h-4 text-gold" />
                  <h2 className="text-[10px] font-bold text-white/30 uppercase tracking-[0.3em]">Personal Credentials</h2>
                </div>

                <form onSubmit={handleUpdate} className="space-y-10">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-[9px] uppercase tracking-[0.2em] text-white/20">Display Name</label>
                      <input 
                        type="text"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        className="w-full bg-white/5 border-b border-white/10 py-3 text-sm outline-none focus:border-gold transition-colors text-white/80"
                        placeholder="Operator Name"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[9px] uppercase tracking-[0.2em] text-white/20">Identified Email</label>
                      <div className="flex items-center gap-3 py-3 border-b border-white/5 text-white/30 text-sm">
                        <Mail className="w-3.5 h-3.5" />
                        {user.email}
                        {user.emailVerified && <CheckCircle className="w-3 h-3 text-emerald-500" />}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[9px] uppercase tracking-[0.2em] text-white/20">Avatar Protocol (URL)</label>
                    <div className="flex gap-6 items-center">
                      <img 
                        src={photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`} 
                        alt="Preview" 
                        className="w-16 h-16 rounded-full border border-white/10 grayscale"
                      />
                      <input 
                        type="text"
                        value={photoURL}
                        onChange={(e) => setPhotoURL(e.target.value)}
                        className="flex-1 bg-white/5 border-b border-white/10 py-3 text-sm outline-none focus:border-gold transition-colors text-white/80"
                        placeholder="https://image-cloud.com/avatar.jpg"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <button 
                      type="submit"
                      disabled={isUpdating}
                      className="bg-gold text-black px-10 py-4 font-bold text-[10px] uppercase tracking-[0.2em] hover:bg-gold/90 transition-all disabled:opacity-50"
                    >
                      {isUpdating ? 'Synchronizing...' : 'Save Configuration'}
                    </button>
                    {successMessage && (
                      <span className="text-[10px] uppercase tracking-widest text-emerald-400 font-bold animate-pulse">
                        {successMessage}
                      </span>
                    )}
                  </div>
                </form>
              </section>

              {/* Activity Summary */}
              <section className="space-y-8">
                <div className="flex items-center gap-3">
                  <History className="w-4 h-4 text-gold" />
                  <h2 className="text-[10px] font-bold text-white/30 uppercase tracking-[0.3em]">Operational History</h2>
                </div>

                <div className="bg-white/[0.02] border border-white/5 p-8 space-y-6">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-white/40 font-light italic">Recent Verification Protocol</span>
                    <span className="text-[9px] text-white/20 tracking-widest">Awaited logs...</span>
                  </div>
                  <div className="h-[1px] bg-white/5" />
                  <div className="text-[11px] text-white/30 leading-relaxed italic">
                    Authentication successful. Current session initialized in Intelligence Layer 3. No critical errors detected in pre-flight checks.
                  </div>
                </div>
              </section>
            </div>

            {/* Side Preferences */}
            <div className="space-y-12">
              <section className="space-y-6">
                <div className="flex items-center gap-3">
                  <Settings className="w-4 h-4 text-gold" />
                  <h2 className="text-[10px] font-bold text-white/30 uppercase tracking-[0.3em]">System Preferences</h2>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between py-4 border-b border-white/5 opacity-50 cursor-not-allowed">
                    <div className="flex flex-col">
                      <span className="text-xs text-white/80">Linguistic Bias Filter</span>
                      <span className="text-[9px] uppercase tracking-widest text-white/20">Optimized by Gemini</span>
                    </div>
                    <div className="w-10 h-5 bg-gold/20 rounded-full relative">
                      <div className="absolute right-1 top-1 w-3 h-3 bg-gold/50 rounded-full" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between py-4 border-b border-white/5 grayscale">
                    <div className="flex flex-col">
                      <span className="text-xs text-white/80">Historical Logging</span>
                      <span className="text-[9px] uppercase tracking-widest text-white/20">Cloud Synchronized</span>
                    </div>
                    <div className="w-10 h-5 bg-white/10 rounded-full relative">
                      <div className="absolute left-1 top-1 w-3 h-3 bg-white/40 rounded-full" />
                    </div>
                  </div>
                </div>
              </section>

              <div className="bg-white/5 border border-white/5 p-8 relative group overflow-hidden">
                <Shield className="w-8 h-8 text-gold/40 mb-6" />
                <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3 font-serif italic">Identity Sovereign</h4>
                <p className="text-white/30 text-[11px] leading-relaxed font-light">
                  Your identity data is encrypted and managed via Firebase Core protocols. TruthLens does not leak credentials to unverified sub-layers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
