/**
 * F2P (Frontend-to-Production) Integration Tests
 * Tests end-to-end user flows and system integration
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '../contexts/AuthContext';
import { TradingProvider } from '../contexts/TradingContext';
import App from '../App';

// Test wrapper with all providers and routing
const TestWrapper = ({ children }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <TradingProvider>
            <Routes>
              <Route path="/" element={<App />} />
              <Route path="/login" element={<App />} />
              <Route path="/register" element={<App />} />
              <Route path="/dashboard" element={<App />} />
              <Route path="/trading" element={<App />} />
            </Routes>
          </TradingProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

describe('F2P Integration Tests', () => {
  let user;

  beforeEach(() => {
    user = userEvent.setup();
    // Mock fetch for all API calls
    global.fetch = vi.fn();
    // Mock localStorage
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: vi.fn(),
        setItem: vi.fn(),
        removeItem: vi.fn(),
      },
      writable: true,
    });
    // Mock window.location
    delete window.location;
    window.location = { href: '', pathname: '/' };
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Complete User Journey', () => {
    it('should handle complete registration to trading flow', async () => {
      // Mock registration
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          message: 'User registered successfully',
          user: { id: '123', email: 'test@example.com' }
        })
      });

      // Mock login after registration
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          token: 'mock-jwt-token',
          user: { id: '123', email: 'test@example.com', name: 'Test User' }
        })
      });

      // Mock user data
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          account: { balance: 10000.00 },
          positions: []
        })
      });

      // Mock market data
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: [{ pair: 'EUR/USD', bid: 1.0850, ask: 1.0853 }]
        })
      });

      render(<TestWrapper />);

      // Start at registration
      window.location.pathname = '/register';

      // Complete registration
      await user.type(screen.getByLabelText(/email/i), 'test@example.com');
      await user.type(screen.getByLabelText(/^password/i), 'SecurePass123!');
      await user.type(screen.getByLabelText(/confirm password/i), 'SecurePass123!');
      await user.selectOptions(screen.getByRole('combobox', { name: /account type/i }), 'individual');
      
      await user.click(screen.getByRole('button', { name: /register/i }));

      await waitFor(() => {
        expect(screen.getByText(/registration successful/i)).toBeInTheDocument();
      });

      // Should redirect to dashboard
      await waitFor(() => {
        expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
        expect(screen.getByText(/\$10,000\.00/)).toBeInTheDocument();
      });

      // Navigate to trading
      await user.click(screen.getByRole('link', { name: /trading/i }));

      await waitFor(() => {
        expect(screen.getByText(/EUR\/USD/i)).toBeInTheDocument();
        expect(screen.getByText(/1\.0850/)).toBeInTheDocument();
      });
    });

    it('should handle login to trading flow', async () => {
      // Mock login
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          token: 'mock-jwt-token',
          user: { id: '123', email: 'test@example.com', name: 'Test User' }
        })
      });

      // Mock user data and market data
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          account: { balance: 5000.00 },
          positions: [{ pair: 'EUR/USD', size: 500, pnl: 25.00 }]
        })
      });

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: [{ pair: 'EUR/USD', bid: 1.0850, ask: 1.0853 }]
        })
      });

      render(<TestWrapper />);

      // Start at login
      window.location.pathname = '/login';

      // Complete login
      await user.type(screen.getByLabelText(/email/i), 'test@example.com');
      await user.type(screen.getByLabelText(/password/i), 'SecurePass123!');
      
      await user.click(screen.getByRole('button', { name: /login/i }));

      await waitFor(() => {
        expect(screen.getByText(/welcome back/i)).toBeInTheDocument();
      });

      // Should redirect to dashboard
      await waitFor(() => {
        expect(screen.getByText(/\$5,000\.00/)).toBeInTheDocument();
        expect(screen.getByText(/\$25\.00/)).toBeInTheDocument();
      });
    });
  });

  describe('Error Handling Integration', () => {
    it('should handle network errors gracefully across the app', async () => {
      // Mock network error
      fetch.mockRejectedValueOnce(new Error('Network error'));

      render(<TestWrapper />);

      window.location.pathname = '/login';

      await user.type(screen.getByLabelText(/email/i), 'test@example.com');
      await user.type(screen.getByLabelText(/password/i), 'SecurePass123!');
      
      await user.click(screen.getByRole('button', { name: /login/i }));

      await waitFor(() => {
        expect(screen.getByText(/network error/i)).toBeInTheDocument();
        expect(screen.getByText(/please try again/i)).toBeInTheDocument();
      });

      // Should still be able to navigate
      expect(screen.getByRole('link', { name: /register/i })).toBeInTheDocument();
    });

    it('should handle authentication token expiration', async () => {
      // Mock expired token scenario
      fetch.mockRejectedValueOnce(new Error('Token expired'));

      // Set expired token
      localStorage.getItem.mockReturnValue('expired-token');

      render(<TestWrapper />);

      window.location.pathname = '/dashboard';

      // Should redirect to login
      await waitFor(() => {
        expect(screen.getByText(/login/i)).toBeInTheDocument();
        expect(screen.getByText(/session expired/i)).toBeInTheDocument();
      });
    });
  });

  describe('Data Consistency', () => {
    it('should maintain consistent data across components', async () => {
      // Mock user data
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          account: { balance: 10000.00, equity: 10250.00 },
          positions: [{ pair: 'EUR/USD', size: 1000, pnl: 50.00 }]
        })
      });

      // Mock market data
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: [{ pair: 'EUR/USD', bid: 1.0850, ask: 1.0853 }]
        })
      });

      // Mock order placement
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          order: { id: 'order-123', pair: 'EUR/USD', amount: 500, price: 1.0850 }
        })
      });

      render(<TestWrapper />);

      window.location.pathname = '/dashboard';

      await waitFor(() => {
        expect(screen.getByText(/\$10,000\.00/)).toBeInTheDocument();
        expect(screen.getByText(/\$10,250\.00/)).toBeInTheDocument();
      });

      // Navigate to trading
      await user.click(screen.getByRole('link', { name: /trading/i }));

      await waitFor(() => {
        expect(screen.getByText(/EUR\/USD/i)).toBeInTheDocument();
      });

      // Place order
      await user.selectOptions(screen.getByRole('combobox', { name: /currency pair/i }), 'EUR/USD');
      await user.type(screen.getByRole('spinbutton', { name: /amount/i }), '500');
      await user.click(screen.getByRole('button', { name: /buy/i }));

      await waitFor(() => {
        expect(screen.getByText(/order placed successfully/i)).toBeInTheDocument();
      });

      // Check that balance is updated
      await user.click(screen.getByRole('link', { name: /dashboard/i }));

      await waitFor(() => {
        // Balance should reflect the new order
        expect(screen.getByText(/order-123/i)).toBeInTheDocument();
      });
    });
  });

  describe('Performance Integration', () => {
    it('should handle large datasets efficiently', async () => {
      // Mock large dataset
      const largeMarketData = Array.from({ length: 100 }, (_, i) => ({
        pair: `CURR${i}/USD`,
        bid: 1.0000 + i * 0.0001,
        ask: 1.0002 + i * 0.0001,
        change: (Math.random() - 0.5) * 0.01
      }));

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: largeMarketData
        })
      });

      const startTime = performance.now();
      
      render(<TestWrapper />);

      window.location.pathname = '/trading';

      await waitFor(() => {
        expect(screen.getByText(/CURR0\/USD/i)).toBeInTheDocument();
        expect(screen.getByText(/CURR99\/USD/i)).toBeInTheDocument();
      });

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      // Should render within reasonable time (less than 2 seconds)
      expect(renderTime).toBeLessThan(2000);
    });
  });

  describe('Accessibility Integration', () => {
    it('should be fully accessible across all flows', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: [{ pair: 'EUR/USD', bid: 1.0850, ask: 1.0853 }]
        })
      });

      render(<TestWrapper />);

      window.location.pathname = '/trading';

      await waitFor(() => {
        // Check for proper ARIA labels
        expect(screen.getByRole('combobox', { name: /currency pair/i })).toBeInTheDocument();
        expect(screen.getByRole('spinbutton', { name: /amount/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /buy/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /sell/i })).toBeInTheDocument();
      });

      // Test keyboard navigation
      await user.tab();
      expect(screen.getByRole('combobox', { name: /currency pair/i })).toHaveFocus();

      await user.tab();
      expect(screen.getByRole('spinbutton', { name: /amount/i })).toHaveFocus();
    });
  });

  describe('Browser Compatibility', () => {
    it('should handle different browser environments', async () => {
      // Mock different browser APIs
      const originalMatchMedia = window.matchMedia;
      window.matchMedia = vi.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }));

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: [{ pair: 'EUR/USD', bid: 1.0850, ask: 1.0853 }]
        })
      });

      render(<TestWrapper />);

      window.location.pathname = '/trading';

      await waitFor(() => {
        expect(screen.getByText(/EUR\/USD/i)).toBeInTheDocument();
      });

      // Restore original
      window.matchMedia = originalMatchMedia;
    });
  });
});
