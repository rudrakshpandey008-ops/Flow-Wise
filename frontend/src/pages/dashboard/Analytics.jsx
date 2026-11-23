import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  Activity,
  Users,
  PieChart as PieIcon,
  Calendar,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import { getAnalyticsOverview, getAnalyticsTrends } from '../../utils/api';
import { demoAnalytics } from '../../utils/demoData';

export default function Analytics() {
  const [overview, setOverview] = useState(null);
  const [trends, setTrends] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState('7d');

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const [ov, tr] = await Promise.all([
        getAnalyticsOverview(),
        getAnalyticsTrends()
      ]);
      if (ov && ov.stats) setOverview(ov);
      if (tr && tr.hourlyTrends) setTrends(tr);
    } catch (err) {
      console.log('Using demo analytics data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, []);

  // Prepare chart arrays
  const hourlyData = trends?.hourlyTrends || [
    { hour: '06:00', temples: 70, transit: 45, markets: 15 },
    { hour: '09:00', temples: 85, transit: 75, markets: 40 },
    { hour: '12:00', temples: 55, transit: 50, markets: 85 },
    { hour: '15:00', temples: 40, transit: 45, markets: 70 },
    { hour: '18:00', temples: 95, transit: 85, markets: 90 },
    { hour: '21:00', temples: 70, transit: 50, markets: 60 }
  ];

  const weeklyData = trends?.weeklyTrends || [
    { day: 'Mon', avgCrowd: 46, journeys: 120 },
    { day: 'Tue', avgCrowd: 42, journeys: 110 },
    { day: 'Wed', avgCrowd: 48, journeys: 135 },
    { day: 'Thu', avgCrowd: 52, journeys: 150 },
    { day: 'Fri', avgCrowd: 68, journeys: 210 },
    { day: 'Sat', avgCrowd: 88, journeys: 340 },
    { day: 'Sun', avgCrowd: 94, journeys: 380 }
  ];

  const topLocations = overview?.topCrowded || [
    { name: 'Banke Bihari Temple', score: 88 },
    { name: 'Krishna Janmabhoomi', score: 82 },
    { name: 'Prem Mandir', score: 76 },
    { name: 'Vishram Ghat', score: 68 },
    { name: 'Dwarkadhish Temple', score: 62 },
    { name: 'Chatta Bazaar', score: 58 }
  ];

  const distributionData = overview?.distribution || [
    { name: 'Low (0-25)', count: 4, color: '#22C55E' },
    { name: 'Moderate (26-50)', count: 6, color: '#38BDF8' },
    { name: 'High (51-75)', count: 5, color: '#F59E0B' },
    { name: 'Extremely High (76-100)', count: 2, color: '#EF4444' }
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-emerald-400" />
            <span>Crowd Density & Mobility Analytics</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Aggregated crowd exposure metrics, peak hour footfall curves, and community reporting indices.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="p-1 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-1">
            {['24h', '7d', '30d'].map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                  activeFilter === f
                    ? 'bg-emerald-500 text-slate-950'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <button
            onClick={loadAnalytics}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#111827] border border-slate-800">
          <span className="text-xs text-slate-400 block mb-1">Average Corridor Density</span>
          <div className="text-3xl font-extrabold text-white font-mono">
            {overview?.stats?.averageCrowdDensity || 54}%
          </div>
          <span className="text-[11px] text-emerald-400 mt-1 block">Moderate overall baseline</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#111827] border border-slate-800">
          <span className="text-xs text-slate-400 block mb-1">Monitored Locations</span>
          <div className="text-3xl font-extrabold text-sky-400 font-mono">
            {overview?.stats?.totalMonitoredLocations || 17}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Mathura & Vrindavan zones</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#111827] border border-slate-800">
          <span className="text-xs text-slate-400 block mb-1">Active Congested Hotspots</span>
          <div className="text-3xl font-extrabold text-amber-400 font-mono">
            {overview?.stats?.congestedHotspots || 4}
          </div>
          <span className="text-[11px] text-amber-400/80 mt-1 block">Scores &gt; 60%</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#111827] border border-slate-800">
          <span className="text-xs text-slate-400 block mb-1">Comfort Index</span>
          <div className="text-3xl font-extrabold text-emerald-400 font-mono">
            {overview?.stats?.comfortIndex || 46}/100
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Optimal travel feasibility</span>
        </div>
      </div>

      {/* Row 1: Hourly Peak Trends & Top Crowded Locations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Hourly Category Footfall */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-[#111827] border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-sky-400" />
              <span>Hourly Crowd Curves by Category (24h)</span>
            </h3>
            <span className="text-[11px] text-slate-500 font-mono">Aarti & Market Windows</span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={hourlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                <XAxis dataKey="hour" stroke="#64748B" fontSize={11} />
                <YAxis stroke="#64748B" fontSize={11} tickFormatter={(v) => `${v}%`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0B1120',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    color: '#F8FAFC',
                    fontSize: '12px'
                  }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Line type="monotone" dataKey="temples" name="Temples" stroke="#EF4444" strokeWidth={2.5} dot={false} />
                <Line type="monotone" dataKey="transit" name="Transit" stroke="#F59E0B" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="markets" name="Markets" stroke="#38BDF8" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Most Crowded Locations Bar Chart */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-[#111827] border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              <span>Most Crowded Locations</span>
            </h3>
            <span className="text-[11px] text-slate-500 font-mono">Density Index</span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topLocations} layout="vertical" margin={{ top: 5, right: 20, left: 30, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" horizontal={false} />
                <XAxis type="number" domain={[0, 100]} stroke="#64748B" fontSize={11} />
                <YAxis dataKey="name" type="category" stroke="#64748B" fontSize={10} width={100} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0B1120',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    color: '#F8FAFC',
                    fontSize: '12px'
                  }}
                  formatter={(val) => [`${val}%`, 'Crowd Density']}
                />
                <Bar dataKey="score" fill="#22C55E" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 2: Weekly Trends & Density Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Weekly Journey & Crowd Pattern */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-[#111827] border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-400" />
              <span>Weekly Footfall & Journeys Handled</span>
            </h3>
            <span className="text-[11px] text-slate-500">Weekend Surges</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="weekGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22C55E" stopOpacity={0.5}/>
                    <stop offset="95%" stopColor="#22C55E" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                <XAxis dataKey="day" stroke="#64748B" fontSize={11} />
                <YAxis stroke="#64748B" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0B1120',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    color: '#F8FAFC',
                    fontSize: '12px'
                  }}
                />
                <Area type="monotone" dataKey="avgCrowd" stroke="#22C55E" strokeWidth={2.5} fill="url(#weekGrad)" name="Average Crowd %" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Crowd Distribution Pie */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-[#111827] border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-sky-400" />
              <span>Zone Density Distribution</span>
            </h3>
            <span className="text-[11px] text-slate-500">17 Locations</span>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={distributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="count"
                >
                  {distributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0B1120',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    color: '#F8FAFC',
                    fontSize: '12px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            {distributionData.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                <span className="text-slate-300 text-[11px] truncate">{item.name}: <strong>{item.count}</strong></span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
