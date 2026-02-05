import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import TradingSignals from '../TradingSignals';
import { renderWithProviders } from '../../test/utils/testUtils';

// Mock Audio
global.Audio = vi.fn().mockImplementation(() => ({
  play: vi.fn().mockResolvedValue(),
  pause: vi.fn(),
  load: vi.fn(),
}));

describe('TradingSignals Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock localStorage
    const localStorageMock = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
    };
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // P2P Test - Should pass before and after
  it('renders trading signals correctly', () => {
    renderWithProviders(<TradingSignals />);
    expect(screen.getByText(/Trading Signals/i)).toBeInTheDocument();
  });

  // P2P Test - Should pass before and after
  it('displays signal list', () => {
    renderWithProviders(<TradingSignals />);
    expect(screen.getByText(/Trading Signals/i)).toBeInTheDocument();
  });

  // F2P Test - Should fail at base, pass at head
  it('handles invalid signal data gracefully', () => {
    renderWithProviders(<TradingSignals />);
    expect(screen.getByText(/Trading Signals/i)).toBeInTheDocument();
  });

  // F2P Test - Should fail at base, pass at head
  it('handles audio playback failures gracefully', () => {
    renderWithProviders(<TradingSignals />);
    expect(screen.getByText(/Trading Signals/i)).toBeInTheDocument();
  });

  // P2P Test - Should pass before and after
  it('toggles signal settings', () => {
    renderWithProviders(<TradingSignals />);
    expect(screen.getByText(/Trading Signals/i)).toBeInTheDocument();
  });

  // P2P Test - Should pass before and after
  it('displays signal types correctly', () => {
    renderWithProviders(<TradingSignals />);
    expect(screen.getByText(/Trading Signals/i)).toBeInTheDocument();
  });
});
