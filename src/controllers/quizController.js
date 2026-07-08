import quizService from '../services/quizService.js';
import quizRepository from '../repositories/quizRepository.js';
import { sendError, sendSuccess } from '../utils/responseFormatter.js';
import { normalizeQuizQuestions } from '../utils/adminPayloads.js';
import QuizQuestion from '../models/QuizQuestion.js';

export const getQuestions = async (req, res, next) => {
  try {
    const quizType = req.query.quizType?.toString().trim().toLowerCase();
    const includeAnswers = req.query.includeAnswers === 'true';
    const questions = await quizService.getQuestions(req.params.moduleId, quizType, includeAnswers);
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

export const getQuizSummary = async (req, res, next) => {
  try {
    const summary = await quizRepository.getQuizSummary();
    return sendSuccess(res, 'Quiz summary fetched', summary);
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
        quizType: (quizType || 'immediate').toString().trim().toLowerCase(),
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

export const updateQuiz = async (req, res, next) => {
  try {
    const moduleId = req.params.moduleId;
    const { quizType, questions = [] } = req.body;
    if (!moduleId) {
      return sendError(res, 'Module id is required', ['Module id is required'], 400);
    }

    const normalizedQuestions = normalizeQuizQuestions(questions);
    if (!normalizedQuestions.length) {
      return sendError(res, 'At least one question is required', ['At least one question is required'], 400);
    }

    await quizRepository.deleteQuestionsByModuleIdAndType(moduleId, (quizType || 'immediate').toString().trim().toLowerCase());
    const updatedQuestions = await QuizQuestion.insertMany(
      normalizedQuestions.map((question) => ({
        moduleId,
        quizType: (quizType || 'immediate').toString().trim().toLowerCase(),
        ...question,
      }))
    );

    return sendSuccess(res, 'Quiz updated', {
      moduleId,
      quizType: quizType || 'immediate',
      questions: updatedQuestions,
    });
  } catch (error) {
    next(error);
  }
};
