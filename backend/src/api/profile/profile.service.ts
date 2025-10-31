import { Role } from "@prisma/client";
import { prisma } from "../../config/prisma";
// profileService.ts
import nodemailer from "nodemailer";

export interface ServiceResponse {
  success: boolean;
  data?: any;
  message: string;
  status: number;
  error?: string;
}

export const getAllUsers = async (): Promise<ServiceResponse> => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        profileImageUrl: true,
        about: true,
        createdAt: true,
        updatedAt: true,
        roles: {
          select: {
            role: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return {
      success: true,
      data: users,
      message: "Users fetched successfully",
      status: 200,
    };
  } catch (error: any) {
    console.log("ERROR in getAllUsers:", error.message);
    return {
      success: false,
      error: error.message,
      message: "Failed to fetch users",
      status: 500,
    };
  }
};

export const getUserById = async (userId: string): Promise<ServiceResponse> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        profileImageUrl: true,
        about: true,
        createdAt: true,
        updatedAt: true,
        roles: {
          select: {
            role: true,
          },
        },
        enrollments: {
          include: {
            course: {
              select: {
                id: true,
                title: true,
                description: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      return {
        success: false,
        message: "User not found",
        status: 404,
      };
    }

    return {
      success: true,
      data: user,
      message: "User fetched successfully",
      status: 200,
    };
  } catch (error: any) {
    console.log("ERROR in getUserById:", error.message);
    return {
      success: false,
      error: error.message,
      message: "Failed to fetch user",
      status: 500,
    };
  }
};

export const updateUser = async (
  userId: string,
  userData: any
): Promise<ServiceResponse> => {
  try {
    const { name, email, profileImageUrl, about } = userData;

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return {
        success: false,
        message: "User not found",
        status: 404,
      };
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        email,
        profileImageUrl,
        about,
      },
      select: {
        id: true,
        name: true,
        email: true,
        profileImageUrl: true,
        about: true,
        updatedAt: true,
      },
    });

    return {
      success: true,
      data: updatedUser,
      message: "User updated successfully",
      status: 200,
    };
  } catch (error: any) {
    console.log("ERROR in updateUser:", error.message);
    return {
      success: false,
      error: error.message,
      message: "Failed to update user",
      status: 500,
    };
  }
};

export const deleteUser = async (userId: string): Promise<ServiceResponse> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return {
        success: false,
        message: "User not found",
        status: 404,
      };
    }

    await prisma.user.delete({
      where: { id: userId },
    });

    return {
      success: true,
      message: "User deleted successfully",
      status: 200,
    };
  } catch (error: any) {
    console.log("ERROR in deleteUser:", error.message);
    return {
      success: false,
      error: error.message,
      message: "Failed to delete user",
      status: 500,
    };
  }
};

export const changeUserRole = async (
  userId: string,
  role: string
): Promise<ServiceResponse> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return {
        success: false,
        message: "User not found",
        status: 404,
      };
    }

    // Remove existing roles and add new role
    await prisma.userRole.deleteMany({
      where: { userId },
    });

    await prisma.userRole.create({
      data: {
        userId,
        role: role.toUpperCase() as Role,
      },
    });

    return {
      success: true,
      message: `User role changed to ${role} successfully`,
      status: 200,
    };
  } catch (error: any) {
    console.log("ERROR in changeUserRole:", error.message);
    return {
      success: false,
      error: error.message,
      message: "Failed to change user role",
      status: 500,
    };
  }
};

export const getUserStats = async (): Promise<ServiceResponse> => {
  try {
    const totalUsers = await prisma.user.count();
    const totalInstructors = await prisma.userRole.count({
      where: { role: "INSTRUCTOR" },
    });
    const totalStudents = await prisma.userRole.count({
      where: { role: "USER" },
    });
    const recentUsers = await prisma.user.count({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
        },
      },
    });

    return {
      success: true,
      data: {
        totalUsers,
        totalInstructors,
        totalStudents,
        recentUsers,
      },
      message: "User statistics fetched successfully",
      status: 200,
    };
  } catch (error: any) {
    console.log("ERROR in getUserStats:", error.message);
    return {
      success: false,
      error: error.message,
      message: "Failed to fetch user statistics",
      status: 500,
    };
  }
};

