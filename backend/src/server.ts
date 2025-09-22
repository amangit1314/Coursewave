import express from "express";
import cors from "cors";
import http from "http";
import dotenv from "dotenv";
import compression from "compression";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
// ------------------------------------------------------------------------
import authRoutes from "./api/auth/auth.routes";
import blogRoutes from "./api/blogs/blogs.routes";
import usersRoutes from "./api/users/users.routes";
import courseRoutes from "./api/courses/courses.routes";
import profileRoutes from "./api/profile/profile.routes";
import instructorRoutes from "./api/instructor/instructor.routes";
import subscriptionRoutes from "./api/subscription/subscription.routes";
import sessionsRoutes from "./api/sessions/sessions.routes";
import categoriesRoutes from "./api/categories/categories.routes";
import wishlistRoutes from "./api/wishlist/wishlist.routes";
import cartRoutes from "./api/cart/cart.routes";
import stripeWebhookRoutes from "./api/webhooks/stripe/stripe.routes";
// import tokenManagementRoutes from "./api/token-management/token-management.routes";
// import secureAuthRoutes from "./api/secure-auth/secure-auth.routes";
import projectsRoutes from "./api/projects/projects.routes";
import communitiesRoutes from "./api/communities/communities.routes";
// ------------------------------------------------------------------------
// import { courseCacheMiddleware } from "./config/redis";
import { checkAccessToken } from "./core/middleware";
import { initJobs } from "./jobs";
// Socket.IO
import { initSocket } from "./config/socket";

///? <=================================== Load environment variables ==============>
dotenv.config();

///? <==================================== Check for required environment variables ========>
const requiredEnvVars = ["DATABASE_URL", "JWT_SECRET", "JWT_REFRESH_SECRET"];

const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.error(
    `Missing required environment variables: ${missingEnvVars.join(", ")}`
  );
  console.error("Server will start but some features may not work correctly");
}

/// ? <=================================== CREATING EXPRESS APP ============================>
const app = express();

///? <==================================== Middlewares ======================================>
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
  })
);

///? <==================================== CUSTOM Middlewares ================================>

///* ------------------------- Custom rate limitor -------------------------------------
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 1 min
  max: 100, // limit each IP to 100 requests per window
});

app.use(limiter);

///* ------------------------- Apply access token check (but exclude public endpoints) --
app.use((req, res, next) => {
  // Skip authentication for public endpoints
  const publicEndpoints = [
    "/api/subscriptions/plans",
    "/health",
    "/api/cache/status",
  ];

  if (publicEndpoints.includes(req.path)) {
    return next();
  }

  return checkAccessToken(req, res, next);
});

///* ------------------------- Custom Middleware to track slow route --------------------
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(`[${req.method}] ${req.originalUrl} - ${duration}ms`);
  });
  next();
});

///* ------------------------- Error handling middleware --------------------------------
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
      success: false,
      message: err.message || "Internal Server Error",
      ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    });
  }
);

///? <==================================== API routes ====================================>
app.use("/api/auth", authRoutes);
app.use(
  "/api/courses",
  // courseCacheMiddleware,
  courseRoutes
);
app.use("/api/webhooks/stripe", stripeWebhookRoutes);
app.use("/api/users", usersRoutes);
app.use(
  "/api/blogs",
  //  blogCacheMiddleware,
  blogRoutes
);
app.use("/api/cart", cartRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use(
  "/api/categories",
  // categoryCacheMiddleware,
  categoriesRoutes
);
app.use("/api/sessions", sessionsRoutes);
app.use("/api/subscriptions", subscriptionRoutes);
app.use("/api/instructor", instructorRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/projects", projectsRoutes);
app.use("/api/communities", communitiesRoutes);
// app.use("/api/tokens", tokenManagementRoutes);
// app.use("/api/secure-auth", secureAuthRoutes);

///? <==================================== INITIALIZE CRON JOBS ======================================>
initJobs();

/// ? <=================================== CREATING HTTP SERVER APP ============================>
const server = http.createServer(app);

/// ? <=================================== Initialize Socket.IO ============================>
initSocket(server);

///? <==================================== LISTEN TO HTTP SERVER ON PORT ======================================>
const PORT = process.env.PORT || 5001;

server.listen(PORT, () => console.log(`Server running on port ${PORT} ✅`));