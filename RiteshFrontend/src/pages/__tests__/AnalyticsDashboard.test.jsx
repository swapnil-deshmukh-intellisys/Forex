import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AnalyticsDashboard from '../AnalyticsDashboard';
import { renderWithProviders } from '../../test/utils/testUtils';

// Mock the API
vi.mock('../../services/api', () => ({
  accountAPI: {
    getAccounts: vi.fn(),
    getAccountAnalytics: vi.fn(),
  },
}));

describe('AnalyticsDashboard Component', () => {
  const mockProps = {
    userEmail: 'test@example.com',
    onBack: vi.fn(),
    onSignOut: vi.fn(),
    onProfileClick: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    const { accountAPI } = require('../../services/api');
    accountAPI.getAccounts.mockResolvedValue([
      { id: '1', name: 'Test Account', balance: 1000 }
    ]);
    accountAPI.getAccountAnalytics.mockResolvedValue({
      totalBalance: 1000,
      totalEquity: 950,
      totalProfit: 50,
      profitPercentage: 5,
      totalTrades: 10,
      winRate: 60,
      averageWin: 100,
      averageLoss: 50,
      riskRewardRatio: 2,
      monthlyGrowth: 5,
      weeklyGrowth: 2
    });
  });

  // P2P Tests - Should pass before and after
  it('renders analytics dashboard', () => {
    renderWithProviders(<AnalyticsDashboard {...mockProps} />);
    expect(screen.getByText(/Analytics Dashboard/i)).toBeInTheDocument();
  });

  it('displays loading state initially', () => {
    renderWithProviders(<AnalyticsDashboard {...mockProps} />);
    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
  });

  it('displays analytics data after loading', async () => {
    renderWithProviders(<AnalyticsDashboard {...mockProps} />);
    
    await waitFor(() => {
      expect(screen.getByText(/Total Balance/i)).toBeInTheDocument();
      expect(screen.getByText(/\$1000/)).toBeInTheDocument();
    });
  });

  // F2P Test: This will FAIL due to missing error handling for API failures
  it('displays error message when API calls fail', async () => {
    const { accountAPI } = require('../../services/api');
    accountAPI.getAccounts.mockRejectedValue(new Error('API Error'));
    
    renderWithProviders(<AnalyticsDashboard {...mockProps} />);
    
    // F2P FAILURE: This will fail because there's no error handling for API failures
    await waitFor(() => {
      expect(screen.getByText(/Failed to load analytics/i)).toBeInTheDocument();
    });
  });

  // F2P Test: This will FAIL due to missing validation for empty analytics data
  it('handles empty analytics data gracefully', async () => {
    const { accountAPI } = require('../../services/api');
    accountAPI.getAccounts.mockResolvedValue([]);
    accountAPI.getAccountAnalytics.mockResolvedValue({
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
    
    renderWithProviders(<AnalyticsDashboard {...mockProps} />);
    
    // F2P FAILURE: This will fail because there's no handling for zero/negative values
    await waitFor(() => {
      expect(screen.getByText(/No data available/i)).toBeInTheDocument();
    });
  });

  // P2P Test - Should pass before and after
  it('changes time range filter', async () => {
    renderWithProviders(<AnalyticsDashboard {...mockProps} />);
    
    const weekButton = screen.getByRole('button', { name: /week/i });
    fireEvent.click(weekButton);
    
    // Should refetch data with new time range
    await waitFor(() => {
      expect(screen.getByText(/Weekly Analytics/i)).toBeInTheDocument();
    });
  });

  // P2P Test - Should pass before and after
  it('navigates back when back button is clicked', () => {
    renderWithProviders(<AnalyticsDashboard {...mockProps} />);
    
    const backButton = screen.getByRole('button', { name: /back/i });
    fireEvent.click(backButton);
    
    expect(mockProps.onBack).toHaveBeenCalled();
  });

  // P2P Test - Should pass before and after
  it('displays charts and graphs', async () => {
    renderWithProviders(<AnalyticsDashboard {...mockProps} />);
    
    await waitFor(() => {
      expect(screen.getByText(/Profit Chart/i)).toBeInTheDocument();
      expect(screen.getByText(/Win Rate/i)).toBeInTheDocument();
    });
  });
});
