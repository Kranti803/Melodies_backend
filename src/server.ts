import app from "./app";
import connectDB from "./database/connectDB";
import { v2 as cloudinary } from "cloudinary";



//connecting to mongoDB
connectDB();

//Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUDNAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on : http://localhost:${PORT}`);
});
