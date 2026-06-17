import mongoose from 'mongoose';

const actionLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required for log entries'],
      index: true
    },
    rawInput: {
      type: String,
      required: [true, 'Original raw activity text is required'],
      trim: true
    },
    actionSummary: {
      type: String,
      required: [true, 'Action summary is required']
    },
    estimatedCo2Kg: {
      type: Number,
      required: [true, 'Estimated CO2 impact weight is required']
    },
    scoreImpact: {
      type: Number,
      required: [true, 'Eco-score adjustment factor is required']
    },
    loggedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

const ActionLog = mongoose.model('ActionLog', actionLogSchema);

export default ActionLog;
