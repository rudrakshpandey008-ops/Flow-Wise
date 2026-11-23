import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Bell, Search, Sparkles, ShieldCheck, MapPin } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export default function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useAuth();
  const location = useLocation();

  const getPageTitle = (path) => {
    if (path.includes('/dashboard/plan')) return 'Smart Journey Planner';
    if (path.includes('/dashboard/map')) return 'Interactive Live Crowd Map';
    if (path.includes('/dashboard/intelligence')) return 'Predictive Crowd Intelligence';
    if (path.includes('/dashboard/report')) return 'Community Crowd Reporting';
    if (path.includes('/dashboard/analytics')) return 'Mobility & Density Analytics';
    if (path.includes('/dashboard/profile')) return 'Personal Profile & Settings';
    return 'Traveler Dashboard';
  };

  return (
    <div className="flex h-screen bg-[#0B1120] text-[#F8FAFC] overflow-hidden">
      {/* Sidebar */}
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 bg-[#111827] border-b border-slate-800 flex items-center justify-between px-6 shrink-0 z-10">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-bold text-white tracking-tight">
              {getPageTitle(location.pathname)}
            </h1>
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-800/80 border border-slate-700/60 text-[11px] text-slate-300 font-medium">
              <MapPin className="w-3 h-3 text-emerald-400" />
              Mathura & Vrindavan Pilot Zone
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Demo indicator */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Full-Stack Demo Mode Active</span>
            </div>

            {/* Notification Bell */}
            <div className="relative">
              <button
                className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors relative cursor-pointer"
                title="Active Crowd Notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-slate-900 animate-pulse" />
              </button>
            </div>

            {/* User Avatar */}
            <div className="flex items-center gap-3 pl-2 border-l border-slate-800">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-500 to-sky-400 text-slate-950 font-bold flex items-center justify-center text-xs shadow-sm">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Page Body */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
