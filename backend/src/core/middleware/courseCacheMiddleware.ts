import { NextFunction, Request, Response } from "express";
import { cacheMiddleware } from "./cacheMiddleware";
import { CACHE_TTL } from "../../config/constants/cacheTtl";
import { CACHE_PREFIXES } from "../../config/constants/cachePrefixes";

export const courseCacheMiddleware = cacheMiddleware(CACHE_TTL.MEDIUM, (req: Request) => {
  const courseId = req.params.courseId;
  return courseId 
    ? `${CACHE_PREFIXES.COURSES}:${courseId}`
    : `${CACHE_PREFIXES.COURSES}:list:${JSON.stringify(req.query)}`;
});