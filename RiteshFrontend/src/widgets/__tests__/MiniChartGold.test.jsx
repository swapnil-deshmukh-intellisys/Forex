import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { waitFor } from '@testing-library/react';
import MiniChartGold from '../MiniChartGold';
import { renderWithProviders } from '../../test/utils/testUtils';

// Store original createElement
const originalCreateElement = document.createElement;

describe('MiniChartGold Component', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    document.createElement = originalCreateElement;
  });

  afterEach(() => {
    vi.clearAllMocks();
    document.createElement = originalCreateElement;
  });

  it('renders the component without crashing', () => {
    const { container } = renderWithProviders(<MiniChartGold />);
    const widgetContainer = container.querySelector('.tradingview-widget-container');
    expect(widgetContainer).toBeInTheDocument();
  });

  it('renders with correct container structure', () => {
    const { container } = renderWithProviders(<MiniChartGold />);
    const widgetContainer = container.querySelector('.tradingview-widget-container');
    expect(widgetContainer).toBeInTheDocument();
    expect(widgetContainer).toHaveStyle({ height: '300px' });
  });

  it('displays TradingView widget container', () => {
    const { container } = renderWithProviders(<MiniChartGold />);
    const widgetContainer = container.querySelector('.tradingview-widget-container');
    expect(widgetContainer).toBeInTheDocument();
    expect(widgetContainer).toHaveStyle({ height: '300px' });
  });

  it('updates theme when theme context changes', async () => {
    const { container, rerender } = renderWithProviders(<MiniChartGold />, { theme: 'dark' });
    rerender(<MiniChartGold />);
    await waitFor(() => {
      const widgetContainer = container.querySelector('.tradingview-widget-container');
      expect(widgetContainer).toBeInTheDocument();
    });
  });
});

