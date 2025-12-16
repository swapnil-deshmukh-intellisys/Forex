import Account from '../models/Account.js';
import DepositRequest from '../models/DepositRequest.js';
import WithdrawalRequest from '../models/WithdrawalRequest.js';
import TradingJournal from '../models/TradingJournal.js';

/**
 * Calculate position size based on risk percentage
 */
export const calculatePositionSize = (accountBalance, riskPercentage, stopLossPips, pipValue, lotSize = 1) => {
  if (!accountBalance || !riskPercentage || !stopLossPips || !pipValue) {
    return 0;
  }

  const riskAmount = (accountBalance * riskPercentage) / 100;
  const riskPerPip = riskAmount / stopLossPips;
  const positionSize = riskPerPip / pipValue;

  return Math.max(0, Math.min(positionSize, accountBalance * 0.1)); // Max 10% of balance
};

/**
 * Calculate margin requirement
 */
export const calculateMargin = (lotSize, contractSize, leverage, currentPrice) => {
  if (!lotSize || !contractSize || !leverage || !currentPrice) {
    return 0;
  }

  const leverageRatio = parseFloat(leverage.split(':')[1]) || 1;
  const notionalValue = lotSize * contractSize * currentPrice;
  const margin = notionalValue / leverageRatio;

  return margin;
};

/**
 * Calculate risk/reward ratio
 */
export const calculateRiskReward = (entryPrice, stopLoss, takeProfit, tradeType) => {
  if (!entryPrice || !stopLoss || !takeProfit) {
    return null;
  }

  let risk, reward;

  if (tradeType === 'Buy' || tradeType === 'Long') {
    risk = entryPrice - stopLoss;
    reward = takeProfit - entryPrice;
  } else {
    risk = stopLoss - entryPrice;
    reward = entryPrice - takeProfit;
  }

  if (risk <= 0) return null;

  return {
    ratio: reward / risk,
    risk,
    reward
  };
};

/**
 * Get account exposure analysis
 */
export const getAccountExposure = async (userId, accountId = null) => {
  const query = { user: userId, isActive: true };
  if (accountId) {
    query._id = accountId;
  }

  const accounts = await Account.find(query);

  const exposure = {
    totalBalance: 0,
    totalEquity: 0,
    totalMargin: 0,
    totalMarginUsed: 0,
    marginLevel: 0,
    freeMargin: 0,
    accounts: []
  };

  for (const account of accounts) {
    const accountExposure = {
      accountId: account._id,
      accountNumber: account.accountNumber,
      balance: account.balance || 0,
      equity: account.equity || account.balance || 0,
      margin: account.margin || 0,
      marginLevel: 0,
      freeMargin: 0,
      leverage: account.leverage || '1:500'
    };

    accountExposure.marginLevel = accountExposure.equity > 0
      ? (accountExposure.equity / accountExposure.margin) * 100
      : 0;
    accountExposure.freeMargin = accountExposure.equity - accountExposure.margin;

    exposure.totalBalance += accountExposure.balance;
    exposure.totalEquity += accountExposure.equity;
    exposure.totalMargin += accountExposure.margin;
    exposure.accounts.push(accountExposure);
  }

  exposure.totalMarginUsed = exposure.totalMargin;
  exposure.marginLevel = exposure.totalEquity > 0
    ? (exposure.totalEquity / exposure.totalMargin) * 100
    : 0;
  exposure.freeMargin = exposure.totalEquity - exposure.totalMargin;

  return exposure;
};

/**
 * Get risk metrics for user
 */
export const getRiskMetrics = async (userId, timeRange = '30') => {
  const days = parseInt(timeRange);
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const accounts = await Account.find({ user: userId, isActive: true });
  const journalEntries = await TradingJournal.find({
    user: userId,
    entryDate: { $gte: startDate },
    tradeType: { $in: ['Buy', 'Sell', 'Long', 'Short'] }
  });

  const deposits = await DepositRequest.find({
    user: userId,
    status: 'Approved',
    createdAt: { $gte: startDate }
  });

  const withdrawals = await WithdrawalRequest.find({
    user: userId,
    status: 'Approved',
    createdAt: { $gte: startDate }
  });

  const totalDeposits = deposits.reduce((sum, d) => sum + (d.amount || 0), 0);
  const totalWithdrawals = withdrawals.reduce((sum, w) => sum + (w.amount || 0), 0);
  const totalProfit = journalEntries.reduce((sum, e) => sum + (e.profit || 0), 0);

  const winningTrades = journalEntries.filter(e => (e.profit || 0) > 0);
  const losingTrades = journalEntries.filter(e => (e.profit || 0) < 0);

  const largestWin = journalEntries.length > 0
    ? Math.max(...journalEntries.map(e => e.profit || 0))
    : 0;
  const largestLoss = journalEntries.length > 0
    ? Math.min(...journalEntries.map(e => e.profit || 0))
    : 0;

  const totalRisk = accounts.reduce((sum, a) => sum + (a.margin || 0), 0);
  const totalEquity = accounts.reduce((sum, a) => sum + (a.equity || a.balance || 0), 0);

  const metrics = {
    timeRange: days,
    totalTrades: journalEntries.length,
    winningTrades: winningTrades.length,
    losingTrades: losingTrades.length,
    winRate: journalEntries.length > 0
      ? (winningTrades.length / journalEntries.length) * 100
      : 0,
    totalProfit,
    averageProfit: journalEntries.length > 0
      ? totalProfit / journalEntries.length
      : 0,
    largestWin,
    largestLoss,
    profitFactor: losingTrades.length > 0
      ? winningTrades.reduce((sum, e) => sum + Math.abs(e.profit || 0), 0) /
        losingTrades.reduce((sum, e) => sum + Math.abs(e.profit || 0), 0)
      : 0,
    totalDeposits,
    totalWithdrawals,
    netDeposits: totalDeposits - totalWithdrawals,
    totalRisk,
    totalEquity,
    riskToEquityRatio: totalEquity > 0
      ? (totalRisk / totalEquity) * 100
      : 0,
    maxDrawdown: calculateMaxDrawdown(journalEntries),
    sharpeRatio: calculateSharpeRatio(journalEntries)
  };

  return metrics;
};

/**
 * Calculate maximum drawdown
 */
const calculateMaxDrawdown = (entries) => {
  if (entries.length === 0) return 0;

  let peak = 0;
  let maxDrawdown = 0;
  let runningBalance = 0;

  entries.sort((a, b) => new Date(a.entryDate) - new Date(b.entryDate));

  for (const entry of entries) {
    runningBalance += entry.profit || 0;
    if (runningBalance > peak) {
      peak = runningBalance;
    }
    const drawdown = peak - runningBalance;
    if (drawdown > maxDrawdown) {
      maxDrawdown = drawdown;
    }
  }

  return maxDrawdown;
};

/**
 * Calculate Sharpe ratio (simplified)
 */
const calculateSharpeRatio = (entries) => {
  if (entries.length < 2) return 0;

  const returns = entries.map(e => e.profit || 0);
  const mean = returns.reduce((sum, r) => sum + r, 0) / returns.length;
  const variance = returns.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) / returns.length;
  const stdDev = Math.sqrt(variance);

  if (stdDev === 0) return 0;

  // Assuming risk-free rate of 0 for simplicity
  return mean / stdDev;
};

