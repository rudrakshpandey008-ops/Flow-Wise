// ============================================================================
// FLOWWISE — Crowd Intelligence Engine
// ============================================================================

// --------------- Demo Locations (Mathura-Vrindavan) -------------------------
export const DEMO_LOCATIONS = [
  { _id: 'loc_001', name: 'Banke Bihari Temple', shortName: 'Banke Bihari', latitude: 27.5729, longitude: 77.6961, category: 'Temple', baselineCrowd: 72, currentCrowdScore: 68, peakHours: { morning: { start: 5, end: 11 }, evening: { start: 16, end: 21 } }, reportCount: 142 },
  { _id: 'loc_002', name: 'Prem Mandir', shortName: 'Prem Mandir', latitude: 27.5612, longitude: 77.6894, category: 'Temple', baselineCrowd: 60, currentCrowdScore: 55, peakHours: { morning: { start: 6, end: 10 }, evening: { start: 17, end: 21 } }, reportCount: 98 },
  { _id: 'loc_003', name: 'Krishna Janmabhoomi', shortName: 'Janmabhoomi', latitude: 27.5046, longitude: 77.6713, category: 'Temple', baselineCrowd: 78, currentCrowdScore: 75, peakHours: { morning: { start: 5, end: 12 }, evening: { start: 16, end: 20 } }, reportCount: 210 },
  { _id: 'loc_004', name: 'Dwarkadhish Temple', shortName: 'Dwarkadhish', latitude: 27.5055, longitude: 77.6803, category: 'Temple', baselineCrowd: 65, currentCrowdScore: 58, peakHours: { morning: { start: 6, end: 11 }, evening: { start: 17, end: 20 } }, reportCount: 87 },
  { _id: 'loc_005', name: 'ISKCON Vrindavan', shortName: 'ISKCON', latitude: 27.5635, longitude: 77.6756, category: 'Temple', baselineCrowd: 55, currentCrowdScore: 48, peakHours: { morning: { start: 4, end: 9 }, evening: { start: 18, end: 21 } }, reportCount: 76 },
  { _id: 'loc_006', name: 'Radha Raman Temple', shortName: 'Radha Raman', latitude: 27.5721, longitude: 77.6933, category: 'Temple', baselineCrowd: 45, currentCrowdScore: 40, peakHours: { morning: { start: 5, end: 10 }, evening: { start: 17, end: 20 } }, reportCount: 54 },
  { _id: 'loc_007', name: 'Nidhivan', shortName: 'Nidhivan', latitude: 27.5731, longitude: 77.6946, category: 'Heritage', baselineCrowd: 35, currentCrowdScore: 30, peakHours: { morning: { start: 6, end: 10 }, evening: { start: 16, end: 19 } }, reportCount: 42 },
  { _id: 'loc_008', name: 'Govind Dev Temple', shortName: 'Govind Dev', latitude: 27.5725, longitude: 77.6879, category: 'Temple', baselineCrowd: 40, currentCrowdScore: 35, peakHours: { morning: { start: 5, end: 10 }, evening: { start: 17, end: 20 } }, reportCount: 38 },
  { _id: 'loc_009', name: 'Vishram Ghat', shortName: 'Vishram Ghat', latitude: 27.5055, longitude: 77.6845, category: 'Ghat', baselineCrowd: 55, currentCrowdScore: 50, peakHours: { morning: { start: 5, end: 9 }, evening: { start: 17, end: 20 } }, reportCount: 95 },
  { _id: 'loc_010', name: 'Kesi Ghat', shortName: 'Kesi Ghat', latitude: 27.5747, longitude: 77.6981, category: 'Ghat', baselineCrowd: 42, currentCrowdScore: 38, peakHours: { morning: { start: 5, end: 9 }, evening: { start: 17, end: 20 } }, reportCount: 61 },
  { _id: 'loc_011', name: 'Holi Gate Market', shortName: 'Holi Gate', latitude: 27.4975, longitude: 77.6735, category: 'Market', baselineCrowd: 60, currentCrowdScore: 55, peakHours: { morning: { start: 10, end: 13 }, evening: { start: 17, end: 21 } }, reportCount: 73 },
  { _id: 'loc_012', name: 'Chatta Bazaar', shortName: 'Chatta Bazaar', latitude: 27.5050, longitude: 77.6780, category: 'Market', baselineCrowd: 58, currentCrowdScore: 52, peakHours: { morning: { start: 10, end: 14 }, evening: { start: 17, end: 20 } }, reportCount: 65 },
  { _id: 'loc_013', name: 'Mathura Junction Railway Station', shortName: 'Mathura Jn', latitude: 27.4921, longitude: 77.6735, category: 'Transit', baselineCrowd: 50, currentCrowdScore: 45, peakHours: { morning: { start: 7, end: 10 }, evening: { start: 17, end: 20 } }, reportCount: 112 },
  { _id: 'loc_014', name: 'Mathura Bus Stand', shortName: 'Bus Stand', latitude: 27.4950, longitude: 77.6680, category: 'Transit', baselineCrowd: 48, currentCrowdScore: 42, peakHours: { morning: { start: 7, end: 10 }, evening: { start: 16, end: 19 } }, reportCount: 88 },
  { _id: 'loc_015', name: 'Kusum Sarovar', shortName: 'Kusum Sarovar', latitude: 27.5900, longitude: 77.7220, category: 'Heritage', baselineCrowd: 20, currentCrowdScore: 18, peakHours: { morning: { start: 7, end: 10 }, evening: { start: 16, end: 18 } }, reportCount: 25 },
  { _id: 'loc_016', name: 'Radha Kund', shortName: 'Radha Kund', latitude: 27.5880, longitude: 77.7260, category: 'Heritage', baselineCrowd: 25, currentCrowdScore: 22, peakHours: { morning: { start: 6, end: 10 }, evening: { start: 16, end: 19 } }, reportCount: 31 },
  { _id: 'loc_017', name: 'Seva Kunj', shortName: 'Seva Kunj', latitude: 27.5728, longitude: 77.6951, category: 'Heritage', baselineCrowd: 32, currentCrowdScore: 28, peakHours: { morning: { start: 7, end: 10 }, evening: { start: 16, end: 19 } }, reportCount: 37 }
];

