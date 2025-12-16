import express from 'express';
import {
  calculatePositionSize,
  calculateMargin,
  calculateRiskReward,
  getAccountExposure,
  getRiskMetrics,
  getRiskAnalysis
} from '../controllers/riskManagement.controller.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

router.post('/position-size', calculatePositionSize);
router.post('/margin', calculateMargin);
router.post('/risk-reward', calculateRiskReward);
router.get('/exposure', getAccountExposure);
router.get('/metrics', getRiskMetrics);
router.get('/analysis', getRiskAnalysis);

export default router;

