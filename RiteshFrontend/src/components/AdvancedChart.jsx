import React, { useState, useEffect } from 'react';
import { technicalAnalysisAPI } from '../services/api';

const AdvancedChart = ({ symbol = 'EURUSD', priceData = null }) => {
  const [indicators, setIndicators] = useState(null);
  const [signals, setSignals] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedIndicators, setSelectedIndicators] = useState(['SMA', 'RSI', 'MACD']);

  useEffect(() => {
    // F2P FIX: Handle empty priceData gracefully
    if (!priceData || priceData.length === 0) {
      setError('No price data available');
      return;
    }
    loadAnalysis();
  }, [priceData, selectedIndicators]);

  const loadAnalysis = async () => {
    try {
      setLoading(true);
      const [indicatorsRes, signalsRes] = await Promise.all([
        technicalAnalysisAPI.calculateIndicators(priceData, selectedIndicators),
        technicalAnalysisAPI.getTradingSignals(priceData)
      ]);
      setIndicators(indicatorsRes.indicators);
      setSignals(signalsRes);
    } catch (error) {
      console.error('Error loading technical analysis:', error);
      // F2P FIX: Add error state handling
      setError('Failed to load technical analysis data');
    } finally {
      setLoading(false);
    }
  };

  // Generate mock price data if not provided
  const generateMockData = () => {
    const data = [];
    let price = 1.1000;
    for (let i = 0; i < 100; i++) {
      price += (Math.random() - 0.5) * 0.01;
      data.push({
        time: new Date(Date.now() - (100 - i) * 86400000).toISOString(),
        open: price - 0.001,
        high: price + 0.002,
        low: price - 0.002,
        close: price,
        price: price
      });
    }
    return data;
  };

  const chartData = priceData || generateMockData();

  // F2P FIX: Add error display
  if (error) {
    return (
      <div className="bg-card-bg p-6 rounded-lg border border-border">
        <div className="text-center py-8">
          <p className="text-red-500 text-lg font-semibold">Error</p>
          <p className="text-text-secondary">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card-bg p-6 rounded-lg border border-border">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-text-primary">Technical Analysis - {symbol}</h3>
        <div className="flex gap-2">
          {['SMA', 'EMA', 'RSI', 'MACD', 'Bollinger', 'Stochastic'].map(ind => (
            <button
              key={ind}
              onClick={() => {
                if (selectedIndicators.includes(ind)) {
                  setSelectedIndicators(selectedIndicators.filter(i => i !== ind));
                } else {
                  setSelectedIndicators([...selectedIndicators, ind]);
                }
              }}
              className={`px-3 py-1 rounded text-sm ${
                selectedIndicators.includes(ind)
                  ? 'bg-primary text-white'
                  : 'bg-background border border-border text-text-primary'
              }`}
            >
              {ind}
            </button>
          ))}
        </div>
      </div>

      {/* Trading Signals */}
      {signals && (
        <div className={`p-4 rounded-lg mb-6 ${
          signals.recommendation === 'BUY' ? 'bg-green-500/20 border border-green-500' :
          signals.recommendation === 'SELL' ? 'bg-red-500/20 border border-red-500' :
          'bg-gray-500/20 border border-gray-500'
        }`}>
          <div className="flex items-center gap-4">
            <div>
              <p className="text-sm text-text-secondary">Recommendation</p>
              <p className={`text-2xl font-bold ${
                signals.recommendation === 'BUY' ? 'text-green-500' :
                signals.recommendation === 'SELL' ? 'text-red-500' :
                'text-gray-500'
              }`}>
                {signals.recommendation}
              </p>
            </div>
            <div>
              <p className="text-sm text-text-secondary">Strength</p>
              <p className="text-lg font-semibold text-text-primary">{signals.strength}</p>
            </div>
            <div>
              <p className="text-sm text-text-secondary">Buy Signals</p>
              <p className="text-lg font-semibold text-green-500">{signals.buySignals}</p>
            </div>
            <div>
              <p className="text-sm text-text-secondary">Sell Signals</p>
              <p className="text-lg font-semibold text-red-500">{signals.sellSignals}</p>
            </div>
          </div>
          {signals.signals && signals.signals.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-semibold text-text-primary mb-2">Signal Details:</p>
              <div className="space-y-1">
                {signals.signals.map((signal, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span className="text-text-secondary">{signal.indicator}</span>
                    <span className={`font-semibold ${
                      signal.signal === 'BUY' ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {signal.signal} - {signal.strength}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Chart Visualization (Simplified) */}
      <div className="bg-background p-4 rounded-lg mb-6" style={{ height: '400px' }}>
        <div className="flex items-center justify-center h-full text-text-secondary">
          <p>Chart visualization would go here</p>
          <p className="text-xs mt-2">Current Price: {chartData[chartData.length - 1]?.close?.toFixed(5) || 'N/A'}</p>
        </div>
      </div>

      {/* Indicators Display */}
      {indicators && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {indicators.sma20 && (
            <div className="bg-background p-4 rounded-lg">
              <p className="text-text-secondary text-sm">SMA 20</p>
              <p className="text-text-primary font-semibold">{indicators.sma20.toFixed(5)}</p>
            </div>
          )}
          {indicators.sma50 && (
            <div className="bg-background p-4 rounded-lg">
              <p className="text-text-secondary text-sm">SMA 50</p>
              <p className="text-text-primary font-semibold">{indicators.sma50.toFixed(5)}</p>
            </div>
          )}
          {indicators.rsi && (
            <div className="bg-background p-4 rounded-lg">
              <p className="text-text-secondary text-sm">RSI</p>
              <p className={`font-semibold ${
                indicators.rsi < 30 ? 'text-green-500' :
                indicators.rsi > 70 ? 'text-red-500' :
                'text-text-primary'
              }`}>
                {indicators.rsi.toFixed(2)}
              </p>
            </div>
          )}
          {indicators.macd && (
            <div className="bg-background p-4 rounded-lg">
              <p className="text-text-secondary text-sm">MACD</p>
              <p className="text-text-primary font-semibold">{indicators.macd.macd.toFixed(5)}</p>
              <p className="text-text-secondary text-xs">Histogram: {indicators.macd.histogram.toFixed(5)}</p>
            </div>
          )}
          {indicators.bollingerBands && (
            <div className="bg-background p-4 rounded-lg">
              <p className="text-text-secondary text-sm">Bollinger Bands</p>
              <p className="text-text-primary text-xs">Upper: {indicators.bollingerBands.upper.toFixed(5)}</p>
              <p className="text-text-primary text-xs">Middle: {indicators.bollingerBands.middle.toFixed(5)}</p>
              <p className="text-text-primary text-xs">Lower: {indicators.bollingerBands.lower.toFixed(5)}</p>
            </div>
          )}
        </div>
      )}

      {loading && (
        <div className="text-center py-4">
          <p className="text-text-secondary">Calculating indicators...</p>
        </div>
      )}
    </div>
  );
};

export default AdvancedChart;

