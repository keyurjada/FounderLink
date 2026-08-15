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
    },
    githubLink: { type: String, default: '' },
    figmaLink: { type: String, default: '' },
    docsLink: { type: String, default: '' },
    targetLaunchDate: { type: Date }
  },
  {
    timestamps: true
  }
);

export default mongoose.model('Workspace', workspaceSchema);
