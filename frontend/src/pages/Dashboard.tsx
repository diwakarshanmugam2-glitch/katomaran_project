import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../utils/api';
import { Link2, Sparkles, Globe, MousePointerClick, Activity, ChevronDown, ChevronUp, Copy, Check, ExternalLink, UploadCloud, Download, Settings as SettingsIcon, QrCode } from 'lucide-react';
import { BulkUploadModal } from '../components/BulkUploadModal';
import { QrCodeModal } from '../components/QrCodeModal';
import { motion } from 'framer-motion';

interface UrlData {
  _id: string;
  originalUrl: string;
  shortCode: string;
  customAlias: string | null;
  expiryDate: string | null;
  totalClicks: number;
  isActive: boolean;
  createdAt: string;
}

export const Dashboard: React.FC = () => {
  // State for Create Link
  const [originalUrl, setOriginalUrl] = useState('');
  const [customAlias, setCustomAlias] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState('');
  const [isBulkOpen, setIsBulkOpen] = useState(false);

  // State for Links Table & Stats
  const [urls, setUrls] = useState<UrlData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'expired'>('all');
  const [sort, setSort] = useState<'newest' | 'oldest' | 'clicks'>('newest');
  
  const [stats, setStats] = useState({ totalLinks: 0, totalClicks: 0, activeLinks: 0 });

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeQrUrl, setActiveQrUrl] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api.get(`/urls?search=${encodeURIComponent(search)}&limit=100`); 
      setUrls(data.urls);
      
      let clicks = 0;
      let active = 0;
      data.urls.forEach((u: UrlData) => {
        clicks += u.totalClicks;
        if (u.isActive) active++;
      });
      setStats({
        totalLinks: data.pagination.totalItems,
        totalClicks: clicks,
        activeLinks: active
      });

    } catch (err) {
      console.error('Failed to load links', err);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!originalUrl) return;
    setCreating(true);
    setCreateError('');
    try {
      await api.post('/urls', { originalUrl, customAlias, expiryDate });
      setOriginalUrl('');
      setCustomAlias('');
      setExpiryDate('');
      setShowAdvanced(false);
      fetchData(); 
    } catch (err: any) {
      setCreateError(err.message || 'Failed to create link');
    } finally {
      setCreating(false);
    }
  };

  const copyLink = (code: string, id: string) => {
    const shortUrl = `http://localhost:5000/${code}`;
    navigator.clipboard.writeText(shortUrl);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredAndSortedUrls = urls
    .filter(url => {
      if (filter === 'active') return url.isActive;
      if (filter === 'expired') return !url.isActive;
      return true;
    })
    .sort((a, b) => {
      if (sort === 'oldest') return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      if (sort === 'clicks') return b.totalClicks - a.totalClicks;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(); // newest
    });

  const handleExportCSV = () => {
    const headers = ['Original URL', 'Short URL', 'Clicks', 'Created Date', 'Expiry Date', 'Status'];
    const csvContent = [
      headers.join(','),
      ...filteredAndSortedUrls.map(url => {
        const shortUrl = `http://localhost:5000/${url.customAlias || url.shortCode}`;
        const created = new Date(url.createdAt).toLocaleDateString();
        const expiry = url.expiryDate ? new Date(url.expiryDate).toLocaleDateString() : 'Never';
        const status = url.isActive ? 'Active' : 'Expired';
        return `"${url.originalUrl}","${shortUrl}",${url.totalClicks},"${created}","${expiry}","${status}"`;
      })
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'snaplink_export.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 w-full"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full">
        
        {/* Left Column - Main Content */}
        <div className="lg:col-span-8 xl:col-span-9 space-y-8">

          {/* Shorten Link Form Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-premium p-10 lg:p-14"
          >
            <h2 className="text-slate-900 font-heading font-extrabold text-3xl mb-8 flex items-center gap-4">
              <img src="/assets/shorten_link_icon.png" alt="Portal" className="h-14 w-14 object-contain mix-blend-multiply drop-shadow-md" />
              Shorten a New Link
            </h2>
            
            <form onSubmit={handleCreate} className="space-y-8">
              <div className="flex flex-col sm:flex-row gap-5">
                <div className="relative flex-1">
                  <Link2 className="absolute left-6 top-1/2 -translate-y-1/2 text-blue-600 h-8 w-8 drop-shadow-sm" />
                  <input
                    type="url"
                    required
                    placeholder="Paste your long destination URL here (e.g. https://google.com)..."
                    value={originalUrl}
                    onChange={(e) => setOriginalUrl(e.target.value)}
                    className="w-full pl-20 pr-8 py-6 glass-input text-xl focus:ring-2 focus:ring-blue-600 shadow-sm"
                  />
                </div>
                <button
                  type="submit"
                  disabled={creating}
                  className="btn-primary px-12 py-6 flex items-center justify-center gap-3 whitespace-nowrap disabled:opacity-50 text-xl font-bold shadow-lg"
                >
                  <Sparkles className="h-6 w-6" />
                  Shorten Link
                </button>
              </div>
              
              {createError && <p className="text-rose-500 text-xs">{createError}</p>}

              <div>
                <button
                  type="button"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="flex items-center gap-1 text-sm text-blue-500/70 hover:text-blue-500 transition-colors"
                >
                  {showAdvanced ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  Advanced Options (Custom Alias, Expiry)
                </button>
                
                {showAdvanced && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-200]"
                  >
                    <div className="space-y-1">
                      <label className="text-xs text-slate-500 font-medium uppercase tracking-wider">Custom Alias</label>
                      <input
                        type="text"
                        placeholder="e.g. my-campaign"
                        value={customAlias}
                        onChange={(e) => setCustomAlias(e.target.value)}
                        className="w-full px-4 py-2.5 glass-input text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-slate-500 font-medium uppercase tracking-wider">Expiry Date</label>
                      <input
                        type="date"
                        value={expiryDate}
                        min={new Date().toISOString().split('T')[0]}
                        onChange={(e) => setExpiryDate(e.target.value)}
                        className="w-full px-4 py-2.5 glass-input text-sm text-slate-600"
                      />
                    </div>
                  </motion.div>
                )}
              </div>
            </form>
          </motion.div>

          {/* Links Table Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-premium p-6"
          >
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 mb-6">
              <h2 className="text-slate-800 font-heading font-semibold text-lg flex items-center gap-2">
                <Globe className="h-5 w-5 text-blue-500" />
                Your Shortened Links
              </h2>
              
              <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
                {/* Sort & Filter Dropdowns */}
                <div className="flex gap-2 w-full sm:w-auto">
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value as any)}
                    className="px-3 py-2 glass-input text-xs rounded-full appearance-none text-slate-600"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active Only</option>
                    <option value="expired">Expired</option>
                  </select>
                  
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value as any)}
                    className="px-3 py-2 glass-input text-xs rounded-full appearance-none text-slate-600"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="clicks">Most Clicks</option>
                  </select>
                </div>

                <div className="relative w-full sm:w-48 mt-2 sm:mt-0">
                  <input
                    type="text"
                    placeholder="Search links..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full px-4 py-2 glass-input text-xs rounded-full"
                  />
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="text-[10px] text-slate-500 font-semibold uppercase tracking-widest border-b border-slate-200]">
                  <tr>
                    <th className="pb-3 font-medium">Original Destination</th>
                    <th className="pb-3 font-medium">Short URL</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium text-center">Clicks</th>
                    <th className="pb-3 font-medium">Created</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.02]">
                  {loading ? (
                    <tr><td colSpan={5} className="py-8 text-center text-slate-400">Loading AI Data...</td></tr>
                  ) : filteredAndSortedUrls.length === 0 ? (
                    <tr><td colSpan={5} className="py-8 text-center text-slate-400">No links found.</td></tr>
                  ) : (
                    filteredAndSortedUrls.map(url => {
                      const shortDisplay = url.customAlias || url.shortCode;
                      const shortLink = `http://localhost:5000/${shortDisplay}`;
                      
                      return (
                        <tr key={url._id} className="saas-row">
                          <td className="py-4 pr-4">
                            <div className="truncate max-w-[150px] sm:max-w-[200px] text-slate-600 font-medium">
                              {url.originalUrl}
                            </div>
                          </td>
                          <td className="py-4 pr-4">
                            <div className="flex items-center gap-2">
                              <a href={shortLink} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-slate-800 transition-colors flex items-center gap-1 font-semibold text-xs drop-shadow-sm">
                                {shortLink} <ExternalLink className="h-3 w-3" />
                              </a>
                              <button onClick={() => copyLink(shortDisplay, url._id)} className="text-slate-400 hover:text-blue-500 transition-colors bg-slate-50 p-1.5 rounded-md" title="Copy">
                                {copiedId === url._id ? <Check className="h-3 w-3 text-blue-500" /> : <Copy className="h-3 w-3" />}
                              </button>
                              <button onClick={() => setActiveQrUrl(`http://localhost:5000/${url.shortCode}`)} className="text-slate-400 hover:text-emerald-500 transition-colors bg-slate-50 p-1.5 rounded-md ml-1" title="Generate QR Code">
                                <QrCode className="h-3 w-3" />
                              </button>
                            </div>
                          </td>
                          <td className="py-4 pr-4">
                            {url.isActive ? (
                              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-400/10 border border-green-400/20 text-green-400 text-[10px] font-medium">
                                <span className="h-1 w-1 rounded-full bg-green-400 animate-pulse"></span>
                                Active
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-rose-500/10 border border-brand-pink/20 text-rose-500 text-[10px] font-medium">
                                Expired
                              </span>
                            )}
                          </td>
                          <td className="py-4 pr-4 text-center">
                            <Link to={`/dashboard/analytics/${url._id}`}>
                              <div className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-tr from-brand-purple/20 to-brand-blue/20 text-slate-800 border border-brand-purple/30 text-xs font-bold hover:shadow-sm transition-all cursor-pointer hover:scale-110" title="View AI Analytics">
                                {url.totalClicks}
                              </div>
                            </Link>
                          </td>
                          <td className="py-4 text-slate-500 text-[11px]">
                            {new Date(url.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>

        </div>

        {/* Right Column - Stats & Smart Tools */}
        <div className="lg:col-span-4 xl:col-span-3 space-y-6 lg:ml-8">

          {/* Vertical Stats Column */}
          <div className="flex flex-col gap-6">
            <motion.div 
              whileHover={{ y: -2 }}
              className="glass-premium p-6 flex items-center justify-between"
            >
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-widest mb-1">Total Links</p>
                <p className="text-3xl font-heading font-bold text-slate-900">
                  {stats.totalLinks}
                </p>
              </div>
              <img src="/assets/total_links_icon.png" alt="Total Links" className="h-20 w-20 object-contain mix-blend-multiply hover:scale-110 transition-transform duration-300" />
            </motion.div>

            <motion.div 
              whileHover={{ y: -2 }}
              className="glass-premium p-6 flex items-center justify-between"
            >
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-widest mb-1">Total Redirects</p>
                <p className="text-3xl font-heading font-bold text-slate-900">
                  {stats.totalClicks}
                </p>
              </div>
              <img src="/assets/total_redirects_icon.png" alt="Total Redirects" className="h-20 w-20 object-contain mix-blend-multiply hover:scale-110 transition-transform duration-300" />
            </motion.div>

            <motion.div 
              whileHover={{ y: -2 }}
              className="glass-premium p-6 flex items-center justify-between"
            >
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-widest mb-1">Active Links</p>
                <p className="text-3xl font-heading font-bold text-emerald-600">
                  {stats.activeLinks}
                </p>
              </div>
              <img src="/assets/active_links_icon.png" alt="Active Links" className="h-20 w-20 object-contain mix-blend-multiply hover:scale-110 transition-transform duration-300" />
            </motion.div>
          </div>

          {/* Quick Tools Box */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-premium p-6"
          >
            <h3 className="text-slate-800 font-heading font-semibold text-sm mb-4 flex items-center gap-2">
              <img src="/assets/quick_actions_icon.png" alt="Tools" className="h-8 w-8 object-contain mix-blend-multiply" />
              Quick Actions
            </h3>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => setIsBulkOpen(true)}
                className="btn-premium flex items-center gap-3 w-full p-3 text-left"
              >
                <div className="p-2 bg-indigo-500/20 rounded-lg">
                  <UploadCloud className="h-4 w-4 text-indigo-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-800">Bulk Shorten</p>
                  <p className="text-[10px] text-slate-500">Upload CSV to create multiple</p>
                </div>
              </button>
              
              <button
                onClick={handleExportCSV}
                className="btn-premium flex items-center gap-3 w-full p-3 text-left"
              >
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <Download className="h-4 w-4 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-800">Export Data</p>
                  <p className="text-[10px] text-slate-500">Download links as CSV</p>
                </div>
              </button>
            </div>
          </motion.div>
        </div>

        <BulkUploadModal 
          isOpen={isBulkOpen} 
          onClose={() => setIsBulkOpen(false)} 
          onSuccess={() => {
            setIsBulkOpen(false);
            fetchData();
          }} 
        />
        
        <QrCodeModal 
          isOpen={!!activeQrUrl}
          onClose={() => setActiveQrUrl(null)}
          shortUrl={activeQrUrl || ''}
        />
        
      </div>
    </motion.div>
  );
};
