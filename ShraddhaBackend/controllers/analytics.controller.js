import Account from "../models/Account.js";
import DepositRequest from "../models/DepositRequest.js";
import WithdrawalRequest from "../models/WithdrawalRequest.js";
import User from "../models/User.js";

// =============== GET USER ANALYTICS ===============
export const getUserAnalytics = async (req, res) => {
  try {
    const userId = req.user.id;
    const { timeRange = 'month' } = req.query;

    // Get user accounts
    const accounts = await Account.find({ user: userId });

    if (accounts.length === 0) {
      return res.status(200).json({
        success: true,
        analytics: {
          totalBalance: 0,
          totalEquity: 0,
          totalProfit: 0,
          profitPercentage: 0,
          totalTrades: 0,
          winRate: 0,
          totalDeposits: 0,
          totalWithdrawals: 0,
          monthlyGrowth: 0,
          weeklyGrowth: 0
        }
      });
    }

    // Calculate date range
    const now = new Date();
    let startDate;
    switch (timeRange) {
      case 'day':
        startDate = new Date(now.setHours(0, 0, 0, 0));
        break;
      case 'week':
        startDate = new Date(now.setDate(now.getDate() - 7));
        break;
      case 'month':
        startDate = new Date(now.setMonth(now.getMonth() - 1));
        break;
      case 'year':
        startDate = new Date(now.setFullYear(now.getFullYear() - 1));
        break;
      default:
        startDate = new Date(0);
    }

    // Get deposits and withdrawals
    const deposits = await DepositRequest.find({
      user: userId,
      status: 'approved',
      createdAt: { $gte: startDate }
    });

    const withdrawals = await WithdrawalRequest.find({
      user: userId,
      status: 'approved',
      createdAt: { $gte: startDate }
    });

    // Calculate totals
    const totalBalance = accounts.reduce((sum, acc) => sum + (acc.balance || 0), 0);
    const totalEquity = accounts.reduce((sum, acc) => sum + (acc.equity || acc.balance || 0), 0);
    const totalDeposits = deposits.reduce((sum, dep) => sum + (dep.amount || 0), 0);
    const totalWithdrawals = withdrawals.reduce((sum, wd) => sum + (wd.amount || 0), 0);

    // Calculate profit (simplified - in real app, this would come from trade history)
    const initialBalance = totalBalance - totalDeposits + totalWithdrawals;
    const totalProfit = totalEquity - initialBalance;
    const profitPercentage = initialBalance > 0 ? (totalProfit / initialBalance) * 100 : 0;

    // Mock trade statistics (in production, this would come from actual trade data)
    const totalTrades = Math.floor(Math.random() * 100) + 20;
    const winRate = 45 + Math.random() * 20; // 45-65% win rate

    // Calculate growth
    const monthlyGrowth = timeRange === 'month' || timeRange === 'year' 
      ? profitPercentage 
      : 0;
    const weeklyGrowth = timeRange === 'week' || timeRange === 'month'
      ? profitPercentage * 0.25
      : 0;

    res.status(200).json({
      success: true,
      analytics: {
        totalBalance,
        totalEquity,
        totalProfit,
        profitPercentage,
        totalTrades,
        winRate,
        totalDeposits,
        totalWithdrawals,
        monthlyGrowth,
        weeklyGrowth,
        accountCount: accounts.length
      }
    });
  } catch (error) {
    console.error("Get User Analytics Error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error",
      error: error.message 
    });
  }
};

