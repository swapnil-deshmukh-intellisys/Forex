import express from 'express';
import {
  calculateIndicators,
  getTradingSignals,
  calculateFibonacci,
  getTechnicalAnalysis
} from '../controllers/technicalAnalysis.controller.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

router.post('/indicators', calculateIndicators);
router.post('/signals', getTradingSignals);
router.post('/fibonacci', calculateFibonacci);
router.post('/analysis', getTechnicalAnalysis);

export default router;

