// ============================================================================
// FLOWWISE — Alert Engine
// ============================================================================

import { DEMO_LOCATIONS, calculateCrowdScore, getCrowdCategory } from './crowdEngine.js';

/**
 * Generate contextual alerts for a user based on their journey.
 */
export function generateAlerts(userId, destination, routes = []) {
  const alerts = [];
  const now = new Date();

  // 1. High crowd at destination
  const destLoc = DEMO_LOCATIONS.find(l =>
    l.name === destination?.name ||
    l._id === destination?.locationId
  );

  if (destLoc) {
    const { score, category } = calculateCrowdScore(destLoc);
    if (score > 75) {
      alerts.push({
        type: 'danger',
        title: 'Extremely High Crowd Alert',
        message: `${destLoc.name} currently has ${category.toLowerCase()} crowd density (${score}/100). Consider visiting at a different time.`,
        timestamp: now.toISOString()
      });
    } else if (score > 50) {
      alerts.push({
        type: 'warning',
        title: 'High Crowd Detected',
        message: `${destLoc.name} has ${category.toLowerCase()} crowd levels (${score}/100). Expect moderate congestion.`,
        timestamp: now.toISOString()
      });
    }
  }

  // 2. Route crowd exposure
  if (routes.length > 0) {
    const selectedRoute = routes[0];
    if (selectedRoute.crowdDensity > 60) {
      alerts.push({
        type: 'warning',
        title: 'Route Crowd Exposure',
        message: `Your selected route has a crowd exposure of ${selectedRoute.crowdDensity}%. Consider the least crowded alternative.`,
        timestamp: now.toISOString()
      });
    }

    // 3. Better alternative available
    const leastCrowded = routes.reduce((min, r) =>
      r.crowdDensity < min.crowdDensity ? r : min, routes[0]);
    if (leastCrowded.crowdDensity < selectedRoute.crowdDensity - 20) {
      alerts.push({
        type: 'info',
        title: 'Less Crowded Alternative',
        message: `${leastCrowded.label} has ${leastCrowded.crowdDensity}% crowd density — ${selectedRoute.crowdDensity - leastCrowded.crowdDensity}% less than your current route.`,
        timestamp: now.toISOString()
      });
    }
  }

  // 4. Peak hour warning
  const hour = now.getHours();
  if ((hour >= 7 && hour <= 10) || (hour >= 17 && hour <= 20)) {
    alerts.push({
      type: 'warning',
      title: 'Peak Hour Notice',
      message: 'You are travelling during peak hours. Expect higher crowd levels across popular locations.',
      timestamp: now.toISOString()
    });
  }

  // 5. General tips
  if (alerts.length === 0) {
    alerts.push({
      type: 'success',
      title: 'Smooth Journey Ahead',
      message: 'Current crowd conditions are favourable. Enjoy your trip!',
      timestamp: now.toISOString()
    });
  }

  return alerts;
}

/**
 * Get active alerts for a user (demo mode).
 */
export function getActiveAlerts(userId) {
  const now = new Date();
  const hour = now.getHours();

  const alerts = [
    {
      type: 'info',
      title: 'Crowd Intelligence Active',
      message: `Monitoring ${DEMO_LOCATIONS.length} locations across Mathura-Vrindavan in real-time.`,
      timestamp: now.toISOString()
    }
  ];

  if (hour >= 7 && hour <= 10) {
    alerts.unshift({
      type: 'warning',
      title: 'Morning Rush Hour',
      message: 'Temple areas are experiencing high footfall. Consider visiting after 11 AM for a quieter experience.',
      timestamp: now.toISOString()
    });
  }

  if (hour >= 17 && hour <= 20) {
    alerts.unshift({
      type: 'warning',
      title: 'Evening Peak Hours',
      message: 'Markets and ghats are crowded. Plan your return journey via less congested routes.',
      timestamp: now.toISOString()
    });
  }

  // Add a dynamic alert based on a random busy location
  const busyLocs = DEMO_LOCATIONS.filter(l => {
    const { score } = calculateCrowdScore(l);
    return score > 60;
  });
  if (busyLocs.length > 0) {
    const loc = busyLocs[0];
    const { score } = calculateCrowdScore(loc);
    alerts.push({
      type: 'danger',
      title: `High Crowd at ${loc.shortName || loc.name}`,
      message: `Current crowd score: ${score}/100. ${DEMO_LOCATIONS.filter(l => calculateCrowdScore(l).score < 30).length} nearby alternatives have low crowd.`,
      timestamp: now.toISOString()
    });
  }

  return alerts;
}
