import { Schema, model } from "mongoose";
import IemailVerification from "../interfaces/emailVerificationInterface";

const emailVerificationSchema = new Schema<IemailVerification>(
  {
    token: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 300, // expires after 5 minutes (60s x 5 = 300 seconds)
    },
  },
);

const emailVerification = model<IemailVerification>(
  "EmailVerification",
  emailVerificationSchema
);

export default emailVerification;
