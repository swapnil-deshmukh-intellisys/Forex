import express from 'express';
import {
  getResources,
  getResource,
  getResourceProgress,
  updateProgress,
  submitQuizAnswer,
  getUserProgress,
  rateResource
} from '../controllers/education.controller.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/resources', getResources);
router.get('/resources/:id', getResource);

// Protected routes
router.use(authMiddleware);

router.get('/resources/:id/progress', getResourceProgress);
router.put('/resources/:id/progress', updateProgress);
router.post('/resources/:id/quiz', submitQuizAnswer);
router.get('/progress', getUserProgress);
router.post('/resources/:id/rate', rateResource);

export default router;

