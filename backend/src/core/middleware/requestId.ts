import { NextFunction, Request, Response } from "express";
import crypto from "crypto";

export const requestId = (req: Request, res: Response, next: NextFunction) => {
  const id = req.headers["x-request-id"]?.toString() || crypto.randomUUID();
  req.requestId = id;
  res.setHeader("x-request-id", id);
  next();
};