import analyticsService from '../services/analyticsService.js';
import exportService from '../services/exportService.js';
import { sendSuccess } from '../utils/responseFormatter.js';

export const getDashboard = async (req, res, next) => {
  try {
    const stats = await analyticsService.getDashboardStats();
    return sendSuccess(res, 'Dashboard data fetched', stats);
  } catch (error) {
    next(error);
  }
};

export const getParticipants = async (req, res, next) => {
  try {
    const participants = await analyticsService.getParticipants();
    return sendSuccess(res, 'Participants fetched', participants);
  } catch (error) {
    next(error);
  }
};

export const assignGroups = async (req, res, next) => {
  try {
    const { participantIds, group } = req.body;
    const participants = await analyticsService.assignGroups(participantIds, group);
    return sendSuccess(res, 'Groups assigned', participants);
  } catch (error) {
    next(error);
  }
};

export const getAnalytics = async (req, res, next) => {
  try {
    const analytics = await analyticsService.getAnalytics();
    return sendSuccess(res, 'Analytics fetched', analytics);
  } catch (error) {
    next(error);
  }
};

export const getResults = async (req, res, next) => {
  try {
    const results = await analyticsService.getResults();
    return sendSuccess(res, 'Results fetched', results);
  } catch (error) {
    next(error);
  }
};

export const exportCsv = async (req, res, next) => {
  try {
    const csv = await exportService.exportResults();
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=focuslearn-results.csv');
    return res.send(csv);
  } catch (error) {
    next(error);
  }
};
