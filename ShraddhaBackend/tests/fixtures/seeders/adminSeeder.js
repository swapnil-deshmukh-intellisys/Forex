import Admin from '../../../models/Admin.js';
import { createMockAdminData } from '../../utils/mockData.js';

/**
 * Seed admin users for testing
 */
export const seedAdmins = async (count = 2) => {
  const admins = [];
  for (let i = 0; i < count; i++) {
    const adminData = createMockAdminData({
      email: `admin${i}@example.com`,
      fullName: `Admin User ${i + 1}`,
    });
    const admin = await Admin.create(adminData);
    admins.push(admin);
  }
  return admins;
};

/**
 * Seed a single admin
 */
export const seedAdmin = async (overrides = {}) => {
  const adminData = createMockAdminData(overrides);
  return await Admin.create(adminData);
};

/**
 * Clear all admins
 */
export const clearAdmins = async () => {
  await Admin.deleteMany({});
};

