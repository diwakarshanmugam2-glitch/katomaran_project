import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Link2, LogOut, LayoutDashboard, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Navbar: React.FC = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200 bg-[#f8fafc]/70 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-purple to-brand-cyan shadow-sm transition-all group-hover:scale-105">
                <Link2 className="h-4.5 w-4.5 text-slate-800" />
              </div>
              <span className="font-heading text-lg font-bold tracking-tight text-slate-800">
                Chrono<span className="text-blue-600">Link</span>
              </span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-5">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors hover:text-blue-500 ${
                isActive('/') ? 'text-blue-500' : 'text-slate-600'
              }`}
            >
              Home
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className={`flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-blue-500 ${
                    isActive('/dashboard') || location.pathname.startsWith('/analytics') ? 'text-blue-500' : 'text-slate-600'
                  }`}
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Link>
                <div className="h-4 w-[1px] bg-slate-50" />
                <span className="text-xs text-slate-500 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200">
                  {user?.name}
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-1.5 text-sm font-medium text-slate-800 transition-all hover:bg-rose-500/10 hover:border-brand-pink/30 hover:text-rose-500"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-800"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="rounded-lg bg-gradient-to-r from-brand-purple to-brand-blue px-5 py-2 text-sm font-semibold text-slate-800 shadow-sm transition-all hover:opacity-90 hover:shadow-sm"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu trigger */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center rounded-lg p-2 text-slate-500 hover:bg-slate-50 hover:text-slate-800 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-b border-slate-200 bg-[#f8fafc]/95 backdrop-blur-md md:hidden overflow-hidden"
          >
            <div className="space-y-1 px-4 py-3">
              <Link
                to="/"
                onClick={() => setIsOpen(false)}
                className={`block rounded-lg px-3 py-2 text-base font-medium ${
                  isActive('/') ? 'bg-slate-50 text-blue-500' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                }`}
              >
                Home
              </Link>

              {isAuthenticated ? (
                <>
                  <Link
                    to="/dashboard"
                    onClick={() => setIsOpen(false)}
                    className={`block rounded-lg px-3 py-2 text-base font-medium ${
                      isActive('/dashboard') ? 'bg-slate-50 text-blue-500' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                    }`}
                  >
                    Dashboard
                  </Link>
                  <div className="border-t border-slate-200 my-2" />
                  <div className="px-3 py-2 text-sm text-slate-500">
                    Logged in as: <span className="text-slate-800 font-medium">{user?.name}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-base font-medium text-rose-500 hover:bg-rose-500/5"
                  >
                    <LogOut className="h-5 w-5" />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="block rounded-lg px-3 py-2 text-base font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-800"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsOpen(false)}
                    className="block rounded-lg bg-gradient-to-r from-brand-purple to-brand-blue px-3 py-2 text-center text-base font-semibold text-slate-800"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
