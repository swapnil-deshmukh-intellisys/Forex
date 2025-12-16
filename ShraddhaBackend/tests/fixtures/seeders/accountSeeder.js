import Account from '../../../models/Account.js';
import User from '../../../models/User.js';
import { createMockAccountData } from '../../utils/mockData.js';

/**
 * Seed accounts for testing
 */
export const seedAccounts = async (userId, count = 3) => {
  const accounts = [];
  const accountTypes = ['Standard', 'Platinum', 'Premium'];
  
  for (let i = 0; i < count; i++) {
    const accountData = createMockAccountData({
      user: userId,
      type: accountTypes[i] || 'Standard',
      status: i % 2 === 0 ? 'Live' : 'Demo',
      balance: (i + 1) * 1000,
    });
    const account = await Account.create(accountData);
    accounts.push(account);
  }
  return accounts;
};

/**
 * Seed a single account
 */
export const seedAccount = async (userId, overrides = {}) => {
  const accountData = createMockAccountData({
    user: userId,
    ...overrides,
  });
  return await Account.create(accountData);
};

/**
 * Clear all accounts
 */
export const clearAccounts = async () => {
  await Account.deleteMany({});
};

