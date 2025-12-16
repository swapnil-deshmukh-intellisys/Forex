import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import { submitWithdrawalRequest, getCurrentUserWithdrawalRequests, getWithdrawalRequests, verifyWithdrawalRequest } from '../../controllers/withdrawal.controller.js';
import WithdrawalRequest from '../../models/WithdrawalRequest.js';
import Account from '../../models/Account.js';
import User from '../../models/User.js';

jest.mock('../../models/WithdrawalRequest.js');
jest.mock('../../models/Account.js');
jest.mock('../../models/User.js');

describe('Withdrawal Controller - Unit Tests', () => {
  let mockReq, mockRes;

  beforeEach(() => {
    mockReq = {
      body: {},
      user: { id: 'user123' },
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

  describe('submitWithdrawalRequest', () => {
    it('should return 400 if required fields are missing', async () => {
      mockReq.body = { amount: 1000 };

      await submitWithdrawalRequest(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: 'Missing required fields',
        })
      );
    });

    it('should return 400 if amount is invalid', async () => {
      mockReq.body = {
        accountId: 'account123',
        accountType: 'Standard',
        amount: -100,
        method: 'bank',
      };

      await submitWithdrawalRequest(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: 'Amount must be greater than 0',
        })
      );
    });

    it('should return 404 if account not found', async () => {
      mockReq.body = {
        accountId: 'nonexistent',
        accountType: 'Standard',
        amount: 1000,
        method: 'bank',
      };

      Account.findOne = jest.fn().mockResolvedValue(null);
      Account.findById = jest.fn().mockResolvedValue(null);

      await submitWithdrawalRequest(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: 'Account not found',
        })
      );
    });

    it('should create withdrawal request successfully', async () => {
      mockReq.body = {
        accountId: 'account123',
        accountType: 'Standard',
        amount: 1000,
        method: 'bank',
        accountDetails: { bankAccount: '1234567890' },
      };

      Account.findOne = jest.fn().mockResolvedValue({
        _id: 'account123',
        user: 'user123',
        balance: 5000,
      });

      const mockWithdrawalRequest = {
        save: jest.fn().mockResolvedValue(true),
      };
      WithdrawalRequest.mockImplementation(() => mockWithdrawalRequest);

      await submitWithdrawalRequest(mockReq, mockRes);

      expect(mockWithdrawalRequest.save).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
        })
      );
    });
  });

  describe('getCurrentUserWithdrawalRequests', () => {
    it('should return user withdrawal requests', async () => {
      WithdrawalRequest.find = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          sort: jest.fn().mockResolvedValue([
            { _id: 'withdrawal1', amount: 1000 },
          ]),
        }),
      });

      await getCurrentUserWithdrawalRequests(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
        })
      );
    });
  });

  describe('verifyWithdrawalRequest', () => {
    it('should return 404 if withdrawal request not found', async () => {
      mockReq.params.requestId = 'nonexistent';
      WithdrawalRequest.findById = jest.fn().mockResolvedValue(null);

      await verifyWithdrawalRequest(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
    });

    it('should approve withdrawal request', async () => {
      mockReq.params.requestId = 'withdrawal123';
      mockReq.body = { action: 'approve' };

      const mockWithdrawalRequest = {
        _id: 'withdrawal123',
        status: 'pending',
        amount: 1000,
        accountId: 'account123',
        save: jest.fn().mockResolvedValue(true),
      };

      WithdrawalRequest.findById = jest.fn().mockResolvedValue(mockWithdrawalRequest);
      Account.findById = jest.fn().mockResolvedValue({
        _id: 'account123',
        balance: 5000,
        save: jest.fn().mockResolvedValue(true),
      });

      await verifyWithdrawalRequest(mockReq, mockRes);

      expect(mockWithdrawalRequest.status).toBe('approved');
      expect(mockWithdrawalRequest.save).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(200);
    });
  });
});

