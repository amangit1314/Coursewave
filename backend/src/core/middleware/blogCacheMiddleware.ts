import { CACHE_PREFIXES } from "../../config/constants/cachePrefixes";
import { CACHE_TTL } from "../../config/constants/cacheTtl";
import { NextFunction, Request, Response } from "express";
import { cacheMiddleware } from "./cacheMiddleware";

export const blogCacheMiddleware = cacheMiddleware(CACHE_TTL.MEDIUM, (req: Request) => {
  const slug = req.params.slug;
  return slug 
    ? `${CACHE_PREFIXES.BLOGS}:${slug}`
    : `${CACHE_PREFIXES.BLOGS}:list:${JSON.stringify(req.query)}`;
});