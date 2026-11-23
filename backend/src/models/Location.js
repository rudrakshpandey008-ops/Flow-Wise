import mongoose from 'mongoose';

const locationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  shortName: {
    type: String,
    trim: true
  },
  city: {
    type: String,
    default: 'Mathura-Vrindavan'
  },
  latitude: {
    type: Number,
    required: true
  },
  longitude: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Temple', 'Transit', 'Ghat', 'Market', 'Heritage', 'Hub']
  },
  baselineCrowd: {
    type: Number,
    default: 30, // 0-100 baseline
    min: 0,
    max: 100
  },
  peakHours: {
    morning: { start: { type: Number, default: 6 }, end: { type: Number, default: 11 } },
    evening: { start: { type: Number, default: 16 }, end: { type: Number, default: 21 } }
  },
  currentCrowdScore: {
    type: Number,
    default: 20,
    min: 0,
    max: 100
  },
  crowdCategory: {
    type: String,
    enum: ['Low', 'Moderate', 'High', 'Extremely High'],
    default: 'Low'
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  reportCount: {
    type: Number,
    default: 0
  },
  recentTrend: {
    type: String,
    enum: ['rising', 'falling', 'stable'],
    default: 'stable'
  },
  metadata: {
    bestTimeToVisit: String,
    entryFee: String,
    wheelchairAccessible: Boolean
  }
});

locationSchema.index({ latitude: 1, longitude: 1 });
locationSchema.index({ name: 'text' });

const Location = mongoose.models.Location || mongoose.model('Location', locationSchema);

export default Location;
