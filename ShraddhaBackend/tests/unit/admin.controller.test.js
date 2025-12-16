import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import { getAdminData, updateAdminData, getAccountTypes, getDepositStatistics, getAllUsers, getUserById, verifyUser } from '../../controllers/admin.controller.js';
import AdminData from '../../models/AdminData.js';
import User from '../../models/User.js';
import Account from '../../models/Account.js';
import DepositRequest from '../../models/DepositRequest.js';

jest.mock('../../models/AdminData.js');
jest.mock('../../models/User.js');
jest.mock('../../models/Account.js');
jest.mock('../../models/DepositRequest.js');

describe('Admin Controller - Unit Tests', () => {
  let mockReq, mockRes;

  beforeEach(() => {
    mockReq = {
      body: {},
      user: { id: 'admin123' },
      params: {},
      query: {},
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAdminData', () => {
    it('should return all admin data', async () => {
      AdminData.find = jest.fn().mockReturnValue({
        sort: jest.fn().mockResolvedValue([
          { accountType: 'Standard', balance: 10000 },
        ]),
      });

      await getAdminData(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
        })
      );
    });
  });

  describe('updateAdminData', () => {
    it('should return 400 if account type is missing', async () => {
      mockReq.body = { balance: 1000 };

      await updateAdminData(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: 'Account type is required',
        })
      );
    });

    it('should update admin data successfully', async () => {
      mockReq.body = {
        accountType: 'Standard',
        balance: 10000,
        currency: '₹',
      };

      AdminData.findOneAndUpdate = jest.fn().mockResolvedValue({
        accountType: 'Standard',
        balance: 10000,
      });
      Account.updateMany = jest.fn().mockResolvedValue({});

      await updateAdminData(mockReq, mockRes);

      expect(AdminData.findOneAndUpdate).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(200);
    });
  });

  describe('getAllUsers', () => {
    it('should return all users', async () => {
      User.find = jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          sort: jest.fn().mockResolvedValue([
            { _id: 'user1', email: 'test@example.com' },
          ]),
        }),
      });

      await getAllUsers(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
        })
      );
    });
  });

  describe('verifyUser', () => {
    it('should verify user successfully', async () => {
      mockReq.params.userId = 'user123';
      mockReq.body = { verified: true };

      const mockUser = {
        _id: 'user123',
        verified: false,
        save: jest.fn().mockResolvedValue(true),
      };

      User.findById = jest.fn().mockResolvedValue(mockUser);

      await verifyUser(mockReq, mockRes);

      expect(mockUser.verified).toBe(true);
      expect(mockUser.save).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(200);
    });

    it('should return 404 if user not found', async () => {
      mockReq.params.userId = 'nonexistent';
      User.findById = jest.fn().mockResolvedValue(null);

      await verifyUser(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
    });
  });
});