/**
 * Classify a numeric crowd score into a human-readable category.
 */
export function getCrowdCategory(score) {
  if (score <= 25) return 'Low';
  if (score <= 50) return 'Moderate';
  if (score <= 75) return 'High';
  return 'Extremely High';
}

/**
 * Time-of-day multiplier for crowd estimates.
 */
export function getTimeMultiplier(hour) {
  if (hour >= 0 && hour < 5) return 0.3;
  if (hour >= 5 && hour < 7) return 0.7;
  if (hour >= 7 && hour < 10) return 1.5;
  if (hour >= 10 && hour < 12) return 1.3;
  if (hour >= 12 && hour < 14) return 0.9;
  if (hour >= 14 && hour < 16) return 0.8;
  if (hour >= 16 && hour < 19) return 1.6;
  if (hour >= 19 && hour < 21) return 1.8;
  if (hour >= 21 && hour < 23) return 0.7;
  return 0.4; // 23-24
}

/**
 * Day-of-week multiplier (0 = Sunday).
 */
export function getDayMultiplier(dayOfWeek) {
  if (dayOfWeek === 0 || dayOfWeek === 6) return 1.3;   // Weekend
  if (dayOfWeek === 5) return 1.15;                       // Friday
  return 1.0;
}

/**
 * Calculate current crowd score for a location.
 * Uses: baseline, time multiplier, day multiplier, recent reports.
 */
export function calculateCrowdScore(location, recentReports = []) {
  const now = new Date();
  const hour = now.getHours();
  const day = now.getDay();

  const baseline = location.baselineCrowd || 30;
  const timeMul = getTimeMultiplier(hour);
  const dayMul = getDayMultiplier(day);

  // Weighted average of recent reports
  let reportScore = 0;
  let reportWeight = 0;
  for (const report of recentReports) {
    const ageHours = (now - new Date(report.createdAt)) / 3600000;
    let w = 0.2;
    if (ageHours < 1) w = 1.0;
    else if (ageHours < 3) w = 0.7;
    else if (ageHours < 6) w = 0.4;
    reportScore += report.crowdScore * w;
    reportWeight += w;
  }

  let finalScore;
  if (reportWeight > 0) {
    const avgReportScore = reportScore / reportWeight;
    // Blend baseline (40%) + reports (60%) if reports exist
    finalScore = baseline * 0.4 + avgReportScore * 0.6;
  } else {
    finalScore = baseline;
  }

  // Apply temporal multipliers
  finalScore = finalScore * timeMul * dayMul;

  // Check if we're in peak hours for this location
  const ph = location.peakHours || {};
  const inMorningPeak = ph.morning && hour >= ph.morning.start && hour <= ph.morning.end;
  const inEveningPeak = ph.evening && hour >= ph.evening.start && hour <= ph.evening.end;
  if (inMorningPeak || inEveningPeak) {
    finalScore *= 1.15;
  }

  finalScore = Math.min(100, Math.max(0, Math.round(finalScore)));
  const confidence = recentReports.length > 0 ? Math.min(1, 0.5 + recentReports.length * 0.1) : 0.4;

  return {
    score: finalScore,
    category: getCrowdCategory(finalScore),
    sources: recentReports.length > 0 ? ['community_reports', 'baseline', 'temporal'] : ['baseline', 'temporal'],
    confidence,
    dataSource: recentReports.length > 0 ? 'community_report' : 'simulated'
  };
}

/**
 * Haversine distance between two coordinates in km.
 */
export function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/**
 * Get nearby crowd data from demo locations within a given radius (km).
 */
export function getNearbyCrowdData(lat, lng, radiusKm = 10) {
  const now = new Date();
  return DEMO_LOCATIONS
    .map(loc => {
      const dist = haversineDistance(lat, lng, loc.latitude, loc.longitude);
      if (dist > radiusKm) return null;
      const { score, category, confidence, dataSource } = calculateCrowdScore(loc);
      return {
        ...loc,
        currentCrowdScore: score,
        crowdCategory: category,
        confidence,
        dataSource,
        distance: Math.round(dist * 100) / 100,
        lastUpdated: now.toISOString(),
        recentTrend: ['rising', 'falling', 'stable'][Math.floor(Math.random() * 3)]
      };
    })
    .filter(Boolean)
    .sort((a, b) => a.distance - b.distance);
}

/**
 * Update a location's crowd score after receiving a new report.
 */
export function updateCrowdFromReport(location, reportScore) {
  const existing = location.currentCrowdScore || location.baselineCrowd || 30;
  // Weighted: 70% new report, 30% existing (new reports carry more weight)
  const updated = Math.round(existing * 0.3 + reportScore * 0.7);
  return {
    score: Math.min(100, Math.max(0, updated)),
    category: getCrowdCategory(updated)
  };
}

/**
 * Find a demo location by its _id string.
 */
export function findDemoLocation(idOrName) {
  return DEMO_LOCATIONS.find(l =>
    l._id === idOrName ||
    l.name.toLowerCase() === (idOrName || '').toLowerCase() ||
    l.shortName?.toLowerCase() === (idOrName || '').toLowerCase()
  );
}
