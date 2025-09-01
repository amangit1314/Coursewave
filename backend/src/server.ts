import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./api/auth/auth.routes";
import userRoutes from "./routes/users";
import blogRoutes from "./api/blogs/blogs.routes";
import courseRoutes from "./api/courses/courses.routes";
import courseProgressRoutes from "./routes/course-progress";
import cartRoutes from "./routes/cart";
import wishlistRoutes from "./routes/wishlist";
import categoriesRoutes from "./routes/categories";
import sessionsRoutes from "./routes/sessions";
import subscriptionRoutes from "./routes/subscriptions";
import projectRoutes from "./routes/projects";
import communityRoutes from "./routes/communities";
import instructorRoutes from "./routes/instructor";
import profileRoutes from "./routes/profile";
import tokenManagementRoutes from "./routes/tokenManagement";
import secureAuthRoutes from "./routes/secureAuth";
import stripeWebhookRoutes from "./routes/webhooks";
import compression from "compression";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import { courseCacheMiddleware } from "./config/redis";
import { checkAccessToken } from "./core/middleware";

// Load environment variables
dotenv.config();

// ----------------- Check for required environment variables --------------------------
const requiredEnvVars = ["DATABASE_URL", "JWT_SECRET", "JWT_REFRESH_SECRET"];

const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.error(
    `Missing required environment variables: ${missingEnvVars.join(", ")}`
  );
  console.error("Server will start but some features may not work correctly");
}

// --------------------------------------------------------------------------------

const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 1 min
  max: 100, // limit each IP to 100 requests per window
});

///? ----------------------------  Middlewares -----------------------------------

///* Custom rate limitor
app.use(limiter);
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
  })
);
app.use(helmet());
app.use(compression());

///* Apply access token check (but exclude public endpoints)
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
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

///* Middleware to track slow route
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(`[${req.method}] ${req.originalUrl} - ${duration}ms`);
  });
  next();
});

///! API routes with caching middleware
//* --------------------- DONE ----------------------
app.use("/api/auth", authRoutes);
app.use("/api/courses", courseCacheMiddleware, courseRoutes);
// ====================================================================

app.use("/api/webhooks/stripe", stripeWebhookRoutes);
app.use("/api/users", userRoutes);
app.use(
  "/api/blogs",
  //  blogCacheMiddleware,
  blogRoutes
);
app.use("/api/projects", projectRoutes);
app.use("/api/communities", communityRoutes);
app.use("/api/course-progress", courseProgressRoutes);
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
app.use("/api/tokens", tokenManagementRoutes);
app.use("/api/secure-auth", secureAuthRoutes);

///! Error handling middleware
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

// --------------------------------------------------------------------------------------------
const PORT = process.env.PORT || 5001;

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT} ✅`);
});