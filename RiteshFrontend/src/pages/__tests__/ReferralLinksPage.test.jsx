import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ReferralLinksPage from '../ReferralLinksPage';
import { renderWithProviders } from '../../test/utils/testUtils';
import { createMockUser } from '../../test/utils/mockData';

describe('ReferralLinksPage Component', () => {
  const defaultProps = {
    userEmail: 'test@example.com',
    onSignOut: vi.fn(),
    onBack: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.setItem('token', 'mock-token');
    sessionStorage.setItem('user', JSON.stringify(createMockUser()));
  });

  it('renders referral links page', () => {
    renderWithProviders(<ReferralLinksPage {...defaultProps} />);
    expect(screen.getByText(/referral|referral links/i)).toBeInTheDocument();
  });

  it('renders create referral link button', () => {
    renderWithProviders(<ReferralLinksPage {...defaultProps} />);
    const createButton = screen.getByRole('button', { name: /create|new referral/i });
    expect(createButton).toBeInTheDocument();
  });
});

