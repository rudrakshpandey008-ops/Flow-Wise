// ============================================================================
// FLOWWISE — Journey Routes
// ============================================================================

import express from 'express';
import mongoose from 'mongoose';
import Journey from '../models/Journey.js';
import { protect } from '../middleware/auth.js';
import { generateAlternativeRoutes, rankRoutes } from '../services/routeOptimizer.js';
import { generateAlerts } from '../services/alertEngine.js';
import { findDemoLocation } from '../services/crowdEngine.js';
import memoryStore from '../services/memoryStore.js';

const router = express.Router();
const isDbConnected = () => mongoose.connection.readyState === 1;

// POST /api/journeys/plan
// Plan a journey, generate alternatives, calculate crowd exposure, rank routes
router.post('/plan', protect, async (req, res, next) => {
  try {
    const {
      source,
      destination,
      departureTime,
      transportMode = 'walking',
      navigationPreference = 'balanced'
    } = req.body;

    if (!source || !destination) {
      return res.status(400).json({
        success: false,
        error: 'Please provide source and destination details'
      });
    }

    // Resolve source & destination coordinates
    let srcCoords = {
      name: source.name || 'Starting Point',
      latitude: parseFloat(source.latitude),
      longitude: parseFloat(source.longitude)
    };

    let dstCoords = {
      name: destination.name || 'Destination Point',
      latitude: parseFloat(destination.latitude),
      longitude: parseFloat(destination.longitude)
    };

    // If source or destination are location names, lookup coordinates
    if (isNaN(srcCoords.latitude) || isNaN(srcCoords.longitude)) {
      const match = findDemoLocation(source.name);
      if (match) {
        srcCoords = { name: match.name, latitude: match.latitude, longitude: match.longitude };
      } else {
        // default to Mathura Junction
        srcCoords = { name: 'Mathura Junction Railway Station', latitude: 27.4921, longitude: 77.6735 };
      }
    }

    if (isNaN(dstCoords.latitude) || isNaN(dstCoords.longitude)) {
      const match = findDemoLocation(destination.name);
      if (match) {
        dstCoords = { name: match.name, latitude: match.latitude, longitude: match.longitude };
      } else {
        // default to Banke Bihari Temple
        dstCoords = { name: 'Banke Bihari Temple', latitude: 27.5729, longitude: 77.6961 };
      }
    }

    // Generate 3 alternative routes
    const rawRoutes = generateAlternativeRoutes(srcCoords, dstCoords, transportMode);

    // Rank routes based on navigation preference
    const rankedRoutes = rankRoutes(rawRoutes, navigationPreference);

    // Generate alerts for this journey
    const alerts = generateAlerts(req.user.id, dstCoords, rankedRoutes);

    const journeyData = {
      userId: req.user.id || req.user._id,
      source: srcCoords,
      destination: dstCoords,
      departureTime: departureTime ? new Date(departureTime) : new Date(),
      transportMode,
      travelPreference: navigationPreference,
      routes: rankedRoutes,
      selectedRoute: 0,
      status: 'planned'
    };

    let savedJourney;
    if (isDbConnected() && !req.user.isDemo) {
      savedJourney = await Journey.create(journeyData);
    } else {
      savedJourney = memoryStore.addJourney(journeyData);
    }

    res.status(200).json({
      success: true,
      journeyId: savedJourney._id,
      source: srcCoords,
      destination: dstCoords,
      transportMode,
      navigationPreference,
      routes: rankedRoutes,
      alerts,
      disclaimer: 'Demonstration route data calculated using FLOWWISE crowd intelligence algorithms.'
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/journeys/history
router.get('/history', protect, async (req, res, next) => {
  try {
    const userId = req.user.id || req.user._id;
    let journeys;

    if (isDbConnected() && !req.user.isDemo) {
      journeys = await Journey.find({ userId }).sort({ createdAt: -1 }).limit(20);
    } else {
      journeys = memoryStore.getJourneysByUser(userId, 20);
      if (journeys.length === 0) {
        journeys = memoryStore.journeys;
      }
    }

    res.json({
      success: true,
      count: journeys.length,
      journeys
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/journeys/:id
router.get('/:id', protect, async (req, res, next) => {
  try {
    let journey;
    if (isDbConnected() && !req.user.isDemo) {
      journey = await Journey.findById(req.params.id);
    } else {
      journey = memoryStore.findJourneyById(req.params.id);
    }

    if (!journey) {
      return res.status(404).json({ success: false, error: 'Journey not found' });
    }

    res.json({
      success: true,
      journey
    });
  } catch (err) {
    next(err);
  }
});

export default router;
