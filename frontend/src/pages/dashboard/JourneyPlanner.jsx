import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Navigation,
  Clock,
  MapPin,
  Car,
  Bike,
  Footprints,
  Bus,
  Shield,
  Activity,
  Sparkles,
  ArrowRight,
  TrendingDown,
  Info,
  CheckCircle2,
  SlidersHorizontal,
  RefreshCw
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import RouteCard from '../../components/RouteCard';
import CrowdBadge from '../../components/CrowdBadge';
import { planJourney, getNearbyData } from '../../utils/api';
import { demoLocations, demoRoutes } from '../../utils/demoData';

// Map Auto-Fitter Helper
function ChangeView({ bounds }) {
  const map = useMap();
  useEffect(() => {
    if (bounds && bounds.length > 0) {
      map.fitBounds(bounds, { padding: [40, 40] });
    }
  }, [bounds, map]);
  return null;
}

// Custom Leaflet Icons using standard SVG DivIcons to eliminate Vite asset 404s
const createCustomIcon = (color, label = '') => {
  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div style="
        background-color: ${color};
        width: 28px;
        height: 28px;
        border-radius: 50%;
        border: 3px solid #0B1120;
        box-shadow: 0 0 10px ${color}80;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #0B1120;
        font-weight: bold;
        font-size: 11px;
      ">
        ${label}
      </div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -14],
  });
};

const startIcon = createCustomIcon('#22C55E', 'S');
const endIcon = createCustomIcon('#EF4444', 'D');
const waypointIcon = createCustomIcon('#38BDF8', '•');

