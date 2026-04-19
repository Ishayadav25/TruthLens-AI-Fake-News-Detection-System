import { useState, useEffect } from 'react';
import { Shield, LogOut, CheckCircle2, AlertCircle, Info, History, Search, Send, Loader2 } from 'lucide-react';
import { logOut } from '../lib/firebase';
import { verifyNews } from '../services/geminiService';
import { NewsVerificationResult, BaseUser } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

interface Props {
  user: BaseUser;
  onNavigate: (view: 'dashboard' | 'profile') => void;
}

export default function Dashboard({ user, onNavigate }: Props) {
  const [content, setContent] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [result, setResult] = useState<NewsVerificationResult | null>(null);

  const handleVerify = async () => {
    if (!content.trim() || isVerifying) return;
    
    setIsVerifying(true);
    setResult(null);
    try {
      const report = await verifyNews(content);
      setResult(report);
    } catch (error) {
      console.error('Verification failed:', error);
    } finally {
      setIsVerifying(false);
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
            className="w-full text-left py-3 px-4 text-[10px] font-bold text-white uppercase tracking-[0.2em] mb-4 hover:bg-white/5 transition-colors border-l-2 border-gold"
          >
            Intelligence Engine
          </button>
          
          <div className="px-5 py-4 bg-white/5 rounded-sm border border-white/5 text-white/50 text-xs leading-relaxed font-light mb-8">
            Gemini-powered linguistic analysis and cross-referencing protocol.
          </div>
          
          <div className="py-3 text-[10px] font-bold text-white/20 uppercase tracking-[0.2em] mb-4 mt-8">
            Identity Profile
          </div>
          <button 
            onClick={() => onNavigate('profile')}
            className="w-full flex items-center gap-4 py-3 px-3 hover:bg-white/5 transition-all group"
          >
             <img 
               src={user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`} 
               alt="Profile" 
               className="w-10 h-10 rounded-full border border-white/10 grayscale group-hover:grayscale-0 transition-all"
               referrerPolicy="no-referrer"
             />
             <div className="overflow-hidden text-left">
               <div className="font-medium text-xs tracking-wide truncate group-hover:text-gold transition-colors">{user.displayName || 'Operator'}</div>
               <div className="text-[10px] text-white/30 truncate uppercase">{user.email}</div>
             </div>
          </button>
        </nav>

        <div className="p-8">
          <button 
            onClick={() => logOut()}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 text-[10px] uppercase tracking-[0.2em] text-white/30 hover:text-white transition-colors border border-white/10 hover:border-white/20"
          >
            <LogOut className="w-3.5 h-3.5" />
            Terminate Session
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Header for mobile */}
        <header className="lg:hidden h-20 bg-bg-main border-b border-white/5 px-6 flex items-center justify-between sticky top-0 z-20">
          <button 
            onClick={() => onNavigate('profile')}
            className="flex items-center gap-3"
          >
             <img 
               src={user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`} 
               alt="Profile" 
               className="w-10 h-10 rounded-full border border-white/10 grayscale"
               referrerPolicy="no-referrer"
             />
             <div className="flex flex-col text-left">
               <span className="font-serif italic text-xs tracking-[0.2em] uppercase text-gold">TruthLens</span>
               <span className="text-[8px] text-white/20 uppercase tracking-[0.1em]">Identity Profile</span>
             </div>
          </button>
          <button onClick={() => logOut()} className="p-2 text-white/40">
            <LogOut className="w-5 h-5" />
          </button>
        </header>

        <div className="max-w-4xl mx-auto px-8 py-16 lg:py-24">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-16"
          >
             <div className="flex flex-col mb-4">
               <div className="w-12 h-[1px] bg-gold mb-6" />
               <h1 className="text-5xl font-light text-white tracking-tight font-serif italic mb-4">Content Verification</h1>
             </div>
             <p className="text-white/40 font-light tracking-wide uppercase text-[10px] letter-spacing-[0.2em]">High precision misinformation detection protocol</p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-12">
            {/* Input Area */}
            <div className="lg:col-span-2 space-y-8">
              <div className="space-y-4">
                <label className="block text-[10px] font-bold text-white/30 uppercase tracking-[0.3em] px-1">
                  Input Stream / News Article
                </label>
                <div className={cn(
                  "relative transition-all duration-500 bg-white/5 border border-white/5",
                  isVerifying ? "bg-white/[0.02] border-gold/20" : "focus-within:border-gold/40 focus-within:bg-white/[0.07]"
                )}>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Enter architectural news content for analysis..."
                    className="w-full h-80 p-8 bg-transparent resize-none outline-none text-white/90 leading-relaxed placeholder:text-white/10 text-sm font-light"
                    disabled={isVerifying}
                  />
                  
                  <div className="absolute bottom-6 right-8 text-[9px] text-white/10 uppercase tracking-[0.2em] font-mono">
                    {content.length} units
                  </div>
                </div>
              </div>

              <button
                onClick={handleVerify}
                disabled={!content.trim() || isVerifying}
                className={cn(
                  "w-full lg:w-auto px-10 py-5 flex items-center justify-center gap-4 font-bold text-[10px] uppercase tracking-[0.2em] transition-all",
                  !content.trim() || isVerifying 
                    ? "bg-white/5 text-white/20 cursor-not-allowed" 
                    : "bg-gold text-black hover:bg-gold/90 active:scale-[0.98] shadow-2xl shadow-gold/10"
                )}
              >
                {isVerifying ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Analyzing Protocol...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    Initialize Verification
                  </>
                )}
              </button>

              {/* Results Display */}
              <AnimatePresence>
                {result && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mt-20 bg-white/[0.03] border border-white/5 overflow-hidden"
                  >
                    <div className="px-10 py-12 flex flex-col md:flex-row gap-12 items-center md:items-start border-b border-white/5">
                      {/* Score Indicator */}
                      <div className="relative w-40 h-40 flex-shrink-0">
                        <svg className="w-full h-full transform -rotate-90">
                          <circle
                            cx="80"
                            cy="80"
                            r="76"
                            fill="none"
                            stroke="rgba(255,255,255,0.03)"
                            strokeWidth="1"
                          />
                          <motion.circle
                            cx="80"
                            cy="80"
                            r="76"
                            fill="none"
                            stroke={result.truthScore > 70 ? "#10b981" : result.truthScore > 40 ? "#c19a6b" : "#f43f5e"}
                            strokeWidth="2"
                            strokeDasharray={2 * Math.PI * 76}
                            initial={{ strokeDashoffset: 2 * Math.PI * 76 }}
                            animate={{ strokeDashoffset: 2 * Math.PI * 76 * (1 - result.truthScore / 100) }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            strokeLinecap="round"
                          />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-4xl font-extralight text-white font-serif">{result.truthScore}</span>
                          <span className="text-[9px] uppercase tracking-[0.3em] font-bold text-white/20 mt-1">Index</span>
                        </div>
                      </div>

                      <div className="flex-1 space-y-6">
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="text-[10px] uppercase tracking-[0.3em] text-white/30">Intelligence Verdict</span>
                          <span className={cn(
                            "px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] border",
                            result.verdict === 'True' || result.verdict === 'Mostly True' ? "text-emerald-400 border-emerald-400/20 bg-emerald-400/5" : 
                            result.verdict === 'Misleading' || result.verdict === 'False' ? "text-rose-400 border-rose-400/20 bg-rose-400/5" : "text-gold border-gold/20 bg-gold/5"
                          )}>
                            {result.verdict}
                          </span>
                        </div>
                        <h4 className="text-2xl font-light text-white leading-tight font-serif italic">
                          "{result.explanation}"
                        </h4>
                      </div>
                    </div>

                    <div className="p-10 space-y-8">
                      <div>
                        <h5 className="text-[10px] font-bold text-white/20 uppercase tracking-[0.3em] mb-6">
                          Core Analysis Points
                        </h5>
                        <ul className="space-y-4">
                          {result.keyPoints.map((point, i) => (
                            <motion.li 
                              key={i}
                              initial={{ opacity: 0, x: -5 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.1 * i }}
                              className="flex gap-4 text-white/60 text-xs leading-relaxed font-light"
                            >
                              <div className="mt-1.5 w-1 h-1 bg-gold flex-shrink-0" />
                              {point}
                            </motion.li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Support Information */}
            <div className="space-y-10">
              <div className="space-y-8 py-2">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-white/20 uppercase tracking-[0.3em] mb-8">System Manual</span>
                  
                  <div className="space-y-10">
                    <div className="flex gap-6">
                      <div className="text-gold font-serif italic text-xl">01</div>
                      <div>
                        <h5 className="text-xs font-bold text-white tracking-wider uppercase mb-2">Input ingestion</h5>
                        <p className="text-[11px] text-white/40 leading-relaxed font-light">Copy and paste any textual claim or architectural report.</p>
                      </div>
                    </div>
                    <div className="flex gap-6">
                      <div className="text-gold font-serif italic text-xl">02</div>
                      <div>
                        <h5 className="text-xs font-bold text-white tracking-wider uppercase mb-2">Pattern recognition</h5>
                        <p className="text-[11px] text-white/40 leading-relaxed font-light">Our engine identifies linguistic biases and logical fallacies.</p>
                      </div>
                    </div>
                    <div className="flex gap-6">
                      <div className="text-gold font-serif italic text-xl">03</div>
                      <div>
                        <h5 className="text-xs font-bold text-white tracking-wider uppercase mb-2">Verdict delivery</h5>
                        <p className="text-[11px] text-white/40 leading-relaxed font-light">Receive a quantified truth index and qualitative analysis.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 border border-white/5 p-8 relative group overflow-hidden">
                <Shield className="w-8 h-8 text-gold/40 mb-6 group-hover:text-gold transition-colors duration-500" />
                <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3 font-serif italic">Operational Advisory</h4>
                <p className="text-white/30 text-[11px] leading-relaxed font-light">
                  Always verify intelligence against primary archives. Machine logic serves as an advisory layer, not a final sovereign verdict.
                </p>
                {/* Decorative glow */}
                <div className="absolute -top-10 -right-10 w-24 h-24 bg-gold/5 rounded-full blur-2xl group-hover:bg-gold/10 transition-all duration-700" />
              </div>

              <div className="text-center pt-8">
                 <p className="text-[9px] uppercase tracking-[0.3em] text-white/10">Verification Protocol v3.1</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
