import { EMAIL_CONFIG } from "../emailConfig";

export const EMAIL_TEMPLATES = {
  WELCOME: (
    userName: string,
    verificationToken: string,
    csrfToken: string
  ) => ({
    subject: "Welcome to Coursewave! Please verify your email",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Coursewave</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          .logo { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">🎓 Coursewave</div>
            <h1>Welcome to Coursewave!</h1>
          </div>
          <div class="content">
            <h2>Hi ${userName},</h2>
            <p>Welcome to Coursewave! We're excited to have you join our learning community.</p>
            <p>To get started, please verify your email address by clicking the button below:</p>
            
            <div style="text-align: center;">
              <a href="${EMAIL_CONFIG.FRONTEND_URL}/verify-email?token=${verificationToken}&csrf=${csrfToken}" class="button">
                Verify Email Address
              </a>
            </div>
            
            <p><strong>Important Security Note:</strong> This verification link includes a CSRF token for your protection. The link will expire in 24 hours.</p>
            
            <p>If you didn't create an account with Coursewave, you can safely ignore this email.</p>
            
            <p>Best regards,<br>The Coursewave Team</p>
          </div>
          <div class="footer">
            <p>© 2024 Coursewave. All rights reserved.</p>
            <p>This email was sent to you because you signed up for Coursewave.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  }),

  PASSWORD_RESET: (
    userName: string,
    resetToken: string,
    csrfToken: string
  ) => ({
    subject: "Reset your Coursewave password",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Your Password - Coursewave</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          .logo { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
          .warning { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">🎓 Coursewave</div>
            <h1>Reset Your Password</h1>
          </div>
          <div class="content">
            <h2>Hi ${userName},</h2>
            <p>We received a request to reset your password for your Coursewave account.</p>
            
            <div style="text-align: center;">
              <a href="${EMAIL_CONFIG.FRONTEND_URL}/reset-password?token=${resetToken}&csrf=${csrfToken}" class="button">
                Reset Password
              </a>
            </div>
            
            <div class="warning">
              <strong>Security Notice:</strong>
              <ul>
                <li>This link will expire in 1 hour</li>
                <li>If you didn't request this password reset, please ignore this email</li>
                <li>For your security, all active sessions will be logged out after password reset</li>
              </ul>
            </div>
            
            <p>If the button doesn't work, copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #666;">
              ${EMAIL_CONFIG.FRONTEND_URL}/reset-password?token=${resetToken}&csrf=${csrfToken}
            </p>
            
            <p>Best regards,<br>The Coursewave Team</p>
          </div>
          <div class="footer">
            <p>© 2024 Coursewave. All rights reserved.</p>
            <p>This email was sent to you because you requested a password reset.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  }),

  EMAIL_VERIFICATION: (
    userName: string,
    verificationToken: string,
    csrfToken: string
  ) => ({
    subject: "Verify your email address - Coursewave",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Your Email - Coursewave</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          .logo { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">🎓 Coursewave</div>
            <h1>Verify Your Email</h1>
          </div>
          <div class="content">
            <h2>Hi ${userName},</h2>
            <p>Please verify your email address to complete your Coursewave account setup.</p>
            
            <div style="text-align: center;">
              <a href="${EMAIL_CONFIG.FRONTEND_URL}/verify-email?token=${verificationToken}&csrf=${csrfToken}" class="button">
                Verify Email Address
              </a>
            </div>
            
            <p><strong>Security Note:</strong> This verification link includes a CSRF token and will expire in 24 hours.</p>
            
            <p>If you didn't create an account with Coursewave, you can safely ignore this email.</p>
            
            <p>Best regards,<br>The Coursewave Team</p>
          </div>
          <div class="footer">
            <p>© 2024 Coursewave. All rights reserved.</p>
            <p>This email was sent to you because you signed up for Coursewave.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  }),

  COURSE_ENROLLMENT: (
    userName: string,
    courseName: string,
    courseUrl: string
  ) => ({
    subject: `Welcome to ${courseName} - Coursewave`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Course Enrollment - Coursewave</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          .logo { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">🎓 Coursewave</div>
            <h1>Welcome to ${courseName}!</h1>
          </div>
          <div class="content">
            <h2>Hi ${userName},</h2>
            <p>Congratulations! You've successfully enrolled in <strong>${courseName}</strong>.</p>
            
            <div style="text-align: center;">
              <a href="${courseUrl}" class="button">
                Start Learning
              </a>
            </div>
            
            <p>Your learning journey begins now! Here's what you can do:</p>
            <ul>
              <li>Access your course materials anytime</li>
              <li>Track your progress</li>
              <li>Interact with instructors and fellow students</li>
              <li>Complete assignments and assessments</li>
            </ul>
            
            <p>Happy learning!<br>The Coursewave Team</p>
          </div>
          <div class="footer">
            <p>© 2024 Coursewave. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  }),
};
