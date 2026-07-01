import { body } from 'express-validator';

export const nasaValidator = [
  body('moduleId').isMongoId().withMessage('Module id is required'),
  body('mentalDemand').isNumeric().withMessage('mentalDemand must be numeric'),
  body('physicalDemand').isNumeric().withMessage('physicalDemand must be numeric'),
  body('temporalDemand').isNumeric().withMessage('temporalDemand must be numeric'),
  body('performance').isNumeric().withMessage('performance must be numeric'),
  body('effort').isNumeric().withMessage('effort must be numeric'),
  body('frustration').isNumeric().withMessage('frustration must be numeric'),
];
