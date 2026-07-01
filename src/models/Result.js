import mongoose from 'mongoose';
import { TEST_TYPES } from '../config/constants.js';

const resultSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    moduleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Module', required: true },
    testType: { type: String, enum: Object.values(TEST_TYPES), required: true },
    score: { type: Number, required: true },
    percentage: { type: Number, required: true },
    answersSubmitted: [{ type: Object }],
    timeSpent: { type: Number, default: 0 },
    completedAt: { type: Date, default: Date.now },
    groupAssignment: { type: String },
  },
  { timestamps: true }
);

const Result = mongoose.model('Result', resultSchema);
export default Result;
