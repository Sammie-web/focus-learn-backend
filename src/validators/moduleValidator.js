import { body, param } from 'express-validator';

export const moduleValidator = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('sections').isArray({ min: 1 }).withMessage('At least one section is required'),
];

export const moduleIdValidator = [param('id').isMongoId().withMessage('Invalid module id')];
