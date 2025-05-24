export interface SessionResponse {
    success: boolean;
    data: Session[];
  }
  
  export interface Session {
    id: string;
    title: string;
    description: string;
    status: 'UPCOMING' | 'ONGOING' | 'COMPLETED'; // Add more statuses if needed
    type: 'ONE_TO_ONE' | 'GROUP'; // Add more types if applicable
    rtcType: 'WEBRTC' | 'ZOOM' | string; // Adjust based on possible values
    rtcRoomId: string;
    rtcToken: string | null;
    rtcConfig: any; // Define a more specific type if possible
    isFree: boolean;
    price: number;
    currency: string;
    scheduledAt: string; // ISO string
    duration: number;
    endsAt: string;
    instructorId: string;
    createdAt: string;
    updatedAt: string;
    instructor: Instructor;
    _count: Count;
  }
  
  export interface Instructor {
    id: string;
    userId: string;
    bio: string;
    expertise: string[]; // Adjust if needed (e.g., object type)
    socialLinks: Record<string, string>; // or a specific object if keys are known
    createdAt: string;
    updatedAt: string;
    user: InstructorUser;
  }
  
  export interface InstructorUser {
    name: string | null;
    profileImageUrl: string | null;
  }
  
  export interface Count {
    bookings: number;
  }
  