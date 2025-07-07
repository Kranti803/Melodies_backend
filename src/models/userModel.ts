import { Schema, model } from "mongoose";
import { IUser } from "../interfaces/userInterface";

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, select: false }, //using select so that this, field won't be returned by default
    photoURL: { type: String },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    resetPasswordToken: {
      type: String,
    },
    resetPasswordTokenExpire: {
      type: Date,
    },
    provider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },
    googleId: {
      type: String,
    },
  },
  { timestamps: true }
);

const User = model<IUser>("User", userSchema);
export default User;
