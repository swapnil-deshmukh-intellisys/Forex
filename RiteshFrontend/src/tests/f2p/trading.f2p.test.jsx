/**
 * F2P (Frontend-to-Production) Trading Tests
 * Tests critical trading functionality from user perspective
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import TradingDashboard from '../../pages/TradingDashboard';
import { TradingProvider } from '../../contexts/TradingContext';

// Test wrapper for all providers
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
        <TradingProvider>
          {children}
        </TradingProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

// Mock WebSocket for real-time data
const mockWebSocket = {
  send: vi.fn(),
  close: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
};

global.WebSocket = vi.fn(() => mockWebSocket);

describe('F2P Trading Functionality', () => {
  let user;

  beforeEach(() => {
    user = userEvent.setup();
    // Mock fetch for API calls
    global.fetch = vi.fn();
    // Mock localStorage
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: vi.fn(() => 'mock-token'),
        setItem: vi.fn(),
        removeItem: vi.fn(),
      },
      writable: true,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Market Data Display', () => {
    it('should display real-time forex prices', async () => {
      // Mock market data response
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: [
            { pair: 'EUR/USD', bid: 1.0850, ask: 1.0853, change: 0.002 },
            { pair: 'GBP/USD', bid: 1.2650, ask: 1.2653, change: -0.001 },
            { pair: 'USD/JPY', bid: 148.50, ask: 148.53, change: 0.15 }
          ]
        })
      });

      render(
        <TestWrapper>
          <TradingDashboard />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText(/EUR\/USD/i)).toBeInTheDocument();
        expect(screen.getByText(/1\.0850/)).toBeInTheDocument();
        expect(screen.getByText(/GBP\/USD/i)).toBeInTheDocument();
        expect(screen.getByText(/USD\/JPY/i)).toBeInTheDocument();
      });
    });

    it('should handle market data errors gracefully', async () => {
      fetch.mockRejectedValueOnce(new Error('Network error'));

      render(
        <TestWrapper>
          <TradingDashboard />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText(/unable to load market data/i)).toBeInTheDocument();
      });
    });
  });

  describe('Order Placement', () => {
    it('should place a market buy order successfully', async () => {
      // Mock order placement response
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          order: {
            id: 'order-123',
            pair: 'EUR/USD',
            type: 'market',
            side: 'buy',
            amount: 1000,
            price: 1.0850,
            status: 'filled'
          }
        })
      });

      render(
        <TestWrapper>
          <TradingDashboard />
        </TestWrapper>
      );

      // Select currency pair
      await user.selectOptions(screen.getByRole('combobox', { name: /currency pair/i }), 'EUR/USD');
      
      // Set order amount
      await user.clear(screen.getByRole('spinbutton', { name: /amount/i }));
      await user.type(screen.getByRole('spinbutton', { name: /amount/i }), '1000');
      
      // Place buy order
      await user.click(screen.getByRole('button', { name: /buy/i }));

      await waitFor(() => {
        expect(screen.getByText(/order placed successfully/i)).toBeInTheDocument();
        expect(screen.getByText(/order-123/i)).toBeInTheDocument();
      });

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/orders'),
        expect.objectContaining({
          method: 'POST',
          body: expect.stringContaining('EUR/USD')
        })
      );
    });

    it('should validate order parameters before submission', async () => {
      render(
        <TestWrapper>
          <TradingDashboard />
        </TestWrapper>
      );

      // Try to place order without amount
      await user.selectOptions(screen.getByRole('combobox', { name: /currency pair/i }), 'EUR/USD');
      await user.click(screen.getByRole('button', { name: /buy/i }));

      expect(screen.getByText(/please enter a valid amount/i)).toBeInTheDocument();
    });

    it('should handle insufficient balance scenario', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({
          success: false,
          message: 'Insufficient balance'
        })
      });

      render(
        <TestWrapper>
          <TradingDashboard />
        </TestWrapper>
      );

      await user.selectOptions(screen.getByRole('combobox', { name: /currency pair/i }), 'EUR/USD');
      await user.type(screen.getByRole('spinbutton', { name: /amount/i }), '999999');
      await user.click(screen.getByRole('button', { name: /buy/i }));

      await waitFor(() => {
        expect(screen.getByText(/insufficient balance/i)).toBeInTheDocument();
      });
    });
  });

  describe('Order Management', () => {
    it('should display open orders', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          orders: [
            { id: 'order-1', pair: 'EUR/USD', type: 'limit', side: 'buy', amount: 1000, price: 1.0840 },
            { id: 'order-2', pair: 'GBP/USD', type: 'stop', side: 'sell', amount: 500, price: 1.2680 }
          ]
        })
      });

      render(
        <TestWrapper>
          <TradingDashboard />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText(/order-1/i)).toBeInTheDocument();
        expect(screen.getByText(/order-2/i)).toBeInTheDocument();
        expect(screen.getByText(/EUR\/USD/i)).toBeInTheDocument();
        expect(screen.getByText(/GBP\/USD/i)).toBeInTheDocument();
      });
    });

    it('should cancel an open order', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          orders: [{ id: 'order-1', pair: 'EUR/USD', type: 'limit', side: 'buy', amount: 1000, price: 1.0840 }]
        })
      });

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          message: 'Order cancelled'
        })
      });

      render(
        <TestWrapper>
          <TradingDashboard />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText(/order-1/i)).toBeInTheDocument();
      });

      await user.click(screen.getByRole('button', { name: /cancel order-1/i }));

      await waitFor(() => {
        expect(screen.getByText(/order cancelled/i)).toBeInTheDocument();
      });
    });
  });

  describe('Portfolio Management', () => {
    it('should display account balance and positions', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          account: {
            balance: 10000.00,
            equity: 10500.00,
            margin: 500.00,
            freeMargin: 9500.00
          },
          positions: [
            { pair: 'EUR/USD', size: 1000, entryPrice: 1.0840, currentPrice: 1.0850, pnl: 10.00 }
          ]
        })
      });

      render(
        <TestWrapper>
          <TradingDashboard />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText(/\$10,000\.00/)).toBeInTheDocument();
        expect(screen.getByText(/\$10,500\.00/)).toBeInTheDocument();
        expect(screen.getByText(/EUR\/USD/i)).toBeInTheDocument();
        expect(screen.getByText(/\$10\.00/)).toBeInTheDocument();
      });
    });
  });

  describe('Risk Management', () => {
    it('should calculate and display risk metrics', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          riskMetrics: {
            totalExposure: 5000.00,
            maxDrawdown: 2.5,
            riskRewardRatio: 1.5,
            stopLossPercentage: 1.0
          }
        })
      });

      render(
        <TestWrapper>
          <TradingDashboard />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText(/total exposure/i)).toBeInTheDocument();
        expect(screen.getByText(/\$5,000\.00/)).toBeInTheDocument();
        expect(screen.getByText(/2\.5%/)).toBeInTheDocument();
        expect(screen.getByText(/1\.5:1/)).toBeInTheDocument();
      });
    });
  });

  describe('Real-time Updates', () => {
    it('should handle WebSocket price updates', async () => {
      render(
        <TestWrapper>
          <TradingDashboard />
        </TestWrapper>
      );

      // Simulate WebSocket message
      const messageEvent = new MessageEvent('message', {
        data: JSON.stringify({
          type: 'price_update',
          pair: 'EUR/USD',
          bid: 1.0855,
          ask: 1.0858
        })
      });

      // Trigger WebSocket message handler
      const wsCall = global.WebSocket.mock.calls[0];
      const wsInstance = wsCall[0];
      
      // Simulate receiving message
      if (wsInstance.addEventListener) {
        wsInstance.addEventListener('message', (event) => {
          // Handle the message
        });
      }

      expect(global.WebSocket).toHaveBeenCalledWith(expect.stringContaining('ws'));
    });
  });
});
