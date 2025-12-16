import request from 'supertest';
import { app } from '../../server.js';
import mongoose from 'mongoose';
import { createTestAdminWithToken, createTestUserWithToken } from '../utils/authHelpers.js';
import { cleanTestDB } from '../utils/dbHelpers.js';

describe('Admin Routes - Integration Tests', () => {
  let adminToken;
  let userToken;

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
    const { token: adminT } = await createTestAdminWithToken();
    const { token: userT } = await createTestUserWithToken();
    adminToken = adminT;
    userToken = userT;
  });

  describe('GET /api/admin/data', () => {
    it('should get admin data with admin authentication', async () => {
      const response = await request(app)
        .get('/api/admin/data')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
    });

    it('should return 401 without authentication', async () => {
      await request(app)
        .get('/api/admin/data')
        .expect(401);
    });
  });

  describe('GET /api/admin/users', () => {
    it('should get all users with admin authentication', async () => {
      const response = await request(app)
        .get('/api/admin/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.users)).toBe(true);
    });
  });

  describe('PUT /api/admin/users/:userId/verify', () => {
    it('should verify user with admin authentication', async () => {
      const { user } = await createTestUserWithToken();
      
      const response = await request(app)
        .put(`/api/admin/users/${user._id}/verify`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ verified: true })
        .expect(200);

      expect(response.body.success).toBe(true);
    });
  });
});

