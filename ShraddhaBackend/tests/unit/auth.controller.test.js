import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import { signup, login } from '../../controllers/auth.controller.js';
import User from '../../models/User.js';
import Account from '../../models/Account.js';
import Profile from '../../models/Profile.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

// Mock dependencies
jest.mock('../../models/User.js');
jest.mock('../../models/Account.js');
jest.mock('../../models/Profile.js');
jest.mock('../../services/mockEmailService.js');
jest.mock('jsonwebtoken');
jest.mock('bcrypt');

describe('Auth Controller - Unit Tests', () => {
  let mockReq, mockRes;

  beforeEach(() => {
    mockReq = {
      body: {},
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('signup', () => {
    it('should return 400 if required fields are missing', async () => {
      mockReq.body = {
        email: 'test@example.com',
        // Missing other required fields
      };

      await signup(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Please fill all required fields',
      });
    });

    it('should return 400 if passwords do not match', async () => {
      mockReq.body = {
        accountType: 'demo',
        email: 'test@example.com',
        password: 'password123',
        repeatPassword: 'different123',
        fullName: 'Test User',
        termsAccepted: true,
        privacyAccepted: true,
      };

      await signup(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Passwords do not match',
      });
    });

    it('should return 409 if user already exists', async () => {
      mockReq.body = {
        accountType: 'demo',
        email: 'existing@example.com',
        password: 'password123',
        repeatPassword: 'password123',
        fullName: 'Test User',
        termsAccepted: true,
        privacyAccepted: true,
      };

      User.findOne = jest.fn().mockResolvedValue({ email: 'existing@example.com' });

      await signup(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(409);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'User already exists',
      });
    });

    it('should create user successfully with valid data', async () => {
      mockReq.body = {
        accountType: 'demo',
        email: 'newuser@example.com',
        password: 'password123',
        repeatPassword: 'password123',
        fullName: 'New User',
        termsAccepted: true,
        privacyAccepted: true,
      };

      User.findOne = jest.fn().mockResolvedValue(null);
      User.create = jest.fn().mockResolvedValue({
        _id: 'user123',
        email: 'newuser@example.com',
      });
      Account.create = jest.fn().mockResolvedValue({});
      Profile.create = jest.fn().mockResolvedValue({});
      bcrypt.hash = jest.fn().mockResolvedValue('hashedPassword');
      jwt.sign = jest.fn().mockReturnValue('mockToken');

      await signup(mockReq, mockRes);

      expect(User.create).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
        })
      );
    });
  });

  describe('login', () => {
    it('should return 400 if email or password is missing', async () => {
      mockReq.body = {
        email: 'test@example.com',
        // Missing password
      };

      await login(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Email and password are required',
      });
    });

    it('should return 401 if user does not exist', async () => {
      mockReq.body = {
        email: 'nonexistent@example.com',
        password: 'password123',
      };

      User.findOne = jest.fn().mockResolvedValue(null);

      await login(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Invalid credentials',
      });
    });

    it('should return 401 if password is incorrect', async () => {
      mockReq.body = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      User.findOne = jest.fn().mockResolvedValue({
        email: 'test@example.com',
        password: 'hashedPassword',
      });
      bcrypt.compare = jest.fn().mockResolvedValue(false);

      await login(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Invalid credentials',
      });
    });

    it('should login successfully with correct credentials', async () => {
      mockReq.body = {
        email: 'test@example.com',
        password: 'correctpassword',
      };

      const mockUser = {
        _id: 'user123',
        email: 'test@example.com',
        password: 'hashedPassword',
      };

      User.findOne = jest.fn().mockResolvedValue(mockUser);
      bcrypt.compare = jest.fn().mockResolvedValue(true);
      jwt.sign = jest.fn().mockReturnValue('mockToken');

      await login(mockReq, mockRes);

      expect(bcrypt.compare).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          token: 'mockToken',
        })
      );
    });
  });
});

