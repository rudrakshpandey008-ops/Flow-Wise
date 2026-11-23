// ============================================================================
// FLOWWISE — Route Optimisation Algorithm
// ============================================================================

import {
  DEMO_LOCATIONS,
  haversineDistance,
  calculateCrowdScore,
  getCrowdCategory
} from './crowdEngine.js';

// --------------- Weight presets by navigation mode --------------------------
const WEIGHT_PRESETS = {
  fastest:        { time: 0.70, crowd: 0.15, distance: 0.10, reliability: 0.05 },
  least_crowded:  { time: 0.15, crowd: 0.70, distance: 0.10, reliability: 0.05 },
  balanced:       { time: 0.35, crowd: 0.45, distance: 0.10, reliability: 0.10 }
};

// Speed in km/h per transport mode
const SPEEDS = {
  walking: 5,
  two_wheeler: 25,
  transit: 20,
  car: 30
};

/**
 * Normalise a value to 0-100 range.
 */
export function normalizeValue(value, min, max) {
  if (max === min) return 50;
  return Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));
}

/**
 * Calculate route score using the weighted formula.
 * Lower = better.
 */
export function calculateRouteScore(route, mode = 'balanced') {
  const w = WEIGHT_PRESETS[mode] || WEIGHT_PRESETS.balanced;
  return (
    w.time * (route._normTime ?? route.travelTime) +
    w.crowd * (route._normCrowd ?? route.crowdDensity) +
    w.distance * (route._normDist ?? route.distance) +
    w.reliability * (route._reliabilityPenalty ?? 10)
  );
}

/**
 * Generate a set of waypoints between source and destination.
 * Optionally detours via intermediate locations to avoid crowds.
 */
function buildWaypoints(srcLat, srcLng, dstLat, dstLng, viaLocations = []) {
  const waypoints = [{ lat: srcLat, lng: srcLng }];
  for (const loc of viaLocations) {
    waypoints.push({ lat: loc.latitude, lng: loc.longitude });
  }
  waypoints.push({ lat: dstLat, lng: dstLng });
  return waypoints;
}

/**
 * Calculate total path distance from an array of waypoints.
 */
function totalPathDistance(waypoints) {
  let total = 0;
  for (let i = 1; i < waypoints.length; i++) {
    total += haversineDistance(
      waypoints[i - 1].lat, waypoints[i - 1].lng,
      waypoints[i].lat, waypoints[i].lng
    );
  }
  return Math.round(total * 10) / 10;
}

/**
 * Gather crowd scores along a route's waypoints from nearby locations.
 */
function getRouteCrowdMetrics(waypoints) {
  const scores = [];
  for (const wp of waypoints) {
    // Find closest demo location to this waypoint
    let closest = null;
    let minDist = Infinity;
    for (const loc of DEMO_LOCATIONS) {
      const d = haversineDistance(wp.lat, wp.lng, loc.latitude, loc.longitude);
      if (d < minDist) { minDist = d; closest = loc; }
    }
    if (closest && minDist < 5) {
      const { score } = calculateCrowdScore(closest);
      scores.push(score);
    }
  }
  if (scores.length === 0) return { avgCrowd: 30, maxCrowd: 40 };
  const avg = Math.round(scores.reduce((s, v) => s + v, 0) / scores.length);
  const max = Math.max(...scores);
  return { avgCrowd: avg, maxCrowd: max };
}

/**
 * Generate 3 alternative routes between source and destination.
 */
