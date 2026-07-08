import express from 'express';
import { getQuestions, submitQuiz, getEligibility, getQuizSummary, createQuiz, updateQuiz } from '../controllers/quizController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import adminMiddleware from '../middlewares/adminMiddleware.js';
import validateRequest from '../middlewares/validateRequest.js';
import { moduleIdValidator, submitQuizValidator } from '../validators/quizValidator.js';

const router = express.Router();

router.post('/create', authMiddleware, adminMiddleware, createQuiz);
router.get('/summary', authMiddleware, adminMiddleware, getQuizSummary);
router.put('/:moduleId', authMiddleware, adminMiddleware, updateQuiz);
router.get('/:moduleId', authMiddleware, moduleIdValidator, validateRequest, getQuestions);
router.get('/:moduleId/eligibility', authMiddleware, moduleIdValidator, validateRequest, getEligibility);
router.post('/submit', authMiddleware, submitQuizValidator, validateRequest, submitQuiz);

export default router;
