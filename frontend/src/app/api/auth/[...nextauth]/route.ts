import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (!account || !user.email) return false;

      try {
        // Call our backend to create/login the user
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5002/api";
        const res = await fetch(`${apiUrl}/auth/oauth`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            provider: account.provider,
            providerAccountId: account.providerAccountId,
            email: user.email,
            name: user.name,
            image: user.image,
            accessToken: account.access_token,
            refreshToken: account.refresh_token,
            expiresAt: account.expires_at,
          }),
        });

        if (!res.ok) return false;

        const data = await res.json();
        // Attach our backend tokens to the user object for the jwt callback
        (user as any).backendAccessToken = data.data?.accessToken;
        (user as any).backendRefreshToken = data.data?.refreshToken;
        (user as any).backendUser = data.data?.user;

        return true;
      } catch {
        return false;
      }
    },
    async jwt({ token, user }) {
      // On first sign in, attach backend tokens
      if (user) {
        token.backendAccessToken = (user as any).backendAccessToken;
        token.backendRefreshToken = (user as any).backendRefreshToken;
        token.backendUser = (user as any).backendUser;
      }
      return token;
    },
    async session({ session, token }) {
      // Expose backend tokens to the client
      (session as any).backendAccessToken = token.backendAccessToken;
      (session as any).backendRefreshToken = token.backendRefreshToken;
      (session as any).backendUser = token.backendUser;
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
});

export { handler as GET, handler as POST };
