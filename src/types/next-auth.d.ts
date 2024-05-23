import 'next-auth';

declare module 'next-auth' {
    interface User {
        id: string;
        email: string;
        isEmailVerfied?: boolean;
        isAcceptingMessages?: boolean;
        username?: string;
    }
    interface Session {
        user: {
            id: string;
            isEmailVerified?: boolean;
            isAcceptionMessages?: boolean;
            username?: string;
        } & DefaultSession['user']
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        user: {
            id: string;
            isEmailVerified?: boolean;
            isAcceptionMessages?: boolean;
            username?: string;
        } & DefaultSession['user']
    } 
}