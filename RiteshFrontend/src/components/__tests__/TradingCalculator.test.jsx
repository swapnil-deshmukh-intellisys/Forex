import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TradingCalculator from '../TradingCalculator';
import { renderWithProviders } from '../../test/utils/testUtils';

describe('TradingCalculator Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // P2P Tests - Should pass before and after
  it('renders trading calculator', () => {
    renderWithProviders(<TradingCalculator />);
    expect(screen.getByText(/Trading Calculator/i)).toBeInTheDocument();
  });

  it('displays default form values', () => {
    renderWithProviders(<TradingCalculator />);
    expect(screen.getByDisplayValue('1000')).toBeInTheDocument();
    expect(screen.getByDisplayValue('2')).toBeInTheDocument();
  });

  it('calculates position size correctly', async () => {
    const user = userEvent.setup();
    renderWithProviders(<TradingCalculator />);
    
    const accountBalanceInput = screen.getByLabelText(/account balance/i);
    await user.clear(accountBalanceInput);
    await user.type(accountBalanceInput, '2000');
    
    const riskPercentageInput = screen.getByLabelText(/risk percentage/i);
    await user.clear(riskPercentageInput);
    await user.type(riskPercentageInput, '3');
    
    // Should calculate new position size
    await waitFor(() => {
      expect(screen.getByText(/60\.00/)).toBeInTheDocument(); // 2000 * 3% = 60
    });
  });

  // F2P Test: This will FAIL due to missing input validation
  it('handles negative input values gracefully', async () => {
    const user = userEvent.setup();
    renderWithProviders(<TradingCalculator />);
    
    const accountBalanceInput = screen.getByLabelText(/account balance/i);
    await user.clear(accountBalanceInput);
    await user.type(accountBalanceInput, '-1000');
    
    // F2P FAILURE: This will fail because the component doesn't validate negative inputs
    await waitFor(() => {
      expect(screen.getByText(/Please enter a positive value/i)).toBeInTheDocument();
    });
  });

  // F2P Test: This will FAIL due to missing division by zero handling
  it('handles division by zero in calculations', async () => {
    const user = userEvent.setup();
    renderWithProviders(<TradingCalculator />);
    
    const stopLossInput = screen.getByLabelText(/stop loss/i);
    await user.clear(stopLossInput);
    await user.type(stopLossInput, '0');
    
    const entryPriceInput = screen.getByLabelText(/entry price/i);
    await user.clear(entryPriceInput);
    await user.type(entryPriceInput, '1.0800');
    
    const stopLossPriceInput = screen.getByLabelText(/stop loss price/i);
    await user.clear(stopLossPriceInput);
    await user.type(stopLossPriceInput, '1.0800'); // Same as entry price
    
    // F2P FAILURE: This will fail because division by zero is not handled
    await waitFor(() => {
      expect(screen.getByText(/Invalid price difference/i)).toBeInTheDocument();
    });
  });

  // P2P Test - Should pass before and after
  it('updates results when form values change', async () => {
    const user = userEvent.setup();
    renderWithProviders(<TradingCalculator />);
    
    const leverageInput = screen.getByLabelText(/leverage/i);
    await user.clear(leverageInput);
    await user.type(leverageInput, '200');
    
    // Should recalculate margin required
    await waitFor(() => {
      expect(screen.getByText(/Margin Required/i)).toBeInTheDocument();
    });
  });

  // P2P Test - Should pass before and after
  it('resets form to default values', async () => {
    const user = userEvent.setup();
    renderWithProviders(<TradingCalculator />);
    
    const resetButton = screen.getByRole('button', { name: /reset/i });
    fireEvent.click(resetButton);
    
    // Should reset to default values
    await waitFor(() => {
      expect(screen.getByDisplayValue('1000')).toBeInTheDocument();
      expect(screen.getByDisplayValue('2')).toBeInTheDocument();
    });
  });

  // P2P Test - Should pass before and after
  it('displays risk-reward ratio', () => {
    renderWithProviders(<TradingCalculator />);
    
    // Should calculate and display risk-reward ratio
    expect(screen.getByText(/Risk\/Reward Ratio/i)).toBeInTheDocument();
  });
});
