import Result from '../models/Result.js';
import { sendSuccess, sendError } from '../utils/responseFormatter.js';
import quizService from '../services/quizService.js';

export const getImmediateResult = async (req, res, next) => {
  try {
    const result = await Result.findOne({ userId: req.user._id, moduleId: req.params.moduleId, testType: 'immediate' }).lean();
    if (!result) {
      return sendError(res, 'Immediate result not found', [], 404);
    }
    return sendSuccess(res, 'Immediate result fetched', result);
  } catch (error) {
    next(error);
  }
};

export const getDelayedResult = async (req, res, next) => {
  try {
    const result = await Result.findOne({ userId: req.user._id, moduleId: req.params.moduleId, testType: 'delayed' }).lean();
    if (!result) {
      return sendError(res, 'Delayed result not found', [], 404);
    }
    return sendSuccess(res, 'Delayed result fetched', result);
  } catch (error) {
    next(error);
  }
};

export const getEligibility = async (req, res, next) => {
  try {
    const eligibility = await quizService.getEligibility(req.params.moduleId, req.user._id);
    return sendSuccess(res, 'Eligibility checked', eligibility);
  } catch (error) {
    next(error);
  }
};
