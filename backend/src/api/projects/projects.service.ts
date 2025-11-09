import { prisma } from "../../config/prisma";

export interface ServiceResponse {
  success: boolean;
  data?: any;
  message: string;
  status: number;
  error?: string;
}

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

export const getAllProjects = async (): Promise<ServiceResponse> => {
  try {
    const projects = await prisma.project.findMany({
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

    return {
      success: true,
      data: projects,
      message: "Projects fetched successfully",
      status: 200,
    };
  } catch (error: any) {
    console.log("ERROR in getAllProjects:", error.message);
    return {
      success: false,
      error: error.message,
      message: "Failed to fetch projects",
      status: 500,
    };
  }
};

export const submitProject = async (
  projectId: string,
  userId: string,
  submissionUrl: string
): Promise<ServiceResponse> => {
  try {
    // 1. Fetch the project and its course id
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: { courseId: true, maxSubmissions: true },
    });

    if (!project) {
      return {
        success: false,
        message: "Project not found",
        status: 404,
      };
    }

    // 2. Check if user is enrolled in the course
    const enrollment = await prisma.enrollment.findFirst({
      where: {
        userId,
        courseId: project.courseId,
        status: "ACTIVE",
      },
    });

    if (!enrollment) {
      return {
        success: false,
        message: "You are not enrolled in the course for this project",
        status: 403,
      };
    }

    // 3. Check number of previous submissions (if maxSubmissions set)
    if (project.maxSubmissions) {
      const submissionCount = await prisma.projectSubmission.count({
        where: {
          projectId,
          studentId: userId,
        },
      });

      if (submissionCount >= project.maxSubmissions) {
        return {
          success: false,
          message: `Maximum submissions (${project.maxSubmissions}) reached for this project`,
          status: 400,
        };
      }
    }

    // 4. Create or update submission (upsert)
    const existingSubmission = await prisma.projectSubmission.findUnique({
      where: {
        projectId_studentId: {
          projectId,
          studentId: userId,
        },
      },
    });

    let submission;
    if (existingSubmission) {
      // Update existing submission's URL and updatedAt
      submission = await prisma.projectSubmission.update({
        where: {
          id: existingSubmission.id,
        },
        data: {
          submissionUrl,
          submittedAt: new Date(),
        },
      });
    } else {
      // Create new submission
      submission = await prisma.projectSubmission.create({
        data: {
          projectId,
          studentId: userId,
          submissionUrl,
        },
      });
    }

    return {
      success: true,
      data: submission,
      message: "Project submitted successfully",
      status: 201,
    };
  } catch (error: any) {
    console.error("ERROR in submitProject:", error.message);
    return {
      success: false,
      error: error.message,
      message: "Failed to submit project",
      status: 500,
    };
  }
};

export const getProjectSubmissions = async (
  projectId: string,
  userId: string
): Promise<ServiceResponse> => {
  try {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      return {
        success: false,
        message: "Project not found",
        status: 404,
      };
    }

    const enrollment = await prisma.enrollment.findFirst({
      where: {
        userId,
        courseId: project.courseId,
        status: "ACTIVE",
      },
    });

    if (!enrollment) {
      return {
        success: false,
        message: "You are not enrolled in the course for this project",
        status: 403,
      };
    }

    const submissions = await prisma.projectSubmission.findMany({
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

    return {
      success: true,
      data: submissions,
      message: "Project submissions fetched successfully",
      status: 200,
    };
  } catch (error: any) {
    console.log("ERROR in getProjectSubmissions:", error.message);
    return {
      success: false,
      error: error.message,
      message: "Failed to fetch project submissions",
      status: 500,
    };
  }
};

export const getSubmissionFeedback = async (
  projectId: string,
  submissionId: string,
  userId: string
): Promise<ServiceResponse> => {
  try {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      return {
        success: false,
        message: "Project not found",
        status: 404,
      };
    }

    const enrollment = await prisma.enrollment.findFirst({
      where: {
        userId,
        courseId: project.courseId,
        status: "ACTIVE",
      },
    });

    if (!enrollment) {
      return {
        success: false,
        message: "You are not enrolled in the course for this project",
        status: 403,
      };
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
      return {
        success: false,
        message: "Feedback not found for this submission",
        status: 404,
      };
    }

    return {
      success: true,
      data: feedback,
      message: "Submission feedback fetched successfully",
      status: 200,
    };
  } catch (error: any) {
    console.log("ERROR in getSubmissionFeedback:", error.message);
    return {
      success: false,
      error: error.message,
      message: "Failed to fetch submission feedback",
      status: 500,
    };
  }
};

