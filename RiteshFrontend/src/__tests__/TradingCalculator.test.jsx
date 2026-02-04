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
    expect(screen.getByDisplayValue('1000')).toBeInTheDocument();
    expect(screen.getByDisplayValue('2')).toBeInTheDocument();
    expect(screen.getByText(/Entry Price/i)).toBeInTheDocument();
  });

  it('calculates risk amount when inputs change', () => {
    render(<TradingCalculator />);
    
    const balanceInput = screen.getByDisplayValue('1000');
    const riskInput = screen.getByDisplayValue('2');
    
    fireEvent.change(balanceInput, { target: { value: '1000' } });
    fireEvent.change(riskInput, { target: { value: '2' } });
    
    // Risk amount should be calculated (2% of 1000 = $20)
    expect(screen.getByText(/\$20\.00/i)).toBeInTheDocument();
  });

  it('allows changing currency pair', () => {
    render(<TradingCalculator />);
    
    const pairSelect = screen.getByDisplayValue('EURUSD');
    expect(pairSelect).toBeInTheDocument();
    
    fireEvent.change(pairSelect, { target: { value: 'XAUUSD' } });
    expect(pairSelect.value).toBe('XAUUSD');
  });

  it('displays calculation results', () => {
    render(<TradingCalculator />);
    
    expect(screen.getByText(/Risk Amount/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Position Size/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Pip Value/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Risk\/Reward Ratio/i).length).toBeGreaterThan(0);
  });

  it('switches calculation types', () => {
    render(<TradingCalculator />);
    
    const positionButton = screen.getByRole('button', { name: /position size/i });
    fireEvent.click(positionButton);
    
    expect(positionButton).toHaveClass('bg-accent-color');
  });
});

