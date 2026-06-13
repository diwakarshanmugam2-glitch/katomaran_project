import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Link2, Search, Trash2, BarChart3, Copy, Check,
  AlertCircle, AlertTriangle, ChevronLeft, ChevronRight,
  ExternalLink, QrCode, Pencil, Activity
} from 'lucide-react';
import { api } from '../utils/api';

interface UrlData {
  _id: string;
  originalUrl: string;
  shortCode: string;
  customAlias: string | null;
  expiryDate: string | null;
  totalClicks: number;
  lastVisited: string | null;
  createdAt: string;
  isActive: boolean;
}

export const ManageLinks: React.FC = () => {
  const [urls, setUrls] = useState<UrlData[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Search/Filter/Page States
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [order, setOrder] = useState('desc');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const limit = 8;

  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fetchUrls = useCallback(async () => {
    try {
      setLoading(true);
      setErrorMsg('');
      const data = await api.get(
        `/urls?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}&sortBy=${sortBy}&order=${order}`
      );
      setUrls(data.urls);
      setTotalPages(data.pagination.totalPages);
      setTotalItems(data.pagination.totalItems);
    } catch (err: any) {
      console.error(err);
      setErrorMsg('Failed to load shortened URLs.');
    } finally {
      setLoading(false);
    }
  }, [page, search, sortBy, order]);

  useEffect(() => {
    fetchUrls();
  }, [fetchUrls]);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this URL and its analytics data?')) return;
    try {
      await api.delete(`/urls/${id}`);
      setSuccessMsg('URL deleted successfully.');
      fetchUrls();
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err: any) {
      console.error(err);
      setErrorMsg('Failed to delete URL.');
    }
  };

  const copyLink = (code: string, id: string) => {
    const shortUrl = `http://localhost:5000/${code}`;
    navigator.clipboard.writeText(shortUrl);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleSort = (field: string) => {
    if (sortBy === field) {
      setOrder(order === 'desc' ? 'asc' : 'desc');
    } else {
      setSortBy(field);
      setOrder('desc');
    }
    setPage(1);
  };

  return (
    <div className="max-w-6xl mx-auto w-full">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-extrabold text-slate-800 mb-2 tracking-tight">My Links</h1>
        <p className="text-sm text-slate-500">Manage all your created short URLs.</p>
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

      <div className="glass-3d rounded-2xl p-6 relative overflow-hidden group">
        <div className="absolute -top-16 -right-16 w-32 h-32 bg-brand-blue/10 rounded-full blur-[40px] pointer-events-none group-hover:bg-brand-blue/20 transition-colors duration-700" />
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 relative z-10">
          <div className="flex items-center gap-3 w-full">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search links..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="w-full pl-11 pr-4 py-3 rounded-xl glass-input text-sm font-medium"
              />
            </div>

            <div className="flex rounded-xl border border-slate-200 bg-slate-50 p-1 glass-3d h-[46px] items-center">
              <button
                onClick={() => toggleSort('createdAt')}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  sortBy === 'createdAt' ? 'btn-3d bg-indigo-500 text-slate-800' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Date
              </button>
              <button
                onClick={() => toggleSort('totalClicks')}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  sortBy === 'totalClicks' ? 'btn-3d bg-indigo-500 text-slate-800' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Clicks
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="h-64 flex items-center justify-center relative z-10">
            <div className="h-10 w-10 border-4 border-brand-purple border-t-transparent rounded-full animate-spin" />
          </div>
        ) : urls.length === 0 ? (
          <div className="h-64 glass-3d rounded-xl flex flex-col items-center justify-center p-6 text-center border-dashed border-2 border-slate-200 relative z-10">
            <Activity className="h-12 w-12 text-gray-600 mb-4" />
            <span className="block text-base font-bold text-slate-800 mb-2">No Links Found</span>
            <p className="text-sm text-slate-500 max-w-xs mb-6">
              {search ? 'Try adjusting your search terms.' : 'You haven\'t created any links yet.'}
            </p>
            {!search && (
              <Link to="/dashboard/create" className="btn-3d rounded-lg bg-blue-500 px-6 py-2.5 text-sm font-bold text-slate-800">
                Create First Link
              </Link>
            )}
          </div>
        ) : (
          <div className="relative z-10">
            {/* Header */}
            <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 border-b border-slate-200 mb-2">
              <span className="col-span-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Original URL</span>
              <span className="col-span-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Short URL</span>
              <span className="col-span-1 text-xs font-bold text-slate-400 uppercase tracking-wider text-center">Created</span>
              <span className="col-span-1 text-xs font-bold text-slate-400 uppercase tracking-wider text-center">Clicks</span>
              <span className="col-span-1 text-xs font-bold text-slate-400 uppercase tracking-wider text-center">Status</span>
              <span className="col-span-3 text-xs font-bold text-slate-400 uppercase tracking-wider text-center">Actions</span>
            </div>

            <div className="space-y-3">
              {urls.map((url) => {
                const shortDisplay = url.customAlias || url.shortCode;
                const shortUrl = `http://localhost:5000/${shortDisplay}`;

                return (
                  <div
                    key={url._id}
                    className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center px-6 py-4 rounded-xl glass-3d hover:border-brand-purple/30 transition-all group"
                  >
                    {/* Original URL */}
                    <div className="col-span-3 min-w-0">
                      <a
                        href={url.originalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-slate-600 truncate block hover:text-slate-800 transition-colors"
                        title={url.originalUrl}
                      >
                        {url.originalUrl.length > 35 ? url.originalUrl.substring(0, 35) + '...' : url.originalUrl}
                      </a>
                    </div>

                    {/* Short URL */}
                    <div className="col-span-3 min-w-0 flex items-center gap-2">
                      <a
                        href={shortUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-bold text-blue-500 hover:text-indigo-500 truncate transition-colors"
                      >
                        {shortUrl.replace('http://', '')}
                      </a>
                      <ExternalLink className="h-3.5 w-3.5 text-slate-400 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>

                    {/* Created Date */}
                    <div className="col-span-1 text-center">
                      <span className="text-xs font-semibold text-slate-500">
                        {new Date(url.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                      </span>
                    </div>

                    {/* Clicks */}
                    <div className="col-span-1 text-center">
                      <span className="inline-flex items-center justify-center h-8 min-w-8 px-2 rounded-lg bg-blue-500/20 text-blue-500 text-xs font-extrabold border border-brand-cyan/30 shadow-inner">
                        {url.totalClicks}
                      </span>
                    </div>

                    {/* Status */}
                    <div className="col-span-1 text-center">
                      {!url.isActive ? (
                        <span className="text-[10px] font-extrabold text-rose-500 flex items-center justify-center gap-1 uppercase tracking-wider bg-rose-500/10 px-2 py-1 rounded-md">
                          <AlertTriangle className="h-3 w-3" />
                          Exp
                        </span>
                      ) : (
                        <span className="text-[10px] font-extrabold text-blue-500 uppercase tracking-wider bg-blue-500/10 px-2 py-1 rounded-md">Active</span>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="col-span-3 flex items-center justify-center gap-3">
                      <button
                        onClick={() => copyLink(url.customAlias || url.shortCode, url._id)}
                        className="btn-3d rounded-lg bg-slate-50 border-slate-200 p-2.5 text-slate-600 hover:text-slate-800 hover:bg-blue-500/20 transition-all"
                        title="Copy"
                      >
                        {copiedId === url._id ? <Check className="h-4 w-4 text-blue-500" /> : <Copy className="h-4 w-4" />}
                      </button>
                      <Link
                        to={`/analytics/${url._id}`}
                        className="btn-3d rounded-lg bg-slate-50 border-slate-200 p-2.5 text-slate-600 hover:text-slate-800 hover:bg-indigo-500/20 transition-all"
                        title="QR Code & Details"
                      >
                        <QrCode className="h-4 w-4" />
                      </Link>
                      <Link
                        to={`/analytics/${url._id}`}
                        className="btn-3d rounded-lg bg-slate-50 border-slate-200 p-2.5 text-slate-600 hover:text-slate-800 hover:bg-brand-blue/20 transition-all"
                        title="Analytics"
                      >
                        <BarChart3 className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(url._id)}
                        className="btn-3d rounded-lg bg-slate-50 border-slate-200 p-2.5 text-slate-600 hover:text-rose-500 hover:bg-rose-500/20 transition-all"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-6 mt-6 border-t border-slate-200">
                <span className="text-sm font-semibold text-slate-500">
                  Page <span className="text-slate-800">{page}</span> of <span className="text-slate-800">{totalPages}</span>
                </span>

                <div className="flex gap-3">
                  <button
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className="btn-3d rounded-lg bg-slate-50 px-4 py-2 text-slate-600 hover:text-slate-800 disabled:opacity-30 disabled:hover:text-slate-600 transition-colors"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setPage(Math.min(totalPages, page + 1))}
                    disabled={page === totalPages}
                    className="btn-3d rounded-lg bg-slate-50 px-4 py-2 text-slate-600 hover:text-slate-800 disabled:opacity-30 disabled:hover:text-slate-600 transition-colors"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
