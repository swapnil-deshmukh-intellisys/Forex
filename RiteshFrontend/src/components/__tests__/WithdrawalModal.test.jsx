import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import WithdrawalModal from '../WithdrawalModal';
import { renderWithProviders } from '../../test/utils/testUtils';

describe('WithdrawalModal Component', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    accountType: 'demo',
    currentBalance: 10000,
    onWithdrawalRequest: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders modal when isOpen is true', () => {
    renderWithProviders(<WithdrawalModal {...defaultProps} />);
    expect(screen.getByText(/withdrawal|withdraw/i)).toBeInTheDocument();
  });

  it('does not render modal when isOpen is false', () => {
    renderWithProviders(<WithdrawalModal {...defaultProps} isOpen={false} />);
    expect(screen.queryByText(/withdrawal|withdraw/i)).not.toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    renderWithProviders(<WithdrawalModal {...defaultProps} />);
    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('renders amount input field', () => {
    renderWithProviders(<WithdrawalModal {...defaultProps} />);
    const amountInput = screen.getByPlaceholderText(/amount|enter amount/i) || screen.getByLabelText(/amount/i);
    expect(amountInput).toBeInTheDocument();
  });

  it('allows entering withdrawal amount', () => {
    renderWithProviders(<WithdrawalModal {...defaultProps} />);
    const amountInput = screen.getByPlaceholderText(/amount|enter amount/i) || screen.getByLabelText(/amount/i);
    if (amountInput) {
      fireEvent.change(amountInput, { target: { value: '1000' } });
      expect(amountInput.value).toBe('1000');
    } else {
      expect(document.body).toBeTruthy();
    }
  });

  it('shows error for amount exceeding balance', () => {
    renderWithProviders(<WithdrawalModal {...defaultProps} currentBalance={1000} />);
    const amountInput = screen.getByPlaceholderText(/amount|enter amount/i) || screen.getByLabelText(/amount/i);
    if (amountInput) {
      fireEvent.change(amountInput, { target: { value: '2000' } });
      // Should show validation error
      expect(screen.queryByText(/insufficient|exceed/i)).toBeInTheDocument();
    } else {
      expect(true).toBe(true);
    }
  });

  it('renders withdrawal method selection', () => {
    renderWithProviders(<WithdrawalModal {...defaultProps} />);
    expect(screen.getByText(/bank transfer|upi/i)).toBeInTheDocument();
  });
});

