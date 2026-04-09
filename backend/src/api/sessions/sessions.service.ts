import {
  SessionStatus,
  PaymentStatus,
  PaymentMethod,
  SessionType,
  RtcType,
} from "@prisma/client";
import { prisma } from "../../config/prisma";
import { generateResourceId } from "../../core/utils/idGenerator";
import { AppError } from "../../core/middleware/errorHandler";

export interface SessionData {
  title: string;
  description?: string;
  imageUrl?: string;
  isFree: boolean;
  price?: number;
  scheduledAt: Date;
  duration: number;
  type?: SessionType;
  rtcType?: RtcType;
  rtcRoomId: string;
  rtcToken?: string;
  rtcConfig?: any;
}

export const getAllSessions = async () => {
  return prisma.session.findMany({
    where: {
      status: SessionStatus.UPCOMING,
      scheduledAt: {
        gt: new Date(),
      },
    },
    include: {
      Instructor: {
        include: {
          user: {
            select: {
              name: true,
              profileImageUrl: true,
            },
          },
        },
      },
      _count: {
        select: {
          bookings: true,
        },
      },
    },
    orderBy: {
      scheduledAt: "asc",
    },
  });
};

export const getSessionById = async (sessionId: string) => {
  const session = await prisma.session.findUnique({
    where: { id: sessionId },
    include: {
      Instructor: {
        include: {
          user: {
            select: {
              name: true,
              profileImageUrl: true,
            },
          },
        },
      },
      bookings: {
        include: {
          user: {
            select: {
              name: true,
              profileImageUrl: true,
            },
          },
        },
        take: 5,
      },
      _count: {
        select: {
          bookings: true,
        },
      },
    },
  });

  if (!session) {
    throw new AppError("Session not found", 404);
  }

  return session;
};

export const createSession = async (
  instructorId: string,
  sessionData: SessionData
) => {
  const {
    title,
    description,
    imageUrl,
    isFree,
    price,
    scheduledAt,
    duration,
    type = SessionType.ONE_TO_ONE,
    rtcType = RtcType.WEBRTC,
    rtcRoomId,
    rtcToken,
    rtcConfig,
  } = sessionData;

  const endsAt = new Date(new Date(scheduledAt).getTime() + duration * 60000);

  return prisma.session.create({
    data: {
      id: generateResourceId("session"),
      title,
      description,
      imageUrl,
      isFree,
      price: isFree ? 0 : price,
      currency: "USD",
      scheduledAt: new Date(scheduledAt),
      duration,
      endsAt,
      type,
      rtcType,
      rtcRoomId,
      rtcToken,
      rtcConfig,
      instructorId,
      status: SessionStatus.UPCOMING,
    },
  });
};

export const bookSession = async (sessionId: string, userId: string) => {
  const session = await prisma.session.findUnique({
    where: { id: sessionId },
  });

  if (!session) {
    throw new AppError("Session not found", 404);
  }

  if (session.status !== SessionStatus.UPCOMING) {
    throw new AppError("Session is not available for booking", 400);
  }

  const existingBooking = await prisma.sessionBooking.findFirst({
    where: {
      sessionId,
      userId,
    },
  });

  if (existingBooking) {
    throw new AppError("You have already booked this session", 409);
  }

  const paymentStatus = session.isFree
    ? PaymentStatus.COMPLETED
    : PaymentStatus.PENDING;

  return prisma.sessionBooking.create({
    data: {
      sessionId,
      userId,
      instructorId: session.instructorId,
      paymentStatus,
      amountPaid: session.isFree ? 0 : session.price,
      paymentMethod: session.isFree ? PaymentMethod.FREE : undefined,
    },
    include: {
      session: {
        include: {
          Instructor: {
            include: {
              user: {
                select: {
                  name: true,
                  profileImageUrl: true,
                },
              },
            },
          },
        },
      },
      user: {
        select: {
          name: true,
          profileImageUrl: true,
        },
      },
    },
  });
};

export const payForSession = async (
  sessionId: string,
  userId: string,
  paymentId: string,
  paymentMethod: PaymentMethod = PaymentMethod.STRIPE
) => {
  const booking = await prisma.sessionBooking.findFirst({
    where: {
      sessionId,
      userId,
      paymentStatus: PaymentStatus.PENDING,
    },
    include: {
      session: true,
    },
  });

  if (!booking) {
    throw new AppError("No pending booking found", 404);
  }

  // In a real app, verify payment with Stripe/etc here
  // This is just a simulation
  const paymentVerified = true;

  if (!paymentVerified) {
    throw new AppError("Payment verification failed", 400);
  }

  return prisma.sessionBooking.update({
    where: { id: booking.id },
    data: {
      paymentStatus: PaymentStatus.COMPLETED,
      paymentMethod,
      stripePaymentId: paymentId,
      amountPaid: booking.session.price,
    },
  });
};

