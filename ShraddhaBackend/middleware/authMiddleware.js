import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  console.log(`🔐 Auth middleware called for: ${req.method} ${req.path}`);
  const token = req.headers.authorization?.split(" ")[1];
  console.log(`🔑 Token present: ${!!token}`);

  // Special case for admin withdrawal requests - allow access without token
  if (req.path === '/admin' && req.method === 'GET') {
    console.log("🔓 Allowing admin withdrawal access without authentication");
    req.user = { id: 'admin', role: 'admin' }; // Mock admin user
    return next();
  }

  if (!token) {
    console.log("❌ No token provided");
    return res
      .status(401)
      .json({ success: false, message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // ✅ Save decoded user info for later use
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid or expired token." });
  }
};

export default authMiddleware;
