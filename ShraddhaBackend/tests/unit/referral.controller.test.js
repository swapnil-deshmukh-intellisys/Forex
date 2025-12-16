import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import { createReferralLink, getAllReferralLinks, getReferralLinkById, updateReferralLink, deleteReferralLink, toggleReferralLinkStatus, validateReferralCode } from '../../controllers/referral.controller.js';
import ReferralLink from '../../models/ReferralLink.js';
import User from '../../models/User.js';

jest.mock('../../models/ReferralLink.js');
jest.mock('../../models/User.js');

describe('Referral Controller - Unit Tests', () => {
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

  describe('createReferralLink', () => {
    it('should return 400 if customId is missing', async () => {
      mockReq.body = {};

      await createReferralLink(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: 'Custom ID is required',
        })
      );
    });

    it('should return 409 if customId already exists', async () => {
      mockReq.body = { customId: 'EXISTING123' };
      ReferralLink.findOne = jest.fn().mockResolvedValue({
        _id: 'existing123',
        customId: 'EXISTING123',
      });

      await createReferralLink(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(409);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: 'Custom ID already exists',
        })
      );
    });

    it('should create referral link successfully', async () => {
      mockReq.body = { customId: 'NEW123' };
      ReferralLink.findOne = jest.fn().mockResolvedValue(null);
      ReferralLink.create = jest.fn().mockResolvedValue({
        _id: 'referral123',
        customId: 'NEW123',
        link: 'https://www.zerofx.club/?ref=NEW123',
      });

      await createReferralLink(mockReq, mockRes);

      expect(ReferralLink.create).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
        })
      );
    });
  });

  describe('getAllReferralLinks', () => {
    it('should return all referral links', async () => {
      ReferralLink.find = jest.fn().mockReturnValue({
        sort: jest.fn().mockReturnValue({
          select: jest.fn().mockResolvedValue([
            { _id: 'ref1', customId: 'REF1' },
          ]),
        }),
      });

      await getAllReferralLinks(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
        })
      );
    });
  });

  describe('validateReferralCode', () => {
    it('should return 404 if referral code not found', async () => {
      mockReq.params.customId = 'INVALID';
      ReferralLink.findOne = jest.fn().mockResolvedValue(null);

      await validateReferralCode(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
    });

    it('should validate referral code successfully', async () => {
      mockReq.params.customId = 'VALID123';
      ReferralLink.findOne = jest.fn().mockResolvedValue({
        _id: 'ref123',
        customId: 'VALID123',
        isActive: true,
      });

      await validateReferralCode(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
        })
      );
    });
  });
});

