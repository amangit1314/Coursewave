import { prisma } from "../../config/prisma";

type NotificationType =
  | "enrollment"
  | "course_complete"
  | "review"
  | "payment"
  | "welcome"
  | "new_chapter"
  | "project_feedback"
  | "system";

interface CreateNotificationParams {
  userId: string;
  role?: "user" | "instructor";
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
  data?: Record<string, unknown>;
}

/**
 * Create an in-app notification for a user.
 * Runs in the background — does not throw or block the caller.
 */
export async function notify(params: CreateNotificationParams) {
  try {
    await prisma.notification.create({
      data: {
        userId: params.userId,
        role: params.role || "user",
        type: params.type,
        title: params.title,
        message: params.message,
        link: params.link,
        data: params.data || undefined,
        channel: "in-app",
        status: "sent",
      },
    });
  } catch {
    // Silently fail — notifications should never block the main flow
  }
}

/**
 * Notify on successful enrollment (free or paid)
 */
export function notifyEnrollment(userId: string, courseTitle: string, courseId: string) {
  return notify({
    userId,
    type: "enrollment",
    title: "Enrolled Successfully",
    message: `You've been enrolled in "${courseTitle}". Start learning now!`,
    link: `/learnings/${courseId}`,
    data: { courseId },
  });
}

/**
 * Notify on course completion
 */
export function notifyCourseComplete(userId: string, courseTitle: string, courseId: string) {
  return notify({
    userId,
    type: "course_complete",
    title: "Course Completed!",
    message: `Congratulations! You've completed "${courseTitle}".`,
    link: `/courses/${courseId}/certificate`,
    data: { courseId },
  });
}

/**
 * Notify instructor when they get a new review
 */
export function notifyNewReview(
  instructorUserId: string,
  courseTitle: string,
  courseId: string,
  rating: number
) {
  return notify({
    userId: instructorUserId,
    role: "instructor",
    type: "review",
    title: "New Course Review",
    message: `Your course "${courseTitle}" received a ${rating}-star review.`,
    link: `/instructor/courses/${courseId}`,
    data: { courseId, rating },
  });
}

/**
 * Notify on successful payment
 */
export function notifyPayment(userId: string, courseTitle: string, amount: number) {
  return notify({
    userId,
    type: "payment",
    title: "Payment Confirmed",
    message: `Your payment of $${amount.toFixed(2)} for "${courseTitle}" was successful.`,
  });
}

/**
 * Notify instructor when a student enrolls in their course
 */
export function notifyInstructorNewStudent(
  instructorUserId: string,
  courseTitle: string,
  studentName: string,
  courseId: string
) {
  return notify({
    userId: instructorUserId,
    role: "instructor",
    type: "enrollment",
    title: "New Student Enrolled",
    message: `${studentName} enrolled in your course "${courseTitle}".`,
    link: `/instructor/courses/${courseId}`,
    data: { courseId },
  });
}

/**
 * Notify on project feedback received
 */
export function notifyProjectFeedback(
  userId: string,
  projectTitle: string,
  projectId: string
) {
  return notify({
    userId,
    type: "project_feedback",
    title: "Project Feedback Received",
    message: `Your submission for "${projectTitle}" has been reviewed.`,
    link: `/projects/${projectId}`,
    data: { projectId },
  });
}