export const joinSession = async (sessionId: string, userId: string) => {
  const booking = await prisma.sessionBooking.findFirst({
    where: {
      sessionId,
      userId,
      paymentStatus: PaymentStatus.COMPLETED,
    },
    include: {
      session: true,
    },
  });

  if (!booking) {
    throw new AppError("Valid paid booking required to join session", 403);
  }

  const currentTime = new Date();
  if (
    booking.session.status !== SessionStatus.UPCOMING &&
    booking.session.status !== SessionStatus.ONGOING
  ) {
    throw new AppError("Session is not currently active", 400);
  }

  const sessionStartTime = new Date(booking.session.scheduledAt);
  const canJoinEarly =
    currentTime.getTime() >= sessionStartTime.getTime() - 15 * 60 * 1000;

  if (!canJoinEarly && currentTime < sessionStartTime) {
    throw new AppError("Session has not started yet", 400);
  }

  await prisma.sessionBooking.update({
    where: { id: booking.id },
    data: {
      joinedAt: new Date(),
    },
  });

  return {
    rtcRoomId: booking.session.rtcRoomId,
    rtcToken: booking.session.rtcToken,
    rtcConfig: booking.session.rtcConfig,
    sessionTitle: booking.session.title,
    instructorId: booking.session.instructorId,
  };
};

export const cancelBooking = async (sessionId: string, userId: string) => {
  const booking = await prisma.sessionBooking.findFirst({
    where: {
      sessionId,
      userId,
      paymentStatus: {
        in: [PaymentStatus.PENDING, PaymentStatus.COMPLETED],
      },
    },
  });

  if (!booking) {
    throw new AppError("No active booking found", 404);
  }

  const session = await prisma.session.findUnique({
    where: { id: sessionId },
    select: { scheduledAt: true, endsAt: true },
  });

  if (!session) {
    throw new AppError("Session not found", 404);
  }

  const sessionStart = new Date(session.scheduledAt);
  const sessionEnd = session.endsAt ? new Date(session.endsAt) : null;

  if (sessionEnd && sessionEnd < new Date()) {
    throw new AppError("Cannot cancel session that has already ended", 400);
  }

  if (!sessionEnd && sessionStart < new Date()) {
    throw new AppError("Cannot cancel session that has already started", 400);
  }

  // Handle refund if needed — commented out pending real Stripe integration
  if (
    booking.paymentStatus === PaymentStatus.COMPLETED &&
    booking.stripePaymentId
  ) {
    // await stripe.refunds.create({ payment_intent: booking.stripePaymentId });
  }

  await prisma.sessionBooking.delete({
    where: { id: booking.id },
  });

  return null;
};

export const getMyFutureScheduledSessions = async (userId: string) => {
  return prisma.sessionBooking.findMany({
    where: {
      userId,
      session: {
        status: SessionStatus.UPCOMING,
        scheduledAt: {
          gt: new Date(),
        },
      },
      paymentStatus: PaymentStatus.COMPLETED,
    },
    include: {
      session: {
        include: {
          Instructor: {
            include: {
              user: {
                select: {
                  name: true,
                  profileImageUrl: true,
                },
              },
            },
          },
        },
      },
    },
    orderBy: {
      session: {
        scheduledAt: "asc",
      },
    },
  });
};

export const updateSessionStatus = async (
  sessionId: string,
  status: SessionStatus
) => {
  return prisma.session.update({
    where: { id: sessionId },
    data: { status },
  });
};

export const getInstructorSessions = async (instructorId: string) => {
  return prisma.session.findMany({
    where: {
      instructorId,
    },
    include: {
      _count: {
        select: {
          bookings: true,
        },
      },
      bookings: {
        include: {
          user: {
            select: {
              name: true,
              profileImageUrl: true,
            },
          },
        },
        take: 3,
      },
    },
    orderBy: {
      scheduledAt: "desc",
    },
  });
};

export const leaveSession = async (sessionId: string, userId: string) => {
  const booking = await prisma.sessionBooking.findFirst({
    where: {
      sessionId,
      userId,
      joinedAt: { not: null },
      leftAt: null,
    },
  });

  if (!booking) {
    throw new AppError("No active session participation found", 404);
  }

  const joinedAt = booking.joinedAt!;
  const leftAt = new Date();
  const durationAttended = Math.floor(
    (leftAt.getTime() - joinedAt.getTime()) / 60000
  );

  await prisma.sessionBooking.update({
    where: { id: booking.id },
    data: {
      leftAt,
      durationAttended,
    },
  });

  return { durationAttended };
};
