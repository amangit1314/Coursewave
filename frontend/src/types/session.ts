export type SessionStatus = 'UPCOMING' | 'LIVE' | 'ENDED' | 'COMPLETED';
export type SessionType = 'ONE_TO_ONE' | 'GROUP';
export type RtcType = 'WEBRTC' | 'ZOOM' | 'GOOGLE_MEET';

export interface User {
  name: string;
  profileImageUrl: string | null;
}

export interface Instructor {
  id: string;
  userId: string;
  bio: string;
  expertise: string[];
  socialLinks: Record<string, string>;
  createdAt: string;
  updatedAt: string;
  user: User;
}

export interface Session {
  id: string;
  title: string;
  description: string;
  imageUrl: string | null;
  status: SessionStatus;
  type: SessionType;
  rtcType: RtcType;
  rtcRoomId: string;
  rtcToken: string | null;
  rtcConfig: any | null;
  isFree: boolean;
  price: number;
  currency: string;
  scheduledAt: string;
  duration: number;
  endsAt: string;
  instructorId: string;
  createdAt: string;
  updatedAt: string;
  instructor: Instructor;
  _count: {
    bookings: number;
  };
}

export interface SessionResponse {
  success: boolean;
  data: Session[];
} 