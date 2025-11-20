import { NextFunction, Request, Response } from "express";
import { ZodSchema } from "zod";
import { sendValidationError } from "./errorHandler";

type Target = "body" | "query" | "params";

export const validate =
  (schema: ZodSchema, target: Target = "body") =>
  (req: Request, res: Response, next: NextFunction) => {
    const parsed = schema.safeParse(req[target]);
    if (!parsed.success) {
      return sendValidationError(res, parsed.error.issues.map((i) => ({
        path: i.path.join("."),
        message: i.message,
      })));
    }

    // Assign parsed/normalized data back
    (req as any)[target] = parsed.data;
    next();
  };