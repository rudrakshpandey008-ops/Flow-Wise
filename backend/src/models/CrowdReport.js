import mongoose from 'mongoose';

const crowdReportSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  locationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Location',
    required: true
  },
  locationName: {
    type: String,
    trim: true
  },
  crowdLevel: {
    type: String,
    required: true,
    enum: ['Low', 'Moderate', 'High', 'Extremely High']
  },
  crowdScore: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  description: {
    type: String,
    trim: true,
    maxlength: 500
  },
  latitude: Number,
  longitude: Number,
  verified: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  }
});

crowdReportSchema.index({ locationId: 1, createdAt: -1 });
crowdReportSchema.index({ userId: 1, createdAt: -1 });

const CrowdReport = mongoose.models.CrowdReport || mongoose.model('CrowdReport', crowdReportSchema);

export default CrowdReport;
