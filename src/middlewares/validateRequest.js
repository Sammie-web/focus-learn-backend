import { validationResult } from 'express-validator';
import { sendError } from '../utils/responseFormatter.js';

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendError(res, 'Validation error', errors.array().map((error) => error.msg), 400);
  }
  return next();
};

export default validateRequest;
