// lib/api/session.ts
import { SessionResponse } from "@/types/session";
import { api } from "./api";

class SessionService {
  async getSessions(): Promise<SessionResponse> {
    try {
      const response = await api.get("/sessions");
      console.log('API Response Status:', response.status);
      console.log('API Response Headers:', response.headers);
      
      if (!response.data) {
        throw new Error('No data received from API');
      }

      return response.data;
    } catch (error) {
      console.error('SessionService Error:', error);
      if (error instanceof Error) {
        console.error('Error details:', {
          message: error.message,
          stack: error.stack,
        });
      }
      throw error;
    }
  }

  async getSessionById(id: string): Promise<SessionResponse> {
    try {
      const response = await api.get(`/sessions/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching session by ID:', error);
      throw error;
    }
  }

  async createSession(data: Partial<SessionResponse>): Promise<SessionResponse> {
    try {
      const response = await api.post("/sessions", data);
      return response.data;
    } catch (error) {
      console.error('Error creating session:', error);
      throw error;
    }
  }

  async updateSession(id: string, data: Partial<SessionResponse>): Promise<SessionResponse> {
    try {
      const response = await api.put(`/sessions/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating session:', error);
      throw error;
    }
  }

  async deleteSession(id: string): Promise<void> {
    try {
      await api.delete(`/sessions/${id}`);
    } catch (error) {
      console.error('Error deleting session:', error);
      throw error;
    }
  }
}

export const sessionService = new SessionService();