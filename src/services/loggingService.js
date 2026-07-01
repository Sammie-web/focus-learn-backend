import resultRepository from '../repositories/resultRepository.js';

class LoggingService {
  async createBulkLogs(logs, userId) {
    const normalizedLogs = logs.map((entry, index) => ({
      ...entry,
      sessionId: entry.sessionId || `session-${userId || 'anonymous'}-${Date.now()}-${index}`,
      userId: entry.userId || userId || null,
      timestamp: entry.timestamp ? new Date(entry.timestamp) : new Date(),
      duration: Number(entry.duration) || 0,
    }));

    return resultRepository.createSessionLogs(normalizedLogs);
  }
}

export default new LoggingService();
