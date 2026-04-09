import { JsonValue } from '@prisma/client/runtime/library';
import { Role } from '@prisma/client';

export interface UserRole {
  id: string;
  userId: string;
  role: Role;
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

// Narrow payload for authenticated request context. Roles are populated
// once by verifyToken so downstream middleware/services never need to
// re-query the database.
export interface UserPayload {
  id: string;
  email: string;
  name: string | null;
  roles: Role[];
}