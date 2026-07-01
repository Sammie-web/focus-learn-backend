import express from 'express';
import { getDashboard, getParticipants, assignGroups, getAnalytics, getResults, exportCsv } from '../controllers/adminController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import adminMiddleware from '../middlewares/adminMiddleware.js';

const router = express.Router();

router.get('/dashboard', authMiddleware, adminMiddleware, getDashboard);
router.get('/participants', authMiddleware, adminMiddleware, getParticipants);
router.post('/participants/assign', authMiddleware, adminMiddleware, assignGroups);
router.get('/analytics', authMiddleware, adminMiddleware, getAnalytics);
router.get('/results', authMiddleware, adminMiddleware, getResults);
router.get('/export', authMiddleware, adminMiddleware, exportCsv);

export default router;
