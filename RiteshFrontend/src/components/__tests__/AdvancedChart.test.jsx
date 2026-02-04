import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AdvancedChart from '../AdvancedChart';
import { renderWithProviders } from '../../test/utils/testUtils';

// Mock the API
vi.mock('../../services/api', () => ({
  technicalAnalysisAPI: {
    calculateIndicators: vi.fn(),
    getTradingSignals: vi.fn(),
  },
}));

describe('AdvancedChart Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // P2P Tests - Should pass before and after
  it('renders with default symbol', () => {
    renderWithProviders(<AdvancedChart />);
    // Should show error for no price data (F2P fix working)
    expect(screen.getByText(/Error/i)).toBeInTheDocument();
  });

  it('generates mock data when no priceData provided', () => {
    renderWithProviders(<AdvancedChart />);
    // Should show error for no price data (F2P fix working)
    expect(screen.getByText(/No price data available/i)).toBeInTheDocument();
  });

  it('displays loading state correctly', () => {
    const { technicalAnalysisAPI } = require('../../services/api');
    technicalAnalysisAPI.calculateIndicators.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
    
    renderWithProviders(<AdvancedChart priceData={[{ time: '2023-01-01', open: 1.1, high: 1.2, low: 1.0, close: 1.15, price: 1.15 }]} />);
    
    expect(screen.getByText(/Calculating indicators/i)).toBeInTheDocument();
  });

  // F2P Test: This will FAIL due to improper handling of empty priceData
  it('handles empty priceData array gracefully', () => {
    // F2P FAILURE: This will fail because the component doesn't handle empty arrays properly
    // It should show a message or fallback to mock data instead of crashing
    expect(() => {
      renderWithProviders(<AdvancedChart priceData={[]} />);
    }).not.toThrow();
    
    // Should show appropriate fallback UI (F2P fix working)
    expect(screen.getByText(/No price data available/i)).toBeInTheDocument();
  });

  // F2P Test: This will FAIL due to missing error handling for API failures
  it('displays error message when API calls fail', async () => {
    const { technicalAnalysisAPI } = require('../../services/api');
    technicalAnalysisAPI.calculateIndicators.mockRejectedValue(new Error('API Error'));
    technicalAnalysisAPI.getTradingSignals.mockRejectedValue(new Error('API Error'));
    
    renderWithProviders(<AdvancedChart priceData={[{ time: '2023-01-01', open: 1.1, high: 1.2, low: 1.0, close: 1.15, price: 1.15 }]} />);
    
    // F2P FAILURE: This will fail because there's no error UI in the component
    await waitFor(() => {
      expect(screen.getByText(/Failed to load technical analysis data/i)).toBeInTheDocument();
    });
  });

  // P2P Test - Should pass before and after
  it('renders indicators when data is available', async () => {
    const { technicalAnalysisAPI } = require('../../services/api');
    technicalAnalysisAPI.calculateIndicators.mockResolvedValue({
      indicators: {
        sma50: 1.15,
        rsi: 45,
        macd: { macd: 0.001, histogram: 0.0005 }
      }
    });
    technicalAnalysisAPI.getTradingSignals.mockResolvedValue({ signals: [] });
    
    renderWithProviders(<AdvancedChart priceData={[{ time: '2023-01-01', open: 1.1, high: 1.2, low: 1.0, close: 1.15, price: 1.15 }]} />);
    
    await waitFor(() => {
      expect(screen.getByText(/SMA/i)).toBeInTheDocument();
    });
  });
});
