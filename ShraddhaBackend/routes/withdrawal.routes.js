import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import {
  submitWithdrawalRequest,
  getCurrentUserWithdrawalRequests,
  getWithdrawalRequests,
  verifyWithdrawalRequest
} from '../controllers/withdrawal.controller.js';

const router = express.Router();

// User routes (require authentication)
router.post('/submit', authMiddleware, submitWithdrawalRequest);
router.get('/user', authMiddleware, getCurrentUserWithdrawalRequests);

// Admin routes (require authentication)
router.get('/admin', authMiddleware, getWithdrawalRequests);
router.put('/admin/:requestId/verify', authMiddleware, verifyWithdrawalRequest);

export default router;
