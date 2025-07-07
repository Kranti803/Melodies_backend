import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/userModel";
import express, { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

const googleAuthentication = (app: express.Application) => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        callbackURL: "http://localhost:4500/auth/google/callback",
      },
      async (_, __, profile, cb) => {
        try {
          const email = profile.emails?.[0]?.value;
          let user = await User.findOne({ email });

          if (!user) {
            user = await User.create({
              name: profile.displayName,
              email,
              photoURL: profile.photos?.[0]?.value,
              isVerified: profile.emails?.[0]?.verified,
              provider: "google",
              googleId: profile.id,
            });
          } else if (!user.googleId) {
            user.googleId = profile.id;
            user.provider = "google";
            user.name = profile.displayName;
            user.photoURL = profile.photos?.[0]?.value;
            await user.save();
          }

          return cb(null, user);
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
    (req: Request, res: Response, next: NextFunction) => {
      passport.authenticate(
        "google",
        { session: false },
        (err, user, info, status) => {
          if (err) return next(err);
          if (!user) return res.redirect("/login");

          //generating and sending token now
          const token = jwt.sign(
            { _id: user._id },
            process.env.JWT_SECRET as string,
            {
              expiresIn: "7d",
            }
          );
          res.status(200).cookie("jwt_token", token, {
            expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
            httpOnly: true,
            // secure:true, //uncomment when backend and frontend use HTTPS
            sameSite: "none",
          });
          res.redirect(`http://localhost:4500`);
        }
      )(req, res, next);
    }
  );
};

export default googleAuthentication;
