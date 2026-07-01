import mongoose from 'mongoose';

const sessionLogSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    moduleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Module' },
    sessionId: { type: String, required: true },
    eventType: { type: String, required: true },
    eventDetail: { type: String },
    pageURL: { type: String },
    timestamp: { type: Date, default: Date.now },
    duration: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const SessionLog = mongoose.model('SessionLog', sessionLogSchema);
export default SessionLog;
