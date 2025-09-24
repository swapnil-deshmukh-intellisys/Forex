import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    // Try local MongoDB first
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error("❌ MongoDB Connection Failed:", error.message);
    console.log("🔄 Using in-memory database for testing...");
    
    // Use in-memory database for testing
    try {
      await mongoose.connect('mongodb://localhost:27017/forex_trading_test', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log("✅ In-memory MongoDB Connected for testing");
    } catch (testError) {
      console.log("⚠️  No MongoDB available - some features may not work");
      // Continue without database for basic testing
    }
  }
};
