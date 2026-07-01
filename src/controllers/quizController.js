import quizService from '../services/quizService.js';
import { sendError, sendSuccess } from '../utils/responseFormatter.js';

export const getQuestions = async (req, res, next) => {
  try {
    const questions = await quizService.getQuestions(req.params.moduleId);
    return sendSuccess(res, 'Questions fetched', questions);
  } catch (error) {
    next(error);
  }
};

export const submitQuiz = async (req, res, next) => {
  try {
    const result = await quizService.submitQuiz(req.body, req.user._id);
    return sendSuccess(res, 'Quiz submitted', result, 201);
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
