import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';
import { Link2, User, Mail, Lock, AlertCircle, ArrowRight, Infinity as InfinityIcon } from 'lucide-react';
import { motion } from 'framer-motion';

export const Register: React.FC = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
      setErrorMsg('Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match');
      return;
    }

    setErrorMsg('');
    setLoading(true);

    try {
      const data = await api.post('/auth/register', { name, email, password });
      login(data);
      navigate('/dashboard');
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Registration failed. Email may already be registered.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center p-4 overflow-hidden">
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

      {/* Header Logo */}
      <Link to="/" className="flex items-center gap-2 mb-8 group z-10">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-purple to-brand-cyan shadow-sm">
            <InfinityIcon className="h-6 w-6 text-slate-800" />
          </div>
        <span className="font-heading text-xl font-bold tracking-tight text-slate-800">
          NexusLink
        </span>
      </Link>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-premium w-full max-w-md p-8 relative z-10"
      >
        <div className="text-center mb-8">
          <h2 className="font-heading text-2xl font-bold text-slate-800 mb-2">Create Account</h2>
          <p className="text-sm text-slate-500">Join NexusLink for full access</p>
        </div>

        {/* Error message */}
        {errorMsg && (
          <div className="flex items-center gap-2 rounded-xl bg-rose-500/10 border border-brand-pink/20 p-3.5 mb-6 text-rose-500 text-xs text-left">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div className="space-y-1.5 text-left">
            <label className="text-xs font-semibold text-slate-500">Full Name</label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
              <input
                type="text"
                required
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl glass-input text-sm"
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1.5 text-left">
            <label className="text-xs font-semibold text-slate-500">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
              <input
                type="email"
                required
                placeholder="john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl glass-input text-sm"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5 text-left">
            <label className="text-xs font-semibold text-slate-500">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
              <input
                type="password"
                required
                placeholder="Min 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl glass-input text-sm"
              />
            </div>
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5 text-left">
            <label className="text-xs font-semibold text-slate-500">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
              <input
                type="password"
                required
                placeholder="Re-enter password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl glass-input text-sm"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-brand-purple to-brand-blue py-3 text-sm font-semibold text-slate-800 shadow-lg hover:opacity-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-6"
          >
            {loading ? 'Registering...' : 'Sign Up'}
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <div className="mt-8 border-t border-slate-200 pt-6 text-center text-xs text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-500 font-semibold hover:underline">
            Sign in
          </Link>
        </div>
      </motion.div>
    </div>
  );
};
