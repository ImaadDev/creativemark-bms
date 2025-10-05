// routes/paymentRoutes.js
import express from "express";
import { createPayment, verifyPayment } from "../controllers/paymentController.js";

const router = express.Router();

// Create payment
router.post("/create", createPayment);

// Verify payment
router.get("/verify/:id", verifyPayment);

export default router;
