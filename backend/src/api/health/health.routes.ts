import { Router, Request, Response } from "express";
import { prisma } from "../../config/prisma";
import { CacheManager } from "../../core/helpers/CacheManager";
import { sendSuccess, sendError } from "../../core/middleware/errorHandler";

const router = Router();

router.get("/", async (_req: Request, res: Response) => {
  try {
    const cache = await CacheManager.getInstance().getStats();
    await prisma.$queryRaw`SELECT 1`; // lightweight DB check
    return sendSuccess(res, { cache, db: "ok" }, "Health OK");
  } catch (err: any) {
    return sendError(res, "Health check failed", 500, err?.message);
  }
});

export default router;