// ============================================================================
// FLOWWISE — Resilient In-Memory Data Store (Hackathon / Demo / Offline Mode)
// ============================================================================
// When MongoDB is running, Mongoose is used.
// If MongoDB is offline or DEMO_MODE=true, this in-memory store guarantees
// zero crashes and instantaneous responses for all Hackathon evaluations.

import bcrypt from 'bcryptjs';
import { DEMO_LOCATIONS } from './crowdEngine.js';

class MemoryStore {
  constructor() {
    this.users = [];
    this.locations = [];
    this.reports = [];
    this.journeys = [];
    this.history = [];
    this.initDemoData();
  }

  initDemoData() {
    // Demo User
    const demoPasswordHash = bcrypt.hashSync('demo1234', 10);
    this.users.push({
      _id: 'usr_demo_001',
      name: 'Radhika Sharma',
      email: 'demo@flowwise.app',
      password: demoPasswordHash,
      preferences: {
        defaultNavigationMode: 'balanced',
        transportMode: 'walking',
        alertNotifications: true
      },
      createdAt: new Date(Date.now() - 30 * 24 * 3600 * 1000)
    });

    // Locations from DEMO_LOCATIONS
    this.locations = DEMO_LOCATIONS.map(loc => ({
      ...loc,
      createdAt: new Date()
    }));

    // Demo Reports
    const sampleComments = [
      'Darshan queue moving smoothly today, peaceful atmosphere.',
      'Slightly crowded near entry gate 2, but main courtyard is clear.',
      'Aarti time is packed, avoid taking vehicles inside narrow lanes.',
      'Very pleasant breeze at the ghats, moderate crowd.',
      'Market street is bustling with shoppers, narrow pathway.'
    ];

    for (let i = 0; i < 25; i++) {
      const loc = this.locations[i % this.locations.length];
      const levels = ['Low', 'Moderate', 'High', 'Extremely High'];
      const scores = [20, 45, 65, 88];
      const idx = Math.floor(Math.random() * 4);
      this.reports.push({
        _id: `rep_${1000 + i}`,
        userId: 'usr_demo_001',
        locationId: loc._id,
        locationName: loc.name,
        crowdLevel: levels[idx],
        crowdScore: scores[idx],
        description: sampleComments[i % sampleComments.length],
        latitude: loc.latitude,
        longitude: loc.longitude,
        verified: true,
        createdAt: new Date(Date.now() - (i * 2.5 + Math.random()) * 3600 * 1000)
      });
    }

    // Demo Journeys
    this.journeys.push(
      {
        _id: 'jrn_001',
        userId: 'usr_demo_001',
        source: { name: 'Mathura Junction Railway Station', latitude: 27.4921, longitude: 77.6735 },
        destination: { name: 'Banke Bihari Temple', latitude: 27.5729, longitude: 77.6961 },
        travelPreference: 'least_crowded',
        transportMode: 'car',
        selectedRoute: 1,
        departureTime: new Date(Date.now() - 4 * 3600 * 1000),
        status: 'completed',
        createdAt: new Date(Date.now() - 4 * 3600 * 1000)
      },
      {
        _id: 'jrn_002',
        userId: 'usr_demo_001',
        source: { name: 'Prem Mandir', latitude: 27.5612, longitude: 77.6894 },
        destination: { name: 'ISKCON Vrindavan', latitude: 27.5635, longitude: 77.6756 },
        travelPreference: 'balanced',
        transportMode: 'walking',
        selectedRoute: 0,
        departureTime: new Date(Date.now() - 24 * 3600 * 1000),
        status: 'completed',
        createdAt: new Date(Date.now() - 24 * 3600 * 1000)
      },
      {
        _id: 'jrn_003',
        userId: 'usr_demo_001',
        source: { name: 'Krishna Janmabhoomi', latitude: 27.5046, longitude: 77.6713 },
        destination: { name: 'Vishram Ghat', latitude: 27.5055, longitude: 77.6845 },
        travelPreference: 'fastest',
        transportMode: 'two_wheeler',
        selectedRoute: 0,
        departureTime: new Date(Date.now() - 48 * 3600 * 1000),
        status: 'completed',
        createdAt: new Date(Date.now() - 48 * 3600 * 1000)
      }
    );
  }

  // User methods
  findUserByEmail(email) {
    return this.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  findUserById(id) {
    return this.users.find(u => u._id === id);
  }

  createUser(userData) {
    const newUser = {
      _id: `usr_${Date.now()}`,
      ...userData,
      preferences: userData.preferences || {
        defaultNavigationMode: 'balanced',
        transportMode: 'walking',
        alertNotifications: true
      },
      createdAt: new Date()
    };
    this.users.push(newUser);
    return newUser;
  }

  // Location methods
  getLocations() {
    return this.locations;
  }

  findLocationById(id) {
    return this.locations.find(l => l._id === id || l.name.toLowerCase() === (id || '').toLowerCase());
  }

  updateLocation(id, updates) {
    const loc = this.findLocationById(id);
    if (loc) {
      Object.assign(loc, updates, { lastUpdated: new Date() });
    }
    return loc;
  }

  // Report methods
  addReport(reportData) {
    const newReport = {
      _id: `rep_${Date.now()}`,
      ...reportData,
      createdAt: new Date()
    };
    this.reports.unshift(newReport);
    // increment location report count
    const loc = this.findLocationById(reportData.locationId);
    if (loc) {
      loc.reportCount = (loc.reportCount || 0) + 1;
    }
    return newReport;
  }

  getRecentReports(limit = 20) {
    return this.reports.slice(0, limit);
  }

  getReportsByLocation(locId, limit = 10) {
    return this.reports.filter(r => r.locationId === locId).slice(0, limit);
  }

  // Journey methods
  addJourney(journeyData) {
    const newJourney = {
      _id: `jrn_${Date.now()}`,
      ...journeyData,
      status: journeyData.status || 'planned',
      createdAt: new Date()
    };
    this.journeys.unshift(newJourney);
    return newJourney;
  }

  getJourneysByUser(userId, limit = 20) {
    return this.journeys.filter(j => j.userId === userId).slice(0, limit);
  }

  findJourneyById(id) {
    return this.journeys.find(j => j._id === id);
  }
}

export const memoryStore = new MemoryStore();
export default memoryStore;
