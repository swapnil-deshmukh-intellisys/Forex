import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import TradingCalculator from '../components/TradingCalculator';

describe('TradingCalculator Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders calculator component', () => {
    render(<TradingCalculator />);
    expect(screen.getByText(/Trading Calculator/i)).toBeInTheDocument();
  });

  it('displays input fields', () => {
    render(<TradingCalculator />);
    expect(screen.getByLabelText(/Account Balance/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Risk Percentage/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Entry Price/i)).toBeInTheDocument();
  });

  it('calculates risk amount when inputs change', () => {
    render(<TradingCalculator />);
    
    const balanceInput = screen.getByLabelText(/Account Balance/i);
    const riskInput = screen.getByLabelText(/Risk Percentage/i);
    
    fireEvent.change(balanceInput, { target: { value: '1000' } });
    fireEvent.change(riskInput, { target: { value: '2' } });
    
    // Risk amount should be calculated (2% of 1000 = $20)
    expect(screen.getByText(/\$20\.00/i)).toBeInTheDocument();
  });

  it('allows changing currency pair', () => {
    render(<TradingCalculator />);
    
    const pairSelect = screen.getByLabelText(/Currency Pair/i);
    expect(pairSelect).toBeInTheDocument();
    
    fireEvent.change(pairSelect, { target: { value: 'XAUUSD' } });
    expect(pairSelect.value).toBe('XAUUSD');
  });

  it('displays calculation results', () => {
    render(<TradingCalculator />);
    
    expect(screen.getByText(/Risk Amount/i)).toBeInTheDocument();
    expect(screen.getByText(/Position Size/i)).toBeInTheDocument();
    expect(screen.getByText(/Pip Value/i)).toBeInTheDocument();
    expect(screen.getByText(/Risk\/Reward Ratio/i)).toBeInTheDocument();
  });

  it('switches calculation types', () => {
    render(<TradingCalculator />);
    
    const positionButton = screen.getByText(/Position Size/i);
    fireEvent.click(positionButton);
    
    expect(positionButton).toHaveClass('bg-accent-color');
  });
});

