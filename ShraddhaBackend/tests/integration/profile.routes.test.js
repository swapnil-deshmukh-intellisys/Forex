import request from 'supertest';
import { app } from '../../server.js';
import mongoose from 'mongoose';
import { createTestUserWithToken } from '../utils/authHelpers.js';
import { cleanTestDB } from '../utils/dbHelpers.js';

describe('Profile Routes - Integration Tests', () => {
  let authToken;

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
    const { token } = await createTestUserWithToken();
    authToken = token;
  });

  describe('POST /api/profile/save', () => {
    it('should save profile successfully', async () => {
      const response = await request(app)
        .post('/api/profile/save')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          email: 'test@example.com',
          fullName: 'Test User',
          mobileNumber: '1234567890',
        })
        .expect(200);

      expect(response.body.success).toBe(true);
    });

    it('should return 401 without authentication', async () => {
      await request(app)
        .post('/api/profile/save')
        .send({
          email: 'test@example.com',
        })
        .expect(401);
    });
  });

  describe('GET /api/profile', () => {
    it('should get user profile', async () => {
      const response = await request(app)
        .get('/api/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
    });
  });
});

