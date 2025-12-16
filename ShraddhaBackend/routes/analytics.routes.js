import express from 'express';
import { 
  getUserAnalytics, 
  getTradingHistory, 
  getPerformanceMetrics 
} from '../controllers/analytics.controller.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Get user analytics
router.get('/user', getUserAnalytics);

// Get trading history
router.get('/history', getTradingHistory);

// Get performance metrics
router.get('/performance', getPerformanceMetrics);

export default router;

