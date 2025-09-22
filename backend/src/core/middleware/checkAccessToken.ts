import { NextFunction, Request, Response } from "express";

// Middleware to check for access token in header (temporarily disabled)
export const checkAccessToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Temporarily disabled for UI development
  next();
};
