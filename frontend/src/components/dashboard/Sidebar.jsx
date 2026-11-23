import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Navigation,
  Map,
  Brain,
  MessageSquarePlus,
  BarChart3,
  UserCircle,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  Radio
} from 'lucide-react';
import Logo from '../Logo';
import { useAuth } from '../../contexts/AuthContext';

export default function Sidebar({ collapsed, setCollapsed }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { to: '/dashboard', label: 'Overview', icon: LayoutDashboard, end: true },
    { to: '/dashboard/plan', label: 'Plan Journey', icon: Navigation },
    { to: '/dashboard/map', label: 'Live Crowd Map', icon: Map },
    { to: '/dashboard/intelligence', label: 'Crowd Intelligence', icon: Brain },
    { to: '/dashboard/report', label: 'Report Crowd', icon: MessageSquarePlus },
    { to: '/dashboard/analytics', label: 'Analytics', icon: BarChart3 },
    { to: '/dashboard/profile', label: 'Profile & Settings', icon: UserCircle },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <aside
      className={`relative z-20 flex flex-col bg-[#111827] border-r border-slate-800 transition-all duration-300 ease-in-out ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Header / Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800">
        {!collapsed && <Logo size="md" />}
        {collapsed && (
          <div className="mx-auto">
            <Logo size="sm" showText={false} />
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer ${
            collapsed ? 'hidden' : 'block'
          }`}
          title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>

      {/* Live Status Pill */}
      <div className="px-4 py-3 border-b border-slate-800/80">
        <div className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-slate-900/90 border border-emerald-500/30 ${collapsed ? 'justify-center' : ''}`}>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          {!collapsed && (
            <div className="flex-1 flex items-center justify-between text-[11px]">
              <span className="text-emerald-400 font-semibold tracking-wide">LIVE GATEWAY</span>
              <span className="text-slate-400 font-mono text-[10px]">OSRM / OSM</span>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              } ${collapsed ? 'justify-center' : ''}`
            }
            title={collapsed ? item.label : undefined}
          >
            <item.icon className="w-5 h-5 shrink-0" />
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Collapse toggle button on collapsed mode */}
      {collapsed && (
        <div className="p-2 border-t border-slate-800 text-center">
          <button
            onClick={() => setCollapsed(false)}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors mx-auto"
            title="Expand Sidebar"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* User Footer */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/60">
        {!collapsed ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-sky-500 text-slate-950 font-bold flex items-center justify-center shrink-0 text-sm">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-white truncate">{user?.name || 'Traveler'}</p>
                <p className="text-[11px] text-slate-400 truncate">{user?.email || 'demo@flowwise.app'}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors cursor-pointer"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex justify-center">
            <button
              onClick={handleLogout}
              className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors cursor-pointer"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
