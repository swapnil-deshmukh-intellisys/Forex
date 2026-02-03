import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import useScrollToTop from '../useScrollToTop';

describe('useScrollToTop Hook', () => {
  const originalScrollTo = window.scrollTo;

  beforeEach(() => {
    window.scrollTo = vi.fn();
  });

  afterEach(() => {
    window.scrollTo = originalScrollTo;
  });

  it('scrolls to top with smooth behavior by default', () => {
    renderHook(() => useScrollToTop());
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, left: 0, behavior: 'smooth' });
  });

  it('scrolls with auto behavior when smooth is false', () => {
    renderHook(() => useScrollToTop(false));
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, left: 0, behavior: 'auto' });
  });

  it('scrolls after specified delay', async () => {
    renderHook(() => useScrollToTop(true, 100));
    // Not called immediately when delay > 0
    expect(window.scrollTo).not.toHaveBeenCalled();
    
    // Wait for the delay
    await new Promise(resolve => setTimeout(resolve, 150));
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, left: 0, behavior: 'smooth' });
  });
});

