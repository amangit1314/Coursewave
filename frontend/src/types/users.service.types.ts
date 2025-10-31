// ==================================================== USER SERVICE =====================================================

export interface UpdateProfileRequest {
  newUserName?: string;
  newProfileImage?: string;
  
}

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

export interface BecomeInstructorRequest {
  userId: string;
}
