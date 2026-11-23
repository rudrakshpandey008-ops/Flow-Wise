import mongoose from 'mongoose';

const journeySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  source: {
    name: { type: String, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true }
  },
  destination: {
    name: { type: String, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true }
  },
  departureTime: {
    type: Date,
    default: Date.now
  },
  transportMode: {
    type: String,
    enum: ['walking', 'two_wheeler', 'transit', 'car'],
    default: 'walking'
  },
  travelPreference: {
    type: String,
    enum: ['fastest', 'least_crowded', 'balanced'],
    default: 'balanced'
  },
  routes: [{
    label: String,
    travelTime: Number,       // in minutes
    distance: Number,         // in km
    crowdDensity: Number,     // 0-100
    crowdExposure: Number,    // 0-100
    comfortScore: Number,     // 0-100 (100=most comfortable)
    routeScore: Number,       // 0-100 (lower = better)
    recommendation: String,
    waypoints: [{
      lat: Number,
      lng: Number
    }]
  }],
  selectedRoute: {
    type: Number,  // index into routes array
    default: 0
  },
  status: {
    type: String,
    enum: ['planned', 'in_progress', 'completed', 'cancelled'],
    default: 'planned'
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  }
});

journeySchema.index({ userId: 1, createdAt: -1 });

const Journey = mongoose.models.Journey || mongoose.model('Journey', journeySchema);

export default Journey;
