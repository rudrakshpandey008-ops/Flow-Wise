import mongoose from 'mongoose';

const crowdHistorySchema = new mongoose.Schema({
  locationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Location',
    required: true
  },
  crowdScore: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  crowdCategory: {
    type: String,
    enum: ['Low', 'Moderate', 'High', 'Extremely High']
  },
  dataSource: {
    type: String,
    enum: ['community_report', 'simulated', 'predicted', 'sensor'],
    default: 'simulated'
  },
  dayOfWeek: {
    type: Number,
    min: 0,
    max: 6
  },
  hourOfDay: {
    type: Number,
    min: 0,
    max: 23
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  }
});

crowdHistorySchema.index({ locationId: 1, timestamp: -1 });
crowdHistorySchema.index({ locationId: 1, dayOfWeek: 1, hourOfDay: 1 });

const CrowdHistory = mongoose.models.CrowdHistory || mongoose.model('CrowdHistory', crowdHistorySchema);

export default CrowdHistory;
