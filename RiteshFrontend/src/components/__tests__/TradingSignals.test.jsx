import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TradingSignals from '../TradingSignals';
import { renderWithProviders } from '../../test/utils/testUtils';

// Mock the audio API for sound notifications
global.Audio = vi.fn(() => ({
  play: vi.fn(),
  pause: vi.fn(),
  load: vi.fn(),
}));

describe('TradingSignals Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock localStorage
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  // P2P Tests - Should pass before and after
  it('renders trading signals component', () => {
    renderWithProviders(<TradingSignals />);
    expect(screen.getByText(/Trading Signals/i)).toBeInTheDocument();
  });

  it('displays default signals', () => {
    renderWithProviders(<TradingSignals />);
    expect(screen.getByText(/EURUSD/i)).toBeInTheDocument();
  });

  it('toggles signal settings', () => {
    renderWithProviders(<TradingSignals />);
    
    const settingsButton = screen.getByRole('button', { name: /settings/i });
    fireEvent.click(settingsButton);
    
    expect(screen.getByText(/Sound Enabled/i)).toBeInTheDocument();
  });

  // F2P Test: This will FAIL due to missing validation for invalid signal data
  it('handles invalid signal data gracefully', () => {
    // Mock invalid signal data
    const invalidSignals = [
      { id: null, symbol: undefined, type: 'invalid', price: 'not-a-number' }
    ];
    
    // F2P FAILURE: This will fail because the component doesn't validate signal data
    expect(() => {
      renderWithProviders(<TradingSignals signals={invalidSignals} />);
    }).not.toThrow();
    
    // Should still render without crashing
    expect(screen.getByText(/Trading Signals/i)).toBeInTheDocument();
  });

  // F2P Test: This will FAIL due to missing error handling for audio playback
  it('handles audio playback failure gracefully', async () => {
    // Mock Audio to throw an error
    global.Audio = vi.fn(() => ({
      play: vi.fn().mockRejectedValue(new Error('Audio playback failed')),
      pause: vi.fn(),
      load: vi.fn(),
    }));
    
    renderWithProviders(<TradingSignals />);
    
    // Trigger a signal that should play sound
    const signalButton = screen.getByRole('button', { name: /test signal/i });
    fireEvent.click(signalButton);
    
    // F2P FAILURE: This will fail because there's no error handling for audio failures
    await waitFor(() => {
      expect(screen.getByText(/Audio error/i)).toBeInTheDocument();
    });
  });

  // P2P Test - Should pass before and after
  it('enables and disables signals', () => {
    renderWithProviders(<TradingSignals />);
    
    const toggleButton = screen.getByRole('button', { name: /enable signals/i });
    fireEvent.click(toggleButton);
    
    expect(screen.getByText(/Signals disabled/i)).toBeInTheDocument();
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

  // P2P Test - Should pass before and after
  it('filters signals by type', () => {
    renderWithProviders(<TradingSignals />);
    
    const filterButton = screen.getByRole('button', { name: /buy signals/i });
    fireEvent.click(filterButton);
    
    // Should only show buy signals
    expect(screen.getByText(/EURUSD.*Buy/i)).toBeInTheDocument();
  });
});
