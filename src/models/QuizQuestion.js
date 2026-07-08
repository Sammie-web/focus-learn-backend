import mongoose from 'mongoose';
import { TEST_TYPES } from '../config/constants.js';

const quizQuestionSchema = new mongoose.Schema(
  {
    moduleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Module', required: true },
    quizType: { type: String, required: true, trim: true, lowercase: true },
    questionNumber: { type: Number, required: true },
    questionText: { type: String, required: true },
    options: [{ type: String, required: true }],
    correctAnswerIndex: { type: Number, required: true },
    explanation: { type: String },
  },
  { timestamps: true }
);

const QuizQuestion = mongoose.model('QuizQuestion', quizQuestionSchema);
export default QuizQuestion;
