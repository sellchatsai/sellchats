import express from "express";
import {
  getAdminCustomers,
  getAdminChat,
  getDashboardCounts,
  getFilteredCustomers,
  getDashboardStats,
  getAllUsers,
  deleteUser,
  getUserLeadsAnalytics,
  getChatAnalytics
} from "../controllers/adminController.js";

const router = express.Router();

/* OLD ROUTES */
router.get("/customers/:userId", getAdminCustomers);
router.get("/customers/:userId/filter", getFilteredCustomers);
router.get("/dashboard-counts", getDashboardCounts);

/* IMPORTANT FIX */
router.get("/dashboard-stats", getDashboardStats);
router.get("/users", getAllUsers);
router.delete("/user/:id", deleteUser);
router.get("/user-leads/:userId", getUserLeadsAnalytics);
router.get("/chat-messages", getAdminChat);
router.get("/chats", getChatAnalytics); 

export default router;