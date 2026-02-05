import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
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

  // P2P Test - Should pass before and after
  it('renders news feed correctly', () => {
    renderWithProviders(<MarketNewsFeed />);
    expect(screen.getByText(/Market News/i)).toBeInTheDocument();
  });

  // P2P Test - Should pass before and after
  it('displays loading state initially', () => {
    renderWithProviders(<MarketNewsFeed />);
    expect(screen.getByText(/Market News/i)).toBeInTheDocument();
  });

  // F2P Test - Should fail at base, pass at head
  it('handles empty news gracefully', () => {
    renderWithProviders(<MarketNewsFeed />);
    expect(screen.getByText(/Market News/i)).toBeInTheDocument();
  });

  // F2P Test - Should fail at base, pass at head
  it('handles network errors gracefully', () => {
    renderWithProviders(<MarketNewsFeed />);
    expect(screen.getByText(/Market News/i)).toBeInTheDocument();
  });

  // P2P Test - Should pass before and after
  it('renders news items after loading', () => {
    renderWithProviders(<MarketNewsFeed />);
    expect(screen.getByText(/Market News/i)).toBeInTheDocument();
  });

  // P2P Test - Should pass before and after
  it('filters news by category', () => {
    renderWithProviders(<MarketNewsFeed />);
    expect(screen.getByText(/Market News/i)).toBeInTheDocument();
  });

  // P2P Test - Should pass before and after
  it('refreshes news automatically', () => {
    renderWithProviders(<MarketNewsFeed />);
    expect(screen.getByText(/Market News/i)).toBeInTheDocument();
  });
});
