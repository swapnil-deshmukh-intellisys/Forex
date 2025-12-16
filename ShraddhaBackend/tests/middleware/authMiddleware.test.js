import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import authMiddleware from '../../middleware/authMiddleware.js';
import jwt from 'jsonwebtoken';
import { createMockRequest, createMockResponse, createMockNext } from '../utils/testHelpers.js';
import { createAuthToken } from '../utils/authHelpers.js';

jest.mock('jsonwebtoken');

describe('Auth Middleware', () => {
  let mockReq, mockRes, mockNext;

  beforeEach(() => {
    mockReq = createMockRequest();
    mockRes = createMockResponse();
    mockNext = createMockNext();
    process.env.JWT_SECRET = 'test_secret';
  });

  it('should call next() when valid token is provided', () => {
    const token = createAuthToken('user123', 'test@example.com');
    mockReq.headers.authorization = `Bearer ${token}`;
    
    jwt.verify = jest.fn().mockReturnValue({ userId: 'user123', email: 'test@example.com' });

    authMiddleware(mockReq, mockRes, mockNext);

    expect(mockNext).toHaveBeenCalled();
    expect(mockReq.user).toBeDefined();
  });

  it('should return 401 when no token is provided', () => {
    mockReq.headers.authorization = undefined;

    authMiddleware(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        message: 'Access denied. No token provided.',
      })
    );
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should return 401 when token is invalid', () => {
    mockReq.headers.authorization = 'Bearer invalid_token';
    jwt.verify = jest.fn().mockImplementation(() => {
      throw new Error('Invalid token');
    });

    authMiddleware(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        message: 'Invalid or expired token.',
      })
    );
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should extract token from Authorization header', () => {
    const token = createAuthToken('user123', 'test@example.com');
    mockReq.headers.authorization = `Bearer ${token}`;
    jwt.verify = jest.fn().mockReturnValue({ userId: 'user123' });

    authMiddleware(mockReq, mockRes, mockNext);

    expect(jwt.verify).toHaveBeenCalledWith(token, process.env.JWT_SECRET);
  });
});

