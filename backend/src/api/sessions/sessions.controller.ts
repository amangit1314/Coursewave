import { Request, Response } from "express";
import * as liveSessionsService from "./sessions.service";
import { asyncHandler } from "../../core/middleware";

export const getAllSessions = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await liveSessionsService.getAllSessions();
    res.status(result.status).json(result);
  }
);

export const getSessionById = asyncHandler(
  async (req: Request, res: Response) => {
    const { sessionId } = req.params;
    const result = await liveSessionsService.getSessionById(sessionId);
    res.status(result.status).json(result);
  }
);

export const createSession = asyncHandler(
  async (req: Request, res: Response) => {
    const sessionData = req.body;
    const instructorId = req.user?.id;

    if (!instructorId) {
      return res.status(400).json({ message: "instructorId is required" });
    }

    const result = await liveSessionsService.createSession(
      instructorId,
      sessionData
    );
    res.status(result.status).json(result);
  }
);

export const bookSession = asyncHandler(async (req: Request, res: Response) => {
  const { sessionId } = req.params;
  const userId = req.user?.id || "";

  const result = await liveSessionsService.bookSession(sessionId, userId);
  res.status(result.status).json(result);
});

export const payForSession = asyncHandler(
  async (req: Request, res: Response) => {
    const { sessionId } = req.params;
    const userId = req.user?.id;
    const { paymentMethod, paymentId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    const result = await liveSessionsService.payForSession(
      sessionId,
      userId,
      paymentId
    );
    res.status(result.status).json(result);
  }
);

export const joinSession = asyncHandler(async (req: Request, res: Response) => {
  const { sessionId } = req.params;
  const userId = req.user?.id || "";

  const result = await liveSessionsService.joinSession(sessionId, userId);
  res.status(result.status).json(result);
});

export const cancelBooking = asyncHandler(
  async (req: Request, res: Response) => {
    const { sessionId } = req.params;
    const userId = req.user?.id || "";

    const result = await liveSessionsService.cancelBooking(sessionId, userId);
    res.status(result.status).json(result);
  }
);

export const getMyFutureScheduledSessions = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.id || "";

    const result = await liveSessionsService.getMyFutureScheduledSessions(
      userId
    );
    res.status(result.status).json(result);
  }
);
