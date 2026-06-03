"use server";

import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { Role } from "@/lib/rbac";
import { z } from "zod";

const updateRoleSchema = z.object({
  newRole: z.enum(["SUPER_ADMIN", "BLOG_CREATOR", "PUBLIC_VIEWER"]),
});

export async function updateUserRole(userId: string, newRole: string) {
  const currentUser = await getAuthenticatedUser();

  if (!currentUser || currentUser.role !== "SUPER_ADMIN") {
    return { success: false, error: "Forbidden: Super Admin access required" };
  }

  if (currentUser.id === userId) {
    return { success: false, error: "You cannot modify your own role to prevent lockout." };
  }

  const validation = updateRoleSchema.safeParse({ newRole });

  if (!validation.success) {
    return { success: false, error: "Invalid role provided." };
  }

  try {
    const targetUser = await prisma.user.findUnique({ where: { id: userId } });
    if (!targetUser) {
      return { success: false, error: "User not found." };
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role: newRole as Role },
    });

    revalidatePath("/admin/users");
    
    return { 
      success: true, 
      user: {
        id: updatedUser.id,
        username: updatedUser.username,
        email: updatedUser.email,
        role: updatedUser.role
      } 
    };
  } catch (error) {
    console.error("Error updating user role:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}
