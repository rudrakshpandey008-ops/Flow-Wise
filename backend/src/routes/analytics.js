// ============================================================================
// FLOWWISE — Analytics Routes
// ============================================================================

import express from 'express';
import { DEMO_LOCATIONS, calculateCrowdScore } from '../services/crowdEngine.js';
import memoryStore from '../services/memoryStore.js';

const router = express.Router();

// GET /api/analytics/overview
router.get('/overview', async (req, res, next) => {
  try {
    const locations = DEMO_LOCATIONS.map(l => {
      const { score, category } = calculateCrowdScore(l);
      return { ...l, score, category };
    });

    const totalLocations = locations.length;
    const avgCrowd = Math.round(locations.reduce((sum, l) => sum + l.score, 0) / totalLocations);
    const highCrowdCount = locations.filter(l => l.score > 60).length;
    const lowCrowdCount = locations.filter(l => l.score <= 30).length;
    const totalReports = memoryStore.reports.length;

    // Top 5 most crowded locations
    const topCrowded = [...locations]
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map(l => ({
        name: l.shortName || l.name,
        fullName: l.name,
        score: l.score,
        category: l.category,
        crowdCategory: l.category
      }));

    // Crowd distribution percentages
    const distribution = [
      { name: 'Low (0-25)', count: locations.filter(l => l.score <= 25).length, color: '#22C55E' },
      { name: 'Moderate (26-50)', count: locations.filter(l => l.score > 25 && l.score <= 50).length, color: '#38BDF8' },
      { name: 'High (51-75)', count: locations.filter(l => l.score > 50 && l.score <= 75).length, color: '#F59E0B' },
      { name: 'Extremely High (76-100)', count: locations.filter(l => l.score > 75).length, color: '#EF4444' }
    ];

    res.json({
      success: true,
      stats: {
        averageCrowdDensity: avgCrowd,
        totalMonitoredLocations: totalLocations,
        congestedHotspots: highCrowdCount,
        peacefulSanctuaries: lowCrowdCount,
        communityReportsCount: totalReports,
        activeJourneysCount: 142,
        comfortIndex: Math.max(0, 100 - avgCrowd)
      },
      topCrowded,
      distribution
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/analytics/trends
router.get('/trends', async (req, res, next) => {
  try {
    // 24-hour hourly trend across categories
    const hourlyTrends = [
      { hour: '00:00', overall: 12, temples: 10, transit: 15, markets: 5 },
      { hour: '02:00', overall: 8,  temples: 8,  transit: 10, markets: 3 },
      { hour: '04:00', overall: 18, temples: 25, transit: 15, markets: 5 },
      { hour: '06:00', overall: 52, temples: 70, transit: 45, markets: 15 },
      { hour: '08:00', overall: 78, temples: 85, transit: 75, markets: 40 },
      { hour: '10:00', overall: 84, temples: 80, transit: 70, markets: 75 },
      { hour: '12:00', overall: 65, temples: 55, transit: 50, markets: 85 },
      { hour: '14:00', overall: 48, temples: 35, transit: 45, markets: 70 },
      { hour: '16:00', overall: 68, temples: 65, transit: 60, markets: 80 },
      { hour: '18:00', overall: 92, temples: 95, transit: 85, markets: 90 },
      { hour: '20:00', overall: 75, temples: 80, transit: 65, markets: 70 },
      { hour: '22:00', overall: 35, temples: 30, transit: 40, markets: 25 }
    ];

    // Weekly day-by-day trends
    const weeklyTrends = [
      { day: 'Mon', avgCrowd: 46, reports: 34, journeys: 120 },
      { day: 'Tue', avgCrowd: 42, reports: 28, journeys: 110 },
      { day: 'Wed', avgCrowd: 48, reports: 38, journeys: 135 },
      { day: 'Thu', avgCrowd: 52, reports: 42, journeys: 150 },
      { day: 'Fri', avgCrowd: 68, reports: 65, journeys: 210 },
      { day: 'Sat', avgCrowd: 88, reports: 98, journeys: 340 },
      { day: 'Sun', avgCrowd: 94, reports: 112, journeys: 380 }
    ];

    // Category comparison
    const categoryStats = [
      { category: 'Temples', avgScore: 68, locationsCount: 7, color: '#EF4444' },
      { category: 'Transit', avgScore: 48, locationsCount: 2, color: '#F59E0B' },
      { category: 'Ghats', avgScore: 49, locationsCount: 2, color: '#38BDF8' },
      { category: 'Markets', avgScore: 56, locationsCount: 2, color: '#F97316' },
      { category: 'Heritage', avgScore: 28, locationsCount: 4, color: '#22C55E' }
    ];

    res.json({
      success: true,
      hourlyTrends,
      weeklyTrends,
      categoryStats
    });
  } catch (err) {
    next(err);
  }
});

export default router;
