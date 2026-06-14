import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Globe, Laptop, AlertCircle, Link2 } from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { api, BASE_URL } from '../utils/api';

interface DistributionData {
  name: string;
  value: number;
}

interface PublicStatsPayload {
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
    browsers: DistributionData[];
    devices: DistributionData[];
    countries: DistributionData[];
    cities: DistributionData[];
  };
  trends: Array<{ date: string; clicks: number }>;
}

const COLORS = ['#8b5cf6', '#3b82f6', '#06b6d4', '#ec4899', '#f59e0b', '#10b981'];

export const PublicStats: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const [data, setData] = useState<PublicStatsPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const fetchPublicStats = async () => {
      if (!id) return;
      try {
        setLoading(true);
        setErrorMsg('');
        const response = await api.get(`/analytics/${id}`);
        setData(response);
      } catch (err: any) {
        console.error(err);
        setErrorMsg(err.message || 'Public statistics page is not available or disabled.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPublicStats();
  }, [id]);

  if (loading && !data) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
        <div className="h-8 w-8 border-2 border-brand-purple border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (errorMsg || !data) {
    return (
      <div className="min-h-screen bg-[#f8fafc] bg-grid-pattern relative flex flex-col justify-between">
        <div className="pt-8 px-4 text-center z-10">
          <Link to="/" className="inline-flex items-center gap-2 mb-12 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-purple to-brand-cyan shadow-sm">
              <Link2 className="h-5 w-5 text-slate-800" />
            </div>
            <span className="font-heading text-xl font-bold tracking-tight text-slate-800">
              NexusLink
            </span>
          </Link>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto z-10">
          <AlertCircle className="h-12 w-12 text-rose-500 mb-4 animate-bounce" />
          <h2 className="font-heading text-xl font-bold text-slate-800 mb-2">Access Restricted</h2>
          <p className="text-sm text-slate-500 mb-6">
            {errorMsg || 'Public statistics view is either disabled by the owner, or this short URL has expired.'}
          </p>
          <Link to="/" className="rounded-xl bg-gradient-to-r from-brand-purple to-brand-blue px-6 py-3 text-xs font-semibold text-slate-800 shadow-lg">
            Back to NexusLink Home
          </Link>
        </div>

      </div>
    );
  }

  const shortUrl = `${BASE_URL}/${data.url.shortCode}`;

  return (
    <div className="min-h-screen bg-[#f8fafc] bg-grid-pattern relative flex flex-col">
      {/* Mini header logo */}
      <header className="border-b border-slate-200 bg-[#f8fafc]/70 backdrop-blur-md sticky top-0 z-40 py-4">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-brand-purple to-brand-cyan shadow-sm">
              <Link2 className="h-4 w-4 text-slate-800" />
            </div>
            <span className="font-heading text-sm font-bold tracking-tight text-slate-800">
              NexusLink
            </span>
          </Link>
          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-500 bg-blue-500/10 px-2.5 py-1 rounded-full border border-blue-100">
            Public Statistics View
          </span>
        </div>
      </header>

      <main className="flex-1 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-10 z-10">
        {/* Title Details Card */}
        <div className="glass rounded-3xl border-slate-200 p-6 md:p-8 text-left mb-8">
          <span className="text-xs font-semibold text-indigo-500 uppercase tracking-wider block mb-1">
            Global Analytics Report
          </span>
          <h1 className="font-heading text-2xl md:text-3xl font-extrabold text-slate-800 mb-2">
            /{data.url.customAlias || data.url.shortCode}
          </h1>
          <p className="text-xs text-slate-500 truncate max-w-2xl mb-4 hover:underline">
            Destination: <a href={data.url.originalUrl} target="_blank" rel="noopener noreferrer">{data.url.originalUrl}</a>
          </p>
          <div className="text-[10px] text-slate-400">
            Short URL Redirect: <span className="font-semibold text-blue-500">{shortUrl}</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8 text-left">
          <div className="glass rounded-2xl p-6 border-slate-200">
            <span className="block text-xs font-semibold text-slate-500 mb-1">Overall Redirect Clicks</span>
            <span className="text-3xl font-extrabold text-slate-800">{data.stats.totalClicks}</span>
          </div>
          <div className="glass rounded-2xl p-6 border-slate-200">
            <span className="block text-xs font-semibold text-slate-500 mb-1">Last Interaction Time</span>
            <span className="text-sm font-semibold text-slate-800">
              {data.stats.lastVisited
                ? new Date(data.stats.lastVisited).toLocaleString()
                : 'No click events logged.'}
            </span>
          </div>
          <div className="glass rounded-2xl p-6 border-slate-200">
            <span className="block text-xs font-semibold text-slate-500 mb-1">Created Date</span>
            <span className="text-sm font-semibold text-slate-800">
              {new Date(data.url.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Trend Area Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8 text-left">
          <div className="lg:col-span-2 glass rounded-2xl p-6 border-slate-200">
            <h3 className="font-heading text-sm font-bold text-slate-800 mb-6 uppercase tracking-wider">Daily Clicks Report</h3>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.trends} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" stroke="#4b5563" fontSize={10} tickLine={false} />
                  <YAxis stroke="#4b5563" fontSize={10} tickLine={false} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f0c1e',
                      border: '1px solid rgba(139,92,246,0.2)',
                      borderRadius: '12px',
                      color: '#fff',
                      fontSize: '11px',
                    }}
                  />
                  <Area type="monotone" dataKey="clicks" stroke="#8b5cf6" strokeWidth={2.5} fillOpacity={1} fill="url(#colorClicks)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Device Pie Chart */}
          <div className="lg:col-span-1 glass rounded-2xl p-6 border-slate-200 flex flex-col justify-between">
            <h3 className="font-heading text-xs font-bold text-slate-800 mb-4 uppercase tracking-wider">Devices Segmented</h3>
            <div className="h-44 w-full relative flex-1">
              {data.distributions.devices.length === 0 ? (
                <div className="h-full flex items-center justify-center text-xs text-slate-400">No clicks recorded yet</div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data.distributions.devices}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={70}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {data.distributions.devices.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0f0c1e',
                        border: '1px solid rgba(139,92,246,0.15)',
                        borderRadius: '8px',
                        color: '#fff',
                        fontSize: '10px',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
            <div className="flex justify-center flex-wrap gap-x-4 gap-y-2 mt-2">
              {data.distributions.devices.map((entry, index) => (
                <div key={entry.name} className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                  <span className="text-[10px] text-slate-500 font-medium">{entry.name} ({entry.value})</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Regional + browser metrics lists */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
          {/* Countries progress list */}
          <div className="glass rounded-2xl p-6 border-slate-200">
            <h3 className="font-heading text-sm font-bold text-slate-800 mb-4 uppercase tracking-wider flex items-center gap-2">
              <Globe className="h-4.5 w-4.5 text-blue-500" />
              Regional Click Share
            </h3>
            {data.distributions.countries.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-400">No geolocation records.</div>
            ) : (
              <div className="space-y-3 mt-4">
                {data.distributions.countries.map((c) => (
                  <div key={c.name} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-slate-800">{c.name}</span>
                      <span className="text-slate-500 font-semibold">{c.value} clicks</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full"
                        style={{
                          width: `${(c.value / data.stats.totalClicks) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Browser client progress list */}
          <div className="glass rounded-2xl p-6 border-slate-200">
            <h3 className="font-heading text-sm font-bold text-slate-800 mb-4 uppercase tracking-wider flex items-center gap-2">
              <Laptop className="h-4.5 w-4.5 text-indigo-500" />
              Browser Clients
            </h3>
            {data.distributions.browsers.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-400">No browser records.</div>
            ) : (
              <div className="space-y-3 mt-4">
                {data.distributions.browsers.map((b) => (
                  <div key={b.name} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-slate-800">{b.name}</span>
                      <span className="text-slate-500 font-semibold">{b.value} clicks</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-500 rounded-full"
                        style={{
                          width: `${(b.value / data.stats.totalClicks) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};
