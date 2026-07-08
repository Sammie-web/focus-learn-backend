import Result from '../models/Result.js';
import NasaTlx from '../models/NasaTlx.js';
import User from '../models/User.js';
import Module from '../models/Module.js';
import { USER_GROUPS, USER_ROLES } from '../config/constants.js';

class AnalyticsService {
  async getDashboardStats() {
    const [userCount, moduleCount, resultCount, nasaCount] = await Promise.all([
      User.countDocuments(),
      Module.countDocuments(),
      Result.countDocuments(),
      NasaTlx.countDocuments(),
    ]);

    return {
      userCount,
      moduleCount,
      resultCount,
      nasaCount,
    };
  }

  async getParticipants() {
    return User.find({ role: USER_ROLES.STUDENT }).sort({ createdAt: -1 }).lean();
  }

  async assignGroups(userIds, group) {
    if (!Array.isArray(userIds) || userIds.length === 0) {
      throw new Error('At least one participant is required.');
    }

    const targetGroup = group?.toString().trim().toLowerCase();
    if (!['control', 'experimental'].includes(targetGroup)) {
      throw new Error('Invalid group selection.');
    }

    const [targetUsers, otherUsers] = await Promise.all([
      User.find({ role: USER_ROLES.STUDENT, group: targetGroup }).lean(),
      User.find({ role: USER_ROLES.STUDENT, group: { $ne: targetGroup } }).lean(),
    ]);

    const targetCount = targetUsers.length + userIds.length;
    const otherCount = otherUsers.length - userIds.length;

    if (targetCount < 5 || targetCount > 8 || otherCount < 5 || otherCount > 8) {
      throw new Error(`Each group must contain between 5 and 8 participants. Current totals would be ${targetCount} in ${targetGroup} and ${otherCount} in the other group.`);
    }

    await User.updateMany({ _id: { $in: userIds } }, { group: targetGroup });
    return User.find({ _id: { $in: userIds } }).lean();
  }

  async getAnalytics() {
    const [averageNasa, immediateResults, delayedResults] = await Promise.all([
      NasaTlx.aggregate([{ $group: { _id: null, averageComposite: { $avg: '$compositeScore' } } }]),
      Result.aggregate([{ $match: { testType: 'immediate' } }, { $group: { _id: null, averageScore: { $avg: '$percentage' } } }]),
      Result.aggregate([{ $match: { testType: 'delayed' } }, { $group: { _id: null, averageScore: { $avg: '$percentage' } } }]),
    ]);

    const groupComparisons = await Result.aggregate([
      { $match: { groupAssignment: { $in: [USER_GROUPS.CONTROL, USER_GROUPS.EXPERIMENTAL] } } },
      { $group: { _id: { groupAssignment: '$groupAssignment', testType: '$testType' }, averageScore: { $avg: '$percentage' } } },
    ]);

    const grouped = groupComparisons.reduce((acc, item) => {
      const key = item._id.groupAssignment;
      if (!acc[key]) acc[key] = {};
      acc[key][item._id.testType] = item.averageScore;
      return acc;
    }, {});

    const averageNasaScore = averageNasa[0]?.averageComposite ?? 0;
    const immediateAverage = immediateResults[0]?.averageScore ?? 0;
    const delayedAverage = delayedResults[0]?.averageScore ?? 0;

    return {
      averageNasaScore: Number(averageNasaScore.toFixed(2)),
      immediateRecallAverage: Number(immediateAverage.toFixed(2)),
      delayedRecallAverage: Number(delayedAverage.toFixed(2)),
      retentionDrop: Number((immediateAverage - delayedAverage).toFixed(2)),
      groupComparisons: {
        control: grouped[USER_GROUPS.CONTROL] || {},
        experimental: grouped[USER_GROUPS.EXPERIMENTAL] || {},
      },
    };
  }

  async getResults() {
    return Result.find().populate('userId', 'fullName email').populate('moduleId', 'title').sort({ completedAt: -1 }).lean();
  }
}

export default new AnalyticsService();
