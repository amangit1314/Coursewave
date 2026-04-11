import { Request, Response } from "express";
import * as liveSessionsService from "./sessions.service";
import {
  asyncHandler,
  sendSuccess,
  AppError,
} from "../../core/middleware/errorHandler";

const requireUserId = (req: Request): string => {
  const userId = req.user?.id;
  if (!userId) throw new AppError("Unauthorized", 401);
  return userId;
};

export const getAllSessions = asyncHandler(
  async (_req: Request, res: Response) => {
    const sessions = await liveSessionsService.getAllSessions();
    sendSuccess(res, sessions, "Sessions fetched successfully");
  }
);

export const getSessionById = asyncHandler(
  async (req: Request, res: Response) => {
    const { sessionId } = req.params;
    const session = await liveSessionsService.getSessionById(sessionId);
    sendSuccess(res, session, "Session details fetched successfully");
  }
);

export const createSession = asyncHandler(
  async (req: Request, res: Response) => {
    const session = await liveSessionsService.createSession(
      requireUserId(req),
      req.body
    );
    sendSuccess(res, session, "Session created successfully", 201);
  }
);

export const bookSession = asyncHandler(async (req: Request, res: Response) => {
  const { sessionId } = req.params;
  const booking = await liveSessionsService.bookSession(sessionId, requireUserId(req));
  sendSuccess(res, booking, "Session booked successfully", 201);
});

export const payForSession = asyncHandler(
  async (req: Request, res: Response) => {
    const { sessionId } = req.params;
    const { paymentId } = req.body;

    const booking = await liveSessionsService.payForSession(
      sessionId,
      requireUserId(req),
      paymentId
    );
    sendSuccess(res, booking, "Payment processed successfully");
  }
);

export const joinSession = asyncHandler(async (req: Request, res: Response) => {
  const { sessionId } = req.params;
  const connection = await liveSessionsService.joinSession(
    sessionId,
    requireUserId(req)
  );
  sendSuccess(res, connection, "Session joined successfully");
});

export const cancelBooking = asyncHandler(
  async (req: Request, res: Response) => {
    const { sessionId } = req.params;
    await liveSessionsService.cancelBooking(sessionId, requireUserId(req));
    sendSuccess(res, null, "Booking cancelled successfully");
  }
);

export const createCheckout = asyncHandler(
  async (req: Request, res: Response) => {
    const { sessionId } = req.params;
    const result = await liveSessionsService.createSessionCheckout(
      sessionId,
      requireUserId(req)
    );
    sendSuccess(res, result, "Checkout session created successfully");
  }
);

export const getMyFutureScheduledSessions = asyncHandler(
  async (req: Request, res: Response) => {
    const bookings = await liveSessionsService.getMyFutureScheduledSessions(
      requireUserId(req)
    );
    sendSuccess(res, bookings, "Upcoming sessions fetched successfully");
  }
);
