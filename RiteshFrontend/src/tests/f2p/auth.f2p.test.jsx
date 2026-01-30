/**
 * F2P (Frontend-to-Production) Authentication Tests
 * Tests critical authentication flows from user perspective
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AuthPage from '../pages/AuthPage';

// Test wrapper for React Query and Router
const TestWrapper = ({ children }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>{children}</BrowserRouter>
    </QueryClientProvider>
  );
};

describe('F2P Authentication Flows', () => {
  let user;

  beforeEach(() => {
    user = userEvent.setup();
    // Mock fetch for API calls
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('User Registration Flow', () => {
    it('should successfully register a new user with valid data', async () => {
      // Mock successful registration response
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          message: 'User registered successfully',
          user: { id: '123', email: 'test@example.com' }
        })
      });

      render(
        <TestWrapper>
          <AuthPage mode="register" />
        </TestWrapper>
      );

      // Fill registration form
      await user.type(screen.getByLabelText(/email/i), 'test@example.com');
      await user.type(screen.getByLabelText(/^password/i), 'SecurePass123!');
      await user.type(screen.getByLabelText(/confirm password/i), 'SecurePass123!');
      await user.selectOptions(screen.getByRole('combobox', { name: /account type/i }), 'individual');
      
      // Submit form
      await user.click(screen.getByRole('button', { name: /register/i }));

      // Verify success
      await waitFor(() => {
        expect(screen.getByText(/registration successful/i)).toBeInTheDocument();
      });

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/auth/register'),
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json'
          }),
          body: expect.stringContaining('test@example.com')
        })
      );
    });

    it('should show validation errors for invalid registration data', async () => {
      render(
        <TestWrapper>
          <AuthPage mode="register" />
        </TestWrapper>
      );

      // Submit empty form
      await user.click(screen.getByRole('button', { name: /register/i }));

      // Check for validation errors
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    });

    it('should handle registration server errors gracefully', async () => {
      // Mock server error
      fetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({
          success: false,
          message: 'Email already exists'
        })
      });

      render(
        <TestWrapper>
          <AuthPage mode="register" />
        </TestWrapper>
      );

      await user.type(screen.getByLabelText(/email/i), 'existing@example.com');
      await user.type(screen.getByLabelText(/^password/i), 'SecurePass123!');
      await user.type(screen.getByLabelText(/confirm password/i), 'SecurePass123!');
      await user.selectOptions(screen.getByRole('combobox', { name: /account type/i }), 'individual');
      
      await user.click(screen.getByRole('button', { name: /register/i }));

      await waitFor(() => {
        expect(screen.getByText(/email already exists/i)).toBeInTheDocument();
      });
    });
  });

  describe('User Login Flow', () => {
    it('should successfully login with valid credentials', async () => {
      // Mock successful login response
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          token: 'mock-jwt-token',
          user: { id: '123', email: 'test@example.com', name: 'Test User' }
        })
      });

      render(
        <TestWrapper>
          <AuthPage mode="login" />
        </TestWrapper>
      );

      // Fill login form
      await user.type(screen.getByLabelText(/email/i), 'test@example.com');
      await user.type(screen.getByLabelText(/password/i), 'SecurePass123!');
      
      // Submit form
      await user.click(screen.getByRole('button', { name: /login/i }));

      // Verify successful login
      await waitFor(() => {
        expect(screen.getByText(/welcome back/i)).toBeInTheDocument();
      });

      // Verify token is stored
      expect(localStorage.getItem('token')).toBe('mock-jwt-token');
    });

    it('should show error for invalid credentials', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({
          success: false,
          message: 'Invalid email or password'
        })
      });

      render(
        <TestWrapper>
          <AuthPage mode="login" />
        </TestWrapper>
      );

      await user.type(screen.getByLabelText(/email/i), 'test@example.com');
      await user.type(screen.getByLabelText(/password/i), 'wrongpassword');
      
      await user.click(screen.getByRole('button', { name: /login/i }));

      await waitFor(() => {
        expect(screen.getByText(/invalid email or password/i)).toBeInTheDocument();
      });
    });
  });

  describe('Password Reset Flow', () => {
    it('should send password reset email', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          message: 'Password reset email sent'
        })
      });

      render(
        <TestWrapper>
          <AuthPage mode="forgot" />
        </TestWrapper>
      );

      await user.type(screen.getByLabelText(/email/i), 'test@example.com');
      await user.click(screen.getByRole('button', { name: /send reset email/i }));

      await waitFor(() => {
        expect(screen.getByText(/reset email sent/i)).toBeInTheDocument();
      });
    });
  });

  describe('Session Management', () => {
    it('should handle token expiration', async () => {
      // Mock expired token scenario
      fetch.mockRejectedValueOnce(new Error('Token expired'));

      // Set up expired token in localStorage
      localStorage.setItem('token', 'expired-token');

      render(
        <TestWrapper>
          <AuthPage mode="login" />
        </TestWrapper>
      );

      // Should redirect to login and clear token
      await waitFor(() => {
        expect(localStorage.getItem('token')).toBeNull();
        expect(screen.getByText(/login/i)).toBeInTheDocument();
      });
    });
  });
});
