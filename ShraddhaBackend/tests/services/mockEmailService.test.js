import { describe, it, expect, beforeEach } from '@jest/globals';
import * as mockEmailService from '../../services/mockEmailService.js';

describe('Mock Email Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('sendOTPEmail', () => {
    it('should return success without sending actual email', async () => {
      const result = await mockEmailService.sendOTPEmail('test@example.com', '123456');

      expect(result).toBeDefined();
      expect(result.success).toBe(true);
    });

    it('should log OTP email details', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      await mockEmailService.sendOTPEmail('test@example.com', '123456');

      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe('sendPasswordResetSuccessEmail', () => {
    it('should return success without sending actual email', async () => {
      const result = await mockEmailService.sendPasswordResetSuccessEmail('test@example.com');

      expect(result).toBeDefined();
      expect(result.success).toBe(true);
    });

    it('should log password reset email details', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      await mockEmailService.sendPasswordResetSuccessEmail('test@example.com');

      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });
});