export const giveSubmissionFeedback = async (
  instructorId: string,
  submissionId: string,
  feedbackText: string
): Promise<ServiceResponse> => {
  try {
    // 1. Fetch the submission along with project and instructor info
    const submission = await prisma.projectSubmission.findUnique({
      where: { id: submissionId },
      include: {
        project: true,
        feedback: true,
      },
    });

    if (!submission) {
      return {
        success: false,
        message: "Submission not found",
        status: 404,
      };
    }

    // 2. Verify that the instructor owns the project
    if (submission.project.instructorId !== instructorId) {
      return {
        success: false,
        message: "You are not authorized to give feedback on this submission",
        status: 403,
      };
    }

    // 3. If feedback already exists, update it; otherwise create new feedback
    let feedback;
    if (submission.feedback) {
      feedback = await prisma.projectFeedback.update({
        where: { id: submission.feedback.id },
        data: {
          feedbackText,
          updatedAt: new Date(),
        },
        include: {
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
    } else {
      feedback = await prisma.projectFeedback.create({
        data: {
          submissionId,
          instructorId,
          feedbackText,
        },
        include: {
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
    }

    return {
      success: true,
      data: feedback,
      message: "Feedback submitted successfully",
      status: 201,
    };
  } catch (error: any) {
    console.error("ERROR in giveSubmissionFeedback:", error.message);
    return {
      success: false,
      error: error.message,
      message: "Failed to submit feedback",
      status: 500,
    };
  }
};

export const getProjectById = async (
  projectId: string
): Promise<ServiceResponse> => {
  try {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        course: true,
        instructor: true,
        submissions: true,
      },
    });

    if (!project) {
      return {
        success: false,
        message: "Project not found",
        status: 404,
      };
    }

    return {
      success: true,
      data: project,
      message: "Project fetched successfully",
      status: 200,
    };
  } catch (error: any) {
    console.log("ERROR in getProjectById:", error.message);
    return {
      success: false,
      error: error.message,
      message: "Failed to fetch project",
      status: 500,
    };
  }
};

export const createProject = async (
  userId: string,
  projectData: ProjectData
): Promise<ServiceResponse> => {
  try {
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

    const newProject = await prisma.project.create({
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

    return {
      success: true,
      data: newProject,
      message: "Project created successfully",
      status: 201,
    };
  } catch (error: any) {
    console.log("ERROR in createProject:", error.message);
    return {
      success: false,
      error: error.message,
      message: "Failed to create project",
      status: 500,
    };
  }
};

export const updateProject = async (
  projectId: string,
  userId: string,
  projectData: Partial<ProjectData>
): Promise<ServiceResponse> => {
  try {
    // Check if project exists and user owns it
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      return {
        success: false,
        message: "Project not found",
        status: 404,
      };
    }

    if (project.instructorId !== userId) {
      return {
        success: false,
        message: "You do not own this project",
        status: 403,
      };
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

    const updatedProject = await prisma.project.update({
      where: { id: projectId },
      data: updateData,
      include: {
        course: true,
        instructor: true,
      },
    });

    return {
      success: true,
      data: updatedProject,
      message: "Project updated successfully",
      status: 200,
    };
  } catch (error: any) {
    console.log("ERROR in updateProject:", error.message);
    return {
      success: false,
      error: error.message,
      message: "Failed to update project",
      status: 500,
    };
  }
};

export const deleteProject = async (
  projectId: string,
  userId: string
): Promise<ServiceResponse> => {
  try {
    // Check if project exists and user owns it
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      return {
        success: false,
        message: "Project not found",
        status: 404,
      };
    }

    if (project.instructorId !== userId) {
      return {
        success: false,
        message: "You do not own this project",
        status: 403,
      };
    }

    await prisma.project.delete({
      where: { id: projectId },
    });

    return {
      success: true,
      message: "Project deleted successfully",
      status: 200,
    };
  } catch (error: any) {
    console.log("ERROR in deleteProject:", error.message);
    return {
      success: false,
      error: error.message,
      message: "Failed to delete project",
      status: 500,
    };
  }
};
