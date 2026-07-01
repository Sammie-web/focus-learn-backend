import quizService from '../services/quizService.js';
import { sendSuccess } from '../utils/responseFormatter.js';

export const submitNasaTlx = async (req, res, next) => {
  try {
    const result = await quizService.submitNasaSurvey(req.body, req.user._id);
    return sendSuccess(res, 'NASA-TLX submitted', result, 201);
  } catch (error) {
    next(error);
  }
};
