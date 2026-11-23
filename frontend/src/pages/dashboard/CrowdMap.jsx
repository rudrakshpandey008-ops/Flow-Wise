import React, { useState, useEffect } from 'react';
import {
  Map,
  Filter,
  RefreshCw,
  Search,
  Users,
  Clock,
  TrendingUp,
  AlertTriangle,
  Compass,
  Layers,
  ChevronRight,
  Info,
  X
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker, useMap } from 'react-leaflet';
import L from 'leaflet';
import CrowdBadge from '../../components/CrowdBadge';
import { getNearbyData, getLocationCrowd } from '../../utils/api';
import { demoLocations } from '../../utils/demoData';

// Helper to center map on selected location
function RecenterMap({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.setView(position, 14, { animate: true });
    }
  }, [position, map]);
  return null;
}

export default function CrowdMap() {
  const [locations, setLocations] = useState(demoLocations);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeLocation, setActiveLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState([27.53, 77.68]);

  const loadLocations = async () => {
    setLoading(true);
    try {
      const res = await getNearbyData(27.5046, 77.6713, 30);
      if (res && res.locations && res.locations.length > 0) {
        setLocations(res.locations);
      }
    } catch (e) {
      console.log('Using demo locations for map');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLocations();
  }, []);

  const getMarkerColor = (score) => {
    if (score <= 25) return '#22C55E';
    if (score <= 50) return '#38BDF8';
    if (score <= 75) return '#F59E0B';
    return '#EF4444';
  };

  // Filter locations
  const filtered = locations.filter((loc) => {
    const matchesCategory = selectedCategory === 'All' || loc.category === selectedCategory;
    const score = loc.currentCrowdScore || loc.baselineCrowd || 30;
    let matchesLevel = true;
    if (selectedLevel === 'Low') matchesLevel = score <= 25;
    else if (selectedLevel === 'Moderate') matchesLevel = score > 25 && score <= 50;
    else if (selectedLevel === 'High') matchesLevel = score > 50 && score <= 75;
    else if (selectedLevel === 'Extremely High') matchesLevel = score > 75;

    const matchesSearch = loc.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesLevel && matchesSearch;
  });

  const categories = ['All', 'Temple', 'Transit', 'Ghat', 'Market', 'Heritage'];

  return (
    <div className="space-y-4 max-w-7xl mx-auto">
      {/* Top Controls Bar */}
      <div className="p-4 rounded-2xl bg-[#111827] border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 mr-2">
            <Filter className="w-3.5 h-3.5 text-emerald-400" />
            Filter:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-emerald-500 text-slate-950 font-bold'
                  : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Search Box */}
          <div className="relative flex-1 sm:w-60">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search landmark..."
              className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <button
            onClick={loadLocations}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 transition-colors border border-slate-700 cursor-pointer"
            title="Refresh Map"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main Map Viewport + Side Drawer */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-800 h-[640px] bg-slate-950">
        <MapContainer
          center={[27.535, 77.685]}
          zoom={12}
          scrollWheelZoom={true}
          style={{ width: '100%', height: '100%' }}
        >
          <RecenterMap position={selectedPosition} />

          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {filtered.map((loc) => {
            const score = loc.currentCrowdScore || loc.baselineCrowd || 30;
            const color = getMarkerColor(score);

            return (
              <CircleMarker
                key={loc._id || loc.id}
                center={[loc.latitude, loc.longitude]}
                radius={score > 75 ? 16 : score > 50 ? 13 : 10}
                pathOptions={{
                  fillColor: color,
                  fillOpacity: 0.75,
                  color: '#0B1120',
                  weight: 2
                }}
                eventHandlers={{
                  click: () => {
                    setActiveLocation(loc);
                    setSelectedPosition([loc.latitude, loc.longitude]);
                  }
                }}
              >
                <Popup>
                  <div className="text-xs text-slate-900 font-sans">
                    <strong className="text-sm block">{loc.name}</strong>
                    <div className="mt-1 flex items-center justify-between gap-4">
                      <span>Category: {loc.category}</span>
                      <strong style={{ color }}>{score}% Crowd</strong>
                    </div>
                  </div>
                </Popup>
              </CircleMarker>
            );
          })}
        </MapContainer>

        {/* Floating Map Legend */}
        <div className="absolute top-4 left-4 z-[1000] p-3 rounded-xl bg-slate-950/90 border border-slate-800 backdrop-blur-md shadow-xl text-[11px] space-y-1.5 hidden sm:block">
          <div className="font-bold text-slate-200 flex items-center justify-between gap-4">
            <span>Crowd Density Index</span>
            <span className="text-[10px] text-slate-500 font-normal">Mathura & Vrindavan</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-slate-300">0 - 25% (Low)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-400" />
            <span className="text-slate-300">26 - 50% (Moderate)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <span className="text-slate-300">51 - 75% (High)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <span className="text-slate-300">76 - 100% (Extremely High)</span>
          </div>
        </div>

        {/* Selected Location Detail Card (Requirement 9) */}
        {activeLocation && (
          <div className="absolute bottom-6 left-6 right-6 sm:left-auto sm:right-6 sm:w-96 z-[1000] p-5 rounded-2xl bg-slate-900/95 border border-slate-700 shadow-2xl backdrop-blur-xl space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 uppercase font-semibold">
                  {activeLocation.category}
                </span>
                <h3 className="text-base font-bold text-white mt-1.5">{activeLocation.name}</h3>
              </div>
              <button
                onClick={() => setActiveLocation(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 py-2 border-y border-slate-800">
              <div>
                <span className="text-[10px] text-slate-400 block">Current Crowd Score</span>
                <div className="mt-1">
                  <CrowdBadge
                    score={activeLocation.currentCrowdScore || activeLocation.baselineCrowd || 35}
                    size="md"
                  />
                </div>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Community Reports</span>
                <div className="text-sm font-bold text-white mt-1 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-sky-400" />
                  <span>{activeLocation.reportCount || 42} verified</span>
                </div>
              </div>
            </div>

            <div className="text-xs space-y-1.5 text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-400">Predicted Crowd (Next Hour):</span>
                <strong className="text-amber-400 font-medium">Moderate (48%)</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Peak Morning Hours:</span>
                <span className="text-slate-200">
                  {activeLocation.peakHours?.morning?.start || 6}:00 - {activeLocation.peakHours?.morning?.end || 11}:00
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Last Sensor / User Sync:</span>
                <span className="text-slate-400 font-mono text-[10px]">Just now</span>
              </div>
            </div>

            <div className="pt-2">
              <p className="text-[10px] text-slate-500 italic">
                Demonstration crowd density synthesized from historical flow curves & simulated real-time telemetry.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
