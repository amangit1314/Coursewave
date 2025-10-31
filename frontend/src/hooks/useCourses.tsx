"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { courseService } from "@/lib/api/services";
import { Course } from "@/types/course-details-api-response";
import { useCoursesStore } from "@/zustand/coursesStore";
import toast from "react-hot-toast";
import { Enrollment } from "@/types/user-enrollments-api-response";
import { Chapter, CreateCourseRequest } from "@/types/courses.service.types";
import {Chapter as CourseChapter} from "@/types/course-details-api-response";
import { CourseSection } from "@/types/course-details-api-response";

// --------------------------------------- Fetch all courses ---------------------------------------------------------------
export const useCourses = () => {
  const setCourses = useCoursesStore((state) => state.setCourses);

  return useQuery<Course[]>({
    queryKey: ["courses"],
    queryFn: async () => {
      const res = await courseService.getCourses();
      console.log("res in useCourses: ", JSON.stringify(res));

      // Check if res is the data directly or has a data property
      const courses = Array.isArray(res) ? res : res?.data;
      console.log("Courses in useCourses: ", JSON.stringify(courses));

      setCourses(courses ?? []); // sync Zustand
      return courses ?? [];
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

// --------------------------------------- Fetch single course --------------------------------------------------------------
export const useCourse = (courseId: string) => {
  return useQuery({
    queryKey: ["course", courseId],
    queryFn: async () => {
      const response = await courseService.getCourseById(courseId);
      return response.data; // Return the actual course data, not the full response
    },
    enabled: !!courseId,
  });
};

// --------------------------------------- Course Attachments ----------------------------------------------------------------
export const useCourseAttachments = (courseId: string) => {
  return useQuery({
    queryKey: ["course", courseId, "attachments"],
    queryFn: () =>
      courseService.getCourseAttachments(courseId).then((res) => res.data),
    enabled: !!courseId,
  });
};

// Add to your existing useCourses hook file
export const useAddAttachment = () => {
  return useMutation({
    mutationFn: async ({
      courseId,
      attachmentData,
    }: {
      courseId: string;
      attachmentData: { name: string; url: string };
    }) => courseService.addAttachment(courseId, attachmentData),
  });
};

// Add to hooks/useCourses.ts
export const useUpdateAttachment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      courseId,
      attachmentId,
      attachmentData,
    }: {
      courseId: string;
      attachmentId: string;
      attachmentData: { name: string; url: string };
    }) =>
      courseService.updateAttachment(courseId, attachmentId, attachmentData),
    onSuccess: (_, variables) => {
      // Invalidate and refetch course attachments
      queryClient.invalidateQueries({
        queryKey: ["course-attachments", variables.courseId],
      });
    },
  });
};

// In your useCourses hook
export const useDeleteAttachment = () => {
  return useMutation({
    mutationFn: async ({
      courseId,
      attachmentId,
    }: {
      courseId: string;
      attachmentId: string;
    }) => courseService.deleteAttachment(courseId, attachmentId),
  });
};

// ------------------------------------------ Course progress -------------------------------------------------
export const useCourseProgress = (courseId: string) => {
  return useQuery({
    queryKey: ["courseProgress", courseId],
    queryFn: async () => await courseService.getProgress(courseId),
    enabled: !!courseId,
  });
};

// Course instructor
export const useCourseInstructor = (courseId: string) =>
  useQuery({
    queryKey: ["courseInstructor", courseId],
    queryFn: async () => {
      const result = await courseService.getCourseInstructor(courseId);
      return result.data ?? {};
    },
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

// Create Course
export const useCreateCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (courseDetails: CreateCourseRequest) => {
      return await courseService.createCourse(courseDetails);
    },
    onMutate: async (newCourse) => {
      // 🔹 Cancel any outgoing refetches to avoid overwriting
      await queryClient.cancelQueries({ queryKey: ["courses"] });

      // 🔹 Snapshot previous courses
      const previousCourses = queryClient.getQueryData(["courses"]);

      // 🔹 Optimistically update UI
      queryClient.setQueryData(["courses"], (old: any) => [
        ...(old ?? []),
        { ...newCourse, id: "temp-id", optimistic: true },
      ]);

      return { previousCourses };
    },
    onError: (_err, _newCourse, context) => {
      // 🔹 Rollback on error
      if (context?.previousCourses) {
        queryClient.setQueryData(["courses"], context.previousCourses);
      }
    },
    onSettled: () => {
      // 🔹 Always refetch after mutation
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
  });
};

