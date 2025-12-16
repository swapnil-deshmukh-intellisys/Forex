/**
 * Mock data factories for testing
 */

/**
 * Create a mock user object
 */
export const createMockUser = (overrides = {}) => ({
  _id: 'user123',
  email: 'test@example.com',
  fullName: 'Test User',
  accountType: 'demo',
  verified: true,
  createdAt: new Date('2024-01-01'),
  ...overrides,
});

/**
 * Create a mock account object
 */
export const createMockAccount = (overrides = {}) => ({
  _id: 'account123',
  user: 'user123',
  type: 'Standard',
  status: 'Live',
  accountNumber: 'LIVE123456',
  balance: 10000.00,
  currency: '₹',
  equity: 10000.00,
  margin: 0.00,
  leverage: '1:500',
  initialDeposit: 10000.00,
  isActive: true,
  createdAt: new Date('2024-01-01'),
  ...overrides,
});

/**
 * Create a mock deposit request
 */
export const createMockDepositRequest = (overrides = {}) => ({
  _id: 'deposit123',
  user: 'user123',
  account: 'account123',
  amount: 5000.00,
  paymentMethod: 'UPI',
  transactionId: 'TXN123456',
  status: 'pending',
  paymentProof: '/uploads/proof.jpg',
  createdAt: new Date('2024-01-01'),
  ...overrides,
});

/**
 * Create a mock withdrawal request
 */
export const createMockWithdrawalRequest = (overrides = {}) => ({
  _id: 'withdrawal123',
  user: 'user123',
  account: 'account123',
  amount: 2000.00,
  bankName: 'Test Bank',
  accountNumber: '1234567890',
  ifscCode: 'TEST0001234',
  status: 'pending',
  createdAt: new Date('2024-01-01'),
  ...overrides,
});

/**
 * Create a mock profile object
 */
export const createMockProfile = (overrides = {}) => ({
  _id: 'profile123',
  user: 'user123',
  firstName: 'Test',
  lastName: 'User',
  phone: '+911234567890',
  address: '123 Test Street',
  city: 'Test City',
  state: 'Test State',
  country: 'India',
  postalCode: '123456',
  ...overrides,
});

/**
 * Create a mock referral link
 */
export const createMockReferralLink = (overrides = {}) => ({
  _id: 'referral123',
  user: 'user123',
  customId: 'TESTREF123',
  isActive: true,
  signupCount: 0,
  visitorCount: 0,
  createdAt: new Date('2024-01-01'),
  ...overrides,
});

/**
 * Create a mock admin user
 */
export const createMockAdmin = (overrides = {}) => ({
  _id: 'admin123',
  email: 'admin@example.com',
  fullName: 'Admin User',
  role: 'admin',
  isActive: true,
  createdAt: new Date('2024-01-01'),
  ...overrides,
});

/**
 * Create mock API response
 */
export const createMockApiResponse = (data, success = true, message = '') => ({
  success,
  message,
  data,
});

/**
 * Create mock error response
 */
export const createMockErrorResponse = (message = 'An error occurred', status = 400) => ({
  success: false,
  message,
  status,
});

/**
 * Create mock signup data
 */
export const createMockSignupData = (overrides = {}) => ({
  accountType: 'demo',
  email: 'newuser@example.com',
  password: 'TestPassword123!',
  repeatPassword: 'TestPassword123!',
  fullName: 'New User',
  fatherName: 'Father Name',
  motherName: 'Mother Name',
  gender: 'Male',
  dateOfBirth: '1990-01-01',
  mobileCode: '+91',
  mobileNumber: '1234567890',
  country: 'India',
  state: 'Maharashtra',
  city: 'Mumbai',
  postalCode: '400001',
  streetAddress: '123 Test Street',
  termsAccepted: true,
  privacyAccepted: true,
  ...overrides,
});

/**
 * Create mock login data
 */
export const createMockLoginData = (overrides = {}) => ({
  email: 'test@example.com',
  password: 'TestPassword123!',
  ...overrides,
});

/**
 * Create mock token
 */
export const createMockToken = (userId = 'user123') => {
  // Simple mock token (not a real JWT)
  return `mock.token.${userId}.${Date.now()}`;
};

/**
 * Create mock session storage data
 */
export const createMockSessionStorage = () => ({
  token: createMockToken(),
  userEmail: 'test@example.com',
  user: JSON.stringify(createMockUser()),
});

/**
 * Create mock local storage data
 */
export const createMockLocalStorage = () => ({
  currentPage: 'home',
  theme: 'light',
  selectedAccount: JSON.stringify(createMockAccount()),
});

/**
 * Create array of mock items
 */
export const createMockArray = (factory, count = 3, overrides = {}) => {
  return Array.from({ length: count }, (_, index) =>
    factory({ ...overrides, _id: `${overrides._id || 'item'}${index + 1}` })
  );
};

