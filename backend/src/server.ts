import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { checkAccessToken } from "./middleware/auth";
// import { apiRateLimiter, authRateLimiter } from './middleware/rateLimiter';
// import { performanceMonitor } from "./middleware/performanceMonitor";
// import { cacheMiddleware } from './config/redis';
// import { metricsMiddleware } from './config/monitoring';
// import { monitoringMiddleware } from './middleware/monitoring';

// Load environment variables
dotenv.config();

// Check for required environment variables
const requiredEnvVars = ["DATABASE_URL", "JWT_SECRET", "JWT_REFRESH_SECRET"];

const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.error(
    `Missing required environment variables: ${missingEnvVars.join(", ")}`
  );
  console.error("Server will start but some features may not work correctly");
}

// Check for optional environment variables
const optionalEnvVars = [
  "REDIS_HOST",
  "REDIS_PORT",
  // 'REDIS_PASSWORD',
  "REDIS_DB",
];

const missingOptionalEnvVars = optionalEnvVars.filter(
  (envVar) => !process.env[envVar]
);

if (missingOptionalEnvVars.length > 0) {
  console.warn(
    `Missing optional environment variables: ${missingOptionalEnvVars.join(
      ", "
    )}`
  );
  console.warn("Redis features will not be available");
}

const app = express();

// Middleware
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());

// Monitoring middleware
// app.use(metricsMiddleware as any);
// app.use(monitoringMiddleware as any);

// Apply rate limiting
// app.use('/api/auth', authRateLimiter);

// Apply access token check
app.use(checkAccessToken);
// app.use('/api', apiRateLimiter);

// Apply performance monitoring
// app.use(performanceMonitor);

// Import routes
import authRoutes from "./routes/auth";
import userRoutes from "./routes/users";
import blogRoutes from "./routes/blogs";
import courseRoutes from "./routes/courses";
import courseAttachmentRoutes from "./routes/course-attachments";
import courseProgressRoutes from "./routes/course-progress";
import reviewRoutes from "./routes/reviews";
import cartRoutes from "./routes/cart";
import wishlistRoutes from "./routes/wishlist";
import categoriesRoutes from "./routes/categories";
import sessionsRoutes from "./routes/sessions";
// import monitoringRoutes from './routes/monitoring';

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/course-attachments", courseAttachmentRoutes);
app.use("/api/course-progress", courseProgressRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/categories", categoriesRoutes);
app.use("/api/sessions", sessionsRoutes);
// app.use('/api/monitoring', monitoringRoutes);

// Apply caching to specific routes
// app.use('/api/courses', cacheMiddleware(300)); // Cache courses for 5 minutes
// app.use('/api/blogs', cacheMiddleware(600)); // Cache blogs for 10 minutes

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

// Error handling middleware
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

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
