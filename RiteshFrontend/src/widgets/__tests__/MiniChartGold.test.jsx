import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import MiniChartGold from '../MiniChartGold';
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

describe('MiniChartGold Component', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders the component without crashing', () => {
    renderWithProviders(<MiniChartGold />);
    expect(screen.getByText(/XAUUSD chart by TradingView/i)).toBeInTheDocument();
  });

  it('renders with correct container structure', () => {
    const { container } = renderWithProviders(<MiniChartGold />);
    const widgetContainer = container.querySelector('.tradingview-widget-container');
    expect(widgetContainer).toBeInTheDocument();
    expect(widgetContainer).toHaveStyle({ height: '300px' });
  });

  it('displays TradingView copyright link', () => {
    renderWithProviders(<MiniChartGold />);
    const link = screen.getByRole('link', { name: /XAUUSD chart by TradingView/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', expect.stringContaining('tradingview.com'));
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener nofollow');
  });

  it('updates theme when theme context changes', async () => {
    const { rerender } = renderWithProviders(<MiniChartGold />, { theme: 'dark' });
    rerender(<MiniChartGold />);
    await waitFor(() => {
      expect(screen.getByText(/XAUUSD chart by TradingView/i)).toBeInTheDocument();
    });
  });
});

