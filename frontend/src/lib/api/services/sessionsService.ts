import { apiManager, ApiResponse, PaginatedResponse } from "../api-manager";

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

class SessionService {
  private static instance: SessionService;

  private constructor() {}

  public static getInstance(): SessionService {
    if (!SessionService.instance) {
      SessionService.instance = new SessionService();
    }
    return SessionService.instance;
  }

  // Basic CRUD Operations
  async getSessions(
    params?: SessionQueryParams
  ): Promise<PaginatedResponse<Session>> {
    return apiManager.get<Session[]>("/sessions", { params });
  }

  async getSessionById(id: string): Promise<ApiResponse<Session>> {
    return apiManager.get<Session>(`/sessions/${id}`);
  }

  async createSession(
    data: CreateSessionRequest
  ): Promise<ApiResponse<Session>> {
    return apiManager.post<Session>("/sessions", data);
  }

  async updateSession(
    id: string,
    data: UpdateSessionRequest
  ): Promise<ApiResponse<Session>> {
    return apiManager.patch<Session>(`/sessions/${id}`, data);
  }

  async deleteSession(id: string): Promise<ApiResponse<void>> {
    return apiManager.delete<void>(`/sessions/${id}`);
  }

  // Session Participants
  async getSessionParticipants(
    sessionId: string
  ): Promise<ApiResponse<SessionParticipant[]>> {
    return apiManager.get<SessionParticipant[]>(
      `/sessions/${sessionId}/participants`
    );
  }

  async addParticipant(
    sessionId: string,
    userId: string
  ): Promise<ApiResponse<SessionParticipant>> {
    return apiManager.post<SessionParticipant>(
      `/sessions/${sessionId}/participants`,
      { userId }
    );
  }

  async removeParticipant(
    sessionId: string,
    userId: string
  ): Promise<ApiResponse<void>> {
    return apiManager.delete<void>(
      `/sessions/${sessionId}/participants/${userId}`
    );
  }

  // Session Resources
  async getSessionResources(
    sessionId: string
  ): Promise<ApiResponse<SessionResource[]>> {
    return apiManager.get<SessionResource[]>(
      `/sessions/${sessionId}/resources`
    );
  }

  async addSessionResource(
    sessionId: string,
    resource: Omit<SessionResource, "id" | "createdAt" | "uploadedById">,
    uploadedById: string
  ): Promise<ApiResponse<SessionResource>> {
    return apiManager.post<SessionResource>(
      `/sessions/${sessionId}/resources`,
      {
        ...resource,
        uploadedById,
      }
    );
  }

  async deleteSessionResource(
    sessionId: string,
    resourceId: string
  ): Promise<ApiResponse<void>> {
    return apiManager.delete<void>(
      `/sessions/${sessionId}/resources/${resourceId}`
    );
  }

  // Recordings
  async getSessionRecordings(
    sessionId: string
  ): Promise<ApiResponse<SessionRecording[]>> {
    return apiManager.get<SessionRecording[]>(
      `/sessions/${sessionId}/recordings`
    );
  }

  async addSessionRecording(
    sessionId: string,
    recordingData: Omit<SessionRecording, "id" | "createdAt">
  ): Promise<ApiResponse<SessionRecording>> {
    return apiManager.post<SessionRecording>(
      `/sessions/${sessionId}/recordings`,
      recordingData
    );
  }

  // Attendance
  async markAttendance(
    sessionId: string,
    participantId: string,
    status: "PRESENT" | "ABSENT" | "LATE"
  ): Promise<ApiResponse<SessionParticipant>> {
    return apiManager.patch<SessionParticipant>(
      `/sessions/${sessionId}/participants/${participantId}/attendance`,
      { status }
    );
  }

  async getAttendanceReport(
    sessionId: string
  ): Promise<ApiResponse<SessionAttendanceReport>> {
    return apiManager.get<SessionAttendanceReport>(
      `/sessions/${sessionId}/attendance-report`
    );
  }

  // Session Status
  async startSession(sessionId: string): Promise<ApiResponse<Session>> {
    return apiManager.post<Session>(`/sessions/${sessionId}/start`);
  }

  async endSession(sessionId: string): Promise<ApiResponse<Session>> {
    return apiManager.post<Session>(`/sessions/${sessionId}/end`);
  }

  async cancelSession(
    sessionId: string,
    reason?: string
  ): Promise<ApiResponse<Session>> {
    return apiManager.post<Session>(`/sessions/${sessionId}/cancel`, {
      reason,
    });
  }

  // Analytics
  async getSessionStats(): Promise<ApiResponse<SessionStats>> {
    return apiManager.get<SessionStats>("/sessions/stats");
  }

  // Recurring Sessions
  async createRecurringSessions(
    template: CreateSessionRequest,
    recurrence: {
      frequency: "DAILY" | "WEEKLY" | "MONTHLY";
      interval: number;
      endAfter?: number;
      endDate?: string;
    }
  ): Promise<ApiResponse<Session[]>> {
    return apiManager.post<Session[]>("/sessions/recurring", {
      template,
      recurrence,
    });
  }

  // Bulk Operations
  async updateMultipleSessions(
    ids: string[],
    data: UpdateSessionRequest
  ): Promise<ApiResponse<Session[]>> {
    return apiManager.patch<Session[]>("/sessions/bulk-update", { ids, data });
  }
}

export const sessionService = SessionService.getInstance();
