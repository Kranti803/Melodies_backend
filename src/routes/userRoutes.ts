import express,{Request,Response} from "express";
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
import isAdmin from "../middlewares/isAdmin";
import extractAudioMetaData from "../middlewares/extractAudioMetaData";
import upload from "../middlewares/audioUpload";

const router = express.Router();

//register user
router.post("/register", registerUser);

//verify user email
router.get("/email_verify/:userId/:token", verifyUser);

//get profile
router.get("/profile", isAuthenticated, isAdmin, getUserProfile);

//login user
router.post("/login", loginUser);

//logout user
router.get("/logout", logoutUser);

//forgot password
router.get("/forgot_password", forgotPassword);

//reset password
router.post("/reset_password/:resetToken", resetPassword);


export default router;
