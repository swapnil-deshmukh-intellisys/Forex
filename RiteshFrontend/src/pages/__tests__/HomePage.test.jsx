import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import HomePage from '../HomePage';
import { renderWithProviders } from '../../test/utils/testUtils';
import * as api from '../../services/api';

vi.mock('../../services/api', () => ({
  referralAPI: {
    validateReferralCode: vi.fn(),
    trackVisitor: vi.fn(),
  },
}));

describe('HomePage Component', () => {
  const defaultProps = {
    onSignUpClick: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders homepage content', () => {
    renderWithProviders(<HomePage {...defaultProps} />);
    expect(screen.getByText(/forex|trading|welcome/i)).toBeInTheDocument();
  });

  it('calls onSignUpClick when sign up button is clicked', () => {
    renderWithProviders(<HomePage {...defaultProps} />);
    const signUpButton = screen.getByRole('button', { name: /sign up|get started/i });
    fireEvent.click(signUpButton);
    expect(defaultProps.onSignUpClick).toHaveBeenCalledTimes(1);
  });

  it('renders features section', () => {
    renderWithProviders(<HomePage {...defaultProps} />);
    expect(screen.getByText(/ultra-low|spreads|instruments/i)).toBeInTheDocument();
  });

  it('renders trading widgets', () => {
    renderWithProviders(<HomePage {...defaultProps} />);
    // MiniChartUsd and MiniChartGold should be rendered
    expect(document.querySelector('.tradingview-widget-container')).toBeInTheDocument();
  });
});

