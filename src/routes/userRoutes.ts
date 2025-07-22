import express from "express";
import {
  forgotPassword,
  getUserProfile,
  loginUser,
  logoutUser,
  registerUser,
  resetPassword,
  verifyUser,
} from "../controllers/userController";
import isAuthenticated from "../middlewares/isAuthenticated";

const router = express.Router();

//register user
router.post("/register", registerUser);

//verify user email
router.get("/email_verify/:userId/:token", verifyUser);

//get profile
router.get("/profile", isAuthenticated, getUserProfile);

//login user
router.post("/login", loginUser);

//logout user
router.get("/logout", logoutUser);

//forgot password
router.get("/forgot_password", forgotPassword);

//reset password
router.post("/reset_password/:resetToken", resetPassword);


export default router;
