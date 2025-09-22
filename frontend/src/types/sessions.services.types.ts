

// ==================================================== SESSIONS SERVICE =====================================================

// Session Types
export interface Session {
  id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  duration: number; // in minutes
  courseId?: string;
  instructorId: string;
  meetingUrl?: string;
  status: "SCHEDULED" | "ONGOING" | "COMPLETED" | "CANCELLED";
  maxParticipants?: number;
  isRecurring: boolean;
  recurrencePattern?: string;
  createdAt: string;
  updatedAt: string;
}

// sessions.services.types.ts

export interface RecurrenceRequest {
  frequency: "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY";
  interval?: number; // default: 1 (every 1 day/week/month/year)
  daysOfWeek?: number[]; // 0 = Sunday .. 6 = Saturday (for WEEKLY)
  dayOfMonth?: number; // e.g., 15 => every 15th (for MONTHLY)
  monthOfYear?: number; // 1 = Jan .. 12 = Dec (for YEARLY)
  endDate?: string; // ISO date when recurrence stops
  occurrences?: number; // number of times to repeat (alt. to endDate)
}


export interface SessionParticipant {
  id: string;
  sessionId: string;
  userId: string;
  joinedAt?: string;
  leftAt?: string;
  attendanceStatus: "PENDING" | "PRESENT" | "ABSENT" | "LATE";
  participationScore?: number;
  notes?: string;
}

export interface SessionRecording {
  id: string;
  sessionId: string;
  recordingUrl: string;
  startTime: string;
  endTime: string;
  duration: number;
  storageLocation: "S3" | "SUPABASE" | "VIMEO" | "YOUTUBE";
  thumbnailUrl?: string;
  createdAt: string;
}

export interface SessionResource {
  id: string;
  sessionId: string;
  title: string;
  description?: string;
  url: string;
  type: "DOCUMENT" | "VIDEO" | "LINK" | "SLIDES" | "OTHER";
  uploadedById: string;
  createdAt: string;
}

export interface SessionQueryParams {
  page?: number;
  limit?: number;
  courseId?: string;
  instructorId?: string;
  status?: "SCHEDULED" | "ONGOING" | "COMPLETED" | "CANCELLED";
  fromDate?: string;
  toDate?: string;
  sortBy?: "date" | "title" | "duration";
  sortOrder?: "asc" | "desc";
  search?: string;
}

export interface SessionStats {
  totalSessions: number;
  completedSessions: number;
  upcomingSessions: number;
  averageAttendance: number;
  totalParticipants: number;
  totalDuration: number;
}

export interface CreateSessionRequest {
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  courseId?: string;
  instructorId: string;
  meetingUrl?: string;
  maxParticipants?: number;
  isRecurring?: boolean;
  recurrencePattern?: string;
}

export interface UpdateSessionRequest extends Partial<CreateSessionRequest> {
  status?: "SCHEDULED" | "ONGOING" | "COMPLETED" | "CANCELLED";
}

export interface SessionAttendanceReport {
  sessionId: string;
  totalParticipants: number;
  presentCount: number;
  absentCount: number;
  lateCount: number;
  participants: {
    userId: string;
    name: string;
    email: string;
    status: "PRESENT" | "ABSENT" | "LATE";
    joinedAt?: string;
    leftAt?: string;
  }[];
}

