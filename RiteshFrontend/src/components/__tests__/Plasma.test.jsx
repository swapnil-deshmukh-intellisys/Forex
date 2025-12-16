import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import Plasma from '../Plasma';
import { renderWithProviders } from '../../test/utils/testUtils';

describe('Plasma Component', () => {
  it('renders without crashing', () => {
    renderWithProviders(<Plasma />);
    // Plasma is a visual component, just check it renders
    expect(document.body).toBeTruthy();
  });

  it('renders canvas element', () => {
    const { container } = renderWithProviders(<Plasma />);
    const canvas = container.querySelector('canvas');
    expect(canvas).toBeInTheDocument();
  });
});