//  Update Course
export const useUpdateCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      courseId,
      updates,
    }: {
      courseId: string;
      updates: any;
    }) => {
      return await courseService.updateCourse(courseId, updates);
    },
    onMutate: async ({ courseId, updates }) => {
      await queryClient.cancelQueries({ queryKey: ["course", courseId] });

      const previousCourse = queryClient.getQueryData(["course", courseId]);

      queryClient.setQueryData(["course", courseId], (old: any) => ({
        ...old,
        ...updates,
      }));

      return { previousCourse };
    },
    onError: (_err, { courseId }, context) => {
      if (context?.previousCourse) {
        queryClient.setQueryData(["course", courseId], context.previousCourse);
      }
    },
    onSettled: (_data, _err, { courseId }) => {
      queryClient.invalidateQueries({ queryKey: ["course", courseId] });
      queryClient.invalidateQueries({ queryKey: ["courses"] }); // refresh list
    },
  });
};

// Delete Course
// export const useDeleteCourse = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: async (courseId: string) => {
//       return await courseService.deleteCourse(courseId);
//     },
//     onMutate: async (courseId) => {
//       await queryClient.cancelQueries({ queryKey: ["courses"] });

//       const previousCourses = queryClient.getQueryData(["courses"]);

//       queryClient.setQueryData(["courses"], (old: any) =>
//         (old ?? []).filter((course: any) => course.id !== courseId)
//       );

//       return { previousCourses };
//     },
//     onError: (_err, _courseId, context) => {
//       if (context?.previousCourses) {
//         queryClient.setQueryData(["courses"], context.previousCourses);
//       }
//     },
//     onSettled: () => {
//       queryClient.invalidateQueries({ queryKey: ["courses"] });
//     },
//   });
// };

export const useDeleteCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (courseId: string) => {
      return await courseService.deleteCourse(courseId);
    },
    onMutate: async (courseId) => {
      // Cancel all related queries
      await queryClient.cancelQueries({ queryKey: ["courses"] });
      await queryClient.cancelQueries({ queryKey: ["myCreatedCourses"] });

      // Store previous data for both queries
      const previousCourses = queryClient.getQueryData(["courses"]);
      const previousMyCourses = queryClient.getQueryData(["myCreatedCourses"]);

      // Optimistically update both queries
      queryClient.setQueryData(["courses"], (old: any) =>
        (old ?? []).filter((course: any) => course.id !== courseId)
      );

      queryClient.setQueryData(["myCreatedCourses"], (old: any) =>
        (old ?? []).filter((course: any) => course.id !== courseId)
      );

      return { previousCourses, previousMyCourses };
    },
    onError: (_err, _courseId, context) => {
      // Rollback both queries on error
      if (context?.previousCourses) {
        queryClient.setQueryData(["courses"], context.previousCourses);
      }
      if (context?.previousMyCourses) {
        queryClient.setQueryData(
          ["myCreatedCourses"],
          context.previousMyCourses
        );
      }
    },
    onSettled: () => {
      // Invalidate both queries to ensure fresh data
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      queryClient.invalidateQueries({ queryKey: ["myCreatedCourses"] });
    },
  });
};

/** ================================= Course Sections ======================================= */
export const useCourseSections = (courseId: string) => {
  return useQuery({
    queryKey: ["sections", courseId], // ✅ Unique key
    queryFn: async () => {
      console.log("🔍 useCourseSections fetching for:", courseId);
      const result = await courseService.getCourseSections(courseId);
      console.log("📦 useCourseSections result:", result);
      return result.data ?? [];
    },
    enabled: !!courseId,
  });
};

// -------------------- Create Section --------------------
export const useCreateSection = (courseId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<CourseSection>) =>
      courseService.addSection(courseId, data),

    onMutate: async (newSection) => {
      await queryClient.cancelQueries({ queryKey: ["sections", courseId] });

      const previous = queryClient.getQueryData<CourseSection[]>([
        "sections",
        courseId,
      ]);

      queryClient.setQueryData(["sections", courseId], (old = []) => [
        ...(Array.isArray(old) ? old : []),
        { ...newSection, id: "temp-id", optimistic: true },
      ]);

      return { previous };
    },

    onError: (_err, _newSection, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["sections", courseId], context.previous);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["sections", courseId] });
    },
  });
};

// -------------------- Update Section --------------------
export const useUpdateSection = (courseId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      sectionId,
      updates,
    }: {
      sectionId: string;
      updates: Partial<CourseSection>;
    }) => courseService.updateSection(courseId, sectionId, updates),

    onMutate: async ({ sectionId, updates }) => {
      await queryClient.cancelQueries({ queryKey: ["sections", courseId] });

      const previous = queryClient.getQueryData<CourseSection[]>([
        "sections",
        courseId,
      ]);

      queryClient.setQueryData(
        ["sections", courseId],
        (old: CourseSection[] = []) =>
          old.map((sec) =>
            sec.id === sectionId ? { ...sec, ...updates } : sec
          )
      );

      return { previous };
    },

    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["sections", courseId], context.previous);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["sections", courseId] });
    },
  });
};