// =============== GET TRADING HISTORY ===============
export const getTradingHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const { accountId, type, status, dateRange, limit = 50 } = req.query;

    // Build query
    const query = { user: userId };
    if (accountId) query.account = accountId;

    // Get deposits
    const depositQuery = { user: userId };
    if (accountId) depositQuery.accountId = accountId;
    if (status && status !== 'all') depositQuery.status = status;

    // Get withdrawals
    const withdrawalQuery = { user: userId };
    if (accountId) withdrawalQuery.accountId = accountId;
    if (status && status !== 'all') withdrawalQuery.status = status;

    // Date range filter
    let dateFilter = {};
    if (dateRange && dateRange !== 'all') {
      const now = new Date();
      let startDate;
      switch (dateRange) {
        case 'today':
          startDate = new Date(now.setHours(0, 0, 0, 0));
          break;
        case 'week':
          startDate = new Date(now.setDate(now.getDate() - 7));
          break;
        case 'month':
          startDate = new Date(now.setMonth(now.getMonth() - 1));
          break;
        case 'year':
          startDate = new Date(now.setFullYear(now.getFullYear() - 1));
          break;
      }
      if (startDate) {
        dateFilter.createdAt = { $gte: startDate };
        depositQuery.createdAt = { $gte: startDate };
        withdrawalQuery.createdAt = { $gte: startDate };
      }
    }

    // Fetch transactions
    const deposits = await DepositRequest.find(depositQuery)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    const withdrawals = await WithdrawalRequest.find(withdrawalQuery)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    // Format transactions
    const transactions = [];

    deposits.forEach(dep => {
      if (type === 'all' || type === 'deposit') {
        transactions.push({
          id: dep._id,
          date: dep.createdAt,
          type: 'deposit',
          status: dep.status,
          amount: dep.amount,
          description: 'Account Deposit',
          accountId: dep.accountId,
          reference: dep._id.toString().slice(-8).toUpperCase()
        });
      }
    });

    withdrawals.forEach(wd => {
      if (type === 'all' || type === 'withdrawal') {
        transactions.push({
          id: wd._id,
          date: wd.createdAt,
          type: 'withdrawal',
          status: wd.status,
          amount: wd.amount,
          description: 'Withdrawal Request',
          accountId: wd.accountId,
          reference: wd._id.toString().slice(-8).toUpperCase()
        });
      }
    });

    // Sort by date
    transactions.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Calculate statistics
    const stats = {
      totalDeposits: deposits
        .filter(d => d.status === 'approved')
        .reduce((sum, d) => sum + (d.amount || 0), 0),
      totalWithdrawals: withdrawals
        .filter(w => w.status === 'approved')
        .reduce((sum, w) => sum + (w.amount || 0), 0),
      totalTrades: 0, // Would come from trade history in production
      netProfit: 0 // Would be calculated from trades
    };

    res.status(200).json({
      success: true,
      transactions: transactions.slice(0, parseInt(limit)),
      stats
    });
  } catch (error) {
    console.error("Get Trading History Error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error",
      error: error.message 
    });
  }
};

// =============== GET PERFORMANCE METRICS ===============
export const getPerformanceMetrics = async (req, res) => {
  try {
    const userId = req.user.id;
    const { timeRange = 'month' } = req.query;

    const accounts = await Account.find({ user: userId });
    
    // Calculate date range
    const now = new Date();
    let startDate;
    switch (timeRange) {
      case 'day':
        startDate = new Date(now.setHours(0, 0, 0, 0));
        break;
      case 'week':
        startDate = new Date(now.setDate(now.getDate() - 7));
        break;
      case 'month':
        startDate = new Date(now.setMonth(now.getMonth() - 1));
        break;
      case 'year':
        startDate = new Date(now.setFullYear(now.getFullYear() - 1));
        break;
      default:
        startDate = new Date(0);
    }

    // Get historical data points (in production, this would come from actual trade data)
    const dataPoints = timeRange === 'day' ? 24 : timeRange === 'week' ? 7 : timeRange === 'month' ? 30 : 12;
    const chartData = [];
    
    const baseBalance = accounts.reduce((sum, acc) => sum + (acc.balance || 0), 0);
    let currentValue = baseBalance * 0.9; // Start slightly below current

    for (let i = 0; i < dataPoints; i++) {
      const change = (Math.random() * 100 - 50);
      currentValue += change;
      chartData.push({
        label: timeRange === 'day' 
          ? `${i}:00` 
          : timeRange === 'week' 
          ? `Day ${i + 1}` 
          : timeRange === 'month' 
          ? `Day ${i + 1}` 
          : `Month ${i + 1}`,
        value: Math.max(0, currentValue),
        timestamp: new Date(startDate.getTime() + (i * (now - startDate) / dataPoints))
      });
    }

    // Calculate metrics
    const totalBalance = accounts.reduce((sum, acc) => sum + (acc.balance || 0), 0);
    const totalEquity = accounts.reduce((sum, acc) => sum + (acc.equity || acc.balance || 0), 0);
    const profit = totalEquity - totalBalance;
    const profitPercentage = totalBalance > 0 ? (profit / totalBalance) * 100 : 0;

    res.status(200).json({
      success: true,
      metrics: {
        chartData,
        totalBalance,
        totalEquity,
        profit,
        profitPercentage,
        accountCount: accounts.length
      }
    });
  } catch (error) {
    console.error("Get Performance Metrics Error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error",
      error: error.message 
    });
  }
};

