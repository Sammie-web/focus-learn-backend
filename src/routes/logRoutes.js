import express from 'express';
import { bulkLog } from '../controllers/logController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', authMiddleware, bulkLog);

export default router;
