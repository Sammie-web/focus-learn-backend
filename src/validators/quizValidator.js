import { body, param } from 'express-validator';

export const moduleIdValidator = [param('moduleId').isMongoId().withMessage('Invalid module id')];

export const submitQuizValidator = [
  body('moduleId').isMongoId().withMessage('Module id is required'),
  body('answers').isArray({ min: 1 }).withMessage('Answers must be provided'),
  body('testType').optional().isIn(['immediate', 'delayed']).withMessage('Invalid test type'),
  body('timeSpent').optional().isNumeric().withMessage('Time spent must be numeric'),
];
