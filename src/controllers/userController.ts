import { Request, Response, NextFunction } from "express";
import catchAsyncError from "../utils/asyncHandler";
import ErrorHandler from "../utils/errorHandler";
import User from "./../models/userModel";
import bcrypt from "bcrypt";
import sendToken from "../utils/sendToken";
import crypto from "crypto";
import emailVerification from "../models/emailVerifyModel";
import sendEmail from "../utils/sendEmail";

//register user
export const registerUser = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, password } = req.body;
    console.log(name,email,password)

    let existingUser = await User.findOne({ email });

    if (existingUser) return next(new ErrorHandler("User already exits", 409));

    const hashedPassword: string = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: name,
      email: email,
      password: hashedPassword,
    });

    //sending email verification email........
    //generating token first
    const token = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    //saving hashed token in db
    await emailVerification.create({
      token: hashedToken,
      userId: user._id,
    });

    //sending verification email
    await sendEmail(
      email,
      " Melodies Email Verification",
      "Please verify your email to continue !",
      `<h3><a href="http://localhost:4500/api/user/email_verify/${user._id}/${token}">Click here to verify your email</a></h3>`
    );
    res.status(200).json({
      success: true,
      message: "Email sent for verification",
    });
  }
);

//send email
export const verifyUser = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId, token } = req.params;

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const dbToken = await emailVerification.findOne({
      token: hashedToken,
      userId,
    });
    if (!dbToken) return next(new ErrorHandler("Link is expired", 410));

    const user = await User.findById({ _id: userId });
    if (!user) return next(new ErrorHandler("Link is expired", 404));
    user.isVerified = true;
    await user.save();

    sendToken(res, user, "Email Verified successfully");
  }
);

//login user
export const loginUser = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user) return next(new ErrorHandler("Invalid credentials", 401));

    if (!user.password) {
      return next(new ErrorHandler("Invalid credentials", 401));
    }

    const isMatched = await bcrypt.compare(password, user.password as string);
    if (!isMatched) return next(new ErrorHandler("Invalid credentials", 401));

    if (!user.isVerified)
      return next(new ErrorHandler("Please verify your email first", 403));

    sendToken(res, user, `Welcome ${user.name}`);
  }
);

//logout user
export const logoutUser = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    res
      .status(200)
      .clearCookie("jwt_token", {
        expires: new Date(Date.now()),
        httpOnly: true,
        // secure:true, //uncomment when backend and frontend use HTTPS
        sameSite: "none",
      })
      .json({
        success: true,
        message: "User Logged out successfylly",
      });
  }
);

//get user profile
export const getUserProfile = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({
      success: true,
      user: req.user,
    });
  }
);

//forgot password
export const forgotPassword = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;

    let user = await User.findOne({ email });
    if (!user) return next(new ErrorHandler("User doesnot exits", 400));
    if (user.provider === "google")
      return next(new ErrorHandler("Please login using google", 400));

    //generating resetToken
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordTokenExpire = new Date(Date.now() + 1000 * 60 * 5);
    await user.save();

    //
    sendEmail(
      email,
      "Password reset",
      "Reset your password",
      `<h3><a href=http://localhost:4500/api/user/reset_password/${resetToken}">Click here to reset your password</a></h3>`
    );
    res.status(200).json({
      success: true,
      message: "Please check your Gmail to reset password.",
    });
  }
);

//reset password
export const resetPassword = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { resetToken } = req.params;
    const newPassword = req.body?.newPassword;

    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    let user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordTokenExpire: {
        $gt: new Date(),
      },
    }).select("+password"); //donot forget to include password

    if (!user)
      return next(new ErrorHandler("Invalid  or expired reset Link", 400));

    const hashedPassword: string = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpire = undefined;
    await user.save();
    res.status(200).json({
      success: true,
      message: "Password has been changed successfully",
    });
  }
);
