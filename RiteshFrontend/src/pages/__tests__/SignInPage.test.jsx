import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SignInPage from '../SignInPage';
import { renderWithProviders } from '../../test/utils/testUtils';
import * as api from '../../services/api';

vi.mock('../../services/api', () => ({
  authAPI: {
    login: vi.fn(),
  },
}));

describe('SignInPage Component', () => {
  const defaultProps = {
    onSignIn: vi.fn(),
    onSignUpClick: vi.fn(),
    onBack: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
  });

  it('renders sign in form', () => {
    renderWithProviders(<SignInPage {...defaultProps} />);
    expect(screen.getByText(/sign in|login/i)).toBeInTheDocument();
  });

  it('renders email input field', () => {
    renderWithProviders(<SignInPage {...defaultProps} />);
    const emailInput = screen.getByLabelText(/email/i);
    expect(emailInput).toBeInTheDocument();
  });

  it('renders password input field', () => {
    renderWithProviders(<SignInPage {...defaultProps} />);
    const passwordInput = screen.getByLabelText(/password/i);
    expect(passwordInput).toBeInTheDocument();
  });

  it('allows entering email and password', () => {
    renderWithProviders(<SignInPage {...defaultProps} />);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    
    expect(emailInput.value).toBe('test@example.com');
    expect(passwordInput.value).toBe('password123');
  });

  it('calls login API when form is submitted', async () => {
    const mockResponse = {
      success: true,
      token: 'mock-token',
      user: { email: 'test@example.com', name: 'Test User' },
    };
    api.authAPI.login.mockResolvedValue(mockResponse);
    
    renderWithProviders(<SignInPage {...defaultProps} />);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    
    const submitButton = screen.getByRole('button', { name: /sign in|login/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(api.authAPI.login).toHaveBeenCalledWith('test@example.com', 'password123');
    });
  });

  it('calls onSignIn when login is successful', async () => {
    const mockResponse = {
      success: true,
      token: 'mock-token',
      user: { email: 'test@example.com', name: 'Test User' },
    };
    api.authAPI.login.mockResolvedValue(mockResponse);
    
    renderWithProviders(<SignInPage {...defaultProps} />);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    
    const submitButton = screen.getByRole('button', { name: /sign in|login/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(defaultProps.onSignIn).toHaveBeenCalledWith('test@example.com');
    });
  });

  it('shows error message when login fails', async () => {
    api.authAPI.login.mockRejectedValue(new Error('Invalid credentials'));
    
    renderWithProviders(<SignInPage {...defaultProps} />);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
    
    const submitButton = screen.getByRole('button', { name: /sign in|login/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/error|invalid|failed/i)).toBeInTheDocument();
    });
  });

  it('calls onSignUpClick when sign up link is clicked', () => {
    renderWithProviders(<SignInPage {...defaultProps} />);
    const signUpLink = screen.getByText(/sign up|create account/i);
    fireEvent.click(signUpLink);
    expect(defaultProps.onSignUpClick).toHaveBeenCalledTimes(1);
  });

  it('calls onBack when back button is clicked', () => {
    renderWithProviders(<SignInPage {...defaultProps} />);
    const backButton = screen.getByRole('button', { name: /back/i });
    fireEvent.click(backButton);
    expect(defaultProps.onBack).toHaveBeenCalledTimes(1);
  });
});

