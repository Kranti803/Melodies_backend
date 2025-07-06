import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(process.env.MONGODB_URL as string);
    console.log("Database is connected.");
  } catch (error) {
    console.log("Database error:", error);
  }
};

export default connectDB;
