// Test setup file for Jest
import { jest } from '@jest/globals';

// Increase timeout for database operations
jest.setTimeout(30000);

// Setup before all tests
beforeAll(async () => {
  console.log('✅ Test setup complete (using mocks)');
});

// Cleanup after all tests
afterAll(async () => {
  console.log('✅ Test cleanup complete');
});

