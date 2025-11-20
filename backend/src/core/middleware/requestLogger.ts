import { NextFunction, Request, Response } from "express";
import { logger } from "../utils/logger";

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  logger.info("request:start", {
    requestId: req.requestId,
    method: req.method,
    url: req.originalUrl,
    headers: req.headers,
    userId: req.user?.id,
  });

  res.on("finish", () => {
    const duration = Date.now() - start;
    logger.info("request:finish", {
      requestId: req.requestId,
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      durationMs: duration,
      userId: req.user?.id,
    });
  });

  next();
};