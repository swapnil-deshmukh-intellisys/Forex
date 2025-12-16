import request from 'supertest';
import { app } from '../../server.js';
import mongoose from 'mongoose';
import { createTestUserWithToken, createTestAdminWithToken } from '../utils/authHelpers.js';
import { cleanTestDB } from '../utils/dbHelpers.js';

describe('Referral Routes - Integration Tests', () => {
  let userToken;
  let adminToken;

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
    const { token: userT } = await createTestUserWithToken();
    const { token: adminT } = await createTestAdminWithToken();
    userToken = userT;
    adminToken = adminT;
  });

  describe('POST /api/referrals/track-visitor', () => {
    it('should track visitor without authentication', async () => {
      const response = await request(app)
        .post('/api/referrals/track-visitor')
        .send({
          customId: 'TESTREF123',
        })
        .expect(200);

      expect(response.body.success).toBe(true);
    });
  });

  describe('GET /api/referrals/validate/:customId', () => {
    it('should validate referral code', async () => {
      // First create a referral link
      await request(app)
        .post('/api/referrals/create')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          customId: 'VALID123',
        });

      const response = await request(app)
        .get('/api/referrals/validate/VALID123')
        .expect(200);

      expect(response.body.success).toBe(true);
    });

    it('should return 404 for invalid referral code', async () => {
      await request(app)
        .get('/api/referrals/validate/INVALID123')
        .expect(404);
    });
  });

  describe('POST /api/referrals/create', () => {
    it('should create referral link with authentication', async () => {
      const response = await request(app)
        .post('/api/referrals/create')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          customId: 'NEWREF123',
        })
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.referralLink).toBeDefined();
    });

    it('should return 401 without authentication', async () => {
      await request(app)
        .post('/api/referrals/create')
        .send({
          customId: 'NEWREF123',
        })
        .expect(401);
    });
  });
});

