import mongoose from 'mongoose';
import User from '../../../models/User.js';
import Account from '../../../models/Account.js';
import Admin from '../../../models/Admin.js';
import DepositRequest from '../../../models/DepositRequest.js';
import WithdrawalRequest from '../../../models/WithdrawalRequest.js';
import Profile from '../../../models/Profile.js';
import ReferralLink from '../../../models/ReferralLink.js';
import OTP from '../../../models/OTP.js';
import AdminData from '../../../models/AdminData.js';

/**
 * Clean all collections in the test database
 */
export const cleanAllCollections = async () => {
  if (mongoose.connection.readyState !== 0) {
    await User.deleteMany({});
    await Account.deleteMany({});
    await Admin.deleteMany({});
    await DepositRequest.deleteMany({});
    await WithdrawalRequest.deleteMany({});
    await Profile.deleteMany({});
    await ReferralLink.deleteMany({});
    await OTP.deleteMany({});
    await AdminData.deleteMany({});
  }
};

/**
 * Clean specific collections
 */
export const cleanCollections = async (collectionNames) => {
  const collections = {
    users: User,
    accounts: Account,
    admins: Admin,
    depositRequests: DepositRequest,
    withdrawalRequests: WithdrawalRequest,
    profiles: Profile,
    referralLinks: ReferralLink,
    otps: OTP,
    adminData: AdminData,
  };

  for (const name of collectionNames) {
    if (collections[name]) {
      await collections[name].deleteMany({});
    }
  }
};

/**
 * Clean user-related collections
 */
export const cleanUserData = async () => {
  await User.deleteMany({});
  await Account.deleteMany({});
  await Profile.deleteMany({});
  await DepositRequest.deleteMany({});
  await WithdrawalRequest.deleteMany({});
};

/**
 * Clean admin-related collections
 */
export const cleanAdminData = async () => {
  await Admin.deleteMany({});
  await AdminData.deleteMany({});
};

