import {
  SessionStatus,
  PaymentStatus,
  PaymentMethod,
  SessionType,
  RtcType,
  Prisma,
} from "@prisma/client";
import { prisma } from "../../config/prisma";
import { generateResourceId } from "../../core/utils/idGenerator";

export interface ServiceResponse {
  success: boolean;
  data?: any;
  message: string;
  status: number;
  error?: string;
}

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

export const getAllSessions = async (): Promise<ServiceResponse> => {
  try {
    const sessions = await prisma.session.findMany({
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

    return {
      success: true,
      data: sessions,
      message: "Sessions fetched successfully",
      status: 200,
    };
  } catch (error: any) {
    console.log("ERROR in getAllSessions:", error.message);
    return {
      success: false,
      error: error.message,
      message: "Failed to fetch sessions",
      status: 500,
    };
  }
};

export const getSessionById = async (
  sessionId: string
): Promise<ServiceResponse> => {
  try {
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
      return {
        success: false,
        message: "Session not found",
        status: 404,
      };
    }

    return {
      success: true,
      data: session,
      message: "Session details fetched successfully",
      status: 200,
    };
  } catch (error: any) {
    console.log("ERROR in getSessionById:", error.message);
    return {
      success: false,
      error: error.message,
      message: "Failed to fetch session",
      status: 500,
    };
  }
};

export const createSession = async (
  instructorId: string,
  sessionData: SessionData
): Promise<ServiceResponse> => {
  try {
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

    // Calculate end time
    const endsAt = new Date(new Date(scheduledAt).getTime() + duration * 60000);

    // Create session
    const session = await prisma.session.create({
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

    return {
      success: true,
      data: session,
      message: "Session created successfully",
      status: 201,
    };
  } catch (error: any) {
    console.log("ERROR in createSession:", error.message);
    return {
      success: false,
      error: error.message,
      message: "Failed to create session",
      status: 500,
    };
  }
};

export const bookSession = async (
  sessionId: string,
  userId: string
): Promise<ServiceResponse> => {
  try {
    // Check session availability
    const session = await prisma.session.findUnique({
      where: { id: sessionId },
    });

    if (!session) {
      return {
        success: false,
        message: "Session not found",
        status: 404,
      };
    }

    if (session.status !== SessionStatus.UPCOMING) {
      return {
        success: false,
        message: "Session is not available for booking",
        status: 400,
      };
    }

    // Check if user already booked this session
    const existingBooking = await prisma.sessionBooking.findFirst({
      where: {
        sessionId,
        userId,
      },
    });

    if (existingBooking) {
      return {
        success: false,
        message: "You have already booked this session",
        status: 400,
      };
    }

    // Determine payment status based on whether session is free
    const paymentStatus = session.isFree
      ? PaymentStatus.COMPLETED
      : PaymentStatus.PENDING;

    // Create booking
    const booking = await prisma.sessionBooking.create({
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

    return {
      success: true,
      data: booking,
      message: "Session booked successfully",
      status: 201,
    };
  } catch (error: any) {
    console.log("ERROR in bookSession:", error.message);
    return {
      success: false,
      error: error.message,
      message: "Failed to book session",
      status: 500,
    };
  }
};

export const payForSession = async (
  sessionId: string,
  userId: string,
  paymentId: string,
  paymentMethod: PaymentMethod = PaymentMethod.STRIPE
): Promise<ServiceResponse> => {
  try {
    // Verify booking exists
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
      return {
        success: false,
        message: "No pending booking found",
        status: 404,
      };
    }

    // In a real app, verify payment with Stripe/etc here
    // This is just a simulation
    const paymentVerified = true;

    if (!paymentVerified) {
      return {
        success: false,
        message: "Payment verification failed",
        status: 400,
      };
    }

    // Update booking with payment details
    const updatedBooking = await prisma.sessionBooking.update({
      where: { id: booking.id },
      data: {
        paymentStatus: PaymentStatus.COMPLETED,
        paymentMethod,
        stripePaymentId: paymentId,
        amountPaid: booking.session.price,
      },
    });

    return {
      success: true,
      data: updatedBooking,
      message: "Payment processed successfully",
      status: 200,
    };
  } catch (error: any) {
    console.log("ERROR in payForSession:", error.message);
    return {
      success: false,
      error: error.message,
      message: "Failed to process payment",
      status: 500,
    };
  }
};

export const joinSession = async (
  sessionId: string,
  userId: string
): Promise<ServiceResponse> => {
  try {
    // Verify valid booking with paid status
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
      return {
        success: false,
        message: "Valid paid booking required to join session",
        status: 403,
      };
    }

    // Check session status - allow joining if session is upcoming or ongoing
    const currentTime = new Date();
    if (
      booking.session.status !== SessionStatus.UPCOMING &&
      booking.session.status !== SessionStatus.ONGOING
    ) {
      return {
        success: false,
        message: "Session is not currently active",
        status: 400,
      };
    }

    // Check if session has started (within 15 minutes buffer)
    const sessionStartTime = new Date(booking.session.scheduledAt);
    const canJoinEarly =
      currentTime.getTime() >= sessionStartTime.getTime() - 15 * 60 * 1000;

    if (!canJoinEarly && currentTime < sessionStartTime) {
      return {
        success: false,
        message: "Session has not started yet",
        status: 400,
      };
    }

    // Update booking with join time
    await prisma.sessionBooking.update({
      where: { id: booking.id },
      data: {
        joinedAt: new Date(),
      },
    });

    // Return session connection details
    return {
      success: true,
      data: {
        rtcRoomId: booking.session.rtcRoomId,
        rtcToken: booking.session.rtcToken,
        rtcConfig: booking.session.rtcConfig,
        sessionTitle: booking.session.title,
        instructorId: booking.session.instructorId,
      },
      message: "Session joined successfully",
      status: 200,
    };
  } catch (error: any) {
    console.log("ERROR in joinSession:", error.message);
    return {
      success: false,
      error: error.message,
      message: "Failed to join session",
      status: 500,
    };
  }
};

// export const cancelBooking = async (
//   sessionId: string,
//   userId: string
// ): Promise<ServiceResponse> => {
//   try {
//     // Find booking to cancel
//     const booking = await prisma.sessionBooking.findFirst({
//       where: {
//         sessionId,
//         userId,
//         paymentStatus: {
//           in: [PaymentStatus.PENDING, PaymentStatus.COMPLETED],
//         },
//       },
//       include: {
//         session: true,
//       },
//     });

//     if (!booking) {
//       return {
//         success: false,
//         message: "No active booking found",
//         status: 404
//       };
//     }

//     // Check if session has already started
//     if (new Date(booking.session.scheduledAt) < new Date()) {
//       return {
//         success: false,
//         message: "Cannot cancel session that has already started",
//         status: 400
//       };
//     }

//     // Process refund if paid (in real app)
//     if (booking.paymentStatus === PaymentStatus.COMPLETED && booking.stripePaymentId) {
//       // Call payment service refund API here
//       // await stripe.refunds.create({ payment_intent: booking.stripePaymentId });
//     }

//     // Delete booking
//     await prisma.sessionBooking.delete({
//       where: { id: booking.id },
//     });

//     return {
//       success: true,
//       message: "Booking cancelled successfully",
//       status: 200
//     };
//   } catch (error: any) {
//     console.log("ERROR in cancelBooking:", error.message);
//     return {
//       success: false,
//       error: error.message,
//       message: "Failed to cancel booking",
//       status: 500
//     };
//   }
// };

type BookingWithSession = Prisma.SessionBookingGetPayload<{
  include: { session: true };
}>;

export const cancelBooking = async (
  sessionId: string,
  userId: string
): Promise<ServiceResponse> => {
  try {
    // 1. Find the booking itself
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
      return {
        success: false,
        message: "No active booking found",
        status: 404,
      };
    }

    // 2. Fetch the session separately
    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      select: { scheduledAt: true, endsAt: true }, // fetch only what you need
    });

    if (!session) {
      return {
        success: false,
        message: "Session not found",
        status: 404,
      };
    }

    // 3. Use scheduledAt / endDate to validate
    const sessionStart = new Date(session.scheduledAt);
    const sessionEnd = session.endsAt ? new Date(session.endsAt) : null;

    if (sessionEnd && sessionEnd < new Date()) {
      return {
        success: false,
        message: "Cannot cancel session that has already ended",
        status: 400,
      };
    }

    if (!sessionEnd && sessionStart < new Date()) {
      return {
        success: false,
        message: "Cannot cancel session that has already started",
        status: 400,
      };
    }

    // 4. Handle refund if needed
    if (
      booking.paymentStatus === PaymentStatus.COMPLETED &&
      booking.stripePaymentId
    ) {
      // await stripe.refunds.create({ payment_intent: booking.stripePaymentId });
    }

    // 5. Delete booking
    await prisma.sessionBooking.delete({
      where: { id: booking.id },
    });

    return {
      success: true,
      message: "Booking cancelled successfully",
      status: 200,
    };
  } catch (error: any) {
    console.error("ERROR in cancelBooking:", error.message);
    return {
      success: false,
      error: error.message,
      message: "Failed to cancel booking",
      status: 500,
    };
  }
};


