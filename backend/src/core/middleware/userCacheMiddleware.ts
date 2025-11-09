import { Request } from "express";

import { CACHE_PREFIXES } from "../../config/constants/cachePrefixes";
import { CACHE_TTL } from "../../config/constants/cacheTtl";
import { cacheMiddleware } from "./cacheMiddleware";

export const userCacheMiddleware = cacheMiddleware(CACHE_TTL.LONG, (req: Request) => {
  const userId = req.params.userId || req.user?.id;
  return `${CACHE_PREFIXES.USERS}:${userId}`;
});