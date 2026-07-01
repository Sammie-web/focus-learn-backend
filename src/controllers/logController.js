import loggingService from '../services/loggingService.js';
import { sendSuccess } from '../utils/responseFormatter.js';

export const bulkLog = async (req, res, next) => {
  try {
    const logs = await loggingService.createBulkLogs(req.body, req.user?._id || null);
    return sendSuccess(res, 'Logs stored', logs, 201);
  } catch (error) {
    next(error);
  }
};
