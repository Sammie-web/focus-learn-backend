import Result from '../models/Result.js';
import NasaTlx from '../models/NasaTlx.js';
import SessionLog from '../models/SessionLog.js';

class ResultRepository {
  async findImmediateResult(moduleId, userId) {
    return Result.findOne({ moduleId, userId, testType: 'immediate' }).lean();
  }

  async findDelayedResult(moduleId, userId) {
    return Result.findOne({ moduleId, userId, testType: 'delayed' }).lean();
  }

  async findResultsByModuleAndType(moduleId, testType) {
    return Result.find({ moduleId, testType }).sort({ completedAt: -1 }).lean();
  }

  async findNasaResultsByModule(moduleId) {
    return NasaTlx.find({ moduleId }).sort({ submittedAt: -1 }).lean();
  }

  async createSessionLogs(logs) {
    return SessionLog.insertMany(logs);
  }
}

export default new ResultRepository();
