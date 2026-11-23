// ============================================================================
// FLOWWISE — Route Comparison Routes
// ============================================================================

import express from 'express';
import { generateAlternativeRoutes, rankRoutes, compareRoutes } from '../services/routeOptimizer.js';
import { findDemoLocation } from '../services/crowdEngine.js';

const router = express.Router();

// POST /api/routes/compare
router.post('/compare', async (req, res, next) => {
  try {
    const {
      source,
      destination,
      transportMode = 'walking',
      navigationPreference = 'balanced'
    } = req.body;

    if (!source || !destination) {
      return res.status(400).json({
        success: false,
        error: 'Please provide source and destination'
      });
    }

    let src = {
      name: source.name || 'Starting Point',
      latitude: parseFloat(source.latitude),
      longitude: parseFloat(source.longitude)
    };

    let dst = {
      name: destination.name || 'Destination',
      latitude: parseFloat(destination.latitude),
      longitude: parseFloat(destination.longitude)
    };

    if (isNaN(src.latitude) || isNaN(src.longitude)) {
      const match = findDemoLocation(source.name);
      src = match
        ? { name: match.name, latitude: match.latitude, longitude: match.longitude }
        : { name: 'Mathura Junction Railway Station', latitude: 27.4921, longitude: 77.6735 };
    }

    if (isNaN(dst.latitude) || isNaN(dst.longitude)) {
      const match = findDemoLocation(destination.name);
      dst = match
        ? { name: match.name, latitude: match.latitude, longitude: match.longitude }
        : { name: 'Banke Bihari Temple', latitude: 27.5729, longitude: 77.6961 };
    }

    const raw = generateAlternativeRoutes(src, dst, transportMode);
    const ranked = rankRoutes(raw, navigationPreference);

    const comparisonAB = compareRoutes(ranked[0], ranked[1]);
    const comparisonAC = ranked[2] ? compareRoutes(ranked[0], ranked[2]) : null;

    res.json({
      success: true,
      source: src,
      destination: dst,
      navigationPreference,
      transportMode,
      routes: ranked,
      comparisons: {
        vsSecond: comparisonAB,
        vsThird: comparisonAC
      },
      formulaNotice: 'Route Score = 0.35 × TravelTime + 0.45 × CrowdExposure + 0.10 × Distance + 0.10 × Penalty'
    });
  } catch (err) {
    next(err);
  }
});

export default router;
