import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../server.js';

describe('Auth Routes - Integration Tests', () => {
  beforeAll(async () => {
    // Connect to test database
    const testDbUrl = process.env.TEST_DATABASE_URL || 'mongodb://localhost:27017/forex_test';
    await mongoose.connect(testDbUrl);
  });

  afterAll(async () => {
    // Clean up: remove test data
    await mongoose.connection.db.dropDatabase();
    await mongoose.connection.close();
  });

  describe('POST /api/auth/signup', () => {
    it('should create a new user successfully', async () => {
      const userData = {
        accountType: 'demo',
        email: `test${Date.now()}@example.com`,
        password: 'TestPassword123!',
        repeatPassword: 'TestPassword123!',
        fullName: 'Test User',
        termsAccepted: true,
        privacyAccepted: true,
      };

      const response = await request(app)
        .post('/api/auth/signup')
        .send(userData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.token).toBeDefined();
      expect(response.body.user).toBeDefined();
      expect(response.body.user.email).toBe(userData.email);
    });

    it('should return 400 for missing required fields', async () => {
      const response = await request(app)
        .post('/api/auth/signup')
        .send({
          email: 'test@example.com',
          // Missing other required fields
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('required');
    });

    it('should return 409 for duplicate email', async () => {
      const userData = {
        accountType: 'demo',
        email: 'duplicate@example.com',
        password: 'TestPassword123!',
        repeatPassword: 'TestPassword123!',
        fullName: 'Test User',
        termsAccepted: true,
        privacyAccepted: true,
      };

      // Create first user
      await request(app)
        .post('/api/auth/signup')
        .send(userData)
        .expect(201);

      // Try to create duplicate
      const response = await request(app)
        .post('/api/auth/signup')
        .send(userData)
        .expect(409);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('already exists');
    });
  });

  describe('POST /api/auth/login', () => {
    const testUser = {
      accountType: 'demo',
      email: `login${Date.now()}@example.com`,
      password: 'TestPassword123!',
      repeatPassword: 'TestPassword123!',
      fullName: 'Login Test User',
      termsAccepted: true,
      privacyAccepted: true,
    };

    beforeAll(async () => {
      // Create a user for login tests
      await request(app)
        .post('/api/auth/signup')
        .send(testUser);
    });

    it('should login successfully with correct credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password,
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.token).toBeDefined();
      expect(response.body.user).toBeDefined();
    });

    it('should return 401 for incorrect password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: 'WrongPassword123!',
        })
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Invalid credentials');
    });

    it('should return 401 for non-existent user', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'TestPassword123!',
        })
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Invalid credentials');
    });
  });
});