export function generateAlternativeRoutes(source, destination, transportMode = 'walking') {
  const srcLat = source.latitude;
  const srcLng = source.longitude;
  const dstLat = destination.latitude;
  const dstLng = destination.longitude;
  const speed = SPEEDS[transportMode] || SPEEDS.walking;

  // --- Route A: Direct / Fastest ---
  const wpA = buildWaypoints(srcLat, srcLng, dstLat, dstLng);
  // Add a subtle mid-point for visual interest
  const midLat = (srcLat + dstLat) / 2 + 0.002;
  const midLng = (srcLng + dstLng) / 2 + 0.001;
  wpA.splice(1, 0, { lat: midLat, lng: midLng });
  const distA = totalPathDistance(wpA);
  const timeA = Math.round((distA / speed) * 60);
  const crowdA = getRouteCrowdMetrics(wpA);

  // --- Route B: Avoid crowded areas (wider arc) ---
  // Find least-crowded intermediate locations near the midpoint
  const midpoint = { lat: (srcLat + dstLat) / 2, lng: (srcLng + dstLng) / 2 };
  const nearbyLocs = DEMO_LOCATIONS
    .map(loc => ({
      ...loc,
      distToMid: haversineDistance(midpoint.lat, midpoint.lng, loc.latitude, loc.longitude),
      crowd: calculateCrowdScore(loc).score
    }))
    .filter(l => l.distToMid < 8)
    .sort((a, b) => a.crowd - b.crowd);

  const lowCrowdLocs = nearbyLocs.slice(0, 2);
  const wpB = buildWaypoints(srcLat, srcLng, dstLat, dstLng, lowCrowdLocs);
  const distB = totalPathDistance(wpB);
  const timeB = Math.round((distB / speed) * 60);
  const crowdB = getRouteCrowdMetrics(wpB);

  // --- Route C: Balanced (slight detour) ---
  // Pick one moderate location
  const moderateLoc = nearbyLocs.find(l => l.crowd >= 25 && l.crowd <= 50) || nearbyLocs[1];
  const viaC = moderateLoc ? [moderateLoc] : [];
  // Add a small offset to create a distinct path
  const wpC = buildWaypoints(srcLat, srcLng, dstLat, dstLng, viaC);
  if (wpC.length < 4) {
    wpC.splice(1, 0, { lat: midLat - 0.004, lng: midLng + 0.003 });
  }
  const distC = totalPathDistance(wpC);
  const timeC = Math.round((distC / speed) * 60);
  const crowdC = getRouteCrowdMetrics(wpC);

  const routes = [
    {
      label: 'Route A',
      travelTime: timeA,
      distance: distA,
      crowdDensity: crowdA.avgCrowd,
      crowdExposure: Math.round(crowdA.maxCrowd * (timeA / 60)),
      comfortScore: Math.max(0, 100 - crowdA.avgCrowd),
      waypoints: wpA,
      _reliabilityPenalty: 10
    },
    {
      label: 'Route B',
      travelTime: timeB,
      distance: distB,
      crowdDensity: crowdB.avgCrowd,
      crowdExposure: Math.round(crowdB.maxCrowd * (timeB / 60)),
      comfortScore: Math.max(0, 100 - crowdB.avgCrowd),
      waypoints: wpB,
      _reliabilityPenalty: 15
    },
    {
      label: 'Route C',
      travelTime: timeC,
      distance: distC,
      crowdDensity: crowdC.avgCrowd,
      crowdExposure: Math.round(crowdC.maxCrowd * (timeC / 60)),
      comfortScore: Math.max(0, 100 - crowdC.avgCrowd),
      waypoints: wpC,
      _reliabilityPenalty: 12
    }
  ];

  return routes;
}

/**
 * Rank routes for a given navigation mode. Adds normalised fields,
 * computes scores, sorts, and assigns recommendation labels.
 */
export function rankRoutes(routes, mode = 'balanced') {
  if (!routes || routes.length === 0) return [];

  const times = routes.map(r => r.travelTime);
  const dists = routes.map(r => r.distance);
  const crowds = routes.map(r => r.crowdDensity);
  const minTime = Math.min(...times), maxTime = Math.max(...times);
  const minDist = Math.min(...dists), maxDist = Math.max(...dists);
  const minCrowd = Math.min(...crowds), maxCrowd = Math.max(...crowds);

  const scored = routes.map(r => {
    const _normTime = normalizeValue(r.travelTime, minTime, maxTime);
    const _normDist = normalizeValue(r.distance, minDist, maxDist);
    const _normCrowd = normalizeValue(r.crowdDensity, minCrowd, maxCrowd);
    const enriched = { ...r, _normTime, _normDist, _normCrowd };
    enriched.routeScore = Math.round(calculateRouteScore(enriched, mode) * 10) / 10;
    return enriched;
  });

  scored.sort((a, b) => a.routeScore - b.routeScore);

  // Assign recommendation labels
  const fastest = [...scored].sort((a, b) => a.travelTime - b.travelTime)[0];
  const leastCrowded = [...scored].sort((a, b) => a.crowdDensity - b.crowdDensity)[0];

  for (const r of scored) {
    if (r.label === fastest.label && r.label === leastCrowded.label) {
      r.recommendation = 'Best Overall';
    } else if (r.label === fastest.label) {
      r.recommendation = 'Fastest Route';
    } else if (r.label === leastCrowded.label) {
      r.recommendation = 'Least Crowded';
    } else {
      r.recommendation = 'Balanced Route';
    }
    r.crowdCategory = getCrowdCategory(r.crowdDensity);
    // Clean internal fields
    delete r._normTime;
    delete r._normDist;
    delete r._normCrowd;
    delete r._reliabilityPenalty;
  }

  return scored;
}

/**
 * Compare two routes side-by-side.
 */
export function compareRoutes(routeA, routeB) {
  return {
    timeDiff: routeB.travelTime - routeA.travelTime,
    distDiff: Math.round((routeB.distance - routeA.distance) * 10) / 10,
    crowdDiff: routeB.crowdDensity - routeA.crowdDensity,
    comfortDiff: routeB.comfortScore - routeA.comfortScore,
    recommendation: routeA.routeScore <= routeB.routeScore ? routeA.label : routeB.label
  };
}
