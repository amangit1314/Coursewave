import express, { Request, Response } from 'express';
import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { 
  verifyToken, 
  requireInstructor,
  validateUUID,
  asyncHandler,
  sendSuccess,
  sendNotFound,
  sendError,
  invalidateCacheAfter
} from '../core/middleware';

const router: Router = express.Router();
const prisma = new PrismaClient();

// Get all available sessions (public)
// router.get('/', 
//   asyncHandler(async (req: Request, res: Response) => {
//     const sessions = await prisma.liveSession.findMany({
//       where: {
//         status: SessionStatus.UPCOMING,
//         startTime: {
//           gt: new Date()
//         }
//       },
//       include: {
//         instructor: {
//           include: {
//             user: {
//               select: {
//                 name: true,
//                 profileImageUrl: true
//               }
//             }
//           }
//         },
//         _count: {
//           select: {
//             bookings: true
//           }
//         }
//       },
//       orderBy: {
//         startTime: 'asc'
//       }
//     });

//     sendSuccess(res, sessions, 'Sessions fetched successfully');
//   })
// );

// Get session details by ID (public)
// router.get('/:sessionId', 
//   validateUUID('sessionId'),
//   asyncHandler(async (req: Request, res: Response) => {
//     const { sessionId } = req.params;
    
//     const session = await prisma.liveSession.findUnique({
//       where: { id: sessionId },
//       include: {
//         instructor: {
//           include: {
//             user: {
//               select: {
//                 name: true,
//                 profileImageUrl: true,
//               }
//             }
//           }
//         },
//         bookings: {
//           include: {
//             user: {
//               select: {
//                 name: true,
//                 profileImageUrl: true
//               }
//             }
//           },
//           take: 5 // Show first 5 bookings
//         },
//         _count: {
//           select: {
//             bookings: true
//           }
//         }
//       }
//     });

//     if (!session) {
//       return sendNotFound(res, 'Session not found');
//     }

//     sendSuccess(res, session, 'Session details fetched successfully');
//   })
// );

// Create new session (instructor only)
// router.post('/', 
//   verifyToken,
//   requireInstructor,
//   invalidateCacheAfter('sessions'),
//   asyncHandler(async (req: Request, res: Response) => {
//     const {
//       title,
//       description,
//       isFree,
//       price,
//       startTime,
//       duration,
//       provider = 'ZOOM'
//     } = req.body;

//     // Calculate end time
//     const endTime = new Date(new Date(startTime).getTime() + duration * 60000);
    
//     // Create session
//     const session = await prisma.liveSession.create({
//       data: {
//         title,
//         description,
//         isFree,
//         price: isFree ? 0 : price,
//         currency: 'USD',
//         startTime: new Date(startTime),
//         duration,
//         endTime,
//         provider,
//         instructorId: req.instructor.id,
//         status: SessionStatus.UPCOMING
//       }
//     });

//     sendSuccess(res, session, 'Session created successfully', 201);
//   })
// );

// Book a session (authenticated users)
// router.post('/:sessionId/book', 
//   verifyToken,
//   validateUUID('sessionId'),
//   asyncHandler(async (req: Request, res: Response) => {
//     const { sessionId } = req.params;
//     const userId = req.user.id;

//     // Check session availability
//     const session = await prisma.liveSession.findUnique({
//       where: { id: sessionId }
//     });

//     if (!session) {
//       return sendNotFound(res, 'Session not found');
//     }

//     if (session.status !== SessionStatus.UPCOMING) {
//       return sendError(res, 'Session is not available for booking', 400);
//     }

//     // Check if user already booked this session
//     const existingBooking = await prisma.sessionBooking.findFirst({
//       where: {
//         sessionId,
//         userId
//       }
//     });

//     if (existingBooking) {
//       return sendError(res, 'You have already booked this session', 400);
//     }

//     // Create booking
//     const booking = await prisma.sessionBooking.create({
//       data: {
//         sessionId,
//         userId,
//         status: BookingStatus.CONFIRMED
//       },
//       include: {
//         session: {
//           include: {
//             instructor: {
//               include: {
//                 user: {
//                   select: {
//                     name: true,
//                     profileImageUrl: true
//                   }
//                 }
//               }
//             }
//           }
//         },
//         user: {
//           select: {
//             name: true,
//             profileImageUrl: true
//           }
//         }
//       }
//     });

//     sendSuccess(res, booking, 'Session booked successfully', 201);
//   })
// );

