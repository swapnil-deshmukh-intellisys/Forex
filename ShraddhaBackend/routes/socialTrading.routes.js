import express from 'express';
import {
  getLeaderboard,
  getTraderProfile,
  createOrUpdateTraderProfile,
  updateTraderStats,
  startCopyTrading,
  stopCopyTrading,
  getCopyTrades,
  followTrader
} from '../controllers/socialTrading.controller.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

router.get('/leaderboard', getLeaderboard);
router.get('/trader/:traderId', getTraderProfile);
router.post('/trader/profile', createOrUpdateTraderProfile);
router.put('/trader/stats', updateTraderStats);
router.post('/copy-trade', startCopyTrading);
router.put('/copy-trade/:copyTradeId', stopCopyTrading);
router.get('/copy-trade', getCopyTrades);
router.post('/trader/:traderId/follow', followTrader);

export default router;

