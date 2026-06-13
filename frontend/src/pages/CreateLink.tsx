import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link2, Calendar, Zap, ChevronDown, Check, AlertCircle, UploadCloud } from 'lucide-react';
import { api } from '../utils/api';
import { BulkUploadModal } from '../components/BulkUploadModal';

export const CreateLink: React.FC = () => {
  const [originalUrl, setOriginalUrl] = useState('');
  const [customAlias, setCustomAlias] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [bulkOpen, setBulkOpen] = useState(false);

  const handleShorten = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!originalUrl) return;

    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const payload = {
        originalUrl,
        customAlias: customAlias.trim() || undefined,
        expiryDate: expiryDate ? new Date(expiryDate).toISOString() : undefined,
      };

      await api.post('/urls', payload);
      setSuccessMsg('URL shortened successfully! Check your Links to view it.');
      setOriginalUrl('');
      setCustomAlias('');
      setExpiryDate('');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to shorten URL.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto w-full">
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-heading text-3xl font-extrabold text-slate-800 mb-2 tracking-tight">Create Link</h1>
          <p className="text-sm text-slate-500">Transform your long URLs into powerful short links.</p>
        </div>
        
        <button
          onClick={() => setBulkOpen(true)}
          className="btn-3d flex items-center gap-2 rounded-xl bg-slate-50 hover:bg-slate-50 px-4 py-2.5 text-sm font-bold text-slate-800 transition-all"
        >
          <UploadCloud className="h-4 w-4 text-blue-500" />
          Bulk Upload CSV
        </button>
      </div>

      <AnimatePresence>
        {successMsg && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-3 rounded-2xl glass-3d p-4 mb-6 text-blue-500 text-sm border-l-4 border-l-brand-cyan shadow-lg"
          >
            <div className="bg-blue-500/20 p-2 rounded-full">
              <Check className="h-4 w-4" />
            </div>
            <span className="font-semibold">{successMsg}</span>
          </motion.div>
        )}

        {errorMsg && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-3 rounded-2xl glass-3d p-4 mb-6 text-rose-500 text-sm border-l-4 border-l-brand-pink shadow-lg"
          >
            <div className="bg-rose-500/20 p-2 rounded-full">
              <AlertCircle className="h-4 w-4" />
            </div>
            <span className="font-semibold">{errorMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="glass-3d p-8 relative overflow-hidden group">
        {/* Decorative 3D Orbs */}
        <div className="absolute -top-16 -right-16 w-32 h-32 bg-blue-500/20 rounded-full blur-[40px] pointer-events-none group-hover:bg-blue-500/30 transition-colors duration-700" />
        <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-indigo-500/20 rounded-full blur-[40px] pointer-events-none group-hover:bg-indigo-500/30 transition-colors duration-700" />

        <form onSubmit={handleShorten} className="relative z-10">
          <div className="flex flex-col gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-600 ml-1">Destination URL</label>
              <div className="relative">
                <Link2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
                <input
                  type="url"
                  required
                  placeholder="https://example.com/very/long/path/to/something"
                  value={originalUrl}
                  onChange={(e) => setOriginalUrl(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-xl glass-input text-base shadow-inner"
                />
              </div>
            </div>

            {/* Advanced Options Toggle */}
            <button
              type="button"
              onClick={() => setAdvancedOpen(!advancedOpen)}
              className="flex items-center gap-2 text-sm font-bold text-blue-500 hover:text-slate-800 transition-colors self-start w-fit px-2 py-1 rounded-lg hover:bg-slate-50"
            >
              <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${advancedOpen ? 'rotate-180' : ''}`} />
              Advanced Tracking & Branding
            </button>

            <AnimatePresence>
              {advancedOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-200">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 ml-1 uppercase tracking-wider">Custom Back-Half</label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold select-none">/</span>
                        <input
                          type="text"
                          placeholder="my-campaign-2024"
                          value={customAlias}
                          onChange={(e) => setCustomAlias(e.target.value)}
                          className="w-full pl-8 pr-4 py-3 rounded-xl glass-input text-sm font-medium"
                        />
                      </div>
                      <p className="text-[10px] text-slate-400 ml-1">Leave empty for a randomly generated code.</p>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 ml-1 uppercase tracking-wider">Expiration Date</label>
                      <div className="relative">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
                        <input
                          type="date"
                          value={expiryDate}
                          min={new Date().toISOString().split('T')[0]}
                          onChange={(e) => setExpiryDate(e.target.value)}
                          className="w-full pl-11 pr-4 py-3 rounded-xl glass-input text-sm font-medium"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="pt-4 mt-2 border-t border-slate-200 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="btn-3d rounded-xl text-gradient px-10 py-4 text-base font-extrabold text-slate-800 hover:brightness-110 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Zap className="h-5 w-5" />
                    Generate Short Link
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>

      <BulkUploadModal
        isOpen={bulkOpen}
        onClose={() => setBulkOpen(false)}
        onSuccess={() => {
          setSuccessMsg('Bulk links generated successfully!');
          setTimeout(() => setSuccessMsg(''), 4000);
        }}
      />
    </div>
  );
};
