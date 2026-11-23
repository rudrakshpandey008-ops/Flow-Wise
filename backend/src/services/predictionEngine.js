// ============================================================================
// FLOWWISE — Crowd Prediction Engine
// ============================================================================

import { DEMO_LOCATIONS, getCrowdCategory, getTimeMultiplier, getDayMultiplier } from './crowdEngine.js';

// Hourly crowd patterns by category (0-23 hours, normalised 0-1)
const PATTERNS = {
  Temple:   [0.1,0.08,0.08,0.1,0.2,0.5,0.8,0.9,0.95,0.85,0.7,0.5,0.35,0.3,0.3,0.4,0.6,0.8,0.9,0.85,0.6,0.35,0.2,0.12],
  Market:   [0.05,0.03,0.03,0.05,0.05,0.1,0.15,0.3,0.5,0.7,0.85,0.9,0.85,0.75,0.6,0.5,0.55,0.75,0.9,0.85,0.6,0.35,0.15,0.08],
  Transit:  [0.1,0.08,0.08,0.1,0.15,0.3,0.6,0.85,0.9,0.75,0.5,0.4,0.35,0.35,0.4,0.5,0.7,0.9,0.85,0.65,0.4,0.25,0.15,0.1],
  Ghat:     [0.05,0.05,0.05,0.1,0.3,0.6,0.8,0.85,0.75,0.55,0.4,0.3,0.25,0.2,0.2,0.25,0.4,0.65,0.8,0.7,0.45,0.2,0.1,0.05],
  Heritage: [0.03,0.02,0.02,0.03,0.05,0.1,0.2,0.4,0.6,0.7,0.75,0.65,0.5,0.4,0.35,0.35,0.5,0.6,0.55,0.4,0.25,0.12,0.05,0.03],
  Hub:      [0.08,0.05,0.05,0.08,0.1,0.2,0.4,0.7,0.85,0.75,0.6,0.5,0.45,0.45,0.5,0.6,0.75,0.85,0.8,0.6,0.35,0.2,0.12,0.08]
};

/**
 * Get the hourly pattern for a given category.
 */
function getPattern(category) {
  return PATTERNS[category] || PATTERNS.Heritage;
}

/**
 * Predict crowd level for a location at a future time.
 */
export function predictCrowdLevel(locationIdOrObj, targetTime) {
  const location = typeof locationIdOrObj === 'string'
    ? DEMO_LOCATIONS.find(l => l._id === locationIdOrObj || l.name === locationIdOrObj)
    : locationIdOrObj;

  if (!location) {
    return { predictedScore: 30, category: 'Moderate', confidence: 0.3, factors: ['no data'] };
  }

  const target = new Date(targetTime || Date.now());
  const hour = target.getHours();
  const day = target.getDay();

  const pattern = getPattern(location.category);
  const baseline = location.baselineCrowd || 30;

  // Base prediction from hourly pattern
  let predicted = baseline * pattern[hour] * 1.5; // scale up from normalised

  // Apply day-of-week multiplier
  predicted *= getDayMultiplier(day);

  // Check peak hours
  const ph = location.peakHours || {};
  const inPeak = (ph.morning && hour >= ph.morning.start && hour <= ph.morning.end) ||
                 (ph.evening && hour >= ph.evening.start && hour <= ph.evening.end);
  if (inPeak) predicted *= 1.2;

  predicted = Math.min(100, Math.max(0, Math.round(predicted)));

  const factors = [];
  factors.push(`Hourly pattern for ${location.category}: ${(pattern[hour] * 100).toFixed(0)}%`);
  factors.push(`Day multiplier: ×${getDayMultiplier(day)}`);
  if (inPeak) factors.push('Currently in peak hours');

  return {
    predictedScore: predicted,
    category: getCrowdCategory(predicted),
    confidence: 0.65,
    factors,
    dataSource: 'predicted',
    locationName: location.name
  };
}

/**
 * Generate hourly forecast for a location.
 */
export function generateHourlyForecast(locationIdOrObj, startHour = 0, hours = 24) {
  const location = typeof locationIdOrObj === 'string'
    ? DEMO_LOCATIONS.find(l => l._id === locationIdOrObj || l.name === locationIdOrObj)
    : locationIdOrObj;

  if (!location) return [];

  const now = new Date();
  const forecasts = [];

  for (let i = 0; i < hours; i++) {
    const target = new Date(now);
    target.setHours(startHour + i, 0, 0, 0);
    const { predictedScore, category } = predictCrowdLevel(location, target);
    forecasts.push({
      hour: (startHour + i) % 24,
      time: target.toISOString(),
      predictedScore,
      category
    });
  }

  return forecasts;
}

/**
 * Get peak crowd hours for a location.
 */
export function getPeakHours(locationIdOrObj) {
  const location = typeof locationIdOrObj === 'string'
    ? DEMO_LOCATIONS.find(l => l._id === locationIdOrObj || l.name === locationIdOrObj)
    : locationIdOrObj;

  if (!location) return { morning: '7:00-10:00', evening: '17:00-20:00' };

  const forecast = generateHourlyForecast(location, 0, 24);
  const sorted = [...forecast].sort((a, b) => b.predictedScore - a.predictedScore);
  const top5 = sorted.slice(0, 5).map(f => f.hour);

  return {
    peakHours: top5,
    morningPeak: location.peakHours?.morning || { start: 7, end: 10 },
    eveningPeak: location.peakHours?.evening || { start: 17, end: 20 },
    busiest: sorted[0]
  };
}

/**
 * Get a 24-hour historical-style pattern for a location on a given day.
 */
export function getHistoricalPattern(locationIdOrObj, dayOfWeek = new Date().getDay()) {
  const location = typeof locationIdOrObj === 'string'
    ? DEMO_LOCATIONS.find(l => l._id === locationIdOrObj || l.name === locationIdOrObj)
    : locationIdOrObj;

  if (!location) return Array(24).fill(30);

  const pattern = getPattern(location.category);
  const dayMul = getDayMultiplier(dayOfWeek);
  const baseline = location.baselineCrowd || 30;

  return pattern.map(p => Math.min(100, Math.round(baseline * p * 1.5 * dayMul)));
}
