import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../utils/api';
import { Mail, Lock, AlertCircle, ArrowRight, Infinity as InfinityIcon, KeyRound, CheckCircle } from 'lucide-react';

export const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRequestCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setErrorMsg('Please enter your registered email');
      return;
    }
    setErrorMsg('');
    setLoading(true);

    try {
      const res = await api.post('/auth/forgot-password', { email }, false);
      setSuccessMsg(res.message || 'Code sent successfully! Check your console/email.');
      setTimeout(() => {
        setSuccessMsg('');
        setStep(2);
      }, 1500);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to request reset code.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || code.length !== 6) {
      setErrorMsg('Please enter a valid 6-digit code');
      return;
    }
    setErrorMsg('');
    setStep(3);
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      setErrorMsg('Password must be at least 6 characters long');
      return;
    }
    setErrorMsg('');
    setLoading(true);

    try {
      const res = await api.post('/auth/reset-password', { email, code, newPassword }, false);
      setSuccessMsg(res.message || 'Password reset successfully!');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to reset password. Code might be expired.');
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
      </div>
      
      {/* Full Background Glassy Overlay */}
      <div className="absolute inset-0 z-0 bg-white/30 backdrop-blur-[80px] pointer-events-none" />

      {/* Header Info */}
      <div className="text-center mb-8 relative z-10 max-w-lg px-4 flex flex-col items-center">
        <Link to="/" className="flex items-center gap-3 mb-6 group">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-pink to-brand-cyan shadow-lg hover:scale-105 transition-transform">
            <InfinityIcon className="h-8 w-8 text-bg-dark drop-shadow-sm" />
          </div>
          <span className="font-heading text-4xl font-extrabold tracking-tight text-slate-900 disco-text drop-shadow-sm">
            NexusLink
          </span>
        </Link>
      </div>

      <div className="glass-premium w-full max-w-md p-10 relative z-10">
        <div className="text-center mb-6">
          <h2 className="font-heading text-2xl font-extrabold text-slate-800 mb-2">Account Recovery</h2>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
            {step === 1 ? 'Identify Account' : step === 2 ? 'Verify Identity' : 'Set New Protocol'}
          </p>
        </div>

        {errorMsg && (
          <div className="flex items-center gap-2 rounded-xl bg-rose-500/10 border border-brand-pink/30 p-3.5 mb-6 text-rose-500 text-xs font-bold shadow-inner text-left">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-3.5 mb-6 text-emerald-600 text-xs font-bold shadow-inner text-left">
            <CheckCircle className="h-5 w-5 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {step === 1 && (
          <form onSubmit={handleRequestCode} className="space-y-6 relative z-20">
            <div className="space-y-2 text-left">
              <label className="text-xs font-extrabold text-blue-500 uppercase tracking-wider">Registered Email</label>
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

            <button
              type="submit"
              disabled={loading}
              className="btn-disco w-full rounded-xl py-4 text-sm shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 mt-8 uppercase tracking-widest"
            >
              {loading ? 'Processing...' : 'Request Reset Code'}
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerifyCode} className="space-y-6 relative z-20">
            <div className="space-y-2 text-left">
              <label className="text-xs font-extrabold text-indigo-500 uppercase tracking-wider">6-Digit Auth Code</label>
              <p className="text-[10px] text-slate-500 mb-2">Check your email (or terminal console) for the code sent to {email}.</p>
              <div className="relative">
                <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-500 h-5 w-5" />
                <input
                  type="text"
                  required
                  maxLength={6}
                  placeholder="123456"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl glass-input text-sm font-medium text-center tracking-[0.5em]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn-disco w-full rounded-xl py-4 text-sm shadow-lg flex items-center justify-center gap-2 mt-8 uppercase tracking-widest"
            >
              Verify Code
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-full text-xs text-slate-500 hover:text-slate-800 transition-colors mt-4"
            >
              Back to Email
            </button>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleResetPassword} className="space-y-6 relative z-20">
            <div className="space-y-2 text-left">
              <label className="text-xs font-extrabold text-rose-500 uppercase tracking-wider">New Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-rose-500 h-5 w-5" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl glass-input text-sm font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-disco w-full rounded-xl py-4 text-sm shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 mt-8 uppercase tracking-widest"
            >
              {loading ? 'Updating...' : 'Set New Password'}
              <CheckCircle className="h-4 w-4" />
            </button>
          </form>
        )}

        <div className="mt-8 pt-6 text-center text-xs font-bold text-slate-500 border-t border-slate-200/50">
          Remember your password?{' '}
          <Link to="/login" className="text-brand-yellow hover:text-slate-800 transition-colors underline decoration-brand-yellow underline-offset-4">
            Return to Login
          </Link>
        </div>
      </div>
    </div>
  );
};
