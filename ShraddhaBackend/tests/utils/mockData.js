import mongoose from 'mongoose';

/**
 * Mock data factories for all models
 */

/**
 * Create mock user data
 */
export const createMockUserData = (overrides = {}) => {
  return {
    accountType: 'demo',
    email: `test${Date.now()}@example.com`,
    password: 'TestPassword123!',
    fullName: 'Test User',
    fatherName: 'Father Name',
    motherName: 'Mother Name',
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
    verified: false,
    ...overrides,
  };
};

/**
 * Create mock account data
 */
export const createMockAccountData = (overrides = {}) => {
  return {
    user: new mongoose.Types.ObjectId(),
    type: 'Standard',
    status: 'Live',
    balance: 10000.00,
    currency: '₹',
    equity: 10000.00,
    margin: 0.00,
    leverage: '1:500',
    initialDeposit: 10000.00,
    isActive: true,
    ...overrides,
  };
};

/**
 * Create mock deposit request data
 */
export const createMockDepositRequestData = (overrides = {}) => {
  return {
    user: new mongoose.Types.ObjectId(),
    account: new mongoose.Types.ObjectId(),
    amount: 5000.00,
    paymentMethod: 'UPI',
    transactionId: `TXN${Date.now()}`,
    status: 'pending',
    paymentProof: '/uploads/test.jpg',
    ...overrides,
  };
};

/**
 * Create mock withdrawal request data
 */
export const createMockWithdrawalRequestData = (overrides = {}) => {
  return {
    user: new mongoose.Types.ObjectId(),
    account: new mongoose.Types.ObjectId(),
    amount: 2000.00,
    bankName: 'Test Bank',
    accountNumber: '1234567890',
    ifscCode: 'TEST0001234',
    accountHolderName: 'Test User',
    status: 'pending',
    ...overrides,
  };
};

/**
 * Create mock profile data
 */
export const createMockProfileData = (overrides = {}) => {
  return {
    user: new mongoose.Types.ObjectId(),
    firstName: 'Test',
    lastName: 'User',
    phone: '+911234567890',
    address: '123 Test Street',
    city: 'Mumbai',
    state: 'Maharashtra',
    country: 'India',
    postalCode: '400001',
    ...overrides,
  };
};

/**
 * Create mock referral link data
 */
export const createMockReferralLinkData = (overrides = {}) => {
  return {
    user: new mongoose.Types.ObjectId(),
    customId: `REF${Date.now()}`,
    isActive: true,
    signupCount: 0,
    visitorCount: 0,
    ...overrides,
  };
};

/**
 * Create mock admin data
 */
export const createMockAdminData = (overrides = {}) => {
  return {
    email: `admin${Date.now()}@example.com`,
    password: 'AdminPassword123!',
    fullName: 'Admin User',
    role: 'admin',
    isActive: true,
    ...overrides,
  };
};

/**
 * Create mock OTP data
 */
export const createMockOTPData = (overrides = {}) => {
  return {
    email: `test${Date.now()}@example.com`,
    otp: '123456',
    expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
    used: false,
    ...overrides,
  };
};

/**
 * Create mock admin data (AdminData model)
 */
export const createMockAdminDataModel = (overrides = {}) => {
  return {
    accountTypes: ['Standard', 'Platinum', 'Premium', 'Demo'],
    depositMethods: ['UPI', 'Bank Transfer', 'Credit Card'],
    withdrawalMethods: ['Bank Transfer', 'UPI'],
    minDeposit: 1000,
    maxDeposit: 1000000,
    minWithdrawal: 500,
    maxWithdrawal: 500000,
    ...overrides,
  };
};

/**
 * Create array of mock data
 */
export const createMockArray = (factory, count = 3, overrides = {}) => {
  return Array.from({ length: count }, (_, index) =>
    factory({ ...overrides, _id: new mongoose.Types.ObjectId() })
  );
};

