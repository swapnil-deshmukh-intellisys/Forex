import express from 'express';
import {
  getJournalEntries,
  getJournalEntry,
  createJournalEntry,
  updateJournalEntry,
  deleteJournalEntry,
  getJournalStats
} from '../controllers/journal.controller.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

router.get('/', getJournalEntries);
router.get('/stats/summary', getJournalStats);
router.get('/:id', getJournalEntry);
router.post('/', createJournalEntry);
router.put('/:id', updateJournalEntry);
router.delete('/:id', deleteJournalEntry);

export default router;

