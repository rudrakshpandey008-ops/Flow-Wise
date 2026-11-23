import React from 'react';
import { Clock, MapPin, Star, TrendingDown, Shield, Check } from 'lucide-react';
import CrowdBadge from './CrowdBadge';

export default function RouteCard({ route, isSelected, onSelect }) {
  const {
    label,
    recommendation,
    recommendationType,
    travelTime,
    duration,
    distance,
    crowdDensity,
    crowdExposure,
    comfortScore,
    routeScore
  } = route;

  const displayTime = travelTime ?? duration ?? 25;
  const displayComfort = comfortScore ?? 75;

  const getBadgeColor = () => {
    const text = (recommendation || '').toLowerCase();
    if (text.includes('fastest')) return 'bg-sky-500/15 text-sky-400 border-sky-500/30';
    if (text.includes('least') || text.includes('quiet')) return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
    return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
  };

  const crowdBarColor =
    crowdDensity <= 25
      ? 'bg-emerald-500'
      : crowdDensity <= 50
      ? 'bg-sky-400'
      : crowdDensity <= 75
      ? 'bg-amber-400'
      : 'bg-rose-500';

  const starCount = Math.min(5, Math.max(1, Math.round(displayComfort / 20)));
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <Star
        key={i}
        className={`w-3.5 h-3.5 ${
          i <= starCount ? 'text-amber-400 fill-amber-400' : 'text-slate-700'
        }`}
      />
    );
  }

  return (
    <div
      className={`relative bg-[#111827] rounded-xl border p-4.5 cursor-pointer transition-all ${
        isSelected
          ? 'border-emerald-500 shadow-[0_0_20px_rgba(34,197,94,0.18)] bg-slate-900/90'
          : 'border-slate-800 hover:border-slate-700 hover:bg-slate-900/40'
      }`}
      onClick={() => onSelect && onSelect(route)}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <span className="text-base font-bold text-white">{label}</span>
          {isSelected && (
            <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30">
              <Check className="w-3 h-3" /> Active
            </span>
          )}
        </div>
        <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${getBadgeColor()}`}>
          {recommendation || 'Balanced Route'}
        </span>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-2.5 mb-3.5 text-xs">
        <div className="flex items-center gap-2">
          <Clock className="w-3.5 h-3.5 text-sky-400" />
          <span className="text-slate-400">Time:</span>
          <span className="text-white font-mono font-bold">{displayTime} mins</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="w-3.5 h-3.5 text-sky-400" />
          <span className="text-slate-400">Dist:</span>
          <span className="text-white font-mono font-bold">{distance} km</span>
        </div>
        <div className="flex items-center gap-2">
          <TrendingDown className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-slate-400">Exposure:</span>
          <span className="text-white font-mono font-bold">{crowdExposure}%</span>
        </div>
        <div className="flex items-center gap-2">
          <Shield className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-slate-400">Comfort:</span>
          <span className="text-white font-mono font-bold">{typeof displayComfort === 'number' ? displayComfort.toFixed(0) : displayComfort}/100</span>
        </div>
      </div>

      {/* Crowd Density Bar */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[11px] text-slate-400">Crowd Density</span>
          <CrowdBadge score={crowdDensity} size="sm" />
        </div>
        <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full ${crowdBarColor} transition-all duration-500`}
            style={{ width: `${crowdDensity}%` }}
          />
        </div>
      </div>

      {/* Comfort Stars & Route Score */}
      <div className="flex items-center justify-between mb-3 text-xs">
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] text-slate-400">Comfort:</span>
          <div className="flex items-center gap-0.5">{stars}</div>
        </div>
        {routeScore !== undefined && (
          <span className="text-[10px] text-slate-500 font-mono">
            Score: {routeScore}
          </span>
        )}
      </div>

      {/* Select Button */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onSelect && onSelect(route);
        }}
        className={`w-full py-2 rounded-xl font-bold text-xs transition-all cursor-pointer ${
          isSelected
            ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
            : 'bg-slate-900 border border-slate-700 text-slate-200 hover:border-emerald-500/60 hover:text-white'
        }`}
      >
        {isSelected ? '✓ Route Active on Map' : 'Select Route'}
      </button>
    </div>
  );
}
