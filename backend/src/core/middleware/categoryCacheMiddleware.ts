import { CACHE_PREFIXES } from "../../config/constants/cachePrefixes";
import { CACHE_TTL } from "../../config/constants/cacheTtl";
import { cacheMiddleware } from "./cacheMiddleware";
import { NextFunction, Request, Response } from "express";

export const categoryCacheMiddleware = cacheMiddleware(
  CACHE_TTL.VERY_LONG,
  (req: Request) => {
    return `${CACHE_PREFIXES.CATEGORIES}:list`;
  }
);
