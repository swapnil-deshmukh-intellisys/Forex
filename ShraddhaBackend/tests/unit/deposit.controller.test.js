import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import { submitDepositRequest, getDepositRequests, verifyDepositRequest, getCurrentUserDepositRequests } from '../../controllers/deposit.controller.js';
import DepositRequest from '../../models/DepositRequest.js';
import Account from '../../models/Account.js';
import AdminData from '../../models/AdminData.js';

jest.mock('../../models/DepositRequest.js');
jest.mock('../../models/Account.js');
jest.mock('../../models/AdminData.js');

describe('Deposit Controller - Unit Tests', () => {
  let mockReq, mockRes;

  beforeEach(() => {
    mockReq = {
      body: {},
      user: { id: 'user123' },
      params: {},
      query: {},
      file: null,
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('submitDepositRequest', () => {
    it('should return 400 if payment proof is missing', async () => {
      mockReq.body = { accountId: 'account123', amount: 1000 };
      mockReq.file = null;

      await submitDepositRequest(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: 'Payment proof image is required',
        })
      );
    });

    it('should create deposit request successfully', async () => {
      mockReq.body = { accountId: 'account123', amount: 1000, upiApp: 'PhonePe' };
      mockReq.file = {
        path: '/uploads/test.jpg',
        originalname: 'test.jpg',
        mimetype: 'image/jpeg',
      };

      Account.findOne = jest.fn().mockResolvedValue({
        _id: 'account123',
        user: 'user123',
        type: 'Standard',
      });
      DepositRequest.create = jest.fn().mockResolvedValue({
        _id: 'deposit123',
        user: 'user123',
        account: 'account123',
        amount: 1000,
      });

      await submitDepositRequest(mockReq, mockRes);

      expect(DepositRequest.create).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
        })
      );
    });

    it('should return 404 if account not found', async () => {
      mockReq.body = { accountId: 'nonexistent', amount: 1000 };
      mockReq.file = { path: '/uploads/test.jpg' };

      Account.findOne = jest.fn().mockResolvedValue(null);

      await submitDepositRequest(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: 'Account not found',
        })
      );
    });
  });

  describe('getDepositRequests', () => {
    it('should return all deposit requests', async () => {
      DepositRequest.find = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          populate: jest.fn().mockReturnValue({
            sort: jest.fn().mockResolvedValue([
              { _id: 'deposit1', status: 'pending' },
            ]),
          }),
        }),
      });

      await getDepositRequests(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
        })
      );
    });

    it('should filter by status if provided', async () => {
      mockReq.query.status = 'pending';
      DepositRequest.find = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          populate: jest.fn().mockReturnValue({
            sort: jest.fn().mockResolvedValue([]),
          }),
        }),
      });

      await getDepositRequests(mockReq, mockRes);

      expect(DepositRequest.find).toHaveBeenCalledWith({ status: 'pending' });
    });
  });

  describe('verifyDepositRequest', () => {
    it('should approve deposit request', async () => {
      mockReq.params.requestId = 'deposit123';
      mockReq.body = { action: 'approve', verifiedAmount: 1000 };

      const mockDepositRequest = {
        _id: 'deposit123',
        status: 'pending',
        amount: 1000,
        account: 'account123',
        save: jest.fn().mockResolvedValue(true),
      };

      DepositRequest.findById = jest.fn().mockResolvedValue(mockDepositRequest);
      Account.findById = jest.fn().mockResolvedValue({
        _id: 'account123',
        balance: 0,
        save: jest.fn().mockResolvedValue(true),
      });
      AdminData.findOneAndUpdate = jest.fn().mockResolvedValue({});

      await verifyDepositRequest(mockReq, mockRes);

      expect(mockDepositRequest.status).toBe('approved');
      expect(mockDepositRequest.save).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(200);
    });

    it('should return 404 if deposit request not found', async () => {
      mockReq.params.requestId = 'nonexistent';
      DepositRequest.findById = jest.fn().mockResolvedValue(null);

      await verifyDepositRequest(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: 'Deposit request not found',
        })
      );
    });
  });
});

