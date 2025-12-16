import TraderProfile from '../models/TraderProfile.js';
import CopyTrade from '../models/CopyTrade.js';
import User from '../models/User.js';
import TradingJournal from '../models/TradingJournal.js';
import { asyncHandler } from '../middleware/errorHandler.js';

// @desc    Get leaderboard
// @route   GET /api/social/leaderboard
// @access  Private
export const getLeaderboard = asyncHandler(async (req, res) => {
  const {
    sortBy = 'totalProfit',
    limit = 50,
    category = 'all'
  } = req.query;

  const query = { isPublic: true, allowCopyTrading: true };

  if (category !== 'all') {
    query.tradingStyle = category;
  }

  let sortOptions = {};
  switch (sortBy) {
    case 'winRate':
      sortOptions = { 'performanceStats.winRate': -1 };
      break;
    case 'totalTrades':
      sortOptions = { 'performanceStats.totalTrades': -1 };
      break;
    case 'sharpeRatio':
      sortOptions = { 'performanceStats.sharpeRatio': -1 };
      break;
    default:
      sortOptions = { 'performanceStats.totalProfit': -1 };
  }

  const traders = await TraderProfile.find(query)
    .populate('user', 'fullName email')
    .sort(sortOptions)
    .limit(parseInt(limit));

  // Add rank
  const rankedTraders = traders.map((trader, index) => ({
    ...trader.toObject(),
    rank: index + 1
  }));

  res.json({
    success: true,
    leaderboard: rankedTraders
  });
});

// @desc    Get trader profile
// @route   GET /api/social/trader/:traderId
// @access  Private
export const getTraderProfile = asyncHandler(async (req, res) => {
  const { traderId } = req.params;

  const profile = await TraderProfile.findOne({ user: traderId })
    .populate('user', 'fullName email');

  if (!profile || (!profile.isPublic && traderId !== req.user._id.toString())) {
    return res.status(404).json({
      success: false,
      message: 'Trader profile not found'
    });
  }

  res.json({
    success: true,
    profile
  });
});

// @desc    Create or update trader profile
// @route   POST /api/social/trader/profile
// @access  Private
export const createOrUpdateTraderProfile = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const {
    displayName,
    bio,
    avatar,
    tradingStyle,
    preferredPairs,
    isPublic,
    allowCopyTrading
  } = req.body;

  let profile = await TraderProfile.findOne({ user: userId });

  if (profile) {
    Object.assign(profile, {
      displayName,
      bio,
      avatar,
      tradingStyle,
      preferredPairs,
      isPublic: isPublic !== undefined ? isPublic : profile.isPublic,
      allowCopyTrading: allowCopyTrading !== undefined ? allowCopyTrading : profile.allowCopyTrading
    });
    await profile.save();
  } else {
    profile = await TraderProfile.create({
      user: userId,
      displayName: displayName || req.user.fullName,
      bio,
      avatar,
      tradingStyle,
      preferredPairs: preferredPairs || [],
      isPublic: isPublic || false,
      allowCopyTrading: allowCopyTrading || false
    });
  }

  res.json({
    success: true,
    profile
  });
});

// @desc    Update trader performance stats
// @route   PUT /api/social/trader/stats
// @access  Private
export const updateTraderStats = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // Get all trades from journal
  const trades = await TradingJournal.find({
    user: userId,
    tradeType: { $in: ['Buy', 'Sell', 'Long', 'Short'] }
  });

  const totalTrades = trades.length;
  const winningTrades = trades.filter(t => (t.profit || 0) > 0).length;
  const losingTrades = trades.filter(t => (t.profit || 0) < 0).length;
  const totalProfit = trades.reduce((sum, t) => sum + (t.profit || 0), 0);
  const averageProfit = totalTrades > 0 ? totalProfit / totalTrades : 0;
  const winRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0;

  // Calculate max drawdown
  let peak = 0;
  let maxDrawdown = 0;
  let runningBalance = 0;
  trades.sort((a, b) => new Date(a.entryDate) - new Date(b.entryDate));
  for (const trade of trades) {
    runningBalance += trade.profit || 0;
    if (runningBalance > peak) peak = runningBalance;
    const drawdown = peak - runningBalance;
    if (drawdown > maxDrawdown) maxDrawdown = drawdown;
  }

  // Calculate Sharpe ratio (simplified)
  const returns = trades.map(t => t.profit || 0);
  const mean = returns.length > 0 ? returns.reduce((sum, r) => sum + r, 0) / returns.length : 0;
  const variance = returns.length > 0
    ? returns.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) / returns.length
    : 0;
  const stdDev = Math.sqrt(variance);
  const sharpeRatio = stdDev > 0 ? mean / stdDev : 0;

  let profile = await TraderProfile.findOne({ user: userId });

  if (!profile) {
    profile = await TraderProfile.create({
      user: userId,
      displayName: req.user.fullName,
      performanceStats: {}
    });
  }

  profile.performanceStats = {
    totalTrades,
    winningTrades,
    losingTrades,
    winRate,
    totalProfit,
    averageProfit,
    maxDrawdown,
    sharpeRatio,
    lastUpdated: new Date()
  };

  await profile.save();

  res.json({
    success: true,
    profile
  });
});

