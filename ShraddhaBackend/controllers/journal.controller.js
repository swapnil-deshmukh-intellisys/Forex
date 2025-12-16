import TradingJournal from '../models/TradingJournal.js';
import Account from '../models/Account.js';
import { asyncHandler } from '../middleware/errorHandler.js';

// @desc    Get all journal entries for a user
// @route   GET /api/journal
// @access  Private
export const getJournalEntries = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const {
    page = 1,
    limit = 20,
    sortBy = 'entryDate',
    sortOrder = 'desc',
    currencyPair,
    tradeType,
    tags,
    startDate,
    endDate,
    search
  } = req.query;

  const query = { user: userId };

  // Apply filters
  if (currencyPair) {
    query.currencyPair = new RegExp(currencyPair, 'i');
  }
  if (tradeType) {
    query.tradeType = tradeType;
  }
  if (tags) {
    query.tags = { $in: Array.isArray(tags) ? tags : [tags] };
  }
  if (startDate || endDate) {
    query.entryDate = {};
    if (startDate) query.entryDate.$gte = new Date(startDate);
    if (endDate) query.entryDate.$lte = new Date(endDate);
  }
  if (search) {
    query.$or = [
      { title: new RegExp(search, 'i') },
      { notes: new RegExp(search, 'i') },
      { currencyPair: new RegExp(search, 'i') }
    ];
  }

  const sortOptions = {};
  sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const entries = await TradingJournal.find(query)
    .populate('account', 'accountNumber type status')
    .sort(sortOptions)
    .skip(skip)
    .limit(parseInt(limit));

  const total = await TradingJournal.countDocuments(query);

  res.json({
    success: true,
    entries,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / parseInt(limit))
    }
  });
});

// @desc    Get single journal entry
// @route   GET /api/journal/:id
// @access  Private
export const getJournalEntry = asyncHandler(async (req, res) => {
  const entry = await TradingJournal.findOne({
    _id: req.params.id,
    user: req.user._id
  }).populate('account', 'accountNumber type status');

  if (!entry) {
    return res.status(404).json({
      success: false,
      message: 'Journal entry not found'
    });
  }

  res.json({
    success: true,
    entry
  });
});

// @desc    Create journal entry
// @route   POST /api/journal
// @access  Private
export const createJournalEntry = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const {
    account,
    title,
    entryDate,
    currencyPair,
    tradeType,
    entryPrice,
    exitPrice,
    stopLoss,
    takeProfit,
    lotSize,
    profit,
    notes,
    tags,
    emotions,
    lessons,
    rating
  } = req.body;

  // Verify account belongs to user if provided
  if (account) {
    const accountDoc = await Account.findOne({ _id: account, user: userId });
    if (!accountDoc) {
      return res.status(404).json({
        success: false,
        message: 'Account not found'
      });
    }
  }

  const entry = await TradingJournal.create({
    user: userId,
    account: account || null,
    title: title || 'Untitled Entry',
    entryDate: entryDate || new Date(),
    currencyPair,
    tradeType: tradeType || 'Note',
    entryPrice,
    exitPrice,
    stopLoss,
    takeProfit,
    lotSize,
    profit: profit || 0,
    notes,
    tags: tags || [],
    emotions,
    lessons,
    rating
  });

  res.status(201).json({
    success: true,
    entry
  });
});

// @desc    Update journal entry
// @route   PUT /api/journal/:id
// @access  Private
export const updateJournalEntry = asyncHandler(async (req, res) => {
  const entry = await TradingJournal.findOne({
    _id: req.params.id,
    user: req.user._id
  });

  if (!entry) {
    return res.status(404).json({
      success: false,
      message: 'Journal entry not found'
    });
  }

  // Verify account belongs to user if provided
  if (req.body.account) {
    const accountDoc = await Account.findOne({
      _id: req.body.account,
      user: req.user._id
    });
    if (!accountDoc) {
      return res.status(404).json({
        success: false,
        message: 'Account not found'
      });
    }
  }

  Object.assign(entry, req.body);
  await entry.save();

  res.json({
    success: true,
    entry
  });
});

// @desc    Delete journal entry
// @route   DELETE /api/journal/:id
// @access  Private
export const deleteJournalEntry = asyncHandler(async (req, res) => {
  const entry = await TradingJournal.findOneAndDelete({
    _id: req.params.id,
    user: req.user._id
  });

  if (!entry) {
    return res.status(404).json({
      success: false,
      message: 'Journal entry not found'
    });
  }

  res.json({
    success: true,
    message: 'Journal entry deleted successfully'
  });
});

// @desc    Get journal statistics
// @route   GET /api/journal/stats/summary
// @access  Private
export const getJournalStats = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { startDate, endDate } = req.query;

  const query = { user: userId };
  if (startDate || endDate) {
    query.entryDate = {};
    if (startDate) query.entryDate.$gte = new Date(startDate);
    if (endDate) query.entryDate.$lte = new Date(endDate);
  }

  const entries = await TradingJournal.find(query);

  const stats = {
    totalEntries: entries.length,
    totalTrades: entries.filter(e => e.tradeType !== 'Note' && e.tradeType !== 'Analysis').length,
    totalProfit: entries.reduce((sum, e) => sum + (e.profit || 0), 0),
    winningTrades: entries.filter(e => e.profit > 0).length,
    losingTrades: entries.filter(e => e.profit < 0).length,
    averageProfit: 0,
    mostTradedPair: null,
    topEmotions: {},
    tagsCount: {}
  };

  if (stats.totalTrades > 0) {
    stats.averageProfit = stats.totalProfit / stats.totalTrades;
  }

  // Most traded pair
  const pairCounts = {};
  entries.forEach(e => {
    if (e.currencyPair) {
      pairCounts[e.currencyPair] = (pairCounts[e.currencyPair] || 0) + 1;
    }
  });
  if (Object.keys(pairCounts).length > 0) {
    stats.mostTradedPair = Object.entries(pairCounts)
      .sort((a, b) => b[1] - a[1])[0][0];
  }

  // Top emotions
  entries.forEach(e => {
    if (e.emotions) {
      stats.topEmotions[e.emotions] = (stats.topEmotions[e.emotions] || 0) + 1;
    }
  });

  // Tags count
  entries.forEach(e => {
    if (e.tags && e.tags.length > 0) {
      e.tags.forEach(tag => {
        stats.tagsCount[tag] = (stats.tagsCount[tag] || 0) + 1;
      });
    }
  });

  res.json({
    success: true,
    stats
  });
});

