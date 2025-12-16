import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import { riskManagementAPI, accountAPI } from '../services/api';

const RiskManagementPage = ({ userEmail, onBack, onSignOut, onProfileClick }) => {
  const [exposure, setExposure] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [riskAnalysis, setRiskAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30');

  useEffect(() => {
    loadData();
  }, [timeRange]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [exposureRes, metricsRes, analysisRes] = await Promise.all([
        riskManagementAPI.getAccountExposure(),
        riskManagementAPI.getRiskMetrics(timeRange),
        riskManagementAPI.getRiskAnalysis(null, timeRange)
      ]);
      setExposure(exposureRes.exposure);
      setMetrics(metricsRes.metrics);
      setRiskAnalysis(analysisRes.riskAssessment);
    } catch (error) {
      console.error('Error loading risk data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background-secondary to-background">
        <Header userEmail={userEmail} onSignOut={onSignOut} onProfileClick={onProfileClick} onBack={onBack} />
        <div className="container mx-auto px-4 py-8">
          <p className="text-text-secondary">Loading risk analysis...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background-secondary to-background">
      <Header userEmail={userEmail} onSignOut={onSignOut} onProfileClick={onProfileClick} onBack={onBack} />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold text-text-primary">Risk Management</h1>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 bg-card-bg border border-border rounded-lg text-text-primary"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="365">Last year</option>
          </select>
        </div>

        {/* Risk Assessment Alert */}
        {riskAnalysis && (
          <div className={`p-4 rounded-lg border mb-6 ${
            riskAnalysis.level === 'Critical' ? 'bg-red-500/20 border-red-500' :
            riskAnalysis.level === 'High' ? 'bg-orange-500/20 border-orange-500' :
            riskAnalysis.level === 'Medium' ? 'bg-yellow-500/20 border-yellow-500' :
            'bg-green-500/20 border-green-500'
          }`}>
            <h3 className="text-lg font-semibold text-text-primary mb-2">
              Risk Level: {riskAnalysis.level}
            </h3>
            {riskAnalysis.warnings.length > 0 && (
              <div className="mb-2">
                <p className="font-semibold text-text-primary">Warnings:</p>
                <ul className="list-disc list-inside text-text-secondary">
                  {riskAnalysis.warnings.map((w, i) => (
                    <li key={i}>{w}</li>
                  ))}
                </ul>
              </div>
            )}
            {riskAnalysis.recommendations.length > 0 && (
              <div>
                <p className="font-semibold text-text-primary">Recommendations:</p>
                <ul className="list-disc list-inside text-text-secondary">
                  {riskAnalysis.recommendations.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Exposure Cards */}
        {exposure && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-card-bg p-4 rounded-lg border border-border">
              <p className="text-text-secondary text-sm">Total Balance</p>
              <p className="text-2xl font-bold text-text-primary">₹{exposure.totalBalance.toFixed(2)}</p>
            </div>
            <div className="bg-card-bg p-4 rounded-lg border border-border">
              <p className="text-text-secondary text-sm">Total Equity</p>
              <p className="text-2xl font-bold text-text-primary">₹{exposure.totalEquity.toFixed(2)}</p>
            </div>
            <div className="bg-card-bg p-4 rounded-lg border border-border">
              <p className="text-text-secondary text-sm">Margin Level</p>
              <p className={`text-2xl font-bold ${
                exposure.marginLevel < 100 ? 'text-red-500' :
                exposure.marginLevel < 150 ? 'text-orange-500' :
                'text-green-500'
              }`}>
                {exposure.marginLevel.toFixed(2)}%
              </p>
            </div>
            <div className="bg-card-bg p-4 rounded-lg border border-border">
              <p className="text-text-secondary text-sm">Free Margin</p>
              <p className="text-2xl font-bold text-text-primary">₹{exposure.freeMargin.toFixed(2)}</p>
            </div>
          </div>
        )}

        {/* Metrics */}
        {metrics && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-card-bg p-6 rounded-lg border border-border">
              <h3 className="text-xl font-semibold text-text-primary mb-4">Trading Metrics</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-text-secondary">Total Trades</span>
                  <span className="text-text-primary font-semibold">{metrics.totalTrades}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Win Rate</span>
                  <span className="text-text-primary font-semibold">{metrics.winRate.toFixed(2)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Profit Factor</span>
                  <span className="text-text-primary font-semibold">{metrics.profitFactor.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Max Drawdown</span>
                  <span className="text-red-500 font-semibold">₹{metrics.maxDrawdown.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Sharpe Ratio</span>
                  <span className="text-text-primary font-semibold">{metrics.sharpeRatio.toFixed(2)}</span>
                </div>
              </div>
            </div>
            <div className="bg-card-bg p-6 rounded-lg border border-border">
              <h3 className="text-xl font-semibold text-text-primary mb-4">Profit & Loss</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-text-secondary">Total Profit</span>
                  <span className={`font-semibold ${metrics.totalProfit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    ₹{metrics.totalProfit.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Average Profit</span>
                  <span className={`font-semibold ${metrics.averageProfit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    ₹{metrics.averageProfit.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Largest Win</span>
                  <span className="text-green-500 font-semibold">₹{metrics.largestWin.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Largest Loss</span>
                  <span className="text-red-500 font-semibold">₹{metrics.largestLoss.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Risk to Equity</span>
                  <span className="text-text-primary font-semibold">{metrics.riskToEquityRatio.toFixed(2)}%</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Position Size Calculator */}
        <PositionSizeCalculator />
      </div>
    </div>
  );
};

const PositionSizeCalculator = () => {
  const [formData, setFormData] = useState({
    accountBalance: '',
    riskPercentage: '2',
    stopLossPips: '',
    pipValue: '10',
    lotSize: '1'
  });
  const [result, setResult] = useState(null);

  const handleCalculate = async () => {
    try {
      const response = await riskManagementAPI.calculatePositionSize({
        accountBalance: parseFloat(formData.accountBalance),
        riskPercentage: parseFloat(formData.riskPercentage),
        stopLossPips: parseFloat(formData.stopLossPips),
        pipValue: parseFloat(formData.pipValue),
        lotSize: parseFloat(formData.lotSize)
      });
      setResult(response);
    } catch (error) {
      console.error('Error calculating position size:', error);
    }
  };

  return (
    <div className="bg-card-bg p-6 rounded-lg border border-border">
      <h3 className="text-xl font-semibold text-text-primary mb-4">Position Size Calculator</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-text-secondary mb-1">Account Balance (₹)</label>
          <input
            type="number"
            value={formData.accountBalance}
            onChange={(e) => setFormData({ ...formData, accountBalance: e.target.value })}
            className="w-full px-4 py-2 bg-background border border-border rounded-lg text-text-primary"
          />
        </div>
        <div>
          <label className="block text-text-secondary mb-1">Risk Percentage (%)</label>
          <input
            type="number"
            step="0.1"
            value={formData.riskPercentage}
            onChange={(e) => setFormData({ ...formData, riskPercentage: e.target.value })}
            className="w-full px-4 py-2 bg-background border border-border rounded-lg text-text-primary"
          />
        </div>
        <div>
          <label className="block text-text-secondary mb-1">Stop Loss (Pips)</label>
          <input
            type="number"
            value={formData.stopLossPips}
            onChange={(e) => setFormData({ ...formData, stopLossPips: e.target.value })}
            className="w-full px-4 py-2 bg-background border border-border rounded-lg text-text-primary"
          />
        </div>
        <div>
          <label className="block text-text-secondary mb-1">Pip Value (₹)</label>
          <input
            type="number"
            value={formData.pipValue}
            onChange={(e) => setFormData({ ...formData, pipValue: e.target.value })}
            className="w-full px-4 py-2 bg-background border border-border rounded-lg text-text-primary"
          />
        </div>
      </div>
      <button
        onClick={handleCalculate}
        className="bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-lg mb-4"
      >
        Calculate
      </button>
      {result && (
        <div className="bg-background p-4 rounded-lg">
          <p className="text-text-primary">
            <span className="font-semibold">Position Size:</span> {result.positionSize.toFixed(2)} lots
          </p>
          <p className="text-text-primary">
            <span className="font-semibold">Risk Amount:</span> ₹{result.riskAmount.toFixed(2)}
          </p>
        </div>
      )}
    </div>
  );
};

export default RiskManagementPage;

