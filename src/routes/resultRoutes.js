import express from 'express';
import { getImmediateResult, getDelayedResult, getEligibility } from '../controllers/resultController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/immediate/:moduleId', authMiddleware, getImmediateResult);
router.get('/delayed/:moduleId', authMiddleware, getDelayedResult);
router.get('/eligibility/:moduleId', authMiddleware, getEligibility);

export default router;
