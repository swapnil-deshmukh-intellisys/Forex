import React, { useState, useEffect } from 'react';
import { 
  FaCalculator,
  FaDollarSign,
  FaPercentage,
  FaChartLine,
  FaInfoCircle
} from 'react-icons/fa';

const TradingCalculator = () => {
  const [formData, setFormData] = useState({
    accountBalance: 1000,
    riskPercentage: 2,
    stopLoss: 50,
    entryPrice: 1.0800,
    stopLossPrice: 1.0750,
    takeProfitPrice: 1.0900,
    leverage: 100,
    lotSize: 0.01
  });

  const [results, setResults] = useState({
    riskAmount: 0,
    positionSize: 0,
    pipValue: 0,
    pipDistance: 0,
    profitAtTP: 0,
    lossAtSL: 0,
    riskRewardRatio: 0,
    marginRequired: 0,
    maxLoss: 0,
    maxProfit: 0
  });

  const [selectedPair, setSelectedPair] = useState('EURUSD');
  const [calculationType, setCalculationType] = useState('risk'); // risk, position, pip

  const currencyPairs = [
    { symbol: 'EURUSD', pipValue: 10, lotSize: 100000 },
    { symbol: 'GBPUSD', pipValue: 10, lotSize: 100000 },
    { symbol: 'USDJPY', pipValue: 9.09, lotSize: 100000 },
    { symbol: 'AUDUSD', pipValue: 10, lotSize: 100000 },
    { symbol: 'USDCAD', pipValue: 7.58, lotSize: 100000 },
    { symbol: 'XAUUSD', pipValue: 1, lotSize: 100 },
    { symbol: 'BTCUSD', pipValue: 1, lotSize: 1 }
  ];

  useEffect(() => {
    calculate();
  }, [formData, selectedPair, calculationType]);

  const calculate = () => {
    const pair = currencyPairs.find(p => p.symbol === selectedPair);
    if (!pair) return;

    const {
      accountBalance,
      riskPercentage,
      stopLoss,
      entryPrice,
      stopLossPrice,
      takeProfitPrice,
      leverage,
      lotSize
    } = formData;

    // Calculate risk amount
    const riskAmount = (accountBalance * riskPercentage) / 100;

    // Calculate pip distance
    const pipDistance = Math.abs(entryPrice - stopLossPrice) * (pair.symbol.includes('JPY') ? 100 : 10000);

    // Calculate position size based on risk
    const positionSizeByRisk = riskAmount / (pipDistance * pair.pipValue);

    // Calculate pip value
    const pipValue = (lotSize * pair.lotSize * pair.pipValue) / 100000;

    // Calculate profit/loss
    const tpPipDistance = Math.abs(takeProfitPrice - entryPrice) * (pair.symbol.includes('JPY') ? 100 : 10000);
    const slPipDistance = Math.abs(entryPrice - stopLossPrice) * (pair.symbol.includes('JPY') ? 100 : 10000);

    const profitAtTP = lotSize * pair.lotSize * tpPipDistance * (pair.symbol.includes('JPY') ? 0.01 : 0.0001);
    const lossAtSL = lotSize * pair.lotSize * slPipDistance * (pair.symbol.includes('JPY') ? 0.01 : 0.0001);

    // Risk/Reward Ratio
    const riskRewardRatio = slPipDistance > 0 ? tpPipDistance / slPipDistance : 0;

    // Margin required
    const marginRequired = (lotSize * pair.lotSize * entryPrice) / leverage;

    // Max loss and profit
    const maxLoss = lossAtSL;
    const maxProfit = profitAtTP;

    setResults({
      riskAmount,
      positionSize: positionSizeByRisk,
      pipValue,
      pipDistance,
      profitAtTP,
      lossAtSL,
      riskRewardRatio,
      marginRequired,
      maxLoss,
      maxProfit
    });
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: parseFloat(value) || 0
    }));
  };

  const handlePairChange = (symbol) => {
    setSelectedPair(symbol);
    const pair = currencyPairs.find(p => p.symbol === symbol);
    if (pair) {
      // Update default values based on pair
      setFormData(prev => ({
        ...prev,
        entryPrice: symbol === 'XAUUSD' ? 2050 : symbol === 'BTCUSD' ? 45000 : 1.0800,
        stopLossPrice: symbol === 'XAUUSD' ? 2040 : symbol === 'BTCUSD' ? 44900 : 1.0750,
        takeProfitPrice: symbol === 'XAUUSD' ? 2070 : symbol === 'BTCUSD' ? 45100 : 1.0900
      }));
    }
  };

  const getRiskColor = (value) => {
    if (value >= 3) return 'text-success-color';
    if (value >= 2) return 'text-warning-color';
    return 'text-danger-color';
  };

  return (
    <div className="bg-card-bg border border-border-color rounded-xl p-6">
      <div className="flex items-center space-x-3 mb-6">
        <FaCalculator className="text-accent-color text-2xl" />
        <h2 className="text-2xl font-bold text-text-primary">Trading Calculator</h2>
      </div>

      {/* Currency Pair Selector */}
      <div className="mb-6">
        <label className="block text-text-secondary mb-2">Currency Pair</label>
        <select
          value={selectedPair}
          onChange={(e) => handlePairChange(e.target.value)}
          className="w-full bg-bg-secondary border border-border-color rounded-lg px-4 py-2 text-text-primary"
        >
          {currencyPairs.map(pair => (
            <option key={pair.symbol} value={pair.symbol}>
              {pair.symbol}
            </option>
          ))}
        </select>
      </div>

      {/* Calculation Type */}
      <div className="mb-6">
        <label className="block text-text-secondary mb-2">Calculation Type</label>
        <div className="flex space-x-4">
          <button
            onClick={() => setCalculationType('risk')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              calculationType === 'risk'
                ? 'bg-accent-color text-text-quaternary'
                : 'bg-bg-secondary text-text-secondary hover:bg-bg-secondary/80'
            }`}
          >
            Risk-Based
          </button>
          <button
            onClick={() => setCalculationType('position')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              calculationType === 'position'
                ? 'bg-accent-color text-text-quaternary'
                : 'bg-bg-secondary text-text-secondary hover:bg-bg-secondary/80'
            }`}
          >
            Position Size
          </button>
          <button
            onClick={() => setCalculationType('pip')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              calculationType === 'pip'
                ? 'bg-accent-color text-text-quaternary'
                : 'bg-bg-secondary text-text-secondary hover:bg-bg-secondary/80'
            }`}
          >
            Pip Value
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Input Parameters</h3>
          
          <div>
            <label className="block text-text-secondary mb-2 flex items-center space-x-2">
              <FaDollarSign />
              <span>Account Balance</span>
            </label>
            <input
              type="number"
              value={formData.accountBalance}
              onChange={(e) => handleInputChange('accountBalance', e.target.value)}
              className="w-full bg-bg-secondary border border-border-color rounded-lg px-4 py-2 text-text-primary"
              step="0.01"
            />
          </div>

          <div>
            <label className="block text-text-secondary mb-2 flex items-center space-x-2">
              <FaPercentage />
              <span>Risk Percentage (%)</span>
            </label>
            <input
              type="number"
              value={formData.riskPercentage}
              onChange={(e) => handleInputChange('riskPercentage', e.target.value)}
              className="w-full bg-bg-secondary border border-border-color rounded-lg px-4 py-2 text-text-primary"
              step="0.1"
              min="0"
              max="100"
            />
            <p className="text-xs text-text-secondary mt-1">
              Recommended: 1-2% per trade
            </p>
          </div>

          <div>
            <label className="block text-text-secondary mb-2">Stop Loss (Pips)</label>
            <input
              type="number"
              value={formData.stopLoss}
              onChange={(e) => handleInputChange('stopLoss', e.target.value)}
              className="w-full bg-bg-secondary border border-border-color rounded-lg px-4 py-2 text-text-primary"
              step="1"
            />
          </div>

          <div>
            <label className="block text-text-secondary mb-2">Entry Price</label>
            <input
              type="number"
              value={formData.entryPrice}
              onChange={(e) => handleInputChange('entryPrice', e.target.value)}
              className="w-full bg-bg-secondary border border-border-color rounded-lg px-4 py-2 text-text-primary"
              step="0.0001"
            />
          </div>

          <div>
            <label className="block text-text-secondary mb-2">Stop Loss Price</label>
            <input
              type="number"
              value={formData.stopLossPrice}
              onChange={(e) => handleInputChange('stopLossPrice', e.target.value)}
              className="w-full bg-bg-secondary border border-border-color rounded-lg px-4 py-2 text-text-primary"
              step="0.0001"
            />
          </div>

          <div>
            <label className="block text-text-secondary mb-2">Take Profit Price</label>
            <input
              type="number"
              value={formData.takeProfitPrice}
              onChange={(e) => handleInputChange('takeProfitPrice', e.target.value)}
              className="w-full bg-bg-secondary border border-border-color rounded-lg px-4 py-2 text-text-primary"
              step="0.0001"
            />
          </div>

          <div>
            <label className="block text-text-secondary mb-2">Leverage</label>
            <input
              type="number"
              value={formData.leverage}
              onChange={(e) => handleInputChange('leverage', e.target.value)}
              className="w-full bg-bg-secondary border border-border-color rounded-lg px-4 py-2 text-text-primary"
              step="1"
            />
          </div>

          <div>
            <label className="block text-text-secondary mb-2">Lot Size</label>
            <input
              type="number"
              value={formData.lotSize}
              onChange={(e) => handleInputChange('lotSize', e.target.value)}
              className="w-full bg-bg-secondary border border-border-color rounded-lg px-4 py-2 text-text-primary"
              step="0.01"
            />
          </div>
        </div>

        {/* Results Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Calculation Results</h3>
          
          <div className="bg-bg-secondary rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-text-secondary">Risk Amount</span>
              <span className="text-text-primary font-semibold">
                ${results.riskAmount.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="bg-bg-secondary rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-text-secondary">Position Size (Lots)</span>
              <span className="text-text-primary font-semibold">
                {results.positionSize.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="bg-bg-secondary rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-text-secondary">Pip Value</span>
              <span className="text-text-primary font-semibold">
                ${results.pipValue.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="bg-bg-secondary rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-text-secondary">Pip Distance</span>
              <span className="text-text-primary font-semibold">
                {results.pipDistance.toFixed(1)} pips
              </span>
            </div>
          </div>

          <div className="bg-success-color/10 border border-success-color rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-success-color">Profit at Take Profit</span>
              <span className="text-success-color font-semibold">
                ${results.profitAtTP.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="bg-danger-color/10 border border-danger-color rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-danger-color">Loss at Stop Loss</span>
              <span className="text-danger-color font-semibold">
                ${results.lossAtSL.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="bg-accent-color/10 border border-accent-color rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-accent-color">Risk/Reward Ratio</span>
              <span className={`font-semibold ${getRiskColor(results.riskRewardRatio)}`}>
                {results.riskRewardRatio.toFixed(2)}:1
              </span>
            </div>
            <p className="text-xs text-text-secondary mt-2">
              {results.riskRewardRatio >= 2 ? 'Good risk/reward ratio' : 'Consider improving risk/reward ratio'}
            </p>
          </div>

          <div className="bg-bg-secondary rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-text-secondary">Margin Required</span>
              <span className="text-text-primary font-semibold">
                ${results.marginRequired.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="bg-warning-color/10 border border-warning-color rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-warning-color">Maximum Loss</span>
              <span className="text-warning-color font-semibold">
                ${results.maxLoss.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="bg-success-color/10 border border-success-color rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-success-color">Maximum Profit</span>
              <span className="text-success-color font-semibold">
                ${results.maxProfit.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="mt-6 p-4 bg-primary-blue/10 border border-primary-blue rounded-lg">
        <div className="flex items-start space-x-2">
          <FaInfoCircle className="text-primary-blue mt-1" />
          <div className="text-sm text-text-secondary">
            <p className="font-semibold text-text-primary mb-1">Calculator Tips:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Always risk only 1-2% of your account balance per trade</li>
              <li>Maintain a risk/reward ratio of at least 1:2</li>
              <li>Consider margin requirements before opening positions</li>
              <li>Use stop loss to protect your capital</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradingCalculator;

