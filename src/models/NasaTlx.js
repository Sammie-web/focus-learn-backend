import mongoose from 'mongoose';

const nasaTlxSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    moduleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Module', required: true },
    mentalDemand: { type: Number, required: true },
    physicalDemand: { type: Number, required: true },
    temporalDemand: { type: Number, required: true },
    performance: { type: Number, required: true },
    effort: { type: Number, required: true },
    frustration: { type: Number, required: true },
    compositeScore: { type: Number, required: true },
    submittedAt: { type: Date, default: Date.now },
    groupAssignment: { type: String },
  },
  { timestamps: true }
);

const NasaTlx = mongoose.model('NasaTlx', nasaTlxSchema);
export default NasaTlx;
