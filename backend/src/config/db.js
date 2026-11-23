// ============================================================================
// FLOWWISE - Database Connection Configuration
// ============================================================================
// Connects to MongoDB via Mongoose. In DEMO_MODE, gracefully falls back
// to in-memory operation if MongoDB is unavailable.
// ============================================================================

import mongoose from 'mongoose';

/**
 * Connect to MongoDB database.
 * If DEMO_MODE is enabled and connection fails, the app continues
 * operating with in-memory data instead of crashing.
 *
 * @returns {Promise<mongoose.Connection|null>} The mongoose connection or null in demo fallback
 */
const connectDB = async () => {
  const mongoURI = process.env.MONGODB_URI;
  const demoMode = process.env.DEMO_MODE === 'true';

  // If no URI is configured, skip connection entirely
  if (!mongoURI) {
    if (demoMode) {
      console.warn(
        '⚠️  [DB] MONGODB_URI not set. Running in DEMO_MODE with in-memory data.'
      );
      return null;
    }
    throw new Error(
      'MONGODB_URI is not defined in environment variables. ' +
      'Set DEMO_MODE=true to run without a database.'
    );
  }

  try {
    const conn = await mongoose.connect(mongoURI, {
      // Mongoose 7+ no longer needs useNewUrlParser / useUnifiedTopology
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    console.log(`✅ [DB] MongoDB connected: ${conn.connection.host}`);

    // Graceful reconnection logging
    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️  [DB] MongoDB disconnected. Attempting reconnection…');
    });

    mongoose.connection.on('error', (err) => {
      console.error(`❌ [DB] MongoDB connection error: ${err.message}`);
    });

    mongoose.connection.on('reconnected', () => {
      console.log('✅ [DB] MongoDB reconnected.');
    });

    return conn.connection;
  } catch (error) {
    if (demoMode) {
      console.warn(
        `⚠️  [DB] MongoDB connection failed (${error.message}). ` +
        'Continuing in DEMO_MODE with in-memory data.'
      );
      return null;
    }
    console.error(`❌ [DB] MongoDB connection failed: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
