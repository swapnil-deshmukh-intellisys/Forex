import express from "express";
import { signup, login, getProfile, createAdminUser } from "../controllers/auth.controller.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/profile", authMiddleware,getProfile); 
router.post("/create-admin", createAdminUser); // No auth required for creating admin user

export default router;
