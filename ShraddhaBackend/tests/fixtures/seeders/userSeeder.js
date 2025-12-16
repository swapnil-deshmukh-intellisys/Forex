import User from '../../../models/User.js';
import { createMockUserData } from '../../utils/mockData.js';

/**
 * Seed users for testing
 */
export const seedUsers = async (count = 5) => {
  const users = [];
  for (let i = 0; i < count; i++) {
    const userData = createMockUserData({
      email: `testuser${i}@example.com`,
      fullName: `Test User ${i + 1}`,
    });
    const user = await User.create(userData);
    users.push(user);
  }
  return users;
};

/**
 * Seed a single user
 */
export const seedUser = async (overrides = {}) => {
  const userData = createMockUserData(overrides);
  return await User.create(userData);
};

/**
 * Clear all users
 */
export const clearUsers = async () => {
  await User.deleteMany({});
};

