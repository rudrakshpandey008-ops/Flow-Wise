import React, { useState } from 'react';
import {
  UserCircle,
  Mail,
  Shield,
  Sliders,
  Bell,
  CheckCircle2,
  Save,
  Footprints,
  Bike,
  Bus,
  Car,
  Compass,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export default function Profile() {
  const { user } = useAuth();

  const [name, setName] = useState(user?.name || 'Radhika Sharma');
  const [email] = useState(user?.email || 'demo@flowwise.app');
  const [navMode, setNavMode] = useState(user?.preferences?.defaultNavigationMode || 'least_crowded');
  const [transportMode, setTransportMode] = useState(user?.preferences?.transportMode || 'walking');
  const [alerts, setAlerts] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
          <UserCircle className="w-6 h-6 text-emerald-400" />
          <span>Traveler Profile & Preferences</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Customize your routing weights, comfort thresholds, and notifications for all journey calculations.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>Preferences updated successfully! Future route plans will prioritize these settings.</span>
        </div>
      )}

      {/* Account Info Card */}
      <div className="p-6 rounded-3xl bg-[#111827] border border-slate-800 space-y-6">
        <div className="flex items-center gap-4 pb-6 border-b border-slate-800">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-sky-400 text-slate-950 font-black text-2xl flex items-center justify-center shadow-lg">
            {name ? name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">{name}</h3>
            <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
              <Mail className="w-3.5 h-3.5 text-slate-500" />
              <span>{email}</span>
            </p>
            <span className="inline-block mt-2 text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-semibold">
              Verified Mobility Traveler
            </span>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                Email Address (Read-only)
              </label>
              <input
                type="email"
                value={email}
                disabled
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-500 cursor-not-allowed"
              />
            </div>
          </div>

          {/* Navigation Preferences */}
          <div className="pt-4 border-t border-slate-800 space-y-4">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Compass className="w-4 h-4 text-sky-400" />
              <span>Default Navigation Preference</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: 'fastest', label: 'Fastest Route', desc: 'Prioritizes travel time (70% weight)' },
                { id: 'least_crowded', label: 'Least Crowded', desc: 'Avoids heavy congestion (70% crowd weight)' },
                { id: 'balanced', label: 'Balanced Mode', desc: 'Optimal compromise of time and density' }
              ].map(opt => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setNavMode(opt.id)}
                  className={`p-3.5 rounded-xl border text-left transition-colors cursor-pointer ${
                    navMode === opt.id
                      ? 'border-emerald-500 bg-emerald-500/15 text-white font-semibold'
                      : 'border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <span className="text-xs font-bold block mb-1">{opt.label}</span>
                  <span className="text-[11px] opacity-80 block">{opt.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Default Transport Mode */}
          <div className="pt-4 border-t border-slate-800 space-y-4">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Footprints className="w-4 h-4 text-emerald-400" />
              <span>Primary Transportation Mode</span>
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { id: 'walking', label: 'Walking', icon: Footprints },
                { id: 'two_wheeler', label: '2-Wheeler', icon: Bike },
                { id: 'transit', label: 'Public Transit', icon: Bus },
                { id: 'car', label: 'Auto / Car', icon: Car }
              ].map(item => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setTransportMode(item.id)}
                  className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition-colors cursor-pointer ${
                    transportMode === item.id
                      ? 'border-sky-400 bg-sky-400/15 text-white font-bold'
                      : 'border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="text-xs">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Alerts Toggle */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-white block">Real-Time Crowd Alert Push</span>
              <span className="text-[11px] text-slate-400">Receive warnings when destination crowd exceeds 75%</span>
            </div>
            <button
              type="button"
              onClick={() => setAlerts(!alerts)}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                alerts ? 'bg-emerald-500' : 'bg-slate-700'
              }`}
            >
              <span className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                alerts ? 'left-7' : 'left-1'
              }`} />
            </button>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all shadow-md shadow-emerald-500/20 flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Preferences</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
