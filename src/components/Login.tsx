import { Shield } from 'lucide-react';
import { signInWithGoogle } from '../lib/firebase';
import { motion } from 'motion/react';
import { useState, FormEvent } from 'react';

interface Props {
  onLocalLogin: (user: any) => void;
}

export default function Login({ onLocalLogin }: Props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleLocalLogin = (e: FormEvent) => {
    e.preventDefault();
    if (username === 'isha' && password === '1234') {
      onLocalLogin({
        displayName: 'Isha',
        email: 'isha@truthguard.ai',
        photoURL: null,
        uid: 'isha-local-id'
      });
    } else {
      setError('Invalid system credentials.');
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-bg-main text-white selection:bg-gold/30 selection:text-white relative">
      {/* Left Pane - Branding */}
      <div className="hidden lg:flex flex-col justify-center px-20 bg-bg-main border-r border-white/5 relative overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10"
        >
          <div className="w-10 h-[1px] bg-gold mb-10" />
          
          <div className="flex items-center gap-2 mb-10">
            <span className="font-serif italic text-sm tracking-[0.3em] uppercase text-gold">TruthLens Systems</span>
          </div>

          <h1 className="font-serif text-[clamp(3rem,8vw,5.5rem)] font-light leading-[0.9] mb-10 tracking-[-0.04em]">
            The Art of<br />Verification.
          </h1>
          
          <p className="text-white/40 text-lg leading-relaxed max-w-md font-light">
            Dedicated to the pursuit of factual clarity. Analyze architectural misinformation with unparalleled precision.
          </p>
        </motion.div>
        
        {/* Subtle radial glow */}
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-white/[0.03] to-transparent rounded-full -mr-[300px] -mb-[300px] blur-3xl pointer-events-none" />
      </div>

      {/* Right Pane - Login Form */}
      <div className="flex flex-col justify-center px-8 sm:px-16 bg-bg-main overflow-y-auto py-20">
        <div className="max-w-sm w-full mx-auto">
          {/* Mobile Logo */}
          <div className="lg:hidden flex flex-col mb-16">
            <div className="w-8 h-[1px] bg-gold mb-4" />
            <span className="font-serif italic text-xs tracking-[0.2em] uppercase text-gold">TruthLens</span>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="mb-12">
              <div className="text-[10px] uppercase tracking-[0.2em] text-white/40 mb-2">Secure Gateway</div>
              <h3 className="text-3xl font-light text-white tracking-tight font-serif italic">Authenticate Access</h3>
            </div>

            <form onSubmit={handleLocalLogin} className="space-y-8 mb-12">
              <div className="space-y-6">
                <div>
                  <label className="text-[10px] uppercase tracking-[0.2em] text-white/40 block mb-2">Digital Identity</label>
                  <input 
                    type="text" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-transparent border-b border-white/10 py-3 text-sm outline-none focus:border-gold transition-colors text-white hover:border-white/20"
                    placeholder="Enter Username"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-[0.2em] text-white/40 block mb-2">Security Key</label>
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-transparent border-b border-white/10 py-3 text-sm outline-none focus:border-gold transition-colors text-white hover:border-white/20"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {error && (
                <div className="text-[10px] uppercase tracking-widest text-rose-500 font-bold">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="w-full h-14 bg-gold text-black hover:bg-gold/90 transition-all duration-300 font-bold text-xs uppercase tracking-[0.15em] shadow-xl shadow-gold/5 active:scale-[0.98]"
              >
                Authenticate Protocol
              </button>
            </form>

            <div className="relative flex items-center justify-center mb-10">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/5"></div>
              </div>
              <span className="relative px-4 text-[9px] uppercase tracking-[0.3em] text-white/20 bg-bg-main">Alternative Identity</span>
            </div>

            <div className="space-y-6">
              <button
                onClick={handleGoogleLogin}
                className="w-full h-14 flex items-center justify-center gap-4 bg-white/5 text-white/60 hover:bg-white/10 hover:text-white transition-all duration-300 font-bold text-xs uppercase tracking-[0.15em] border border-white/10"
              >
                <img 
                  src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/layout/google.svg" 
                  alt="Google" 
                  className="w-4 h-4 grayscale opacity-50" 
                  referrerPolicy="no-referrer"
                />
                Google Infrastructure
              </button>
              
              <div className="flex justify-between items-center pt-8 border-t border-white/5">
                <a href="#" className="text-[10px] uppercase tracking-[0.1em] text-white/30 hover:text-gold transition-colors border-b border-transparent hover:border-gold pb-0.5">
                  Request Access
                </a>
                <a href="#" className="text-[10px] uppercase tracking-[0.1em] text-white/30 hover:text-gold transition-colors border-b border-transparent hover:border-gold pb-0.5">
                  Privacy Protocol
                </a>
              </div>
            </div>
          </motion.div>

          <footer className="mt-20 lg:absolute lg:bottom-10 lg:right-10 flex lg:block justify-center">
            <p className="text-[9px] uppercase tracking-[0.2em] text-white/10">
              © 2026 TruthLens AI. Systems Priority Verified.
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}
