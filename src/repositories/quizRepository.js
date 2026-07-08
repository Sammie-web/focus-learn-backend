import QuizQuestion from '../models/QuizQuestion.js';
import Result from '../models/Result.js';
import NasaTlx from '../models/NasaTlx.js';

class QuizRepository {
  async findQuestionsByModuleId(moduleId) {
    return QuizQuestion.find({ moduleId }).sort({ questionNumber: 1 }).lean();
  }

  async findQuestionsByModuleIdAndType(moduleId, quizType) {
    return QuizQuestion.find({ moduleId, quizType }).sort({ questionNumber: 1 }).lean();
  }

  async deleteQuestionsByModuleId(moduleId) {
    return QuizQuestion.deleteMany({ moduleId });
  }

  async deleteQuestionsByModuleIdAndType(moduleId, quizType) {
    return QuizQuestion.deleteMany({ moduleId, quizType });
  }

  async getQuizSummary() {
    return QuizQuestion.aggregate([
      {
        $group: {
          _id: { moduleId: '$moduleId', quizType: '$quizType' },
          questions: { $sum: 1 },
        },
      },
      {
        $project: {
          moduleId: '$_id.moduleId',
          quizType: '$_id.quizType',
          questions: 1,
          _id: 0,
        },
      },
      {
        $sort: { moduleId: 1, quizType: 1 },
      },
    ]).exec();
  }

  async createResult(data) {
    const result = await Result.create(data);
    return result.toObject();
  }

  async findResultByUserAndModule(userId, moduleId, testType) {
    return Result.findOne({ userId, moduleId, testType }).lean();
  }

  async createNasaSubmission(data) {
    const record = await NasaTlx.create(data);
    return record.toObject();
  }

  async findNasaSubmissionByUserAndModule(userId, moduleId) {
    return NasaTlx.findOne({ userId, moduleId }).lean();
  }
}

export default new QuizRepository();
