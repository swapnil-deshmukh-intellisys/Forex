import request from 'supertest';
import { app } from '../../server.js';
import mongoose from 'mongoose';
import { createTestUserWithToken, createUserAuthHeader } from '../utils/authHelpers.js';
import { cleanTestDB } from '../utils/dbHelpers.js';

describe('Account Routes - Integration Tests', () => {
  let authToken;
  let userId;

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
    userId = user._id.toString();
  });

  describe('POST /api/accounts/create', () => {
    it('should create account successfully', async () => {
      const response = await request(app)
        .post('/api/accounts/create')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          accountType: 'Standard',
          status: 'Live',
          initialDeposit: 1000,
          leverage: '1:500',
        })
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.account).toBeDefined();
      expect(response.body.account.type).toBe('Standard');
    });

    it('should return 401 without authentication', async () => {
      await request(app)
        .post('/api/accounts/create')
        .send({
          accountType: 'Standard',
          status: 'Live',
        })
        .expect(401);
    });
  });

  describe('GET /api/accounts', () => {
    it('should get user accounts', async () => {
      const response = await request(app)
        .get('/api/accounts')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.accounts)).toBe(true);
    });
  });
});

