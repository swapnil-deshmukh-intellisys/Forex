import express from 'express';
import {
  getWatchlist,
  addInstrument,
  removeInstrument,
  addPriceAlert,
  removePriceAlert,
  updateInstrument
} from '../controllers/watchlist.controller.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

router.get('/', getWatchlist);
router.post('/instruments', addInstrument);
router.put('/instruments/:symbol', updateInstrument);
router.delete('/instruments/:symbol', removeInstrument);
router.post('/instruments/:symbol/alerts', addPriceAlert);
router.delete('/instruments/:symbol/alerts/:alertId', removePriceAlert);

export default router;

