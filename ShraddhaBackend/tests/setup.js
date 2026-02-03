// Test setup file for Jest
import { jest } from '@jest/globals';

// Increase timeout for database operations
jest.setTimeout(30000);

// Mock mongoose
jest.unstable_mockModule('mongoose', () => ({
  default: {
    connect: jest.fn().mockResolvedValue({}),
    connection: {
      close: jest.fn().mockResolvedValue({}),
      readyState: 1,
    },
    Schema: class Schema {
      constructor(definition) { this.definition = definition; }
    },
    model: jest.fn().mockReturnValue({
      find: jest.fn().mockReturnThis(),
      findOne: jest.fn().mockReturnThis(),
      findById: jest.fn().mockReturnThis(),
      create: jest.fn().mockResolvedValue({}),
      updateOne: jest.fn().mockResolvedValue({}),
      deleteOne: jest.fn().mockResolvedValue({}),
      sort: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue([]),
    }),
  },
}));

// Setup before all tests
beforeAll(async () => {
  console.log('✅ Test setup complete (using mocks)');
});

// Cleanup after all tests
afterAll(async () => {
  console.log('✅ Test cleanup complete');
});

