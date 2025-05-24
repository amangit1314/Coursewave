import axios from "axios";

// const API_BASE_URL =
//   process.env.ENVIRONMENT === "DEVELOPMENT" ? "http://localhost:5002/api" : "/api";

const API_BASE_URL = "http://localhost:5002/api";

export const courseService = {
  async getCourses() {
    const response = await axios.get(`${API_BASE_URL}/courses`, {
      headers: {
        access_token: "coursewave_access_token",
      },
    });
    return response.data;
  },

  async getCourseById(courseId: string) {
    const response = await axios.get(`${API_BASE_URL}/courses/${courseId}`, {
      headers: {
        access_token: "coursewave_access_token",
      },
    });
    return response.data;
  },

  async getCourseCategories(courseId: string) {
    const response = await axios.get(
      `${API_BASE_URL}/courses/${courseId}/categories`,
      {
        headers: {
          access_token: "coursewave_access_token",
        },
      }
    );
    return response.data;
  },

  async getCourseSections(courseId: string) {
    const response = await axios.get(
      `${API_BASE_URL}/courses/${courseId}/sections`,
      {
        headers: {
          access_token: "coursewave_access_token",
        },
      }
    );
    return response.data;
  },

  async getCourseSectionChapters(courseId: string, sectionId: string) {
    const response = await axios.get(
      `${API_BASE_URL}/courses/${courseId}/sections/${sectionId}/chapters`,
      {
        headers: {
          access_token: "coursewave_access_token",
        },
      }
    );
    return response.data;
  },

  async getCourseChapters(courseId: string) {
    const response = await axios.get(
      `${API_BASE_URL}/courses/${courseId}/chapters`,
      {
        headers: {
          access_token: "coursewave_access_token",
        },
      }
    );
    return response.data;
  },

  async getCourseMuxData(courseId: string) {
    const response = await axios.get(
      `${API_BASE_URL}/courses/${courseId}/muxDatas`,
      {
        headers: {
          access_token: "coursewave_access_token",
        },
      }
    );
    return response.data;
  },

  async getCourseCloudinaryData(courseId: string) {
    const response = await axios.get(
      `${API_BASE_URL}/courses/${courseId}/cloudinaryDatas`,
      {
        headers: {
          access_token: "coursewave_access_token",
        },
      }
    );
    return response.data;
  },

  async getCourseAttachments(courseId: string) {
    const response = await axios.get(
      `${API_BASE_URL}/courses/${courseId}/attachments`,
      {
        headers: {
          access_token: "coursewave_access_token",
        },
      }
    );
    return response.data;
  },

  async getCourseProgress(userId: string, courseId: string) {
    const response = await axios.get(
      `${API_BASE_URL}/profile/${userId}/enrolledCourses/${courseId}/courseProgress`,
      {
        headers: {
          access_token: "coursewave_access_token",
        },
      }
    );
    return response.data;
  },

  async updateCourseProgress(
    userId: string,
    courseId: string,
    chapterId: string,
    isCompleted: boolean
  ) {
    const response = await axios.patch(
      `${API_BASE_URL}/profile/${userId}/enrolledCourses/${courseId}/courseProgress/chapters/${chapterId}`,
      { isCompleted },
      {
        headers: {
          access_token: "coursewave_access_token",
        },
      }
    );
    return response.data;
  },

  async getCourseReviews(courseId: string) {
    const response = await axios.get(
      `${API_BASE_URL}/courses/${courseId}/reviews`,
      {
        headers: {
          access_token: "coursewave_access_token",
        },
      }
    );
    return response.data;
  },

  async getCourseEnrollments(courseId: string) {
    const response = await axios.get(
      `${API_BASE_URL}/courses/${courseId}/enrollments`,
      {
        headers: {
          access_token: "coursewave_access_token",
        },
      }
    );
    return response.data;
  },

  async getCoursePurchases(courseId: string) {
    const response = await axios.get(
      `${API_BASE_URL}/courses/${courseId}/purchases`,
      {
        headers: {
          access_token: "coursewave_access_token",
        },
      }
    );
    return response.data;
  },

  async getCoursePayments(courseId: string) {
    const response = await axios.get(
      `${API_BASE_URL}/courses/${courseId}/payments`,
      {
        headers: {
          access_token: "coursewave_access_token",
        },
      }
    );
    return response.data;
  },

  async getCourseInstructor(courseId: string) {
    const response = await axios.get(
      `${API_BASE_URL}/courses/${courseId}/instructor`,
      {
        headers: {
          access_token: "coursewave_access_token",
        },
      }
    );
    return response.data;
  },

  async getInstructorEarnings(courseId: string) {
    const response = await axios.get(
      `${API_BASE_URL}/courses/${courseId}/instructorEarnings`,
      {
        headers: {
          access_token: "coursewave_access_token",
        },
      }
    );
    return response.data;
  },

  async saveCourse(userId: string, courseId: string) {
    const response = await axios.post(
      `${API_BASE_URL}/profile/${userId}/savedCourses`,
      { courseId },
      {
        headers: {
          access_token: "coursewave_access_token",
        },
      }
    );
    return response.data;
  },
};
