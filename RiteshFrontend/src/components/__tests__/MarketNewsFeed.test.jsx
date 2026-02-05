import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import MarketNewsFeed from '../MarketNewsFeed';
import { renderWithProviders } from '../../test/utils/testUtils';

// Mock fetch globally
global.fetch = vi.fn();

describe('MarketNewsFeed Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock timers
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  // P2P Tests - Should pass before and after
  it('renders news feed component', () => {
    renderWithProviders(<MarketNewsFeed />);
    expect(screen.getByText(/Market News/i)).toBeInTheDocument();
  });

  it('displays loading state initially', () => {
    renderWithProviders(<MarketNewsFeed />);
    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
  });

  it('renders news items after loading', async () => {
    renderWithProviders(<MarketNewsFeed />);
    
    // Fast-forward time to complete the mock API call
    vi.advanceTimersByTime(500);
    
    await waitFor(() => {
      expect(screen.getByText(/EUR/)).toBeInTheDocument();
    });
  });

  // F2P Test: This will FAIL due to missing error handling for empty news
  it('handles empty news array gracefully', async () => {
    // Mock the generateMockNews function to return empty array
    vi.spyOn(MarketNewsFeed.prototype, 'generateMockNews').mockReturnValue([]);
    
    renderWithProviders(<MarketNewsFeed />);
    
    vi.advanceTimersByTime(500);
    
    // F2P FAILURE: This will fail because there's no handling for empty news state
    await waitFor(() => {
      expect(screen.getByText(/No news available/i)).toBeInTheDocument();
    });
  });

  // F2P Test: This will FAIL due to missing network error handling
  it('displays error message when news fetch fails', async () => {
    // Mock fetch to simulate network error
    global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));
    
    renderWithProviders(<MarketNewsFeed />);
    
    // F2P FAILURE: This will fail because there's no error handling in the component
    await waitFor(() => {
      expect(screen.getByText(/Failed to load news/i)).toBeInTheDocument();
    });
  });

  // P2P Test - Should pass before and after
  it('filters news by category', async () => {
    renderWithProviders(<MarketNewsFeed />);
    
    vi.advanceTimersByTime(500);
    
    await waitFor(() => {
      expect(screen.getByText(/EUR/)).toBeInTheDocument();
    });
    
    // Test filter functionality
    const filterButton = screen.getByText(/Forex/i);
    fireEvent.click(filterButton);
    
    expect(screen.getByText(/Forex/i)).toBeInTheDocument();
  });

  // P2P Test - Should pass before and after
  it('refreshes news automatically', () => {
    renderWithProviders(<MarketNewsFeed />);
    
    // Fast-forward 5 minutes to trigger auto-refresh
    vi.advanceTimersByTime(300000);
    
    // Should call fetchNews again
    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
  });
});
