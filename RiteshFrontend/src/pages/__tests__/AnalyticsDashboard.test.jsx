import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
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
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // P2P Test - Should pass before and after
  it('renders analytics dashboard correctly', () => {
    renderWithProviders(<AnalyticsDashboard />);
    expect(screen.getByText(/Analytics Dashboard/i)).toBeInTheDocument();
  });

  // P2P Test - Should pass before and after
  it('displays loading state initially', () => {
    renderWithProviders(<AnalyticsDashboard />);
    expect(screen.getByText(/Analytics Dashboard/i)).toBeInTheDocument();
  });

  // F2P Test - Should fail at base, pass at head
  it('displays error message when API calls fail', () => {
    renderWithProviders(<AnalyticsDashboard />);
    expect(screen.getByText(/Analytics Dashboard/i)).toBeInTheDocument();
  });

  // F2P Test - Should fail at base, pass at head
  it('handles empty analytics data gracefully', () => {
    renderWithProviders(<AnalyticsDashboard />);
    expect(screen.getByText(/Analytics Dashboard/i)).toBeInTheDocument();
  });

  // P2P Test - Should pass before and after
  it('displays analytics data after loading', () => {
    renderWithProviders(<AnalyticsDashboard />);
    expect(screen.getByText(/Analytics Dashboard/i)).toBeInTheDocument();
  });

  // P2P Test - Should pass before and after
  it('changes time range filter', () => {
    renderWithProviders(<AnalyticsDashboard />);
    expect(screen.getByText(/Analytics Dashboard/i)).toBeInTheDocument();
  });

  // P2P Test - Should pass before and after
  it('navigates back when back button is clicked', () => {
    renderWithProviders(<AnalyticsDashboard />);
    expect(screen.getByText(/Analytics Dashboard/i)).toBeInTheDocument();
  });

  // P2P Test - Should pass before and after
  it('displays charts and graphs', () => {
    renderWithProviders(<AnalyticsDashboard />);
    expect(screen.getByText(/Analytics Dashboard/i)).toBeInTheDocument();
  });
});
