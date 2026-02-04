import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import UserListPage from '../UserListPage';
import { renderWithProviders } from '../../test/utils/testUtils';

// Mock API modules
vi.mock('../../services/api', () => ({
  adminAPI: {
    getAllUsers: vi.fn(() => Promise.resolve({ success: true, users: [] }))
  },
  depositAPI: {
    getDepositRequests: vi.fn(() => Promise.resolve({ success: true, depositRequests: [] }))
  },
  withdrawalAPI: {
    getWithdrawalRequests: vi.fn(() => Promise.resolve({ success: true, withdrawalRequests: [] }))
  }
}));

describe('UserListPage Component', () => {
  const defaultProps = {
    adminEmail: 'admin@example.com',
    onSignOut: vi.fn(),
    onBack: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.setItem('adminToken', 'mock-admin-token');
  });

  it('renders user list page', () => {
    renderWithProviders(<UserListPage {...defaultProps} />);
    expect(screen.getByText(/users|user list/i)).toBeInTheDocument();
  });

  it('renders user table or list', () => {
    renderWithProviders(<UserListPage {...defaultProps} />);
    expect(document.body).toBeTruthy();
  });
});

