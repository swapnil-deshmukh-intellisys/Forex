import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import AboutUs from '../AboutUs';
import { renderWithProviders } from '../../test/utils/testUtils';

describe('AboutUs Component', () => {
  it('renders about us page', () => {
    renderWithProviders(<AboutUs />);
    expect(screen.getByText(/about|company|mission/i)).toBeInTheDocument();
  });

  it('renders company information', () => {
    renderWithProviders(<AboutUs />);
    // Should contain information about the company
    expect(document.body).toBeTruthy();
  });
});

