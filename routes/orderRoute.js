import express from "express";
import {
  getAllOrders,
  getUserOrders,
  placeOrder,
  updateOrderStatus,
  verifyOrder,
} from "../controllers/orderController.js";
import authMiddleware from "../middleware/auth.js";

const orderRouter = express.Router();

orderRouter.post("/place", authMiddleware, placeOrder);
orderRouter.post("/verify", verifyOrder);
orderRouter.post("/userorders", authMiddleware, getUserOrders);
orderRouter.get("/list", getAllOrders);
orderRouter.post("/status", updateOrderStatus);

export default orderRouter;
