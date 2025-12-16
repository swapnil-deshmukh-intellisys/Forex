// Test setup file for Jest
import mongoose from 'mongoose';

// Increase timeout for database operations
jest.setTimeout(10000);

// Setup before all tests
beforeAll(async () => {
  // Connect to test database
  // Use a separate test database URL from environment or default
  const testDbUrl = process.env.TEST_DATABASE_URL || 'mongodb://localhost:27017/forex_test';
  
  try {
    await mongoose.connect(testDbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Test database connected');
  } catch (error) {
    console.error('❌ Test database connection failed:', error);
  }
});

// Cleanup after all tests
afterAll(async () => {
  // Close database connection
  await mongoose.connection.close();
  console.log('✅ Test database connection closed');
});

// Clean up database between tests (optional - can be done per test suite)
afterEach(async () => {
  // Uncomment if you want to clean database after each test
  // const collections = mongoose.connection.collections;
  // for (const key in collections) {
  //   await collections[key].deleteMany({});
  // }
});

