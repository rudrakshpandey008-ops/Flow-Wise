import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Navigation,
  Activity,
  Users,
  Compass,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  Clock,
  MapPin,
  ShieldAlert,
  Sparkles,
  ChevronRight,
  Radio,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import CrowdBadge from '../../components/CrowdBadge';
import AlertCard from '../../components/AlertCard';
import { getNearbyData, getJourneyHistory } from '../../utils/api';
import { demoLocations, demoAlerts, demoJourneys } from '../../utils/demoData';

export default function DashboardHome() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [nearby, setNearby] = useState(demoLocations.slice(0, 5));
  const [alerts, setAlerts] = useState(demoAlerts);
  const [recentJourneys, setRecentJourneys] = useState(demoJourneys);
  const [quickSource, setQuickSource] = useState('Mathura Junction Railway Station');
  const [quickDest, setQuickDest] = useState('Banke Bihari Temple');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch live nearby conditions and journey history from backend
    getNearbyData(27.5046, 77.6713, 20)
      .then((res) => {
        if (res && res.locations && res.locations.length > 0) {
          setNearby(res.locations.slice(0, 5));
        }
      })
      .catch((err) => {
        console.log('Using demo nearby locations', err.message);
      });

    getJourneyHistory()
      .then((res) => {
        if (res && res.journeys && res.journeys.length > 0) {
          setRecentJourneys(res.journeys.slice(0, 3));
        }
      })
      .catch(() => {});
  }, []);

  const handleQuickPlan = (e) => {
    e.preventDefault();
    navigate('/dashboard/plan', {
      state: { source: quickSource, destination: quickDest }
    });
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* 1. Welcome Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-[#111827] border border-slate-800 p-6 sm:p-8">
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-xs text-emerald-400 font-medium mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Crowd AI Active — Optimum Navigation Ready</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Welcome back, {user?.name || 'Traveler'}
            </h2>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              Real-time crowd intelligence is active across 17+ locations in the Mathura & Vrindavan pilgrimage and transit corridor.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/dashboard/map')}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Activity className="w-4 h-4 text-emerald-400" />
              <span>Explore Live Map</span>
            </button>
            <button
              onClick={() => navigate('/dashboard/report')}
              className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all shadow-md shadow-emerald-500/20 flex items-center gap-2 cursor-pointer"
            >
              <Users className="w-4 h-4" />
              <span>Report Crowd</span>
            </button>
          </div>
        </div>
      </div>

      {/* 6. Personal Travel Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Journeys Planned', value: '18', sub: '+3 this week', icon: Navigation, color: 'text-emerald-400' },
          { label: 'Crowd Avoided', value: '42%', sub: 'Avg density reduction', icon: Activity, color: 'text-sky-400' },
          { label: 'Time Saved', value: '1.4 hrs', sub: 'Via smart routing', icon: Clock, color: 'text-amber-400' },
          { label: 'Community Contributions', value: '5 Reports', sub: 'Verified by network', icon: Users, color: 'text-emerald-400' }
        ].map((stat, i) => (
          <div key={i} className="p-5 rounded-2xl bg-[#111827] border border-slate-800/80 hover:border-slate-700 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-slate-400">{stat.label}</span>
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </div>
            <div className="text-2xl font-extrabold text-white font-mono">{stat.value}</div>
            <div className="text-[11px] text-slate-500 mt-1">{stat.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Quick Journey Planner + Recent Journeys */}
        <div className="lg:col-span-7 space-y-8">
          {/* 2. Quick Journey Planner */}
          <div className="p-6 rounded-2xl bg-[#111827] border border-slate-800">
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 text-sm font-bold text-white">
                <Navigation className="w-4 h-4 text-emerald-400" />
                <span>Quick Journey Planner</span>
              </div>
              <span className="text-[11px] text-slate-400">Calculates Least-Crowded Alternatives</span>
            </div>

            <form onSubmit={handleQuickPlan} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  Origin
                </label>
                <input
                  type="text"
                  value={quickSource}
                  onChange={(e) => setQuickSource(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  Destination
                </label>
                <input
                  type="text"
                  value={quickDest}
                  onChange={(e) => setQuickDest(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div className="pt-2 flex items-center justify-between">
                <div className="text-xs text-slate-400 flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  <span>Departs: <strong className="text-slate-200">Immediately</strong></span>
                </div>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all shadow-md shadow-emerald-500/20 flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Evaluate Routes</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>

          {/* 4. Recent Journeys */}
          <div className="p-6 rounded-2xl bg-[#111827] border border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-sky-400" />
                <span>Recent Journeys</span>
              </h3>
              <button
                onClick={() => navigate('/dashboard/plan')}
                className="text-xs text-emerald-400 hover:underline flex items-center gap-1"
              >
                <span>New Plan</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {recentJourneys.map((jrn, i) => (
                <div
                  key={jrn._id || i}
                  className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 flex items-center justify-between transition-colors"
                >
                  <div className="min-w-0 flex-1 pr-4">
                    <div className="flex items-center gap-2 text-xs font-semibold text-white truncate">
                      <span>{jrn.source?.name || 'Origin'}</span>
                      <ArrowRight className="w-3 h-3 text-slate-500 shrink-0" />
                      <span>{jrn.destination?.name || 'Destination'}</span>
                    </div>
                    <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1">
                      <span className="capitalize">{jrn.transportMode || 'walking'}</span>
                      <span>•</span>
                      <span className="capitalize text-emerald-400 font-medium">{jrn.travelPreference || 'balanced'}</span>
                      <span>•</span>
                      <span>{jrn.status || 'completed'}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate('/dashboard/plan', { state: { source: jrn.source?.name, destination: jrn.destination?.name } })}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors text-xs"
                    title="Re-run route evaluation"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Nearby Crowd Conditions + Active Alerts */}
        <div className="lg:col-span-5 space-y-8">
          {/* 3. Nearby Crowd Conditions */}
          <div className="p-6 rounded-2xl bg-[#111827] border border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Radio className="w-4 h-4 text-emerald-400" />
                <span>Nearby Crowd Conditions</span>
              </h3>
              <button
                onClick={() => navigate('/dashboard/map')}
                className="text-xs text-sky-400 hover:underline"
              >
                View Full Map
              </button>
            </div>

            <div className="space-y-3">
              {nearby.map((loc) => (
                <div
                  key={loc._id || loc.id}
                  className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/70 flex items-center justify-between hover:border-slate-700 transition-colors"
                >
                  <div className="min-w-0 pr-3">
                    <div className="text-xs font-semibold text-white truncate">
                      {loc.name}
                    </div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                      <span>{loc.category}</span>
                      {loc.distance && <span>• {loc.distance} km away</span>}
                    </div>
                  </div>

                  <div className="shrink-0 text-right">
                    <CrowdBadge
                      score={loc.currentCrowdScore || loc.baselineCrowd || 30}
                      size="sm"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 5. Active Crowd Alerts */}
          <div className="p-6 rounded-2xl bg-[#111827] border border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-400" />
                <span>Live Crowd Alerts</span>
              </h3>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                {alerts.length} Active
              </span>
            </div>

            <div className="space-y-3">
              {alerts.slice(0, 3).map((alert, i) => (
                <AlertCard
                  key={i}
                  type={alert.type || 'warning'}
                  title={alert.title}
                  message={alert.message}
                  timestamp={alert.timestamp}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
