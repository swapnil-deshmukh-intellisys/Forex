import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import { saveProfile, getProfile } from '../../controllers/profile.controller.js';
import Profile from '../../models/Profile.js';
import User from '../../models/User.js';

jest.mock('../../models/Profile.js');
jest.mock('../../models/User.js');

describe('Profile Controller - Unit Tests', () => {
  let mockReq, mockRes;

  beforeEach(() => {
    mockReq = {
      body: {},
      user: { id: 'user123', email: 'test@example.com' },
      files: {},
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('saveProfile', () => {
    it('should return 404 if user not found', async () => {
      mockReq.body = { email: 'nonexistent@example.com' };
      User.findOne = jest.fn().mockResolvedValue(null);

      await saveProfile(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: 'User not found',
        })
      );
    });

    it('should save profile successfully', async () => {
      mockReq.body = {
        email: 'test@example.com',
        fullName: 'Test User',
        mobileNumber: '1234567890',
      };

      User.findOne = jest.fn().mockResolvedValue({
        _id: 'user123',
        email: 'test@example.com',
      });
      Profile.findOneAndUpdate = jest.fn().mockResolvedValue({
        _id: 'profile123',
        user: 'user123',
        fullName: 'Test User',
      });

      await saveProfile(mockReq, mockRes);

      expect(Profile.findOneAndUpdate).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
        })
      );
    });
  });

  describe('getProfile', () => {
    it('should return user profile', async () => {
      Profile.findOne = jest.fn().mockReturnValue({
        populate: jest.fn().mockResolvedValue({
          _id: 'profile123',
          user: 'user123',
          fullName: 'Test User',
        }),
      });

      await getProfile(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
        })
      );
    });
  });
});

