import { db } from "@/lib/db";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req): Promise<any> {
        try {
          const user = await db.user.findFirst({
            where: {
              email: credentials?.email,
            },
          });

          if (!user) {
            throw new Error("No user found with this email");
          }

          if (!user.isEmailVerified) {
            throw new Error("Please verify your account first");
          }

          const isPasswordCorrect = await bcrypt.compare(
            credentials?.password!,
            user.password
          );

          if (isPasswordCorrect) {
            return user;
          } else {
            throw new Error("Incorrect Password");
          }
        } catch (err: any) {
          throw new Error(err);
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.isEmailVerfied = token.isEmailVerified;
        session.user.isAcceptingMessages = token.isAcceptingMessages;
        session.user.username = token.username;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id?.toString();
      }
      return token;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.JWT_SECRET!,
};
