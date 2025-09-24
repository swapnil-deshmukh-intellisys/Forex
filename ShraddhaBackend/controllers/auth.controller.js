import User from "../models/User.js";
import Admin from "../models/Admin.js";
import Account from "../models/Account.js";
import AdminData from "../models/AdminData.js";
import Profile from "../models/Profile.js";
import jwt from "jsonwebtoken";

// =============== SIGNUP ===============
export const signup = async (req, res) => {
  console.log("🚀 SIGNUP FUNCTION CALLED - Starting signup process");
  try {
    const {
      accountType,
      email,
      password,
      repeatPassword,
      fullName,
      fatherName,
      motherName,
      gender,
      dateOfBirth,
      mobileCode,
      mobileNumber,
      country,
      state,
      city,
      postalCode,
      streetAddress,
      termsAccepted,
      privacyAccepted
    } = req.body;

    if (!accountType || !email || !password || !repeatPassword || !fullName || !termsAccepted || !privacyAccepted) {
      return res.status(400).json({ success: false, message: "Please fill all required fields" });
    }

    if (password !== repeatPassword) {
      return res.status(400).json({ success: false, message: "Passwords do not match" });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ success: false, message: "User already exists" });
    }

    // ✅ Save raw password — hashing is handled by schema
    const user = await User.create({
      accountType,
      email,
      password,
      fullName,
      fatherName,
      motherName,
      gender,
      dateOfBirth,
      mobileCode,
      mobileNumber,
      country,
      state,
      city,
      postalCode,
      streetAddress,
      termsAccepted,
      privacyAccepted,
    });

    // ✅ Automatically create account for the selected account type
    try {
      console.log(`🔄 Creating ${accountType} account for user: ${user.email} (ID: ${user._id})`);
      
      // Create account for the selected account type with Live status
      console.log("🔄 Creating account with data:", {
        user: user._id,
        type: accountType,
        status: 'Live',
        initialDeposit: 0,
        leverage: '1:500',
        balance: 0
      });
      
      const newAccount = await Account.create({
        user: user._id,
        type: accountType, // Use the account type selected during signup
        status: 'Live',
        initialDeposit: 0,
        leverage: '1:500',
        balance: 0  // Always start with zero balance
      });

      console.log(`✅ Account created successfully:`, {
        accountId: newAccount._id,
        accountNumber: newAccount.accountNumber,
        type: newAccount.type,
        status: newAccount.status,
        balance: newAccount.balance
      });

      // Initialize admin data for the selected account type if it doesn't exist
      const adminData = await AdminData.findOneAndUpdate(
        { accountType: accountType },
        {
          accountType: accountType,
          balance: 0,  // Always start with zero balance
          currency: '₹',
          equity: 0.00,
          margin: 0.00
        },
        { upsert: true, new: true }
      );

      console.log(`✅ AdminData initialized for ${accountType}:`, adminData);
    } catch (accountError) {
      console.error("❌ Account creation error during signup:", accountError);
      console.error("Error details:", {
        message: accountError.message,
        name: accountError.name,
        code: accountError.code,
        errors: accountError.errors,
        stack: accountError.stack
      });
      // Continue with user creation even if account creation fails
      // The user can still create accounts manually later
    }

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: { id: user._id, email: user.email, fullName: user.fullName },
    });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// =============== LOGIN ===============
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Please enter all fields" });
    }

    // First check if it's an admin user
    const admin = await Admin.findOne({ email, isActive: true });
    if (admin) {
      const isMatch = await admin.matchPassword(password);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: "Invalid email or password" });
      }

      // Update last login
      admin.lastLogin = new Date();
      await admin.save();

      // Generate token for admin
      const token = jwt.sign({ id: admin._id, role: 'admin' }, process.env.JWT_SECRET || "mySuperSecretKey", {
        expiresIn: "1d",
      });

      return res.status(200).json({
        success: true,
        message: "Admin login successful",
        token,
        user: {
          id: admin._id,
          fullName: admin.fullName,
          email: admin.email,
          role: admin.role,
        },
      });
    }

    // If not admin, check regular users
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: "User does not exist" });
    }

    // ✅ Compare password properly
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    // ✅ Generate token for regular user
    const token = jwt.sign({ id: user._id, role: 'user' }, process.env.JWT_SECRET || "mySuperSecretKey", {
      expiresIn: "1d",
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: 'user',
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Get profile data if it exists
    const Profile = (await import("../models/Profile.js")).default;
    // Try both ObjectId and String lookup since existing Profile records might have String user field
    let profile = await Profile.findOne({ user: user._id });
    
    if (!profile) {
      // Try with String user field (for existing records)
      profile = await Profile.findOne({ user: user._id.toString() });
      
      if (profile) {
        // Update the Profile record to use ObjectId instead of String
        await Profile.findByIdAndUpdate(profile._id, { user: user._id });
      }
    }
    

    res.status(200).json({
      success: true,
      user: {
        ...user._doc,
        dateOfBirth: user.dateOfBirth
          ? user.dateOfBirth.toISOString().split("T")[0]
          : null,
        // Override with profile data if it exists (Profile data takes precedence)
        fullName: profile?.fullName || user.fullName,
        fatherName: profile?.fatherName || user.fatherName,
        motherName: profile?.motherName || user.motherName,
        gender: profile?.gender || user.gender,
        dateOfBirth: profile?.dateOfBirth || (user.dateOfBirth ? user.dateOfBirth.toISOString().split("T")[0] : null),
        mobileCode: profile?.mobileCode || user.mobileCode,
        mobileNumber: profile?.mobileNumber || user.mobileNumber,
        country: profile?.country || user.country,
        state: profile?.state || user.state,
        city: profile?.city || user.city,
        postalCode: profile?.postalCode || user.postalCode,
        streetAddress: profile?.streetAddress || user.streetAddress,
        // Include additional profile data
        profilePicture: profile?.profilePicture || null,
        idDocument: profile?.panDocument || null,
        addressProof: profile?.aadharFront || null,
        aadharBack: profile?.aadharBack || null,
        bankAccount: profile?.bankAccount || null,
        bankName: profile?.bankName || null,
        bankAddress: profile?.bankAddress || null,
        swiftCode: profile?.swiftCode || null,
        accountName: profile?.accountName || null,
        upiId: profile?.upiId || null,
        upiApp: profile?.upiApp || null
      },
    });
  } catch (error) {
    console.error("Get Profile Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// =============== CREATE ADMIN USER ===============
export const createAdminUser = async (req, res) => {
  try {
    // Check if admin user already exists
    const existingAdmin = await Admin.findOne({ email: 'admin@forex.com' });
    if (existingAdmin) {
      return res.status(409).json({ 
        success: false, 
        message: "Admin user already exists",
        user: { 
          id: existingAdmin._id, 
          email: existingAdmin.email, 
          fullName: existingAdmin.fullName 
        }
      });
    }

    // Create admin user in Admin collection
    const adminUser = await Admin.create({
      email: 'admin@forex.com',
      password: 'admin123',
      fullName: 'Admin User',
      role: 'admin',
      isActive: true,
      permissions: {
        canManageUsers: true,
        canManageAccounts: true,
        canViewReports: true,
        canManageSettings: true
      }
    });

    res.status(201).json({
      success: true,
      message: "Admin user created successfully",
      user: { 
        id: adminUser._id, 
        email: adminUser.email, 
        fullName: adminUser.fullName 
      },
    });
  } catch (error) {
    console.error("Create Admin User Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
