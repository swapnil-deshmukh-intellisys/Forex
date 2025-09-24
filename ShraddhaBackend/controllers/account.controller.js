import Account from "../models/Account.js";
import User from "../models/User.js";
import AdminData from "../models/AdminData.js";

// =============== CREATE ACCOUNT ===============
export const createAccount = async (req, res) => {
  try {
    const { accountType, status, initialDeposit, leverage } = req.body;
    const userId = req.user.id;

    // Check if user already has an account of this type
    const existingAccount = await Account.findOne({ 
      user: userId, 
      type: accountType, 
      status: status 
    });

    if (existingAccount) {
      return res.status(409).json({ 
        success: false, 
        message: `You already have a ${status} ${accountType} account` 
      });
    }

    // Create new account
    const account = await Account.create({
      user: userId,
      type: accountType,
      status: status,
      initialDeposit: initialDeposit || 0,
      leverage: leverage || '1:500',
      balance: 0  // Always start with zero balance
    });

    // Initialize admin data for this account type if it doesn't exist
    try {
      await AdminData.findOneAndUpdate(
        { accountType },
        {
          accountType,
          balance: 0,  // Always start with zero balance
          currency: '₹',
          equity: 0.00,
          margin: 0.00
        },
        { upsert: true, new: true }
      );
    } catch (adminError) {
      console.error("AdminData update error:", adminError);
      // Continue with account creation even if admin data fails
    }

    res.status(201).json({
      success: true,
      message: `${status} ${accountType} account created successfully`,
      account
    });
  } catch (error) {
    console.error("Create Account Error:", error);
    console.error("Error details:", error.message);
    console.error("Stack trace:", error.stack);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// =============== GET USER ACCOUNTS ===============
export const getUserAccounts = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const accounts = await Account.find({ user: userId }).sort({ createdAt: -1 });
    
    // If user has no accounts, create account for their selected account type
    if (accounts.length === 0) {
      console.log(`📝 No accounts found for user ${userId}, creating account for selected type...`);
      
      // Get user's selected account type
      const user = await User.findById(userId);
      if (user && user.accountType) {
        try {
          await Account.create({
            user: userId,
            type: user.accountType, // Use the account type selected during signup
            status: 'Live',
            initialDeposit: 0,
            leverage: '1:500',
            balance: 0  // Always start with zero balance
          });

          // Initialize admin data for the selected account type if it doesn't exist
          await AdminData.findOneAndUpdate(
            { accountType: user.accountType },
            {
              accountType: user.accountType,
              balance: 0,  // Always start with zero balance
              currency: '₹',
              equity: 0.00,
              margin: 0.00
            },
            { upsert: true, new: true }
          );
          
          console.log(`✅ Created ${user.accountType} account for user ${userId}`);
        } catch (accountError) {
          console.error(`Error creating ${user.accountType} account:`, accountError);
        }
      } else {
        console.log(`⚠️  User ${userId} not found or no account type selected`);
      }
    }
    
    // Get all accounts for the user (including newly created ones)
    const allAccounts = await Account.find({ user: userId }).sort({ createdAt: -1 });
    
    // Get admin data for each account type
    const adminDataMap = {};
    const adminDataList = await AdminData.find({});
    adminDataList.forEach(data => {
      adminDataMap[data.accountType] = data;
    });

    // Merge account data with admin data
    const accountsWithAdminData = allAccounts.map(account => {
      const adminData = adminDataMap[account.type];
      return {
        ...account.toObject(),
        balance: adminData ? adminData.balance : account.balance,
        currency: adminData ? adminData.currency : account.currency,
        equity: adminData ? adminData.equity : account.equity,
        margin: adminData ? adminData.margin : account.margin
      };
    });

    res.status(200).json({
      success: true,
      accounts: accountsWithAdminData
    });
  } catch (error) {
    console.error("Get User Accounts Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// =============== GET ACCOUNT BY ID ===============
export const getAccountById = async (req, res) => {
  try {
    const { accountId } = req.params;
    const userId = req.user.id;

    const account = await Account.findOne({ _id: accountId, user: userId });
    if (!account) {
      return res.status(404).json({ success: false, message: "Account not found" });
    }

    // Get admin data for this account type
    const adminData = await AdminData.findOne({ accountType: account.type });
    
    const accountWithAdminData = {
      ...account.toObject(),
      balance: adminData ? adminData.balance : account.balance,
      currency: adminData ? adminData.currency : account.currency,
      equity: adminData ? adminData.equity : account.equity,
      margin: adminData ? adminData.margin : account.margin
    };

    res.status(200).json({
      success: true,
      account: accountWithAdminData
    });
  } catch (error) {
    console.error("Get Account Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// =============== DELETE ACCOUNT ===============
export const deleteAccount = async (req, res) => {
  try {
    const { accountId } = req.params;
    const userId = req.user.id;

    const account = await Account.findOneAndDelete({ _id: accountId, user: userId });
    if (!account) {
      return res.status(404).json({ success: false, message: "Account not found" });
    }

    res.status(200).json({
      success: true,
      message: "Account deleted successfully"
    });
  } catch (error) {
    console.error("Delete Account Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
