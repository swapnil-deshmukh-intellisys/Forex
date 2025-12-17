import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Watchlist from '../Watchlist';
import { watchlistAPI } from '../../services/api';
import { renderWithProviders } from '../../test/utils/testUtils';

// Mock the watchlistAPI
vi.mock('../../services/api', () => ({
  watchlistAPI: {
    getWatchlist: vi.fn(),
    addInstrument: vi.fn(),
    removeInstrument: vi.fn(),
  },
}));

describe('Watchlist Component', () => {
  const mockWatchlist = {
    watchlist: {
      instruments: [
        { symbol: 'EURUSD', category: 'Forex', notes: 'Major pair' },
        { symbol: 'GBPUSD', category: 'Forex' },
        { symbol: 'XAUUSD', category: 'Forex', notes: 'Gold' },
      ],
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // Mock console.error to avoid noise in test output
    vi.spyOn(console, 'error').mockImplementation(() => {});
    // Mock window.alert
    window.alert = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Loading State', () => {
    it('shows loading message while fetching watchlist', async () => {
      watchlistAPI.getWatchlist.mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve(mockWatchlist), 100))
      );

      renderWithProviders(<Watchlist />);
      expect(screen.getByText(/loading watchlist/i)).toBeInTheDocument();

      await waitFor(() => {
        expect(screen.queryByText(/loading watchlist/i)).not.toBeInTheDocument();
      });
    });
  });

  describe('Rendering', () => {
    it('renders watchlist with instruments', async () => {
      watchlistAPI.getWatchlist.mockResolvedValue(mockWatchlist);

      renderWithProviders(<Watchlist />);

      await waitFor(() => {
        expect(screen.getByText(/watchlist/i)).toBeInTheDocument();
      });

      expect(screen.getByText('EURUSD')).toBeInTheDocument();
      expect(screen.getByText('GBPUSD')).toBeInTheDocument();
      expect(screen.getByText('XAUUSD')).toBeInTheDocument();
    });

    it('renders empty state when no instruments', async () => {
      watchlistAPI.getWatchlist.mockResolvedValue({
        watchlist: { instruments: [] },
      });

      renderWithProviders(<Watchlist />);

      await waitFor(() => {
        expect(screen.getByText(/no instruments in watchlist/i)).toBeInTheDocument();
      });
    });

    it('renders compact version when compact prop is true', async () => {
      watchlistAPI.getWatchlist.mockResolvedValue(mockWatchlist);

      renderWithProviders(<Watchlist compact={true} />);

      await waitFor(() => {
        expect(screen.getByText(/watchlist/i)).toBeInTheDocument();
      });

      // In compact mode, only first 5 instruments should be visible
      const instruments = screen.getAllByText(/EURUSD|GBPUSD|XAUUSD/i);
      expect(instruments.length).toBeGreaterThan(0);
    });
  });

  describe('Add Instrument', () => {
    it('opens add modal when add button is clicked', async () => {
      watchlistAPI.getWatchlist.mockResolvedValue({
        watchlist: { instruments: [] },
      });

      renderWithProviders(<Watchlist />);

      await waitFor(() => {
        expect(screen.getByText(/add instrument/i)).toBeInTheDocument();
      });

      const addButton = screen.getByRole('button', { name: /add instrument/i });
      fireEvent.click(addButton);

      await waitFor(() => {
        expect(screen.getByPlaceholderText(/symbol.*eurusd/i)).toBeInTheDocument();
      });
    });

    it('adds new instrument successfully', async () => {
      const user = userEvent.setup();
      watchlistAPI.getWatchlist.mockResolvedValue({
        watchlist: { instruments: [] },
      });
      watchlistAPI.addInstrument.mockResolvedValue({ success: true });
      watchlistAPI.getWatchlist.mockResolvedValueOnce({
        watchlist: { instruments: [] },
      }).mockResolvedValueOnce({
        watchlist: {
          instruments: [{ symbol: 'USDJPY', category: 'Forex' }],
        },
      });

      renderWithProviders(<Watchlist />);

      await waitFor(() => {
        expect(screen.getByText(/add instrument/i)).toBeInTheDocument();
      });

      const addButton = screen.getByRole('button', { name: /add instrument/i });
      await user.click(addButton);

      await waitFor(() => {
        expect(screen.getByPlaceholderText(/symbol.*eurusd/i)).toBeInTheDocument();
      });

      const input = screen.getByPlaceholderText(/symbol.*eurusd/i);
      await user.type(input, 'USDJPY');

      const submitButton = screen.getByRole('button', { name: /^add$/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(watchlistAPI.addInstrument).toHaveBeenCalledWith({
          symbol: 'USDJPY',
          category: 'Forex',
        });
      });
    });

    it('closes modal when cancel is clicked', async () => {
      const user = userEvent.setup();
      watchlistAPI.getWatchlist.mockResolvedValue({
        watchlist: { instruments: [] },
      });

      renderWithProviders(<Watchlist />);

      await waitFor(() => {
        expect(screen.getByText(/add instrument/i)).toBeInTheDocument();
      });

      const addButton = screen.getByRole('button', { name: /add instrument/i });
      await user.click(addButton);

      await waitFor(() => {
        expect(screen.getByPlaceholderText(/symbol.*eurusd/i)).toBeInTheDocument();
      });

      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      await user.click(cancelButton);

      await waitFor(() => {
        expect(screen.queryByPlaceholderText(/symbol.*eurusd/i)).not.toBeInTheDocument();
      });
    });

    it('handles error when adding instrument fails', async () => {
      const user = userEvent.setup();
      watchlistAPI.getWatchlist.mockResolvedValue({
        watchlist: { instruments: [] },
      });
      watchlistAPI.addInstrument.mockRejectedValue(new Error('Failed to add'));

      renderWithProviders(<Watchlist />);

      await waitFor(() => {
        expect(screen.getByText(/add instrument/i)).toBeInTheDocument();
      });

      const addButton = screen.getByRole('button', { name: /add instrument/i });
      await user.click(addButton);

      await waitFor(() => {
        expect(screen.getByPlaceholderText(/symbol.*eurusd/i)).toBeInTheDocument();
      });

      const input = screen.getByPlaceholderText(/symbol.*eurusd/i);
      await user.type(input, 'USDJPY');

      const submitButton = screen.getByRole('button', { name: /^add$/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(window.alert).toHaveBeenCalledWith('Failed to add instrument');
      });
    });
  });

  describe('Remove Instrument', () => {
    it('removes instrument when remove button is clicked', async () => {
      const user = userEvent.setup();
      watchlistAPI.getWatchlist.mockResolvedValue(mockWatchlist);
      watchlistAPI.removeInstrument.mockResolvedValue({ success: true });
      watchlistAPI.getWatchlist.mockResolvedValueOnce(mockWatchlist).mockResolvedValueOnce({
        watchlist: {
          instruments: mockWatchlist.watchlist.instruments.filter(
            (inst) => inst.symbol !== 'EURUSD'
          ),
        },
      });

      renderWithProviders(<Watchlist />);

      await waitFor(() => {
        expect(screen.getByText('EURUSD')).toBeInTheDocument();
      });

      const removeButtons = screen.getAllByRole('button', { name: /remove/i });
      await user.click(removeButtons[0]);

      await waitFor(() => {
        expect(watchlistAPI.removeInstrument).toHaveBeenCalledWith('EURUSD');
      });
    });

    it('handles error when removing instrument fails', async () => {
      const user = userEvent.setup();
      watchlistAPI.getWatchlist.mockResolvedValue(mockWatchlist);
      watchlistAPI.removeInstrument.mockRejectedValue(new Error('Failed to remove'));

      renderWithProviders(<Watchlist />);

      await waitFor(() => {
        expect(screen.getByText('EURUSD')).toBeInTheDocument();
      });

      const removeButtons = screen.getAllByRole('button', { name: /remove/i });
      await user.click(removeButtons[0]);

      await waitFor(() => {
        expect(watchlistAPI.removeInstrument).toHaveBeenCalledWith('EURUSD');
      });

      // Error should be logged but component should still function
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('Compact Mode', () => {
    it('shows limited instruments in compact mode', async () => {
      const manyInstruments = {
        watchlist: {
          instruments: Array.from({ length: 10 }, (_, i) => ({
            symbol: `SYMBOL${i}`,
            category: 'Forex',
          })),
        },
      };

      watchlistAPI.getWatchlist.mockResolvedValue(manyInstruments);

      renderWithProviders(<Watchlist compact={true} />);

      await waitFor(() => {
        expect(screen.getByText(/watchlist/i)).toBeInTheDocument();
      });

      // Compact mode should show only first 5
      const symbols = screen.getAllByText(/SYMBOL\d/i);
      expect(symbols.length).toBeLessThanOrEqual(5);
    });

    it('shows add button in compact mode', async () => {
      watchlistAPI.getWatchlist.mockResolvedValue({
        watchlist: { instruments: [] },
      });

      renderWithProviders(<Watchlist compact={true} />);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /\+ add/i })).toBeInTheDocument();
      });
    });
  });

  describe('Error Handling', () => {
    it('handles API error when loading watchlist', async () => {
      watchlistAPI.getWatchlist.mockRejectedValue(new Error('Network error'));

      renderWithProviders(<Watchlist />);

      await waitFor(() => {
        expect(console.error).toHaveBeenCalled();
      });
    });
  });
});

