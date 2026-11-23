// ============================================================================
// FLOWWISE — Crowd Intelligence Routes
// ============================================================================

import express from 'express';
import mongoose from 'mongoose';
import Location from '../models/Location.js';
import CrowdReport from '../models/CrowdReport.js';
import { protect } from '../middleware/auth.js';
import {
  DEMO_LOCATIONS,
  getNearbyCrowdData,
  calculateCrowdScore,
  updateCrowdFromReport,
  findDemoLocation,
  getCrowdCategory
} from '../services/crowdEngine.js';
import memoryStore from '../services/memoryStore.js';

const router = express.Router();
const isDbConnected = () => mongoose.connection.readyState === 1;

// GET /api/crowd/nearby
// Query: lat, lng, radius (in km, default 15)
router.get('/nearby', async (req, res, next) => {
  try {
    const lat = parseFloat(req.query.lat) || 27.5046; // default Mathura
    const lng = parseFloat(req.query.lng) || 77.6713;
    const radius = parseFloat(req.query.radius) || 20;

    const nearbyLocations = getNearbyCrowdData(lat, lng, radius);

    res.json({
      success: true,
      count: nearbyLocations.length,
      center: { latitude: lat, longitude: lng },
      radiusKm: radius,
      locations: nearbyLocations,
      disclaimer: 'Live crowd intelligence calculated via weighted heuristic model. Simulated demo data.'
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/crowd/heatmap
// Returns coordinates with crowd scores and weights for heatmap rendering
router.get('/heatmap', async (req, res, next) => {
  try {
    const locations = DEMO_LOCATIONS.map(loc => {
      const { score, category } = calculateCrowdScore(loc);
      return {
        id: loc._id,
        name: loc.name,
        category: loc.category,
        latitude: loc.latitude,
        longitude: loc.longitude,
        crowdScore: score,
        crowdCategory: category,
        weight: score / 100 // 0.0 - 1.0 for Leaflet heatmap
      };
    });

    res.json({
      success: true,
      count: locations.length,
      points: locations
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/crowd/location/:id
router.get('/location/:id', async (req, res, next) => {
  try {
    const loc = findDemoLocation(req.params.id) || memoryStore.findLocationById(req.params.id);

    if (!loc) {
      return res.status(404).json({ success: false, error: 'Location not found' });
    }

    const recentReports = memoryStore.getReportsByLocation(loc._id, 10);
    const scoreData = calculateCrowdScore(loc, recentReports);

    res.json({
      success: true,
      location: {
        ...loc,
        currentCrowdScore: scoreData.score,
        crowdCategory: scoreData.category,
        confidence: scoreData.confidence,
        dataSource: scoreData.dataSource,
        sources: scoreData.sources,
        recentReports
      }
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/crowd/report
// Submit real-time community crowd report
router.post('/report', protect, async (req, res, next) => {
  try {
    const { locationId, locationName, crowdLevel, crowdScore, description, latitude, longitude } = req.body;

    if (!locationId && !locationName) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a locationId or locationName'
      });
    }

    if (!crowdLevel && crowdScore === undefined) {
      return res.status(400).json({
        success: false,
        error: 'Please specify a crowdLevel (Low, Moderate, High, Extremely High) or crowdScore (0-100)'
      });
    }

    // Map level to numeric score if needed
    const levelScoreMap = {
      'Low': 20,
      'Moderate': 45,
      'High': 70,
      'Extremely High': 92
    };

    const finalScore = crowdScore !== undefined ? Number(crowdScore) : (levelScoreMap[crowdLevel] || 50);
    const finalLevel = crowdLevel || getCrowdCategory(finalScore);

    // Locate the target
    const targetLoc = findDemoLocation(locationId || locationName) || DEMO_LOCATIONS[0];

    const reportData = {
      userId: req.user.id || req.user._id,
      locationId: targetLoc._id,
      locationName: targetLoc.name,
      crowdLevel: finalLevel,
      crowdScore: finalScore,
      description: description ? description.trim() : 'Live crowd observation submitted by user',
      latitude: latitude || targetLoc.latitude,
      longitude: longitude || targetLoc.longitude,
      verified: true
    };

    let savedReport;
    if (isDbConnected() && !req.user.isDemo) {
      savedReport = await CrowdReport.create(reportData);
    } else {
      savedReport = memoryStore.addReport(reportData);
    }

    // Update location crowd score
    const updated = updateCrowdFromReport(targetLoc, finalScore);
    targetLoc.currentCrowdScore = updated.score;
    targetLoc.crowdCategory = updated.category;
    targetLoc.reportCount = (targetLoc.reportCount || 0) + 1;
    targetLoc.lastUpdated = new Date().toISOString();

    // Broadcast live update via Socket.IO if available
    const io = req.app.get('io');
    if (io) {
      io.to('crowd-updates').emit('crowd_updated', {
        locationId: targetLoc._id,
        locationName: targetLoc.name,
        newCrowdScore: updated.score,
        crowdCategory: updated.category,
        reportCount: targetLoc.reportCount,
        report: savedReport,
        timestamp: new Date().toISOString()
      });
      io.to('crowd-updates').emit('new_alert', {
        type: updated.score > 75 ? 'danger' : 'info',
        title: `Live Update: ${targetLoc.name}`,
        message: `Crowd level updated to ${updated.category} (${updated.score}%) based on new community report.`,
        timestamp: new Date().toISOString()
      });
    }

    res.status(201).json({
      success: true,
      message: 'Thank you! Crowd report recorded and broadcasted to community.',
      report: savedReport,
      updatedLocation: {
        id: targetLoc._id,
        name: targetLoc.name,
        currentCrowdScore: updated.score,
        crowdCategory: updated.category,
        reportCount: targetLoc.reportCount
      }
    });
  } catch (err) {
    next(err);
  }
});

export default router;
