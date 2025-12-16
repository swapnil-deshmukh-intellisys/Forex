import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import { createAccount, getUserAccounts, getAccountById, updateAccount, deleteAccount } from '../../controllers/account.controller.js';
import Account from '../../models/Account.js';
import User from '../../models/User.js';
import AdminData from '../../models/AdminData.js';

jest.mock('../../models/Account.js');
jest.mock('../../models/User.js');
jest.mock('../../models/AdminData.js');

describe('Account Controller - Unit Tests', () => {
  let mockReq, mockRes;

  beforeEach(() => {
    mockReq = {
      body: {},
      user: { id: 'user123' },
      params: {},
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createAccount', () => {
    it('should create account successfully', async () => {
      mockReq.body = {
        accountType: 'Standard',
        status: 'Live',
        initialDeposit: 1000,
        leverage: '1:500',
      };

      Account.findOne = jest.fn().mockResolvedValue(null);
      Account.create = jest.fn().mockResolvedValue({
        _id: 'account123',
        user: 'user123',
        type: 'Standard',
        status: 'Live',
      });
      AdminData.findOneAndUpdate = jest.fn().mockResolvedValue({});

      await createAccount(mockReq, mockRes);

      expect(Account.create).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
        })
      );
    });

    it('should return 409 if account already exists', async () => {
      mockReq.body = {
        accountType: 'Standard',
        status: 'Live',
      };

      Account.findOne = jest.fn().mockResolvedValue({
        _id: 'existing123',
        type: 'Standard',
        status: 'Live',
      });

      await createAccount(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(409);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
        })
      );
    });
  });

  describe('getUserAccounts', () => {
    it('should return user accounts', async () => {
      Account.find = jest.fn().mockReturnValue({
        sort: jest.fn().mockResolvedValue([
          { _id: 'account1', type: 'Standard' },
          { _id: 'account2', type: 'Premium' },
        ]),
      });

      await getUserAccounts(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
        })
      );
    });
  });

  describe('getAccountById', () => {
    it('should return account by id', async () => {
      mockReq.params.id = 'account123';
      Account.findById = jest.fn().mockResolvedValue({
        _id: 'account123',
        user: 'user123',
        type: 'Standard',
      });

      await getAccountById(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
        })
      );
    });

    it('should return 404 if account not found', async () => {
      mockReq.params.id = 'nonexistent';
      Account.findById = jest.fn().mockResolvedValue(null);

      await getAccountById(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
        })
      );
    });
  });
});

