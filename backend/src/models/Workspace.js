import mongoose from 'mongoose';

const workspaceSchema = new mongoose.Schema(
  {
    matchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Application',
      required: true
    },
    startupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ideaform',
      required: true
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model('Workspace', workspaceSchema);
