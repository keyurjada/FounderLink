import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
  {
    workspaceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Workspace',
      required: true
    },
    title: {
      type: String,
      required: true
    },
    assignee: {
      type: String,
      default: 'Unassigned'
    },
    status: {
      type: String,
      enum: ['todo', 'inprogress', 'completed'],
      default: 'todo'
    },
    dueDate: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model('Task', taskSchema);
