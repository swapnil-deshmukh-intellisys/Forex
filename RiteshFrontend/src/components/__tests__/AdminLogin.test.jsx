import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AdminLogin from '../AdminLogin';
import { renderWithProviders } from '../../test/utils/testUtils';
import * as api from '../../services/api';

// Mock the API
vi.mock('../../services/api', () => ({
  authAPI: {
    adminLogin: vi.fn(),
  },
}));

describe('AdminLogin Component', () => {
  const defaultProps = {
    onAdminLogin: vi.fn(),
    onBack: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
  });

  it('renders admin login form', () => {
    renderWithProviders(<AdminLogin {...defaultProps} />);
    expect(screen.getByText(/admin login|sign in/i)).toBeInTheDocument();
  });

  it('renders email input field', () => {
    renderWithProviders(<AdminLogin {...defaultProps} />);
    const emailInput = screen.getByLabelText(/email/i);
    expect(emailInput).toBeInTheDocument();
  });

  it('renders password input field', () => {
    renderWithProviders(<AdminLogin {...defaultProps} />);
    const passwordInput = screen.getByLabelText(/password/i);
    expect(passwordInput).toBeInTheDocument();
  });

  it('allows entering email and password', () => {
    renderWithProviders(<AdminLogin {...defaultProps} />);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    
    fireEvent.change(emailInput, { target: { value: 'admin@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    
    expect(emailInput.value).toBe('admin@example.com');
    expect(passwordInput.value).toBe('password123');
  });

  it('calls adminLogin API when form is submitted', async () => {
    const mockResponse = {
      success: true,
      token: 'mock-token',
      user: { email: 'admin@example.com', fullName: 'Admin User', id: '123' },
    };
    api.authAPI.adminLogin.mockResolvedValue(mockResponse);
    
    renderWithProviders(<AdminLogin {...defaultProps} />);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    
    fireEvent.change(emailInput, { target: { value: 'admin@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    
    const submitButton = screen.getByRole('button', { name: /login|sign in/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(api.authAPI.adminLogin).toHaveBeenCalledWith('admin@example.com', 'password123');
    });
  });

  it('calls onAdminLogin when login is successful', async () => {
    const mockResponse = {
      success: true,
      token: 'mock-token',
      user: { email: 'admin@example.com', fullName: 'Admin User', id: '123' },
    };
    api.authAPI.adminLogin.mockResolvedValue(mockResponse);
    
    renderWithProviders(<AdminLogin {...defaultProps} />);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    
    fireEvent.change(emailInput, { target: { value: 'admin@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    
    const submitButton = screen.getByRole('button', { name: /login|sign in/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(defaultProps.onAdminLogin).toHaveBeenCalledWith('admin@example.com');
    });
  });

  it('shows error message when login fails', async () => {
    api.authAPI.adminLogin.mockResolvedValue({ success: false, message: 'Invalid credentials' });
    
    renderWithProviders(<AdminLogin {...defaultProps} />);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    
    fireEvent.change(emailInput, { target: { value: 'admin@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
    
    const submitButton = screen.getByRole('button', { name: /login|sign in/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/invalid|error|failed/i)).toBeInTheDocument();
    });
  });

  it('calls onBack when back button is clicked', () => {
    renderWithProviders(<AdminLogin {...defaultProps} />);
    const backButton = screen.getByRole('button', { name: /back/i });
    fireEvent.click(backButton);
    expect(defaultProps.onBack).toHaveBeenCalledTimes(1);
  });
});