export const getMyFutureScheduledSessions = async (
  userId: string
): Promise<ServiceResponse> => {
  try {
    const bookings = await prisma.sessionBooking.findMany({
      where: {
        userId,
        session: {
          status: SessionStatus.UPCOMING,
          scheduledAt: {
            gt: new Date(),
          },
        },
        paymentStatus: PaymentStatus.COMPLETED, // Only show paid bookings
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

    return {
      success: true,
      data: bookings,
      message: "Upcoming sessions fetched successfully",
      status: 200,
    };
  } catch (error: any) {
    console.log("ERROR in getMyFutureScheduledSessions:", error.message);
    return {
      success: false,
      error: error.message,
      message: "Failed to fetch upcoming sessions",
      status: 500,
    };
  }
};

// Additional utility functions
export const updateSessionStatus = async (
  sessionId: string,
  status: SessionStatus
): Promise<ServiceResponse> => {
  try {
    const session = await prisma.session.update({
      where: { id: sessionId },
      data: { status },
    });

    return {
      success: true,
      data: session,
      message: "Session status updated successfully",
      status: 200,
    };
  } catch (error: any) {
    console.log("ERROR in updateSessionStatus:", error.message);
    return {
      success: false,
      error: error.message,
      message: "Failed to update session status",
      status: 500,
    };
  }
};

export const getInstructorSessions = async (
  instructorId: string
): Promise<ServiceResponse> => {
  try {
    const sessions = await prisma.session.findMany({
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

    return {
      success: true,
      data: sessions,
      message: "Instructor sessions fetched successfully",
      status: 200,
    };
  } catch (error: any) {
    console.log("ERROR in getInstructorSessions:", error.message);
    return {
      success: false,
      error: error.message,
      message: "Failed to fetch instructor sessions",
      status: 500,
    };
  }
};

export const leaveSession = async (
  sessionId: string,
  userId: string
): Promise<ServiceResponse> => {
  try {
    const booking = await prisma.sessionBooking.findFirst({
      where: {
        sessionId,
        userId,
        joinedAt: { not: null },
        leftAt: null,
      },
    });

    if (!booking) {
      return {
        success: false,
        message: "No active session participation found",
        status: 404,
      };
    }

    const joinedAt = booking.joinedAt!;
    const leftAt = new Date();
    const durationAttended = Math.floor(
      (leftAt.getTime() - joinedAt.getTime()) / 60000
    ); // minutes

    await prisma.sessionBooking.update({
      where: { id: booking.id },
      data: {
        leftAt,
        durationAttended,
      },
    });

    return {
      success: true,
      message: "Session left successfully",
      data: { durationAttended },
      status: 200,
    };
  } catch (error: any) {
    console.log("ERROR in leaveSession:", error.message);
    return {
      success: false,
      error: error.message,
      message: "Failed to leave session",
      status: 500,
    };
  }
};
