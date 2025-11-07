import TokenService from "./tokenService";
import CSRFService from "./csrfService";
import { EMAIL_TEMPLATES } from "../../config/constants/emailTemplates";
import { EMAIL_CONFIG } from "../../config/emailConfig";
import sgMail from "@sendgrid/mail";

sgMail.setApiKey(EMAIL_CONFIG.SENDGRID_API_KEY);

class EmailService {
  static async sendWelcomeEmail(
    userId: string,
    userEmail: string,
    userName: string
  ): Promise<boolean> {
    try {
      const verificationToken = await TokenService.generateVerificationToken(
        userId
      );
      const csrfToken = await CSRFService.createCSRFToken(
        userId,
        "EMAIL_VERIFICATION"
      );

      const template = EMAIL_TEMPLATES.WELCOME(
        userName,
        verificationToken,
        csrfToken
      );

      await sgMail.send({
        to: userEmail,
        from: {
          email: EMAIL_CONFIG.FROM_EMAIL,
          name: EMAIL_CONFIG.FROM_NAME,
        },
        subject: template.subject,
        html: template.html,
      });

      console.log(`Welcome email sent to ${userEmail}`);
      return true;
    } catch (error) {
      console.error("Error sending welcome email:", error);
      return false;
    }
  }

  static async sendPasswordResetEmail(
    userId: string,
    userEmail: string,
    userName: string
  ): Promise<boolean> {
    try {
      const resetToken = await TokenService.generatePasswordResetToken(userId);
      const csrfToken = await CSRFService.createCSRFToken(
        userId,
        "PASSWORD_RESET"
      );

      const template = EMAIL_TEMPLATES.PASSWORD_RESET(
        userName,
        resetToken,
        csrfToken
      );

      await sgMail.send({
        to: userEmail,
        from: {
          email: EMAIL_CONFIG.FROM_EMAIL,
          name: EMAIL_CONFIG.FROM_NAME,
        },
        subject: template.subject,
        html: template.html,
      });

      console.log(`Password reset email sent to ${userEmail}`);
      return true;
    } catch (error) {
      console.error("Error sending password reset email:", error);
      return false;
    }
  }

  static async sendEmailVerification(
    userId: string,
    userEmail: string,
    userName: string
  ): Promise<boolean> {
    try {
      const verificationToken = await TokenService.generateVerificationToken(
        userId
      );
      const csrfToken = await CSRFService.createCSRFToken(
        userId,
        "EMAIL_VERIFICATION"
      );

      const template = EMAIL_TEMPLATES.EMAIL_VERIFICATION(
        userName,
        verificationToken,
        csrfToken
      );

      await sgMail.send({
        to: userEmail,
        from: {
          email: EMAIL_CONFIG.FROM_EMAIL,
          name: EMAIL_CONFIG.FROM_NAME,
        },
        subject: template.subject,
        html: template.html,
      });

      console.log(`Email verification sent to ${userEmail}`);
      return true;
    } catch (error) {
      console.error("Error sending email verification:", error);
      return false;
    }
  }

  static async sendCourseEnrollmentEmail(
    userId: string,
    userEmail: string,
    userName: string,
    courseName: string,
    courseId: string
  ): Promise<boolean> {
    try {
      const courseUrl = `${EMAIL_CONFIG.FRONTEND_URL}/courses/${courseId}`;
      const template = EMAIL_TEMPLATES.COURSE_ENROLLMENT(
        userName,
        courseName,
        courseUrl
      );

      await sgMail.send({
        to: userEmail,
        from: {
          email: EMAIL_CONFIG.FROM_EMAIL,
          name: EMAIL_CONFIG.FROM_NAME,
        },
        subject: template.subject,
        html: template.html,
      });

      console.log(`Course enrollment email sent to ${userEmail}`);
      return true;
    } catch (error) {
      console.error("Error sending course enrollment email:", error);
      return false;
    }
  }

  static async testEmailConfiguration(): Promise<boolean> {
    try {
      await sgMail.send({
        to: EMAIL_CONFIG.FROM_EMAIL,
        from: {
          email: EMAIL_CONFIG.FROM_EMAIL,
          name: EMAIL_CONFIG.FROM_NAME,
        },
        subject: "Test SendGrid configuration",
        html: "<p>This is a test email to verify SendGrid configuration.</p>",
      });

      console.log("SendGrid email configuration is valid");
      return true;
    } catch (error) {
      console.error("SendGrid email configuration error:", error);
      return false;
    }
  }
}

export { EMAIL_TEMPLATES };
export default EmailService;
