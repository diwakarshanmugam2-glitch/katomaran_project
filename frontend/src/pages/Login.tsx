import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';
import { Mail, Lock, AlertCircle, ArrowRight, Infinity as InfinityIcon } from 'lucide-react';

export const Login: React.FC = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Please fill in all fields');
      return;
    }
    setErrorMsg('');
    setLoading(true);

    try {
      const data = await api.post('/auth/login', { email, password });
      login(data);
      navigate('/dashboard');
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen relative flex flex-col items-center justify-center p-4 overflow-hidden"
    >
      {/* Moving Multi-Colored Balls Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="anim-ball red-ball ball-1"></div>
        <div className="anim-ball blue-ball ball-2"></div>
        <div className="anim-ball green-ball ball-3"></div>
        <div className="anim-ball purple-ball ball-4"></div>
        <div className="anim-ball yellow-ball ball-5"></div>
        <div className="anim-ball blue-ball ball-6"></div>
        <div className="anim-ball purple-ball ball-7"></div>
        <div className="anim-ball red-ball ball-8"></div>
        <div className="anim-ball cyan-ball ball-9"></div>
        <div className="anim-ball pink-ball ball-10"></div>
        <div className="anim-ball orange-ball ball-11"></div>
        <div className="anim-ball lime-ball ball-12"></div>
        <div className="anim-ball pink-ball ball-13"></div>
        <div className="anim-ball yellow-ball ball-14"></div>
        <div className="anim-ball green-ball ball-15"></div>
        <div className="anim-ball cyan-ball ball-16"></div>
      </div>
      
      {/* Full Background Glassy Overlay */}
      <div className="absolute inset-0 z-0 bg-white/30 backdrop-blur-[80px] pointer-events-none" />



      {/* Welcome Content Above Box */}
      <div className="text-center mb-8 relative z-10 max-w-lg px-4 flex flex-col items-center">
        <Link to="/" className="flex items-center gap-3 mb-6 group">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-pink to-brand-cyan shadow-lg hover:scale-105 transition-transform">
            <InfinityIcon className="h-8 w-8 text-bg-dark drop-shadow-sm" />
          </div>
          <span className="font-heading text-4xl font-extrabold tracking-tight text-slate-900 disco-text drop-shadow-sm">
            NexusLink
          </span>
        </Link>
        <h2 className="font-heading text-4xl font-extrabold text-slate-900 mb-4 drop-shadow-md">Welcome Back! 👋</h2>
        <p className="text-base font-bold text-slate-700 leading-relaxed drop-shadow-sm bg-white/40 px-6 py-3 rounded-2xl">
          Log in to manage your intelligent links, track real-time analytics, and scale your digital presence with NexusLink.
        </p>
      </div>

      <div className="glass-premium w-full max-w-md p-10 relative z-10">
        <div className="text-center mb-6">
          <h2 className="font-heading text-2xl font-extrabold text-slate-800 mb-2">Access Portal</h2>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Enter Credentials</p>
        </div>

        {errorMsg && (
          <div className="flex items-center gap-2 rounded-xl bg-rose-500/10 border border-brand-pink/30 p-3.5 mb-6 text-rose-500 text-xs font-bold shadow-inner text-left">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 relative z-20">
          <div className="space-y-2 text-left">
            <label className="text-xs font-extrabold text-blue-500 uppercase tracking-wider">Email Designation</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500 h-5 w-5" />
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 rounded-xl glass-input text-sm font-medium"
              />
            </div>
          </div>

          <div className="space-y-2 text-left">
            <label className="text-xs font-extrabold text-rose-500 uppercase tracking-wider">Security Key</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-rose-500 h-5 w-5" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 rounded-xl glass-input text-sm font-medium"
              />
            </div>
          </div>

          <div className="flex justify-end mt-1 mb-4">
            <Link to="/forgot-password" className="text-[11px] font-bold text-slate-500 hover:text-blue-500 transition-colors">
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-disco w-full rounded-xl py-4 text-sm shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 mt-8 uppercase tracking-widest"
          >
            {loading ? 'Authenticating...' : 'Initialize Link'}
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <div className="mt-8 pt-6 text-center text-xs font-bold text-slate-500">
          Unregistered Entity?{' '}
          <Link to="/register" className="text-brand-yellow hover:text-slate-800 transition-colors underline decoration-brand-yellow underline-offset-4">
            Request Access
          </Link>
        </div>
      </div>
    </div>
  );
};
