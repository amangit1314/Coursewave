import { Request, Response, NextFunction } from "express";

// Add this as the FIRST middleware in your course routes
export async function debugMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.log("🔍 [DEBUG] Request started:", {
    method: req.method,
    url: req.url,
    params: req.params,
    user: req.user
      ? {
          id: req.user.id,
          email: req.user.email,
          roles: req.user.roles,
        }
      : "No user",
    headers: {
      authorization: req.headers.authorization ? "Present" : "Missing",
    },
  });
  next();
}
