import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';
import { User, Mail, Calendar, KeyRound, Lock, Check, Zap, ArrowRight, ShieldCheck, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

export const Settings: React.FC = () => {
  const { user } = useAuth();
  
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }
    setLoading(true);
    setError('');
    
    try {
      await api.put('/auth/password', { currentPassword, newPassword });
      setSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-12">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="font-heading text-3xl font-extrabold text-slate-800 tracking-tight">System Configuration</h1>
        <p className="text-sm text-slate-500 mt-1">Manage your NexusLink preferences and security parameters.</p>
      </motion.div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Large Profile Tile - spans 2 columns */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="md:col-span-2 glass-premium rounded-3xl p-8 relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-blue-500/10 to-transparent rounded-bl-full -z-10 group-hover:scale-110 transition-transform duration-700"></div>
          
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl shadow-lg">
              <User className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-slate-800 font-heading font-bold text-xl">Identity Module</h2>
              <p className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold">Core Account Data</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-white/50 backdrop-blur-sm border border-slate-200/60 rounded-2xl p-5 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Username</span>
                <Activity className="h-4 w-4 text-blue-500 opacity-50" />
              </div>
              <p className="text-lg font-bold text-slate-800 truncate">{user?.name || 'Authorized User'}</p>
            </div>

            <div className="bg-white/50 backdrop-blur-sm border border-slate-200/60 rounded-2xl p-5 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Email Address</span>
                <Mail className="h-4 w-4 text-indigo-500 opacity-50" />
              </div>
              <p className="text-sm font-bold text-slate-800 truncate">{user?.email || 'user@nexuslink.com'}</p>
            </div>
          </div>
        </motion.div>

        {/* Vertical Tall Tile for Status - spans 1 column, 2 rows implicitly if others wrap */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="glass-premium rounded-3xl p-8 relative overflow-hidden bg-gradient-to-b from-slate-900 to-indigo-950 border-none flex flex-col justify-between group"
        >
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          
          <div>
            <div className="flex items-center gap-2 mb-6 text-emerald-400">
              <ShieldCheck className="h-5 w-5" />
              <span className="text-xs font-bold uppercase tracking-widest">System Status</span>
            </div>
            
            <div className="mb-6">
              <p className="text-[10px] text-indigo-300 font-bold uppercase tracking-widest mb-1">Access Tier</p>
              <h3 className="text-2xl font-heading font-black text-white flex items-center gap-2">
                PRO <Zap className="h-5 w-5 text-yellow-400 fill-yellow-400" />
              </h3>
            </div>
          </div>

          <div className="pt-6 border-t border-indigo-500/30">
            <p className="text-[10px] text-indigo-300 font-bold uppercase tracking-widest mb-1">Network Member Since</p>
            <p className="text-sm font-medium text-indigo-100 flex items-center gap-2">
              <Calendar className="h-4 w-4" /> June 2026
            </p>
          </div>
        </motion.div>

        {/* Security / Password Tile - spans 3 columns to anchor bottom */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="md:col-span-3 grid grid-cols-1 lg:grid-cols-2 gap-8 glass-premium rounded-3xl p-8 relative overflow-hidden"
        >
          {/* Left side text/illustration for security */}
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-br from-rose-500 to-pink-600 rounded-xl shadow-lg">
                <KeyRound className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-slate-800 font-heading font-bold text-xl">Security Override</h2>
            </div>
            <p className="text-sm text-slate-500 max-w-sm mb-6">
              Update your cryptographic keys to maintain maximum security. We recommend changing passwords every 90 days.
            </p>
            
            <div className="hidden lg:flex items-center gap-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
              <span className="flex items-center gap-1"><Check className="h-3 w-3 text-emerald-500" /> AES-256</span>
              <span className="flex items-center gap-1"><Check className="h-3 w-3 text-emerald-500" /> SSL/TLS</span>
            </div>
          </div>

          {/* Right side form */}
          <div className="bg-slate-50/50 rounded-2xl p-6 border border-slate-200/50">
            <form onSubmit={handleUpdatePassword} className="space-y-5">
              
              {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-500 p-3 rounded-lg text-xs font-bold flex items-center gap-2">
                  <Activity className="h-4 w-4" /> {error}
                </div>
              )}
              
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Current Protocol</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4 group-focus-within:text-blue-500 transition-colors" />
                  <input
                    type="password"
                    required
                    placeholder="Current Password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 focus:border-blue-500 rounded-xl text-sm shadow-sm transition-all outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">New Protocol</label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4 group-focus-within:text-emerald-500 transition-colors" />
                    <input
                      type="password"
                      required
                      placeholder="New Password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 focus:border-emerald-500 rounded-xl text-sm shadow-sm transition-all outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Verify Protocol</label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4 group-focus-within:text-emerald-500 transition-colors" />
                    <input
                      type="password"
                      required
                      placeholder="Confirm Password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 focus:border-emerald-500 rounded-xl text-sm shadow-sm transition-all outline-none"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3.5 rounded-xl flex items-center justify-center gap-2 text-sm font-bold transition-all shadow-md mt-2 ${
                  success 
                    ? 'bg-emerald-500 text-white hover:bg-emerald-600' 
                    : 'bg-slate-900 text-white hover:bg-slate-800'
                }`}
              >
                {success ? (
                  <>
                    <Check className="h-4 w-4" />
                    Security Overridden
                  </>
                ) : loading ? (
                  'Processing...'
                ) : (
                  <>
                    Initialize Override
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        </motion.div>

      </div>
    </div>
  );
};
