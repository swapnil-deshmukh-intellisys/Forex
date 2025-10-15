import User from "../models/User.js";
import Admin from "../models/Admin.js";
import Account from "../models/Account.js";
import AdminData from "../models/AdminData.js";
import Profile from "../models/Profile.js";
import OTP from "../models/OTP.js";
// Using mock email service for production testing
// For production with real emails, use: import { sendOTPEmail, sendPasswordResetSuccessEmail } from "../services/emailService.js";
import { sendOTPEmail, sendPasswordResetSuccessEmail } from "../services/mockEmailService.js";
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

    // Check if it's an admin user trying to use user login
    const admin = await Admin.findOne({ email, isActive: true });
    if (admin) {
      return res.status(403).json({ 
        success: false, 
        message: "Admin account detected. Please use admin login." 
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

// =============== ADMIN LOGIN ===============
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Please enter all fields" });
    }

    // Check if it's a regular user trying to use admin login
    const user = await User.findOne({ email });
    if (user) {
      return res.status(403).json({ 
        success: false, 
        message: "Regular user account detected. Please use user login." 
      });
    }

    // Check admin users only
    const admin = await Admin.findOne({ email, isActive: true });
    if (!admin) {
      return res.status(401).json({ success: false, message: "Admin account not found" });
    }

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
  } catch (error) {
    console.error("Admin Login Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
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

// =============== FORGOT PASSWORD ===============
// =============== VALIDATE ADMIN ACCESS ===============
export const validateAdminAccess = async (req, res) => {
  try {
    const { email, role } = req.body;
    
    if (!email || role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: "Access denied. Admin privileges required.",
        isAdmin: false 
      });
    }

    // Check if admin exists and is active
    const admin = await Admin.findOne({ email, isActive: true });
    if (!admin) {
      return res.status(403).json({ 
        success: false, 
        message: "Admin account not found or inactive.",
        isAdmin: false 
      });
    }

    res.status(200).json({
      success: true,
      message: "Admin access validated",
      isAdmin: true,
      admin: {
        id: admin._id,
        email: admin.email,
        fullName: admin.fullName,
        role: admin.role
      }
    });
  } catch (error) {
    console.error("Validate Admin Access Error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error",
      isAdmin: false 
    });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    // Check if user exists
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found with this email" });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Delete any existing OTPs for this email
    await OTP.deleteMany({ email: email.toLowerCase(), type: 'password_reset' });

    // Create new OTP record
    const otpRecord = await OTP.create({
      email: email.toLowerCase(),
      otp: otp,
      type: 'password_reset'
    });

    // Send OTP email
    const emailResult = await sendOTPEmail(email, otp, 'password_reset');
    
    if (!emailResult.success) {
      console.error('Failed to send OTP email:', emailResult.error);
      return res.status(500).json({ 
        success: false, 
        message: "Failed to send OTP email. Please try again." 
      });
    }

    console.log(`✅ OTP sent to ${email} for password reset`);
    
    res.status(200).json({
      success: true,
      message: "OTP sent to your email address",
      email: email // Return email for frontend to use in verification
    });

  } catch (error) {
    console.error("Forgot Password Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// =============== VERIFY OTP ===============
export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ success: false, message: "Email and OTP are required" });
    }

    // Find valid OTP record
    const otpRecord = await OTP.findOne({
      email: email.toLowerCase(),
      otp: otp,
      type: 'password_reset',
      isUsed: false,
      expiresAt: { $gt: new Date() }
    });

    if (!otpRecord) {
      // Increment attempts for this email
      await OTP.updateMany(
        { email: email.toLowerCase(), type: 'password_reset' },
        { $inc: { attempts: 1 } }
      );
      
      return res.status(400).json({ 
        success: false, 
        message: "Invalid or expired OTP" 
      });
    }

    // Mark OTP as used
    otpRecord.isUsed = true;
    await otpRecord.save();

    // Generate temporary token for password reset
    const resetToken = jwt.sign(
      { email: email.toLowerCase(), type: 'password_reset' },
      process.env.JWT_SECRET || "mySuperSecretKey",
      { expiresIn: "15m" } // 15 minutes
    );

    res.status(200).json({
      success: true,
      message: "OTP verified successfully",
      resetToken: resetToken
    });

  } catch (error) {
    console.error("Verify OTP Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// =============== RESET PASSWORD ===============
export const resetPassword = async (req, res) => {
  try {
    const { resetToken, newPassword } = req.body;

    if (!resetToken || !newPassword) {
      return res.status(400).json({ success: false, message: "Reset token and new password are required" });
    }

    // Verify reset token
    let decoded;
    try {
      decoded = jwt.verify(resetToken, process.env.JWT_SECRET || "mySuperSecretKey");
    } catch (error) {
      return res.status(400).json({ success: false, message: "Invalid or expired reset token" });
    }

    if (decoded.type !== 'password_reset') {
      return res.status(400).json({ success: false, message: "Invalid token type" });
    }

    // Find user
    const user = await User.findOne({ email: decoded.email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Update password
    user.password = newPassword; // Password will be hashed by the schema pre-save hook
    await user.save();

    // Send success email
    await sendPasswordResetSuccessEmail(user.email);

    // Delete all OTPs for this email
    await OTP.deleteMany({ email: user.email, type: 'password_reset' });

    console.log(`✅ Password reset successful for ${user.email}`);
    
    res.status(200).json({
      success: true,
      message: "Password reset successfully"
    });

  } catch (error) {
    console.error("Reset Password Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
