import { JsonValue } from '@prisma/client/runtime/library';

export interface UserRole {
  id: string;
  userId: string;
  role: 'USER' | 'INSTRUCTOR' | 'ADMIN';
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  name: string | null;
  email: string;
  password: string;
  profileImageUrl: string | null;
  about: string | null;
  shortSummary: string | null;
  isEmailVerified: boolean | null;
  preferences: JsonValue;
  roles?: UserRole[];
  createdAt: Date | null;
  updatedAt: Date | null;
} 