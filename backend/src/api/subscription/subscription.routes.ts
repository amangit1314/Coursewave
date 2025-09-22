import { Router } from "express";
import {
  getSubscriptionPlans,
  getUserSubscriptions,
  getInstructorSubscriptions,
  subscribeUser,
  subscribeInstructor,
  cancelUserSubscription,
  cancelInstructorSubscription
} from "./subscription.controller";
import { verifyToken } from "../../core/middleware";
import { checkAccessToken } from "../../core/middleware";


const router: Router = Router();

// Public routes
router.get("/plans", getSubscriptionPlans);

// User routes (authenticated)
router.get("/user", verifyToken, getUserSubscriptions);
router.post("/user/subscribe", verifyToken, subscribeUser);
router.post("/user/cancel", verifyToken, cancelUserSubscription);

// Instructor routes (authenticated)
router.get("/instructor", verifyToken, getInstructorSubscriptions);
router.post("/instructor/subscribe", verifyToken, subscribeInstructor);
router.post("/instructor/cancel", verifyToken, cancelInstructorSubscription);

export default router;