export default function JourneyPlanner() {
  const locationState = useLocation().state;

  const [sourceName, setSourceName] = useState(locationState?.source || 'Mathura Junction Railway Station');
  const [destName, setDestName] = useState(locationState?.destination || 'Banke Bihari Temple');
  const [departureTime, setDepartureTime] = useState(locationState?.departureTime || '17:30');
  const [transportMode, setTransportMode] = useState('walking');
  const [preference, setPreference] = useState('least_crowded');

  const [routes, setRoutes] = useState(demoRoutes);
  const [selectedRouteIdx, setSelectedRouteIdx] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [alerts, setAlerts] = useState([]);

  // Fetch initial route evaluation
  const handleCalculateRoutes = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await planJourney({
        source: { name: sourceName },
        destination: { name: destName },
        departureTime,
        transportMode,
        navigationPreference: preference
      });

      if (response && response.routes && response.routes.length > 0) {
        setRoutes(response.routes);
        setSelectedRouteIdx(0);
        if (response.alerts) setAlerts(response.alerts);
      }
    } catch (err) {
      console.warn('API route calculation notice:', err.message, 'Falling back to dynamic demo engine');
      // If offline/demo, re-rank demo routes dynamically
      const updated = demoRoutes.map((r, i) => ({
        ...r,
        recommendation: preference === 'least_crowded' && i === 1 ? 'Least Crowded' :
                        preference === 'fastest' && i === 0 ? 'Fastest Route' :
                        'Balanced Route'
      }));
      setRoutes(updated);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleCalculateRoutes();
  }, [preference, transportMode]);

  const currentRoute = routes[selectedRouteIdx] || routes[0];

  // Derive coordinates for map polylines
  const polylinePositions = currentRoute?.waypoints?.map(wp => [wp.lat, wp.lng]) || [
    [27.4921, 77.6735],
    [27.5300, 77.6850],
    [27.5729, 77.6961]
  ];

  const mapBounds = polylinePositions.length > 0 ? polylinePositions : [
    [27.4921, 77.6735],
    [27.5729, 77.6961]
  ];

  const startCoord = polylinePositions[0];
  const endCoord = polylinePositions[polylinePositions.length - 1];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Navigation className="w-6 h-6 text-emerald-400" />
            <span>Smart Journey Planner</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Dynamic multi-attribute route evaluation: travel time, distance, and crowd exposure.
          </p>
        </div>

        {/* Navigation Preference Selector */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800 self-start sm:self-auto">
          {[
            { id: 'fastest', label: 'Fastest' },
            { id: 'least_crowded', label: 'Least Crowded' },
            { id: 'balanced', label: 'Balanced' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setPreference(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                preference === tab.id
                  ? 'bg-emerald-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Left Controls & Comparison Cards, Right Interactive Map */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (5 Cols): Inputs + 3 Route Comparison Cards */}
        <div className="lg:col-span-5 space-y-6">
          {/* Input Parameters Box */}
          <div className="p-5 rounded-2xl bg-[#111827] border border-slate-800 space-y-4">
            <form onSubmit={handleCalculateRoutes} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  Origin
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={sourceName}
                    onChange={(e) => setSourceName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    placeholder="Starting point"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  Destination
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={destName}
                    onChange={(e) => setDestName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    placeholder="Destination point"
                    required
                  />
                </div>
              </div>

              {/* Mode & Departure Row */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-sky-400" />
                    Departure
                  </label>
                  <input
                    type="time"
                    value={departureTime}
                    onChange={(e) => setDepartureTime(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                    Transport Mode
                  </label>
                  <div className="grid grid-cols-4 gap-1">
                    {[
                      { id: 'walking', icon: Footprints, title: 'Walking' },
                      { id: 'two_wheeler', icon: Bike, title: '2-Wheeler' },
                      { id: 'transit', icon: Bus, title: 'Transit' },
                      { id: 'car', icon: Car, title: 'Car' }
                    ].map(m => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setTransportMode(m.id)}
                        className={`p-1.5 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
                          transportMode === m.id
                            ? 'bg-emerald-500 text-slate-950 font-bold'
                            : 'bg-slate-900 text-slate-400 hover:text-white'
                        }`}
                        title={m.title}
                      >
                        <m.icon className="w-3.5 h-3.5" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Scoring Route Alternatives...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Recalculate Routes & Exposure</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* 3 Best Route Alternatives Comparison Cards */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-white px-1">
              <span>Evaluated Route Alternatives</span>
              <span className="text-[11px] text-emerald-400 font-mono">3 RANKED BY AI</span>
            </div>

            {routes.map((route, idx) => (
              <RouteCard
                key={route.label || idx}
                route={route}
                isSelected={selectedRouteIdx === idx}
                onSelect={() => setSelectedRouteIdx(idx)}
              />
            ))}
          </div>
        </div>

        {/* Right Column (7 Cols): Interactive Leaflet Map */}
        <div className="lg:col-span-7 bg-[#111827] border border-slate-800 rounded-2xl overflow-hidden p-4 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <strong className="text-white font-medium">Selected Path: {currentRoute.label} ({currentRoute.recommendation || 'Active'})</strong>
            </div>
            <div className="flex items-center gap-3 text-[11px] text-slate-400 font-mono">
              <span>{currentRoute.travelTime} mins</span>
              <span>•</span>
              <span>{currentRoute.distance} km</span>
              <span>•</span>
              <span className="text-emerald-400">{currentRoute.crowdDensity}% Crowd</span>
            </div>
          </div>

          {/* Leaflet Map Container */}
          <div className="relative w-full h-[520px] rounded-xl overflow-hidden border border-slate-800">
            <MapContainer
              center={[27.53, 77.68]}
              zoom={12}
              scrollWheelZoom={true}
              style={{ width: '100%', height: '100%' }}
            >
              <ChangeView bounds={mapBounds} />

              {/* Dark Theme TileLayer */}
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {/* Start Marker */}
              {startCoord && (
                <Marker position={startCoord} icon={startIcon}>
                  <Popup>
                    <div className="text-xs font-semibold text-slate-900">
                      <strong>Starting Point:</strong><br />
                      {sourceName}
                    </div>
                  </Popup>
                </Marker>
              )}

              {/* Destination Marker */}
              {endCoord && (
                <Marker position={endCoord} icon={endIcon}>
                  <Popup>
                    <div className="text-xs font-semibold text-slate-900">
                      <strong>Destination:</strong><br />
                      {destName}
                    </div>
                  </Popup>
                </Marker>
              )}

              {/* Route Polyline */}
              <Polyline
                positions={polylinePositions}
                color={
                  currentRoute.crowdDensity <= 25 ? '#22C55E' :
                  currentRoute.crowdDensity <= 50 ? '#38BDF8' :
                  currentRoute.crowdDensity <= 75 ? '#F59E0B' : '#EF4444'
                }
                weight={6}
                opacity={0.85}
              />

              {/* Waypoint Markers */}
              {polylinePositions.slice(1, -1).map((wp, i) => (
                <Marker key={i} position={wp} icon={waypointIcon}>
                  <Popup>
                    <div className="text-xs text-slate-900">
                      Waypoint {i + 1}
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>

            {/* Map Legend Overlay */}
            <div className="absolute bottom-4 right-4 z-[1000] p-3 rounded-xl bg-slate-950/90 border border-slate-800 text-[11px] space-y-1.5 shadow-xl backdrop-blur-md">
              <div className="font-bold text-slate-200 mb-1">Density Legend</div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="text-slate-300">0-25% Low Crowd</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-400" />
                <span className="text-slate-300">26-50% Moderate</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <span className="text-slate-300">51-75% High</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <span className="text-slate-300">76-100% Extreme</span>
              </div>
            </div>
          </div>

          {/* Route Metrics Breakdown Footer */}
          <div className="grid grid-cols-4 gap-3 text-center pt-2">
            <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Travel Time</span>
              <strong className="text-sm text-white font-mono">{currentRoute.travelTime} mins</strong>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Distance</span>
              <strong className="text-sm text-white font-mono">{currentRoute.distance} km</strong>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Crowd Density</span>
              <strong className="text-sm text-emerald-400 font-mono">{currentRoute.crowdDensity}%</strong>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Comfort Score</span>
              <strong className="text-sm text-sky-400 font-mono">{currentRoute.comfortScore}/100</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
