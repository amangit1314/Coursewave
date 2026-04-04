import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import http from "http";
import compression from "compression";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
// ------------------------------------------------------------------------
import statsRoutes from "./api/stats/stats.routes";
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
import projectsRoutes from "./api/projects/projects.routes";
import communitiesRoutes from "./api/communities/communities.routes";
import healthRoutes from "./api/health/health.routes";
// ------------------------------------------------------------------------
import { initJobs } from "./jobs";
import { initSocket } from "./config/socket";
import contactRoutes from "./api/contact/contact.routes";
import bodyParser from "body-parser";
import { requestId } from "./core/middleware/requestId";
import { requestLogger } from "./core/middleware/requestLogger";
import { errorHandler, notFound } from "./core/middleware/errorHandler";
import { logger } from "./core/utils/logger";
import { connectRabbitMQ } from "./config/rabbitmq";
import multer from "multer";

///? <=================================== Load environment variables ==============>

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

// Stripe webhook: must be before any other body parser
app.use(
  "/api/webhooks/stripe",
  bodyParser.raw({ type: "application/json" }),
  stripeWebhookRoutes
);

///? <==================================== Middlewares ======================================>
app.use(helmet());
app.use(requestId);
app.use(requestLogger);
app.use((req, res, next) => {
  console.log(
    `[Request] ${req.method} ${req.originalUrl} - Headers:`,
    req.headers
  );
  const user = (req as any).user;
  if (user) {
    console.log(`[Request] Authenticated user:`, JSON.stringify(user));
  }
  next();
});

// Replace ad-hoc header logging with Winston and safe requestId
app.use((req, res, next) => {
  logger.info("request:headers", {
    requestId: req.requestId,
    method: req.method,
    url: req.originalUrl,
    headers: req.headers,
    userId: (req as any).user?.id,
  });
  next();
});

// Replace your CORS configuration with this:
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      const allowedOrigins = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:3001",
        process.env.FRONTEND_URL_PROD,
      ];

      // Check if the origin is in allowed origins
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        // For development, you might want to allow all origins
        if (process.env.NODE_ENV === "development") {
          callback(null, true);
        } else {
          callback(new Error("Not allowed by CORS"));
        }
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "access_token",
      "x-access-token",
    ],
  })
);

app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const upload = multer();

///? <==================================== CUSTOM Middlewares ================================>

///* ------------------------- Custom rate limitor -------------------------------------
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 1 min
  max: 100, // limit each IP to 100 requests per window
});

app.use(limiter);

///* ------------------------- Apply access token check (but exclude public endpoints) --
// app.use((req, res, next) => {
//   // Skip authentication for public endpoints
//   const publicEndpoints = [
//     "/api/subscriptions/plans",
//     "/health",
//     "/api/cache/status",
//   ];

//   if (publicEndpoints.includes(req.path)) {
//     return next();
//   }

//   return checkAccessToken(req, res, next);
// });

///* ------------------------- Custom Middleware to track slow route --------------------
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    logger.info("route:timing", {
      requestId: req.requestId,
      method: req.method,
      url: req.originalUrl,
      durationMs: duration
    });
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
app.post("/api/your-form-route", upload.none(), (req, res) => {
  // Now works with "form-data" in Postman
  res.json({ received: true, form: req.body });
});

///? <==================================== API routes ====================================>
app.use("/api/stats", statsRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/auth", authRoutes);
app.use(
  "/api/courses",
  // courseCacheMiddleware,
  courseRoutes
);
// app.use("/api/webhooks/stripe", stripeWebhookRoutes);
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
app.use("/api/health", healthRoutes);

// Centralized error handling should be last before routes end
app.use(notFound);

// Error handler (final)
app.use(errorHandler);

///? <==================================== INITIALIZE CRON JOBS ======================================>
initJobs();

/// ? <=================================== CREATING HTTP SERVER APP ============================>
const PORT = process.env.PORT || 5002;
const server = http.createServer(app);

///? <==================================== LISTEN TO HTTP SERVER ON PORT ======================================>

server.listen(PORT, () => logger.info("server:start", { port: PORT }));

/// ? <=================================== Initialize Socket.IO ============================>
initSocket(server);

/// ? <=================================== RabitMQ setup ============================>
// (async () => {
//   try {
//     await connectRabbitMQ();

//   } catch (e) {
//     console.error("Failed to initialize RabbitMQ:", e);
//     process.exit(1);
//   }
// })();