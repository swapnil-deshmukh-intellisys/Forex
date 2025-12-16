import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ForgotPasswordModal from '../ForgotPasswordModal';
import { renderWithProviders } from '../../test/utils/testUtils';
import * as api from '../../services/api';

// Mock the API
vi.mock('../../services/api', () => ({
  authAPI: {
    forgotPassword: vi.fn(),
    verifyOTP: vi.fn(),
    resetPassword: vi.fn(),
  },
}));

describe('ForgotPasswordModal Component', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders modal when isOpen is true', () => {
    renderWithProviders(<ForgotPasswordModal {...defaultProps} />);
    expect(screen.getByText(/forgot password|reset password/i)).toBeInTheDocument();
  });

  it('does not render modal when isOpen is false', () => {
    renderWithProviders(<ForgotPasswordModal {...defaultProps} isOpen={false} />);
    expect(screen.queryByText(/forgot password|reset password/i)).not.toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    renderWithProviders(<ForgotPasswordModal {...defaultProps} />);
    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('renders email input field', () => {
    renderWithProviders(<ForgotPasswordModal {...defaultProps} />);
    const emailInput = screen.getByLabelText(/email/i);
    expect(emailInput).toBeInTheDocument();
  });

  it('allows entering email address', () => {
    renderWithProviders(<ForgotPasswordModal {...defaultProps} />);
    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    expect(emailInput.value).toBe('test@example.com');
  });

  it('calls forgotPassword API when form is submitted', async () => {
    api.authAPI.forgotPassword.mockResolvedValue({ success: true });
    
    renderWithProviders(<ForgotPasswordModal {...defaultProps} />);
    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    
    const submitButton = screen.getByRole('button', { name: /send|submit/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(api.authAPI.forgotPassword).toHaveBeenCalledWith('test@example.com');
    });
  });

  it('shows error message when API call fails', async () => {
    api.authAPI.forgotPassword.mockRejectedValue(new Error('API Error'));
    
    renderWithProviders(<ForgotPasswordModal {...defaultProps} />);
    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    
    const submitButton = screen.getByRole('button', { name: /send|submit/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/error|failed/i)).toBeInTheDocument();
    });
  });
});

