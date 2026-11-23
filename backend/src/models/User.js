import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 6,
    select: false
  },
  preferences: {
    defaultNavigationMode: {
      type: String,
      enum: ['fastest', 'least_crowded', 'balanced'],
      default: 'balanced'
    },
    transportMode: {
      type: String,
      enum: ['walking', 'two_wheeler', 'transit', 'car'],
      default: 'walking'
    },
    alertNotifications: {
      type: Boolean,
      default: true
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Avoid OverwriteModelError in watch / dev mode
const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
