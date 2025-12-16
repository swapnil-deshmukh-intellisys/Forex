import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as api from '../api';
import { createMockUser, createMockToken } from '../../test/utils/mockData';

// Mock fetch globally
global.fetch = vi.fn();

describe('API Service', () => {
  beforeEach(() => {
    sessionStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Authentication API', () => {
    it('calls signup endpoint correctly', async () => {
      const mockResponse = { success: true, token: 'mock-token', user: createMockUser() };
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const signupData = {
        email: 'test@example.com',
        password: 'password123',
        fullName: 'Test User',
      };

      await api.authAPI.signup(signupData);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/auth/signup'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(signupData),
        })
      );
    });

    it('calls login endpoint correctly', async () => {
      const mockResponse = { success: true, token: 'mock-token', user: createMockUser() };
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      await api.authAPI.login('test@example.com', 'password123');

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/auth/login'),
        expect.objectContaining({
          method: 'POST',
        })
      );
    });

    it('includes Authorization header when token exists', async () => {
      sessionStorage.setItem('token', createMockToken());
      
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      });

      await api.authAPI.getProfile();

      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: expect.stringContaining('Bearer'),
          }),
        })
      );
    });

    it('handles API errors correctly', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({ success: false, message: 'Bad Request' }),
      });

      try {
        await api.authAPI.login('invalid', 'password');
      } catch (error) {
        expect(error).toBeDefined();
        expect(error.message).toBeDefined();
      }
    });
  });

  describe('Account API', () => {
    it('calls getAccounts endpoint correctly', async () => {
      sessionStorage.setItem('token', createMockToken());
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, accounts: [] }),
      });

      await api.accountAPI.getAccounts();

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/accounts'),
        expect.any(Object)
      );
    });
  });
});

