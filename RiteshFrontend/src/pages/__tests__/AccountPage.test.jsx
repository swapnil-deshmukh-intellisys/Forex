import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import AccountPage from '../AccountPage';
import { renderWithProviders } from '../../test/utils/testUtils';
import { createMockUser, createMockAccount } from '../../test/utils/mockData';

describe('AccountPage Component', () => {
  const defaultProps = {
    userEmail: 'test@example.com',
    onSignOut: vi.fn(),
    onProfileClick: vi.fn(),
    onBack: vi.fn(),
    onShowAccountDetails: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
    const mockUser = createMockUser();
    sessionStorage.setItem('token', 'mock-token');
    sessionStorage.setItem('user', JSON.stringify(mockUser));
  });

  it('renders account page when authenticated', () => {
    renderWithProviders(<AccountPage {...defaultProps} />);
    expect(screen.getAllByText(/account|accounts/i).length).toBeGreaterThan(0);
  });

  it('redirects to sign in when not authenticated', () => {
    sessionStorage.clear();
    renderWithProviders(<AccountPage {...defaultProps} />);
    expect(defaultProps.onBack).toHaveBeenCalled();
  });

  it('renders account tabs', () => {
    renderWithProviders(<AccountPage {...defaultProps} />);
    expect(screen.getAllByText(/live|demo/i).length).toBeGreaterThan(0);
  });
});

