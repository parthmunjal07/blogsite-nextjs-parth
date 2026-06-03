import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isAdminRoute = nextUrl.pathname.startsWith('/admin');
      
      if (isAdminRoute) {
        if (isLoggedIn) return true;
        return false; // Redirect to login
      }
      
      return true;
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.sub = user.id as string;
        token.role = user.role;
        console.log("[JWT] Setting token from user:", { sub: token.sub, role: token.role });
      }
      // Useful if you need to update session role dynamically
      if (trigger === "update" && session?.role) {
        token.role = session.role;
      }
      console.log("[JWT] Returning token:", { sub: token.sub, role: token.role });
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.sub as string;
        session.user.role = token.role;
      }
      console.log("[SESSION] Returning session:", { id: session?.user?.id, role: session?.user?.role });
      return session;
    }
  },
  providers: [],
} satisfies NextAuthConfig;
