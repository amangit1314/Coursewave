import { prisma } from "../../config/prisma";
import { AppError } from "../../core/middleware/errorHandler";

export interface ProjectData {
  title: string;
  description: string;
  courseId: string;
  thumbnailUrl?: string;
  deadline?: Date;
  maxSubmissions?: number;
  status?: string;
  difficulty?: string;
  isPublic?: boolean;
  startDate?: Date;
  endDate?: Date;
  categories?: string[];
  tags?: string[];
  prerequisites?: string[];
  technologies?: string[];
  learningOutcomes?: string[];
  resources?: string[];
}

export const getAllProjects = async () => {
  return prisma.project.findMany({
    include: {
      instructor: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              about: true,
            },
          },
        },
      },
      submissions: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const submitProject = async (
  projectId: string,
  userId: string,
  submissionUrl: string
) => {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { courseId: true, maxSubmissions: true },
  });

  if (!project) {
    throw new AppError("Project not found", 404);
  }

  const enrollment = await prisma.enrollment.findFirst({
    where: {
      userId,
      courseId: project.courseId,
      status: "ACTIVE",
    },
  });

  if (!enrollment) {
    throw new AppError("You are not enrolled in the course for this project", 403);
  }

  if (project.maxSubmissions) {
    const submissionCount = await prisma.projectSubmission.count({
      where: {
        projectId,
        studentId: userId,
      },
    });

    if (submissionCount >= project.maxSubmissions) {
      throw new AppError(
        `Maximum submissions (${project.maxSubmissions}) reached for this project`,
        400
      );
    }
  }

  const existingSubmission = await prisma.projectSubmission.findUnique({
    where: {
      projectId_studentId: {
        projectId,
        studentId: userId,
      },
    },
  });

  if (existingSubmission) {
    return prisma.projectSubmission.update({
      where: {
        id: existingSubmission.id,
      },
      data: {
        submissionUrl,
        submittedAt: new Date(),
      },
    });
  }

  return prisma.projectSubmission.create({
    data: {
      projectId,
      studentId: userId,
      submissionUrl,
    },
  });
};

export const getProjectSubmissions = async (projectId: string, userId: string) => {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
  });

  if (!project) {
    throw new AppError("Project not found", 404);
  }

  const enrollment = await prisma.enrollment.findFirst({
    where: {
      userId,
      courseId: project.courseId,
      status: "ACTIVE",
    },
  });

  if (!enrollment) {
    throw new AppError("You are not enrolled in the course for this project", 403);
  }

  return prisma.projectSubmission.findMany({
    where: {
      projectId,
      studentId: userId,
    },
    include: {
      feedback: true,
      student: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: {
      submittedAt: "desc",
    },
  });
};

export const getSubmissionFeedback = async (
  projectId: string,
  submissionId: string,
  userId: string
) => {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
  });

  if (!project) {
    throw new AppError("Project not found", 404);
  }

  const enrollment = await prisma.enrollment.findFirst({
    where: {
      userId,
      courseId: project.courseId,
      status: "ACTIVE",
    },
  });

  if (!enrollment) {
    throw new AppError("You are not enrolled in the course for this project", 403);
  }

  const feedback = await prisma.projectFeedback.findFirst({
    where: {
      submission: {
        id: submissionId,
        projectId: projectId,
        studentId: userId,
      },
    },
    include: {
      instructor: {
        include: {
          user: {
            select: { id: true, name: true, email: true },
          },
        },
      },
    },
  });

  if (!feedback) {
    throw new AppError("Feedback not found for this submission", 404);
  }

  return feedback;
};

export const giveSubmissionFeedback = async (
  instructorId: string,
  submissionId: string,
  feedbackText: string
) => {
  const submission = await prisma.projectSubmission.findUnique({
    where: { id: submissionId },
    include: {
      project: true,
      feedback: true,
    },
  });

  if (!submission) {
    throw new AppError("Submission not found", 404);
  }

  if (submission.project.instructorId !== instructorId) {
    throw new AppError(
      "You are not authorized to give feedback on this submission",
      403
    );
  }

  const include = {
    instructor: {
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    },
  };

  if (submission.feedback) {
    return prisma.projectFeedback.update({
      where: { id: submission.feedback.id },
      data: {
        feedbackText,
        updatedAt: new Date(),
      },
      include,
    });
  }

  return prisma.projectFeedback.create({
    data: {
      submissionId,
      instructorId,
      feedbackText,
    },
    include,
  });
};

export const getProjectById = async (projectId: string) => {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      course: true,
      instructor: true,
      submissions: true,
    },
  });

  if (!project) {
    throw new AppError("Project not found", 404);
  }

  return project;
};

export const createProject = async (userId: string, projectData: ProjectData) => {
  const {
    title,
    description,
    courseId,
    thumbnailUrl,
    deadline,
    maxSubmissions,
    status,
    difficulty,
    isPublic,
    startDate,
    endDate,
    categories,
    tags,
    prerequisites,
    technologies,
    learningOutcomes,
    resources,
  } = projectData;

  return prisma.project.create({
    data: {
      title,
      description,
      courseId,
      instructorId: userId,
      thumbnailUrl,
      deadline,
      maxSubmissions,
      status: status as "DRAFT" | "PUBLISHED" | "ARCHIVED" | undefined,
      difficulty: difficulty as
        | "BEGINNER"
        | "INTERMEDIATE"
        | "ADVANCED"
        | null
        | undefined,
      isPublic,
      startDate,
      endDate,
      categories,
      tags,
      prerequisites,
      technologies,
      learningOutcomes,
      resources,
    },
    include: {
      course: true,
      instructor: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
    },
  });
};

export const updateProject = async (
  projectId: string,
  userId: string,
  projectData: Partial<ProjectData>
) => {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
  });

  if (!project) {
    throw new AppError("Project not found", 404);
  }

  if (project.instructorId !== userId) {
    throw new AppError("You do not own this project", 403);
  }

  const updateData: any = {};
  const fields = [
    "title",
    "description",
    "thumbnailUrl",
    "deadline",
    "maxSubmissions",
    "status",
    "difficulty",
    "isPublic",
    "startDate",
    "endDate",
    "categories",
    "tags",
    "prerequisites",
    "technologies",
    "learningOutcomes",
    "resources",
  ];

  fields.forEach((field) => {
    if (projectData[field as keyof ProjectData] !== undefined) {
      updateData[field] = projectData[field as keyof ProjectData];
    }
  });

  return prisma.project.update({
    where: { id: projectId },
    data: updateData,
    include: {
      course: true,
      instructor: true,
    },
  });
};

export const deleteProject = async (projectId: string, userId: string) => {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
  });

  if (!project) {
    throw new AppError("Project not found", 404);
  }

  if (project.instructorId !== userId) {
    throw new AppError("You do not own this project", 403);
  }

  await prisma.project.delete({
    where: { id: projectId },
  });

  return null;
};
