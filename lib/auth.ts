import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./prisma";
import bcrypt from "bcryptjs";
import { authConfig } from "../auth.config";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        console.log("Authorize called with email:", credentials?.email);
        
        if (!credentials?.email || !credentials?.password) {
          console.log("Missing email or password in credentials");
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string }
        });

        if (!user) {
          console.log("User not found for email:", credentials.email);
          return null;
        }
        
        if (!user.passwordHash) {
          console.log("User has no password hash (OAuth user?)");
          return null;
        }

        if (!user.emailVerified) {
          console.log("User email not verified");
          throw new Error("Please verify your email before logging in.");
        }

        const isValidPassword = await bcrypt.compare(
          credentials.password as string,
          user.passwordHash
        );

        if (!isValidPassword) {
          console.log("Invalid password provided");
          return null;
        }

        console.log("Login successful for user:", user.id);
        return user;
      }
    })
  ]
});

export async function getAuthenticatedUser() {
  const session = await auth();

  if (!session?.user?.id) return null;

  return {
    id: session.user.id as string,
    role: session.user.role as string,
  };
}