export interface ContactSupportData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export const contactSupport = async (
  data: ContactSupportData
): Promise<ServiceResponse> => {
  try {
    const { firstName, lastName, email, phone, subject, message } = data;

    // Validate required fields
    if (!firstName || !lastName || !email || !subject || !message) {
      return {
        success: false,
        message: "All required fields must be provided",
        status: 400,
      };
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        success: false,
        message: "Please provide a valid email address",
        status: 400,
      };
    }

    // Create email transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Email content for CourseWave support team
    const supportEmailContent = {
      from: process.env.SMTP_FROM_EMAIL || "noreply@coursewave.com",
      to: process.env.SUPPORT_EMAIL || "support@coursewave.com",
      subject: `Support Request: ${subject}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
                .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; }
                .field { margin-bottom: 15px; }
                .label { font-weight: bold; color: #667eea; }
                .message-box { background: white; padding: 15px; border-left: 4px solid #667eea; margin: 15px 0; }
                .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>New Support Request</h1>
                </div>
                <div class="content">
                    <div class="field">
                        <span class="label">From:</span> ${firstName} ${lastName}
                    </div>
                    <div class="field">
                        <span class="label">Email:</span> ${email}
                    </div>
                    ${
                      phone
                        ? `
                    <div class="field">
                        <span class="label">Phone:</span> ${phone}
                    </div>
                    `
                        : ""
                    }
                    <div class="field">
                        <span class="label">Subject:</span> ${subject}
                    </div>
                    <div class="field">
                        <span class="label">Message:</span>
                        <div class="message-box">${message.replace(
                          /\n/g,
                          "<br>"
                        )}</div>
                    </div>
                    <div class="footer">
                        <p>This email was sent from the CourseWave contact support form.</p>
                        <p>Received at: ${new Date().toLocaleString()}</p>
                    </div>
                </div>
            </div>
        </body>
        </html>
      `,
    };

    // Optional: Send confirmation email to the user
    const userConfirmationEmail = {
      from: process.env.SMTP_FROM_EMAIL || "noreply@coursewave.com",
      to: email,
      subject: "We've Received Your Support Request - CourseWave",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
                .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; }
                .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Support Request Received</h1>
                </div>
                <div class="content">
                    <p>Dear ${firstName},</p>
                    <p>Thank you for contacting CourseWave support. We have received your message and our team will get back to you as soon as possible.</p>
                    
                    <div style="background: white; padding: 15px; margin: 15px 0; border-left: 4px solid #667eea;">
                        <strong>Subject:</strong> ${subject}<br>
                        <strong>Message:</strong><br>
                        ${message.substring(0, 200)}${
        message.length > 200 ? "..." : ""
      }
                    </div>

                    <p><strong>What happens next?</strong></p>
                    <ul>
                        <li>Our support team will review your request</li>
                        <li>You'll receive a response within 24-48 hours</li>
                        <li>We'll work to resolve your issue promptly</li>
                    </ul>

                    <p>If you need immediate assistance, please don't hesitate to contact us directly at support@coursewave.com.</p>
                    
                    <p>Best regards,<br>The CourseWave Team</p>
                </div>
                <div class="footer">
                    <p>This is an automated confirmation email. Please do not reply to this message.</p>
                </div>
            </div>
        </body>
        </html>
      `,
    };

    // Send emails
    await transporter.sendMail(supportEmailContent);

    // Send confirmation email to user (optional - you can remove this if not needed)
    await transporter.sendMail(userConfirmationEmail);

    return {
      success: true,
      message:
        "Support request submitted successfully. We'll get back to you soon!",
      status: 200,
    };
  } catch (error: any) {
    console.error("Error in contactSupport service:", error);

    return {
      success: false,
      error: error.message,
      message: "Failed to submit support request. Please try again later.",
      status: 500,
    };
  }
};
