// ============================================================================
// FLOWWISE — Database Seeder Script
// ============================================================================

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Location from '../models/Location.js';
import CrowdReport from '../models/CrowdReport.js';
import Journey from '../models/Journey.js';
import CrowdHistory from '../models/CrowdHistory.js';
import { DEMO_LOCATIONS } from './crowdEngine.js';

dotenv.config();

const seed = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/flowwise';
    console.log(`Connecting to MongoDB at ${mongoUri}...`);
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 });
    console.log('MongoDB connected successfully. Clearing existing collections...');

    await User.deleteMany({});
    await Location.deleteMany({});
    await CrowdReport.deleteMany({});
    await Journey.deleteMany({});
    await CrowdHistory.deleteMany({});

    console.log('Seeding demo user...');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('demo1234', salt);
    const user = await User.create({
      name: 'Radhika Sharma',
      email: 'demo@flowwise.app',
      password: hashedPassword,
      preferences: {
        defaultNavigationMode: 'balanced',
        transportMode: 'walking',
        alertNotifications: true
      }
    });

    console.log('Seeding Mathura-Vrindavan locations...');
    const insertedLocations = [];
    for (const loc of DEMO_LOCATIONS) {
      const doc = await Location.create({
        name: loc.name,
        shortName: loc.shortName,
        city: 'Mathura-Vrindavan',
        latitude: loc.latitude,
        longitude: loc.longitude,
        category: loc.category,
        baselineCrowd: loc.baselineCrowd,
        currentCrowdScore: loc.currentCrowdScore,
        crowdCategory: loc.currentCrowdScore <= 25 ? 'Low' : loc.currentCrowdScore <= 50 ? 'Moderate' : loc.currentCrowdScore <= 75 ? 'High' : 'Extremely High',
        reportCount: loc.reportCount || 20,
        peakHours: loc.peakHours
      });
      insertedLocations.push(doc);
    }

    console.log('Seeding historical crowd patterns...');
    for (const loc of insertedLocations) {
      for (let day = 0; day < 7; day++) {
        for (let hour of [6, 9, 12, 15, 18, 21]) {
          await CrowdHistory.create({
            locationId: loc._id,
            crowdScore: Math.min(100, Math.round(loc.baselineCrowd * (hour === 18 ? 1.4 : hour === 9 ? 1.3 : 0.8))),
            dataSource: 'simulated',
            dayOfWeek: day,
            hourOfDay: hour,
            timestamp: new Date(Date.now() - (day * 24 + (24 - hour)) * 3600 * 1000)
          });
        }
      }
    }

    console.log('Seeding sample community reports...');
    const reportsSample = [
      'Darshan line was fast moving today, very serene.',
      'Slight rush around main entrance, recommend entry from Gate 4.',
      'Evening Aarti was crowded but beautifully managed.',
      'Cool breeze by the river, very light crowd right now.',
      'Bazaar is packed with pedestrian pilgrims.'
    ];

    for (let i = 0; i < 15; i++) {
      const targetLoc = insertedLocations[i % insertedLocations.length];
      await CrowdReport.create({
        userId: user._id,
        locationId: targetLoc._id,
        locationName: targetLoc.name,
        crowdLevel: i % 3 === 0 ? 'High' : i % 3 === 1 ? 'Moderate' : 'Low',
        crowdScore: i % 3 === 0 ? 70 : i % 3 === 1 ? 45 : 20,
        description: reportsSample[i % reportsSample.length],
        latitude: targetLoc.latitude,
        longitude: targetLoc.longitude,
        verified: true,
        createdAt: new Date(Date.now() - i * 4 * 3600 * 1000)
      });
    }

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.warn(`Seed notice: ${err.message}. (In-memory store will be used seamlessly if MongoDB is not running).`);
    process.exit(0);
  }
};

seed();
