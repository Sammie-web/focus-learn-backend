import quizService from '../services/quizService.js';
import { sendError, sendSuccess } from '../utils/responseFormatter.js';
import { normalizeQuizQuestions } from '../utils/adminPayloads.js';
import QuizQuestion from '../models/QuizQuestion.js';

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

export const createQuiz = async (req, res, next) => {
  try {
    const { moduleId, quizType, questions = [] } = req.body;
    if (!moduleId) {
      return sendError(res, 'Module id is required', ['Module id is required'], 400);
    }

    const normalizedQuestions = normalizeQuizQuestions(questions);
    if (!normalizedQuestions.length) {
      return sendError(res, 'At least one question is required', ['At least one question is required'], 400);
    }

    const createdQuestions = await QuizQuestion.insertMany(
      normalizedQuestions.map((question) => ({
        moduleId,
        ...question,
      }))
    );

    return sendSuccess(res, 'Quiz created', {
      moduleId,
      quizType: quizType || 'immediate',
      questions: createdQuestions,
    }, 201);
  } catch (error) {
    next(error);
  }
};
