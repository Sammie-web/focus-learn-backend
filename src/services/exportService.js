import Result from '../models/Result.js';
import { buildCsv } from '../utils/csvExporter.js';

class ExportService {
  async exportResults() {
    const results = await Result.find().populate('userId', 'fullName email').populate('moduleId', 'title').sort({ completedAt: -1 }).lean();

    const rows = results.map((result) => ({
      id: result._id.toString(),
      user: result.userId?.fullName || 'Unknown',
      email: result.userId?.email || 'Unknown',
      module: result.moduleId?.title || 'Unknown',
      testType: result.testType,
      score: result.score,
      percentage: result.percentage,
      completedAt: result.completedAt?.toISOString(),
    }));

    const headers = ['id', 'user', 'email', 'module', 'testType', 'score', 'percentage', 'completedAt'];
    return buildCsv(rows, headers);
  }
}

export default new ExportService();
