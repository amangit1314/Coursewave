import { Session } from "@/types/session";
import {
  CreateSessionRequest,
  SessionAttendanceReport,
  SessionParticipant,
  SessionQueryParams,
  SessionRecording,
  SessionResource,
  SessionStats,
  UpdateSessionRequest,
  RecurrenceRequest,
} from "@/types/sessions.services.types";
import { apiManager, ApiResponse, PaginatedResponse } from "../api-manager";

class SessionService {
  private static instance: SessionService;

  private constructor() {}

  public static getInstance(): SessionService {
    if (!SessionService.instance) {
      SessionService.instance = new SessionService();
    }
    return SessionService.instance;
  }

  // -----------------------
  // CRUD
  // -----------------------

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

  // -----------------------
  // Participants
  // -----------------------

  async getSessionParticipants(
    sessionId: string,
    params?: { page?: number; limit?: number }
  ): Promise<PaginatedResponse<SessionParticipant>> {
    return apiManager.get<SessionParticipant[]>(
      `/sessions/${sessionId}/participants`,
      { params }
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

  // -----------------------
  // Resources
  // -----------------------

  async getSessionResources(
    sessionId: string
  ): Promise<ApiResponse<SessionResource[]>> {
    return apiManager.get<SessionResource[]>(`/sessions/${sessionId}/resources`);
  }

  async addSessionResource(
    sessionId: string,
    resource: Omit<SessionResource, "id" | "createdAt" | "uploadedById">
  ): Promise<ApiResponse<SessionResource>> {
    return apiManager.post<SessionResource>(
      `/sessions/${sessionId}/resources`,
      resource
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

  // -----------------------
  // Recordings
  // -----------------------

  async getSessionRecordings(
    sessionId: string
  ): Promise<ApiResponse<SessionRecording[]>> {
    return apiManager.get<SessionRecording[]>(`/sessions/${sessionId}/recordings`);
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

  // -----------------------
  // Attendance
  // -----------------------

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

  // -----------------------
  // Session Status
  // -----------------------

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
    return apiManager.post<Session>(`/sessions/${sessionId}/cancel`, { reason });
  }

  // -----------------------
  // Analytics
  // -----------------------

  async getSessionStats(): Promise<ApiResponse<SessionStats>> {
    return apiManager.get<SessionStats>("/sessions/stats");
  }

  // -----------------------
  // Recurrence
  // -----------------------

  async createRecurringSessions(
    template: CreateSessionRequest,
    recurrence: RecurrenceRequest
  ): Promise<ApiResponse<Session[]>> {
    return apiManager.post<Session[]>("/sessions/recurring", {
      template,
      recurrence,
    });
  }

  // -----------------------
  // Booking & Joining
  // -----------------------

  async bookSession(sessionId: string): Promise<ApiResponse<any>> {
    return apiManager.post<any>(`/sessions/${sessionId}/book`);
  }

  async createSessionCheckout(
    sessionId: string
  ): Promise<ApiResponse<{ checkoutUrl: string; sessionId: string }>> {
    return apiManager.post<{ checkoutUrl: string; sessionId: string }>(
      `/sessions/${sessionId}/checkout`
    );
  }

  async payForSession(
    sessionId: string,
    paymentMethod: string,
    paymentId: string
  ): Promise<ApiResponse<any>> {
    return apiManager.post<any>(`/sessions/${sessionId}/pay`, {
      paymentMethod,
      paymentId,
    });
  }

  async joinSession(
    sessionId: string
  ): Promise<ApiResponse<{
    rtcRoomId: string;
    rtcToken: string | null;
    rtcConfig: any;
    sessionTitle: string;
    instructorId: string;
  }>> {
    return apiManager.post<any>(`/sessions/${sessionId}/join`);
  }

  async cancelBooking(sessionId: string): Promise<ApiResponse<void>> {
    return apiManager.delete<void>(`/sessions/${sessionId}/cancel`);
  }

  async getMyUpcomingSessions(): Promise<ApiResponse<any[]>> {
    return apiManager.get<any[]>("/sessions/my/upcoming");
  }

  // -----------------------
  // Bulk
  // -----------------------

  async updateMultipleSessions(
    ids: string[],
    data: UpdateSessionRequest
  ): Promise<ApiResponse<Session[]>> {
    return apiManager.patch<Session[]>("/sessions/bulk-update", { ids, data });
  }
}

export const sessionService = SessionService.getInstance();
