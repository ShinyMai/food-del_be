import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import foodRoute from "./routes/foodRoute.js";
import userRouter from "./routes/userRoute.js";
import "dotenv/config.js";
import cartRouter from "./routes/cartRouter.js";
import orderRouter from "./routes/orderRoute.js";

// Load environment variables
dotenv.config();

// App config
const app = express();
const port = process.env.DATABASE_PORT;

// Middleware
app.use(express.json());
app.use(cors());

// DB connection
connectDB();

// API endpoints
app.use("/api/food", foodRoute);
app.use("/images", express.static("uploads"));
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);

app.get("/", (req, res) => {
  res.send("API Working");
});

app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});
