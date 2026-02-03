import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import useScrollToTop from '../useScrollToTop';

describe('useScrollToTop Hook', () => {
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

  it('scrolls to top when enabled is true', () => {
    renderHook(() => useScrollToTop(true, 0));
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, left: 0, behavior: 'smooth' });
  });

  it('does not scroll when enabled is false', () => {
    renderHook(() => useScrollToTop(false, 0));
    expect(window.scrollTo).not.toHaveBeenCalled();
  });

  it('scrolls to specified offset', () => {
    renderHook(() => useScrollToTop(true, 100));
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 100, left: 0, behavior: 'smooth' });
  });
});

