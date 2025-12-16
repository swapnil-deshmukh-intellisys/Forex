import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import * as emailService from '../../services/emailService.js';
import nodemailer from 'nodemailer';

jest.mock('nodemailer');

describe('Email Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('sendOTPEmail', () => {
    it('should send OTP email successfully', async () => {
      const mockTransporter = {
        sendMail: jest.fn().mockResolvedValue({ messageId: 'test123' }),
      };
      nodemailer.createTransport = jest.fn().mockReturnValue(mockTransporter);

      const result = await emailService.sendOTPEmail('test@example.com', '123456');

      expect(mockTransporter.sendMail).toHaveBeenCalled();
      expect(result).toBeDefined();
    });

    it('should handle email sending errors', async () => {
      const mockTransporter = {
        sendMail: jest.fn().mockRejectedValue(new Error('Email error')),
      };
      nodemailer.createTransport = jest.fn().mockReturnValue(mockTransporter);

      await expect(emailService.sendOTPEmail('test@example.com', '123456')).rejects.toThrow();
    });
  });

  describe('sendPasswordResetSuccessEmail', () => {
    it('should send password reset success email', async () => {
      const mockTransporter = {
        sendMail: jest.fn().mockResolvedValue({ messageId: 'test123' }),
      };
      nodemailer.createTransport = jest.fn().mockReturnValue(mockTransporter);

      const result = await emailService.sendPasswordResetSuccessEmail('test@example.com');

      expect(mockTransporter.sendMail).toHaveBeenCalled();
      expect(result).toBeDefined();
    });
  });
});

