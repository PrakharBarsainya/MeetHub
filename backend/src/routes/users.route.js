import express from "express";

import {
  login,
  register,
  getUserHistory,
  addToHistory,
} from "../controllers/user.controller.js";

const router = express.Router();

// Register
router.post("/register", register);

// Login
router.post("/login", login);

// Get logged-in user's meeting history
router.get("/get_all_activity", getUserHistory);

// Add meeting to logged-in user's history
router.post("/add_to_activity", addToHistory);

export default router;
