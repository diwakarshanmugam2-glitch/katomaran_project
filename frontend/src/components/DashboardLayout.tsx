import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, BarChart3, Settings as SettingsIcon, LogOut, Bell, Hexagon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const DashboardLayout: React.FC = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col relative overflow-hidden">
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
      {/* Top Navigation Bar - Floating Glass */}
      <header className="px-6 py-5 flex flex-col lg:flex-row justify-between items-center gap-6 relative z-50">
        
        {/* Left Side: Logo + Nav */}
        <div className="flex flex-col sm:flex-row items-center gap-8 w-full lg:w-auto justify-between lg:justify-start">
          {/* Logo */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 w-full sm:w-auto"
          >
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-gradient-to-br from-brand-pink to-brand-cyan shadow-lg hover:scale-105 transition-transform duration-300">
                <Hexagon className="h-6 w-6 text-white fill-white/10" />
              </div>
              <span className="font-heading text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 drop-shadow-sm">
                NexusLink
              </span>
            </div>
          </motion.div>

          {/* Navigation Links */}
          <motion.nav 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex items-center gap-2 glass-premium px-3 py-2 rounded-full w-full sm:w-auto justify-center"
          >
          <NavLink
            to="/dashboard"
            end
            className={({ isActive }) =>
              `relative flex items-center gap-2 px-5 py-2 rounded-full transition-all font-medium text-sm ${
                isActive ? 'nav-pill-active' : 'nav-pill-inactive'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <LayoutDashboard className="h-4 w-4 relative z-10" />
                <span className="relative z-10">Home</span>
                {isActive && (
                  <motion.div 
                    layoutId="navPill" 
                    className="absolute inset-0 bg-slate-50 rounded-full"
                  />
                )}
              </>
            )}
          </NavLink>
          <NavLink
            to="/dashboard/analytics"
            className={({ isActive }) =>
              `relative flex items-center gap-2 px-5 py-2 rounded-full transition-all font-medium text-sm ${
                isActive ? 'nav-pill-active' : 'nav-pill-inactive'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <BarChart3 className="h-4 w-4 relative z-10" />
                <span className="relative z-10">Analytics</span>
                {isActive && (
                  <motion.div 
                    layoutId="navPill" 
                    className="absolute inset-0 bg-slate-50 rounded-full"
                  />
                )}
              </>
            )}
          </NavLink>
          <NavLink
            to="/dashboard/settings"
            className={({ isActive }) =>
              `relative flex items-center gap-2 px-5 py-2 rounded-full transition-all font-medium text-sm ${
                isActive ? 'nav-pill-active' : 'nav-pill-inactive'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <SettingsIcon className="h-4 w-4 relative z-10" />
                <span className="relative z-10">Settings</span>
                {isActive && (
                  <motion.div 
                    layoutId="navPill" 
                    className="absolute inset-0 bg-slate-50 rounded-full"
                  />
                )}
              </>
            )}
          </NavLink>
        </motion.nav>

        </div>

        {/* User Info & Actions */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-4 w-full lg:w-auto justify-end"
        >
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-full glass-premium hover:bg-slate-100 transition-colors"
            >
              <Bell className="h-4 w-4 text-slate-600" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-rose-500 shadow-sm animate-pulse" />
            </button>
            <AnimatePresence>
              {showNotifications && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-2 w-64 glass-premium rounded-xl p-4 shadow-xl border border-slate-200 z-50"
                >
                  <h4 className="text-sm font-bold text-slate-800 mb-2 border-b border-slate-100 pb-2">Notifications</h4>
                  <div className="flex items-center gap-3 py-2">
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <Hexagon className="h-4 w-4 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-800">Welcome to NexusLink!</p>
                      <p className="text-[10px] text-slate-500">Your account is fully active.</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {user && (
            <div className="relative">
              <button 
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2 glass-premium px-4 py-2 rounded-full text-sm hover:bg-slate-50 transition-colors"
              >
                <div className="h-6 w-6 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-xs font-bold text-slate-800">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <span className="text-slate-800 font-medium">{user.name || 'user'}</span>
              </button>

              <AnimatePresence>
                {showProfileMenu && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-48 glass-premium rounded-xl p-2 shadow-xl border border-slate-200 z-50 flex flex-col gap-1"
                  >
                    <div className="px-3 py-2 border-b border-slate-100 mb-1">
                      <p className="text-xs font-bold text-slate-800">{user.name}</p>
                      <p className="text-[10px] text-slate-500 truncate">{user.email}</p>
                    </div>
                    <button 
                      onClick={() => { setShowProfileMenu(false); navigate('/dashboard/settings'); }}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-800 transition-colors text-left"
                    >
                      <SettingsIcon className="h-4 w-4" />
                      Settings
                    </button>
                    <button 
                      onClick={() => { setShowProfileMenu(false); handleLogout(); }}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-rose-500 hover:bg-rose-50 transition-colors text-left"
                    >
                      <LogOut className="h-4 w-4" />
                      Log Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-rose-500 border border-rose-200 hover:bg-rose-50 hover:shadow-sm transition-all text-sm font-medium"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Log Out</span>
          </button>
        </motion.div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-[1600px] mx-auto p-4 sm:p-6 lg:p-8 relative z-10">
        <AnimatePresence mode="wait">
          <Outlet />
        </AnimatePresence>
      </main>
    </div>
  );
};
