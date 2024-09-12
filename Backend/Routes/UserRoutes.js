import express from "express";
import {
  createUser,
  login,
  getUserDetails,
  logout,
} from "../Controllers/UserController.js";
import { protect } from "../utils/JWT.Token.js";

const router = express.Router();

router.post("/create", createUser);
router.post("/login", login);
router.get("/get-user", protect, getUserDetails);
router.post("/logout", protect, logout);

export default router;
