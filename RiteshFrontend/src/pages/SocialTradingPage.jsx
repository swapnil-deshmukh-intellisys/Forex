import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import { socialTradingAPI } from '../services/api';

const SocialTradingPage = ({ userEmail, onBack, onSignOut, onProfileClick }) => {
  const [activeTab, setActiveTab] = useState('leaderboard');
  const [leaderboard, setLeaderboard] = useState([]);
  const [copyTrades, setCopyTrades] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    try {
      setLoading(true);
      if (activeTab === 'leaderboard') {
        const response = await socialTradingAPI.getLeaderboard({ limit: 50 });
        setLeaderboard(response.leaderboard || []);
      } else {
        const response = await socialTradingAPI.getCopyTrades('following');
        setCopyTrades(response.copyTrades || []);
      }
    } catch (error) {
      console.error('Error loading social trading data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background-secondary to-background">
      <Header userEmail={userEmail} onSignOut={onSignOut} onProfileClick={onProfileClick} onBack={onBack} />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-text-primary mb-6">Social Trading</h1>
        
        <div className="flex gap-4 mb-6 border-b border-border">
          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`px-6 py-3 font-semibold transition ${
              activeTab === 'leaderboard'
                ? 'text-primary border-b-2 border-primary'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            Leaderboard
          </button>
          <button
            onClick={() => setActiveTab('copy-trading')}
            className={`px-6 py-3 font-semibold transition ${
              activeTab === 'copy-trading'
                ? 'text-primary border-b-2 border-primary'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            Copy Trading
          </button>
        </div>

        {loading ? (
          <p className="text-text-secondary">Loading...</p>
        ) : activeTab === 'leaderboard' ? (
          <LeaderboardView traders={leaderboard} />
        ) : (
          <CopyTradingView copyTrades={copyTrades} onRefresh={loadData} />
        )}
      </div>
    </div>
  );
};

const LeaderboardView = ({ traders }) => {
  return (
    <div className="bg-card-bg rounded-lg border border-border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-background">
            <tr>
              <th className="px-6 py-4 text-left text-text-primary font-semibold">Rank</th>
              <th className="px-6 py-4 text-left text-text-primary font-semibold">Trader</th>
              <th className="px-6 py-4 text-left text-text-primary font-semibold">Total Profit</th>
              <th className="px-6 py-4 text-left text-text-primary font-semibold">Win Rate</th>
              <th className="px-6 py-4 text-left text-text-primary font-semibold">Total Trades</th>
              <th className="px-6 py-4 text-left text-text-primary font-semibold">Sharpe Ratio</th>
              <th className="px-6 py-4 text-left text-text-primary font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {traders.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-8 text-center text-text-secondary">
                  No traders found
                </td>
              </tr>
            ) : (
              traders.map((trader) => (
                <tr key={trader._id} className="border-t border-border hover:bg-background">
                  <td className="px-6 py-4 text-text-primary font-bold">#{trader.rank}</td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-text-primary font-semibold">
                        {trader.displayName || trader.user?.fullName || 'Unknown'}
                      </p>
                      <p className="text-text-secondary text-sm">{trader.tradingStyle || 'Mixed'}</p>
                    </div>
                  </td>
                  <td className={`px-6 py-4 font-semibold ${
                    trader.performanceStats?.totalProfit >= 0 ? 'text-green-500' : 'text-red-500'
                  }`}>
                    ₹{trader.performanceStats?.totalProfit?.toFixed(2) || '0.00'}
                  </td>
                  <td className="px-6 py-4 text-text-primary">
                    {trader.performanceStats?.winRate?.toFixed(2) || '0.00'}%
                  </td>
                  <td className="px-6 py-4 text-text-primary">
                    {trader.performanceStats?.totalTrades || 0}
                  </td>
                  <td className="px-6 py-4 text-text-primary">
                    {trader.performanceStats?.sharpeRatio?.toFixed(2) || '0.00'}
                  </td>
                  <td className="px-6 py-4">
                    <button className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg text-sm">
                      View Profile
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const CopyTradingView = ({ copyTrades, onRefresh }) => {
  const handleStopCopy = async (copyTradeId) => {
    if (!confirm('Are you sure you want to stop copying this trader?')) return;
    try {
      await socialTradingAPI.stopCopyTrading(copyTradeId);
      onRefresh();
    } catch (error) {
      console.error('Error stopping copy trade:', error);
      alert('Failed to stop copy trading');
    }
  };

  return (
    <div className="space-y-4">
      {copyTrades.length === 0 ? (
        <div className="bg-card-bg p-8 rounded-lg border border-border text-center">
          <p className="text-text-secondary mb-4">You are not copying any traders yet.</p>
          <button className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg">
            Find Traders to Copy
          </button>
        </div>
      ) : (
        copyTrades.map((copyTrade) => (
          <div key={copyTrade._id} className="bg-card-bg p-6 rounded-lg border border-border">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-semibold text-text-primary mb-2">
                  {copyTrade.trader?.fullName || 'Unknown Trader'}
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-text-secondary">Allocation</p>
                    <p className="text-text-primary font-semibold">{copyTrade.allocation}%</p>
                  </div>
                  <div>
                    <p className="text-text-secondary">Max Risk per Trade</p>
                    <p className="text-text-primary font-semibold">{copyTrade.maxRiskPerTrade}%</p>
                  </div>
                  <div>
                    <p className="text-text-secondary">Total Copied Trades</p>
                    <p className="text-text-primary font-semibold">{copyTrade.totalCopiedTrades}</p>
                  </div>
                  <div>
                    <p className="text-text-secondary">Total Profit</p>
                    <p className={`font-semibold ${
                      copyTrade.totalProfit >= 0 ? 'text-green-500' : 'text-red-500'
                    }`}>
                      ₹{copyTrade.totalProfit.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => handleStopCopy(copyTrade._id)}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
              >
                Stop Copying
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default SocialTradingPage;

