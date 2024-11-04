import mongoose from "mongoose";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

export const connectDB = async () => {
  await mongoose
    .connect(process.env.DATABASE_LINK)
    .then(() => console.log(`DB Connected!`));
};
