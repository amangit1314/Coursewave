export type Instructor = {
    id: string;
    userId: string;
    bio?: string;
    expertise: string[];
    socialLinks: string[];
    createdAt?: Date;
    updatedAt?: Date;
    user: User[];
}

type User = {
    id: string;
    name: string;
    email: string;
    image?: string;
}