import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ExternalLink, AlertCircle } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import { api } from '../utils/api';

interface AnalyticsPayload {
  url: {
    _id: string;
    originalUrl: string;
    shortCode: string;
    customAlias: string | null;
    createdAt: string;
    expiryDate: string | null;
  };
  stats: {
    totalClicks: number;
    lastVisited: string | null;
  };
  distributions: {
    browsers: { name: string; value: number }[];
    devices: { name: string; value: number }[];
    countries?: { name: string; value: number }[];
    cities?: { name: string; value: number }[];
  };
  trends: Array<{ date: string; clicks: number }>;
  recentVisits?: {
    _id: string;
    timestamp: string;
    browser: string;
    device: string;
    country: string;
    city: string;
  }[];
}

export const Analytics: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<AnalyticsPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [noLinksFound, setNoLinksFound] = useState(false);
  const navigate = useNavigate();

  const fetchAnalytics = useCallback(async () => {
    if (!id) {
      try {
        const res = await api.get('/urls?limit=1&sortBy=createdAt&order=desc');
        if (res.urls && res.urls.length > 0) {
          navigate(`/dashboard/analytics/${res.urls[0]._id}`, { replace: true });
        } else {
          setNoLinksFound(true);
        }
      } catch (err) {
        setNoLinksFound(true);
      }
      return;
    }
    try {
      setLoading(true);
      setErrorMsg('');
      const response = await api.get(`/analytics/${id}`);
      setData(response);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to load analytics.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  if (!id) {
    if (noLinksFound) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[500px] text-center p-6">
          <h2 className="font-heading text-xl font-bold text-slate-800 mb-2">No Links Found</h2>
          <p className="text-sm text-slate-500 mb-6">You haven't created any links yet. Go to the dashboard to shorten your first link!</p>
          <Link to="/dashboard" className="glass-premium px-6 py-3 text-sm text-slate-800 font-medium hover:bg-slate-50 transition-colors rounded-lg">
            Go to Dashboard
          </Link>
        </div>
      );
    }
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="h-8 w-8 border-2 border-brand-purple border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="h-8 w-8 border-2 border-brand-purple border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (errorMsg || !data) {
    return (
      <div className="flex flex-col items-center justify-center p-6 text-center mt-20">
        <AlertCircle className="h-12 w-12 text-red-400 mb-4" />
        <h2 className="font-heading text-xl font-bold text-slate-800 mb-2">Analytics Not Found</h2>
        <p className="text-sm text-slate-500 mb-6">{errorMsg || 'The requested URL analytics records could not be retrieved.'}</p>
        <Link to="/dashboard" className="glass-premium px-5 py-2 text-sm text-slate-800 hover:bg-slate-50 transition-colors">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const shortUrl = `http://localhost:5000/${data.url.customAlias || data.url.shortCode}`;
  
  // Create progress bar helper
  const renderProgressBars = (items: { name: string; value: number }[], total: number) => {
    if (items.length === 0) return <p className="text-xs text-slate-400 py-2">No data yet</p>;
    
    return items.map((item, idx) => {
      const percentage = total > 0 ? Math.round((item.value / total) * 100) : 0;
      return (
        <div key={idx} className="mb-4">
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-slate-600 font-medium flex items-center gap-1.5 truncate pr-2">
              {item.name === 'Desktop' ? '💻' : item.name === 'Mobile' ? '📱' : item.name === 'Tablet' ? '📟' : ''} {item.name}
            </span>
            <span className="text-slate-500 shrink-0">{item.value} ({percentage}%)</span>
          </div>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${percentage}%` }} />
          </div>
        </div>
      );
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="glass-premium p-4 px-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Link to="/dashboard" className="flex items-center gap-2 bg-slate-50] hover:bg-slate-50] border border-slate-200] px-4 py-2 rounded-lg text-sm text-slate-800 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>
        <div className="text-left sm:text-right">
          <h1 className="font-heading text-xl font-bold text-slate-800 leading-tight">Link Analytics</h1>
          <p className="text-xs text-slate-500 flex items-center gap-1">
            Tracking: <a href={shortUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-500 transition-colors">{shortUrl}</a>
            <ExternalLink className="h-3 w-3 text-blue-600" />
          </p>
        </div>
      </div>

      {/* Overview Block */}
      <div className="glass-premium p-6 md:p-8 flex flex-col md:flex-row justify-between gap-6">
        <div className="flex-1 min-w-0">
          <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Original Destination</h3>
          <p className="text-sm text-gray-200 break-all bg-slate-50] p-4 rounded-xl border border-slate-200] mb-4 font-mono">
            {data.url.originalUrl}
          </p>
          <div className="text-xs text-slate-400 flex flex-wrap gap-x-4 gap-y-2">
            <span>Created: {new Date(data.url.createdAt).toLocaleDateString()}</span>
            <span>•</span>
            <span>Expiry: {data.url.expiryDate ? new Date(data.url.expiryDate).toLocaleDateString() : 'Never'}</span>
            <span>•</span>
            <span>Last Visited: {data.stats.lastVisited ? new Date(data.stats.lastVisited).toLocaleString() : 'N/A'}</span>
          </div>
        </div>
        
        <div className="flex items-center md:items-start justify-start md:justify-end shrink-0">
          <div className="glass-premium p-5 text-center min-w-[120px]">
            <span className="block text-[10px] font-bold text-[#8b5cf6] uppercase tracking-widest mb-1">Total Visits</span>
            <span className="text-4xl font-extrabold text-slate-800">{data.stats.totalClicks}</span>
          </div>
        </div>
      </div>

      {/* Charts & Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Trend Chart */}
        <div className="lg:col-span-2 glass-premium p-6 flex flex-col">
          <h3 className="text-sm font-semibold text-slate-800 mb-6">Click Trend (Last 7 Days)</h3>
          <div className="flex-1 min-h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.trends} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTrend" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.5} />
                    <stop offset="95%" stopColor="#00e5ff" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" stroke="#4b5563" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#4b5563" fontSize={10} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#131A2A', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', color: '#fff', fontSize: '11px' }}
                />
                <Area type="monotone" dataKey="clicks" stroke="#8b5cf6" strokeWidth={2} fillOpacity={1} fill="url(#colorTrend)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Mixes & Geography */}
        <div className="lg:col-span-1 glass-premium p-6">
          <h3 className="text-sm font-semibold text-slate-800 mb-6">Traffic Sources</h3>
          
          <div className="mb-8">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Devices</h4>
            {renderProgressBars(data.distributions.devices, data.stats.totalClicks)}
          </div>
          
          <div className="mb-8">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Top Browsers</h4>
            {renderProgressBars(data.distributions.browsers, data.stats.totalClicks)}
          </div>

          {data.distributions.countries && data.distributions.countries.length > 0 && (
            <div>
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Top Countries</h4>
              {renderProgressBars(data.distributions.countries, data.stats.totalClicks)}
            </div>
          )}
        </div>

      </div>

      {/* Recent Visits Table */}
      {data.recentVisits && data.recentVisits.length > 0 && (
        <div className="glass-premium p-6">
          <h3 className="text-sm font-semibold text-slate-800 mb-6">Recent Activity Log</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs text-slate-500 font-semibold uppercase tracking-wider border-b border-slate-200]">
                <tr>
                  <th className="pb-3 font-medium">Time</th>
                  <th className="pb-3 font-medium">Location</th>
                  <th className="pb-3 font-medium">Device</th>
                  <th className="pb-3 font-medium">Browser</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.02]">
                {data.recentVisits.map((visit) => (
                  <tr key={visit._id} className="hover:bg-slate-50]">
                    <td className="py-4 pr-4 text-slate-600">
                      {new Date(visit.timestamp).toLocaleString()}
                    </td>
                    <td className="py-4 pr-4 text-slate-600">
                      {visit.city && visit.city !== 'Unknown' ? `${visit.city}, ` : ''}{visit.country || 'Unknown'}
                    </td>
                    <td className="py-4 pr-4 text-slate-600">
                      {visit.device || 'Unknown'}
                    </td>
                    <td className="py-4 pr-4 text-slate-600">
                      {visit.browser || 'Unknown'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
