import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import MiniChartUsd from '../MiniChartUsd';
import { renderWithProviders } from '../../test/utils/testUtils';

// Mock TradingView script loading
global.document.createElement = vi.fn((tagName) => {
  const element = document.createElement(tagName);
  if (tagName === 'script') {
    // Simulate script loading
    setTimeout(() => {
      if (element.onload) element.onload();
    }, 0);
  }
  return element;
});

describe('MiniChartUsd Component', () => {
  beforeEach(() => {
    // Clear any previous DOM
    document.body.innerHTML = '';
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders the component without crashing', () => {
    renderWithProviders(<MiniChartUsd />);
    expect(screen.getByText(/EURUSD chart by TradingView/i)).toBeInTheDocument();
  });

  it('renders with correct container structure', () => {
    const { container } = renderWithProviders(<MiniChartUsd />);
    const widgetContainer = container.querySelector('.tradingview-widget-container');
    expect(widgetContainer).toBeInTheDocument();
    expect(widgetContainer).toHaveStyle({ height: '300px' });
  });

  it('displays TradingView copyright link', () => {
    renderWithProviders(<MiniChartUsd />);
    const link = screen.getByRole('link', { name: /EURUSD chart by TradingView/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', expect.stringContaining('tradingview.com'));
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener nofollow');
  });

  it('updates theme when theme context changes', async () => {
    const { rerender } = renderWithProviders(<MiniChartUsd />, { theme: 'dark' });
    rerender(<MiniChartUsd />);
    await waitFor(() => {
      expect(screen.getByText(/EURUSD chart by TradingView/i)).toBeInTheDocument();
    });
  });
});

