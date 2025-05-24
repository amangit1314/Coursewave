import express, { Request, Response } from 'express';
import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '../middleware/auth';

const router: Router = express.Router();
const prisma = new PrismaClient();

// Get all available sessions (public)
router.get('/', async (req: Request, res: Response) => {
  try {
    const sessions = await prisma.session.findMany({
      where: {
        status: 'UPCOMING',
        // scheduledAt: {
        //   gt: new Date()
        // }
      },
      include: {
        instructor: {
          include: {
            user: {
              select: {
                name: true,
                profileImageUrl: true
              }
            }
          }
        },
        _count: {
          select: {
            bookings: true
          }
        }
      },
      orderBy: {
        scheduledAt: 'asc'
      }
    });

    console.log("Sessions: ", sessions);

    return res.status(200).json({
      success: true,
      data: sessions
    });
  } catch (error: any) {
    console.error('Error fetching sessions:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch sessions'
    });
  }
});

// Get session details by ID (public)
router.get('/:sessionId', async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    
    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      include: {
        instructor: {
          include: {
            user: {
              select: {
                name: true,
                profileImageUrl: true,
            
              }
            }
          }
        },
        bookings: {
          include: {
            user: {
              select: {
                name: true,
                profileImageUrl: true
              }
            }
          },
          take: 5 // Show first 5 bookings
        },
        _count: {
          select: {
            bookings: true
          }
        }
      }
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: session
    });
  } catch (error: any) {
    console.error('Error fetching session:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch session'
    });
  }
});

// Create new session (instructor only)
router.post('/', verifyToken, async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const {
      title,
      description,
      isFree,
      price,
      scheduledAt,
      duration,
      rtcType = 'WEBRTC'
    } = req.body;

    // Verify instructor role
    const instructor = await prisma.instructor.findUnique({
      where: { userId },
      select: { id: true }
    });

    if (!instructor) {
      return res.status(403).json({
        success: false,
        message: 'Only instructors can create sessions'
      });
    }

    // Generate unique room ID
    const rtcRoomId = `room_${Math.random().toString(36).substr(2, 9)}`;
    
    // Create session
    const session = await prisma.session.create({
      data: {
        title,
        description,
        isFree,
        price: isFree ? 0 : price,
    
        currency: 'USD',
        scheduledAt: new Date(scheduledAt),
        duration,
        endsAt: new Date(new Date(scheduledAt).getTime() + duration * 60000),
        rtcType,
        rtcRoomId,
        instructorId: instructor.id,
        status: 'UPCOMING'
      }
    });

    return res.status(201).json({
      success: true,
      data: session
    });
  } catch (error: any) {
    console.error('Error creating session:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to create session'
    });
  }
});

// Book a session (authenticated users)
router.post('/:sessionId/book', verifyToken, async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    const userId = req.user.id;

    // Check session availability
    const session = await prisma.session.findUnique({
      where: { id: sessionId }
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    if (session.status !== 'UPCOMING') {
      return res.status(400).json({
        success: false,
        message: 'Session is not available for booking'
      });
    }

    // Check for existing booking
    const existingBooking = await prisma.sessionBooking.findFirst({
      where: {
        sessionId,
        userId
      }
    });

    if (existingBooking) {
      return res.status(400).json({
        success: false,
        message: 'You have already booked this session'
      });
    }

    // Create booking
    const booking = await prisma.sessionBooking.create({
      data: {
        sessionId,
        userId,
        // paymentStatus: session.isFree ? 'FREE' : 'PENDING',
        amountPaid: session.isFree ? 0 : session.price
      }
    });

    return res.status(201).json({
      success: true,
      data: booking,
      message: session.isFree ? 'Session booked successfully' : 'Payment required'
    });
  } catch (error: any) {
    console.error('Error booking session:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to book session'
    });
  }
});

