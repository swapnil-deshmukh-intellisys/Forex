import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import adminMiddleware from '../../middleware/adminMiddleware.js';
import Admin from '../../models/Admin.js';
import { createMockRequest, createMockResponse, createMockNext } from '../utils/testHelpers.js';
import { createAdminToken } from '../utils/authHelpers.js';
import jwt from 'jsonwebtoken';

jest.mock('../../models/Admin.js');
jest.mock('jsonwebtoken');

describe('Admin Middleware', () => {
  let mockReq, mockRes, mockNext;

  beforeEach(() => {
    mockReq = createMockRequest();
    mockRes = createMockResponse();
    mockNext = createMockNext();
    process.env.JWT_SECRET = 'test_secret';
  });

  it('should call next() when valid admin token is provided', async () => {
    const token = createAdminToken('admin123', 'admin@example.com');
    mockReq.headers.authorization = `Bearer ${token}`;
    
    jwt.verify = jest.fn().mockReturnValue({ adminId: 'admin123', email: 'admin@example.com', role: 'admin' });
    Admin.findById = jest.fn().mockResolvedValue({
      _id: 'admin123',
      email: 'admin@example.com',
      role: 'admin',
      isActive: true,
    });

    await adminMiddleware(mockReq, mockRes, mockNext);

    expect(mockNext).toHaveBeenCalled();
  });

  it('should return 401 when no token is provided', async () => {
    mockReq.headers.authorization = undefined;

    await adminMiddleware(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
      })
    );
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should return 403 when admin is not active', async () => {
    const token = createAdminToken('admin123', 'admin@example.com');
    mockReq.headers.authorization = `Bearer ${token}`;
    
    jwt.verify = jest.fn().mockReturnValue({ adminId: 'admin123' });
    Admin.findById = jest.fn().mockResolvedValue({
      _id: 'admin123',
      isActive: false,
    });

    await adminMiddleware(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(403);
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should return 403 when admin not found', async () => {
    const token = createAdminToken('admin123', 'admin@example.com');
    mockReq.headers.authorization = `Bearer ${token}`;
    
    jwt.verify = jest.fn().mockReturnValue({ adminId: 'admin123' });
    Admin.findById = jest.fn().mockResolvedValue(null);

    await adminMiddleware(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(403);
    expect(mockNext).not.toHaveBeenCalled();
  });
});

