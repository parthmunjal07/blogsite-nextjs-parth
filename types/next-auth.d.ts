import NextAuth, { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

type Role = "SUPER_ADMIN" | "BLOG_CREATOR" | "PUBLIC_VIEWER";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: Role;
    } & DefaultSession["user"];
  }

  interface User {
    role: Role;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: Role;
  }
}
