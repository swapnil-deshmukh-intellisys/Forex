import * as technicalService from '../services/technicalAnalysis.service.js';
import { asyncHandler } from '../middleware/errorHandler.js';

// @desc    Calculate technical indicators
// @route   POST /api/technical/indicators
// @access  Private
export const calculateIndicators = asyncHandler(async (req, res) => {
  const { priceData, indicators } = req.body;

  if (!priceData || !Array.isArray(priceData) || priceData.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Price data is required'
    });
  }

  const prices = priceData.map(d => d.close || d.price || d);
  const highs = priceData.map(d => d.high || d.close || d.price || d);
  const lows = priceData.map(d => d.low || d.close || d.price || d);

  const results = {};

  // Calculate requested indicators
  if (!indicators || indicators.includes('SMA')) {
    results.sma20 = technicalService.calculateSMA(prices, 20);
    results.sma50 = technicalService.calculateSMA(prices, 50);
    results.sma200 = technicalService.calculateSMA(prices, 200);
  }

  if (!indicators || indicators.includes('EMA')) {
    results.ema12 = technicalService.calculateEMA(prices, 12);
    results.ema26 = technicalService.calculateEMA(prices, 26);
  }

  if (!indicators || indicators.includes('RSI')) {
    results.rsi = technicalService.calculateRSI(prices);
  }

  if (!indicators || indicators.includes('MACD')) {
    results.macd = technicalService.calculateMACD(prices);
  }

  if (!indicators || indicators.includes('Bollinger')) {
    results.bollingerBands = technicalService.calculateBollingerBands(prices);
  }

  if (!indicators || indicators.includes('Stochastic')) {
    results.stochastic = technicalService.calculateStochastic(highs, lows, prices);
  }

  if (!indicators || indicators.includes('SupportResistance')) {
    results.supportResistance = technicalService.calculateSupportResistance(prices);
  }

  res.json({
    success: true,
    indicators: results
  });
});

// @desc    Get trading signals
// @route   POST /api/technical/signals
// @access  Private
export const getTradingSignals = asyncHandler(async (req, res) => {
  const { priceData } = req.body;

  if (!priceData || !Array.isArray(priceData) || priceData.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Price data is required'
    });
  }

  const signals = technicalService.getTradingSignals(priceData);

  res.json({
    success: true,
    ...signals
  });
});

// @desc    Calculate Fibonacci levels
// @route   POST /api/technical/fibonacci
// @access  Private
export const calculateFibonacci = asyncHandler(async (req, res) => {
  const { high, low } = req.body;

  if (high === undefined || low === undefined || high <= low) {
    return res.status(400).json({
      success: false,
      message: 'Valid high and low prices are required'
    });
  }

  const levels = technicalService.calculateFibonacci(high, low);

  res.json({
    success: true,
    levels
  });
});

// @desc    Get comprehensive technical analysis
// @route   POST /api/technical/analysis
// @access  Private
export const getTechnicalAnalysis = asyncHandler(async (req, res) => {
  const { priceData, symbol } = req.body;

  if (!priceData || !Array.isArray(priceData) || priceData.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Price data is required'
    });
  }

  const prices = priceData.map(d => d.close || d.price || d);
  const highs = priceData.map(d => d.high || d.close || d.price || d);
  const lows = priceData.map(d => d.low || d.close || d.price || d);

  const analysis = {
    symbol: symbol || 'Unknown',
    currentPrice: prices[prices.length - 1],
    indicators: {
      sma20: technicalService.calculateSMA(prices, 20),
      sma50: technicalService.calculateSMA(prices, 50),
      ema12: technicalService.calculateEMA(prices, 12),
      ema26: technicalService.calculateEMA(prices, 26),
      rsi: technicalService.calculateRSI(prices),
      macd: technicalService.calculateMACD(prices),
      bollingerBands: technicalService.calculateBollingerBands(prices),
      stochastic: technicalService.calculateStochastic(highs, lows, prices),
      supportResistance: technicalService.calculateSupportResistance(prices)
    },
    signals: technicalService.getTradingSignals(priceData),
    fibonacci: technicalService.calculateFibonacci(
      Math.max(...highs),
      Math.min(...lows)
    )
  };

  res.json({
    success: true,
    analysis
  });
});

