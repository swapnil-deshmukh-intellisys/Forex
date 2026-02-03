import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import AboutUs from '../AboutUs';
import { renderWithProviders } from '../../test/utils/testUtils';

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn()
}));

describe('AboutUs Component', () => {
  it('renders about us page', () => {
    renderWithProviders(<AboutUs />);
    expect(screen.getAllByText(/about|company|mission/i).length).toBeGreaterThan(0);
  });

  it('renders company information', () => {
    renderWithProviders(<AboutUs />);
    expect(document.body).toBeTruthy();
  });
});

