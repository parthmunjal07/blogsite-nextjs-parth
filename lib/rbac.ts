import { auth } from "./auth";
import { redirect } from "next/navigation";

export type Role = "SUPER_ADMIN" | "BLOG_CREATOR" | "PUBLIC_VIEWER";

const ROLE_HIERARCHY: Record<Role, number> = {
  SUPER_ADMIN: 3,
  BLOG_CREATOR: 2,
  PUBLIC_VIEWER: 1,
};

export function hasRole(userRole: Role | undefined | null, requiredRole: Role): boolean {
  if (!userRole) return false;
  const userLevel = ROLE_HIERARCHY[userRole] || 0;
  const requiredLevel = ROLE_HIERARCHY[requiredRole];
  return userLevel >= requiredLevel;
}

export async function requireRole(requiredRole: Role) {
  const session = await auth();
  
  if (!session?.user) {
    redirect("/login");
  }

  if (!hasRole(session.user.role as Role, requiredRole)) {
    // Alternatively, we could throw new Error("Unauthorized") or return a specific access denied page
    redirect("/"); 
  }

  return session.user;
}

export function isResourceOwner(userId: string | undefined, resourceOwnerId: string): boolean {
  return userId === resourceOwnerId;
}

export function canManageResource(
  userRole: Role | undefined, 
  userId: string | undefined, 
  resourceOwnerId: string
): boolean {
  if (userRole === "SUPER_ADMIN") return true;
  return isResourceOwner(userId, resourceOwnerId);
}
