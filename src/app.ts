import express, { Application, Response } from "express";
import dotenv from "dotenv";
import compression from "compression";
import globalErrorHandler from "./middlewares/globalErrorHandler";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoutes";
import googleAuthentication from "./auth/googleAuth";

//allow access to .env file
dotenv.config();

const app: Application = express();

//-----------
//Middlewares
//-----------

//compression middleware
app.use(compression());
//parse incoming json request
app.use(express.json());

//parse URL-encoded data (from HTML forms) into req.body(for multer)
app.use(express.urlencoded({ extended: true }));

//parse cookies from the Cookie header and populate req.cookies
app.use(cookieParser());

//-----------
//Routes
//-----------

//user routes
app.use("/api/user", userRoutes);
//google authentication
googleAuthentication(app);
//default route
app.get("/", (_, res: Response) => {
  res.send("Welcome to the server");
});

//route not found
app.use((_, res: Response) => {
  res.status(404).json({ message: "Route not found" });
});

//-------------------------------
//Global Error Handler Middleware
//-------------------------------
app.use(globalErrorHandler);

export default app;
