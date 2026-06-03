"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { profileSchema } from "@/lib/validations";

export async function updateProfile(prevState: any, formData: FormData) {
  const session = await auth();

  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized. Please log in." };
  }

  const validation = profileSchema.safeParse({
    username: formData.get("username"),
    bio: formData.get("bio"),
    avatarUrl: formData.get("avatarUrl"),
  });

  if (!validation.success) {
    return { 
      success: false, 
      errors: validation.error.flatten().fieldErrors,
      error: "Validation failed. Please check the fields."
    };
  }

  const { username, bio, avatarUrl } = validation.data;

  try {
    // Check if username is taken by someone else
    const existingUser = await prisma.user.findUnique({ where: { username } });
    if (existingUser && existingUser.id !== session.user.id) {
      return { success: false, error: "This username is already taken." };
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        username: username.trim(),
        bio: bio?.trim() || null,
        avatarUrl: avatarUrl?.trim() || null,
      },
    });

    revalidatePath(`/profile/${updatedUser.username}`);
    
    // If the username changed, the old profile path needs revalidation too, 
    // but Next.js ISR might just 404 the old one. We'll revalidate the new one.
    
    return { success: true, message: "Profile updated successfully." };
  } catch (error) {
    console.error("Error updating profile:", error);
    return { success: false, error: "An error occurred while updating your profile." };
  }
}
