// config/db.js
import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    // Connect using Atlas (or remote) URI
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`✅ MongoDB Connected: ${mongoose.connection.host}`);
  } catch (error) {
    console.error("❌ MongoDB Atlas Connection Failed:", error.message);

    if (process.env.NODE_ENV !== "production") {
      console.log("🔄 Falling back to local MongoDB (dev mode)...");
      try {
        await mongoose.connect("mongodb://localhost:27017/forex_trading_dev", {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        });
        console.log("✅ Connected to local MongoDB");
      } catch (localError) {
        console.error("⚠️  Local MongoDB connection failed:", localError.message);
        console.log("🚫 No database connection available - app may not work properly.");
      }
    } else {
      console.log("🚫 No fallback available in production. Exiting...");
      process.exit(1);
    }
  }
};
