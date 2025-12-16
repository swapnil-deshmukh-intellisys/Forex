import jwt from 'jsonwebtoken';
import User from '../../models/User.js';
import Admin from '../../models/Admin.js';

/**
 * Authentication helper functions for testing
 */

/**
 * Create a JWT token for a user
 */
export const createAuthToken = (userId, email = 'test@example.com') => {
  const JWT_SECRET = process.env.JWT_SECRET || 'test_jwt_secret';
  return jwt.sign(
    { userId, email },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

/**
 * Create a JWT token for an admin
 */
export const createAdminToken = (adminId, email = 'admin@example.com') => {
  const JWT_SECRET = process.env.JWT_SECRET || 'test_jwt_secret';
  return jwt.sign(
    { adminId, email, role: 'admin' },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

/**
 * Create authorization header with token
 */
export const createAuthHeader = (token) => {
  return {
    Authorization: `Bearer ${token}`,
  };
};

/**
 * Create authorization header for user
 */
export const createUserAuthHeader = (userId, email) => {
  const token = createAuthToken(userId, email);
  return createAuthHeader(token);
};

/**
 * Create authorization header for admin
 */
export const createAdminAuthHeader = (adminId, email) => {
  const token = createAdminToken(adminId, email);
  return createAuthHeader(token);
};

/**
 * Create a test user and return token
 */
export const createTestUserWithToken = async (userData = {}) => {
  const UserModel = (await import('../../models/User.js')).default;
  const defaultData = {
    accountType: 'demo',
    email: `test${Date.now()}@example.com`,
    password: 'TestPassword123!',
    fullName: 'Test User',
    fatherName: 'Father',
    motherName: 'Mother',
    gender: 'Male',
    dateOfBirth: new Date('1990-01-01'),
    mobileCode: '+91',
    mobileNumber: '1234567890',
    country: 'India',
    state: 'Maharashtra',
    city: 'Mumbai',
    postalCode: '400001',
    streetAddress: '123 Test Street',
    termsAccepted: true,
    privacyAccepted: true,
    ...userData,
  };

  const user = await UserModel.create(defaultData);
  const token = createAuthToken(user._id.toString(), user.email);
  
  return { user, token };
};

/**
 * Create a test admin and return token
 */
export const createTestAdminWithToken = async (adminData = {}) => {
  const AdminModel = (await import('../../models/Admin.js')).default;
  const defaultData = {
    email: `admin${Date.now()}@example.com`,
    password: 'AdminPassword123!',
    fullName: 'Admin User',
    role: 'admin',
    isActive: true,
    ...adminData,
  };

  const admin = await AdminModel.create(defaultData);
  const token = createAdminToken(admin._id.toString(), admin.email);
  
  return { admin, token };
};

/**
 * Verify a token
 */
export const verifyToken = (token) => {
  const JWT_SECRET = process.env.JWT_SECRET || 'test_jwt_secret';
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

/**
 * Decode a token without verification
 */
export const decodeToken = (token) => {
  try {
    return jwt.decode(token);
  } catch (error) {
    return null;
  }
};

/**
 * Create mock request with authentication
 */
export const createAuthenticatedRequest = (userId, email, overrides = {}) => {
  const token = createAuthToken(userId, email);
  return {
    headers: {
      authorization: `Bearer ${token}`,
      ...overrides.headers,
    },
    user: {
      userId,
      email,
    },
    ...overrides,
  };
};

/**
 * Create mock request with admin authentication
 */
export const createAdminAuthenticatedRequest = (adminId, email, overrides = {}) => {
  const token = createAdminToken(adminId, email);
  return {
    headers: {
      authorization: `Bearer ${token}`,
      ...overrides.headers,
    },
    user: {
      adminId,
      email,
      role: 'admin',
    },
    ...overrides,
  };
};

