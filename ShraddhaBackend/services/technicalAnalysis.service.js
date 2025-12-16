/**
 * Technical Analysis Service
 * Provides calculations for various technical indicators
 */

/**
 * Calculate Simple Moving Average (SMA)
 */
export const calculateSMA = (prices, period) => {
  if (prices.length < period) {
    return null;
  }

  const slice = prices.slice(-period);
  const sum = slice.reduce((acc, price) => acc + price, 0);
  return sum / period;
};

/**
 * Calculate Exponential Moving Average (EMA)
 */
export const calculateEMA = (prices, period) => {
  if (prices.length < period) {
    return null;
  }

  const multiplier = 2 / (period + 1);
  let ema = calculateSMA(prices.slice(0, period), period);

  for (let i = period; i < prices.length; i++) {
    ema = (prices[i] - ema) * multiplier + ema;
  }

  return ema;
};

/**
 * Calculate Relative Strength Index (RSI)
 */
export const calculateRSI = (prices, period = 14) => {
  if (prices.length < period + 1) {
    return null;
  }

  const gains = [];
  const losses = [];

  for (let i = 1; i < prices.length; i++) {
    const change = prices[i] - prices[i - 1];
    gains.push(change > 0 ? change : 0);
    losses.push(change < 0 ? Math.abs(change) : 0);
  }

  let avgGain = gains.slice(0, period).reduce((sum, g) => sum + g, 0) / period;
  let avgLoss = losses.slice(0, period).reduce((sum, l) => sum + l, 0) / period;

  for (let i = period; i < gains.length; i++) {
    avgGain = (avgGain * (period - 1) + gains[i]) / period;
    avgLoss = (avgLoss * (period - 1) + losses[i]) / period;
  }

  if (avgLoss === 0) return 100;

  const rs = avgGain / avgLoss;
  const rsi = 100 - (100 / (1 + rs));

  return rsi;
};

/**
 * Calculate MACD (Moving Average Convergence Divergence)
 */
export const calculateMACD = (prices, fastPeriod = 12, slowPeriod = 26, signalPeriod = 9) => {
  if (prices.length < slowPeriod) {
    return null;
  }

  const fastEMA = calculateEMA(prices, fastPeriod);
  const slowEMA = calculateEMA(prices, slowPeriod);

  if (!fastEMA || !slowEMA) {
    return null;
  }

  const macdLine = fastEMA - slowEMA;

  // For signal line, we'd need historical MACD values
  // Simplified version
  const signalLine = macdLine; // In real implementation, calculate EMA of MACD

  return {
    macd: macdLine,
    signal: signalLine,
    histogram: macdLine - signalLine
  };
};

/**
 * Calculate Bollinger Bands
 */
export const calculateBollingerBands = (prices, period = 20, stdDev = 2) => {
  if (prices.length < period) {
    return null;
  }

  const sma = calculateSMA(prices, period);
  if (!sma) return null;

  const slice = prices.slice(-period);
  const variance = slice.reduce((sum, price) => {
    return sum + Math.pow(price - sma, 2);
  }, 0) / period;

  const standardDeviation = Math.sqrt(variance);

  return {
    upper: sma + (standardDeviation * stdDev),
    middle: sma,
    lower: sma - (standardDeviation * stdDev)
  };
};

/**
 * Calculate Stochastic Oscillator
 */
export const calculateStochastic = (highs, lows, closes, period = 14) => {
  if (highs.length < period || lows.length < period || closes.length < period) {
    return null;
  }

  const currentClose = closes[closes.length - 1];
  const highestHigh = Math.max(...highs.slice(-period));
  const lowestLow = Math.min(...lows.slice(-period));

  if (highestHigh === lowestLow) {
    return 50; // Neutral
  }

  const k = ((currentClose - lowestLow) / (highestHigh - lowestLow)) * 100;

  return {
    k,
    d: k // Simplified - D is typically SMA of K
  };
};

/**
 * Calculate Support and Resistance levels
 */
export const calculateSupportResistance = (prices, lookback = 20) => {
  if (prices.length < lookback) {
    return null;
  }

  const slice = prices.slice(-lookback);
  const sorted = [...slice].sort((a, b) => a - b);

  const support = sorted[Math.floor(sorted.length * 0.1)]; // 10th percentile
  const resistance = sorted[Math.floor(sorted.length * 0.9)]; // 90th percentile

  return {
    support,
    resistance,
    current: prices[prices.length - 1]
  };
};

/**
 * Get trading signals based on indicators
 */
export const getTradingSignals = (priceData) => {
  if (!priceData || priceData.length < 30) {
    return {
      signals: [],
      summary: 'Insufficient data'
    };
  }

  const prices = priceData.map(d => d.close || d.price);
  const highs = priceData.map(d => d.high || d.close || d.price);
  const lows = priceData.map(d => d.low || d.close || d.price);

  const signals = [];
  let buySignals = 0;
  let sellSignals = 0;

  // RSI signals
  const rsi = calculateRSI(prices);
  if (rsi !== null) {
    if (rsi < 30) {
      signals.push({ indicator: 'RSI', signal: 'BUY', strength: 'Strong', value: rsi });
      buySignals++;
    } else if (rsi > 70) {
      signals.push({ indicator: 'RSI', signal: 'SELL', strength: 'Strong', value: rsi });
      sellSignals++;
    }
  }

  // MACD signals
  const macd = calculateMACD(prices);
  if (macd && macd.histogram > 0) {
    signals.push({ indicator: 'MACD', signal: 'BUY', strength: 'Medium', value: macd.histogram });
    buySignals++;
  } else if (macd && macd.histogram < 0) {
    signals.push({ indicator: 'MACD', signal: 'SELL', strength: 'Medium', value: macd.histogram });
    sellSignals++;
  }

  // Bollinger Bands signals
  const bb = calculateBollingerBands(prices);
  if (bb) {
    const currentPrice = prices[prices.length - 1];
    if (currentPrice < bb.lower) {
      signals.push({ indicator: 'Bollinger Bands', signal: 'BUY', strength: 'Medium', value: currentPrice });
      buySignals++;
    } else if (currentPrice > bb.upper) {
      signals.push({ indicator: 'Bollinger Bands', signal: 'SELL', strength: 'Medium', value: currentPrice });
      sellSignals++;
    }
  }

  // Overall recommendation
  let recommendation = 'NEUTRAL';
  let strength = 'Weak';
  if (buySignals > sellSignals && buySignals >= 2) {
    recommendation = 'BUY';
    strength = buySignals >= 3 ? 'Strong' : 'Medium';
  } else if (sellSignals > buySignals && sellSignals >= 2) {
    recommendation = 'SELL';
    strength = sellSignals >= 3 ? 'Strong' : 'Medium';
  }

  return {
    signals,
    recommendation,
    strength,
    buySignals,
    sellSignals
  };
};

/**
 * Calculate Fibonacci Retracement levels
 */
export const calculateFibonacci = (high, low) => {
  const diff = high - low;
  const levels = [0.236, 0.382, 0.5, 0.618, 0.786];

  return levels.map(level => ({
    level,
    price: high - (diff * level),
    label: `${(level * 100).toFixed(1)}%`
  }));
};

