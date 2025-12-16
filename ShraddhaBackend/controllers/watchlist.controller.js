import Watchlist from '../models/Watchlist.js';
import { asyncHandler } from '../middleware/errorHandler.js';

// @desc    Get user watchlist
// @route   GET /api/watchlist
// @access  Private
export const getWatchlist = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  let watchlist = await Watchlist.findOne({ user: userId });

  if (!watchlist) {
    watchlist = await Watchlist.create({
      user: userId,
      instruments: [],
      isDefault: true
    });
  }

  res.json({
    success: true,
    watchlist
  });
});

// @desc    Add instrument to watchlist
// @route   POST /api/watchlist/instruments
// @access  Private
export const addInstrument = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { symbol, name, category, notes } = req.body;

  if (!symbol) {
    return res.status(400).json({
      success: false,
      message: 'Symbol is required'
    });
  }

  let watchlist = await Watchlist.findOne({ user: userId });

  if (!watchlist) {
    watchlist = await Watchlist.create({
      user: userId,
      instruments: [],
      isDefault: true
    });
  }

  // Check if instrument already exists
  const existingIndex = watchlist.instruments.findIndex(
    inst => inst.symbol.toLowerCase() === symbol.toLowerCase()
  );

  if (existingIndex !== -1) {
    return res.status(400).json({
      success: false,
      message: 'Instrument already in watchlist'
    });
  }

  watchlist.instruments.push({
    symbol: symbol.toUpperCase(),
    name: name || symbol,
    category: category || 'Forex',
    notes: notes || '',
    addedAt: new Date()
  });

  await watchlist.save();

  res.status(201).json({
    success: true,
    watchlist
  });
});

// @desc    Remove instrument from watchlist
// @route   DELETE /api/watchlist/instruments/:symbol
// @access  Private
export const removeInstrument = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { symbol } = req.params;

  const watchlist = await Watchlist.findOne({ user: userId });

  if (!watchlist) {
    return res.status(404).json({
      success: false,
      message: 'Watchlist not found'
    });
  }

  watchlist.instruments = watchlist.instruments.filter(
    inst => inst.symbol.toLowerCase() !== symbol.toLowerCase()
  );

  await watchlist.save();

  res.json({
    success: true,
    watchlist
  });
});

// @desc    Add price alert
// @route   POST /api/watchlist/instruments/:symbol/alerts
// @access  Private
export const addPriceAlert = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { symbol } = req.params;
  const { targetPrice, condition } = req.body;

  if (!targetPrice || !condition) {
    return res.status(400).json({
      success: false,
      message: 'Target price and condition are required'
    });
  }

  const watchlist = await Watchlist.findOne({ user: userId });

  if (!watchlist) {
    return res.status(404).json({
      success: false,
      message: 'Watchlist not found'
    });
  }

  const instrument = watchlist.instruments.find(
    inst => inst.symbol.toLowerCase() === symbol.toLowerCase()
  );

  if (!instrument) {
    return res.status(404).json({
      success: false,
      message: 'Instrument not found in watchlist'
    });
  }

  instrument.priceAlerts.push({
    targetPrice,
    condition,
    isActive: true,
    createdAt: new Date()
  });

  await watchlist.save();

  res.status(201).json({
    success: true,
    watchlist
  });
});

// @desc    Remove price alert
// @route   DELETE /api/watchlist/instruments/:symbol/alerts/:alertId
// @access  Private
export const removePriceAlert = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { symbol, alertId } = req.params;

  const watchlist = await Watchlist.findOne({ user: userId });

  if (!watchlist) {
    return res.status(404).json({
      success: false,
      message: 'Watchlist not found'
    });
  }

  const instrument = watchlist.instruments.find(
    inst => inst.symbol.toLowerCase() === symbol.toLowerCase()
  );

  if (!instrument) {
    return res.status(404).json({
      success: false,
      message: 'Instrument not found in watchlist'
    });
  }

  instrument.priceAlerts = instrument.priceAlerts.filter(
    alert => alert._id.toString() !== alertId
  );

  await watchlist.save();

  res.json({
    success: true,
    watchlist
  });
});

// @desc    Update instrument notes
// @route   PUT /api/watchlist/instruments/:symbol
// @access  Private
export const updateInstrument = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { symbol } = req.params;
  const { notes } = req.body;

  const watchlist = await Watchlist.findOne({ user: userId });

  if (!watchlist) {
    return res.status(404).json({
      success: false,
      message: 'Watchlist not found'
    });
  }

  const instrument = watchlist.instruments.find(
    inst => inst.symbol.toLowerCase() === symbol.toLowerCase()
  );

  if (!instrument) {
    return res.status(404).json({
      success: false,
      message: 'Instrument not found in watchlist'
    });
  }

  if (notes !== undefined) {
    instrument.notes = notes;
  }

  await watchlist.save();

  res.json({
    success: true,
    watchlist
  });
});

