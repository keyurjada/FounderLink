import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema(
  {
    startupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ideaform',
      required: true
    },
    applicantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    pitchText: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['Pending', 'Under Review', 'Accepted', 'Rejected'],
      default: 'Pending'
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model('Application', applicationSchema);
