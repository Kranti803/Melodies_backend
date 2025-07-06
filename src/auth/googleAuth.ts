import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/userModel";
import express,{Request,Response} from "express";
import sendToken from "../utils/sendToken"; // Optional

const googleAuthentication = (app:express.Application) => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        callbackURL: "http://localhost:4500/auth/google/callback",
      },
      async (_, __, profile, cb) => {
        try {
          console.log("Google profile:", profile);

          // You can look up or create user in DB here
          return cb(null, profile);
        } catch (err) {
          return cb(err as Error, undefined);
        }
      }
    )
  );

  // Routes
  app.get(
    "/auth/google",
    passport.authenticate("google", {
      scope: ["profile", "email"],
      session: false,
    })
  );

  app.get(
    "/auth/google/callback",
    passport.authenticate("google", {
      failureRedirect: "/login",
      session: false,
    }),
    (req: Request, res: Response) => {
      console.log("Google auth successful:", req.user);
      // Optionally use sendToken(res, user)
      res.redirect("http://localhost:4500");
    }
  );
};

export default googleAuthentication;