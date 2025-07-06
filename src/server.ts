import app from "./app";
import connectDB from "./database/connectDB";

//connecting to mongoDB
connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on : http://localhost:${PORT}`);
});
