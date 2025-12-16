import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ScrollToTopButton from '../ScrollToTopButton';
import { renderWithProviders } from '../../test/utils/testUtils';

describe('ScrollToTopButton Component', () => {
  const originalScrollTo = window.scrollTo;
  const originalPageYOffset = window.pageYOffset;

  beforeEach(() => {
    window.scrollTo = vi.fn();
    Object.defineProperty(window, 'pageYOffset', {
      value: 0,
      writable: true,
      configurable: true,
    });
  });

  afterEach(() => {
    window.scrollTo = originalScrollTo;
    Object.defineProperty(window, 'pageYOffset', {
      value: originalPageYOffset,
      writable: true,
      configurable: true,
    });
  });

  it('does not render button when page is not scrolled', () => {
    Object.defineProperty(window, 'pageYOffset', { value: 0, writable: true });
    renderWithProviders(<ScrollToTopButton />);
    const button = screen.queryByRole('button', { name: /scroll to top/i });
    expect(button).not.toBeInTheDocument();
  });

  it('renders button when page is scrolled down', () => {
    Object.defineProperty(window, 'pageYOffset', { value: 400, writable: true });
    renderWithProviders(<ScrollToTopButton />);
    
    // Trigger scroll event
    fireEvent.scroll(window);
    
    const button = screen.getByRole('button', { name: /scroll to top/i });
    expect(button).toBeInTheDocument();
  });

  it('calls window.scrollTo when button is clicked', () => {
    Object.defineProperty(window, 'pageYOffset', { value: 400, writable: true });
    renderWithProviders(<ScrollToTopButton />);
    
    fireEvent.scroll(window);
    const button = screen.getByRole('button', { name: /scroll to top/i });
    fireEvent.click(button);
    
    expect(window.scrollTo).toHaveBeenCalledWith({
      top: 0,
      behavior: 'smooth',
    });
  });

  it('has correct aria-label', () => {
    Object.defineProperty(window, 'pageYOffset', { value: 400, writable: true });
    renderWithProviders(<ScrollToTopButton />);
    
    fireEvent.scroll(window);
    const button = screen.getByRole('button', { name: /scroll to top/i });
    expect(button).toHaveAttribute('aria-label', 'Scroll to top');
  });

  it('hides button when scrolled back to top', () => {
    Object.defineProperty(window, 'pageYOffset', { value: 400, writable: true });
    const { rerender } = renderWithProviders(<ScrollToTopButton />);
    
    fireEvent.scroll(window);
    expect(screen.getByRole('button', { name: /scroll to top/i })).toBeInTheDocument();
    
    // Simulate scrolling back to top
    Object.defineProperty(window, 'pageYOffset', { value: 0, writable: true });
    fireEvent.scroll(window);
    rerender(<ScrollToTopButton />);
    
    const button = screen.queryByRole('button', { name: /scroll to top/i });
    expect(button).not.toBeInTheDocument();
  });
});

