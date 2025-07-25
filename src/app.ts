import express, { Application, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import compression from "compression";
import globalErrorHandler from "./middlewares/globalErrorHandler";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoutes";
import songRoutes from "./routes/songRoutes";
import artistRoute from "./routes/artistRoute";
import playlistRoute from "./routes/playlistRoute";
import adminRoute from "./routes/adminRoute";
import statsRoute from "./routes/statsRoute";
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
//cors(connecting the backend with the frontend)
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true, //we have to enable this if we ae using cookies or authorization headers
  })
);

//-----------
//Routes
//-----------

//user routes
app.use("/api/user", userRoutes);
//songs route
app.use("/api/song", songRoutes);
//artists route
app.use("/api/artist", artistRoute);
//playlist route
app.use("/api/playlist", playlistRoute);
//playlist route
app.use("/api/admin", adminRoute);
//analytics route
app.use("/api/stats", statsRoute);

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
