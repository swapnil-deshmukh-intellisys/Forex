import * as riskService from '../services/riskManagement.service.js';
import { asyncHandler } from '../middleware/errorHandler.js';

// @desc    Calculate position size
// @route   POST /api/risk/position-size
// @access  Private
export const calculatePositionSize = asyncHandler(async (req, res) => {
  const { accountBalance, riskPercentage, stopLossPips, pipValue, lotSize } = req.body;

  if (!accountBalance || !riskPercentage || !stopLossPips || !pipValue) {
    return res.status(400).json({
      success: false,
      message: 'Missing required parameters'
    });
  }

  const positionSize = riskService.calculatePositionSize(
    accountBalance,
    riskPercentage,
    stopLossPips,
    pipValue,
    lotSize
  );

  res.json({
    success: true,
    positionSize,
    riskAmount: (accountBalance * riskPercentage) / 100
  });
});

// @desc    Calculate margin
// @route   POST /api/risk/margin
// @access  Private
export const calculateMargin = asyncHandler(async (req, res) => {
  const { lotSize, contractSize, leverage, currentPrice } = req.body;

  if (!lotSize || !contractSize || !leverage || !currentPrice) {
    return res.status(400).json({
      success: false,
      message: 'Missing required parameters'
    });
  }

  const margin = riskService.calculateMargin(lotSize, contractSize, leverage, currentPrice);

  res.json({
    success: true,
    margin
  });
});

// @desc    Calculate risk/reward ratio
// @route   POST /api/risk/risk-reward
// @access  Private
export const calculateRiskReward = asyncHandler(async (req, res) => {
  const { entryPrice, stopLoss, takeProfit, tradeType } = req.body;

  if (!entryPrice || !stopLoss || !takeProfit || !tradeType) {
    return res.status(400).json({
      success: false,
      message: 'Missing required parameters'
    });
  }

  const result = riskService.calculateRiskReward(entryPrice, stopLoss, takeProfit, tradeType);

  if (!result) {
    return res.status(400).json({
      success: false,
      message: 'Invalid parameters for risk/reward calculation'
    });
  }

  res.json({
    success: true,
    ...result
  });
});

// @desc    Get account exposure
// @route   GET /api/risk/exposure
// @access  Private
export const getAccountExposure = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { accountId } = req.query;

  const exposure = await riskService.getAccountExposure(userId, accountId || null);

  res.json({
    success: true,
    exposure
  });
});

// @desc    Get risk metrics
// @route   GET /api/risk/metrics
// @access  Private
export const getRiskMetrics = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { timeRange = '30' } = req.query;

  const metrics = await riskService.getRiskMetrics(userId, timeRange);

  res.json({
    success: true,
    metrics
  });
});

// @desc    Get comprehensive risk analysis
// @route   GET /api/risk/analysis
// @access  Private
export const getRiskAnalysis = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { accountId, timeRange = '30' } = req.query;

  const [exposure, metrics] = await Promise.all([
    riskService.getAccountExposure(userId, accountId || null),
    riskService.getRiskMetrics(userId, timeRange)
  ]);

  // Risk assessment
  const riskAssessment = {
    level: 'Low',
    warnings: [],
    recommendations: []
  };

  if (exposure.marginLevel < 100) {
    riskAssessment.level = 'Critical';
    riskAssessment.warnings.push('Margin level is below 100%. Risk of margin call.');
    riskAssessment.recommendations.push('Reduce open positions or add funds to account');
  } else if (exposure.marginLevel < 150) {
    riskAssessment.level = 'High';
    riskAssessment.warnings.push('Margin level is below 150%. High risk.');
    riskAssessment.recommendations.push('Consider reducing position sizes');
  } else if (exposure.marginLevel < 200) {
    riskAssessment.level = 'Medium';
    riskAssessment.recommendations.push('Monitor margin level closely');
  }

  if (metrics.riskToEquityRatio > 50) {
    riskAssessment.level = riskAssessment.level === 'Critical' ? 'Critical' : 'High';
    riskAssessment.warnings.push('Risk to equity ratio is above 50%');
    riskAssessment.recommendations.push('Reduce overall exposure');
  }

  if (metrics.maxDrawdown > metrics.totalEquity * 0.2) {
    riskAssessment.warnings.push('Maximum drawdown exceeds 20% of equity');
    riskAssessment.recommendations.push('Review risk management strategy');
  }

  res.json({
    success: true,
    exposure,
    metrics,
    riskAssessment
  });
});

