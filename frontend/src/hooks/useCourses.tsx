"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { courseService } from "@/lib/api/services";
import { Course } from "@/types/course-details-api-response";
import { useCoursesStore } from "@/zustand/coursesStore";
import toast from "react-hot-toast";
import { Enrollment } from "@/types/user-enrollments-api-response";
import CourseIdPage from "@/app/(instructor)/instructor/courses/[courseId]/page";

// Fetch all courses
export const useCourses = () => {
  const setCourses = useCoursesStore((state) => state.setCourses);

  return useQuery<Course[]>({
    queryKey: ["courses"],
    queryFn: async () => {
      const res = await courseService.getCourses();
      setCourses(res?.data); // sync Zustand
      return res?.data ?? [];
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

// Fetch single course
export const useCourse = (courseId: string) => {
  return useQuery({
    queryKey: ["course", courseId],
    queryFn: async () => await courseService.getCourseById(courseId),
    enabled: !!courseId,
  });
};

export const useCourseAttachments = (courseId: string) => {
  return useQuery({
    queryKey: ["course", courseId, "attachments"],
    queryFn: () =>
      courseService
        .getCourseAttachments(courseId)
        .then((res) => res.data),
    enabled: !!courseId,
  });
};

export const useCourseProgress = (courseId: string) => {
  return useQuery({
    queryKey: ["courseProgress", courseId],
    queryFn: async () => await courseService.getProgress(courseId),
    enabled: !!courseId,
  });
};

// Fetch course sections
export const useCourseSections = (id?: string) => {
  return useQuery({
    queryKey: ["course", id],
    queryFn: () => async (id: string) => {
      const result = await courseService.getCourseSections(id!);
      return result.data ?? [];
    },
    enabled: !!id, // Only run if id is present
  });
};

// Course reviews
export const useCourseReviews = (courseId: string) =>
  useQuery({
    queryKey: ["courseReviews", courseId],
    queryFn: () => courseService.getCourseReviews(courseId),
    enabled: !!courseId,
  });

// Course instructor
export const useCourseInstructor = (courseId: string) =>
  useQuery({
    queryKey: ["courseInstructor", courseId],
    queryFn: () => courseService.getCourseInstructor(courseId),
    enabled: !!courseId,
  });

// Save course
export const useSaveCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (courseId: string) => courseService.saveCourse(courseId),
    onSuccess: (response) => {
      toast.success(response.message ?? "Course saved successfully");
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
  });
};

// Unsave course
export const useUnsaveCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (courseId: string) => courseService.unsaveCourse(courseId),
    onSuccess: (response) => {
      toast.success(response.message ?? "Course unsaved successfully");
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
  });
};

// Enroll in course
export const useEnrollInCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (courseId: string) => courseService.enrollInCourse(courseId),
    onSuccess: (response) => {
      toast.success(response.data.message ?? "Enrolled successfully");
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
  });
};

// Check if course is purchased or not
export const useCheckCourseIsPurchased = (userId: string, courseId: string) => {
  const fetchIsCourseAlreadyPurchased = async () => {
    const isCourseAlreadyPurchasedUrl =
      process.env.ENVIRONMENT! === "DEVELOPMENT"
        ? `/api/courses/${courseId}/alreadyPurchased?userId=${userId}`
        : `api/courses/${courseId}/alreadyPurchased?userId=${userId}`;

    const response = await fetch(isCourseAlreadyPurchasedUrl, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error(
        `Failed to get course info from /api/courses/${courseId}/alreadyPurchased`
      );
    }

    return await response.json();
  };

  const { data, error, isLoading } = useQuery({
    queryKey: ["courseIsPurchased", userId, courseId],
    queryFn: fetchIsCourseAlreadyPurchased,
    staleTime: 4 * 60 * 1000,
  });

  const courseIsPurchased: boolean = !!(data?.data?.hasPurchased ?? false);
  const enrollment: Enrollment = data?.data?.enrollment! as Enrollment;
  const purchase = data?.data?.purchase!;

  return { courseIsPurchased, enrollment, purchase, error, isLoading };
};
