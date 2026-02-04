import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import AccountDetailsPage from '../AccountDetailsPage';
import { renderWithProviders } from '../../test/utils/testUtils';
import { createMockAccount } from '../../test/utils/mockData';

// Mock API modules
vi.mock('../../services/api', () => ({
  accountAPI: {
    getAccountDetails: vi.fn(() => Promise.resolve({ success: true, account: {} }))
  },
  depositAPI: {
    getDepositRequests: vi.fn(() => Promise.resolve({ success: true, depositRequests: [] }))
  },
  withdrawalAPI: {
    getWithdrawalRequests: vi.fn(() => Promise.resolve({ success: true, withdrawalRequests: [] }))
  }
}));

describe('AccountDetailsPage Component', () => {
  const defaultProps = {
    account: createMockAccount(),
    onBack: vi.fn(),
    userEmail: 'test@example.com',
    onSignOut: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('renders account details page', () => {
    renderWithProviders(<AccountDetailsPage {...defaultProps} />);
    // Check for Balance text which is displayed prominently
    expect(screen.getByText(/balance/i)).toBeInTheDocument();
  });

  it('displays account information', () => {
    renderWithProviders(<AccountDetailsPage {...defaultProps} />);
    expect(screen.getAllByText(/balance|equity|margin/i).length).toBeGreaterThan(0);
  });
});

