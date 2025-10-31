export const STRING_MESSAGES = {
  // Page titles and headers
  PAGE_TITLE: "Reset Your Password",
  SUCCESS_TITLE: "Password Reset Success!",

  // Descriptions and subtitles
  EMAIL_DESCRIPTION:
    "Enter your email address and we'll send you a link to reset your password.",
  SUCCESS_DESCRIPTION:
    "Your password has been successfully reset. You can now log in with your new password.",
  RESET_CODE_DESCRIPTION: "Enter the 6-digit code sent to {email}",
  CODE_SENT_SUCCESS: "Password reset code sent to your email!",

  // Form labels and placeholders
  EMAIL_LABEL: "Email address",
  EMAIL_PLACEHOLDER: "Enter your email address",
  EMAIL_DESCRIPTION_TEXT: "We'll send a reset code to this email address",
  RESET_CODE_LABEL: "Reset Code",
  RESET_CODE_PLACEHOLDER: "000000",
  NEW_PASSWORD_LABEL: "New Password",
  NEW_PASSWORD_PLACEHOLDER: "Enter new password",
  CONFIRM_PASSWORD_LABEL: "Confirm New Password",
  CONFIRM_PASSWORD_PLACEHOLDER: "Confirm new password",

  // Button texts
  SEND_RESET_LINK: "Send Reset Link",
  RESET_PASSWORD: "Reset Password",
  RESEND_CODE: "Resend Code",
  CONTINUE_TO_LOGIN: "Continue to Login",
  BACK_TO_HOME: "Back to Home",
  BACK_TO_LOGIN: "Back to login",
  BACK_TO_EMAIL: "Back to email input",

  // Success messages
  PASSWORD_RESET_SUCCESS: "Your password has been successfully reset!",
  NEW_CODE_SENT: "New reset code sent!",

  // Error messages
  FILL_ALL_FIELDS: "Please fill in all fields",
  PASSWORDS_NOT_MATCH: "Passwords do not match",
  PASSWORD_TOO_SHORT: "Password must be at least 8 characters long",

  // Validation messages
  INVALID_EMAIL: "Please enter a valid email address",

  // Support text
  NEED_HELP: "Need help?",
  CONTACT_SUPPORT: "Contact Support",

  // Loading states
  LOADING: "Loading...",

  // API error messages
  FORGOT_PASSWORD_FAILED: "Failed to send reset email",
  RESET_PASSWORD_FAILED: "Failed to reset password",
} as const;
