import { apiManager, ApiResponse } from "../api-manager";
import { BlogArticle } from "@/types/blog-api-response";
import { Course } from "@/types/course"; // Assuming Course type exists

export interface AuthorProfile {
    id: string;
    slug: string;
    name: string;
    about: string | null;
    profileImageUrl: string | null;
    authoredBlogs: {
        id: string;
        slug: string;
        title: string;
        coverImage: string | null;
        excerpt: string | null;
        publishedAt: string;
    }[];
    instructorProfile: {
        bio: string | null;
        expertise: string | null;
        courses: {
            id: string;
            slug: string;
            title: string;
            imageUrl: string | null;
        }[];
    } | null;
    _count?: {
        followedBy: number;
        following: number;
    };
}

class AuthorService {
    private static instance: AuthorService;
    private api = apiManager;

    private constructor() { }

    public static getInstance(): AuthorService {
        if (!AuthorService.instance) {
            AuthorService.instance = new AuthorService();
        }
        return AuthorService.instance;
    }

    async getAuthorById(authorId: string): Promise<ApiResponse<AuthorProfile>> {
        return this.api.get<AuthorProfile>(`/authors/${authorId}`);
    }

    async getAuthorArticles(authorId: string): Promise<ApiResponse<BlogArticle[]>> {
        return this.api.get<BlogArticle[]>(`/authors/${authorId}/articles`);
    }

    async getAuthorCourses(authorId: string): Promise<ApiResponse<any[]>> { // Replace any with Course type if available
        return this.api.get<any[]>(`/authors/${authorId}/courses`);
    }
}

export const authorService = AuthorService.getInstance();
