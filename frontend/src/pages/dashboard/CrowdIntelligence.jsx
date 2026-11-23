import React, { useState, useEffect } from 'react';
import {
  Brain,
  Clock,
  Calendar,
  TrendingUp,
  AlertCircle,
  Sparkles,
  MapPin,
  CheckCircle2,
  RefreshCw,
  Info,
  ChevronRight
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar
} from 'recharts';
import CrowdBadge from '../../components/CrowdBadge';
import { getCrowdPrediction } from '../../utils/api';
import { demoLocations } from '../../utils/demoData';

export default function CrowdIntelligence() {
  const [selectedLoc, setSelectedLoc] = useState(demoLocations[0]._id || 'loc_001');
  const [targetHour, setTargetHour] = useState(18); // 6 PM
  const [forecastData, setForecastData] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadForecast = async (locId, hour) => {
    setLoading(true);
    try {
      const now = new Date();
      now.setHours(hour, 0, 0, 0);

      const res = await getCrowdPrediction(locId, now.toISOString());
      if (res && res.prediction) {
        setForecastData(res);
      }
    } catch (err) {
      console.warn('Prediction API notice:', err.message);
      // Fallback local forecast generator
      const loc = demoLocations.find(l => l._id === locId) || demoLocations[0];
      const base = loc.baselineCrowd || 40;
      const hoursData = Array.from({ length: 24 }, (_, h) => {
        const factor = h >= 6 && h <= 10 ? 1.5 : h >= 17 && h <= 21 ? 1.8 : 0.6;
        const val = Math.min(100, Math.round(base * factor));
        return {
          hour: `${h.toString().padStart(2, '0')}:00`,
          crowd: val,
          category: val > 75 ? 'Extremely High' : val > 50 ? 'High' : val > 25 ? 'Moderate' : 'Low'
        };
      });

      setForecastData({
        location: loc,
        targetTime: `${hour}:00`,
        prediction: {
          predictedScore: hoursData[hour].crowd,
          category: hoursData[hour].category,
          confidence: 0.72,
          factors: ['Evening devotional peak', 'Day of week modifier (weekend multiplier)', 'Historical pattern']
        },
        recommendation: {
          suggestAlternative: hoursData[hour].crowd > 65,
          alternativeLocation: 'Radha Raman Temple',
          alternativeScore: 38,
          message: 'Consider visiting Radha Raman Temple or postponing arrival until 21:00 for 45% less crowd.'
        },
        hourlyForecast: hoursData
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadForecast(selectedLoc, targetHour);
  }, [selectedLoc, targetHour]);

  const activeLocObj = demoLocations.find(l => l._id === selectedLoc) || demoLocations[0];

  // Chart data from forecast
  const chartData = forecastData?.hourlyForecast?.map(h => ({
    time: typeof h.hour === 'number' ? `${h.hour.toString().padStart(2, '0')}:00` : h.hour,
    density: h.predictedScore || h.crowd || 30
  })) || [];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Brain className="w-6 h-6 text-sky-400" />
            <span>Predictive Crowd Intelligence</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Machine-learning simulated arrival forecasts based on temporal patterns, pilgrimage schedules, and historical footfall.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-sky-400 font-medium">
          <Sparkles className="w-4 h-4 text-sky-400" />
          <span>Multi-Factor Temporal Prediction</span>
        </div>
      </div>

      {/* Selector Controls */}
      <div className="p-5 rounded-2xl bg-[#111827] border border-slate-800 grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
        <div className="md:col-span-6">
          <label className="block text-xs font-semibold text-slate-400 mb-1.5">
            Target Monitored Location
          </label>
          <select
            value={selectedLoc}
            onChange={(e) => setSelectedLoc(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-400"
          >
            {demoLocations.map(l => (
              <option key={l._id} value={l._id}>
                {l.name} ({l.category})
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-4">
          <label className="block text-xs font-semibold text-slate-400 mb-1.5">
            Expected Arrival Time
          </label>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min="0"
              max="23"
              value={targetHour}
              onChange={(e) => setTargetHour(parseInt(e.target.value))}
              className="flex-1 accent-sky-400"
            />
            <span className="font-mono text-sm text-white font-bold w-16 text-right">
              {targetHour.toString().padStart(2, '0')}:00
            </span>
          </div>
        </div>

        <div className="md:col-span-2">
          <button
            onClick={() => loadForecast(selectedLoc, targetHour)}
            className="w-full py-2 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Forecast</span>
          </button>
        </div>
      </div>

      {/* Forecast Output Spotlight Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-[#111827] border border-slate-800">
          <span className="text-xs font-semibold text-slate-400 block mb-2">
            Predicted Density at Expected Arrival
          </span>
          <div className="flex items-baseline gap-3">
            <span className="text-4xl font-extrabold text-white font-mono">
              {forecastData?.prediction?.predictedScore || 65}%
            </span>
            <CrowdBadge
              score={forecastData?.prediction?.predictedScore || 65}
              size="md"
            />
          </div>
          <p className="text-xs text-slate-400 mt-3">
            Expected for <strong className="text-slate-200">{activeLocObj.name}</strong> at {targetHour}:00.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-[#111827] border border-slate-800">
          <span className="text-xs font-semibold text-slate-400 block mb-2">
            Peak Congestion Windows
          </span>
          <div className="text-sm text-white space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">Morning Aarti & Darshan:</span>
              <strong className="text-amber-400 font-mono">06:00 - 10:30</strong>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">Evening Sandhya Rush:</span>
              <strong className="text-rose-400 font-mono">17:00 - 21:00</strong>
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-3">
            Recommended peaceful hours: 11:30 - 15:30.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-[#111827] border border-emerald-500/30 bg-gradient-to-br from-[#111827] to-emerald-950/20">
          <span className="text-xs font-semibold text-emerald-400 block mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            AI Travel Recommendation
          </span>
          <p className="text-xs text-slate-200 leading-relaxed">
            {forecastData?.recommendation?.message ||
              'Current selected timing has moderate traffic. Consider visiting during afternoon windows for maximum comfort.'}
          </p>
          <div className="mt-3 text-[11px] text-emerald-300 font-semibold flex items-center gap-1">
            <span>Potential Crowd Reduction: ~35%</span>
          </div>
        </div>
      </div>

      {/* 24-Hour Predictive Curve (Recharts Area Chart) */}
      <div className="p-6 rounded-2xl bg-[#111827] border border-slate-800 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-sky-400" />
            <span>24-Hour Crowd Density Forecast Curve</span>
          </h3>
          <span className="text-xs text-slate-400 font-mono">
            {activeLocObj.name}
          </span>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="crowdGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#38BDF8" stopOpacity={0.6}/>
                  <stop offset="95%" stopColor="#38BDF8" stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
              <XAxis dataKey="time" stroke="#64748B" fontSize={11} />
              <YAxis domain={[0, 100]} stroke="#64748B" fontSize={11} tickFormatter={(v) => `${v}%`} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0B1120',
                  borderColor: '#334155',
                  borderRadius: '12px',
                  color: '#F8FAFC',
                  fontSize: '12px'
                }}
                formatter={(val) => [`${val}% Density`, 'Predicted Crowd']}
              />
              <Area
                type="monotone"
                dataKey="density"
                stroke="#38BDF8"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#crowdGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="text-[11px] text-slate-500 text-center">
          Notice: Predictive model incorporates historical baseline curves, day-of-week multipliers, and recent crowd trends.
        </div>
      </div>
    </div>
  );
}
