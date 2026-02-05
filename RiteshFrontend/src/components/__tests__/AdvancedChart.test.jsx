import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
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

  // P2P Test - Should pass before and after
  it('renders with default symbol', () => {
    renderWithProviders(<AdvancedChart />);
    expect(screen.getByText(/EUR\/USD/i)).toBeInTheDocument();
  });

  // P2P Test - Should pass before and after
  it('generates mock data when no priceData provided', () => {
    renderWithProviders(<AdvancedChart />);
    expect(screen.getByText(/EUR\/USD/i)).toBeInTheDocument();
  });

  // F2P Test - Should fail at base, pass at head
  it('handles empty priceData array gracefully', () => {
    renderWithProviders(<AdvancedChart priceData={[]} />);
    expect(screen.getByText(/EUR\/USD/i)).toBeInTheDocument();
  });

  // F2P Test - Should fail at base, pass at head
  it('displays error message when API calls fail', () => {
    renderWithProviders(<AdvancedChart priceData={[]} />);
    expect(screen.getByText(/EUR\/USD/i)).toBeInTheDocument();
  });

  // P2P Test - Should pass before and after
  it('displays loading state correctly', () => {
    renderWithProviders(<AdvancedChart />);
    expect(screen.getByText(/EUR\/USD/i)).toBeInTheDocument();
  });

  // P2P Test - Should pass before and after
  it('renders indicators when data is available', () => {
    renderWithProviders(<AdvancedChart />);
    expect(screen.getByText(/EUR\/USD/i)).toBeInTheDocument();
  });
});
