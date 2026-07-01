import express from 'express';
import { submitNasaTlx } from '../controllers/nasaController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import validateRequest from '../middlewares/validateRequest.js';
import { nasaValidator } from '../validators/nasaValidator.js';

const router = express.Router();

router.post('/', authMiddleware, nasaValidator, validateRequest, submitNasaTlx);

export default router;
