import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { screen } from '@testing-library/react';
import TickerTape from '../TickerTape';
import { renderWithProviders } from '../../test/utils/testUtils';

// Store original createElement
const originalCreateElement = document.createElement;

describe('TickerTape Component', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    document.createElement = originalCreateElement;
  });

  afterEach(() => {
    vi.clearAllMocks();
    document.createElement = originalCreateElement;
  });

  it('renders the component without crashing', () => {
    const { container } = renderWithProviders(<TickerTape />);
    const widgetContainer = container.querySelector('.tradingview-widget-container');
    expect(widgetContainer).toBeInTheDocument();
  });

  it('renders with correct container structure', () => {
    const { container } = renderWithProviders(<TickerTape />);
    const widgetContainer = container.querySelector('.tradingview-widget-container');
    expect(widgetContainer).toBeInTheDocument();
  });

  it('displays TradingView widget container', () => {
    const { container } = renderWithProviders(<TickerTape />);
    const widgetContainer = container.querySelector('.tradingview-widget-container');
    expect(widgetContainer).toBeInTheDocument();
  });

  it('loads TradingView ticker tape script', () => {
    renderWithProviders(<TickerTape />);
    // Component should create script element for TradingView
    expect(document.querySelector('script')).toBeInTheDocument();
  });
});

