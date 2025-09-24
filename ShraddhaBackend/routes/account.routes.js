import express from "express";
import { createAccount, getUserAccounts, getAccountById, deleteAccount } from "../controllers/account.controller.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

router.post("/create", createAccount);
router.get("/", getUserAccounts);
router.get("/:accountId", getAccountById);
router.delete("/:accountId", deleteAccount);

export default router;