// Process payment for session booking
router.post('/:sessionId/pay', verifyToken, async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    const userId = req.user.id;
    const { paymentMethod, paymentId } = req.body;

    // Verify booking exists
    const booking = await prisma.sessionBooking.findFirst({
      where: {
        sessionId,
        userId,
        paymentStatus: 'PENDING'
      },
      include: {
        session: true
      }
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'No pending booking found'
      });
    }

    // In a real app, verify payment with Stripe/etc here
    // This is just a simulation
    const paymentVerified = true;

    if (!paymentVerified) {
      return res.status(400).json({
        success: false,
        message: 'Payment verification failed'
      });
    }

    // Update booking status
    const updatedBooking = await prisma.sessionBooking.update({
      where: { id: booking.id },
      data: {
        // paymentStatus: 'PAID',
        paymentMethod,
        stripePaymentId: paymentId,
        updatedAt: new Date()
      }
    });

    return res.status(200).json({
      success: true,
      data: updatedBooking,
      message: 'Payment processed successfully'
    });
  } catch (error: any) {
    console.error('Error processing payment:', error);
    return res.status(500).json({
      success: false,
      error: 'Payment processing failed'
    });
  }
});

// Join a session (authenticated users with valid booking)
router.post('/:sessionId/join', verifyToken, async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    const userId = req.user.id;

    // Verify valid booking
    const booking = await prisma.sessionBooking.findFirst({
      where: {
        sessionId,
        userId,
        // OR: [
        //   { paymentStatus: 'PAID' },
        //   { paymentStatus: 'FREE' }
        // ]
      },
      include: {
        session: true
      }
    });

    if (!booking) {
      return res.status(403).json({
        success: false,
        message: 'Valid booking required to join session'
      });
    }

    // Check session status
    if (booking.session.status !== 'ONGOING') {
      return res.status(400).json({
        success: false,
        message: 'Session is not currently active'
      });
    }

    // Update booking with join time
    await prisma.sessionBooking.update({
      where: { id: booking.id },
      data: {
        joinedAt: new Date()
      }
    });

    // Return session connection details
    return res.status(200).json({
      success: true,
      data: {
        rtcRoomId: booking.session.rtcRoomId,
        rtcToken: booking.session.rtcToken,
        rtcConfig: booking.session.rtcConfig
      }
    });
  } catch (error: any) {
    console.error('Error joining session:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to join session'
    });
  }
});

// Cancel a booking (authenticated users)
router.delete('/:sessionId/cancel', verifyToken, async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    const userId = req.user.id;

    // Find booking to cancel
    const booking = await prisma.sessionBooking.findFirst({
      where: {
        sessionId,
        userId,
        OR: [
          { paymentStatus: 'PENDING' },
          // { paymentStatus: 'PAID' }
        ]
      },
      include: {
        session: true
      }
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'No active booking found'
      });
    }

    // Check if session has already started
    if (new Date(booking.session.scheduledAt) < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel session that has already started'
      });
    }

    // Process refund if paid (in real app)
    // if (booking.paymentStatus === 'PAID') {
    //   // Call payment service refund API here
    // }

    // Delete booking
    await prisma.sessionBooking.delete({
      where: { id: booking.id }
    });

    return res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully'
    });
  } catch (error: any) {
    console.error('Error cancelling booking:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to cancel booking'
    });
  }
});

// Get user's upcoming sessions
router.get('/user/upcoming', verifyToken, async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;

    const bookings = await prisma.sessionBooking.findMany({
      where: {
        userId,
        session: {
          status: 'UPCOMING',
          scheduledAt: {
            gt: new Date()
          }
        }
      },
      include: {
        session: {
          include: {
            instructor: {
              include: {
                user: {
                  select: {
                    name: true,
                    profileImageUrl: true
                  }
                }
              }
            }
          }
        }
      },
      orderBy: {
        session: {
          scheduledAt: 'asc'
        }
      }
    });

    return res.status(200).json({
      success: true,
      data: bookings
    });
  } catch (error: any) {
    console.error('Error fetching upcoming sessions:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch upcoming sessions'
    });
  }
});

export default router;