import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Link2, BarChart3, QrCode, Shield, Zap, ArrowRight, MousePointerClick, Globe, Clock } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

export const LandingPage: React.FC = () => {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: <Link2 className="h-6 w-6" />,
      title: 'Instant Shortening',
      desc: 'Paste any long URL and get a unique, clean short link in milliseconds. Validates URLs automatically.',
      color: 'from-brand-purple to-brand-blue',
      iconBg: 'bg-indigo-500/15 border-brand-purple/25 text-indigo-500',
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: 'Click Analytics',
      desc: 'Track total clicks, daily trends, browser types, device info, and geographic locations for every link.',
      color: 'from-brand-cyan to-brand-blue',
      iconBg: 'bg-blue-500/15 border-brand-cyan/25 text-blue-500',
    },
    {
      icon: <QrCode className="h-6 w-6" />,
      title: 'QR Code Generation',
      desc: 'Generate downloadable QR codes for any shortened link. Perfect for print and offline sharing.',
      color: 'from-brand-pink to-brand-purple',
      iconBg: 'bg-rose-500/15 border-brand-pink/25 text-rose-500',
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: 'Secure & Private',
      desc: 'JWT authentication, bcrypt-hashed passwords, and per-user link isolation. Your data stays yours.',
      color: 'from-brand-blue to-brand-cyan',
      iconBg: 'bg-brand-blue/15 border-brand-blue/25 text-blue-600',
    },
  ];

  const steps = [
    {
      step: '01',
      icon: <Link2 className="h-7 w-7 text-indigo-500" />,
      title: 'Paste Your URL',
      desc: 'Enter any long URL into the dashboard. Optionally set a custom alias or expiry date.',
    },
    {
      step: '02',
      icon: <MousePointerClick className="h-7 w-7 text-blue-500" />,
      title: 'Get Short Link',
      desc: 'Receive a unique short URL instantly. Copy it, share it, or download the QR code.',
    },
    {
      step: '03',
      icon: <BarChart3 className="h-7 w-7 text-rose-500" />,
      title: 'Track Performance',
      desc: 'Monitor clicks, view visitor details, analyze trends with interactive charts.',
    },
  ];

  const bonusFeatures = [
    { icon: <Zap className="h-4 w-4" />, label: 'Custom Aliases' },
    { icon: <Clock className="h-4 w-4" />, label: 'Link Expiry' },
    { icon: <Globe className="h-4 w-4" />, label: 'Geo Analytics' },
    { icon: <QrCode className="h-4 w-4" />, label: 'QR Codes' },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] bg-grid-pattern relative flex flex-col overflow-x-hidden">
      {/* Decorative Orbs */}
      <div className="absolute top-[5%] left-[-8%] w-[500px] h-[500px] rounded-full bg-indigo-500/8 blur-[140px] pointer-events-none animate-float-slow" />
      <div className="absolute top-[50%] right-[-8%] w-[450px] h-[450px] rounded-full bg-blue-500/8 blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[10%] left-[30%] w-[350px] h-[350px] rounded-full bg-rose-500/5 blur-[120px] pointer-events-none" />

      <Navbar />

      {/* Hero Section */}
      <section className="relative px-6 pt-20 pb-16 sm:pt-28 sm:pb-24 sm:px-8 lg:px-10 text-center max-w-5xl mx-auto flex-1 flex flex-col justify-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 rounded-full border border-brand-purple/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-semibold text-indigo-500 mb-6 mx-auto"
        >
          <Zap className="h-3.5 w-3.5" />
          URL Shortener with Analytics
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="font-heading text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-800 mb-6 leading-[1.1]"
        >
          Shorten Links.{' '}
          <span className="text-indigo-600 animate-pulse">
            Track Everything.
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-base sm:text-lg text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Create short URLs, monitor click analytics, generate QR codes, and manage your links — all from one clean dashboard.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
        >
          <Link
            to={isAuthenticated ? '/dashboard' : '/register'}
            className="rounded-xl bg-gradient-to-r from-brand-purple to-brand-blue px-8 py-3.5 text-sm font-bold text-slate-800 shadow-lg shadow-brand-purple/20 hover:shadow-brand-purple/40 hover:scale-[1.02] transition-all flex items-center gap-2"
          >
            {isAuthenticated ? 'Go to Dashboard' : 'Get Started Free'}
            <ArrowRight className="h-4 w-4" />
          </Link>
          {!isAuthenticated && (
            <Link
              to="/login"
              className="rounded-xl border border-slate-200 bg-slate-50 px-8 py-3.5 text-sm font-semibold text-slate-800 hover:bg-slate-50 transition-all"
            >
              Sign In
            </Link>
          )}
        </motion.div>

        {/* Bonus Feature Pills */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="flex flex-wrap justify-center gap-3"
        >
          {bonusFeatures.map((f, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50] px-3.5 py-1.5 text-xs font-medium text-slate-500"
            >
              {f.icon}
              {f.label}
            </span>
          ))}
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="px-6 sm:px-8 lg:px-10 pb-20 max-w-6xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-800 mb-3">
            Everything You Need
          </h2>
          <p className="text-sm text-slate-500 max-w-lg mx-auto">
            A complete URL shortening platform with built-in analytics, QR generation, and link management.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              className="glass rounded-2xl p-6 border-slate-200 hover:border-slate-200 transition-all duration-300 group text-left"
            >
              <div className={`flex h-11 w-11 items-center justify-center rounded-xl border ${f.iconBg} mb-5 group-hover:scale-110 transition-transform`}>
                {f.icon}
              </div>
              <h3 className="font-heading text-base font-bold text-slate-800 mb-2">{f.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="px-6 sm:px-8 lg:px-10 pb-24 max-w-5xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-800 mb-3">
            How It Works
          </h2>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            Three simple steps to start shortening and tracking your links.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className="relative glass rounded-2xl p-6 border-slate-200 text-left"
            >
              <span className="absolute top-4 right-5 font-heading text-4xl font-extrabold text-slate-800/[0.04] select-none">
                {s.step}
              </span>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 border border-slate-200 mb-5">
                {s.icon}
              </div>
              <h3 className="font-heading text-base font-bold text-slate-800 mb-2">{s.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-center mt-14"
        >
          <Link
            to={isAuthenticated ? '/dashboard' : '/register'}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-purple to-brand-blue px-8 py-3.5 text-sm font-bold text-slate-800 shadow-lg hover:opacity-95 transition-all"
          >
            {isAuthenticated ? 'Open Dashboard' : 'Create Your Account'}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </section>

      {/* Simple Footer */}
      <footer className="border-t border-slate-200 py-6 text-center">
        <p className="text-xs text-slate-400">
          © {new Date().getFullYear()} NexusLink · Built for Katomaran Hackathon
        </p>
      </footer>
    </div>
  );
};
