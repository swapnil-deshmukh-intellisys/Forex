import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { screen } from '@testing-library/react';
import TickerTape from '../TickerTape';
import { renderWithProviders } from '../../test/utils/testUtils';

// Mock TradingView script loading
global.document.createElement = vi.fn((tagName) => {
  const element = document.createElement(tagName);
  if (tagName === 'script') {
    setTimeout(() => {
      if (element.onload) element.onload();
    }, 0);
  }
  return element;
});

describe('TickerTape Component', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders the component without crashing', () => {
    renderWithProviders(<TickerTape />);
    expect(screen.getByText(/Track all markets on TradingView/i)).toBeInTheDocument();
  });

  it('renders with correct container structure', () => {
    const { container } = renderWithProviders(<TickerTape />);
    const widgetContainer = container.querySelector('.tradingview-widget-container');
    expect(widgetContainer).toBeInTheDocument();
  });

  it('displays TradingView copyright link', () => {
    renderWithProviders(<TickerTape />);
    const link = screen.getByRole('link', { name: /Track all markets on TradingView/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', expect.stringContaining('tradingview.com'));
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('loads TradingView ticker tape script', () => {
    renderWithProviders(<TickerTape />);
    // Component should create script element for TradingView
    expect(document.querySelector('script')).toBeInTheDocument();
  });
});

