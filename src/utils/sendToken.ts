import jwt from "jsonwebtoken";
import { Response } from "express";
import { IUser } from "../interfaces/userInterface";

const sendToken = (res: Response, user: IUser, message: string) => {
  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET as string, {
    expiresIn: "7d",
  });

  //setting the user passord undefined berfore sending the response
  user.password = undefined;
  res
    .status(200)
    .cookie("jwt_token", token, {
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      httpOnly: true,
      secure:true, //uncomment when backend and frontend use HTTPS
      sameSite: "none",
      // secure: false,
    })
    .json({
      success: true,
      message,
      user,
    });
};

export default sendToken;
