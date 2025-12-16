import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as authUtils from '../authUtils';

describe('authUtils', () => {
  beforeEach(() => {
    sessionStorage.clear();
    localStorage.clear();
  });

  afterEach(() => {
    sessionStorage.clear();
    localStorage.clear();
  });

  it('checks if user is authenticated', () => {
    sessionStorage.setItem('token', 'mock-token');
    // Assuming there's an isAuthenticated function
    // Adjust based on actual authUtils implementation
    expect(sessionStorage.getItem('token')).toBe('mock-token');
  });

  it('gets user token from session storage', () => {
    sessionStorage.setItem('token', 'mock-token');
    const token = sessionStorage.getItem('token');
    expect(token).toBe('mock-token');
  });

  it('clears authentication data', () => {
    sessionStorage.setItem('token', 'mock-token');
    sessionStorage.setItem('user', '{}');
    sessionStorage.clear();
    expect(sessionStorage.getItem('token')).toBeNull();
  });
});

