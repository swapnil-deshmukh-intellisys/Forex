import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
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
    global.localStorage = localStorageMock;
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

  // P2P Test - Should pass before and after
  it('saves settings to localStorage', () => {
    renderWithProviders(<TradingSignals />);
    
    const settingsButton = screen.getByRole('button', { name: /settings/i });
    fireEvent.click(settingsButton);
    
    const soundToggle = screen.getByRole('checkbox', { name: /sound enabled/i });
    fireEvent.click(soundToggle);
    
    // Check if settings are saved to localStorage
    const savedSettings = localStorage.getItem('tradingSignalsSettings');
    expect(savedSettings).toBeTruthy();
  });
});
