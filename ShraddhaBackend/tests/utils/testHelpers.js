import mongoose from 'mongoose';

/**
 * Test helper functions for common test operations
 */

/**
 * Generate a random email for testing
 */
export const generateTestEmail = (prefix = 'test') => {
  return `${prefix}${Date.now()}${Math.random().toString(36).substring(7)}@example.com`;
};

/**
 * Generate a random string
 */
export const generateRandomString = (length = 10) => {
  return Math.random().toString(36).substring(2, length + 2);
};

/**
 * Generate a random number
 */
export const generateRandomNumber = (min = 1000, max = 9999) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Create a test user ID
 */
export const createTestUserId = () => {
  return new mongoose.Types.ObjectId();
};

/**
 * Create a test account ID
 */
export const createTestAccountId = () => {
  return new mongoose.Types.ObjectId();
};

/**
 * Wait for a specified amount of time
 */
export const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Create a mock request object
 */
export const createMockRequest = (overrides = {}) => {
  return {
    body: {},
    params: {},
    query: {},
    headers: {},
    user: null,
    file: null,
    files: null,
    ...overrides,
  };
};

/**
 * Create a mock response object
 */
export const createMockResponse = () => {
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    send: jest.fn().mockReturnThis(),
    cookie: jest.fn().mockReturnThis(),
    clearCookie: jest.fn().mockReturnThis(),
    redirect: jest.fn().mockReturnThis(),
    setHeader: jest.fn().mockReturnThis(),
  };
  return res;
};

/**
 * Create a mock next function
 */
export const createMockNext = () => {
  return jest.fn();
};

/**
 * Create a complete mock Express request/response/next setup
 */
export const createMockExpressContext = (overrides = {}) => {
  return {
    req: createMockRequest(overrides.req),
    res: createMockResponse(),
    next: createMockNext(),
    ...overrides,
  };
};

/**
 * Assert that a response has the expected structure
 */
export const expectSuccessResponse = (response, expectedData = null) => {
  expect(response.json).toHaveBeenCalled();
  const callArgs = response.json.mock.calls[0][0];
  expect(callArgs.success).toBe(true);
  if (expectedData) {
    expect(callArgs).toMatchObject(expectedData);
  }
};

/**
 * Assert that a response has an error structure
 */
export const expectErrorResponse = (response, statusCode = 400, message = null) => {
  expect(response.status).toHaveBeenCalledWith(statusCode);
  expect(response.json).toHaveBeenCalled();
  const callArgs = response.json.mock.calls[0][0];
  expect(callArgs.success).toBe(false);
  if (message) {
    expect(callArgs.message).toContain(message);
  }
};

/**
 * Create a date in the past
 */
export const createPastDate = (daysAgo = 1) => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date;
};

/**
 * Create a date in the future
 */
export const createFutureDate = (daysAhead = 1) => {
  const date = new Date();
  date.setDate(date.getDate() + daysAhead);
  return date;
};

/**
 * Check if two dates are the same day
 */
export const isSameDay = (date1, date2) => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

/**
 * Create a mock file object for multer
 */
export const createMockFile = (overrides = {}) => {
  return {
    fieldname: 'paymentProof',
    originalname: 'test.jpg',
    encoding: '7bit',
    mimetype: 'image/jpeg',
    size: 1024,
    buffer: Buffer.from('fake image data'),
    ...overrides,
  };
};

