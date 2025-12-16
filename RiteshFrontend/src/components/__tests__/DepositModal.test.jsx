import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import DepositModal from '../DepositModal';
import { renderWithProviders } from '../../test/utils/testUtils';

describe('DepositModal Component', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    accountType: 'demo',
    onDepositRequest: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders modal when isOpen is true', () => {
    renderWithProviders(<DepositModal {...defaultProps} />);
    expect(screen.getByText(/deposit/i)).toBeInTheDocument();
  });

  it('does not render modal when isOpen is false', () => {
    renderWithProviders(<DepositModal {...defaultProps} isOpen={false} />);
    expect(screen.queryByText(/deposit/i)).not.toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    renderWithProviders(<DepositModal {...defaultProps} />);
    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('renders amount input field', () => {
    renderWithProviders(<DepositModal {...defaultProps} />);
    const amountInput = screen.getByLabelText(/amount/i);
    expect(amountInput).toBeInTheDocument();
  });

  it('allows entering deposit amount', () => {
    renderWithProviders(<DepositModal {...defaultProps} />);
    const amountInput = screen.getByLabelText(/amount/i);
    fireEvent.change(amountInput, { target: { value: '1000' } });
    expect(amountInput.value).toBe('1000');
  });

  it('shows error for invalid amount', () => {
    renderWithProviders(<DepositModal {...defaultProps} />);
    const amountInput = screen.getByLabelText(/amount/i);
    fireEvent.change(amountInput, { target: { value: '0' } });
    const submitButton = screen.getByRole('button', { name: /continue|next/i });
    fireEvent.click(submitButton);
    // Should show validation error
    expect(screen.queryByText(/invalid|minimum/i)).toBeInTheDocument();
  });

  it('renders UPI selection step after entering amount', () => {
    renderWithProviders(<DepositModal {...defaultProps} />);
    const amountInput = screen.getByLabelText(/amount/i);
    fireEvent.change(amountInput, { target: { value: '1000' } });
    const submitButton = screen.getByRole('button', { name: /continue|next/i });
    fireEvent.click(submitButton);
    
    // Should show UPI apps
    expect(screen.getByText(/phonepe|google pay|paytm/i)).toBeInTheDocument();
  });
});

