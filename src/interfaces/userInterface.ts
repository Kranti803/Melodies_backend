import { Types } from "mongoose";
export interface IUser {
  _id: string;
  name: string;
  email: string;
  password?: string;
  photoURL?: string;
  role: "user" | "admin";
  isVerified: boolean;
  resetPasswordToken?: string;
  resetPasswordTokenExpire?: Date;
  provider: "local" | "google";
  googleId?: string;
  recentlyPlayedSongs?:Types.ObjectId[];
}
