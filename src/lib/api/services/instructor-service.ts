import { ApiManager } from '../api-manager';
import { Instructor as InstructorType } from '@/types/instructor';
import { Course as CourseType } from '@/types/course';

export interface Instructor {
  id: string;
  userId: string;
  bio: string | null;
  expertise: string[];
  websiteUrl: string | null;
  socialLinks: any;
  totalStudents: number;
  totalCourses: number;
  averageRating: number;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string | null;
    email: string;
    profileImageUrl: string | null;
    about: string | null;
  };
  courses: CourseType[];
}

export interface InstructorAnalytics {
  totalEarning: string;
  totalStudents: number;
  totalCourses: number;
  createdCourses: CourseType[];
  averageStarRating: number;
}

export class InstructorService {
  private apiManager: ApiManager;

  constructor() {
    this.apiManager = ApiManager.getInstance();
  }

  async getInstructorById(instructorId: string): Promise<InstructorType> {
    console.log("InstructorService: Fetching instructor by ID:", instructorId);
    const response = await this.apiManager.get(`/api/instructor/${instructorId}`);
    console.log("InstructorService: Instructor response:", response);
    return response.data;
  }

  async getInstructorByUserId(userId: string): Promise<InstructorType> {
    console.log("InstructorService: Fetching instructor by user ID:", userId);
    const response = await this.apiManager.get(`/api/instructor/user/${userId}`);
    console.log("InstructorService: Instructor by user ID response:", response);
    return response.data;
  }

  async getInstructorAnalytics(instructorId: string): Promise<InstructorAnalytics> {
    console.log("InstructorService: Fetching analytics for instructor:", instructorId);
    const response = await this.apiManager.get(`/api/instructor/${instructorId}/analytics`);
    console.log("InstructorService: Analytics response:", response);
    return response.data;
  }

  async getInstructorCourses(instructorId: string): Promise<CourseType[]> {
    const response = await this.apiManager.get(`/api/instructor/${instructorId}/courses`);
    return response.data;
  }

  async getInstructorTotalStudents(instructorId: string): Promise<number> {
    const response = await this.apiManager.get(`/api/instructor/${instructorId}/students`);
    return response.data;
  }
}

export const instructorService = new InstructorService(); 