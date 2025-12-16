import request from 'supertest';
import { app } from '../../server.js';
import mongoose from 'mongoose';
import { createTestUserWithToken } from '../utils/authHelpers.js';
import { cleanTestDB } from '../utils/dbHelpers.js';
import Account from '../../models/Account.js';

describe('Deposit Routes - Integration Tests', () => {
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

    // Create an account for the user
    const account = await Account.create({
      user: userId,
      type: 'Standard',
      status: 'Live',
      initialDeposit: 0,
      balance: 0,
    });
    accountId = account._id.toString();
  });

  describe('POST /api/deposits/submit', () => {
    it('should return 400 if payment proof is missing', async () => {
      await request(app)
        .post('/api/deposits/submit')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          accountId,
          amount: 1000,
          upiApp: 'PhonePe',
        })
        .expect(400);
    });

    it('should return 401 without authentication', async () => {
      await request(app)
        .post('/api/deposits/submit')
        .send({
          accountId,
          amount: 1000,
        })
        .expect(401);
    });
  });

  describe('GET /api/deposits/user', () => {
    it('should get user deposit requests', async () => {
      const response = await request(app)
        .get('/api/deposits/user')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.depositRequests)).toBe(true);
    });
  });
});

