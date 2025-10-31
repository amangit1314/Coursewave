import { Router } from "express";
import { getLandingReviews, getPlatformLandingStats } from "./stats.controller";

const router: Router = Router();

// Get platform statistics (public landing page)
router.get("/", getPlatformLandingStats);

router.get("/reviews", getLandingReviews);

export default router;
