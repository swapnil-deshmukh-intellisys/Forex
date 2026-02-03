import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import Plasma from '../Plasma';
import { renderWithProviders } from '../../test/utils/testUtils';

// Mock ogl library since WebGL doesn't work in jsdom
vi.mock('ogl', () => ({
  Renderer: vi.fn(() => ({
    gl: {
      canvas: document.createElement('canvas'),
      enable: vi.fn(),
      blendFunc: vi.fn(),
      clearColor: vi.fn(),
      clear: vi.fn(),
      viewport: vi.fn(),
      drawingBufferWidth: 100,
      drawingBufferHeight: 100
    },
    setSize: vi.fn(),
    render: vi.fn()
  })),
  Program: vi.fn(() => ({
    uniforms: {
      iResolution: { value: [0, 0] },
      iTime: { value: 0 },
      uCustomColor: { value: [1, 0.5, 0.2] },
      uUseCustomColor: { value: 1 },
      uSpeed: { value: 1 },
      uDirection: { value: 1 },
      uScale: { value: 1 },
      uOpacity: { value: 1 }
    }
  })),
  Mesh: vi.fn(),
  Triangle: vi.fn(() => ({
    attributes: { position: {}, uv: {} }
  }))
}));

// Mock ResizeObserver
global.ResizeObserver = vi.fn(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn()
}));

describe('Plasma Component', () => {
  it('renders without crashing', () => {
    renderWithProviders(<Plasma />);
    expect(document.body).toBeTruthy();
  });

  it('renders canvas element', () => {
    const { container } = renderWithProviders(<Plasma />);
    const canvas = container.querySelector('canvas');
    expect(canvas).toBeInTheDocument();
  });
});