// -------------------- Delete Section --------------------
export const useDeleteSection = (courseId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (sectionId: string) =>
      courseService.deleteSection(courseId, sectionId),

    onMutate: async (sectionId) => {
      await queryClient.cancelQueries({ queryKey: ["sections", courseId] });

      const previous = queryClient.getQueryData<CourseSection[]>([
        "sections",
        courseId,
      ]);

      queryClient.setQueryData(
        ["sections", courseId],
        (old: CourseSection[] = []) => old.filter((sec) => sec.id !== sectionId)
      );

      return { previous };
    },

    onError: (_err, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["sections", courseId], context.previous);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["sections", courseId] });
    },
  });
};

/** ================================= Course Chapters ======================================= */

// -------------------- Fetch Chapters for a Section --------------------
export const useChapters = (courseId: string, sectionId: string) => {
  return useQuery<Chapter[]>({
    // ✅ Fixed: Chapter[] not Chapter
    queryKey: ["chapters", courseId, sectionId], // ✅ Unique key
    queryFn: async () => {
      console.log("🔍 useChapters fetching for:", { courseId, sectionId });
      const response = await courseService.getChapters(courseId, sectionId);
      console.log("📦 useChapters response:", response);
      return response.data ?? [];
    },
    enabled: !!courseId && !!sectionId,
  });
};

// -------------------- Fetch Chapter by ID --------------------
// export const useChapter = (
//   courseId: string,
//   sectionId: string,
//   chapterId: string
// ) => {
//   return useQuery<Chapter>({
//     queryKey: ["chapter", courseId, sectionId, chapterId],
//     queryFn: () => courseService.getChapter(courseId, sectionId, chapterId),
//     enabled: !!courseId && !!sectionId && !!chapterId,
//     staleTime: 4 * 60 * 1000,
//   });
// };

// -------------------- Create Chapter --------------------
export const useCreateChapter = (courseId: string, sectionId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<Chapter>) =>
      courseService.addChapter(courseId, sectionId, data),

    onMutate: async (newChapter) => {
      await queryClient.cancelQueries({
        queryKey: ["chapters", courseId, sectionId],
      });

      const previous = queryClient.getQueryData<Chapter[]>([
        "chapters",
        courseId,
        sectionId,
      ]);

      queryClient.setQueryData(
        ["chapters", courseId, sectionId],
        (old = []) => [
          ...(Array.isArray(old) ? old : []),
          { ...newChapter, id: "temp-id", optimistic: true },
        ]
      );

      return { previous };
    },

    onError: (_err, _newChapter, context) => {
      if (context?.previous) {
        queryClient.setQueryData(
          ["chapters", courseId, sectionId],
          context.previous
        );
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["chapters", courseId, sectionId],
      });
    },
  });
};

// -------------------- Update Chapter --------------------
export const useUpdateChapter = (courseId: string, sectionId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      chapterId,
      updates,
    }: {
      chapterId: string;
      updates: Partial<CourseChapter>;
    }) => courseService.updateChapter(courseId, sectionId, chapterId, updates),

    onMutate: async ({ chapterId, updates }) => {
      await queryClient.cancelQueries({
        queryKey: ["chapters", courseId, sectionId],
      });

      const previous = queryClient.getQueryData<Chapter[]>([
        "chapters",
        courseId,
        sectionId,
      ]);

      queryClient.setQueryData(
        ["chapters", courseId, sectionId],
        (old: Chapter[] = []) =>
          old.map((ch) => (ch.id === chapterId ? { ...ch, ...updates } : ch))
      );

      return { previous };
    },

    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(
          ["chapters", courseId, sectionId],
          context.previous
        );
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["chapters", courseId, sectionId],
      });
    },
  });
};

// -------------------- Delete Chapter --------------------
export const useDeleteChapter = (courseId: string, sectionId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (chapterId: string) =>
      courseService.deleteChapter(courseId, sectionId, chapterId),

    onMutate: async (chapterId) => {
      await queryClient.cancelQueries({
        queryKey: ["chapters", courseId, sectionId],
      });

      const previous = queryClient.getQueryData<Chapter[]>([
        "chapters",
        courseId,
        sectionId,
      ]);

      queryClient.setQueryData(
        ["chapters", courseId, sectionId],
        (old: Chapter[] = []) => old.filter((ch) => ch.id !== chapterId)
      );

      return { previous };
    },

    onError: (_err, _chapterId, context) => {
      if (context?.previous) {
        queryClient.setQueryData(
          ["chapters", courseId, sectionId],
          context.previous
        );
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["chapters", courseId, sectionId],
      });
    },
  });
};

/** ================================= Course Reviews ======================================= */
// Course reviews
export const useCourseReviews = (courseId: string) =>
  useQuery({
    queryKey: ["courseReviews", courseId],
    queryFn: () => courseService.getCourseReviews(courseId),
    enabled: !!courseId,
  });
