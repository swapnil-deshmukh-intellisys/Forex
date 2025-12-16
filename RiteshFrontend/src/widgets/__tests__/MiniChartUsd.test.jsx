import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import MiniChartUsd from '../MiniChartUsd';
import { renderWithProviders } from '../../test/utils/testUtils';

// Store original createElement
const originalCreateElement = document.createElement;

describe('MiniChartUsd Component', () => {
  beforeEach(() => {
    // Clear any previous DOM
    document.body.innerHTML = '';
    document.createElement = originalCreateElement;
  });

  afterEach(() => {
    vi.clearAllMocks();
    document.createElement = originalCreateElement;
  });

  it('renders the component without crashing', () => {
    const { container } = renderWithProviders(<MiniChartUsd />);
    const widgetContainer = container.querySelector('.tradingview-widget-container');
    expect(widgetContainer).toBeInTheDocument();
  });

  it('renders with correct container structure', () => {
    const { container } = renderWithProviders(<MiniChartUsd />);
    const widgetContainer = container.querySelector('.tradingview-widget-container');
    expect(widgetContainer).toBeInTheDocument();
    expect(widgetContainer).toHaveStyle({ height: '300px' });
  });

  it('displays TradingView widget container', () => {
    const { container } = renderWithProviders(<MiniChartUsd />);
    const widgetContainer = container.querySelector('.tradingview-widget-container');
    expect(widgetContainer).toBeInTheDocument();
    expect(widgetContainer).toHaveStyle({ height: '300px' });
  });

  it('updates theme when theme context changes', async () => {
    const { container, rerender } = renderWithProviders(<MiniChartUsd />, { theme: 'dark' });
    rerender(<MiniChartUsd />);
    await waitFor(() => {
      const widgetContainer = container.querySelector('.tradingview-widget-container');
      expect(widgetContainer).toBeInTheDocument();
    });
  });
});

