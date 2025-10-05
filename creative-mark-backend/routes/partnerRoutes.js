import express from "express";
import { 
  createPartner,
  getAllPartners,
  getPartnerById,
  updatePartner,
  deletePartner,
  getPartnerDashboardStats,
  getPartnerApplications,
  getPartnerRecentActivities,
  getPartnerPerformance,
  getPartnerNotifications,
  approvePartner,
  rejectPartner,
  suspendPartner,
  upload
} from "../controllers/partnerController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// Create new partner (Admin only)
router.post("/", authMiddleware, upload.fields([
  { name: 'profilePicture', maxCount: 1 },
  { name: 'companyRegistrationTradeLicense', maxCount: 1 },
  { name: 'generalManagerDirectorPassport', maxCount: 1 },
  { name: 'vatCertificate', maxCount: 1 }
]), createPartner);

// Get all partners (Admin/Staff only)
router.get("/", authMiddleware, getAllPartners);

// Get partner by ID (Admin/Staff/Partner)
router.get("/:partnerId", authMiddleware, getPartnerById);

// Update partner (Admin/Partner)
router.put("/:partnerId", authMiddleware, upload.fields([
  { name: 'companyRegistrationTradeLicense', maxCount: 1 },
  { name: 'generalManagerDirectorPassport', maxCount: 1 },
  { name: 'vatCertificate', maxCount: 1 }
]), updatePartner);

// Delete partner (Admin only)
router.delete("/:partnerId", authMiddleware, deletePartner);

// Partner approval/rejection (Admin only)
router.put("/:partnerId/approve", authMiddleware, approvePartner);
router.put("/:partnerId/reject", authMiddleware, rejectPartner);
router.put("/:partnerId/suspend", authMiddleware, suspendPartner);

// Partner Dashboard Routes (Partner only)
router.get("/dashboard/stats", authMiddleware, getPartnerDashboardStats);
router.get("/applications", authMiddleware, getPartnerApplications);
router.get("/activities", authMiddleware, getPartnerRecentActivities);
router.get("/performance", authMiddleware, getPartnerPerformance);
router.get("/notifications", authMiddleware, getPartnerNotifications);

export default router;
