import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import AccountDetailsPage from '../AccountDetailsPage';
import { renderWithProviders } from '../../test/utils/testUtils';
import { createMockAccount } from '../../test/utils/mockData';

describe('AccountDetailsPage Component', () => {
  const defaultProps = {
    account: createMockAccount(),
    onBack: vi.fn(),
    userEmail: 'test@example.com',
    onSignOut: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders account details page', () => {
    renderWithProviders(<AccountDetailsPage {...defaultProps} />);
    expect(screen.getByText(/account details|account number/i)).toBeInTheDocument();
  });

  it('displays account information', () => {
    renderWithProviders(<AccountDetailsPage {...defaultProps} />);
    expect(screen.getAllByText(/balance|equity|margin/i).length).toBeGreaterThan(0);
  });
});

