import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Navigation,
  Clock,
  MapPin,
  Shield,
  Activity,
  Users,
  TrendingUp,
  Heart,
  ChevronRight,
  ArrowRight,
  Compass,
  Zap,
  Layers,
  Sparkles,
  BarChart3
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Logo from '../components/Logo';
import { demoLocations } from '../utils/demoData';

export default function LandingPage() {
  const navigate = useNavigate();
  const [source, setSource] = useState('Mathura Junction Railway Station');
  const [destination, setDestination] = useState('Banke Bihari Temple');
  const [time, setTime] = useState('17:30');

  const handlePlanJourney = (e) => {
    e.preventDefault();
    // Navigate to plan page or register
    navigate('/dashboard/plan', {
      state: { source, destination, departureTime: time }
    });
  };

  return (
    <div className="min-h-screen bg-[#0B1120] text-[#F8FAFC]">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background glow and subtle mesh */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-emerald-500/10 blur-[130px] pointer-events-none rounded-full" />
        <div className="absolute top-1/3 right-1/4 w-[450px] h-[350px] bg-sky-500/10 blur-[110px] pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto text-center relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/60 text-xs font-medium text-emerald-400 mb-8 shadow-inner backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Next-Gen Urban Mobility & Crowd AI Platform
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-6">
            <span className="block">FLOWWISE</span>
            <span className="bg-gradient-to-r from-emerald-400 via-sky-400 to-emerald-300 bg-clip-text text-transparent">
              Navigate Smarter. Travel Freer.
            </span>
          </h1>

          <p className="max-w-3xl mx-auto text-lg sm:text-xl text-slate-300 mb-12 font-light leading-relaxed">
            &ldquo;Your journey is more than reaching a destination. It's about getting there without the crowd.&rdquo;
          </p>

          {/* Interactive Hero Journey Planner Card */}
          <div className="max-w-4xl mx-auto bg-slate-900/80 backdrop-blur-xl border border-slate-800 p-6 sm:p-8 rounded-2xl shadow-2xl shadow-black/50 text-left">
            <div className="flex items-center justify-between mb-5 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-200">
                <Navigation className="w-4 h-4 text-emerald-400" />
                <span>Instant Route & Crowd Exposure Calculator</span>
              </div>
              <span className="text-xs text-slate-400 font-mono">DEMO REGION: MATHURA-VRINDAVAN</span>
            </div>

            <form onSubmit={handlePlanJourney} className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end">
              <div className="sm:col-span-4">
                <label className="block text-xs font-medium text-slate-400 mb-1.5 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  Starting Point
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                    placeholder="Enter origin location"
                    required
                  />
                </div>
              </div>

              <div className="sm:col-span-4">
                <label className="block text-xs font-medium text-slate-400 mb-1.5 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                  Destination
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                    placeholder="Enter destination"
                    required
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-slate-400 mb-1.5 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-sky-400" />
                  Departure
                </label>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              <div className="sm:col-span-2">
                <button
                  type="submit"
                  className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl transition-all shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 flex items-center justify-center gap-1.5 group cursor-pointer"
                >
                  <span>Plan</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </form>

            <div className="mt-4 pt-3 flex flex-wrap items-center gap-2 text-xs text-slate-400">
              <span className="text-slate-500 font-medium">Quick Suggestions:</span>
              {['Prem Mandir', 'Krishna Janmabhoomi', 'Vishram Ghat'].map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setDestination(item)}
                  className="px-2.5 py-1 rounded-md bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Key Metrics Strip */}
      <section className="border-y border-slate-800/80 bg-slate-950/60 py-10 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-emerald-400 font-mono">35% - 65%</div>
            <div className="text-xs sm:text-sm text-slate-400 mt-1">Crowd Exposure Reduction</div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-sky-400 font-mono">17+ Hotspots</div>
            <div className="text-xs sm:text-sm text-slate-400 mt-1">Real-Time Monitored Locations</div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-amber-400 font-mono">3 Alternatives</div>
            <div className="text-xs sm:text-sm text-slate-400 mt-1">Ranked per Journey Request</div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-white font-mono">&lt; 150ms</div>
            <div className="text-xs sm:text-sm text-slate-400 mt-1">Optimization Algorithm Speed</div>
          </div>
        </div>
      </section>

      {/* How FLOWWISE Works Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-bold tracking-widest text-emerald-400 uppercase mb-3">HOW IT WORKS</h2>
          <h3 className="text-3xl sm:text-4xl font-bold text-white">
            Smart Navigation Powered by Crowd Intelligence
          </h3>
          <p className="text-slate-400 mt-4 text-base">
            Conventional navigation only optimizes for distance and time. FLOWWISE adds real-time density and predictive exposure to calculate the true comfort of your route.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            {
              step: '01',
              title: 'Input Journey',
              desc: 'Select your origin, destination, departure time, and transport mode (walking, car, transit, 2-wheeler).',
              icon: Navigation
            },
            {
              step: '02',
              title: 'Crowd Scoring',
              desc: 'Backend analyzes community reports, historical curves, and peak multipliers across all route waypoints.',
              icon: Activity
            },
            {
              step: '03',
              title: 'Multi-Objective Ranking',
              desc: 'Dynamic formula balances travel time, crowd exposure, and distance to rank the three best alternatives.',
              icon: Sparkles
            },
            {
              step: '04',
              title: 'Travel Freer',
              desc: 'Select your route, view live heatmaps, and submit real-time reports to empower the community.',
              icon: Compass
            }
          ].map((item, idx) => (
            <div
              key={idx}
              className="relative p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-emerald-500/50 transition-all hover:-translate-y-1 group"
            >
              <div className="text-4xl font-extrabold text-slate-800 group-hover:text-emerald-500/20 font-mono mb-4 transition-colors">
                {item.step}
              </div>
              <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-emerald-400 mb-4 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-colors">
                <item.icon className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-bold text-white mb-2">{item.title}</h4>
              <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Core Platform Pillars */}
      <section className="py-20 bg-slate-950/70 border-t border-slate-800/70 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold tracking-widest text-sky-400 uppercase mb-3">ENGINEERING FOUNDATIONS</h2>
            <h3 className="text-3xl sm:text-4xl font-bold text-white">Built for Congested Urban & Pilgrimage Hubs</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-6">
                <Activity className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-white mb-3">Real-Time Crowd Intelligence</h4>
              <p className="text-slate-400 text-sm leading-relaxed mb-4">
                Every landmark is continuously scored between 0 and 100 using verified community reports, sensor inputs, and decay-weighted heuristics.
              </p>
              <ul className="text-xs text-slate-300 space-y-2">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Recent reports receive exponential time weight
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Clearly distinguishes live vs predicted vs simulated
                </li>
              </ul>
            </div>

            <div className="p-8 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all">
              <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 mb-6">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-white mb-3">Predictive Crowd Analytics</h4>
              <p className="text-slate-400 text-sm leading-relaxed mb-4">
                Planning ahead? FLOWWISE forecasts crowd density at your specific arrival time using historical day-of-week and peak-hour models.
              </p>
              <ul className="text-xs text-slate-300 space-y-2">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                  24-hour predictive curves by location category
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                  Intelligent alternate arrival recommendations
                </li>
              </ul>
            </div>

            <div className="p-8 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-6">
                <Users className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-white mb-3">Community-Powered Reporting</h4>
              <p className="text-slate-400 text-sm leading-relaxed mb-4">
                Fellow travelers and local pilgrims submit real-time crowd observations. Socket.IO immediately broadcasts updates across all active maps.
              </p>
              <ul className="text-xs text-slate-300 space-y-2">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  One-tap reporting with spam cooldown validation
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  Live websocket broadcasts to connected devices
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Route Optimisation Formula Spotlight */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 p-8 sm:p-12 rounded-3xl border border-slate-800">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">TRANSPARENT ALGORITHM</span>
              <h3 className="text-2xl sm:text-3xl font-bold text-white mt-2 mb-4">
                The FLOWWISE Route Scoring Formula
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-6">
                Instead of opaque black boxes, FLOWWISE scores every potential path with a normalised multi-attribute decision matrix:
              </p>

              <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-xl font-mono text-sm text-emerald-300 overflow-x-auto mb-6">
                Route Score = 0.35 × Travel Time + 0.45 × Crowd Exposure + 0.10 × Distance + 0.10 × Penalty
              </div>

              <div className="grid grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                  <div className="text-sky-400 font-bold mb-1">Fastest Mode</div>
                  <div className="text-slate-400">70% Time, 15% Crowd, 10% Distance</div>
                </div>
                <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                  <div className="text-emerald-400 font-bold mb-1">Least Crowded</div>
                  <div className="text-slate-400">70% Crowd, 15% Time, 10% Distance</div>
                </div>
                <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                  <div className="text-amber-400 font-bold mb-1">Balanced Mode</div>
                  <div className="text-slate-400">45% Crowd, 35% Time, 10% Distance</div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 bg-slate-950 p-6 rounded-2xl border border-slate-800/80">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold text-slate-300">SAMPLE COMPARISON</span>
                <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-medium">Optimal Comfort</span>
              </div>
              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-slate-900/80 border border-emerald-500/40">
                  <div className="flex justify-between items-center text-xs font-bold text-emerald-400">
                    <span>Route B (Least Crowded)</span>
                    <span>Score: 25.8</span>
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                    <span>32 mins • 9.1 km</span>
                    <span className="text-emerald-400 font-medium">Crowd: 20% (Low)</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-300">
                    <span>Route C (Balanced)</span>
                    <span>Score: 38.0</span>
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                    <span>28 mins • 8.7 km</span>
                    <span className="text-sky-400 font-medium">Crowd: 45% (Moderate)</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-400">
                    <span>Route A (Fastest)</span>
                    <span>Score: 70.5</span>
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                    <span>25 mins • 8.2 km</span>
                    <span className="text-rose-400 font-medium">Crowd: 85% (Extreme)</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => navigate('/dashboard/plan')}
                className="w-full mt-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Launch Interactive Demo</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 text-center px-4">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
            Ready to Experience Crowd-Aware Navigation?
          </h3>
          <p className="text-slate-400 max-w-2xl mx-auto mb-8 text-base">
            Access the live interactive crowd map, explore real-time alternatives, or run simulated journeys in Mathura & Vrindavan.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => navigate('/register')}
              className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl shadow-lg shadow-emerald-500/25 transition-all cursor-pointer flex items-center gap-2"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl border border-slate-700 transition-all cursor-pointer"
            >
              Open Live Dashboard
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <Logo size="sm" />
            <span className="text-xs text-slate-500 border-l border-slate-800 pl-3">
              Crowdedness-Aware Journey Planner
            </span>
          </div>

          <div className="text-xs text-slate-500 flex items-center gap-4">
            <span>Leaflet & OpenStreetMap</span>
            <span>•</span>
            <span>OSRM Engine</span>
            <span>•</span>
            <span>Socket.IO Live Gateway</span>
          </div>

          <div className="text-xs text-slate-500">
            © 2026 FLOWWISE. Built for Mobility Tech Hackathons.
          </div>
        </div>
      </footer>
    </div>
  );
}