// Process payment for session booking
// router.post('/:sessionId/pay', 
//   verifyToken,
//   validateUUID('sessionId'),
//   asyncHandler(async (req: Request, res: Response) => {
//     const { sessionId } = req.params;
//     const userId = req.user.id;
//     const { paymentMethod, paymentId } = req.body;

//     // Verify booking exists
//     const booking = await prisma.sessionBooking.findFirst({
//       where: {
//         sessionId,
//         userId,
//         status: BookingStatus.PENDING
//       },
//       include: {
//         session: true
//       }
//     });

//     if (!booking) {
//       return sendNotFound(res, 'No pending booking found');
//     }

//     // In a real app, verify payment with Stripe/etc here
//     // This is just a simulation
//     const paymentVerified = true;

//     if (!paymentVerified) {
//       return sendError(res, 'Payment verification failed', 400);
//     }

//     // Update booking status
//     const updatedBooking = await prisma.sessionBooking.update({
//       where: { id: booking.id },
//       data: {
//         status: BookingStatus.CONFIRMED,
//         paymentId: paymentId
//       }
//     });

//     sendSuccess(res, updatedBooking, 'Payment processed successfully');
//   })
// );

// Join a session (authenticated users with valid booking)
// router.post('/:sessionId/join', 
//   verifyToken,
//   validateUUID('sessionId'),
//   asyncHandler(async (req: Request, res: Response) => {
//     const { sessionId } = req.params;
//     const userId = req.user.id;

//     // Verify valid booking
//     const booking = await prisma.sessionBooking.findFirst({
//       where: {
//         sessionId,
//         userId,
//         status: BookingStatus.CONFIRMED
//       },
//       include: {
//         session: true
//       }
//     });

//     if (!booking) {
//       return sendError(res, 'Valid booking required to join session', 403);
//     }

//     // Check session status
//     if (booking.session.status !== SessionStatus.LIVE) {
//       return sendError(res, 'Session is not currently active', 400);
//     }

//     // Update booking with join time
//     await prisma.sessionBooking.update({
//       where: { id: booking.id },
//       data: {
//         joinedAt: new Date()
//       }
//     });

//     // Return session connection details from meetingData
//     const meetingData = booking.session.meetingData as any;
    
//     sendSuccess(res, {
//       rtcRoomId: meetingData?.rtcRoomId,
//       rtcToken: meetingData?.rtcToken,
//       rtcConfig: meetingData?.rtcConfig
//     }, 'Session joined successfully');
//   })
// );

// Cancel a booking (authenticated users)
// router.delete('/:sessionId/cancel', 
//   verifyToken,
//   validateUUID('sessionId'),
//   asyncHandler(async (req: Request, res: Response) => {
//     const { sessionId } = req.params;
//     const userId = req.user.id;

//     // Find booking to cancel
//     const booking = await prisma.sessionBooking.findFirst({
//       where: {
//         sessionId,
//         userId,
//         status: {
//           in: [BookingStatus.PENDING, BookingStatus.CONFIRMED]
//         }
//       },
//       include: {
//         session: true
//       }
//     });

//     if (!booking) {
//       return sendNotFound(res, 'No active booking found');
//     }

//     // Check if session has already started
//     if (new Date(booking.session.startTime) < new Date()) {
//       return sendError(res, 'Cannot cancel session that has already started', 400);
//     }

//     // Process refund if paid (in real app)
//     // if (booking.paymentId) {
//     //   // Call payment service refund API here
//     // }

//     // Delete booking
//     await prisma.sessionBooking.delete({
//       where: { id: booking.id }
//     });

//     sendSuccess(res, null, 'Booking cancelled successfully');
//   })
// );

// Get user's upcoming sessions
// router.get('/user/upcoming', 
//   verifyToken,
//   asyncHandler(async (req: Request, res: Response) => {
//     const userId = req.user.id;

//     const bookings = await prisma.sessionBooking.findMany({
//       where: {
//         userId,
//         session: {
//           status: SessionStatus.UPCOMING,
//           startTime: {
//             gt: new Date()
//           }
//         }
//       },
//       include: {
//         session: {
//           include: {
//             instructor: {
//               include: {
//                 user: {
//                   select: {
//                     name: true,
//                     profileImageUrl: true
//                   }
//                 }
//               }
//             }
//           }
//         }
//       },
//       orderBy: {
//         session: {
//           startTime: 'asc'
//         }
//       }
//     });

//     sendSuccess(res, bookings, 'Upcoming sessions fetched successfully');
//   })
// );

export default router;