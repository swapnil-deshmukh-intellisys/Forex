import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";
import profileRoutes from "./routes/profile.routes.js";
import accountRoutes from "./routes/account.routes.js";
import depositRoutes from "./routes/deposit.routes.js";
import withdrawalRoutes from "./routes/withdrawal.routes.js";
import adminRoutes from "./routes/admin.routes.js";

dotenv.config();

const app = express();

// Allowed origins from .env
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map(origin => origin.trim())
  : ["http://localhost:5173", "http://localhost:5174"];

console.log("Allowed origins:", allowedOrigins);

// CORS - More permissive for debugging
app.use(
  cors({
    origin: [
      'https://forex-phi-seven.vercel.app',
      'https://forex-phi-seven.vercel.app/',
      'http://localhost:5173',
      'http://localhost:5174'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    optionsSuccessStatus: 200
  })
);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Health Check
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
  });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/accounts", accountRoutes);
app.use("/api/deposits", depositRoutes);
app.use("/api/withdrawals", withdrawalRoutes);
app.use("/api/admin", adminRoutes);
app.use("/uploads", express.static("uploads"));

app.use(notFound);
app.use(errorHandler);

// Start server AFTER DB connection
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () =>
    console.log(`🚀 Server running on port ${PORT}`)
  );
});
