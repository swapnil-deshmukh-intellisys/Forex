import React, { useState, useEffect } from 'react';
import { accountAPI } from '../services/api';
import { 
  FaChartLine, 
  FaChartBar, 
  FaChartPie, 
  FaArrowUp,
  FaArrowDown,
  FaDollarSign,
  FaUsers,
  FaArrowLeft
} from 'react-icons/fa';

const AnalyticsDashboard = ({ userEmail, onBack, onSignOut, onProfileClick }) => {
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('month'); // day, week, month, year
  const [analytics, setAnalytics] = useState({
    totalBalance: 0,
    totalEquity: 0,
    totalProfit: 0,
    profitPercentage: 0,
    totalTrades: 0,
    winRate: 0,
    averageWin: 0,
    averageLoss: 0,
    riskRewardRatio: 0,
    monthlyGrowth: 0,
    weeklyGrowth: 0
  });

  useEffect(() => {
    fetchAccounts();
  }, []);

  useEffect(() => {
    if (selectedAccount) {
      calculateAnalytics();
    }
  }, [selectedAccount, timeRange]);

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const response = await accountAPI.getUserAccounts();
      if (response.success && response.accounts.length > 0) {
        setAccounts(response.accounts);
        setSelectedAccount(response.accounts[0]);
      }
    } catch (err) {
      console.error('Error fetching accounts:', err);
    } finally {
      setLoading(false);
    }
  };

  const calculateAnalytics = () => {
    if (!selectedAccount) return;

    // Simulate analytics data based on account
    const baseBalance = selectedAccount.balance || 1000;
    const mockData = generateMockAnalytics(baseBalance, timeRange);
    setAnalytics(mockData);
  };

  const generateMockAnalytics = (baseBalance, range) => {
    const profit = (Math.random() * 2000 - 500); // Random profit between -500 and 1500
    const totalTrades = Math.floor(Math.random() * 100) + 20;
    const wins = Math.floor(totalTrades * (0.4 + Math.random() * 0.3)); // 40-70% win rate
    const losses = totalTrades - wins;
    
    const averageWin = wins > 0 ? (profit * 1.2) / wins : 0;
    const averageLoss = losses > 0 ? Math.abs(profit * 0.8) / losses : 0;
    const riskRewardRatio = averageLoss > 0 ? averageWin / averageLoss : 0;

    let monthlyGrowth = 0;
    let weeklyGrowth = 0;
    
    if (range === 'month' || range === 'year') {
      monthlyGrowth = (profit / baseBalance) * 100;
    }
    if (range === 'week' || range === 'month') {
      weeklyGrowth = (profit / baseBalance) * 100 * 0.25;
    }

    return {
      totalBalance: baseBalance,
      totalEquity: baseBalance + profit,
      totalProfit: profit,
      profitPercentage: (profit / baseBalance) * 100,
      totalTrades,
      winRate: (wins / totalTrades) * 100,
      averageWin: averageWin > 0 ? averageWin : 0,
      averageLoss: averageLoss > 0 ? averageLoss : 0,
      riskRewardRatio: riskRewardRatio > 0 ? riskRewardRatio : 0,
      monthlyGrowth,
      weeklyGrowth
    };
  };

  const getChartData = () => {
    // Generate mock chart data
    const dataPoints = timeRange === 'day' ? 24 : timeRange === 'week' ? 7 : timeRange === 'month' ? 30 : 12;
    const data = [];
    let currentValue = analytics.totalBalance - analytics.totalProfit;
    
    for (let i = 0; i < dataPoints; i++) {
      const change = (Math.random() * 100 - 50);
      currentValue += change;
      data.push({
        label: timeRange === 'day' ? `${i}:00` : timeRange === 'week' ? `Day ${i + 1}` : timeRange === 'month' ? `Day ${i + 1}` : `Month ${i + 1}`,
        value: Math.max(0, currentValue)
      });
    }
    
    return data;
  };

  const chartData = getChartData();
  const maxValue = Math.max(...chartData.map(d => d.value));

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-primary pt-32 pb-12">
        <div className="container-custom">
          <div className="text-center text-text-primary">Loading analytics...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-primary pt-32 pb-12">
      <div className="container-custom">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="text-text-secondary hover:text-text-primary transition-colors"
              >
                <FaArrowLeft />
              </button>
              <h1 className="text-4xl font-bold text-text-primary flex items-center space-x-3">
                <FaChartLine className="text-accent-color" />
                <span>Analytics Dashboard</span>
              </h1>
            </div>
          </div>

          {/* Account Selector and Time Range */}
          <div className="flex flex-wrap items-center gap-4">
            {accounts.length > 0 && (
              <select
                value={selectedAccount?._id || ''}
                onChange={(e) => {
                  const account = accounts.find(acc => acc._id === e.target.value);
                  setSelectedAccount(account);
                }}
                className="bg-card-bg border border-border-color rounded-lg px-4 py-2 text-text-primary"
              >
                {accounts.map(account => (
                  <option key={account._id} value={account._id}>
                    {account.type} - {account.status}
                  </option>
                ))}
              </select>
            )}
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="bg-card-bg border border-border-color rounded-lg px-4 py-2 text-text-primary"
            >
              <option value="day">Last 24 Hours</option>
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
              <option value="year">Last Year</option>
            </select>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-card-bg border border-border-color rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-text-secondary">Total Balance</span>
              <FaDollarSign className="text-accent-color" />
            </div>
            <div className="text-3xl font-bold text-text-primary">
              ${analytics.totalBalance.toFixed(2)}
            </div>
            <div className="text-sm text-text-secondary mt-2">
              Equity: ${analytics.totalEquity.toFixed(2)}
            </div>
          </div>

          <div className="bg-card-bg border border-border-color rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-text-secondary">Total Profit</span>
              {analytics.totalProfit >= 0 ? (
                <FaArrowUp className="text-success-color" />
              ) : (
                <FaArrowDown className="text-danger-color" />
              )}
            </div>
            <div className={`text-3xl font-bold ${
              analytics.totalProfit >= 0 ? 'text-success-color' : 'text-danger-color'
            }`}>
              {analytics.totalProfit >= 0 ? '+' : ''}${analytics.totalProfit.toFixed(2)}
            </div>
            <div className={`text-sm mt-2 ${
              analytics.profitPercentage >= 0 ? 'text-success-color' : 'text-danger-color'
            }`}>
              {analytics.profitPercentage >= 0 ? '+' : ''}{analytics.profitPercentage.toFixed(2)}%
            </div>
          </div>

          <div className="bg-card-bg border border-border-color rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-text-secondary">Total Trades</span>
              <FaChartBar className="text-primary-blue" />
            </div>
            <div className="text-3xl font-bold text-text-primary">
              {analytics.totalTrades}
            </div>
            <div className="text-sm text-text-secondary mt-2">
              Win Rate: {analytics.winRate.toFixed(1)}%
            </div>
          </div>

          <div className="bg-card-bg border border-border-color rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-text-secondary">Risk/Reward</span>
              <FaChartPie className="text-warning-color" />
            </div>
            <div className="text-3xl font-bold text-text-primary">
              {analytics.riskRewardRatio.toFixed(2)}:1
            </div>
            <div className="text-sm text-text-secondary mt-2">
              Avg Win: ${analytics.averageWin.toFixed(2)}
            </div>
          </div>
        </div>

        {/* Chart Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Performance Chart */}
          <div className="bg-card-bg border border-border-color rounded-xl p-6">
            <h2 className="text-xl font-bold text-text-primary mb-4">Performance Chart</h2>
            <div className="h-64 flex items-end justify-between space-x-1">
              {chartData.map((point, index) => (
                <div
                  key={index}
                  className="flex-1 flex flex-col items-center group relative"
                >
                  <div
                    className="w-full bg-gradient-to-t from-accent-color to-primary-blue rounded-t transition-all hover:opacity-80 cursor-pointer"
                    style={{ height: `${(point.value / maxValue) * 100}%` }}
                    title={`${point.label}: $${point.value.toFixed(2)}`}
                  />
                  {index % Math.ceil(chartData.length / 5) === 0 && (
                    <span className="text-xs text-text-secondary mt-2 transform -rotate-45 origin-left">
                      {point.label}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Trading Statistics */}
          <div className="bg-card-bg border border-border-color rounded-xl p-6">
            <h2 className="text-xl font-bold text-text-primary mb-4">Trading Statistics</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-bg-secondary rounded-lg">
                <span className="text-text-secondary">Average Win</span>
                <span className="text-success-color font-semibold">
                  ${analytics.averageWin.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-bg-secondary rounded-lg">
                <span className="text-text-secondary">Average Loss</span>
                <span className="text-danger-color font-semibold">
                  ${analytics.averageLoss.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-bg-secondary rounded-lg">
                <span className="text-text-secondary">Win Rate</span>
                <span className="text-text-primary font-semibold">
                  {analytics.winRate.toFixed(1)}%
                </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-bg-secondary rounded-lg">
                <span className="text-text-secondary">Risk/Reward Ratio</span>
                <span className="text-accent-color font-semibold">
                  {analytics.riskRewardRatio.toFixed(2)}:1
                </span>
              </div>
              {analytics.monthlyGrowth !== 0 && (
                <div className="flex items-center justify-between p-4 bg-bg-secondary rounded-lg">
                  <span className="text-text-secondary">Monthly Growth</span>
                  <span className={`font-semibold ${
                    analytics.monthlyGrowth >= 0 ? 'text-success-color' : 'text-danger-color'
                  }`}>
                    {analytics.monthlyGrowth >= 0 ? '+' : ''}{analytics.monthlyGrowth.toFixed(2)}%
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Additional Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-card-bg border border-border-color rounded-xl p-6">
            <h3 className="text-lg font-semibold text-text-primary mb-4">Profit Distribution</h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-text-secondary text-sm">Winning Trades</span>
                  <span className="text-success-color text-sm font-semibold">
                    {((analytics.winRate / 100) * analytics.totalTrades).toFixed(0)}
                  </span>
                </div>
                <div className="w-full bg-bg-secondary rounded-full h-2">
                  <div
                    className="bg-success-color h-2 rounded-full"
                    style={{ width: `${analytics.winRate}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-text-secondary text-sm">Losing Trades</span>
                  <span className="text-danger-color text-sm font-semibold">
                    {((1 - analytics.winRate / 100) * analytics.totalTrades).toFixed(0)}
                  </span>
                </div>
                <div className="w-full bg-bg-secondary rounded-full h-2">
                  <div
                    className="bg-danger-color h-2 rounded-full"
                    style={{ width: `${100 - analytics.winRate}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card-bg border border-border-color rounded-xl p-6">
            <h3 className="text-lg font-semibold text-text-primary mb-4">Account Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-text-secondary">Balance</span>
                <span className="text-text-primary font-semibold">
                  ${analytics.totalBalance.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Equity</span>
                <span className="text-text-primary font-semibold">
                  ${analytics.totalEquity.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Profit/Loss</span>
                <span className={`font-semibold ${
                  analytics.totalProfit >= 0 ? 'text-success-color' : 'text-danger-color'
                }`}>
                  {analytics.totalProfit >= 0 ? '+' : ''}${analytics.totalProfit.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-card-bg border border-border-color rounded-xl p-6">
            <h3 className="text-lg font-semibold text-text-primary mb-4">Growth Metrics</h3>
            <div className="space-y-3">
              {analytics.weeklyGrowth !== 0 && (
                <div className="flex justify-between">
                  <span className="text-text-secondary">Weekly Growth</span>
                  <span className={`font-semibold ${
                    analytics.weeklyGrowth >= 0 ? 'text-success-color' : 'text-danger-color'
                  }`}>
                    {analytics.weeklyGrowth >= 0 ? '+' : ''}{analytics.weeklyGrowth.toFixed(2)}%
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-text-secondary">Profit %</span>
                <span className={`font-semibold ${
                  analytics.profitPercentage >= 0 ? 'text-success-color' : 'text-danger-color'
                }`}>
                  {analytics.profitPercentage >= 0 ? '+' : ''}{analytics.profitPercentage.toFixed(2)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Total Trades</span>
                <span className="text-text-primary font-semibold">
                  {analytics.totalTrades}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;