// @desc    Start copy trading
// @route   POST /api/social/copy-trade
// @access  Private
export const startCopyTrading = asyncHandler(async (req, res) => {
  const followerId = req.user._id;
  const { traderId, allocation, maxRiskPerTrade, settings } = req.body;

  if (!traderId || !allocation) {
    return res.status(400).json({
      success: false,
      message: 'Trader ID and allocation are required'
    });
  }

  const traderProfile = await TraderProfile.findOne({ user: traderId });

  if (!traderProfile || !traderProfile.allowCopyTrading) {
    return res.status(400).json({
      success: false,
      message: 'Trader does not allow copy trading'
    });
  }

  // Check if already copying
  const existingCopy = await CopyTrade.findOne({
    follower: followerId,
    trader: traderId,
    isActive: true
  });

  if (existingCopy) {
    return res.status(400).json({
      success: false,
      message: 'Already copying this trader'
    });
  }

  const copyTrade = await CopyTrade.create({
    follower: followerId,
    trader: traderId,
    traderProfile: traderProfile._id,
    allocation: Math.min(100, Math.max(0, allocation)),
    maxRiskPerTrade: maxRiskPerTrade || 2,
    settings: settings || {},
    isActive: true
  });

  // Update trader profile
  traderProfile.totalCopies += 1;
  await traderProfile.save();

  res.status(201).json({
    success: true,
    copyTrade
  });
});

// @desc    Stop copy trading
// @route   PUT /api/social/copy-trade/:copyTradeId
// @access  Private
export const stopCopyTrading = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { copyTradeId } = req.params;

  const copyTrade = await CopyTrade.findOne({
    _id: copyTradeId,
    follower: userId
  });

  if (!copyTrade) {
    return res.status(404).json({
      success: false,
      message: 'Copy trade not found'
    });
  }

  copyTrade.isActive = false;
  copyTrade.stoppedAt = new Date();
  await copyTrade.save();

  // Update trader profile
  const traderProfile = await TraderProfile.findById(copyTrade.traderProfile);
  if (traderProfile) {
    traderProfile.totalCopies = Math.max(0, traderProfile.totalCopies - 1);
    await traderProfile.save();
  }

  res.json({
    success: true,
    copyTrade
  });
});

// @desc    Get user's copy trades
// @route   GET /api/social/copy-trade
// @access  Private
export const getCopyTrades = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { type = 'following' } = req.query;

  let query = {};
  if (type === 'following') {
    query.follower = userId;
  } else {
    query.trader = userId;
  }

  const copyTrades = await CopyTrade.find(query)
    .populate('follower', 'fullName email')
    .populate('trader', 'fullName email')
    .populate('traderProfile')
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    copyTrades
  });
});

// @desc    Follow/Unfollow trader
// @route   POST /api/social/trader/:traderId/follow
// @access  Private
export const followTrader = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { traderId } = req.params;

  if (traderId === userId.toString()) {
    return res.status(400).json({
      success: false,
      message: 'Cannot follow yourself'
    });
  }

  const traderProfile = await TraderProfile.findOne({ user: traderId });

  if (!traderProfile) {
    return res.status(404).json({
      success: false,
      message: 'Trader profile not found'
    });
  }

  // In a real implementation, you'd have a Follow model
  // For now, we'll just increment the follower count
  traderProfile.totalFollowers += 1;
  await traderProfile.save();

  res.json({
    success: true,
    message: 'Successfully followed trader'
  });
});

