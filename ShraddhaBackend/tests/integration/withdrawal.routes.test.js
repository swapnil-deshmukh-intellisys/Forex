import request from 'supertest';
import { app } from '../../server.js';
import mongoose from 'mongoose';
import { createTestUserWithToken } from '../utils/authHelpers.js';
import { cleanTestDB } from '../utils/dbHelpers.js';
import Account from '../../models/Account.js';

describe('Withdrawal Routes - Integration Tests', () => {
  let authToken;
  let userId;
  let accountId;

  beforeAll(async () => {
    const testDbUrl = process.env.TEST_DATABASE_URL || 'mongodb://localhost:27017/forex_test';
    await mongoose.connect(testDbUrl);
  });

  afterAll(async () => {
    await cleanTestDB();
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await cleanTestDB();
    const { user, token } = await createTestUserWithToken();
    authToken = token;
    userId = user._id;

    // Create an account with balance
    const account = await Account.create({
      user: userId,
      type: 'Standard',
      status: 'Live',
      initialDeposit: 0,
      balance: 10000,
    });
    accountId = account._id.toString();
  });

  describe('POST /api/withdrawals/submit', () => {
    it('should submit withdrawal request successfully', async () => {
      const response = await request(app)
        .post('/api/withdrawals/submit')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          accountId,
          accountType: 'Standard',
          amount: 1000,
          method: 'bank',
          accountDetails: {
            bankAccount: '1234567890',
            bankName: 'Test Bank',
            ifscCode: 'TEST0001234',
          },
        })
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.withdrawalRequest).toBeDefined();
    });

    it('should return 400 for invalid amount', async () => {
      await request(app)
        .post('/api/withdrawals/submit')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          accountId,
          accountType: 'Standard',
          amount: -100,
          method: 'bank',
        })
        .expect(400);
    });

    it('should return 401 without authentication', async () => {
      await request(app)
        .post('/api/withdrawals/submit')
        .send({
          accountId,
          amount: 1000,
        })
        .expect(401);
    });
  });

  describe('GET /api/withdrawals/user', () => {
    it('should get user withdrawal requests', async () => {
      const response = await request(app)
        .get('/api/withdrawals/user')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.withdrawalRequests)).toBe(true);
    });
  });
});

