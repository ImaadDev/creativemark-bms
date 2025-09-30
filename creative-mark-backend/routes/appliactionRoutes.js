import express from "express";
import {
  addApplication,
  reviewApplication,
  makePayment,
  getApplication,
  getUserApplications,
  getAllApplications,
  assignApplicationToEmployees,
} from "../controllers/applicationController.js";
import upload, { handleUploadError } from "../config/upload.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// Get all applications for authenticated user
router.get("/", authMiddleware, getUserApplications);

// Client submits application
router.post(
  "/",
  upload.fields([
    { name: "passport", maxCount: 1 },
    { name: "idCard", maxCount: 1 },
    { name: "commercial_registration" },
    { name: "financial_statement" },
    { name: "articles_of_association" },
  ]),
  handleUploadError,
  addApplication
);

// Get all applications for admin
router.get("/all", authMiddleware, getAllApplications);

// Staff reviews application
router.patch("/:applicationId/review", authMiddleware, reviewApplication);

// Client makes payment (after approval)
router.post("/:applicationId/payment", authMiddleware, makePayment);

// Get full application with details
router.get("/:applicationId", authMiddleware, getApplication);

// Assign application to employees
router.patch("/:applicationId/assign", authMiddleware, assignApplicationToEmployees);

export default router;