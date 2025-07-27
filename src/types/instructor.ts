export type Instructor = {
    id: string;
    userId: string;
    bio: string | null;
    expertise: string[];
    websiteUrl: string | null;
    createdAt: string;
    updatedAt: string;
    user: User;
}

type User = {
    id: string;
    name: string | null;
    email: string;
    profileImageUrl: string | null;
    about: string | null;
    shortSummary: string | null;
}