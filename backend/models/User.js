import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    firebaseUid: {
      type: String,
      required: [true, 'Firebase UID is required'],
      unique: true,
      trim: true,
      index: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true
    },
    username: {
      type: String,
      trim: true
    },
    worldHealthScore: {
      type: Number,
      default: 50,
      min: [0, 'World health score cannot be lower than 0'],
      max: [100, 'World health score cannot exceed 100']
    },
    totalCo2EmittedKg: {
      type: Number,
      default: 0,
      min: [0, 'Carbon emission metric cannot be negative']
    }
  },
  {
    timestamps: true
  }
);

const User = mongoose.model('User', userSchema);

export default User;
