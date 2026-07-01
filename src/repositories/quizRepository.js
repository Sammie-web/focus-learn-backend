import QuizQuestion from '../models/QuizQuestion.js';
import Result from '../models/Result.js';
import NasaTlx from '../models/NasaTlx.js';

class QuizRepository {
  async findQuestionsByModuleId(moduleId) {
    return QuizQuestion.find({ moduleId }).sort({ questionNumber: 1 }).lean();
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
