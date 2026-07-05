export interface Community {
  id: string;
  title: string;
  description: string;
  noOfPeopleOnline: number;
  totalMembers: number;
  avatarUrls: string[];
  tags: string[];
  category: {
    id: string;
    name: string;
    description: string;
    createdAt: string; // ISO date string
    updatedAt: string; // ISO date string
  };
  isTrending?: boolean;
  isPopular?: boolean;
  members: {
    isOnline: boolean; // indicates if the user is online
    user: {
      id: string;
      name: string;
      profileImageUrl?: string | null; // optional, can be null
    };
    role: "ADMIN" | "MODERATOR" | "MEMBER"; // matches the backend's CommunityRole enum
    joinedAt: string; // ISO date string
  }[],
  lastActiveAt?: string; // to indicate the last activity time if just now then just now otherwise 2 min / time ago
  createdAt?: string; // ISO date string
  updatedAt?: string; // ISO date string
}


export interface CreateCommunityRequest {
  title: string;
  description?: string;
  categoryId: string;
  isPublic?: boolean;
  tags?: string[];
}

export interface UpdateCommunityRequest {
  title?: string;
  description?: string;
  categoryId?: string;
  isPublic?: boolean;
  tags?: string[];
}

export interface CommunityMember {
  userId: string;
  role: "ADMIN" | "MODERATOR" | "MEMBER";
  joinedAt: string;
  isOnline: boolean;
  user: {
    id: string;
    name: string | null;
    profileImageUrl: string | null;
  };
}
